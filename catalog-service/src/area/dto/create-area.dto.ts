import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAreaDto {
  @ApiProperty({ description: 'Nombre del área de trabajo', example: 'Tecnología' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @Matches(/\S/, { message: 'El nombre no puede contener solo espacios en blanco' })
  nombre: string;
}
