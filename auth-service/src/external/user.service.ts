import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UserFromService } from '../auth/interfaces/user.interface';

@Injectable()
export class ExternalUserService {
  private readonly userServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL') || 'http://localhost:3003';
  }

  async findUserByEmail(email: string): Promise<UserFromService> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/usuario/email/${email}`)
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al consultar el servicio de usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async validateUserCredentials(email: string, password: string): Promise<UserFromService> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.userServiceUrl}/usuario/validate`, {
          correo: email,
          contrasena: password
        })
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        'Error al validar credenciales',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}