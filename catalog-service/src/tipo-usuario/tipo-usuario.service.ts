import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

import { CrearTipoUsuarioDto } from './dto/crear-tipo-usuario.dto';
import { ActualizarTipoUsuarioDto } from './dto/actualizar-tipo-usuario.dto';
import { PrismaService } from 'src/shared/services/prisma.service';


@Injectable()
export class TiposUsuarioService {
  private readonly logger = new Logger(TiposUsuarioService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Crear tipo de usuario
  async crearTipoUsuario(dto: CrearTipoUsuarioDto) {
    try {
      // Verificar si ya existe un tipo con el mismo nombre
      const existente = await this.prisma.tipoUsuario.findUnique({
        where: { nombre: dto.nombre.trim() },
      });

      if (existente) {
        throw new HttpException(
          'Ya existe un tipo de usuario con ese nombre',
          HttpStatus.BAD_REQUEST,
        );
      }

      const nuevoTipo = await this.prisma.tipoUsuario.create({
        data: {
          nombre: dto.nombre.trim(),
        },
      });

      this.logger.log(
        `Tipo de usuario creado con ID: ${nuevoTipo.idTipoUsuario}`,
      );
      return nuevoTipo;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error al crear tipo de usuario:', error.message);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Obtener todos los tipos de usuario
  async obtenerTiposUsuario() {
    try {
      const tipos = await this.prisma.tipoUsuario.findMany({
        orderBy: { nombre: 'asc' },
      });

      this.logger.log(`Se encontraron ${tipos.length} tipos de usuario`);
      return tipos;
    } catch (error) {
      this.logger.error('Error al obtener tipos de usuario:', error.message);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Obtener tipo de usuario por ID
  async obtenerTipoUsuarioPorId(id: number) {
    try {
      const tipo = await this.prisma.tipoUsuario.findUnique({
        where: { idTipoUsuario: id },
      });

      if (!tipo) {
        throw new HttpException(
          'Tipo de usuario no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log(`Tipo de usuario encontrado: ${tipo.nombre}`);
      return tipo;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error al obtener tipo de usuario:', error.message);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar tipo de usuario
  async actualizarTipoUsuario(id: number, dto: ActualizarTipoUsuarioDto) {
    try {
      // Verificar si existe el tipo a actualizar
      const tipoExistente = await this.prisma.tipoUsuario.findUnique({
        where: { idTipoUsuario: id },
      });

      if (!tipoExistente) {
        throw new HttpException(
          'Tipo de usuario no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar si ya existe otro tipo con el mismo nombre
      const nombreExistente = await this.prisma.tipoUsuario.findFirst({
        where: {
          nombre: dto.nombre.trim(),
          idTipoUsuario: { not: id },
        },
      });

      if (nombreExistente) {
        throw new HttpException(
          'Ya existe un tipo de usuario con ese nombre',
          HttpStatus.CONFLICT,
        );
      }

      const tipoActualizado = await this.prisma.tipoUsuario.update({
        where: { idTipoUsuario: id },
        data: {
          nombre: dto.nombre.trim(),
        },
      });

      this.logger.log(`Tipo de usuario actualizado: ${tipoActualizado.nombre}`);
      return tipoActualizado;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error al actualizar tipo de usuario:', error.message);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar tipo de usuario
  async eliminarTipoUsuario(id: number) {
    try {
      // Verificar si existe el tipo a eliminar
      const tipoExistente = await this.prisma.tipoUsuario.findUnique({
        where: { idTipoUsuario: id },
      });

      if (!tipoExistente) {
        throw new HttpException(
          'Tipo de usuario no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.tipoUsuario.delete({
        where: { idTipoUsuario: id },
      });

      this.logger.log(`Tipo de usuario eliminado: ${tipoExistente.nombre}`);
      return { message: 'Tipo de usuario eliminado exitosamente' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error al eliminar tipo de usuario:', error.message);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
