import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import denialPredictionService from '../services/denial-prediction.service';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createDenialSchema = z.object({
  claimId: z.string(),
  patientId: z.string().uuid(),
  providerId: z.string().uuid(),
  payerId: z.string(),
  payerName: z.string(),
  serviceDate: z.string().datetime(),
  billedAmount: z.number().positive(),
  allowedAmount: z.number().optional(),
  paidAmount: z.number().optional(),
  patientResponsibility: z.number().optional(),
  carcCode: z.string(),
  carcDescription: z.string(),
  rarcCodes: z.array(z.string()).default([]),
  groupCode: z.enum(['CO', 'OA', 'PI', 'PR']),
  procedureCode: z.string(),
  procedureModifiers: z.array(z.string()).default([]),
  diagnosisCodes: z.array(z.string()),
  placeOfService: z.string().optional(),
  x277StatusCode: z.string().optional(),
  x277StatusMessage: z.string().optional(),
  denialCategory: z.enum([
    'prior_authorization',
    'medical_necessity',
    'coding_error',
    'duplicate_claim',
    'timely_filing',
    'eligibility',
    'coordination_of_benefits',
    'bundling',
    'modifier_issue',
    'documentation',
    'non_covered_service',
    'out_of_network',
    'benefit_exhausted',
    'pre_existing_condition',
    'other',
  ]),
  rootCause: z.string().optional(),
});

const predictRiskSchema = z.object({
  claimId: z.string(),
  patientId: z.string().uuid(),
  providerId: z.string().uuid(),
  payerId: z.string(),
  procedureCode: z.string(),
  procedureModifiers: z.array(z.string()).optional(),
  diagnosisCodes: z.array(z.string()),
  billedAmount: z.number().positive(),
  placeOfService: z.string().optional(),
  hasAuthorization: z.boolean().optional(),
  authorizationNumber: z.string().optional(),
  serviceDate: z.string().datetime().optional(),
});

const updateDenialSchema = z.object({
  claimStatus: z.enum([
    'pending',
    'denied',
    'partially_denied',
    'appealed',
    'appeal_pending',
    'appeal_approved',
    'appeal_denied',
    'recovered',
    'written_off',
  ]).optional(),
  recoveredAmount: z.number().optional(),
  writeOffAmount: z.number().optional(),
  rootCause: z.string().optional(),
});

// Get all denials with filtering and pagination
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const {
      page = '1',
      limit = '20',
      payerId,
      providerId,
      patientId,
      status,
      category,
      startDate,
      endDate,
      minAmount,
      carcCode,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (payerId) where.payerId = payerId;
    if (providerId) where.providerId = providerId;
    if (patientId) where.patientId = patientId;
    if (status) where.claimStatus = status;
    if (category) where.denialCategory = category;
    if (carcCode) where.carcCode = carcCode;

    if (startDate || endDate) {
      where.denialDate = {};
      if (startDate) where.denialDate.gte = new Date(startDate as string);
      if (endDate) where.denialDate.lte = new Date(endDate as string);
    }

    if (minAmount) {
      where.billedAmount = { gte: parseFloat(minAmount as string) };
    }

    const [denials, total] = await Promise.all([
      prisma.denial.findMany({
        where,
        include: {
          appeals: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { denialDate: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.denial.count({ where }),
    ]);

    res.json({
      data: denials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching denials:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch denials',
    });
  }
});

// Get single denial by ID
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    const denial = await prisma.denial.findUnique({
      where: { id },
      include: {
        appeals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!denial) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Denial not found',
      });
      return;
    }

    res.json({ data: denial });
  } catch (error) {
    console.error('Error fetching denial:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch denial',
    });
  }
});

// Create a new denial (from X12 835 remittance)
router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = createDenialSchema.parse(req.body);

    const denial = await prisma.denial.create({
      data: {
        ...validatedData,
        serviceDate: new Date(validatedData.serviceDate),
        claimStatus: 'denied',
      },
    });

    res.status(201).json({
      data: denial,
      message: 'Denial created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    console.error('Error creating denial:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create denial',
    });
  }
});

// Update denial
router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateDenialSchema.parse(req.body);

    const denial = await prisma.denial.update({
      where: { id },
      data: validatedData,
    });

    res.json({
      data: denial,
      message: 'Denial updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    console.error('Error updating denial:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update denial',
    });
  }
});

// Predict denial risk for a claim (pre-submission)
router.post('/predict-risk', requireUser, async (req: UserRequest, res) => {
  try {
    const validatedData = predictRiskSchema.parse(req.body);

    const prediction = await denialPredictionService.predictDenialRisk({
      ...validatedData,
      serviceDate: validatedData.serviceDate
        ? new Date(validatedData.serviceDate)
        : undefined,
    });

    res.json({
      data: prediction,
      message: 'Risk prediction completed',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    console.error('Error predicting risk:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to predict denial risk',
    });
  }
});

// Bulk predict risk for multiple claims
router.post('/predict-risk/bulk', requireUser, async (req: UserRequest, res) => {
  try {
    const { claims } = req.body;

    if (!Array.isArray(claims) || claims.length === 0) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Claims array is required',
      });
      return;
    }

    if (claims.length > 100) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Maximum 100 claims per batch',
      });
      return;
    }

    const validatedClaims = claims.map(claim => predictRiskSchema.parse(claim));
    const predictions = await denialPredictionService.bulkPredictRisk(
      validatedClaims.map(c => ({
        ...c,
        serviceDate: c.serviceDate ? new Date(c.serviceDate) : undefined,
      }))
    );

    res.json({
      data: predictions,
      count: predictions.length,
      message: 'Bulk risk prediction completed',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    console.error('Error in bulk prediction:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process bulk prediction',
    });
  }
});

// Get root cause analysis for a denial
router.get('/:id/root-cause', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    const analysis = await denialPredictionService.analyzeRootCause(id);

    res.json({
      data: analysis,
      message: 'Root cause analysis completed',
    });
  } catch (error: any) {
    if (error.message === 'Denial not found') {
      res.status(404).json({
        error: 'Not Found',
        message: 'Denial not found',
      });
      return;
    }
    console.error('Error analyzing root cause:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to analyze root cause',
    });
  }
});

// Import denials from X12 835 batch
router.post('/import/x12-835', requireUser, requireRole('admin', 'billing'), async (req: UserRequest, res) => {
  try {
    const { remittances } = req.body;

    if (!Array.isArray(remittances)) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Remittances array is required',
      });
      return;
    }

    const created: any[] = [];
    const errors: any[] = [];

    for (const remittance of remittances) {
      try {
        const validated = createDenialSchema.parse(remittance);
        const denial = await prisma.denial.create({
          data: {
            ...validated,
            serviceDate: new Date(validated.serviceDate),
            claimStatus: 'denied',
          },
        });
        created.push(denial);
      } catch (err) {
        errors.push({
          claimId: remittance.claimId,
          error: err instanceof z.ZodError ? err.errors : 'Unknown error',
        });
      }
    }

    res.status(201).json({
      data: {
        created: created.length,
        errors: errors.length,
        details: errors.length > 0 ? errors : undefined,
      },
      message: `Imported ${created.length} denials, ${errors.length} errors`,
    });
  } catch (error) {
    console.error('Error importing X12 835:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to import X12 835 data',
    });
  }
});

// Get denials summary by CARC code
router.get('/summary/by-carc', requireUser, async (req: UserRequest, res) => {
  try {
    const { startDate, endDate, payerId } = req.query;

    const where: any = {};
    if (payerId) where.payerId = payerId;
    if (startDate || endDate) {
      where.denialDate = {};
      if (startDate) where.denialDate.gte = new Date(startDate as string);
      if (endDate) where.denialDate.lte = new Date(endDate as string);
    }

    const summary = await prisma.denial.groupBy({
      by: ['carcCode', 'carcDescription'],
      where,
      _count: true,
      _sum: {
        billedAmount: true,
        recoveredAmount: true,
      },
      orderBy: {
        _count: {
          carcCode: 'desc',
        },
      },
    });

    res.json({
      data: summary.map(s => ({
        carcCode: s.carcCode,
        description: s.carcDescription,
        count: s._count,
        totalBilled: s._sum.billedAmount,
        totalRecovered: s._sum.recoveredAmount,
      })),
    });
  } catch (error) {
    console.error('Error fetching CARC summary:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch CARC summary',
    });
  }
});

// Write off a denial
router.post('/:id/write-off', requireUser, requireRole('admin', 'billing'), async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const denial = await prisma.denial.findUnique({
      where: { id },
    });

    if (!denial) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Denial not found',
      });
      return;
    }

    const writeOffAmount = amount || Number(denial.billedAmount) - Number(denial.recoveredAmount || 0);

    const updated = await prisma.denial.update({
      where: { id },
      data: {
        claimStatus: 'written_off',
        writeOffAmount,
        rootCause: reason || denial.rootCause,
      },
    });

    res.json({
      data: updated,
      message: 'Denial written off successfully',
    });
  } catch (error) {
    console.error('Error writing off denial:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to write off denial',
    });
  }
});

export default router;
