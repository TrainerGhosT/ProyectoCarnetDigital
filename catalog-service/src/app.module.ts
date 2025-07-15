import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { CarreraModule } from './carrera/carrera.module';
import { AreaModule } from './area/area.module'
import { TiposUsuarioModule } from './tipo-usuario/tipo-usuario.module';
import { TiposIdentificacionModule } from './tipo-identificacion/tipo-identificacion.module';
import { EstadoModule } from './estado/estado.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    AreaModule,
    CarreraModule,
    EstadoModule,
    TiposUsuarioModule,
    TiposIdentificacionModule,
  ],
})
export class AppModule {}