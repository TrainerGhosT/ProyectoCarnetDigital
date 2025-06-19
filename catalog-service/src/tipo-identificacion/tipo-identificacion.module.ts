import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TiposIdentificacionController } from './tipo-identificacion.controller';
import { TiposIdentificacionService } from './tipo-identificacion.service';
import { PrismaService } from 'src/shared/services/prisma.service';


@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [TiposIdentificacionController],
  providers: [TiposIdentificacionService, PrismaService],
  exports: [TiposIdentificacionService],
})
export class TiposIdentificacionModule {}