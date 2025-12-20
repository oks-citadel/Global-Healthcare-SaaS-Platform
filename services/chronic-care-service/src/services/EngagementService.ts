import { PrismaClient, EngagementType } from '@prisma/client';

const prisma = new PrismaClient();

export class EngagementService {
  async trackEngagement(data: {
    patientId: string;
    carePlanId?: string;
    engagementType: EngagementType;
    activityType: string;
    description?: string;
    metadata?: any;
    recordedAt?: Date;
  }) {
    return await prisma.patientEngagement.create({
      data: {
        patientId: data.patientId,
        carePlanId: data.carePlanId,
        engagementType: data.engagementType,
        activityType: data.activityType,
        description: data.description,
        metadata: data.metadata,
        recordedAt: data.recordedAt || new Date(),
      },
    });
  }

  async getEngagementHistory(
    patientId: string,
    filters?: {
      carePlanId?: string;
      engagementType?: EngagementType;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ) {
    const where: any = { patientId };

    if (filters?.carePlanId) {
      where.carePlanId = filters.carePlanId;
    }

    if (filters?.engagementType) {
      where.engagementType = filters.engagementType;
    }

    if (filters?.startDate || filters?.endDate) {
      where.recordedAt = {};
      if (filters.startDate) {
        where.recordedAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.recordedAt.lte = filters.endDate;
      }
    }

    return await prisma.patientEngagement.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: filters?.limit || 100,
    });
  }

  async getEngagementSummary(
    patientId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const where: any = { patientId };

    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) {
        where.recordedAt.gte = startDate;
      }
      if (endDate) {
        where.recordedAt.lte = endDate;
      }
    }

    const engagements = await prisma.patientEngagement.findMany({
      where,
      select: {
        engagementType: true,
        recordedAt: true,
      },
    });

    const summary = {
      total: engagements.length,
      byType: {} as Record<string, number>,
      lastActivity: engagements.length > 0
        ? engagements.sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())[0].recordedAt
        : null,
    };

    // Count by engagement type
    for (const engagement of engagements) {
      const type = engagement.engagementType;
      summary.byType[type] = (summary.byType[type] || 0) + 1;
    }

    return summary;
  }

  async getEngagementScore(patientId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const engagements = await prisma.patientEngagement.findMany({
      where: {
        patientId,
        recordedAt: { gte: startDate },
      },
    });

    // Simple scoring algorithm
    const weights = {
      vital_reading: 5,
      task_completion: 4,
      goal_progress: 4,
      education_viewed: 2,
      message_sent: 2,
      app_login: 1,
      device_sync: 3,
    };

    let score = 0;
    for (const engagement of engagements) {
      score += weights[engagement.engagementType] || 1;
    }

    // Normalize to 0-100 scale (assuming max 10 activities per day)
    const maxPossibleScore = days * 10 * 5; // 10 activities * max weight
    const normalizedScore = Math.min(100, (score / maxPossibleScore) * 100);

    return {
      score: Math.round(normalizedScore),
      totalActivities: engagements.length,
      period: `${days} days`,
      breakdown: this.getEngagementBreakdown(engagements),
    };
  }

  private getEngagementBreakdown(engagements: any[]) {
    const breakdown: Record<string, number> = {};

    for (const engagement of engagements) {
      const type = engagement.engagementType;
      breakdown[type] = (breakdown[type] || 0) + 1;
    }

    return breakdown;
  }

  async getEngagementTrends(
    patientId: string,
    days: number = 30,
    groupBy: 'day' | 'week' = 'day'
  ) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const engagements = await prisma.patientEngagement.findMany({
      where: {
        patientId,
        recordedAt: { gte: startDate },
      },
      orderBy: { recordedAt: 'asc' },
    });

    const trends: Record<string, number> = {};

    for (const engagement of engagements) {
      let key: string;

      if (groupBy === 'day') {
        key = engagement.recordedAt.toISOString().split('T')[0];
      } else {
        // Group by week
        const weekStart = new Date(engagement.recordedAt);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        key = weekStart.toISOString().split('T')[0];
      }

      trends[key] = (trends[key] || 0) + 1;
    }

    return Object.entries(trends).map(([date, count]) => ({
      date,
      count,
    }));
  }

  async getDailyEngagementStats(patientId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const engagements = await this.getEngagementHistory(patientId, {
      startDate: startOfDay,
      endDate: endOfDay,
    });

    return {
      date: date.toISOString().split('T')[0],
      total: engagements.length,
      byType: engagements.reduce((acc, e) => {
        acc[e.engagementType] = (acc[e.engagementType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      activities: engagements,
    };
  }

  async getInactivePatients(days: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Get all patients with engagements
    const recentEngagements = await prisma.patientEngagement.groupBy({
      by: ['patientId'],
      where: {
        recordedAt: { gte: cutoffDate },
      },
    });

    const activePatientIds = new Set(recentEngagements.map(e => e.patientId));

    // Get all patients from care plans
    const allPatients = await prisma.carePlan.findMany({
      where: { status: 'active' },
      select: { patientId: true },
      distinct: ['patientId'],
    });

    const inactivePatientIds = allPatients
      .map(p => p.patientId)
      .filter(id => !activePatientIds.has(id));

    return inactivePatientIds;
  }
}

export default new EngagementService();
