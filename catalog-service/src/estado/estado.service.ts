import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CrearEstadoDto } from './dto/crear-estado.dto';

@Injectable()
export class EstadoService {
  private readonly logger = new Logger(EstadoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // Obtener todos los estados
  async obtenerTodos() {
    try {
      const estados = await this.prisma.estados.findMany({
        orderBy: { nombre: 'asc' },
      });
      this.logger.log(`Se encontraron ${estados.length} estados`);

      if (estados.length === 0) {
        throw new HttpException(
          'No se encontraron estados',
          HttpStatus.NOT_FOUND,
        );
      }

      return estados;
    } catch (error) {
      const errormsg = error.message;
      this.logger.error('Error al obtener estados:', errormsg);
      throw new HttpException(errormsg.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  // Obtener estado por ID
  async obtenerPorId(id: number) {
    try {
      const estado = await this.prisma.estados.findUnique({
        where: { idEstado: id },
      });

      if (!estado) {
        throw new HttpException('Estado no encontrado', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`Estado encontrado: ${estado.nombre}`);
      return estado;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error al obtener estado:', error.message);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // crear estado
  async crear(dto: CrearEstadoDto) {
    try {
      // Verificar si ya existe un estado con el mismo nombre
      const existente = await this.prisma.estados.findUnique({
        where: { nombre: dto.nombre.trim() },
      });

      if (existente) {
        throw new HttpException(
          'Ya existe un estado con ese nombre',
          HttpStatus.CONFLICT,
        );
      }

      const nuevoEstado = await this.prisma.estados.create({
        data: {
          nombre: dto.nombre.trim(),
        },
      });

      this.logger.log(
        `Estado creado con id: ${nuevoEstado.idEstado} , nombre: ${nuevoEstado.nombre}`,
      );
      return nuevoEstado;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error al crear estado:', error.message);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Eliminar estado
  async eliminar(id: number) {
    try {
      // Verificar si existe el estado a eliminar
      const estadoExistente = await this.prisma.estados.findUnique({
        where: { idEstado: id },
      });

      if (!estadoExistente) {
        throw new HttpException('Estado no encontrado', HttpStatus.NOT_FOUND);
      }

      await this.prisma.estados.delete({
        where: { idEstado: id },
      });

      this.logger.log(`Estado eliminado: ${estadoExistente.nombre}`);
      return { message: 'Estado eliminado exitosamente' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Error al eliminar estado:', error.message);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
