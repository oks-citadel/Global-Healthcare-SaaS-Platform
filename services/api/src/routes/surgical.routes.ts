/**
 * Surgical Scheduling Routes
 *
 * Provides endpoints for surgical scheduling operations including:
 * - OR block management
 * - Surgical case scheduling
 * - Duration prediction
 * - Schedule optimization
 * - Emergency case insertion
 * - Equipment availability
 * - Utilization analytics
 */

import { Router } from 'express';
import { surgicalController } from '../controllers/surgical.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// ==========================================
// OR Block Management
// ==========================================

/**
 * @route   POST /surgical/blocks
 * @desc    Create a new OR block schedule
 * @access  Provider, Admin
 * @body    {
 *            operatingRoomId: string,
 *            surgeonId: string,
 *            date: string (ISO datetime),
 *            startTime: string (HH:MM),
 *            endTime: string (HH:MM),
 *            blockType: 'dedicated' | 'shared' | 'open' | 'emergency_reserve',
 *            specialty: string,
 *            notes?: string,
 *            recurring?: boolean,
 *            recurrencePattern?: 'daily' | 'weekly' | 'biweekly' | 'monthly',
 *            recurrenceEndDate?: string
 *          }
 */
router.post(
  '/blocks',
  authenticate,
  authorize('provider', 'admin'),
  surgicalController.createORBlock
);

/**
 * @route   GET /surgical/blocks
 * @desc    List OR blocks with filters and utilization data
 * @access  Authenticated
 * @query   {
 *            operatingRoomId?: string,
 *            surgeonId?: string,
 *            specialty?: string,
 *            blockType?: string,
 *            date?: string,
 *            from?: string,
 *            to?: string,
 *            page?: number,
 *            limit?: number
 *          }
 */
router.get('/blocks', authenticate, surgicalController.listORBlocks);

/**
 * @route   GET /surgical/blocks/:id
 * @desc    Get OR block by ID with utilization details
 * @access  Authenticated
 */
router.get('/blocks/:id', authenticate, surgicalController.getORBlock);

// ==========================================
// Surgical Case Management
// ==========================================

/**
 * @route   POST /surgical/cases
 * @desc    Schedule a new surgical case
 * @access  Provider, Admin
 * @body    {
 *            patientId: string,
 *            primarySurgeonId: string,
 *            procedureCode: string,
 *            procedureName: string,
 *            scheduledDate: string,
 *            estimatedDuration: number (minutes),
 *            priority: 'elective' | 'urgent' | 'emergent',
 *            anesthesiaType: 'general' | 'regional' | 'local' | 'sedation' | 'none',
 *            preOpDiagnosis?: string,
 *            specialEquipment?: string[],
 *            staffRequirements?: object,
 *            operatingRoomId?: string,
 *            blockId?: string,
 *            laterality?: 'left' | 'right' | 'bilateral' | 'not_applicable',
 *            notes?: string
 *          }
 */
router.post(
  '/cases',
  authenticate,
  authorize('provider', 'admin'),
  surgicalController.scheduleSurgicalCase
);

/**
 * @route   GET /surgical/cases/:id
 * @desc    Get surgical case by ID
 * @access  Authenticated (with access check)
 */
router.get('/cases/:id', authenticate, surgicalController.getSurgicalCase);

/**
 * @route   PATCH /surgical/cases/:id
 * @desc    Update surgical case
 * @access  Provider (primary surgeon), Admin
 * @body    {
 *            scheduledDate?: string,
 *            estimatedDuration?: number,
 *            priority?: string,
 *            operatingRoomId?: string,
 *            status?: string,
 *            notes?: string,
 *            actualStartTime?: string,
 *            actualEndTime?: string
 *          }
 */
router.patch(
  '/cases/:id',
  authenticate,
  authorize('provider', 'admin'),
  surgicalController.updateSurgicalCase
);

// ==========================================
// Duration Prediction
// ==========================================

/**
 * @route   GET /surgical/cases/:id/duration-prediction
 * @desc    Get AI-driven duration prediction for an existing case
 * @access  Authenticated
 * @returns {
 *            procedureCode: string,
 *            surgeonId: string,
 *            prediction: {
 *              estimatedDuration: number,
 *              confidenceInterval: { lower: number, upper: number },
 *              confidence: number
 *            },
 *            factors: object,
 *            historicalData: object
 *          }
 */
router.get(
  '/cases/:id/duration-prediction',
  authenticate,
  surgicalController.getCaseDurationPrediction
);

/**
 * @route   POST /surgical/predict-duration
 * @desc    Predict duration for a hypothetical case (before scheduling)
 * @access  Authenticated
 * @body    {
 *            procedureCode: string,
 *            surgeonId: string,
 *            patientId?: string,
 *            anesthesiaType?: string,
 *            patientFactors?: {
 *              age?: number,
 *              bmi?: number,
 *              asaScore?: number,
 *              comorbidities?: string[],
 *              previousSurgeries?: number
 *            }
 *          }
 */
router.post('/predict-duration', authenticate, surgicalController.predictDuration);

// ==========================================
// Schedule Optimization
// ==========================================

/**
 * @route   POST /surgical/optimize
 * @desc    Run the schedule optimization algorithm
 * @access  Admin only
 * @body    {
 *            targetDate: string,
 *            optimizationGoal: 'maximize_utilization' | 'minimize_overtime' |
 *                              'balance_workload' | 'minimize_turnover' | 'patient_preference',
 *            constraints?: {
 *              maxOvertimeMinutes?: number,
 *              minTurnoverMinutes?: number,
 *              respectBlockOwnership?: boolean,
 *              considerStaffAvailability?: boolean,
 *              considerEquipmentAvailability?: boolean
 *            },
 *            scope?: 'all' | 'unscheduled_only' | 'specific_rooms',
 *            operatingRoomIds?: string[]
 *          }
 * @returns {
 *            optimizationId: string,
 *            status: 'completed' | 'partial' | 'failed',
 *            originalMetrics: object,
 *            optimizedMetrics: object,
 *            improvement: object,
 *            proposedChanges: array,
 *            warnings: string[]
 *          }
 */
router.post(
  '/optimize',
  authenticate,
  authorize('admin'),
  surgicalController.runOptimization
);

// ==========================================
// Emergency Case Insertion
// ==========================================

/**
 * @route   POST /surgical/emergency-insert
 * @desc    Insert an emergency case into the schedule
 * @access  Provider, Admin
 * @body    {
 *            patientId: string,
 *            primarySurgeonId: string,
 *            procedureCode: string,
 *            procedureName: string,
 *            estimatedDuration: number,
 *            priority: 'urgent' | 'emergent',
 *            anesthesiaType: string,
 *            preOpDiagnosis: string,
 *            specialEquipment?: string[],
 *            mustStartBy?: string,
 *            notes?: string
 *          }
 * @returns {
 *            caseId: string,
 *            insertionSuccessful: boolean,
 *            assignedRoom?: object,
 *            estimatedStartTime?: string,
 *            displacedCases: array,
 *            resourceAvailability: object,
 *            alternativeOptions?: array,
 *            alerts: string[]
 *          }
 */
router.post(
  '/emergency-insert',
  authenticate,
  authorize('provider', 'admin'),
  surgicalController.insertEmergencyCase
);

// ==========================================
// Equipment Availability
// ==========================================

/**
 * @route   GET /surgical/equipment-availability
 * @desc    Check equipment availability for a time slot
 * @access  Authenticated
 * @query   {
 *            equipmentIds?: string[],
 *            equipmentTypes?: string[],
 *            date: string,
 *            startTime: string (HH:MM),
 *            endTime: string (HH:MM),
 *            operatingRoomId?: string
 *          }
 * @returns {
 *            requestedDate: string,
 *            requestedTimeSlot: { start: string, end: string },
 *            equipment: array,
 *            conflicts: array
 *          }
 */
router.get('/equipment-availability', authenticate, surgicalController.checkEquipmentAvailability);

// ==========================================
// Utilization Analytics
// ==========================================

/**
 * @route   GET /surgical/utilization
 * @desc    Get utilization analytics and reporting
 * @access  Provider, Admin
 * @query   {
 *            from: string,
 *            to: string,
 *            groupBy?: 'room' | 'surgeon' | 'specialty' | 'day' | 'week' | 'month',
 *            operatingRoomIds?: string[],
 *            surgeonIds?: string[],
 *            specialties?: string[],
 *            includeMetrics?: string[]
 *          }
 * @returns {
 *            period: { from: string, to: string },
 *            groupBy: string,
 *            summary: object,
 *            breakdown: array,
 *            insights: array
 *          }
 */
router.get(
  '/utilization',
  authenticate,
  authorize('provider', 'admin'),
  surgicalController.getUtilizationAnalytics
);

// ==========================================
// Cancellation Prediction
// ==========================================

/**
 * @route   GET /surgical/cases/:id/cancellation-risk
 * @desc    Get cancellation/no-show prediction for a case
 * @access  Authenticated (with access check)
 * @returns {
 *            caseId: string,
 *            patientId: string,
 *            cancellationRisk: {
 *              probability: number,
 *              riskLevel: 'low' | 'medium' | 'high',
 *              confidence: number
 *            },
 *            riskFactors: array,
 *            recommendations: array,
 *            historicalData: object
 *          }
 */
router.get(
  '/cases/:id/cancellation-risk',
  authenticate,
  surgicalController.getCancellationPrediction
);

export { router as surgicalRoutes };
