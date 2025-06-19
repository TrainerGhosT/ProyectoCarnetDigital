import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET') || 'super-secret-jwt-development-key',
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '5m',
    },
  }),
  inject: [ConfigService],
};