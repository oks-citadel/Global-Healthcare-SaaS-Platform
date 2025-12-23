import { AuditEvent, Prisma } from '../generated/client';
import { BaseRepository, PaginationOptions, PaginationResult } from './base.repository.js';
import { prisma } from '../lib/prisma.js';

export interface AuditFilters {
  userId?: string;
  action?: string;
  resource?: string;
  resourceId?: string;
  fromDate?: Date;
  toDate?: Date;
  ipAddress?: string;
}

export class AuditRepository extends BaseRepository<AuditEvent, typeof prisma.auditEvent> {
  constructor() {
    super(prisma.auditEvent, 'AuditEvent');
  }

  /**
   * Find audit events by user ID
   */
  async findByUserId(
    userId: string,
    include?: Prisma.AuditEventInclude
  ): Promise<AuditEvent[]> {
    return this.model.findMany({
      where: { userId },
      include,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Find audit events by action
   */
  async findByAction(
    action: string,
    include?: Prisma.AuditEventInclude
  ): Promise<AuditEvent[]> {
    return this.model.findMany({
      where: { action },
      include,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Find audit events by resource
   */
  async findByResource(
    resource: string,
    include?: Prisma.AuditEventInclude
  ): Promise<AuditEvent[]> {
    return this.model.findMany({
      where: { resource },
      include,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Find audit events by resource ID
   */
  async findByResourceId(
    resourceId: string,
    include?: Prisma.AuditEventInclude
  ): Promise<AuditEvent[]> {
    return this.model.findMany({
      where: { resourceId },
      include,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Find audit events by resource and action
   */
  async findByResourceAndAction(
    resource: string,
    action: string,
    include?: Prisma.AuditEventInclude
  ): Promise<AuditEvent[]> {
    return this.model.findMany({
      where: {
        resource,
        action,
      },
      include,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Find audit events with filters and pagination
   */
  async findWithFilters(
    filters: AuditFilters,
    pagination: PaginationOptions,
    include?: Prisma.AuditEventInclude
  ): Promise<PaginationResult<AuditEvent>> {
    const where: Prisma.AuditEventWhereInput = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.action) {
      where.action = filters.action;
    }

    if (filters.resource) {
      where.resource = filters.resource;
    }

    if (filters.resourceId) {
      where.resourceId = filters.resourceId;
    }

    if (filters.ipAddress) {
      where.ipAddress = filters.ipAddress;
    }

    if (filters.fromDate || filters.toDate) {
      where.timestamp = {};
      if (filters.fromDate) {
        where.timestamp.gte = filters.fromDate;
      }
      if (filters.toDate) {
        where.timestamp.lte = filters.toDate;
      }
    }

    return this.findWithPagination(where, pagination, {
      include,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Find audit events by date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
    options?: {
      userId?: string;
      action?: string;
      resource?: string;
    }
  ): Promise<AuditEvent[]> {
    const where: Prisma.AuditEventWhereInput = {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (options?.userId) {
      where.userId = options.userId;
    }

    if (options?.action) {
      where.action = options.action;
    }

    if (options?.resource) {
      where.resource = options.resource;
    }

    return this.model.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Find recent audit events
   */
  async findRecent(limit: number = 50, userId?: string): Promise<AuditEvent[]> {
    const where: Prisma.AuditEventWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    return this.model.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Find audit events by IP address
   */
  async findByIpAddress(ipAddress: string): Promise<AuditEvent[]> {
    return this.model.findMany({
      where: { ipAddress },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Search audit events
   */
  async searchEvents(
    query: string,
    options?: {
      limit?: number;
    }
  ): Promise<AuditEvent[]> {
    return this.model.findMany({
      where: {
        OR: [
          { action: { contains: query, mode: 'insensitive' } },
          { resource: { contains: query, mode: 'insensitive' } },
          { resourceId: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      take: options?.limit || 50,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Create audit event
   */
  async createEvent(data: {
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditEvent> {
    return this.model.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId || null,
        details: data.details || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
  }

  /**
   * Count events by action
   */
  async countByAction(action: string): Promise<number> {
    return this.model.count({ where: { action } });
  }

  /**
   * Count events by resource
   */
  async countByResource(resource: string): Promise<number> {
    return this.model.count({ where: { resource } });
  }

  /**
   * Count events by user
   */
  async countByUser(userId: string): Promise<number> {
    return this.model.count({ where: { userId } });
  }

  /**
   * Get audit statistics
   */
  async getStats(startDate?: Date, endDate?: Date): Promise<{
    total: number;
    byAction: Record<string, number>;
    byResource: Record<string, number>;
    uniqueUsers: number;
    uniqueIpAddresses: number;
  }> {
    const where: Prisma.AuditEventWhereInput = {};

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const [total, actionStats, resourceStats, uniqueUsers, uniqueIpAddresses] = await Promise.all([
      this.model.count({ where }),
      this.model.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      this.model.groupBy({
        by: ['resource'],
        where,
        _count: true,
      }),
      this.model.findMany({
        where,
        select: { userId: true },
        distinct: ['userId'],
      }),
      this.model.findMany({
        where: {
          ...where,
          ipAddress: { not: null },
        },
        select: { ipAddress: true },
        distinct: ['ipAddress'],
      }),
    ]);

    const byAction: Record<string, number> = {};
    actionStats.forEach((stat: any) => {
      byAction[stat.action] = stat._count;
    });

    const byResource: Record<string, number> = {};
    resourceStats.forEach((stat: any) => {
      byResource[stat.resource] = stat._count;
    });

    return {
      total,
      byAction,
      byResource,
      uniqueUsers: uniqueUsers.length,
      uniqueIpAddresses: uniqueIpAddresses.length,
    };
  }

  /**
   * Get user activity summary
   */
  async getUserActivitySummary(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    total: number;
    byAction: Record<string, number>;
    byResource: Record<string, number>;
    recentEvents: AuditEvent[];
  }> {
    const where: Prisma.AuditEventWhereInput = { userId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const [total, actionStats, resourceStats, recentEvents] = await Promise.all([
      this.model.count({ where }),
      this.model.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      this.model.groupBy({
        by: ['resource'],
        where,
        _count: true,
      }),
      this.model.findMany({
        where,
        take: 10,
        orderBy: { timestamp: 'desc' },
      }),
    ]);

    const byAction: Record<string, number> = {};
    actionStats.forEach((stat: any) => {
      byAction[stat.action] = stat._count;
    });

    const byResource: Record<string, number> = {};
    resourceStats.forEach((stat: any) => {
      byResource[stat.resource] = stat._count;
    });

    return {
      total,
      byAction,
      byResource,
      recentEvents,
    };
  }

  /**
   * Find suspicious activities
   */
  async findSuspiciousActivities(options?: {
    multipleFailedLogins?: boolean;
    accessFromMultipleIps?: boolean;
    limit?: number;
  }): Promise<AuditEvent[]> {
    const where: Prisma.AuditEventWhereInput = {};
    const limit = options?.limit || 50;

    // Example: Find failed login attempts
    if (options?.multipleFailedLogins) {
      where.action = { contains: 'failed' };
    }

    return this.model.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Get resource access history
   */
  async getResourceHistory(
    resource: string,
    resourceId: string,
    limit: number = 50
  ): Promise<AuditEvent[]> {
    return this.model.findMany({
      where: {
        resource,
        resourceId,
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }

  /**
   * Clean old audit events
   */
  async cleanOldEvents(daysToKeep: number): Promise<{ count: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    return this.deleteMany({
      timestamp: {
        lt: cutoffDate,
      },
    });
  }

  /**
   * Export audit events
   */
  async exportEvents(
    filters: AuditFilters,
    limit: number = 10000
  ): Promise<AuditEvent[]> {
    const where: Prisma.AuditEventWhereInput = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.resource) where.resource = filters.resource;
    if (filters.resourceId) where.resourceId = filters.resourceId;
    if (filters.ipAddress) where.ipAddress = filters.ipAddress;

    if (filters.fromDate || filters.toDate) {
      where.timestamp = {};
      if (filters.fromDate) where.timestamp.gte = filters.fromDate;
      if (filters.toDate) where.timestamp.lte = filters.toDate;
    }

    return this.model.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }
}

export const auditRepository = new AuditRepository();
