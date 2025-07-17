import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/services/prisma.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { ApiResponse } from '../shared/interfaces/api-response.interface';
import { Carrera } from './entities/carrera.entity';

@Injectable()
export class CarreraService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCarreraDto): Promise<ApiResponse<Carrera>> {
    const existente = await this.prisma.carreras.findFirst({
      where: {
        OR: [
          { nombre: dto.nombre },
          { email: dto.email }
        ]
      }
    });

    if (existente) {
      throw new ConflictException('Ya existe una carrera con el mismo nombre o correo');
    }

    const carrera = await this.prisma.carreras.create({ data: dto });

    return {
      success: true,
      message: 'Carrera registrada correctamente',
      data: carrera
    };
  }

  async findAll(): Promise<ApiResponse<Carrera[]>> {
    const carreras = await this.prisma.carreras.findMany({ orderBy: { nombre: 'asc' } });

    return {
      success: true,
      message: 'Lista de carreras',
      data: carreras,
      total: carreras.length
    };
  }

  async findOne(id: number): Promise<ApiResponse<Carrera>> {
    const carrera = await this.prisma.carreras.findUnique({ where: { idCarrera: id }});

    if (!carrera) {
      throw new NotFoundException('Carrera no encontrada');
    }

    return {
      success: true,
      message: 'Carrera encontrada',
      data: carrera
    };
  }

  async update(id: number, dto: UpdateCarreraDto): Promise<ApiResponse<Carrera>> {
    const carrera = await this.prisma.carreras.findUnique({ where: { idCarrera: id } });

    if (!carrera) {
      throw new NotFoundException('Carrera no encontrada');
    }

    const actualizada = await this.prisma.carreras.update({
      where: { idCarrera: id },
      data: dto
    });

    return {
      success: true,
      message: 'Carrera modificada correctamente',
      data: actualizada
    };
  }

  async remove(id: number): Promise<ApiResponse<null>> {
    const carrera = await this.prisma.carreras.findUnique({ where: { idCarrera: id } });

    if (!carrera) {
      throw new NotFoundException('Carrera no encontrada');
    }

    await this.prisma.carreras.delete({ where: { idCarrera: id } });

    return {
      success: true,
      message: 'Carrera eliminada correctamente'
    };
  }
}