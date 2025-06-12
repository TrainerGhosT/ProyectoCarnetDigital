export interface UserFromService {
  idUsuario: string;
  correo: string;
  contrasena: string;
  tipoUsuario: number;
  nombreCompleto: string;
  identificacion: string;
  estadoUsuario: number;
}

export interface TipoUsuario {
  idTipoUsuario: number;
  nombre: string;
}