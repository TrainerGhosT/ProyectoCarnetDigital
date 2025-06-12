export interface AuthResponse {
  expires_in: number;
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
}

export interface RefreshTokenData {
  userId: string;
  email: string;
  tipoUsuario: string;
  createdAt: Date;
}