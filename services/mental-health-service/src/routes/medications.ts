import { Router, Response } from 'express';
import { PrismaClient, Prisma, PsychMedication } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Type for Prisma where clause
type PsychMedicationWhereInput = Prisma.PsychMedicationWhereInput;

// Validation schemas
const createMedicationSchema = z.object({
  patientId: z.string().uuid(),
  medicationName: z.string(),
  medicationClass: z.enum([
    'antidepressant',
    'antipsychotic',
    'mood_stabilizer',
    'anxiolytic',
    'stimulant',
    'sedative_hypnotic',
    'other',
  ]),
  dosage: z.string(),
  frequency: z.string(),
  route: z.string().default('oral'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  indication: z.string(),
  sideEffects: z.array(z.string()).optional(),
  interactions: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const updateMedicationSchema = z.object({
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  endDate: z.string().datetime().optional(),
  status: z.enum(['active', 'discontinued', 'completed', 'on_hold']).optional(),
  sideEffects: z.array(z.string()).optional(),
  interactions: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Get medications for a patient
router.get('/patient/:patientId', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { status } = req.query;

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

    const where: PsychMedicationWhereInput = { patientId };

    if (status && typeof status === 'string') {
      where.status = status as any;
    }

    const medications = await prisma.psychMedication.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });

    res.json({
      data: medications,
      count: medications.length,
    });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch medications',
    });
  }
});

// Get single medication
router.get('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const medication = await prisma.psychMedication.findUnique({
      where: { id },
    });

    if (!medication) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Medication not found',
      });
      return;
    }

    // Check access
    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && medication.patientId === userId) ||
      (userRole === 'provider' && medication.prescriberId === userId);

    if (!hasAccess) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    res.json({ data: medication });
  } catch (error) {
    console.error('Error fetching medication:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch medication',
    });
  }
});

// Prescribe medication
router.post('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can prescribe medications
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can prescribe medications',
      });
      return;
    }

    const validatedData = createMedicationSchema.parse(req.body);

    const medication = await prisma.psychMedication.create({
      data: {
        patientId: validatedData.patientId,
        prescriberId: userId,
        name: validatedData.medicationName,
        medicationName: validatedData.medicationName,
        medicationClass: validatedData.medicationClass,
        dosage: validatedData.dosage,
        frequency: validatedData.frequency,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        reason: validatedData.indication,
        sideEffects: validatedData.sideEffects || [],
        interactions: validatedData.interactions || [],
        status: 'active',
        notes: validatedData.notes,
      },
    });

    res.status(201).json({
      data: medication,
      message: 'Medication prescribed successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error prescribing medication:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to prescribe medication',
    });
  }
});

// Update medication
router.patch('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can update medications
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can update medications',
      });
      return;
    }

    const medication = await prisma.psychMedication.findUnique({
      where: { id },
    });

    if (!medication) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Medication not found',
      });
      return;
    }

    // Verify provider prescribed this medication
    if (medication.prescriberId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const validatedData = updateMedicationSchema.parse(req.body);

    const updated = await prisma.psychMedication.update({
      where: { id },
      data: {
        ...(validatedData.dosage && { dosage: validatedData.dosage }),
        ...(validatedData.frequency && { frequency: validatedData.frequency }),
        ...(validatedData.endDate && { endDate: new Date(validatedData.endDate) }),
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.sideEffects && { sideEffects: validatedData.sideEffects }),
        ...(validatedData.interactions && { interactions: validatedData.interactions }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
      },
    });

    res.json({
      data: updated,
      message: 'Medication updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }

    console.error('Error updating medication:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update medication',
    });
  }
});

// Discontinue medication
router.post('/:id/discontinue', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Only providers can discontinue medications
    if (userRole !== 'provider') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can discontinue medications',
      });
      return;
    }

    const medication = await prisma.psychMedication.findUnique({
      where: { id },
    });

    if (!medication) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Medication not found',
      });
      return;
    }

    if (medication.prescriberId !== userId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const updated = await prisma.psychMedication.update({
      where: { id },
      data: {
        status: 'discontinued',
        endDate: new Date(),
      },
    });

    res.json({
      data: updated,
      message: 'Medication discontinued successfully',
    });
  } catch (error) {
    console.error('Error discontinuing medication:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to discontinue medication',
    });
  }
});

// Get active medications summary
router.get('/patient/:patientId/active', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
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

    const medications = await prisma.psychMedication.findMany({
      where: {
        patientId,
        status: 'active',
      },
      orderBy: { startDate: 'desc' },
    });

    // Group by medication class
    const byClass: Record<string, PsychMedication[]> = {};

    medications.forEach((med) => {
      const className = med.medicationClass;
      if (!byClass[className]) {
        byClass[className] = [];
      }
      byClass[className].push(med);
    });

    res.json({
      data: {
        medications,
        byClass,
        totalActive: medications.length,
      },
    });
  } catch (error) {
    console.error('Error fetching active medications:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch active medications',
    });
  }
});

export default router;
