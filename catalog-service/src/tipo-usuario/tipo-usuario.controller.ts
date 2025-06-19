import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';

import { CrearTipoUsuarioDto } from './dto/crear-tipo-usuario.dto';
import { ActualizarTipoUsuarioDto } from './dto/actualizar-tipo-usuario.dto';
import { TiposUsuarioService } from './tipo-usuario.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tiposusuario')
export class TiposUsuarioController {
  constructor(private readonly tiposUsuarioService: TiposUsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 409, description: 'Tipo de usuario ya existente' })
  async crearTipoUsuario(@Body() tipoUsuarioDto: CrearTipoUsuarioDto) {
    try {
      const tipoUsuario =
        await this.tiposUsuarioService.crearTipoUsuario(tipoUsuarioDto);
      return {
        status: 'success',
        message: 'Usuario creado exitosamente',
        data: tipoUsuario,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          'El tipo de usuario o alguno de los datos ya se encuentran registrados',
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de usuario obtenida exitosamente',
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({
    status: 400,
    description: 'Error al obtener tipos de usuario',
  })
  async obtenerTiposUsuario() {
    return await this.tiposUsuarioService.obtenerTiposUsuario();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de usuario obtenido exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Tipo de usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async obtenerTipoUsuarioPorId(@Param('id', ParseIntPipe) id: number) {
    return await this.tiposUsuarioService.obtenerTipoUsuarioPorId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de usuario actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Tipo de usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 409, description: 'Tipo de usuario ya existente' })
  async actualizarTipoUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarTipoUsuarioDto,
  ) {
    return await this.tiposUsuarioService.actualizarTipoUsuario(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de usuario eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Tipo de usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async eliminarTipoUsuario(@Param('id', ParseIntPipe) id: number) {
    return await this.tiposUsuarioService.eliminarTipoUsuario(id);
  }
}
