import { Router, Response } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();

// Lazy load Prisma
const getPrisma = async () => {
  const { PrismaClient } = await import('../generated/client');
  return new PrismaClient();
};

// Validation schemas
const createEnrollmentSchema = z.object({
  patientId: z.string().uuid(),
  trialId: z.string().uuid(),
  siteId: z.string().uuid(),
  studySubjectId: z.string().optional(),
  primaryInvestigator: z.string().optional(),
  studyCoordinator: z.string().optional(),
  notes: z.string().optional(),
});

const updateEnrollmentStatusSchema = z.object({
  status: z.enum([
    'screening',
    'screen_failed',
    'enrolled',
    'randomized',
    'active',
    'on_hold',
    'withdrawn',
    'completed',
    'lost_to_follow_up',
  ]),
  reason: z.string().optional(),
  armAssignment: z.string().optional(),
});

const createConsentSchema = z.object({
  consentType: z.enum([
    'main_study',
    'optional_sub_study',
    'genetic_testing',
    'biobanking',
    'future_contact',
    'data_sharing',
    'imaging',
    'amendment',
    'reconsent',
  ]),
  consentFormId: z.string().optional(),
  consentFormVersion: z.string().optional(),
  signedBy: z.string(),
  witnessName: z.string().optional(),
  coordinatorName: z.string().optional(),
  coordinatorId: z.string().optional(),
  documentUrl: z.string().url().optional(),
  expiresAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});

const scheduleVisitSchema = z.object({
  visitNumber: z.number().min(1),
  visitName: z.string(),
  visitType: z.enum([
    'screening',
    'baseline',
    'scheduled',
    'unscheduled',
    'early_termination',
    'follow_up',
    'closeout',
  ]),
  scheduledDate: z.string().datetime(),
  notes: z.string().optional(),
});

// POST /enrollment - Create new enrollment
router.post('/', requireUser, requireRole('coordinator', 'admin', 'provider'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const validatedData = createEnrollmentSchema.parse(req.body);

    // Check if trial exists and is recruiting
    const trial = await prisma.clinicalTrial.findUnique({
      where: { id: validatedData.trialId },
    });

    if (!trial) {
      res.status(404).json({ error: 'Not Found', message: 'Trial not found' });
      return;
    }

    if (!['recruiting', 'enrolling_by_invitation'].includes(trial.status)) {
      res.status(400).json({
        error: 'Bad Request',
        message: `Trial is not currently accepting enrollments (status: ${trial.status})`,
      });
      return;
    }

    // Check if site exists and is active
    const site = await prisma.trialSite.findUnique({
      where: { id: validatedData.siteId },
    });

    if (!site || !site.isActive) {
      res.status(404).json({ error: 'Not Found', message: 'Site not found or inactive' });
      return;
    }

    // Check for existing enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        patientId_trialId: {
          patientId: validatedData.patientId,
          trialId: validatedData.trialId,
        },
      },
    });

    if (existingEnrollment) {
      res.status(409).json({
        error: 'Conflict',
        message: 'Patient is already enrolled in this trial',
        existingEnrollmentId: existingEnrollment.id,
      });
      return;
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        ...validatedData,
        screeningDate: new Date(),
      },
      include: {
        trial: {
          select: { nctId: true, title: true },
        },
        site: {
          select: { facilityName: true, city: true },
        },
      },
    });

    // Create initial status history
    await prisma.enrollmentStatusHistory.create({
      data: {
        enrollmentId: enrollment.id,
        fromStatus: null,
        toStatus: 'screening',
        changedBy: req.user!.id,
      },
    });

    // Update site enrollment count
    await prisma.trialSite.update({
      where: { id: validatedData.siteId },
      data: { currentEnrollment: { increment: 1 } },
    });

    await prisma.$disconnect();

    res.status(201).json({
      data: enrollment,
      message: 'Enrollment created successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /enrollment - List enrollments
router.get('/', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { trialId, siteId, status, patientId, limit = '50', offset = '0' } = req.query;

    const where: any = {};

    // Role-based filtering
    if (req.user?.role === 'patient') {
      where.patientId = req.user.id;
    } else if (patientId) {
      where.patientId = patientId;
    }

    if (trialId) where.trialId = trialId;
    if (siteId) where.siteId = siteId;
    if (status) where.status = status;

    const [enrollments, total] = await Promise.all([
      prisma.enrollment.findMany({
        where,
        include: {
          trial: {
            select: { nctId: true, title: true, status: true, phase: true },
          },
          site: {
            select: { facilityName: true, city: true, state: true },
          },
          _count: {
            select: { consentRecords: true, visits: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string, 10),
        skip: parseInt(offset as string, 10),
      }),
      prisma.enrollment.count({ where }),
    ]);

    await prisma.$disconnect();

    res.json({
      data: enrollments,
      pagination: {
        total,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
        hasMore: parseInt(offset as string, 10) + enrollments.length < total,
      },
    });
  } catch (error: any) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /enrollment/:id - Get enrollment details
router.get('/:id', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      include: {
        trial: true,
        site: true,
        consentRecords: {
          orderBy: { signedAt: 'desc' },
        },
        statusHistory: {
          orderBy: { changedAt: 'desc' },
        },
        visits: {
          orderBy: { visitNumber: 'asc' },
        },
      },
    });

    await prisma.$disconnect();

    if (!enrollment) {
      res.status(404).json({ error: 'Not Found', message: 'Enrollment not found' });
      return;
    }

    // Check access
    if (req.user?.role === 'patient' && enrollment.patientId !== req.user.id) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    res.json({ data: enrollment });
  } catch (error: any) {
    console.error('Error fetching enrollment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// PUT /enrollment/:id/status - Update enrollment status
router.put('/:id/status', requireUser, requireRole('coordinator', 'admin', 'provider'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;
    const validatedData = updateEnrollmentStatusSchema.parse(req.body);

    const enrollment = await prisma.enrollment.findUnique({ where: { id } });

    if (!enrollment) {
      res.status(404).json({ error: 'Not Found', message: 'Enrollment not found' });
      return;
    }

    const previousStatus = enrollment.status;

    // Determine date fields to update
    const dateUpdates: any = {};

    switch (validatedData.status) {
      case 'enrolled':
        dateUpdates.enrollmentDate = new Date();
        break;
      case 'randomized':
        dateUpdates.randomizationDate = new Date();
        dateUpdates.armAssignment = validatedData.armAssignment;
        break;
      case 'withdrawn':
        dateUpdates.withdrawalDate = new Date();
        dateUpdates.withdrawalReason = validatedData.reason;
        break;
      case 'completed':
        dateUpdates.completionDate = new Date();
        break;
    }

    // Update enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        status: validatedData.status,
        ...dateUpdates,
      },
      include: {
        trial: { select: { nctId: true, title: true } },
        site: { select: { facilityName: true } },
      },
    });

    // Create status history entry
    await prisma.enrollmentStatusHistory.create({
      data: {
        enrollmentId: id,
        fromStatus: previousStatus,
        toStatus: validatedData.status,
        reason: validatedData.reason,
        changedBy: req.user!.id,
      },
    });

    // Create notification
    await prisma.trialNotification.create({
      data: {
        recipientId: enrollment.patientId,
        recipientType: 'patient',
        type: 'enrollment_status',
        title: 'Enrollment Status Update',
        message: `Your enrollment status has been updated to: ${validatedData.status}`,
        trialId: enrollment.trialId,
        enrollmentId: id,
        priority: ['withdrawn', 'screen_failed'].includes(validatedData.status) ? 'high' : 'normal',
      },
    });

    await prisma.$disconnect();

    res.json({
      data: updatedEnrollment,
      message: `Enrollment status updated to ${validatedData.status}`,
      previousStatus,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating enrollment status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /enrollment/:id/consent - Add consent record
router.post('/:id/consent', requireUser, requireRole('coordinator', 'admin'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;
    const validatedData = createConsentSchema.parse(req.body);

    const enrollment = await prisma.enrollment.findUnique({ where: { id } });

    if (!enrollment) {
      res.status(404).json({ error: 'Not Found', message: 'Enrollment not found' });
      return;
    }

    const consent = await prisma.consentRecord.create({
      data: {
        enrollmentId: id,
        ...validatedData,
        signedAt: new Date(),
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
      },
    });

    await prisma.$disconnect();

    res.status(201).json({
      data: consent,
      message: 'Consent record created successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating consent:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /enrollment/:id/consent - Get consent records
router.get('/:id/consent', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      select: { patientId: true },
    });

    if (!enrollment) {
      res.status(404).json({ error: 'Not Found', message: 'Enrollment not found' });
      return;
    }

    if (req.user?.role === 'patient' && enrollment.patientId !== req.user.id) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const consents = await prisma.consentRecord.findMany({
      where: { enrollmentId: id },
      orderBy: { signedAt: 'desc' },
    });

    await prisma.$disconnect();

    res.json({ data: consents });
  } catch (error: any) {
    console.error('Error fetching consent records:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// PUT /enrollment/:id/consent/:consentId/revoke - Revoke consent
router.put('/:id/consent/:consentId/revoke', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id, consentId } = req.params;
    const { reason } = req.body;

    const consent = await prisma.consentRecord.findFirst({
      where: { id: consentId, enrollmentId: id },
      include: { enrollment: true },
    });

    if (!consent) {
      res.status(404).json({ error: 'Not Found', message: 'Consent record not found' });
      return;
    }

    // Patients can revoke their own consent
    if (req.user?.role === 'patient' && consent.enrollment.patientId !== req.user.id) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const updatedConsent = await prisma.consentRecord.update({
      where: { id: consentId },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });

    await prisma.$disconnect();

    res.json({
      data: updatedConsent,
      message: 'Consent revoked successfully',
    });
  } catch (error: any) {
    console.error('Error revoking consent:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /enrollment/:id/visits - Schedule a visit
router.post('/:id/visits', requireUser, requireRole('coordinator', 'admin'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;
    const validatedData = scheduleVisitSchema.parse(req.body);

    const enrollment = await prisma.enrollment.findUnique({ where: { id } });

    if (!enrollment) {
      res.status(404).json({ error: 'Not Found', message: 'Enrollment not found' });
      return;
    }

    const visit = await prisma.trialVisit.create({
      data: {
        enrollmentId: id,
        ...validatedData,
        scheduledDate: new Date(validatedData.scheduledDate),
      },
    });

    // Create reminder notification
    await prisma.trialNotification.create({
      data: {
        recipientId: enrollment.patientId,
        recipientType: 'patient',
        type: 'visit_reminder',
        title: 'Upcoming Trial Visit',
        message: `You have a ${validatedData.visitName} visit scheduled for ${new Date(validatedData.scheduledDate).toLocaleDateString()}`,
        trialId: enrollment.trialId,
        enrollmentId: id,
        priority: 'normal',
      },
    });

    await prisma.$disconnect();

    res.status(201).json({
      data: visit,
      message: 'Visit scheduled successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error scheduling visit:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /enrollment/:id/visits - Get visits
router.get('/:id/visits', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
      select: { patientId: true },
    });

    if (!enrollment) {
      res.status(404).json({ error: 'Not Found', message: 'Enrollment not found' });
      return;
    }

    if (req.user?.role === 'patient' && enrollment.patientId !== req.user.id) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const visits = await prisma.trialVisit.findMany({
      where: { enrollmentId: id },
      orderBy: { visitNumber: 'asc' },
    });

    await prisma.$disconnect();

    res.json({ data: visits });
  } catch (error: any) {
    console.error('Error fetching visits:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// PUT /enrollment/:id/visits/:visitId - Update visit
router.put('/:id/visits/:visitId', requireUser, requireRole('coordinator', 'admin'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id, visitId } = req.params;
    const { status, actualDate, completedBy, notes, missedReason, protocolDeviations } = req.body;

    const visit = await prisma.trialVisit.findFirst({
      where: { id: visitId, enrollmentId: id },
    });

    if (!visit) {
      res.status(404).json({ error: 'Not Found', message: 'Visit not found' });
      return;
    }

    const updatedVisit = await prisma.trialVisit.update({
      where: { id: visitId },
      data: {
        status,
        actualDate: actualDate ? new Date(actualDate) : undefined,
        completedBy,
        notes,
        missedReason,
        protocolDeviations,
      },
    });

    await prisma.$disconnect();

    res.json({
      data: updatedVisit,
      message: 'Visit updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating visit:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /enrollment/statistics - Get enrollment statistics
router.get('/statistics/summary', requireUser, requireRole('admin', 'coordinator'), async (req: UserRequest, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { trialId, siteId } = req.query;

    const where: any = {};
    if (trialId) where.trialId = trialId;
    if (siteId) where.siteId = siteId;

    const [
      totalEnrollments,
      statusCounts,
      recentEnrollments,
      consentStats,
    ] = await Promise.all([
      prisma.enrollment.count({ where }),
      prisma.enrollment.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.enrollment.count({
        where: {
          ...where,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.consentRecord.groupBy({
        by: ['consentType', 'isActive'],
        _count: true,
      }),
    ]);

    await prisma.$disconnect();

    const statusBreakdown = statusCounts.reduce((acc: any, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {});

    res.json({
      data: {
        totalEnrollments,
        statusBreakdown,
        enrollmentsLast30Days: recentEnrollments,
        activeRate: totalEnrollments > 0
          ? Math.round(((statusBreakdown.active || 0) / totalEnrollments) * 100)
          : 0,
        screenFailRate: totalEnrollments > 0
          ? Math.round(((statusBreakdown.screen_failed || 0) / totalEnrollments) * 100)
          : 0,
        completionRate: totalEnrollments > 0
          ? Math.round(((statusBreakdown.completed || 0) / totalEnrollments) * 100)
          : 0,
        consentStats: consentStats.reduce((acc: any, item) => {
          const key = item.isActive ? 'active' : 'revoked';
          if (!acc[item.consentType]) acc[item.consentType] = {};
          acc[item.consentType][key] = item._count;
          return acc;
        }, {}),
      },
    });
  } catch (error: any) {
    console.error('Error fetching enrollment statistics:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
