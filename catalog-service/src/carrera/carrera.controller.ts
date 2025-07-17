import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse as SwaggerResponse
} from '@nestjs/swagger';
import { CarreraService } from './carrera.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { Put, Delete } from '@nestjs/common';
import { UpdateCarreraDto } from './dto/update-carrera.dto';

@ApiTags('Carreras')
@Controller('carrera')
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
export class CarreraController {
  constructor(private readonly carreraService: CarreraService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nueva carrera' })
  @SwaggerResponse({ status: 201, description: 'Carrera registrada correctamente' })
  @SwaggerResponse({ status: 409, description: 'Conflicto: Carrera duplicada' })
  async create(@Body() dto: CreateCarreraDto) {
    try {
      return await this.carreraService.create(dto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
@ApiOperation({ summary: 'Obtener lista de carreras' })
@SwaggerResponse({ status: 200, description: 'Lista de carreras obtenida' })
async findAll() {
  try {
    return await this.carreraService.findAll();
  } catch (error) {
    throw new HttpException({
      message: error.message || 'Error al obtener carreras',
      error: 'Internal Server Error',
      statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Get(':id')
@ApiOperation({ summary: 'Obtener carrera por ID' })
@SwaggerResponse({ status: 200, description: 'Carrera encontrada' })
@SwaggerResponse({ status: 404, description: 'Carrera no encontrada' })
async findOne(@Param('id') id: string) {
  try {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new HttpException({
        message: 'ID inválido',
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      }, HttpStatus.BAD_REQUEST);
    }

    return await this.carreraService.findOne(parsedId);

  } catch (error) {
    throw new HttpException({
      message: error.message || 'Error al obtener carrera',
      error: error.error || 'Not Found',
      statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


  @Put(':id')
  @ApiOperation({ summary: 'Modificar carrera por ID' })
  @SwaggerResponse({ status: 200, description: 'Carrera modificada correctamente' })
  @SwaggerResponse({ status: 404, description: 'Carrera no encontrada' })
  async update(@Param('id') id: string, @Body() dto: UpdateCarreraDto) {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
      }
      return await this.carreraService.update(parsedId, dto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar carrera por ID' })
  @SwaggerResponse({ status: 200, description: 'Carrera eliminada correctamente' })
  @SwaggerResponse({ status: 404, description: 'Carrera no encontrada' })
  async remove(@Param('id') id: string) {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
      }
      return await this.carreraService.remove(parsedId);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
