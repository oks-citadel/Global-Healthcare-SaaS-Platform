import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import {
  CreateNpsSurveyDto,
  SubmitNpsResponseDto,
  NpsSurveyResponseDto,
  NpsResponseDto,
  NpsResultsDto,
} from './dto/nps.dto';

@Injectable()
export class NpsService {
  private readonly logger = new Logger(NpsService.name);
  private readonly CACHE_TTL = 300;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createSurvey(
    tenantId: string,
    dto: CreateNpsSurveyDto,
  ): Promise<NpsSurveyResponseDto> {
    const survey = await this.prisma.npsSurvey.create({
      data: {
        tenantId,
        name: dto.name,
        description: dto.description,
        trigger: dto.trigger,
        triggerConfig: dto.triggerConfig || null,
      },
    });

    return this.mapSurveyToResponse(survey);
  }

  async getSurveys(tenantId: string): Promise<NpsSurveyResponseDto[]> {
    const surveys = await this.prisma.npsSurvey.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    return surveys.map((s) => this.mapSurveyToResponse(s));
  }

  async submitResponse(
    tenantId: string,
    dto: SubmitNpsResponseDto,
  ): Promise<NpsResponseDto> {
    const survey = await this.prisma.npsSurvey.findFirst({
      where: { id: dto.surveyId, tenantId },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    const category = this.categorizeScore(dto.score);

    const response = await this.prisma.npsResponse.create({
      data: {
        tenantId,
        surveyId: dto.surveyId,
        customerId: dto.customerId,
        customerEmail: dto.customerEmail,
        score: dto.score,
        category,
        feedback: dto.feedback,
        tags: dto.tags || [],
        metadata: dto.metadata || {},
      },
    });

    await this.redis.invalidatePattern(`nps:${tenantId}:*`);

    return this.mapResponseToDto(response);
  }

  async getResults(
    tenantId: string,
    surveyId?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<NpsResultsDto> {
    const cacheKey = `nps:${tenantId}:results:${surveyId || 'all'}:${startDate?.toISOString() || ''}:${endDate?.toISOString() || ''}`;
    const cached = await this.redis.get<NpsResultsDto>(cacheKey);
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

    const responses = await this.prisma.npsResponse.findMany({
      where,
      select: { score: true, category: true, submittedAt: true },
      orderBy: { submittedAt: 'asc' },
    });

    const totalResponses = responses.length;
    let promoters = 0;
    let passives = 0;
    let detractors = 0;
    let totalScore = 0;
    const scoreDistribution: Record<number, number> = {};

    for (let i = 0; i <= 10; i++) {
      scoreDistribution[i] = 0;
    }

    for (const r of responses) {
      totalScore += r.score;
      scoreDistribution[r.score]++;
      if (r.category === 'promoter') promoters++;
      else if (r.category === 'passive') passives++;
      else detractors++;
    }

    const promoterPercentage = totalResponses > 0 ? (promoters / totalResponses) * 100 : 0;
    const passivePercentage = totalResponses > 0 ? (passives / totalResponses) * 100 : 0;
    const detractorPercentage = totalResponses > 0 ? (detractors / totalResponses) * 100 : 0;

    const npsScore = Math.round(promoterPercentage - detractorPercentage);
    const averageScore = totalResponses > 0 ? totalScore / totalResponses : 0;

    // Calculate trend (last 12 months or available data)
    const trend = this.calculateTrend(responses);

    const results: NpsResultsDto = {
      npsScore,
      totalResponses,
      promoters,
      passives,
      detractors,
      promoterPercentage: Math.round(promoterPercentage * 10) / 10,
      passivePercentage: Math.round(passivePercentage * 10) / 10,
      detractorPercentage: Math.round(detractorPercentage * 10) / 10,
      averageScore: Math.round(averageScore * 100) / 100,
      responseRate: null,
      scoreDistribution,
      trend,
    };

    await this.redis.set(cacheKey, results, this.CACHE_TTL);

    return results;
  }

  async getResponses(
    tenantId: string,
    surveyId: string,
    options: { category?: string; limit?: number; offset?: number } = {},
  ): Promise<{ responses: NpsResponseDto[]; total: number }> {
    const where: Record<string, unknown> = { tenantId, surveyId };
    if (options.category) where.category = options.category;

    const [responses, total] = await Promise.all([
      this.prisma.npsResponse.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
        skip: options.offset || 0,
        take: options.limit || 20,
      }),
      this.prisma.npsResponse.count({ where }),
    ]);

    return {
      responses: responses.map((r) => this.mapResponseToDto(r)),
      total,
    };
  }

  private categorizeScore(score: number): string {
    if (score >= 9) return 'promoter';
    if (score >= 7) return 'passive';
    return 'detractor';
  }

  private calculateTrend(
    responses: Array<{ score: number; category: string; submittedAt: Date }>,
  ): Array<{ date: string; npsScore: number; responses: number }> {
    const monthlyData: Map<string, { promoters: number; detractors: number; total: number }> =
      new Map();

    for (const r of responses) {
      const monthKey = r.submittedAt.toISOString().substring(0, 7);
      const data = monthlyData.get(monthKey) || { promoters: 0, detractors: 0, total: 0 };
      data.total++;
      if (r.category === 'promoter') data.promoters++;
      else if (r.category === 'detractor') data.detractors++;
      monthlyData.set(monthKey, data);
    }

    const trend: Array<{ date: string; npsScore: number; responses: number }> = [];
    for (const [date, data] of monthlyData) {
      const npsScore = Math.round(
        ((data.promoters - data.detractors) / data.total) * 100,
      );
      trend.push({ date, npsScore, responses: data.total });
    }

    return trend.slice(-12);
  }

  private mapSurveyToResponse(survey: {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    trigger: string;
    triggerConfig: unknown;
    createdAt: Date;
  }): NpsSurveyResponseDto {
    return {
      id: survey.id,
      name: survey.name,
      description: survey.description,
      isActive: survey.isActive,
      trigger: survey.trigger,
      triggerConfig: survey.triggerConfig as Record<string, unknown> | null,
      createdAt: survey.createdAt,
    };
  }

  private mapResponseToDto(response: {
    id: string;
    surveyId: string;
    customerId: string | null;
    customerEmail: string | null;
    score: number;
    category: string;
    feedback: string | null;
    tags: unknown;
    submittedAt: Date;
  }): NpsResponseDto {
    return {
      id: response.id,
      surveyId: response.surveyId,
      customerId: response.customerId,
      customerEmail: response.customerEmail,
      score: response.score,
      category: response.category,
      feedback: response.feedback,
      tags: response.tags as string[],
      submittedAt: response.submittedAt,
    };
  }
}
