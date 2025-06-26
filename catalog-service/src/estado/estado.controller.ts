import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
    return await this.estadoService.obtenerTodos();
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
    return await this.estadoService.obtenerPorId(id);
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
    return await this.estadoService.crear(estadoDto);
  }
}
