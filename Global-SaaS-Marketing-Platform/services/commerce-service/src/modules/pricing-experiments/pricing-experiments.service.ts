import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../config/redis.service';
import {
  CreatePricingExperimentDto,
  UpdatePricingExperimentDto,
  PricingExperimentQueryDto,
  PaginatedPricingExperimentsDto,
  PricingExperimentResponseDto,
  PricingVariantResponseDto,
  GetPriceDto,
  PriceResponseDto,
  ExperimentStatus,
} from './dto/pricing-experiment.dto';

@Injectable()
export class PricingExperimentsService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'pricing:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreatePricingExperimentDto): Promise<PricingExperimentResponseDto> {
    const existing = await this.prisma.pricingExperiment.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Experiment with key ${dto.key} already exists`);
    }

    // Validate variants
    if (!dto.variants || dto.variants.length < 2) {
      throw new BadRequestException('Experiment must have at least 2 variants');
    }

    const controlCount = dto.variants.filter((v) => v.isControl).length;
    if (controlCount !== 1) {
      throw new BadRequestException('Experiment must have exactly one control variant');
    }

    const experiment = await this.prisma.pricingExperiment.create({
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        status: ExperimentStatus.DRAFT,
        productId: dto.productId,
        basePrice: dto.basePrice,
        currency: dto.currency || 'USD',
        targetSegments: dto.targetSegments || [],
        trafficPercent: dto.trafficPercent ?? 100,
        startDate: dto.startDate,
        endDate: dto.endDate,
        variants: {
          create: dto.variants.map((v) => ({
            key: v.key,
            name: v.name,
            price: v.price,
            isControl: v.isControl || false,
            weight: v.weight || 50,
          })),
        },
      },
      include: { variants: true },
    });

    return this.mapToResponse(experiment);
  }

  async findAll(query: PricingExperimentQueryDto): Promise<PaginatedPricingExperimentsDto> {
    const { page = 1, limit = 20, status, productId, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (productId) {
      where.productId = productId;
    }

    if (search) {
      where.OR = [
        { key: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.pricingExperiment.findMany({
        where,
        skip,
        take: limit,
        include: { variants: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.pricingExperiment.count({ where }),
    ]);

    return {
      items: items.map((item) => this.mapToResponse(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByKey(key: string): Promise<PricingExperimentResponseDto> {
    // Try cache first
    const cached = await this.redis.get<PricingExperimentResponseDto>(
      `${this.CACHE_PREFIX}${key}`,
    );
    if (cached) return cached;

    const experiment = await this.prisma.pricingExperiment.findUnique({
      where: { key },
      include: { variants: true },
    });

    if (!experiment) {
      throw new NotFoundException(`Experiment with key ${key} not found`);
    }

    const response = this.mapToResponse(experiment);

    // Cache the result
    await this.redis.set(
      `${this.CACHE_PREFIX}${key}`,
      response,
      this.CACHE_TTL,
    );

    return response;
  }

  async update(
    key: string,
    dto: UpdatePricingExperimentDto,
  ): Promise<PricingExperimentResponseDto> {
    const existing = await this.prisma.pricingExperiment.findUnique({
      where: { key },
      include: { variants: true },
    });

    if (!existing) {
      throw new NotFoundException(`Experiment with key ${key} not found`);
    }

    // Handle variants update
    if (dto.variants) {
      await this.prisma.pricingVariant.deleteMany({
        where: { experimentId: existing.id },
      });

      await this.prisma.pricingVariant.createMany({
        data: dto.variants.map((v) => ({
          experimentId: existing.id,
          key: v.key,
          name: v.name,
          price: v.price,
          isControl: v.isControl || false,
          weight: v.weight || 50,
        })),
      });
    }

    const experiment = await this.prisma.pricingExperiment.update({
      where: { key },
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        status: dto.status,
        productId: dto.productId,
        basePrice: dto.basePrice,
        currency: dto.currency,
        targetSegments: dto.targetSegments,
        trafficPercent: dto.trafficPercent,
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
      include: { variants: true },
    });

    // Invalidate cache
    await this.redis.del(`${this.CACHE_PREFIX}${key}`);
    if (dto.key && dto.key !== key) {
      await this.redis.del(`${this.CACHE_PREFIX}${dto.key}`);
    }

    return this.mapToResponse(experiment);
  }

  async getPrice(dto: GetPriceDto): Promise<PriceResponseDto> {
    const { userId, productId } = dto;

    // Find active experiment for this product
    const now = new Date();
    const experiment = await this.prisma.pricingExperiment.findFirst({
      where: {
        productId,
        status: ExperimentStatus.RUNNING,
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      include: { variants: true },
    });

    if (!experiment) {
      // No active experiment, return default price
      return {
        productId,
        price: 99.99, // Default price - in real implementation, fetch from product service
        currency: 'USD',
        isExperiment: false,
      };
    }

    // Check if user is in experiment traffic
    const hash = this.hashUserId(userId, experiment.key);
    const normalizedHash = hash / 0xffffffff;

    if (normalizedHash * 100 > experiment.trafficPercent) {
      // User not in experiment traffic, return control price
      const controlVariant = experiment.variants.find((v) => v.isControl);
      return {
        productId,
        price: controlVariant?.price || experiment.basePrice,
        currency: experiment.currency,
        isExperiment: false,
      };
    }

    // Assign to variant based on weights
    const variant = this.selectVariant(experiment.variants, userId, experiment.key);

    // Track impression
    await this.prisma.pricingVariant.update({
      where: { id: variant.id },
      data: { impressions: { increment: 1 } },
    });

    return {
      productId,
      price: variant.price,
      currency: experiment.currency,
      experimentId: experiment.id,
      variantKey: variant.key,
      isExperiment: true,
    };
  }

  async trackConversion(
    experimentId: string,
    variantKey: string,
    revenue: number,
  ): Promise<void> {
    const variant = await this.prisma.pricingVariant.findFirst({
      where: {
        experimentId,
        key: variantKey,
      },
    });

    if (variant) {
      await this.prisma.pricingVariant.update({
        where: { id: variant.id },
        data: {
          conversions: { increment: 1 },
          revenue: { increment: revenue },
        },
      });
    }
  }

  private hashUserId(userId: string, experimentKey: string): number {
    const hash = createHash('md5')
      .update(`${userId}:${experimentKey}`)
      .digest('hex');
    return parseInt(hash.substring(0, 8), 16);
  }

  private selectVariant(variants: any[], userId: string, experimentKey: string): any {
    const hash = this.hashUserId(userId, experimentKey);
    const normalizedHash = (hash / 0xffffffff) * 100;

    let cumulative = 0;
    for (const variant of variants) {
      cumulative += variant.weight;
      if (normalizedHash < cumulative) {
        return variant;
      }
    }

    return variants[variants.length - 1];
  }

  private mapToResponse(experiment: any): PricingExperimentResponseDto {
    return {
      id: experiment.id,
      key: experiment.key,
      name: experiment.name,
      description: experiment.description || undefined,
      status: experiment.status as ExperimentStatus,
      productId: experiment.productId,
      basePrice: experiment.basePrice,
      currency: experiment.currency,
      variants: experiment.variants.map((v: any) => this.mapVariantToResponse(v)),
      targetSegments: experiment.targetSegments || [],
      trafficPercent: experiment.trafficPercent,
      startDate: experiment.startDate || undefined,
      endDate: experiment.endDate || undefined,
      createdAt: experiment.createdAt,
      updatedAt: experiment.updatedAt,
    };
  }

  private mapVariantToResponse(variant: any): PricingVariantResponseDto {
    const impressions = variant.impressions || 0;
    const conversions = variant.conversions || 0;
    const revenue = variant.revenue || 0;
    const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;
    const avgRevenuePerUser = impressions > 0 ? revenue / impressions : 0;

    return {
      id: variant.id,
      key: variant.key,
      name: variant.name,
      price: variant.price,
      isControl: variant.isControl,
      weight: variant.weight,
      impressions,
      conversions,
      revenue,
      conversionRate,
      avgRevenuePerUser,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };
  }
}
