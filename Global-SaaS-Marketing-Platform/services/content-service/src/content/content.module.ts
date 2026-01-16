import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { VersionService } from './version.service';
import { PublishService } from './publish.service';

@Module({
  controllers: [ContentController],
  providers: [ContentService, VersionService, PublishService],
  exports: [ContentService, VersionService, PublishService],
})
export class ContentModule {}
