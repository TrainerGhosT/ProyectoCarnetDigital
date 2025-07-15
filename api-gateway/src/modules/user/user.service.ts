import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UsuarioDto, UsuarioFiltrosDto } from '../../interfaces/user.interface';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import {
  ActualizarFotografiaDto,
  FotografiaResponseDto,
  ObtenerFotografiaDto,
} from './dto/fotografia-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

@Injectable()
export class UserService {
  private readonly userServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
  }

  async createUser(usuario: CrearUsuarioDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.userServiceUrl}/usuario`, usuario),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al crear usuario',
        error.response?.status || 500,
      );
    }
  }

  async getUsers(filters: UsuarioFiltrosDto) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.identificacion)
        queryParams.append('identificacion', filters.identificacion);
      if (filters.nombre) queryParams.append('nombre', filters.nombre);
      if (filters.tipo) queryParams.append('tipo', filters.tipo);

      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/usuario/?${queryParams}`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al filtrar usuarios',
        error.response?.status || 500,
      );
    }
  }

  async getPhoto(dto: ObtenerFotografiaDto): Promise<FotografiaResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.userServiceUrl}/usuario/fotografia/${dto.usuarioId}`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener fotografía',
        error.response?.status || 500,
      );
    }
  }

  async getQR(identificacion: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.userServiceUrl}/usuario/qr/${identificacion}`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al generar QR',
        error.response?.status || 500,
      );
    }
  }
}
