import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser, requireCaregiver } from '../middleware/extractUser';
import visitService from '../services/visit.service';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createVisitSchema = z.object({
  patientId: z.string().uuid(),
  patientHomeId: z.string().uuid(),
  caregiverId: z.string().uuid(),
  scheduledDate: z.string().datetime(),
  scheduledStartTime: z.string().regex(/^\d{2}:\d{2}$/),
  scheduledEndTime: z.string().regex(/^\d{2}:\d{2}$/),
  estimatedDuration: z.number().min(15).max(480),
  visitType: z.enum([
    'skilled_nursing', 'physical_therapy', 'occupational_therapy', 'speech_therapy',
    'home_health_aide', 'medical_social_services', 'wound_care', 'medication_management',
    'post_surgical', 'chronic_care', 'palliative', 'hospice', 'pediatric', 'assessment', 'other'
  ]),
  priority: z.enum(['routine', 'urgent', 'emergency', 'prn']).optional(),
  reasonForVisit: z.string().optional(),
  tasks: z.array(z.object({
    taskType: z.string(),
    title: z.string(),
    description: z.string().optional(),
    isRequired: z.boolean().optional(),
    sequence: z.number().optional(),
    vitalType: z.string().optional(),
  })).optional(),
});

const updateVisitSchema = z.object({
  scheduledDate: z.string().datetime().optional(),
  scheduledStartTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  scheduledEndTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  caregiverId: z.string().uuid().optional(),
  status: z.enum([
    'scheduled', 'confirmed', 'en_route', 'arrived', 'in_progress',
    'completed', 'cancelled', 'no_show', 'rescheduled'
  ]).optional(),
  priority: z.enum(['routine', 'urgent', 'emergency', 'prn']).optional(),
  reasonForVisit: z.string().optional(),
  clinicalNotes: z.string().optional(),
  patientCondition: z.string().optional(),
  followUpRequired: z.boolean().optional(),
  followUpNotes: z.string().optional(),
});

const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const completeVisitSchema = z.object({
  location: locationSchema,
  clinicalNotes: z.string().optional(),
  patientCondition: z.string().optional(),
  followUpRequired: z.boolean().optional(),
  followUpNotes: z.string().optional(),
  caregiverSignature: z.string().optional(),
  patientSignature: z.string().optional(),
});

// Get all visits (with filters)
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId, caregiverId, status, startDate, endDate, limit, offset } = req.query;
    const userRole = req.user!.role;
    const userId = req.user!.id;

    const where: any = {};

    // Role-based filtering
    if (userRole === 'patient') {
      where.patientId = userId;
    } else if (userRole === 'caregiver' || userRole === 'nurse') {
      // Get caregiver ID from user ID
      const caregiver = await prisma.caregiver.findUnique({ where: { userId } });
      if (caregiver) {
        where.caregiverId = caregiver.id;
      }
    }

    // Additional filters
    if (patientId) where.patientId = patientId;
    if (caregiverId) where.caregiverId = caregiverId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.scheduledDate = {};
      if (startDate) where.scheduledDate.gte = new Date(startDate as string);
      if (endDate) where.scheduledDate.lte = new Date(endDate as string);
    }

    const visits = await prisma.homeVisit.findMany({
      where,
      include: {
        caregiver: { select: { id: true, firstName: true, lastName: true, phone: true } },
        patientHome: { select: { id: true, address: true, city: true, state: true } },
        tasks: { orderBy: { sequence: 'asc' } },
      },
      orderBy: [{ scheduledDate: 'desc' }, { scheduledStartTime: 'asc' }],
      take: limit ? parseInt(limit as string) : 50,
      skip: offset ? parseInt(offset as string) : 0,
    });

    const total = await prisma.homeVisit.count({ where });

    res.json({ data: visits, total, limit: limit || 50, offset: offset || 0 });
  } catch (error) {
    console.error('Error fetching visits:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch visits' });
  }
});

// Get today's visits for current caregiver
router.get('/today', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const caregiver = await prisma.caregiver.findUnique({ where: { userId } });

    if (!caregiver) {
      res.status(404).json({ error: 'Not Found', message: 'Caregiver profile not found' });
      return;
    }

    const visits = await visitService.getTodaysVisits(caregiver.id);
    res.json({ data: visits, count: visits.length });
  } catch (error) {
    console.error('Error fetching today\'s visits:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch today\'s visits' });
  }
});

// Get visit by ID
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const visit = await visitService.getVisitById(req.params.id);

    if (!visit) {
      res.status(404).json({ error: 'Not Found', message: 'Visit not found' });
      return;
    }

    res.json({ data: visit });
  } catch (error) {
    console.error('Error fetching visit:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch visit' });
  }
});

// Create new visit
router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = createVisitSchema.parse(req.body);

    const visit = await visitService.createVisit({
      ...validatedData,
      scheduledDate: new Date(validatedData.scheduledDate),
    } as any);

    res.status(201).json({ data: visit, message: 'Visit created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating visit:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create visit' });
  }
});

// Update visit
router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = updateVisitSchema.parse(req.body);

    const updateData: any = { ...validatedData };
    if (validatedData.scheduledDate) {
      updateData.scheduledDate = new Date(validatedData.scheduledDate);
    }

    const visit = await visitService.updateVisit(req.params.id, updateData);
    res.json({ data: visit, message: 'Visit updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating visit:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update visit' });
  }
});

// Start visit (clock in)
router.post('/:id/start', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const validatedData = locationSchema.parse(req.body);
    const visit = await visitService.startVisit(req.params.id, validatedData as any);
    res.json({ data: visit, message: 'Visit started successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error starting visit:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to start visit' });
  }
});

// Complete visit (clock out)
router.post('/:id/complete', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const validatedData = completeVisitSchema.parse(req.body);
    const visit = await visitService.completeVisit(req.params.id, validatedData as any);
    res.json({ data: visit, message: 'Visit completed successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error completing visit:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to complete visit' });
  }
});

// Cancel visit
router.post('/:id/cancel', requireUser, async (req: UserRequest, res) => {
  try {
    const { reason } = req.body;
    const visit = await visitService.cancelVisit(req.params.id, reason);
    res.json({ data: visit, message: 'Visit cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling visit:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to cancel visit' });
  }
});

// Reschedule visit
router.post('/:id/reschedule', requireUser, async (req: UserRequest, res) => {
  try {
    const { newDate, newStartTime, newEndTime } = req.body;

    if (!newDate || !newStartTime || !newEndTime) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'newDate, newStartTime, and newEndTime are required',
      });
      return;
    }

    const visit = await visitService.rescheduleVisit(
      req.params.id,
      new Date(newDate),
      newStartTime,
      newEndTime
    );

    res.json({ data: visit, message: 'Visit rescheduled successfully' });
  } catch (error) {
    console.error('Error rescheduling visit:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to reschedule visit' });
  }
});

// Get visit tasks
router.get('/:id/tasks', requireUser, async (req: UserRequest, res) => {
  try {
    const tasks = await visitService.getVisitTasks(req.params.id);
    res.json({ data: tasks, count: tasks.length });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch tasks' });
  }
});

// Add task to visit
router.post('/:id/tasks', requireUser, async (req: UserRequest, res) => {
  try {
    const task = await visitService.addVisitTask(req.params.id, req.body);
    res.status(201).json({ data: task, message: 'Task added successfully' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to add task' });
  }
});

// Update task status
router.patch('/:visitId/tasks/:taskId', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const { status, notes, vitalValue, vitalUnit } = req.body;
    const userId = req.user!.id;

    const task = await visitService.updateTaskStatus(req.params.taskId, status, {
      notes,
      completedBy: userId,
      vitalValue,
      vitalUnit,
    });

    res.json({ data: task, message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update task' });
  }
});

// Get visit statistics
router.get('/stats/:caregiverId', requireUser, async (req: UserRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().setDate(1));
    const end = endDate ? new Date(endDate as string) : new Date();

    const stats = await visitService.getVisitStats(req.params.caregiverId, start, end);
    res.json({ data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch statistics' });
  }
});

// Report incident during visit
router.post('/:id/incidents', requireUser, async (req: UserRequest, res) => {
  try {
    const visit = await prisma.homeVisit.findUnique({ where: { id: req.params.id } });

    if (!visit) {
      res.status(404).json({ error: 'Not Found', message: 'Visit not found' });
      return;
    }

    const incident = await prisma.incident.create({
      data: {
        visitId: req.params.id,
        patientId: visit.patientId,
        caregiverId: visit.caregiverId,
        incidentType: req.body.incidentType,
        severity: req.body.severity,
        occurredAt: new Date(req.body.occurredAt || new Date()),
        location: req.body.location,
        description: req.body.description,
        immediateAction: req.body.immediateAction,
        witnessNames: req.body.witnessNames,
        fallType: req.body.fallType,
        injuryOccurred: req.body.injuryOccurred || false,
        injuryDescription: req.body.injuryDescription,
        medicalAttentionRequired: req.body.medicalAttentionRequired || false,
        emergencyServicesNotified: req.body.emergencyServicesNotified || false,
      },
    });

    res.status(201).json({ data: incident, message: 'Incident reported successfully' });
  } catch (error) {
    console.error('Error reporting incident:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to report incident' });
  }
});

// Record medication administration
router.post('/:id/medications', requireUser, requireCaregiver, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;

    const medication = await prisma.medicationAdministration.create({
      data: {
        visitId: req.params.id,
        medicationName: req.body.medicationName,
        dosage: req.body.dosage,
        route: req.body.route,
        scheduledTime: new Date(req.body.scheduledTime),
        administeredTime: req.body.administeredTime ? new Date(req.body.administeredTime) : null,
        status: req.body.status || 'pending',
        refusedReason: req.body.refusedReason,
        notes: req.body.notes,
        administeredBy: userId,
        witnessedBy: req.body.witnessedBy,
        medicationBarcode: req.body.medicationBarcode,
        patientBarcode: req.body.patientBarcode,
      },
    });

    res.status(201).json({ data: medication, message: 'Medication recorded successfully' });
  } catch (error) {
    console.error('Error recording medication:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to record medication' });
  }
});

export default router;
