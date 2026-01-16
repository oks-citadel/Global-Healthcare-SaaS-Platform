import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';

@Injectable()
export class RatingsService {
  private readonly logger = new Logger(RatingsService.name);
  private readonly CACHE_TTL = 300;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getRatings(tenantId: string, source?: string) {
    const cacheKey = `ratings:${tenantId}:${source || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    const where: Record<string, unknown> = { tenantId };
    if (source) where.source = source;

    const reviews = await this.prisma.review.findMany({
      where: { ...where, isPublished: true },
      select: {
        rating: true,
        sentiment: true,
        source: true,
        response: true,
        publishedAt: true,
      },
    });

    const totalReviews = reviews.length;
    let totalRating = 0;
    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const sentimentDistribution: Record<string, number> = { positive: 0, negative: 0, neutral: 0 };
    const sourceDistribution: Record<string, number> = {};
    let responded = 0;

    for (const r of reviews) {
      totalRating += r.rating;
      ratingDistribution[Math.round(r.rating)]++;
      if (r.sentiment) {
        sentimentDistribution[r.sentiment]++;
      }
      sourceDistribution[r.source] = (sourceDistribution[r.source] || 0) + 1;
      if (r.response) responded++;
    }

    const result = {
      totalReviews,
      averageRating: totalReviews > 0 ? Math.round((totalRating / totalReviews) * 100) / 100 : 0,
      ratingDistribution,
      sentimentDistribution,
      sourceDistribution,
      responseRate: totalReviews > 0 ? Math.round((responded / totalReviews) * 100) : 0,
    };

    await this.redis.set(cacheKey, result, this.CACHE_TTL);

    return result;
  }

  async getAggregatedRatings(tenantId: string) {
    const aggregates = await this.prisma.ratingAggregate.findMany({
      where: { tenantId, period: 'all_time' },
      orderBy: { source: 'asc' },
    });

    return aggregates;
  }

  async recalculateAggregates(tenantId: string) {
    const sources = ['all', 'google', 'yelp', 'facebook', 'trustpilot', 'internal'];

    for (const source of sources) {
      const where: Record<string, unknown> = { tenantId, isPublished: true };
      if (source !== 'all') where.source = source;

      const reviews = await this.prisma.review.findMany({
        where,
        select: { rating: true, sentiment: true, response: true },
      });

      const totalReviews = reviews.length;
      if (totalReviews === 0) continue;

      let totalRating = 0;
      const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      const sentimentDistribution: Record<string, number> = { positive: 0, negative: 0, neutral: 0 };
      let responded = 0;

      for (const r of reviews) {
        totalRating += r.rating;
        ratingDistribution[Math.round(r.rating)]++;
        if (r.sentiment) sentimentDistribution[r.sentiment]++;
        if (r.response) responded++;
      }

      await this.prisma.ratingAggregate.upsert({
        where: {
          tenantId_source_period_periodStart: {
            tenantId,
            source,
            period: 'all_time',
            periodStart: new Date(0),
          },
        },
        update: {
          totalReviews,
          averageRating: totalRating / totalReviews,
          ratingDistribution,
          sentimentDistribution,
          responseRate: (responded / totalReviews) * 100,
          calculatedAt: new Date(),
        },
        create: {
          tenantId,
          source,
          period: 'all_time',
          periodStart: new Date(0),
          totalReviews,
          averageRating: totalRating / totalReviews,
          ratingDistribution,
          sentimentDistribution,
          responseRate: (responded / totalReviews) * 100,
        },
      });
    }

    await this.redis.invalidatePattern(`ratings:${tenantId}:*`);

    return { success: true };
  }
}
