import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

const createCarePlanSchema = z.object({
  patientId: z.string().uuid(),
  condition: z.string(),
  goals: z.record(z.any()),
  interventions: z.record(z.any()),
  reviewSchedule: z.string().optional(),
  nextReviewDate: z.string().datetime().optional(),
});

router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const where: any = {};

    if (userRole === 'patient') {
      where.patientId = userId;
    } else if (userRole === 'provider') {
      where.providerId = userId;
    }

    const carePlans = await prisma.carePlan.findMany({
      where,
      include: { tasks: true, vitals: { take: 10, orderBy: { recordedAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: carePlans, count: carePlans.length });
  } catch (error) {
    console.error('Error fetching care plans:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch care plans' });
  }
});

router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    if (req.user!.role !== 'provider') {
      res.status(403).json({ error: 'Forbidden', message: 'Only providers can create care plans' });
      return;
    }

    const validatedData = createCarePlanSchema.parse(req.body);
    const carePlan = await prisma.carePlan.create({
      data: {
        patientId: validatedData.patientId,
        condition: validatedData.condition,
        goals: validatedData.goals,
        interventions: validatedData.interventions,
        reviewSchedule: validatedData.reviewSchedule,
        providerId: userId,
        nextReviewDate: validatedData.nextReviewDate ? new Date(validatedData.nextReviewDate) : null,
      },
    });

    res.status(201).json({ data: carePlan, message: 'Care plan created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating care plan:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create care plan' });
  }
});

export default router;
