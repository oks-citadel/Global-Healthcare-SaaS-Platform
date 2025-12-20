import { Router } from 'express';
import * as criticalFindingController from '../controllers/criticalFindingController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createCriticalFindingValidator, paginationValidator } from '../utils/validators';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Critical finding routes
router.post(
  '/',
  createCriticalFindingValidator,
  validate,
  criticalFindingController.createCriticalFinding
);

router.get(
  '/pending',
  paginationValidator,
  validate,
  criticalFindingController.getPendingCriticalFindings
);

router.get(
  '/severity/:severity',
  paginationValidator,
  validate,
  criticalFindingController.getCriticalFindingsBySeverity
);

router.get(
  '/study/:studyId',
  criticalFindingController.getCriticalFindingsByStudy
);

router.get(
  '/:id',
  criticalFindingController.getCriticalFindingById
);

router.patch(
  '/:id',
  criticalFindingController.updateCriticalFinding
);

router.post(
  '/:id/acknowledge',
  criticalFindingController.acknowledgeCriticalFinding
);

export default router;
