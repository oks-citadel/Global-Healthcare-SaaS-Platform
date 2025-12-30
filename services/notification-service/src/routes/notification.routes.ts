import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PrismaClient, NotificationChannel, NotificationStatus, NotificationPriority } from "../generated/client/index.js";
import { NotificationError } from "../middleware/error.middleware.js";
import { authenticate, requireAdmin, requireOwnership, ForbiddenError } from "../middleware/auth.middleware.js";
import { logger } from "../utils/logger.js";

const router: Router = Router();
const prisma = new PrismaClient();

// Apply authentication to all routes
router.use(authenticate);

// Validation schemas
const CreateNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.string().min(1).max(100),
  title: z.string().max(200).optional(),
  message: z.string().min(1),
  channel: z.enum(["email", "sms", "push", "in_app"]),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  metadata: z.record(z.unknown()).optional(),
  scheduledAt: z.string().datetime().optional(),
  templateId: z.string().uuid().optional(),
});

const GetNotificationsQuerySchema = z.object({
  status: z.enum(["pending", "queued", "sent", "delivered", "failed", "read"]).optional(),
  channel: z.enum(["email", "sms", "push", "in_app"]).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).default("50"),
  offset: z.string().regex(/^\d+$/).transform(Number).default("0"),
});

const BulkNotificationSchema = z.object({
  notifications: z.array(CreateNotificationSchema).min(1).max(1000),
});

// Send a notification (admin can send to any user, non-admin only to self)
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = CreateNotificationSchema.parse(req.body);

    // Non-admins can only send notifications to themselves
    if (req.user?.role !== "admin" && validatedData.userId !== req.user?.userId) {
      throw new ForbiddenError("You can only send notifications to yourself");
    }

    logger.info(
      `Creating ${validatedData.channel} notification for user ${validatedData.userId}`,
    );

    const notification = await prisma.notification.create({
      data: {
        userId: validatedData.userId,
        type: validatedData.type,
        title: validatedData.title,
        message: validatedData.message,
        channel: validatedData.channel as NotificationChannel,
        priority: validatedData.priority as NotificationPriority,
        metadata: validatedData.metadata,
        scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : null,
        templateId: validatedData.templateId,
        status: validatedData.scheduledAt ? "queued" as NotificationStatus : "pending" as NotificationStatus,
      },
    });

    logger.info(`Notification created with ID: ${notification.id}`);

    res.status(201).json({
      success: true,
      data: notification,
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
});

// Get notifications for a user (requires ownership or admin)
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

      const queryResult = GetNotificationsQuerySchema.safeParse(req.query);
      if (!queryResult.success) {
        throw new NotificationError("Invalid query parameters", 400);
      }

      const { status, channel, limit, offset } = queryResult.data;

      logger.info(`Fetching notifications for user ${userId}`);

      const where: {
        userId: string;
        status?: NotificationStatus;
        channel?: NotificationChannel;
      } = { userId };

      if (status) {
        where.status = status as NotificationStatus;
      }
      if (channel) {
        where.channel = channel as NotificationChannel;
      }

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        prisma.notification.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          notifications,
          pagination: {
            limit,
            offset,
            total,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get a specific notification (user can only access their own, admin can access any)
router.get(
  "/:notificationId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notificationId } = req.params;

      // Validate notificationId is a UUID
      if (!z.string().uuid().safeParse(notificationId).success) {
        throw new NotificationError("Invalid notification ID format", 400);
      }

      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        throw new NotificationError("Notification not found", 404);
      }

      // Check ownership (admin can access any notification)
      if (req.user?.role !== "admin" && notification.userId !== req.user?.userId) {
        throw new ForbiddenError("You can only access your own notifications");
      }

      res.json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Mark notification as read (user can only mark their own)
router.patch(
  "/:notificationId/read",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notificationId } = req.params;

      // Validate notificationId is a UUID
      if (!z.string().uuid().safeParse(notificationId).success) {
        throw new NotificationError("Invalid notification ID format", 400);
      }

      const existingNotification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!existingNotification) {
        throw new NotificationError("Notification not found", 404);
      }

      // Check ownership (admin can mark any notification as read)
      if (req.user?.role !== "admin" && existingNotification.userId !== req.user?.userId) {
        throw new ForbiddenError("You can only mark your own notifications as read");
      }

      logger.info(`Marking notification ${notificationId} as read`);

      const notification = await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: "read" as NotificationStatus,
          readAt: new Date(),
        },
      });

      res.json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Bulk send notifications (admin only)
router.post(
  "/bulk",
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = BulkNotificationSchema.parse(req.body);

      logger.info(`Bulk sending ${validatedData.notifications.length} notifications`);

      const batchId = crypto.randomUUID();

      // Create all notifications in a transaction
      const notifications = await prisma.$transaction(
        validatedData.notifications.map((notif) =>
          prisma.notification.create({
            data: {
              userId: notif.userId,
              type: notif.type,
              title: notif.title,
              message: notif.message,
              channel: notif.channel as NotificationChannel,
              priority: notif.priority as NotificationPriority,
              metadata: { ...notif.metadata, batchId },
              scheduledAt: notif.scheduledAt ? new Date(notif.scheduledAt) : null,
              templateId: notif.templateId,
              status: "queued" as NotificationStatus,
            },
          })
        )
      );

      res.status(202).json({
        success: true,
        data: {
          queued: notifications.length,
          batchId,
          notificationIds: notifications.map((n) => n.id),
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

// Mark multiple notifications as read (requires ownership or admin)
router.patch(
  "/user/:userId/read-all",
  requireOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      // Validate userId is a UUID
      if (!z.string().uuid().safeParse(userId).success) {
        throw new NotificationError("Invalid user ID format", 400);
      }

      logger.info(`Marking all notifications as read for user ${userId}`);

      const result = await prisma.notification.updateMany({
        where: {
          userId,
          status: { not: "read" as NotificationStatus },
        },
        data: {
          status: "read" as NotificationStatus,
          readAt: new Date(),
        },
      });

      res.json({
        success: true,
        data: {
          updated: result.count,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Delete a notification (user can only delete their own, admin can delete any)
router.delete(
  "/:notificationId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notificationId } = req.params;

      // Validate notificationId is a UUID
      if (!z.string().uuid().safeParse(notificationId).success) {
        throw new NotificationError("Invalid notification ID format", 400);
      }

      const existingNotification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!existingNotification) {
        throw new NotificationError("Notification not found", 404);
      }

      // Check ownership (admin can delete any notification)
      if (req.user?.role !== "admin" && existingNotification.userId !== req.user?.userId) {
        throw new ForbiddenError("You can only delete your own notifications");
      }

      await prisma.notification.delete({
        where: { id: notificationId },
      });

      logger.info(`Deleted notification ${notificationId}`);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export { router as notificationRoutes };
