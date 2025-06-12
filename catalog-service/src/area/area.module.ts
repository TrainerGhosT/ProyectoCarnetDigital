import { Module } from '@nestjs/common';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';
import { PrismaService } from '../shared/services/prisma.service';

@Module({
  controllers: [AreaController],
  providers: [AreaService, PrismaService],
  exports: [AreaService]
})
export class AreaModule {}
