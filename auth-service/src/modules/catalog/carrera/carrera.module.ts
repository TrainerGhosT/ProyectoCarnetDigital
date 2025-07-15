import { Module } from '@nestjs/common';
import { CarreraService } from './carrera.service';
import { CarreraController } from './carrera.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
      HttpModule,
      ConfigModule
    ],
  controllers: [CarreraController],
  providers: [CarreraService],
  exports: [CarreraService]
})
export class CarreraModule {}