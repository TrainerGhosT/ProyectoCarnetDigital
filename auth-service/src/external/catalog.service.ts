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

  async getEstadoBloqueado() {
  try {
    // Obtener todos los estados
    const response = await firstValueFrom(
      this.httpService.get(`${this.catalogServiceUrl}/estados`),
    );

    // Buscar el estado con nombre "bloqueado"
    const estadoBloqueado = response.data.find(
      (estado) => estado.nombre.toLowerCase() === 'bloqueado'
    );

    if (!estadoBloqueado) {
      throw new HttpException(
        'Estado bloqueado no encontrado en el catálogo',
        HttpStatus.NOT_FOUND,
      );
    }
    console.log('estadoBloqueado', estadoBloqueado);

    return estadoBloqueado.idEstado;
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      'Error al consultar el servicio de catálogo',
      HttpStatus.BAD_GATEWAY,
    );
  }
}
}