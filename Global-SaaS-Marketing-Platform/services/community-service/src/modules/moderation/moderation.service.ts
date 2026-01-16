import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '../../common/redis.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ModerationService {
  constructor(private redis: RedisService) {}

  async getQueue(
    tenantId: string,
    options: { status?: string; type?: string; page?: number; limit?: number },
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const status = options.status || 'pending';
    const queueKey = `moderation:${tenantId}:queue:${status}`;
    const itemIds = await this.redis.zrevrange(queueKey, start, end);

    const items = [];
    for (const id of itemIds) {
      const cached = await this.redis.get(`moderation:item:${id}`);
      if (cached) {
        const item = JSON.parse(cached);
        if (!options.type || options.type === 'all' || item.targetType === options.type) {
          items.push(item);
        }
      }
    }

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        hasMore: itemIds.length === limit,
      },
    };
  }

  async executeAction(
    tenantId: string,
    dto: {
      targetType: 'post' | 'comment';
      targetId: string;
      action: 'approve' | 'reject' | 'hide' | 'delete' | 'warn';
      moderatorId: string;
      reason?: string;
      notes?: string;
    },
  ) {
    const actionRecord = {
      id: uuidv4(),
      tenantId,
      targetType: dto.targetType,
      targetId: dto.targetId,
      action: dto.action,
      moderatorId: dto.moderatorId,
      reason: dto.reason,
      notes: dto.notes,
      executedAt: new Date(),
    };

    // Store action in history
    await this.redis.set(`moderation:action:${actionRecord.id}`, JSON.stringify(actionRecord), 86400 * 90);

    const historyKey = `moderation:history:${dto.targetType}:${dto.targetId}`;
    await this.redis.zadd(historyKey, Date.now(), actionRecord.id);

    // Remove from pending queue
    const pendingKey = `moderation:${tenantId}:queue:pending`;
    // In production, we'd remove the item from the sorted set

    // Apply action to content
    await this.applyAction(tenantId, dto);

    return { success: true, data: actionRecord };
  }

  private async applyAction(
    tenantId: string,
    dto: {
      targetType: 'post' | 'comment';
      targetId: string;
      action: string;
    },
  ) {
    const contentKey = dto.targetType === 'post'
      ? `post:${dto.targetId}`
      : `comment:${dto.targetId}`;

    const cached = await this.redis.get(contentKey);
    if (!cached) return;

    const content = JSON.parse(cached);

    switch (dto.action) {
      case 'approve':
        content.moderationStatus = 'approved';
        content.isVisible = true;
        break;
      case 'reject':
        content.moderationStatus = 'rejected';
        content.isVisible = false;
        break;
      case 'hide':
        content.isVisible = false;
        break;
      case 'delete':
        await this.redis.del(contentKey);
        return;
      case 'warn':
        content.hasWarning = true;
        break;
    }

    content.updatedAt = new Date();
    await this.redis.set(contentKey, JSON.stringify(content), 86400);
  }

  async reportContent(
    tenantId: string,
    dto: {
      targetType: 'post' | 'comment';
      targetId: string;
      reporterId: string;
      reason: string;
      description?: string;
    },
  ) {
    const report = {
      id: uuidv4(),
      tenantId,
      targetType: dto.targetType,
      targetId: dto.targetId,
      reporterId: dto.reporterId,
      reason: dto.reason,
      description: dto.description,
      status: 'pending',
      createdAt: new Date(),
    };

    // Store report
    await this.redis.set(`moderation:report:${report.id}`, JSON.stringify(report), 86400 * 30);

    // Add to reports list for this content
    const reportsKey = `moderation:reports:${dto.targetType}:${dto.targetId}`;
    await this.redis.zadd(reportsKey, Date.now(), report.id);

    // Add to moderation queue
    const queueKey = `moderation:${tenantId}:queue:pending`;
    const queueItem = {
      id: uuidv4(),
      targetType: dto.targetType,
      targetId: dto.targetId,
      reportCount: 1,
      firstReportedAt: new Date(),
      latestReportAt: new Date(),
    };
    await this.redis.set(`moderation:item:${queueItem.id}`, JSON.stringify(queueItem), 86400 * 30);
    await this.redis.zadd(queueKey, Date.now(), queueItem.id);

    return { success: true, data: report };
  }

  async getReports(
    tenantId: string,
    targetType: 'post' | 'comment',
    targetId: string,
  ) {
    const reportsKey = `moderation:reports:${targetType}:${targetId}`;
    const reportIds = await this.redis.zrevrange(reportsKey, 0, 49);

    const reports = [];
    for (const id of reportIds) {
      const cached = await this.redis.get(`moderation:report:${id}`);
      if (cached) {
        const report = JSON.parse(cached);
        if (report.tenantId === tenantId) {
          reports.push(report);
        }
      }
    }

    return { success: true, data: reports };
  }

  async getHistory(
    tenantId: string,
    targetType: 'post' | 'comment',
    targetId: string,
  ) {
    const historyKey = `moderation:history:${targetType}:${targetId}`;
    const actionIds = await this.redis.zrevrange(historyKey, 0, 49);

    const actions = [];
    for (const id of actionIds) {
      const cached = await this.redis.get(`moderation:action:${id}`);
      if (cached) {
        const action = JSON.parse(cached);
        if (action.tenantId === tenantId) {
          actions.push(action);
        }
      }
    }

    return { success: true, data: actions };
  }

  async getStats(
    tenantId: string,
    options: { startDate?: string; endDate?: string },
  ) {
    // In production, this would query aggregated stats from the database
    return {
      success: true,
      data: {
        totalReports: 0,
        pendingReviews: 0,
        actionsToday: 0,
        byAction: {
          approved: 0,
          rejected: 0,
          hidden: 0,
          deleted: 0,
          warned: 0,
        },
        byReason: {
          spam: 0,
          harassment: 0,
          inappropriate: 0,
          misinformation: 0,
          other: 0,
        },
      },
    };
  }
}
