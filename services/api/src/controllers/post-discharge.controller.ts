import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { postDischargeService, OutreachChannel, EscalationPriority } from '../services/post-discharge.service.js';
import { patientService } from '../services/patient.service.js';
import { ForbiddenError, BadRequestError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

/**
 * Post-Discharge Controller
 *
 * Handles HTTP requests for post-discharge follow-up functionality
 */

// ==========================================
// Validation Schemas
// ==========================================

const InitiateDischargeSchema = z.object({
  dischargeInstructions: z.string().max(10000).optional(),
  followUpAppointmentId: z.string().uuid().optional(),
  primaryCareProviderId: z.string().uuid().optional(),
  laceScoreInput: z.object({
    lengthOfStay: z.number().min(0).max(365),
    acuteAdmission: z.boolean(),
    comorbidities: z.array(z.string()),
    edVisits6Months: z.number().min(0).max(100),
  }).optional(),
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    route: z.string(),
    purpose: z.string(),
    isNew: z.boolean(),
    instructions: z.string().nullable().optional(),
  })).optional(),
  customOutreachSchedule: z.array(z.object({
    day: z.number().optional(),
    type: z.string().optional(),
    channel: z.nativeEnum(OutreachChannel).optional(),
  })).optional(),
});

const LACEScoreInputSchema = z.object({
  lengthOfStay: z.number().min(0).max(365),
  acuteAdmission: z.boolean(),
  comorbidities: z.array(z.string()),
  edVisits6Months: z.number().min(0).max(100),
});

const OutreachInputSchema = z.object({
  channel: z.nativeEnum(OutreachChannel),
  message: z.string().max(1000).optional(),
  subject: z.string().max(200).optional(),
  template: z.string().optional(),
  force: z.boolean().optional(),
});

const QuestionnaireResponseSchema = z.object({
  responses: z.array(z.object({
    questionId: z.string(),
    answer: z.union([z.string(), z.number(), z.boolean()]),
  })),
});

const EscalationInputSchema = z.object({
  priority: z.nativeEnum(EscalationPriority),
  reason: z.string().min(1).max(1000),
  symptoms: z.array(z.string()).optional(),
  notes: z.string().max(2000).optional(),
  assignTo: z.string().uuid().optional(),
});

const ChecklistUpdateSchema = z.object({
  completed: z.boolean(),
  notes: z.string().max(500).optional(),
});

const TransportationInputSchema = z.object({
  appointmentId: z.string().uuid().optional(),
  pickupAddress: z.string().min(1).max(500),
  destinationAddress: z.string().min(1).max(500),
  scheduledTime: z.string().datetime(),
  specialNeeds: z.array(z.string()).optional(),
  notes: z.string().max(1000).optional(),
});

const SDOHScreeningSchema = z.object({
  housingStability: z.enum(['stable', 'at_risk', 'unstable', 'homeless']).nullable().optional(),
  foodSecurity: z.enum(['secure', 'low_security', 'very_low_security']).nullable().optional(),
  transportation: z.enum(['reliable', 'sometimes_unreliable', 'often_unreliable', 'no_access']).nullable().optional(),
  socialSupport: z.enum(['strong', 'moderate', 'limited', 'none']).nullable().optional(),
  financialStrain: z.enum(['none', 'some', 'moderate', 'severe']).nullable().optional(),
  healthLiteracy: z.enum(['high', 'adequate', 'limited']).nullable().optional(),
  needsIdentified: z.array(z.string()).optional(),
  referrals: z.array(z.object({
    type: z.string(),
    organization: z.string(),
    status: z.string(),
    referredAt: z.string().datetime(),
    followedUpAt: z.string().datetime().nullable().optional(),
  })).optional(),
});

const MedicationReconciliationSchema = z.object({
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    route: z.string(),
    purpose: z.string(),
    isNew: z.boolean(),
    instructions: z.string().nullable().optional(),
  })).optional(),
  discrepancies: z.array(z.object({
    medicationName: z.string(),
    type: z.enum(['missing', 'duplicate', 'dose_change', 'new', 'discontinued']),
    description: z.string(),
    resolved: z.boolean(),
    resolvedAt: z.string().datetime().nullable().optional(),
    resolvedBy: z.string().nullable().optional(),
  })).optional(),
  pharmacyConfirmation: z.boolean().optional(),
  patientEducationCompleted: z.boolean().optional(),
});

// ==========================================
// Controller Methods
// ==========================================

export const postDischargeController = {
  /**
   * POST /discharges/:encounterId/initiate
   * Initiate a discharge workflow for an encounter
   */
  initiateDischarge: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { encounterId } = req.params;
      const input = InitiateDischargeSchema.parse(req.body);

      const workflow = await postDischargeService.initiateDischarge({
        encounterId,
        ...input,
      });

      logger.info('Discharge workflow initiated', {
        workflowId: workflow.id,
        encounterId,
        userId: req.user?.userId,
      });

      res.status(201).json({
        success: true,
        data: workflow,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /discharges/:id
   * Get discharge workflow by ID
   */
  getDischarge: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const workflow = await postDischargeService.getDischargeById(id);

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== workflow.patientId) {
          throw new ForbiddenError('Cannot access this discharge workflow');
        }
      }

      res.json({
        success: true,
        data: workflow,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /discharges/encounter/:encounterId
   * Get discharge by encounter ID
   */
  getDischargeByEncounter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { encounterId } = req.params;
      const workflow = await postDischargeService.getDischargeByEncounterId(encounterId);

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== workflow.patientId) {
          throw new ForbiddenError('Cannot access this discharge workflow');
        }
      }

      res.json({
        success: true,
        data: workflow,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /discharges/patient/:patientId/all
   * Get all discharges for a patient
   */
  getPatientDischarges: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== patientId) {
          throw new ForbiddenError('Cannot access discharges for this patient');
        }
      }

      const workflows = await postDischargeService.getPatientDischarges(patientId);

      res.json({
        success: true,
        data: workflows,
        count: workflows.length,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /discharges/:patientId/risk-score
   * Get LACE+ risk score for a patient
   */
  getRiskScore: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== patientId) {
          throw new ForbiddenError('Cannot access risk score for this patient');
        }
      }

      const riskScore = await postDischargeService.getPatientRiskScore(patientId);

      if (!riskScore) {
        res.json({
          success: true,
          data: null,
          message: 'No risk score available for this patient',
        });
        return;
      }

      res.json({
        success: true,
        data: riskScore,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /discharges/calculate-lace
   * Calculate LACE+ score without storing
   */
  calculateLACEScore: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = LACEScoreInputSchema.parse(req.body);
      const score = postDischargeService.calculateLACEScore(input);

      res.json({
        success: true,
        data: score,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /discharges/:id/outreach
   * Trigger manual outreach
   */
  triggerOutreach: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = OutreachInputSchema.parse(req.body);

      const outreach = await postDischargeService.triggerOutreach(id, input);

      logger.info('Outreach triggered', {
        dischargeId: id,
        channel: input.channel,
        userId: req.user?.userId,
      });

      res.status(201).json({
        success: true,
        data: outreach,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /discharges/:id/outreach-history
   * Get outreach history
   */
  getOutreachHistory: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const workflow = await postDischargeService.getDischargeById(id);

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== workflow.patientId) {
          throw new ForbiddenError('Cannot access outreach history');
        }
      }

      res.json({
        success: true,
        data: workflow.outreachSequence,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /discharges/:id/questionnaire
   * Get symptom assessment questionnaire
   */
  getQuestionnaire: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Verify access to discharge
      const workflow = await postDischargeService.getDischargeById(id);

      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== workflow.patientId) {
          throw new ForbiddenError('Cannot access this questionnaire');
        }
      }

      const questionnaire = await postDischargeService.getQuestionnaire(id);

      res.json({
        success: true,
        data: questionnaire,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /discharges/:id/questionnaire
   * Submit questionnaire responses
   */
  submitQuestionnaire: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { responses } = QuestionnaireResponseSchema.parse(req.body);

      // Verify access to discharge
      const workflow = await postDischargeService.getDischargeById(id);

      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== workflow.patientId) {
          throw new ForbiddenError('Cannot submit this questionnaire');
        }
      }

      const assessment = await postDischargeService.submitQuestionnaire(id, responses);

      logger.info('Questionnaire submitted', {
        dischargeId: id,
        overallScore: assessment.overallScore,
        requiresEscalation: assessment.requiresEscalation,
        userId: req.user?.userId,
      });

      res.json({
        success: true,
        data: assessment,
        message: assessment.requiresEscalation
          ? 'Your responses indicate some concerning symptoms. Your care team has been notified.'
          : 'Thank you for completing your symptom assessment.',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /discharges/:id/escalate
   * Escalate to care team
   */
  escalateToCareTeam: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = EscalationInputSchema.parse(req.body);

      const escalation = await postDischargeService.escalateToCareTeam(id, input);

      logger.info('Care team escalation created', {
        dischargeId: id,
        escalationId: escalation.id,
        priority: input.priority,
        userId: req.user?.userId,
      });

      res.status(201).json({
        success: true,
        data: escalation,
        message: 'Your care team has been notified and will contact you shortly.',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /discharges/:id/escalations
   * Get escalation history
   */
  getEscalations: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const workflow = await postDischargeService.getDischargeById(id);

      // Escalations are managed separately, for now return empty array
      // In production, this would query an escalations table
      res.json({
        success: true,
        data: [],
        message: 'Escalation history retrieved',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /discharges/:id/checklist
   * Get discharge checklist status
   */
  getChecklist: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Verify access
      const workflow = await postDischargeService.getDischargeById(id);

      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== workflow.patientId) {
          throw new ForbiddenError('Cannot access this checklist');
        }
      }

      const checklist = await postDischargeService.getChecklistStatus(id);

      res.json({
        success: true,
        data: checklist,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /discharges/:id/checklist/:itemId
   * Update checklist item
   */
  updateChecklistItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, itemId } = req.params;
      const { completed, notes } = ChecklistUpdateSchema.parse(req.body);

      const item = await postDischargeService.updateChecklistItem(
        id,
        itemId,
        completed,
        req.user!.userId,
        notes
      );

      logger.info('Checklist item updated', {
        dischargeId: id,
        itemId,
        completed,
        userId: req.user?.userId,
      });

      res.json({
        success: true,
        data: item,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /discharges/:id/transportation
   * Request transportation
   */
  requestTransportation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = TransportationInputSchema.parse(req.body);

      // Verify access
      const workflow = await postDischargeService.getDischargeById(id);

      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== workflow.patientId) {
          throw new ForbiddenError('Cannot request transportation for this discharge');
        }
      }

      const request = await postDischargeService.requestTransportation(id, {
        ...input,
        scheduledTime: new Date(input.scheduledTime),
      });

      logger.info('Transportation requested', {
        dischargeId: id,
        requestId: request.id,
        userId: req.user?.userId,
      });

      res.status(201).json({
        success: true,
        data: request,
        message: 'Transportation request submitted. You will receive confirmation shortly.',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /discharges/:id/transportation
   * Get transportation requests
   */
  getTransportationRequests: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Verify access
      const workflow = await postDischargeService.getDischargeById(id);

      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== workflow.patientId) {
          throw new ForbiddenError('Cannot access transportation requests');
        }
      }

      // In production, this would query transportation requests table
      res.json({
        success: true,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /discharges/:id/sdoh
   * Get SDOH screening
   */
  getSDOHScreening: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const workflow = await postDischargeService.getDischargeById(id);

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== workflow.patientId) {
          throw new ForbiddenError('Cannot access SDOH screening');
        }
      }

      res.json({
        success: true,
        data: workflow.sdohScreening,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /discharges/:id/sdoh
   * Update SDOH screening
   */
  updateSDOHScreening: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = SDOHScreeningSchema.parse(req.body);

      const screening = await postDischargeService.updateSDOHScreening(id, input);

      logger.info('SDOH screening updated', {
        dischargeId: id,
        needsIdentified: screening.needsIdentified?.length || 0,
        userId: req.user?.userId,
      });

      res.json({
        success: true,
        data: screening,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /discharges/:id/medications
   * Get medication reconciliation
   */
  getMedicationReconciliation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const workflow = await postDischargeService.getDischargeById(id);

      // Check access permissions
      if (req.user?.role === 'patient') {
        const userPatient = await patientService.getPatientByUserId(req.user.userId);
        if (!userPatient || userPatient.id !== workflow.patientId) {
          throw new ForbiddenError('Cannot access medication reconciliation');
        }
      }

      res.json({
        success: true,
        data: workflow.medicationReconciliation,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /discharges/:id/medications
   * Complete medication reconciliation
   */
  completeMedicationReconciliation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input = MedicationReconciliationSchema.parse(req.body);

      const reconciliation = await postDischargeService.completeMedicationReconciliation(id, input);

      logger.info('Medication reconciliation completed', {
        dischargeId: id,
        medicationCount: reconciliation.medications?.length || 0,
        discrepancyCount: reconciliation.discrepancies?.length || 0,
        userId: req.user?.userId,
      });

      res.json({
        success: true,
        data: reconciliation,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default postDischargeController;
