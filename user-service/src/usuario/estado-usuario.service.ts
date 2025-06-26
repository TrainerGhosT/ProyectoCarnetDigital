import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/prisma.service';
import { CambiarEstadoUsuarioDto } from './dto/estado-usuario.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EstadoUsuarioService {
  private readonly logger = new Logger(EstadoUsuarioService.name);
  private readonly catalogServiceUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogServiceUrl = this.configService.get<string>(
      'CATALOG_SERVICE_URL',
      'http://localhost:3002',
    );
  }

  async cambiarEstadoUsuario(id: string, dto: CambiarEstadoUsuarioDto) {
    try {
      // validar usuaurio existente

      const usuario = await this.obtenerUsuario(id);

      // validar estado existente en catalog-service
      await this.obtenerEstado(dto);

      // Actualizar estado
      const usuarioActualizado = await this.prisma.usuarios.update({
        where: { idUsuario: id },
        data: { estadoUsuario: dto.codigoEstado },
      });

      return {
        usuarioId: usuarioActualizado.idUsuario,
        estadoAnterior: usuario.estadoUsuario,
        estadoActual: usuarioActualizado.estadoUsuario,
        mensaje: 'Estado actualizado correctamente',
      };
    } catch (error) {
      const errormsg = 'error al cambiar estado de usuario';
      this.logger.error(errormsg, error);

      throw new HttpException(errormsg, HttpStatus.BAD_REQUEST);
    }
  }

  // obtener usuario con prisma

  async obtenerUsuario(id) {
    const queryUsuario = await this.prisma.usuarios.findUnique({
      where: { idUsuario: id },
      select: { idUsuario: true, estadoUsuario: true },
    });

    if (!queryUsuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return queryUsuario;
  }

  // obtener estado de catalog service

  async obtenerEstado(dto: CambiarEstadoUsuarioDto) {
    try {
      await firstValueFrom(
        this.httpService.get(
          `${this.catalogServiceUrl}/estados/${dto.codigoEstado}`,
        ),
      );
    } catch (error) {
      throw new HttpException('Estado no encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
