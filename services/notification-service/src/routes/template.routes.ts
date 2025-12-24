import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { NotificationError } from "../middleware/error.middleware.js";
import { logger } from "../utils/logger.js";

const router: Router = Router();

const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  channel: z.enum(["email", "sms", "push", "in_app"]),
  subject: z.string().max(200).optional(),
  body: z.string(),
  variables: z.array(z.string()).optional(),
  locale: z.string().default("en"),
});

// List all templates
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("Fetching notification templates");

    res.json({
      success: true,
      data: {
        templates: [
          {
            id: "1",
            name: "appointment_reminder",
            channel: "email",
            subject: "Appointment Reminder - {{appointmentDate}}",
            body: "Dear {{patientName}}, this is a reminder for your upcoming appointment on {{appointmentDate}} at {{appointmentTime}}.",
            variables: ["patientName", "appointmentDate", "appointmentTime"],
            locale: "en",
          },
          {
            id: "2",
            name: "appointment_reminder_sms",
            channel: "sms",
            body: "Reminder: Your appointment is on {{appointmentDate}} at {{appointmentTime}}. Reply CONFIRM or CANCEL.",
            variables: ["appointmentDate", "appointmentTime"],
            locale: "en",
          },
        ],
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get a specific template
router.get(
  "/:templateId",
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { templateId: _templateId } = req.params;

      // TODO: Implement database query
      throw new NotificationError("Template not found", 404);
    } catch (error) {
      next(error);
    }
  },
);

// Create a new template
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = CreateTemplateSchema.parse(req.body);

    logger.info(`Creating template: ${validatedData.name}`);

    res.status(201).json({
      success: true,
      data: {
        id: crypto.randomUUID(),
        ...validatedData,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update a template
router.put(
  "/:templateId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateId } = req.params;
      const validatedData = CreateTemplateSchema.partial().parse(req.body);

      logger.info(`Updating template: ${templateId}`);

      res.json({
        success: true,
        data: {
          id: templateId,
          ...validatedData,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

// Delete a template
router.delete(
  "/:templateId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateId } = req.params;

      logger.info(`Deleting template: ${templateId}`);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

export { router as templateRoutes };
