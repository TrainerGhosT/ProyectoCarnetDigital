import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { CrearTipoIdentificacionDto } from './dto/crear-tipo-identificacion.dto';
import { ActualizarTipoIdentificacionDto } from './dto/actualizar-tipo-identificacion.dto';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class TiposIdentificacionService {
  private readonly logger = new Logger(TiposIdentificacionService.name);
  private readonly authServiceUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl =
      this.configService.get<string>('AUTH_SERVICE_URL') ||
      'http://localhost:3001';
  }

  // Crear tipo de identificación
  async crear(dto: CrearTipoIdentificacionDto) {
    try {
      // Verificar si ya existe un tipo con el mismo nombre
      const existente = await this.prisma.tipoIdentificacion.findUnique({
        where: { nombre: dto.nombre.trim() },
      });

      if (existente) {
        throw new HttpException(
          'Ya existe un tipo de identificación con ese nombre',
          HttpStatus.CONFLICT,
        );
      }

      const nuevoTipo = await this.prisma.tipoIdentificacion.create({
        data: {
          nombre: dto.nombre.trim(),
        },
      });

      this.logger.log(
        `Tipo de identificación creado con ID: ${nuevoTipo.idTipoIdentificacion}`,
      );
      return nuevoTipo;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        'Error al crear tipo de identificación:',
        error.message,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Obtener todos los tipos de identificación
  async obtenerTodos() {
    try {
      const tipos = await this.prisma.tipoIdentificacion.findMany({
        orderBy: { nombre: 'asc' },
      });

      this.logger.log(`Se encontraron ${tipos.length} tipos de identificación`);
      return tipos;
    } catch (error) {
      this.logger.error(
        'Error al obtener tipos de identificación:',
        error.message,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Obtener tipo de identificación por ID
  async obtenerPorId(id: number) {
    try {
      const tipo = await this.prisma.tipoIdentificacion.findUnique({
        where: { idTipoIdentificacion: id },
      });

      if (!tipo) {
        throw new HttpException(
          'Tipo de identificación no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log(`Tipo de identificación encontrado: ${tipo.nombre}`);
      return tipo;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        'Error al obtener tipo de identificación:',
        error.message,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar tipo de identificación
  async actualizar(id: number, dto: ActualizarTipoIdentificacionDto) {
    try {
      // Verificar si existe el tipo a actualizar
      const tipoExistente = await this.prisma.tipoIdentificacion.findUnique({
        where: { idTipoIdentificacion: id },
      });

      if (!tipoExistente) {
        throw new HttpException(
          'Tipo de identificación no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar si ya existe otro tipo con el mismo nombre
      const nombreExistente = await this.prisma.tipoIdentificacion.findFirst({
        where: {
          nombre: dto.nombre.trim(),
          idTipoIdentificacion: { not: id },
        },
      });

      if (nombreExistente) {
        throw new HttpException(
          'Ya existe un tipo de identificación con ese nombre',
          HttpStatus.CONFLICT,
        );
      }

      const tipoActualizado = await this.prisma.tipoIdentificacion.update({
        where: { idTipoIdentificacion: id },
        data: {
          nombre: dto.nombre.trim(),
        },
      });

      this.logger.log(
        `Tipo de identificación actualizado: ${tipoActualizado.nombre}`,
      );
      return tipoActualizado;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        'Error al actualizar tipo de identificación:',
        error.message,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar tipo de identificación
  async eliminar(id: number) {
    try {
      // Verificar si existe el tipo a eliminar
      const tipoExistente = await this.prisma.tipoIdentificacion.findUnique({
        where: { idTipoIdentificacion: id },
      });

      if (!tipoExistente) {
        throw new HttpException(
          'Tipo de identificación no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.tipoIdentificacion.delete({
        where: { idTipoIdentificacion: id },
      });

      this.logger.log(
        `Tipo de identificación eliminado: ${tipoExistente.nombre}`,
      );
      return { message: 'Tipo de identificación eliminado exitosamente' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        'Error al eliminar tipo de identificación:',
        error.message,
      );
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
