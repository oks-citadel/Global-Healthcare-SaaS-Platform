import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { PageSpeedQueryDto, PageSpeedResultDto } from '../../../common/dto';

interface PageSpeedOpportunity {
  id: string;
  title: string;
  description: string;
  savings: number;
  priority: 'high' | 'medium' | 'low';
}

interface PageSpeedDiagnostic {
  id: string;
  title: string;
  description: string;
  details?: any;
}

@Injectable()
export class PageSpeedService {
  private readonly logger = new Logger(PageSpeedService.name);
  private readonly apiKey?: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get('externalApis.googlePageSpeedApiKey');
  }

  /**
   * Get page speed diagnostics for a URL
   */
  async getPageSpeed(
    url: string,
    query: PageSpeedQueryDto,
  ): Promise<PageSpeedResultDto> {
    const strategy = query.strategy || 'mobile';
    const categories = query.categories || ['performance', 'accessibility', 'best-practices', 'seo'];

    // In production with API key, call Google PageSpeed Insights API
    if (this.apiKey) {
      return this.callPageSpeedApi(url, strategy, categories);
    }

    // Simulate results for development
    return this.simulatePageSpeed(url, strategy);
  }

  /**
   * Call Google PageSpeed Insights API
   */
  private async callPageSpeedApi(
    url: string,
    strategy: string,
    categories: string[],
  ): Promise<PageSpeedResultDto> {
    try {
      const categoryParams = categories.map((c) => `category=${c}`).join('&');
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&${categoryParams}&key=${this.apiKey}`;

      const response = await this.httpService.axiosRef.get(apiUrl);
      const data = response.data;

      const lighthouseResult = data.lighthouseResult;
      const audits = lighthouseResult.audits;

      // Extract scores
      const scores = {
        performance: Math.round((lighthouseResult.categories.performance?.score || 0) * 100),
        accessibility: Math.round((lighthouseResult.categories.accessibility?.score || 0) * 100),
        bestPractices: Math.round((lighthouseResult.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((lighthouseResult.categories.seo?.score || 0) * 100),
      };

      // Extract metrics
      const metrics = {
        firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
        largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
        totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
        cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
        speedIndex: audits['speed-index']?.numericValue || 0,
        interactive: audits['interactive']?.numericValue || 0,
      };

      // Extract opportunities
      const opportunities: PageSpeedOpportunity[] = [];
      const opportunityAudits = [
        'render-blocking-resources',
        'unused-css-rules',
        'unused-javascript',
        'modern-image-formats',
        'offscreen-images',
        'unminified-css',
        'unminified-javascript',
        'efficient-animated-content',
        'uses-responsive-images',
      ];

      for (const auditId of opportunityAudits) {
        const audit = audits[auditId];
        if (audit && audit.score !== null && audit.score < 1) {
          opportunities.push({
            id: auditId,
            title: audit.title,
            description: audit.description,
            savings: audit.numericValue || 0,
            priority: this.getPriority(audit.score),
          });
        }
      }

      // Extract diagnostics
      const diagnostics: PageSpeedDiagnostic[] = [];
      const diagnosticAudits = [
        'dom-size',
        'critical-request-chains',
        'largest-contentful-paint-element',
        'layout-shift-elements',
        'long-tasks',
        'third-party-summary',
        'main-thread-work-breakdown',
        'bootup-time',
      ];

      for (const auditId of diagnosticAudits) {
        const audit = audits[auditId];
        if (audit) {
          diagnostics.push({
            id: auditId,
            title: audit.title,
            description: audit.description,
            details: audit.details,
          });
        }
      }

      return {
        url,
        strategy,
        scores,
        metrics,
        opportunities: opportunities.sort((a, b) => b.savings - a.savings),
        diagnostics,
        fetchTime: new Date(),
      };
    } catch (error) {
      this.logger.error(`PageSpeed API error for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Simulate PageSpeed results
   */
  private async simulatePageSpeed(
    url: string,
    strategy: string,
  ): Promise<PageSpeedResultDto> {
    const isMobile = strategy === 'mobile';
    const baseScore = isMobile ? 65 : 75;

    const scores = {
      performance: baseScore + Math.round(Math.random() * 25),
      accessibility: 75 + Math.round(Math.random() * 20),
      bestPractices: 80 + Math.round(Math.random() * 15),
      seo: 85 + Math.round(Math.random() * 10),
    };

    const multiplier = isMobile ? 1.3 : 1;

    const metrics = {
      firstContentfulPaint: Math.round((1200 + Math.random() * 1500) * multiplier),
      largestContentfulPaint: Math.round((2000 + Math.random() * 2000) * multiplier),
      totalBlockingTime: Math.round((200 + Math.random() * 400) * multiplier),
      cumulativeLayoutShift: Math.round(Math.random() * 0.2 * 1000) / 1000,
      speedIndex: Math.round((2500 + Math.random() * 2000) * multiplier),
      interactive: Math.round((3500 + Math.random() * 2500) * multiplier),
    };

    const opportunities: PageSpeedOpportunity[] = [
      {
        id: 'render-blocking-resources',
        title: 'Eliminate render-blocking resources',
        description: 'Resources are blocking the first paint of your page.',
        savings: Math.round(500 + Math.random() * 1500),
        priority: 'high',
      },
      {
        id: 'unused-css-rules',
        title: 'Remove unused CSS',
        description: 'Reduce unused rules from stylesheets and defer CSS not used for above-the-fold content.',
        savings: Math.round(200 + Math.random() * 800),
        priority: 'medium',
      },
      {
        id: 'unused-javascript',
        title: 'Remove unused JavaScript',
        description: 'Reduce unused JavaScript and defer loading scripts until they are required.',
        savings: Math.round(300 + Math.random() * 1000),
        priority: 'high',
      },
      {
        id: 'modern-image-formats',
        title: 'Serve images in modern formats',
        description: 'Image formats like WebP and AVIF often provide better compression than PNG or JPEG.',
        savings: Math.round(100 + Math.random() * 500),
        priority: 'medium',
      },
      {
        id: 'offscreen-images',
        title: 'Defer offscreen images',
        description: 'Consider lazy-loading offscreen and hidden images after all critical resources have finished loading.',
        savings: Math.round(200 + Math.random() * 600),
        priority: 'low',
      },
    ];

    const diagnostics: PageSpeedDiagnostic[] = [
      {
        id: 'dom-size',
        title: 'Avoid an excessive DOM size',
        description: 'A large DOM can increase memory usage, cause longer style calculations, and produce costly layout reflows.',
        details: { elements: Math.round(500 + Math.random() * 1000) },
      },
      {
        id: 'main-thread-work-breakdown',
        title: 'Minimize main-thread work',
        description: 'Consider reducing the time spent parsing, compiling and executing JS.',
        details: { totalTime: Math.round(2000 + Math.random() * 2000) },
      },
      {
        id: 'bootup-time',
        title: 'Reduce JavaScript execution time',
        description: 'Consider reducing the time spent parsing, compiling, and executing JS.',
        details: { totalTime: Math.round(1500 + Math.random() * 1500) },
      },
    ];

    return {
      url,
      strategy,
      scores,
      metrics,
      opportunities: opportunities.sort((a, b) => b.savings - a.savings),
      diagnostics,
      fetchTime: new Date(),
    };
  }

  /**
   * Get priority based on score
   */
  private getPriority(score: number): 'high' | 'medium' | 'low' {
    if (score < 0.5) return 'high';
    if (score < 0.9) return 'medium';
    return 'low';
  }

  /**
   * Compare page speed between two URLs or time periods
   */
  async comparePageSpeed(
    url1: string,
    url2?: string,
    strategy: string = 'mobile',
  ): Promise<{
    comparison: {
      url1: { url: string; scores: any };
      url2?: { url: string; scores: any };
      differences: Record<string, number>;
    };
  }> {
    const result1 = await this.getPageSpeed(url1, { strategy } as PageSpeedQueryDto);

    let result2;
    if (url2) {
      result2 = await this.getPageSpeed(url2, { strategy } as PageSpeedQueryDto);
    }

    const differences: Record<string, number> = {};

    if (result2) {
      differences.performance = result2.scores.performance - result1.scores.performance;
      differences.accessibility = result2.scores.accessibility - result1.scores.accessibility;
      differences.bestPractices = result2.scores.bestPractices - result1.scores.bestPractices;
      differences.seo = result2.scores.seo - result1.scores.seo;
    }

    return {
      comparison: {
        url1: { url: result1.url, scores: result1.scores },
        url2: result2 ? { url: result2.url, scores: result2.scores } : undefined,
        differences,
      },
    };
  }
}
