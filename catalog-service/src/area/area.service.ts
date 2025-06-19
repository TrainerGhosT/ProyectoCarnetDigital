import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { ApiResponse } from '../shared/interfaces/api-response.interface';
import { Area } from './entities/area.entity';

@Injectable()
export class AreaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAreaDto): Promise<ApiResponse<Area>> {
    const area = await this.prisma.areas.create({ data: dto });
    return {
      
      message: 'Área registrada correctamente',
      data: area
    };
  }

  async findAll(): Promise<ApiResponse<Area[]>> {
    const areas = await this.prisma.areas.findMany({ orderBy: { nombre: 'asc' } });
    return {
      
      message: 'Lista de áreas',
      data: areas,
      total: areas.length
    };
  }

  async findOne(id: number): Promise<ApiResponse<Area>> {
    const area = await this.prisma.areas.findUnique({ where: { idArea: id } });
    if (!area) throw new NotFoundException('Área no encontrada');
    return {
      
      message: 'Área encontrada',
      data: area
    };
  }

  async update(id: number, dto: UpdateAreaDto): Promise<ApiResponse<Area>> {
    const area = await this.prisma.areas.findUnique({ where: { idArea: id } });
    if (!area) throw new NotFoundException('Área no encontrada');
    const updated = await this.prisma.areas.update({ where: { idArea: id }, data: dto });
    return {
      
      message: 'Área actualizada correctamente',
      data: updated
    };
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    const area = await this.prisma.areas.findUnique({ where: { idArea: id } });
    if (!area) throw new NotFoundException('Área no encontrada');
    await this.prisma.areas.delete({ where: { idArea: id } });
    return {
      
      message: 'Área eliminada correctamente'
    };
  }
}
