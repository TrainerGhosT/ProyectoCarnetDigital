// src/controllers/fotografia-usuario.controller.ts
import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  ActualizarFotografiaDto,
  EliminarFotografiaDto,
  FotografiaResponseDto,
  ObtenerFotografiaDto,
} from './dto/fotografia-usuario.dto';
import { FotografiaUsuarioService } from './fotografia.service';

@ApiTags('Fotografía')
@Controller('usuario/fotografia')
export class FotografiaUsuarioController {
  private readonly logger = new Logger(FotografiaUsuarioController.name);

  constructor(
    private readonly fotografiaUsuarioService: FotografiaUsuarioService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar fotografía del usuario',
    description:
      'Agrega o actualiza la fotografía del usuario en formato Base64 (≤ 1 MB, proporción ~4:3).',
  })
  @ApiResponse({
    status: 200,
    description: 'Fotografía actualizada',
    type: FotografiaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Formato o tamaño inválido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async actualizarFotografia(
    @Body() dto: ActualizarFotografiaDto,
  ): Promise<FotografiaResponseDto> {
    this.logger.log(
      `Solicitud para actualizar fotografía: usuario=${dto.usuarioId}`,
    );
    return this.fotografiaUsuarioService.actualizarFotografia(dto);
  }

  @Delete(':usuarioId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar fotografía del usuario',
    description: 'Elimina la fotografía asociada al usuario indicado por UUID.',
  })
  @ApiParam({
    name: 'usuarioId',
    description: 'UUID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Fotografía eliminada',
    schema: {
      type: 'object',
      properties: {
        mensaje: {
          type: 'string',
          example: 'Fotografía eliminada exitosamente',
        },
        usuarioId: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Fotografía no encontrada' })
  async eliminarFotografia(
    @Param('usuarioId') usuarioId: string,
  ): Promise<{ mensaje: string; usuarioId: string }> {
    this.logger.log(`Solicitud para eliminar fotografía: UUID=${usuarioId}`);
    const dto: EliminarFotografiaDto = { usuarioId };
    return this.fotografiaUsuarioService.eliminarFotografia(dto);
  }

  @Get(':usuarioId')
  @ApiOperation({
    summary: 'Obtener fotografía del usuario',
    description:
      'Devuelve la fotografía en Base64 asociada al UUID del usuario.',
  })
  @ApiParam({
    name: 'usuarioId',
    description: 'UUID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Fotografía obtenida',
    type: FotografiaResponseDto,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Fotografía no encontrada' })
  async obtenerFotografia(
    @Param('usuarioId') usuarioId: string,
  ): Promise<FotografiaResponseDto> {
    this.logger.log(`Solicitud para obtener fotografía: UUID=${usuarioId}`);
    const dto: ObtenerFotografiaDto = { usuarioId };
    return this.fotografiaUsuarioService.obtenerFotografia(dto);
  }
}
