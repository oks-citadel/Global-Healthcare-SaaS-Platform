import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';

@Injectable()
export class CsatService {
  private readonly logger = new Logger(CsatService.name);
  private readonly CACHE_TTL = 300;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createSurvey(
    tenantId: string,
    dto: {
      name: string;
      description?: string;
      question: string;
      scaleType: string;
      trigger: string;
      triggerConfig?: Record<string, unknown>;
    },
  ) {
    const survey = await this.prisma.csatSurvey.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        question: dto.question,
        scaleType: dto.scaleType,
        trigger: dto.trigger,
        triggerConfig: dto.triggerConfig || null,
      },
    });

    return survey;
  }

  async getSurveys(tenantId: string) {
    return this.prisma.csatSurvey.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submitResponse(
    tenantId: string,
    dto: {
      surveyId: string;
      customerId?: string;
      customerEmail?: string;
      score: number;
      maxScore: number;
      feedback?: string;
      interactionId?: string;
      interactionType?: string;
      tags?: string[];
      metadata?: Record<string, unknown>;
    },
  ) {
    const survey = await this.prisma.csatSurvey.findFirst({
      where: { id: dto.surveyId, tenantId },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    const response = await this.prisma.csatResponse.create({
      data: {
        tenantId,
        surveyId: dto.surveyId,
        customerId: dto.customerId,
        customerEmail: dto.customerEmail,
        score: dto.score,
        maxScore: dto.maxScore,
        feedback: dto.feedback,
        interactionId: dto.interactionId,
        interactionType: dto.interactionType,
        tags: dto.tags || [],
        metadata: dto.metadata || {},
      },
    });

    await this.redis.invalidatePattern(`csat:${tenantId}:*`);

    return response;
  }

  async getResults(
    tenantId: string,
    surveyId?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const cacheKey = `csat:${tenantId}:results:${surveyId || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    const where: Record<string, unknown> = { tenantId };
    if (surveyId) where.surveyId = surveyId;
    if (startDate || endDate) {
      where.submittedAt = {};
      if (startDate) (where.submittedAt as Record<string, Date>).gte = startDate;
      if (endDate) (where.submittedAt as Record<string, Date>).lte = endDate;
    }

    const responses = await this.prisma.csatResponse.findMany({
      where,
      select: { score: true, maxScore: true, submittedAt: true },
    });

    const totalResponses = responses.length;
    let totalScore = 0;
    let totalMaxScore = 0;
    let satisfied = 0;

    for (const r of responses) {
      totalScore += r.score;
      totalMaxScore += r.maxScore;
      const satisfactionThreshold = r.maxScore * 0.8;
      if (r.score >= satisfactionThreshold) satisfied++;
    }

    const csatScore = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
    const satisfactionRate = totalResponses > 0 ? (satisfied / totalResponses) * 100 : 0;

    const results = {
      csatScore: Math.round(csatScore * 10) / 10,
      totalResponses,
      satisfactionRate: Math.round(satisfactionRate * 10) / 10,
      averageScore: totalResponses > 0 ? Math.round((totalScore / totalResponses) * 100) / 100 : 0,
    };

    await this.redis.set(cacheKey, results, this.CACHE_TTL);

    return results;
  }
}
