import { Request, Response, NextFunction } from 'express';
import { visitService } from '../services/visit.service.js';
import { z } from 'zod';

const ChatMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  attachments: z.array(z.string().uuid()).optional(),
});

export const visitController = {
  /**
   * POST /visits/:id/start
   * Start a virtual visit session
   */
  startVisit: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const result = await visitService.startVisit(id, userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /visits/:id/end
   * End a virtual visit session
   */
  endVisit: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const result = await visitService.endVisit(id, userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /visits/:id/chat
   * Send a chat message during visit
   */
  sendChatMessage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
      const input = ChatMessageSchema.parse(req.body);

      const message = await visitService.sendChatMessage(id, userId, input.message, input.attachments);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  },
};
