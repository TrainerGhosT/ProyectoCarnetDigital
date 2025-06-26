// src/dto/estado-usuario.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CambiarEstadoUsuarioDto {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: 'abcd-1234-efgh-5678',
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty({ message: 'El identificador del usuario es requerido' })
  usuarioId: string;

  @ApiProperty({
    description: 'Código del estado que se desea asignar al usuario',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'El código del estado es requerido' })
  codigoEstado: number;
}

export class EstadoUsuarioResponseDto {
  @ApiProperty({
    description: 'Identificador del usuario',
    example: 'abcd-1234-efgh-5678',
  })
  usuarioId: string;

  @ApiProperty({
    description: 'Estado anterior del usuario',
  })
  estadoAnterior: number;

  @ApiProperty({
    description: 'Estado actual del usuario',
  })
  estadoActual: number;

  @ApiProperty({
    description: 'Fecha y hora del cambio de estado',
    example: '2025-06-25T10:30:00Z',
  })
  fechaCambio: Date;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Estado del usuario actualizado exitosamente',
  })
  mensaje: string;
}
