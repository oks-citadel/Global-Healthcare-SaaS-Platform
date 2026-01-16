import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { prisma } from '../lib/prisma.js';

export const visitService = {
  /**
   * Start a virtual visit
   */
  async startVisit(appointmentId: string, userId: string): Promise<any> {
    const sessionToken = uuidv4();

    const visit = await prisma.visit.create({
      data: {
        appointmentId,
        sessionToken,
        status: 'in_progress',
        startedAt: new Date(),
      },
    });

    return {
      visitId: visit.id,
      sessionToken: visit.sessionToken,
      startedAt: visit.startedAt?.toISOString(),
    };
  },

  /**
   * End a virtual visit
   */
  async endVisit(visitId: string, userId: string): Promise<any> {
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      throw new NotFoundError('Visit not found');
    }

    if (visit.status !== 'in_progress') {
      throw new BadRequestError('Visit is not in progress');
    }

    const endedAt = new Date();
    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        status: 'completed',
        endedAt,
      },
    });

    const duration = visit.startedAt
      ? Math.round((endedAt.getTime() - visit.startedAt.getTime()) / 1000)
      : 0;

    return {
      visitId: updatedVisit.id,
      status: updatedVisit.status,
      startedAt: updatedVisit.startedAt?.toISOString(),
      endedAt: updatedVisit.endedAt?.toISOString(),
      duration,
    };
  },

  /**
   * Send a chat message during visit
   */
  async sendChatMessage(
    visitId: string,
    userId: string,
    message: string,
    attachments?: string[]
  ): Promise<any> {
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
    });

    if (!visit) {
      throw new NotFoundError('Visit not found');
    }

    if (visit.status !== 'in_progress') {
      throw new BadRequestError('Visit is not in progress');
    }

    const chatMessage = await prisma.chatMessage.create({
      data: {
        visitId,
        senderId: userId,
        message,
        attachments: attachments || [],
      },
    });

    return {
      id: chatMessage.id,
      visitId: chatMessage.visitId,
      senderId: chatMessage.senderId,
      message: chatMessage.message,
      attachments: chatMessage.attachments,
      timestamp: chatMessage.timestamp.toISOString(),
    };
  },
};
