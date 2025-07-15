import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CarreraService {
  private readonly catalogServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogServiceUrl = this.configService.get<string>(
      'CATALOG_SERVICE_URL',
    );
  }

  async create(dto: CreateCarreraDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/carrera`, dto),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al crear la carrera',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/carrera`),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al obtener carreras',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/carrera/${id}`),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al obtener carrera',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, dto: UpdateCarreraDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.catalogServiceUrl}/carrera/${id}`, dto),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al actualizar carrera',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.catalogServiceUrl}/carrera/${id}`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al eliminar carrera',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
