import { Module } from '@nestjs/common';
import { AttributionController } from './attribution.controller';
import { AttributionService } from './attribution.service';
import { JourneyService } from './services/journey.service';
import { TouchpointService } from './services/touchpoint.service';
import { AttributionModelService } from './services/attribution-model.service';

@Module({
  controllers: [AttributionController],
  providers: [
    AttributionService,
    JourneyService,
    TouchpointService,
    AttributionModelService,
  ],
  exports: [AttributionService],
})
export class AttributionModule {}
