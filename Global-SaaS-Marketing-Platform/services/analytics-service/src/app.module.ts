import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AttributionModule } from './attribution/attribution.module';
import { BehaviorModule } from './behavior/behavior.module';
import { HealthModule } from './health/health.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    CommonModule,
    EventsModule,
    AnalyticsModule,
    AttributionModule,
    BehaviorModule,
    HealthModule,
  ],
})
export class AppModule {}
