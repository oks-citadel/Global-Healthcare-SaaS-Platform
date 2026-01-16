import { Module } from '@nestjs/common';
import { SitemapController } from './controllers/sitemap.controller';
import { RobotsController } from './controllers/robots.controller';
import { ManifestController } from './controllers/manifest.controller';
import { PagesController } from './controllers/pages.controller';
import { ReindexController } from './controllers/reindex.controller';
import { AuditController } from './controllers/audit.controller';
import { SitemapService } from './services/sitemap.service';
import { RobotsService } from './services/robots.service';
import { ManifestService } from './services/manifest.service';
import { PagesService } from './services/pages.service';
import { ReindexService } from './services/reindex.service';
import { AuditService } from './services/audit.service';

@Module({
  controllers: [
    SitemapController,
    RobotsController,
    ManifestController,
    PagesController,
    ReindexController,
    AuditController,
  ],
  providers: [
    SitemapService,
    RobotsService,
    ManifestService,
    PagesService,
    ReindexService,
    AuditService,
  ],
  exports: [
    SitemapService,
    RobotsService,
    ManifestService,
    PagesService,
    ReindexService,
    AuditService,
  ],
})
export class CoreModule {}
