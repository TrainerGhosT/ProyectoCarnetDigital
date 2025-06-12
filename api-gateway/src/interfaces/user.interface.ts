import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class UsuarioDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tipoIdentificacion: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  identificacion: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombreCompleto: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  contraseña: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tipoUsuario: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  carreras?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  areas?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  telefonos?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fotografia?: string;
}

export class UsuarioFiltrosDto {
  @IsOptional()
  @IsString()
  identificacion?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  tipo?: string;
}