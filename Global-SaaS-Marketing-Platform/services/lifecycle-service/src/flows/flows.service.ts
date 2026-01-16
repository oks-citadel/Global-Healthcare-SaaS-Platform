import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlowDto, UpdateFlowDto, StartFlowDto } from './dto/flow.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class FlowsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('flow-execution') private flowQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateFlowDto, userId?: string) {
    return this.prisma.flow.create({
      data: {
        name: dto.name,
        description: dto.description,
        entryType: dto.entryType,
        entryConfig: dto.entryConfig,
        exitConfig: dto.exitConfig,
        allowReentry: dto.allowReentry || false,
        maxEntries: dto.maxEntries,
        createdBy: userId,
        steps: {
          create: dto.steps.map((step) => ({
            type: step.type,
            name: step.name,
            config: step.config,
            order: step.order,
            parentId: step.parentId,
            branchKey: step.branchKey,
          })),
        },
      },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAll(pagination: PaginationDto, status?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.flow.findMany({
        where,
        include: {
          steps: {
            orderBy: { order: 'asc' },
          },
        },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.flow.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async findOne(id: string) {
    const flow = await this.prisma.flow.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!flow) {
      throw new NotFoundException(`Flow with ID ${id} not found`);
    }

    return flow;
  }

  async update(id: string, dto: UpdateFlowDto) {
    const flow = await this.findOne(id);

    if (flow.status === 'ACTIVE') {
      throw new BadRequestException('Cannot update an active flow. Pause it first.');
    }

    // Delete existing steps if new ones are provided
    if (dto.steps) {
      await this.prisma.flowStep.deleteMany({
        where: { flowId: id },
      });
    }

    return this.prisma.flow.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        entryType: dto.entryType,
        entryConfig: dto.entryConfig,
        exitConfig: dto.exitConfig,
        allowReentry: dto.allowReentry,
        maxEntries: dto.maxEntries,
        steps: dto.steps
          ? {
              create: dto.steps.map((step) => ({
                type: step.type,
                name: step.name,
                config: step.config,
                order: step.order,
                parentId: step.parentId,
                branchKey: step.branchKey,
              })),
            }
          : undefined,
      },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async start(id: string) {
    const flow = await this.findOne(id);

    if (flow.status === 'ACTIVE') {
      throw new BadRequestException('Flow is already active');
    }

    if (flow.steps.length === 0) {
      throw new BadRequestException('Flow must have at least one step');
    }

    return this.prisma.flow.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        publishedAt: flow.publishedAt || new Date(),
      },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async stop(id: string) {
    const flow = await this.findOne(id);

    if (flow.status !== 'ACTIVE') {
      throw new BadRequestException('Flow is not active');
    }

    return this.prisma.flow.update({
      where: { id },
      data: {
        status: 'PAUSED',
      },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async archive(id: string) {
    await this.findOne(id);

    // Exit all active executions
    await this.prisma.flowExecution.updateMany({
      where: {
        flowId: id,
        status: { in: ['ACTIVE', 'WAITING'] },
      },
      data: {
        status: 'EXITED',
        exitedAt: new Date(),
        exitReason: 'Flow archived',
      },
    });

    return this.prisma.flow.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
  }

  async enterFlow(id: string, dto: StartFlowDto) {
    const flow = await this.findOne(id);

    if (flow.status !== 'ACTIVE') {
      throw new BadRequestException('Flow is not active');
    }

    // Check for existing execution
    const existingExecution = await this.prisma.flowExecution.findFirst({
      where: {
        flowId: id,
        contactEmail: dto.contactEmail,
        status: { in: ['ACTIVE', 'WAITING'] },
      },
    });

    if (existingExecution && !flow.allowReentry) {
      throw new BadRequestException('Contact is already in this flow');
    }

    // Check max entries
    if (flow.maxEntries) {
      const entryCount = await this.prisma.flowExecution.count({
        where: {
          flowId: id,
          contactEmail: dto.contactEmail,
        },
      });

      if (entryCount >= flow.maxEntries) {
        throw new BadRequestException('Maximum entries reached for this contact');
      }
    }

    // Create execution
    const firstStep = flow.steps[0];
    const execution = await this.prisma.flowExecution.create({
      data: {
        flowId: id,
        contactEmail: dto.contactEmail,
        contactId: dto.contactId,
        currentStepId: firstStep?.id,
        currentStepOrder: 0,
        context: dto.context,
      },
    });

    // Update flow stats
    await this.prisma.flow.update({
      where: { id },
      data: {
        totalEntered: { increment: 1 },
        activeCount: { increment: 1 },
      },
    });

    // Queue first step execution
    await this.flowQueue.add('execute-step', {
      executionId: execution.id,
      stepId: firstStep?.id,
    });

    return execution;
  }

  async getExecutions(flowId: string, pagination: PaginationDto, status?: string) {
    await this.findOne(flowId);

    const where: any = { flowId };

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.flowExecution.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { enteredAt: 'desc' },
      }),
      this.prisma.flowExecution.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async exitExecution(executionId: string, reason: string) {
    const execution = await this.prisma.flowExecution.findUnique({
      where: { id: executionId },
    });

    if (!execution) {
      throw new NotFoundException('Execution not found');
    }

    if (execution.status === 'EXITED' || execution.status === 'COMPLETED') {
      throw new BadRequestException('Execution already ended');
    }

    await this.prisma.flowExecution.update({
      where: { id: executionId },
      data: {
        status: 'EXITED',
        exitedAt: new Date(),
        exitReason: reason,
      },
    });

    // Update flow stats
    await this.prisma.flow.update({
      where: { id: execution.flowId },
      data: {
        activeCount: { decrement: 1 },
        totalExited: { increment: 1 },
      },
    });

    return { success: true, message: 'Execution exited' };
  }

  async processStep(executionId: string, stepId: string) {
    const execution = await this.prisma.flowExecution.findUnique({
      where: { id: executionId },
      include: {
        flow: {
          include: {
            steps: true,
          },
        },
      },
    });

    if (!execution || execution.status !== 'ACTIVE') {
      return;
    }

    const step = execution.flow.steps.find((s) => s.id === stepId);
    if (!step) {
      return;
    }

    const config = step.config as Record<string, any>;
    const context = (execution.context || {}) as Record<string, any>;

    try {
      // Execute step based on type
      switch (step.type) {
        case 'SEND_EMAIL':
          // Would integrate with email service
          break;

        case 'WAIT':
          const waitTime = config.duration || 60000; // ms
          await this.prisma.flowExecution.update({
            where: { id: executionId },
            data: { status: 'WAITING' },
          });

          // Schedule next step after wait
          await this.flowQueue.add(
            'execute-step',
            { executionId, stepId: this.getNextStepId(execution.flow.steps, step) },
            { delay: waitTime },
          );
          return;

        case 'CONDITION':
          const conditionMet = this.evaluateCondition(config.condition, context);
          const branchKey = conditionMet ? 'yes' : 'no';
          const nextStep = execution.flow.steps.find(
            (s) => s.parentId === step.id && s.branchKey === branchKey,
          );
          if (nextStep) {
            await this.flowQueue.add('execute-step', { executionId, stepId: nextStep.id });
          }
          return;

        case 'EXIT':
          await this.completeExecution(executionId);
          return;

        default:
          // Handle other step types
          break;
      }

      // Update step stats
      await this.prisma.flowStep.update({
        where: { id: stepId },
        data: {
          totalReached: { increment: 1 },
          totalCompleted: { increment: 1 },
        },
      });

      // Move to next step
      const nextStepId = this.getNextStepId(execution.flow.steps, step);
      if (nextStepId) {
        await this.prisma.flowExecution.update({
          where: { id: executionId },
          data: {
            currentStepId: nextStepId,
            currentStepOrder: step.order + 1,
            status: 'ACTIVE',
          },
        });

        await this.flowQueue.add('execute-step', { executionId, stepId: nextStepId });
      } else {
        // Flow completed
        await this.completeExecution(executionId);
      }
    } catch (error) {
      await this.prisma.flowExecution.update({
        where: { id: executionId },
        data: {
          status: 'FAILED',
          exitReason: error.message,
          exitedAt: new Date(),
        },
      });
    }
  }

  private getNextStepId(steps: any[], currentStep: any): string | null {
    const nextStep = steps.find(
      (s) => s.order === currentStep.order + 1 && !s.parentId,
    );
    return nextStep?.id || null;
  }

  private evaluateCondition(condition: any, context: Record<string, any>): boolean {
    if (!condition) return true;

    const { field, operator, value } = condition;
    const fieldValue = this.getNestedValue(context, field);

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'not_equals':
        return fieldValue !== value;
      case 'contains':
        return String(fieldValue || '').includes(String(value));
      case 'greater_than':
        return Number(fieldValue) > Number(value);
      case 'less_than':
        return Number(fieldValue) < Number(value);
      default:
        return false;
    }
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async completeExecution(executionId: string) {
    const execution = await this.prisma.flowExecution.update({
      where: { id: executionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    await this.prisma.flow.update({
      where: { id: execution.flowId },
      data: {
        activeCount: { decrement: 1 },
        totalCompleted: { increment: 1 },
      },
    });
  }
}
