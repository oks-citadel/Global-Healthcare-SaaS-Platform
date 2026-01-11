/**
 * Surgical Scheduling Controller
 *
 * Handles HTTP requests for surgical scheduling operations including
 * OR block management, case scheduling, duration prediction, optimization,
 * emergency insertion, equipment availability, and utilization analytics.
 */

import { Request, Response, NextFunction } from 'express';
import { surgicalSchedulingService } from '../services/surgical-scheduling.service.js';
import {
  CreateORBlockSchema,
  ListORBlocksSchema,
  ScheduleSurgicalCaseSchema,
  UpdateSurgicalCaseSchema,
  PredictDurationSchema,
  RunOptimizationSchema,
  EmergencyInsertSchema,
  CheckEquipmentAvailabilitySchema,
  GetUtilizationSchema,
} from '../dtos/surgical.dto.js';
import { ForbiddenError, BadRequestError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export const surgicalController = {
  // ==========================================
  // OR Block Management
  // ==========================================

  /**
   * POST /surgical/blocks
   * Create a new OR block schedule
   */
  createORBlock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateORBlockSchema.parse(req.body);

      // Only providers and admins can create OR blocks
      if (req.user?.role !== 'provider' && req.user?.role !== 'admin') {
        throw new ForbiddenError('Only providers and admins can create OR blocks');
      }

      const block = await surgicalSchedulingService.createORBlock(input);

      logger.info('OR block created', {
        blockId: block.id,
        surgeonId: block.surgeonId,
        operatingRoomId: block.operatingRoomId,
        userId: req.user?.userId,
      });

      res.status(201).json(block);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /surgical/blocks
   * List OR blocks with filters and utilization data
   */
  listORBlocks: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = ListORBlocksSchema.parse(req.query);

      // Providers can only see their own blocks unless they're admins
      if (req.user?.role === 'provider') {
        // Get provider ID from user
        const providerId = await surgicalController.getProviderIdForUser(req.user.userId);
        if (providerId && !filters.surgeonId) {
          filters.surgeonId = providerId;
        }
      }

      const result = await surgicalSchedulingService.listORBlocks(filters);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /surgical/blocks/:id
   * Get OR block by ID
   */
  getORBlock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const block = await surgicalSchedulingService.getORBlockById(id);

      res.json(block);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================
  // Surgical Case Management
  // ==========================================

  /**
   * POST /surgical/cases
   * Schedule a new surgical case
   */
  scheduleSurgicalCase: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = ScheduleSurgicalCaseSchema.parse(req.body);

      // Only providers and admins can schedule surgical cases
      if (req.user?.role !== 'provider' && req.user?.role !== 'admin') {
        throw new ForbiddenError('Only providers and admins can schedule surgical cases');
      }

      const surgicalCase = await surgicalSchedulingService.scheduleSurgicalCase(input);

      logger.info('Surgical case scheduled', {
        caseId: surgicalCase.id,
        patientId: surgicalCase.patientId,
        surgeonId: surgicalCase.primarySurgeonId,
        procedureCode: surgicalCase.procedureCode,
        userId: req.user?.userId,
      });

      res.status(201).json(surgicalCase);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /surgical/cases/:id
   * Get surgical case by ID
   */
  getSurgicalCase: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const surgicalCase = await surgicalSchedulingService.getSurgicalCaseById(id);

      // Check access
      await surgicalController.checkCaseAccess(req, surgicalCase);

      res.json(surgicalCase);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /surgical/cases/:id
   * Update surgical case
   */
  updateSurgicalCase: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = UpdateSurgicalCaseSchema.parse(req.body);

      // Get existing case to check access
      const existingCase = await surgicalSchedulingService.getSurgicalCaseById(id);
      await surgicalController.checkCaseAccess(req, existingCase, true);

      const surgicalCase = await surgicalSchedulingService.updateSurgicalCase(id, input);

      logger.info('Surgical case updated', {
        caseId: id,
        updates: Object.keys(input),
        userId: req.user?.userId,
      });

      res.json(surgicalCase);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================
  // Duration Prediction
  // ==========================================

  /**
   * GET /surgical/cases/:id/duration-prediction
   * Predict case duration for an existing case
   */
  getCaseDurationPrediction: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const prediction = await surgicalSchedulingService.predictCaseDuration(id);

      res.json(prediction);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /surgical/predict-duration
   * Predict duration for a hypothetical case (before scheduling)
   */
  predictDuration: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = PredictDurationSchema.parse(req.body);

      const prediction = await surgicalSchedulingService.predictCaseDuration('', input);

      res.json(prediction);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================
  // Schedule Optimization
  // ==========================================

  /**
   * POST /surgical/optimize
   * Run the schedule optimization algorithm
   */
  runOptimization: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = RunOptimizationSchema.parse(req.body);

      // Only admins can run optimization
      if (req.user?.role !== 'admin') {
        throw new ForbiddenError('Only admins can run schedule optimization');
      }

      const result = await surgicalSchedulingService.runOptimization(input);

      logger.info('Schedule optimization completed', {
        optimizationId: result.optimizationId,
        targetDate: result.targetDate,
        goal: result.goal,
        changesProposed: result.proposedChanges.length,
        userId: req.user?.userId,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================
  // Emergency Case Insertion
  // ==========================================

  /**
   * POST /surgical/emergency-insert
   * Insert an emergency case into the schedule
   */
  insertEmergencyCase: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = EmergencyInsertSchema.parse(req.body);

      // Only providers and admins can insert emergency cases
      if (req.user?.role !== 'provider' && req.user?.role !== 'admin') {
        throw new ForbiddenError('Only providers and admins can insert emergency cases');
      }

      const result = await surgicalSchedulingService.insertEmergencyCase(input);

      logger.info('Emergency case insertion attempted', {
        caseId: result.caseId,
        successful: result.insertionSuccessful,
        priority: input.priority,
        displacedCases: result.displacedCases.length,
        userId: req.user?.userId,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================
  // Equipment Availability
  // ==========================================

  /**
   * GET /surgical/equipment-availability
   * Check equipment availability for a time slot
   */
  checkEquipmentAvailability: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CheckEquipmentAvailabilitySchema.parse(req.query);

      const result = await surgicalSchedulingService.checkEquipmentAvailability(input);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================
  // Utilization Analytics
  // ==========================================

  /**
   * GET /surgical/utilization
   * Get utilization analytics and reporting
   */
  getUtilizationAnalytics: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = GetUtilizationSchema.parse(req.query);

      // Only admins and providers can view utilization analytics
      if (req.user?.role === 'patient') {
        throw new ForbiddenError('Patients cannot access utilization analytics');
      }

      const result = await surgicalSchedulingService.getUtilizationAnalytics(input);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================
  // Cancellation Prediction
  // ==========================================

  /**
   * GET /surgical/cases/:id/cancellation-risk
   * Get cancellation/no-show prediction for a case
   */
  getCancellationPrediction: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      // Get the case first to check access
      const surgicalCase = await surgicalSchedulingService.getSurgicalCaseById(id);
      await surgicalController.checkCaseAccess(req, surgicalCase);

      const prediction = await surgicalSchedulingService.predictCancellation(id);

      res.json(prediction);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================
  // Helper Methods
  // ==========================================

  /**
   * Check if user has access to a surgical case
   */
  checkCaseAccess: async (
    req: Request,
    surgicalCase: { patientId: string; primarySurgeonId: string },
    requireModifyAccess: boolean = false
  ) => {
    if (req.user?.role === 'admin') return;

    if (req.user?.role === 'patient') {
      // Patients can view their own cases but not modify
      if (requireModifyAccess) {
        throw new ForbiddenError('Patients cannot modify surgical cases');
      }

      // Check if this is the patient's case
      const { prisma } = await import('../lib/prisma.js');
      const patient = await prisma.patient.findUnique({
        where: { userId: req.user.userId },
        select: { id: true },
      });

      if (!patient || patient.id !== surgicalCase.patientId) {
        throw new ForbiddenError('Cannot access this surgical case');
      }
    }

    if (req.user?.role === 'provider') {
      // Providers can access cases where they are the primary surgeon
      const providerId = await surgicalController.getProviderIdForUser(req.user.userId);
      if (!providerId || providerId !== surgicalCase.primarySurgeonId) {
        // Allow viewing but warn about limited access
        if (requireModifyAccess) {
          throw new ForbiddenError('Only the primary surgeon can modify this case');
        }
      }
    }
  },

  /**
   * Get provider ID for a user
   */
  getProviderIdForUser: async (userId: string): Promise<string | null> => {
    try {
      const { prisma } = await import('../lib/prisma.js');
      const provider = await prisma.provider.findUnique({
        where: { userId },
        select: { id: true },
      });
      return provider?.id || null;
    } catch (error) {
      logger.warn('Could not get provider ID for user', { userId, error });
      return null;
    }
  },
};
