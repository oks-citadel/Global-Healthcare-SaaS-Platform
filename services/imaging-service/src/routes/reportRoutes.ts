import { Router } from 'express';
import * as reportController from '../controllers/reportController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createReportValidator, updateReportValidator, paginationValidator } from '../utils/validators';

const router: ReturnType<typeof Router> = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Report routes
router.post(
  '/',
  createReportValidator,
  validate,
  reportController.createReport
);

router.get(
  '/study/:studyId',
  reportController.getReportsByStudy
);

router.get(
  '/radiologist/:radiologistId',
  paginationValidator,
  validate,
  reportController.getReportsByRadiologist
);

router.get(
  '/:id',
  reportController.getReportById
);

router.patch(
  '/:id',
  updateReportValidator,
  validate,
  reportController.updateReport
);

router.post(
  '/:id/sign',
  reportController.signReport
);

router.post(
  '/:id/amend',
  reportController.amendReport
);

router.delete(
  '/:id',
  reportController.deleteReport
);

export default router;
