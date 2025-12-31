import { Router, Response } from 'express';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import priceService from '../services/price.service';

const router: ReturnType<typeof Router> = Router();

// Validation schemas
const priceLookupSchema = z.object({
  serviceCode: z.string().min(1, 'Service code is required'),
  payerId: z.string().uuid().optional(),
  zipCode: z.string().regex(/^\d{5}$/, 'Invalid ZIP code').optional(),
});

const priceComparisonSchema = z.object({
  serviceCode: z.string().min(1, 'Service code is required'),
  zipCode: z.string().regex(/^\d{5}$/, 'ZIP code is required'),
  radiusMiles: z.number().min(1).max(100).optional().default(25),
});

const createEstimateSchema = z.object({
  patientId: z.string().uuid().optional(),
  serviceCode: z.string().min(1),
  serviceDescription: z.string().min(1),
  diagnosisCode: z.string().optional(),
  diagnosisDescription: z.string().optional(),
  payerId: z.string().uuid().optional(),
  payerName: z.string().optional(),
  planType: z.string().optional(),
  grossCharge: z.number().positive(),
  negotiatedRate: z.number().positive().optional(),
  discountedCashPrice: z.number().positive().optional(),
  estimatedInsPayment: z.number().nonnegative().optional(),
  estimatedPatientResp: z.number().nonnegative().optional(),
  deductibleRemaining: z.number().nonnegative().optional(),
  outOfPocketRemaining: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  validDays: z.number().min(1).max(365).optional(),
});

const chargemasterSearchSchema = z.object({
  searchTerm: z.string().optional(),
  cptCode: z.string().optional(),
  hcpcsCode: z.string().optional(),
  department: z.string().optional(),
  isShoppable: z.enum(['true', 'false']).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  offset: z.string().regex(/^\d+$/).optional(),
});

/**
 * @route GET /prices/lookup
 * @desc Look up price for a specific service
 * @access Private
 */
router.get('/lookup', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const validation = priceLookupSchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: validation.error.errors,
      });
      return;
    }

    const { serviceCode, payerId, zipCode } = validation.data;
    const organizationId = req.user!.organizationId;

    if (!organizationId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Organization context required',
      });
      return;
    }

    const priceInfo = await priceService.lookupPrice({
      organizationId,
      serviceCode,
      payerId,
      zipCode,
    });

    if (!priceInfo) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Service not found in chargemaster',
      });
      return;
    }

    res.json({
      data: priceInfo,
      message: 'Price information retrieved successfully',
    });
  } catch (error) {
    console.error('Error looking up price:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to look up price',
    });
  }
});

/**
 * @route GET /prices/shoppable
 * @desc Get list of shoppable services
 * @access Public
 */
router.get('/shoppable', async (req: UserRequest, res: Response) => {
  try {
    const organizationId = req.headers['x-organization-id'] as string || req.user?.organizationId;

    if (!organizationId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Organization ID required',
      });
      return;
    }

    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await priceService.getShoppableServices(organizationId, limit, offset);

    res.json({
      data: result.services,
      pagination: {
        total: result.total,
        limit,
        offset,
        hasMore: offset + limit < result.total,
      },
    });
  } catch (error) {
    console.error('Error fetching shoppable services:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch shoppable services',
    });
  }
});

/**
 * @route GET /prices/search
 * @desc Search chargemaster items
 * @access Private
 */
router.get('/search', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const validation = chargemasterSearchSchema.safeParse(req.query);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: validation.error.errors,
      });
      return;
    }

    const organizationId = req.user!.organizationId;
    if (!organizationId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Organization context required',
      });
      return;
    }

    const { searchTerm, cptCode, hcpcsCode, department, isShoppable, limit, offset } = validation.data;

    const result = await priceService.searchChargemaster({
      organizationId,
      searchTerm,
      cptCode,
      hcpcsCode,
      department,
      isShoppable: isShoppable ? isShoppable === 'true' : undefined,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0,
    });

    res.json({
      data: result.items,
      pagination: {
        total: result.total,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0,
        hasMore: (offset ? parseInt(offset) : 0) + (limit ? parseInt(limit) : 50) < result.total,
      },
    });
  } catch (error) {
    console.error('Error searching chargemaster:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search chargemaster',
    });
  }
});

/**
 * @route GET /prices/compare/:serviceCode
 * @desc Compare prices across payers for a service
 * @access Private
 */
router.get('/compare/:serviceCode', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { serviceCode } = req.params;
    const organizationId = req.user!.organizationId;

    if (!organizationId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Organization context required',
      });
      return;
    }

    const comparison = await priceService.comparePayerPrices(organizationId, serviceCode);

    if (!comparison) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Service not found',
      });
      return;
    }

    res.json({
      data: comparison,
      message: 'Price comparison retrieved successfully',
    });
  } catch (error) {
    console.error('Error comparing prices:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to compare prices',
    });
  }
});

/**
 * @route POST /prices/compare-region
 * @desc Compare prices across facilities in a region
 * @access Public
 */
router.post('/compare-region', async (req: UserRequest, res: Response) => {
  try {
    const validation = priceComparisonSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: validation.error.errors,
      });
      return;
    }

    const { serviceCode, zipCode, radiusMiles } = validation.data;

    const comparison = await priceService.getPriceComparison({
      serviceCode,
      zipCode,
      radiusMiles,
    });

    res.json({
      data: comparison,
      message: 'Regional price comparison retrieved',
    });
  } catch (error) {
    console.error('Error getting regional comparison:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get regional price comparison',
    });
  }
});

/**
 * @route POST /prices/estimates
 * @desc Create a price estimate
 * @access Private
 */
router.post('/estimates', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const validation = createEstimateSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: validation.error.errors,
      });
      return;
    }

    const organizationId = req.user!.organizationId;
    if (!organizationId) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Organization context required',
      });
      return;
    }

    const estimate = await priceService.createPriceEstimate({
      organizationId,
      ...validation.data,
    });

    res.status(201).json({
      data: estimate,
      message: 'Price estimate created successfully',
    });
  } catch (error) {
    console.error('Error creating price estimate:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create price estimate',
    });
  }
});

/**
 * @route GET /prices/estimates/patient/:patientId
 * @desc Get price estimates for a patient
 * @access Private
 */
router.get('/estimates/patient/:patientId', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { patientId } = req.params;
    const organizationId = req.user!.organizationId;

    // Verify access (patient can see own, staff can see all in org)
    if (req.user!.role === 'patient' && req.user!.id !== patientId) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied',
      });
      return;
    }

    const estimates = await priceService.getPatientEstimates(patientId, organizationId);

    res.json({
      data: estimates,
      count: estimates.length,
    });
  } catch (error) {
    console.error('Error fetching patient estimates:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch patient estimates',
    });
  }
});

export default router;
