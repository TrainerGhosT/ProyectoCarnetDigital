import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';

import { CambiarEstadoUsuarioDto } from './dto/estado-usuario.dto';
import { firstValueFrom } from 'rxjs';
import { ActualizarFotografiaDto } from './dto/fotografia-usuario.dto';

@Injectable()
export class UserService {
  private readonly userServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
  }

  async getUser(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/usuario/${id}`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error al consultar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(id: string, dto: ActualizarUsuarioDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.userServiceUrl}/usuario/${id}`, dto),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al actualizar Usuario',
        error.response?.status || 500,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.userServiceUrl}/usuario/${id}`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al generar QR',
        error.response?.status || 500,
      );
    }
  }

  async updatePhoto(dto: ActualizarFotografiaDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.userServiceUrl}/usuario/fotografia`, dto),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error al agregar o actualizar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePhoto(usuarioId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(
          `${this.userServiceUrl}/usuario/fotografia/${usuarioId}`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error al eliminar fotografía',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStateUser(id: string, dto: CambiarEstadoUsuarioDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${this.userServiceUrl}/usuario/estado/${id}`,
          dto,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al actualizar estado de usuario',
        error.response?.status || 500,
      );
    }
  }
}
