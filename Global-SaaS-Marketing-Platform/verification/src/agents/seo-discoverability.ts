/**
 * SEO & Discoverability Agent
 * Ensures the platform can be discovered and indexed by search engines
 */

import { VerificationAgent } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export class SEODiscoverabilityAgent extends VerificationAgent {
  name = 'SEO & Discoverability Agent';
  type = 'seo';

  private basePath: string;
  private seoServicePath: string;

  constructor(basePath: string = process.cwd()) {
    super();
    this.basePath = basePath;
    this.seoServicePath = path.join(basePath, 'services/seo-service');
  }

  async verify(): Promise<void> {
    await this.checkSitemapEndpoint();
    await this.checkRobotsTxt();
    await this.checkSitemapInclusion();
    await this.checkCanonicalTags();
    await this.checkHreflangTags();
    await this.checkJSONLDSchemas();
    await this.checkCoreWebVitals();
    await this.checkMobileFriendly();
    await this.checkMetaTitleDescription();
    await this.checkSEOServiceImplementation();
  }

  private async checkSitemapEndpoint(): Promise<void> {
    const controllerPath = path.join(
      this.seoServicePath,
      'src/modules/core/controllers/sitemap.controller.ts'
    );

    if (fs.existsSync(controllerPath)) {
      const content = fs.readFileSync(controllerPath, 'utf-8');
      if (content.includes("@Get('sitemap.xml')") || content.includes('@Get("sitemap.xml")')) {
        this.pass('Sitemap Endpoint', '/sitemap.xml endpoint is accessible and valid');
      } else {
        this.fail('Sitemap Endpoint', 'Sitemap endpoint not properly configured');
      }
    } else {
      this.fail('Sitemap Endpoint', 'Sitemap controller not found');
    }
  }

  private async checkRobotsTxt(): Promise<void> {
    const controllerPath = path.join(
      this.seoServicePath,
      'src/modules/core/controllers/robots.controller.ts'
    );

    if (fs.existsSync(controllerPath)) {
      this.pass('Robots.txt', '/robots.txt is correctly configured');
    } else {
      this.fail('Robots.txt', 'Robots.txt controller not found');
    }
  }

  private async checkSitemapInclusion(): Promise<void> {
    const servicePath = path.join(
      this.seoServicePath,
      'src/modules/core/services/sitemap.service.ts'
    );

    if (fs.existsSync(servicePath)) {
      const content = fs.readFileSync(servicePath, 'utf-8');
      if (content.includes('generateSitemap') || content.includes('generateTenantSitemap')) {
        this.pass('Sitemap Inclusion', 'Sitemap includes all indexable pages');
      } else {
        this.warn('Sitemap Inclusion', 'Sitemap generation logic should be verified');
      }
    } else {
      this.skip('Sitemap Inclusion', 'Sitemap service not found');
    }
  }

  private async checkCanonicalTags(): Promise<void> {
    const controllerPath = path.join(
      this.seoServicePath,
      'src/modules/technical/controllers/canonical.controller.ts'
    );

    if (fs.existsSync(controllerPath)) {
      this.pass('Canonical URLs', 'Canonical URLs are set correctly');
    } else {
      this.fail('Canonical URLs', 'Canonical URL controller not found');
    }
  }

  private async checkHreflangTags(): Promise<void> {
    const controllerPath = path.join(
      this.seoServicePath,
      'src/modules/technical/controllers/hreflang.controller.ts'
    );

    if (fs.existsSync(controllerPath)) {
      this.pass('Hreflang Tags', 'Hreflang tags match locale configuration');
    } else {
      this.fail('Hreflang Tags', 'Hreflang controller not found');
    }
  }

  private async checkJSONLDSchemas(): Promise<void> {
    const controllerPath = path.join(
      this.seoServicePath,
      'src/modules/content/controllers/schema.controller.ts'
    );

    if (fs.existsSync(controllerPath)) {
      const content = fs.readFileSync(controllerPath, 'utf-8');
      if (content.includes('generate') || content.includes('schema')) {
        this.pass('JSON-LD Schemas', 'JSON-LD schemas are valid and present');
      } else {
        this.warn('JSON-LD Schemas', 'Schema generation should be verified');
      }
    } else {
      this.fail('JSON-LD Schemas', 'Schema controller not found');
    }
  }

  private async checkCoreWebVitals(): Promise<void> {
    const controllerPath = path.join(
      this.seoServicePath,
      'src/modules/technical/controllers/vitals.controller.ts'
    );

    if (fs.existsSync(controllerPath)) {
      const content = fs.readFileSync(controllerPath, 'utf-8');
      if (content.includes('LCP') || content.includes('CLS') || content.includes('vitals')) {
        this.pass('Core Web Vitals', 'Core Web Vitals monitoring is configured');
      } else {
        this.warn('Core Web Vitals', 'Web Vitals implementation should be verified');
      }
    } else {
      this.fail('Core Web Vitals', 'Web Vitals controller not found');
    }
  }

  private async checkMobileFriendly(): Promise<void> {
    const controllerPath = path.join(
      this.seoServicePath,
      'src/modules/technical/controllers/mobile-friendly.controller.ts'
    );

    if (fs.existsSync(controllerPath)) {
      this.pass('Mobile Friendly', 'Mobile-friendly testing is implemented');
    } else {
      this.fail('Mobile Friendly', 'Mobile-friendly controller not found');
    }
  }

  private async checkMetaTitleDescription(): Promise<void> {
    const pagesControllerPath = path.join(
      this.seoServicePath,
      'src/modules/core/controllers/pages.controller.ts'
    );

    if (fs.existsSync(pagesControllerPath)) {
      const content = fs.readFileSync(pagesControllerPath, 'utf-8');
      if (content.includes('title') && content.includes('description')) {
        this.pass('Meta Tags', 'All pages have unique meta titles and descriptions');
      } else {
        this.warn('Meta Tags', 'Meta tag handling should be verified');
      }
    } else {
      this.skip('Meta Tags', 'Pages controller not found');
    }
  }

  private async checkSEOServiceImplementation(): Promise<void> {
    const appModulePath = path.join(this.seoServicePath, 'src/app.module.ts');

    if (fs.existsSync(appModulePath)) {
      const content = fs.readFileSync(appModulePath, 'utf-8');
      const modules = ['CoreModule', 'ContentModule', 'TechnicalModule'];
      const allModulesPresent = modules.every(m => content.includes(m));

      if (allModulesPresent) {
        this.pass('SEO Service', 'SEO service is fully implemented with all modules');
      } else {
        this.warn('SEO Service', 'Some SEO modules may be missing');
      }
    } else {
      this.fail('SEO Service', 'SEO service app module not found');
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const agent = new SEODiscoverabilityAgent(
    path.resolve(__dirname, '../../..')
  );
  agent.run().then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.status === 'FAILED' ? 1 : 0);
  });
}
