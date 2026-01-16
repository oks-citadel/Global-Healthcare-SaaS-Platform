import { Injectable } from '@nestjs/common';
import { HeatmapService } from './services/heatmap.service';
import { RecordingService } from './services/recording.service';
import { ScrollmapService } from './services/scrollmap.service';
import { ClickmapService } from './services/clickmap.service';
import {
  HeatmapQueryDto,
  HeatmapResultDto,
  RecordingQueryDto,
  RecordingResultDto,
  ScrollmapQueryDto,
  ScrollmapResultDto,
  ClickmapQueryDto,
  ClickmapResultDto,
} from './dto/behavior.dto';

@Injectable()
export class BehaviorService {
  constructor(
    private readonly heatmapService: HeatmapService,
    private readonly recordingService: RecordingService,
    private readonly scrollmapService: ScrollmapService,
    private readonly clickmapService: ClickmapService,
  ) {}

  async getHeatmapData(query: HeatmapQueryDto): Promise<HeatmapResultDto> {
    return this.heatmapService.getHeatmapData(query);
  }

  async getRecordings(query: RecordingQueryDto): Promise<RecordingResultDto> {
    return this.recordingService.getRecordings(query);
  }

  async getScrollmapData(query: ScrollmapQueryDto): Promise<ScrollmapResultDto> {
    return this.scrollmapService.getScrollmapData(query);
  }

  async getClickmapData(query: ClickmapQueryDto): Promise<ClickmapResultDto> {
    return this.clickmapService.getClickmapData(query);
  }
}
