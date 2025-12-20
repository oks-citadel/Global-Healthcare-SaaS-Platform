import { Router } from 'express';
import * as imageController from '../controllers/imageController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createImageValidator } from '../utils/validators';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Study-specific image routes
router.post(
  '/:id/images',
  createImageValidator,
  validate,
  imageController.createImage
);

router.get(
  '/:id/images',
  imageController.getImagesByStudy
);

router.get(
  '/:id/series/:seriesUID/images',
  imageController.getImagesBySeries
);

export default router;
