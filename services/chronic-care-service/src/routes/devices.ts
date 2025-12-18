import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';

const router = Router();
const prisma = new PrismaClient();

const registerDeviceSchema = z.object({
  deviceType: z.enum(['blood_pressure_monitor', 'glucose_meter', 'pulse_oximeter', 'weight_scale', 'thermometer', 'heart_rate_monitor', 'peak_flow_meter', 'ecg_monitor']),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string(),
});

router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const devices = await prisma.monitoringDevice.findMany({
      where: { patientId: userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: devices, count: devices.length });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch devices' });
  }
});

router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const validatedData = registerDeviceSchema.parse(req.body);

    const device = await prisma.monitoringDevice.create({
      data: { ...validatedData, patientId: userId },
    });

    res.status(201).json({ data: device, message: 'Device registered successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error registering device:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to register device' });
  }
});

export default router;
