import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>(
      'AUTH_SERVICE_URL',
      'http://localhost:3001',
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    Logger.log('token', token.toString());

    if (!token) {
      throw new UnauthorizedException('Token de acceso requerido');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/validate`,  {
          headers: { token },
        }),
      );

      if (response.status === 200 && response.data === true) {
        this.logger.log('Token válido', {
          token,
          userId: response.data.userId,
        });
        return true;
      }

      throw new UnauthorizedException('Token inválido');
    } catch (error) {
      this.logger.error('Error validando token con auth-service', error);
      throw new UnauthorizedException('Error validando token de acceso');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
