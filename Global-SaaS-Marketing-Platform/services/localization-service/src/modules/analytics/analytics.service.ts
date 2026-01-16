import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly CACHE_TTL = 300;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getRegionalAnalytics(
    tenantId: string,
    options: {
      startDate?: Date;
      endDate?: Date;
      region?: string;
      locale?: string;
      groupBy?: 'day' | 'week' | 'month';
    } = {},
  ) {
    const cacheKey = `analytics:${tenantId}:${JSON.stringify(options)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: Record<string, unknown> = { tenantId };
    if (options.region) where.region = options.region;
    if (options.locale) where.locale = options.locale;
    if (options.startDate || options.endDate) {
      where.date = {};
      if (options.startDate) (where.date as Record<string, Date>).gte = options.startDate;
      if (options.endDate) (where.date as Record<string, Date>).lte = options.endDate;
    }

    const analytics = await this.prisma.regionalAnalytics.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    // Aggregate by region
    const byRegion: Record<
      string,
      {
        visitors: number;
        pageViews: number;
        sessions: number;
        conversions: number;
        revenue: number;
      }
    > = {};

    for (const a of analytics) {
      if (!byRegion[a.region]) {
        byRegion[a.region] = {
          visitors: 0,
          pageViews: 0,
          sessions: 0,
          conversions: 0,
          revenue: 0,
        };
      }
      byRegion[a.region].visitors += a.visitors;
      byRegion[a.region].pageViews += a.pageViews;
      byRegion[a.region].sessions += a.sessions;
      byRegion[a.region].conversions += a.conversions;
      byRegion[a.region].revenue += a.revenue;
    }

    // Aggregate by locale
    const byLocale: Record<
      string,
      {
        visitors: number;
        pageViews: number;
        conversions: number;
        conversionRate: number;
      }
    > = {};

    for (const a of analytics) {
      if (!byLocale[a.locale]) {
        byLocale[a.locale] = {
          visitors: 0,
          pageViews: 0,
          conversions: 0,
          conversionRate: 0,
        };
      }
      byLocale[a.locale].visitors += a.visitors;
      byLocale[a.locale].pageViews += a.pageViews;
      byLocale[a.locale].conversions += a.conversions;
    }

    // Calculate conversion rates
    for (const locale of Object.keys(byLocale)) {
      const data = byLocale[locale];
      data.conversionRate =
        data.visitors > 0
          ? Math.round((data.conversions / data.visitors) * 10000) / 100
          : 0;
    }

    // Overall totals
    const totals = {
      visitors: analytics.reduce((sum, a) => sum + a.visitors, 0),
      pageViews: analytics.reduce((sum, a) => sum + a.pageViews, 0),
      sessions: analytics.reduce((sum, a) => sum + a.sessions, 0),
      conversions: analytics.reduce((sum, a) => sum + a.conversions, 0),
      revenue: analytics.reduce((sum, a) => sum + a.revenue, 0),
    };

    const result = {
      totals,
      byRegion,
      byLocale,
      topRegions: Object.entries(byRegion)
        .sort((a, b) => b[1].visitors - a[1].visitors)
        .slice(0, 10)
        .map(([region, data]) => ({ region, ...data })),
      topLocales: Object.entries(byLocale)
        .sort((a, b) => b[1].visitors - a[1].visitors)
        .slice(0, 10)
        .map(([locale, data]) => ({ locale, ...data })),
    };

    await this.redis.set(cacheKey, result, this.CACHE_TTL);
    return result;
  }

  async recordAnalytics(
    tenantId: string,
    dto: {
      date: Date;
      region: string;
      locale: string;
      visitors: number;
      pageViews: number;
      sessions: number;
      conversions: number;
      revenue: number;
      currencyCode: string;
      metadata?: Record<string, unknown>;
    },
  ) {
    const analytics = await this.prisma.regionalAnalytics.upsert({
      where: {
        tenantId_date_region_locale: {
          tenantId,
          date: dto.date,
          region: dto.region,
          locale: dto.locale,
        },
      },
      update: {
        visitors: { increment: dto.visitors },
        pageViews: { increment: dto.pageViews },
        sessions: { increment: dto.sessions },
        conversions: { increment: dto.conversions },
        revenue: { increment: dto.revenue },
      },
      create: {
        tenantId,
        date: dto.date,
        region: dto.region,
        locale: dto.locale,
        visitors: dto.visitors,
        pageViews: dto.pageViews,
        sessions: dto.sessions,
        conversions: dto.conversions,
        revenue: dto.revenue,
        currencyCode: dto.currencyCode,
        metadata: dto.metadata || {},
      },
    });

    await this.redis.invalidatePattern(`analytics:${tenantId}:*`);

    return analytics;
  }
}
