import { Router, Response } from 'express';
import { PrismaClient, Prisma } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Type for Prisma where clause
type GroupSessionWhereInput = Prisma.GroupSessionWhereInput;

// Validation schemas
const createGroupSessionSchema = z.object({
  groupId: z.string().uuid(),
  sessionDate: z.string().datetime(),
  duration: z.number().min(30).max(180),
  topic: z.string(),
  description: z.string().optional(),
  objectives: z.array(z.string()),
  materials: z.record(z.any()).optional(),
});

const updateGroupSessionSchema = z.object({
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show']).optional(),
  topic: z.string().optional(),
  description: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  notes: z.string().optional(),
  materials: z.record(z.any()).optional(),
});

const recordAttendanceSchema = z.object({
  attendees: z.array(
    z.object({
      patientId: z.string().uuid(),
      attended: z.boolean(),
      participation: z.string().optional(),
    })
  ),
});

// Create group session
router.post('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can create group sessions
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can create group sessions',
      });
      return;
    }

    const validatedData = createGroupSessionSchema.parse(req.body);

    // Verify group exists
    const group = await prisma.supportGroup.findUnique({
      where: { id: validatedData.groupId },
    });

    if (!group) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Support group not found',
      });
      return;
    }

    // Verify facilitator
    if (group.facilitatorId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only the group facilitator can create sessions',
      });
      return;
    }

    const session = await prisma.groupSession.create({
      data: {
        groupId: validatedData.groupId,
        facilitatorId: userId,
        sessionDate: new Date(validatedData.sessionDate),
        duration: validatedData.duration,
        topic: validatedData.topic,
        description: validatedData.description,
        objectives: validatedData.objectives,
        materials: validatedData.materials,
        status: 'scheduled',
      },
    });

    res.status(201).json({
      data: session,
      message: 'Group session created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error creating group session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create group session',
    });
  }
});

// Get group sessions
router.get('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { groupId, status, startDate, endDate } = req.query;

    const where: GroupSessionWhereInput = {};

    // Filter by group
    if (groupId && typeof groupId === 'string') {
      where.groupId = groupId;
    }

    // Filter by facilitator if provider
    if (userRole === 'provider') {
      where.facilitatorId = userId;
    }

    // Filter by status
    if (status && typeof status === 'string') {
      where.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      where.sessionDate = {};
      if (startDate) where.sessionDate.gte = new Date(startDate as string);
      if (endDate) where.sessionDate.lte = new Date(endDate as string);
    }

    const sessions = await prisma.groupSession.findMany({
      where,
      orderBy: { sessionDate: 'desc' },
    });

    res.json({
      data: sessions,
      count: sessions.length,
    });
  } catch (error) {
    console.error('Error fetching group sessions:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch group sessions',
    });
  }
});

// Get single group session
router.get('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const session = await prisma.groupSession.findUnique({
      where: { id },
      include: {
        attendees: true,
      },
    });

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Group session not found',
      });
      return;
    }

    // Check if patient is member of the group
    if (userRole === 'patient') {
      const membership = await prisma.supportGroupMember.findFirst({
        where: {
          groupId: session.groupId,
          patientId: userId,
          status: 'active',
        },
      });

      if (!membership) {
        res.status(403).json({
          error: 'Forbidden',
          message: 'Access denied',
        });
        return;
      }
    }

    res.json({ data: session });
  } catch (error) {
    console.error('Error fetching group session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch group session',
    });
  }
});

// Update group session
router.patch('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can update sessions
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can update group sessions',
      });
      return;
    }

    const session = await prisma.groupSession.findUnique({
      where: { id },
    });

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Group session not found',
      });
      return;
    }

    // Verify facilitator
    if (session.facilitatorId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const validatedData = updateGroupSessionSchema.parse(req.body);

    const updated = await prisma.groupSession.update({
      where: { id },
      data: {
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.topic && { topic: validatedData.topic }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.objectives && { objectives: validatedData.objectives }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
        ...(validatedData.materials && { materials: validatedData.materials }),
      },
    });

    res.json({
      data: updated,
      message: 'Group session updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error updating group session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update group session',
    });
  }
});

// Record attendance
router.post('/:id/attendance', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can record attendance
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can record attendance',
      });
      return;
    }

    const session = await prisma.groupSession.findUnique({
      where: { id },
    });

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Group session not found',
      });
      return;
    }

    if (session.facilitatorId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const validatedData = recordAttendanceSchema.parse(req.body);

    // Create or update attendance records
    const attendancePromises = validatedData.attendees.map((attendee) =>
      prisma.groupSessionAttendee.upsert({
        where: {
          sessionId_patientId: {
            sessionId: id,
            patientId: attendee.patientId,
          },
        },
        update: {
          attended: attendee.attended,
          participation: attendee.participation,
        },
        create: {
          sessionId: id,
          patientId: attendee.patientId,
          attended: attendee.attended,
          participation: attendee.participation,
        },
      })
    );

    const attendance = await Promise.all(attendancePromises);

    res.json({
      data: attendance,
      message: 'Attendance recorded successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error recording attendance:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to record attendance',
    });
  }
});

// Get patient's group sessions
router.get('/patient/:patientId/sessions', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check access
    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && patientId === userId) ||
      userRole === 'provider';

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    // Get all groups the patient is a member of
    const memberships = await prisma.supportGroupMember.findMany({
      where: {
        patientId,
        status: 'active',
      },
    });

    const groupIds = memberships.map((m) => m.groupId);

    // Get sessions for those groups
    const sessions = await prisma.groupSession.findMany({
      where: {
        groupId: {
          in: groupIds,
        },
      },
      include: {
        attendees: {
          where: {
            patientId,
          },
        },
      },
      orderBy: { sessionDate: 'desc' },
    });

    res.json({
      data: sessions,
      count: sessions.length,
    });
  } catch (error) {
    console.error('Error fetching patient group sessions:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch patient group sessions',
    });
  }
});

export default router;
