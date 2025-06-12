import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ description: 'Correo electrónico del usuario' })
  correo: string;

  @ApiProperty({ description: 'Contraseña del usuario' })
  contraseña: string;

  @ApiProperty({ description: 'Tipo de usuario', example: 'estudiante' })
  tipoUsuario: string;
}

export interface LoginResponse {
  expires_in: string;
  access_token: string;
  refresh_token: string;
  usuarioID: string;
}

export class RefreshRequest {
  @ApiProperty({ description: 'Token de refresco' })
  @IsString()
  @IsNotEmpty()
  refresh_token: string; 
}

export interface RefreshResponse {
  expires_in: string;
  access_token: string;
  refresh_token: string;
}
