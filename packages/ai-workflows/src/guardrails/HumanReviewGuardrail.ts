/**
 * Human-in-the-Loop (HITL) Guardrail
 * Enforces mandatory human review for AI clinical decisions
 *
 * CRITICAL: This guardrail ensures AI is ASSISTIVE ONLY.
 * No autonomous diagnosis or treatment is ever allowed.
 */

import {
  AssistantType,
  ConfidenceLevel,
  Suggestion,
  AuditEventType,
} from '../types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Review requirement level
 */
export enum ReviewRequirement {
  /** No review required (informational only) */
  NONE = 'none',
  /** Review recommended but not mandatory */
  RECOMMENDED = 'recommended',
  /** Mandatory review before any action */
  MANDATORY = 'mandatory',
  /** Mandatory review by a specific role */
  MANDATORY_ROLE_BASED = 'mandatory_role_based',
}

/**
 * Review status
 */
export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  APPROVED_WITH_MODIFICATIONS = 'approved_with_modifications',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

/**
 * Review decision
 */
export interface ReviewDecision {
  /** Decision ID */
  id: string;

  /** Suggestion ID being reviewed */
  suggestionId: string;

  /** Review status */
  status: ReviewStatus;

  /** Reviewer user ID */
  reviewerId: string;

  /** Reviewer role */
  reviewerRole: string;

  /** Reviewer credentials (for clinical decisions) */
  reviewerCredentials?: string[];

  /** Modified content (if approved with modifications) */
  modifiedContent?: any;

  /** Rejection reason */
  rejectionReason?: string;

  /** Review notes */
  notes?: string;

  /** Timestamp */
  timestamp: Date;

  /** Signature hash (for audit) */
  signatureHash?: string;
}

/**
 * Pending review item
 */
export interface PendingReview {
  /** Review request ID */
  id: string;

  /** Workflow execution ID */
  workflowExecutionId: string;

  /** Suggestion being reviewed */
  suggestion: Suggestion;

  /** Assistant type that generated suggestion */
  assistantType: AssistantType;

  /** Patient ID */
  patientId: string;

  /** Encounter ID */
  encounterId?: string;

  /** Organization ID */
  organizationId: string;

  /** Tenant ID */
  tenantId: string;

  /** Review requirement level */
  requirement: ReviewRequirement;

  /** Required reviewer role (if role-based) */
  requiredRole?: string;

  /** Expiration time */
  expiresAt: Date;

  /** Created at */
  createdAt: Date;

  /** Current status */
  status: ReviewStatus;

  /** Decision (if reviewed) */
  decision?: ReviewDecision;

  /** Priority */
  priority: 'critical' | 'high' | 'normal' | 'low';
}

/**
 * HITL configuration
 */
export interface HITLConfig {
  /** Default review requirement */
  defaultRequirement: ReviewRequirement;

  /** Review timeout in minutes */
  reviewTimeoutMinutes: number;

  /** Whether to require credentials for clinical reviews */
  requireCredentialsForClinical: boolean;

  /** Minimum confidence for auto-approval (never for diagnosis/treatment) */
  autoApprovalConfidenceThreshold?: number;

  /** Features that ALWAYS require mandatory review */
  alwaysMandatory: string[];

  /** Role requirements for specific suggestion types */
  roleRequirements: Record<string, string[]>;
}

/**
 * HITL evaluation result
 */
export interface HITLEvaluationResult {
  /** Whether output can proceed without review */
  canProceed: boolean;

  /** Review requirement */
  requirement: ReviewRequirement;

  /** Required reviewer role */
  requiredRole?: string;

  /** Pending review ID (if created) */
  pendingReviewId?: string;

  /** Reason for requirement */
  reason: string;

  /** Warning messages */
  warnings: string[];
}

// ============================================================================
// HITL GUARDRAIL IMPLEMENTATION
// ============================================================================

/**
 * Human-in-the-Loop Guardrail
 */
export class HumanReviewGuardrail {
  private config: HITLConfig;
  private pendingReviews: Map<string, PendingReview> = new Map();
  private auditCallback?: (event: any) => void;

  constructor(config?: Partial<HITLConfig>) {
    this.config = {
      defaultRequirement: ReviewRequirement.MANDATORY,
      reviewTimeoutMinutes: 60,
      requireCredentialsForClinical: true,
      alwaysMandatory: [
        'diagnosis',
        'treatment',
        'medication_change',
        'dosage_recommendation',
        'triage_priority',
        'referral',
        'procedure_recommendation',
      ],
      roleRequirements: {
        diagnosis: ['physician', 'nurse_practitioner', 'physician_assistant'],
        treatment: ['physician', 'nurse_practitioner', 'physician_assistant'],
        medication_change: ['physician', 'pharmacist', 'nurse_practitioner'],
        dosage_recommendation: ['physician', 'pharmacist'],
        triage_priority: ['physician', 'nurse', 'nurse_practitioner'],
        referral: ['physician', 'nurse_practitioner'],
        procedure_recommendation: ['physician'],
      },
      ...config,
    };
  }

  /**
   * Set audit callback
   */
  onAudit(callback: (event: any) => void): void {
    this.auditCallback = callback;
  }

  /**
   * Evaluate whether a suggestion requires human review
   */
  evaluateSuggestion(
    suggestion: Suggestion,
    assistantType: AssistantType,
    _context: {
      patientId: string;
      organizationId: string;
      tenantId: string;
      encounterId?: string;
    }
  ): HITLEvaluationResult {
    const warnings: string[] = [];
    // Context reserved for future country/region-specific evaluation rules
    void _context;

    // CRITICAL: Diagnosis and treatment suggestions ALWAYS require human review
    if (this.isDiagnosisOrTreatment(suggestion.type, assistantType)) {
      return {
        canProceed: false,
        requirement: ReviewRequirement.MANDATORY_ROLE_BASED,
        requiredRole: this.getRequiredRole(suggestion.type),
        reason: 'AI diagnosis or treatment suggestions MUST be reviewed by a qualified clinician',
        warnings: [
          'CRITICAL: This is an AI-generated clinical suggestion. It is NOT a diagnosis or treatment plan.',
          'A qualified healthcare provider MUST review and approve before any clinical action.',
        ],
      };
    }

    // Check if suggestion type is in always-mandatory list
    if (this.config.alwaysMandatory.includes(suggestion.type)) {
      return {
        canProceed: false,
        requirement: ReviewRequirement.MANDATORY,
        requiredRole: this.getRequiredRole(suggestion.type),
        reason: `${suggestion.type} requires mandatory human review`,
        warnings,
      };
    }

    // Check confidence level
    if (suggestion.confidence === ConfidenceLevel.LOW || suggestion.confidence === ConfidenceLevel.VERY_LOW) {
      warnings.push('Low confidence suggestion - human review strongly recommended');
      return {
        canProceed: false,
        requirement: ReviewRequirement.MANDATORY,
        reason: 'Low confidence suggestions require human review',
        warnings,
      };
    }

    // Check if suggestion has warnings
    if (suggestion.warnings && suggestion.warnings.length > 0) {
      warnings.push(...suggestion.warnings);
      return {
        canProceed: false,
        requirement: ReviewRequirement.RECOMMENDED,
        reason: 'Suggestion has warnings that should be reviewed',
        warnings,
      };
    }

    // Check explicit requiresApproval flag
    if (suggestion.requiresApproval) {
      return {
        canProceed: false,
        requirement: ReviewRequirement.MANDATORY,
        reason: 'Suggestion explicitly requires approval',
        warnings,
      };
    }

    // Default for clinical assistants
    if (this.isClinicalAssistant(assistantType)) {
      return {
        canProceed: false,
        requirement: ReviewRequirement.RECOMMENDED,
        reason: 'Clinical suggestions should be reviewed by healthcare provider',
        warnings,
      };
    }

    // Non-clinical, high confidence, no warnings - can proceed
    return {
      canProceed: true,
      requirement: ReviewRequirement.NONE,
      reason: 'Suggestion does not require review',
      warnings,
    };
  }

  /**
   * Create a pending review request
   */
  createPendingReview(
    suggestion: Suggestion,
    assistantType: AssistantType,
    context: {
      workflowExecutionId: string;
      patientId: string;
      organizationId: string;
      tenantId: string;
      encounterId?: string;
    }
  ): PendingReview {
    const evaluation = this.evaluateSuggestion(suggestion, assistantType, context);

    const pendingReview: PendingReview = {
      id: this.generateId(),
      workflowExecutionId: context.workflowExecutionId,
      suggestion,
      assistantType,
      patientId: context.patientId,
      encounterId: context.encounterId,
      organizationId: context.organizationId,
      tenantId: context.tenantId,
      requirement: evaluation.requirement,
      requiredRole: evaluation.requiredRole,
      expiresAt: new Date(Date.now() + this.config.reviewTimeoutMinutes * 60 * 1000),
      createdAt: new Date(),
      status: ReviewStatus.PENDING,
      priority: this.determinePriority(suggestion, assistantType),
    };

    this.pendingReviews.set(pendingReview.id, pendingReview);

    // Emit audit event
    this.emitAudit({
      eventType: AuditEventType.HUMAN_REVIEW,
      action: 'review_requested',
      pendingReviewId: pendingReview.id,
      suggestionType: suggestion.type,
      requirement: evaluation.requirement,
      patientId: context.patientId,
      organizationId: context.organizationId,
    });

    return pendingReview;
  }

  /**
   * Submit a review decision
   */
  submitReview(
    pendingReviewId: string,
    decision: Omit<ReviewDecision, 'id' | 'timestamp' | 'suggestionId'>
  ): ReviewDecision {
    const pendingReview = this.pendingReviews.get(pendingReviewId);
    if (!pendingReview) {
      throw new Error(`Pending review not found: ${pendingReviewId}`);
    }

    // Check if expired
    if (new Date() > pendingReview.expiresAt) {
      pendingReview.status = ReviewStatus.EXPIRED;
      throw new Error('Review request has expired');
    }

    // Validate reviewer role if required
    if (pendingReview.requiredRole) {
      if (!this.validateReviewerRole(decision.reviewerRole, pendingReview.requiredRole)) {
        throw new Error(
          `Reviewer role '${decision.reviewerRole}' does not meet requirement '${pendingReview.requiredRole}'`
        );
      }
    }

    // Validate credentials for clinical reviews
    if (
      this.config.requireCredentialsForClinical &&
      this.isClinicalReview(pendingReview.assistantType)
    ) {
      if (!decision.reviewerCredentials || decision.reviewerCredentials.length === 0) {
        throw new Error('Clinical reviews require reviewer credentials');
      }
    }

    // Create decision record
    const reviewDecision: ReviewDecision = {
      id: this.generateId(),
      suggestionId: pendingReview.suggestion.id,
      ...decision,
      timestamp: new Date(),
      signatureHash: this.createSignatureHash(decision),
    };

    // Update pending review
    pendingReview.status = decision.status;
    pendingReview.decision = reviewDecision;

    // Emit audit event
    this.emitAudit({
      eventType: decision.status === ReviewStatus.APPROVED ? AuditEventType.APPROVAL : AuditEventType.REJECTION,
      action: decision.status === ReviewStatus.APPROVED ? 'approved' : 'rejected',
      pendingReviewId,
      decisionId: reviewDecision.id,
      reviewerId: decision.reviewerId,
      reviewerRole: decision.reviewerRole,
      status: decision.status,
      patientId: pendingReview.patientId,
      organizationId: pendingReview.organizationId,
    });

    return reviewDecision;
  }

  /**
   * Get pending review by ID
   */
  getPendingReview(id: string): PendingReview | undefined {
    return this.pendingReviews.get(id);
  }

  /**
   * Get all pending reviews for an organization
   */
  getPendingReviewsForOrganization(organizationId: string): PendingReview[] {
    return Array.from(this.pendingReviews.values()).filter(
      pr => pr.organizationId === organizationId && pr.status === ReviewStatus.PENDING
    );
  }

  /**
   * Get pending reviews by reviewer role
   */
  getPendingReviewsForRole(organizationId: string, role: string): PendingReview[] {
    return this.getPendingReviewsForOrganization(organizationId).filter(pr => {
      if (!pr.requiredRole) return true;
      return this.validateReviewerRole(role, pr.requiredRole);
    });
  }

  /**
   * Check if a suggestion can be acted upon
   */
  canActOnSuggestion(pendingReviewId: string): { canAct: boolean; reason: string } {
    const pendingReview = this.pendingReviews.get(pendingReviewId);

    if (!pendingReview) {
      return { canAct: false, reason: 'Review not found' };
    }

    if (pendingReview.status === ReviewStatus.PENDING) {
      return { canAct: false, reason: 'Review is still pending' };
    }

    if (pendingReview.status === ReviewStatus.EXPIRED) {
      return { canAct: false, reason: 'Review has expired' };
    }

    if (pendingReview.status === ReviewStatus.REJECTED) {
      return { canAct: false, reason: 'Suggestion was rejected' };
    }

    return { canAct: true, reason: 'Approved by human reviewer' };
  }

  /**
   * Expire old pending reviews
   */
  expireOldReviews(): number {
    const now = new Date();
    let expiredCount = 0;

    for (const [id, review] of this.pendingReviews) {
      if (review.status === ReviewStatus.PENDING && now > review.expiresAt) {
        review.status = ReviewStatus.EXPIRED;
        expiredCount++;

        this.emitAudit({
          eventType: AuditEventType.HUMAN_REVIEW,
          action: 'review_expired',
          pendingReviewId: id,
          patientId: review.patientId,
          organizationId: review.organizationId,
        });
      }
    }

    return expiredCount;
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private isDiagnosisOrTreatment(suggestionType: string, assistantType: AssistantType): boolean {
    const diagnosisTreatmentTypes = [
      'diagnosis',
      'differential_diagnosis',
      'treatment_plan',
      'treatment_recommendation',
      'medication_order',
      'procedure_order',
    ];

    if (diagnosisTreatmentTypes.includes(suggestionType.toLowerCase())) {
      return true;
    }

    // Triage with critical/urgent priority is effectively a clinical decision
    if (assistantType === AssistantType.TRIAGE && suggestionType === 'triage_priority') {
      return true;
    }

    return false;
  }

  private isClinicalAssistant(assistantType: AssistantType): boolean {
    return [
      AssistantType.DOCUMENTATION,
      AssistantType.TRIAGE,
      AssistantType.MEDICATION_SAFETY,
      AssistantType.CODING,
    ].includes(assistantType);
  }

  private isClinicalReview(assistantType: AssistantType): boolean {
    return this.isClinicalAssistant(assistantType);
  }

  private getRequiredRole(suggestionType: string): string | undefined {
    const roles = this.config.roleRequirements[suggestionType];
    return roles ? roles[0] : undefined;
  }

  private validateReviewerRole(reviewerRole: string, requiredRole: string): boolean {
    const allowedRoles = this.config.roleRequirements[requiredRole] || [requiredRole];
    return allowedRoles.includes(reviewerRole);
  }

  private determinePriority(
    suggestion: Suggestion,
    assistantType: AssistantType
  ): 'critical' | 'high' | 'normal' | 'low' {
    // Triage suggestions have inherent priority
    if (assistantType === AssistantType.TRIAGE) {
      const content = suggestion.content as any;
      if (content?.priority === 'critical') return 'critical';
      if (content?.priority === 'urgent') return 'high';
    }

    // Medication safety issues are high priority
    if (assistantType === AssistantType.MEDICATION_SAFETY) {
      const content = suggestion.content as any;
      if (content?.severity === 'contraindicated' || content?.severity === 'major') {
        return 'high';
      }
    }

    // Low confidence = higher priority for review
    if (suggestion.confidence === ConfidenceLevel.VERY_LOW) {
      return 'high';
    }

    return 'normal';
  }

  private generateId(): string {
    return `hitl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createSignatureHash(decision: Omit<ReviewDecision, 'id' | 'timestamp' | 'suggestionId'>): string {
    // In production, use proper cryptographic signing
    const data = JSON.stringify({
      reviewerId: decision.reviewerId,
      status: decision.status,
      notes: decision.notes,
    });
    return Buffer.from(data).toString('base64');
  }

  private emitAudit(event: any): void {
    if (this.auditCallback) {
      this.auditCallback({
        ...event,
        timestamp: new Date(),
      });
    }
  }
}

/**
 * Factory function
 */
export function createHITLGuardrail(config?: Partial<HITLConfig>): HumanReviewGuardrail {
  return new HumanReviewGuardrail(config);
}
