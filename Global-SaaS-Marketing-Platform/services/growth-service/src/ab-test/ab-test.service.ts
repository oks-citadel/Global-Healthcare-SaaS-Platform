import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateABTestDto, ABTestResultsDto, ABTestVariantResultDto } from './dto/ab-test.dto';

@Injectable()
export class AbTestService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateABTestDto, userId?: string) {
    // Validate traffic percentages sum to 100
    const totalTraffic = dto.variants.reduce((sum, v) => sum + v.trafficPercentage, 0);
    if (totalTraffic !== 100) {
      throw new BadRequestException('Traffic percentages must sum to 100');
    }

    // Ensure at least one control variant
    const hasControl = dto.variants.some((v) => v.isControl);
    if (!hasControl) {
      dto.variants[0].isControl = true;
    }

    const test = await this.prisma.aBTest.create({
      data: {
        name: dto.name,
        description: dto.description,
        landingPageId: dto.landingPageId,
        type: dto.type || 'SPLIT',
        targetSampleSize: dto.targetSampleSize,
        confidenceLevel: dto.confidenceLevel || 0.95,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        trafficSplit: dto.variants.map((v) => ({
          name: v.name,
          percentage: v.trafficPercentage,
        })),
        createdBy: userId,
        variants: {
          create: dto.variants.map((v) => ({
            name: v.name,
            variantId: v.variantId,
            trafficPercentage: v.trafficPercentage,
            isControl: v.isControl || false,
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    return test;
  }

  async findAll(status?: string, landingPageId?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (landingPageId) {
      where.landingPageId = landingPageId;
    }

    return this.prisma.aBTest.findMany({
      where,
      include: {
        variants: true,
        landingPage: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const test = await this.prisma.aBTest.findUnique({
      where: { id },
      include: {
        variants: true,
        landingPage: true,
      },
    });

    if (!test) {
      throw new NotFoundException(`A/B test with ID ${id} not found`);
    }

    return test;
  }

  async start(id: string) {
    const test = await this.findOne(id);

    if (test.status !== 'DRAFT' && test.status !== 'PAUSED') {
      throw new BadRequestException('Only draft or paused tests can be started');
    }

    return this.prisma.aBTest.update({
      where: { id },
      data: {
        status: 'RUNNING',
        startDate: test.startDate || new Date(),
      },
      include: {
        variants: true,
      },
    });
  }

  async stop(id: string) {
    const test = await this.findOne(id);

    if (test.status !== 'RUNNING') {
      throw new BadRequestException('Only running tests can be stopped');
    }

    // Calculate results and determine winner
    const results = await this.calculateResults(id);

    return this.prisma.aBTest.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endDate: new Date(),
        completedAt: new Date(),
        winningVariantId: results.winningVariant?.id,
        statisticalSignificance: results.confidenceLevel,
        conclusionNotes: results.recommendation,
      },
      include: {
        variants: true,
      },
    });
  }

  async getResults(id: string): Promise<ABTestResultsDto> {
    return this.calculateResults(id);
  }

  private async calculateResults(id: string): Promise<ABTestResultsDto> {
    const test = await this.findOne(id);
    const variants = test.variants;

    const totalVisitors = variants.reduce((sum, v) => sum + v.visitors, 0);
    const totalConversions = variants.reduce((sum, v) => sum + v.conversions, 0);

    const controlVariant = variants.find((v) => v.isControl);
    const controlConversionRate = controlVariant && controlVariant.visitors > 0
      ? controlVariant.conversions / controlVariant.visitors
      : 0;

    const variantResults: ABTestVariantResultDto[] = variants.map((v) => {
      const conversionRate = v.visitors > 0 ? v.conversions / v.visitors : 0;
      const improvement = controlConversionRate > 0
        ? ((conversionRate - controlConversionRate) / controlConversionRate) * 100
        : 0;

      // Calculate statistical significance using Z-test approximation
      const significance = this.calculateSignificance(
        controlVariant?.conversions || 0,
        controlVariant?.visitors || 0,
        v.conversions,
        v.visitors,
      );

      return {
        id: v.id,
        name: v.name,
        trafficPercentage: Number(v.trafficPercentage),
        visitors: v.visitors,
        conversions: v.conversions,
        conversionRate: Math.round(conversionRate * 10000) / 100,
        isControl: v.isControl,
        isWinner: v.isWinner,
        improvement: v.isControl ? 0 : Math.round(improvement * 100) / 100,
        significance: v.isControl ? 100 : Math.round(significance * 10000) / 100,
      };
    });

    // Determine winner (highest conversion rate with statistical significance)
    const significantVariants = variantResults.filter(
      (v) => !v.isControl && (v.significance || 0) >= Number(test.confidenceLevel) * 100,
    );

    let winningVariant: ABTestVariantResultDto | undefined;
    if (significantVariants.length > 0) {
      winningVariant = significantVariants.reduce((best, v) =>
        v.conversionRate > best.conversionRate ? v : best,
      );
    }

    const isSignificant = winningVariant !== undefined;
    const daysRunning = test.startDate
      ? Math.ceil((Date.now() - new Date(test.startDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    let recommendation: string;
    if (!test.startDate || totalVisitors === 0) {
      recommendation = 'Not enough data to make a recommendation. Start the test and wait for more visitors.';
    } else if (totalVisitors < (test.targetSampleSize || 100)) {
      recommendation = `Need more visitors. Currently at ${totalVisitors}/${test.targetSampleSize || 100} target sample size.`;
    } else if (isSignificant && winningVariant) {
      recommendation = `Implement variant "${winningVariant.name}" which shows ${winningVariant.improvement}% improvement with ${winningVariant.significance}% confidence.`;
    } else {
      recommendation = 'No statistically significant winner yet. Consider running the test longer or increasing sample size.';
    }

    return {
      testId: test.id,
      testName: test.name,
      status: test.status as any,
      totalVisitors,
      totalConversions,
      variants: variantResults,
      winningVariant,
      isSignificant,
      confidenceLevel: Number(test.confidenceLevel) * 100,
      recommendation,
      startDate: test.startDate || undefined,
      endDate: test.endDate || undefined,
      daysRunning,
    };
  }

  private calculateSignificance(
    controlConversions: number,
    controlVisitors: number,
    variantConversions: number,
    variantVisitors: number,
  ): number {
    if (controlVisitors === 0 || variantVisitors === 0) {
      return 0;
    }

    const p1 = controlConversions / controlVisitors;
    const p2 = variantConversions / variantVisitors;
    const n1 = controlVisitors;
    const n2 = variantVisitors;

    // Pooled proportion
    const pPooled = (controlConversions + variantConversions) / (n1 + n2);

    // Standard error
    const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / n1 + 1 / n2));

    if (se === 0) {
      return 0;
    }

    // Z-score
    const z = Math.abs(p2 - p1) / se;

    // Convert Z-score to confidence level (simplified approximation)
    // Using standard normal distribution approximation
    const confidence = this.zToConfidence(z);

    return confidence;
  }

  private zToConfidence(z: number): number {
    // Approximation of CDF for standard normal distribution
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * z);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

    return 0.5 * (1.0 + sign * y);
  }

  async recordVisit(testId: string, variantId: string) {
    await this.prisma.aBTestVariant.update({
      where: { id: variantId },
      data: {
        visitors: { increment: 1 },
      },
    });
  }

  async recordConversion(testId: string, variantId: string) {
    await this.prisma.aBTestVariant.update({
      where: { id: variantId },
      data: {
        conversions: { increment: 1 },
      },
    });

    // Update conversion rate
    const variant = await this.prisma.aBTestVariant.findUnique({
      where: { id: variantId },
    });

    if (variant && variant.visitors > 0) {
      await this.prisma.aBTestVariant.update({
        where: { id: variantId },
        data: {
          conversionRate: variant.conversions / variant.visitors,
        },
      });
    }
  }

  async getVariantForVisitor(testId: string): Promise<{ variantId: string; name: string }> {
    const test = await this.findOne(testId);

    if (test.status !== 'RUNNING') {
      throw new BadRequestException('This test is not currently running');
    }

    // Simple weighted random selection based on traffic percentages
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const variant of test.variants) {
      cumulative += Number(variant.trafficPercentage);
      if (random <= cumulative) {
        return { variantId: variant.id, name: variant.name };
      }
    }

    // Fallback to first variant
    const firstVariant = test.variants[0];
    return { variantId: firstVariant.id, name: firstVariant.name };
  }
}
