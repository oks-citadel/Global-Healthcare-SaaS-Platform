/**
 * Country Configuration Validation
 */

import { z } from 'zod';
import type { CountryConfig, ValidationResult } from './types';

// Zod schemas for validation
const ResidencyRulesSchema = z.object({
  dataLocation: z.enum(['regional', 'in-country', 'global']),
  allowedRegions: z.array(z.string()).optional(),
  allowCrossBorderTransfer: z.boolean(),
  transferSafeguards: z.array(z.string()).optional(),
  encryptionRequired: z.boolean(),
  encryptionStandards: z.array(z.string()).optional(),
});

const AllowedFeaturesSchema = z.object({
  telehealth: z.boolean(),
  videoConsultation: z.boolean(),
  electronicPrescription: z.boolean(),
  aiDiagnosis: z.boolean(),
  aiTreatment: z.boolean(),
  remoteMonitoring: z.boolean(),
  wearableIntegration: z.boolean(),
  mobileHealth: z.boolean(),
  customFeatures: z.record(z.boolean()).optional(),
});

const ConsentRulesSchema = z.object({
  model: z.enum(['opt-in', 'opt-out']),
  explicitConsentRequired: z.boolean(),
  availableScopes: z.array(z.string()),
  withdrawalAllowed: z.boolean(),
  minimumAge: z.number().optional(),
  parentalConsentRequired: z.boolean().optional(),
  validityPeriod: z.number().optional(),
  requiresReconfirmation: z.boolean().optional(),
});

const RetentionPeriodsSchema = z.object({
  patientRecords: z.number(),
  medicalImaging: z.number(),
  prescriptions: z.number(),
  auditLogs: z.number(),
  billing: z.number(),
  consent: z.number(),
  custom: z.record(z.number()).optional(),
});

const AuditRequirementsSchema = z.object({
  required: z.boolean(),
  requiredEvents: z.array(z.string()),
  realTime: z.boolean(),
  immutable: z.boolean(),
  tamperProof: z.boolean(),
  reportingFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually']).optional(),
  reportRecipients: z.array(z.string()).optional(),
});

const ProviderConfigSchema = z.object({
  type: z.enum(['ehr', 'hie', 'sms', 'payment', 'idv', 'lab', 'pharmacy', 'imaging', 'custom']),
  name: z.string(),
  endpoint: z.string().optional(),
  required: z.boolean(),
  authMethod: z.enum(['oauth2', 'api-key', 'mutual-tls', 'saml']).optional(),
  config: z.record(z.any()).optional(),
});

const LoggingConstraintsSchema = z.object({
  redactPHI: z.boolean(),
  redactedFields: z.array(z.string()).optional(),
  retentionDays: z.number(),
  cloudStorageAllowed: z.boolean(),
  minimumLevel: z.enum(['debug', 'info', 'warn', 'error']),
  structuredLogging: z.boolean(),
});

export const CountryConfigSchema = z.object({
  region: z.string(),
  countryCode: z.string().length(2),
  name: z.string(),
  enabled: z.boolean(),
  regulatoryFramework: z.array(z.string()),
  residency: ResidencyRulesSchema,
  features: AllowedFeaturesSchema,
  consent: ConsentRulesSchema,
  retention: RetentionPeriodsSchema,
  audit: AuditRequirementsSchema,
  providers: z.array(ProviderConfigSchema),
  logging: LoggingConstraintsSchema,
  timezone: z.string(),
  languages: z.array(z.string()),
  currency: z.string().length(3),
  custom: z.record(z.any()).optional(),
  version: z.string(),
  lastUpdated: z.string(),
});

/**
 * Validate a country configuration
 */
export function validateCountryConfig(config: unknown): ValidationResult {
  try {
    CountryConfigSchema.parse(config);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
      };
    }
    return {
      valid: false,
      errors: ['Unknown validation error'],
    };
  }
}

/**
 * Validate business rules for a country configuration
 */
export function validateBusinessRules(config: CountryConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check data residency consistency
  if (config.residency.dataLocation === 'in-country' && !config.residency.allowCrossBorderTransfer) {
    if (config.residency.allowedRegions && config.residency.allowedRegions.length > 1) {
      errors.push('In-country data location with no cross-border transfer cannot have multiple allowed regions');
    }
  }

  // Check consent rules consistency
  if (config.consent.model === 'opt-out' && config.consent.explicitConsentRequired) {
    warnings.push('Opt-out consent model with explicit consent requirement may be contradictory');
  }

  // Check retention periods are reasonable
  Object.entries(config.retention).forEach(([key, value]) => {
    if (typeof value === 'number' && value < 0) {
      errors.push(`Retention period for ${key} cannot be negative`);
    }
    if (typeof value === 'number' && value > 100) {
      warnings.push(`Retention period for ${key} is unusually long (${value} years)`);
    }
  });

  // Check audit requirements consistency
  if (config.audit.required && config.audit.requiredEvents.length === 0) {
    warnings.push('Audit is required but no events are specified to be audited');
  }

  // Check provider requirements
  const requiredProviders = config.providers.filter(p => p.required);
  if (requiredProviders.length === 0) {
    warnings.push('No required providers configured');
  }

  // Check encryption requirements
  if (config.residency.encryptionRequired && !config.residency.encryptionStandards) {
    warnings.push('Encryption is required but no standards specified');
  }

  // Check logging constraints
  if (config.logging.redactPHI && (!config.logging.redactedFields || config.logging.redactedFields.length === 0)) {
    warnings.push('PHI redaction is enabled but no fields specified for redaction');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Perform complete validation (schema + business rules)
 */
export function validateComplete(config: unknown): ValidationResult {
  // First validate schema
  const schemaResult = validateCountryConfig(config);
  if (!schemaResult.valid) {
    return schemaResult;
  }

  // Then validate business rules
  const businessResult = validateBusinessRules(config as CountryConfig);

  return {
    valid: businessResult.valid,
    errors: businessResult.errors,
    warnings: businessResult.warnings,
  };
}
