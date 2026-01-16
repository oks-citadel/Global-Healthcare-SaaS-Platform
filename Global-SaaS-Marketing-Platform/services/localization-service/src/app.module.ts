import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma.module';
import { RedisModule } from './common/redis.module';
import { I18nModule } from './modules/i18n/i18n.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { GeoModule } from './modules/geo/geo.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    RedisModule,
    I18nModule,
    PricingModule,
    GeoModule,
    ComplianceModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
