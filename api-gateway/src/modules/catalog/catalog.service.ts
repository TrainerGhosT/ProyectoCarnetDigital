import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TipoUsuario, TipoIdentificacion, Carrera, Area } from '../../interfaces/catalog.interface';

@Injectable()
export class CatalogService {
  private readonly catalogServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogServiceUrl = this.configService.get<string>('services.catalog');
  }

  // Tipos de Usuario
  async createTipoUsuario(tipoUsuario: TipoUsuario, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/tiposusuario`, tipoUsuario, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al crear tipo de usuario',
        error.response?.status || 500
      );
    }
  }

  async updateTipoUsuario(id: string, tipoUsuario: TipoUsuario, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.catalogServiceUrl}/tiposusuario/${id}`, tipoUsuario, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al actualizar tipo de usuario',
        error.response?.status || 500
      );
    }
  }

  async deleteTipoUsuario(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.catalogServiceUrl}/tiposusuario/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al eliminar tipo de usuario',
        error.response?.status || 500
      );
    }
  }

  async getAllTiposUsuario(authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/tiposusuario`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener tipos de usuario',
        error.response?.status || 500
      );
    }
  }

  async getTipoUsuarioById(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/tiposusuario/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener tipo de usuario',
        error.response?.status || 500
      );
    }
  }

  // Tipos de Identificación
  async createTipoIdentificacion(tipoIdentificacion: TipoIdentificacion, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/tiposidentificacion`, tipoIdentificacion, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al crear tipo de identificación',
        error.response?.status || 500
      );
    }
  }

  async updateTipoIdentificacion(id: string, tipoIdentificacion: TipoIdentificacion, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.catalogServiceUrl}/tiposidentificacion/${id}`, tipoIdentificacion, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al actualizar tipo de identificación',
        error.response?.status || 500
      );
    }
  }

  async deleteTipoIdentificacion(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.catalogServiceUrl}/tiposidentificacion/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al eliminar tipo de identificación',
        error.response?.status || 500
      );
    }
  }

  async getAllTiposIdentificacion(authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/tiposidentificacion`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener tipos de identificación',
        error.response?.status || 500
      );
    }
  }

  async getTipoIdentificacionById(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/tiposidentificacion/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener tipo de identificación',
        error.response?.status || 500
      );
    }
  }

  // Carreras
  async createCarrera(carrera: Carrera, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/carreras`, carrera, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al crear carrera',
        error.response?.status || 500
      );
    }
  }

  async updateCarrera(id: string, carrera: Carrera, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.catalogServiceUrl}/carreras/${id}`, carrera, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al actualizar carrera',
        error.response?.status || 500
      );
    }
  }

  async deleteCarrera(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.catalogServiceUrl}/carreras/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al eliminar carrera',
        error.response?.status || 500
      );
    }
  }

  async getAllCarreras(authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/carreras`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener carreras',
        error.response?.status || 500
      );
    }
  }

  async getCarreraById(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/carreras/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener carrera',
        error.response?.status || 500
      );
    }
  }

  // Áreas
  async createArea(area: Area, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/areas`, area, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al crear área',
        error.response?.status || 500
      );
    }
  }

  async updateArea(id: string, area: Area, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.catalogServiceUrl}/areas/${id}`, area, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al actualizar área',
        error.response?.status || 500
      );
    }
  }

  async deleteArea(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.catalogServiceUrl}/areas/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al eliminar área',
        error.response?.status || 500
      );
    }
  }

  async getAllAreas(authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/areas`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener áreas',
        error.response?.status || 500
      );
    }
  }

  async getAreaById(id: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/areas/${id}`, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al obtener área',
        error.response?.status || 500
      );
    }
  }

  // Estados de Usuario
  async changeUserState(data: { usuarioId: string; estadoId: string }, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(`${this.catalogServiceUrl}/usuarios/estado`, data, {
          headers: { Authorization: authHeader }
        })
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error al cambiar estado de usuario',
        error.response?.status || 500
      );
    }
  }
}