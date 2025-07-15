import { Injectable, HttpException } from '@nestjs/common';

import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AreaService {
  private readonly catalogServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogServiceUrl = this.configService.get<string>(
      'CATALOG_SERVICE_URL',
    );
  }

  async create(dto: CreateAreaDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/area`, dto),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data,
        error.response.status,
      );
    }
  }

  async findAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/area`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data,
        error.response.status
      )
    }
  }

  async findOne(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/area/${id}`),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
         error.response.data || 'Error al obtener area',
        error.response.status || 400,
      );
    }
  }

  async update(id: number, dto: UpdateAreaDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.catalogServiceUrl}/area/${id}`, dto),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data,
        error.response.status
        
      );
    }
  }

  async remove(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.catalogServiceUrl}/area/${id}`),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data,
        error.response.status
      );
    }
  }
}
