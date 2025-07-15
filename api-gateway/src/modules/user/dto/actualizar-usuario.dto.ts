import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CrearUsuarioDto, TelefonoDto } from './crear-usuario.dto';

export class ActualizarUsuarioDto extends PartialType(CrearUsuarioDto) {
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

  @ApiPropertyOptional({ description: 'IDs de carreras asociadas' })
  carreras?: number[];

  @ApiPropertyOptional({ description: 'IDs de áreas asociadas' })
  areas?: number[];

  @ApiPropertyOptional({ description: 'Teléfonos de contacto' })
  telefonos?: TelefonoDto[];
}