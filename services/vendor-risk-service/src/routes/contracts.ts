import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient, ContractType, ContractStatus } from '../generated/client';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import { createAuditLog } from '../middleware/auditLogger';
import { addMonths, addDays } from 'date-fns';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();

// Validation schemas
const createContractSchema = z.object({
  vendorId: z.string().uuid(),
  contractNumber: z.string().max(100).optional(),
  type: z.nativeEnum(ContractType),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  effectiveDate: z.string().datetime().optional(),
  expirationDate: z.string().datetime().optional(),
  autoRenewal: z.boolean().optional(),
  renewalTermMonths: z.number().min(1).max(120).optional(),
  terminationNoticeDays: z.number().min(0).max(365).optional(),
  value: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  paymentTerms: z.string().max(500).optional(),
  slaTerms: z.record(z.unknown()).optional(),
  securityRequirements: z.record(z.unknown()).optional(),
  dataRetentionDays: z.number().min(0).optional(),
  liabilityLimit: z.number().min(0).optional(),
  indemnification: z.boolean().optional(),
  insuranceRequired: z.boolean().optional(),
  insuranceMinimum: z.number().min(0).optional(),
  documentUrl: z.string().url().optional(),
  notes: z.string().max(5000).optional(),
});

const updateContractSchema = createContractSchema.partial().omit({ vendorId: true }).extend({
  status: z.nativeEnum(ContractStatus).optional(),
  signedDate: z.string().datetime().optional(),
  signedBy: z.string().max(255).optional(),
  counterSignedDate: z.string().datetime().optional(),
  counterSignedBy: z.string().max(255).optional(),
});

const listContractsSchema = z.object({
  vendorId: z.string().uuid().optional(),
  type: z.nativeEnum(ContractType).optional(),
  status: z.nativeEnum(ContractStatus).optional(),
  expiringBefore: z.string().datetime().optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
});

const createAmendmentSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  effectiveDate: z.string().datetime(),
  documentUrl: z.string().url().optional(),
  signedDate: z.string().datetime().optional(),
  signedBy: z.string().max(255).optional(),
});

// List contracts
router.get('/', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const validatedQuery = listContractsSchema.parse(req.query);

    const where: Record<string, unknown> = {};
    if (validatedQuery.vendorId) where.vendorId = validatedQuery.vendorId;
    if (validatedQuery.type) where.type = validatedQuery.type;
    if (validatedQuery.status) where.status = validatedQuery.status;
    if (validatedQuery.expiringBefore) {
      where.expirationDate = {
        lte: new Date(validatedQuery.expiringBefore),
        gte: new Date(),
      };
      where.status = ContractStatus.ACTIVE;
    }

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where: where as Parameters<typeof prisma.contract.findMany>[0]['where'],
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: { amendments: true },
          },
        },
        orderBy: { expirationDate: 'asc' },
        take: validatedQuery.limit || 50,
        skip: validatedQuery.offset || 0,
      }),
      prisma.contract.count({ where: where as Parameters<typeof prisma.contract.count>[0]['where'] }),
    ]);

    res.json({
      data: contracts,
      total,
      limit: validatedQuery.limit || 50,
      offset: validatedQuery.offset || 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error listing contracts:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to list contracts' });
  }
});

// Get expiring contracts
router.get('/expiring', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const daysAhead = parseInt(req.query.daysAhead as string) || 60;
    const futureDate = addDays(new Date(), daysAhead);

    const contracts = await prisma.contract.findMany({
      where: {
        status: ContractStatus.ACTIVE,
        expirationDate: {
          gte: new Date(),
          lte: futureDate,
        },
      },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            primaryContactEmail: true,
          },
        },
      },
      orderBy: { expirationDate: 'asc' },
    });

    res.json({ data: contracts, count: contracts.length });
  } catch (error) {
    console.error('Error getting expiring contracts:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get contracts' });
  }
});

// Get BAA status summary
router.get('/baa-status', requireUser, async (req: UserRequest, res: Response) => {
  try {
    // Get all vendors with PHI access
    const vendorsWithPHI = await prisma.vendor.findMany({
      where: { phiAccess: true },
      select: {
        id: true,
        name: true,
        contracts: {
          where: {
            type: ContractType.BAA,
            status: ContractStatus.ACTIVE,
          },
          select: {
            id: true,
            expirationDate: true,
          },
        },
      },
    });

    const withBAA = vendorsWithPHI.filter((v) => v.contracts.length > 0);
    const withoutBAA = vendorsWithPHI.filter((v) => v.contracts.length === 0);
    const expiringBAA = withBAA.filter((v) => {
      const baa = v.contracts[0];
      if (!baa.expirationDate) return false;
      const daysUntilExpiry = Math.floor(
        (baa.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilExpiry <= 90;
    });

    res.json({
      data: {
        totalVendorsWithPHI: vendorsWithPHI.length,
        withActiveBAA: withBAA.length,
        withoutBAA: withoutBAA.length,
        expiringBAACount: expiringBAA.length,
        vendorsWithoutBAA: withoutBAA.map((v) => ({ id: v.id, name: v.name })),
        vendorsWithExpiringBAA: expiringBAA.map((v) => ({
          id: v.id,
          name: v.name,
          expirationDate: v.contracts[0].expirationDate,
        })),
      },
    });
  } catch (error) {
    console.error('Error getting BAA status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get BAA status' });
  }
});

// Get a single contract
router.get('/:id', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        amendments: {
          orderBy: { amendmentNumber: 'desc' },
        },
        renewalHistory: {
          orderBy: { renewalDate: 'desc' },
        },
      },
    });

    if (!contract) {
      res.status(404).json({ error: 'Not Found', message: 'Contract not found' });
      return;
    }

    res.json({ data: contract });
  } catch (error) {
    console.error('Error getting contract:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get contract' });
  }
});

// Create a new contract
router.post('/', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager'), async (req: UserRequest, res: Response) => {
  try {
    const validatedData = createContractSchema.parse(req.body);

    const contract = await prisma.contract.create({
      data: {
        ...validatedData,
        effectiveDate: validatedData.effectiveDate ? new Date(validatedData.effectiveDate) : undefined,
        expirationDate: validatedData.expirationDate ? new Date(validatedData.expirationDate) : undefined,
        createdBy: req.user!.id,
      },
    });

    await createAuditLog(req, {
      vendorId: validatedData.vendorId,
      action: 'CONTRACT_CREATED',
      entityType: 'Contract',
      entityId: contract.id,
      newValues: validatedData,
    });

    res.status(201).json({ data: contract, message: 'Contract created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating contract:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create contract' });
  }
});

// Update a contract
router.put('/:id', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateContractSchema.parse(req.body);

    const existingContract = await prisma.contract.findUnique({ where: { id } });
    if (!existingContract) {
      res.status(404).json({ error: 'Not Found', message: 'Contract not found' });
      return;
    }

    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.effectiveDate) updateData.effectiveDate = new Date(validatedData.effectiveDate);
    if (validatedData.expirationDate) updateData.expirationDate = new Date(validatedData.expirationDate);
    if (validatedData.signedDate) updateData.signedDate = new Date(validatedData.signedDate);
    if (validatedData.counterSignedDate) updateData.counterSignedDate = new Date(validatedData.counterSignedDate);

    const contract = await prisma.contract.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.contract.update>[0]['data'],
    });

    await createAuditLog(req, {
      vendorId: existingContract.vendorId,
      action: 'CONTRACT_UPDATED',
      entityType: 'Contract',
      entityId: id,
      oldValues: existingContract as unknown as Record<string, unknown>,
      newValues: validatedData,
    });

    res.json({ data: contract, message: 'Contract updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update contract' });
  }
});

// Activate a contract (after signing)
router.post('/:id/activate', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingContract = await prisma.contract.findUnique({ where: { id } });
    if (!existingContract) {
      res.status(404).json({ error: 'Not Found', message: 'Contract not found' });
      return;
    }

    const contract = await prisma.contract.update({
      where: { id },
      data: {
        status: ContractStatus.ACTIVE,
      },
    });

    await createAuditLog(req, {
      vendorId: existingContract.vendorId,
      action: 'CONTRACT_ACTIVATED',
      entityType: 'Contract',
      entityId: id,
      oldValues: { status: existingContract.status },
      newValues: { status: ContractStatus.ACTIVE },
    });

    res.json({ data: contract, message: 'Contract activated successfully' });
  } catch (error) {
    console.error('Error activating contract:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to activate contract' });
  }
});

// Renew a contract
router.post('/:id/renew', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { renewalTermMonths, notes } = z.object({
      renewalTermMonths: z.number().min(1).max(120).optional(),
      notes: z.string().max(2000).optional(),
    }).parse(req.body);

    const existingContract = await prisma.contract.findUnique({ where: { id } });
    if (!existingContract) {
      res.status(404).json({ error: 'Not Found', message: 'Contract not found' });
      return;
    }

    const termMonths = renewalTermMonths || existingContract.renewalTermMonths || 12;
    const previousEndDate = existingContract.expirationDate || new Date();
    const newEndDate = addMonths(previousEndDate, termMonths);

    // Update contract and create renewal record
    const [contract, renewal] = await Promise.all([
      prisma.contract.update({
        where: { id },
        data: {
          expirationDate: newEndDate,
          status: ContractStatus.RENEWED,
        },
      }),
      prisma.contractRenewal.create({
        data: {
          contractId: id,
          previousEndDate,
          newEndDate,
          renewedBy: req.user!.id,
          notes,
        },
      }),
    ]);

    // Set status back to active
    await prisma.contract.update({
      where: { id },
      data: { status: ContractStatus.ACTIVE },
    });

    await createAuditLog(req, {
      vendorId: existingContract.vendorId,
      action: 'CONTRACT_RENEWED',
      entityType: 'Contract',
      entityId: id,
      oldValues: { expirationDate: previousEndDate },
      newValues: { expirationDate: newEndDate, renewalTermMonths: termMonths },
    });

    res.json({
      data: { contract, renewal },
      message: 'Contract renewed successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error renewing contract:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to renew contract' });
  }
});

// Terminate a contract
router.post('/:id/terminate', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = z.object({
      reason: z.string().max(2000).optional(),
    }).parse(req.body);

    const existingContract = await prisma.contract.findUnique({ where: { id } });
    if (!existingContract) {
      res.status(404).json({ error: 'Not Found', message: 'Contract not found' });
      return;
    }

    const contract = await prisma.contract.update({
      where: { id },
      data: {
        status: ContractStatus.TERMINATED,
        notes: reason ? `${existingContract.notes || ''}\n\nTermination reason: ${reason}` : existingContract.notes,
      },
    });

    await createAuditLog(req, {
      vendorId: existingContract.vendorId,
      action: 'CONTRACT_TERMINATED',
      entityType: 'Contract',
      entityId: id,
      oldValues: { status: existingContract.status },
      newValues: { status: ContractStatus.TERMINATED, reason },
    });

    res.json({ data: contract, message: 'Contract terminated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error terminating contract:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to terminate contract' });
  }
});

// Add amendment to contract
router.post('/:id/amendments', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = createAmendmentSchema.parse(req.body);

    const existingContract = await prisma.contract.findUnique({
      where: { id },
      include: { amendments: { orderBy: { amendmentNumber: 'desc' }, take: 1 } },
    });

    if (!existingContract) {
      res.status(404).json({ error: 'Not Found', message: 'Contract not found' });
      return;
    }

    const nextAmendmentNumber = (existingContract.amendments[0]?.amendmentNumber || 0) + 1;

    const amendment = await prisma.contractAmendment.create({
      data: {
        contractId: id,
        amendmentNumber: nextAmendmentNumber,
        title: validatedData.title,
        description: validatedData.description,
        effectiveDate: new Date(validatedData.effectiveDate),
        documentUrl: validatedData.documentUrl,
        signedDate: validatedData.signedDate ? new Date(validatedData.signedDate) : undefined,
        signedBy: validatedData.signedBy,
      },
    });

    await createAuditLog(req, {
      vendorId: existingContract.vendorId,
      action: 'CONTRACT_AMENDMENT_ADDED',
      entityType: 'ContractAmendment',
      entityId: amendment.id,
      newValues: validatedData,
      metadata: { contractId: id, amendmentNumber: nextAmendmentNumber },
    });

    res.status(201).json({ data: amendment, message: 'Amendment added successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error adding amendment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to add amendment' });
  }
});

export default router;
