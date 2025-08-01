import { ApiPropertyOptional } from '@nestjs/swagger';

import { TelefonoDto } from './crear-usuario.dto';
import { IsOptional } from 'class-validator';

export class ActualizarUsuarioDto {
  @ApiPropertyOptional({ description: 'Email del usuario' })
  @IsOptional()
  correo?: string;

  @ApiPropertyOptional({ description: 'ID del tipo de identificación' })
  @IsOptional()
  tipoIdentificacion?: number;

  @ApiPropertyOptional({ description: 'Número de identificación' })
  @IsOptional()
  identificacion?: string;

  @ApiPropertyOptional({ description: 'Nombre completo del usuario' })
  @IsOptional()
  nombreCompleto?: string;

  @ApiPropertyOptional({ description: 'Nueva contraseña del usuario' })
  @IsOptional()
  contrasena?: string;

  @ApiPropertyOptional({ description: 'Tipo de usuario' })
  @IsOptional()
  tipoUsuario?: number;

  @ApiPropertyOptional({ description: 'Estado del usuario' })
  @IsOptional()
  estadoUsuario?: number;

  @ApiPropertyOptional({ description: 'Intentos fallidos del usuario' })
  @IsOptional()
  intentos_fallidos?: number;

  @ApiPropertyOptional({ description: 'IDs de carreras asociadas' })
  @IsOptional()
  carreras?: number[];

  @ApiPropertyOptional({ description: 'IDs de áreas asociadas' })
  @IsOptional()
  areas?: number[];

  @ApiPropertyOptional({ description: 'Teléfonos de contacto' })
  @IsOptional()
  telefonos?: TelefonoDto[];
}
