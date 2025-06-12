import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET') || 'secret-key-carnet-digital',
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '5m',
    },
  }),
  inject: [ConfigService],
};