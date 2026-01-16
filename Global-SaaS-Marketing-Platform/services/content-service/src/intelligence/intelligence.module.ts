import { Module } from '@nestjs/common';
import { IntelligenceController } from './intelligence.controller';
import { TopicService } from './topic.service';
import { ClusterService } from './cluster.service';
import { PerformanceService } from './performance.service';
import { AIService } from './ai.service';

@Module({
  controllers: [IntelligenceController],
  providers: [TopicService, ClusterService, PerformanceService, AIService],
  exports: [TopicService, ClusterService, PerformanceService, AIService],
})
export class IntelligenceModule {}
