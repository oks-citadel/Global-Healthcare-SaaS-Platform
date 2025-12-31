import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient, IncidentType, IncidentSeverity, IncidentStatus, TaskPriority, TaskStatus, RemediationType } from '../generated/client';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import { createAuditLog } from '../middleware/auditLogger';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createIncidentSchema = z.object({
  vendorId: z.string().uuid(),
  type: z.nativeEnum(IncidentType),
  severity: z.nativeEnum(IncidentSeverity),
  title: z.string().min(1).max(500),
  description: z.string().min(1).max(10000),
  discoveredAt: z.string().datetime(),
  affectedSystems: z.array(z.string()).optional(),
  affectedDataTypes: z.array(z.string()).optional(),
  recordsAffected: z.number().min(0).optional(),
  phiInvolved: z.boolean().optional(),
  piiInvolved: z.boolean().optional(),
  immediateActions: z.string().max(5000).optional(),
  notificationRequired: z.boolean().optional(),
});

const updateIncidentSchema = z.object({
  type: z.nativeEnum(IncidentType).optional(),
  severity: z.nativeEnum(IncidentSeverity).optional(),
  status: z.nativeEnum(IncidentStatus).optional(),
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(10000).optional(),
  affectedSystems: z.array(z.string()).optional(),
  affectedDataTypes: z.array(z.string()).optional(),
  recordsAffected: z.number().min(0).optional(),
  phiInvolved: z.boolean().optional(),
  piiInvolved: z.boolean().optional(),
  rootCause: z.string().max(5000).optional(),
  immediateActions: z.string().max(5000).optional(),
  correctiveActions: z.string().max(5000).optional(),
  preventiveActions: z.string().max(5000).optional(),
  notificationRequired: z.boolean().optional(),
  notifiedParties: z.array(z.string()).optional(),
  notificationDate: z.string().datetime().optional(),
  regulatoryReportRequired: z.boolean().optional(),
  regulatoryReportDate: z.string().datetime().optional(),
  lessonLearned: z.string().max(5000).optional(),
});

const listIncidentsSchema = z.object({
  vendorId: z.string().uuid().optional(),
  type: z.nativeEnum(IncidentType).optional(),
  severity: z.nativeEnum(IncidentSeverity).optional(),
  status: z.nativeEnum(IncidentStatus).optional(),
  phiInvolved: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
});

const createRemediationSchema = z.object({
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

const updateRemediationSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  title: z.string().max(500).optional(),
  description: z.string().max(5000).optional(),
  dueDate: z.string().datetime().optional(),
  assignedTo: z.string().max(255).optional(),
  assignedToEmail: z.string().email().optional(),
  evidence: z.record(z.unknown()).optional(),
  notes: z.string().max(5000).optional(),
});

// List incidents
router.get('/', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const validatedQuery = listIncidentsSchema.parse(req.query);

    const where: Record<string, unknown> = {};
    if (validatedQuery.vendorId) where.vendorId = validatedQuery.vendorId;
    if (validatedQuery.type) where.type = validatedQuery.type;
    if (validatedQuery.severity) where.severity = validatedQuery.severity;
    if (validatedQuery.status) where.status = validatedQuery.status;
    if (validatedQuery.phiInvolved !== undefined) where.phiInvolved = validatedQuery.phiInvolved;

    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({
        where: where as Parameters<typeof prisma.incident.findMany>[0]['where'],
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { remediations: true },
          },
        },
        orderBy: [
          { severity: 'asc' }, // Critical first
          { createdAt: 'desc' },
        ],
        take: validatedQuery.limit || 50,
        skip: validatedQuery.offset || 0,
      }),
      prisma.incident.count({ where: where as Parameters<typeof prisma.incident.count>[0]['where'] }),
    ]);

    res.json({
      data: incidents,
      total,
      limit: validatedQuery.limit || 50,
      offset: validatedQuery.offset || 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error listing incidents:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to list incidents' });
  }
});

// Get open incidents summary
router.get('/summary', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const [bySeverity, byStatus, byType, phiIncidents] = await Promise.all([
      prisma.incident.groupBy({
        by: ['severity'],
        where: { status: { notIn: ['CLOSED', 'REMEDIATED'] } },
        _count: true,
      }),
      prisma.incident.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.incident.groupBy({
        by: ['type'],
        where: { status: { notIn: ['CLOSED', 'REMEDIATED'] } },
        _count: true,
      }),
      prisma.incident.count({
        where: {
          phiInvolved: true,
          status: { notIn: ['CLOSED', 'REMEDIATED'] },
        },
      }),
    ]);

    res.json({
      data: {
        openBySeverity: Object.fromEntries(bySeverity.map((s) => [s.severity, s._count])),
        byStatus: Object.fromEntries(byStatus.map((s) => [s.status, s._count])),
        openByType: Object.fromEntries(byType.map((t) => [t.type, t._count])),
        openPHIIncidents: phiIncidents,
      },
    });
  } catch (error) {
    console.error('Error getting incident summary:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get summary' });
  }
});

// Get critical/high severity open incidents
router.get('/critical', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const incidents = await prisma.incident.findMany({
      where: {
        severity: { in: ['CRITICAL', 'HIGH'] },
        status: { notIn: ['CLOSED', 'REMEDIATED'] },
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            primaryContactEmail: true,
          },
        },
        remediations: {
          where: {
            status: { notIn: ['COMPLETED', 'CANCELLED'] },
          },
        },
      },
      orderBy: [
        { severity: 'asc' },
        { discoveredAt: 'asc' },
      ],
    });

    res.json({ data: incidents, count: incidents.length });
  } catch (error) {
    console.error('Error getting critical incidents:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get incidents' });
  }
});

// Get a single incident
router.get('/:id', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            category: true,
            primaryContactEmail: true,
          },
        },
        remediations: {
          orderBy: { priority: 'asc' },
        },
      },
    });

    if (!incident) {
      res.status(404).json({ error: 'Not Found', message: 'Incident not found' });
      return;
    }

    res.json({ data: incident });
  } catch (error) {
    console.error('Error getting incident:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get incident' });
  }
});

// Create a new incident
router.post('/', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager', 'security_analyst'), async (req: UserRequest, res: Response) => {
  try {
    const validatedData = createIncidentSchema.parse(req.body);

    const incident = await prisma.incident.create({
      data: {
        vendorId: validatedData.vendorId,
        type: validatedData.type,
        severity: validatedData.severity,
        title: validatedData.title,
        description: validatedData.description,
        discoveredAt: new Date(validatedData.discoveredAt),
        affectedSystems: validatedData.affectedSystems || [],
        affectedDataTypes: validatedData.affectedDataTypes || [],
        recordsAffected: validatedData.recordsAffected,
        phiInvolved: validatedData.phiInvolved || false,
        piiInvolved: validatedData.piiInvolved || false,
        immediateActions: validatedData.immediateActions,
        notificationRequired: validatedData.notificationRequired || false,
        notifiedParties: [],
        createdBy: req.user!.id,
      },
    });

    await createAuditLog(req, {
      vendorId: validatedData.vendorId,
      action: 'INCIDENT_CREATED',
      entityType: 'Incident',
      entityId: incident.id,
      newValues: validatedData,
    });

    res.status(201).json({ data: incident, message: 'Incident created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create incident' });
  }
});

// Update an incident
router.put('/:id', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager', 'security_analyst'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateIncidentSchema.parse(req.body);

    const existingIncident = await prisma.incident.findUnique({ where: { id } });
    if (!existingIncident) {
      res.status(404).json({ error: 'Not Found', message: 'Incident not found' });
      return;
    }

    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.notificationDate) updateData.notificationDate = new Date(validatedData.notificationDate);
    if (validatedData.regulatoryReportDate) updateData.regulatoryReportDate = new Date(validatedData.regulatoryReportDate);

    // If status is being set to REMEDIATED or CLOSED, set resolvedAt
    if ((validatedData.status === 'REMEDIATED' || validatedData.status === 'CLOSED') && !existingIncident.resolvedAt) {
      updateData.resolvedAt = new Date();
    }

    const incident = await prisma.incident.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.incident.update>[0]['data'],
    });

    await createAuditLog(req, {
      vendorId: existingIncident.vendorId,
      action: 'INCIDENT_UPDATED',
      entityType: 'Incident',
      entityId: id,
      oldValues: existingIncident as unknown as Record<string, unknown>,
      newValues: validatedData,
    });

    res.json({ data: incident, message: 'Incident updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating incident:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update incident' });
  }
});

// Add remediation task to incident
router.post('/:id/remediations', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = createRemediationSchema.parse(req.body);

    const existingIncident = await prisma.incident.findUnique({ where: { id } });
    if (!existingIncident) {
      res.status(404).json({ error: 'Not Found', message: 'Incident not found' });
      return;
    }

    const remediation = await prisma.remediationTask.create({
      data: {
        vendorId: existingIncident.vendorId,
        incidentId: id,
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
      vendorId: existingIncident.vendorId,
      action: 'REMEDIATION_CREATED',
      entityType: 'RemediationTask',
      entityId: remediation.id,
      newValues: validatedData,
      metadata: { incidentId: id },
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

// Get remediations for an incident
router.get('/:id/remediations', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const remediations = await prisma.remediationTask.findMany({
      where: { incidentId: id },
      orderBy: [
        { priority: 'asc' },
        { dueDate: 'asc' },
      ],
    });

    res.json({ data: remediations });
  } catch (error) {
    console.error('Error getting remediations:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get remediations' });
  }
});

// Update a remediation task
router.put('/remediations/:remediationId', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager'), async (req: UserRequest, res: Response) => {
  try {
    const { remediationId } = req.params;
    const validatedData = updateRemediationSchema.parse(req.body);

    const existingRemediation = await prisma.remediationTask.findUnique({ where: { id: remediationId } });
    if (!existingRemediation) {
      res.status(404).json({ error: 'Not Found', message: 'Remediation task not found' });
      return;
    }

    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.dueDate) updateData.dueDate = new Date(validatedData.dueDate);

    // If marking as completed, set completedDate
    if (validatedData.status === 'COMPLETED' && !existingRemediation.completedDate) {
      updateData.completedDate = new Date();
    }

    const remediation = await prisma.remediationTask.update({
      where: { id: remediationId },
      data: updateData as Parameters<typeof prisma.remediationTask.update>[0]['data'],
    });

    await createAuditLog(req, {
      vendorId: existingRemediation.vendorId,
      action: 'REMEDIATION_UPDATED',
      entityType: 'RemediationTask',
      entityId: remediationId,
      oldValues: existingRemediation as unknown as Record<string, unknown>,
      newValues: validatedData,
    });

    res.json({ data: remediation, message: 'Remediation task updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating remediation:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update remediation' });
  }
});

// Verify remediation completion
router.post('/remediations/:remediationId/verify', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const { remediationId } = req.params;
    const { notes } = z.object({ notes: z.string().max(2000).optional() }).parse(req.body);

    const existingRemediation = await prisma.remediationTask.findUnique({ where: { id: remediationId } });
    if (!existingRemediation) {
      res.status(404).json({ error: 'Not Found', message: 'Remediation task not found' });
      return;
    }

    if (existingRemediation.status !== 'PENDING_VERIFICATION') {
      res.status(400).json({ error: 'Bad Request', message: 'Remediation is not pending verification' });
      return;
    }

    const remediation = await prisma.remediationTask.update({
      where: { id: remediationId },
      data: {
        status: TaskStatus.COMPLETED,
        completedDate: new Date(),
        verifiedBy: req.user!.id,
        verifiedDate: new Date(),
        notes: notes ? `${existingRemediation.notes || ''}\n\nVerification notes: ${notes}` : existingRemediation.notes,
      },
    });

    await createAuditLog(req, {
      vendorId: existingRemediation.vendorId,
      action: 'REMEDIATION_VERIFIED',
      entityType: 'RemediationTask',
      entityId: remediationId,
      newValues: { status: TaskStatus.COMPLETED, verifiedBy: req.user!.id },
    });

    res.json({ data: remediation, message: 'Remediation verified successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error verifying remediation:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to verify remediation' });
  }
});

export default router;
