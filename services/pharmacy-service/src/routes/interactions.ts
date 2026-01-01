import { Router } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import InteractionCheckService from '../services/InteractionCheckService';

const router: ReturnType<typeof Router> = Router();

const checkInteractionsSchema = z.object({
  medications: z.array(z.string()).min(2),
});

const checkAllergiesSchema = z.object({
  patientId: z.string().uuid(),
  medications: z.array(z.string()).min(1),
});

const addAllergySchema = z.object({
  patientId: z.string().uuid(),
  allergen: z.string(),
  allergenRxNorm: z.string().optional(),
  reactionType: z.string(),
  symptoms: z.array(z.string()),
  onsetDate: z.string().datetime().optional(),
  verifiedBy: z.string().uuid().optional(),
  notes: z.string().optional(),
});

/**
 * POST /drug-interactions/check
 * Check for drug-drug interactions
 */
router.post('/check', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = checkInteractionsSchema.parse(req.body);

    const result = await InteractionCheckService.checkDrugInteractions(
      validatedData.medications
    );

    res.json({
      data: result,
      message: result.hasCriticalInteractions
        ? 'Critical drug interactions detected'
        : result.hasSevereInteractions
        ? 'Severe drug interactions detected'
        : 'No critical interactions found',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }

    console.error('Error checking drug interactions:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check drug interactions',
    });
  }
});

/**
 * POST /drug-interactions/check-allergies
 * Check for drug-allergy interactions
 */
router.post('/check-allergies', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = checkAllergiesSchema.parse(req.body);

    const result = await InteractionCheckService.checkDrugAllergies(
      validatedData.patientId,
      validatedData.medications
    );

    res.json({
      data: result,
      message: result.hasCriticalAllergies
        ? 'Critical allergies detected - DO NOT DISPENSE'
        : result.hasAllergies
        ? 'Allergies detected - requires review'
        : 'No allergies detected',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }

    console.error('Error checking allergies:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check allergies',
    });
  }
});

/**
 * POST /drug-interactions/safety-check
 * Perform comprehensive safety check (interactions + allergies)
 */
router.post('/safety-check', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId, medications } = req.body;

    if (!patientId || !Array.isArray(medications) || medications.length === 0) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'patientId and medications array are required',
      });
      return;
    }

    const result = await InteractionCheckService.performSafetyCheck(
      patientId,
      medications
    );

    res.json({
      data: result,
      message: result.isSafe
        ? 'Safety check passed'
        : 'Safety concerns detected - review required',
    });
  } catch (error) {
    console.error('Error performing safety check:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to perform safety check',
    });
  }
});

/**
 * GET /drug-interactions/allergies/:patientId
 * Get patient allergies
 */
router.get('/allergies/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId } = req.params;

    const allergies = await InteractionCheckService.getPatientAllergies(patientId);

    res.json({
      data: allergies,
      count: allergies.length,
    });
  } catch (error) {
    console.error('Error fetching allergies:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch allergies',
    });
  }
});

/**
 * POST /drug-interactions/allergies
 * Add patient allergy
 */
router.post('/allergies', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'provider' && req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can add allergies',
      });
      return;
    }

    const validatedData = addAllergySchema.parse(req.body);

    const allergy = await InteractionCheckService.addDrugAllergy({
      ...validatedData,
      onsetDate: validatedData.onsetDate
        ? new Date(validatedData.onsetDate)
        : undefined,
      verifiedBy: validatedData.verifiedBy || req.user!.id,
    } as any);

    res.status(201).json({
      data: allergy,
      message: 'Allergy added successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }

    console.error('Error adding allergy:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add allergy',
    });
  }
});

/**
 * DELETE /drug-interactions/allergies/:id
 * Deactivate patient allergy
 */
router.delete('/allergies/:id', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'provider' && req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can deactivate allergies',
      });
      return;
    }

    const { id } = req.params;

    const allergy = await InteractionCheckService.deactivateAllergy(id);

    res.json({
      data: allergy,
      message: 'Allergy deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating allergy:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to deactivate allergy',
    });
  }
});

export default router;
