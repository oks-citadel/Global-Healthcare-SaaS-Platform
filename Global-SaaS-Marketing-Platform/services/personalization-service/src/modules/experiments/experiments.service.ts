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
  CreateExperimentDto,
  UpdateExperimentDto,
  ExperimentQueryDto,
  PaginatedExperimentsDto,
  ExperimentResponseDto,
  AssignmentRequestDto,
  AssignmentResponseDto,
  ExperimentResultsDto,
  VariantResultDto,
  ConcludeExperimentDto,
  ConcludeResponseDto,
  ExperimentStatus,
  ExperimentType,
  VariantResponseDto,
} from './dto/experiment.dto';

@Injectable()
export class ExperimentsService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'experiment:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateExperimentDto): Promise<ExperimentResponseDto> {
    const existing = await this.prisma.experiment.findUnique({
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

    // Validate weights sum to ~100
    const totalWeight = dto.variants.reduce((sum, v) => sum + (v.weight || 50), 0);
    if (Math.abs(totalWeight - 100) > 1) {
      throw new BadRequestException('Variant weights must sum to 100');
    }

    const experiment = await this.prisma.experiment.create({
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        hypothesis: dto.hypothesis,
        status: ExperimentStatus.DRAFT,
        type: dto.type || ExperimentType.AB_TEST,
        targetSegments: dto.targetSegments || [],
        trafficPercent: dto.trafficPercent ?? 100,
        startDate: dto.startDate,
        endDate: dto.endDate,
        variants: {
          create: dto.variants.map((v) => ({
            key: v.key,
            name: v.name,
            description: v.description,
            isControl: v.isControl || false,
            weight: v.weight || 50,
            payload: v.payload,
          })),
        },
      },
      include: { variants: true },
    });

    const response = this.mapToResponse(experiment);

    // Cache the experiment
    await this.redis.set(
      `${this.CACHE_PREFIX}${experiment.key}`,
      response,
      this.CACHE_TTL,
    );

    return response;
  }

  async findAll(query: ExperimentQueryDto): Promise<PaginatedExperimentsDto> {
    const { page = 1, limit = 20, status, type, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { key: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.experiment.findMany({
        where,
        skip,
        take: limit,
        include: { variants: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.experiment.count({ where }),
    ]);

    return {
      items: items.map((item) => this.mapToResponse(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<ExperimentResponseDto> {
    const experiment = await this.prisma.experiment.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!experiment) {
      throw new NotFoundException(`Experiment with ID ${id} not found`);
    }

    return this.mapToResponse(experiment);
  }

  async findByKey(key: string): Promise<ExperimentResponseDto> {
    // Try cache first
    const cached = await this.redis.get<ExperimentResponseDto>(
      `${this.CACHE_PREFIX}${key}`,
    );
    if (cached) return cached;

    const experiment = await this.prisma.experiment.findUnique({
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

  async update(id: string, dto: UpdateExperimentDto): Promise<ExperimentResponseDto> {
    const existing = await this.prisma.experiment.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existing) {
      throw new NotFoundException(`Experiment with ID ${id} not found`);
    }

    // Check for duplicate key if updating
    if (dto.key && dto.key !== existing.key) {
      const duplicate = await this.prisma.experiment.findUnique({
        where: { key: dto.key },
      });
      if (duplicate) {
        throw new ConflictException(`Experiment with key ${dto.key} already exists`);
      }
    }

    // Can only update certain fields if experiment is running
    if (existing.status === ExperimentStatus.RUNNING) {
      const allowedUpdates = ['name', 'description', 'endDate', 'status'];
      const attemptedUpdates = Object.keys(dto);
      const invalidUpdates = attemptedUpdates.filter(
        (key) => !allowedUpdates.includes(key),
      );
      if (invalidUpdates.length > 0) {
        throw new BadRequestException(
          `Cannot update ${invalidUpdates.join(', ')} while experiment is running`,
        );
      }
    }

    // Handle variants update
    if (dto.variants) {
      // Delete existing variants and create new ones
      await this.prisma.experimentVariant.deleteMany({
        where: { experimentId: id },
      });

      await this.prisma.experimentVariant.createMany({
        data: dto.variants.map((v) => ({
          experimentId: id,
          key: v.key,
          name: v.name,
          description: v.description,
          isControl: v.isControl || false,
          weight: v.weight || 50,
          payload: v.payload,
        })),
      });
    }

    const experiment = await this.prisma.experiment.update({
      where: { id },
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        hypothesis: dto.hypothesis,
        status: dto.status,
        type: dto.type,
        targetSegments: dto.targetSegments,
        trafficPercent: dto.trafficPercent,
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
      include: { variants: true },
    });

    const response = this.mapToResponse(experiment);

    // Invalidate caches
    await this.invalidateExperimentCache(existing.key);
    if (dto.key && dto.key !== existing.key) {
      await this.invalidateExperimentCache(dto.key);
    }

    return response;
  }

  async delete(id: string): Promise<void> {
    const experiment = await this.prisma.experiment.findUnique({
      where: { id },
    });

    if (!experiment) {
      throw new NotFoundException(`Experiment with ID ${id} not found`);
    }

    if (experiment.status === ExperimentStatus.RUNNING) {
      throw new BadRequestException('Cannot delete a running experiment');
    }

    await this.prisma.experiment.delete({
      where: { id },
    });

    await this.invalidateExperimentCache(experiment.key);
  }

  async assignUser(
    experimentId: string,
    dto: AssignmentRequestDto,
  ): Promise<AssignmentResponseDto> {
    const experiment = await this.prisma.experiment.findUnique({
      where: { id: experimentId },
      include: { variants: true },
    });

    if (!experiment) {
      throw new NotFoundException(`Experiment with ID ${experimentId} not found`);
    }

    if (experiment.status !== ExperimentStatus.RUNNING) {
      throw new BadRequestException('Experiment is not running');
    }

    // Get or resolve profile ID
    let profileId: string | null = null;
    let profile = await this.prisma.profile.findUnique({
      where: { id: dto.userId },
    });

    if (!profile) {
      profile = await this.prisma.profile.findUnique({
        where: { externalUserId: dto.userId },
      });
    }

    if (profile) {
      profileId = profile.id;

      // Check for existing assignment
      const existingAssignment = await this.prisma.experimentAssignment.findUnique({
        where: {
          experimentId_profileId: {
            experimentId: experiment.id,
            profileId: profile.id,
          },
        },
        include: { variant: true },
      });

      if (existingAssignment) {
        return {
          experimentId: experiment.id,
          experimentKey: experiment.key,
          variantId: existingAssignment.variant.id,
          variantKey: existingAssignment.variant.key,
          userId: dto.userId,
          payload: existingAssignment.variant.payload as Record<string, any> | undefined,
          assignedAt: existingAssignment.assignedAt,
          isNewAssignment: false,
        };
      }
    }

    // Check traffic percent - use consistent hashing
    const hash = this.hashUserId(dto.userId, experiment.key);
    const normalizedHash = hash / 0xffffffff;

    if (normalizedHash * 100 > experiment.trafficPercent) {
      // User not in experiment traffic
      const controlVariant = experiment.variants.find((v) => v.isControl);
      return {
        experimentId: experiment.id,
        experimentKey: experiment.key,
        variantId: controlVariant!.id,
        variantKey: controlVariant!.key,
        userId: dto.userId,
        payload: controlVariant!.payload as Record<string, any> | undefined,
        assignedAt: new Date(),
        isNewAssignment: false,
      };
    }

    // Assign to variant based on weights
    const variant = this.selectVariant(experiment.variants, dto.userId, experiment.key);

    // Store assignment if we have a profile
    if (profileId) {
      await this.prisma.experimentAssignment.create({
        data: {
          experimentId: experiment.id,
          variantId: variant.id,
          profileId,
        },
      });
    }

    return {
      experimentId: experiment.id,
      experimentKey: experiment.key,
      variantId: variant.id,
      variantKey: variant.key,
      userId: dto.userId,
      payload: variant.payload as Record<string, any> | undefined,
      assignedAt: new Date(),
      isNewAssignment: true,
    };
  }

  async getResults(experimentId: string): Promise<ExperimentResultsDto> {
    const experiment = await this.prisma.experiment.findUnique({
      where: { id: experimentId },
      include: {
        variants: true,
        results: true,
      },
    });

    if (!experiment) {
      throw new NotFoundException(`Experiment with ID ${experimentId} not found`);
    }

    // Get assignment counts per variant
    const assignmentCounts = await this.prisma.experimentAssignment.groupBy({
      by: ['variantId'],
      where: { experimentId: experiment.id },
      _count: { id: true },
    });

    const countMap = new Map(
      assignmentCounts.map((ac) => [ac.variantId, ac._count.id]),
    );

    const totalParticipants = assignmentCounts.reduce(
      (sum, ac) => sum + ac._count.id,
      0,
    );

    const controlVariant = experiment.variants.find((v) => v.isControl);
    const controlCount = countMap.get(controlVariant?.id || '') || 0;

    const variantResults: VariantResultDto[] = experiment.variants.map((variant) => {
      const participants = countMap.get(variant.id) || 0;
      // In a real implementation, you'd track actual conversions
      const conversions = Math.floor(participants * (Math.random() * 0.2 + 0.05));
      const conversionRate = participants > 0 ? conversions / participants : 0;

      let improvement: number | undefined;
      let confidence: number | undefined;

      if (!variant.isControl && controlCount > 0) {
        const controlConversions = Math.floor(
          controlCount * (Math.random() * 0.2 + 0.05),
        );
        const controlRate = controlConversions / controlCount;
        improvement = controlRate > 0 ? ((conversionRate - controlRate) / controlRate) * 100 : 0;
        confidence = this.calculateConfidence(
          participants,
          conversions,
          controlCount,
          controlConversions,
        );
      }

      return {
        variantKey: variant.key,
        variantName: variant.name,
        isControl: variant.isControl,
        participants,
        conversions,
        conversionRate,
        improvement,
        confidence,
        metrics: {},
      };
    });

    return {
      experimentId: experiment.id,
      experimentKey: experiment.key,
      status: experiment.status as ExperimentStatus,
      totalParticipants,
      variantResults,
      winningVariant: experiment.results?.winningVariant || undefined,
      statisticalSignificance: experiment.results?.confidence || undefined,
      startDate: experiment.startDate || experiment.createdAt,
      endDate: experiment.endDate || undefined,
      lastUpdated: new Date(),
    };
  }

  async conclude(
    experimentId: string,
    dto: ConcludeExperimentDto,
  ): Promise<ConcludeResponseDto> {
    const experiment = await this.prisma.experiment.findUnique({
      where: { id: experimentId },
      include: { variants: true },
    });

    if (!experiment) {
      throw new NotFoundException(`Experiment with ID ${experimentId} not found`);
    }

    if (experiment.status === ExperimentStatus.CONCLUDED) {
      throw new BadRequestException('Experiment is already concluded');
    }

    // Validate winning variant exists
    const winningVariant = experiment.variants.find(
      (v) => v.key === dto.winningVariant,
    );
    if (!winningVariant) {
      throw new BadRequestException(
        `Variant with key ${dto.winningVariant} not found`,
      );
    }

    // Get assignment counts for sample size
    const assignmentCount = await this.prisma.experimentAssignment.count({
      where: { experimentId: experiment.id },
    });

    // Create or update results
    await this.prisma.experimentResult.upsert({
      where: { experimentId: experiment.id },
      create: {
        experimentId: experiment.id,
        winningVariant: dto.winningVariant,
        conclusion: dto.conclusion,
        sampleSize: assignmentCount,
        metrics: {},
        concludedAt: new Date(),
      },
      update: {
        winningVariant: dto.winningVariant,
        conclusion: dto.conclusion,
        sampleSize: assignmentCount,
        concludedAt: new Date(),
      },
    });

    // Update experiment status
    await this.prisma.experiment.update({
      where: { id: experimentId },
      data: {
        status: ExperimentStatus.CONCLUDED,
        endDate: new Date(),
      },
    });

    // Invalidate cache
    await this.invalidateExperimentCache(experiment.key);

    return {
      experimentId: experiment.id,
      experimentKey: experiment.key,
      status: ExperimentStatus.CONCLUDED,
      winningVariant: dto.winningVariant,
      conclusion: dto.conclusion,
      concludedAt: new Date(),
    };
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

  private calculateConfidence(
    treatmentN: number,
    treatmentConversions: number,
    controlN: number,
    controlConversions: number,
  ): number {
    // Simple z-test for proportions
    if (treatmentN === 0 || controlN === 0) return 0;

    const p1 = treatmentConversions / treatmentN;
    const p2 = controlConversions / controlN;
    const p = (treatmentConversions + controlConversions) / (treatmentN + controlN);

    const se = Math.sqrt(p * (1 - p) * (1 / treatmentN + 1 / controlN));
    if (se === 0) return 0;

    const z = Math.abs(p1 - p2) / se;

    // Convert z-score to approximate confidence
    // Using normal distribution approximation
    const confidence = (1 - Math.exp(-0.5 * z * z)) * 100;
    return Math.min(Math.max(confidence, 0), 99.9);
  }

  private mapToResponse(experiment: any): ExperimentResponseDto {
    return {
      id: experiment.id,
      key: experiment.key,
      name: experiment.name,
      description: experiment.description || undefined,
      hypothesis: experiment.hypothesis || undefined,
      status: experiment.status as ExperimentStatus,
      type: experiment.type as ExperimentType,
      targetSegments: experiment.targetSegments || [],
      trafficPercent: experiment.trafficPercent,
      startDate: experiment.startDate || undefined,
      endDate: experiment.endDate || undefined,
      variants: experiment.variants.map((v: any) => this.mapVariantToResponse(v)),
      createdAt: experiment.createdAt,
      updatedAt: experiment.updatedAt,
    };
  }

  private mapVariantToResponse(variant: any): VariantResponseDto {
    return {
      id: variant.id,
      key: variant.key,
      name: variant.name,
      description: variant.description || undefined,
      isControl: variant.isControl,
      weight: variant.weight,
      payload: variant.payload as Record<string, any> | undefined,
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt,
    };
  }

  private async invalidateExperimentCache(key: string): Promise<void> {
    await this.redis.del(`${this.CACHE_PREFIX}${key}`);
  }
}
