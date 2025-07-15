import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { LoginRequest, RefreshRequest } from '../../interfaces/auth.interface';
import { LoginDto } from './dto/login.dto';
import { JwtFromRequestFunction } from 'passport-jwt';

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;
  

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
  }

  async login(loginDto: LoginDto) {
    const { correo, contrasena, tipoUsuario } = loginDto;
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}/login`,
          null, 
          {
            headers: {
              correo,
              contrasena,
              tipoUsuario,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error en el servicio de autenticación',
        error.response?.status || 500,
      );
    }
  }

  async refresh(refresh_token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/refresh`, null, {
          headers: { refresh_token },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al procesar la petición',
        error.response?.status || 500,
      );
    }
  }

  async validate(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/validate`, {
          headers: { token },
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
