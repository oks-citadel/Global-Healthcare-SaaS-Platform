import { body, param, query, ValidationChain } from 'express-validator';
import { Priority, Modality, OrderStatus, ReportStatus, Severity } from '../generated/client';

export const createImagingOrderValidator: ValidationChain[] = [
  body('patientId').isString().notEmpty().withMessage('Patient ID is required'),
  body('providerId').isString().notEmpty().withMessage('Provider ID is required'),
  body('facilityId').isString().notEmpty().withMessage('Facility ID is required'),
  body('modality').isIn(Object.values(Modality)).withMessage('Invalid modality'),
  body('bodyPart').isString().notEmpty().withMessage('Body part is required'),
  body('clinicalIndication').isString().notEmpty().withMessage('Clinical indication is required'),
  body('priority').optional().isIn(Object.values(Priority)).withMessage('Invalid priority'),
  body('requestedBy').isString().notEmpty().withMessage('Requested by is required'),
  body('scheduledAt').optional().isISO8601().withMessage('Invalid date format'),
];

export const updateImagingOrderValidator: ValidationChain[] = [
  param('id').isUUID().withMessage('Invalid order ID'),
  body('status').optional().isIn(Object.values(OrderStatus)).withMessage('Invalid status'),
  body('priority').optional().isIn(Object.values(Priority)).withMessage('Invalid priority'),
  body('scheduledAt').optional().isISO8601().withMessage('Invalid date format'),
];

export const createStudyValidator: ValidationChain[] = [
  body('orderId').isString().notEmpty().withMessage('Order ID is required'),
  body('studyDate').isISO8601().withMessage('Invalid study date'),
  body('studyDescription').isString().notEmpty().withMessage('Study description is required'),
  body('modality').isIn(Object.values(Modality)).withMessage('Invalid modality'),
  body('bodyPart').isString().notEmpty().withMessage('Body part is required'),
  body('patientId').isString().notEmpty().withMessage('Patient ID is required'),
  body('patientName').isString().notEmpty().withMessage('Patient name is required'),
  body('patientDOB').optional().isISO8601().withMessage('Invalid date of birth'),
];

export const createImageValidator: ValidationChain[] = [
  body('studyId').isUUID().withMessage('Invalid study ID'),
  body('seriesInstanceUID').isString().notEmpty().withMessage('Series Instance UID is required'),
  body('sopInstanceUID').isString().notEmpty().withMessage('SOP Instance UID is required'),
  body('instanceNumber').isInt({ min: 1 }).withMessage('Instance number must be a positive integer'),
  body('seriesNumber').isInt({ min: 1 }).withMessage('Series number must be a positive integer'),
  body('storageUrl').isURL().withMessage('Invalid storage URL'),
  body('fileSize').isInt({ min: 0 }).withMessage('File size must be a non-negative integer'),
];

export const createReportValidator: ValidationChain[] = [
  body('studyId').isUUID().withMessage('Invalid study ID'),
  body('radiologistId').isString().notEmpty().withMessage('Radiologist ID is required'),
  body('radiologistName').isString().notEmpty().withMessage('Radiologist name is required'),
  body('findings').isString().notEmpty().withMessage('Findings are required'),
  body('impression').isString().notEmpty().withMessage('Impression is required'),
  body('status').optional().isIn(Object.values(ReportStatus)).withMessage('Invalid status'),
];

export const updateReportValidator: ValidationChain[] = [
  param('id').isUUID().withMessage('Invalid report ID'),
  body('status').optional().isIn(Object.values(ReportStatus)).withMessage('Invalid status'),
  body('findings').optional().isString().notEmpty().withMessage('Findings cannot be empty'),
  body('impression').optional().isString().notEmpty().withMessage('Impression cannot be empty'),
];

export const createCriticalFindingValidator: ValidationChain[] = [
  body('studyId').isUUID().withMessage('Invalid study ID'),
  body('finding').isString().notEmpty().withMessage('Finding is required'),
  body('severity').isIn(Object.values(Severity)).withMessage('Invalid severity'),
  body('category').isString().notEmpty().withMessage('Category is required'),
  body('reportedBy').isString().notEmpty().withMessage('Reported by is required'),
  body('notifiedTo').isArray({ min: 1 }).withMessage('At least one recipient is required'),
];

export const paginationValidator: ValidationChain[] = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];
