// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/audit.service.js';
import { z } from 'zod';

const ListEventsSchema = z.object({
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export const auditController = {
  /**
   * GET /audit/events
   * List audit events (admin only)
   */
  listEvents: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = ListEventsSchema.parse(req.query);
      const result = await auditService.listEvents(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
