import { Router } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import PriorAuthService from '../services/PriorAuthService';

const router = Router();

const createPriorAuthSchema = z.object({
  prescriptionId: z.string().uuid(),
  prescriptionItemId: z.string().uuid(),
  patientId: z.string().uuid(),
  providerId: z.string().uuid(),
  payerId: z.string().uuid().optional(),
  medicationName: z.string(),
  ndcCode: z.string().optional(),
  diagnosis: z.array(z.string()),
  justification: z.string(),
  supportingDocs: z.any().optional(),
});

const approvePriorAuthSchema = z.object({
  authorizationNumber: z.string(),
  expirationDate: z.string().datetime().optional(),
  reviewerNotes: z.string().optional(),
});

const denyPriorAuthSchema = z.object({
  denialReason: z.string(),
  reviewerNotes: z.string().optional(),
});

/**
 * POST /prior-auth
 * Submit prior authorization request
 */
router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'provider' && req.user!.role !== 'pharmacist') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers and pharmacists can submit prior authorization requests',
      });
      return;
    }

    const validatedData = createPriorAuthSchema.parse(req.body);

    const priorAuth = await PriorAuthService.submitPriorAuth(validatedData);

    res.status(201).json({
      data: priorAuth,
      message: 'Prior authorization request submitted successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }

    console.error('Error submitting prior auth:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit prior authorization',
    });
  }
});

/**
 * GET /prior-auth
 * List prior authorizations
 */
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId, providerId, status, limit, offset } = req.query;

    const result = await PriorAuthService.listPriorAuths({
      patientId: patientId as string | undefined,
      providerId: providerId as string | undefined,
      status: status as any,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    res.json({
      data: result.priorAuths,
      total: result.total,
      count: result.priorAuths.length,
    });
  } catch (error) {
    console.error('Error fetching prior auths:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch prior authorizations',
    });
  }
});

/**
 * GET /prior-auth/:id
 * Get prior authorization details
 */
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    const priorAuth = await PriorAuthService.getPriorAuth(id);

    if (!priorAuth) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Prior authorization not found',
      });
      return;
    }

    res.json({ data: priorAuth });
  } catch (error) {
    console.error('Error fetching prior auth:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch prior authorization',
    });
  }
});

/**
 * POST /prior-auth/:id/approve
 * Approve prior authorization
 */
router.post('/:id/approve', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can approve prior authorizations',
      });
      return;
    }

    const { id } = req.params;
    const validatedData = approvePriorAuthSchema.parse(req.body);

    const priorAuth = await PriorAuthService.approvePriorAuth(id, {
      ...validatedData,
      expirationDate: validatedData.expirationDate
        ? new Date(validatedData.expirationDate)
        : undefined,
    });

    res.json({
      data: priorAuth,
      message: 'Prior authorization approved',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }

    console.error('Error approving prior auth:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to approve prior authorization',
    });
  }
});

/**
 * POST /prior-auth/:id/deny
 * Deny prior authorization
 */
router.post('/:id/deny', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can deny prior authorizations',
      });
      return;
    }

    const { id } = req.params;
    const validatedData = denyPriorAuthSchema.parse(req.body);

    const priorAuth = await PriorAuthService.denyPriorAuth(id, validatedData);

    res.json({
      data: priorAuth,
      message: 'Prior authorization denied',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }

    console.error('Error denying prior auth:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to deny prior authorization',
    });
  }
});

/**
 * POST /prior-auth/:id/appeal
 * Appeal denied prior authorization
 */
router.post('/:id/appeal', requireUser, async (req: UserRequest, res) => {
  try {
    if (req.user!.role !== 'provider' && req.user!.role !== 'admin') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Only providers can appeal prior authorizations',
      });
      return;
    }

    const { id } = req.params;
    const { appealNotes } = req.body;

    if (!appealNotes) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Appeal notes are required',
      });
      return;
    }

    const priorAuth = await PriorAuthService.appealPriorAuth(id, appealNotes);

    res.json({
      data: priorAuth,
      message: 'Prior authorization appeal submitted',
    });
  } catch (error: any) {
    console.error('Error appealing prior auth:', error);
    res.status(500).json({
      error: 'Appeal Error',
      message: error.message || 'Failed to appeal prior authorization',
    });
  }
});

/**
 * GET /prior-auth/check-required/:medicationId
 * Check if medication requires prior authorization
 */
router.get(
  '/check-required/:medicationId',
  requireUser,
  async (req: UserRequest, res) => {
    try {
      const { medicationId } = req.params;

      const required = await PriorAuthService.checkPriorAuthRequired(medicationId);

      res.json({
        medicationId,
        requiresPriorAuth: required,
      });
    } catch (error) {
      console.error('Error checking prior auth requirement:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to check prior auth requirement',
      });
    }
  }
);

/**
 * GET /prior-auth/check-active/:patientId/:medicationName
 * Check if patient has active prior auth for medication
 */
router.get(
  '/check-active/:patientId/:medicationName',
  requireUser,
  async (req: UserRequest, res) => {
    try {
      const { patientId, medicationName } = req.params;

      const result = await PriorAuthService.hasActivePriorAuth(
        patientId,
        decodeURIComponent(medicationName)
      );

      res.json({
        patientId,
        medicationName,
        hasActivePriorAuth: result.hasAuth,
        priorAuth: result.priorAuth,
      });
    } catch (error) {
      console.error('Error checking active prior auth:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to check active prior auth',
      });
    }
  }
);

/**
 * GET /prior-auth/expiring-soon
 * Get prior authorizations expiring soon
 */
router.get('/expiring-soon', requireUser, async (req: UserRequest, res) => {
  try {
    const { daysAhead } = req.query;
    const days = daysAhead ? parseInt(daysAhead as string) : 30;

    const expiring = await PriorAuthService.getExpiringSoon(days);

    res.json({
      data: expiring,
      count: expiring.length,
      daysAhead: days,
    });
  } catch (error) {
    console.error('Error fetching expiring prior auths:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch expiring prior authorizations',
    });
  }
});

/**
 * GET /prior-auth/statistics
 * Get prior authorization statistics
 */
router.get('/statistics', requireUser, async (req: UserRequest, res) => {
  try {
    const { providerId, startDate, endDate } = req.query;

    const stats = await PriorAuthService.getStatistics({
      providerId: providerId as string | undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.json({ data: stats });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch statistics',
    });
  }
});

export default router;
