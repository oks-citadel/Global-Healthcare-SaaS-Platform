import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import { BedrockProvider } from '../../providers/bedrock.provider';
import {
  GrowthRecommendationQueryDto,
  GrowthRecommendationResponseDto,
  GrowthRecommendationsListResponseDto,
  UpdateRecommendationStatusDto,
} from './dto/growth-recommendation.dto';

@Injectable()
export class RecommendationsService {
  private readonly logger = new Logger(RecommendationsService.name);
  private readonly CACHE_TTL = 3600;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private bedrock: BedrockProvider,
  ) {}

  async getGrowthRecommendations(
    tenantId: string,
    query: GrowthRecommendationQueryDto,
  ): Promise<GrowthRecommendationsListResponseDto> {
    const cacheKey = `growth-recommendations:${tenantId}:${JSON.stringify(query)}`;

    // Check cache
    const cached = await this.redis.get<GrowthRecommendationsListResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Generate AI-powered recommendations
      const recommendations = await this.generateRecommendations(tenantId, query);

      // Calculate summaries
      const categorySummary = this.calculateCategorySummary(recommendations);
      const totalEstimatedImpact = this.calculateTotalImpact(recommendations);

      const response: GrowthRecommendationsListResponseDto = {
        recommendations: recommendations.slice(
          query.offset || 0,
          (query.offset || 0) + (query.limit || 10),
        ),
        total: recommendations.length,
        categorySummary,
        totalEstimatedImpact,
      };

      // Cache result
      await this.redis.set(cacheKey, response, this.CACHE_TTL);

      // Store recommendations
      await this.storeRecommendations(tenantId, recommendations);

      return response;
    } catch (error) {
      this.logger.error(`Growth recommendations failed: ${error}`);
      throw error;
    }
  }

  async updateRecommendationStatus(
    tenantId: string,
    recommendationId: string,
    update: UpdateRecommendationStatusDto,
  ): Promise<GrowthRecommendationResponseDto> {
    const recommendation = await this.prisma.growthRecommendation.update({
      where: { id: recommendationId, tenantId },
      data: { status: update.status },
    });

    return this.mapRecommendation(recommendation);
  }

  async getRecommendationById(
    tenantId: string,
    recommendationId: string,
  ): Promise<GrowthRecommendationResponseDto> {
    const recommendation = await this.prisma.growthRecommendation.findFirst({
      where: { id: recommendationId, tenantId },
    });

    if (!recommendation) {
      throw new Error('Recommendation not found');
    }

    return this.mapRecommendation(recommendation);
  }

  private async generateRecommendations(
    tenantId: string,
    query: GrowthRecommendationQueryDto,
  ): Promise<GrowthRecommendationResponseDto[]> {
    const categories = query.categories || [
      'acquisition',
      'activation',
      'retention',
      'revenue',
      'referral',
    ];

    const recommendations: GrowthRecommendationResponseDto[] = [];

    // Generate recommendations for each category
    for (const category of categories) {
      const categoryRecommendations = await this.generateCategoryRecommendations(
        category,
      );
      recommendations.push(...categoryRecommendations);
    }

    // Sort by priority
    recommendations.sort((a, b) => b.priority - a.priority);

    // Filter by priority if specified
    if (query.priority) {
      const priorityThresholds: Record<string, number> = {
        low: 1,
        medium: 4,
        high: 7,
        critical: 9,
      };
      const threshold = priorityThresholds[query.priority];
      return recommendations.filter((r) => r.priority >= threshold);
    }

    return recommendations;
  }

  private async generateCategoryRecommendations(
    category: string,
  ): Promise<GrowthRecommendationResponseDto[]> {
    const categoryPrompts: Record<string, string> = {
      acquisition: 'customer acquisition and lead generation strategies',
      activation: 'user onboarding and activation improvement',
      retention: 'customer retention and churn reduction',
      revenue: 'revenue growth and monetization optimization',
      referral: 'referral program and word-of-mouth growth',
    };

    try {
      const aiRecommendations = await this.bedrock.generateJson<{
        recommendations: Array<{
          title: string;
          description: string;
          impact: string;
          effort: string;
          timeline: string;
          estimatedROI: number;
          actionItems: Array<{
            description: string;
            estimatedTime: string;
            owner: string;
          }>;
        }>;
      }>(
        `Generate 3 specific, actionable growth recommendations for ${categoryPrompts[category]}.
        Focus on data-driven strategies with measurable outcomes.`,
        `{
          "recommendations": [
            {
              "title": "string",
              "description": "string",
              "impact": "low|medium|high|transformational",
              "effort": "minimal|low|medium|high",
              "timeline": "string",
              "estimatedROI": 100,
              "actionItems": [{"description": "string", "estimatedTime": "string", "owner": "string"}]
            }
          ]
        }`,
        2048,
      );

      return aiRecommendations.recommendations.map((rec, index) => ({
        id: crypto.randomUUID(),
        category,
        title: rec.title,
        description: rec.description,
        impact: rec.impact,
        effort: rec.effort,
        priority: this.calculatePriority(rec.impact, rec.effort),
        metrics: this.generateMetrics(category),
        actionItems: rec.actionItems.map((item) => ({
          ...item,
          completed: false,
        })),
        estimatedROI: rec.estimatedROI,
        timeline: rec.timeline,
        prerequisites: this.generatePrerequisites(rec.effort),
        status: 'pending',
        generatedAt: new Date(),
      }));
    } catch (error) {
      this.logger.warn(`AI recommendations failed for ${category}: ${error}`);
      return this.getFallbackRecommendations(category);
    }
  }

  private calculatePriority(impact: string, effort: string): number {
    const impactScores: Record<string, number> = {
      transformational: 10,
      high: 8,
      medium: 5,
      low: 2,
    };
    const effortScores: Record<string, number> = {
      minimal: 2,
      low: 1,
      medium: 0,
      high: -1,
    };

    return Math.max(
      1,
      Math.min(10, (impactScores[impact] || 5) + (effortScores[effort] || 0)),
    );
  }

  private generateMetrics(category: string): GrowthRecommendationResponseDto['metrics'] {
    const metricsByCategory: Record<string, GrowthRecommendationResponseDto['metrics']> = {
      acquisition: [
        { name: 'CAC', currentValue: 150, targetValue: 100, unit: 'USD' },
        { name: 'Lead Conversion Rate', currentValue: 2.5, targetValue: 4, unit: '%' },
      ],
      activation: [
        { name: 'Activation Rate', currentValue: 45, targetValue: 65, unit: '%' },
        { name: 'Time to Value', currentValue: 7, targetValue: 3, unit: 'days' },
      ],
      retention: [
        { name: 'Monthly Churn Rate', currentValue: 5, targetValue: 2, unit: '%' },
        { name: 'NPS', currentValue: 35, targetValue: 50, unit: 'score' },
      ],
      revenue: [
        { name: 'ARPU', currentValue: 85, targetValue: 120, unit: 'USD' },
        { name: 'Expansion MRR', currentValue: 5, targetValue: 15, unit: '%' },
      ],
      referral: [
        { name: 'Referral Rate', currentValue: 8, targetValue: 20, unit: '%' },
        { name: 'Viral Coefficient', currentValue: 0.3, targetValue: 0.8, unit: 'K' },
      ],
    };

    return metricsByCategory[category] || [];
  }

  private generatePrerequisites(effort: string): string[] {
    const basePrerequisites = ['Analytics tracking configured', 'Team alignment'];

    if (effort === 'high') {
      return [
        ...basePrerequisites,
        'Engineering resources allocated',
        'Budget approved',
        'Stakeholder buy-in',
      ];
    } else if (effort === 'medium') {
      return [...basePrerequisites, 'Tool integrations set up'];
    }

    return basePrerequisites;
  }

  private getFallbackRecommendations(
    category: string,
  ): GrowthRecommendationResponseDto[] {
    const fallback: Record<string, GrowthRecommendationResponseDto> = {
      acquisition: {
        id: crypto.randomUUID(),
        category: 'acquisition',
        title: 'Implement content marketing funnel',
        description:
          'Create targeted content for each stage of the buyer journey to improve organic acquisition.',
        impact: 'high',
        effort: 'medium',
        priority: 8,
        metrics: this.generateMetrics('acquisition'),
        actionItems: [
          {
            description: 'Audit existing content',
            estimatedTime: '1 week',
            owner: 'Content Team',
            completed: false,
          },
          {
            description: 'Create content calendar',
            estimatedTime: '2 days',
            owner: 'Marketing Manager',
            completed: false,
          },
        ],
        estimatedROI: 250,
        timeline: '3 months',
        prerequisites: ['Content team available', 'SEO tools configured'],
        status: 'pending',
        generatedAt: new Date(),
      },
      activation: {
        id: crypto.randomUUID(),
        category: 'activation',
        title: 'Optimize onboarding flow',
        description:
          'Streamline the user onboarding experience to reduce time-to-value.',
        impact: 'high',
        effort: 'medium',
        priority: 8,
        metrics: this.generateMetrics('activation'),
        actionItems: [
          {
            description: 'Analyze drop-off points',
            estimatedTime: '3 days',
            owner: 'Product Team',
            completed: false,
          },
        ],
        estimatedROI: 180,
        timeline: '6 weeks',
        prerequisites: ['User analytics configured'],
        status: 'pending',
        generatedAt: new Date(),
      },
      retention: {
        id: crypto.randomUUID(),
        category: 'retention',
        title: 'Implement proactive customer success',
        description:
          'Create early warning system for at-risk customers with automated interventions.',
        impact: 'high',
        effort: 'medium',
        priority: 9,
        metrics: this.generateMetrics('retention'),
        actionItems: [
          {
            description: 'Define health score metrics',
            estimatedTime: '1 week',
            owner: 'CS Team',
            completed: false,
          },
        ],
        estimatedROI: 300,
        timeline: '2 months',
        prerequisites: ['Customer data centralized'],
        status: 'pending',
        generatedAt: new Date(),
      },
      revenue: {
        id: crypto.randomUUID(),
        category: 'revenue',
        title: 'Launch usage-based pricing tier',
        description:
          'Introduce a usage-based pricing option to capture more value from high-usage customers.',
        impact: 'transformational',
        effort: 'high',
        priority: 7,
        metrics: this.generateMetrics('revenue'),
        actionItems: [
          {
            description: 'Analyze usage patterns',
            estimatedTime: '2 weeks',
            owner: 'Data Team',
            completed: false,
          },
        ],
        estimatedROI: 400,
        timeline: '4 months',
        prerequisites: ['Usage tracking implemented', 'Billing system capable'],
        status: 'pending',
        generatedAt: new Date(),
      },
      referral: {
        id: crypto.randomUUID(),
        category: 'referral',
        title: 'Launch customer referral program',
        description:
          'Create a structured referral program with incentives for both referrer and referee.',
        impact: 'medium',
        effort: 'low',
        priority: 7,
        metrics: this.generateMetrics('referral'),
        actionItems: [
          {
            description: 'Design incentive structure',
            estimatedTime: '3 days',
            owner: 'Marketing Team',
            completed: false,
          },
        ],
        estimatedROI: 200,
        timeline: '6 weeks',
        prerequisites: ['Email marketing platform ready'],
        status: 'pending',
        generatedAt: new Date(),
      },
    };

    return [fallback[category]].filter(Boolean);
  }

  private calculateCategorySummary(
    recommendations: GrowthRecommendationResponseDto[],
  ): Record<string, number> {
    const summary: Record<string, number> = {};
    for (const rec of recommendations) {
      summary[rec.category] = (summary[rec.category] || 0) + 1;
    }
    return summary;
  }

  private calculateTotalImpact(
    recommendations: GrowthRecommendationResponseDto[],
  ): GrowthRecommendationsListResponseDto['totalEstimatedImpact'] {
    const avgROI =
      recommendations.reduce((sum, r) => sum + r.estimatedROI, 0) /
        recommendations.length || 0;

    return {
      revenueIncrease: Math.round(avgROI * 100),
      costSavings: Math.round(avgROI * 30),
      efficiencyGain: Math.round(avgROI * 0.5),
    };
  }

  private mapRecommendation(
    rec: {
      id: string;
      category: string;
      title: string;
      description: string;
      impact: string;
      effort: string;
      priority: number;
      metrics: unknown;
      actionItems: unknown;
      status: string;
      generatedAt: Date;
    },
  ): GrowthRecommendationResponseDto {
    return {
      id: rec.id,
      category: rec.category,
      title: rec.title,
      description: rec.description,
      impact: rec.impact,
      effort: rec.effort,
      priority: rec.priority,
      metrics: rec.metrics as GrowthRecommendationResponseDto['metrics'],
      actionItems: rec.actionItems as GrowthRecommendationResponseDto['actionItems'],
      estimatedROI: 0,
      timeline: '',
      prerequisites: [],
      status: rec.status,
      generatedAt: rec.generatedAt,
    };
  }

  private async storeRecommendations(
    tenantId: string,
    recommendations: GrowthRecommendationResponseDto[],
  ): Promise<void> {
    const data = recommendations.map((rec) => ({
      id: rec.id,
      tenantId,
      category: rec.category,
      title: rec.title,
      description: rec.description,
      impact: rec.impact,
      effort: rec.effort,
      priority: rec.priority,
      metrics: rec.metrics,
      actionItems: rec.actionItems,
      status: rec.status,
      generatedAt: rec.generatedAt,
    }));

    await this.prisma.growthRecommendation.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
