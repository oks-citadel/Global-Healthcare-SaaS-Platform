import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import denialAnalyticsService from '../services/denial-analytics.service';
import { subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Get dashboard summary
router.get('/dashboard', requireUser, async (req: UserRequest, res) => {
  try {
    const summary = await denialAnalyticsService.getDashboardSummary();
    res.json({ data: summary });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch dashboard data',
    });
  }
});

// Get comprehensive denial analytics
router.get('/denials', requireUser, async (req: UserRequest, res) => {
  try {
    const {
      startDate,
      endDate,
      payerId,
      providerId,
      denialCategory,
    } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : startOfMonth(subMonths(new Date(), 2));
    const end = endDate
      ? new Date(endDate as string)
      : new Date();

    const analytics = await denialAnalyticsService.getDenialAnalytics(
      start,
      end,
      {
        payerId: payerId as string,
        providerId: providerId as string,
        denialCategory: denialCategory as string,
      }
    );

    res.json({ data: analytics });
  } catch (error) {
    console.error('Error fetching denial analytics:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch denial analytics',
    });
  }
});

// Get revenue recovery summary
router.get('/revenue-recovery', requireUser, async (req: UserRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : startOfMonth(subMonths(new Date(), 2));
    const end = endDate
      ? new Date(endDate as string)
      : new Date();

    const recovery = await denialAnalyticsService.getRevenueRecoverySummary(start, end);

    res.json({ data: recovery });
  } catch (error) {
    console.error('Error fetching revenue recovery:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch revenue recovery data',
    });
  }
});

// Get staff productivity metrics
router.get('/productivity/:staffId', requireUser, async (req: UserRequest, res) => {
  try {
    const { staffId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : subDays(new Date(), 30);
    const end = endDate
      ? new Date(endDate as string)
      : new Date();

    const productivity = await denialAnalyticsService.getStaffProductivity(
      staffId,
      start,
      end
    );

    res.json({ data: productivity });
  } catch (error) {
    console.error('Error fetching productivity:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch productivity metrics',
    });
  }
});

// Get team productivity dashboard
router.get('/productivity', requireUser, requireRole('admin', 'supervisor'), async (req: UserRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : subDays(new Date(), 30);
    const end = endDate
      ? new Date(endDate as string)
      : new Date();

    // Get all staff with productivity data
    const staffRecords = await prisma.staffProductivity.findMany({
      where: {
        periodDate: {
          gte: start,
          lte: end,
        },
      },
      distinct: ['staffId'],
      select: { staffId: true, staffName: true },
    });

    // Get metrics for each staff member
    const teamMetrics = await Promise.all(
      staffRecords.map(staff =>
        denialAnalyticsService.getStaffProductivity(staff.staffId, start, end)
      )
    );

    // Calculate team totals
    const teamTotals = teamMetrics.reduce(
      (acc, member) => ({
        denialsReviewed: acc.denialsReviewed + member.metrics.denialsReviewed,
        appealsCreated: acc.appealsCreated + member.metrics.appealsCreated,
        appealsSubmitted: acc.appealsSubmitted + member.metrics.appealsSubmitted,
        appealsOverturned: acc.appealsOverturned + member.metrics.appealsOverturned,
        totalRecovered: acc.totalRecovered + member.metrics.totalRecovered,
      }),
      {
        denialsReviewed: 0,
        appealsCreated: 0,
        appealsSubmitted: 0,
        appealsOverturned: 0,
        totalRecovered: 0,
      }
    );

    res.json({
      data: {
        members: teamMetrics,
        totals: teamTotals,
        teamOverturnRate: teamTotals.appealsSubmitted > 0
          ? teamTotals.appealsOverturned / teamTotals.appealsSubmitted
          : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching team productivity:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch team productivity',
    });
  }
});

// Get denial patterns
router.get('/patterns', requireUser, async (req: UserRequest, res) => {
  try {
    const {
      payerId,
      procedureCode,
      carcCode,
      minDenials = '5',
      limit = '50',
    } = req.query;

    const where: any = {};
    if (payerId) where.payerId = payerId;
    if (procedureCode) where.procedureCode = procedureCode;
    if (carcCode) where.carcCode = carcCode;
    where.totalDenials = { gte: parseInt(minDenials as string, 10) };

    const patterns = await prisma.denialPattern.findMany({
      where,
      orderBy: [
        { totalBilledAmount: 'desc' },
        { denialRate: 'desc' },
      ],
      take: parseInt(limit as string, 10),
    });

    res.json({
      data: patterns,
      count: patterns.length,
    });
  } catch (error) {
    console.error('Error fetching patterns:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch denial patterns',
    });
  }
});

// Refresh denial patterns (batch job)
router.post('/patterns/refresh', requireUser, requireRole('admin'), async (req: UserRequest, res) => {
  try {
    const { startDate, endDate } = req.body;

    const start = startDate
      ? new Date(startDate)
      : startOfMonth(subMonths(new Date(), 3));
    const end = endDate
      ? new Date(endDate)
      : endOfMonth(new Date());

    await denialAnalyticsService.updateDenialPatterns(start, end);

    res.json({
      message: 'Denial patterns refreshed successfully',
      period: { start, end },
    });
  } catch (error) {
    console.error('Error refreshing patterns:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to refresh denial patterns',
    });
  }
});

// Get payer performance report
router.get('/payers', requireUser, async (req: UserRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : startOfMonth(subMonths(new Date(), 6));
    const end = endDate
      ? new Date(endDate as string)
      : new Date();

    const payers = await prisma.denial.groupBy({
      by: ['payerId', 'payerName'],
      where: {
        denialDate: { gte: start, lte: end },
      },
      _count: true,
      _sum: {
        billedAmount: true,
        recoveredAmount: true,
        writeOffAmount: true,
      },
    });

    // Enrich with payer config and appeal success rates
    const enrichedPayers = await Promise.all(
      payers.map(async payer => {
        const config = await prisma.payerConfig.findUnique({
          where: { payerId: payer.payerId },
        });

        const appeals = await prisma.appeal.findMany({
          where: {
            denial: { payerId: payer.payerId },
            outcome: { not: null },
          },
          select: { outcome: true },
        });

        const successful = appeals.filter(
          a => a.outcome === 'overturned_full' || a.outcome === 'overturned_partial'
        ).length;

        return {
          payerId: payer.payerId,
          payerName: payer.payerName,
          totalDenials: payer._count,
          totalBilled: Number(payer._sum.billedAmount) || 0,
          totalRecovered: Number(payer._sum.recoveredAmount) || 0,
          totalWrittenOff: Number(payer._sum.writeOffAmount) || 0,
          recoveryRate: (Number(payer._sum.billedAmount) || 0) > 0
            ? (Number(payer._sum.recoveredAmount) || 0) / (Number(payer._sum.billedAmount) || 1)
            : 0,
          appealSuccessRate: appeals.length > 0 ? successful / appeals.length : null,
          deadlines: config ? {
            firstLevel: config.firstLevelDeadlineDays,
            secondLevel: config.secondLevelDeadlineDays,
            externalReview: config.externalReviewDeadlineDays,
          } : null,
          acceptsElectronicAppeals: config?.acceptsElectronicAppeals || false,
        };
      })
    );

    res.json({
      data: enrichedPayers.sort((a, b) => b.totalBilled - a.totalBilled),
    });
  } catch (error) {
    console.error('Error fetching payer report:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch payer report',
    });
  }
});

// Get procedure denial analysis
router.get('/procedures', requireUser, async (req: UserRequest, res) => {
  try {
    const { startDate, endDate, payerId, minDenials = '3' } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : startOfMonth(subMonths(new Date(), 3));
    const end = endDate
      ? new Date(endDate as string)
      : new Date();

    const where: any = {
      denialDate: { gte: start, lte: end },
    };
    if (payerId) where.payerId = payerId;

    const procedures = await prisma.denial.groupBy({
      by: ['procedureCode'],
      where,
      _count: true,
      _sum: {
        billedAmount: true,
        recoveredAmount: true,
      },
      having: {
        procedureCode: {
          _count: { gte: parseInt(minDenials as string, 10) },
        },
      },
      orderBy: {
        _sum: { billedAmount: 'desc' },
      },
      take: 50,
    });

    // Get top denial reasons for each procedure
    const enriched = await Promise.all(
      procedures.map(async proc => {
        const reasons = await prisma.denial.groupBy({
          by: ['carcCode', 'carcDescription'],
          where: {
            ...where,
            procedureCode: proc.procedureCode,
          },
          _count: true,
          orderBy: { _count: { carcCode: 'desc' } },
          take: 3,
        });

        return {
          procedureCode: proc.procedureCode,
          totalDenials: proc._count,
          totalBilled: Number(proc._sum.billedAmount) || 0,
          totalRecovered: Number(proc._sum.recoveredAmount) || 0,
          recoveryRate: (Number(proc._sum.billedAmount) || 0) > 0
            ? (Number(proc._sum.recoveredAmount) || 0) / (Number(proc._sum.billedAmount) || 1)
            : 0,
          topReasons: reasons.map(r => ({
            carcCode: r.carcCode,
            description: r.carcDescription,
            count: r._count,
          })),
        };
      })
    );

    res.json({ data: enriched });
  } catch (error) {
    console.error('Error fetching procedure analysis:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch procedure analysis',
    });
  }
});

// Get trending issues
router.get('/trending', requireUser, async (req: UserRequest, res) => {
  try {
    const now = new Date();
    const thisMonth = startOfMonth(now);
    const lastMonth = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // Get this month's top issues
    const thisMonthIssues = await prisma.denial.groupBy({
      by: ['carcCode', 'carcDescription'],
      where: { denialDate: { gte: thisMonth } },
      _count: true,
      _sum: { billedAmount: true },
      orderBy: { _count: { carcCode: 'desc' } },
      take: 10,
    });

    // Get last month's data for comparison
    const lastMonthIssues = await prisma.denial.groupBy({
      by: ['carcCode'],
      where: { denialDate: { gte: lastMonth, lte: lastMonthEnd } },
      _count: true,
    });

    const lastMonthMap = new Map(
      lastMonthIssues.map(i => [i.carcCode, i._count])
    );

    const trending = thisMonthIssues.map(issue => {
      const lastMonthCount = lastMonthMap.get(issue.carcCode) || 0;
      const changePercent = lastMonthCount > 0
        ? ((issue._count - lastMonthCount) / lastMonthCount) * 100
        : 100;

      return {
        carcCode: issue.carcCode,
        description: issue.carcDescription,
        thisMonthCount: issue._count,
        lastMonthCount,
        changePercent,
        totalAmount: Number(issue._sum.billedAmount) || 0,
        trend: changePercent > 10 ? 'increasing' : changePercent < -10 ? 'decreasing' : 'stable',
      };
    });

    res.json({
      data: trending.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)),
    });
  } catch (error) {
    console.error('Error fetching trending issues:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch trending issues',
    });
  }
});

// Export analytics data
router.get('/export', requireUser, requireRole('admin', 'billing'), async (req: UserRequest, res) => {
  try {
    const { format = 'json', startDate, endDate, type = 'denials' } = req.query;

    const start = startDate
      ? new Date(startDate as string)
      : startOfMonth(subMonths(new Date(), 1));
    const end = endDate
      ? new Date(endDate as string)
      : new Date();

    let data: any;

    switch (type) {
      case 'denials':
        data = await prisma.denial.findMany({
          where: { denialDate: { gte: start, lte: end } },
          include: { appeals: true },
          orderBy: { denialDate: 'desc' },
        });
        break;
      case 'appeals':
        data = await prisma.appeal.findMany({
          where: { createdAt: { gte: start, lte: end } },
          include: { denial: true },
          orderBy: { createdAt: 'desc' },
        });
        break;
      case 'patterns':
        data = await prisma.denialPattern.findMany({
          where: { periodStart: { gte: start }, periodEnd: { lte: end } },
          orderBy: { totalBilledAmount: 'desc' },
        });
        break;
      case 'productivity':
        data = await prisma.staffProductivity.findMany({
          where: { periodDate: { gte: start, lte: end } },
          orderBy: { periodDate: 'desc' },
        });
        break;
      default:
        res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid export type',
        });
        return;
    }

    if (format === 'csv') {
      // Simple CSV conversion
      const headers = Object.keys(data[0] || {}).join(',');
      const rows = data.map((item: any) =>
        Object.values(item).map(v =>
          typeof v === 'object' ? JSON.stringify(v) : v
        ).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}-export.csv`);
      res.send(csv);
    } else {
      res.json({
        data,
        count: data.length,
        period: { start, end },
      });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to export data',
    });
  }
});

export default router;
