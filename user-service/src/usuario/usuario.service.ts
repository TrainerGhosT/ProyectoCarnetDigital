import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { FiltrarUsuarioDto } from './dto/filtrar-usuario.dto';
import * as bcrypt from 'bcryptjs';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);
  private readonly catalogServiceUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogServiceUrl = this.configService.get<string>(
      'CATALOG_SERVICE_URL',
      'http://localhost:3002',
    );
  }

  async crearUsuario(crearUsuarioDto: CrearUsuarioDto) {
    // Validar email y dominio
    this.validarEmailYDominio(
      crearUsuarioDto.correo,
      crearUsuarioDto.tipoUsuario,
    );

    // Validar que los tipos existan en catalog-service
    await this.validarTiposEnCatalog(
      crearUsuarioDto.tipoUsuario,
      crearUsuarioDto.tipoIdentificacion,
    );

    // Validar carreras/áreas según tipo de usuario
    await this.validarCarrerasOAreas(crearUsuarioDto);

    // Encriptar contraseña
    const contrasenaEncriptada = await this.encriptarContrasena(
      crearUsuarioDto.contrasena,
    );

    try {
      // Usar transacción para crear usuario con relaciones
      const usuario = await this.prisma.$transaction(async (tx) => {
        // Crear usuario
        const nuevoUsuario = await tx.usuarios.create({
          data: {
            correo: crearUsuarioDto.correo,
            tipoIdentificacion: crearUsuarioDto.tipoIdentificacion,
            identificacion: crearUsuarioDto.identificacion,
            nombreCompleto: crearUsuarioDto.nombreCompleto,
            contrasena: contrasenaEncriptada,
            tipoUsuario: crearUsuarioDto.tipoUsuario,
            estadoUsuario: 1, // Activo por defecto
          },
        });

        // Agregar carreras si es estudiante
        if (crearUsuarioDto.carreras && crearUsuarioDto.carreras.length > 0) {
          await tx.usuarioCarreras.createMany({
            data: crearUsuarioDto.carreras.map((carreraId) => ({
              usuario: nuevoUsuario.idUsuario,
              carrera: carreraId,
            })),
          });
        }

        // Agregar áreas si es funcionario
        if (crearUsuarioDto.areas && crearUsuarioDto.areas.length > 0) {
          await tx.usuarioAreas.createMany({
            data: crearUsuarioDto.areas.map((areaId) => ({
              usuario: nuevoUsuario.idUsuario,
              area: areaId,
            })),
          });
        }

        // Agregar teléfonos si existen
        if (crearUsuarioDto.telefonos && crearUsuarioDto.telefonos.length > 0) {
          await tx.usuarioTelefonos.createMany({
            data: crearUsuarioDto.telefonos.map((telefono) => ({
              usuario: nuevoUsuario.idUsuario,
              numero: telefono.numero,
            })),
          });
        }

        return nuevoUsuario;
      });

      // Obtener usuario completo con relaciones
      return await this.obtenerUsuarioCompleto(usuario.idUsuario);
    } catch (error) {
      this.logger.error('Error al crear usuario', error);
      throw error;
    }
  }

  async actualizarUsuario(
    id: string,
    actualizarUsuarioDto: ActualizarUsuarioDto,
  ) {
    // Verificar que el usuario existe
    const usuarioExistente = await this.prisma.usuarios.findUnique({
      where: { idUsuario: id },
    });

    if (!usuarioExistente) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    // Validar email y dominio si se está actualizando
    if (actualizarUsuarioDto.correo) {
      this.validarEmailYDominio(
        actualizarUsuarioDto.correo,
        actualizarUsuarioDto.tipoUsuario || usuarioExistente.tipoUsuario,
      );
    }

    // Validar tipos si se están actualizando
    if (
      actualizarUsuarioDto.tipoUsuario ||
      actualizarUsuarioDto.tipoIdentificacion
    ) {
      await this.validarTiposEnCatalog(
        actualizarUsuarioDto.tipoUsuario || usuarioExistente.tipoUsuario,
        actualizarUsuarioDto.tipoIdentificacion ||
          usuarioExistente.tipoIdentificacion,
      );
    }

    // Encriptar contraseña si se está actualizando
    let contrasenaEncriptada;
    if (actualizarUsuarioDto.contrasena) {
      contrasenaEncriptada = await this.encriptarContrasena(
        actualizarUsuarioDto.contrasena,
      );
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        // Actualizar datos básicos del usuario
        await tx.usuarios.update({
          where: { idUsuario: id },
          data: {
            ...(actualizarUsuarioDto.correo && {
              correo: actualizarUsuarioDto.correo,
            }),
            ...(actualizarUsuarioDto.tipoIdentificacion && {
              tipoIdentificacion: actualizarUsuarioDto.tipoIdentificacion,
            }),
            ...(actualizarUsuarioDto.identificacion && {
              identificacion: actualizarUsuarioDto.identificacion,
            }),
            ...(actualizarUsuarioDto.nombreCompleto && {
              nombreCompleto: actualizarUsuarioDto.nombreCompleto,
            }),
            ...(contrasenaEncriptada && { contrasena: contrasenaEncriptada }),
            ...(actualizarUsuarioDto.tipoUsuario && {
              tipoUsuario: actualizarUsuarioDto.tipoUsuario,
            }),
          },
        });

        // Actualizar carreras si se proporcionan
        if (actualizarUsuarioDto.carreras !== undefined) {
          await tx.usuarioCarreras.deleteMany({ where: { usuario: id } });
          if (actualizarUsuarioDto.carreras.length > 0) {
            await tx.usuarioCarreras.createMany({
              data: actualizarUsuarioDto.carreras.map((carreraId) => ({
                usuario: id,
                carrera: carreraId,
              })),
            });
          }
        }

        // Actualizar áreas si se proporcionan
        if (actualizarUsuarioDto.areas !== undefined) {
          await tx.usuarioAreas.deleteMany({ where: { usuario: id } });
          if (actualizarUsuarioDto.areas.length > 0) {
            await tx.usuarioAreas.createMany({
              data: actualizarUsuarioDto.areas.map((areaId) => ({
                usuario: id,
                area: areaId,
              })),
            });
          }
        }

        // Actualizar teléfonos si se proporcionan
        if (actualizarUsuarioDto.telefonos !== undefined) {
          await tx.usuarioTelefonos.deleteMany({ where: { usuario: id } });
          if (actualizarUsuarioDto.telefonos.length > 0) {
            await tx.usuarioTelefonos.createMany({
              data: actualizarUsuarioDto.telefonos.map((telefono) => ({
                usuario: id,
                numero: telefono.numero,
              })),
            });
          }
        }
      });

      return await this.obtenerUsuarioCompleto(id);
    } catch (error) {
      this.logger.error('Error al actualizar usuario', error);
      throw error;
    }
  }

  async eliminarUsuario(id: string) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { idUsuario: id },
    });

    if (!usuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    try {
      // El cascade delete se encarga de eliminar las relaciones
      await this.prisma.usuarios.delete({
        where: { idUsuario: id },
      });
    } catch (error) {
      this.logger.error('Error al eliminar usuario', error);
      throw new HttpException(
        'Error al eliminar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async obtenerUsuarios(filtros: FiltrarUsuarioDto) {
    const where: any = {};
    
    

    if (filtros.identificacion) {
      where.identificacion = {
        contains: filtros.identificacion,
        mode: 'insensitive',
      };
    }

    if (filtros.nombre) {
      where.nombreCompleto = {
        contains: filtros.nombre,
        mode: 'insensitive'
      };
    }

    if (filtros.tipo) {
      where.tipoUsuario = parseInt(filtros.tipo);
    }

    const usuarios = await this.prisma.usuarios.findMany({
      where,
      select: {
        idUsuario: true,
        correo: true,
        tipoIdentificacion: true,
        identificacion: true,
        nombreCompleto: true,
        contrasena: true,
        tipoUsuario: true,
        estadoUsuario: true,
        carreras: {
          select: {
            carrera: true,
          },
        },
        areas: {
          select: {
            area: true,
          },
        },
        telefonos: {
          select: {
            numero: true,
          },
        },
      },
    });

    if (usuarios.length === 0) {
      throw new HttpException('No se encontraron usuarios con los datos proporcionados', HttpStatus.NOT_FOUND);
    } 

    return usuarios;
  }

  async obtenerUsuarioPorId(id: string) {
    const usuario = await this.obtenerUsuarioCompleto(id);

    if (!usuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return usuario;
  }

  private async obtenerUsuarioCompleto(id: string) {
    return await this.prisma.usuarios.findUnique({
      where: { idUsuario: id },
      select: {
        idUsuario: true,
        correo: true,
        tipoIdentificacion: true,
        identificacion: true,
        nombreCompleto: true,
        tipoUsuario: true,
        estadoUsuario: true,
        carreras: {
          select: {
            carrera: true,
          },
        },
        areas: {
          select: {
            area: true,
          },
        },
        telefonos: {
          select: {
            numero: true,
          },
        },
      },
    });
  }

  private validarEmailYDominio(email: string, tipoUsuario: number) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpException(
        'Formato de email inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    const domain = email.split('@')[1];
    const dominiosPermitidos = ['cuc.cr', 'cuc.ac.cr'];

    if (!dominiosPermitidos.includes(domain)) {
      throw new HttpException(
        'Solo se permiten emails de dominios cuc.cr o cuc.ac.cr',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validar consistencia dominio-tipo de usuario
    // Asumiendo: 1=estudiante, 2=funcionario, 3=administrador
    if (domain === 'cuc.cr' && tipoUsuario !== 1) {
      throw new HttpException(
        'Los emails del dominio cuc.cr solo pueden ser para estudiantes',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (domain === 'cuc.ac.cr' && ![2, 3].includes(tipoUsuario)) {
      throw new HttpException(
        'Los emails del dominio cuc.ac.cr solo pueden ser para funcionarios o administradores',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async encriptarContrasena(contrasena: string): Promise<string> {
    const saltRounds = this.configService.get<number>('SALT_ROUNDS') || 10;
    return await bcrypt.hash(contrasena, saltRounds);
  }

  private async validarTiposEnCatalog(
    idtipoUsuario: number,
    idtipoIdentificacion: number,
  ) {
    try {
      // Validar tipo de usuario
      await firstValueFrom(
        this.httpService.get(
          `${this.catalogServiceUrl}/tiposusuario/${idtipoUsuario}`,
        ),
      );

      // Validar tipo de identificación
      await firstValueFrom(
        this.httpService.get(
          `${this.catalogServiceUrl}/tiposidentificacion/${idtipoIdentificacion}`,
        ),
      );
    } catch (error) {
      this.logger.error('Error al validar tipos en catalog-service', error);
      throw new HttpException(
        'Tipo de usuario o Tipo de identificación inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async validarCarrerasOAreas(crearUsuarioDto: CrearUsuarioDto) {
    const { tipoUsuario, carreras, areas } = crearUsuarioDto;

    if (tipoUsuario === 1) {
      // Estudiante: solo carreras, no áreas
      if (!carreras || carreras.length === 0) {
        throw new HttpException(
          'Los estudiantes deben tener al menos una carrera asociada',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (areas && areas.length > 0) {
        throw new HttpException(
          'Los estudiantes no pueden tener áreas asociadas',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Validar que las carreras existan
      try {
        for (const carreraId of carreras) {
          await firstValueFrom(
            this.httpService.get(
              `${this.catalogServiceUrl}/carrera/${carreraId}`,
            ),
          );
        }
      } catch (error) {
        throw new HttpException(
          'Una o más carreras no existen',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (tipoUsuario === 2) {
      // Funcionario: puede tener carreras y/o áreas, pero debe tener al menos un área
      if (
        (!areas || areas.length === 0) &&
        (!carreras || carreras.length === 0)
      ) {
        throw new HttpException(
          'Los funcionarios deben tener al menos un área o carrera asociada',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (areas && areas.length > 0) {
        try {
          for (const areaId of areas) {
            await firstValueFrom(
              this.httpService.get(`${this.catalogServiceUrl}/areas/${areaId}`),
            );
          }
        } catch (error) {
          throw new HttpException(
            'Una o más áreas no existen',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      if (carreras && carreras.length > 0) {
        try {
          for (const carreraId of carreras) {
            await firstValueFrom(
              this.httpService.get(
                `${this.catalogServiceUrl}/carrera/${carreraId}`,
              ),
            );
          }
        } catch (error) {
          throw new HttpException(
            'Una o más carreras no existen',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    } else if (tipoUsuario === 3) {
      // Administrador: solo áreas, no carreras
      if (!areas || areas.length === 0) {
        throw new HttpException(
          'Los administradores deben tener al menos un área asociada',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (carreras && carreras.length > 0) {
        throw new HttpException(
          'Los administradores no pueden tener carreras asociadas',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Validar que las áreas existan
      try {
        for (const areaId of areas) {
          await firstValueFrom(
            this.httpService.get(`${this.catalogServiceUrl}/areas/${areaId}`),
          );
        }
      } catch (error) {
        throw new HttpException(
          'Una o más áreas no existen',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
