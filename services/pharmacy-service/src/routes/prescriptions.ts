import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

const createPrescriptionSchema = z.object({
  patientId: z.string().uuid(),
  encounterId: z.string().uuid().optional(),
  items: z.array(z.object({
    medicationName: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string().optional(),
    quantity: z.number().optional(),
    refillsAllowed: z.number().default(0),
    instructions: z.string().optional(),
    isGenericAllowed: z.boolean().default(true),
  })),
  notes: z.string().optional(),
  validUntil: z.string().datetime().optional(),
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

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: prescriptions, count: prescriptions.length });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch prescriptions' });
  }
});

router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!prescription) {
      res.status(404).json({ error: 'Not Found', message: 'Prescription not found' });
      return;
    }

    const hasAccess = (userRole === 'patient' && prescription.patientId === userId) ||
                      (userRole === 'provider' && prescription.providerId === userId);

    if (!hasAccess) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    res.json({ data: prescription });
  } catch (error) {
    console.error('Error fetching prescription:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch prescription' });
  }
});

router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    if (req.user!.role !== 'provider') {
      res.status(403).json({ error: 'Forbidden', message: 'Only providers can create prescriptions' });
      return;
    }

    const validatedData = createPrescriptionSchema.parse(req.body);

    const prescription = await prisma.prescription.create({
      data: {
        patientId: validatedData.patientId,
        providerId: userId,
        encounterId: validatedData.encounterId,
        notes: validatedData.notes,
        validUntil: validatedData.validUntil ? new Date(validatedData.validUntil) : null,
        items: { create: validatedData.items },
      },
      include: { items: true },
    });

    res.status(201).json({ data: prescription, message: 'Prescription created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating prescription:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create prescription' });
  }
});

export default router;
