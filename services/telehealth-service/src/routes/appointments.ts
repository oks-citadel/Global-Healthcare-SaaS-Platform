import { Router, IRouter } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router: IRouter = Router();
const prisma = new PrismaClient();

// Validation schemas
const createAppointmentSchema = z.object({
  providerId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(15).max(120),
  type: z.enum(['video', 'audio', 'chat', 'in_person']),
  reasonForVisit: z.string().optional(),
  notes: z.string().optional(),
});

const updateAppointmentSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().min(15).max(120).optional(),
  status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']).optional(),
  notes: z.string().optional(),
});

// Get all appointments for current user
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const where: any = {};

    // Filter by user role
    if (userRole === 'patient') {
      where.patientId = userId;
    } else if (userRole === 'provider') {
      where.providerId = userId;
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) where.scheduledAt.gte = new Date(startDate as string);
      if (endDate) where.scheduledAt.lte = new Date(endDate as string);
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
    });

    res.json({
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch appointments',
    });
  }
});

// Get single appointment
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        visit: {
          include: {
            messages: {
              orderBy: { timestamp: 'asc' },
            },
          },
        },
      },
    });

    if (!appointment) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Appointment not found',
      });
      return;
    }

    // Check access permissions
    if (
      (userRole === 'patient' && appointment.patientId !== userId) ||
      (userRole === 'provider' && appointment.providerId !== userId)
    ) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    res.json({ data: appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch appointment',
    });
  }
});

// Create appointment
router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only patients can create appointments
    if (userRole !== 'patient') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only patients can create appointments',
      });
      return;
    }

    const validatedData = createAppointmentSchema.parse(req.body);

    const appointment = await prisma.appointment.create({
      data: {
        patientId: userId,
        providerId: validatedData.providerId,
        scheduledAt: new Date(validatedData.scheduledAt),
        duration: validatedData.duration,
        type: validatedData.type,
        reasonForVisit: validatedData.reasonForVisit,
        notes: validatedData.notes,
      },
    });

    res.status(201).json({
      data: appointment,
      message: 'Appointment created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error creating appointment:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create appointment',
    });
  }
});

// Update appointment
router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Appointment not found',
      });
      return;
    }

    // Check permissions
    const canUpdate =
      (userRole === 'patient' && appointment.patientId === userId) ||
      (userRole === 'provider' && appointment.providerId === userId);

    if (!canUpdate) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const validatedData = updateAppointmentSchema.parse(req.body);

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(validatedData.scheduledAt && {
          scheduledAt: new Date(validatedData.scheduledAt),
        }),
        ...(validatedData.duration && { duration: validatedData.duration }),
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
      },
    });

    res.json({
      data: updated,
      message: 'Appointment updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error updating appointment:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update appointment',
    });
  }
});

// Cancel appointment
router.delete('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Appointment not found',
      });
      return;
    }

    // Check permissions
    const canCancel =
      (userRole === 'patient' && appointment.patientId === userId) ||
      (userRole === 'provider' && appointment.providerId === userId);

    if (!canCancel) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    res.json({
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to cancel appointment',
    });
  }
});

export default router;
