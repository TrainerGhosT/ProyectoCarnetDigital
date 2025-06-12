import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TipoUsuario } from '../auth/interfaces/user.interface';

@Injectable()
export class ExternalCatalogService {
  private readonly catalogServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogServiceUrl = this.configService.get<string>('CATALOG_SERVICE_URL') || 'http://localhost:3002';
  }

  async getTipoUsuarioById(id: number): Promise<TipoUsuario> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/tiposusuario/${id}`)
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('Tipo de usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al consultar el servicio de catálogo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTipoUsuarioByName(nombre: string): Promise<TipoUsuario> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/tiposusuario/nombre/${nombre}`)
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException('Tipo de usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al consultar el servicio de catálogo',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}