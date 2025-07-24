import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CrearBitacoraDto } from './dto/crear-bitacora.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { BitacoraService } from './bitacora.service';
import { BitacoraResponse } from './interfaces/bitacora.interface';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';

@ApiTags('Bitacora')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bitacora')
export class BitacoraController {
  constructor(private readonly bitacoraService: BitacoraService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar nueva Bitacora' })
  @SwaggerResponse({
    status: 201,
    description: 'Bitacora registrada correctamente',
  })
  @SwaggerResponse({ status: 400, description: 'Error al registrar Bitacora' })
  async CrearBitacora(@Body() dto: CrearBitacoraDto) {
    try {
      return await this.bitacoraService.Crear(dto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno del servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los bitacoras',
    description: 'Obtiene todos los bitacoras del sistema',
  })
  @ApiResponse({ status: 200, description: 'Bitacoras obtenidos' })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron bitacoras',
  })
  async obtenerTodos(): Promise<BitacoraResponse[]> {
    return await this.bitacoraService.ObtenerTodos();
  }
}
