import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { FunnelService } from './services/funnel.service';
import { CohortService } from './services/cohort.service';
import { RetentionService } from './services/retention.service';
import { LtvService } from './services/ltv.service';
import { ChurnService } from './services/churn.service';
import { SessionService } from './services/session.service';

@Module({
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    FunnelService,
    CohortService,
    RetentionService,
    LtvService,
    ChurnService,
    SessionService,
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
