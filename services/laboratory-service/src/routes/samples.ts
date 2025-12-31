import { Router, Response } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { SampleTrackingService } from '../services/SampleTrackingService';
import { createSampleSchema, updateSampleSchema } from '../utils/validators';
import logger from '../utils/logger';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();
const sampleService = new SampleTrackingService(prisma);

// GET /samples - Track samples
router.get('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const filters = {
      status: req.query.status as string,
      sampleType: req.query.sampleType as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : 50,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    };

    const result = await sampleService.getAllSamples(filters);

    res.json({
      data: result.samples,
      total: result.total,
      limit: filters.limit,
      offset: filters.offset,
    });
  } catch (error) {
    logger.error('Error fetching samples', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch samples' });
  }
});

// GET /samples/statistics - Get sample statistics
router.get('/statistics', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const stats = await sampleService.getSampleStatistics();

    res.json({ data: stats });
  } catch (error) {
    logger.error('Error fetching sample statistics', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch statistics' });
  }
});

// GET /samples/:id - Get sample details
router.get('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const sample = await sampleService.getSampleById(id);

    if (!sample) {
      res.status(404).json({ error: 'Not Found', message: 'Sample not found' });
      return;
    }

    res.json({ data: sample });
  } catch (error) {
    logger.error('Error fetching sample', { error, sampleId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch sample' });
  }
});

// GET /samples/number/:sampleNumber - Get sample by number
router.get('/number/:sampleNumber', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { sampleNumber } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const sample = await sampleService.getSampleByNumber(sampleNumber);

    if (!sample) {
      res.status(404).json({ error: 'Not Found', message: 'Sample not found' });
      return;
    }

    res.json({ data: sample });
  } catch (error) {
    logger.error('Error fetching sample by number', { error, sampleNumber: req.params.sampleNumber });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch sample' });
  }
});

// GET /samples/order/:orderId - Get samples by order
router.get('/order/:orderId', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const samples = await sampleService.getSamplesByOrder(orderId);

    res.json({ data: samples });
  } catch (error) {
    logger.error('Error fetching order samples', { error, orderId: req.params.orderId });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch samples' });
  }
});

// POST /samples - Create sample
router.post('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const validatedData = createSampleSchema.parse(req.body);

    const sample = await sampleService.createSample(validatedData, userId);

    logger.info('Sample created', {
      sampleId: sample.id,
      orderId: validatedData.orderId,
    });

    res.status(201).json({
      data: sample,
      message: 'Sample created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    logger.error('Error creating sample', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create sample' });
  }
});

// PATCH /samples/:id - Update sample status
router.patch('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const validatedData = updateSampleSchema.parse(req.body);

    const sample = await sampleService.updateSample(id, validatedData);

    res.json({
      data: sample,
      message: 'Sample updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    logger.error('Error updating sample', { error, sampleId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update sample' });
  }
});

// PATCH /samples/:id/receive - Mark sample as received
router.patch('/:id/receive', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { condition } = req.body;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const sample = await sampleService.receiveSample(id, userId, condition);

    res.json({
      data: sample,
      message: 'Sample marked as received',
    });
  } catch (error) {
    logger.error('Error receiving sample', { error, sampleId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to receive sample' });
  }
});

// PATCH /samples/:id/reject - Reject sample
router.patch('/:id/reject', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    if (!reason) {
      res.status(400).json({ error: 'Validation Error', message: 'Rejection reason is required' });
      return;
    }

    const sample = await sampleService.rejectSample(id, reason);

    res.json({
      data: sample,
      message: 'Sample rejected',
    });
  } catch (error) {
    logger.error('Error rejecting sample', { error, sampleId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to reject sample' });
  }
});

// PATCH /samples/:id/location - Update sample location
router.patch('/:id/location', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { location } = req.body;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    if (!location) {
      res.status(400).json({ error: 'Validation Error', message: 'Location is required' });
      return;
    }

    const sample = await sampleService.updateSampleLocation(id, location);

    res.json({
      data: sample,
      message: 'Sample location updated',
    });
  } catch (error) {
    logger.error('Error updating sample location', { error, sampleId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update location' });
  }
});

// DELETE /samples/:id/dispose - Dispose sample
router.delete('/:id/dispose', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const sample = await sampleService.disposeSample(id);

    res.json({
      data: sample,
      message: 'Sample disposed',
    });
  } catch (error) {
    logger.error('Error disposing sample', { error, sampleId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to dispose sample' });
  }
});

export default router;
