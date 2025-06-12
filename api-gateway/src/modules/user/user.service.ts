import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UsuarioDto, UsuarioFiltrosDto } from '../../interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly userServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
  }

  async createUser(usuario: UsuarioDto, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.userServiceUrl}/usuario`, usuario, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al crear usuario',
        error.response?.status || 500
      );
    }
  }

  async updateUser(id: string, usuario: UsuarioDto, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.userServiceUrl}/usuario/${id}`, usuario, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al actualizar usuario',
        error.response?.status || 500
      );
    }
  }

  async deleteUser(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.userServiceUrl}/usuario/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al eliminar usuario',
        error.response?.status || 500
      );
    }
  }

  async getAllUsers(authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/usuario`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener usuarios',
        error.response?.status || 500
      );
    }
  }

  async getUsersFiltered(filters: UsuarioFiltrosDto, authHeader: string) {
    try {
      const queryParams = new URLSearchParams();
      if (filters.identificacion) queryParams.append('identificacion', filters.identificacion);
      if (filters.nombre) queryParams.append('nombre', filters.nombre);
      if (filters.tipo) queryParams.append('tipo', filters.tipo);

      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/usuario/filter?${queryParams.toString()}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al filtrar usuarios',
        error.response?.status || 500
      );
    }
  }

  async getUserById(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/usuario/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener usuario',
        error.response?.status || 500
      );
    }
  }

  async updatePhoto(data: { usuarioId: string; fotografia: string }, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.userServiceUrl}/usuario/fotografia`, data, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al actualizar fotografía',
        error.response?.status || 500
      );
    }
  }

  async deletePhoto(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.userServiceUrl}/usuario/fotografia/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al eliminar fotografía',
        error.response?.status || 500
      );
    }
  }

  async getPhoto(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/usuario/fotografia/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener fotografía',
        error.response?.status || 500
      );
    }
  }

  async getQR(identificacion: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/usuario/qr/${identificacion}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al generar QR',
        error.response?.status || 500
      );
    }
  }
}