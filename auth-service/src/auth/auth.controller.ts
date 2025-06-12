import { Controller, Post, Get, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ 
    status: 201, 
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        expires_in: { type: 'number', example: 300 },
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        usuarioID: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Usuario y/o contraseña incorrectos',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuario y/o contraseña incorrectos' }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Renovar token de acceso' })
  @ApiResponse({ 
    status: 201, 
    description: 'Token renovado exitosamente',
    schema: {
      type: 'object',
      properties: {
        expires_in: { type: 'number', example: 300 },
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        refresh_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'No autorizado' }
      }
    }
  })
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }

  @Get('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar token de acceso' })
  @ApiQuery({ 
    name: 'token', 
    description: 'Token JWT a validar',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token válido',
    schema: {
      type: 'boolean',
      example: true
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token inválido',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  async validate(@Query('token') token: string) {
    if (!token) {
      return false;
    }
    
    const isValid = await this.authService.validate({ token });
    
    if (!isValid) {
      return false;
    }
    
    return true;
  }
}