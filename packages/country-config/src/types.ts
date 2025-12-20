/**
 * Country Configuration Types
 * Defines the structure for country-specific healthcare configurations
 */

/**
 * Data residency requirements
 */
export interface ResidencyRules {
  /** Where data must be stored: 'regional', 'in-country', or 'global' */
  dataLocation: 'regional' | 'in-country' | 'global';

  /** Specific regions/countries where data can be stored */
  allowedRegions?: string[];

  /** Whether cross-border data transfer is allowed */
  allowCrossBorderTransfer: boolean;

  /** Required safeguards for data transfer (e.g., Standard Contractual Clauses) */
  transferSafeguards?: string[];

  /** Whether data must be encrypted at rest */
  encryptionRequired: boolean;

  /** Specific encryption standards required */
  encryptionStandards?: string[];
}

/**
 * Allowed features per country/region
 */
export interface AllowedFeatures {
  /** Whether telehealth/telemedicine is allowed */
  telehealth: boolean;

  /** Whether video consultations are allowed */
  videoConsultation: boolean;

  /** Whether electronic prescriptions are allowed */
  electronicPrescription: boolean;

  /** Whether AI-assisted diagnosis is allowed */
  aiDiagnosis: boolean;

  /** Whether AI-assisted treatment recommendations are allowed */
  aiTreatment: boolean;

  /** Whether remote patient monitoring is allowed */
  remoteMonitoring: boolean;

  /** Whether wearable device integration is allowed */
  wearableIntegration: boolean;

  /** Whether mobile health apps are allowed */
  mobileHealth: boolean;

  /** Custom feature flags */
  customFeatures?: Record<string, boolean>;
}

/**
 * Consent management rules
 */
export interface ConsentRules {
  /** Consent model: 'opt-in' or 'opt-out' */
  model: 'opt-in' | 'opt-out';

  /** Whether explicit consent is required */
  explicitConsentRequired: boolean;

  /** Available consent scopes */
  availableScopes: string[];

  /** Whether consent can be withdrawn */
  withdrawalAllowed: boolean;

  /** Minimum age for consent */
  minimumAge?: number;

  /** Whether parental consent is required for minors */
  parentalConsentRequired?: boolean;

  /** How long consent is valid (in days) */
  validityPeriod?: number;

  /** Whether consent must be re-confirmed periodically */
  requiresReconfirmation?: boolean;
}

/**
 * Data retention requirements
 */
export interface RetentionPeriods {
  /** Patient records retention period (in years) */
  patientRecords: number;

  /** Medical imaging retention period (in years) */
  medicalImaging: number;

  /** Prescription records retention period (in years) */
  prescriptions: number;

  /** Audit logs retention period (in years) */
  auditLogs: number;

  /** Billing records retention period (in years) */
  billing: number;

  /** Consent records retention period (in years) */
  consent: number;

  /** Custom retention periods for specific data types */
  custom?: Record<string, number>;
}

/**
 * Audit requirements
 */
export interface AuditRequirements {
  /** Whether audit logging is required */
  required: boolean;

  /** Events that must be audited */
  requiredEvents: string[];

  /** Whether real-time audit logging is required */
  realTime: boolean;

  /** Whether audit logs must be immutable */
  immutable: boolean;

  /** Whether audit logs must be signed/sealed */
  tamperProof: boolean;

  /** How often audit reports must be generated */
  reportingFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';

  /** Who must receive audit reports */
  reportRecipients?: string[];
}

/**
 * External provider configuration
 */
export interface ProviderConfig {
  /** Provider type */
  type: 'ehr' | 'hie' | 'sms' | 'payment' | 'idv' | 'lab' | 'pharmacy' | 'imaging' | 'custom';

  /** Provider name/identifier */
  name: string;

  /** Provider endpoint URL */
  endpoint?: string;

  /** Whether this provider is required */
  required: boolean;

  /** Authentication method */
  authMethod?: 'oauth2' | 'api-key' | 'mutual-tls' | 'saml';

  /** Provider-specific configuration */
  config?: Record<string, any>;
}

/**
 * Logging and PHI redaction rules
 */
export interface LoggingConstraints {
  /** Whether PHI must be redacted from logs */
  redactPHI: boolean;

  /** Fields that must be redacted */
  redactedFields?: string[];

  /** Log retention period (in days) */
  retentionDays: number;

  /** Whether logs can be stored in cloud */
  cloudStorageAllowed: boolean;

  /** Minimum log level */
  minimumLevel: 'debug' | 'info' | 'warn' | 'error';

  /** Whether structured logging is required */
  structuredLogging: boolean;
}

/**
 * Complete country configuration
 */
export interface CountryConfig {
  /** Region/country identifier */
  region: string;

  /** ISO 3166-1 alpha-2 country code */
  countryCode: string;

  /** Country/region name */
  name: string;

  /** Whether this configuration is active */
  enabled: boolean;

  /** Primary regulatory framework (HIPAA, GDPR, etc.) */
  regulatoryFramework: string[];

  /** Data residency rules */
  residency: ResidencyRules;

  /** Allowed features */
  features: AllowedFeatures;

  /** Consent management rules */
  consent: ConsentRules;

  /** Data retention periods */
  retention: RetentionPeriods;

  /** Audit requirements */
  audit: AuditRequirements;

  /** External providers configuration */
  providers: ProviderConfig[];

  /** Logging constraints */
  logging: LoggingConstraints;

  /** Timezone */
  timezone: string;

  /** Primary language(s) */
  languages: string[];

  /** Currency code (ISO 4217) */
  currency: string;

  /** Custom configuration fields */
  custom?: Record<string, any>;

  /** Configuration version */
  version: string;

  /** Last updated timestamp */
  lastUpdated: string;
}

/**
 * Configuration validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}
