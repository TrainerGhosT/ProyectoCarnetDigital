import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class CrearBitacoraDto {

    @IsString()
    @IsNotEmpty({ message: 'El id de usuario es requerido' })
    usuario: string; 

    @IsObject()
    @IsNotEmpty({ message: 'La descripción es requerida' })
    descripcion: string;
}