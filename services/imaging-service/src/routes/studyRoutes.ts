import { Router } from 'express';
import * as studyController from '../controllers/studyController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createStudyValidator, paginationValidator } from '../utils/validators';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Study routes
router.post(
  '/',
  createStudyValidator,
  validate,
  studyController.createStudy
);

router.get(
  '/',
  paginationValidator,
  validate,
  studyController.getStudies
);

router.get(
  '/accession/:accessionNumber',
  studyController.getStudyByAccessionNumber
);

router.get(
  '/:id',
  studyController.getStudyById
);

router.patch(
  '/:id',
  studyController.updateStudy
);

router.patch(
  '/:id/status',
  studyController.updateStudyStatus
);

export default router;
