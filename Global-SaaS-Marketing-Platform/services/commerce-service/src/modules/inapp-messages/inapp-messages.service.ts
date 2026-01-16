import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../config/redis.service';
import {
  CreateInAppMessageDto,
  UpdateInAppMessageDto,
  MessageQueryDto,
  PaginatedMessagesDto,
  InAppMessageResponseDto,
  GetMessagesDto,
  TriggerMessageDto,
  TriggerResponseDto,
  MessageType,
  TriggerType,
  MessageFrequency,
  TriggerAction,
  TargetingDto,
  TriggerConfigDto,
} from './dto/inapp-message.dto';

@Injectable()
export class InappMessagesService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'inapp:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateInAppMessageDto): Promise<InAppMessageResponseDto> {
    const existing = await this.prisma.inAppMessage.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Message with key ${dto.key} already exists`);
    }

    const message = await this.prisma.inAppMessage.create({
      data: {
        key: dto.key,
        name: dto.name,
        type: dto.type,
        title: dto.title,
        body: dto.body,
        ctaText: dto.ctaText,
        ctaUrl: dto.ctaUrl,
        imageUrl: dto.imageUrl,
        targeting: dto.targeting as any,
        triggerType: dto.triggerType,
        triggerConfig: dto.triggerConfig as any,
        frequency: dto.frequency || MessageFrequency.ONCE,
        priority: dto.priority ?? 0,
        isActive: dto.isActive ?? true,
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
    });

    return this.mapToResponse(message);
  }

  async findAll(query: MessageQueryDto): Promise<PaginatedMessagesDto> {
    const { page = 1, limit = 20, isActive, type, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
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
      this.prisma.inAppMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.inAppMessage.count({ where }),
    ]);

    return {
      items: items.map((item) => this.mapToResponse(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMessagesForUser(dto: GetMessagesDto): Promise<InAppMessageResponseDto[]> {
    const { userId, pageUrl, event, platform, limit = 1 } = dto;
    const now = new Date();

    // Build where clause
    const where: any = {
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
    };

    // Filter by trigger type if event or page is specified
    if (event) {
      where.triggerType = TriggerType.EVENT;
    } else if (pageUrl) {
      where.triggerType = TriggerType.PAGE_VIEW;
    }

    const messages = await this.prisma.inAppMessage.findMany({
      where,
      orderBy: { priority: 'desc' },
      take: limit * 3, // Fetch more to filter
    });

    const eligibleMessages: InAppMessageResponseDto[] = [];

    for (const message of messages) {
      if (eligibleMessages.length >= limit) break;

      // Check if user has already seen this message based on frequency
      const canShow = await this.canShowMessage(userId, message);
      if (!canShow) continue;

      // Check targeting
      if (!await this.matchesTargeting(userId, message.targeting as TargetingDto | null, platform)) {
        continue;
      }

      // Check trigger config
      if (!this.matchesTriggerConfig(message.triggerConfig as TriggerConfigDto | null, pageUrl, event)) {
        continue;
      }

      eligibleMessages.push(this.mapToResponse(message));
    }

    return eligibleMessages;
  }

  async triggerMessage(
    messageId: string,
    dto: TriggerMessageDto,
  ): Promise<TriggerResponseDto> {
    const message = await this.prisma.inAppMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    // Create trigger record
    const trigger = await this.prisma.messageTrigger.create({
      data: {
        messageId: message.id,
        userId: dto.userId,
        action: dto.action,
        metadata: dto.metadata,
      },
    });

    // Update message stats
    const updateData: any = {};
    switch (dto.action) {
      case TriggerAction.IMPRESSION:
        updateData.impressions = { increment: 1 };
        break;
      case TriggerAction.CLICK:
        updateData.clicks = { increment: 1 };
        break;
      case TriggerAction.DISMISS:
        updateData.dismissals = { increment: 1 };
        break;
    }

    if (Object.keys(updateData).length > 0) {
      await this.prisma.inAppMessage.update({
        where: { id: message.id },
        data: updateData,
      });
    }

    return {
      id: trigger.id,
      messageId: message.id,
      userId: dto.userId,
      action: dto.action as TriggerAction,
      triggeredAt: trigger.triggeredAt,
    };
  }

  private async canShowMessage(userId: string, message: any): Promise<boolean> {
    const frequency = message.frequency as MessageFrequency;

    if (frequency === MessageFrequency.ALWAYS) {
      return true;
    }

    // Get user's trigger history for this message
    const triggers = await this.prisma.messageTrigger.findMany({
      where: {
        messageId: message.id,
        userId,
        action: TriggerAction.IMPRESSION,
      },
      orderBy: { triggeredAt: 'desc' },
      take: 1,
    });

    if (triggers.length === 0) {
      return true;
    }

    const lastTrigger = triggers[0];
    const now = new Date();

    switch (frequency) {
      case MessageFrequency.ONCE:
        return false; // Already shown once
      case MessageFrequency.ONCE_PER_SESSION:
        // Check if last trigger was in current session (within 30 minutes)
        const sessionTimeout = 30 * 60 * 1000;
        return now.getTime() - lastTrigger.triggeredAt.getTime() > sessionTimeout;
      case MessageFrequency.DAILY:
        const oneDayMs = 24 * 60 * 60 * 1000;
        return now.getTime() - lastTrigger.triggeredAt.getTime() > oneDayMs;
      case MessageFrequency.WEEKLY:
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        return now.getTime() - lastTrigger.triggeredAt.getTime() > oneWeekMs;
      default:
        return true;
    }
  }

  private async matchesTargeting(
    userId: string,
    targeting: TargetingDto | null,
    platform?: string,
  ): Promise<boolean> {
    if (!targeting) return true;

    // Check platform
    if (targeting.platforms && targeting.platforms.length > 0) {
      if (!platform || !targeting.platforms.includes(platform)) {
        return false;
      }
    }

    // In a real implementation, you'd fetch user data and check segments/traits
    return true;
  }

  private matchesTriggerConfig(
    config: TriggerConfigDto | null,
    pageUrl?: string,
    event?: string,
  ): boolean {
    if (!config) return true;

    // Check page pattern
    if (config.pagePattern && pageUrl) {
      const regex = new RegExp(config.pagePattern);
      if (!regex.test(pageUrl)) {
        return false;
      }
    }

    // Check event name
    if (config.eventName && event) {
      if (config.eventName !== event) {
        return false;
      }
    }

    return true;
  }

  private mapToResponse(message: any): InAppMessageResponseDto {
    const impressions = message.impressions || 0;
    const clicks = message.clicks || 0;
    const clickRate = impressions > 0 ? (clicks / impressions) * 100 : 0;

    return {
      id: message.id,
      key: message.key,
      name: message.name,
      type: message.type as MessageType,
      title: message.title,
      body: message.body,
      ctaText: message.ctaText || undefined,
      ctaUrl: message.ctaUrl || undefined,
      imageUrl: message.imageUrl || undefined,
      targeting: message.targeting as TargetingDto | undefined,
      triggerType: message.triggerType as TriggerType,
      triggerConfig: message.triggerConfig as TriggerConfigDto | undefined,
      frequency: message.frequency as MessageFrequency,
      priority: message.priority,
      isActive: message.isActive,
      startDate: message.startDate || undefined,
      endDate: message.endDate || undefined,
      impressions,
      clicks,
      dismissals: message.dismissals || 0,
      clickRate,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
