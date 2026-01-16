import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { notificationService } from './notification.service.js';
import { getNotificationQueues } from '../lib/queue.js';

/**
 * Post-Discharge Follow-Up Service
 *
 * Provides comprehensive post-discharge care management including:
 * - LACE+ readmission risk prediction
 * - Automated outreach workflows
 * - Symptom assessment questionnaires
 * - Care team escalation
 * - Social determinants of health (SDOH) screening
 * - Transportation coordination
 * - Medication reconciliation
 */

// ==========================================
// Types and Interfaces
// ==========================================

export enum DischargeStatus {
  PENDING = 'pending',
  INITIATED = 'initiated',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ESCALATED = 'escalated',
  READMITTED = 'readmitted',
}

export enum OutreachChannel {
  PHONE = 'phone',
  SMS = 'sms',
  EMAIL = 'email',
  APP = 'app',
}

export enum OutreachStatus {
  SCHEDULED = 'scheduled',
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PATIENT_UNREACHABLE = 'patient_unreachable',
}

export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
}

export enum EscalationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical',
}

export enum QuestionnaireStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

export enum TransportationStatus {
  REQUESTED = 'requested',
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_TRANSIT = 'in_transit',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface LACEScoreInput {
  lengthOfStay: number; // days
  acuteAdmission: boolean; // admitted through ED
  comorbidities: string[]; // list of conditions for Charlson score
  edVisits6Months: number; // ED visits in past 6 months
}

export interface LACEScoreResult {
  totalScore: number;
  riskLevel: RiskLevel;
  lengthOfStayScore: number;
  acuityScore: number;
  comorbidityScore: number;
  edVisitScore: number;
  readmissionProbability: number;
  recommendations: string[];
}

export interface DischargeWorkflow {
  id: string;
  encounterId: string;
  patientId: string;
  status: DischargeStatus;
  laceScore: LACEScoreResult | null;
  dischargeDate: Date;
  dischargeInstructions: string | null;
  followUpAppointmentId: string | null;
  primaryCareProviderId: string | null;
  outreachSequence: OutreachSequenceItem[];
  checklistItems: ChecklistItem[];
  sdohScreening: SDOHScreening | null;
  medicationReconciliation: MedicationReconciliation | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OutreachSequenceItem {
  id: string;
  day: number;
  type: string;
  channel: OutreachChannel;
  status: OutreachStatus;
  scheduledAt: Date;
  completedAt: Date | null;
  attempts: number;
  response: string | null;
  notes: string | null;
}

export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  completed: boolean;
  completedAt: Date | null;
  completedBy: string | null;
  notes: string | null;
  required: boolean;
}

export interface SDOHScreening {
  id: string;
  completedAt: Date | null;
  housingStability: string | null;
  foodSecurity: string | null;
  transportation: string | null;
  socialSupport: string | null;
  financialStrain: string | null;
  healthLiteracy: string | null;
  needsIdentified: string[];
  referrals: SDOHReferral[];
}

export interface SDOHReferral {
  type: string;
  organization: string;
  status: string;
  referredAt: Date;
  followedUpAt: Date | null;
}

export interface MedicationReconciliation {
  id: string;
  completedAt: Date | null;
  medications: MedicationItem[];
  discrepancies: MedicationDiscrepancy[];
  pharmacyConfirmation: boolean;
  patientEducationCompleted: boolean;
}

export interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  purpose: string;
  isNew: boolean;
  instructions: string | null;
}

export interface MedicationDiscrepancy {
  medicationName: string;
  type: 'missing' | 'duplicate' | 'dose_change' | 'new' | 'discontinued';
  description: string;
  resolved: boolean;
  resolvedAt: Date | null;
  resolvedBy: string | null;
}

export interface SymptomAssessment {
  id: string;
  dischargeId: string;
  status: QuestionnaireStatus;
  questions: AssessmentQuestion[];
  overallScore: number | null;
  requiresEscalation: boolean;
  createdAt: Date;
  completedAt: Date | null;
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  type: 'scale' | 'boolean' | 'text' | 'multiple_choice';
  options?: string[];
  answer: string | number | boolean | null;
  weight: number;
  criticalThreshold?: number;
}

export interface EscalationRequest {
  id: string;
  dischargeId: string;
  priority: EscalationPriority;
  reason: string;
  symptoms: string[];
  triggerSource: 'questionnaire' | 'outreach' | 'patient_call' | 'vitals' | 'manual';
  assignedTo: string | null;
  status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'transferred';
  createdAt: Date;
  acknowledgedAt: Date | null;
  resolvedAt: Date | null;
  resolution: string | null;
}

export interface TransportationRequest {
  id: string;
  dischargeId: string;
  appointmentId: string | null;
  status: TransportationStatus;
  pickupAddress: string;
  destinationAddress: string;
  scheduledTime: Date;
  specialNeeds: string[];
  provider: string | null;
  confirmationNumber: string | null;
  estimatedCost: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InitiateDischargeInput {
  encounterId: string;
  dischargeInstructions?: string;
  followUpAppointmentId?: string;
  primaryCareProviderId?: string;
  laceScoreInput?: LACEScoreInput;
  medications?: MedicationItem[];
  customOutreachSchedule?: Partial<OutreachSequenceItem>[];
}

export interface OutreachInput {
  channel: OutreachChannel;
  message?: string;
  subject?: string;
  template?: string;
  force?: boolean;
}

export interface QuestionnaireResponse {
  questionId: string;
  answer: string | number | boolean;
}

export interface EscalationInput {
  priority: EscalationPriority;
  reason: string;
  symptoms?: string[];
  notes?: string;
  assignTo?: string;
}

export interface TransportationInput {
  appointmentId?: string;
  pickupAddress: string;
  destinationAddress: string;
  scheduledTime: Date;
  specialNeeds?: string[];
  notes?: string;
}

// ==========================================
// Charlson Comorbidity Index Weights
// ==========================================

const CHARLSON_WEIGHTS: Record<string, number> = {
  'myocardial_infarction': 1,
  'congestive_heart_failure': 1,
  'peripheral_vascular_disease': 1,
  'cerebrovascular_disease': 1,
  'dementia': 1,
  'chronic_pulmonary_disease': 1,
  'rheumatic_disease': 1,
  'peptic_ulcer_disease': 1,
  'mild_liver_disease': 1,
  'diabetes_without_complications': 1,
  'diabetes_with_complications': 2,
  'hemiplegia_or_paraplegia': 2,
  'renal_disease': 2,
  'malignancy': 2,
  'moderate_severe_liver_disease': 3,
  'metastatic_solid_tumor': 6,
  'aids_hiv': 6,
};

// ==========================================
// Default Outreach Timeline
// ==========================================

const DEFAULT_OUTREACH_TIMELINE = [
  { day: 1, type: 'discharge_confirmation', channel: OutreachChannel.PHONE },
  { day: 3, type: 'medication_check', channel: OutreachChannel.SMS },
  { day: 7, type: 'symptom_assessment', channel: OutreachChannel.APP },
  { day: 14, type: 'followup_confirmation', channel: OutreachChannel.PHONE },
  { day: 30, type: 'readmission_window_close', channel: OutreachChannel.EMAIL },
];

// ==========================================
// Default Discharge Checklist
// ==========================================

const DEFAULT_CHECKLIST_ITEMS: Omit<ChecklistItem, 'id' | 'completed' | 'completedAt' | 'completedBy' | 'notes'>[] = [
  { category: 'Documentation', item: 'Discharge summary completed', required: true },
  { category: 'Documentation', item: 'Patient education materials provided', required: true },
  { category: 'Documentation', item: 'Care instructions reviewed with patient', required: true },
  { category: 'Medications', item: 'Medication reconciliation completed', required: true },
  { category: 'Medications', item: 'Prescription sent to pharmacy', required: true },
  { category: 'Medications', item: 'Patient understands medication regimen', required: true },
  { category: 'Follow-up', item: 'Follow-up appointment scheduled', required: true },
  { category: 'Follow-up', item: 'PCP notified of discharge', required: true },
  { category: 'Follow-up', item: 'Specialist referrals arranged', required: false },
  { category: 'Social Needs', item: 'SDOH screening completed', required: true },
  { category: 'Social Needs', item: 'Transportation arranged if needed', required: false },
  { category: 'Social Needs', item: 'Home health services arranged if needed', required: false },
  { category: 'Communication', item: 'Emergency contact information verified', required: true },
  { category: 'Communication', item: 'Patient preferred contact method confirmed', required: true },
  { category: 'Assessment', item: 'LACE score calculated', required: true },
  { category: 'Assessment', item: 'Risk level communicated to care team', required: true },
];

// ==========================================
// Symptom Assessment Questions
// ==========================================

const SYMPTOM_ASSESSMENT_QUESTIONS: Omit<AssessmentQuestion, 'answer'>[] = [
  {
    id: 'pain_level',
    category: 'Pain',
    question: 'On a scale of 0-10, how would you rate your current pain level?',
    type: 'scale',
    weight: 1.5,
    criticalThreshold: 8,
  },
  {
    id: 'breathing',
    category: 'Respiratory',
    question: 'Are you experiencing any difficulty breathing or shortness of breath?',
    type: 'boolean',
    weight: 2.0,
  },
  {
    id: 'fever',
    category: 'Vital Signs',
    question: 'Have you had a fever (temperature over 100.4F/38C) since discharge?',
    type: 'boolean',
    weight: 1.5,
  },
  {
    id: 'wound_status',
    category: 'Wound Care',
    question: 'If you have a surgical wound, is there any redness, swelling, or drainage?',
    type: 'multiple_choice',
    options: ['No wound', 'Healing well', 'Minor redness', 'Significant redness/swelling', 'Drainage present'],
    weight: 1.5,
    criticalThreshold: 3,
  },
  {
    id: 'medication_adherence',
    category: 'Medications',
    question: 'Have you been able to take all your medications as prescribed?',
    type: 'boolean',
    weight: 1.0,
  },
  {
    id: 'side_effects',
    category: 'Medications',
    question: 'Are you experiencing any medication side effects?',
    type: 'text',
    weight: 1.0,
  },
  {
    id: 'appetite',
    category: 'General Health',
    question: 'How would you rate your appetite?',
    type: 'multiple_choice',
    options: ['Normal', 'Slightly decreased', 'Significantly decreased', 'No appetite'],
    weight: 0.5,
    criticalThreshold: 3,
  },
  {
    id: 'mobility',
    category: 'Functional Status',
    question: 'Compared to before your hospitalization, how is your mobility?',
    type: 'multiple_choice',
    options: ['Same as before', 'Slightly worse', 'Much worse', 'Unable to move independently'],
    weight: 1.0,
    criticalThreshold: 3,
  },
  {
    id: 'mental_health',
    category: 'Mental Health',
    question: 'How would you rate your mood and emotional well-being?',
    type: 'scale',
    weight: 0.5,
    criticalThreshold: 3,
  },
  {
    id: 'understanding',
    category: 'Care Plan',
    question: 'Do you understand your discharge instructions and follow-up plan?',
    type: 'boolean',
    weight: 0.5,
  },
  {
    id: 'concerns',
    category: 'General',
    question: 'Do you have any other concerns or questions about your recovery?',
    type: 'text',
    weight: 0.5,
  },
];

// ==========================================
// In-Memory Storage (Replace with database in production)
// ==========================================

const dischargeWorkflows = new Map<string, DischargeWorkflow>();
const symptomAssessments = new Map<string, SymptomAssessment>();
const escalations = new Map<string, EscalationRequest>();
const transportationRequests = new Map<string, TransportationRequest>();

// ==========================================
// Post-Discharge Service
// ==========================================

export const postDischargeService = {
  /**
   * Calculate LACE+ Score for readmission risk prediction
   *
   * LACE Score Components:
   * L - Length of stay (1-7 points)
   * A - Acuity of admission (0 or 3 points)
   * C - Comorbidity (Charlson score, 0-6 points)
   * E - ED visits in past 6 months (0-4 points)
   */
  calculateLACEScore(input: LACEScoreInput): LACEScoreResult {
    // L - Length of Stay Score
    let lengthOfStayScore: number;
    if (input.lengthOfStay < 1) {
      lengthOfStayScore = 0;
    } else if (input.lengthOfStay === 1) {
      lengthOfStayScore = 1;
    } else if (input.lengthOfStay === 2) {
      lengthOfStayScore = 2;
    } else if (input.lengthOfStay === 3) {
      lengthOfStayScore = 3;
    } else if (input.lengthOfStay >= 4 && input.lengthOfStay <= 6) {
      lengthOfStayScore = 4;
    } else if (input.lengthOfStay >= 7 && input.lengthOfStay <= 13) {
      lengthOfStayScore = 5;
    } else {
      lengthOfStayScore = 7; // 14+ days
    }

    // A - Acuity Score (admitted through ED = acute)
    const acuityScore = input.acuteAdmission ? 3 : 0;

    // C - Comorbidity Score (Charlson Index)
    let charlsonScore = 0;
    for (const condition of input.comorbidities) {
      const normalizedCondition = condition.toLowerCase().replace(/\s+/g, '_');
      if (CHARLSON_WEIGHTS[normalizedCondition]) {
        charlsonScore += CHARLSON_WEIGHTS[normalizedCondition];
      }
    }
    // Cap Charlson component at 6 for LACE scoring
    const comorbidityScore = Math.min(charlsonScore, 6);

    // E - ED Visits Score
    let edVisitScore: number;
    if (input.edVisits6Months === 0) {
      edVisitScore = 0;
    } else if (input.edVisits6Months === 1) {
      edVisitScore = 1;
    } else if (input.edVisits6Months === 2) {
      edVisitScore = 2;
    } else if (input.edVisits6Months === 3) {
      edVisitScore = 3;
    } else {
      edVisitScore = 4; // 4+ visits
    }

    // Calculate total LACE score
    const totalScore = lengthOfStayScore + acuityScore + comorbidityScore + edVisitScore;

    // Determine risk level and readmission probability
    let riskLevel: RiskLevel;
    let readmissionProbability: number;
    const recommendations: string[] = [];

    if (totalScore <= 4) {
      riskLevel = RiskLevel.LOW;
      readmissionProbability = 0.02; // ~2%
      recommendations.push('Standard post-discharge follow-up protocol');
      recommendations.push('Schedule routine follow-up within 14 days');
    } else if (totalScore <= 9) {
      riskLevel = RiskLevel.MODERATE;
      readmissionProbability = 0.08; // ~8%
      recommendations.push('Enhanced follow-up with phone call within 48 hours');
      recommendations.push('Consider home health assessment');
      recommendations.push('Medication reconciliation priority');
    } else if (totalScore <= 12) {
      riskLevel = RiskLevel.HIGH;
      readmissionProbability = 0.21; // ~21%
      recommendations.push('High-intensity transitional care management');
      recommendations.push('Daily check-ins for first week');
      recommendations.push('Home health referral recommended');
      recommendations.push('Consider social work consultation');
      recommendations.push('Pharmacist medication review');
    } else {
      riskLevel = RiskLevel.VERY_HIGH;
      readmissionProbability = 0.35; // ~35%
      recommendations.push('Intensive care transition program enrollment');
      recommendations.push('Same-day discharge call required');
      recommendations.push('Home health with skilled nursing');
      recommendations.push('Care coordinator assignment');
      recommendations.push('Consider bridge clinic appointment within 72 hours');
      recommendations.push('Social determinants of health screening urgent');
    }

    logger.info('LACE score calculated', {
      totalScore,
      riskLevel,
      lengthOfStayScore,
      acuityScore,
      comorbidityScore,
      edVisitScore,
      readmissionProbability,
    });

    return {
      totalScore,
      riskLevel,
      lengthOfStayScore,
      acuityScore,
      comorbidityScore,
      edVisitScore,
      readmissionProbability,
      recommendations,
    };
  },

  /**
   * Initiate post-discharge workflow for an encounter
   */
  async initiateDischarge(input: InitiateDischargeInput): Promise<DischargeWorkflow> {
    // Verify encounter exists and is finished
    const encounter = await prisma.encounter.findUnique({
      where: { id: input.encounterId },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        provider: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!encounter) {
      throw new NotFoundError('Encounter not found');
    }

    if (encounter.status !== 'finished') {
      throw new BadRequestError('Encounter must be finished before initiating discharge workflow');
    }

    // Check if workflow already exists
    const existingWorkflow = Array.from(dischargeWorkflows.values()).find(
      w => w.encounterId === input.encounterId
    );

    if (existingWorkflow) {
      throw new BadRequestError('Discharge workflow already exists for this encounter');
    }

    // Calculate LACE score if input provided
    let laceScore: LACEScoreResult | null = null;
    if (input.laceScoreInput) {
      laceScore = this.calculateLACEScore(input.laceScoreInput);
    }

    // Create outreach sequence
    const dischargeDate = new Date();
    const outreachTimeline = input.customOutreachSchedule || DEFAULT_OUTREACH_TIMELINE;
    const outreachSequence: OutreachSequenceItem[] = outreachTimeline.map((item, index) => ({
      id: uuidv4(),
      day: item.day || DEFAULT_OUTREACH_TIMELINE[index]?.day || index + 1,
      type: item.type || DEFAULT_OUTREACH_TIMELINE[index]?.type || 'general_check',
      channel: item.channel || DEFAULT_OUTREACH_TIMELINE[index]?.channel || OutreachChannel.PHONE,
      status: OutreachStatus.SCHEDULED,
      scheduledAt: new Date(dischargeDate.getTime() + (item.day || index + 1) * 24 * 60 * 60 * 1000),
      completedAt: null,
      attempts: 0,
      response: null,
      notes: null,
    }));

    // Create checklist
    const checklistItems: ChecklistItem[] = DEFAULT_CHECKLIST_ITEMS.map(item => ({
      id: uuidv4(),
      ...item,
      completed: false,
      completedAt: null,
      completedBy: null,
      notes: null,
    }));

    // Create medication reconciliation if medications provided
    let medicationReconciliation: MedicationReconciliation | null = null;
    if (input.medications && input.medications.length > 0) {
      medicationReconciliation = {
        id: uuidv4(),
        completedAt: null,
        medications: input.medications,
        discrepancies: [],
        pharmacyConfirmation: false,
        patientEducationCompleted: false,
      };
    }

    // Create SDOH screening placeholder
    const sdohScreening: SDOHScreening = {
      id: uuidv4(),
      completedAt: null,
      housingStability: null,
      foodSecurity: null,
      transportation: null,
      socialSupport: null,
      financialStrain: null,
      healthLiteracy: null,
      needsIdentified: [],
      referrals: [],
    };

    // Create workflow
    const workflow: DischargeWorkflow = {
      id: uuidv4(),
      encounterId: input.encounterId,
      patientId: encounter.patientId,
      status: DischargeStatus.INITIATED,
      laceScore,
      dischargeDate,
      dischargeInstructions: input.dischargeInstructions || null,
      followUpAppointmentId: input.followUpAppointmentId || null,
      primaryCareProviderId: input.primaryCareProviderId || null,
      outreachSequence,
      checklistItems,
      sdohScreening,
      medicationReconciliation,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store workflow
    dischargeWorkflows.set(workflow.id, workflow);

    // Schedule initial outreach
    await this.scheduleOutreachSequence(workflow, encounter.patient);

    logger.info('Discharge workflow initiated', {
      workflowId: workflow.id,
      encounterId: input.encounterId,
      patientId: encounter.patientId,
      laceScore: laceScore?.totalScore,
      riskLevel: laceScore?.riskLevel,
    });

    return workflow;
  },

  /**
   * Schedule the outreach sequence
   */
  async scheduleOutreachSequence(workflow: DischargeWorkflow, patient: any): Promise<void> {
    const queues = getNotificationQueues();
    const patientEmail = patient?.user?.email;
    const patientPhone = patient?.user?.phone;

    for (const outreach of workflow.outreachSequence) {
      const delay = outreach.scheduledAt.getTime() - Date.now();

      if (delay > 0) {
        const messageContent = this.getOutreachMessage(outreach.type, workflow);

        switch (outreach.channel) {
          case OutreachChannel.EMAIL:
            if (patientEmail) {
              await queues.scheduleEmail(
                {
                  to: patientEmail,
                  subject: messageContent.subject,
                  html: messageContent.body,
                },
                delay
              );
            }
            break;
          case OutreachChannel.SMS:
            if (patientPhone) {
              await queues.scheduleSms(
                {
                  to: patientPhone,
                  message: messageContent.smsBody,
                },
                delay
              );
            }
            break;
          case OutreachChannel.APP:
          case OutreachChannel.PHONE:
            // These would trigger push notifications or call scheduling
            logger.info('Outreach scheduled', {
              type: outreach.channel,
              scheduledAt: outreach.scheduledAt,
              workflowId: workflow.id,
            });
            break;
        }
      }
    }
  },

  /**
   * Get outreach message content based on type
   */
  getOutreachMessage(type: string, workflow: DischargeWorkflow): { subject: string; body: string; smsBody: string } {
    const messages: Record<string, { subject: string; body: string; smsBody: string }> = {
      discharge_confirmation: {
        subject: 'Confirming Your Hospital Discharge',
        body: `
          <h2>Welcome Home!</h2>
          <p>We hope you're settling in well after your discharge. This is a courtesy call to check on you and make sure you have everything you need.</p>
          <p>If you have any questions about your discharge instructions or medications, please don't hesitate to contact us.</p>
          <p>Your care team is here to support you.</p>
        `,
        smsBody: 'Welcome home! Your care team is checking in. Reply HELP if you need assistance with your discharge instructions or medications.',
      },
      medication_check: {
        subject: 'Medication Check-In',
        body: `
          <h2>How Are Your Medications?</h2>
          <p>It's been a few days since your discharge. We're checking to make sure:</p>
          <ul>
            <li>You've been able to fill all your prescriptions</li>
            <li>You're taking your medications as prescribed</li>
            <li>You're not experiencing any side effects</li>
          </ul>
          <p>If you have any questions about your medications, please contact your pharmacist or care team.</p>
        `,
        smsBody: 'Medication check-in: Have you been able to take all your medications as prescribed? Reply YES, NO, or HELP for questions.',
      },
      symptom_assessment: {
        subject: 'How Are You Feeling? - Symptom Check',
        body: `
          <h2>One Week Check-In</h2>
          <p>It's been one week since your discharge. Please complete a brief symptom assessment to help us ensure your recovery is on track.</p>
          <p><a href="#">Click here to complete your symptom assessment</a></p>
          <p>This only takes 5 minutes and helps your care team monitor your recovery.</p>
        `,
        smsBody: 'Time for your weekly symptom check! Please complete your assessment in the app or reply CALL to speak with a nurse.',
      },
      followup_confirmation: {
        subject: 'Follow-Up Appointment Reminder',
        body: `
          <h2>Upcoming Follow-Up Appointment</h2>
          <p>This is a reminder about your scheduled follow-up appointment. Regular check-ups are important for your continued recovery.</p>
          <p>If you need to reschedule or have questions, please contact us.</p>
        `,
        smsBody: 'Reminder: You have a follow-up appointment scheduled. Reply CONFIRM to confirm or HELP to reschedule.',
      },
      readmission_window_close: {
        subject: 'Recovery Update - 30 Day Milestone',
        body: `
          <h2>Congratulations on Your Recovery Progress!</h2>
          <p>It's been 30 days since your discharge. We hope your recovery continues to go well.</p>
          <p>This marks an important milestone in your recovery journey. Please continue to:</p>
          <ul>
            <li>Take your medications as prescribed</li>
            <li>Attend all follow-up appointments</li>
            <li>Report any concerning symptoms to your care team</li>
          </ul>
        `,
        smsBody: '30-day milestone! Your care team congratulates you on your recovery progress. Contact us anytime if you need support.',
      },
    };

    return messages[type] || {
      subject: 'Check-In from Your Care Team',
      body: '<p>Your care team is checking in on your recovery. Please contact us if you have any questions or concerns.</p>',
      smsBody: 'Your care team is checking in. Reply HELP if you need assistance.',
    };
  },

  /**
   * Get discharge workflow by ID
   */
  async getDischargeById(id: string): Promise<DischargeWorkflow> {
    const workflow = dischargeWorkflows.get(id);
    if (!workflow) {
      throw new NotFoundError('Discharge workflow not found');
    }
    return workflow;
  },

  /**
   * Get discharge workflow by encounter ID
   */
  async getDischargeByEncounterId(encounterId: string): Promise<DischargeWorkflow> {
    const workflow = Array.from(dischargeWorkflows.values()).find(
      w => w.encounterId === encounterId
    );
    if (!workflow) {
      throw new NotFoundError('Discharge workflow not found for this encounter');
    }
    return workflow;
  },

  /**
   * Get LACE+ risk score for a patient
   */
  async getPatientRiskScore(patientId: string): Promise<LACEScoreResult | null> {
    // Get most recent discharge workflow for patient
    const workflows = Array.from(dischargeWorkflows.values())
      .filter(w => w.patientId === patientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (workflows.length === 0) {
      return null;
    }

    return workflows[0].laceScore;
  },

  /**
   * Trigger outreach for a discharge workflow
   */
  async triggerOutreach(id: string, input: OutreachInput): Promise<OutreachSequenceItem> {
    const workflow = await this.getDischargeById(id);

    // Find patient info
    const encounter = await prisma.encounter.findUnique({
      where: { id: workflow.encounterId },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!encounter) {
      throw new NotFoundError('Associated encounter not found');
    }

    const patient = encounter.patient;
    const queues = getNotificationQueues();

    // Create outreach item
    const outreachItem: OutreachSequenceItem = {
      id: uuidv4(),
      day: 0, // Immediate outreach
      type: 'manual_outreach',
      channel: input.channel,
      status: OutreachStatus.PENDING,
      scheduledAt: new Date(),
      completedAt: null,
      attempts: 1,
      response: null,
      notes: null,
    };

    // Send outreach based on channel
    try {
      switch (input.channel) {
        case OutreachChannel.EMAIL:
          if (patient?.user?.email) {
            await queues.addEmailJob({
              to: patient.user.email,
              subject: input.subject || 'Important Message from Your Care Team',
              html: input.message || 'Your care team needs to speak with you. Please contact us at your earliest convenience.',
            });
          }
          break;
        case OutreachChannel.SMS:
          if (patient?.user?.phone) {
            await queues.addSmsJob({
              to: patient.user.phone,
              message: input.message || 'Your care team needs to speak with you. Please call us back.',
            });
          }
          break;
        case OutreachChannel.APP:
          // Would trigger push notification
          logger.info('App notification triggered', { workflowId: id });
          break;
        case OutreachChannel.PHONE:
          // Would trigger phone call scheduling
          logger.info('Phone call scheduled', { workflowId: id });
          break;
      }

      outreachItem.status = OutreachStatus.COMPLETED;
      outreachItem.completedAt = new Date();
    } catch (error) {
      outreachItem.status = OutreachStatus.FAILED;
      outreachItem.notes = error instanceof Error ? error.message : 'Unknown error';
    }

    // Add to workflow
    workflow.outreachSequence.push(outreachItem);
    workflow.updatedAt = new Date();
    dischargeWorkflows.set(workflow.id, workflow);

    logger.info('Outreach triggered', {
      workflowId: id,
      channel: input.channel,
      status: outreachItem.status,
    });

    return outreachItem;
  },

  /**
   * Get symptom assessment questionnaire
   */
  async getQuestionnaire(dischargeId: string): Promise<SymptomAssessment> {
    // Check if assessment already exists
    let assessment = symptomAssessments.get(dischargeId);

    if (!assessment) {
      // Verify discharge workflow exists
      const workflow = await this.getDischargeById(dischargeId);

      // Create new assessment
      assessment = {
        id: uuidv4(),
        dischargeId,
        status: QuestionnaireStatus.NOT_STARTED,
        questions: SYMPTOM_ASSESSMENT_QUESTIONS.map(q => ({
          ...q,
          answer: null,
        })),
        overallScore: null,
        requiresEscalation: false,
        createdAt: new Date(),
        completedAt: null,
      };

      symptomAssessments.set(dischargeId, assessment);
    }

    return assessment;
  },

  /**
   * Submit symptom assessment questionnaire
   */
  async submitQuestionnaire(
    dischargeId: string,
    responses: QuestionnaireResponse[]
  ): Promise<SymptomAssessment> {
    const assessment = await this.getQuestionnaire(dischargeId);

    if (assessment.status === QuestionnaireStatus.COMPLETED) {
      throw new BadRequestError('Assessment has already been completed');
    }

    // Update answers
    let totalWeight = 0;
    let weightedScore = 0;
    let requiresEscalation = false;

    for (const response of responses) {
      const question = assessment.questions.find(q => q.id === response.questionId);
      if (question) {
        question.answer = response.answer;

        // Calculate score based on question type
        let score = 0;
        if (question.type === 'scale') {
          score = typeof response.answer === 'number' ? response.answer : 0;
          if (question.criticalThreshold && score >= question.criticalThreshold) {
            requiresEscalation = true;
          }
        } else if (question.type === 'boolean') {
          // For negative symptoms, true = concern
          score = response.answer === true ? 10 : 0;
          if (response.answer === true && question.weight >= 1.5) {
            requiresEscalation = true;
          }
        } else if (question.type === 'multiple_choice') {
          const options = question.options || [];
          const index = options.indexOf(response.answer as string);
          score = (index / (options.length - 1)) * 10;
          if (question.criticalThreshold && index >= question.criticalThreshold) {
            requiresEscalation = true;
          }
        }

        weightedScore += score * question.weight;
        totalWeight += question.weight;
      }
    }

    // Calculate overall score (0-100)
    const overallScore = totalWeight > 0 ? Math.round((weightedScore / (totalWeight * 10)) * 100) : 0;

    // Update assessment
    assessment.status = QuestionnaireStatus.COMPLETED;
    assessment.overallScore = overallScore;
    assessment.requiresEscalation = requiresEscalation || overallScore >= 60;
    assessment.completedAt = new Date();

    symptomAssessments.set(dischargeId, assessment);

    // Auto-escalate if needed
    if (assessment.requiresEscalation) {
      await this.escalateToCareTeam(dischargeId, {
        priority: overallScore >= 80 ? EscalationPriority.URGENT : EscalationPriority.HIGH,
        reason: 'Symptom assessment indicates concerning symptoms',
        symptoms: responses
          .filter(r => {
            const q = assessment.questions.find(q => q.id === r.questionId);
            return q && (
              (q.type === 'boolean' && r.answer === true) ||
              (q.type === 'scale' && (r.answer as number) >= (q.criticalThreshold || 7))
            );
          })
          .map(r => r.questionId),
      });
    }

    logger.info('Symptom assessment submitted', {
      dischargeId,
      overallScore,
      requiresEscalation: assessment.requiresEscalation,
    });

    return assessment;
  },

  /**
   * Escalate to care team
   */
  async escalateToCareTeam(
    dischargeId: string,
    input: EscalationInput
  ): Promise<EscalationRequest> {
    const workflow = await this.getDischargeById(dischargeId);

    const escalation: EscalationRequest = {
      id: uuidv4(),
      dischargeId,
      priority: input.priority,
      reason: input.reason,
      symptoms: input.symptoms || [],
      triggerSource: 'manual',
      assignedTo: input.assignTo || null,
      status: 'open',
      createdAt: new Date(),
      acknowledgedAt: null,
      resolvedAt: null,
      resolution: null,
    };

    escalations.set(escalation.id, escalation);

    // Update workflow status
    workflow.status = DischargeStatus.ESCALATED;
    workflow.updatedAt = new Date();
    dischargeWorkflows.set(workflow.id, workflow);

    // Send urgent notification to care team
    const queues = getNotificationQueues();

    // In production, this would notify the assigned provider or on-call team
    if (input.priority === EscalationPriority.CRITICAL || input.priority === EscalationPriority.URGENT) {
      logger.warn('URGENT ESCALATION', {
        escalationId: escalation.id,
        dischargeId,
        priority: input.priority,
        reason: input.reason,
      });
    }

    logger.info('Care team escalation created', {
      escalationId: escalation.id,
      dischargeId,
      priority: input.priority,
    });

    return escalation;
  },

  /**
   * Get discharge checklist status
   */
  async getChecklistStatus(dischargeId: string): Promise<{
    items: ChecklistItem[];
    completionPercentage: number;
    missingRequired: ChecklistItem[];
  }> {
    const workflow = await this.getDischargeById(dischargeId);

    const completedCount = workflow.checklistItems.filter(i => i.completed).length;
    const completionPercentage = Math.round(
      (completedCount / workflow.checklistItems.length) * 100
    );

    const missingRequired = workflow.checklistItems.filter(
      i => i.required && !i.completed
    );

    return {
      items: workflow.checklistItems,
      completionPercentage,
      missingRequired,
    };
  },

  /**
   * Update checklist item
   */
  async updateChecklistItem(
    dischargeId: string,
    itemId: string,
    completed: boolean,
    userId: string,
    notes?: string
  ): Promise<ChecklistItem> {
    const workflow = await this.getDischargeById(dischargeId);

    const item = workflow.checklistItems.find(i => i.id === itemId);
    if (!item) {
      throw new NotFoundError('Checklist item not found');
    }

    item.completed = completed;
    item.completedAt = completed ? new Date() : null;
    item.completedBy = completed ? userId : null;
    if (notes) {
      item.notes = notes;
    }

    workflow.updatedAt = new Date();
    dischargeWorkflows.set(workflow.id, workflow);

    // Check if all required items are completed
    const allRequiredCompleted = workflow.checklistItems
      .filter(i => i.required)
      .every(i => i.completed);

    if (allRequiredCompleted && workflow.status === DischargeStatus.INITIATED) {
      workflow.status = DischargeStatus.IN_PROGRESS;
      dischargeWorkflows.set(workflow.id, workflow);
    }

    return item;
  },

  /**
   * Request transportation
   */
  async requestTransportation(
    dischargeId: string,
    input: TransportationInput
  ): Promise<TransportationRequest> {
    const workflow = await this.getDischargeById(dischargeId);

    const request: TransportationRequest = {
      id: uuidv4(),
      dischargeId,
      appointmentId: input.appointmentId || null,
      status: TransportationStatus.REQUESTED,
      pickupAddress: input.pickupAddress,
      destinationAddress: input.destinationAddress,
      scheduledTime: input.scheduledTime,
      specialNeeds: input.specialNeeds || [],
      provider: null,
      confirmationNumber: null,
      estimatedCost: null,
      notes: input.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transportationRequests.set(request.id, request);

    // Update SDOH screening to note transportation need
    if (workflow.sdohScreening) {
      workflow.sdohScreening.transportation = 'Transportation assistance requested';
      if (!workflow.sdohScreening.needsIdentified.includes('transportation')) {
        workflow.sdohScreening.needsIdentified.push('transportation');
      }
    }

    workflow.updatedAt = new Date();
    dischargeWorkflows.set(workflow.id, workflow);

    logger.info('Transportation request created', {
      requestId: request.id,
      dischargeId,
      pickupAddress: input.pickupAddress,
      destinationAddress: input.destinationAddress,
    });

    return request;
  },

  /**
   * Get all discharges for a patient
   */
  async getPatientDischarges(patientId: string): Promise<DischargeWorkflow[]> {
    return Array.from(dischargeWorkflows.values())
      .filter(w => w.patientId === patientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  /**
   * Update SDOH screening
   */
  async updateSDOHScreening(
    dischargeId: string,
    screening: Partial<SDOHScreening>
  ): Promise<SDOHScreening> {
    const workflow = await this.getDischargeById(dischargeId);

    if (!workflow.sdohScreening) {
      throw new BadRequestError('SDOH screening not initialized');
    }

    workflow.sdohScreening = {
      ...workflow.sdohScreening,
      ...screening,
      completedAt: new Date(),
    };

    workflow.updatedAt = new Date();
    dischargeWorkflows.set(workflow.id, workflow);

    // Update checklist
    const sdohItem = workflow.checklistItems.find(
      i => i.item === 'SDOH screening completed'
    );
    if (sdohItem) {
      sdohItem.completed = true;
      sdohItem.completedAt = new Date();
    }

    return workflow.sdohScreening;
  },

  /**
   * Complete medication reconciliation
   */
  async completeMedicationReconciliation(
    dischargeId: string,
    reconciliation: Partial<MedicationReconciliation>
  ): Promise<MedicationReconciliation> {
    const workflow = await this.getDischargeById(dischargeId);

    if (!workflow.medicationReconciliation) {
      workflow.medicationReconciliation = {
        id: uuidv4(),
        completedAt: null,
        medications: [],
        discrepancies: [],
        pharmacyConfirmation: false,
        patientEducationCompleted: false,
      };
    }

    workflow.medicationReconciliation = {
      ...workflow.medicationReconciliation,
      ...reconciliation,
      completedAt: new Date(),
    };

    workflow.updatedAt = new Date();
    dischargeWorkflows.set(workflow.id, workflow);

    // Update checklist
    const medRecItem = workflow.checklistItems.find(
      i => i.item === 'Medication reconciliation completed'
    );
    if (medRecItem) {
      medRecItem.completed = true;
      medRecItem.completedAt = new Date();
    }

    return workflow.medicationReconciliation;
  },
};

export default postDischargeService;
