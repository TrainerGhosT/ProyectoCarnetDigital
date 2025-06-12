import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Patch,
  Body, 
  Param, 
  UseGuards,
  Headers
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TipoUsuario, TipoIdentificacion, Carrera, Area } from '../../interfaces/catalog.interface';

@Controller()
@UseGuards(JwtAuthGuard)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // Tipos de Usuario
  @Post('tiposusuario')
  async createTipoUsuario(@Body() tipoUsuario: TipoUsuario, @Headers('authorization') auth: string) {
    return this.catalogService.createTipoUsuario(tipoUsuario, auth);
  }

  @Put('tiposusuario/:id')
  async updateTipoUsuario(@Param('id') id: string, @Body() tipoUsuario: TipoUsuario, @Headers('authorization') auth: string) {
    return this.catalogService.updateTipoUsuario(id, tipoUsuario, auth);
  }

  @Delete('tiposusuario/:id')
  async deleteTipoUsuario(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.catalogService.deleteTipoUsuario(id, auth);
  }

  @Get('tiposusuario')
  async getAllTiposUsuario(@Headers('authorization') auth: string) {
    return this.catalogService.getAllTiposUsuario(auth);
  }

  @Get('tiposusuario/:id')
  async getTipoUsuarioById(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.catalogService.getTipoUsuarioById(id, auth);
  }

  // Tipos de Identificación
  @Post('tiposidentificacion')
  async createTipoIdentificacion(@Body() tipoIdentificacion: TipoIdentificacion, @Headers('authorization') auth: string) {
    return this.catalogService.createTipoIdentificacion(tipoIdentificacion, auth);
  }

  @Put('tiposidentificacion/:id')
  async updateTipoIdentificacion(@Param('id') id: string, @Body() tipoIdentificacion: TipoIdentificacion, @Headers('authorization') auth: string) {
    return this.catalogService.updateTipoIdentificacion(id, tipoIdentificacion, auth);
  }

  @Delete('tiposidentificacion/:id')
  async deleteTipoIdentificacion(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.catalogService.deleteTipoIdentificacion(id, auth);
  }

  @Get('tiposidentificacion')
  async getAllTiposIdentificacion(@Headers('authorization') auth: string) {
    return this.catalogService.getAllTiposIdentificacion(auth);
  }

  @Get('tiposidentificacion/:id')
  async getTipoIdentificacionById(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.catalogService.getTipoIdentificacionById(id, auth);
  }

  // Carreras
  @Post('carreras')
  async createCarrera(@Body() carrera: Carrera, @Headers('authorization') auth: string) {
    return this.catalogService.createCarrera(carrera, auth);
  }

  @Put('carreras/:id')
  async updateCarrera(@Param('id') id: string, @Body() carrera: Carrera, @Headers('authorization') auth: string) {
    return this.catalogService.updateCarrera(id, carrera, auth);
  }

  @Delete('carreras/:id')
  async deleteCarrera(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.catalogService.deleteCarrera(id, auth);
  }

  @Get('carreras')
  async getAllCarreras(@Headers('authorization') auth: string) {
    return this.catalogService.getAllCarreras(auth);
  }

  @Get('carreras/:id')
  async getCarreraById(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.catalogService.getCarreraById(id, auth);
  }

  // Áreas
  @Post('areas')
  async createArea(@Body() area: Area, @Headers('authorization') auth: string) {
    return this.catalogService.createArea(area, auth);
  }

  @Put('areas/:id')
  async updateArea(@Param('id') id: string, @Body() area: Area, @Headers('authorization') auth: string) {
    return this.catalogService.updateArea(id, area, auth);
  }

  @Delete('areas/:id')
  async deleteArea(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.catalogService.deleteArea(id, auth);
  }

  @Get('areas')
  async getAllAreas(@Headers('authorization') auth: string) {
    return this.catalogService.getAllAreas(auth);
  }

  @Get('areas/:id')
  async getAreaById(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.catalogService.getAreaById(id, auth);
  }

  // Estados de Usuario
  @Patch('usuarios/estado')
  async changeUserState(@Body() data: { usuarioId: string; estadoId: string }, @Headers('authorization') auth: string) {
    return this.catalogService.changeUserState(data, auth);
  }
}