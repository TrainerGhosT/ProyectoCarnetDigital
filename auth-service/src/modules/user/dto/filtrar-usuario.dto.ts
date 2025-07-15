import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FiltrarUsuarioDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por identificación (búsqueda parcial)',
    example: '123456'
  })
  @IsOptional()
  @IsString({ message: 'La identificación debe ser una cadena de texto' })
  identificacion?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por nombre (búsqueda parcial)',
    example: 'Juan'
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por tipo de usuario',
    example: '1'
  })
  @IsOptional()
  @IsNumberString({}, { message: 'El tipo debe ser un número' })
  tipo?: string;
}