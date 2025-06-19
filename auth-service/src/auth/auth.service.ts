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

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly externalUserService: ExternalUserService,
    private readonly externalCatalogService: ExternalCatalogService,
  ) {
    this.jwtExpiresIn =
      this.configService.get<string>('JWT_EXPIRES_IN') || '5m';
    this.refreshTokenExpiresIn =
      parseInt(this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN')) ||
      900; // 15 min
    this.initRedis();
  }

  private async initRedis() {
    try {
      this.redisClient = createClient({
        socket: {
          host: this.configService.get<string>('REDIS_HOST') || 'localhost',
          port: parseInt(this.configService.get<string>('REDIS_PORT')) || 6379,
        },
      });
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

      // 2. Validar contraseña
      const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
      console.log('password valid: ', isPasswordValid);
      if (!isPasswordValid) {
        throw new HttpException(
          'Usuario y/o contraseña incorrectos',
          HttpStatus.UNAUTHORIZED,
        );
      }

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

      // 5. Validar que el usuario esté activo
      if (user.estadoUsuario !== 1) {
        throw new HttpException('Usuario inactivo', HttpStatus.UNAUTHORIZED);
      }

      // 6. Generar tokens
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
      const expiresIn =
        decoded.exp && decoded.iat
          ? decoded.exp - decoded.iat
          : this.calculateExpirationTime();

      const refreshToken = await this.generateRefreshToken(
        user.idUsuario,
        user.correo,
        tipoUsuarioData.nombre,
      );

      // 7. Calcular tiempo de expiración

      return {
        expires_in: expiresIn,
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
      // 1. Verificar que el refresh token existe en Redis
      const storedData = await this.redisClient.get(`refresh_token:${refresh_token}`);
      
      if (!storedData) {
        throw new HttpException('No autorizado', HttpStatus.UNAUTHORIZED);
      }

      // 2. Parsear datos del refresh token
      const refreshTokenData: RefreshTokenData = JSON.parse(storedData);

      // 3. Generar nuevo access token
      const payload: JwtPayload = {
        sub: refreshTokenData.userId,
        email: refreshTokenData.email,
        tipoUsuario: refreshTokenData.tipoUsuario,
      };

      const newAccessToken = this.jwtService.sign(payload);
      
      // 4. Generar nuevo refresh token
      const newRefreshToken = await this.generateRefreshToken(
        refreshTokenData.userId,
        refreshTokenData.email,
        refreshTokenData.tipoUsuario
      );

      // 5. Eliminar el refresh token anterior
      await this.redisClient.del(`refresh_token:${refresh_token}`);

      // 6. Calcular tiempo de expiración
      const expiresIn = this.calculateExpirationTime();

      return {
        expires_in: expiresIn,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error('Error en refresh:', error);
      throw new HttpException(
        'No autorizado',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async validate(validateDto: ValidateDto): Promise<boolean> {
    const { token } = validateDto;

    try {
      // Verificar y decodificar el token
      this.jwtService.verify(token);
      
      // Verificar que el token no esté en la lista negra (opcional)
      const isBlacklisted = await this.redisClient.get(`blacklist:${token}`);
      
      if (isBlacklisted) {
        return false;
      }

      return true;
    } catch (error) {
      this.logger.warn('Token inválido:', error.message);
      return false;
    }
  }

  private async generateRefreshToken(userId: string, email: string, tipoUsuario: string): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { userId, email, tipoUsuario },
      { expiresIn: `${this.refreshTokenExpiresIn}s` }
    );

    // Almacenar en Redis con TTL
    const refreshTokenData: RefreshTokenData = {
      userId,
      email,
      tipoUsuario,
      createdAt: new Date(),
    };

    await this.redisClient.setEx(
      `refresh_token:${refreshToken}`,
      this.refreshTokenExpiresIn,
      JSON.stringify(refreshTokenData)
    );

    return refreshToken;
  }

  private calculateExpirationTime(): number {
    const expiresIn = this.jwtExpiresIn;
    
    // Convertir a segundos
    if (expiresIn.endsWith('m')) {
      return parseInt(expiresIn) * 60;
    } else if (expiresIn.endsWith('h')) {
      return parseInt(expiresIn) * 3600;
    } else if (expiresIn.endsWith('s')) {
      return parseInt(expiresIn);
    } else {
      return 300; // 5 minutos por defecto
    }
  }
}
