import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../common/services/cache.service';
import { Prisma } from '@prisma/client';

export interface PerformanceQueryDto {
  pageId?: string;
  startDate?: Date;
  endDate?: Date;
  groupBy?: 'day' | 'week' | 'month';
  page?: number;
  limit?: number;
}

export interface RecordPerformanceDto {
  pageId: string;
  date: Date;
  pageViews?: number;
  uniqueVisitors?: number;
  avgDwellTime?: number;
  bounceRate?: number;
  scrollDepth?: number;
  conversions?: number;
  conversionRate?: number;
  shares?: number;
  comments?: number;
  organicTraffic?: number;
  avgPosition?: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
}

@Injectable()
export class PerformanceService {
  private readonly logger = new Logger(PerformanceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Get performance data for a specific page or all pages
   */
  async getPerformance(tenantId: string, query: PerformanceQueryDto) {
    const {
      pageId,
      startDate,
      endDate,
      groupBy = 'day',
      page = 1,
      limit = 30,
    } = query;

    const cacheKey = this.cache.buildListCacheKey(tenantId, 'performance', query);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // Build where clause
    const where: Prisma.ContentPerformanceWhereInput = {};

    if (pageId) {
      where.pageId = pageId;
      // Verify page belongs to tenant
      const pageExists = await this.prisma.contentPage.findFirst({
        where: { id: pageId, tenantId },
      });
      if (!pageExists) {
        throw new NotFoundException(`Page not found: ${pageId}`);
      }
    } else {
      where.page = { tenantId };
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    // Get raw performance data
    const result = await this.prisma.paginate(this.prisma.contentPerformance, {
      page,
      limit,
      where,
      orderBy: { date: 'desc' },
      include: {
        page: {
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
          },
        },
      },
    });

    // If groupBy is not 'day', aggregate the data
    if (groupBy !== 'day' && result.data.length > 0) {
      result.data = this.aggregatePerformance(result.data, groupBy);
    }

    await this.cache.set(cacheKey, result, { ttl: 300, tags: [`tenant:${tenantId}:performance`] });

    return result;
  }

  /**
   * Get performance summary for a tenant
   */
  async getPerformanceSummary(
    tenantId: string,
    options: { startDate?: Date; endDate?: Date } = {},
  ) {
    const cacheKey = `tenant:${tenantId}:performance:summary`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const { startDate, endDate } = options;

    // Default to last 30 days if no dates provided
    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    const where: Prisma.ContentPerformanceWhereInput = {
      page: { tenantId },
      date: {
        gte: start,
        lte: end,
      },
    };

    // Get aggregated metrics
    const [current, previous] = await Promise.all([
      this.prisma.contentPerformance.aggregate({
        where,
        _sum: {
          pageViews: true,
          uniqueVisitors: true,
          conversions: true,
          shares: true,
          organicTraffic: true,
          impressions: true,
          clicks: true,
        },
        _avg: {
          avgDwellTime: true,
          bounceRate: true,
          scrollDepth: true,
          avgPosition: true,
          ctr: true,
        },
      }),
      // Get previous period for comparison
      this.prisma.contentPerformance.aggregate({
        where: {
          page: { tenantId },
          date: {
            gte: new Date(start.getTime() - (end.getTime() - start.getTime())),
            lt: start,
          },
        },
        _sum: {
          pageViews: true,
          uniqueVisitors: true,
          conversions: true,
        },
      }),
    ]);

    // Calculate changes
    const calculateChange = (current: number | null, previous: number | null) => {
      if (!previous || previous === 0) return null;
      if (!current) return -100;
      return Math.round(((current - previous) / previous) * 100 * 100) / 100;
    };

    const summary = {
      period: { start, end },
      metrics: {
        pageViews: {
          value: current._sum.pageViews || 0,
          change: calculateChange(
            current._sum.pageViews,
            previous._sum.pageViews,
          ),
        },
        uniqueVisitors: {
          value: current._sum.uniqueVisitors || 0,
          change: calculateChange(
            current._sum.uniqueVisitors,
            previous._sum.uniqueVisitors,
          ),
        },
        conversions: {
          value: current._sum.conversions || 0,
          change: calculateChange(
            current._sum.conversions,
            previous._sum.conversions,
          ),
        },
        avgDwellTime: {
          value: Math.round((current._avg.avgDwellTime || 0) * 100) / 100,
        },
        bounceRate: {
          value: Math.round((current._avg.bounceRate || 0) * 100) / 100,
        },
        scrollDepth: {
          value: Math.round((current._avg.scrollDepth || 0) * 100) / 100,
        },
        organicTraffic: {
          value: current._sum.organicTraffic || 0,
        },
        avgPosition: {
          value: Math.round((current._avg.avgPosition || 0) * 10) / 10,
        },
        ctr: {
          value: Math.round((current._avg.ctr || 0) * 100) / 100,
        },
      },
    };

    await this.cache.set(cacheKey, summary, { ttl: 600, tags: [`tenant:${tenantId}:performance`] });

    return summary;
  }

  /**
   * Get top performing pages
   */
  async getTopPages(
    tenantId: string,
    options: {
      metric?: 'pageViews' | 'conversions' | 'dwellTime' | 'shares';
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    } = {},
  ) {
    const { metric = 'pageViews', limit = 10, startDate, endDate } = options;

    const cacheKey = `tenant:${tenantId}:performance:top:${metric}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    const metricField = {
      pageViews: 'pageViews',
      conversions: 'conversions',
      dwellTime: 'avgDwellTime',
      shares: 'shares',
    }[metric];

    const topPages = await this.prisma.contentPerformance.groupBy({
      by: ['pageId'],
      where: {
        page: { tenantId },
        date: { gte: start, lte: end },
      },
      _sum: {
        pageViews: true,
        conversions: true,
        shares: true,
      },
      _avg: {
        avgDwellTime: true,
        bounceRate: true,
      },
      orderBy: {
        _sum: {
          [metricField.replace('avgDwellTime', 'pageViews')]: 'desc',
        },
      },
      take: limit,
    });

    // Get page details
    const pageIds = topPages.map((p) => p.pageId);
    const pages = await this.prisma.contentPage.findMany({
      where: { id: { in: pageIds } },
      select: {
        id: true,
        title: true,
        slug: true,
        type: true,
        status: true,
        publishedAt: true,
      },
    });

    const pageMap = new Map(pages.map((p) => [p.id, p]));

    const result = topPages.map((perf) => ({
      page: pageMap.get(perf.pageId),
      metrics: {
        pageViews: perf._sum.pageViews || 0,
        conversions: perf._sum.conversions || 0,
        shares: perf._sum.shares || 0,
        avgDwellTime: Math.round((perf._avg.avgDwellTime || 0) * 100) / 100,
        bounceRate: Math.round((perf._avg.bounceRate || 0) * 100) / 100,
      },
    }));

    await this.cache.set(cacheKey, result, { ttl: 600, tags: [`tenant:${tenantId}:performance`] });

    return result;
  }

  /**
   * Record performance data for a page
   */
  async recordPerformance(tenantId: string, data: RecordPerformanceDto) {
    // Verify page belongs to tenant
    const page = await this.prisma.contentPage.findFirst({
      where: { id: data.pageId, tenantId },
    });

    if (!page) {
      throw new NotFoundException(`Page not found: ${data.pageId}`);
    }

    // Upsert performance data
    const performance = await this.prisma.contentPerformance.upsert({
      where: {
        pageId_date: {
          pageId: data.pageId,
          date: data.date,
        },
      },
      create: {
        pageId: data.pageId,
        date: data.date,
        pageViews: data.pageViews || 0,
        uniqueVisitors: data.uniqueVisitors || 0,
        avgDwellTime: data.avgDwellTime,
        bounceRate: data.bounceRate,
        scrollDepth: data.scrollDepth,
        conversions: data.conversions || 0,
        conversionRate: data.conversionRate,
        shares: data.shares || 0,
        comments: data.comments || 0,
        organicTraffic: data.organicTraffic || 0,
        avgPosition: data.avgPosition,
        impressions: data.impressions || 0,
        clicks: data.clicks || 0,
        ctr: data.ctr,
      },
      update: {
        pageViews: data.pageViews !== undefined ? data.pageViews : undefined,
        uniqueVisitors:
          data.uniqueVisitors !== undefined ? data.uniqueVisitors : undefined,
        avgDwellTime: data.avgDwellTime,
        bounceRate: data.bounceRate,
        scrollDepth: data.scrollDepth,
        conversions: data.conversions,
        conversionRate: data.conversionRate,
        shares: data.shares,
        comments: data.comments,
        organicTraffic: data.organicTraffic,
        avgPosition: data.avgPosition,
        impressions: data.impressions,
        clicks: data.clicks,
        ctr: data.ctr,
      },
    });

    // Invalidate cache
    await this.cache.deleteByPattern(`tenant:${tenantId}:performance:*`);

    this.logger.log(`Recorded performance for page ${data.pageId}`);

    return performance;
  }

  /**
   * Aggregate performance data by week or month
   */
  private aggregatePerformance(data: any[], groupBy: 'week' | 'month') {
    const grouped = new Map<string, any[]>();

    for (const item of data) {
      const date = new Date(item.date);
      let key: string;

      if (groupBy === 'week') {
        // Get start of week (Monday)
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(date.setDate(diff));
        key = weekStart.toISOString().split('T')[0];
      } else {
        // Get start of month
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
      }

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(item);
    }

    return Array.from(grouped.entries()).map(([period, items]) => {
      const sumFields = [
        'pageViews',
        'uniqueVisitors',
        'conversions',
        'shares',
        'comments',
        'organicTraffic',
        'impressions',
        'clicks',
      ];
      const avgFields = [
        'avgDwellTime',
        'bounceRate',
        'scrollDepth',
        'conversionRate',
        'avgPosition',
        'ctr',
      ];

      const aggregated: any = { period, count: items.length };

      for (const field of sumFields) {
        aggregated[field] = items.reduce(
          (sum, item) => sum + (item[field] || 0),
          0,
        );
      }

      for (const field of avgFields) {
        const validItems = items.filter((item) => item[field] != null);
        if (validItems.length > 0) {
          aggregated[field] =
            Math.round(
              (validItems.reduce((sum, item) => sum + item[field], 0) /
                validItems.length) *
                100,
            ) / 100;
        }
      }

      // Include page info from first item
      if (items[0]?.page) {
        aggregated.page = items[0].page;
      }

      return aggregated;
    });
  }
}
