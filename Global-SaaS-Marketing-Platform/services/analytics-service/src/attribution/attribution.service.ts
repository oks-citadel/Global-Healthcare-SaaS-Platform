import { Injectable } from '@nestjs/common';
import { AttributionModelService } from './services/attribution-model.service';
import { JourneyService } from './services/journey.service';
import { TouchpointService } from './services/touchpoint.service';
import {
  AttributionQueryDto,
  AttributionResultDto,
  AttributionModelDto,
  JourneyQueryDto,
  JourneyResultDto,
  TouchpointQueryDto,
  TouchpointResultDto,
} from './dto/attribution.dto';

@Injectable()
export class AttributionService {
  constructor(
    private readonly attributionModelService: AttributionModelService,
    private readonly journeyService: JourneyService,
    private readonly touchpointService: TouchpointService,
  ) {}

  async calculateAttribution(query: AttributionQueryDto): Promise<AttributionResultDto> {
    return this.attributionModelService.calculateAttribution(query);
  }

  getAvailableModels(): AttributionModelDto[] {
    return this.attributionModelService.getAvailableModels();
  }

  async getCustomerJourneys(query: JourneyQueryDto): Promise<JourneyResultDto> {
    return this.journeyService.getCustomerJourneys(query);
  }

  async analyzeTouchpoints(query: TouchpointQueryDto): Promise<TouchpointResultDto> {
    return this.touchpointService.analyzeTouchpoints(query);
  }
}
