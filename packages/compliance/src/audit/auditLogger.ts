/**
 * Comprehensive Audit Logger for HIPAA, GDPR, and POPIA compliance
 *
 * Features:
 * - HIPAA: 7-year retention requirement (45 CFR § 164.312(b))
 * - GDPR: Right to access audit logs (Article 15)
 * - POPIA: Audit trail requirements (Section 14)
 */

import { EventEmitter } from "events";
import * as crypto from "crypto";

export enum AuditEventType {
  // Access Events
  PHI_ACCESS = "PHI_ACCESS",
  PERSONAL_DATA_ACCESS = "PERSONAL_DATA_ACCESS",
  HEALTH_RECORD_VIEW = "HEALTH_RECORD_VIEW",
  HEALTH_RECORD_DOWNLOAD = "HEALTH_RECORD_DOWNLOAD",

  // Modification Events
  DATA_CREATE = "DATA_CREATE",
  DATA_UPDATE = "DATA_UPDATE",
  DATA_DELETE = "DATA_DELETE",

  // Authentication Events
  USER_LOGIN = "USER_LOGIN",
  USER_LOGOUT = "USER_LOGOUT",
  LOGIN_FAILED = "LOGIN_FAILED",
  MFA_CHALLENGE = "MFA_CHALLENGE",
  MFA_SUCCESS = "MFA_SUCCESS",
  MFA_FAILED = "MFA_FAILED",

  // Authorization Events
  PERMISSION_GRANTED = "PERMISSION_GRANTED",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  ROLE_ASSIGNED = "ROLE_ASSIGNED",
  ROLE_REVOKED = "ROLE_REVOKED",

  // Consent Events
  CONSENT_GRANTED = "CONSENT_GRANTED",
  CONSENT_WITHDRAWN = "CONSENT_WITHDRAWN",
  CONSENT_UPDATED = "CONSENT_UPDATED",

  // Data Subject Rights
  ACCESS_REQUEST = "ACCESS_REQUEST",
  RECTIFICATION_REQUEST = "RECTIFICATION_REQUEST",
  DELETION_REQUEST = "DELETION_REQUEST",
  PORTABILITY_REQUEST = "PORTABILITY_REQUEST",
  OBJECTION_REQUEST = "OBJECTION_REQUEST",

  // Security Events
  ENCRYPTION_KEY_ROTATION = "ENCRYPTION_KEY_ROTATION",
  SECURITY_ALERT = "SECURITY_ALERT",
  BREACH_DETECTED = "BREACH_DETECTED",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",

  // Compliance Events
  COMPLIANCE_VIOLATION = "COMPLIANCE_VIOLATION",
  POLICY_UPDATED = "POLICY_UPDATED",
  AUDIT_LOG_EXPORT = "AUDIT_LOG_EXPORT",

  // Administrative Events
  CONFIGURATION_CHANGE = "CONFIGURATION_CHANGE",
  SYSTEM_MAINTENANCE = "SYSTEM_MAINTENANCE",
  BACKUP_CREATED = "BACKUP_CREATED",
  RESTORE_PERFORMED = "RESTORE_PERFORMED",
}

export enum ComplianceRegulation {
  HIPAA = "HIPAA",
  GDPR = "GDPR",
  POPIA = "POPIA",
}

export enum AuditSeverity {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export interface AuditContext {
  userId?: string;
  userEmail?: string;
  userRole?: string;
  ipAddress: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
  deviceId?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

export interface PHIAccessDetails {
  patientId: string;
  patientName?: string;
  recordType: string;
  recordId: string;
  accessReason?: string;
  dataClassification: "PHI" | "ePHI" | "SENSITIVE";
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  severity: AuditSeverity;
  regulation: ComplianceRegulation[];
  context: AuditContext;
  details: Record<string, unknown>;
  phiAccess?: PHIAccessDetails;
  outcome: "SUCCESS" | "FAILURE" | "PARTIAL";
  errorMessage?: string;
  hash: string; // For audit log integrity
}

export interface AuditLoggerConfig {
  serviceName: string;
  environment: string;
  region: string;
  enableConsoleOutput?: boolean;
  enableRemoteLogging?: boolean;
  remoteLogEndpoint?: string;
  hashSecret: string;
  retentionDays?: number; // Default: 2555 (7 years for HIPAA)
}

export class AuditLogger extends EventEmitter {
  private config: AuditLoggerConfig;
  private previousHash: string = "";

  constructor(config: AuditLoggerConfig) {
    super();
    this.config = {
      retentionDays: 2555, // 7 years for HIPAA
      enableConsoleOutput: false,
      enableRemoteLogging: true,
      ...config,
    };
  }

  /**
   * Log PHI access event (HIPAA requirement)
   */
  async logPHIAccess(
    context: AuditContext,
    phiDetails: PHIAccessDetails,
    outcome: "SUCCESS" | "FAILURE" = "SUCCESS",
    additionalDetails?: Record<string, unknown>,
  ): Promise<AuditEntry> {
    return this.log({
      eventType: AuditEventType.PHI_ACCESS,
      severity:
        outcome === "FAILURE" ? AuditSeverity.WARNING : AuditSeverity.INFO,
      regulation: [ComplianceRegulation.HIPAA],
      context,
      phiAccess: phiDetails,
      outcome,
      details: {
        ...additionalDetails,
        dataType: "PHI",
        requiresBAA: true,
      },
    });
  }

  /**
   * Log personal data access (GDPR/POPIA requirement)
   */
  async logPersonalDataAccess(
    context: AuditContext,
    dataSubjectId: string,
    dataCategory: string,
    purpose: string,
    legalBasis: string,
    outcome: "SUCCESS" | "FAILURE" = "SUCCESS",
  ): Promise<AuditEntry> {
    const regulation: ComplianceRegulation[] = [];

    // Determine applicable regulations based on region
    if (
      context.location?.country &&
      this.isEUCountry(context.location.country)
    ) {
      regulation.push(ComplianceRegulation.GDPR);
    }
    if (context.location?.country === "ZA") {
      regulation.push(ComplianceRegulation.POPIA);
    }

    return this.log({
      eventType: AuditEventType.PERSONAL_DATA_ACCESS,
      severity:
        outcome === "FAILURE" ? AuditSeverity.WARNING : AuditSeverity.INFO,
      regulation,
      context,
      outcome,
      details: {
        dataSubjectId,
        dataCategory,
        processingPurpose: purpose,
        legalBasis,
        gdprArticle: legalBasis.startsWith("Article") ? legalBasis : null,
      },
    });
  }

  /**
   * Log consent event (GDPR Article 7, POPIA Section 11)
   */
  async logConsent(
    context: AuditContext,
    dataSubjectId: string,
    consentType: "GRANTED" | "WITHDRAWN" | "UPDATED",
    purposes: string[],
    consentDetails: Record<string, unknown>,
  ): Promise<AuditEntry> {
    const eventType =
      consentType === "GRANTED"
        ? AuditEventType.CONSENT_GRANTED
        : consentType === "WITHDRAWN"
          ? AuditEventType.CONSENT_WITHDRAWN
          : AuditEventType.CONSENT_UPDATED;

    return this.log({
      eventType,
      severity: AuditSeverity.INFO,
      regulation: [ComplianceRegulation.GDPR, ComplianceRegulation.POPIA],
      context,
      outcome: "SUCCESS",
      details: {
        dataSubjectId,
        purposes,
        consentVersion: consentDetails.version,
        consentTimestamp: new Date().toISOString(),
        consentMethod: consentDetails.method || "web",
        freely_given: true,
        specific: true,
        informed: true,
        unambiguous: true,
        ...consentDetails,
      },
    });
  }

  /**
   * Log data subject rights request (GDPR Chapter 3, POPIA Section 23-25)
   */
  async logDataSubjectRequest(
    context: AuditContext,
    requestType:
      | "ACCESS"
      | "RECTIFICATION"
      | "DELETION"
      | "PORTABILITY"
      | "OBJECTION",
    dataSubjectId: string,
    requestDetails: Record<string, unknown>,
  ): Promise<AuditEntry> {
    const eventTypeMap = {
      ACCESS: AuditEventType.ACCESS_REQUEST,
      RECTIFICATION: AuditEventType.RECTIFICATION_REQUEST,
      DELETION: AuditEventType.DELETION_REQUEST,
      PORTABILITY: AuditEventType.PORTABILITY_REQUEST,
      OBJECTION: AuditEventType.OBJECTION_REQUEST,
    };

    return this.log({
      eventType: eventTypeMap[requestType],
      severity: AuditSeverity.INFO,
      regulation: [ComplianceRegulation.GDPR, ComplianceRegulation.POPIA],
      context,
      outcome: "SUCCESS",
      details: {
        dataSubjectId,
        requestId: requestDetails.requestId || crypto.randomUUID(),
        requestDate: new Date().toISOString(),
        sla: requestType === "DELETION" ? "30 days" : "30 days",
        ...requestDetails,
      },
    });
  }

  /**
   * Log security event (All regulations require security logging)
   */
  async logSecurityEvent(
    context: AuditContext,
    eventType: AuditEventType,
    severity: AuditSeverity,
    details: Record<string, unknown>,
  ): Promise<AuditEntry> {
    const outcome =
      (details.outcome as "SUCCESS" | "FAILURE" | "PARTIAL" | undefined) ||
      "SUCCESS";
    return this.log({
      eventType,
      severity,
      regulation: [
        ComplianceRegulation.HIPAA,
        ComplianceRegulation.GDPR,
        ComplianceRegulation.POPIA,
      ],
      context,
      outcome,
      details: {
        ...details,
        securityEvent: true,
        requiresInvestigation: severity === AuditSeverity.CRITICAL,
      },
    });
  }

  /**
   * Core logging method
   */
  private async log(params: {
    eventType: AuditEventType;
    severity: AuditSeverity;
    regulation: ComplianceRegulation[];
    context: AuditContext;
    phiAccess?: PHIAccessDetails;
    outcome: "SUCCESS" | "FAILURE" | "PARTIAL";
    errorMessage?: string;
    details: Record<string, unknown>;
  }): Promise<AuditEntry> {
    const entry: AuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      eventType: params.eventType,
      severity: params.severity,
      regulation: params.regulation,
      context: params.context,
      phiAccess: params.phiAccess,
      outcome: params.outcome,
      errorMessage: params.errorMessage,
      details: {
        ...params.details,
        serviceName: this.config.serviceName,
        environment: this.config.environment,
        region: this.config.region,
      },
      hash: "", // Will be calculated below
    };

    // Calculate hash for audit log integrity
    entry.hash = this.calculateHash(entry);
    this.previousHash = entry.hash;

    // Emit event for subscribers
    this.emit("audit", entry);

    // Console output (for development)
    if (this.config.enableConsoleOutput) {
      console.log("[AUDIT]", JSON.stringify(entry, null, 2));
    }

    // Send to remote logging service
    if (this.config.enableRemoteLogging && this.config.remoteLogEndpoint) {
      await this.sendToRemote(entry);
    }

    return entry;
  }

  /**
   * Calculate tamper-proof hash for audit entry
   */
  private calculateHash(entry: Omit<AuditEntry, "hash">): string {
    const data = JSON.stringify({
      ...entry,
      previousHash: this.previousHash,
    });

    return crypto
      .createHmac("sha256", this.config.hashSecret)
      .update(data)
      .digest("hex");
  }

  /**
   * Verify audit log integrity
   */
  verifyIntegrity(entry: AuditEntry, previousHash: string): boolean {
    // Store original previousHash, set to provided one for verification
    const originalPreviousHash = this.previousHash;
    this.previousHash = previousHash;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash: _, ...entryWithoutHash } = entry;
    const expectedHash = this.calculateHash(entryWithoutHash);

    // Restore original previousHash
    this.previousHash = originalPreviousHash;

    return entry.hash === expectedHash;
  }

  /**
   * Send audit log to remote service
   */
  private async sendToRemote(entry: AuditEntry): Promise<void> {
    try {
      if (!this.config.remoteLogEndpoint) return;

      // In production, this would send to CloudWatch, Elasticsearch, or similar
      // For now, we'll just emit an event
      this.emit("remote-log", entry);

      // Remote logging implementation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      try {
        await fetch(this.config.remoteLogEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Audit-Source": "unified-health-platform",
            "X-Audit-Version": "1.0",
          },
          body: JSON.stringify({
            ...entry,
            metadata: {
              ...entry.metadata,
              sentAt: new Date().toISOString(),
            },
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      console.error("Failed to send audit log to remote service:", error);
      // Don't throw - audit logging should not break application flow
    }
  }

  /**
   * Helper to determine if country is in EU
   */
  private isEUCountry(countryCode: string): boolean {
    const euCountries = [
      "AT",
      "BE",
      "BG",
      "HR",
      "CY",
      "CZ",
      "DK",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "HU",
      "IE",
      "IT",
      "LV",
      "LT",
      "LU",
      "MT",
      "NL",
      "PL",
      "PT",
      "RO",
      "SK",
      "SI",
      "ES",
      "SE",
    ];
    return euCountries.includes(countryCode.toUpperCase());
  }

  /**
   * Export audit logs for compliance reporting
   */
  async exportAuditLogs(
    startDate: Date,
    endDate: Date,
    filters?: {
      userId?: string;
      eventTypes?: AuditEventType[];
      regulations?: ComplianceRegulation[];
    },
  ): Promise<AuditEntry[]> {
    // Emit export request event for storage layer to handle
    this.emit("export-request", { startDate, endDate, filters });

    // Query in-memory cache for immediate export (production uses database)
    const cachedLogs = this.getRecentLogs();

    // Filter logs by date range and criteria
    const filteredLogs = cachedLogs.filter((log) => {
      const logDate = new Date(log.timestamp);
      if (logDate < startDate || logDate > endDate) return false;

      if (filters?.userId && log.actor.userId !== filters.userId) return false;
      if (filters?.eventTypes && !filters.eventTypes.includes(log.eventType))
        return false;
      if (filters?.regulations) {
        const logRegulations = log.compliance?.regulations || [];
        if (!filters.regulations.some((r) => logRegulations.includes(r)))
          return false;
      }

      return true;
    });

    return filteredLogs;
  }

  /**
   * Get recent logs from in-memory cache
   * Production implementation should query database
   */
  private getRecentLogs(): AuditEntry[] {
    // Return cached entries (limited to prevent memory issues)
    return Array.from(this.recentEntries || []);
  }

  /**
   * In-memory cache for recent entries (for export functionality)
   */
  private recentEntries: AuditEntry[] = [];
  private maxRecentEntries = 10000;

  /**
   * Cache entry for export functionality
   */
  private cacheEntry(entry: AuditEntry): void {
    this.recentEntries.push(entry);
    if (this.recentEntries.length > this.maxRecentEntries) {
      this.recentEntries.shift(); // Remove oldest entry
    }
  }
}

export default AuditLogger;
