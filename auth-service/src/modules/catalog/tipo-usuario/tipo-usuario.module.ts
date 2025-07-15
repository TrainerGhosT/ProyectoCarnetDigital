import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TiposUsuarioController } from './tipo-usuario.controller';
import { TiposUsuarioService } from './tipo-usuario.service';




@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [TiposUsuarioController],
  providers: [TiposUsuarioService],
  exports: [TiposUsuarioService],
})
export class TiposUsuarioModule {}