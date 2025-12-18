import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router = Router();
const prisma = new PrismaClient();

// Create visit from appointment
router.post('/:appointmentId', requireUser, async (req: UserRequest, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Verify appointment exists and user has access
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { visit: true },
    });

    if (!appointment) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Appointment not found',
      });
      return;
    }

    // Check permissions
    const hasAccess =
      (userRole === 'patient' && appointment.patientId === userId) ||
      (userRole === 'provider' && appointment.providerId === userId);

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    // Check if visit already exists
    if (appointment.visit) {
      res.json({
        data: appointment.visit,
        message: 'Visit already exists',
      });
      return;
    }

    // Create visit
    const visit = await prisma.visit.create({
      data: {
        appointmentId,
        sessionToken: uuidv4(),
        roomId: `room-${uuidv4()}`,
        status: 'waiting',
        iceServers: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      },
    });

    // Update appointment status
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'in_progress' },
    });

    res.status(201).json({
      data: visit,
      message: 'Visit created successfully',
    });
  } catch (error) {
    console.error('Error creating visit:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create visit',
    });
  }
});

// Get visit details
router.get('/:visitId', requireUser, async (req: UserRequest, res) => {
  try {
    const { visitId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        appointment: true,
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!visit) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Visit not found',
      });
      return;
    }

    // Check permissions
    const hasAccess =
      (userRole === 'patient' && visit.appointment.patientId === userId) ||
      (userRole === 'provider' && visit.appointment.providerId === userId);

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    res.json({ data: visit });
  } catch (error) {
    console.error('Error fetching visit:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch visit',
    });
  }
});

// Start visit
router.post('/:visitId/start', requireUser, async (req: UserRequest, res) => {
  try {
    const { visitId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: { appointment: true },
    });

    if (!visit) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Visit not found',
      });
      return;
    }

    // Only provider can start visit
    if (userRole !== 'provider' || visit.appointment.providerId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only the assigned provider can start the visit',
      });
      return;
    }

    const updated = await prisma.visit.update({
      where: { id: visitId },
      data: {
        status: 'in_progress',
        startedAt: new Date(),
      },
    });

    res.json({
      data: updated,
      message: 'Visit started successfully',
    });
  } catch (error) {
    console.error('Error starting visit:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to start visit',
    });
  }
});

// End visit
router.post('/:visitId/end', requireUser, async (req: UserRequest, res) => {
  try {
    const { visitId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: { appointment: true },
    });

    if (!visit) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Visit not found',
      });
      return;
    }

    // Only provider can end visit
    if (userRole !== 'provider' || visit.appointment.providerId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only the assigned provider can end the visit',
      });
      return;
    }

    const updated = await prisma.visit.update({
      where: { id: visitId },
      data: {
        status: 'completed',
        endedAt: new Date(),
      },
    });

    // Update appointment status
    await prisma.appointment.update({
      where: { id: visit.appointmentId },
      data: { status: 'completed' },
    });

    res.json({
      data: updated,
      message: 'Visit ended successfully',
    });
  } catch (error) {
    console.error('Error ending visit:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to end visit',
    });
  }
});

// Send chat message
router.post('/:visitId/messages', requireUser, async (req: UserRequest, res) => {
  try {
    const { visitId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const messageSchema = z.object({
      message: z.string().min(1).max(5000),
      attachments: z.array(z.string().url()).optional(),
    });

    const validatedData = messageSchema.parse(req.body);

    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: { appointment: true },
    });

    if (!visit) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Visit not found',
      });
      return;
    }

    // Check permissions
    const hasAccess =
      (userRole === 'patient' && visit.appointment.patientId === userId) ||
      (userRole === 'provider' && visit.appointment.providerId === userId);

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const message = await prisma.chatMessage.create({
      data: {
        visitId,
        senderId: userId,
        senderRole: userRole,
        message: validatedData.message,
        attachments: validatedData.attachments || [],
      },
    });

    res.status(201).json({
      data: message,
      message: 'Message sent successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error sending message:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to send message',
    });
  }
});

// Get visit messages
router.get('/:visitId/messages', requireUser, async (req: UserRequest, res) => {
  try {
    const { visitId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: { appointment: true },
    });

    if (!visit) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Visit not found',
      });
      return;
    }

    // Check permissions
    const hasAccess =
      (userRole === 'patient' && visit.appointment.patientId === userId) ||
      (userRole === 'provider' && visit.appointment.providerId === userId);

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const messages = await prisma.chatMessage.findMany({
      where: { visitId },
      orderBy: { timestamp: 'asc' },
    });

    res.json({
      data: messages,
      count: messages.length,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch messages',
    });
  }
});

export default router;
