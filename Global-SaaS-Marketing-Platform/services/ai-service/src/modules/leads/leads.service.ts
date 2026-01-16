import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import { SageMakerProvider } from '../../providers/sagemaker.provider';
import { BedrockProvider } from '../../providers/bedrock.provider';
import {
  LeadScoringRequestDto,
  LeadScoringResponseDto,
  BatchLeadScoringRequestDto,
  BatchLeadScoringResponseDto,
} from './dto/lead-scoring.dto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);
  private readonly MODEL_VERSION = '1.0.0';
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private sageMaker: SageMakerProvider,
    private bedrock: BedrockProvider,
  ) {}

  async scoreLeads(
    tenantId: string,
    request: LeadScoringRequestDto,
  ): Promise<LeadScoringResponseDto> {
    const startTime = Date.now();
    const cacheKey = `lead-score:${tenantId}:${request.leadId}`;

    // Check cache first
    const cached = await this.redis.get<LeadScoringResponseDto>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for lead ${request.leadId}`);
      return cached;
    }

    try {
      // Get ML prediction from SageMaker
      const prediction = await this.sageMaker.predictLeadScore({
        features: {
          companySize: request.companySize,
          industry: request.industry,
          engagementScore: request.engagementScore,
          websiteVisits: request.websiteVisits,
          emailOpens: request.emailOpens,
          downloadedAssets: request.downloadedAssets,
          demoRequested: request.demoRequested,
          budgetRange: request.budgetRange,
          decisionTimeframe: request.decisionTimeframe,
          competitorMentions: request.competitorMentions || 0,
        },
      });

      // Get AI-powered recommendations
      const recommendations = await this.getRecommendations(request, prediction);

      // Categorize the lead
      const category = this.categorizeScore(prediction.score);

      const response: LeadScoringResponseDto = {
        id: crypto.randomUUID(),
        leadId: request.leadId,
        score: Math.round(prediction.score * 10) / 10,
        confidence: Math.round(prediction.confidence * 100) / 100,
        category,
        factors: prediction.factors,
        recommendedActions: recommendations,
        modelVersion: this.MODEL_VERSION,
        predictedAt: new Date(),
      };

      // Store in database
      await this.prisma.leadScore.create({
        data: {
          id: response.id,
          tenantId,
          leadId: request.leadId,
          score: response.score,
          confidence: response.confidence,
          factors: {
            factors: response.factors,
            category: response.category,
          },
          modelVersion: this.MODEL_VERSION,
        },
      });

      // Cache the result
      await this.redis.set(cacheKey, response, this.CACHE_TTL);

      this.logger.debug(
        `Lead ${request.leadId} scored in ${Date.now() - startTime}ms`,
      );

      return response;
    } catch (error) {
      this.logger.error(`Lead scoring failed: ${error}`);
      throw error;
    }
  }

  async batchScoreLeads(
    tenantId: string,
    request: BatchLeadScoringRequestDto,
  ): Promise<BatchLeadScoringResponseDto> {
    const startTime = Date.now();
    const results: LeadScoringResponseDto[] = [];

    // Process in parallel with concurrency limit
    const batchSize = 10;
    for (let i = 0; i < request.leads.length; i += batchSize) {
      const batch = request.leads.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((lead) => this.scoreLeads(tenantId, lead)),
      );
      results.push(...batchResults);
    }

    return {
      results,
      totalProcessed: results.length,
      processingTimeMs: Date.now() - startTime,
    };
  }

  async getLeadScoreHistory(
    tenantId: string,
    leadId: string,
    limit = 10,
  ): Promise<LeadScoringResponseDto[]> {
    const scores = await this.prisma.leadScore.findMany({
      where: { tenantId, leadId },
      orderBy: { predictedAt: 'desc' },
      take: limit,
    });

    return scores.map((score) => {
      const factors = score.factors as { factors: string[]; category: string };
      return {
        id: score.id,
        leadId: score.leadId,
        score: score.score,
        confidence: score.confidence,
        category: factors.category,
        factors: factors.factors,
        recommendedActions: [],
        modelVersion: score.modelVersion,
        predictedAt: score.predictedAt,
      };
    });
  }

  private categorizeScore(score: number): string {
    if (score >= 80) return 'qualified';
    if (score >= 60) return 'hot';
    if (score >= 40) return 'warm';
    return 'cold';
  }

  private async getRecommendations(
    request: LeadScoringRequestDto,
    prediction: { score: number; factors: string[] },
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Rule-based recommendations
    if (prediction.score >= 80) {
      recommendations.push('Schedule immediate sales call');
      recommendations.push('Send personalized demo invitation');
    } else if (prediction.score >= 60) {
      recommendations.push('Add to nurture campaign');
      recommendations.push('Share case study relevant to industry');
    } else if (prediction.score >= 40) {
      recommendations.push('Send educational content');
      recommendations.push('Invite to upcoming webinar');
    } else {
      recommendations.push('Add to awareness campaign');
      recommendations.push('Monitor for engagement changes');
    }

    // AI-enhanced recommendations for high-value leads
    if (prediction.score >= 70 && request.budgetRange !== '<$1k') {
      try {
        const aiRecommendations = await this.bedrock.generateJson<{
          recommendations: string[];
        }>(
          `Generate 2 specific sales recommendations for a lead with:
          - Score: ${prediction.score}
          - Industry: ${request.industry}
          - Company Size: ${request.companySize}
          - Engagement: ${request.engagementScore}%
          - Budget: ${request.budgetRange}
          - Decision Timeline: ${request.decisionTimeframe}`,
          `{
            "recommendations": ["string", "string"]
          }`,
          512,
        );
        recommendations.push(...aiRecommendations.recommendations);
      } catch (error) {
        this.logger.warn(`AI recommendations failed: ${error}`);
      }
    }

    return recommendations.slice(0, 5);
  }
}
