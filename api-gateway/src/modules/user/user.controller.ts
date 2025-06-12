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
  Headers
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UsuarioDto, UsuarioFiltrosDto } from '../../interfaces/user.interface';

@Controller('usuario')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() usuario: UsuarioDto, @Headers('authorization') auth: string) {
    return this.userService.createUser(usuario, auth);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() usuario: UsuarioDto, @Headers('authorization') auth: string) {
    return this.userService.updateUser(id, usuario, auth);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.userService.deleteUser(id, auth);
  }

  @Get()
  async getAllUsers(@Headers('authorization') auth: string) {
    return this.userService.getAllUsers(auth);
  }

  @Get('filter')
  async getUsersFiltered(@Query() filters: UsuarioFiltrosDto, @Headers('authorization') auth: string) {
    return this.userService.getUsersFiltered(filters, auth);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.userService.getUserById(id, auth);
  }

  @Post('fotografia')
  async updatePhoto(@Body() data: { usuarioId: string; fotografia: string }, @Headers('authorization') auth: string) {
    return this.userService.updatePhoto(data, auth);
  }

  @Delete('fotografia/:id')
  async deletePhoto(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.userService.deletePhoto(id, auth);
  }

  @Get('fotografia/:id')
  async getPhoto(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.userService.getPhoto(id, auth);
  }

  @Get('qr/:identificacion')
  async getQR(@Param('identificacion') identificacion: string, @Headers('authorization') auth: string) {
    return this.userService.getQR(identificacion, auth);
  }
}