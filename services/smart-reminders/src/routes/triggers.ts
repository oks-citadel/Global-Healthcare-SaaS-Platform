/**
 * Triggers Routes
 * Trigger evaluation and management endpoints
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import {
  TriggerConditionSchema,
  CreateTriggerConditionSchema,
  UpdateTriggerConditionSchema,
  TriggerCondition,
  TriggerEvaluationResult,
} from '../models/TriggerCondition.js';
import { ReminderConfig } from '../models/ReminderConfig.js';
import { ContextEngine, UserContext } from '../services/contextEngine.js';
import { TriggerEvaluator } from '../services/triggerEvaluator.js';
import { NotificationService } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

const router: Router = Router();

// Initialize services
const contextEngine = new ContextEngine();
const triggerEvaluator = new TriggerEvaluator();
const notificationService = new NotificationService();

// In-memory storage (replace with database in production)
const triggers: Map<string, TriggerCondition> = new Map();
const reminderTriggerLinks: Map<string, string[]> = new Map(); // reminderId -> triggerIds[]

// Error class
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

// Get user from request
const getUserId = (req: Request): string => {
  return req.headers['x-user-id'] as string || 'default-user';
};

// =============================
// TRIGGER EVALUATION ENDPOINTS
// =============================

/**
 * POST /triggers/evaluate
 * Evaluate triggers for a specific reminder
 */
router.post('/evaluate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { reminderId, triggerIds, patientId } = req.body;

    if (!reminderId && (!triggerIds || triggerIds.length === 0)) {
      throw new ApiError(400, 'Either reminderId or triggerIds must be provided');
    }

    logger.info(`Trigger evaluation requested`, { userId, reminderId, triggerIds });

    // Get user context
    const userContext = await contextEngine.getFullContext(userId, patientId);

    let results: TriggerEvaluationResult[];

    if (reminderId) {
      // Evaluate all triggers for a reminder
      const linkedTriggerIds = reminderTriggerLinks.get(reminderId) || [];
      const linkedTriggers = linkedTriggerIds
        .map((id) => triggers.get(id))
        .filter((t): t is TriggerCondition => t !== undefined);

      // Mock reminder for evaluation (in production, fetch from database)
      const reminder: ReminderConfig = {
        id: reminderId,
        userId,
        title: 'Test Reminder',
        message: 'Test message',
        category: 'custom',
        priority: 'normal',
        frequency: 'daily',
        channels: ['push', 'in_app'],
        requireAllTriggers: false,
        allowSnooze: true,
        maxRetries: 2,
        retryIntervalMinutes: 15,
        snoozeOptions: [15, 30, 60],
        maxSnoozeCount: 3,
        requireConfirmation: false,
        escalateOnNoConfirmation: false,
        isActive: true,
        isPaused: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const combinedResult = await triggerEvaluator.evaluateTriggers({
        reminder,
        triggers: linkedTriggers,
        userContext,
      });

      res.json({
        success: true,
        data: combinedResult,
      });
    } else {
      // Evaluate specific triggers
      const triggersToEvaluate = triggerIds
        .map((id: string) => triggers.get(id))
        .filter((t: TriggerCondition | undefined): t is TriggerCondition => t !== undefined);

      results = await Promise.all(
        triggersToEvaluate.map((trigger: TriggerCondition) =>
          triggerEvaluator.evaluateSingleTrigger(trigger, userContext)
        )
      );

      res.json({
        success: true,
        data: {
          results,
          evaluatedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * POST /triggers/evaluate-and-send
 * Evaluate triggers and send notification if triggered
 */
router.post('/evaluate-and-send', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = getUserId(req);
    const { reminderId, patientId } = req.body;

    if (!reminderId) {
      throw new ApiError(400, 'reminderId is required');
    }

    logger.info(`Evaluate-and-send requested for reminder ${reminderId}`, { userId });

    // Get user context
    const userContext = await contextEngine.getFullContext(userId, patientId);

    // Check if it's a good time to notify
    const timingCheck = contextEngine.isGoodTimeToNotify(userContext);

    if (!timingCheck.canNotify) {
      res.json({
        success: true,
        data: {
          sent: false,
          reason: timingCheck.reason,
          suggestedRetry: timingCheck.suggestedDelay
            ? new Date(Date.now() + timingCheck.suggestedDelay).toISOString()
            : undefined,
        },
      });
      return;
    }

    // Get triggers for reminder
    const linkedTriggerIds = reminderTriggerLinks.get(reminderId) || [];
    const linkedTriggers = linkedTriggerIds
      .map((id) => triggers.get(id))
      .filter((t): t is TriggerCondition => t !== undefined);

    // Mock reminder (in production, fetch from database)
    const reminder: ReminderConfig = {
      id: reminderId,
      userId,
      title: 'Health Reminder',
      message: 'Time for your health check-in!',
      category: 'health_check',
      priority: 'normal',
      frequency: 'daily',
      channels: ['push', 'in_app'],
      requireAllTriggers: false,
      allowSnooze: true,
      maxRetries: 2,
      retryIntervalMinutes: 15,
      snoozeOptions: [15, 30, 60],
      maxSnoozeCount: 3,
      requireConfirmation: false,
      escalateOnNoConfirmation: false,
      isActive: true,
      isPaused: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Evaluate triggers (if any)
    let shouldSend = true;
    let triggerResult;

    if (linkedTriggers.length > 0) {
      triggerResult = await triggerEvaluator.evaluateTriggers({
        reminder,
        triggers: linkedTriggers,
        userContext,
      });
      shouldSend = triggerResult.shouldTrigger;
    }

    if (!shouldSend) {
      res.json({
        success: true,
        data: {
          sent: false,
          reason: 'Trigger conditions not met',
          triggerResult,
        },
      });
      return;
    }

    // Send the notification
    const instance = await notificationService.sendReminder(reminder, userContext, triggerResult);

    res.json({
      success: true,
      data: {
        sent: instance.status === 'sent',
        instance,
        triggerResult,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================
// TRIGGER CONDITION CRUD
// =============================

/**
 * GET /triggers
 * Get all trigger conditions
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, isActive } = req.query;

    let allTriggers = Array.from(triggers.values());

    if (type) {
      allTriggers = allTriggers.filter((t) => t.type === type);
    }

    if (isActive !== undefined) {
      const active = isActive === 'true';
      allTriggers = allTriggers.filter((t) => t.isActive === active);
    }

    res.json({
      success: true,
      data: {
        triggers: allTriggers,
        total: allTriggers.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /triggers/:id
 * Get a specific trigger condition
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const trigger = triggers.get(id);

    if (!trigger) {
      throw new ApiError(404, 'Trigger not found');
    }

    res.json({
      success: true,
      data: trigger,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /triggers
 * Create a new trigger condition
 */
router.post(
  '/',
  validateBody(CreateTriggerConditionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const now = new Date().toISOString();

      const trigger: TriggerCondition = {
        ...req.body,
        id: uuidv4(),
        triggerCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      triggers.set(trigger.id, trigger);

      logger.info(`Created trigger ${trigger.id}`, {
        triggerId: trigger.id,
        type: trigger.type,
        name: trigger.name,
      });

      res.status(201).json({
        success: true,
        data: trigger,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /triggers/:id
 * Update a trigger condition
 */
router.patch(
  '/:id',
  validateBody(UpdateTriggerConditionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const existingTrigger = triggers.get(id);

      if (!existingTrigger) {
        throw new ApiError(404, 'Trigger not found');
      }

      const updatedTrigger: TriggerCondition = {
        ...existingTrigger,
        ...req.body,
        id: existingTrigger.id,
        createdAt: existingTrigger.createdAt,
        triggerCount: existingTrigger.triggerCount,
        updatedAt: new Date().toISOString(),
      };

      triggers.set(id, updatedTrigger);

      logger.info(`Updated trigger ${id}`, { triggerId: id });

      res.json({
        success: true,
        data: updatedTrigger,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /triggers/:id
 * Delete a trigger condition
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!triggers.has(id)) {
      throw new ApiError(404, 'Trigger not found');
    }

    triggers.delete(id);

    // Remove from reminder links
    for (const [reminderId, triggerIds] of reminderTriggerLinks.entries()) {
      const filtered = triggerIds.filter((tid) => tid !== id);
      if (filtered.length !== triggerIds.length) {
        reminderTriggerLinks.set(reminderId, filtered);
      }
    }

    logger.info(`Deleted trigger ${id}`);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * POST /triggers/:id/link/:reminderId
 * Link a trigger to a reminder
 */
router.post('/:id/link/:reminderId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, reminderId } = req.params;

    if (!triggers.has(id)) {
      throw new ApiError(404, 'Trigger not found');
    }

    const existingLinks = reminderTriggerLinks.get(reminderId) || [];

    if (!existingLinks.includes(id)) {
      existingLinks.push(id);
      reminderTriggerLinks.set(reminderId, existingLinks);
    }

    logger.info(`Linked trigger ${id} to reminder ${reminderId}`);

    res.json({
      success: true,
      data: {
        reminderId,
        linkedTriggers: existingLinks,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /triggers/:id/link/:reminderId
 * Unlink a trigger from a reminder
 */
router.delete('/:id/link/:reminderId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, reminderId } = req.params;

    const existingLinks = reminderTriggerLinks.get(reminderId) || [];
    const filtered = existingLinks.filter((tid) => tid !== id);
    reminderTriggerLinks.set(reminderId, filtered);

    logger.info(`Unlinked trigger ${id} from reminder ${reminderId}`);

    res.json({
      success: true,
      data: {
        reminderId,
        linkedTriggers: filtered,
      },
    });
  } catch (error) {
    next(error);
  }
});

// =============================
// CONTEXT ENDPOINTS
// =============================

/**
 * GET /triggers/context/:userId
 * Get current context for a user (for debugging/testing)
 */
router.get('/context/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { patientId } = req.query;

    const context = await contextEngine.getFullContext(userId, patientId as string);

    const timingCheck = contextEngine.isGoodTimeToNotify(context);
    const bestChannel = contextEngine.getBestChannel(context);

    res.json({
      success: true,
      data: {
        context,
        analysis: {
          canNotify: timingCheck.canNotify,
          notifyReason: timingCheck.reason,
          suggestedDelay: timingCheck.suggestedDelay,
          bestChannel,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

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

export { router as triggerRoutes };
export default router;
