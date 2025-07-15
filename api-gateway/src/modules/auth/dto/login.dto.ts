import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'Email del usuario',
    example: 'juan.perez@cuc.cr' 
  })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @Matches(/(cuc\.cr|cuc\.ac\.cr)$/, { 
    message: 'El email debe ser de dominio cuc.cr o cuc.ac.cr' 
  })
  correo: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario',
    example: 'password123' 
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  contrasena: string;

  @ApiProperty({ 
    description: 'Tipo de usuario',
    example: 'estudiante' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El tipo de usuario es requerido' })
  tipoUsuario: string;
}