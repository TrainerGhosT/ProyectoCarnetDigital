import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Peticion al Auth Service para validar el token
      const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
      const response = await axios.get(`${authServiceUrl}/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200 && response.data === true) {
        return true;
      }
      
      throw new UnauthorizedException('Token inválido');
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}