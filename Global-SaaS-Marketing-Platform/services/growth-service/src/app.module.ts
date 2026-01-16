import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import * as redisStore from 'cache-manager-redis-store';

import { PrismaModule } from './prisma/prisma.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { UtmModule } from './utm/utm.module';
import { LandingModule } from './landing/landing.module';
import { AbTestModule } from './ab-test/ab-test.module';
import { ReferralsModule } from './referrals/referrals.module';
import { AffiliatesModule } from './affiliates/affiliates.module';
import { RewardsModule } from './rewards/rewards.module';
import { HealthModule } from './common/health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Cache (Redis)
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      ttl: 300, // 5 minutes default
    }),

    // Bull Queue (Redis)
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),

    // Database
    PrismaModule,

    // Feature modules
    CampaignsModule,
    UtmModule,
    LandingModule,
    AbTestModule,
    ReferralsModule,
    AffiliatesModule,
    RewardsModule,

    // Health check
    HealthModule,
  ],
})
export class AppModule {}
