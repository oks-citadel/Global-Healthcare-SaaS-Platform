import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { SegmentsModule } from './modules/segments/segments.module';
import { TraitsModule } from './modules/traits/traits.module';
import { PersonalizationEngineModule } from './modules/personalization-engine/personalization-engine.module';
import { ExperimentsModule } from './modules/experiments/experiments.module';
import { FeatureFlagsModule } from './modules/feature-flags/feature-flags.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './config/redis.module';
import { DynamoDBModule } from './config/dynamodb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    RedisModule,
    DynamoDBModule,
    ProfilesModule,
    SegmentsModule,
    TraitsModule,
    PersonalizationEngineModule,
    ExperimentsModule,
    FeatureFlagsModule,
  ],
})
export class AppModule {}
