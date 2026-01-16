import { Module } from '@nestjs/common';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { BedrockProvider } from '../../providers/bedrock.provider';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService, BedrockProvider],
  exports: [CampaignsService],
})
export class CampaignsModule {}
