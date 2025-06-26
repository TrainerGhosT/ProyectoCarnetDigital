// src/services/fotografia-usuario.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import {
  ActualizarFotografiaDto,
  FotografiaResponseDto,
  EliminarFotografiaDto,
  ObtenerFotografiaDto,
} from './dto/fotografia-usuario.dto';
import { fromBuffer } from 'file-type';


@Injectable()
export class FotografiaUsuarioService {
  private readonly logger = new Logger(FotografiaUsuarioService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Actualizar o agregar fotografía del usuario (HU SRV6)
   */
  async actualizarFotografia(
    dto: ActualizarFotografiaDto,
  ): Promise<FotografiaResponseDto> {
    // Verificar que el usuario existe
    const usuario = await this.prisma.usuarios.findUnique({
      where: { idUsuario: dto.usuarioId },
    });
    if (!usuario) {
      throw new NotFoundException(
        `Usuario con UUID ${dto.usuarioId} no encontrado`,
      );
    }

    // Normalizar + validar Base64
    const fotografiaConPrefix = await this.normalizarYValidarBase64(
      dto.fotografia,
    );

    // Crear o actualizar registro en tabla UsuarioFotografia
    const fotoRecord = await this.prisma.usuarioFotografia.upsert({
      where: { usuario: dto.usuarioId },
      update: {
        fotoBase64: fotografiaConPrefix,
        fechaSubida: new Date(),
      },
      create: {
        usuario: dto.usuarioId,
        fotoBase64: fotografiaConPrefix,
      },
    });

    this.logger.log(
      `Fotografía actualizada para usuario usuario: ${dto.usuarioId}`,
    );

    return {
      fotografia: fotoRecord.fotoBase64,
      usuarioId: usuario.idUsuario,
      fechaActualizacion: fotoRecord.fechaSubida,
    };
  }

  /**
   * Eliminar fotografía del usuario
   */
  async eliminarFotografia(
    dto: EliminarFotografiaDto,
  ): Promise<{ mensaje: string; usuarioId: string }> {
    // Verificar que existe foto para ese usuario
    const fotoRecord = await this.prisma.usuarioFotografia.findUnique({
      where: { usuario: dto.usuarioId },
    });
    if (!fotoRecord) {
      throw new NotFoundException(
        `No se encontró fotografía para el UUID ${dto.usuarioId}`,
      );
    }

    // Eliminar el registro de foto
    await this.prisma.usuarioFotografia.delete({
      where: { usuario: dto.usuarioId },
    });

    this.logger.log(`Fotografía eliminada para usuario UUID: ${dto.usuarioId}`);

    return {
      mensaje: 'Fotografía eliminada exitosamente',
      usuarioId: dto.usuarioId,
    };
  }

  /**
   * Obtener fotografía del usuario
   */
  async obtenerFotografia(
    dto: ObtenerFotografiaDto,
  ): Promise<FotografiaResponseDto> {
    // Buscar foto
    const fotoRecord = await this.prisma.usuarioFotografia.findUnique({
      where: { usuario: dto.usuarioId },
    });
    if (!fotoRecord) {
      throw new NotFoundException(
        `El usuario UUID ${dto.usuarioId} no tiene fotografía registrada`,
      );
    }

    this.logger.log(`Fotografía obtenida para usuario UUID: ${dto.usuarioId}`);

    return {
      fotografia: fotoRecord.fotoBase64,
      usuarioId: dto.usuarioId,
      fechaActualizacion: fotoRecord.fechaSubida,
    };
  }

  /**
   * Valida o infiere el prefijo data:image/...;base64,
   */
  private async normalizarYValidarBase64(input: string): Promise<string> {
    let mime: string;
    let payload: string;

    // Si ya trae prefijo, lo separamos
    const match = input.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (match) {
      mime = match[1];
      payload = match[2];
    } else {
      // Se asume que input es solo Base64 puro
      payload = input;
      // Decodificamos los primeros bytes para detectar el tipo
      const buf = Buffer.from(payload, 'base64');
      const ft = await fromBuffer(buf);
      if (!ft || !ft.mime.startsWith('image/')) {
        throw new BadRequestException(
          'No se pudo inferir el tipo de imagen. Asegúrate de enviar un Base64 válido de imagen',
        );
      }
      mime = ft.mime; // p.ej. 'image/png'
    }

    // Validaciones adicionales
    if (!/^image\/(jpeg|jpg|png|webp)$/.test(mime)) {
      throw new BadRequestException(
        'Formato de imagen no permitido. Solo JPEG, PNG, WebP',
      );
    }
    if (payload.length > 1_400_000) {
      throw new BadRequestException('La fotografía no debe superar 1 MB');
    }

    // Reconstruimos siempre con el prefijo estándar
    return `data:${mime};base64,${payload}`;
  }
}
