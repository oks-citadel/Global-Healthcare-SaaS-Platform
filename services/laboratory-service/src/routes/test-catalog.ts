import { Router, Request, Response } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { TestCatalogService } from '../services/TestCatalogService';
import { createTestCatalogSchema, createReferenceRangeSchema } from '../utils/validators';
import logger from '../utils/logger';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();
const testCatalogService = new TestCatalogService(prisma);

// GET /test-catalog - List available tests
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = {
      category: req.query.category as string | undefined,
      isActive: req.query.isActive === 'false' ? false : true,
      search: req.query.search as string,
      limit: req.query.limit ? Number(req.query.limit) : 50,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    };

    const result = await testCatalogService.getAllTests(filters);

    res.json({
      data: result.tests,
      total: result.total,
      limit: filters.limit,
      offset: filters.offset,
    });
  } catch (error) {
    logger.error('Error fetching test catalog', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch test catalog' });
  }
});

// GET /test-catalog/statistics - Get catalog statistics
router.get('/statistics', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const stats = await testCatalogService.getTestStatistics();
    res.json({ data: stats });
  } catch (error) {
    logger.error('Error fetching test statistics', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch statistics' });
  }
});

// GET /test-catalog/search - Search tests
router.get('/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    if (!query) {
      res.status(400).json({ error: 'Validation Error', message: 'Search query is required' });
      return;
    }

    const result = await testCatalogService.searchTests(query, limit);

    res.json({
      data: result.tests,
      total: result.total,
    });
  } catch (error) {
    logger.error('Error searching tests', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to search tests' });
  }
});

// GET /test-catalog/:id - Get test details
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const test = await testCatalogService.getTestById(id);

    if (!test) {
      res.status(404).json({ error: 'Not Found', message: 'Test not found' });
      return;
    }

    res.json({ data: test });
  } catch (error) {
    logger.error('Error fetching test', { error, testId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch test' });
  }
});

// GET /test-catalog/code/:code - Get test by code
router.get('/code/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const test = await testCatalogService.getTestByCode(code);

    if (!test) {
      res.status(404).json({ error: 'Not Found', message: 'Test not found' });
      return;
    }

    res.json({ data: test });
  } catch (error) {
    logger.error('Error fetching test by code', { error, code: req.params.code });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch test' });
  }
});

// POST /test-catalog - Add new test type
router.post('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user!.role;

    if (userRole !== 'admin') {
      res.status(403).json({ error: 'Forbidden', message: 'Only administrators can add tests' });
      return;
    }

    const validatedData = createTestCatalogSchema.parse(req.body);

    const test = await testCatalogService.createTest(validatedData);

    logger.info('Test catalog entry created', {
      testId: test.id,
      code: test.code,
      name: test.name,
    });

    res.status(201).json({
      data: test,
      message: 'Test created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    logger.error('Error creating test', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create test' });
  }
});

// PATCH /test-catalog/:id - Update test
router.patch('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin') {
      res.status(403).json({ error: 'Forbidden', message: 'Only administrators can update tests' });
      return;
    }

    const test = await testCatalogService.updateTest(id, req.body);

    res.json({
      data: test,
      message: 'Test updated successfully',
    });
  } catch (error) {
    logger.error('Error updating test', { error, testId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update test' });
  }
});

// DELETE /test-catalog/:id - Delete test
router.delete('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin') {
      res.status(403).json({ error: 'Forbidden', message: 'Only administrators can delete tests' });
      return;
    }

    const test = await testCatalogService.deleteTest(id);

    res.json({
      data: test,
      message: 'Test deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting test', { error, testId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete test' });
  }
});

// PATCH /test-catalog/:id/activate - Activate test
router.patch('/:id/activate', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin') {
      res.status(403).json({ error: 'Forbidden', message: 'Only administrators can activate tests' });
      return;
    }

    const test = await testCatalogService.activateTest(id);

    res.json({
      data: test,
      message: 'Test activated successfully',
    });
  } catch (error) {
    logger.error('Error activating test', { error, testId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to activate test' });
  }
});

// PATCH /test-catalog/:id/deactivate - Deactivate test
router.patch('/:id/deactivate', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin') {
      res.status(403).json({ error: 'Forbidden', message: 'Only administrators can deactivate tests' });
      return;
    }

    const test = await testCatalogService.deactivateTest(id);

    res.json({
      data: test,
      message: 'Test deactivated successfully',
    });
  } catch (error) {
    logger.error('Error deactivating test', { error, testId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to deactivate test' });
  }
});

// GET /test-catalog/:id/reference-ranges - Get reference ranges
router.get('/:id/reference-ranges', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ranges = await testCatalogService.getReferenceRanges(id);

    res.json({ data: ranges });
  } catch (error) {
    logger.error('Error fetching reference ranges', { error, testId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch reference ranges' });
  }
});

// POST /test-catalog/:id/reference-ranges - Add reference range
router.post('/:id/reference-ranges', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin') {
      res.status(403).json({ error: 'Forbidden', message: 'Only administrators can add reference ranges' });
      return;
    }

    const validatedData = createReferenceRangeSchema.parse(req.body);

    const range = await testCatalogService.addReferenceRange(id, validatedData);

    res.status(201).json({
      data: range,
      message: 'Reference range added successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    logger.error('Error adding reference range', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to add reference range' });
  }
});

export default router;
