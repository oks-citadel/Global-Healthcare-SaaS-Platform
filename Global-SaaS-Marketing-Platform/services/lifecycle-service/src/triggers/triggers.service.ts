import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTriggerDto, UpdateTriggerDto } from './dto/trigger.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class TriggersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateTriggerDto, userId?: string) {
    return this.prisma.trigger.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        eventName: dto.eventName,
        conditions: dto.conditions,
        schedule: dto.schedule,
        createdBy: userId,
        actions: {
          create: dto.actions.map((action, index) => ({
            type: action.type,
            config: action.config,
            order: action.order ?? index,
          })),
        },
      },
      include: {
        actions: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAll(pagination: PaginationDto, status?: string, type?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const [data, total] = await Promise.all([
      this.prisma.trigger.findMany({
        where,
        include: {
          actions: {
            orderBy: { order: 'asc' },
          },
        },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.trigger.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async findOne(id: string) {
    const trigger = await this.prisma.trigger.findUnique({
      where: { id },
      include: {
        actions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!trigger) {
      throw new NotFoundException(`Trigger with ID ${id} not found`);
    }

    return trigger;
  }

  async findByEventName(eventName: string) {
    return this.prisma.trigger.findMany({
      where: {
        eventName,
        status: 'ACTIVE',
        type: 'EVENT',
      },
      include: {
        actions: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async update(id: string, dto: UpdateTriggerDto) {
    await this.findOne(id);

    // Delete existing actions if new ones are provided
    if (dto.actions) {
      await this.prisma.triggerAction.deleteMany({
        where: { triggerId: id },
      });
    }

    return this.prisma.trigger.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        status: dto.status,
        eventName: dto.eventName,
        conditions: dto.conditions,
        schedule: dto.schedule,
        actions: dto.actions
          ? {
              create: dto.actions.map((action, index) => ({
                type: action.type,
                config: action.config,
                order: action.order ?? index,
              })),
            }
          : undefined,
      },
      include: {
        actions: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.trigger.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    return { success: true, message: 'Trigger archived' };
  }

  async fire(id: string, context: Record<string, any>) {
    const trigger = await this.findOne(id);

    if (trigger.status !== 'ACTIVE') {
      return { success: false, message: 'Trigger is not active' };
    }

    // Check conditions if defined
    if (trigger.conditions) {
      const conditionsMet = this.evaluateConditions(trigger.conditions as any, context);
      if (!conditionsMet) {
        return { success: false, message: 'Conditions not met' };
      }
    }

    // Execute actions
    const results = [];
    for (const action of trigger.actions) {
      try {
        const result = await this.executeAction(action, context);
        results.push({ actionId: action.id, success: true, result });
      } catch (error) {
        results.push({ actionId: action.id, success: false, error: error.message });
      }
    }

    // Update stats
    await this.prisma.trigger.update({
      where: { id },
      data: {
        totalFired: { increment: 1 },
        lastFiredAt: new Date(),
      },
    });

    return { success: true, results };
  }

  async fireByEvent(eventName: string, context: Record<string, any>) {
    const triggers = await this.findByEventName(eventName);

    const results = [];
    for (const trigger of triggers) {
      const result = await this.fire(trigger.id, context);
      results.push({ triggerId: trigger.id, ...result });
    }

    return results;
  }

  private evaluateConditions(conditions: Record<string, any>, context: Record<string, any>): boolean {
    // Simple condition evaluation - can be extended
    for (const [field, expected] of Object.entries(conditions)) {
      const actual = this.getNestedValue(context, field);

      if (typeof expected === 'object' && expected !== null) {
        // Complex condition
        if (expected.operator) {
          if (!this.evaluateOperator(actual, expected.operator, expected.value)) {
            return false;
          }
        }
      } else if (actual !== expected) {
        return false;
      }
    }
    return true;
  }

  private evaluateOperator(actual: any, operator: string, value: any): boolean {
    switch (operator) {
      case 'equals':
        return actual === value;
      case 'not_equals':
        return actual !== value;
      case 'contains':
        return String(actual).includes(String(value));
      case 'greater_than':
        return Number(actual) > Number(value);
      case 'less_than':
        return Number(actual) < Number(value);
      case 'is_set':
        return actual !== null && actual !== undefined;
      case 'is_not_set':
        return actual === null || actual === undefined;
      default:
        return false;
    }
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async executeAction(action: any, context: Record<string, any>): Promise<any> {
    const config = action.config as Record<string, any>;

    switch (action.type) {
      case 'SEND_EMAIL':
        // Would integrate with email service
        return { type: 'SEND_EMAIL', templateId: config.templateId, to: context.email };

      case 'ADD_TO_LIST':
        // Would integrate with lists service
        return { type: 'ADD_TO_LIST', listId: config.listId, email: context.email };

      case 'REMOVE_FROM_LIST':
        return { type: 'REMOVE_FROM_LIST', listId: config.listId, email: context.email };

      case 'UPDATE_CONTACT':
        return { type: 'UPDATE_CONTACT', updates: config.updates };

      case 'START_FLOW':
        // Would integrate with flows service
        return { type: 'START_FLOW', flowId: config.flowId, email: context.email };

      case 'WEBHOOK':
        // Would make HTTP request
        return { type: 'WEBHOOK', url: config.url };

      default:
        return { type: action.type, status: 'executed' };
    }
  }
}
