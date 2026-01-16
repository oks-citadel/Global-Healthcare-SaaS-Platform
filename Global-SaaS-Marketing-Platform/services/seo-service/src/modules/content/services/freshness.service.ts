import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { ContentFreshnessQueryDto, ContentFreshnessItemDto } from '../../../common/dto';
import { SeoConfig } from '../../../config/configuration';

@Injectable()
export class FreshnessService {
  private readonly logger = new Logger(FreshnessService.name);
  private readonly seoConfig: SeoConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.seoConfig = this.configService.get<SeoConfig>('seo')!;
  }

  /**
   * Get content freshness analysis
   */
  async getContentFreshness(query: ContentFreshnessQueryDto): Promise<{
    items: ContentFreshnessItemDto[];
    summary: {
      total: number;
      fresh: number;
      aging: number;
      stale: number;
      outdated: number;
      avgAge: number;
    };
  }> {
    const where: any = { isPublished: true };

    // Filter by tenant
    if (query.tenant) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: query.tenant },
      });
      if (tenant) {
        where.tenantId = tenant.id;
      }
    }

    // Filter by age range
    const now = new Date();
    if (query.minAge) {
      const maxDate = new Date(now.getTime() - query.minAge * 24 * 60 * 60 * 1000);
      where.lastModified = { ...(where.lastModified || {}), lte: maxDate };
    }
    if (query.maxAge) {
      const minDate = new Date(now.getTime() - query.maxAge * 24 * 60 * 60 * 1000);
      where.lastModified = { ...(where.lastModified || {}), gte: minDate };
    }

    // Get pages
    const pages = await this.prisma.page.findMany({
      where,
      orderBy: { lastModified: 'asc' }, // Oldest first
      take: query.limit || 100,
      include: {
        tenant: { select: { domain: true } },
      },
    });

    // Map to freshness items
    const items: ContentFreshnessItemDto[] = pages.map((page) => {
      const contentAge = this.calculateAge(page.lastModified);
      const freshnessStatus = this.getFreshnessStatus(contentAge);
      const decayScore = query.includeDecayScore
        ? this.calculateDecayScore(contentAge, page.changeFrequency)
        : undefined;

      return {
        url: `https://${page.tenant.domain}/${page.slug}`,
        title: page.title,
        lastModified: page.lastModified,
        contentAge,
        decayScore,
        contentType: this.inferContentType(page.slug),
        freshnessStatus,
        recommendation: this.getRecommendation(freshnessStatus, page.changeFrequency),
      };
    });

    // Calculate summary
    const summary = this.calculateSummary(items);

    return { items, summary };
  }

  /**
   * Get pages that need updating
   */
  async getPagesNeedingUpdate(
    tenantId: string,
    limit = 20,
  ): Promise<ContentFreshnessItemDto[]> {
    const threshold = this.seoConfig.contentFreshnessThresholdDays;
    const cutoffDate = new Date(Date.now() - threshold * 24 * 60 * 60 * 1000);

    const pages = await this.prisma.page.findMany({
      where: {
        tenantId,
        isPublished: true,
        lastModified: { lt: cutoffDate },
      },
      orderBy: { lastModified: 'asc' },
      take: limit,
      include: {
        tenant: { select: { domain: true } },
      },
    });

    return pages.map((page) => {
      const contentAge = this.calculateAge(page.lastModified);
      const freshnessStatus = this.getFreshnessStatus(contentAge);

      return {
        url: `https://${page.tenant.domain}/${page.slug}`,
        title: page.title,
        lastModified: page.lastModified,
        contentAge,
        decayScore: this.calculateDecayScore(contentAge, page.changeFrequency),
        contentType: this.inferContentType(page.slug),
        freshnessStatus,
        recommendation: this.getRecommendation(freshnessStatus, page.changeFrequency),
      };
    });
  }

  /**
   * Analyze content decay patterns
   */
  async analyzeDecayPatterns(tenantId: string): Promise<{
    avgDecayRate: number;
    fastestDecaying: Array<{ url: string; decayScore: number }>;
    contentTypeDecay: Record<string, number>;
    recommendations: string[];
  }> {
    const pages = await this.prisma.page.findMany({
      where: { tenantId, isPublished: true },
      include: { tenant: { select: { domain: true } } },
    });

    // Calculate decay scores
    const pagesWithDecay = pages.map((page) => {
      const contentAge = this.calculateAge(page.lastModified);
      const decayScore = this.calculateDecayScore(contentAge, page.changeFrequency);
      const contentType = this.inferContentType(page.slug);

      return {
        url: `https://${page.tenant.domain}/${page.slug}`,
        decayScore,
        contentType,
        changeFrequency: page.changeFrequency,
      };
    });

    // Average decay rate
    const avgDecayRate = pagesWithDecay.length > 0
      ? pagesWithDecay.reduce((sum, p) => sum + p.decayScore, 0) / pagesWithDecay.length
      : 0;

    // Fastest decaying pages
    const fastestDecaying = pagesWithDecay
      .sort((a, b) => b.decayScore - a.decayScore)
      .slice(0, 10)
      .map((p) => ({ url: p.url, decayScore: p.decayScore }));

    // Decay by content type
    const contentTypeDecay: Record<string, { total: number; count: number }> = {};
    for (const page of pagesWithDecay) {
      if (!contentTypeDecay[page.contentType]) {
        contentTypeDecay[page.contentType] = { total: 0, count: 0 };
      }
      contentTypeDecay[page.contentType].total += page.decayScore;
      contentTypeDecay[page.contentType].count++;
    }

    const contentTypeDecayAvg: Record<string, number> = {};
    for (const [type, data] of Object.entries(contentTypeDecay)) {
      contentTypeDecayAvg[type] = Math.round((data.total / data.count) * 100) / 100;
    }

    // Generate recommendations
    const recommendations: string[] = [];

    if (avgDecayRate > 50) {
      recommendations.push('Consider implementing a regular content update schedule');
    }

    const highDecayTypes = Object.entries(contentTypeDecayAvg)
      .filter(([, score]) => score > 60)
      .map(([type]) => type);

    if (highDecayTypes.length > 0) {
      recommendations.push(
        `Prioritize updating ${highDecayTypes.join(', ')} content`,
      );
    }

    if (fastestDecaying.length > 0 && fastestDecaying[0].decayScore > 80) {
      recommendations.push('Some pages are severely outdated and should be updated immediately');
    }

    return {
      avgDecayRate: Math.round(avgDecayRate * 100) / 100,
      fastestDecaying,
      contentTypeDecay: contentTypeDecayAvg,
      recommendations,
    };
  }

  /**
   * Calculate content age in days
   */
  private calculateAge(lastModified: Date): number {
    const now = new Date();
    const diffMs = now.getTime() - lastModified.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Get freshness status based on age
   */
  private getFreshnessStatus(
    ageDays: number,
  ): 'fresh' | 'aging' | 'stale' | 'outdated' {
    if (ageDays < 30) return 'fresh';
    if (ageDays < 90) return 'aging';
    if (ageDays < 180) return 'stale';
    return 'outdated';
  }

  /**
   * Calculate decay score (0-100, higher = more decayed)
   */
  private calculateDecayScore(ageDays: number, changeFrequency: string): number {
    // Base decay based on age
    let decay = Math.min(100, ageDays / 3);

    // Adjust based on expected change frequency
    const frequencyDays: Record<string, number> = {
      ALWAYS: 1,
      HOURLY: 0.04,
      DAILY: 1,
      WEEKLY: 7,
      MONTHLY: 30,
      YEARLY: 365,
      NEVER: 9999,
    };

    const expectedDays = frequencyDays[changeFrequency] || 30;

    // If past expected update time, decay faster
    if (ageDays > expectedDays) {
      const overdueFactor = ageDays / expectedDays;
      decay = Math.min(100, decay * (1 + overdueFactor * 0.2));
    } else {
      // If within expected timeframe, reduce decay
      decay = decay * 0.8;
    }

    return Math.round(decay * 100) / 100;
  }

  /**
   * Infer content type from slug
   */
  private inferContentType(slug: string): string {
    const lowerSlug = slug.toLowerCase();

    if (lowerSlug.includes('blog') || lowerSlug.match(/^\d{4}/)) {
      return 'blog';
    }
    if (lowerSlug.includes('news')) {
      return 'news';
    }
    if (lowerSlug.includes('product')) {
      return 'product';
    }
    if (lowerSlug.includes('doc') || lowerSlug.includes('guide') || lowerSlug.includes('tutorial')) {
      return 'documentation';
    }
    if (lowerSlug.includes('faq') || lowerSlug.includes('help')) {
      return 'support';
    }
    if (lowerSlug.includes('about') || lowerSlug.includes('team') || lowerSlug.includes('contact')) {
      return 'company';
    }

    return 'page';
  }

  /**
   * Get recommendation based on freshness status
   */
  private getRecommendation(status: string, changeFrequency: string): string {
    switch (status) {
      case 'fresh':
        return 'Content is up to date';
      case 'aging':
        return 'Consider reviewing for accuracy';
      case 'stale':
        return changeFrequency === 'YEARLY' || changeFrequency === 'NEVER'
          ? 'Verify information is still accurate'
          : 'Content should be updated soon';
      case 'outdated':
        return 'Content needs immediate attention - update or archive';
      default:
        return '';
    }
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(items: ContentFreshnessItemDto[]): {
    total: number;
    fresh: number;
    aging: number;
    stale: number;
    outdated: number;
    avgAge: number;
  } {
    const statusCounts = {
      fresh: 0,
      aging: 0,
      stale: 0,
      outdated: 0,
    };

    let totalAge = 0;

    for (const item of items) {
      statusCounts[item.freshnessStatus as keyof typeof statusCounts]++;
      totalAge += item.contentAge;
    }

    return {
      total: items.length,
      ...statusCounts,
      avgAge: items.length > 0 ? Math.round(totalAge / items.length) : 0,
    };
  }
}
