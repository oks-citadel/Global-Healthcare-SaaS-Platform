import { Module } from '@nestjs/common';
import { ExpansionController } from './expansion.controller';
import { ExpansionService } from './expansion.service';
import { BedrockProvider } from '../../providers/bedrock.provider';
import { SageMakerProvider } from '../../providers/sagemaker.provider';

@Module({
  controllers: [ExpansionController],
  providers: [ExpansionService, BedrockProvider, SageMakerProvider],
  exports: [ExpansionService],
})
export class ExpansionModule {}
