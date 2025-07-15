import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { QrModule } from './qr/qr.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PrismaModule } from 'src/prisma.module';
import { FotografiaUsuarioModule } from './fotografia/fotografia.module';
import { BitacoraModule } from './bitacora/bitacora.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    BitacoraModule,
    UsuarioModule,
    QrModule,
    FotografiaUsuarioModule,
    PrismaModule,
  ],
})
export class AppModule {}
