/**
 * Policy Engine Types
 */

/**
 * Policy evaluation result
 */
export interface PolicyResult {
  allowed: boolean;
  reason?: string;
  warnings?: string[];
  metadata?: Record<string, any>;
}

/**
 * Feature gate context
 */
export interface FeatureContext {
  countryCode: string;
  userId?: string;
  patientId?: string;
  organizationId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

/**
 * Consent scope
 */
export type ConsentScope =
  | 'treatment'
  | 'payment'
  | 'operations'
  | 'research'
  | 'marketing'
  | 'data-sharing'
  | 'electronic-health-record'
  | 'emergency-access'
  | string;

/**
 * Consent record
 */
export interface ConsentRecord {
  id: string;
  userId: string;
  patientId?: string;
  scopes: ConsentScope[];
  status: 'active' | 'withdrawn' | 'expired';
  grantedAt: string;
  expiresAt?: string;
  withdrawnAt?: string;
  metadata?: Record<string, any>;
}

/**
 * Audit event type
 */
export type AuditEventType =
  | 'access'
  | 'create'
  | 'update'
  | 'delete'
  | 'export'
  | 'print'
  | 'login'
  | 'logout'
  | 'consent-change'
  | 'permission-change'
  | 'emergency-access'
  | 'data-transfer'
  | string;

/**
 * Audit event
 */
export interface AuditEvent {
  id: string;
  type: AuditEventType;
  timestamp: string;
  userId?: string;
  patientId?: string;
  resourceType?: string;
  resourceId?: string;
  action: string;
  outcome: 'success' | 'failure';
  countryCode?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

/**
 * Policy decision
 */
export interface PolicyDecision {
  decision: 'allow' | 'deny';
  reason: string;
  requirements?: string[];
  timestamp: string;
}

/**
 * Feature flag
 */
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  countries?: string[];
  users?: string[];
  organizations?: string[];
  rolloutPercentage?: number;
  metadata?: Record<string, any>;
}
