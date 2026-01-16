import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { PrismaClient, NotificationChannel } from "../generated/client/index.js";
import { NotificationError } from "../middleware/error.middleware.js";
import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";
import { logger } from "../utils/logger.js";

const router: Router = Router();
const prisma = new PrismaClient();

// All template routes require authentication
router.use(authenticate);

// All write operations require admin role (applied to individual routes below)

// Validation schemas
const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string().min(1).max(100),
  channel: z.enum(["email", "sms", "push", "in_app"]),
  subject: z.string().max(200).optional(),
  body: z.string().min(1),
  variables: z.array(z.string()).optional().default([]),
  locale: z.string().min(2).max(10).default("en"),
});

const UpdateTemplateSchema = CreateTemplateSchema.partial();

const GetTemplatesQuerySchema = z.object({
  channel: z.enum(["email", "sms", "push", "in_app"]).optional(),
  type: z.string().optional(),
  locale: z.string().optional(),
  isActive: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).default("50"),
  offset: z.string().regex(/^\d+$/).transform(Number).default("0"),
});

// List all templates
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryResult = GetTemplatesQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
      throw new NotificationError("Invalid query parameters", 400);
    }

    const { channel, type, locale, isActive, limit, offset } = queryResult.data;

    logger.info("Fetching notification templates");

    const where: {
      channel?: NotificationChannel;
      type?: string;
      locale?: string;
      isActive?: boolean;
    } = {};

    if (channel) {
      where.channel = channel as NotificationChannel;
    }
    if (type) {
      where.type = type;
    }
    if (locale) {
      where.locale = locale;
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [templates, total] = await Promise.all([
      prisma.notificationTemplate.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.notificationTemplate.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        templates,
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
});

// Get a specific template
router.get(
  "/:templateId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateId } = req.params;

      // Validate templateId is a UUID
      if (!z.string().uuid().safeParse(templateId).success) {
        throw new NotificationError("Invalid template ID format", 400);
      }

      const template = await prisma.notificationTemplate.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new NotificationError("Template not found", 404);
      }

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Get template by name
router.get(
  "/name/:templateName",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateName } = req.params;

      const template = await prisma.notificationTemplate.findUnique({
        where: { name: templateName },
      });

      if (!template) {
        throw new NotificationError("Template not found", 404);
      }

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Create a new template (admin only)
router.post("/", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = CreateTemplateSchema.parse(req.body);

    // Check if template with same name already exists
    const existingTemplate = await prisma.notificationTemplate.findUnique({
      where: { name: validatedData.name },
    });

    if (existingTemplate) {
      throw new NotificationError("Template with this name already exists", 409);
    }

    logger.info(`Creating template: ${validatedData.name}`);

    const template = await prisma.notificationTemplate.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        channel: validatedData.channel as NotificationChannel,
        subject: validatedData.subject,
        body: validatedData.body,
        variables: validatedData.variables,
        locale: validatedData.locale,
      },
    });

    res.status(201).json({
      success: true,
      data: template,
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

// Update a template (admin only)
router.put(
  "/:templateId",
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateId } = req.params;

      // Validate templateId is a UUID
      if (!z.string().uuid().safeParse(templateId).success) {
        throw new NotificationError("Invalid template ID format", 400);
      }

      const existingTemplate = await prisma.notificationTemplate.findUnique({
        where: { id: templateId },
      });

      if (!existingTemplate) {
        throw new NotificationError("Template not found", 404);
      }

      const validatedData = UpdateTemplateSchema.parse(req.body);

      // If name is being changed, check for duplicates
      if (validatedData.name && validatedData.name !== existingTemplate.name) {
        const duplicateTemplate = await prisma.notificationTemplate.findUnique({
          where: { name: validatedData.name },
        });

        if (duplicateTemplate) {
          throw new NotificationError("Template with this name already exists", 409);
        }
      }

      logger.info(`Updating template: ${templateId}`);

      const template = await prisma.notificationTemplate.update({
        where: { id: templateId },
        data: {
          ...(validatedData.name && { name: validatedData.name }),
          ...(validatedData.type && { type: validatedData.type }),
          ...(validatedData.channel && { channel: validatedData.channel as NotificationChannel }),
          ...(validatedData.subject !== undefined && { subject: validatedData.subject }),
          ...(validatedData.body && { body: validatedData.body }),
          ...(validatedData.variables && { variables: validatedData.variables }),
          ...(validatedData.locale && { locale: validatedData.locale }),
        },
      });

      res.json({
        success: true,
        data: template,
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

// Toggle template active status (admin only)
router.patch(
  "/:templateId/toggle",
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateId } = req.params;

      // Validate templateId is a UUID
      if (!z.string().uuid().safeParse(templateId).success) {
        throw new NotificationError("Invalid template ID format", 400);
      }

      const existingTemplate = await prisma.notificationTemplate.findUnique({
        where: { id: templateId },
      });

      if (!existingTemplate) {
        throw new NotificationError("Template not found", 404);
      }

      logger.info(`Toggling template ${templateId} active status`);

      const template = await prisma.notificationTemplate.update({
        where: { id: templateId },
        data: {
          isActive: !existingTemplate.isActive,
        },
      });

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Delete a template (admin only)
router.delete(
  "/:templateId",
  requireAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateId } = req.params;

      // Validate templateId is a UUID
      if (!z.string().uuid().safeParse(templateId).success) {
        throw new NotificationError("Invalid template ID format", 400);
      }

      const existingTemplate = await prisma.notificationTemplate.findUnique({
        where: { id: templateId },
      });

      if (!existingTemplate) {
        throw new NotificationError("Template not found", 404);
      }

      await prisma.notificationTemplate.delete({
        where: { id: templateId },
      });

      logger.info(`Deleted template: ${templateId}`);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// Render a template with variables
router.post(
  "/:templateId/render",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateId } = req.params;
      const { variables } = req.body;

      // Validate templateId is a UUID
      if (!z.string().uuid().safeParse(templateId).success) {
        throw new NotificationError("Invalid template ID format", 400);
      }

      const template = await prisma.notificationTemplate.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new NotificationError("Template not found", 404);
      }

      // Simple variable substitution ({{variableName}})
      let renderedSubject = template.subject || "";
      let renderedBody = template.body;

      if (variables && typeof variables === "object") {
        for (const [key, value] of Object.entries(variables)) {
          const regex = new RegExp(`{{${key}}}`, "g");
          renderedSubject = renderedSubject.replace(regex, String(value));
          renderedBody = renderedBody.replace(regex, String(value));
        }
      }

      res.json({
        success: true,
        data: {
          subject: renderedSubject,
          body: renderedBody,
          channel: template.channel,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

export { router as templateRoutes };
