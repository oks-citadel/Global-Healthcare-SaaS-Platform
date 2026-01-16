import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import { BedrockProvider } from '../../providers/bedrock.provider';
import {
  CampaignForecastRequestDto,
  CampaignForecastResponseDto,
  CampaignScenariosResponseDto,
  CampaignScenarioDto,
} from './dto/campaign-forecast.dto';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);
  private readonly MODEL_VERSION = '1.0.0';
  private readonly CACHE_TTL = 3600;

  // Industry benchmark data
  private readonly benchmarks: Record<string, {
    ctr: number;
    conversionRate: number;
    cpm: number;
    avgOrderValue: number;
  }> = {
    email: { ctr: 0.025, conversionRate: 0.02, cpm: 0.5, avgOrderValue: 100 },
    social: { ctr: 0.01, conversionRate: 0.015, cpm: 8, avgOrderValue: 80 },
    ppc: { ctr: 0.035, conversionRate: 0.025, cpm: 25, avgOrderValue: 120 },
    content: { ctr: 0.02, conversionRate: 0.01, cpm: 2, avgOrderValue: 150 },
    webinar: { ctr: 0.15, conversionRate: 0.05, cpm: 15, avgOrderValue: 500 },
    event: { ctr: 0.1, conversionRate: 0.08, cpm: 50, avgOrderValue: 1000 },
  };

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private bedrock: BedrockProvider,
  ) {}

  async forecastCampaign(
    tenantId: string,
    request: CampaignForecastRequestDto,
  ): Promise<CampaignForecastResponseDto> {
    const startTime = Date.now();
    const cacheKey = `campaign-forecast:${tenantId}:${request.campaignId}`;

    // Check cache
    const cached = await this.redis.get<CampaignForecastResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const benchmark = this.benchmarks[request.campaignType] || this.benchmarks.email;

      // Calculate base metrics using historical data or benchmarks
      const effectiveCtr = request.historicalData?.averageCtr || benchmark.ctr;
      const effectiveConversionRate =
        request.historicalData?.averageConversionRate || benchmark.conversionRate;

      // Calculate reach based on budget and CPM
      const impressions = Math.floor(
        (request.budget / benchmark.cpm) * 1000,
      );
      const reach = Math.floor(impressions * 0.7); // Assuming 70% unique reach

      // Apply audience size constraint
      const constrainedReach = Math.min(reach, request.targetAudience.size);

      // Calculate funnel metrics
      const clicks = Math.floor(constrainedReach * effectiveCtr);
      const conversions = Math.floor(clicks * effectiveConversionRate);
      const revenue = conversions * benchmark.avgOrderValue;
      const roi = ((revenue - request.budget) / request.budget) * 100;
      const cpa = conversions > 0 ? request.budget / conversions : request.budget;

      // Calculate confidence intervals (using ±20% variance)
      const confidenceIntervals = {
        reach: {
          low: Math.floor(constrainedReach * 0.8),
          expected: constrainedReach,
          high: Math.floor(constrainedReach * 1.2),
        },
        conversions: {
          low: Math.floor(conversions * 0.7),
          expected: conversions,
          high: Math.floor(conversions * 1.4),
        },
        revenue: {
          low: Math.floor(revenue * 0.7),
          expected: revenue,
          high: Math.floor(revenue * 1.4),
        },
      };

      // Generate assumptions
      const assumptions = this.generateAssumptions(request, benchmark);

      // Identify risk factors
      const riskFactors = this.identifyRiskFactors(request, benchmark);

      // Get AI suggestions
      const suggestions = await this.getOptimizationSuggestions(request, {
        reach: constrainedReach,
        conversions,
        roi,
      });

      const response: CampaignForecastResponseDto = {
        id: crypto.randomUUID(),
        campaignId: request.campaignId,
        forecastedReach: constrainedReach,
        forecastedClicks: clicks,
        forecastedConversions: conversions,
        forecastedRevenue: revenue,
        forecastedROI: Math.round(roi * 100) / 100,
        forecastedCPA: Math.round(cpa * 100) / 100,
        confidenceIntervals,
        assumptions,
        riskFactors,
        suggestions,
        modelVersion: this.MODEL_VERSION,
        forecastedAt: new Date(),
      };

      // Store in database
      await this.prisma.campaignForecast.create({
        data: {
          id: response.id,
          tenantId,
          campaignId: request.campaignId,
          forecastedReach: response.forecastedReach,
          forecastedClicks: response.forecastedClicks,
          forecastedConversions: response.forecastedConversions,
          forecastedRevenue: response.forecastedRevenue,
          forecastedROI: response.forecastedROI,
          confidenceInterval: confidenceIntervals,
          assumptions: { assumptions, riskFactors },
          modelVersion: this.MODEL_VERSION,
        },
      });

      // Cache result
      await this.redis.set(cacheKey, response, this.CACHE_TTL);

      this.logger.debug(
        `Campaign forecast for ${request.campaignId} in ${Date.now() - startTime}ms`,
      );

      return response;
    } catch (error) {
      this.logger.error(`Campaign forecast failed: ${error}`);
      throw error;
    }
  }

  async generateScenarios(
    tenantId: string,
    request: CampaignForecastRequestDto,
  ): Promise<CampaignScenariosResponseDto> {
    const baseForecast = await this.forecastCampaign(tenantId, request);

    const scenarioMultipliers = [
      { name: 'Conservative', multiplier: 0.5 },
      { name: 'Moderate', multiplier: 0.75 },
      { name: 'Aggressive', multiplier: 1.5 },
      { name: 'Maximum', multiplier: 2.0 },
    ];

    const scenarios: CampaignScenarioDto[] = [];

    for (const scenario of scenarioMultipliers) {
      const scaledBudget = request.budget * scenario.multiplier;
      const scaledRequest = { ...request, budget: scaledBudget };
      const forecast = await this.forecastCampaign(tenantId, {
        ...scaledRequest,
        campaignId: `${request.campaignId}-${scenario.name.toLowerCase()}`,
      });

      scenarios.push({
        name: scenario.name,
        budgetMultiplier: scenario.multiplier,
        forecast: {
          reach: forecast.forecastedReach,
          conversions: forecast.forecastedConversions,
          revenue: forecast.forecastedRevenue,
          roi: forecast.forecastedROI,
        },
      });
    }

    // Determine recommended scenario based on ROI optimization
    const bestROI = scenarios.reduce((best, current) =>
      current.forecast.roi > best.forecast.roi ? current : best,
    );

    return {
      campaignId: request.campaignId,
      baseForecast,
      scenarios,
      recommendedScenario: bestROI.name,
    };
  }

  async getForecastHistory(
    tenantId: string,
    campaignId: string,
    limit = 10,
  ): Promise<CampaignForecastResponseDto[]> {
    const forecasts = await this.prisma.campaignForecast.findMany({
      where: { tenantId, campaignId },
      orderBy: { forecastedAt: 'desc' },
      take: limit,
    });

    return forecasts.map((f) => {
      const assumptions = f.assumptions as {
        assumptions: string[];
        riskFactors: string[];
      };
      return {
        id: f.id,
        campaignId: f.campaignId,
        forecastedReach: f.forecastedReach,
        forecastedClicks: f.forecastedClicks,
        forecastedConversions: f.forecastedConversions,
        forecastedRevenue: f.forecastedRevenue,
        forecastedROI: f.forecastedROI,
        forecastedCPA: f.forecastedRevenue / (f.forecastedConversions || 1),
        confidenceIntervals: f.confidenceInterval as CampaignForecastResponseDto['confidenceIntervals'],
        assumptions: assumptions.assumptions,
        riskFactors: assumptions.riskFactors,
        suggestions: [],
        modelVersion: f.modelVersion,
        forecastedAt: f.forecastedAt,
      };
    });
  }

  private generateAssumptions(
    request: CampaignForecastRequestDto,
    benchmark: typeof this.benchmarks.email,
  ): string[] {
    const assumptions: string[] = [];

    if (request.historicalData?.averageCtr) {
      assumptions.push(
        `Using historical CTR of ${(request.historicalData.averageCtr * 100).toFixed(2)}%`,
      );
    } else {
      assumptions.push(
        `Using industry benchmark CTR of ${(benchmark.ctr * 100).toFixed(2)}% for ${request.campaignType}`,
      );
    }

    assumptions.push(
      `Campaign duration of ${request.duration} days with consistent spend`,
    );
    assumptions.push(
      `Target audience of ${request.targetAudience.size.toLocaleString()} contacts`,
    );
    assumptions.push(`Channels: ${request.channels.join(', ')}`);
    assumptions.push(`Assuming stable market conditions during campaign period`);

    return assumptions;
  }

  private identifyRiskFactors(
    request: CampaignForecastRequestDto,
    benchmark: typeof this.benchmarks.email,
  ): string[] {
    const risks: string[] = [];

    if (request.budget < 1000) {
      risks.push('Low budget may limit reach and statistical significance');
    }

    if (request.duration < 7) {
      risks.push('Short duration may not allow for optimization');
    }

    if (request.targetAudience.size < 1000) {
      risks.push('Small audience may lead to audience fatigue');
    }

    if (!request.historicalData?.previousCampaigns) {
      risks.push('No historical data - forecasts based on industry benchmarks');
    }

    if (request.channels.length === 1) {
      risks.push('Single channel dependency increases risk');
    }

    const estimatedReach =
      (request.budget / benchmark.cpm) * 1000 * 0.7;
    if (estimatedReach > request.targetAudience.size * 0.8) {
      risks.push('Budget may exceed efficient reach for audience size');
    }

    return risks;
  }

  private async getOptimizationSuggestions(
    request: CampaignForecastRequestDto,
    metrics: { reach: number; conversions: number; roi: number },
  ): Promise<string[]> {
    const suggestions: string[] = [];

    // Rule-based suggestions
    if (metrics.roi < 100) {
      suggestions.push('Consider A/B testing ad creatives to improve CTR');
    }

    if (request.channels.length < 3) {
      suggestions.push('Expand to additional channels for better reach diversity');
    }

    if (request.targetAudience.segments.length < 2) {
      suggestions.push('Test multiple audience segments to find best performers');
    }

    // AI-enhanced suggestions
    try {
      const aiSuggestions = await this.bedrock.generateJson<{
        suggestions: string[];
      }>(
        `Generate 2 specific optimization suggestions for a ${request.campaignType} campaign with:
        - Budget: $${request.budget}
        - Target audience: ${request.targetAudience.size} people
        - Channels: ${request.channels.join(', ')}
        - Forecasted ROI: ${metrics.roi.toFixed(1)}%`,
        `{"suggestions": ["string", "string"]}`,
        256,
      );
      suggestions.push(...aiSuggestions.suggestions);
    } catch (error) {
      this.logger.warn(`AI suggestions failed: ${error}`);
    }

    return suggestions.slice(0, 5);
  }
}
