/**
 * @unifiedhealth/compliance
 *
 * Compliance utilities for HIPAA, GDPR, and POPIA
 */

// Audit
export * from './audit/auditLogger';
export { default as AuditLogger } from './audit/auditLogger';

// Consent
export * from './consent/consentManager';
export { default as ConsentManager } from './consent/consentManager';

// Encryption
export * from './encryption/fieldEncryption';
export { default as FieldEncryption } from './encryption/fieldEncryption';

// Retention
export * from './retention/dataRetention';
export { default as DataRetentionManager } from './retention/dataRetention';

// Deletion
export * from './deletion/dataDeletion';
export { default as DataDeletionManager } from './deletion/dataDeletion';

// Re-export everything
export {
  AuditLogger,
  ConsentManager,
  FieldEncryption,
  DataRetentionManager,
  DataDeletionManager
};
