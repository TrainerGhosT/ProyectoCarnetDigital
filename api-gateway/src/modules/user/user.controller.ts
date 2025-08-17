import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsuarioDto, UsuarioFiltrosDto } from '../../interfaces/user.interface';
import { FiltrarUsuarioDto } from './dto/filtrar-usuario.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import {
  FotografiaResponseDto,
  ObtenerFotografiaDto,
} from './dto/fotografia-usuario.dto';

@Controller('usuario')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios o filtrados' })
  @ApiQuery({
    name: 'identificacion',
    required: false,
    description: 'Filtrar por identificación',
  })
  @ApiQuery({
    name: 'nombre',
    required: false,
    description: 'Filtrar por nombre',
  })
  @ApiQuery({
    name: 'tipo',
    required: false,
    description: 'Filtrar por tipo de usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async ObtenerUsuariosFiltrados(@Query() filtros: FiltrarUsuarioDto) {
    const usuarios = await this.userService.getUsers(filtros);
    
    return usuarios
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 409, description: 'Email ya existe' })
  async CreateUser(@Body() crearUsuarioDto: CrearUsuarioDto) {
    try {
      const usuario = await this.userService.createUser(crearUsuarioDto);
      return usuario;
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

  @Get('fotografia/:usuarioId')
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
    const dto: ObtenerFotografiaDto = { usuarioId };
    return this.userService.getPhoto(dto);
  }

  @Get('qr/:identificacion')
   @ApiOperation({
    summary: 'Obtener QR del usuario',
    description:
      'Crea o devuelve el código QR asociado a la identificación del usuario.',
  })
  @ApiParam({
    name: 'identificacion',
    required: true,
    description: 'Identificación o cédula del usuario',
  })
  async generateQrCode(@Param('identificacion') identificacion: string) {
    try {
      if (!identificacion) {
        throw new HttpException(
          'La identificación del usuario es requerida',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.userService.getQR(identificacion);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error interno al generar el código QR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
