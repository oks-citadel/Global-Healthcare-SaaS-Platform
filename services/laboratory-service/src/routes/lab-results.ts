// @ts-nocheck
import { Router } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { ResultsService } from '../services/ResultsService';
import { AlertService } from '../services/AlertService';
import { FHIRConverter } from '../utils/fhir';
import { createResultSchema, bulkResultsSchema } from '../utils/validators';
import logger from '../utils/logger';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();
const resultsService = new ResultsService(prisma);
const alertService = new AlertService(prisma);

// GET /lab-results - Get all results (with filters)
router.get('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const filters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      category: req.query.category as string,
      limit: req.query.limit ? Number(req.query.limit) : 50,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    };

    // This endpoint would need to be implemented in ResultsService
    res.json({
      data: [],
      total: 0,
      message: 'Results retrieval endpoint',
    });
  } catch (error) {
    logger.error('Error fetching results', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch results' });
  }
});

// GET /lab-results/patient/:patientId - Get patient results
router.get('/patient/:patientId', requireUser, async (req: UserRequest, res) => {
  try {
    const { patientId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check permissions
    if (userRole === 'patient' && patientId !== userId) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    const filters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      category: req.query.category as string,
      limit: req.query.limit ? Number(req.query.limit) : 50,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    };

    const result = await resultsService.getResultsByPatient(patientId, filters);

    res.json({
      data: result.results,
      total: result.total,
      limit: filters.limit,
      offset: filters.offset,
    });
  } catch (error) {
    logger.error('Error fetching patient results', { error, patientId: req.params.patientId });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch patient results' });
  }
});

// GET /lab-results/test/:testId - Get results for a test
router.get('/test/:testId', requireUser, async (req: UserRequest, res) => {
  try {
    const { testId } = req.params;

    const results = await resultsService.getResultsByTest(testId);

    res.json({ data: results });
  } catch (error) {
    logger.error('Error fetching test results', { error, testId: req.params.testId });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch test results' });
  }
});

// GET /lab-results/order/:orderId - Get results for an order
router.get('/order/:orderId', requireUser, async (req: UserRequest, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const results = await resultsService.getResultsByOrder(orderId);

    // Check if user has access (would need to check order ownership)
    res.json({ data: results });
  } catch (error) {
    logger.error('Error fetching order results', { error, orderId: req.params.orderId });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch order results' });
  }
});

// GET /lab-results/abnormal - Get abnormal results
router.get('/abnormal', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const results = await resultsService.getAbnormalResults(
      userRole === 'patient' ? userId : undefined,
      limit
    );

    res.json({ data: results });
  } catch (error) {
    logger.error('Error fetching abnormal results', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch abnormal results' });
  }
});

// GET /lab-results/critical - Get critical results
router.get('/critical', requireUser, async (req: UserRequest, res) => {
  try {
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech' && userRole !== 'provider') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const results = await resultsService.getCriticalResults(limit);

    res.json({ data: results });
  } catch (error) {
    logger.error('Error fetching critical results', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch critical results' });
  }
});

// GET /lab-results/:id - Get result details
router.get('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    const result = await resultsService.getResultById(id);

    if (!result) {
      res.status(404).json({ error: 'Not Found', message: 'Result not found' });
      return;
    }

    res.json({ data: result });
  } catch (error) {
    logger.error('Error fetching result', { error, resultId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch result' });
  }
});

// POST /lab-results - Create result
router.post('/', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Only lab personnel can add results' });
      return;
    }

    const validatedData = createResultSchema.parse(req.body);

    const result = await resultsService.createResult(validatedData, userId);

    // Check if this is a critical value and create alert
    if (result.isCritical) {
      const test = await prisma.labTest.findUnique({
        where: { id: result.testId },
        include: { order: true },
      });

      if (test) {
        await alertService.checkAndCreateAlertsForResult(
          result,
          test.testName,
          test.order.patientId,
          test.order.providerId
        );
      }
    }

    logger.info('Lab result created', {
      resultId: result.id,
      testId: result.testId,
      performedBy: userId,
    });

    res.status(201).json({
      data: result,
      message: 'Result created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    logger.error('Error creating result', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create result' });
  }
});

// POST /lab-results/bulk - Create multiple results for a test
router.post('/bulk', requireUser, async (req: UserRequest, res) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Only lab personnel can add results' });
      return;
    }

    const validatedData = bulkResultsSchema.parse(req.body);

    const results = await resultsService.createBulkResults(
      validatedData.testId,
      validatedData.results,
      userId
    );

    // Check for critical values
    for (const result of results) {
      if (result.isCritical) {
        const test = await prisma.labTest.findUnique({
          where: { id: result.testId },
          include: { order: true },
        });

        if (test) {
          await alertService.checkAndCreateAlertsForResult(
            result,
            test.testName,
            test.order.patientId,
            test.order.providerId
          );
        }
      }
    }

    logger.info('Bulk lab results created', {
      testId: validatedData.testId,
      count: results.length,
      performedBy: userId,
    });

    res.status(201).json({
      data: results,
      message: 'Results created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    logger.error('Error creating bulk results', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create results' });
  }
});

// PATCH /lab-results/:id - Update result
router.patch('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const result = await resultsService.updateResult(id, req.body);

    res.json({
      data: result,
      message: 'Result updated successfully',
    });
  } catch (error) {
    logger.error('Error updating result', { error, resultId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update result' });
  }
});

// PATCH /lab-results/:id/verify - Verify result
router.patch('/:id/verify', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole !== 'admin' && userRole !== 'provider') {
      res.status(403).json({ error: 'Forbidden', message: 'Only providers can verify results' });
      return;
    }

    const result = await resultsService.verifyResult(id, userId);

    res.json({
      data: result,
      message: 'Result verified successfully',
    });
  } catch (error) {
    logger.error('Error verifying result', { error, resultId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to verify result' });
  }
});

// DELETE /lab-results/:id - Delete result
router.delete('/:id', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'admin') {
      res.status(403).json({ error: 'Forbidden', message: 'Only administrators can delete results' });
      return;
    }

    const result = await resultsService.deleteResult(id);

    res.json({
      data: result,
      message: 'Result deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting result', { error, resultId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete result' });
  }
});

// GET /lab-results/:id/fhir - Get FHIR Observation
router.get('/:id/fhir', requireUser, async (req: UserRequest, res) => {
  try {
    const { id } = req.params;

    const result = await resultsService.getResultById(id);

    if (!result) {
      res.status(404).json({ error: 'Not Found', message: 'Result not found' });
      return;
    }

    const fhirObservation = FHIRConverter.labResultToObservation(
      result,
      result.test,
      result.test.order.patientId
    );

    res.json(fhirObservation);
  } catch (error) {
    logger.error('Error generating FHIR observation', { error, resultId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to generate FHIR observation' });
  }
});

export default router;
