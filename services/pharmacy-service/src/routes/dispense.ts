import { Router, Response } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import DispenseService from '../services/DispenseService';

const router: ReturnType<typeof Router> = Router();

const dispenseSchema = z.object({
  prescriptionId: z.string().uuid(),
  prescriptionItemId: z.string().uuid(),
  medicationId: z.string().uuid(),
  patientId: z.string().uuid(),
  pharmacyId: z.string().uuid(),
  quantityDispensed: z.number().positive(),
  ndcCode: z.string().optional(),
  lotNumber: z.string().optional(),
  expirationDate: z.string().datetime().optional(),
  daysSupply: z.number().positive().optional(),
  priorAuthId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

/**
 * POST /dispense
 * Dispense medication with full safety checks
 */
router.post('/', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const pharmacistId = req.user!.id;

    if (req.user!.role !== 'pharmacist' && req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only pharmacists can dispense medication',
      });
      return;
    }

    const validatedData = dispenseSchema.parse(req.body);

    const result = await DispenseService.dispenseMedication({
      ...validatedData,
      pharmacistId,
      expirationDate: validatedData.expirationDate
        ? new Date(validatedData.expirationDate)
        : undefined,
    } as any);

    res.status(201).json({
      data: result,
      message: 'Medication dispensed successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }

    console.error('Error dispensing medication:', error);
    res.status(500).json({
      error: 'Dispensing Error',
      message: error.message || 'Failed to dispense medication',
    });
  }
});

/**
 * GET /dispense/patient/:patientId
 * Get dispensing history for a patient
 */
router.get('/patient/:patientId', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { patientId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const history = await DispenseService.getPatientDispensingHistory(
      patientId,
      limit
    );

    res.json({
      data: history,
      count: history.length,
    });
  } catch (error) {
    console.error('Error fetching dispensing history:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch dispensing history',
    });
  }
});

/**
 * GET /dispense/:id
 * Get specific dispensing record
 */
router.get('/:id', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const dispensing = await DispenseService.getDispensing(id);

    if (!dispensing) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Dispensing record not found',
      });
      return;
    }

    res.json({ data: dispensing });
  } catch (error) {
    console.error('Error fetching dispensing:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch dispensing record',
    });
  }
});

/**
 * POST /dispense/:id/return
 * Return dispensed medication
 */
router.post('/:id/return', requireUser, async (req: UserRequest, res: Response) => {
  try {
    if (req.user!.role !== 'pharmacist' && req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only pharmacists can process medication returns',
      });
      return;
    }

    const { id } = req.params;
    const { quantityReturned } = req.body;

    if (!quantityReturned || quantityReturned <= 0) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Valid quantity returned is required',
      });
      return;
    }

    const result = await DispenseService.returnMedication(id, quantityReturned);

    res.json({
      data: result,
      message: 'Medication returned successfully',
    });
  } catch (error: any) {
    console.error('Error processing return:', error);
    res.status(500).json({
      error: 'Return Error',
      message: error.message || 'Failed to process medication return',
    });
  }
});

/**
 * GET /dispense/current-medications/:patientId
 * Get current medications for a patient
 */
router.get(
  '/current-medications/:patientId',
  requireUser,
  async (req: UserRequest, res: Response) => {
    try {
      const { patientId } = req.params;

      const medications = await DispenseService.getPatientCurrentMedications(
        patientId
      );

      res.json({
        data: medications,
        count: medications.length,
      });
    } catch (error) {
      console.error('Error fetching current medications:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch current medications',
      });
    }
  }
);

export default router;
