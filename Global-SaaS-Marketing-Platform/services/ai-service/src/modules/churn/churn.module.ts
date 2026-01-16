import { Module } from '@nestjs/common';
import { ChurnController } from './churn.controller';
import { ChurnService } from './churn.service';
import { BedrockProvider } from '../../providers/bedrock.provider';
import { SageMakerProvider } from '../../providers/sagemaker.provider';

@Module({
  controllers: [ChurnController],
  providers: [ChurnService, BedrockProvider, SageMakerProvider],
  exports: [ChurnService],
})
export class ChurnModule {}
