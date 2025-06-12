import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TelefonoResponseDto {
  @ApiProperty({ description: 'Número de teléfono' })
  numero: string;

  @ApiProperty({ description: 'Tipo de teléfono' })
  tipo: number;
}

export class CarreraResponseDto {
  @ApiProperty({ description: 'ID de la carrera' })
  carrera: number;
}

export class AreaResponseDto {
  @ApiProperty({ description: 'ID del área' })
  area: number;
}

export class UsuarioResponseDto {
  @ApiProperty({ description: 'ID único del usuario' })
  idUsuario: string;

  @ApiProperty({ description: 'Email del usuario' })
  correo: string;

  @ApiProperty({ description: 'Tipo de identificación' })
  tipoIdentificacion: number;

  @ApiProperty({ description: 'Número de identificación' })
  identificacion: string;

  @ApiProperty({ description: 'Nombre completo del usuario' })
  nombreCompleto: string;

  @ApiProperty({ description: 'Tipo de usuario' })
  tipoUsuario: number;

  @ApiProperty({ description: 'Estado del usuario' })
  estadoUsuario: number;

  @ApiPropertyOptional({ 
    description: 'Carreras asociadas',
    type: [CarreraResponseDto]
  })
  carreras?: CarreraResponseDto[];

  @ApiPropertyOptional({ 
    description: 'Áreas asociadas',
    type: [AreaResponseDto]
  })
  areas?: AreaResponseDto[];

  @ApiPropertyOptional({ 
    description: 'Teléfonos de contacto',
    type: [TelefonoResponseDto]
  })
  telefonos?: TelefonoResponseDto[];
}