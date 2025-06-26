// src/dto/estado-usuario.dto.ts
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CambiarEstadoUsuarioDto {

  

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
    description: 'Mensaje de confirmación',
    example: 'Estado del usuario actualizado exitosamente',
  })
  mensaje: string;
}
