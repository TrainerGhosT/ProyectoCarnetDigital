import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExternalUserService {
  private readonly userServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL') || 'http://localhost:3003';
  }

  async findUserByEmail(email: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/usuario`)
      );
      const usuarios = response.data?.data || [];
      // Busca el usuario por correo
      const user = usuarios.find((u) => u.correo === email);
      return user;
    } catch (error) {
      throw new HttpException(
        'Error consultando el servicio de usuarios',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  async updateUser(id: string, updateData: { intentos_fallidos?: number, estadoUsuario?: number }) {
  try {
    const response = await firstValueFrom(
      this.httpService.put(`${this.userServiceUrl}/usuario/${id}`, updateData),
    );
    return response.data;
  } catch (error) {
    throw new HttpException(
      error.response?.data || 'Error al actualizar usuario',
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
}