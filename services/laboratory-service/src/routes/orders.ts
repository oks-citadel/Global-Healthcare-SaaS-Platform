import { Router, Response } from 'express';
import { PrismaClient, Prisma } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

const createOrderSchema = z.object({
  patientId: z.string().uuid(),
  encounterId: z.string().uuid().optional(),
  priority: z.enum(['routine', 'urgent', 'stat']).default('routine'),
  tests: z.array(z.object({
    testCode: z.string(),
    testName: z.string(),
    category: z.enum(['hematology', 'biochemistry', 'immunology', 'microbiology', 'pathology', 'radiology', 'cardiology', 'endocrinology', 'other']),
  })),
  clinicalInfo: z.string().optional(),
});

router.get('/', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const where: Prisma.LabOrderWhereInput = {};

    if (userRole === 'patient') {
      where.patientId = userId;
    } else if (userRole === 'provider') {
      where.providerId = userId;
    }

    const orders = await prisma.labOrder.findMany({
      where,
      include: { tests: { include: { results: true } } },
      orderBy: { orderedAt: 'desc' },
    });

    res.json({ data: orders, count: orders.length });
  } catch (error) {
    console.error('Error fetching lab orders:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch lab orders' });
  }
});

router.get('/:id', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const order = await prisma.labOrder.findUnique({
      where: { id },
      include: { tests: { include: { results: true } } },
    });

    if (!order) {
      res.status(404).json({ error: 'Not Found', message: 'Lab order not found' });
      return;
    }

    const hasAccess = (userRole === 'patient' && order.patientId === userId) ||
                      (userRole === 'provider' && order.providerId === userId);

    if (!hasAccess) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    res.json({ data: order });
  } catch (error) {
    console.error('Error fetching lab order:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch lab order' });
  }
});

router.post('/', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    if (req.user!.role !== 'provider') {
      res.status(403).json({ error: 'Forbidden', message: 'Only providers can create lab orders' });
      return;
    }

    const validatedData = createOrderSchema.parse(req.body);

    const orderNumber = `LAB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await prisma.labOrder.create({
      data: {
        patientId: validatedData.patientId,
        providerId: userId,
        encounterId: validatedData.encounterId,
        orderNumber,
        priority: validatedData.priority,
        clinicalInfo: validatedData.clinicalInfo,
        tests: { create: validatedData.tests },
      },
      include: { tests: true },
    });

    res.status(201).json({ data: order, message: 'Lab order created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating lab order:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create lab order' });
  }
});

router.patch('/:id/status', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.labOrder.update({
      where: { id },
      data: {
        status,
        ...(status === 'collected' && { collectedAt: new Date() }),
        ...(status === 'completed' && { completedAt: new Date() }),
      },
    });

    res.json({ data: order, message: 'Lab order status updated' });
  } catch (error) {
    console.error('Error updating lab order:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update lab order' });
  }
});

export default router;
