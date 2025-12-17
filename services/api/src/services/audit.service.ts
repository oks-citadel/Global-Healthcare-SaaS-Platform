import { prisma } from '../lib/prisma.js';

export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export const auditService = {
  /**
   * Log an audit event
   */
  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    await prisma.auditEvent.create({
      data: {
        userId: event.userId,
        action: event.action,
        resource: event.resource,
        resourceId: event.resourceId || null,
        details: event.details || null,
        ipAddress: event.ipAddress || null,
        userAgent: event.userAgent || null,
      },
    });
  },

  /**
   * List audit events with filters
   */
  async listEvents(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    from?: string;
    to?: string;
    page: number;
    limit: number;
  }): Promise<{ data: AuditEvent[]; pagination: any }> {
    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }
    if (filters.action) {
      where.action = filters.action;
    }
    if (filters.resource) {
      where.resource = filters.resource;
    }
    if (filters.from || filters.to) {
      where.timestamp = {};
      if (filters.from) {
        where.timestamp.gte = new Date(filters.from);
      }
      if (filters.to) {
        where.timestamp.lte = new Date(filters.to);
      }
    }

    const total = await prisma.auditEvent.count({ where });
    const totalPages = Math.ceil(total / filters.limit);
    const offset = (filters.page - 1) * filters.limit;

    const events = await prisma.auditEvent.findMany({
      where,
      skip: offset,
      take: filters.limit,
      orderBy: { timestamp: 'desc' },
    });

    const data = events.map(event => ({
      id: event.id,
      userId: event.userId,
      action: event.action,
      resource: event.resource,
      resourceId: event.resourceId || undefined,
      details: event.details as Record<string, any> || undefined,
      ipAddress: event.ipAddress || undefined,
      userAgent: event.userAgent || undefined,
      timestamp: event.timestamp.toISOString(),
    }));

    return {
      data,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages,
      },
    };
  },
};
