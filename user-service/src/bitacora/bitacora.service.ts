import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CrearBitacoraDto } from './dto/crear-bitacora.dto';

@Injectable()
export class BitacoraService {
  private readonly logger = new Logger(BitacoraService.name);
  constructor(private readonly prisma: PrismaService) {}

  async Crear(bitacora: CrearBitacoraDto) {
    const bitacoraData = await this.prisma.bitacora.create({ data: bitacora });

    return bitacoraData;
  }

  async ObtenerTodos() {

    return await this.prisma.bitacora.findMany();
   } 
}
