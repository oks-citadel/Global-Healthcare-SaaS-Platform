import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import { SageMakerProvider } from '../../providers/sagemaker.provider';
import { BedrockProvider } from '../../providers/bedrock.provider';
import {
  ChurnPredictionRequestDto,
  ChurnPredictionResponseDto,
  ChurnRecommendedAction,
  BatchChurnPredictionRequestDto,
  BatchChurnPredictionResponseDto,
  ChurnSummaryStats,
} from './dto/churn-prediction.dto';

@Injectable()
export class ChurnService {
  private readonly logger = new Logger(ChurnService.name);
  private readonly MODEL_VERSION = '1.0.0';
  private readonly CACHE_TTL = 1800; // 30 minutes

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private sageMaker: SageMakerProvider,
    private bedrock: BedrockProvider,
  ) {}

  async predictChurn(
    tenantId: string,
    request: ChurnPredictionRequestDto,
  ): Promise<ChurnPredictionResponseDto> {
    const startTime = Date.now();
    const cacheKey = `churn:${tenantId}:${request.customerId}`;

    // Check cache
    const cached = await this.redis.get<ChurnPredictionResponseDto>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for customer ${request.customerId}`);
      return cached;
    }

    try {
      // Get ML prediction
      const prediction = await this.sageMaker.predictChurn({
        features: {
          accountAge: request.accountAge,
          monthlyUsage: request.monthlyUsage,
          supportTickets: request.supportTickets,
          featureAdoption: request.featureAdoption,
          lastLoginDays: request.lastLoginDays,
          paymentIssues: request.paymentIssues,
          contractValue: request.contractValue,
          npsScore: request.npsScore || 5,
          engagementTrend: request.engagementTrend,
        },
      });

      // Get AI-powered retention actions
      const recommendedActions = await this.getRetentionActions(
        request,
        prediction,
      );

      // Calculate revenue at risk
      const revenueAtRisk = this.calculateRevenueAtRisk(
        request.contractValue,
        prediction.probability,
      );

      // Estimate days until churn
      const daysUntilLikelyChurn = this.estimateDaysUntilChurn(
        prediction.probability,
        request.engagementTrend,
      );

      const response: ChurnPredictionResponseDto = {
        id: crypto.randomUUID(),
        customerId: request.customerId,
        churnProbability: Math.round(prediction.probability * 1000) / 1000,
        riskLevel: prediction.riskLevel,
        contributingFactors: prediction.factors,
        recommendedActions,
        revenueAtRisk,
        daysUntilLikelyChurn,
        modelVersion: this.MODEL_VERSION,
        predictedAt: new Date(),
      };

      // Store in database
      await this.prisma.churnPrediction.create({
        data: {
          id: response.id,
          tenantId,
          customerId: request.customerId,
          churnProbability: response.churnProbability,
          riskLevel: response.riskLevel,
          contributingFactors: response.contributingFactors,
          recommendedActions: response.recommendedActions,
          modelVersion: this.MODEL_VERSION,
        },
      });

      // Cache result
      await this.redis.set(cacheKey, response, this.CACHE_TTL);

      this.logger.debug(
        `Churn prediction for ${request.customerId} in ${Date.now() - startTime}ms`,
      );

      return response;
    } catch (error) {
      this.logger.error(`Churn prediction failed: ${error}`);
      throw error;
    }
  }

  async batchPredictChurn(
    tenantId: string,
    request: BatchChurnPredictionRequestDto,
  ): Promise<BatchChurnPredictionResponseDto> {
    const startTime = Date.now();
    const results: ChurnPredictionResponseDto[] = [];

    // Process in parallel with concurrency limit
    const batchSize = 10;
    for (let i = 0; i < request.customers.length; i += batchSize) {
      const batch = request.customers.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((customer) => this.predictChurn(tenantId, customer)),
      );
      results.push(...batchResults);
    }

    // Calculate summary stats
    const summary = this.calculateSummaryStats(results);

    return {
      results,
      summary,
      processingTimeMs: Date.now() - startTime,
    };
  }

  async getChurnHistory(
    tenantId: string,
    customerId: string,
    limit = 10,
  ): Promise<ChurnPredictionResponseDto[]> {
    const predictions = await this.prisma.churnPrediction.findMany({
      where: { tenantId, customerId },
      orderBy: { predictedAt: 'desc' },
      take: limit,
    });

    return predictions.map((p) => ({
      id: p.id,
      customerId: p.customerId,
      churnProbability: p.churnProbability,
      riskLevel: p.riskLevel,
      contributingFactors: p.contributingFactors as string[],
      recommendedActions: p.recommendedActions as ChurnRecommendedAction[],
      revenueAtRisk: 0,
      daysUntilLikelyChurn: null,
      modelVersion: p.modelVersion,
      predictedAt: p.predictedAt,
    }));
  }

  async getHighRiskCustomers(
    tenantId: string,
    limit = 20,
  ): Promise<ChurnPredictionResponseDto[]> {
    const predictions = await this.prisma.churnPrediction.findMany({
      where: {
        tenantId,
        riskLevel: { in: ['high', 'critical'] },
      },
      orderBy: { churnProbability: 'desc' },
      take: limit,
      distinct: ['customerId'],
    });

    return predictions.map((p) => ({
      id: p.id,
      customerId: p.customerId,
      churnProbability: p.churnProbability,
      riskLevel: p.riskLevel,
      contributingFactors: p.contributingFactors as string[],
      recommendedActions: p.recommendedActions as ChurnRecommendedAction[],
      revenueAtRisk: 0,
      daysUntilLikelyChurn: null,
      modelVersion: p.modelVersion,
      predictedAt: p.predictedAt,
    }));
  }

  private calculateRevenueAtRisk(
    contractValue: number,
    churnProbability: number,
  ): number {
    // Annual revenue at risk = MRR * 12 * churn probability
    return Math.round(contractValue * 12 * churnProbability);
  }

  private estimateDaysUntilChurn(
    probability: number,
    engagementTrend: number,
  ): number | null {
    if (probability < 0.3) return null;

    // Higher probability and declining engagement = sooner churn
    const baseDays = 90;
    const probabilityFactor = 1 - probability;
    const trendFactor = (engagementTrend + 1) / 2;

    const days = Math.round(baseDays * probabilityFactor * trendFactor);
    return Math.max(7, Math.min(180, days));
  }

  private async getRetentionActions(
    request: ChurnPredictionRequestDto,
    prediction: { probability: number; riskLevel: string; factors: string[] },
  ): Promise<ChurnRecommendedAction[]> {
    const actions: ChurnRecommendedAction[] = [];

    // Rule-based actions based on risk factors
    if (request.lastLoginDays > 7) {
      actions.push({
        type: 'engagement',
        description: 'Send re-engagement email with new feature highlights',
        priority: 1,
        expectedImpact: 'high',
        effort: 'low',
      });
    }

    if (request.supportTickets > 3) {
      actions.push({
        type: 'support',
        description: 'Schedule proactive customer success call',
        priority: 1,
        expectedImpact: 'high',
        effort: 'medium',
      });
    }

    if (request.featureAdoption < 40) {
      actions.push({
        type: 'onboarding',
        description: 'Offer personalized training session',
        priority: 2,
        expectedImpact: 'medium',
        effort: 'medium',
      });
    }

    if (request.paymentIssues > 0) {
      actions.push({
        type: 'billing',
        description: 'Review payment method and offer flexibility',
        priority: 1,
        expectedImpact: 'high',
        effort: 'low',
      });
    }

    if (prediction.riskLevel === 'critical' && request.contractValue > 1000) {
      actions.push({
        type: 'escalation',
        description: 'Executive outreach for relationship review',
        priority: 1,
        expectedImpact: 'high',
        effort: 'high',
      });
    }

    // AI-enhanced recommendations for high-risk customers
    if (prediction.probability > 0.5) {
      try {
        const aiActions = await this.bedrock.generateJson<{
          actions: Array<{
            type: string;
            description: string;
            impact: string;
          }>;
        }>(
          `Generate 2 specific retention actions for a customer with:
          - Churn risk: ${Math.round(prediction.probability * 100)}%
          - Risk factors: ${prediction.factors.join(', ')}
          - Contract value: $${request.contractValue}/month
          - Feature adoption: ${request.featureAdoption}%
          - Days since login: ${request.lastLoginDays}`,
          `{
            "actions": [
              {"type": "string", "description": "string", "impact": "high|medium|low"}
            ]
          }`,
          512,
        );

        for (const action of aiActions.actions) {
          actions.push({
            type: action.type,
            description: action.description,
            priority: action.impact === 'high' ? 1 : action.impact === 'medium' ? 2 : 3,
            expectedImpact: action.impact,
            effort: 'medium',
          });
        }
      } catch (error) {
        this.logger.warn(`AI retention actions failed: ${error}`);
      }
    }

    // Sort by priority and return top 5
    return actions.sort((a, b) => a.priority - b.priority).slice(0, 5);
  }

  private calculateSummaryStats(
    results: ChurnPredictionResponseDto[],
  ): ChurnSummaryStats {
    const totalAnalyzed = results.length;
    const highRiskCount = results.filter(
      (r) => r.riskLevel === 'high' || r.riskLevel === 'critical',
    ).length;
    const totalRevenueAtRisk = results.reduce(
      (sum, r) => sum + r.revenueAtRisk,
      0,
    );
    const averageChurnProbability =
      results.reduce((sum, r) => sum + r.churnProbability, 0) / totalAnalyzed;

    return {
      totalAnalyzed,
      highRiskCount,
      totalRevenueAtRisk,
      averageChurnProbability: Math.round(averageChurnProbability * 1000) / 1000,
    };
  }
}
