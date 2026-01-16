import { Module } from '@nestjs/common';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';
import { BedrockProvider } from '../../providers/bedrock.provider';

@Module({
  controllers: [SeoController],
  providers: [SeoService, BedrockProvider],
  exports: [SeoService],
})
export class SeoModule {}
