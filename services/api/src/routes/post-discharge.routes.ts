// @ts-nocheck
import { Router } from 'express';
import { postDischargeController } from '../controllers/post-discharge.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

/**
 * Post-Discharge Follow-Up Routes
 *
 * Provides endpoints for managing post-discharge patient care including:
 * - Discharge workflow initiation
 * - LACE+ readmission risk scoring
 * - Automated outreach sequences
 * - Symptom assessment questionnaires
 * - Care team escalation
 * - Discharge checklist management
 * - Transportation coordination
 * - SDOH screening
 * - Medication reconciliation
 */

const router = Router();

// ==========================================
// Discharge Workflow Management
// ==========================================

/**
 * POST /discharges/:encounterId/initiate
 * Start a new discharge workflow for a completed encounter
 *
 * @description Initiates the post-discharge care workflow including
 * setting up outreach schedule, creating checklist, and calculating risk score
 * @access Provider, Admin
 */
router.post(
  '/:encounterId/initiate',
  authenticate,
  authorize('provider', 'admin'),
  postDischargeController.initiateDischarge
);

/**
 * GET /discharges/:id
 * Get discharge workflow details
 *
 * @description Retrieves full details of a discharge workflow
 * @access Authenticated (patients see own, providers/admin see all)
 */
router.get(
  '/:id',
  authenticate,
  postDischargeController.getDischarge
);

/**
 * GET /discharges/encounter/:encounterId
 * Get discharge workflow by encounter ID
 *
 * @description Retrieves discharge workflow associated with an encounter
 * @access Authenticated
 */
router.get(
  '/encounter/:encounterId',
  authenticate,
  postDischargeController.getDischargeByEncounter
);

/**
 * GET /discharges/patient/:patientId
 * Get all discharge workflows for a patient
 *
 * @description Lists all discharge workflows for a specific patient
 * @access Authenticated (patients see own, providers/admin see all)
 */
router.get(
  '/patient/:patientId/all',
  authenticate,
  postDischargeController.getPatientDischarges
);

// ==========================================
// LACE+ Risk Score
// ==========================================

/**
 * GET /discharges/:patientId/risk-score
 * Get LACE+ readmission risk score for a patient
 *
 * @description Retrieves the most recent LACE+ score and readmission risk
 * analysis for a patient
 * @access Authenticated
 */
router.get(
  '/:patientId/risk-score',
  authenticate,
  postDischargeController.getRiskScore
);

/**
 * POST /discharges/calculate-lace
 * Calculate LACE+ score
 *
 * @description Calculates LACE+ readmission risk score based on provided
 * clinical data without storing it
 * @access Provider, Admin
 */
router.post(
  '/calculate-lace',
  authenticate,
  authorize('provider', 'admin'),
  postDischargeController.calculateLACEScore
);

// ==========================================
// Outreach Management
// ==========================================

/**
 * POST /discharges/:id/outreach
 * Trigger outreach sequence
 *
 * @description Manually triggers an outreach to the patient via
 * specified channel (phone, SMS, email, or app notification)
 * @access Provider, Admin
 */
router.post(
  '/:id/outreach',
  authenticate,
  authorize('provider', 'admin'),
  postDischargeController.triggerOutreach
);

/**
 * GET /discharges/:id/outreach-history
 * Get outreach history
 *
 * @description Retrieves the complete outreach history for a discharge
 * @access Authenticated
 */
router.get(
  '/:id/outreach-history',
  authenticate,
  postDischargeController.getOutreachHistory
);

// ==========================================
// Symptom Assessment Questionnaire
// ==========================================

/**
 * GET /discharges/:id/questionnaire
 * Get symptom assessment questionnaire
 *
 * @description Retrieves the symptom assessment questionnaire for a
 * discharge workflow, creating one if it doesn't exist
 * @access Authenticated
 */
router.get(
  '/:id/questionnaire',
  authenticate,
  postDischargeController.getQuestionnaire
);

/**
 * POST /discharges/:id/questionnaire
 * Submit symptom assessment questionnaire
 *
 * @description Submits patient responses to the symptom assessment
 * questionnaire and triggers escalation if concerning symptoms detected
 * @access Authenticated
 */
router.post(
  '/:id/questionnaire',
  authenticate,
  postDischargeController.submitQuestionnaire
);

// ==========================================
// Care Team Escalation
// ==========================================

/**
 * POST /discharges/:id/escalate
 * Escalate to care team
 *
 * @description Creates an escalation request for the care team with
 * specified priority and reason
 * @access Authenticated
 */
router.post(
  '/:id/escalate',
  authenticate,
  postDischargeController.escalateToCareTeam
);

/**
 * GET /discharges/:id/escalations
 * Get escalation history
 *
 * @description Retrieves all escalations associated with a discharge
 * @access Provider, Admin
 */
router.get(
  '/:id/escalations',
  authenticate,
  authorize('provider', 'admin'),
  postDischargeController.getEscalations
);

// ==========================================
// Discharge Checklist
// ==========================================

/**
 * GET /discharges/:id/checklist
 * Get discharge checklist status
 *
 * @description Retrieves the current status of all discharge checklist items
 * including completion percentage and missing required items
 * @access Authenticated
 */
router.get(
  '/:id/checklist',
  authenticate,
  postDischargeController.getChecklist
);

/**
 * PATCH /discharges/:id/checklist/:itemId
 * Update checklist item
 *
 * @description Marks a checklist item as completed or incomplete
 * @access Provider, Admin
 */
router.patch(
  '/:id/checklist/:itemId',
  authenticate,
  authorize('provider', 'admin'),
  postDischargeController.updateChecklistItem
);

// ==========================================
// Transportation Coordination
// ==========================================

/**
 * POST /discharges/:id/transportation
 * Request transportation
 *
 * @description Creates a transportation request for patient appointments
 * or other healthcare-related travel needs
 * @access Authenticated
 */
router.post(
  '/:id/transportation',
  authenticate,
  postDischargeController.requestTransportation
);

/**
 * GET /discharges/:id/transportation
 * Get transportation requests
 *
 * @description Retrieves all transportation requests for a discharge
 * @access Authenticated
 */
router.get(
  '/:id/transportation',
  authenticate,
  postDischargeController.getTransportationRequests
);

// ==========================================
// Social Determinants of Health (SDOH)
// ==========================================

/**
 * GET /discharges/:id/sdoh
 * Get SDOH screening
 *
 * @description Retrieves SDOH screening results and identified needs
 * @access Authenticated
 */
router.get(
  '/:id/sdoh',
  authenticate,
  postDischargeController.getSDOHScreening
);

/**
 * PUT /discharges/:id/sdoh
 * Update SDOH screening
 *
 * @description Updates SDOH screening results
 * @access Provider, Admin
 */
router.put(
  '/:id/sdoh',
  authenticate,
  authorize('provider', 'admin'),
  postDischargeController.updateSDOHScreening
);

// ==========================================
// Medication Reconciliation
// ==========================================

/**
 * GET /discharges/:id/medications
 * Get medication reconciliation
 *
 * @description Retrieves medication reconciliation details
 * @access Authenticated
 */
router.get(
  '/:id/medications',
  authenticate,
  postDischargeController.getMedicationReconciliation
);

/**
 * PUT /discharges/:id/medications
 * Complete medication reconciliation
 *
 * @description Updates medication reconciliation status
 * @access Provider, Admin
 */
router.put(
  '/:id/medications',
  authenticate,
  authorize('provider', 'admin'),
  postDischargeController.completeMedicationReconciliation
);

export { router as postDischargeRoutes };
export default router;
