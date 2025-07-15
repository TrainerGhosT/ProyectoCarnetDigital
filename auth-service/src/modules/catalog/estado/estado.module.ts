import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { EstadoController } from './estado.controller';
import { EstadoService } from './estado.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [EstadoController],
  providers: [EstadoService],
  exports: [EstadoService],
})
export class EstadoModule {}
