import {
  Controller, Get, Post, Put, Delete, Param, Body,
  HttpException, HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';


@ApiTags('Áreas de Trabajo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva área de trabajo' })
  @ApiResponse({ status: 201, description: 'Área registrada correctamente' })
  async create(@Body() dto: CreateAreaDto) {
    try {
      return await this.areaService.create(dto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las áreas de trabajo' })
  @ApiResponse({ status: 200, description: 'Lista de áreas' })
  async findAll() {
    return await this.areaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener área por ID' })
  @ApiResponse({ status: 200, description: 'Área encontrada' })
  async findOne(@Param('id') id: string) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    return await this.areaService.findOne(parsedId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar área de trabajo por ID' })
  @ApiResponse({ status: 200, description: 'Área actualizada correctamente' })
  async update(@Param('id') id: string, @Body() dto: UpdateAreaDto) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    return await this.areaService.update(parsedId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar área de trabajo por ID' })
  @ApiResponse({ status: 200, description: 'Área eliminada correctamente' })
  async remove(@Param('id') id: string) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
    return await this.areaService.remove(parsedId);
  }
}
