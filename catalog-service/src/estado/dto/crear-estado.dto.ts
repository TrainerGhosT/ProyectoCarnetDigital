import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CrearEstadoDto {
  @IsNotEmpty({ message: 'Este campo no puede estar vacío' })
  @IsString({ message: 'El nombre debe ser de tipo string' })
  @MaxLength(50, { message: 'El nombre debe tener un máximo de 50 caracteres' })
  nombre: string;
}
