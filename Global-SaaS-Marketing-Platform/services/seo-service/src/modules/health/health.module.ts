import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { HealthService } from './health.service';
import { MetricsService } from './metrics.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController, MetricsController],
  providers: [HealthService, MetricsService],
  exports: [HealthService, MetricsService],
})
export class HealthModule {}
