import { Injectable, HttpStatus, HttpException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CrearTipoUsuarioDto } from './dto/crear-tipo-usuario.dto';
import { ActualizarTipoUsuarioDto } from './dto/actualizar-tipo-usuario.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TiposUsuarioService {
  private readonly catalogServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogServiceUrl = this.configService.get<string>(
      'CATALOG_SERVICE_URL',
    );
  }

  async create(dto: CrearTipoUsuarioDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/tiposusuario`, dto),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al crear tipo de usurio',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/tiposusuario`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al obtener tipos de usurio',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/tiposusuario/${id}`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al obtener tipo de usurio',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, dto: ActualizarTipoUsuarioDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(
          `${this.catalogServiceUrl}/tiposusuario/${id}`,
          dto,
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al actualizar tipo de usurio',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.catalogServiceUrl}/tiposusuario/${id}`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data || 'Error al eliminar tipo de usurio',
        error.response.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
