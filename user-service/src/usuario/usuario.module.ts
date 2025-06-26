import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma.module';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { PrismaService } from 'src/common/prisma.service';
import { EstadoUsuarioService } from './estado-usuario.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 9000,
      maxRedirects: 5,
    }),
    PrismaModule,
  ],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    EstadoUsuarioService,
    JwtAuthGuard,
    PrismaService,
  ],
  exports: [UsuarioService, EstadoUsuarioService],
})
export class UsuarioModule {}
