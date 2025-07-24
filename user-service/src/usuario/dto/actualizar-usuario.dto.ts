import { ApiPropertyOptional } from '@nestjs/swagger';
import { TelefonoDto } from './crear-usuario.dto';
import { IsOptional } from 'class-validator';


export class ActualizarUsuarioDto  {
  @ApiPropertyOptional({ description: 'Email del usuario' })
  correo?: string;

  @ApiPropertyOptional({ description: 'ID del tipo de identificación' })
  tipoIdentificacion?: number;

  @ApiPropertyOptional({ description: 'Número de identificación' })
  identificacion?: string;

  @ApiPropertyOptional({ description: 'Nombre completo del usuario' })
  nombreCompleto?: string;

  @ApiPropertyOptional({ description: 'Nueva contraseña del usuario' })
  contrasena?: string;

  @ApiPropertyOptional({ description: 'Tipo de usuario' })
  tipoUsuario?: number;

  @ApiPropertyOptional({ description: 'Estado del usuario' })
  @IsOptional()
  estadoUsuario?: number;

  @ApiPropertyOptional({ description: 'Intentos fallidos del usuario' })
  @IsOptional()
  intentos_fallidos?: number;

  @ApiPropertyOptional({ description: 'IDs de carreras asociadas' })
  carreras?: number[];

  @ApiPropertyOptional({ description: 'IDs de áreas asociadas' })
  areas?: number[];

  @ApiPropertyOptional({ description: 'Teléfonos de contacto' })
  telefonos?: TelefonoDto[];
}