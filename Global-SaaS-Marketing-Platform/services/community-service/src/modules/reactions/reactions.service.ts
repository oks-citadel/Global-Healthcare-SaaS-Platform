import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { RedisService } from '../../common/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReactionsService {
  private readonly reactionTypes = [
    { type: 'like', emoji: '👍', label: 'Like' },
    { type: 'love', emoji: '❤️', label: 'Love' },
    { type: 'celebrate', emoji: '🎉', label: 'Celebrate' },
    { type: 'insightful', emoji: '💡', label: 'Insightful' },
    { type: 'curious', emoji: '🤔', label: 'Curious' },
    { type: 'support', emoji: '🤝', label: 'Support' },
  ];

  constructor(private redis: RedisService) {}

  async addReaction(
    tenantId: string,
    dto: {
      targetType: 'post' | 'comment';
      targetId: string;
      userId: string;
      reactionType: string;
    },
  ) {
    // Check if user already reacted
    const existingKey = `reaction:${dto.targetType}:${dto.targetId}:${dto.userId}`;
    const existing = await this.redis.get(existingKey);

    if (existing) {
      const existingReaction = JSON.parse(existing);
      if (existingReaction.reactionType === dto.reactionType) {
        throw new ConflictException('User already added this reaction');
      }
      // Remove old reaction before adding new one
      await this.removeReactionInternal(tenantId, existingReaction.id);
    }

    const reaction = {
      id: uuidv4(),
      tenantId,
      targetType: dto.targetType,
      targetId: dto.targetId,
      userId: dto.userId,
      reactionType: dto.reactionType,
      createdAt: new Date(),
    };

    // Store reaction
    await this.redis.set(`reaction:${reaction.id}`, JSON.stringify(reaction), 86400 * 30);
    await this.redis.set(existingKey, JSON.stringify(reaction), 86400 * 30);

    // Add to target's reaction set
    const setKey = `reactions:${dto.targetType}:${dto.targetId}`;
    await this.redis.zadd(setKey, Date.now(), reaction.id);

    // Increment reaction count
    const countKey = `reactions:${dto.targetType}:${dto.targetId}:${dto.reactionType}:count`;
    await this.redis.incr(countKey);

    return { success: true, data: reaction };
  }

  async removeReaction(tenantId: string, id: string) {
    return this.removeReactionInternal(tenantId, id);
  }

  private async removeReactionInternal(tenantId: string, id: string) {
    const cached = await this.redis.get(`reaction:${id}`);
    if (!cached) {
      throw new NotFoundException(`Reaction ${id} not found`);
    }

    const reaction = JSON.parse(cached);
    if (reaction.tenantId !== tenantId) {
      throw new NotFoundException(`Reaction ${id} not found`);
    }

    // Remove reaction
    await this.redis.del(`reaction:${id}`);
    await this.redis.del(`reaction:${reaction.targetType}:${reaction.targetId}:${reaction.userId}`);

    // Decrement count (would need atomic operation in production)
    const countKey = `reactions:${reaction.targetType}:${reaction.targetId}:${reaction.reactionType}:count`;
    const currentCount = await this.redis.get(countKey);
    if (currentCount && parseInt(currentCount) > 0) {
      await this.redis.set(countKey, String(parseInt(currentCount) - 1));
    }

    return { success: true };
  }

  async getReactions(
    tenantId: string,
    targetType: 'post' | 'comment',
    targetId: string,
  ) {
    const setKey = `reactions:${targetType}:${targetId}`;
    const reactionIds = await this.redis.zrevrange(setKey, 0, 99);

    const reactions = [];
    for (const id of reactionIds) {
      const cached = await this.redis.get(`reaction:${id}`);
      if (cached) {
        const reaction = JSON.parse(cached);
        if (reaction.tenantId === tenantId) {
          reactions.push(reaction);
        }
      }
    }

    return { success: true, data: reactions };
  }

  async getReactionSummary(
    tenantId: string,
    targetType: 'post' | 'comment',
    targetId: string,
  ) {
    const summary: Record<string, number> = {};
    let total = 0;

    for (const { type } of this.reactionTypes) {
      const countKey = `reactions:${targetType}:${targetId}:${type}:count`;
      const count = await this.redis.get(countKey);
      const countNum = count ? parseInt(count) : 0;
      summary[type] = countNum;
      total += countNum;
    }

    return {
      success: true,
      data: {
        targetType,
        targetId,
        total,
        byType: summary,
      },
    };
  }

  getReactionTypes() {
    return {
      success: true,
      data: this.reactionTypes,
    };
  }
}
