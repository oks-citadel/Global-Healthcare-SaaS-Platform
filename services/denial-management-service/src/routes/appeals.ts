import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import appealGenerationService from '../services/appeal-generation.service';
import denialAnalyticsService from '../services/denial-analytics.service';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const generateAppealSchema = z.object({
  denialId: z.string().uuid(),
  appealType: z.enum([
    'clinical_review',
    'administrative_review',
    'peer_to_peer',
    'external_review',
    'expedited',
  ]),
  additionalContext: z.string().optional(),
  clinicalNotes: z.string().optional(),
  medicalRecords: z.array(z.string()).optional(),
});

const updateAppealSchema = z.object({
  status: z.enum([
    'draft',
    'pending_review',
    'approved_for_submission',
    'submitted',
    'pending_response',
    'additional_info_requested',
    'resolved',
    'closed',
  ]).optional(),
  appealLetterContent: z.string().optional(),
  appealLetterHtml: z.string().optional(),
  supportingDocuments: z.array(z.string()).optional(),
  assignedTo: z.string().uuid().optional(),
  processingTimeMinutes: z.number().optional(),
});

const recordOutcomeSchema = z.object({
  outcome: z.enum([
    'overturned_full',
    'overturned_partial',
    'upheld',
    'withdrawn',
    'expired',
  ]),
  adjustedAmount: z.number().optional(),
  outcomeReason: z.string().optional(),
});

// Get all appeals with filtering and pagination
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const {
      page = '1',
      limit = '20',
      status,
      appealType,
      assignedTo,
      denialId,
      urgentOnly,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status) where.status = status;
    if (appealType) where.appealType = appealType;
    if (assignedTo) where.assignedTo = assignedTo;
    if (denialId) where.denialId = denialId;

    if (urgentOnly === 'true') {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      where.filingDeadline = { lte: sevenDaysFromNow };
      where.status = { in: ['draft', 'pending_review', 'approved_for_submission'] };
    }

    const [appeals, total] = await Promise.all([
      prisma.appeal.findMany({
        where,
        include: {
          denial: {
            select: {
              claimId: true,
              patientId: true,
              payerName: true,
              billedAmount: true,
              carcCode: true,
              carcDescription: true,
            },
          },
        },
        orderBy: { filingDeadline: 'asc' },
        skip,
        take: limitNum,
      }),
      prisma.appeal.count({ where }),
    ]);

    res.json({
      data: appeals,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching appeals:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch appeals',
    });
  }
});

// Get single appeal by ID
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    const appeal = await prisma.appeal.findUnique({
      where: { id },
      include: {
        denial: true,
      },
    });

    if (!appeal) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Appeal not found',
      });
      return;
    }

    res.json({ data: appeal });
  } catch (error) {
    console.error('Error fetching appeal:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch appeal',
    });
  }
});

// Generate a new appeal letter
router.post('/generate', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = generateAppealSchema.parse(req.body);

    const response = await appealGenerationService.generateAppealLetter(validatedData);

    // Update staff productivity
    if (req.user) {
      await denialAnalyticsService.updateStaffProductivity(
        req.user.id,
        req.user.email,
        new Date(),
        { appealsCreated: 1 }
      );
    }

    res.status(201).json({
      data: response,
      message: 'Appeal letter generated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    if ((error as Error).message === 'Denial not found') {
      res.status(404).json({
        error: 'Not Found',
        message: 'Denial not found',
      });
      return;
    }
    console.error('Error generating appeal:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate appeal letter',
    });
  }
});

// Update appeal
router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateAppealSchema.parse(req.body);

    const appeal = await prisma.appeal.update({
      where: { id },
      data: {
        ...validatedData,
        ...(validatedData.assignedTo && { assignedAt: new Date() }),
      },
    });

    res.json({
      data: appeal,
      message: 'Appeal updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    console.error('Error updating appeal:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update appeal',
    });
  }
});

// Submit appeal
router.post('/:id/submit', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const staffId = req.user!.id;

    const appeal = await prisma.appeal.findUnique({
      where: { id },
    });

    if (!appeal) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Appeal not found',
      });
      return;
    }

    if (appeal.status !== 'approved_for_submission' && appeal.status !== 'draft') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Appeal is not ready for submission',
      });
      return;
    }

    await appealGenerationService.submitAppeal(id, staffId);

    // Update denial status
    await prisma.denial.update({
      where: { id: appeal.denialId },
      data: { claimStatus: 'appealed' },
    });

    // Update staff productivity
    await denialAnalyticsService.updateStaffProductivity(
      staffId,
      req.user!.email,
      new Date(),
      { appealsSubmitted: 1 }
    );

    const updated = await prisma.appeal.findUnique({
      where: { id },
      include: { denial: true },
    });

    res.json({
      data: updated,
      message: 'Appeal submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting appeal:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit appeal',
    });
  }
});

// Record appeal outcome
router.post('/:id/outcome', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const validatedData = recordOutcomeSchema.parse(req.body);

    await appealGenerationService.updateAppealOutcome(
      id,
      validatedData.outcome,
      validatedData.adjustedAmount,
      validatedData.outcomeReason
    );

    // Update staff productivity
    if (req.user) {
      const updates: any = {};
      if (validatedData.outcome === 'overturned_full' || validatedData.outcome === 'overturned_partial') {
        updates.appealsOverturned = 1;
        updates.recoveredAmount = validatedData.adjustedAmount || 0;
      } else if (validatedData.outcome === 'upheld') {
        updates.appealsUpheld = 1;
      }
      await denialAnalyticsService.updateStaffProductivity(
        req.user.id,
        req.user.email,
        new Date(),
        updates
      );
    }

    const updated = await prisma.appeal.findUnique({
      where: { id },
      include: { denial: true },
    });

    res.json({
      data: updated,
      message: 'Appeal outcome recorded successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    console.error('Error recording outcome:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to record appeal outcome',
    });
  }
});

// Get payer appeal strategy
router.get('/strategy/:payerId', requireUser, async (req: UserRequest, res) => {
  try {
    const { payerId } = req.params;
    const { carcCode, denialCategory } = req.query;

    const strategy = await appealGenerationService.getPayerAppealStrategy(
      payerId,
      carcCode as string || '',
      denialCategory as string || 'other'
    );

    res.json({
      data: strategy,
    });
  } catch (error) {
    console.error('Error fetching payer strategy:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch payer strategy',
    });
  }
});

// Assign appeal to staff member
router.post('/:id/assign', requireUser, requireRole('admin', 'supervisor'), async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;

    if (!staffId) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'staffId is required',
      });
      return;
    }

    const appeal = await prisma.appeal.update({
      where: { id },
      data: {
        assignedTo: staffId,
        assignedAt: new Date(),
      },
      include: { denial: true },
    });

    res.json({
      data: appeal,
      message: 'Appeal assigned successfully',
    });
  } catch (error) {
    console.error('Error assigning appeal:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to assign appeal',
    });
  }
});

// Get appeals queue for a staff member
router.get('/queue/:staffId', requireUser, async (req: UserRequest, res) => {
  try {
    const { staffId } = req.params;

    const appeals = await prisma.appeal.findMany({
      where: {
        assignedTo: staffId,
        status: { in: ['draft', 'pending_review', 'approved_for_submission', 'additional_info_requested'] },
      },
      include: {
        denial: {
          select: {
            claimId: true,
            patientId: true,
            payerName: true,
            billedAmount: true,
            carcCode: true,
          },
        },
      },
      orderBy: [
        { filingDeadline: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    // Calculate days until deadline for each
    const now = new Date();
    const appealsWithUrgency = appeals.map(appeal => ({
      ...appeal,
      daysUntilDeadline: Math.ceil(
        (appeal.filingDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      ),
      isUrgent: appeal.filingDeadline.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000,
    }));

    res.json({
      data: appealsWithUrgency,
      count: appeals.length,
    });
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch appeals queue',
    });
  }
});

// Escalate appeal to next level
router.post('/:id/escalate', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    const currentAppeal = await prisma.appeal.findUnique({
      where: { id },
      include: { denial: true },
    });

    if (!currentAppeal) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Appeal not found',
      });
      return;
    }

    if (currentAppeal.outcome !== 'upheld') {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Can only escalate appeals that were upheld',
      });
      return;
    }

    // Determine next appeal type
    const nextLevel = currentAppeal.appealLevel + 1;
    let nextAppealType: any = 'clinical_review';

    if (nextLevel === 2) {
      nextAppealType = 'peer_to_peer';
    } else if (nextLevel >= 3) {
      nextAppealType = 'external_review';
    }

    // Generate new appeal
    const response = await appealGenerationService.generateAppealLetter({
      denialId: currentAppeal.denialId,
      appealType: nextAppealType,
      additionalContext: `This is a level ${nextLevel} appeal following unsuccessful level ${currentAppeal.appealLevel} appeal.`,
    });

    // Update the new appeal's level
    await prisma.appeal.update({
      where: { id: response.appealId },
      data: { appealLevel: nextLevel },
    });

    res.status(201).json({
      data: response,
      message: `Appeal escalated to level ${nextLevel}`,
    });
  } catch (error) {
    console.error('Error escalating appeal:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to escalate appeal',
    });
  }
});

// Get appeal statistics
router.get('/stats/summary', requireUser, async (req: UserRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const [total, byStatus, byOutcome, byType] = await Promise.all([
      prisma.appeal.count({ where }),
      prisma.appeal.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.appeal.groupBy({
        by: ['outcome'],
        where: { ...where, outcome: { not: null } },
        _count: true,
        _sum: { adjustedAmount: true },
      }),
      prisma.appeal.groupBy({
        by: ['appealType'],
        where,
        _count: true,
      }),
    ]);

    // Calculate success rate
    const resolved = byOutcome.filter(o =>
      o.outcome === 'overturned_full' || o.outcome === 'overturned_partial'
    );
    const totalResolved = byOutcome.reduce((sum, o) => sum + o._count, 0);
    const successRate = totalResolved > 0
      ? resolved.reduce((sum, o) => sum + o._count, 0) / totalResolved
      : 0;

    res.json({
      data: {
        total,
        byStatus: byStatus.map(s => ({ status: s.status, count: s._count })),
        byOutcome: byOutcome.map(o => ({
          outcome: o.outcome,
          count: o._count,
          recoveredAmount: o._sum.adjustedAmount,
        })),
        byType: byType.map(t => ({ type: t.appealType, count: t._count })),
        successRate,
      },
    });
  } catch (error) {
    console.error('Error fetching appeal stats:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch appeal statistics',
    });
  }
});

export default router;
