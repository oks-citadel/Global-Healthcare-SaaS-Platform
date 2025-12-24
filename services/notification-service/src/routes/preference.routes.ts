import { Router, Request, Response, NextFunction } from "express";
import { NotificationPreferenceSchema } from "../types/notification.types.js";
import { logger } from "../utils/logger.js";

const router: Router = Router();

// Get user preferences
router.get(
  "/user/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      logger.info(`Fetching notification preferences for user ${userId}`);

      res.json({
        success: true,
        data: {
          userId,
          preferences: [
            {
              channel: "email",
              notificationType: "appointment_reminder",
              enabled: true,
            },
            {
              channel: "sms",
              notificationType: "appointment_reminder",
              enabled: true,
            },
            {
              channel: "push",
              notificationType: "appointment_reminder",
              enabled: true,
            },
            {
              channel: "email",
              notificationType: "lab_results_available",
              enabled: true,
            },
            {
              channel: "push",
              notificationType: "secure_message",
              enabled: true,
            },
            { channel: "email", notificationType: "marketing", enabled: false },
          ],
          quietHours: {
            enabled: true,
            start: "22:00",
            end: "07:00",
            timezone: "America/New_York",
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Update user preferences
router.put(
  "/user/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { preferences, quietHours } = req.body;

      logger.info(`Updating notification preferences for user ${userId}`);

      res.json({
        success: true,
        data: {
          userId,
          preferences,
          quietHours,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Update single preference
router.patch(
  "/user/:userId/:channel/:notificationType",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, channel, notificationType } = req.params;
      const { enabled } = req.body;

      const validatedData = NotificationPreferenceSchema.parse({
        userId,
        channel,
        notificationType,
        enabled,
      });

      logger.info(
        `Updating ${channel}/${notificationType} preference for user ${userId} to ${enabled}`,
      );

      res.json({
        success: true,
        data: {
          ...validatedData,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Unsubscribe from all marketing
router.post(
  "/user/:userId/unsubscribe",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { token: _token } = req.body;

      logger.info(`User ${userId} unsubscribed from marketing notifications`);

      res.json({
        success: true,
        message: "Successfully unsubscribed from marketing notifications",
      });
    } catch (error) {
      next(error);
    }
  },
);

export { router as preferenceRoutes };
