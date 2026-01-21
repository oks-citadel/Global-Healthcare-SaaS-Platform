/**
 * Type declarations for @unifiedhealth/compliance module
 */

declare module '@unifiedhealth/compliance' {
  export enum AuditEventType {
    PHI_ACCESS = 'PHI_ACCESS',
    PERMISSION_DENIED = 'PERMISSION_DENIED',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    DATA_EXPORT = 'DATA_EXPORT',
    DATA_MODIFICATION = 'DATA_MODIFICATION',
    CONSENT_GRANTED = 'CONSENT_GRANTED',
    CONSENT_REVOKED = 'CONSENT_REVOKED',
  }

  export enum AuditSeverity {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    CRITICAL = 'CRITICAL',
  }

  export enum ComplianceRegulation {
    HIPAA = 'HIPAA',
    GDPR = 'GDPR',
    POPIA = 'POPIA',
  }

  export enum ConsentPurpose {
    HEALTHCARE_SERVICES = 'HEALTHCARE_SERVICES',
    TELEMEDICINE = 'TELEMEDICINE',
    MARKETING = 'MARKETING',
    ANALYTICS_RESEARCH = 'ANALYTICS_RESEARCH',
    THIRD_PARTY_SHARING = 'THIRD_PARTY_SHARING',
  }

  export interface AuditContext {
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    requestId?: string;
    location?: {
      country?: string;
      region?: string;
    };
  }

  export interface PHIAccessContext {
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    requestId?: string;
  }

  export interface PHIAccessDetails {
    patientId?: string;
    recordType?: string;
    recordId?: string;
    accessReason?: string;
    dataClassification?: string;
  }

  export interface AuditLogEntry {
    eventType: AuditEventType;
    severity: AuditSeverity;
    regulation: ComplianceRegulation[];
    context: AuditContext;
    outcome: 'SUCCESS' | 'FAILURE';
    details: Record<string, unknown>;
  }

  export interface ConsentCheckResult {
    hasConsent: boolean;
    reason?: string;
  }

  export class AuditLogger {
    log(entry: AuditLogEntry): Promise<void>;
    logPHIAccess(context: PHIAccessContext, details: PHIAccessDetails): Promise<void>;
    logSecurityEvent(
      context: PHIAccessContext,
      eventType: AuditEventType,
      severity: AuditSeverity,
      details: Record<string, unknown>
    ): Promise<void>;
  }

  export class ConsentManager {
    checkConsent(userId: string, purpose: ConsentPurpose): Promise<ConsentCheckResult>;
    grantConsent(userId: string, purpose: ConsentPurpose, expiresAt?: Date): Promise<void>;
    revokeConsent(userId: string, purpose: ConsentPurpose): Promise<void>;
  }
}
