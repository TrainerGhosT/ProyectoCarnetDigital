import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExternalCatalogService {
  private readonly catalogServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogServiceUrl = this.configService.get<string>('CATALOG_SERVICE_URL') || 'http://localhost:3002';
  }

  async getTipoUsuarioById(id: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/tiposusuario/${id}`)

      );
      Logger.log('response', response.toString());
      
      return response.data
      
    } catch (error) {
      throw new HttpException(
        'Error consultando el servicio de catálogo',
        HttpStatus.BAD_GATEWAY
      );
    }
  }
}