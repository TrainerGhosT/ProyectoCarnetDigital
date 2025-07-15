import { Module } from '@nestjs/common';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {}
