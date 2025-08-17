import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { UserService } from './user.service';
import {
  CambiarEstadoUsuarioDto,
  EstadoUsuarioResponseDto,
} from './dto/estado-usuario.dto';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { ActualizarFotografiaDto } from './dto/fotografia-usuario.dto';

@ApiTags('Usuario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuario')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por id' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async obtenerUsuarioPorId(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.userService.getUser(id);

    return data;
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
    const data = await this.userService.updateUser(id, actualizarUsuarioDto);

    return data;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async eliminarUsuario(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.deleteUser(id);
  }

  @Patch('estado/:id')
  @ApiOperation({ summary: 'Cambiar el estado de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado',
    type: EstadoUsuarioResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Error al cambiar el estado' })
  @ApiResponse({ status: 404, description: 'Usuario o estado no encontrado' })
  async cambiarEstadoUsuario(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CambiarEstadoUsuarioDto,
  ) {
    const estadoUsuario = await this.userService.updateStateUser(id, dto);

    return estadoUsuario;
  }

  @Post('fotografia')
  @ApiOperation({ summary: 'Crear fotografia de un usuario' })
  @ApiResponse({ status: 200, description: 'Fotografia creada exitosamente' })
  @ApiResponse({ status: 404, description: 'Fotofrafia no encontrada' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async crearFotografiaUsuario(
    @Body() actualizarFotografiaDto: ActualizarFotografiaDto,
  ) {
    const data = await this.userService.updatePhoto(actualizarFotografiaDto);

    return data;
  }

  @Delete('fotografia/:id')
  @ApiOperation({ summary: 'Eliminar fotografia de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Fotografía eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Fotografía no encontrada' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async eliminarFotografiaUsuario(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.userService.deletePhoto(id);

    return data;
  }
}
