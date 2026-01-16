import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { KeywordsController } from './controllers/keywords.controller';
import { ContentOptimizeController } from './controllers/content-optimize.controller';
import { LinksController } from './controllers/links.controller';
import { FreshnessController } from './controllers/freshness.controller';
import { SchemaController } from './controllers/schema.controller';
import { KeywordsService } from './services/keywords.service';
import { ContentOptimizeService } from './services/content-optimize.service';
import { LinksService } from './services/links.service';
import { FreshnessService } from './services/freshness.service';
import { SchemaService } from './services/schema.service';

@Module({
  imports: [HttpModule],
  controllers: [
    KeywordsController,
    ContentOptimizeController,
    LinksController,
    FreshnessController,
    SchemaController,
  ],
  providers: [
    KeywordsService,
    ContentOptimizeService,
    LinksService,
    FreshnessService,
    SchemaService,
  ],
  exports: [
    KeywordsService,
    ContentOptimizeService,
    LinksService,
    FreshnessService,
    SchemaService,
  ],
})
export class ContentModule {}
