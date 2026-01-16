import { Router } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import GoalService from '../services/GoalService';

const router: ReturnType<typeof Router> = Router();

const createGoalSchema = z.object({
  patientId: z.string().uuid(),
  carePlanId: z.string().uuid().optional(),
  title: z.string(),
  description: z.string().optional(),
  goalType: z.enum(['vital_sign', 'activity', 'lifestyle', 'clinical_outcome', 'weight_loss', 'blood_pressure', 'blood_glucose', 'exercise', 'medication_adherence', 'diet', 'sleep', 'stress_management', 'other']),
  targetValue: z.number().optional(),
  targetUnit: z.string().optional(),
  targetDate: z.string().datetime().optional(),
  frequency: z.string().optional(),
});

const updateGoalSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  targetValue: z.number().optional(),
  targetUnit: z.string().optional(),
  targetDate: z.string().datetime().optional(),
  frequency: z.string().optional(),
  status: z.enum(['active', 'completed', 'paused', 'cancelled']).optional(),
});

const recordProgressSchema = z.object({
  currentValue: z.number().optional(),
  currentUnit: z.string().optional(),
  notes: z.string().optional(),
  recordedAt: z.string().datetime().optional(),
});

router.get('/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check access
    if (userRole === 'patient' && patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const { carePlanId, status, goalType } = req.query;

    const goals = await GoalService.getGoalsByPatient(patientId, {
      carePlanId: carePlanId as string | undefined,
      status: status as any,
      goalType: goalType as any,
    });

    res.json({ data: goals, count: goals.length });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch goals' });
  }
});

router.get('/:patientId/summary', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check access
    if (userRole === 'patient' && patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const summary = await GoalService.getActiveGoalsSummary(patientId);

    res.json({ data: summary, count: summary.length });
  } catch (error) {
    console.error('Error fetching goals summary:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch goals summary' });
  }
});

router.get('/detail/:goalId', requireUser, async (req: UserRequest, res) => {
  try {
    const { goalId } = req.params;
    const goal = await GoalService.getGoalById(goalId);

    if (!goal) {
      res.status(404).json({ error: 'Not Found', message: 'Goal not found' });
      return;
    }

    // Check access
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'patient' && goal.patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    res.json({ data: goal });
  } catch (error) {
    console.error('Error fetching goal:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch goal' });
  }
});

router.get('/detail/:goalId/statistics', requireUser, async (req: UserRequest, res) => {
  try {
    const { goalId } = req.params;
    const goal = await GoalService.getGoalById(goalId);

    if (!goal) {
      res.status(404).json({ error: 'Not Found', message: 'Goal not found' });
      return;
    }

    // Check access
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'patient' && goal.patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const statistics = await GoalService.getGoalStatistics(goalId);

    if (!statistics) {
      res.status(404).json({ error: 'Not Found', message: 'No statistics available for this goal' });
      return;
    }

    res.json({ data: statistics });
  } catch (error) {
    console.error('Error fetching goal statistics:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch goal statistics' });
  }
});

router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const validatedData = createGoalSchema.parse(req.body);

    // Check if user is creating goal for themselves or if provider is creating for patient
    if (validatedData.patientId !== userId && userRole !== 'provider') {
      res.status(403).json({ error: 'Forbidden', message: 'Only providers can create goals for other patients' });
      return;
    }

    const goal = await GoalService.createGoal({
      patientId: validatedData.patientId,
      carePlanId: validatedData.carePlanId,
      title: validatedData.title,
      description: validatedData.description,
      goalType: validatedData.goalType as any,
      targetValue: validatedData.targetValue,
      targetUnit: validatedData.targetUnit,
      frequency: validatedData.frequency,
      targetDate: validatedData.targetDate ? new Date(validatedData.targetDate) : undefined,
    });

    res.status(201).json({ data: goal, message: 'Goal created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create goal' });
  }
});

router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateGoalSchema.parse(req.body);

    // Check if goal exists
    const goal = await GoalService.getGoalById(id);

    if (!goal) {
      res.status(404).json({ error: 'Not Found', message: 'Goal not found' });
      return;
    }

    // Check access
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'patient' && goal.patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const updateData: any = { ...validatedData };
    if (validatedData.targetDate) {
      updateData.targetDate = new Date(validatedData.targetDate);
    }

    const updatedGoal = await GoalService.updateGoal(id, updateData);

    res.json({ data: updatedGoal, message: 'Goal updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update goal' });
  }
});

router.post('/:id/progress', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const validatedData = recordProgressSchema.parse(req.body);

    // Check if goal exists
    const goal = await GoalService.getGoalById(id);

    if (!goal) {
      res.status(404).json({ error: 'Not Found', message: 'Goal not found' });
      return;
    }

    // Check access
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'patient' && goal.patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const progress = await GoalService.recordProgress(id, {
      recordedAt: validatedData.recordedAt ? new Date(validatedData.recordedAt) : undefined,
    });

    res.status(201).json({ data: progress, message: 'Progress recorded successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error recording progress:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to record progress' });
  }
});

router.get('/:id/progress', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;

    // Check if goal exists
    const goal = await GoalService.getGoalById(id);

    if (!goal) {
      res.status(404).json({ error: 'Not Found', message: 'Goal not found' });
      return;
    }

    // Check access
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'patient' && goal.patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const progress = await GoalService.getGoalProgress(
      id,
      limit ? parseInt(limit as string) : undefined
    );

    res.json({ data: progress, count: progress.length });
  } catch (error) {
    console.error('Error fetching goal progress:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch goal progress' });
  }
});

router.delete('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    // Check if goal exists
    const goal = await GoalService.getGoalById(id);

    if (!goal) {
      res.status(404).json({ error: 'Not Found', message: 'Goal not found' });
      return;
    }

    // Check access
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'patient' && goal.patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    await GoalService.deleteGoal(id);

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete goal' });
  }
});

export default router;
