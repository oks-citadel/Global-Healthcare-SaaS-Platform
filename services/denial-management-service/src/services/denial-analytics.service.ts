import { PrismaClient, Prisma } from '../generated/client';
import {
  DenialAnalytics,
  CategoryBreakdown,
  PayerBreakdown,
  ProcedureBreakdown,
  TrendData,
  StaffProductivityMetrics,
  COMMON_CARC_CODES,
} from '../types';
import { startOfMonth, endOfMonth, subMonths, format, startOfWeek, endOfWeek } from 'date-fns';

const prisma = new PrismaClient();

export class DenialAnalyticsService {
  /**
   * Get comprehensive denial analytics for a period
   */
  async getDenialAnalytics(
    startDate: Date,
    endDate: Date,
    filters?: {
      payerId?: string;
      providerId?: string;
      denialCategory?: string;
    }
  ): Promise<DenialAnalytics> {
    const where: Prisma.DenialWhereInput = {
      denialDate: {
        gte: startDate,
        lte: endDate,
      },
      ...(filters?.payerId && { payerId: filters.payerId }),
      ...(filters?.providerId && { providerId: filters.providerId }),
      ...(filters?.denialCategory && { denialCategory: filters.denialCategory as any }),
    };

    // Get summary statistics
    const summary = await this.getSummaryStats(where);

    // Get breakdown by category
    const byCategory = await this.getCategoryBreakdown(where);

    // Get breakdown by payer
    const byPayer = await this.getPayerBreakdown(where);

    // Get breakdown by procedure
    const byProcedure = await this.getProcedureBreakdown(where);

    // Get trend data
    const trends = await this.getTrendData(startDate, endDate, filters);

    return {
      period: { start: startDate, end: endDate },
      summary,
      byCategory,
      byPayer,
      byProcedure,
      trends,
    };
  }

  /**
   * Get summary statistics
   */
  private async getSummaryStats(where: Prisma.DenialWhereInput) {
    const denials = await prisma.denial.aggregate({
      where,
      _count: true,
      _sum: {
        billedAmount: true,
        recoveredAmount: true,
        writeOffAmount: true,
      },
    });

    const totalDenials = denials._count;
    const totalDeniedAmount = Number(denials._sum.billedAmount) || 0;
    const totalRecovered = Number(denials._sum.recoveredAmount) || 0;
    const totalWrittenOff = Number(denials._sum.writeOffAmount) || 0;
    const recoveryRate = totalDeniedAmount > 0 ? totalRecovered / totalDeniedAmount : 0;

    // Calculate average recovery time
    const recoveredDenials = await prisma.denial.findMany({
      where: {
        ...where,
        recoveredAmount: { gt: 0 },
      },
      include: {
        appeals: {
          where: { outcome: { in: ['overturned_full', 'overturned_partial'] } },
          orderBy: { completedAt: 'desc' },
          take: 1,
        },
      },
    });

    let totalRecoveryDays = 0;
    let countWithRecovery = 0;

    for (const denial of recoveredDenials) {
      if (denial.appeals.length > 0 && denial.appeals[0].completedAt) {
        const days = Math.floor(
          (denial.appeals[0].completedAt.getTime() - denial.denialDate.getTime()) /
          (1000 * 60 * 60 * 24)
        );
        totalRecoveryDays += days;
        countWithRecovery++;
      }
    }

    const averageRecoveryTime = countWithRecovery > 0
      ? Math.round(totalRecoveryDays / countWithRecovery)
      : 0;

    return {
      totalDenials,
      totalDeniedAmount,
      totalRecovered,
      totalWrittenOff,
      recoveryRate,
      averageRecoveryTime,
    };
  }

  /**
   * Get breakdown by denial category
   */
  private async getCategoryBreakdown(where: Prisma.DenialWhereInput): Promise<CategoryBreakdown[]> {
    const groups = await prisma.denial.groupBy({
      by: ['denialCategory'],
      where,
      _count: true,
      _sum: {
        billedAmount: true,
        recoveredAmount: true,
      },
    });

    return groups.map(group => ({
      category: group.denialCategory,
      count: group._count,
      amount: Number(group._sum.billedAmount) || 0,
      recovered: Number(group._sum.recoveredAmount) || 0,
      recoveryRate: (Number(group._sum.billedAmount) || 0) > 0
        ? (Number(group._sum.recoveredAmount) || 0) / (Number(group._sum.billedAmount) || 1)
        : 0,
    }));
  }

  /**
   * Get breakdown by payer
   */
  private async getPayerBreakdown(where: Prisma.DenialWhereInput): Promise<PayerBreakdown[]> {
    const groups = await prisma.denial.groupBy({
      by: ['payerId', 'payerName'],
      where,
      _count: true,
      _sum: {
        billedAmount: true,
        recoveredAmount: true,
      },
    });

    // Get top denial reasons for each payer
    const breakdowns: PayerBreakdown[] = [];

    for (const group of groups) {
      const topReasons = await prisma.denial.groupBy({
        by: ['carcCode'],
        where: {
          ...where,
          payerId: group.payerId,
        },
        _count: true,
        orderBy: {
          _count: {
            carcCode: 'desc',
          },
        },
        take: 3,
      });

      breakdowns.push({
        payerId: group.payerId,
        payerName: group.payerName,
        count: group._count,
        amount: Number(group._sum.billedAmount) || 0,
        recovered: Number(group._sum.recoveredAmount) || 0,
        recoveryRate: (Number(group._sum.billedAmount) || 0) > 0
          ? (Number(group._sum.recoveredAmount) || 0) / (Number(group._sum.billedAmount) || 1)
          : 0,
        topDenialReasons: topReasons.map(r =>
          COMMON_CARC_CODES[r.carcCode] || `CARC ${r.carcCode}`
        ),
      });
    }

    return breakdowns.sort((a, b) => b.amount - a.amount);
  }

  /**
   * Get breakdown by procedure
   */
  private async getProcedureBreakdown(where: Prisma.DenialWhereInput): Promise<ProcedureBreakdown[]> {
    const groups = await prisma.denial.groupBy({
      by: ['procedureCode'],
      where,
      _count: true,
      _sum: {
        billedAmount: true,
      },
    });

    const breakdowns: ProcedureBreakdown[] = [];

    for (const group of groups) {
      const topReasons = await prisma.denial.groupBy({
        by: ['carcCode'],
        where: {
          ...where,
          procedureCode: group.procedureCode,
        },
        _count: true,
        orderBy: {
          _count: {
            carcCode: 'desc',
          },
        },
        take: 3,
      });

      breakdowns.push({
        procedureCode: group.procedureCode,
        description: `CPT ${group.procedureCode}`, // Would use a CPT lookup in production
        count: group._count,
        amount: Number(group._sum.billedAmount) || 0,
        denialRate: 0, // Would calculate from total claims in production
        topReasons: topReasons.map(r =>
          COMMON_CARC_CODES[r.carcCode] || `CARC ${r.carcCode}`
        ),
      });
    }

    return breakdowns.sort((a, b) => b.count - a.count).slice(0, 20);
  }

  /**
   * Get trend data over time
   */
  private async getTrendData(
    startDate: Date,
    endDate: Date,
    filters?: { payerId?: string; providerId?: string; denialCategory?: string }
  ): Promise<TrendData[]> {
    const trends: TrendData[] = [];
    let currentDate = startOfMonth(startDate);

    while (currentDate <= endDate) {
      const monthEnd = endOfMonth(currentDate);

      const where: Prisma.DenialWhereInput = {
        denialDate: {
          gte: currentDate,
          lte: monthEnd > endDate ? endDate : monthEnd,
        },
        ...(filters?.payerId && { payerId: filters.payerId }),
        ...(filters?.providerId && { providerId: filters.providerId }),
        ...(filters?.denialCategory && { denialCategory: filters.denialCategory as any }),
      };

      const denials = await prisma.denial.aggregate({
        where,
        _count: true,
        _sum: {
          billedAmount: true,
          recoveredAmount: true,
        },
      });

      const appeals = await prisma.appeal.count({
        where: {
          denial: where,
          createdAt: {
            gte: currentDate,
            lte: monthEnd > endDate ? endDate : monthEnd,
          },
        },
      });

      trends.push({
        period: format(currentDate, 'MMM yyyy'),
        denials: denials._count,
        deniedAmount: Number(denials._sum.billedAmount) || 0,
        appeals,
        recovered: Number(denials._sum.recoveredAmount) || 0,
      });

      currentDate = startOfMonth(subMonths(currentDate, -1));
    }

    return trends;
  }

  /**
   * Update or create denial patterns
   */
  async updateDenialPatterns(periodStart: Date, periodEnd: Date): Promise<void> {
    // Group denials by payer, procedure, and CARC code
    const patterns = await prisma.denial.groupBy({
      by: ['payerId', 'payerName', 'procedureCode', 'carcCode', 'denialCategory'],
      where: {
        denialDate: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      _count: true,
      _sum: {
        billedAmount: true,
        recoveredAmount: true,
      },
    });

    for (const pattern of patterns) {
      await prisma.denialPattern.upsert({
        where: {
          payerId_procedureCode_diagnosisCode_carcCode_periodStart_periodEnd: {
            payerId: pattern.payerId,
            procedureCode: pattern.procedureCode,
            diagnosisCode: null as any, // Will be null for procedure-level patterns
            carcCode: pattern.carcCode,
            periodStart,
            periodEnd,
          },
        },
        update: {
          totalDenials: pattern._count,
          totalBilledAmount: pattern._sum.billedAmount || 0,
          totalRecoveredAmount: pattern._sum.recoveredAmount || 0,
          denialCategory: pattern.denialCategory,
          recoveryRate: (Number(pattern._sum.billedAmount) || 0) > 0
            ? (Number(pattern._sum.recoveredAmount) || 0) / (Number(pattern._sum.billedAmount) || 1)
            : 0,
          updatedAt: new Date(),
        },
        create: {
          payerId: pattern.payerId,
          payerName: pattern.payerName,
          procedureCode: pattern.procedureCode,
          carcCode: pattern.carcCode,
          denialCategory: pattern.denialCategory,
          totalDenials: pattern._count,
          totalBilledAmount: pattern._sum.billedAmount || 0,
          totalRecoveredAmount: pattern._sum.recoveredAmount || 0,
          denialRate: 0, // Would calculate from total claims
          recoveryRate: (Number(pattern._sum.billedAmount) || 0) > 0
            ? (Number(pattern._sum.recoveredAmount) || 0) / (Number(pattern._sum.billedAmount) || 1)
            : 0,
          periodStart,
          periodEnd,
          suggestedActions: this.getSuggestedActions(pattern.denialCategory, pattern.carcCode),
        },
      });
    }
  }

  /**
   * Get suggested actions for pattern
   */
  private getSuggestedActions(denialCategory: string, _carcCode: string): string[] {
    const actions: string[] = [];

    switch (denialCategory) {
      case 'prior_authorization':
        actions.push('Implement automated prior auth verification');
        actions.push('Create pre-service checklist for high-denial procedures');
        break;
      case 'medical_necessity':
        actions.push('Enhance clinical documentation templates');
        actions.push('Provide medical necessity training to providers');
        break;
      case 'coding_error':
        actions.push('Review coding guidelines for this procedure');
        actions.push('Consider coding audit for high-volume coders');
        break;
      case 'timely_filing':
        actions.push('Review claim submission workflow');
        actions.push('Implement automated filing deadline alerts');
        break;
      default:
        actions.push('Review denial patterns with billing team');
        actions.push('Contact payer for clarification on requirements');
    }

    return actions;
  }

  /**
   * Get staff productivity metrics
   */
  async getStaffProductivity(
    staffId: string,
    startDate: Date,
    endDate: Date
  ): Promise<StaffProductivityMetrics> {
    // Get productivity records for the period
    const productivityRecords = await prisma.staffProductivity.findMany({
      where: {
        staffId,
        periodDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Aggregate metrics
    const totals = productivityRecords.reduce(
      (acc, record) => ({
        denialsReviewed: acc.denialsReviewed + record.denialsReviewed,
        appealsCreated: acc.appealsCreated + record.appealsCreated,
        appealsSubmitted: acc.appealsSubmitted + record.appealsSubmitted,
        appealsOverturned: acc.appealsOverturned + record.appealsOverturned,
        totalProcessingTime: acc.totalProcessingTime + record.totalProcessingTime,
        totalRecovered: acc.totalRecovered + Number(record.totalRecovered),
      }),
      {
        denialsReviewed: 0,
        appealsCreated: 0,
        appealsSubmitted: 0,
        appealsOverturned: 0,
        totalProcessingTime: 0,
        totalRecovered: 0,
      }
    );

    const overturnRate = totals.appealsSubmitted > 0
      ? totals.appealsOverturned / totals.appealsSubmitted
      : 0;

    const averageProcessingTime = totals.appealsCreated > 0
      ? Math.round(totals.totalProcessingTime / totals.appealsCreated)
      : 0;

    const averageRecoveryPerAppeal = totals.appealsOverturned > 0
      ? totals.totalRecovered / totals.appealsOverturned
      : 0;

    // Get staff name
    const staffRecord = productivityRecords[0];
    const staffName = staffRecord?.staffName || 'Unknown';

    // Calculate comparison with previous period
    const periodLength = endDate.getTime() - startDate.getTime();
    const previousStart = new Date(startDate.getTime() - periodLength);
    const previousEnd = new Date(startDate.getTime() - 1);

    const previousRecords = await prisma.staffProductivity.findMany({
      where: {
        staffId,
        periodDate: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
    });

    const previousRecovered = previousRecords.reduce(
      (sum, r) => sum + Number(r.totalRecovered),
      0
    );

    const vsPrevious = previousRecovered > 0
      ? ((totals.totalRecovered - previousRecovered) / previousRecovered) * 100
      : 0;

    // Calculate team average
    const teamRecords = await prisma.staffProductivity.aggregate({
      where: {
        periodDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _avg: {
        totalRecovered: true,
      },
    });

    const teamAverage = Number(teamRecords._avg.totalRecovered) || 0;
    const vsTeamAverage = teamAverage > 0
      ? ((totals.totalRecovered - teamAverage) / teamAverage) * 100
      : 0;

    return {
      staffId,
      staffName,
      period: { start: startDate, end: endDate },
      metrics: {
        denialsReviewed: totals.denialsReviewed,
        appealsCreated: totals.appealsCreated,
        appealsSubmitted: totals.appealsSubmitted,
        appealsOverturned: totals.appealsOverturned,
        overturnRate,
        averageProcessingTime,
        totalRecovered: totals.totalRecovered,
        averageRecoveryPerAppeal,
      },
      comparison: {
        vsPrevious,
        vsTeamAverage,
      },
    };
  }

  /**
   * Get revenue recovery summary
   */
  async getRevenueRecoverySummary(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalDenied: number;
    totalRecovered: number;
    totalWrittenOff: number;
    pendingRecovery: number;
    recoveryRate: number;
    byCategory: Record<string, number>;
    byPayer: Record<string, number>;
    weeklyTrend: { week: string; recovered: number; denied: number }[];
  }> {
    const denials = await prisma.denial.aggregate({
      where: {
        denialDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        billedAmount: true,
        recoveredAmount: true,
        writeOffAmount: true,
      },
    });

    const totalDenied = Number(denials._sum.billedAmount) || 0;
    const totalRecovered = Number(denials._sum.recoveredAmount) || 0;
    const totalWrittenOff = Number(denials._sum.writeOffAmount) || 0;
    const pendingRecovery = totalDenied - totalRecovered - totalWrittenOff;
    const recoveryRate = totalDenied > 0 ? totalRecovered / totalDenied : 0;

    // Get by category
    const categoryGroups = await prisma.denial.groupBy({
      by: ['denialCategory'],
      where: {
        denialDate: { gte: startDate, lte: endDate },
      },
      _sum: { recoveredAmount: true },
    });

    const byCategory: Record<string, number> = {};
    for (const group of categoryGroups) {
      byCategory[group.denialCategory] = Number(group._sum.recoveredAmount) || 0;
    }

    // Get by payer
    const payerGroups = await prisma.denial.groupBy({
      by: ['payerId'],
      where: {
        denialDate: { gte: startDate, lte: endDate },
      },
      _sum: { recoveredAmount: true },
    });

    const byPayer: Record<string, number> = {};
    for (const group of payerGroups) {
      byPayer[group.payerId] = Number(group._sum.recoveredAmount) || 0;
    }

    // Get weekly trend
    const weeklyTrend: { week: string; recovered: number; denied: number }[] = [];
    let currentWeek = startOfWeek(startDate);

    while (currentWeek <= endDate) {
      const weekEnd = endOfWeek(currentWeek);
      const weekDenials = await prisma.denial.aggregate({
        where: {
          denialDate: {
            gte: currentWeek,
            lte: weekEnd > endDate ? endDate : weekEnd,
          },
        },
        _sum: {
          billedAmount: true,
          recoveredAmount: true,
        },
      });

      weeklyTrend.push({
        week: format(currentWeek, 'MMM d'),
        recovered: Number(weekDenials._sum.recoveredAmount) || 0,
        denied: Number(weekDenials._sum.billedAmount) || 0,
      });

      currentWeek = new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    return {
      totalDenied,
      totalRecovered,
      totalWrittenOff,
      pendingRecovery,
      recoveryRate,
      byCategory,
      byPayer,
      weeklyTrend,
    };
  }

  /**
   * Update staff productivity for a day
   */
  async updateStaffProductivity(
    staffId: string,
    staffName: string,
    date: Date,
    updates: {
      denialsReviewed?: number;
      appealsCreated?: number;
      appealsSubmitted?: number;
      appealsOverturned?: number;
      appealsUpheld?: number;
      processingTimeMinutes?: number;
      recoveredAmount?: number;
    }
  ): Promise<void> {
    const periodDate = new Date(date.toDateString()); // Normalize to date only

    await prisma.staffProductivity.upsert({
      where: {
        staffId_periodDate: {
          staffId,
          periodDate,
        },
      },
      update: {
        denialsReviewed: { increment: updates.denialsReviewed || 0 },
        appealsCreated: { increment: updates.appealsCreated || 0 },
        appealsSubmitted: { increment: updates.appealsSubmitted || 0 },
        appealsOverturned: { increment: updates.appealsOverturned || 0 },
        appealsUpheld: { increment: updates.appealsUpheld || 0 },
        totalProcessingTime: { increment: updates.processingTimeMinutes || 0 },
        totalRecovered: { increment: updates.recoveredAmount || 0 },
      },
      create: {
        staffId,
        staffName,
        periodDate,
        denialsReviewed: updates.denialsReviewed || 0,
        appealsCreated: updates.appealsCreated || 0,
        appealsSubmitted: updates.appealsSubmitted || 0,
        appealsOverturned: updates.appealsOverturned || 0,
        appealsUpheld: updates.appealsUpheld || 0,
        totalProcessingTime: updates.processingTimeMinutes || 0,
        totalRecovered: updates.recoveredAmount || 0,
      },
    });
  }

  /**
   * Get dashboard summary
   */
  async getDashboardSummary(): Promise<{
    today: { denials: number; recovered: number; pending: number };
    thisMonth: { denials: number; recovered: number; recoveryRate: number };
    topIssues: { issue: string; count: number; amount: number }[];
    urgentAppeals: { id: string; claimId: string; deadline: Date; amount: number }[];
  }> {
    const now = new Date();
    const todayStart = new Date(now.toDateString());
    const monthStart = startOfMonth(now);

    // Today's stats
    const todayDenials = await prisma.denial.aggregate({
      where: { denialDate: { gte: todayStart } },
      _count: true,
      _sum: { billedAmount: true, recoveredAmount: true },
    });

    // This month's stats
    const monthDenials = await prisma.denial.aggregate({
      where: { denialDate: { gte: monthStart } },
      _count: true,
      _sum: { billedAmount: true, recoveredAmount: true },
    });

    // Top issues (last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const topIssuesRaw = await prisma.denial.groupBy({
      by: ['carcCode'],
      where: { denialDate: { gte: thirtyDaysAgo } },
      _count: true,
      _sum: { billedAmount: true },
      orderBy: { _count: { carcCode: 'desc' } },
      take: 5,
    });

    const topIssues = topIssuesRaw.map(issue => ({
      issue: COMMON_CARC_CODES[issue.carcCode] || `CARC ${issue.carcCode}`,
      count: issue._count,
      amount: Number(issue._sum.billedAmount) || 0,
    }));

    // Urgent appeals (deadline within 7 days)
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const urgentAppealsRaw = await prisma.appeal.findMany({
      where: {
        status: { in: ['draft', 'pending_review', 'approved_for_submission'] },
        filingDeadline: { lte: sevenDaysFromNow },
      },
      include: { denial: true },
      orderBy: { filingDeadline: 'asc' },
      take: 10,
    });

    const urgentAppeals = urgentAppealsRaw.map(appeal => ({
      id: appeal.id,
      claimId: appeal.denial.claimId,
      deadline: appeal.filingDeadline,
      amount: Number(appeal.denial.billedAmount),
    }));

    const pendingAppeals = await prisma.appeal.count({
      where: { status: { in: ['draft', 'pending_review', 'submitted', 'pending_response'] } },
    });

    return {
      today: {
        denials: todayDenials._count,
        recovered: Number(todayDenials._sum.recoveredAmount) || 0,
        pending: pendingAppeals,
      },
      thisMonth: {
        denials: monthDenials._count,
        recovered: Number(monthDenials._sum.recoveredAmount) || 0,
        recoveryRate: (Number(monthDenials._sum.billedAmount) || 0) > 0
          ? (Number(monthDenials._sum.recoveredAmount) || 0) / (Number(monthDenials._sum.billedAmount) || 1)
          : 0,
      },
      topIssues,
      urgentAppeals,
    };
  }
}

export default new DenialAnalyticsService();
