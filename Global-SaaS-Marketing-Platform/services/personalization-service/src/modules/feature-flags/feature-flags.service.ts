import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { DynamoDBService } from '../../config/dynamodb.service';
import { RedisService } from '../../config/redis.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateFeatureFlagDto,
  UpdateFeatureFlagDto,
  FlagQueryDto,
  PaginatedFlagsDto,
  FeatureFlagResponseDto,
  EvaluateFlagRequestDto,
  EvaluateFlagResponseDto,
  BulkEvaluateRequestDto,
  BulkEvaluateResponseDto,
  FlagType,
  FlagStatus,
  FlagTargetingDto,
  FlagTargetingRuleDto,
} from './dto/feature-flag.dto';

interface FeatureFlag {
  pk: string;
  sk: string;
  key: string;
  name: string;
  description?: string;
  type: FlagType;
  defaultValue: any;
  targeting?: FlagTargetingDto[];
  status: FlagStatus;
  environment?: string;
  tags: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class FeatureFlagsService {
  private readonly TABLE_NAME = 'feature_flags';
  private readonly CACHE_TTL = 60; // 1 minute for flags (need fast updates)
  private readonly CACHE_PREFIX = 'flag:';

  constructor(
    private readonly dynamodb: DynamoDBService,
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateFeatureFlagDto): Promise<FeatureFlagResponseDto> {
    // Check for existing flag
    const existing = await this.dynamodb.get<FeatureFlag>(this.TABLE_NAME, {
      pk: `FLAG#${dto.key}`,
      sk: `ENV#${dto.environment || 'default'}`,
    });

    if (existing) {
      throw new ConflictException(`Flag with key ${dto.key} already exists`);
    }

    const now = new Date().toISOString();
    const flag: FeatureFlag = {
      pk: `FLAG#${dto.key}`,
      sk: `ENV#${dto.environment || 'default'}`,
      key: dto.key,
      name: dto.name,
      description: dto.description,
      type: dto.type,
      defaultValue: dto.defaultValue,
      targeting: dto.targeting,
      status: dto.status || FlagStatus.INACTIVE,
      environment: dto.environment,
      tags: dto.tags || [],
      metadata: dto.metadata,
      createdAt: now,
      updatedAt: now,
    };

    await this.dynamodb.put(this.TABLE_NAME, flag);

    const response = this.mapToResponse(flag);

    // Cache the flag
    await this.redis.set(
      `${this.CACHE_PREFIX}${flag.key}:${flag.environment || 'default'}`,
      response,
      this.CACHE_TTL,
    );

    return response;
  }

  async findAll(query: FlagQueryDto): Promise<PaginatedFlagsDto> {
    const { page = 1, limit = 20, status, type, environment, tag, search } = query;

    // Scan with filters (in production, use GSI for better performance)
    let filterExpression: string | undefined;
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};
    const conditions: string[] = [];

    if (status) {
      conditions.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = status;
    }

    if (type) {
      conditions.push('#type = :type');
      expressionAttributeNames['#type'] = 'type';
      expressionAttributeValues[':type'] = type;
    }

    if (environment) {
      conditions.push('environment = :environment');
      expressionAttributeValues[':environment'] = environment;
    }

    if (tag) {
      conditions.push('contains(tags, :tag)');
      expressionAttributeValues[':tag'] = tag;
    }

    if (search) {
      conditions.push('(contains(#name, :search) OR contains(#key, :search))');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeNames['#key'] = 'key';
      expressionAttributeValues[':search'] = search;
    }

    if (conditions.length > 0) {
      filterExpression = conditions.join(' AND ');
    }

    const result = await this.dynamodb.scan<FeatureFlag>(this.TABLE_NAME, {
      filterExpression,
      expressionAttributeValues: Object.keys(expressionAttributeValues).length > 0
        ? expressionAttributeValues
        : undefined,
      expressionAttributeNames: Object.keys(expressionAttributeNames).length > 0
        ? expressionAttributeNames
        : undefined,
    });

    const allItems = result.items;
    const total = allItems.length;
    const startIndex = (page - 1) * limit;
    const paginatedItems = allItems.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems.map((item) => this.mapToResponse(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByKey(key: string, environment?: string): Promise<FeatureFlagResponseDto> {
    const env = environment || 'default';

    // Try cache first
    const cached = await this.redis.get<FeatureFlagResponseDto>(
      `${this.CACHE_PREFIX}${key}:${env}`,
    );
    if (cached) return cached;

    const flag = await this.dynamodb.get<FeatureFlag>(this.TABLE_NAME, {
      pk: `FLAG#${key}`,
      sk: `ENV#${env}`,
    });

    if (!flag) {
      throw new NotFoundException(`Flag with key ${key} not found`);
    }

    const response = this.mapToResponse(flag);

    // Cache the result
    await this.redis.set(
      `${this.CACHE_PREFIX}${key}:${env}`,
      response,
      this.CACHE_TTL,
    );

    return response;
  }

  async update(
    key: string,
    dto: UpdateFeatureFlagDto,
  ): Promise<FeatureFlagResponseDto> {
    const env = dto.environment || 'default';

    const existing = await this.dynamodb.get<FeatureFlag>(this.TABLE_NAME, {
      pk: `FLAG#${key}`,
      sk: `ENV#${env}`,
    });

    if (!existing) {
      throw new NotFoundException(`Flag with key ${key} not found`);
    }

    // Check for duplicate key if updating
    if (dto.key && dto.key !== key) {
      const duplicate = await this.dynamodb.get<FeatureFlag>(this.TABLE_NAME, {
        pk: `FLAG#${dto.key}`,
        sk: `ENV#${env}`,
      });
      if (duplicate) {
        throw new ConflictException(`Flag with key ${dto.key} already exists`);
      }

      // Delete old entry
      await this.dynamodb.delete(this.TABLE_NAME, {
        pk: `FLAG#${key}`,
        sk: `ENV#${env}`,
      });
    }

    const now = new Date().toISOString();
    const updatedFlag: FeatureFlag = {
      ...existing,
      pk: `FLAG#${dto.key || key}`,
      key: dto.key || key,
      name: dto.name ?? existing.name,
      description: dto.description ?? existing.description,
      type: dto.type ?? existing.type,
      defaultValue: dto.defaultValue ?? existing.defaultValue,
      targeting: dto.targeting ?? existing.targeting,
      status: dto.status ?? existing.status,
      environment: dto.environment ?? existing.environment,
      tags: dto.tags ?? existing.tags,
      metadata: dto.metadata ?? existing.metadata,
      updatedAt: now,
    };

    await this.dynamodb.put(this.TABLE_NAME, updatedFlag);

    const response = this.mapToResponse(updatedFlag);

    // Invalidate caches
    await this.invalidateFlagCache(key, env);
    if (dto.key && dto.key !== key) {
      await this.invalidateFlagCache(dto.key, env);
    }

    return response;
  }

  async delete(key: string, environment?: string): Promise<void> {
    const env = environment || 'default';

    const flag = await this.dynamodb.get<FeatureFlag>(this.TABLE_NAME, {
      pk: `FLAG#${key}`,
      sk: `ENV#${env}`,
    });

    if (!flag) {
      throw new NotFoundException(`Flag with key ${key} not found`);
    }

    await this.dynamodb.delete(this.TABLE_NAME, {
      pk: `FLAG#${key}`,
      sk: `ENV#${env}`,
    });

    await this.invalidateFlagCache(key, env);
  }

  async evaluate(
    key: string,
    dto: EvaluateFlagRequestDto,
  ): Promise<EvaluateFlagResponseDto> {
    const flag = await this.findByKey(key);

    // If flag is not active, return default value
    if (flag.status !== FlagStatus.ACTIVE) {
      return {
        flagKey: key,
        value: flag.defaultValue,
        isEnabled: false,
        evaluatedAt: new Date(),
      };
    }

    // Build evaluation context
    const context = await this.buildEvaluationContext(dto.userId, dto.context);

    // Evaluate targeting rules
    if (flag.targeting && flag.targeting.length > 0) {
      for (let i = 0; i < flag.targeting.length; i++) {
        const targeting = flag.targeting[i];

        if (this.evaluateTargeting(targeting, context)) {
          // Check rollout percentage
          if (this.isInRollout(dto.userId, key, targeting.rolloutPercentage)) {
            return {
              flagKey: key,
              value: targeting.value,
              isEnabled: true,
              matchedRule: i,
              evaluatedAt: new Date(),
            };
          }
        }
      }
    }

    // No rules matched, return default
    return {
      flagKey: key,
      value: flag.defaultValue,
      isEnabled: flag.type === FlagType.BOOLEAN ? flag.defaultValue === true : true,
      evaluatedAt: new Date(),
    };
  }

  async bulkEvaluate(dto: BulkEvaluateRequestDto): Promise<BulkEvaluateResponseDto> {
    let flags: FeatureFlagResponseDto[];

    if (dto.flagKeys && dto.flagKeys.length > 0) {
      flags = await Promise.all(
        dto.flagKeys.map((key) =>
          this.findByKey(key).catch(() => null),
        ),
      ).then((results) => results.filter((r): r is FeatureFlagResponseDto => r !== null));
    } else {
      // Get all active flags
      const result = await this.findAll({
        status: FlagStatus.ACTIVE,
        limit: 1000,
      });
      flags = result.items;
    }

    const context = await this.buildEvaluationContext(dto.userId, dto.context);
    const evaluatedFlags: Record<string, any> = {};

    for (const flag of flags) {
      if (flag.status !== FlagStatus.ACTIVE) {
        evaluatedFlags[flag.key] = flag.defaultValue;
        continue;
      }

      let value = flag.defaultValue;

      if (flag.targeting && flag.targeting.length > 0) {
        for (const targeting of flag.targeting) {
          if (this.evaluateTargeting(targeting, context)) {
            if (this.isInRollout(dto.userId, flag.key, targeting.rolloutPercentage)) {
              value = targeting.value;
              break;
            }
          }
        }
      }

      evaluatedFlags[flag.key] = value;
    }

    return {
      userId: dto.userId,
      flags: evaluatedFlags,
      evaluatedAt: new Date(),
    };
  }

  private async buildEvaluationContext(
    userId: string,
    additionalContext?: Record<string, any>,
  ): Promise<Record<string, any>> {
    // Try to get user profile
    let profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      include: {
        traits: { include: { trait: true } },
        segmentMemberships: {
          where: { exitedAt: null },
          include: { segment: true },
        },
      },
    });

    if (!profile) {
      profile = await this.prisma.profile.findUnique({
        where: { externalUserId: userId },
        include: {
          traits: { include: { trait: true } },
          segmentMemberships: {
            where: { exitedAt: null },
            include: { segment: true },
          },
        },
      });
    }

    const context: Record<string, any> = {
      userId,
      ...additionalContext,
    };

    if (profile) {
      context.profileId = profile.id;
      context.externalUserId = profile.externalUserId;
      context.email = profile.email;
      context.firstName = profile.firstName;
      context.lastName = profile.lastName;
      context.timezone = profile.timezone;
      context.locale = profile.locale;

      // Add traits
      const traits: Record<string, any> = {};
      for (const pt of profile.traits) {
        traits[pt.trait.key] = pt.value;
      }
      context.traits = traits;

      // Add segments
      context.segments = profile.segmentMemberships.map((sm) => sm.segment.key);
    }

    return context;
  }

  private evaluateTargeting(
    targeting: FlagTargetingDto,
    context: Record<string, any>,
  ): boolean {
    const { operator, rules } = targeting;

    if (operator === 'AND') {
      return rules.every((rule) => this.evaluateRule(rule, context));
    } else {
      return rules.some((rule) => this.evaluateRule(rule, context));
    }
  }

  private evaluateRule(
    rule: FlagTargetingRuleDto,
    context: Record<string, any>,
  ): boolean {
    const fieldValue = this.getNestedValue(context, rule.field);

    switch (rule.operator) {
      case 'equals':
        return fieldValue === rule.value;
      case 'notEquals':
        return fieldValue !== rule.value;
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(rule.value);
        }
        return typeof fieldValue === 'string' && fieldValue.includes(rule.value);
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(fieldValue);
      case 'notIn':
        return Array.isArray(rule.value) && !rule.value.includes(fieldValue);
      case 'greaterThan':
        return Number(fieldValue) > Number(rule.value);
      case 'lessThan':
        return Number(fieldValue) < Number(rule.value);
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null;
      default:
        return false;
    }
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private isInRollout(
    userId: string,
    flagKey: string,
    rolloutPercentage?: number,
  ): boolean {
    if (!rolloutPercentage || rolloutPercentage >= 100) {
      return true;
    }

    if (rolloutPercentage <= 0) {
      return false;
    }

    // Use consistent hashing for deterministic rollout
    const hash = createHash('md5')
      .update(`${userId}:${flagKey}`)
      .digest('hex');
    const normalizedHash = (parseInt(hash.substring(0, 8), 16) / 0xffffffff) * 100;

    return normalizedHash < rolloutPercentage;
  }

  private mapToResponse(flag: FeatureFlag): FeatureFlagResponseDto {
    return {
      key: flag.key,
      name: flag.name,
      description: flag.description,
      type: flag.type,
      defaultValue: flag.defaultValue,
      targeting: flag.targeting,
      status: flag.status,
      environment: flag.environment,
      tags: flag.tags || [],
      metadata: flag.metadata,
      createdAt: new Date(flag.createdAt),
      updatedAt: new Date(flag.updatedAt),
    };
  }

  private async invalidateFlagCache(key: string, environment: string): Promise<void> {
    await this.redis.del(`${this.CACHE_PREFIX}${key}:${environment}`);
  }
}
