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
      const usuario = await this.obtenerUsuario(id);

      await this.obtenerEstado(dto);

      // Obtener el estado bloqueado desde el catálogo
      const estadoBloqueado = await this.obtenerEstadoBloqueado();

      const dataActualizar: any = { estadoUsuario: dto.codigoEstado };

      // Si el usuario está bloqueado y se cambia a un estado diferente, reiniciar intentos fallidos
      if (
        usuario.estadoUsuario === estadoBloqueado &&
        dto.codigoEstado !== estadoBloqueado
      ) {
        dataActualizar.intentos_fallidos = 0;
      }

      const usuarioActualizado = await this.prisma.usuarios.update({
        where: { idUsuario: id },
        data: dataActualizar,
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

  async obtenerUsuario(id: string) {
    const queryUsuario = await this.prisma.usuarios.findUnique({
      where: { idUsuario: id },
      select: { idUsuario: true, estadoUsuario: true, intentos_fallidos: true },
    });

    if (!queryUsuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return queryUsuario;
  }

  async obtenerEstado(dto: CambiarEstadoUsuarioDto) {
    try {
      await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/estados/${dto.codigoEstado}`),
      );
    } catch (error) {
      throw new HttpException('Estado no encontrado', HttpStatus.NOT_FOUND);
    }
  }

  //  método para obtener el estado bloqueado
  async obtenerEstadoBloqueado(): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/estados`),
      );
      const estadoBloqueado = response.data.find(
        (estado) => estado.nombre.toLowerCase() === 'bloqueado',
      );
      if (!estadoBloqueado) {
        throw new HttpException(
          'Estado bloqueado no encontrado en el catálogo',
          HttpStatus.NOT_FOUND,
        );
      }
      return estadoBloqueado.idEstado;
    } catch (error) {
      throw new HttpException(
        'Error al consultar el servicio de catálogo',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
