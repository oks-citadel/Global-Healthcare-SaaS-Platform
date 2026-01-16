import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VitalsController } from './controllers/vitals.controller';
import { PageSpeedController } from './controllers/pagespeed.controller';
import { MobileFriendlyController } from './controllers/mobile-friendly.controller';
import { AccessibilityController } from './controllers/accessibility.controller';
import { IndexCoverageController } from './controllers/index-coverage.controller';
import { CanonicalController } from './controllers/canonical.controller';
import { HreflangController } from './controllers/hreflang.controller';
import { VitalsService } from './services/vitals.service';
import { PageSpeedService } from './services/pagespeed.service';
import { MobileFriendlyService } from './services/mobile-friendly.service';
import { AccessibilityService } from './services/accessibility.service';
import { IndexCoverageService } from './services/index-coverage.service';
import { CanonicalService } from './services/canonical.service';
import { HreflangService } from './services/hreflang.service';

@Module({
  imports: [HttpModule],
  controllers: [
    VitalsController,
    PageSpeedController,
    MobileFriendlyController,
    AccessibilityController,
    IndexCoverageController,
    CanonicalController,
    HreflangController,
  ],
  providers: [
    VitalsService,
    PageSpeedService,
    MobileFriendlyService,
    AccessibilityService,
    IndexCoverageService,
    CanonicalService,
    HreflangService,
  ],
  exports: [
    VitalsService,
    PageSpeedService,
    MobileFriendlyService,
    AccessibilityService,
    IndexCoverageService,
    CanonicalService,
    HreflangService,
  ],
})
export class TechnicalModule {}
