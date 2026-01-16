import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ReactionsModule } from './modules/reactions/reactions.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { SocialModule } from './modules/social/social.module';
import { PrismaModule } from './common/prisma.module';
import { RedisModule } from './common/redis.module';
import { HealthModule } from './common/health.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Scheduling for cron jobs
    ScheduleModule.forRoot(),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Database and Cache
    PrismaModule,
    RedisModule,

    // Feature modules
    PostsModule,
    CommentsModule,
    ReactionsModule,
    ModerationModule,
    SocialModule,

    // Health checks
    HealthModule,
  ],
})
export class AppModule {}
