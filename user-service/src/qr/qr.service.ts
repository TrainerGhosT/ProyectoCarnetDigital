import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as QRCode from 'qrcode';

interface UserData {
  email: string;
  identificacion: string;
  nombreCompleto: string;
  tipoUsuario: number;
  carreras?: number[];
  areas?: number[];
}

// interface TipoUsuario {
//   id: number;
//   nombre: string;
// }

// interface Carrera {
//   id: number;
//   nombre: string;
// }

// interface Area {
//   id: number;
//   nombre: string;
// }

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
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Genera un código QR con la información del usuario
   */
  async generateUserQrCode(identificacion: string): Promise<string> {
    try {
      this.logger.log(`Generando QR para usuario con identificación: ${identificacion}`);

      // 1. Obtener datos del usuario
      const userData = await this.getUserData(identificacion);
      
      // 2. Obtener descripción del tipo de usuario
      const tipoUsuarioDesc = await this.getTipoUsuarioDescription(userData.tipoUsuario);
      
      // 3. Obtener carreras o áreas asociadas
      const carrerasOAreas = await this.getCarrerasOAreas(userData);
      
      // 4. Calcular fecha de vencimiento
      const fechaVencimiento = this.calculateExpirationDate();
      
      // 5. Crear estructura JSON para el QR
      const qrData: QrData = {
        nombreCompleto: userData.nombreCompleto,
        identificacion: userData.identificacion,
        tipoUsuario: tipoUsuarioDesc,
        carrerasOAreas,
        fechaVencimiento,
      };

      // 6. Generar código QR
      const qrCodeBase64 = await this.generateQrCode(qrData);
      
      this.logger.log(`QR generado exitosamente para usuario: ${identificacion}`);
      return qrCodeBase64;

    } catch (error) {
      this.logger.error(`Error generando QR para usuario ${identificacion}:`, error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error al generar el código QR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene los datos del usuario desde el User Service
   * TODO: Cambiar por que es innecesario ya que se puede usar prisma obtenerlo por que 
   * la entidad Qr y Usuario conviven en el mismo proyecto o servicio.
   * Hay que conectar desde http los datos que estan en otros servicios como catalog-service
   */
  private async getUserData(identificacion: string): Promise<UserData> {
    try {
      const userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
      const url = `${userServiceUrl}/usuario`;

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: { identificacion },
        }),
      );

      if (!response.data || response.data.length === 0) {
        throw new HttpException(
          'Usuario no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      // Tomar el primer usuario que coincida con la identificación
      const user = response.data.find((u: any) => u.identificacion === identificacion);
      
      if (!user) {
        throw new HttpException(
          'Usuario no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        email: user.email,
        identificacion: user.identificacion,
        nombreCompleto: user.nombreCompleto,
        tipoUsuario: user.tipoUsuario,
        carreras: user.carreras || [],
        areas: user.areas || [],
      };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error('Error obteniendo datos del usuario:', error.message);
      throw new HttpException(
        'Error al obtener datos del usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtiene la descripción del tipo de usuario desde el Catalog Service
   */
  private async getTipoUsuarioDescription(tipoUsuarioId: number): Promise<string> {
    try {
      const catalogServiceUrl = this.configService.get<string>('CATALOG_SERVICE_URL');
      const url = `${catalogServiceUrl}/tiposusuario/${tipoUsuarioId}`;

      const response = await firstValueFrom(
        this.httpService.get(url),
      );

      if (!response.data) {
        throw new HttpException(
          'Tipo de usuario no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      return response.data.nombre;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error('Error obteniendo tipo de usuario:', error.message);
      // Devolver un valor por defecto si no se puede obtener
      return 'Tipo de usuario desconocido';
    }
  }

  /**
   * Obtiene las carreras o áreas asociadas al usuario
   */
  private async getCarrerasOAreas(userData: UserData): Promise<string[]> {
    try {
      const catalogServiceUrl = this.configService.get<string>('CATALOG_SERVICE_URL');
      const result: string[] = [];

      // Si el usuario tiene carreras asociadas
      if (userData.carreras && userData.carreras.length > 0) {
        for (const carreraId of userData.carreras) {
          try {
            const url = `${catalogServiceUrl}/carreras/${carreraId}`;
            const response = await firstValueFrom(
              this.httpService.get(url),
            );
            
            if (response.data && response.data.nombre) {
              result.push(response.data.nombre);
            }
          } catch (error) {
            this.logger.warn(`Error obteniendo carrera ${carreraId}:`, error.message);
            result.push(`Carrera ID: ${carreraId}`);
          }
        }
      }

      // Si el usuario tiene áreas asociadas
      if (userData.areas && userData.areas.length > 0) {
        for (const areaId of userData.areas) {
          try {
            const url = `${catalogServiceUrl}/areas/${areaId}`;
            const response = await firstValueFrom(
              this.httpService.get(url),
            );
            
            if (response.data && response.data.nombre) {
              result.push(response.data.nombre);
            }
          } catch (error) {
            this.logger.warn(`Error obteniendo área ${areaId}:`, error.message);
            result.push(`Área ID: ${areaId}`);
          }
        }
      }

      return result.length > 0 ? result : ['Sin carreras o áreas asociadas'];

    } catch (error) {
      this.logger.error('Error obteniendo carreras o áreas:', error.message);
      return ['Error al obtener carreras/áreas'];
    }
  }

  /**
   * Calcula la fecha de vencimiento del QR
   */
  private calculateExpirationDate(): string {
    const expirationHours = this.configService.get<number>('QR_EXPIRATION_HOURS', 48);
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + expirationHours);
    
    return expirationDate.toISOString();
  }

  /**
   * Genera el código QR en base64
   */
  private async generateQrCode(data: QrData): Promise<string> {
    try {
      const qrSize = this.configService.get<number>('QR_SIZE', 200);
      const errorCorrectionLevel = this.configService.get<string>('QR_ERROR_CORRECTION_LEVEL', 'M') as any;

      const jsonData = JSON.stringify(data);
      
      const qrCodeDataUrl = await QRCode.toDataURL(jsonData, {
        errorCorrectionLevel,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: qrSize,
      });

      // Extraer solo la parte base64 (sin el prefijo data:image/png;base64,)
      const base64Data = qrCodeDataUrl.split(',')[1];
      
      return base64Data;

    } catch (error) {
      this.logger.error('Error generando código QR:', error.message);
      throw new HttpException(
        'Error al generar el código QR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}