import { Module } from '@nestjs/common';
import { LandingController, CroController } from './landing.controller';
import { LandingService } from './landing.service';

@Module({
  controllers: [LandingController, CroController],
  providers: [LandingService],
  exports: [LandingService],
})
export class LandingModule {}
