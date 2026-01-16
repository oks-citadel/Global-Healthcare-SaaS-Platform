import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../config/redis.service';
import {
  CreateRuleDto,
  UpdateRuleDto,
  RuleQueryDto,
  PaginatedRulesDto,
  RuleResponseDto,
  PersonalizationRuleType,
  RuleConditionsDto,
  RuleActionDto,
  RuleConditionDto,
} from './dto/personalization.dto';

@Injectable()
export class RulesService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'rule:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateRuleDto): Promise<RuleResponseDto> {
    const existing = await this.prisma.personalizationRule.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Rule with key ${dto.key} already exists`);
    }

    const rule = await this.prisma.personalizationRule.create({
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        priority: dto.priority ?? 0,
        conditions: dto.conditions as any,
        actions: dto.actions as any,
        isActive: dto.isActive ?? true,
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
    });

    const response = this.mapToResponse(rule);

    // Cache the rule
    await this.redis.set(
      `${this.CACHE_PREFIX}${rule.key}`,
      response,
      this.CACHE_TTL,
    );

    // Invalidate active rules cache
    await this.redis.del(`${this.CACHE_PREFIX}active:${dto.type}`);

    return response;
  }

  async findAll(query: RuleQueryDto): Promise<PaginatedRulesDto> {
    const { page = 1, limit = 20, type, isActive, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (type) {
      where.type = type;
    }

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
      this.prisma.personalizationRule.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.personalizationRule.count({ where }),
    ]);

    return {
      items: items.map((item) => this.mapToResponse(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByKey(key: string): Promise<RuleResponseDto> {
    // Try cache first
    const cached = await this.redis.get<RuleResponseDto>(`${this.CACHE_PREFIX}${key}`);
    if (cached) return cached;

    const rule = await this.prisma.personalizationRule.findUnique({
      where: { key },
    });

    if (!rule) {
      throw new NotFoundException(`Rule with key ${key} not found`);
    }

    const response = this.mapToResponse(rule);

    // Cache the result
    await this.redis.set(
      `${this.CACHE_PREFIX}${key}`,
      response,
      this.CACHE_TTL,
    );

    return response;
  }

  async update(key: string, dto: UpdateRuleDto): Promise<RuleResponseDto> {
    const existing = await this.prisma.personalizationRule.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Rule with key ${key} not found`);
    }

    // Check for duplicate key if updating
    if (dto.key && dto.key !== key) {
      const duplicate = await this.prisma.personalizationRule.findUnique({
        where: { key: dto.key },
      });
      if (duplicate) {
        throw new ConflictException(`Rule with key ${dto.key} already exists`);
      }
    }

    const rule = await this.prisma.personalizationRule.update({
      where: { key },
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        priority: dto.priority,
        conditions: dto.conditions as any,
        actions: dto.actions as any,
        isActive: dto.isActive,
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
    });

    const response = this.mapToResponse(rule);

    // Invalidate caches
    await this.invalidateRuleCache(key, existing.type);
    if (dto.key && dto.key !== key) {
      await this.invalidateRuleCache(dto.key, dto.type || existing.type);
    }

    return response;
  }

  async delete(key: string): Promise<void> {
    const rule = await this.prisma.personalizationRule.findUnique({
      where: { key },
    });

    if (!rule) {
      throw new NotFoundException(`Rule with key ${key} not found`);
    }

    await this.prisma.personalizationRule.delete({
      where: { key },
    });

    await this.invalidateRuleCache(key, rule.type);
  }

  async getActiveRules(type: PersonalizationRuleType): Promise<RuleResponseDto[]> {
    const cacheKey = `${this.CACHE_PREFIX}active:${type}`;

    // Try cache first
    const cached = await this.redis.get<RuleResponseDto[]>(cacheKey);
    if (cached) return cached;

    const now = new Date();

    const rules = await this.prisma.personalizationRule.findMany({
      where: {
        type,
        isActive: true,
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
      orderBy: { priority: 'desc' },
    });

    const response = rules.map((rule) => this.mapToResponse(rule));

    // Cache the result
    await this.redis.set(cacheKey, response, this.CACHE_TTL);

    return response;
  }

  async evaluateRules(
    type: PersonalizationRuleType,
    context: Record<string, any>,
  ): Promise<RuleResponseDto[]> {
    const activeRules = await this.getActiveRules(type);
    const matchingRules: RuleResponseDto[] = [];

    for (const rule of activeRules) {
      if (this.evaluateConditions(rule.conditions, context)) {
        matchingRules.push(rule);
      }
    }

    return matchingRules;
  }

  private evaluateConditions(
    conditions: RuleConditionsDto,
    context: Record<string, any>,
  ): boolean {
    const { operator, conditions: conditionList } = conditions;

    if (operator === 'AND') {
      return conditionList.every((condition) =>
        this.evaluateCondition(condition, context),
      );
    } else {
      return conditionList.some((condition) =>
        this.evaluateCondition(condition, context),
      );
    }
  }

  private evaluateCondition(
    condition: RuleConditionDto,
    context: Record<string, any>,
  ): boolean {
    const fieldValue = this.getNestedValue(context, condition.field);

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'notEquals':
        return fieldValue !== condition.value;
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(condition.value);
      case 'greaterThan':
        return Number(fieldValue) > Number(condition.value);
      case 'lessThan':
        return Number(fieldValue) < Number(condition.value);
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'notIn':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      default:
        return false;
    }
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private mapToResponse(rule: any): RuleResponseDto {
    return {
      id: rule.id,
      key: rule.key,
      name: rule.name,
      description: rule.description || undefined,
      type: rule.type as PersonalizationRuleType,
      priority: rule.priority,
      conditions: rule.conditions as RuleConditionsDto,
      actions: rule.actions as RuleActionDto[],
      isActive: rule.isActive,
      startDate: rule.startDate || undefined,
      endDate: rule.endDate || undefined,
      createdAt: rule.createdAt,
      updatedAt: rule.updatedAt,
    };
  }

  private async invalidateRuleCache(key: string, type: string): Promise<void> {
    await Promise.all([
      this.redis.del(`${this.CACHE_PREFIX}${key}`),
      this.redis.del(`${this.CACHE_PREFIX}active:${type}`),
    ]);
  }
}
