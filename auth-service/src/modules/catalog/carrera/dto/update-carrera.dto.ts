import { IsString, IsNotEmpty, Length, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCarreraDto {
  @ApiProperty({ description: 'Nombre de la carrera' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  nombre: string;

  @ApiProperty({ description: 'Nombre del director de la carrera' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  director: string;

  @ApiProperty({ description: 'Correo electrónico del director' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Número telefónico de contacto (solo números)' })
  @IsString()
  @Matches(/^\d+$/, { message: 'El teléfono debe contener solo números' })
  @IsNotEmpty()
  @Length(8, 20)
  telefono: string;
}
