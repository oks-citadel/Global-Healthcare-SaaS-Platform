import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/audit.service.js';
import { z } from 'zod';

/**
 * Schema for listing audit events with pagination and filters
 */
const ListEventsSchema = z.object({
  userId: z.string().uuid().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

/**
 * Type for validated list events filters
 */
type ListEventsFilters = z.infer<typeof ListEventsSchema>;

/**
 * Interface for audit event returned from the service
 * Matches AuditEvent from audit.service.ts
 */
interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

/**
 * Interface for paginated audit events response
 * The service returns { data, pagination } so we match that structure
 */
interface AuditEventsResponse {
  data: AuditEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Audit Controller
 * Handles audit log retrieval for administrative users
 */
export const auditController = {
  /**
   * GET /audit/events
   * List audit events (admin only)
   *
   * @param req - Express request with query parameters for filtering
   * @param res - Express response
   * @param next - Express next function for error handling
   */
  listEvents: async (
    req: Request,
    res: Response<AuditEventsResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsedFilters = ListEventsSchema.parse(req.query);
      // Ensure page and limit are always defined (Zod defaults apply after parse)
      const filters = {
        ...parsedFilters,
        page: parsedFilters.page ?? 1,
        limit: parsedFilters.limit ?? 50,
      };
      const result = await auditService.listEvents(filters);
      res.json(result);
    } catch (error: unknown) {
      next(error);
    }
  },
};
