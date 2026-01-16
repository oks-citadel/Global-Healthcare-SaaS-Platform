import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { BedrockProvider } from '../../providers/bedrock.provider';

@Module({
  controllers: [ContentController],
  providers: [ContentService, BedrockProvider],
  exports: [ContentService],
})
export class ContentModule {}
