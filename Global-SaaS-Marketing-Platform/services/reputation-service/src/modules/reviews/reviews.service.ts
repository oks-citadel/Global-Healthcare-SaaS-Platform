import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
  RespondToReviewDto,
  ReviewQueryDto,
  ReviewResponseDto,
  ReviewListResponseDto,
} from './dto/review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createReview(
    tenantId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const sentiment = this.analyzeSentiment(dto.content);

    const review = await this.prisma.review.create({
      data: {
        tenantId,
        source: dto.source,
        externalId: dto.externalId,
        authorName: dto.authorName,
        authorEmail: dto.authorEmail,
        rating: dto.rating,
        title: dto.title,
        content: dto.content,
        isVerified: dto.isVerified || false,
        tags: dto.tags || [],
        metadata: dto.metadata || {},
        sentiment: sentiment.label,
        sentimentScore: sentiment.score,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
      },
    });

    // Invalidate caches
    await this.redis.invalidatePattern(`reviews:${tenantId}:*`);
    await this.redis.invalidatePattern(`ratings:${tenantId}:*`);

    return this.mapToResponse(review);
  }

  async getReviews(
    tenantId: string,
    query: ReviewQueryDto,
  ): Promise<ReviewListResponseDto> {
    const cacheKey = `reviews:${tenantId}:${JSON.stringify(query)}`;
    const cached = await this.redis.get<ReviewListResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const where: Record<string, unknown> = { tenantId };

    if (query.source) where.source = query.source;
    if (query.sentiment) where.sentiment = query.sentiment;
    if (query.isFeatured !== undefined) where.isFeatured = query.isFeatured;
    if (query.isPublished !== undefined) where.isPublished = query.isPublished;

    if (query.minRating || query.maxRating) {
      where.rating = {};
      if (query.minRating) (where.rating as Record<string, number>).gte = query.minRating;
      if (query.maxRating) (where.rating as Record<string, number>).lte = query.maxRating;
    }

    if (query.tag) {
      where.tags = { has: query.tag };
    }

    if (query.startDate || query.endDate) {
      where.publishedAt = {};
      if (query.startDate) {
        (where.publishedAt as Record<string, Date>).gte = new Date(query.startDate);
      }
      if (query.endDate) {
        (where.publishedAt as Record<string, Date>).lte = new Date(query.endDate);
      }
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        orderBy: { [query.sortBy || 'publishedAt']: query.sortOrder || 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where }),
    ]);

    const response: ReviewListResponseDto = {
      reviews: reviews.map((r) => this.mapToResponse(r)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    await this.redis.set(cacheKey, response, this.CACHE_TTL);

    return response;
  }

  async getReviewById(
    tenantId: string,
    reviewId: string,
  ): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, tenantId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.mapToResponse(review);
  }

  async updateReview(
    tenantId: string,
    reviewId: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.update({
      where: { id: reviewId, tenantId },
      data: dto,
    });

    await this.redis.invalidatePattern(`reviews:${tenantId}:*`);

    return this.mapToResponse(review);
  }

  async deleteReview(tenantId: string, reviewId: string): Promise<void> {
    await this.prisma.review.delete({
      where: { id: reviewId, tenantId },
    });

    await this.redis.invalidatePattern(`reviews:${tenantId}:*`);
    await this.redis.invalidatePattern(`ratings:${tenantId}:*`);
  }

  async respondToReview(
    tenantId: string,
    reviewId: string,
    dto: RespondToReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.update({
      where: { id: reviewId, tenantId },
      data: {
        response: dto.response,
        respondedBy: dto.respondedBy,
        respondedAt: new Date(),
      },
    });

    await this.redis.invalidatePattern(`reviews:${tenantId}:*`);

    return this.mapToResponse(review);
  }

  async getReviewStats(
    tenantId: string,
    source?: string,
  ): Promise<{
    total: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
    sentimentDistribution: Record<string, number>;
    responseRate: number;
  }> {
    const cacheKey = `review-stats:${tenantId}:${source || 'all'}`;
    const cached = await this.redis.get<ReturnType<typeof this.getReviewStats>>(cacheKey);
    if (cached) {
      return cached;
    }

    const where: Record<string, unknown> = { tenantId };
    if (source) where.source = source;

    const reviews = await this.prisma.review.findMany({
      where,
      select: {
        rating: true,
        sentiment: true,
        response: true,
      },
    });

    const total = reviews.length;
    const averageRating =
      total > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const sentimentDistribution: Record<string, number> = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    let responded = 0;

    for (const review of reviews) {
      ratingDistribution[Math.round(review.rating)] =
        (ratingDistribution[Math.round(review.rating)] || 0) + 1;

      if (review.sentiment) {
        sentimentDistribution[review.sentiment] =
          (sentimentDistribution[review.sentiment] || 0) + 1;
      }

      if (review.response) responded++;
    }

    const stats = {
      total,
      averageRating: Math.round(averageRating * 100) / 100,
      ratingDistribution,
      sentimentDistribution,
      responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
    };

    await this.redis.set(cacheKey, stats, this.CACHE_TTL);

    return stats;
  }

  private analyzeSentiment(text: string): { label: string; score: number } {
    // Simple sentiment analysis based on rating keywords
    const positiveWords = [
      'great',
      'excellent',
      'amazing',
      'wonderful',
      'fantastic',
      'love',
      'best',
      'perfect',
      'recommend',
      'helpful',
      'friendly',
      'professional',
      'outstanding',
    ];
    const negativeWords = [
      'bad',
      'terrible',
      'awful',
      'horrible',
      'worst',
      'hate',
      'disappointing',
      'poor',
      'rude',
      'unprofessional',
      'avoid',
      'never',
      'waste',
    ];

    const lowerText = text.toLowerCase();
    let score = 0;

    for (const word of positiveWords) {
      if (lowerText.includes(word)) score += 0.1;
    }

    for (const word of negativeWords) {
      if (lowerText.includes(word)) score -= 0.1;
    }

    score = Math.max(-1, Math.min(1, score));

    let label = 'neutral';
    if (score > 0.1) label = 'positive';
    else if (score < -0.1) label = 'negative';

    return { label, score };
  }

  private mapToResponse(review: {
    id: string;
    source: string;
    externalId: string | null;
    authorName: string;
    authorEmail: string | null;
    rating: number;
    title: string | null;
    content: string;
    response: string | null;
    respondedAt: Date | null;
    respondedBy: string | null;
    sentiment: string | null;
    sentimentScore: number | null;
    isVerified: boolean;
    isPublished: boolean;
    isFeatured: boolean;
    tags: unknown;
    publishedAt: Date;
    createdAt: Date;
  }): ReviewResponseDto {
    return {
      id: review.id,
      source: review.source,
      externalId: review.externalId,
      authorName: review.authorName,
      authorEmail: review.authorEmail,
      rating: review.rating,
      title: review.title,
      content: review.content,
      response: review.response,
      respondedAt: review.respondedAt,
      respondedBy: review.respondedBy,
      sentiment: review.sentiment,
      sentimentScore: review.sentimentScore,
      isVerified: review.isVerified,
      isPublished: review.isPublished,
      isFeatured: review.isFeatured,
      tags: review.tags as string[],
      publishedAt: review.publishedAt,
      createdAt: review.createdAt,
    };
  }
}
