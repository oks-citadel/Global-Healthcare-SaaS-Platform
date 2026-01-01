import { Router, Response } from 'express';
import { PrismaClient, Prisma } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Type for Prisma where clause
type TherapySessionWhereInput = Prisma.TherapySessionWhereInput;

// Validation schemas
const createSessionSchema = z.object({
  therapistId: z.string().uuid(),
  sessionType: z.enum(['individual', 'group', 'couples', 'family']),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(30).max(180),
  modality: z.string().optional(),
  notes: z.string().optional(),
});

const updateSessionSchema = z.object({
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show']).optional(),
  actualStartTime: z.string().datetime().optional(),
  actualEndTime: z.string().datetime().optional(),
  notes: z.string().optional(),
  homework: z.string().optional(),
  nextSessionDate: z.string().datetime().optional(),
});

// Get therapy sessions
router.get('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { status, startDate, endDate } = req.query;

    const where: TherapySessionWhereInput = {};

    // Filter by role
    if (userRole === 'patient') {
      where.patientId = userId;
    } else if (userRole === 'provider') {
      where.therapistId = userId;
    }

    // Filter by status
    if (status && typeof status === 'string') {
      where.status = status as any;
    }

    // Filter by date range
    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) where.scheduledAt.gte = new Date(startDate as string);
      if (endDate) where.scheduledAt.lte = new Date(endDate as string);
    }

    const sessions = await prisma.therapySession.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
    });

    res.json({
      data: sessions,
      count: sessions.length,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch sessions',
    });
  }
});

// Get single session
router.get('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const session = await prisma.therapySession.findUnique({
      where: { id },
    });

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
      return;
    }

    // Check access
    const hasAccess =
      (userRole === 'patient' && session.patientId === userId) ||
      (userRole === 'provider' && session.therapistId === userId);

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    res.json({ data: session });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch session',
    });
  }
});

// Create session
router.post('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only patients can create sessions
    if (userRole !== 'patient') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only patients can create therapy sessions',
      });
      return;
    }

    const validatedData = createSessionSchema.parse(req.body);

    const session = await prisma.therapySession.create({
      data: {
        patientId: userId,
        therapistId: validatedData.therapistId,
        sessionType: validatedData.sessionType,
        scheduledAt: new Date(validatedData.scheduledAt),
        duration: validatedData.duration,
        modality: validatedData.modality,
        notes: validatedData.notes,
      },
    });

    res.status(201).json({
      data: session,
      message: 'Session created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error creating session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create session',
    });
  }
});

// Update session
router.patch('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const session = await prisma.therapySession.findUnique({
      where: { id },
    });

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
      return;
    }

    // Check permissions
    const canUpdate =
      (userRole === 'patient' && session.patientId === userId) ||
      (userRole === 'provider' && session.therapistId === userId);

    if (!canUpdate) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const validatedData = updateSessionSchema.parse(req.body);

    const updated = await prisma.therapySession.update({
      where: { id },
      data: {
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.actualStartTime && {
          actualStartTime: new Date(validatedData.actualStartTime),
        }),
        ...(validatedData.actualEndTime && {
          actualEndTime: new Date(validatedData.actualEndTime),
        }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
        ...(validatedData.homework !== undefined && { homework: validatedData.homework }),
        ...(validatedData.nextSessionDate && {
          nextSessionDate: new Date(validatedData.nextSessionDate),
        }),
      },
    });

    res.json({
      data: updated,
      message: 'Session updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error updating session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update session',
    });
  }
});

// Cancel session
router.delete('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const session = await prisma.therapySession.findUnique({
      where: { id },
    });

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
      return;
    }

    // Check permissions
    const canCancel =
      (userRole === 'patient' && session.patientId === userId) ||
      (userRole === 'provider' && session.therapistId === userId);

    if (!canCancel) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    await prisma.therapySession.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    res.json({
      message: 'Session cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to cancel session',
    });
  }
});

export default router;
