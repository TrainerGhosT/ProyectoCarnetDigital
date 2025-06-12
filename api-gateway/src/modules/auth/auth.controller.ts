import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest, RefreshRequest } from '../../interfaces/auth.interface';
import {
  ApiTags,
  ApiOperation,
  ApiHeader,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Endpoint para autenticar usuarios',
  })
  @ApiHeader({ name: 'usuario', description: 'Correo electrónico del usuario' })
  @ApiHeader({ name: 'contrasena', description: 'Contraseña del usuario' })
  @ApiHeader({
    name: 'tipousuario',
    description: 'Tipo de usuario (estudiante, profesor, etc.)',
  })
  @ApiResponse({ status: 201, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(
    @Headers('usuario') correo: string,
    @Headers('contrasena') contraseña: string,
    @Headers('tipousuario') tipoUsuario: string,
  ) {
    const loginDto: LoginRequest = { correo, contraseña, tipoUsuario };
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  
  @ApiOperation({
    summary: 'Refrescar token',
    description: 'Endpoint para renovar el token de acceso',
  })
  @ApiResponse({ status: 201, description: 'Token refrescado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token de refresco inválido' })
  async refresh(@Body() refreshDto: RefreshRequest) {
    return this.authService.refresh(refreshDto);
  }

  @Get('validate')
  //@ApiBearerAuth()
  @ApiOperation({
    summary: 'Validar token',
    description: 'Endpoint para validar el token de acceso',
  })
  
  @ApiResponse({ status: 200, description: 'Token válido' })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  async validate(@Headers('authorization') authHeader: string) {
    return this.authService.validate(authHeader);
  }
}
