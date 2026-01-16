import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { BedrockProvider } from '../../providers/bedrock.provider';
import { SageMakerProvider } from '../../providers/sagemaker.provider';

@Module({
  controllers: [LeadsController],
  providers: [LeadsService, BedrockProvider, SageMakerProvider],
  exports: [LeadsService],
})
export class LeadsModule {}
