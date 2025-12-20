import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router = Router();
const prisma = new PrismaClient();

const addMedicationSchema = z.object({
  name: z.string(),
  genericName: z.string().optional(),
  brandNames: z.array(z.string()).default([]),
  strength: z.string(),
  dosageForm: z.string(),
  manufacturer: z.string().optional(),
  ndcCode: z.string().optional(),
  rxNormCode: z.string().optional(),
  description: z.string().optional(),
  sideEffects: z.array(z.string()).default([]),
  contraindications: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  isControlled: z.boolean().default(false),
  deaSchedule: z.string().optional(),
  requiresPriorAuth: z.boolean().default(false),
  isFormulary: z.boolean().default(true),
  therapeuticClass: z.string().optional(),
});

/**
 * GET /formulary
 * Search formulary
 */
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const {
      search,
      genericName,
      therapeuticClass,
      isFormulary,
      isControlled,
      deaSchedule,
      requiresPriorAuth,
      limit,
      offset,
    } = req.query;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { genericName: { contains: search as string, mode: 'insensitive' } },
        { brandNames: { has: search as string } },
      ];
    }

    if (genericName) {
      where.genericName = { contains: genericName as string, mode: 'insensitive' };
    }

    if (therapeuticClass) {
      where.therapeuticClass = therapeuticClass;
    }

    if (isFormulary !== undefined) {
      where.isFormulary = isFormulary === 'true';
    }

    if (isControlled !== undefined) {
      where.isControlled = isControlled === 'true';
    }

    if (deaSchedule) {
      where.deaSchedule = deaSchedule;
    }

    if (requiresPriorAuth !== undefined) {
      where.requiresPriorAuth = requiresPriorAuth === 'true';
    }

    const [medications, total] = await Promise.all([
      prisma.medication.findMany({
        where,
        orderBy: { name: 'asc' },
        take: limit ? parseInt(limit as string) : 50,
        skip: offset ? parseInt(offset as string) : 0,
      }),
      prisma.medication.count({ where }),
    ]);

    res.json({
      data: medications,
      total,
      count: medications.length,
    });
  } catch (error) {
    console.error('Error searching formulary:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search formulary',
    });
  }
});

/**
 * GET /formulary/:id
 * Get medication details
 */
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    const medication = await prisma.medication.findUnique({
      where: { id },
      include: {
        inventory: {
          where: { isActive: true },
        },
      },
    });

    if (!medication) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Medication not found',
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

/**
 * POST /formulary
 * Add medication to formulary
 */
router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can add medications to formulary',
      });
      return;
    }

    const validatedData = addMedicationSchema.parse(req.body);

    const medication = await prisma.medication.create({
      data: validatedData,
    });

    res.status(201).json({
      data: medication,
      message: 'Medication added to formulary successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }

    console.error('Error adding medication:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add medication to formulary',
    });
  }
});

/**
 * PATCH /formulary/:id
 * Update medication in formulary
 */
router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can update medications in formulary',
      });
      return;
    }

    const { id } = req.params;
    const updates = req.body;

    const medication = await prisma.medication.update({
      where: { id },
      data: updates,
    });

    res.json({
      data: medication,
      message: 'Medication updated successfully',
    });
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update medication',
    });
  }
});

/**
 * DELETE /formulary/:id
 * Deactivate medication in formulary
 */
router.delete('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can deactivate medications in formulary',
      });
      return;
    }

    const { id } = req.params;

    const medication = await prisma.medication.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({
      data: medication,
      message: 'Medication deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating medication:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to deactivate medication',
    });
  }
});

/**
 * GET /formulary/by-ndc/:ndcCode
 * Look up medication by NDC code
 */
router.get('/by-ndc/:ndcCode', requireUser, async (req: UserRequest, res) => {
  try {
    const { ndcCode } = req.params;

    const medication = await prisma.medication.findUnique({
      where: { ndcCode },
    });

    if (!medication) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Medication not found with this NDC code',
      });
      return;
    }

    res.json({ data: medication });
  } catch (error) {
    console.error('Error looking up medication:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to look up medication',
    });
  }
});

/**
 * GET /formulary/controlled-substances
 * Get all controlled substances
 */
router.get('/controlled-substances', requireUser, async (req: UserRequest, res) => {
  try {
    const { deaSchedule } = req.query;

    const where: any = {
      isActive: true,
      isControlled: true,
    };

    if (deaSchedule) {
      where.deaSchedule = deaSchedule;
    }

    const medications = await prisma.medication.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json({
      data: medications,
      count: medications.length,
    });
  } catch (error) {
    console.error('Error fetching controlled substances:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch controlled substances',
    });
  }
});

/**
 * GET /formulary/therapeutic-classes
 * Get list of therapeutic classes
 */
router.get('/therapeutic-classes', requireUser, async (req: UserRequest, res) => {
  try {
    const medications = await prisma.medication.findMany({
      where: { isActive: true },
      select: { therapeuticClass: true },
      distinct: ['therapeuticClass'],
    });

    const classes = medications
      .map((m) => m.therapeuticClass)
      .filter((c): c is string => !!c)
      .sort();

    res.json({
      data: classes,
      count: classes.length,
    });
  } catch (error) {
    console.error('Error fetching therapeutic classes:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch therapeutic classes',
    });
  }
});

export default router;
