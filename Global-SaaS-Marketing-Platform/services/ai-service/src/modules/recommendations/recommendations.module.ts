import { Module } from '@nestjs/common';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { BedrockProvider } from '../../providers/bedrock.provider';

@Module({
  controllers: [RecommendationsController],
  providers: [RecommendationsService, BedrockProvider],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
