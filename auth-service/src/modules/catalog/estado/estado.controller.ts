import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EstadoService } from './estado.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EstadoResponse } from './interface/estado.interface';
import { CrearEstadoDto } from './dto/crear-estado.dto';

@Controller('estados')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los estados',
    description: 'Obtiene todos los estados del sistema',
  })
  @ApiResponse({ status: 200, description: 'Estados obtenidos' })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron estados',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al obtener los estados',
  })
  async obtenerEstados(): Promise<EstadoResponse[]> {
    return await this.estadoService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un estado por ID',
    description: 'Obtiene un estado del sistema por su ID',
  })
  @ApiResponse({ status: 200, description: 'Estado obtenido' })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron estados',
  })
  async obtenerEstadoPorId(@Param('id') id: number): Promise<EstadoResponse> {
    return await this.estadoService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un estado',
  })
  @ApiResponse({ status: 201, description: 'Estado creado' })
  @ApiResponse({
    status: 400,
    description: 'Error al crear el estado',
  })
  @ApiResponse({
    status: 409,
    description: 'Estado ya existente',
  })
  async crearEstado(@Body() estadoDto: CrearEstadoDto) {
    return await this.estadoService.create(estadoDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un estado',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Estado no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 409, description: 'Estado ya existente' })
  async actualizarEstado(@Param('id') id: number, @Body() dto: CrearEstadoDto) {
    return await this.estadoService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un estado',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Estado no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async eliminarEstado(@Param('id') id: number) {
    return await this.estadoService.remove(id);
  }
}
