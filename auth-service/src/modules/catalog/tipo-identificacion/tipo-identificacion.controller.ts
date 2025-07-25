import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { CrearTipoIdentificacionDto } from './dto/crear-tipo-identificacion.dto';
import { ActualizarTipoIdentificacionDto } from './dto/actualizar-tipo-identificacion.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TiposIdentificacionService } from './tipo-identificacion.service';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';

@ApiTags('Tipos de identificación')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tiposidentificacion')
export class TiposIdentificacionController {
  constructor(
    private readonly tiposIdentificacionService: TiposIdentificacionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear tipo identificacion' })
  @ApiResponse({
    status: 201,
    description: 'Tipo identificacion creado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 409, description: 'Tipo identificacion ya existente' })
  async crearTipoIdentificacion(@Body() dto: CrearTipoIdentificacionDto) {
    return await this.tiposIdentificacionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de identificación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de identificación obtenida exitosamente',
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async obtenerTiposIdentificacion() {
    return await this.tiposIdentificacionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de identificación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de identificación obtenido exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de identificación no encontrado',
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async obtenerTipoIdentificacionPorId(@Param('id', ParseIntPipe) id: number) {
    return await this.tiposIdentificacionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de identificación' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de identificación actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de identificación no encontrado',
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({
    status: 409,
    description: 'Tipo de identificación ya existente',
  })
  async actualizarTipoIdentificacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarTipoIdentificacionDto,
  ) {
    return await this.tiposIdentificacionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de identificación' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de identificación eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de identificación no encontrado',
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async eliminarTipoIdentificacion(@Param('id', ParseIntPipe) id: number) {
    return await this.tiposIdentificacionService.remove(id);
  }
}
