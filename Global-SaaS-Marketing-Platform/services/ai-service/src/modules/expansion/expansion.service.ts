import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import { SageMakerProvider } from '../../providers/sagemaker.provider';
import { BedrockProvider } from '../../providers/bedrock.provider';
import {
  ExpansionPredictionRequestDto,
  ExpansionPredictionResponseDto,
  ExpansionOpportunity,
  BatchExpansionRequestDto,
  BatchExpansionResponseDto,
  ExpansionSummaryStats,
} from './dto/expansion-prediction.dto';

@Injectable()
export class ExpansionService {
  private readonly logger = new Logger(ExpansionService.name);
  private readonly MODEL_VERSION = '1.0.0';
  private readonly CACHE_TTL = 1800;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private sageMaker: SageMakerProvider,
    private bedrock: BedrockProvider,
  ) {}

  async predictExpansion(
    tenantId: string,
    request: ExpansionPredictionRequestDto,
  ): Promise<ExpansionPredictionResponseDto> {
    const startTime = Date.now();
    const cacheKey = `expansion:${tenantId}:${request.customerId}`;

    // Check cache
    const cached = await this.redis.get<ExpansionPredictionResponseDto>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for customer ${request.customerId}`);
      return cached;
    }

    try {
      // Get ML prediction
      const prediction = await this.sageMaker.predictExpansion({
        features: {
          currentMrr: request.currentMrr,
          usageGrowth: request.usageGrowth,
          featureRequests: request.featureRequests,
          teamSize: request.teamSize,
          productFit: request.productFit,
          stakeholderEngagement: request.stakeholderEngagement,
          upsellHistory: request.upsellHistory,
          industryGrowth: request.industryGrowth,
        },
      });

      // Generate expansion opportunities
      const opportunities = await this.generateOpportunities(request, prediction);

      // Identify signals
      const signals = this.identifySignals(request, prediction);

      // Determine readiness level
      const readinessLevel = this.determineReadinessLevel(prediction.probability);

      // Determine optimal timing
      const optimalTiming = this.determineOptimalTiming(request, prediction);

      const response: ExpansionPredictionResponseDto = {
        id: crypto.randomUUID(),
        customerId: request.customerId,
        expansionProbability: Math.round(prediction.probability * 1000) / 1000,
        predictedRevenue: Math.round(prediction.predictedRevenue),
        confidence: 0.85,
        readinessLevel,
        opportunities,
        signals,
        recommendations: prediction.recommendations,
        optimalTiming,
        modelVersion: this.MODEL_VERSION,
        predictedAt: new Date(),
      };

      // Store in database
      await this.prisma.expansionPrediction.create({
        data: {
          id: response.id,
          tenantId,
          customerId: request.customerId,
          expansionProbability: response.expansionProbability,
          predictedRevenue: response.predictedRevenue,
          recommendedProducts: opportunities,
          signals: { signals, readinessLevel },
          modelVersion: this.MODEL_VERSION,
        },
      });

      // Cache result
      await this.redis.set(cacheKey, response, this.CACHE_TTL);

      this.logger.debug(
        `Expansion prediction for ${request.customerId} in ${Date.now() - startTime}ms`,
      );

      return response;
    } catch (error) {
      this.logger.error(`Expansion prediction failed: ${error}`);
      throw error;
    }
  }

  async batchPredictExpansion(
    tenantId: string,
    request: BatchExpansionRequestDto,
  ): Promise<BatchExpansionResponseDto> {
    const startTime = Date.now();
    const results: ExpansionPredictionResponseDto[] = [];

    const batchSize = 10;
    for (let i = 0; i < request.customers.length; i += batchSize) {
      const batch = request.customers.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((customer) => this.predictExpansion(tenantId, customer)),
      );
      results.push(...batchResults);
    }

    const summary = this.calculateSummaryStats(results);

    return {
      results,
      summary,
      processingTimeMs: Date.now() - startTime,
    };
  }

  async getTopOpportunities(
    tenantId: string,
    limit = 20,
  ): Promise<ExpansionPredictionResponseDto[]> {
    const predictions = await this.prisma.expansionPrediction.findMany({
      where: {
        tenantId,
        expansionProbability: { gte: 0.5 },
      },
      orderBy: { predictedRevenue: 'desc' },
      take: limit,
      distinct: ['customerId'],
    });

    return predictions.map((p) => {
      const signalsData = p.signals as { signals: string[]; readinessLevel: string };
      return {
        id: p.id,
        customerId: p.customerId,
        expansionProbability: p.expansionProbability,
        predictedRevenue: p.predictedRevenue,
        confidence: 0.85,
        readinessLevel: signalsData.readinessLevel,
        opportunities: p.recommendedProducts as ExpansionOpportunity[],
        signals: signalsData.signals,
        recommendations: [],
        optimalTiming: 'this_quarter',
        modelVersion: p.modelVersion,
        predictedAt: p.predictedAt,
      };
    });
  }

  private async generateOpportunities(
    request: ExpansionPredictionRequestDto,
    prediction: { probability: number; recommendations: string[] },
  ): Promise<ExpansionOpportunity[]> {
    const opportunities: ExpansionOpportunity[] = [];

    // Rule-based opportunities
    if (request.teamSize > 20 && request.usageGrowth > 15) {
      opportunities.push({
        type: 'seats',
        product: 'Additional User Licenses',
        description: 'Growing team indicates need for more seats',
        fitScore: Math.min(90, request.productFit + 10),
        potentialRevenue: request.currentMrr * 0.3,
        approach: 'Offer volume discount for seat expansion',
      });
    }

    if (request.featureRequests > 2) {
      opportunities.push({
        type: 'upgrade',
        product: 'Premium Plan',
        description: 'Feature requests suggest need for advanced capabilities',
        fitScore: Math.min(85, request.productFit + 5),
        potentialRevenue: request.currentMrr * 0.5,
        approach: 'Demo premium features addressing feature requests',
      });
    }

    if (request.stakeholderEngagement > 70) {
      opportunities.push({
        type: 'enterprise',
        product: 'Enterprise Package',
        description: 'High stakeholder engagement signals enterprise readiness',
        fitScore: request.stakeholderEngagement,
        potentialRevenue: request.currentMrr * 1.5,
        approach: 'Executive presentation on enterprise value',
      });
    }

    // AI-enhanced opportunities for high probability expansions
    if (prediction.probability > 0.6) {
      try {
        const aiOpportunities = await this.bedrock.generateJson<{
          opportunities: Array<{
            type: string;
            product: string;
            description: string;
            approach: string;
          }>;
        }>(
          `Generate 2 specific upsell opportunities for a customer with:
          - Current MRR: $${request.currentMrr}
          - Team size: ${request.teamSize}
          - Usage growth: ${request.usageGrowth}%
          - Product fit: ${request.productFit}%
          - Feature requests: ${request.featureRequests}`,
          `{
            "opportunities": [
              {"type": "string", "product": "string", "description": "string", "approach": "string"}
            ]
          }`,
          512,
        );

        for (const opp of aiOpportunities.opportunities) {
          opportunities.push({
            ...opp,
            fitScore: Math.round(prediction.probability * 100),
            potentialRevenue: request.currentMrr * 0.25,
          });
        }
      } catch (error) {
        this.logger.warn(`AI opportunities failed: ${error}`);
      }
    }

    return opportunities.slice(0, 5);
  }

  private identifySignals(
    request: ExpansionPredictionRequestDto,
    prediction: { probability: number },
  ): string[] {
    const signals: string[] = [];

    if (request.usageGrowth > 20) {
      signals.push('High usage growth indicates strong product adoption');
    }
    if (request.teamSize > 30) {
      signals.push('Large team size suggests organizational buy-in');
    }
    if (request.productFit > 80) {
      signals.push('Excellent product fit with customer needs');
    }
    if (request.stakeholderEngagement > 70) {
      signals.push('Multiple stakeholders actively engaged');
    }
    if (request.featureRequests > 3) {
      signals.push('Active feature requests show product investment');
    }
    if (request.upsellHistory > 0) {
      signals.push('Previous successful upsells demonstrate expansion willingness');
    }
    if (request.industryGrowth > 10) {
      signals.push('Growing industry suggests budget availability');
    }

    return signals;
  }

  private determineReadinessLevel(probability: number): string {
    if (probability >= 0.75) return 'urgent';
    if (probability >= 0.55) return 'ready';
    if (probability >= 0.35) return 'early';
    return 'not_ready';
  }

  private determineOptimalTiming(
    request: ExpansionPredictionRequestDto,
    prediction: { probability: number },
  ): string {
    if (prediction.probability >= 0.75 && request.usageGrowth > 20) {
      return 'immediate';
    }
    if (prediction.probability >= 0.55) {
      return 'this_month';
    }
    if (prediction.probability >= 0.35) {
      return 'this_quarter';
    }
    return 'nurture_6_months';
  }

  private calculateSummaryStats(
    results: ExpansionPredictionResponseDto[],
  ): ExpansionSummaryStats {
    const totalAnalyzed = results.length;
    const readyCount = results.filter(
      (r) => r.readinessLevel === 'ready' || r.readinessLevel === 'urgent',
    ).length;
    const totalPotentialRevenue = results.reduce(
      (sum, r) => sum + r.predictedRevenue,
      0,
    );
    const averageProbability =
      results.reduce((sum, r) => sum + r.expansionProbability, 0) / totalAnalyzed;

    return {
      totalAnalyzed,
      readyCount,
      totalPotentialRevenue: Math.round(totalPotentialRevenue),
      averageProbability: Math.round(averageProbability * 1000) / 1000,
    };
  }
}
