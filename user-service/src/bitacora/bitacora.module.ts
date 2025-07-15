import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma.module';


import { PrismaService } from 'src/common/prisma.service';
import { BitacoraController } from './bitacora.controller';
import { BitacoraService } from './bitacora.service';


@Module({
  imports: [
    HttpModule.register({
      timeout: 9000,
      maxRedirects: 5,
    }),
    PrismaModule,
  ],
  controllers: [BitacoraController],
  providers: [
    BitacoraService,
    PrismaService,
  ],
  exports: [BitacoraService],
})
export class BitacoraModule {}
