import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PrismaClient, NotificationChannel } from "../generated/client/index.js";
import { NotificationError } from "../middleware/error.middleware.js";
import { authenticate, requireOwnership } from "../middleware/auth.middleware.js";
import { logger } from "../utils/logger.js";

const router: Router = Router();
const prisma = new PrismaClient();

// All preference routes require authentication
router.use(authenticate);

// Validation schemas
const NotificationPreferenceSchema = z.object({
  channel: z.enum(["email", "sms", "push", "in_app"]),
  enabled: z.boolean(),
  settings: z.record(z.unknown()).optional(),
});

const UpdatePreferencesSchema = z.object({
  preferences: z.array(NotificationPreferenceSchema),
});

const QuietHoursSchema = z.object({
  enabled: z.boolean(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Use HH:MM"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format. Use HH:MM"),
  timezone: z.string().default("UTC"),
});

// Get user preferences (requires ownership or admin)
router.get(
  "/user/:userId",
  requireOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      // Validate userId is a UUID
      if (!z.string().uuid().safeParse(userId).success) {
        throw new NotificationError("Invalid user ID format", 400);
      }

      logger.info(`Fetching notification preferences for user ${userId}`);

      const [preferences, quietHours] = await Promise.all([
        prisma.notificationPreference.findMany({
          where: { userId },
          orderBy: { channel: "asc" },
        }),
        prisma.quietHours.findUnique({
          where: { userId },
        }),
      ]);

      res.json({
        success: true,
        data: {
          userId,
          preferences,
          quietHours: quietHours || {
            enabled: false,
            startTime: "22:00",
            endTime: "07:00",
            timezone: "UTC",
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Update user preferences (bulk update, requires ownership or admin)
router.put(
  "/user/:userId",
  requireOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      // Validate userId is a UUID
      if (!z.string().uuid().safeParse(userId).success) {
        throw new NotificationError("Invalid user ID format", 400);
      }

      const validatedData = UpdatePreferencesSchema.parse(req.body);

      logger.info(`Updating notification preferences for user ${userId}`);

      // Upsert all preferences in a transaction
      const updatedPreferences = await prisma.$transaction(
        validatedData.preferences.map((pref) =>
          prisma.notificationPreference.upsert({
            where: {
              userId_channel: {
                userId,
                channel: pref.channel as NotificationChannel,
              },
            },
            create: {
              userId,
              channel: pref.channel as NotificationChannel,
              enabled: pref.enabled,
              settings: pref.settings,
            },
            update: {
              enabled: pref.enabled,
              settings: pref.settings,
            },
          })
        )
      );

      res.json({
        success: true,
        data: {
          userId,
          preferences: updatedPreferences,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            message: "Validation error",
            details: error.errors,
          },
        });
        return;
      }
      next(error);
    }
  },
);

// Update single preference by channel (requires ownership or admin)
router.patch(
  "/user/:userId/:channel",
  requireOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, channel } = req.params;

      // Validate userId is a UUID
      if (!z.string().uuid().safeParse(userId).success) {
        throw new NotificationError("Invalid user ID format", 400);
      }

      // Validate channel
      const channelResult = z.enum(["email", "sms", "push", "in_app"]).safeParse(channel);
      if (!channelResult.success) {
        throw new NotificationError("Invalid channel", 400);
      }

      const { enabled, settings } = req.body;

      if (typeof enabled !== "boolean") {
        throw new NotificationError("'enabled' field is required and must be a boolean", 400);
      }

      logger.info(
        `Updating ${channel} preference for user ${userId} to ${enabled}`,
      );

      const preference = await prisma.notificationPreference.upsert({
        where: {
          userId_channel: {
            userId,
            channel: channel as NotificationChannel,
          },
        },
        create: {
          userId,
          channel: channel as NotificationChannel,
          enabled,
          settings,
        },
        update: {
          enabled,
          ...(settings !== undefined && { settings }),
        },
      });

      res.json({
        success: true,
        data: preference,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get quiet hours (requires ownership or admin)
router.get(
  "/user/:userId/quiet-hours",
  requireOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      // Validate userId is a UUID
      if (!z.string().uuid().safeParse(userId).success) {
        throw new NotificationError("Invalid user ID format", 400);
      }

      const quietHours = await prisma.quietHours.findUnique({
        where: { userId },
      });

      res.json({
        success: true,
        data: quietHours || {
          enabled: false,
          startTime: "22:00",
          endTime: "07:00",
          timezone: "UTC",
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Update quiet hours (requires ownership or admin)
router.put(
  "/user/:userId/quiet-hours",
  requireOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      // Validate userId is a UUID
      if (!z.string().uuid().safeParse(userId).success) {
        throw new NotificationError("Invalid user ID format", 400);
      }

      const validatedData = QuietHoursSchema.parse(req.body);

      logger.info(`Updating quiet hours for user ${userId}`);

      const quietHours = await prisma.quietHours.upsert({
        where: { userId },
        create: {
          userId,
          enabled: validatedData.enabled,
          startTime: validatedData.startTime,
          endTime: validatedData.endTime,
          timezone: validatedData.timezone,
        },
        update: {
          enabled: validatedData.enabled,
          startTime: validatedData.startTime,
          endTime: validatedData.endTime,
          timezone: validatedData.timezone,
        },
      });

      res.json({
        success: true,
        data: quietHours,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            message: "Validation error",
            details: error.errors,
          },
        });
        return;
      }
      next(error);
    }
  },
);

// Unsubscribe from all marketing (requires ownership or admin)
router.post(
  "/user/:userId/unsubscribe",
  requireOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      // Validate userId is a UUID
      if (!z.string().uuid().safeParse(userId).success) {
        throw new NotificationError("Invalid user ID format", 400);
      }

      logger.info(`User ${userId} unsubscribed from marketing notifications`);

      // Update all preferences to disable marketing-related notifications
      // In a real implementation, you might have a specific "marketing" notification type
      // For now, we'll just log the action and acknowledge

      // Optionally, you could store this as a specific preference setting
      await prisma.notificationPreference.updateMany({
        where: { userId },
        data: {
          settings: {
            marketingEnabled: false,
          },
        },
      });

      res.json({
        success: true,
        message: "Successfully unsubscribed from marketing notifications",
      });
    } catch (error) {
      next(error);
    }
  },
);

// Delete all preferences for a user (requires ownership or admin)
router.delete(
  "/user/:userId",
  requireOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      // Validate userId is a UUID
      if (!z.string().uuid().safeParse(userId).success) {
        throw new NotificationError("Invalid user ID format", 400);
      }

      logger.info(`Deleting all preferences for user ${userId}`);

      await prisma.$transaction([
        prisma.notificationPreference.deleteMany({
          where: { userId },
        }),
        prisma.quietHours.deleteMany({
          where: { userId },
        }),
      ]);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// Initialize default preferences for a new user (requires ownership or admin)
router.post(
  "/user/:userId/initialize",
  requireOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      // Validate userId is a UUID
      if (!z.string().uuid().safeParse(userId).success) {
        throw new NotificationError("Invalid user ID format", 400);
      }

      logger.info(`Initializing default preferences for user ${userId}`);

      // Create default preferences for all channels
      const defaultChannels: NotificationChannel[] = ["email", "sms", "push", "in_app"];

      const preferences = await prisma.$transaction(
        defaultChannels.map((channel) =>
          prisma.notificationPreference.upsert({
            where: {
              userId_channel: {
                userId,
                channel,
              },
            },
            create: {
              userId,
              channel,
              enabled: channel !== "sms", // SMS disabled by default
              settings: {},
            },
            update: {}, // Don't update if already exists
          })
        )
      );

      // Create default quiet hours
      const quietHours = await prisma.quietHours.upsert({
        where: { userId },
        create: {
          userId,
          enabled: false,
          startTime: "22:00",
          endTime: "07:00",
          timezone: "UTC",
        },
        update: {}, // Don't update if already exists
      });

      res.status(201).json({
        success: true,
        data: {
          userId,
          preferences,
          quietHours,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export { router as preferenceRoutes };
