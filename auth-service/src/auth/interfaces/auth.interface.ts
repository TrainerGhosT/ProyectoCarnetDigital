import { HttpStatus } from "@nestjs/common";

export interface AuthResponse {
  expires_in: string;
  access_token: string;
  refresh_token: string;
  usuarioID?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  tipoUsuario: string;
  iat?: number;
  exp?: number;
  userId?: string;
}

export interface RefreshTokenData {
  userId: string;
  email: string;
  tipoUsuario: string;
  createdAt: Date;
}

export interface ValidateResponse {
  validToken: boolean;
  statusHttp: HttpStatus;
  message?: string;

}