import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { PrismaService } from 'src/common/prisma.service';
 

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [QrController],
  providers: [QrService, JwtAuthGuard, PrismaService],
  exports: [QrService],
})
export class QrModule {}