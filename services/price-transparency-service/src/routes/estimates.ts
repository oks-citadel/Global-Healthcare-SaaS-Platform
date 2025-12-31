import { Router, Response } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser, requireOrganization } from '../middleware/extractUser';
import estimateService from '../services/estimate.service';
import { GFEStatus } from '../generated/client';

const router: ReturnType<typeof Router> = Router();

// Validation schemas
const createGFESchema = z.object({
  patientId: z.string().uuid(),
  scheduledServiceDate: z.string().datetime().optional(),
  primaryDiagnosis: z.string().optional(),
  primaryDiagnosisCode: z.string().optional(),
  scheduledProcedures: z.array(z.object({
    code: z.string().min(1),
    description: z.string().optional(),
    modifiers: z.array(z.string()).optional(),
    quantity: z.number().int().positive().optional(),
  })).min(1, 'At least one procedure is required'),
  providerNPI: z.string().regex(/^\d{10}$/, 'Invalid NPI format').optional(),
  providerName: z.string().optional(),
  providerType: z.string().optional(),
  facilityNPI: z.string().regex(/^\d{10}$/, 'Invalid NPI format').optional(),
  facilityName: z.string().optional(),
  facilityType: z.string().optional(),
  patientInsuranceType: z.enum(['self_pay', 'commercial', 'medicare', 'medicaid', 'other']).optional(),
  validForDays: z.number().int().min(1).max(365).optional(),
});

const updateGFEStatusSchema = z.object({
  status: z.enum(['pending', 'sent', 'delivered', 'acknowledged', 'expired', 'disputed']),
  deliveredMethod: z.enum(['email', 'portal', 'print', 'mail', 'in_person']).optional(),
});

const addLineItemsSchema = z.object({
  lineItems: z.array(z.object({
    serviceCode: z.string().min(1),
    serviceDescription: z.string().min(1),
    modifiers: z.array(z.string()).optional(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    providerNPI: z.string().optional(),
    providerType: z.string().optional(),
    serviceLocation: z.string().optional(),
    estimatedDate: z.string().datetime().optional(),
    isRecurring: z.boolean().optional(),
    recurringPeriod: z.string().optional(),
    notes: z.string().optional(),
  })).min(1),
});

const calculateResponsibilitySchema = z.object({
  deductibleRemaining: z.number().nonnegative(),
  outOfPocketMax: z.number().nonnegative(),
  coInsurancePercent: z.number().min(0).max(100),
  copayAmount: z.number().nonnegative(),
});

const acknowledgeGFESchema = z.object({
  signature: z.string().min(1, 'Signature is required'),
});

/**
 * @route POST /estimates/gfe
 * @desc Create a new Good Faith Estimate
 * @access Private (requires organization)
 */
router.post('/gfe', requireUser, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    const validation = createGFESchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: validation.error.errors,
      });
      return;
    }

    const organizationId = req.user!.organizationId!;
    const data = validation.data;

    const gfe = await estimateService.createGoodFaithEstimate({
      organizationId,
      patientId: data.patientId,
      scheduledServiceDate: data.scheduledServiceDate ? new Date(data.scheduledServiceDate) : undefined,
      primaryDiagnosis: data.primaryDiagnosis,
      primaryDiagnosisCode: data.primaryDiagnosisCode,
      scheduledProcedures: data.scheduledProcedures.map(p => ({
        code: p.code,
        description: p.description || '',
        modifiers: p.modifiers,
        quantity: p.quantity,
      })),
      providerNPI: data.providerNPI,
      providerName: data.providerName,
      providerType: data.providerType,
      facilityNPI: data.facilityNPI,
      facilityName: data.facilityName,
      facilityType: data.facilityType,
      patientInsuranceType: data.patientInsuranceType,
      validForDays: data.validForDays,
    });

    res.status(201).json({
      data: gfe,
      message: 'Good Faith Estimate created successfully',
    });
  } catch (error) {
    console.error('Error creating GFE:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create Good Faith Estimate',
    });
  }
});

/**
 * @route GET /estimates/gfe/:id
 * @desc Get a Good Faith Estimate by ID
 * @access Private
 */
router.get('/gfe/:id', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const organizationId = req.user!.organizationId;

    const gfe = await estimateService.getGoodFaithEstimate(id, organizationId);

    if (!gfe) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Good Faith Estimate not found',
      });
      return;
    }

    // Check access rights
    if (req.user!.role === 'patient' && gfe.patientId !== req.user!.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    res.json({
      data: gfe,
    });
  } catch (error) {
    console.error('Error fetching GFE:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch Good Faith Estimate',
    });
  }
});

/**
 * @route GET /estimates/gfe/patient/:patientId
 * @desc List Good Faith Estimates for a patient
 * @access Private
 */
router.get('/gfe/patient/:patientId', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { patientId } = req.params;
    const { status } = req.query;
    const organizationId = req.user!.organizationId;

    // Check access rights
    if (req.user!.role === 'patient' && patientId !== req.user!.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const gfeStatus = status as GFEStatus | undefined;
    const gfes = await estimateService.listPatientGFEs(patientId, organizationId, gfeStatus);

    res.json({
      data: gfes,
      count: gfes.length,
    });
  } catch (error) {
    console.error('Error listing patient GFEs:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to list Good Faith Estimates',
    });
  }
});

/**
 * @route PATCH /estimates/gfe/:id/status
 * @desc Update GFE status
 * @access Private (staff only)
 */
router.patch('/gfe/:id/status', requireUser, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    if (req.user!.role === 'patient') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Patients cannot update GFE status',
      });
      return;
    }

    const { id } = req.params;
    const validation = updateGFEStatusSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: validation.error.errors,
      });
      return;
    }

    const { status, deliveredMethod } = validation.data;

    const gfe = await estimateService.updateGFEStatus(id, status as GFEStatus, deliveredMethod);

    res.json({
      data: gfe,
      message: 'GFE status updated successfully',
    });
  } catch (error) {
    console.error('Error updating GFE status:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update GFE status',
    });
  }
});

/**
 * @route POST /estimates/gfe/:id/line-items
 * @desc Add line items to a GFE
 * @access Private (staff only)
 */
router.post('/gfe/:id/line-items', requireUser, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    if (req.user!.role === 'patient') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Patients cannot modify GFE',
      });
      return;
    }

    const { id } = req.params;
    const validation = addLineItemsSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: validation.error.errors,
      });
      return;
    }

    const { lineItems } = validation.data;

    const gfe = await estimateService.addLineItems(id, lineItems.map(item => ({
      ...item,
      estimatedDate: item.estimatedDate ? new Date(item.estimatedDate) : undefined,
    })));

    res.json({
      data: gfe,
      message: 'Line items added successfully',
    });
  } catch (error) {
    console.error('Error adding line items:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        error: 'Not Found',
        message: error.message,
      });
      return;
    }
    if (error instanceof Error && error.message.includes('Cannot modify')) {
      res.status(400).json({
        error: 'Bad Request',
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add line items',
    });
  }
});

/**
 * @route POST /estimates/gfe/:id/calculate-responsibility
 * @desc Calculate patient responsibility based on insurance
 * @access Private
 */
router.post('/gfe/:id/calculate-responsibility', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validation = calculateResponsibilitySchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: validation.error.errors,
      });
      return;
    }

    const { deductibleRemaining, outOfPocketMax, coInsurancePercent, copayAmount } = validation.data;

    const result = await estimateService.calculatePatientResponsibility(
      id,
      deductibleRemaining,
      outOfPocketMax,
      coInsurancePercent,
      copayAmount
    );

    res.json({
      data: result,
      message: 'Patient responsibility calculated successfully',
    });
  } catch (error) {
    console.error('Error calculating responsibility:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({
        error: 'Not Found',
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to calculate patient responsibility',
    });
  }
});

/**
 * @route POST /estimates/gfe/:id/acknowledge
 * @desc Patient acknowledges receipt of GFE
 * @access Private (patient only)
 */
router.post('/gfe/:id/acknowledge', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validation = acknowledgeGFESchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: validation.error.errors,
      });
      return;
    }

    // Verify this is the patient's GFE
    const existingGFE = await estimateService.getGoodFaithEstimate(id);
    if (!existingGFE) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Good Faith Estimate not found',
      });
      return;
    }

    if (req.user!.role === 'patient' && existingGFE.patientId !== req.user!.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You can only acknowledge your own GFE',
      });
      return;
    }

    const { signature } = validation.data;
    const gfe = await estimateService.recordPatientAcknowledgment(id, signature);

    res.json({
      data: gfe,
      message: 'GFE acknowledged successfully',
    });
  } catch (error) {
    console.error('Error acknowledging GFE:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to acknowledge GFE',
    });
  }
});

/**
 * @route GET /estimates/gfe/expiring
 * @desc Get GFEs that are about to expire
 * @access Private (staff only)
 */
router.get('/gfe/expiring', requireUser, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    if (req.user!.role === 'patient') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const daysUntilExpiration = parseInt(req.query.days as string) || 30;
    const expiringGFEs = await estimateService.getExpiringGFEs(daysUntilExpiration);

    res.json({
      data: expiringGFEs,
      count: expiringGFEs.length,
      daysUntilExpiration,
    });
  } catch (error) {
    console.error('Error fetching expiring GFEs:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch expiring GFEs',
    });
  }
});

/**
 * @route POST /estimates/gfe/mark-expired
 * @desc Mark all expired GFEs as expired
 * @access Private (admin only)
 */
router.post('/gfe/mark-expired', requireUser, requireOrganization, async (req: UserRequest, res: Response) => {
  try {
    if (req.user!.role !== 'admin' && req.user!.role !== 'billing_admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required',
      });
      return;
    }

    const count = await estimateService.markExpiredGFEs();

    res.json({
      message: `${count} GFEs marked as expired`,
      count,
    });
  } catch (error) {
    console.error('Error marking expired GFEs:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to mark expired GFEs',
    });
  }
});

export default router;
