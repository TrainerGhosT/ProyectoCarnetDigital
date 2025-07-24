import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createClient } from 'redis';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ValidateDto } from './dto/validate.dto';
import {
  AuthResponse,
  JwtPayload,
  RefreshTokenData,
} from './interfaces/auth.interface';
import { ExternalUserService } from '../external/user.service';
import { ExternalCatalogService } from '../external/catalog.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private redisClient;
  private readonly jwtExpiresIn: string;
  private readonly refreshTokenExpiresIn: number;
  private readonly refreshSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly externalUserService: ExternalUserService,
    private readonly externalCatalogService: ExternalCatalogService,
  ) {
    this.jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '300s';
    this.refreshTokenExpiresIn = this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN') || 900;
    // Use a separate secret for refresh tokens
    this.refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET')
      || this.configService.get<string>('JWT_SECRET');
    this.initRedis();
  }

  private async initRedis() {
    try {
      this.redisClient = createClient({
        url: this.configService.get<string>('REDIS_URL'),
      })
      await this.redisClient.connect();
      this.logger.log('Conexión a Redis establecida');
    } catch (error) {
      this.logger.error('Error conectando a Redis:', error);
      throw new HttpException(
        'Error de configuración del servicio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
  const { correo, contrasena, tipoUsuario } = loginDto;

  try {
    // 1. Buscar usuario por correo usando el microservicio de usuario
    const user = await this.externalUserService.findUserByEmail(correo);
    console.log('user', user);

    if (!user) {
      throw new HttpException(
        'Usuario y/o contraseña incorrectos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Verificar si el usuario está bloqueado
    if (user.estadoUsuario !== 1) {
      throw new HttpException('Usuario inactivo o bloqueado', HttpStatus.UNAUTHORIZED);
    }

    // 2. Validar contraseña
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    console.log('password valid: ', isPasswordValid);

    if (!isPasswordValid) {
      // Incrementar intentos fallidos en Redis
      const redisKey = `intentos_fallidos:${correo}`;
      const intentosFallidos = (await this.redisClient.get(redisKey)) || 0;
      const nuevosIntentos = parseInt(intentosFallidos) + 1;

      if (nuevosIntentos >= 3) {
        // Consultar el estado bloqueado desde el catálogo
        const estadoBloqueado = await this.externalCatalogService.getEstadoBloqueado();

        console.log('estadoBloqueado:', estadoBloqueado);
        // Actualizar estado del usuario a bloqueado
        await this.externalUserService.updateUser(user.idUsuario, {
          intentos_fallidos: nuevosIntentos,
          estadoUsuario: estadoBloqueado,
        });

        // Limpiar intentos fallidos en Redis
        await this.redisClient.del(redisKey);

        throw new HttpException(
          'Usuario y/o contraseña incorrectos, contacte con el administrador',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Actualizar intentos fallidos en Redis
      await this.redisClient.set(redisKey, nuevosIntentos);

      throw new HttpException(
        'Usuario y/o contraseña incorrectos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Reiniciar intentos fallidos en Redis si el login es exitoso
    const redisKey = `intentos_fallidos:${correo}`;
    await this.redisClient.del(redisKey);

    // 3. Consultar el nombre del tipo de usuario usando el microservicio de catálogo
    const tipoUsuarioData =
      await this.externalCatalogService.getTipoUsuarioById(user.tipoUsuario);

    console.log('tipoUsuarioData', tipoUsuarioData);

    // 4. Validar que el tipo de usuario coincida
    if (
      !tipoUsuarioData ||
      !tipoUsuarioData.nombre ||
      tipoUsuarioData.nombre.toLowerCase() !== tipoUsuario.toLowerCase()
    ) {
      throw new HttpException(
        'Usuario y/o contraseña incorrectos',
        HttpStatus.UNAUTHORIZED,
      );
    }


    // 5. Generar tokens
    const payload: JwtPayload = {
      sub: user.idUsuario,
      email: user.correo,
      tipoUsuario: tipoUsuarioData.nombre,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtExpiresIn,
    });
    const decoded: any = this.jwtService.decode(accessToken);

    // Calcula expires_in correctamente
    const expiresAt = decoded.exp
      ? new Date(decoded.exp * 1000).toLocaleString('es-CR', {
          timeZone: 'America/Costa_Rica',
        })
      : null;

    const refreshToken = await this.generateRefreshToken(
      user.idUsuario,
      user.correo,
      tipoUsuarioData.nombre,
    );

    return {
      expires_in: expiresAt,
      access_token: accessToken,
      refresh_token: refreshToken,
      usuarioID: user.idUsuario,
    };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    this.logger.error('Error en login:', error);
    throw new HttpException(
      'Error interno del servidor',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

   async refresh(refreshDto: RefreshDto): Promise<Omit<AuthResponse, 'usuarioID'>> {
    const { refresh_token } = refreshDto;
    try {
      // 1. Verificar firma y expiración del refresh token con el secreto dedicado
      let payload: JwtPayload;
      try {
        payload = this.jwtService.verify(refresh_token, { secret: this.refreshSecret });
      } catch (err) {
        this.logger.warn('Refresh token inválido o expirado');
        throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
      }

      // 2. Verificar que el token exista en Redis
      const storedData = await this.redisClient.get(`refresh_token:${refresh_token}`);
      if (!storedData) {
        throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
      }
      const refreshTokenData: RefreshTokenData = JSON.parse(storedData);

      // 3. Generar nuevo access token
      const newAccessToken = this.jwtService.sign(
        { sub: payload.userId, email: payload.email, tipoUsuario: payload.tipoUsuario },
        { expiresIn: this.jwtExpiresIn }
      );
      const decoded: any = this.jwtService.decode(newAccessToken);
      const expiresAt = decoded.exp
        ? new Date(decoded.exp * 1000).toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' })
        : null;

      // 4. Generar nuevo refresh token y limpiar anterior
      await this.redisClient.del(`refresh_token:${refresh_token}`);
      const newRefreshToken = await this.generateRefreshToken(
        refreshTokenData.userId,
        refreshTokenData.email,
        refreshTokenData.tipoUsuario,
      );

      return {
        expires_in: expiresAt,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error en refresh:', error);
      throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
    }
  }

  async validate(validateDto: ValidateDto): Promise<boolean> {
    const { token } = validateDto;
    try {
      this.jwtService.verify(token); // Verifica expiración y firma con JWT_SECRET
      const isBlacklisted = await this.redisClient.get(`blacklist:${token}`);
      return !isBlacklisted;
    } catch (error) {
      this.logger.warn('Token inválido o expirado:', error.message);
      return false;
    }
  }

  private async generateRefreshToken(
  userId: string,
  email: string,
  tipoUsuario: string,
): Promise<string> {
  const refreshToken = this.jwtService.sign(
    { userId, email, tipoUsuario },
    { expiresIn: `${this.refreshTokenExpiresIn}s`, secret: this.refreshSecret },
  );
  const now = new Date( Date.now());
  const expiresAt = new Date(now.getTime() + this.refreshTokenExpiresIn * 1000);
  const refreshTokenData: RefreshTokenData & { expiresAt: string } = {
    userId,
    email,
    tipoUsuario,
    createdAt: now,
    expiresAt: expiresAt.toLocaleString('es-CR', { timeZone: 'America/Costa_Rica' }),
  };
  await this.redisClient.setEx(
    `refresh_token:${refreshToken}`,
    this.refreshTokenExpiresIn,
    JSON.stringify(refreshTokenData),
  );
  return refreshToken;
}
}