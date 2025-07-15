import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CrearTipoIdentificacionDto } from './dto/crear-tipo-identificacion.dto';
import { ActualizarTipoIdentificacionDto } from './dto/actualizar-tipo-identificacion.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TiposIdentificacionService {
  private readonly catalogServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogServiceUrl = this.configService.get<string>(
      'CATALOG_SERVICE_URL',
    );
  }

  async create(dto: CrearTipoIdentificacionDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.catalogServiceUrl}/tiposidentificacion`,
          dto,
        ),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al crear tipo de identificacion',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/tiposidentificacion`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al obtener tipos de identificacion',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.catalogServiceUrl}/tiposidentificacion/${id}`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al obtener tipo de identificacion',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, dto: ActualizarTipoIdentificacionDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${this.catalogServiceUrl}/tiposidentificacion/${id}`,
          dto,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al actualizar tipo de identificacion',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(
          `${this.catalogServiceUrl}/tiposidentificacion/${id}`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al eliminar tipo de identificacion',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
