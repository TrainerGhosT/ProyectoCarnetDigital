import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { AuthGuard } from './auth.guard';


import { FiltrarUsuarioDto } from './dto/filtrar-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@ApiTags('Usuario')
@Controller('usuario')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 409, description: 'Email ya existe' })
  async crearUsuario(@Body() crearUsuarioDto: CrearUsuarioDto) {
    try {
      const usuario = await this.usuarioService.crearUsuario(crearUsuarioDto);
      return {
        status: 'success',
        message: 'Usuario creado exitosamente',
        data: usuario,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          'El email ya está registrado',
          HttpStatus.CONFLICT,
        );
      }
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async actualizarUsuario(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() actualizarUsuarioDto: ActualizarUsuarioDto,
  ) {
    const usuario = await this.usuarioService.actualizarUsuario(id, actualizarUsuarioDto);
    return {
      status: 'success',
      message: 'Usuario actualizado exitosamente',
      data: usuario,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async eliminarUsuario(@Param('id', ParseUUIDPipe) id: string) {
    await this.usuarioService.eliminarUsuario(id);
    return {
      status: 'success',
      message: 'Usuario eliminado exitosamente',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios o filtrados' })
  @ApiQuery({ name: 'identificacion', required: false, description: 'Filtrar por identificación' })
  @ApiQuery({ name: 'nombre', required: false, description: 'Filtrar por nombre' })
  @ApiQuery({ name: 'tipo', required: false, description: 'Filtrar por tipo de usuario' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async obtenerUsuarios(@Query() filtros: FiltrarUsuarioDto) {
    const usuarios = await this.usuarioService.obtenerUsuarios(filtros);
    return {
      status: 'success',
      message: 'Usuarios obtenidos exitosamente',
      data: usuarios,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async obtenerUsuarioPorId(@Param('id', ParseUUIDPipe) id: string) {
    const usuario = await this.usuarioService.obtenerUsuarioPorId(id);
    return {
      status: 'success',
      message: 'Usuario obtenido exitosamente',
      data: usuario,
    };
  }
}