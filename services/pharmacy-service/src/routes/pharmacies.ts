import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

const createPharmacySchema = z.object({
  name: z.string(),
  licenseNumber: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
  operatingHours: z.record(z.any()).optional(),
});

router.get('/', async (req, res) => {
  try {
    const pharmacies = await prisma.pharmacy.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    res.json({ data: pharmacies, count: pharmacies.length });
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch pharmacies' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = await prisma.pharmacy.findUnique({ where: { id } });

    if (!pharmacy) {
      res.status(404).json({ error: 'Not Found', message: 'Pharmacy not found' });
      return;
    }

    res.json({ data: pharmacy });
  } catch (error) {
    console.error('Error fetching pharmacy:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch pharmacy' });
  }
});

router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden', message: 'Only admins can create pharmacies' });
      return;
    }

    const validatedData = createPharmacySchema.parse(req.body);
    const pharmacy = await prisma.pharmacy.create({ data: validatedData as any });

    res.status(201).json({ data: pharmacy, message: 'Pharmacy created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating pharmacy:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create pharmacy' });
  }
});

export default router;
