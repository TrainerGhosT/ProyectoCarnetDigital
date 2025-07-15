import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ActualizarTipoUsuarioDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  nombre: string;
}