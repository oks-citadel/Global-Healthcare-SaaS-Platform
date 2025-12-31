import { Router, Response } from 'express';
import { z } from 'zod';
import { VendorCategory, VendorTier, VendorStatus, DataAccessLevel } from '../generated/client';
import { UserRequest, requireUser, requireRole } from '../middleware/extractUser';
import { createAuditLog } from '../middleware/auditLogger';
import vendorService from '../services/vendor.service';
import riskScoringService from '../services/risk-scoring.service';

const router: ReturnType<typeof Router> = Router();

// Validation schemas
const createVendorSchema = z.object({
  name: z.string().min(1).max(255),
  legalName: z.string().max(255).optional(),
  dbaName: z.string().max(255).optional(),
  taxId: z.string().max(50).optional(),
  dunsNumber: z.string().max(20).optional(),
  website: z.string().url().optional(),
  description: z.string().max(2000).optional(),
  category: z.nativeEnum(VendorCategory),
  tier: z.nativeEnum(VendorTier).optional(),
  primaryContactName: z.string().max(255).optional(),
  primaryContactEmail: z.string().email().optional(),
  primaryContactPhone: z.string().max(50).optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  dataAccessLevel: z.nativeEnum(DataAccessLevel).optional(),
  phiAccess: z.boolean().optional(),
  piiAccess: z.boolean().optional(),
  notes: z.string().max(5000).optional(),
});

const updateVendorSchema = createVendorSchema.partial().extend({
  status: z.nativeEnum(VendorStatus).optional(),
});

const listVendorsSchema = z.object({
  status: z.nativeEnum(VendorStatus).optional(),
  category: z.nativeEnum(VendorCategory).optional(),
  tier: z.nativeEnum(VendorTier).optional(),
  riskLevel: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'MINIMAL', 'UNKNOWN']).optional(),
  phiAccess: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  piiAccess: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  search: z.string().optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
});

// List all vendors
router.get('/', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const validatedQuery = listVendorsSchema.parse(req.query);

    const { vendors, total } = await vendorService.listVendors({
      ...validatedQuery,
      phiAccess: validatedQuery.phiAccess,
      piiAccess: validatedQuery.piiAccess,
    });

    res.json({
      data: vendors,
      total,
      limit: validatedQuery.limit || 50,
      offset: validatedQuery.offset || 0,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error listing vendors:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to list vendors' });
  }
});

// Get vendor statistics
router.get('/statistics', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const statistics = await vendorService.getVendorStatistics();
    res.json({ data: statistics });
  } catch (error) {
    console.error('Error getting vendor statistics:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get statistics' });
  }
});

// Get vendors due for review
router.get('/due-for-review', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const daysAhead = parseInt(req.query.daysAhead as string) || 30;
    const vendors = await vendorService.getVendorsDueForReview(daysAhead);
    res.json({ data: vendors, count: vendors.length });
  } catch (error) {
    console.error('Error getting vendors due for review:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get vendors' });
  }
});

// Get high-risk vendors
router.get('/high-risk', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const vendors = await vendorService.getHighRiskVendors();
    res.json({ data: vendors, count: vendors.length });
  } catch (error) {
    console.error('Error getting high-risk vendors:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get vendors' });
  }
});

// Get a single vendor
router.get('/:id', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const vendor = await vendorService.getVendor(id);

    if (!vendor) {
      res.status(404).json({ error: 'Not Found', message: 'Vendor not found' });
      return;
    }

    res.json({ data: vendor });
  } catch (error) {
    console.error('Error getting vendor:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get vendor' });
  }
});

// Create a new vendor
router.post('/', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager'), async (req: UserRequest, res: Response) => {
  try {
    const validatedData = createVendorSchema.parse(req.body);

    const vendor = await vendorService.createVendor({
      ...validatedData,
      createdBy: req.user!.id,
    });

    await createAuditLog(req, {
      vendorId: vendor.id,
      action: 'VENDOR_CREATED',
      entityType: 'Vendor',
      entityId: vendor.id,
      newValues: validatedData,
    });

    res.status(201).json({ data: vendor, message: 'Vendor created successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create vendor' });
  }
});

// Update a vendor
router.put('/:id', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateVendorSchema.parse(req.body);

    const existingVendor = await vendorService.getVendor(id);
    if (!existingVendor) {
      res.status(404).json({ error: 'Not Found', message: 'Vendor not found' });
      return;
    }

    const vendor = await vendorService.updateVendor(id, {
      ...validatedData,
      updatedBy: req.user!.id,
    });

    await createAuditLog(req, {
      vendorId: id,
      action: 'VENDOR_UPDATED',
      entityType: 'Vendor',
      entityId: id,
      oldValues: existingVendor as unknown as Record<string, unknown>,
      newValues: validatedData,
    });

    res.json({ data: vendor, message: 'Vendor updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update vendor' });
  }
});

// Update vendor status
router.patch('/:id/status', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = z.object({ status: z.nativeEnum(VendorStatus) }).parse(req.body);

    const existingVendor = await vendorService.getVendor(id);
    if (!existingVendor) {
      res.status(404).json({ error: 'Not Found', message: 'Vendor not found' });
      return;
    }

    const vendor = await vendorService.updateVendorStatus(id, status, req.user!.id);

    await createAuditLog(req, {
      vendorId: id,
      action: 'VENDOR_STATUS_CHANGED',
      entityType: 'Vendor',
      entityId: id,
      oldValues: { status: existingVendor.status },
      newValues: { status },
    });

    res.json({ data: vendor, message: 'Vendor status updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    console.error('Error updating vendor status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update status' });
  }
});

// Calculate and update risk score
router.post('/:id/calculate-risk', requireUser, requireRole('admin', 'compliance_officer', 'vendor_manager'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingVendor = await vendorService.getVendor(id);
    if (!existingVendor) {
      res.status(404).json({ error: 'Not Found', message: 'Vendor not found' });
      return;
    }

    const riskBreakdown = await riskScoringService.calculateRiskScore(id);
    const vendor = await riskScoringService.updateVendorRiskScore(id);

    await createAuditLog(req, {
      vendorId: id,
      action: 'RISK_SCORE_CALCULATED',
      entityType: 'Vendor',
      entityId: id,
      oldValues: { riskScore: existingVendor.riskScore, riskLevel: existingVendor.riskLevel },
      newValues: { riskScore: vendor.riskScore, riskLevel: vendor.riskLevel },
      metadata: { breakdown: riskBreakdown },
    });

    res.json({
      data: {
        vendor,
        riskBreakdown,
      },
      message: 'Risk score calculated successfully',
    });
  } catch (error) {
    console.error('Error calculating risk score:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to calculate risk' });
  }
});

// Get risk score breakdown
router.get('/:id/risk-breakdown', requireUser, async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingVendor = await vendorService.getVendor(id);
    if (!existingVendor) {
      res.status(404).json({ error: 'Not Found', message: 'Vendor not found' });
      return;
    }

    const riskBreakdown = await riskScoringService.calculateRiskScore(id);
    res.json({ data: riskBreakdown });
  } catch (error) {
    console.error('Error getting risk breakdown:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to get risk breakdown' });
  }
});

// Archive a vendor
router.post('/:id/archive', requireUser, requireRole('admin', 'compliance_officer'), async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingVendor = await vendorService.getVendor(id);
    if (!existingVendor) {
      res.status(404).json({ error: 'Not Found', message: 'Vendor not found' });
      return;
    }

    const vendor = await vendorService.archiveVendor(id, req.user!.id);

    await createAuditLog(req, {
      vendorId: id,
      action: 'VENDOR_ARCHIVED',
      entityType: 'Vendor',
      entityId: id,
      oldValues: { status: existingVendor.status },
      newValues: { status: vendor.status },
    });

    res.json({ data: vendor, message: 'Vendor archived successfully' });
  } catch (error) {
    console.error('Error archiving vendor:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to archive vendor' });
  }
});

// Recalculate all vendor risk scores (admin only)
router.post('/recalculate-all-risks', requireUser, requireRole('admin'), async (req: UserRequest, res: Response) => {
  try {
    const result = await riskScoringService.recalculateAllVendorScores();

    await createAuditLog(req, {
      action: 'BULK_RISK_RECALCULATION',
      entityType: 'Vendor',
      metadata: result,
    });

    res.json({
      data: result,
      message: `Recalculated risk scores for ${result.updated} vendors`,
    });
  } catch (error) {
    console.error('Error recalculating risk scores:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to recalculate' });
  }
});

export default router;
