import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient, CertificationType, CertificationStatus, TaskStatus, TaskPriority, RemediationType } from '../generated/client';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import { createAuditLog } from '../middleware/auditLogger';
import { addDays } from 'date-fns';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createCertificationSchema = z.object({
  vendorId: z.string().uuid(),
  type: z.nativeEnum(CertificationType),
  name: z.string().min(1).max(255),
  issuingBody: z.string().max(255).optional(),
  certificationNumber: z.string().max(100).optional(),
  scope: z.string().max(2000).optional(),
  issueDate: z.string().datetime().optional(),
  expirationDate: z.string().datetime().optional(),
  documentUrl: z.string().url().optional(),
  notes: z.string().max(5000).optional(),
});

const updateCertificationSchema = createCertificationSchema.partial().omit({ vendorId: true }).extend({
  status: z.nativeEnum(CertificationStatus).optional(),
  verified: z.boolean().optional(),
});

const listCertificationsSchema = z.object({
  vendorId: z.string().uuid().optional(),
  type: z.nativeEnum(CertificationType).optional(),
  status: z.nativeEnum(CertificationStatus).optional(),
  expiringBefore: z.string().datetime().optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
});

const createRemediationSchema = z.object({
  vendorId: z.string().uuid(),
  type: z.nativeEnum(RemediationType),
  priority: z.nativeEnum(TaskPriority),
  title: z.string().min(1).max(500),
  description: z.string().min(1).max(5000),
  requirement: z.string().max(2000).optional(),
  controlReference: z.string().max(100).optional(),
  dueDate: z.string().datetime().optional(),
  assignedTo: z.string().max(255).optional(),
  assignedToEmail: z.string().email().optional(),
});

// List certifications
router.get('/certifications', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const validatedQuery = listCertificationsSchema.parse(req.query);

    const where: Record<string, unknown> = {};
    if (validatedQuery.vendorId) where.vendorId = validatedQuery.vendorId;
    if (validatedQuery.type) where.type = validatedQuery.type;
    if (validatedQuery.status) where.status = validatedQuery.status;
    if (validatedQuery.expiringBefore) {
      where.expirationDate = {
        lte: new Date(validatedQuery.expiringBefore),
        gte: new Date(),
      };
      where.status = CertificationStatus.VALID;
    }

    const [certifications, total] = await Promise.all([
      prisma.certification.findMany({
        where: where as Parameters<typeof prisma.certification.findMany>[0]['where'],
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { expirationDate: 'asc' },
        take: validatedQuery.limit || 50,
        skip: validatedQuery.offset || 0,
      }),
      prisma.certification.count({ where: where as Parameters<typeof prisma.certification.count>[0]['where'] }),
    ]);

    res.json({
      data: certifications,
      total,
      limit: validatedQuery.limit || 50,
      offset: validatedQuery.offset || 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error listing certifications:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to list certifications' });
  }
});

// Get expiring certifications
router.get('/certifications/expiring', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const daysAhead = parseInt(req.query.daysAhead as string) || 90;
    const futureDate = addDays(new Date(), daysAhead);

    const certifications = await prisma.certification.findMany({
      where: {
        status: CertificationStatus.VALID,
        expirationDate: {
          gte: new Date(),
          lte: futureDate,
        },
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            primaryContactEmail: true,
          },
        },
      },
      orderBy: { expirationDate: 'asc' },
    });

    res.json({ data: certifications, count: certifications.length });
  } catch (error) {
    console.error('Error getting expiring certifications:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get certifications' });
  }
});

// Get certification compliance summary
router.get('/certifications/summary', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const [byType, byStatus, vendorsWithSOC2, vendorsWithHITRUST] = await Promise.all([
      prisma.certification.groupBy({
        by: ['type'],
        where: { status: CertificationStatus.VALID },
        _count: true,
      }),
      prisma.certification.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.vendor.count({
        where: {
          certifications: {
            some: {
              type: { in: ['SOC_2_TYPE_1', 'SOC_2_TYPE_2'] },
              status: CertificationStatus.VALID,
            },
          },
        },
      }),
      prisma.vendor.count({
        where: {
          certifications: {
            some: {
              type: 'HITRUST',
              status: CertificationStatus.VALID,
            },
          },
        },
      }),
    ]);

    res.json({
      data: {
        validByType: Object.fromEntries(byType.map((t) => [t.type, t._count])),
        byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
        vendorsWithSOC2,
        vendorsWithHITRUST,
      },
    });
  } catch (error) {
    console.error('Error getting certification summary:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get summary' });
  }
});

// Create a certification
router.post('/certifications', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const validatedData = createCertificationSchema.parse(req.body);

    const certification = await prisma.certification.create({
      data: {
        vendorId: validatedData.vendorId,
        type: validatedData.type,
        name: validatedData.name,
        issuingBody: validatedData.issuingBody,
        certificationNumber: validatedData.certificationNumber,
        scope: validatedData.scope,
        issueDate: validatedData.issueDate ? new Date(validatedData.issueDate) : undefined,
        expirationDate: validatedData.expirationDate ? new Date(validatedData.expirationDate) : undefined,
        documentUrl: validatedData.documentUrl,
        notes: validatedData.notes,
        status: CertificationStatus.PENDING,
      },
    });

    await createAuditLog(req, {
      vendorId: validatedData.vendorId,
      action: 'CERTIFICATION_CREATED',
      entityType: 'Certification',
      entityId: certification.id,
      newValues: validatedData,
    });

    res.status(201).json({ data: certification, message: 'Certification created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating certification:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create certification' });
  }
});

// Update a certification
router.put('/certifications/:id', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateCertificationSchema.parse(req.body);

    const existingCertification = await prisma.certification.findUnique({ where: { id } });
    if (!existingCertification) {
      res.status(404).json({ error: 'Not Found', message: 'Certification not found' });
      return;
    }

    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.issueDate) updateData.issueDate = new Date(validatedData.issueDate);
    if (validatedData.expirationDate) updateData.expirationDate = new Date(validatedData.expirationDate);

    // If verifying, set verified date
    if (validatedData.verified && !existingCertification.verified) {
      updateData.verifiedDate = new Date();
      updateData.verifiedBy = req.user!.id;
      updateData.status = CertificationStatus.VALID;
    }

    const certification = await prisma.certification.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.certification.update>[0]['data'],
    });

    await createAuditLog(req, {
      vendorId: existingCertification.vendorId,
      action: 'CERTIFICATION_UPDATED',
      entityType: 'Certification',
      entityId: id,
      oldValues: existingCertification as unknown as Record<string, unknown>,
      newValues: validatedData,
    });

    res.json({ data: certification, message: 'Certification updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating certification:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update certification' });
  }
});

// Verify a certification
router.post('/certifications/:id/verify', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = z.object({ notes: z.string().max(2000).optional() }).parse(req.body);

    const existingCertification = await prisma.certification.findUnique({ where: { id } });
    if (!existingCertification) {
      res.status(404).json({ error: 'Not Found', message: 'Certification not found' });
      return;
    }

    const certification = await prisma.certification.update({
      where: { id },
      data: {
        verified: true,
        verifiedDate: new Date(),
        verifiedBy: req.user!.id,
        status: CertificationStatus.VALID,
        notes: notes ? `${existingCertification.notes || ''}\n\nVerification notes: ${notes}` : existingCertification.notes,
      },
    });

    await createAuditLog(req, {
      vendorId: existingCertification.vendorId,
      action: 'CERTIFICATION_VERIFIED',
      entityType: 'Certification',
      entityId: id,
      newValues: { verified: true, verifiedBy: req.user!.id },
    });

    res.json({ data: certification, message: 'Certification verified successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error verifying certification:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to verify certification' });
  }
});

// Check for expired certifications and update status
router.post('/certifications/check-expiration', requireUser, requireRole('admin'), async (req: UserRequest, res: Response) => {
  try {
    const result = await prisma.certification.updateMany({
      where: {
        status: CertificationStatus.VALID,
        expirationDate: {
          lt: new Date(),
        },
      },
      data: {
        status: CertificationStatus.EXPIRED,
      },
    });

    await createAuditLog(req, {
      action: 'CERTIFICATIONS_EXPIRATION_CHECK',
      entityType: 'Certification',
      metadata: { expiredCount: result.count },
    });

    res.json({
      data: { expiredCount: result.count },
      message: `Updated ${result.count} expired certifications`,
    });
  } catch (error) {
    console.error('Error checking certification expiration:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to check expiration' });
  }
});

// List remediation tasks
router.get('/remediations', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const validatedQuery = z.object({
      vendorId: z.string().uuid().optional(),
      status: z.nativeEnum(TaskStatus).optional(),
      priority: z.nativeEnum(TaskPriority).optional(),
      type: z.nativeEnum(RemediationType).optional(),
      overdue: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
      limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
      offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
    }).parse(req.query);

    const where: Record<string, unknown> = {};
    if (validatedQuery.vendorId) where.vendorId = validatedQuery.vendorId;
    if (validatedQuery.status) where.status = validatedQuery.status;
    if (validatedQuery.priority) where.priority = validatedQuery.priority;
    if (validatedQuery.type) where.type = validatedQuery.type;
    if (validatedQuery.overdue) {
      where.dueDate = { lt: new Date() };
      where.status = { notIn: ['COMPLETED', 'CANCELLED'] };
    }

    const [remediations, total] = await Promise.all([
      prisma.remediationTask.findMany({
        where: where as Parameters<typeof prisma.remediationTask.findMany>[0]['where'],
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
            },
          },
          incident: {
            select: {
              id: true,
              title: true,
              severity: true,
            },
          },
        },
        orderBy: [
          { priority: 'asc' },
          { dueDate: 'asc' },
        ],
        take: validatedQuery.limit || 50,
        skip: validatedQuery.offset || 0,
      }),
      prisma.remediationTask.count({ where: where as Parameters<typeof prisma.remediationTask.count>[0]['where'] }),
    ]);

    res.json({
      data: remediations,
      total,
      limit: validatedQuery.limit || 50,
      offset: validatedQuery.offset || 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error listing remediations:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to list remediations' });
  }
});

// Get remediation summary
router.get('/remediations/summary', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const [byStatus, byPriority, byType, overdueCount] = await Promise.all([
      prisma.remediationTask.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.remediationTask.groupBy({
        by: ['priority'],
        where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } },
        _count: true,
      }),
      prisma.remediationTask.groupBy({
        by: ['type'],
        where: { status: { notIn: ['COMPLETED', 'CANCELLED'] } },
        _count: true,
      }),
      prisma.remediationTask.count({
        where: {
          dueDate: { lt: new Date() },
          status: { notIn: ['COMPLETED', 'CANCELLED'] },
        },
      }),
    ]);

    res.json({
      data: {
        byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
        openByPriority: Object.fromEntries(byPriority.map((p) => [p.priority, p._count])),
        openByType: Object.fromEntries(byType.map((t) => [t.type, t._count])),
        overdueCount,
      },
    });
  } catch (error) {
    console.error('Error getting remediation summary:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get summary' });
  }
});

// Create a standalone remediation task (not linked to incident)
router.post('/remediations', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager'), async (req: UserRequest, res: Response) => {
  try {
    const validatedData = createRemediationSchema.parse(req.body);

    const remediation = await prisma.remediationTask.create({
      data: {
        vendorId: validatedData.vendorId,
        type: validatedData.type,
        priority: validatedData.priority,
        title: validatedData.title,
        description: validatedData.description,
        requirement: validatedData.requirement,
        controlReference: validatedData.controlReference,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        assignedTo: validatedData.assignedTo,
        assignedToEmail: validatedData.assignedToEmail,
        createdBy: req.user!.id,
      },
    });

    await createAuditLog(req, {
      vendorId: validatedData.vendorId,
      action: 'REMEDIATION_CREATED',
      entityType: 'RemediationTask',
      entityId: remediation.id,
      newValues: validatedData,
    });

    res.status(201).json({ data: remediation, message: 'Remediation task created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating remediation:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create remediation' });
  }
});

// Get audit logs
router.get('/audit-logs', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const validatedQuery = z.object({
      vendorId: z.string().uuid().optional(),
      entityType: z.string().optional(),
      action: z.string().optional(),
      userId: z.string().optional(),
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      limit: z.string().transform(Number).pipe(z.number().min(1).max(500)).optional(),
      offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
    }).parse(req.query);

    const where: Record<string, unknown> = {};
    if (validatedQuery.vendorId) where.vendorId = validatedQuery.vendorId;
    if (validatedQuery.entityType) where.entityType = validatedQuery.entityType;
    if (validatedQuery.action) where.action = { contains: validatedQuery.action };
    if (validatedQuery.userId) where.userId = validatedQuery.userId;
    if (validatedQuery.startDate || validatedQuery.endDate) {
      where.createdAt = {};
      if (validatedQuery.startDate) (where.createdAt as Record<string, Date>).gte = new Date(validatedQuery.startDate);
      if (validatedQuery.endDate) (where.createdAt as Record<string, Date>).lte = new Date(validatedQuery.endDate);
    }

    const [logs, total] = await Promise.all([
      prisma.vendorAuditLog.findMany({
        where: where as Parameters<typeof prisma.vendorAuditLog.findMany>[0]['where'],
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: validatedQuery.limit || 100,
        skip: validatedQuery.offset || 0,
      }),
      prisma.vendorAuditLog.count({ where: where as Parameters<typeof prisma.vendorAuditLog.count>[0]['where'] }),
    ]);

    res.json({
      data: logs,
      total,
      limit: validatedQuery.limit || 100,
      offset: validatedQuery.offset || 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error getting audit logs:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get audit logs' });
  }
});

// Get risk dashboard data
router.get('/dashboard', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const [
      vendorStats,
      openIncidents,
      expiringContracts,
      expiringCertifications,
      overdueRemediations,
      recentAuditLogs,
    ] = await Promise.all([
      // Vendor statistics
      prisma.vendor.groupBy({
        by: ['riskLevel'],
        where: { status: { in: ['APPROVED', 'CONDITIONAL'] } },
        _count: true,
      }),
      // Open incidents by severity
      prisma.incident.groupBy({
        by: ['severity'],
        where: { status: { notIn: ['CLOSED', 'REMEDIATED'] } },
        _count: true,
      }),
      // Contracts expiring in next 60 days
      prisma.contract.count({
        where: {
          status: 'ACTIVE',
          expirationDate: {
            gte: new Date(),
            lte: addDays(new Date(), 60),
          },
        },
      }),
      // Certifications expiring in next 90 days
      prisma.certification.count({
        where: {
          status: 'VALID',
          expirationDate: {
            gte: new Date(),
            lte: addDays(new Date(), 90),
          },
        },
      }),
      // Overdue remediations
      prisma.remediationTask.count({
        where: {
          dueDate: { lt: new Date() },
          status: { notIn: ['COMPLETED', 'CANCELLED'] },
        },
      }),
      // Recent audit activity
      prisma.vendorAuditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          action: true,
          entityType: true,
          userEmail: true,
          createdAt: true,
          vendor: {
            select: { name: true },
          },
        },
      }),
    ]);

    res.json({
      data: {
        vendorsByRiskLevel: Object.fromEntries(vendorStats.map((v) => [v.riskLevel, v._count])),
        openIncidentsBySeverity: Object.fromEntries(openIncidents.map((i) => [i.severity, i._count])),
        expiringContractsCount: expiringContracts,
        expiringCertificationsCount: expiringCertifications,
        overdueRemediationsCount: overdueRemediations,
        recentActivity: recentAuditLogs,
      },
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get dashboard' });
  }
});

export default router;
