import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { PrismaHealthIndicator } from './indicators/prisma.health';
import { RedisHealthIndicator } from './indicators/redis.health';
import { OpenSearchHealthIndicator } from './indicators/opensearch.health';
import { MetricsService } from './metrics.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController, MetricsController],
  providers: [
    PrismaHealthIndicator,
    RedisHealthIndicator,
    OpenSearchHealthIndicator,
    MetricsService,
  ],
  exports: [MetricsService],
})
export class HealthModule {}
