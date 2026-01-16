import { Module } from '@nestjs/common';
import { PricingExperimentsController } from './pricing-experiments.controller';
import { PricingExperimentsService } from './pricing-experiments.service';

@Module({
  controllers: [PricingExperimentsController],
  providers: [PricingExperimentsService],
  exports: [PricingExperimentsService],
})
export class PricingExperimentsModule {}
