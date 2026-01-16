import { Router } from 'express';
import * as imageController from '../controllers/imageController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createImageValidator } from '../utils/validators';

const router: ReturnType<typeof Router> = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Image routes
router.post(
  '/',
  createImageValidator,
  validate,
  imageController.createImage
);

router.get(
  '/:id',
  imageController.getImageById
);

router.get(
  '/:id/url',
  imageController.getImageUrl
);

router.patch(
  '/:id/metadata',
  imageController.updateImageMetadata
);

router.delete(
  '/:id',
  imageController.deleteImage
);

export default router;
