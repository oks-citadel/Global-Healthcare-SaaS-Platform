import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SocialService {
  private readonly platforms = ['twitter', 'facebook', 'linkedin', 'email', 'whatsapp', 'copy'];

  constructor(private redis: RedisService) {}

  async trackShare(
    tenantId: string,
    dto: {
      contentType: 'post' | 'page' | 'article';
      contentId: string;
      platform: string;
      userId?: string;
      metadata?: Record<string, any>;
    },
  ) {
    const share = {
      id: uuidv4(),
      tenantId,
      contentType: dto.contentType,
      contentId: dto.contentId,
      platform: dto.platform,
      userId: dto.userId,
      metadata: dto.metadata || {},
      timestamp: new Date(),
    };

    // Store share event
    await this.redis.set(`share:${share.id}`, JSON.stringify(share), 86400 * 90);

    // Increment counters
    const dayKey = new Date().toISOString().split('T')[0];
    await this.redis.incr(`shares:${tenantId}:${dto.contentId}:total`);
    await this.redis.incr(`shares:${tenantId}:${dto.contentId}:${dto.platform}`);
    await this.redis.incr(`shares:${tenantId}:${dayKey}:total`);
    await this.redis.incr(`shares:${tenantId}:${dayKey}:${dto.platform}`);

    // Update content share count
    if (dto.contentType === 'post') {
      const postKey = `post:${dto.contentId}`;
      const cached = await this.redis.get(postKey);
      if (cached) {
        const post = JSON.parse(cached);
        post.shareCount = (post.shareCount || 0) + 1;
        await this.redis.set(postKey, JSON.stringify(post), 86400);
      }
    }

    return { success: true, data: share };
  }

  async getEngagement(
    tenantId: string,
    options: {
      contentType?: string;
      contentId?: string;
      startDate?: string;
      endDate?: string;
      granularity?: string;
    },
  ) {
    // In production, this would aggregate from time-series data
    const engagement = {
      totalViews: 0,
      totalReactions: 0,
      totalComments: 0,
      totalShares: 0,
      uniqueUsers: 0,
      engagementRate: 0,
      timeline: [] as { date: string; views: number; reactions: number; comments: number; shares: number }[],
      byContentType: {
        post: { views: 0, reactions: 0, comments: 0, shares: 0 },
        page: { views: 0, reactions: 0, comments: 0, shares: 0 },
        article: { views: 0, reactions: 0, comments: 0, shares: 0 },
      },
    };

    // If specific content requested, get its metrics
    if (options.contentId) {
      const shareCount = await this.redis.get(`shares:${tenantId}:${options.contentId}:total`);
      engagement.totalShares = parseInt(shareCount || '0');
    }

    return { success: true, data: engagement };
  }

  async getSentiment(
    tenantId: string,
    options: {
      contentType?: string;
      contentId?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    // In production, this would use NLP sentiment analysis on content
    const sentiment = {
      overall: {
        score: 0.65, // -1 to 1 scale
        label: 'positive',
        confidence: 0.82,
      },
      distribution: {
        positive: 65,
        neutral: 25,
        negative: 10,
      },
      trends: [] as { date: string; score: number; volume: number }[],
      topPositiveTerms: ['helpful', 'great', 'informative', 'useful', 'excellent'],
      topNegativeTerms: ['confusing', 'unclear', 'difficult'],
      sampleContent: {
        positive: [],
        negative: [],
      },
    };

    return { success: true, data: sentiment };
  }

  async getShareSummary(
    tenantId: string,
    options: {
      contentId?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const summary: Record<string, number> = {};
    let total = 0;

    for (const platform of this.platforms) {
      let count = 0;
      if (options.contentId) {
        const countStr = await this.redis.get(`shares:${tenantId}:${options.contentId}:${platform}`);
        count = parseInt(countStr || '0');
      }
      summary[platform] = count;
      total += count;
    }

    return {
      success: true,
      data: {
        total,
        byPlatform: summary,
        topPlatform: Object.entries(summary).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
      },
    };
  }

  async getTopContent(
    tenantId: string,
    options: {
      metric: string;
      limit: number;
      period: string;
    },
  ) {
    // In production, this would query aggregated metrics
    const content: any[] = [];

    // Get top content from trending data
    const trendingKey = `trending:${tenantId}:${options.period}`;
    const topIds = await this.redis.zrevrange(trendingKey, 0, options.limit - 1);

    for (const id of topIds) {
      const cached = await this.redis.get(`post:${id}`);
      if (cached) {
        const post = JSON.parse(cached);
        content.push({
          id: post.id,
          title: post.title,
          contentType: 'post',
          metrics: {
            views: post.viewCount || 0,
            reactions: post.likeCount || 0,
            comments: post.commentCount || 0,
            shares: post.shareCount || 0,
          },
          createdAt: post.createdAt,
        });
      }
    }

    return {
      success: true,
      data: content,
      meta: {
        metric: options.metric,
        period: options.period,
        limit: options.limit,
      },
    };
  }
}
