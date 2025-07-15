import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CrearEstadoDto, UpdateEstadoDto } from './dto/crear-estado.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EstadoService {
  private readonly catalogServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogServiceUrl = this.configService.get<string>(
      'CATALOG_SERVICE_URL',
    );
  }

  async create(dto: CrearEstadoDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/estados`, dto),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al crear el estado',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/estados`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al obtener estados',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/estados/${id}`),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al obtener estado',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, dto: UpdateEstadoDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.catalogServiceUrl}/estados/${id}`, dto),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al actualizar estado',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.catalogServiceUrl}/estados/${id}`),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al eliminar estado',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
