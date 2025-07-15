import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TiposIdentificacionController } from './tipo-identificacion.controller';
import { TiposIdentificacionService } from './tipo-identificacion.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [TiposIdentificacionController],
  providers: [TiposIdentificacionService],
  exports: [TiposIdentificacionService],
})
export class TiposIdentificacionModule {}
