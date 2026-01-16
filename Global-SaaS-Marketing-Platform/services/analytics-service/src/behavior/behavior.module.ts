import { Module } from '@nestjs/common';
import { BehaviorController } from './behavior.controller';
import { BehaviorService } from './behavior.service';
import { HeatmapService } from './services/heatmap.service';
import { RecordingService } from './services/recording.service';
import { ScrollmapService } from './services/scrollmap.service';
import { ClickmapService } from './services/clickmap.service';

@Module({
  controllers: [BehaviorController],
  providers: [
    BehaviorService,
    HeatmapService,
    RecordingService,
    ScrollmapService,
    ClickmapService,
  ],
  exports: [BehaviorService],
})
export class BehaviorModule {}
