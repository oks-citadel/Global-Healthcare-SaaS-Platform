import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './common/prisma.module';
import { RedisModule } from './common/redis.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { NpsModule } from './modules/nps/nps.module';
import { CsatModule } from './modules/csat/csat.module';
import { BadgesModule } from './modules/badges/badges.module';
import { MentionsModule } from './modules/mentions/mentions.module';
import { RatingsModule } from './modules/ratings/ratings.module';

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
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    ReviewsModule,
    TestimonialsModule,
    NpsModule,
    CsatModule,
    BadgesModule,
    MentionsModule,
    RatingsModule,
  ],
})
export class AppModule {}
