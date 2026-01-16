import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../config/redis.service';
import {
  CreateSegmentDto,
  UpdateSegmentDto,
  SegmentQueryDto,
  PaginatedSegmentsDto,
  SegmentWithMembersDto,
  SegmentRulesDto,
  SegmentRuleDto,
} from './dto/segment.dto';

@Injectable()
export class SegmentsService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'segment:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateSegmentDto) {
    const existing = await this.prisma.segment.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Segment with key ${dto.key} already exists`);
    }

    const segment = await this.prisma.segment.create({
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        rules: dto.rules as any,
        isActive: dto.isActive ?? true,
        isDynamic: dto.isDynamic ?? true,
      },
    });

    // Cache the segment
    await this.redis.set(
      `${this.CACHE_PREFIX}${segment.key}`,
      segment,
      this.CACHE_TTL,
    );

    return segment;
  }

  async findAll(query: SegmentQueryDto): Promise<PaginatedSegmentsDto> {
    const { page = 1, limit = 20, isActive, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { key: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.segment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.segment.count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        ...item,
        rules: item.rules as SegmentRulesDto,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByKey(key: string): Promise<SegmentWithMembersDto> {
    // Try cache first
    const cached = await this.redis.get<SegmentWithMembersDto>(
      `${this.CACHE_PREFIX}${key}:full`,
    );
    if (cached) return cached;

    const segment = await this.prisma.segment.findUnique({
      where: { key },
      include: {
        memberships: {
          where: { exitedAt: null },
          include: {
            profile: {
              select: {
                id: true,
                externalUserId: true,
                email: true,
              },
            },
          },
          take: 100, // Limit members returned
        },
      },
    });

    if (!segment) {
      throw new NotFoundException(`Segment with key ${key} not found`);
    }

    const result: SegmentWithMembersDto = {
      ...segment,
      rules: segment.rules as SegmentRulesDto,
      members: segment.memberships.map((m) => ({
        profileId: m.profile.id,
        externalUserId: m.profile.externalUserId,
        email: m.profile.email || undefined,
        enteredAt: m.enteredAt,
      })),
    };

    // Cache the result
    await this.redis.set(
      `${this.CACHE_PREFIX}${key}:full`,
      result,
      this.CACHE_TTL,
    );

    return result;
  }

  async update(key: string, dto: UpdateSegmentDto) {
    const existing = await this.prisma.segment.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Segment with key ${key} not found`);
    }

    // Check for duplicate key if updating
    if (dto.key && dto.key !== key) {
      const duplicate = await this.prisma.segment.findUnique({
        where: { key: dto.key },
      });
      if (duplicate) {
        throw new ConflictException(`Segment with key ${dto.key} already exists`);
      }
    }

    const segment = await this.prisma.segment.update({
      where: { key },
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        rules: dto.rules as any,
        isActive: dto.isActive,
        isDynamic: dto.isDynamic,
      },
    });

    // Invalidate caches
    await this.invalidateSegmentCache(key);
    if (dto.key && dto.key !== key) {
      await this.invalidateSegmentCache(dto.key);
    }

    return {
      ...segment,
      rules: segment.rules as SegmentRulesDto,
    };
  }

  async delete(key: string): Promise<void> {
    const segment = await this.prisma.segment.findUnique({
      where: { key },
    });

    if (!segment) {
      throw new NotFoundException(`Segment with key ${key} not found`);
    }

    await this.prisma.segment.delete({
      where: { key },
    });

    await this.invalidateSegmentCache(key);
  }

  async evaluateProfileForSegment(
    profileId: string,
    segmentKey: string,
  ): Promise<boolean> {
    const segment = await this.prisma.segment.findUnique({
      where: { key: segmentKey },
    });

    if (!segment) {
      throw new NotFoundException(`Segment with key ${segmentKey} not found`);
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        traits: {
          include: { trait: true },
        },
      },
    });

    if (!profile) {
      return false;
    }

    // Convert profile traits to a map for easier access
    const traitMap: Record<string, any> = {};
    for (const pt of profile.traits) {
      traitMap[pt.trait.key] = pt.value;
    }

    // Add profile properties
    const profileData = {
      ...traitMap,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      timezone: profile.timezone,
      locale: profile.locale,
      ...(profile.metadata as Record<string, any> || {}),
    };

    return this.evaluateRules(segment.rules as SegmentRulesDto, profileData);
  }

  private evaluateRules(
    rules: SegmentRulesDto,
    data: Record<string, any>,
  ): boolean {
    const { operator, conditions } = rules;

    if (operator === 'AND') {
      return conditions.every((condition) => this.evaluateCondition(condition, data));
    } else {
      return conditions.some((condition) => this.evaluateCondition(condition, data));
    }
  }

  private evaluateCondition(
    condition: SegmentRuleDto | SegmentRulesDto,
    data: Record<string, any>,
  ): boolean {
    // Check if it's a nested rule group
    if ('operator' in condition && 'conditions' in condition) {
      return this.evaluateRules(condition as SegmentRulesDto, data);
    }

    const rule = condition as SegmentRuleDto;
    const fieldValue = data[rule.field];

    switch (rule.operator) {
      case 'equals':
        return fieldValue === rule.value;
      case 'notEquals':
        return fieldValue !== rule.value;
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(rule.value);
      case 'notContains':
        return typeof fieldValue === 'string' && !fieldValue.includes(rule.value);
      case 'greaterThan':
        return Number(fieldValue) > Number(rule.value);
      case 'lessThan':
        return Number(fieldValue) < Number(rule.value);
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(fieldValue);
      case 'notIn':
        return Array.isArray(rule.value) && !rule.value.includes(fieldValue);
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      case 'notExists':
        return fieldValue === undefined || fieldValue === null;
      default:
        return false;
    }
  }

  private async invalidateSegmentCache(key: string): Promise<void> {
    await Promise.all([
      this.redis.del(`${this.CACHE_PREFIX}${key}`),
      this.redis.del(`${this.CACHE_PREFIX}${key}:full`),
    ]);
  }
}
