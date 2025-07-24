import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BitacoraController } from './bitacora.controller';
import { BitacoraService } from './bitacora.service';


@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  controllers: [BitacoraController],
  providers: [BitacoraService],
  exports: [BitacoraService],
})
export class BitacoraModule {}
