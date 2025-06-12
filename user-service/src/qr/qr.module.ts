import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QrController } from './qr.controller';
import { QrService } from './qr.service';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [QrController],
  providers: [QrService, AuthGuard],
  exports: [QrService],
})
export class QrModule {}