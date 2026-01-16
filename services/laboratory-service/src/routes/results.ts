import { Router, Response } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

const createResultSchema = z.object({
  testId: z.string().uuid(),
  componentName: z.string(),
  value: z.string(),
  unit: z.string().optional(),
  referenceRange: z.string().optional(),
  isAbnormal: z.boolean().default(false),
  abnormalFlag: z.string().optional(),
  notes: z.string().optional(),
  performedBy: z.string().optional(),
  verifiedBy: z.string().optional(),
});

router.get('/patient/:patientId', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole === 'patient' && patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const results = await prisma.labResult.findMany({
      where: {
        test: {
          order: {
            patientId,
            status: 'completed',
          },
        },
      },
      include: {
        test: {
          include: {
            order: {
              select: {
                orderNumber: true,
                orderedAt: true,
              },
            },
          },
        },
      },
      orderBy: { resultedAt: 'desc' },
    });

    res.json({ data: results, count: results.length });
  } catch (error) {
    console.error('Error fetching lab results:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch lab results' });
  }
});

router.post('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    if (req.user!.role !== 'provider' && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden', message: 'Only authorized personnel can add results' });
      return;
    }

    const validatedData = createResultSchema.parse(req.body);

    const result = await prisma.labResult.create({
      data: validatedData as any,
    });

    // Update test status
    await prisma.labTest.update({
      where: { id: validatedData.testId },
      data: { status: 'completed' },
    });

    res.status(201).json({ data: result, message: 'Lab result added successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating lab result:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create lab result' });
  }
});

export default router;
