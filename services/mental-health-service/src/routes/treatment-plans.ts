import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { TreatmentPlanService } from '../services/TreatmentPlanService';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createTreatmentPlanSchema = z.object({
  patientId: z.string().uuid(),
  diagnosis: z.array(z.string()),
  interventions: z.record(z.any()),
  medications: z.record(z.any()).optional(),
  frequency: z.string().optional(),
  startDate: z.string().datetime(),
  reviewDate: z.string().datetime(),
  goals: z.array(
    z.object({
      description: z.string(),
      targetDate: z.string().datetime().optional(),
      strategies: z.array(z.string()),
      measurements: z.record(z.any()).optional(),
    })
  ),
});

const updateTreatmentPlanSchema = z.object({
  diagnosis: z.array(z.string()).optional(),
  interventions: z.record(z.any()).optional(),
  medications: z.record(z.any()).optional(),
  frequency: z.string().optional(),
  reviewDate: z.string().datetime().optional(),
  status: z.enum(['active', 'completed', 'discontinued']).optional(),
});

const addGoalSchema = z.object({
  description: z.string(),
  targetDate: z.string().datetime().optional(),
  strategies: z.array(z.string()),
  measurements: z.record(z.any()).optional(),
});

const updateGoalSchema = z.object({
  progress: z.number().min(0).max(100).optional(),
  status: z.enum(['not_started', 'in_progress', 'achieved', 'discontinued']).optional(),
  barriers: z.array(z.string()).optional(),
  strategies: z.array(z.string()).optional(),
});

// Create treatment plan
router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can create treatment plans
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can create treatment plans',
      });
      return;
    }

    const validatedData = createTreatmentPlanSchema.parse(req.body);

    const plan = await TreatmentPlanService.createTreatmentPlan({
      patientId: validatedData.patientId,
      providerId: userId,
      diagnosis: validatedData.diagnosis,
      interventions: validatedData.interventions,
      medications: validatedData.medications,
      frequency: validatedData.frequency,
      startDate: new Date(validatedData.startDate),
      reviewDate: new Date(validatedData.reviewDate),
      goals: validatedData.goals.map((goal) => ({
        description: goal.description,
        targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined,
        strategies: goal.strategies,
        measurements: goal.measurements,
      })),
    });

    res.status(201).json({
      data: plan,
      message: 'Treatment plan created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error creating treatment plan:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create treatment plan',
    });
  }
});

// Get patient's treatment plan
router.get('/patient/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check access
    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && patientId === userId) ||
      userRole === 'provider';

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const plan = await TreatmentPlanService.getActivePlanForPatient(patientId);

    if (!plan) {
      res.status(404).json({
        error: 'Not Found',
        message: 'No active treatment plan found',
      });
      return;
    }

    res.json({ data: plan });
  } catch (error) {
    console.error('Error fetching treatment plan:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch treatment plan',
    });
  }
});

// Get treatment plan by ID
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const plan = await TreatmentPlanService.getTreatmentPlanWithGoals(id);

    if (!plan) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Treatment plan not found',
      });
      return;
    }

    // Check access
    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && plan.patientId === userId) ||
      (userRole === 'provider' && plan.providerId === userId);

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    res.json({ data: plan });
  } catch (error) {
    console.error('Error fetching treatment plan:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch treatment plan',
    });
  }
});

// Update treatment plan
router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can update treatment plans
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can update treatment plans',
      });
      return;
    }

    const plan = await prisma.treatmentPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Treatment plan not found',
      });
      return;
    }

    // Verify provider owns this plan
    if (plan.providerId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const validatedData = updateTreatmentPlanSchema.parse(req.body);

    const updated = await TreatmentPlanService.updateTreatmentPlan(id, {
      diagnosis: validatedData.diagnosis,
      interventions: validatedData.interventions,
      medications: validatedData.medications,
      frequency: validatedData.frequency,
      reviewDate: validatedData.reviewDate ? new Date(validatedData.reviewDate) : undefined,
      status: validatedData.status,
    });

    res.json({
      data: updated,
      message: 'Treatment plan updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error updating treatment plan:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update treatment plan',
    });
  }
});

// Add goal to treatment plan
router.post('/:id/goals', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can add goals
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can add goals',
      });
      return;
    }

    const plan = await prisma.treatmentPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Treatment plan not found',
      });
      return;
    }

    if (plan.providerId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const validatedData = addGoalSchema.parse(req.body);

    const goal = await TreatmentPlanService.addGoal({
      treatmentPlanId: id,
      description: validatedData.description,
      targetDate: validatedData.targetDate ? new Date(validatedData.targetDate) : undefined,
      strategies: validatedData.strategies,
      measurements: validatedData.measurements,
    });

    res.status(201).json({
      data: goal,
      message: 'Goal added successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error adding goal:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add goal',
    });
  }
});

// Update goal
router.patch('/goals/:goalId', requireUser, async (req: UserRequest, res) => {
  try {
    const { goalId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can update goals
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can update goals',
      });
      return;
    }

    const goal = await prisma.treatmentGoal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Goal not found',
      });
      return;
    }

    const plan = await prisma.treatmentPlan.findUnique({
      where: { id: goal.treatmentPlanId },
    });

    if (!plan || plan.providerId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const validatedData = updateGoalSchema.parse(req.body);

    const updated = await TreatmentPlanService.updateGoalProgress(goalId, validatedData);

    res.json({
      data: updated,
      message: 'Goal updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error updating goal:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update goal',
    });
  }
});

// Get treatment plan progress
router.get('/:id/progress', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const plan = await prisma.treatmentPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Treatment plan not found',
      });
      return;
    }

    // Check access
    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && plan.patientId === userId) ||
      (userRole === 'provider' && plan.providerId === userId);

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const progress = await TreatmentPlanService.calculatePlanProgress(id);

    res.json({ data: progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch progress',
    });
  }
});

export default router;
