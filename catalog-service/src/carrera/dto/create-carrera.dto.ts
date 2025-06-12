import { IsString, IsNotEmpty, Length, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarreraDto {
  @ApiProperty({ description: 'Nombre de la carrera', example: 'Ingeniería Industrial' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  nombre: string;

  @ApiProperty({ description: 'Nombre del director de la carrera', example: 'Dra. María López' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  director: string;

  @ApiProperty({ description: 'Correo electrónico del director', example: 'maria.lopez@universidad.edu' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Número telefónico de contacto', example: '2222 3333' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'El teléfono debe contener solo números' })
  @Length(8, 20)
  telefono: string;
}