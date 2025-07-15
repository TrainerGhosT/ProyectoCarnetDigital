// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
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
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Headers('correo') correo: string,
    @Headers('contrasena') contrasena: string,
    @Headers('tipousuario') tipoUsuario: string,
  ) {
    if (!correo || !contrasena || !tipoUsuario) {
      throw new HttpException('Datos incompletos', HttpStatus.BAD_REQUEST);
    }
    return this.authService.login({ correo, contrasena, tipoUsuario });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiHeader({
    name: 'refresh_token',
    description: 'Refresh token para renovar acceso',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Headers('refresh_token') refresh_token: string) {
    try {
      return await this.authService.refresh(refresh_token);
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Token refresh failed',
        error.response?.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validate access token' })
  @ApiHeader({ name: 'token', description: 'Access token to validate' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async validate(@Headers('token') token: string) {
    try {
      return await this.authService.validate(token);
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Token validation failed',
        error.response?.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
