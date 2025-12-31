import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '../generated/client';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import { logger } from '../utils/logger';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Schema for trading partner creation
const createPartnerSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    'payer',
    'provider',
    'clearinghouse',
    'hie',
    'ehr_vendor',
    'lab',
    'pharmacy',
    'public_health',
    'qhin',
    'carequality',
    'commonwell',
  ]),
  endpoint: z.string().url(),
  authType: z.enum(['none', 'basic', 'oauth2', 'mutual_tls', 'saml', 'smart_on_fhir']).optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  tokenEndpoint: z.string().url().optional(),
  scopes: z.array(z.string()).optional(),
  fhirVersion: z.string().optional(),
  supportedProfiles: z.array(z.string()).optional(),
  isaId: z.string().optional(),
  gsId: z.string().optional(),
  directDomain: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for partner update
const updatePartnerSchema = createPartnerSchema.partial();

/**
 * GET /partners
 * List all trading partners
 */
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const { type, status, search } = req.query;

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { contactEmail: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const partners = await prisma.tradingPartner.findMany({
      where,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        type: true,
        endpoint: true,
        status: true,
        authType: true,
        fhirVersion: true,
        contactName: true,
        contactEmail: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      count: partners.length,
      partners,
    });
  } catch (error: any) {
    logger.error('Error listing partners', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to list trading partners',
    });
  }
});

/**
 * GET /partners/:id
 * Get a specific trading partner
 */
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    const partner = await prisma.tradingPartner.findUnique({
      where: { id },
      include: {
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            transactionId: true,
            type: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!partner) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Trading partner not found',
      });
      return;
    }

    // Remove sensitive fields
    const { clientSecret, ...safePartner } = partner;

    res.json({
      success: true,
      partner: safePartner,
    });
  } catch (error: any) {
    logger.error('Error getting partner', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get trading partner',
    });
  }
});

/**
 * POST /partners
 * Create a new trading partner
 */
router.post('/', requireUser, requireRole('admin'), async (req: UserRequest, res) => {
  try {
    const validatedData = createPartnerSchema.parse(req.body);

    const partner = await prisma.tradingPartner.create({
      data: {
        ...validatedData,
        status: 'pending',
      },
    });

    logger.info('Trading partner created', {
      partnerId: partner.id,
      name: partner.name,
      userId: req.user?.id,
    });

    res.status(201).json({
      success: true,
      partner: {
        id: partner.id,
        name: partner.name,
        type: partner.type,
        status: partner.status,
      },
      message: 'Trading partner created successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    logger.error('Error creating partner', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create trading partner',
    });
  }
});

/**
 * PUT /partners/:id
 * Update a trading partner
 */
router.put('/:id', requireUser, requireRole('admin'), async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const validatedData = updatePartnerSchema.parse(req.body);

    const partner = await prisma.tradingPartner.update({
      where: { id },
      data: validatedData,
    });

    logger.info('Trading partner updated', {
      partnerId: partner.id,
      userId: req.user?.id,
    });

    res.json({
      success: true,
      partner: {
        id: partner.id,
        name: partner.name,
        type: partner.type,
        status: partner.status,
      },
      message: 'Trading partner updated successfully',
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors,
      });
      return;
    }
    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Not Found',
        message: 'Trading partner not found',
      });
      return;
    }
    logger.error('Error updating partner', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update trading partner',
    });
  }
});

/**
 * PUT /partners/:id/status
 * Update partner status
 */
router.put('/:id/status', requireUser, requireRole('admin'), async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'active', 'suspended', 'terminated'].includes(status)) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid status',
      });
      return;
    }

    const partner = await prisma.tradingPartner.update({
      where: { id },
      data: { status },
    });

    logger.info('Trading partner status updated', {
      partnerId: partner.id,
      status,
      userId: req.user?.id,
    });

    res.json({
      success: true,
      partner: {
        id: partner.id,
        name: partner.name,
        status: partner.status,
      },
      message: 'Partner status updated successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Not Found',
        message: 'Trading partner not found',
      });
      return;
    }
    logger.error('Error updating partner status', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update partner status',
    });
  }
});

/**
 * DELETE /partners/:id
 * Delete a trading partner
 */
router.delete('/:id', requireUser, requireRole('admin'), async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.tradingPartner.delete({
      where: { id },
    });

    logger.info('Trading partner deleted', {
      partnerId: id,
      userId: req.user?.id,
    });

    res.json({
      success: true,
      message: 'Trading partner deleted successfully',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({
        error: 'Not Found',
        message: 'Trading partner not found',
      });
      return;
    }
    logger.error('Error deleting partner', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete trading partner',
    });
  }
});

/**
 * GET /partners/:id/transactions
 * Get transaction history for a partner
 */
router.get('/:id/transactions', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const { type, status, limit = '50', offset = '0' } = req.query;

    const where: any = { partnerId: id };
    if (type) where.type = type;
    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.transactionLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
      }),
      prisma.transactionLog.count({ where }),
    ]);

    res.json({
      success: true,
      total,
      count: transactions.length,
      transactions,
    });
  } catch (error: any) {
    logger.error('Error getting partner transactions', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get partner transactions',
    });
  }
});

/**
 * POST /partners/:id/test
 * Test connectivity to a trading partner
 */
router.post('/:id/test', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    const partner = await prisma.tradingPartner.findUnique({
      where: { id },
    });

    if (!partner) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Trading partner not found',
      });
      return;
    }

    // Perform connectivity test based on partner type
    const testResult = await testPartnerConnectivity(partner);

    res.json({
      success: testResult.success,
      partner: {
        id: partner.id,
        name: partner.name,
      },
      testResult,
    });
  } catch (error: any) {
    logger.error('Error testing partner connectivity', { error: error.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to test partner connectivity',
    });
  }
});

/**
 * Test connectivity to a trading partner
 */
async function testPartnerConnectivity(partner: any): Promise<{
  success: boolean;
  responseTime?: number;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    // Simple HTTP connectivity test
    const axios = require('axios');
    await axios.head(partner.endpoint, { timeout: 10000 });

    return {
      success: true,
      responseTime: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      success: false,
      responseTime: Date.now() - startTime,
      error: error.message,
    };
  }
}

export default router;
