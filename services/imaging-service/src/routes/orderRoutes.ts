import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createImagingOrderValidator, updateImagingOrderValidator, paginationValidator } from '../utils/validators';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Imaging order routes
router.post(
  '/',
  createImagingOrderValidator,
  validate,
  orderController.createOrder
);

router.get(
  '/',
  paginationValidator,
  validate,
  orderController.getOrders
);

router.get(
  '/patient/:patientId',
  orderController.getOrdersByPatient
);

router.get(
  '/:id',
  orderController.getOrderById
);

router.patch(
  '/:id',
  updateImagingOrderValidator,
  validate,
  orderController.updateOrder
);

router.delete(
  '/:id',
  orderController.cancelOrder
);

export default router;
