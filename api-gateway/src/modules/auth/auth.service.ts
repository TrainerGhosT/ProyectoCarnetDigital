import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { LoginRequest, RefreshRequest } from '../../interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
  }

  async login(loginDto: LoginRequest) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/login`, loginDto),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error en el servicio de autenticación',
        error.response?.status || 500,
      );
    }
  }

  async refresh(refreshDto: RefreshRequest) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/refresh`, refreshDto),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al procesar la petición',
        error.response?.status || 500,
      );
    }
  }

  async validate(authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/validate`, {
          headers: { Authorization: authHeader },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Token inválido',
        error.response?.status || 401,
      );
    }
  }
}
