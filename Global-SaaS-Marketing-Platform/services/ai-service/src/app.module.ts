import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma.module';
import { RedisModule } from './common/redis.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ChurnModule } from './modules/churn/churn.module';
import { ExpansionModule } from './modules/expansion/expansion.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { SeoModule } from './modules/seo/seo.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { ContentModule } from './modules/content/content.module';
import { BedrockProvider } from './providers/bedrock.provider';
import { SageMakerProvider } from './providers/sagemaker.provider';

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
    LeadsModule,
    ChurnModule,
    ExpansionModule,
    CampaignsModule,
    SeoModule,
    RecommendationsModule,
    ContentModule,
  ],
  providers: [BedrockProvider, SageMakerProvider],
  exports: [BedrockProvider, SageMakerProvider],
})
export class AppModule {}
