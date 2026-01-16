import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import * as redisStore from 'cache-manager-redis-store';

import { PrismaModule } from './prisma/prisma.module';
import { ListsModule } from './lists/lists.module';
import { SegmentsModule } from './segments/segments.module';
import { TriggersModule } from './triggers/triggers.module';
import { FlowsModule } from './flows/flows.module';
import { EventsModule } from './events/events.module';
import { EmailModule } from './email/email.module';
import { HealthModule } from './common/health/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Schedule for cron jobs
    ScheduleModule.forRoot(),

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
    ListsModule,
    SegmentsModule,
    TriggersModule,
    FlowsModule,
    EventsModule,
    EmailModule,

    // Health check
    HealthModule,
  ],
})
export class AppModule {}
