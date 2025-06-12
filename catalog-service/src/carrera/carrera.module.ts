import { Module } from '@nestjs/common';
import { CarreraService } from './carrera.service';
import { CarreraController } from './carrera.controller';
import { PrismaService } from '../shared/services/prisma.service';

@Module({
  controllers: [CarreraController],
  providers: [CarreraService, PrismaService],
  exports: [CarreraService]
})
export class CarreraModule {}