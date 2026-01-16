/**
 * AI Workflows - Type Definitions
 * Comprehensive types for AI-powered clinical workflow orchestration
 */

// ============================================================================
// Workflow Types
// ============================================================================

export enum WorkflowTriggerType {
  ENCOUNTER_CREATED = 'encounter_created',
  LAB_RESULT_RECEIVED = 'lab_result_received',
  DISCHARGE_INITIATED = 'discharge_initiated',
  MEDICATION_ORDERED = 'medication_ordered',
  PATIENT_MESSAGE_RECEIVED = 'patient_message_received',
  MANUAL_TRIGGER = 'manual_trigger',
}

export enum WorkflowStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  AWAITING_APPROVAL = 'awaiting_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum StepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  AWAITING_HUMAN = 'awaiting_human',
}

export interface WorkflowContext {
  workflowId: string;
  organizationId: string;
  tenantId: string;
  userId: string;
  patientId?: string;
  encounterId?: string;
  metadata: Record<string, any>;
  triggeredAt: Date;
  triggeredBy: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'ai_assistant' | 'human_review' | 'validation' | 'notification';
  assistantType?: AssistantType;
  input: any;
  output?: any;
  status: StepStatus;
  retryCount: number;
  maxRetries: number;
  requiresHumanApproval: boolean;
  completedAt?: Date;
  completedBy?: string;
  error?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowDefinitionId: string;
  context: WorkflowContext;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  currentStepIndex: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  triggerType: WorkflowTriggerType;
  enabled: boolean;
  version: string;
  steps: Omit<WorkflowStep, 'status' | 'retryCount' | 'output' | 'completedAt' | 'completedBy' | 'error'>[];
  consentRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// AI Assistant Types
// ============================================================================

export enum AssistantType {
  DOCUMENTATION = 'documentation',
  TRIAGE = 'triage',
  CODING = 'coding',
  MEDICATION_SAFETY = 'medication_safety',
  PATIENT_MESSAGING = 'patient_messaging',
}

export enum ConfidenceLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
}

export interface AssistantRequest {
  requestId: string;
  assistantType: AssistantType;
  organizationId: string;
  tenantId: string;
  userId: string;
  patientId?: string;
  encounterId?: string;
  input: any;
  context: Record<string, any>;
  consentVerified: boolean;
  timestamp: Date;
}

export interface AssistantResponse {
  requestId: string;
  assistantType: AssistantType;
  suggestions: Suggestion[];
  metadata: {
    modelVersion: string;
    promptTemplateId: string;
    processingTimeMs: number;
    phiMinimized: boolean;
  };
  requiresHumanReview: boolean;
  timestamp: Date;
}

export interface Suggestion {
  id: string;
  type: string;
  content: any;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0-1
  rationale?: string;
  warnings?: string[];
  requiresApproval: boolean;
}

// ============================================================================
// Documentation Assistant Types
// ============================================================================

export interface SOAPNote {
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
}

export interface DocumentationInput {
  encounterType: string;
  chiefComplaint?: string;
  vitals?: Record<string, any>;
  symptoms?: string[];
  examFindings?: string[];
  existingNotes?: string;
}

export interface DocumentationSuggestion extends Suggestion {
  type: 'soap_note';
  content: SOAPNote;
}

// ============================================================================
// Triage Assistant Types
// ============================================================================

export enum TriagePriority {
  CRITICAL = 'critical',
  URGENT = 'urgent',
  SEMI_URGENT = 'semi_urgent',
  NON_URGENT = 'non_urgent',
}

export interface TriageInput {
  chiefComplaint: string;
  symptoms: string[];
  vitals?: {
    temperature?: number;
    heartRate?: number;
    bloodPressure?: string;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
  painLevel?: number; // 1-10
  medicalHistory?: string[];
}

export interface TriageSuggestion extends Suggestion {
  type: 'triage_priority';
  content: {
    priority: TriagePriority;
    estimatedWaitTime?: number; // minutes
    recommendedActions: string[];
    redFlags: string[];
  };
}

// ============================================================================
// Coding Assistant Types
// ============================================================================

export interface CodingInput {
  encounterNotes: string;
  diagnoses?: string[];
  procedures?: string[];
  medications?: string[];
}

export interface CodingSuggestion extends Suggestion {
  type: 'icd_code' | 'cpt_code';
  content: {
    code: string;
    description: string;
    category?: string;
  };
}

// ============================================================================
// Medication Safety Assistant Types
// ============================================================================

export enum InteractionSeverity {
  CONTRAINDICATED = 'contraindicated',
  MAJOR = 'major',
  MODERATE = 'moderate',
  MINOR = 'minor',
}

export interface MedicationSafetyInput {
  proposedMedication: {
    name: string;
    dosage: string;
    route: string;
    frequency: string;
  };
  currentMedications: Array<{
    name: string;
    dosage: string;
    route: string;
    frequency: string;
  }>;
  allergies: string[];
  conditions: string[];
  patientAge?: number;
  patientWeight?: number; // kg
  renalFunction?: string;
  hepaticFunction?: string;
}

export interface MedicationSafetySuggestion extends Suggestion {
  type: 'interaction_alert' | 'allergy_alert' | 'contraindication_alert' | 'dosing_recommendation';
  content: {
    severity?: InteractionSeverity;
    message: string;
    affectedMedications?: string[];
    recommendedAction: string;
    references?: string[];
  };
}

// ============================================================================
// Patient Messaging Assistant Types
// ============================================================================

export interface PatientMessageInput {
  patientMessage: string;
  patientContext?: {
    age?: number;
    preferredLanguage?: string;
    literacyLevel?: 'low' | 'medium' | 'high';
  };
  relatedEncounter?: string;
  previousMessages?: Array<{
    from: 'patient' | 'provider';
    content: string;
    timestamp: Date;
  }>;
}

export interface PatientMessageSuggestion extends Suggestion {
  type: 'message_draft';
  content: {
    draftResponse: string;
    tone: 'professional' | 'empathetic' | 'educational';
    suggestedActions?: string[];
    escalationRequired: boolean;
  };
}

// ============================================================================
// Guardrail Types
// ============================================================================

export interface GuardrailResult {
  passed: boolean;
  violations: GuardrailViolation[];
  sanitizedInput?: any;
  metadata: Record<string, any>;
}

export interface GuardrailViolation {
  rule: string;
  severity: 'error' | 'warning';
  message: string;
  field?: string;
}

export interface PHIRedactionResult {
  redactedText: string;
  phiDetected: boolean;
  redactedFields: Array<{
    type: 'name' | 'ssn' | 'mrn' | 'phone' | 'email' | 'address' | 'date';
    originalValue: string;
    replacementToken: string;
  }>;
}

export interface ConsentRecord {
  patientId: string;
  organizationId: string;
  aiProcessingConsent: boolean;
  consentDate: Date;
  consentVersion: string;
  expiresAt?: Date;
  revokedAt?: Date;
}

// ============================================================================
// Audit Types
// ============================================================================

export enum AuditEventType {
  AI_REQUEST = 'ai_request',
  AI_RESPONSE = 'ai_response',
  HUMAN_REVIEW = 'human_review',
  APPROVAL = 'approval',
  REJECTION = 'rejection',
  GUARDRAIL_VIOLATION = 'guardrail_violation',
  CONSENT_CHECK = 'consent_check',
}

export interface AIAuditLog {
  id: string;
  eventType: AuditEventType;
  organizationId: string;
  tenantId: string;
  userId: string;
  patientId?: string;
  encounterId?: string;
  workflowExecutionId?: string;
  assistantType?: AssistantType;

  // AI-specific fields
  modelVersion?: string;
  promptTemplateId?: string;
  inputSummary: string; // Redacted summary
  outputHash?: string; // SHA-256 hash of output
  confidenceScore?: number;

  // Review fields
  reviewerId?: string;
  approvalStatus?: 'approved' | 'rejected' | 'pending';
  reviewNotes?: string;

  // Guardrail fields
  guardrailsPassed: boolean;
  violations?: GuardrailViolation[];

  // Consent
  consentVerified: boolean;

  // Metadata
  processingTimeMs?: number;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface AuditQueryParams {
  organizationId: string;
  tenantId?: string;
  userId?: string;
  patientId?: string;
  assistantType?: AssistantType;
  eventType?: AuditEventType;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Error Types
// ============================================================================

export class WorkflowError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = 'WorkflowError';
  }
}

export class GuardrailError extends Error {
  constructor(
    message: string,
    public readonly violations: GuardrailViolation[]
  ) {
    super(message);
    this.name = 'GuardrailError';
  }
}

export class ConsentError extends Error {
  constructor(
    message: string,
    public readonly patientId: string
  ) {
    super(message);
    this.name = 'ConsentError';
  }
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface WorkflowConfig {
  maxConcurrentWorkflows: number;
  stepTimeoutMs: number;
  defaultRetryPolicy: {
    maxRetries: number;
    backoffMs: number;
    backoffMultiplier: number;
  };
  enableAuditLogging: boolean;
}

export interface AIConfig {
  modelEndpoint: string;
  modelVersion: string;
  timeoutMs: number;
  maxTokens: number;
  temperature: number;
  confidenceThresholds: {
    [key in AssistantType]: number;
  };
}

export interface GuardrailConfig {
  enableInputValidation: boolean;
  enableOutputValidation: boolean;
  enablePHIMinimization: boolean;
  enableConsentChecks: boolean;
  maxInputLength: number;
  allowedDomains?: string[];
}
