import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as QRCode from 'qrcode';
import { PrismaService } from 'src/common/prisma.service';

interface QrData {
  nombreCompleto: string;
  identificacion: string;
  tipoUsuario: string;
  carrerasOAreas: string[];
  fechaVencimiento: string;
}

@Injectable()
export class QrService {
  private readonly logger = new Logger(QrService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Genera o retorna un código QR almacenado
   */
  async generateUserQrCode(identificacion: string): Promise<string> {
    this.logger.log(`Procesando QR para identificación: ${identificacion}`);

    // 1. Obtener usuario desde Prisma
    const user = await this.prisma.usuarios.findFirst({
      where: { identificacion },
      include: { carreras: true, areas: true },
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    // 2. Buscar QR existente
    const qrExistente = await this.prisma.usuarioQr.findUnique({
      where: { usuario: user.idUsuario },
    });

    // 4. Calcular vencimiento
    const hours = this.configService.get<number>('QR_EXPIRATION_HOURS', 48);
    const now = new Date();

    // Si existe y no está vencido, retorna el base64 guardado
    if (qrExistente) {
      const fechaVenc = new Date(qrExistente.fechaVencimento);
      if (fechaVenc > now) {
        this.logger.log(
          'QR vigente encontrado en DB, retornando sin regenerar',
        );
        return qrExistente.qrBase64;
      }
    }

    // 3. Consultar descripción de tipo de usuario y detalles de carreras/áreas
    const tipoUsuarioDesc = await this.fetchTipoUsuario(user.tipoUsuario);
    const carrerasOAreas = await this.fetchCarrerasOAreas(
      user.carreras.map((c) => c.carrera),
      user.areas.map((a) => a.area),
    );

    function getLocalDate(date: Date): Date {
      // Obtiene la zona horaria local en minutos y la aplica
      const tzOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - tzOffset);
    }

    const expiration = new Date(now.getTime() + hours * 60 * 60 * 1000);
    const expirationLocale = expiration.toLocaleString();
    const expirationLocalDate = getLocalDate(expiration);

    // 5. Armar datos para QR
    const qrData: QrData = {
      nombreCompleto: user.nombreCompleto,
      identificacion: user.identificacion,
      tipoUsuario: tipoUsuarioDesc,
      carrerasOAreas,
      fechaVencimiento: expirationLocale,
    };
    const json = JSON.stringify(qrData);

    console.log('info fecha:', qrData.fechaVencimiento);
    console.log('info fecha formateada:', expirationLocale);

    // 6. Generar código QR
    const qrSize = this.configService.get<number>('QR_SIZE', 200);
    const errorCorrectionLevel = this.configService.get<string>(
      'QR_ERROR_CORRECTION_LEVEL',
      'M',
    ) as any;
    const dataUrl = await QRCode.toDataURL(json, {
      errorCorrectionLevel,
      margin: 1,
      width: qrSize,
    });
    const base64 = dataUrl.split(',')[1];

    this.logger.log('QR generado o actualizado, guardando en DB');
    try {
      await this.prisma.usuarioQr.upsert({
        where: { usuario: user.idUsuario },
        update: { qrBase64: base64, fechaVencimento: expirationLocalDate },
        create: {
          usuario: user.idUsuario,
          qrBase64: base64,
          fechaVencimento: expirationLocalDate,
        },
      });
    } catch (error) {
      this.logger.error('Error al guardar el QR en la base de datos', error);
      throw new HttpException(
        'Error interno al generar el código QR: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return base64;
  }

  private async fetchTipoUsuario(tipoUsuarioId: number): Promise<string> {
    try {
      const url = `${this.configService.get<string>('CATALOG_SERVICE_URL')}/tiposusuario/${tipoUsuarioId}`;
      const resp = await firstValueFrom(this.httpService.get(url));
      return resp.data.nombre;
    } catch {
      return 'Desconocido';
    }
  }

  private async fetchCarrerasOAreas(
    carreras: number[],
    areas: number[],
  ): Promise<string[]> {
    const list: string[] = [];
    const base = this.configService.get<string>('CATALOG_SERVICE_URL');
    for (const id of carreras) {
      try {
        const carreraData = await firstValueFrom(
          this.httpService.get(`${base}/carrera/${id}`),
        );
        list.push(carreraData.data.data.nombre);
      } catch {
        list.push(`Carrera: ${id}`);
      }
    }
    for (const id of areas) {
      try {
        const areaData = await firstValueFrom(
          this.httpService.get(`${base}/area/${id}`),
        );
        list.push(areaData.data.data.nombre);
      } catch {
        list.push(`Área: ${id}`);
      }
    }
    return list.length ? list : ['Sin asociaciones'];
  }
}
