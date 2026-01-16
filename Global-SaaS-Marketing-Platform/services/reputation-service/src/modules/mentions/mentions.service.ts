import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';

@Injectable()
export class MentionsService {
  private readonly logger = new Logger(MentionsService.name);
  private readonly CACHE_TTL = 300;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getMentions(
    tenantId: string,
    options: {
      platform?: string;
      sentiment?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const where: Record<string, unknown> = { tenantId };
    if (options.platform) where.platform = options.platform;
    if (options.sentiment) where.sentiment = options.sentiment;
    if (options.startDate || options.endDate) {
      where.mentionedAt = {};
      if (options.startDate) (where.mentionedAt as Record<string, Date>).gte = options.startDate;
      if (options.endDate) (where.mentionedAt as Record<string, Date>).lte = options.endDate;
    }

    const [mentions, total] = await Promise.all([
      this.prisma.socialMention.findMany({
        where,
        orderBy: { mentionedAt: 'desc' },
        skip: options.offset || 0,
        take: options.limit || 20,
      }),
      this.prisma.socialMention.count({ where }),
    ]);

    return { mentions, total };
  }

  async createMention(
    tenantId: string,
    dto: {
      platform: string;
      externalId: string;
      authorName: string;
      authorHandle?: string;
      authorFollowers?: number;
      content: string;
      url?: string;
      reach?: number;
      engagement?: Record<string, number>;
      tags?: string[];
      metadata?: Record<string, unknown>;
      mentionedAt: Date;
    },
  ) {
    const sentiment = this.analyzeSentiment(dto.content);

    const mention = await this.prisma.socialMention.create({
      data: {
        tenantId,
        platform: dto.platform,
        externalId: dto.externalId,
        authorName: dto.authorName,
        authorHandle: dto.authorHandle,
        authorFollowers: dto.authorFollowers,
        content: dto.content,
        url: dto.url,
        sentiment: sentiment.label,
        sentimentScore: sentiment.score,
        reach: dto.reach,
        engagement: dto.engagement || {},
        tags: dto.tags || [],
        metadata: dto.metadata || {},
        mentionedAt: dto.mentionedAt,
      },
    });

    await this.redis.invalidatePattern(`mentions:${tenantId}:*`);

    return mention;
  }

  async getMentionStats(tenantId: string) {
    const cacheKey = `mentions:${tenantId}:stats`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    const mentions = await this.prisma.socialMention.findMany({
      where: { tenantId },
      select: {
        platform: true,
        sentiment: true,
        reach: true,
        engagement: true,
      },
    });

    const stats = {
      totalMentions: mentions.length,
      byPlatform: {} as Record<string, number>,
      bySentiment: { positive: 0, negative: 0, neutral: 0 },
      totalReach: 0,
      totalEngagement: 0,
    };

    for (const m of mentions) {
      stats.byPlatform[m.platform] = (stats.byPlatform[m.platform] || 0) + 1;
      if (m.sentiment) {
        stats.bySentiment[m.sentiment as keyof typeof stats.bySentiment]++;
      }
      stats.totalReach += m.reach || 0;
      const engagement = m.engagement as Record<string, number> | null;
      if (engagement) {
        stats.totalEngagement += Object.values(engagement).reduce((a, b) => a + b, 0);
      }
    }

    await this.redis.set(cacheKey, stats, this.CACHE_TTL);

    return stats;
  }

  private analyzeSentiment(text: string): { label: string; score: number } {
    const positiveWords = ['great', 'love', 'amazing', 'excellent', 'best', 'awesome'];
    const negativeWords = ['bad', 'hate', 'terrible', 'worst', 'awful', 'disappointing'];

    const lowerText = text.toLowerCase();
    let score = 0;

    for (const word of positiveWords) {
      if (lowerText.includes(word)) score += 0.15;
    }
    for (const word of negativeWords) {
      if (lowerText.includes(word)) score -= 0.15;
    }

    score = Math.max(-1, Math.min(1, score));
    let label = 'neutral';
    if (score > 0.1) label = 'positive';
    else if (score < -0.1) label = 'negative';

    return { label, score };
  }
}
