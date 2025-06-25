import {
  Controller,
  Post,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ValidateDto } from './dto/validate.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiHeader({
    name: 'correo',
    description: 'Correo del usuario',
    required: true,
  })
  @ApiHeader({
    name: 'contrasena',
    description: 'Contraseña del usuario',
    required: true,
  })
  @ApiHeader({
    name: 'tipousuario',
    description: 'Tipo de usuario',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Login exitoso',
  })
  @ApiResponse({
    status: 401,
    description: 'Usuario y/o contraseña incorrectos',
  })
  async login(
    @Headers('correo') correo: string,
    @Headers('contrasena') contrasena: string,
    @Headers('tipousuario') tipoUsuario: string,
  ) {
    if (!correo || !contrasena || !tipoUsuario) {
      throw new HttpException(
        'Todos los datos son requeridos',
        HttpStatus.BAD_REQUEST,
      );
    }

    const loginRequest: LoginDto = { correo, contrasena, tipoUsuario };

    return this.authService.login(loginRequest);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Renovar token de acceso' })
  @ApiHeader({
    name: 'refresh_token',
    description: 'Refresh token para renovar acceso',
    required: true
  })
  @ApiResponse({
    status: 201,
    description: 'Token renovado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  async refresh(@Headers('refresh_token') refresh_token: string) {
    
    if (!refresh_token) { 
      throw new HttpException('Refresh token faltante', HttpStatus.UNAUTHORIZED);
    }

    const refreshTokenData: RefreshDto = { refresh_token };

    return this.authService.refresh(refreshTokenData);
  }

  @Get('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar token de acceso' })
  @ApiHeader({ name: 'token', description: 'JWT de acceso', required: true })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
    schema: { type: 'boolean' },
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async validate(@Headers('token') token: string) {
    if (!token) {
      throw new HttpException('Token requerido', HttpStatus.BAD_REQUEST);
    }
    const tokenData: ValidateDto = { token };

    const isValid = await this.authService.validate(tokenData);
    if (!isValid) {
      throw new HttpException('Token inválido o expirado', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
