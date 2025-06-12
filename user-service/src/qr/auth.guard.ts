import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('Token de autorización no encontrado');
      throw new UnauthorizedException('Token de autorización requerido');
    }

    try {
      const isValid = await this.validateToken(token);
      
      if (!isValid) {
        this.logger.warn('Token de autorización inválido');
        throw new UnauthorizedException('Token de autorización inválido');
      }

      return true;
    } catch (error) {
      this.logger.error('Error validando token:', error.message);
      throw new UnauthorizedException('Token de autorización inválido');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateToken(token: string): Promise<boolean> {
    try {
      const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
      const url = `${authServiceUrl}/validate`;

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: { token },
          timeout: 5000,
        }),
      );

      return response.status === 200 && response.data === true;
    } catch (error) {
      this.logger.error('Error en validación de token:', error.message);
      return false;
    }
  }
}