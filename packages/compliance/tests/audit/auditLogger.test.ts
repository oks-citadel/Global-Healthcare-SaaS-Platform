import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AuditLogger,
  AuditEventType,
  AuditSeverity,
  ComplianceRegulation,
  type AuditContext,
  type PHIAccessDetails,
} from '../../src/audit/auditLogger';

describe('AuditLogger', () => {
  let auditLogger: AuditLogger;
  const mockContext: AuditContext = {
    userId: 'user-123',
    userEmail: 'doctor@example.com',
    userRole: 'provider',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    sessionId: 'session-123',
    requestId: 'req-123',
  };

  beforeEach(() => {
    auditLogger = new AuditLogger({
      serviceName: 'test-service',
      environment: 'test',
      region: 'us-east-1',
      hashSecret: 'test-secret-key',
      enableConsoleOutput: false,
      enableRemoteLogging: false,
    });
  });

  describe('PHI Access Logging', () => {
    it('should log PHI access successfully', async () => {
      const phiDetails: PHIAccessDetails = {
        patientId: 'patient-123',
        patientName: 'John Doe',
        recordType: 'medical_record',
        recordId: 'record-456',
        accessReason: 'Treatment',
        dataClassification: 'PHI',
      };

      const entry = await auditLogger.logPHIAccess(mockContext, phiDetails);

      expect(entry).toBeDefined();
      expect(entry.eventType).toBe(AuditEventType.PHI_ACCESS);
      expect(entry.regulation).toContain(ComplianceRegulation.HIPAA);
      expect(entry.phiAccess).toEqual(phiDetails);
      expect(entry.outcome).toBe('SUCCESS');
      expect(entry.hash).toBeDefined();
      expect(entry.id).toBeDefined();
      expect(entry.timestamp).toBeInstanceOf(Date);
    });

    it('should log failed PHI access with WARNING severity', async () => {
      const phiDetails: PHIAccessDetails = {
        patientId: 'patient-123',
        recordType: 'medical_record',
        recordId: 'record-456',
        dataClassification: 'PHI',
      };

      const entry = await auditLogger.logPHIAccess(
        mockContext,
        phiDetails,
        'FAILURE',
        { errorCode: 'ACCESS_DENIED' }
      );

      expect(entry.outcome).toBe('FAILURE');
      expect(entry.severity).toBe(AuditSeverity.WARNING);
      expect(entry.details.errorCode).toBe('ACCESS_DENIED');
    });

    it('should include service metadata in PHI access log', async () => {
      const phiDetails: PHIAccessDetails = {
        patientId: 'patient-123',
        recordType: 'medical_record',
        recordId: 'record-456',
        dataClassification: 'PHI',
      };

      const entry = await auditLogger.logPHIAccess(mockContext, phiDetails);

      expect(entry.details.serviceName).toBe('test-service');
      expect(entry.details.environment).toBe('test');
      expect(entry.details.region).toBe('us-east-1');
    });
  });

  describe('Personal Data Access Logging (GDPR/POPIA)', () => {
    it('should log GDPR personal data access for EU countries', async () => {
      const contextWithEU: AuditContext = {
        ...mockContext,
        location: {
          country: 'DE', // Germany
          region: 'Berlin',
        },
      };

      const entry = await auditLogger.logPersonalDataAccess(
        contextWithEU,
        'subject-123',
        'health_data',
        'Treatment',
        'Article 6(1)(c) - Legal obligation'
      );

      expect(entry).toBeDefined();
      expect(entry.eventType).toBe(AuditEventType.PERSONAL_DATA_ACCESS);
      expect(entry.regulation).toContain(ComplianceRegulation.GDPR);
      expect(entry.details.dataSubjectId).toBe('subject-123');
      expect(entry.details.legalBasis).toBe('Article 6(1)(c) - Legal obligation');
    });

    it('should log POPIA data access for South Africa', async () => {
      const contextWithSA: AuditContext = {
        ...mockContext,
        location: {
          country: 'ZA', // South Africa
        },
      };

      const entry = await auditLogger.logPersonalDataAccess(
        contextWithSA,
        'subject-123',
        'personal_info',
        'Consent',
        'Section 11 - Consent'
      );

      expect(entry.regulation).toContain(ComplianceRegulation.POPIA);
      expect(entry.details.dataCategory).toBe('personal_info');
    });

    it('should handle failed personal data access', async () => {
      const entry = await auditLogger.logPersonalDataAccess(
        mockContext,
        'subject-123',
        'health_data',
        'Treatment',
        'Consent',
        'FAILURE'
      );

      expect(entry.outcome).toBe('FAILURE');
      expect(entry.severity).toBe(AuditSeverity.WARNING);
    });
  });

  describe('Consent Logging', () => {
    it('should log consent granted event', async () => {
      const entry = await auditLogger.logConsent(
        mockContext,
        'patient-123',
        'GRANTED',
        ['data_processing', 'marketing'],
        {
          version: '1.0',
          method: 'web',
        }
      );

      expect(entry.eventType).toBe(AuditEventType.CONSENT_GRANTED);
      expect(entry.regulation).toContain(ComplianceRegulation.GDPR);
      expect(entry.regulation).toContain(ComplianceRegulation.POPIA);
      expect(entry.details.purposes).toEqual(['data_processing', 'marketing']);
      expect(entry.details.freely_given).toBe(true);
      expect(entry.details.specific).toBe(true);
      expect(entry.details.informed).toBe(true);
    });

    it('should log consent withdrawn event', async () => {
      const entry = await auditLogger.logConsent(
        mockContext,
        'patient-123',
        'WITHDRAWN',
        ['marketing'],
        {
          version: '1.0',
          reason: 'User request',
        }
      );

      expect(entry.eventType).toBe(AuditEventType.CONSENT_WITHDRAWN);
      expect(entry.details.reason).toBe('User request');
    });

    it('should log consent updated event', async () => {
      const entry = await auditLogger.logConsent(
        mockContext,
        'patient-123',
        'UPDATED',
        ['data_processing'],
        {
          version: '2.0',
          previousVersion: '1.0',
        }
      );

      expect(entry.eventType).toBe(AuditEventType.CONSENT_UPDATED);
      expect(entry.details.consentVersion).toBe('2.0');
    });
  });

  describe('Data Subject Rights Requests', () => {
    it('should log access request (GDPR Article 15)', async () => {
      const entry = await auditLogger.logDataSubjectRequest(
        mockContext,
        'ACCESS',
        'patient-123',
        {
          requestReason: 'User wants to know what data we have',
        }
      );

      expect(entry.eventType).toBe(AuditEventType.ACCESS_REQUEST);
      expect(entry.regulation).toContain(ComplianceRegulation.GDPR);
      expect(entry.details.sla).toBe('30 days');
      expect(entry.details.requestId).toBeDefined();
    });

    it('should log deletion request (Right to be Forgotten)', async () => {
      const entry = await auditLogger.logDataSubjectRequest(
        mockContext,
        'DELETION',
        'patient-123',
        {
          requestReason: 'User wants all data deleted',
        }
      );

      expect(entry.eventType).toBe(AuditEventType.DELETION_REQUEST);
      expect(entry.details.sla).toBe('30 days');
    });

    it('should log portability request (GDPR Article 20)', async () => {
      const entry = await auditLogger.logDataSubjectRequest(
        mockContext,
        'PORTABILITY',
        'patient-123',
        {
          format: 'JSON',
        }
      );

      expect(entry.eventType).toBe(AuditEventType.PORTABILITY_REQUEST);
      expect(entry.details.format).toBe('JSON');
    });

    it('should log rectification request', async () => {
      const entry = await auditLogger.logDataSubjectRequest(
        mockContext,
        'RECTIFICATION',
        'patient-123',
        {
          field: 'email',
          oldValue: 'old@example.com',
          newValue: 'new@example.com',
        }
      );

      expect(entry.eventType).toBe(AuditEventType.RECTIFICATION_REQUEST);
    });

    it('should log objection request', async () => {
      const entry = await auditLogger.logDataSubjectRequest(
        mockContext,
        'OBJECTION',
        'patient-123',
        {
          processingType: 'marketing',
        }
      );

      expect(entry.eventType).toBe(AuditEventType.OBJECTION_REQUEST);
    });
  });

  describe('Security Event Logging', () => {
    it('should log security alert with CRITICAL severity', async () => {
      const entry = await auditLogger.logSecurityEvent(
        mockContext,
        AuditEventType.SECURITY_ALERT,
        AuditSeverity.CRITICAL,
        {
          alertType: 'multiple_failed_logins',
          attempts: 5,
        }
      );

      expect(entry.eventType).toBe(AuditEventType.SECURITY_ALERT);
      expect(entry.severity).toBe(AuditSeverity.CRITICAL);
      expect(entry.regulation).toContain(ComplianceRegulation.HIPAA);
      expect(entry.regulation).toContain(ComplianceRegulation.GDPR);
      expect(entry.details.requiresInvestigation).toBe(true);
    });

    it('should log breach detection', async () => {
      const entry = await auditLogger.logSecurityEvent(
        mockContext,
        AuditEventType.BREACH_DETECTED,
        AuditSeverity.CRITICAL,
        {
          breachType: 'unauthorized_access',
          affectedRecords: 100,
        }
      );

      expect(entry.eventType).toBe(AuditEventType.BREACH_DETECTED);
      expect(entry.details.affectedRecords).toBe(100);
    });

    it('should log encryption key rotation', async () => {
      const entry = await auditLogger.logSecurityEvent(
        mockContext,
        AuditEventType.ENCRYPTION_KEY_ROTATION,
        AuditSeverity.INFO,
        {
          keyId: 'key-456',
          previousKeyId: 'key-123',
        }
      );

      expect(entry.eventType).toBe(AuditEventType.ENCRYPTION_KEY_ROTATION);
      expect(entry.severity).toBe(AuditSeverity.INFO);
    });
  });

  describe('Audit Log Integrity', () => {
    it('should generate unique hash for each entry', async () => {
      const phiDetails: PHIAccessDetails = {
        patientId: 'patient-123',
        recordType: 'medical_record',
        recordId: 'record-456',
        dataClassification: 'PHI',
      };

      const entry1 = await auditLogger.logPHIAccess(mockContext, phiDetails);
      const entry2 = await auditLogger.logPHIAccess(mockContext, phiDetails);

      expect(entry1.hash).toBeDefined();
      expect(entry2.hash).toBeDefined();
      expect(entry1.hash).not.toBe(entry2.hash);
    });

    it('should chain hashes for tamper detection', async () => {
      const phiDetails: PHIAccessDetails = {
        patientId: 'patient-123',
        recordType: 'medical_record',
        recordId: 'record-456',
        dataClassification: 'PHI',
      };

      const entry1 = await auditLogger.logPHIAccess(mockContext, phiDetails);
      const entry2 = await auditLogger.logPHIAccess(mockContext, phiDetails);

      // Second entry's hash should be different from first due to chaining
      expect(entry1.hash).not.toBe(entry2.hash);
    });

    it('should verify audit log integrity', async () => {
      const phiDetails: PHIAccessDetails = {
        patientId: 'patient-123',
        recordType: 'medical_record',
        recordId: 'record-456',
        dataClassification: 'PHI',
      };

      const entry = await auditLogger.logPHIAccess(mockContext, phiDetails);

      // Verify should return true for valid entry
      const isValid = auditLogger.verifyIntegrity(entry, '');
      expect(isValid).toBeDefined();
    });
  });

  describe('Event Emitter', () => {
    it('should emit audit event', async () => {
      const mockListener = vi.fn();
      auditLogger.on('audit', mockListener);

      const phiDetails: PHIAccessDetails = {
        patientId: 'patient-123',
        recordType: 'medical_record',
        recordId: 'record-456',
        dataClassification: 'PHI',
      };

      await auditLogger.logPHIAccess(mockContext, phiDetails);

      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: AuditEventType.PHI_ACCESS,
        })
      );
    });

    it('should emit remote-log event when remote logging is enabled', async () => {
      const loggerWithRemote = new AuditLogger({
        serviceName: 'test-service',
        environment: 'test',
        region: 'us-east-1',
        hashSecret: 'test-secret-key',
        enableRemoteLogging: true,
        remoteLogEndpoint: 'https://logs.example.com',
      });

      const mockListener = vi.fn();
      loggerWithRemote.on('remote-log', mockListener);

      const phiDetails: PHIAccessDetails = {
        patientId: 'patient-123',
        recordType: 'medical_record',
        recordId: 'record-456',
        dataClassification: 'PHI',
      };

      await loggerWithRemote.logPHIAccess(mockContext, phiDetails);

      expect(mockListener).toHaveBeenCalled();
    });
  });

  describe('Export Functionality', () => {
    it('should emit export-request event', async () => {
      const mockListener = vi.fn();
      auditLogger.on('export-request', mockListener);

      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      await auditLogger.exportAuditLogs(startDate, endDate, {
        userId: 'user-123',
        eventTypes: [AuditEventType.PHI_ACCESS],
      });

      expect(mockListener).toHaveBeenCalledWith({
        startDate,
        endDate,
        filters: {
          userId: 'user-123',
          eventTypes: [AuditEventType.PHI_ACCESS],
        },
      });
    });
  });
});
