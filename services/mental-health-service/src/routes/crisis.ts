import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schema
const createCrisisSchema = z.object({
  patientId: z.string().uuid().optional(), // Optional for anonymous crisis calls
  crisisType: z.enum([
    'suicidal_ideation',
    'self_harm',
    'panic_attack',
    'psychotic_episode',
    'substance_overdose',
    'domestic_violence',
    'trauma',
    'other',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().min(10),
  interventions: z.array(z.string()).optional(),
});

const updateCrisisSchema = z.object({
  status: z.enum(['active', 'monitoring', 'resolved', 'escalated']).optional(),
  interventions: z.array(z.string()).optional(),
  outcome: z.string().optional(),
  referredTo: z.string().optional(),
  resolvedAt: z.string().datetime().optional(),
  followUpNeeded: z.boolean().optional(),
  followUpDate: z.string().datetime().optional(),
});

// Get crisis interventions
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { status, severity, patientId } = req.query;

    const where: any = {};

    // Access control
    if (userRole === 'patient') {
      where.patientId = userId;
    } else if (userRole === 'provider') {
      if (patientId) {
        where.patientId = patientId;
      }
      // Providers can see all crisis interventions they responded to
      if (req.query.myInterventions === 'true') {
        where.responderId = userId;
      }
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by severity
    if (severity) {
      where.severity = severity;
    }

    const interventions = await prisma.crisisIntervention.findMany({
      where,
      orderBy: { contactedAt: 'desc' },
    });

    res.json({
      data: interventions,
      count: interventions.length,
    });
  } catch (error) {
    console.error('Error fetching crisis interventions:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch crisis interventions',
    });
  }
});

// Get single crisis intervention
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const intervention = await prisma.crisisIntervention.findUnique({
      where: { id },
    });

    if (!intervention) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Crisis intervention not found',
      });
      return;
    }

    // Check access
    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && intervention.patientId === userId) ||
      (userRole === 'provider' &&
        (intervention.responderId === userId || !intervention.responderId));

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    res.json({ data: intervention });
  } catch (error) {
    console.error('Error fetching crisis intervention:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch crisis intervention',
    });
  }
});

// Create crisis intervention (emergency hotline)
router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const validatedData = createCrisisSchema.parse(req.body);

    // Determine patientId
    const patientId = validatedData.patientId || (userRole === 'patient' ? userId : null);

    if (!patientId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Patient ID is required',
      });
      return;
    }

    const intervention = await prisma.crisisIntervention.create({
      data: {
        patientId,
        crisisType: validatedData.crisisType,
        severity: validatedData.severity,
        description: validatedData.description,
        interventions: validatedData.interventions || [],
      },
    });

    // Send immediate alert to crisis response team (implement via notification service)
    // await notificationService.sendCrisisAlert(intervention);

    res.status(201).json({
      data: intervention,
      message: 'Crisis intervention created. Help is on the way.',
      emergencyContacts: {
        suicide_prevention: '988',
        crisis_text_line: 'Text HOME to 741741',
        emergency: '911',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error creating crisis intervention:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create crisis intervention',
    });
  }
});

// Update crisis intervention (respond/resolve)
router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can update crisis interventions
    if (userRole !== 'provider' && userRole !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only crisis responders can update interventions',
      });
      return;
    }

    const intervention = await prisma.crisisIntervention.findUnique({
      where: { id },
    });

    if (!intervention) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Crisis intervention not found',
      });
      return;
    }

    const validatedData = updateCrisisSchema.parse(req.body);

    const updated = await prisma.crisisIntervention.update({
      where: { id },
      data: {
        // Assign responder if not already assigned
        responderId: intervention.responderId || userId,
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.interventions && {
          interventions: validatedData.interventions,
        }),
        ...(validatedData.outcome !== undefined && { outcome: validatedData.outcome }),
        ...(validatedData.referredTo !== undefined && {
          referredTo: validatedData.referredTo,
        }),
        ...(validatedData.resolvedAt && {
          resolvedAt: new Date(validatedData.resolvedAt),
        }),
        ...(validatedData.followUpNeeded !== undefined && {
          followUpNeeded: validatedData.followUpNeeded,
        }),
        ...(validatedData.followUpDate && {
          followUpDate: new Date(validatedData.followUpDate),
        }),
      },
    });

    res.json({
      data: updated,
      message: 'Crisis intervention updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error updating crisis intervention:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update crisis intervention',
    });
  }
});

// Get active crisis interventions (for crisis response dashboard)
router.get('/active/dashboard', requireUser, async (req: UserRequest, res) => {
  try {
    const userRole = req.user!.role;

    // Only providers and admins can access crisis dashboard
    if (userRole !== 'provider' && userRole !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const activeInterventions = await prisma.crisisIntervention.findMany({
      where: {
        status: {
          in: ['active', 'monitoring'],
        },
      },
      orderBy: [{ severity: 'desc' }, { contactedAt: 'asc' }],
    });

    // Group by severity
    const dashboard = {
      critical: activeInterventions.filter((i) => i.severity === 'critical'),
      high: activeInterventions.filter((i) => i.severity === 'high'),
      medium: activeInterventions.filter((i) => i.severity === 'medium'),
      low: activeInterventions.filter((i) => i.severity === 'low'),
      total: activeInterventions.length,
    };

    res.json({ data: dashboard });
  } catch (error) {
    console.error('Error fetching crisis dashboard:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch crisis dashboard',
    });
  }
});

// Emergency hotline info (public endpoint)
router.get('/hotlines/info', (_req, res) => {
  res.json({
    emergency: {
      suicide_prevention: {
        name: 'National Suicide Prevention Lifeline',
        phone: '988',
        available: '24/7',
      },
      crisis_text_line: {
        name: 'Crisis Text Line',
        text: 'HOME to 741741',
        available: '24/7',
      },
      emergency_services: {
        name: 'Emergency Services',
        phone: '911',
        available: '24/7',
      },
      samhsa: {
        name: 'SAMHSA National Helpline',
        phone: '1-800-662-4357',
        available: '24/7',
        services: 'Mental health and substance abuse',
      },
    },
  });
});

export default router;
