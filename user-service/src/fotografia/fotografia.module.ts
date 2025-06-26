import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { FotografiaUsuarioController } from './fotografia.controller';
import { FotografiaUsuarioService } from './fotografia.service';
import { PrismaService } from 'src/common/prisma.service';


@Module({
  imports: [
    HttpModule.register({
      timeout: 9000,
      maxRedirects: 5,
    }),
  ],
  controllers: [FotografiaUsuarioController],
  providers: [
    FotografiaUsuarioService,
    PrismaService,
  ],
  exports: [FotografiaUsuarioService],
})
export class FotografiaUsuarioModule {}
