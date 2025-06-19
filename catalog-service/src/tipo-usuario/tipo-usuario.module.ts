import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TiposUsuarioController } from './tipo-usuario.controller';
import { TiposUsuarioService } from './tipo-usuario.service';
import { PrismaService } from 'src/shared/services/prisma.service';



@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [TiposUsuarioController],
  providers: [TiposUsuarioService, PrismaService],
  exports: [TiposUsuarioService],
})
export class TiposUsuarioModule {}