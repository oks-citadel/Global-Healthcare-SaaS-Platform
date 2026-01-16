import { Module } from '@nestjs/common';
import { TrialConversionController } from './trial-conversion.controller';
import { TrialConversionService } from './trial-conversion.service';

@Module({
  controllers: [TrialConversionController],
  providers: [TrialConversionService],
  exports: [TrialConversionService],
})
export class TrialConversionModule {}
