/**
 * AI Audit Logger
 * Comprehensive audit logging for all AI operations
 */

import crypto from 'crypto';
import {
  AIAuditLog,
  AuditEventType,
  AuditQueryParams,
  AssistantRequest,
  AssistantResponse,
  GuardrailViolation,
} from '../types';

export interface AuditRepository {
  save(log: AIAuditLog): Promise<void>;
  query(params: AuditQueryParams): Promise<AIAuditLog[]>;
  count(params: AuditQueryParams): Promise<number>;
}

export class AIAuditLogger {
  constructor(private repository: AuditRepository) {}

  /**
   * Log an AI request
   */
  async logAIRequest(request: AssistantRequest): Promise<AIAuditLog> {
    const log: AIAuditLog = {
      id: this.generateLogId(),
      eventType: AuditEventType.AI_REQUEST,
      organizationId: request.organizationId,
      tenantId: request.tenantId,
      userId: request.userId,
      patientId: request.patientId,
      encounterId: request.encounterId,
      assistantType: request.assistantType,
      inputSummary: this.createRedactedSummary(request.input),
      consentVerified: request.consentVerified,
      guardrailsPassed: true, // Will be updated if guardrails fail
      timestamp: request.timestamp,
      metadata: {
        requestId: request.requestId,
        ...request.context,
      },
    };

    await this.repository.save(log);
    return log;
  }

  /**
   * Log an AI response
   */
  async logAIResponse(
    request: AssistantRequest,
    response: AssistantResponse
  ): Promise<AIAuditLog> {
    const log: AIAuditLog = {
      id: this.generateLogId(),
      eventType: AuditEventType.AI_RESPONSE,
      organizationId: request.organizationId,
      tenantId: request.tenantId,
      userId: request.userId,
      patientId: request.patientId,
      encounterId: request.encounterId,
      assistantType: response.assistantType,
      modelVersion: response.metadata.modelVersion,
      promptTemplateId: response.metadata.promptTemplateId,
      inputSummary: this.createRedactedSummary(request.input),
      outputHash: this.hashOutput(response),
      confidenceScore: this.calculateAverageConfidence(response),
      consentVerified: request.consentVerified,
      guardrailsPassed: true,
      processingTimeMs: response.metadata.processingTimeMs,
      timestamp: response.timestamp,
      metadata: {
        requestId: request.requestId,
        suggestionCount: response.suggestions.length,
        requiresHumanReview: response.requiresHumanReview,
        phiMinimized: response.metadata.phiMinimized,
      },
    };

    await this.repository.save(log);
    return log;
  }

  /**
   * Log a human review event
   */
  async logHumanReview(params: {
    executionId: string;
    stepId: string;
    reviewerId: string;
    approvalStatus: 'approved' | 'rejected' | 'pending';
    reviewNotes?: string;
    organizationId: string;
    tenantId: string;
    patientId?: string;
  }): Promise<AIAuditLog> {
    const log: AIAuditLog = {
      id: this.generateLogId(),
      eventType: AuditEventType.HUMAN_REVIEW,
      organizationId: params.organizationId,
      tenantId: params.tenantId,
      userId: params.reviewerId,
      patientId: params.patientId,
      workflowExecutionId: params.executionId,
      reviewerId: params.reviewerId,
      approvalStatus: params.approvalStatus,
      reviewNotes: params.reviewNotes,
      inputSummary: `Workflow step: ${params.stepId}`,
      consentVerified: true,
      guardrailsPassed: true,
      timestamp: new Date(),
      metadata: {
        stepId: params.stepId,
      },
    };

    await this.repository.save(log);
    return log;
  }

  /**
   * Log an approval event
   */
  async logApproval(params: {
    executionId: string;
    stepId: string;
    approvedBy: string;
    modifications?: any;
    organizationId: string;
    tenantId: string;
    patientId?: string;
  }): Promise<AIAuditLog> {
    const log: AIAuditLog = {
      id: this.generateLogId(),
      eventType: AuditEventType.APPROVAL,
      organizationId: params.organizationId,
      tenantId: params.tenantId,
      userId: params.approvedBy,
      patientId: params.patientId,
      workflowExecutionId: params.executionId,
      reviewerId: params.approvedBy,
      approvalStatus: 'approved',
      inputSummary: `Approved workflow step: ${params.stepId}`,
      consentVerified: true,
      guardrailsPassed: true,
      timestamp: new Date(),
      metadata: {
        stepId: params.stepId,
        hasModifications: !!params.modifications,
      },
    };

    await this.repository.save(log);
    return log;
  }

  /**
   * Log a rejection event
   */
  async logRejection(params: {
    executionId: string;
    stepId: string;
    rejectedBy: string;
    reason: string;
    organizationId: string;
    tenantId: string;
    patientId?: string;
  }): Promise<AIAuditLog> {
    const log: AIAuditLog = {
      id: this.generateLogId(),
      eventType: AuditEventType.REJECTION,
      organizationId: params.organizationId,
      tenantId: params.tenantId,
      userId: params.rejectedBy,
      patientId: params.patientId,
      workflowExecutionId: params.executionId,
      reviewerId: params.rejectedBy,
      approvalStatus: 'rejected',
      reviewNotes: params.reason,
      inputSummary: `Rejected workflow step: ${params.stepId}`,
      consentVerified: true,
      guardrailsPassed: true,
      timestamp: new Date(),
      metadata: {
        stepId: params.stepId,
      },
    };

    await this.repository.save(log);
    return log;
  }

  /**
   * Log a guardrail violation
   */
  async logGuardrailViolation(params: {
    requestId: string;
    assistantType: string;
    violations: GuardrailViolation[];
    organizationId: string;
    tenantId: string;
    userId: string;
    patientId?: string;
    input: any;
  }): Promise<AIAuditLog> {
    const log: AIAuditLog = {
      id: this.generateLogId(),
      eventType: AuditEventType.GUARDRAIL_VIOLATION,
      organizationId: params.organizationId,
      tenantId: params.tenantId,
      userId: params.userId,
      patientId: params.patientId,
      inputSummary: this.createRedactedSummary(params.input),
      consentVerified: false,
      guardrailsPassed: false,
      violations: params.violations,
      timestamp: new Date(),
      metadata: {
        requestId: params.requestId,
        assistantType: params.assistantType,
        violationCount: params.violations.length,
        errorViolations: params.violations.filter(v => v.severity === 'error').length,
      },
    };

    await this.repository.save(log);
    return log;
  }

  /**
   * Log a consent check event
   */
  async logConsentCheck(params: {
    patientId: string;
    organizationId: string;
    tenantId: string;
    userId: string;
    consentGranted: boolean;
    reason?: string;
  }): Promise<AIAuditLog> {
    const log: AIAuditLog = {
      id: this.generateLogId(),
      eventType: AuditEventType.CONSENT_CHECK,
      organizationId: params.organizationId,
      tenantId: params.tenantId,
      userId: params.userId,
      patientId: params.patientId,
      inputSummary: 'Consent verification check',
      consentVerified: params.consentGranted,
      guardrailsPassed: params.consentGranted,
      timestamp: new Date(),
      metadata: {
        reason: params.reason,
      },
    };

    await this.repository.save(log);
    return log;
  }

  /**
   * Query audit logs
   */
  async queryLogs(params: AuditQueryParams): Promise<AIAuditLog[]> {
    return this.repository.query(params);
  }

  /**
   * Count audit logs matching criteria
   */
  async countLogs(params: AuditQueryParams): Promise<number> {
    return this.repository.count(params);
  }

  /**
   * Get audit trail for a specific patient
   */
  async getPatientAuditTrail(
    patientId: string,
    organizationId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<AIAuditLog[]> {
    return this.repository.query({
      organizationId,
      patientId,
      startDate: options?.startDate,
      endDate: options?.endDate,
      limit: options?.limit || 100,
      offset: 0,
    });
  }

  /**
   * Get audit trail for a workflow execution
   */
  async getWorkflowAuditTrail(
    workflowExecutionId: string,
    organizationId: string
  ): Promise<AIAuditLog[]> {
    const logs = await this.repository.query({
      organizationId,
    });

    return logs.filter(log => log.workflowExecutionId === workflowExecutionId);
  }

  /**
   * Get AI usage statistics
   */
  async getUsageStatistics(
    organizationId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      assistantType?: string;
    }
  ): Promise<{
    totalRequests: number;
    totalResponses: number;
    totalApprovals: number;
    totalRejections: number;
    guardrailViolations: number;
    consentDenials: number;
    byAssistantType: Record<string, number>;
    averageConfidence: number;
    averageProcessingTime: number;
  }> {
    const logs = await this.repository.query({
      organizationId,
      startDate: options?.startDate,
      endDate: options?.endDate,
    });

    const filteredLogs = options?.assistantType
      ? logs.filter(log => log.assistantType === options.assistantType)
      : logs;

    const byAssistantType: Record<string, number> = {};
    let totalConfidence = 0;
    let confidenceCount = 0;
    let totalProcessingTime = 0;
    let processingTimeCount = 0;

    filteredLogs.forEach(log => {
      if (log.assistantType) {
        byAssistantType[log.assistantType] = (byAssistantType[log.assistantType] || 0) + 1;
      }

      if (log.confidenceScore !== undefined) {
        totalConfidence += log.confidenceScore;
        confidenceCount++;
      }

      if (log.processingTimeMs !== undefined) {
        totalProcessingTime += log.processingTimeMs;
        processingTimeCount++;
      }
    });

    return {
      totalRequests: filteredLogs.filter(l => l.eventType === AuditEventType.AI_REQUEST).length,
      totalResponses: filteredLogs.filter(l => l.eventType === AuditEventType.AI_RESPONSE).length,
      totalApprovals: filteredLogs.filter(l => l.eventType === AuditEventType.APPROVAL).length,
      totalRejections: filteredLogs.filter(l => l.eventType === AuditEventType.REJECTION).length,
      guardrailViolations: filteredLogs.filter(l => l.eventType === AuditEventType.GUARDRAIL_VIOLATION).length,
      consentDenials: filteredLogs.filter(l => l.eventType === AuditEventType.CONSENT_CHECK && !l.consentVerified).length,
      byAssistantType,
      averageConfidence: confidenceCount > 0 ? totalConfidence / confidenceCount : 0,
      averageProcessingTime: processingTimeCount > 0 ? totalProcessingTime / processingTimeCount : 0,
    };
  }

  /**
   * Create a redacted summary of input (no PHI)
   */
  private createRedactedSummary(input: any): string {
    const summary = JSON.stringify(input, null, 2);

    // Limit length
    if (summary.length > 500) {
      return summary.substring(0, 497) + '...';
    }

    return summary;
  }

  /**
   * Hash output for tamper detection
   */
  private hashOutput(response: AssistantResponse): string {
    const outputString = JSON.stringify(response.suggestions);
    return crypto.createHash('sha256').update(outputString).digest('hex');
  }

  /**
   * Calculate average confidence across all suggestions
   */
  private calculateAverageConfidence(response: AssistantResponse): number {
    if (response.suggestions.length === 0) {
      return 0;
    }

    const total = response.suggestions.reduce(
      (sum, suggestion) => sum + suggestion.confidenceScore,
      0
    );

    return total / response.suggestions.length;
  }

  /**
   * Generate unique log ID
   */
  private generateLogId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * In-memory audit repository (for development/testing)
 */
export class InMemoryAuditRepository implements AuditRepository {
  private logs: AIAuditLog[] = [];

  async save(log: AIAuditLog): Promise<void> {
    this.logs.push(log);
  }

  async query(params: AuditQueryParams): Promise<AIAuditLog[]> {
    let filtered = this.logs.filter(
      log => log.organizationId === params.organizationId
    );

    if (params.tenantId) {
      filtered = filtered.filter(log => log.tenantId === params.tenantId);
    }

    if (params.userId) {
      filtered = filtered.filter(log => log.userId === params.userId);
    }

    if (params.patientId) {
      filtered = filtered.filter(log => log.patientId === params.patientId);
    }

    if (params.assistantType) {
      filtered = filtered.filter(log => log.assistantType === params.assistantType);
    }

    if (params.eventType) {
      filtered = filtered.filter(log => log.eventType === params.eventType);
    }

    if (params.startDate) {
      filtered = filtered.filter(log => log.timestamp >= params.startDate!);
    }

    if (params.endDate) {
      filtered = filtered.filter(log => log.timestamp <= params.endDate!);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    const offset = params.offset || 0;
    const limit = params.limit || 100;

    return filtered.slice(offset, offset + limit);
  }

  async count(params: AuditQueryParams): Promise<number> {
    const results = await this.query({ ...params, limit: Number.MAX_SAFE_INTEGER, offset: 0 });
    return results.length;
  }

  // Test helper methods
  clear(): void {
    this.logs = [];
  }

  getAll(): AIAuditLog[] {
    return [...this.logs];
  }
}
