import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';

import { jwtConfig } from './config/jwt.config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AreaModule } from './modules/catalog/area/area.module';
import { CarreraModule } from './modules/catalog/carrera/carrera.module';
import { EstadoModule } from './modules/catalog/estado/estado.module';
import { TiposIdentificacionModule } from './modules/catalog/tipo-identificacion/tipo-identificacion.module';
import { TiposUsuarioModule } from './modules/catalog/tipo-usuario/tipo-usuario.module';
import { BitacoraModule } from './modules/bitacora/bitacora.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfig),
    HttpModule,
    AuthModule,
    UserModule,
    AreaModule,
    CarreraModule,
    EstadoModule,
    TiposIdentificacionModule,
    TiposUsuarioModule,
    BitacoraModule
  ],
})
export class AppModule {}
