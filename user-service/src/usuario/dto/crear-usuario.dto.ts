import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  
  ValidateNested,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TelefonoDto {
  @ApiProperty({ description: 'Número de teléfono', example: '88887777' })
  @IsString({ message: 'El número debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El número de teléfono no puede estar vacío' })
  @Matches(/^\d+$/, { message: 'El teléfono solo puede contener números' })
  @MinLength(8, { message: 'El teléfono debe tener al menos 8 dígitos' })
  @MaxLength(20, { message: 'El teléfono no puede tener más de 20 dígitos' })
  numero: string;

  @ApiProperty({ description: 'Tipo de teléfono (1=móvil, 2=fijo, etc.)', example: 1 })
  @IsInt({ message: 'El tipo de teléfono debe ser un número entero' })
  tipo: number;
}

export class CrearUsuarioDto {
  @ApiProperty({ 
    description: 'Email del usuario (debe ser de dominio cuc.cr o cuc.ac.cr)',
    example: 'estudiante@cuc.cr'
  })
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  @Matches(/@(cuc\.cr|cuc\.ac\.cr)$/, {
    message: 'El email debe ser del dominio cuc.cr o cuc.ac.cr',
  })
  correo: string;

  @ApiProperty({ description: 'ID del tipo de identificación', example: 1 })
  @IsInt({ message: 'El tipo de identificación debe ser un número entero' })
  tipoIdentificacion: number;

  @ApiProperty({ description: 'Número de identificación', example: '123456789' })
  @IsString({ message: 'La identificación debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La identificación es requerida' })
  @MaxLength(50, { message: 'La identificación no puede tener más de 50 caracteres' })
  identificacion: string;

  @ApiProperty({ description: 'Nombre completo del usuario', example: 'Juan Pérez González' })
  @IsString({ message: 'El nombre completo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  @MaxLength(100, { message: 'El nombre completo no puede tener más de 100 caracteres' })
  nombreCompleto: string;

  @ApiProperty({ description: 'Contraseña del usuario (mínimo 8 caracteres)', example: 'MiPassword123!' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(255, { message: 'La contraseña no puede tener más de 255 caracteres' })
  contrasena: string;

  @ApiProperty({ 
    description: 'Tipo de usuario (1=estudiante, 2=funcionario, 3=administrador)', 
    example: 1 
  })
  @IsInt({ message: 'El tipo de usuario debe ser un número entero' })
  tipoUsuario: number;

  @ApiPropertyOptional({ 
    description: 'IDs de carreras asociadas (requerido para estudiantes)',
    type: [Number],
    example: [1, 2]
  })
  @IsOptional()
  @IsArray({ message: 'Las carreras deben ser un array' })
  @IsInt({ each: true, message: 'Cada carrera debe ser un número entero' })
  carreras?: number[];

  @ApiPropertyOptional({ 
    description: 'IDs de áreas asociadas (requerido para funcionarios)',
    type: [Number],
    example: [1]
  })
  @IsOptional()
  @IsArray({ message: 'Las áreas deben ser un array' })
  @IsInt({ each: true, message: 'Cada área debe ser un número entero' })
  areas?: number[];

  @ApiPropertyOptional({ 
    description: 'Teléfonos de contacto (opcionales)',
    type: [TelefonoDto],
  })
  @IsOptional()
  @IsArray({ message: 'Los teléfonos deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => TelefonoDto)
  telefonos?: TelefonoDto[];
}