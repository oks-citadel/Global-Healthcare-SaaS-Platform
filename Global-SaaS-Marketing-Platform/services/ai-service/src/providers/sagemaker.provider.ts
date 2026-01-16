import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SageMakerRuntimeClient,
  InvokeEndpointCommand,
} from '@aws-sdk/client-sagemaker-runtime';

export interface SageMakerPredictionRequest {
  endpoint: string;
  payload: unknown;
  contentType?: string;
  accept?: string;
}

export interface SageMakerPredictionResponse {
  predictions: unknown;
  metadata?: Record<string, unknown>;
}

export interface LeadScoringInput {
  features: {
    companySize: string;
    industry: string;
    engagementScore: number;
    websiteVisits: number;
    emailOpens: number;
    downloadedAssets: number;
    demoRequested: boolean;
    budgetRange: string;
    decisionTimeframe: string;
    competitorMentions: number;
  };
}

export interface ChurnPredictionInput {
  features: {
    accountAge: number;
    monthlyUsage: number;
    supportTickets: number;
    featureAdoption: number;
    lastLoginDays: number;
    paymentIssues: number;
    contractValue: number;
    npsScore: number;
    engagementTrend: number;
  };
}

export interface ExpansionPredictionInput {
  features: {
    currentMrr: number;
    usageGrowth: number;
    featureRequests: number;
    teamSize: number;
    productFit: number;
    stakeholderEngagement: number;
    upsellHistory: number;
    industryGrowth: number;
  };
}

@Injectable()
export class SageMakerProvider {
  private readonly logger = new Logger(SageMakerProvider.name);
  private readonly client: SageMakerRuntimeClient;

  constructor(private configService: ConfigService) {
    this.client = new SageMakerRuntimeClient({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', ''),
      },
    });
  }

  async invoke(
    request: SageMakerPredictionRequest,
  ): Promise<SageMakerPredictionResponse> {
    try {
      const command = new InvokeEndpointCommand({
        EndpointName: request.endpoint,
        Body: JSON.stringify(request.payload),
        ContentType: request.contentType || 'application/json',
        Accept: request.accept || 'application/json',
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.Body));

      return {
        predictions: responseBody,
        metadata: {
          contentType: response.ContentType,
          invokedProductionVariant: response.InvokedProductionVariant,
        },
      };
    } catch (error) {
      this.logger.error(`SageMaker invoke failed: ${error}`);
      throw error;
    }
  }

  async predictLeadScore(
    input: LeadScoringInput,
  ): Promise<{ score: number; confidence: number; factors: string[] }> {
    const endpoint = this.configService.get(
      'SAGEMAKER_LEAD_SCORING_ENDPOINT',
      'lead-scoring-endpoint',
    );

    try {
      const response = await this.invoke({
        endpoint,
        payload: {
          instances: [this.transformLeadFeatures(input.features)],
        },
      });

      const predictions = response.predictions as {
        predictions: Array<{
          score: number;
          confidence: number;
          factors: string[];
        }>;
      };

      return predictions.predictions[0];
    } catch (error) {
      this.logger.warn(
        `SageMaker lead scoring failed, using fallback: ${error}`,
      );
      return this.fallbackLeadScoring(input);
    }
  }

  async predictChurn(
    input: ChurnPredictionInput,
  ): Promise<{
    probability: number;
    riskLevel: string;
    factors: string[];
  }> {
    const endpoint = this.configService.get(
      'SAGEMAKER_CHURN_ENDPOINT',
      'churn-prediction-endpoint',
    );

    try {
      const response = await this.invoke({
        endpoint,
        payload: {
          instances: [this.transformChurnFeatures(input.features)],
        },
      });

      const predictions = response.predictions as {
        predictions: Array<{
          probability: number;
          risk_level: string;
          factors: string[];
        }>;
      };

      return {
        probability: predictions.predictions[0].probability,
        riskLevel: predictions.predictions[0].risk_level,
        factors: predictions.predictions[0].factors,
      };
    } catch (error) {
      this.logger.warn(
        `SageMaker churn prediction failed, using fallback: ${error}`,
      );
      return this.fallbackChurnPrediction(input);
    }
  }

  async predictExpansion(
    input: ExpansionPredictionInput,
  ): Promise<{
    probability: number;
    predictedRevenue: number;
    recommendations: string[];
  }> {
    const endpoint = this.configService.get(
      'SAGEMAKER_EXPANSION_ENDPOINT',
      'expansion-prediction-endpoint',
    );

    try {
      const response = await this.invoke({
        endpoint,
        payload: {
          instances: [this.transformExpansionFeatures(input.features)],
        },
      });

      const predictions = response.predictions as {
        predictions: Array<{
          probability: number;
          predicted_revenue: number;
          recommendations: string[];
        }>;
      };

      return {
        probability: predictions.predictions[0].probability,
        predictedRevenue: predictions.predictions[0].predicted_revenue,
        recommendations: predictions.predictions[0].recommendations,
      };
    } catch (error) {
      this.logger.warn(
        `SageMaker expansion prediction failed, using fallback: ${error}`,
      );
      return this.fallbackExpansionPrediction(input);
    }
  }

  private transformLeadFeatures(
    features: LeadScoringInput['features'],
  ): number[] {
    const companySizeMap: Record<string, number> = {
      '1-10': 0.1,
      '11-50': 0.3,
      '51-200': 0.5,
      '201-1000': 0.7,
      '1000+': 1.0,
    };

    const budgetRangeMap: Record<string, number> = {
      '<$1k': 0.1,
      '$1k-$5k': 0.3,
      '$5k-$25k': 0.5,
      '$25k-$100k': 0.7,
      '$100k+': 1.0,
    };

    const timeframeMap: Record<string, number> = {
      immediate: 1.0,
      '1-3 months': 0.7,
      '3-6 months': 0.5,
      '6-12 months': 0.3,
      'no timeline': 0.1,
    };

    return [
      companySizeMap[features.companySize] || 0.5,
      features.engagementScore / 100,
      Math.min(features.websiteVisits / 50, 1),
      Math.min(features.emailOpens / 20, 1),
      Math.min(features.downloadedAssets / 10, 1),
      features.demoRequested ? 1 : 0,
      budgetRangeMap[features.budgetRange] || 0.5,
      timeframeMap[features.decisionTimeframe] || 0.5,
      Math.min(features.competitorMentions / 5, 1),
    ];
  }

  private transformChurnFeatures(
    features: ChurnPredictionInput['features'],
  ): number[] {
    return [
      Math.min(features.accountAge / 36, 1),
      Math.min(features.monthlyUsage / 100, 1),
      Math.min(features.supportTickets / 10, 1),
      features.featureAdoption / 100,
      Math.min(features.lastLoginDays / 30, 1),
      Math.min(features.paymentIssues / 3, 1),
      Math.min(features.contractValue / 10000, 1),
      features.npsScore / 10,
      (features.engagementTrend + 1) / 2,
    ];
  }

  private transformExpansionFeatures(
    features: ExpansionPredictionInput['features'],
  ): number[] {
    return [
      Math.min(features.currentMrr / 10000, 1),
      (features.usageGrowth + 100) / 200,
      Math.min(features.featureRequests / 10, 1),
      Math.min(features.teamSize / 100, 1),
      features.productFit / 100,
      features.stakeholderEngagement / 100,
      Math.min(features.upsellHistory / 5, 1),
      (features.industryGrowth + 50) / 100,
    ];
  }

  private fallbackLeadScoring(
    input: LeadScoringInput,
  ): { score: number; confidence: number; factors: string[] } {
    const { features } = input;
    const factors: string[] = [];
    let score = 50;

    if (features.demoRequested) {
      score += 20;
      factors.push('Demo requested');
    }
    if (features.engagementScore > 70) {
      score += 15;
      factors.push('High engagement');
    }
    if (features.downloadedAssets >= 3) {
      score += 10;
      factors.push('Multiple content downloads');
    }
    if (features.decisionTimeframe === 'immediate') {
      score += 15;
      factors.push('Immediate purchase timeline');
    }
    if (features.budgetRange === '$100k+' || features.budgetRange === '$25k-$100k') {
      score += 10;
      factors.push('High budget range');
    }

    return {
      score: Math.min(score, 100),
      confidence: 0.75,
      factors,
    };
  }

  private fallbackChurnPrediction(
    input: ChurnPredictionInput,
  ): { probability: number; riskLevel: string; factors: string[] } {
    const { features } = input;
    const factors: string[] = [];
    let probability = 0.2;

    if (features.lastLoginDays > 14) {
      probability += 0.2;
      factors.push('Low recent activity');
    }
    if (features.supportTickets > 5) {
      probability += 0.15;
      factors.push('High support ticket volume');
    }
    if (features.featureAdoption < 30) {
      probability += 0.15;
      factors.push('Low feature adoption');
    }
    if (features.npsScore < 5) {
      probability += 0.15;
      factors.push('Low NPS score');
    }
    if (features.engagementTrend < -0.2) {
      probability += 0.1;
      factors.push('Declining engagement');
    }
    if (features.paymentIssues > 0) {
      probability += 0.1;
      factors.push('Payment issues');
    }

    probability = Math.min(probability, 0.95);

    let riskLevel = 'low';
    if (probability > 0.7) riskLevel = 'critical';
    else if (probability > 0.5) riskLevel = 'high';
    else if (probability > 0.3) riskLevel = 'medium';

    return { probability, riskLevel, factors };
  }

  private fallbackExpansionPrediction(
    input: ExpansionPredictionInput,
  ): { probability: number; predictedRevenue: number; recommendations: string[] } {
    const { features } = input;
    const recommendations: string[] = [];
    let probability = 0.3;

    if (features.usageGrowth > 20) {
      probability += 0.2;
      recommendations.push('High usage growth - consider capacity upgrade');
    }
    if (features.featureRequests > 3) {
      probability += 0.15;
      recommendations.push('Feature interest - introduce premium features');
    }
    if (features.productFit > 70) {
      probability += 0.15;
      recommendations.push('Strong product fit - expand use cases');
    }
    if (features.teamSize > 20) {
      probability += 0.1;
      recommendations.push('Growing team - offer enterprise seats');
    }
    if (features.stakeholderEngagement > 60) {
      probability += 0.1;
      recommendations.push('Multi-stakeholder engagement - enterprise pitch');
    }

    probability = Math.min(probability, 0.9);
    const predictedRevenue = features.currentMrr * (1 + probability);

    return { probability, predictedRevenue, recommendations };
  }
}
