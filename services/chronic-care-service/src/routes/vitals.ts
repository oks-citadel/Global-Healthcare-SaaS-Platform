import { Router } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import VitalSignService from '../services/VitalSignService';

const router = Router();

const vitalReadingSchema = z.object({
  vitalType: z.enum(['blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate', 'blood_glucose', 'oxygen_saturation', 'temperature', 'weight', 'respiratory_rate', 'peak_flow']),
  value: z.number(),
  unit: z.string(),
  notes: z.string().optional(),
  recordedAt: z.string().datetime().optional(),
  deviceId: z.string().uuid().optional(),
  carePlanId: z.string().uuid().optional(),
});

const batchVitalReadingsSchema = z.object({
  patientId: z.string().uuid().optional(),
  readings: z.array(vitalReadingSchema),
});

router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const validatedData = vitalReadingSchema.parse(req.body);

    const reading = await VitalSignService.submitVitalReading(userId, {
      ...validatedData,
      recordedAt: validatedData.recordedAt ? new Date(validatedData.recordedAt) : undefined,
    });

    res.status(201).json({ data: reading, message: 'Vital reading recorded successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error recording vital reading:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to record vital reading' });
  }
});

router.post('/batch', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const validatedData = batchVitalReadingsSchema.parse(req.body);

    // If patientId is provided, check if user is provider
    const patientId = validatedData.patientId || userId;

    if (validatedData.patientId && req.user!.role !== 'provider') {
      res.status(403).json({ error: 'Forbidden', message: 'Only providers can submit vitals for other patients' });
      return;
    }

    const processedReadings = validatedData.readings.map(r => ({
      ...r,
      recordedAt: r.recordedAt ? new Date(r.recordedAt) : undefined,
    }));

    const results = await VitalSignService.submitBatchVitalReadings(patientId, processedReadings);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    res.status(201).json({
      data: results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
      },
      message: `Processed ${results.length} vital readings: ${successCount} successful, ${failureCount} failed`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error recording batch vital readings:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to record batch vital readings' });
  }
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

    const { vitalType, startDate, endDate, limit, carePlanId } = req.query;

    const history = await VitalSignService.getVitalHistory(patientId, {
      vitalType: vitalType as any,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      carePlanId: carePlanId as string | undefined,
    });

    res.json({ data: history, count: history.length });
  } catch (error) {
    console.error('Error fetching vital history:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch vital history' });
  }
});

router.get('/:patientId/latest', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check access
    if (userRole === 'patient' && patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const latestVitals = await VitalSignService.getLatestVitalsByPatient(patientId);

    res.json({ data: latestVitals, count: latestVitals.length });
  } catch (error) {
    console.error('Error fetching latest vitals:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch latest vitals' });
  }
});

router.get('/:patientId/statistics', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check access
    if (userRole === 'patient' && patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const { vitalType, startDate, endDate } = req.query;

    if (!vitalType) {
      res.status(400).json({ error: 'Bad Request', message: 'vitalType is required' });
      return;
    }

    const statistics = await VitalSignService.getVitalStatistics(
      patientId,
      vitalType as any,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    if (!statistics) {
      res.status(404).json({ error: 'Not Found', message: 'No data found for the specified parameters' });
      return;
    }

    res.json({ data: statistics });
  } catch (error) {
    console.error('Error fetching vital statistics:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch vital statistics' });
  }
});

router.get('/:patientId/abnormal', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check access
    if (userRole === 'patient' && patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const { limit } = req.query;
    const abnormalReadings = await VitalSignService.getAbnormalReadings(
      patientId,
      limit ? parseInt(limit as string) : undefined
    );

    res.json({ data: abnormalReadings, count: abnormalReadings.length });
  } catch (error) {
    console.error('Error fetching abnormal readings:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch abnormal readings' });
  }
});

export default router;
