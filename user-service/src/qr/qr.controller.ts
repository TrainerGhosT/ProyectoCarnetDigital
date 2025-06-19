import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QrService } from './qr.service';
//import { AuthGuard } from './auth.guard';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiQuery } from '@nestjs/swagger';

class GetQrDto {
  @IsNotEmpty({ message: 'La identificación del usuario es requerida' })
  @IsString({ message: 'La identificación debe ser una cadena de texto' })
  identificacion: string;
}

@Controller('usuario')
//@UseGuards(AuthGuard)
export class QrController {
  constructor(private readonly qrService: QrService) {}

  /**
   * Endpoint GET /usuario/qr
   * Genera un código QR con la información del usuario
   * Recibe como parámetro query la identificación del usuario
   */
  @Get('qr/:identificacion')
  @ApiQuery({
    name: 'identificacion',
    required: true,
    description: 'Identificación del usuario',
  })
  async generateQrCode(@Query() query: GetQrDto) {
    try {
      const { identificacion } = query;

      if (!identificacion) {
        throw new HttpException(
          'La identificación del usuario es requerida',
          HttpStatus.BAD_REQUEST,
        );
      }

      const qrCodeBase64 =
        await this.qrService.generateUserQrCode(identificacion);

      return {
        success: true,
        message: 'Código QR generado exitosamente',
        data: {
          qrCode: qrCodeBase64,
          format: 'base64',
          identificacion,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error interno al generar el código QR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
