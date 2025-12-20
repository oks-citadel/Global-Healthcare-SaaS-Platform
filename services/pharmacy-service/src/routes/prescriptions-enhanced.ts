import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import PrescriptionService from '../services/PrescriptionService';

const router = Router();
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
    ndcCode: z.string().optional(),
    rxNormCode: z.string().optional(),
    deaSchedule: z.string().optional(),
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
                      (userRole === 'provider' && prescription.providerId === userId) ||
                      (userRole === 'pharmacist') ||
                      (userRole === 'admin');

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

    const prescription = await PrescriptionService.createPrescription({
      ...validatedData,
      providerId: userId,
      validUntil: validatedData.validUntil ? new Date(validatedData.validUntil) : undefined,
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

router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const { status, notes, validUntil } = req.body;

    if (req.user!.role !== 'provider' && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const prescription = await PrescriptionService.updatePrescription(id, {
      status,
      notes,
      validUntil: validUntil ? new Date(validUntil) : undefined,
    });

    res.json({ data: prescription, message: 'Prescription updated successfully' });
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update prescription' });
  }
});

router.post('/:id/refill', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const { prescriptionItemId, pharmacyId } = req.body;

    if (!prescriptionItemId || !pharmacyId) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'prescriptionItemId and pharmacyId are required',
      });
      return;
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!prescription) {
      res.status(404).json({ error: 'Not Found', message: 'Prescription not found' });
      return;
    }

    const item = prescription.items.find((i) => i.id === prescriptionItemId);
    if (!item) {
      res.status(404).json({ error: 'Not Found', message: 'Prescription item not found' });
      return;
    }

    if (item.refillsUsed >= item.refillsAllowed) {
      res.status(400).json({
        error: 'Refill Error',
        message: 'No refills remaining. Please contact your provider.',
      });
      return;
    }

    res.json({
      message: 'Refill request submitted successfully',
      data: {
        prescriptionId: id,
        prescriptionItemId,
        pharmacyId,
        refillsRemaining: item.refillsAllowed - item.refillsUsed,
      },
    });
  } catch (error) {
    console.error('Error requesting refill:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to request refill' });
  }
});

router.get('/:id/refills-remaining', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const { itemId } = req.query;

    if (!itemId) {
      res.status(400).json({ error: 'Validation Error', message: 'itemId is required' });
      return;
    }

    const refillInfo = await PrescriptionService.getRefillsRemaining(itemId as string);

    if (!refillInfo) {
      res.status(404).json({ error: 'Not Found', message: 'Prescription item not found' });
      return;
    }

    res.json({ data: refillInfo });
  } catch (error) {
    console.error('Error fetching refills:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch refills' });
  }
});

export default router;
