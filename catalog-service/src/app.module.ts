import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CarreraModule } from './carrera/carrera.module';
import { AreaModule } from './area/area.module';
import { PrismaService } from './shared/services/prisma.service';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { RolesGuard } from './shared/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h')
        }
      }),
      inject: [ConfigService],
      global: true
    }),
    CarreraModule,
    AreaModule
  ],
  providers: [
    PrismaService,
    JwtAuthGuard,
    RolesGuard
  ],
  exports: [
    PrismaService,
    JwtAuthGuard,
    RolesGuard
  ]
})
export class AppModule {}