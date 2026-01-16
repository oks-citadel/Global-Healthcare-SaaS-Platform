import { Module } from '@nestjs/common';
import { UpsellCrosssellController } from './upsell-crosssell.controller';
import { UpsellCrosssellService } from './upsell-crosssell.service';

@Module({
  controllers: [UpsellCrosssellController],
  providers: [UpsellCrosssellService],
  exports: [UpsellCrosssellService],
})
export class UpsellCrosssellModule {}
