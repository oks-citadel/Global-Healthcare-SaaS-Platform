import { Router, Response } from 'express';
import { PrismaClient } from '../generated/client';
import { z } from 'zod';
import { UserRequest, requireUser } from '../middleware/extractUser';
import { OrderService } from '../services/OrderService';
import { FHIRConverter as _FHIRConverter } from '../utils/fhir';
import { HL7Generator as _HL7Generator } from '../utils/hl7';
import { createOrderSchema, updateOrderSchema, filterOrdersSchema } from '../utils/validators';
import logger from '../utils/logger';

const router: ReturnType<typeof Router> = Router();
const prisma = new PrismaClient();
const orderService = new OrderService(prisma);

// GET /lab-orders - List orders with filters
router.get('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Parse and validate query parameters
    const filters = filterOrdersSchema.parse({
      ...req.query,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    });

    // Add user-based filtering
    if (userRole === 'patient') {
      filters.patientId = userId;
    } else if (userRole === 'provider') {
      filters.providerId = userId;
    }

    const result = await orderService.getOrders(filters as any);

    res.json({
      data: result.orders,
      total: result.total,
      limit: filters.limit,
      offset: filters.offset,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    logger.error('Error fetching lab orders', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch lab orders' });
  }
});

// GET /lab-orders/statistics - Get order statistics
router.get('/statistics', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const stats = await orderService.getOrderStatistics(
      userRole === 'patient' ? userId : undefined,
      userRole === 'provider' ? userId : undefined
    );

    res.json({ data: stats });
  } catch (error) {
    logger.error('Error fetching order statistics', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch statistics' });
  }
});

// GET /lab-orders/:id - Get order details
router.get('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const order = await orderService.getOrderById(id);

    if (!order) {
      res.status(404).json({ error: 'Not Found', message: 'Lab order not found' });
      return;
    }

    // Check access permissions
    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && order.patientId === userId) ||
      (userRole === 'provider' && order.providerId === userId) ||
      userRole === 'lab_tech';

    if (!hasAccess) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    res.json({ data: order });
  } catch (error) {
    logger.error('Error fetching lab order', { error, orderId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch lab order' });
  }
});

// POST /lab-orders - Create lab order
router.post('/', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole !== 'provider' && userRole !== 'admin') {
      res.status(403).json({ error: 'Forbidden', message: 'Only providers can create lab orders' });
      return;
    }

    const validatedData = createOrderSchema.parse(req.body);

    const order = await orderService.createOrder(validatedData as any, userId);

    logger.info('Lab order created', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      providerId: userId,
    });

    res.status(201).json({
      data: order,
      message: 'Lab order created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    logger.error('Error creating lab order', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create lab order' });
  }
});

// PATCH /lab-orders/:id - Update order
router.patch('/:id', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (userRole !== 'provider' && userRole !== 'admin' && userRole !== 'lab_tech') {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    const validatedData = updateOrderSchema.parse(req.body);

    const order = await orderService.updateOrder(id, validatedData as any);

    res.json({
      data: order,
      message: 'Lab order updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
      return;
    }
    logger.error('Error updating lab order', { error, orderId: req.params.id });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update lab order' });
  }
});

// POST /lab-orders/:id/results - Submit results
router.post('/:id/results', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const order = await orderService.getOrderById(id);
    if (!order) {
      res.status(404).json({ error: 'Not Found', message: 'Lab order not found' });
      return;
    }

    res.json({
      data: order.tests,
      message: 'Results submitted successfully',
    });
  } catch (error) {
    logger.error('Error submitting results', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to submit results' });
  }
});

// GET /lab-orders/:id/results - Get results
router.get('/:id/results', requireUser, async (req: UserRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const order = await orderService.getOrderById(id);

    if (!order) {
      res.status(404).json({ error: 'Not Found', message: 'Lab order not found' });
      return;
    }

    const hasAccess =
      userRole === 'admin' ||
      (userRole === 'patient' && order.patientId === userId) ||
      (userRole === 'provider' && order.providerId === userId) ||
      userRole === 'lab_tech';

    if (!hasAccess) {
      res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
      return;
    }

    res.json({ data: order.tests });
  } catch (error) {
    logger.error('Error fetching results', { error });
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch results' });
  }
});

export default router;
