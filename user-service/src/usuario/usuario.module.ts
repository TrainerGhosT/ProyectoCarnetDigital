import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma.module';
import { UsuarioController } from './usuario.controller';
import { AuthGuard } from './auth.guard';
import { UsuarioService } from './usuario.service';


@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    PrismaModule,
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService, AuthGuard],
  exports: [UsuarioService],
})
export class UsuarioModule {}