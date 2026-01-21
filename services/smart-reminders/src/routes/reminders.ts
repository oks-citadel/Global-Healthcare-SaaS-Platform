/**
 * Reminders Routes
 * CRUD operations for reminder preferences and configurations
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  ReminderConfigSchema,
  CreateReminderConfigSchema,
  UpdateReminderConfigSchema,
  ReminderPreferencesSchema,
  ReminderConfig,
  ReminderPreferences,
} from '../models/ReminderConfig.js';
import { logger } from '../utils/logger.js';

const router: Router = Router();

// In-memory storage (replace with database in production)
const reminders: Map<string, ReminderConfig> = new Map();
const userPreferences: Map<string, ReminderPreferences> = new Map();

// Error class for API errors
class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Validation middleware
const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Validation error',
            details: error.errors,
          },
        });
        return;
      }
      next(error);
    }
  };
};

// Get user from request (mock - would come from auth middleware)
const getUserId = (req: Request): string => {
  return req.headers['x-user-id'] as string || 'default-user';
};

// ===================
// REMINDER CRUD ROUTES
// ===================

/**
 * GET /reminders
 * Get all reminders for the authenticated user
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { category, isActive, limit = '50', offset = '0' } = req.query;

    logger.info(`Fetching reminders for user ${userId}`, { category, isActive });

    let userReminders = Array.from(reminders.values()).filter(
      (r) => r.userId === userId
    );

    // Apply filters
    if (category) {
      userReminders = userReminders.filter((r) => r.category === category);
    }

    if (isActive !== undefined) {
      const active = isActive === 'true';
      userReminders = userReminders.filter((r) => r.isActive === active);
    }

    // Sort by next scheduled time
    userReminders.sort((a, b) => {
      if (!a.nextScheduledAt) return 1;
      if (!b.nextScheduledAt) return -1;
      return new Date(a.nextScheduledAt).getTime() - new Date(b.nextScheduledAt).getTime();
    });

    // Apply pagination
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);
    const paginatedReminders = userReminders.slice(offsetNum, offsetNum + limitNum);

    res.json({
      success: true,
      data: {
        reminders: paginatedReminders,
        pagination: {
          total: userReminders.length,
          limit: limitNum,
          offset: offsetNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /reminders/:id
 * Get a specific reminder
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const reminder = reminders.get(id);

    if (!reminder) {
      throw new ApiError(404, 'Reminder not found');
    }

    if (reminder.userId !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    res.json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /reminders
 * Create a new reminder
 */
router.post(
  '/',
  validateBody(CreateReminderConfigSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserId(req);
      const now = new Date().toISOString();

      const reminder: ReminderConfig = {
        ...req.body,
        id: uuidv4(),
        userId,
        createdAt: now,
        updatedAt: now,
      };

      // Calculate next scheduled time if applicable
      if (reminder.frequency !== 'once' || reminder.scheduledTime) {
        reminder.nextScheduledAt = calculateNextScheduledTime(reminder);
      }

      reminders.set(reminder.id, reminder);

      logger.info(`Created reminder ${reminder.id} for user ${userId}`, {
        reminderId: reminder.id,
        category: reminder.category,
        frequency: reminder.frequency,
      });

      res.status(201).json({
        success: true,
        data: reminder,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /reminders/:id
 * Update a reminder
 */
router.patch(
  '/:id',
  validateBody(UpdateReminderConfigSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserId(req);
      const { id } = req.params;

      const existingReminder = reminders.get(id);

      if (!existingReminder) {
        throw new ApiError(404, 'Reminder not found');
      }

      if (existingReminder.userId !== userId) {
        throw new ApiError(403, 'Access denied');
      }

      const updatedReminder: ReminderConfig = {
        ...existingReminder,
        ...req.body,
        id: existingReminder.id,
        userId: existingReminder.userId,
        createdAt: existingReminder.createdAt,
        updatedAt: new Date().toISOString(),
      };

      // Recalculate next scheduled time if scheduling changed
      if (
        req.body.frequency !== undefined ||
        req.body.scheduledTime !== undefined ||
        req.body.customSchedule !== undefined
      ) {
        updatedReminder.nextScheduledAt = calculateNextScheduledTime(updatedReminder);
      }

      reminders.set(id, updatedReminder);

      logger.info(`Updated reminder ${id}`, {
        reminderId: id,
        userId,
      });

      res.json({
        success: true,
        data: updatedReminder,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /reminders/:id
 * Delete a reminder
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const reminder = reminders.get(id);

    if (!reminder) {
      throw new ApiError(404, 'Reminder not found');
    }

    if (reminder.userId !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    reminders.delete(id);

    logger.info(`Deleted reminder ${id}`, {
      reminderId: id,
      userId,
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * POST /reminders/:id/pause
 * Pause a reminder
 */
router.post('/:id/pause', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { until } = req.body; // Optional: pause until a specific time

    const reminder = reminders.get(id);

    if (!reminder) {
      throw new ApiError(404, 'Reminder not found');
    }

    if (reminder.userId !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    reminder.isPaused = true;
    reminder.pausedUntil = until || undefined;
    reminder.updatedAt = new Date().toISOString();

    reminders.set(id, reminder);

    logger.info(`Paused reminder ${id}`, {
      reminderId: id,
      userId,
      pausedUntil: until,
    });

    res.json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /reminders/:id/resume
 * Resume a paused reminder
 */
router.post('/:id/resume', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const reminder = reminders.get(id);

    if (!reminder) {
      throw new ApiError(404, 'Reminder not found');
    }

    if (reminder.userId !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    reminder.isPaused = false;
    reminder.pausedUntil = undefined;
    reminder.updatedAt = new Date().toISOString();
    reminder.nextScheduledAt = calculateNextScheduledTime(reminder);

    reminders.set(id, reminder);

    logger.info(`Resumed reminder ${id}`, {
      reminderId: id,
      userId,
    });

    res.json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    next(error);
  }
});

// ==========================
// USER PREFERENCES ROUTES
// ==========================

/**
 * GET /reminders/preferences
 * Get user's reminder preferences
 */
router.get('/preferences', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);

    let preferences = userPreferences.get(userId);

    if (!preferences) {
      // Return default preferences
      preferences = {
        userId,
        globalEnabled: true,
        quietHoursEnabled: true,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
        timezone: 'America/New_York',
        preferredChannels: ['push', 'in_app'],
        smartDeliveryEnabled: true,
        updatedAt: new Date().toISOString(),
      };
    }

    res.json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /reminders/preferences
 * Update user's reminder preferences
 */
router.put(
  '/preferences',
  validateBody(ReminderPreferencesSchema.omit({ userId: true })),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserId(req);

      const preferences: ReminderPreferences = {
        ...req.body,
        userId,
        updatedAt: new Date().toISOString(),
      };

      userPreferences.set(userId, preferences);

      logger.info(`Updated preferences for user ${userId}`);

      res.json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==========================
// HELPER FUNCTIONS
// ==========================

function calculateNextScheduledTime(reminder: ReminderConfig): string | undefined {
  const now = new Date();

  switch (reminder.frequency) {
    case 'once':
      if (reminder.scheduledTime && new Date(reminder.scheduledTime) > now) {
        return reminder.scheduledTime;
      }
      return undefined;

    case 'daily': {
      const next = new Date(now);
      if (reminder.timeWindow) {
        next.setHours(reminder.timeWindow.startHour, reminder.timeWindow.startMinute, 0, 0);
        if (next <= now) {
          next.setDate(next.getDate() + 1);
        }
      } else {
        next.setDate(next.getDate() + 1);
        next.setHours(9, 0, 0, 0); // Default: 9 AM
      }
      return next.toISOString();
    }

    case 'weekly': {
      const next = new Date(now);
      next.setDate(next.getDate() + 7);
      if (reminder.timeWindow) {
        next.setHours(reminder.timeWindow.startHour, reminder.timeWindow.startMinute, 0, 0);
      }
      return next.toISOString();
    }

    case 'biweekly': {
      const next = new Date(now);
      next.setDate(next.getDate() + 14);
      if (reminder.timeWindow) {
        next.setHours(reminder.timeWindow.startHour, reminder.timeWindow.startMinute, 0, 0);
      }
      return next.toISOString();
    }

    case 'monthly': {
      const next = new Date(now);
      next.setMonth(next.getMonth() + 1);
      if (reminder.timeWindow) {
        next.setHours(reminder.timeWindow.startHour, reminder.timeWindow.startMinute, 0, 0);
      }
      return next.toISOString();
    }

    case 'custom':
      if (reminder.customSchedule) {
        // Find next occurrence based on custom schedule
        // This is a simplified implementation
        if (reminder.customSchedule.intervalDays) {
          const next = new Date(now);
          next.setDate(next.getDate() + reminder.customSchedule.intervalDays);
          return next.toISOString();
        }
      }
      return undefined;

    default:
      return undefined;
  }
}

// Error handling middleware
router.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Route error:', { error: err.message, stack: err.stack });

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
      },
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
    },
  });
});

export { router as reminderRoutes };
export default router;
