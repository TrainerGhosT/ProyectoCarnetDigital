// src/dto/fotografia-usuario.dto.ts
import { IsString, IsNotEmpty, IsBase64, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarFotografiaDto {
  @ApiProperty({
    description: 'UUID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty({ message: 'El identificador del usuario es requerido' })
  usuarioId: string;

  @ApiProperty({
    description: 'Fotografía en Base64 (prefijo data:image/…)',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
  })
  @IsString()
  @IsNotEmpty({ message: 'La fotografía es requerida' })

  
  fotografia: string;
}

export class EliminarFotografiaDto {
  @ApiProperty({
    description: 'UUID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty({ message: 'El identificador del usuario es requerido' })
  usuarioId: string;
}

export class ObtenerFotografiaDto {
  @ApiProperty({
    description: 'UUID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty({ message: 'El identificador del usuario es requerido' })
  usuarioId: string;
}

export class FotografiaResponseDto {
  @ApiProperty({
    description: 'Fotografía en Base64',
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
  })
  fotografia: string;

  @ApiProperty({
    description: 'UUID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  usuarioId: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-06-25T10:30:00Z',
  })
  fechaActualizacion: Date;
}
