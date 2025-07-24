import { Injectable, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CrearBitacoraDto } from './dto/crear-bitacora.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BitacoraService {
  private readonly logger = new Logger(BitacoraService.name);
  private readonly userServiceUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
  }

  async Crear(bitacora: CrearBitacoraDto) {
    const bitacoraData = await firstValueFrom(
      this.httpService.post(`${this.userServiceUrl}/bitacora`, bitacora),
    );

    return bitacoraData.data;
  }

  async ObtenerTodos() {
    const bitacoraData = await firstValueFrom(
      this.httpService.get(`${this.userServiceUrl}/bitacora`),
    );

    return bitacoraData.data;
  }
}
