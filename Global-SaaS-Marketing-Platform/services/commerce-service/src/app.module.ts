import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UpsellCrosssellModule } from './modules/upsell-crosssell/upsell-crosssell.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { PricingExperimentsModule } from './modules/pricing-experiments/pricing-experiments.module';
import { InappMessagesModule } from './modules/inapp-messages/inapp-messages.module';
import { TrialConversionModule } from './modules/trial-conversion/trial-conversion.module';
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
    UpsellCrosssellModule,
    PromotionsModule,
    PricingExperimentsModule,
    InappMessagesModule,
    TrialConversionModule,
  ],
})
export class AppModule {}
