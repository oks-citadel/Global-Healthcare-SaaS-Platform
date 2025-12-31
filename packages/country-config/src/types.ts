/**
 * Country Configuration Types
 * Defines the structure for country-specific healthcare configurations
 *
 * Hierarchy: Global → Region → Country
 */

// ============================================================================
// GLOBAL LAYER TYPES
// ============================================================================

/**
 * Global platform configuration (no PHI at this layer)
 */
export interface GlobalConfig {
  /** Platform name */
  platformName: string;

  /** Global feature flags */
  globalFeatures: {
    /** Whether multi-region is enabled */
    multiRegion: boolean;
    /** Whether global traffic routing is enabled */
    globalRouting: boolean;
    /** Whether cross-region failover is enabled */
    crossRegionFailover: boolean;
  };

  /** Global service catalog */
  serviceCatalog: GlobalService[];

  /** Default compliance standards for new regions */
  defaultCompliance: string[];

  /** Global observability settings */
  observability: {
    /** Global metrics aggregation */
    globalMetrics: boolean;
    /** Routing-only logs (no PHI) */
    routingLogs: boolean;
    /** Global alerting enabled */
    alerting: boolean;
  };

  /** Version */
  version: string;
}

/**
 * Global service definition
 */
export interface GlobalService {
  /** Service name */
  name: string;
  /** Service type */
  type: 'core' | 'domain' | 'support';
  /** Whether service is globally deployed */
  global: boolean;
  /** Required in all regions */
  required: boolean;
}

// ============================================================================
// REGIONAL LAYER TYPES
// ============================================================================

/**
 * Regional configuration (Americas, Europe, Africa)
 */
export interface RegionConfig {
  /** Region identifier */
  regionId: string;

  /** Region display name */
  name: string;

  /** AWS region location */
  awsRegion: string;

  /** Short location code */
  locationShort: string;

  /** Whether region is enabled */
  enabled: boolean;

  /** Compliance standards for the region */
  complianceStandards: string[];

  /** Data residency enforced at region level */
  dataResidency: RegionalDataResidency;

  /** Regional infrastructure config */
  infrastructure: RegionalInfrastructure;

  /** Countries in this region */
  countries: string[];

  /** Supported currencies in region */
  supportedCurrencies: string[];

  /** Regional feature availability */
  features: RegionalFeatures;

  /** Cross-region peering configuration */
  peeringConfig?: RegionPeering;
}

/**
 * Regional data residency settings
 */
export interface RegionalDataResidency {
  /** Whether PHI must stay in region */
  phiContainment: boolean;
  /** Allowed regions for replication */
  allowedReplicationRegions: string[];
  /** Whether cross-region backup is allowed */
  crossRegionBackup: boolean;
  /** Encryption key location */
  keyLocation: 'regional' | 'country';
}

/**
 * Regional infrastructure settings
 */
export interface RegionalInfrastructure {
  /** EKS cluster tier */
  eksTier: 'standard' | 'premium';
  /** PostgreSQL SKU */
  postgresqlSku: string;
  /** Redis tier */
  redisTier: 'basic' | 'standard' | 'premium';
  /** Whether high availability is enabled */
  highAvailability: boolean;
  /** Minimum node count */
  minNodes: number;
  /** Maximum node count */
  maxNodes: number;
}

/**
 * Regional feature availability
 */
export interface RegionalFeatures {
  /** AI inference allowed in region */
  aiInference: boolean;
  /** Telehealth allowed */
  telehealth: boolean;
  /** E-prescribing allowed */
  ePrescribing: boolean;
  /** Lab integration allowed */
  labIntegration: boolean;
  /** Imaging/PACS allowed */
  imagingPacs: boolean;
}

/**
 * Cross-region peering configuration
 */
export interface RegionPeering {
  /** Peered regions */
  peerRegions: string[];
  /** Traffic routing policy */
  routingPolicy: 'latency' | 'geographic' | 'priority';
  /** Failover priority */
  failoverPriority: number;
}

// ============================================================================
// COUNTRY LAYER TYPES
// ============================================================================

/**
 * Country isolation options for strict data residency
 */
export interface CountryIsolation {
  /** Whether country has isolated infrastructure */
  enabled: boolean;
  /** Dedicated database */
  dedicatedDatabase: boolean;
  /** Dedicated Secrets Manager */
  dedicatedSecretsManager: boolean;
  /** Customer-managed keys */
  customerManagedKeys: boolean;
  /** Dedicated EKS namespace */
  dedicatedNamespace: boolean;
  /** Dedicated storage account */
  dedicatedStorage: boolean;
  /** Dedicated Key Vault (Azure) */
  dedicatedKeyVault: boolean;
}

/**
 * Country-specific tax configuration
 */
export interface CountryTaxConfig {
  /** Whether VAT applies */
  vatApplicable: boolean;
  /** Standard VAT rate (percentage) */
  standardVatRate?: number;
  /** Reduced VAT rates */
  reducedRates?: Record<string, number>;
  /** Tax ID validation pattern */
  taxIdPattern?: string;
  /** Tax ID field name */
  taxIdFieldName?: string;
  /** Healthcare exemptions */
  healthcareExemptions?: string[];
}

/**
 * Country-specific locale settings
 */
export interface CountryLocale {
  /** Primary language */
  primaryLanguage: string;
  /** Supported languages */
  supportedLanguages: string[];
  /** Date format */
  dateFormat: string;
  /** Time format (12h/24h) */
  timeFormat: '12h' | '24h';
  /** Number format locale */
  numberLocale: string;
  /** Address format */
  addressFormat: string;
  /** Phone format */
  phoneFormat: string;
}

// ============================================================================
// ORIGINAL TYPES (ENHANCED)
// ============================================================================

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
  /** Region identifier (references RegionConfig.regionId) */
  regionId: string;

  /** Region display name (legacy - prefer regionId) */
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

  /** Country-specific isolation options */
  isolation?: CountryIsolation;

  /** Tax configuration */
  tax?: CountryTaxConfig;

  /** Locale settings */
  locale?: CountryLocale;

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

// ============================================================================
// PLATFORM HIERARCHY
// ============================================================================

/**
 * Complete platform hierarchy configuration
 * Global → Region → Country
 */
export interface PlatformHierarchy {
  /** Global configuration */
  global: GlobalConfig;

  /** Regional configurations indexed by regionId */
  regions: Record<string, RegionConfig>;

  /** Country configurations indexed by countryCode */
  countries: Record<string, CountryConfig>;
}

/**
 * Helper type for policy evaluation context
 */
export interface PolicyContext {
  /** User's country code */
  countryCode: string;

  /** User's region ID */
  regionId: string;

  /** Organization ID */
  organizationId: string;

  /** Tenant ID */
  tenantId: string;

  /** User role */
  role: string;

  /** Requested feature */
  feature?: string;

  /** Additional context */
  metadata?: Record<string, any>;
}

/**
 * Policy evaluation result
 */
export interface PolicyEvaluationResult {
  /** Whether access is allowed */
  allowed: boolean;

  /** Reason for decision */
  reason: string;

  /** Applicable rules */
  appliedRules: string[];

  /** Any modifications to the request */
  modifications?: Record<string, any>;

  /** Audit event ID */
  auditEventId: string;
}

// ============================================================================
// PREDEFINED REGION CONFIGURATIONS
// ============================================================================

/**
 * Americas region configuration
 */
export const AMERICAS_REGION: RegionConfig = {
  regionId: 'americas',
  name: 'Americas',
  awsRegion: 'us-east-1',
  locationShort: 'use1',
  enabled: true,
  complianceStandards: ['HIPAA', 'SOC2', 'ISO27001'],
  dataResidency: {
    phiContainment: true,
    allowedReplicationRegions: ['us-east-1', 'us-west-2'],
    crossRegionBackup: true,
    keyLocation: 'regional',
  },
  infrastructure: {
    eksTier: 'premium',
    postgresqlSku: 'db.r6g.xlarge',
    redisTier: 'premium',
    highAvailability: true,
    minNodes: 3,
    maxNodes: 20,
  },
  countries: ['US', 'CA', 'MX', 'BR', 'AR'],
  supportedCurrencies: ['USD', 'CAD', 'MXN', 'BRL', 'ARS'],
  features: {
    aiInference: true,
    telehealth: true,
    ePrescribing: true,
    labIntegration: true,
    imagingPacs: true,
  },
  peeringConfig: {
    peerRegions: ['europe', 'africa'],
    routingPolicy: 'latency',
    failoverPriority: 1,
  },
};

/**
 * Europe region configuration
 */
export const EUROPE_REGION: RegionConfig = {
  regionId: 'europe',
  name: 'Europe',
  awsRegion: 'eu-west-1',
  locationShort: 'euw1',
  enabled: true,
  complianceStandards: ['GDPR', 'ISO27001', 'SOC2'],
  dataResidency: {
    phiContainment: true,
    allowedReplicationRegions: ['eu-west-1', 'eu-central-1'],
    crossRegionBackup: true,
    keyLocation: 'regional',
  },
  infrastructure: {
    eksTier: 'premium',
    postgresqlSku: 'db.r6g.xlarge',
    redisTier: 'premium',
    highAvailability: true,
    minNodes: 3,
    maxNodes: 20,
  },
  countries: ['DE', 'FR', 'GB', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI'],
  supportedCurrencies: ['EUR', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK'],
  features: {
    aiInference: true,
    telehealth: true,
    ePrescribing: true,
    labIntegration: true,
    imagingPacs: true,
  },
  peeringConfig: {
    peerRegions: ['americas', 'africa'],
    routingPolicy: 'latency',
    failoverPriority: 2,
  },
};

/**
 * Africa region configuration
 */
export const AFRICA_REGION: RegionConfig = {
  regionId: 'africa',
  name: 'Africa',
  awsRegion: 'af-south-1',
  locationShort: 'afs1',
  enabled: true,
  complianceStandards: ['POPIA', 'NDPR', 'ISO27001'],
  dataResidency: {
    phiContainment: true,
    allowedReplicationRegions: ['af-south-1'],
    crossRegionBackup: false,
    keyLocation: 'regional',
  },
  infrastructure: {
    eksTier: 'standard',
    postgresqlSku: 'db.r6g.xlarge',
    redisTier: 'premium',
    highAvailability: true,
    minNodes: 3,
    maxNodes: 15,
  },
  countries: ['ZA', 'NG', 'KE', 'EG', 'GH', 'TZ', 'UG', 'RW', 'ET'],
  supportedCurrencies: ['ZAR', 'NGN', 'KES', 'EGP', 'GHS', 'TZS', 'UGX', 'RWF', 'ETB'],
  features: {
    aiInference: true,
    telehealth: true,
    ePrescribing: true,
    labIntegration: true,
    imagingPacs: true,
  },
  peeringConfig: {
    peerRegions: ['europe'],
    routingPolicy: 'latency',
    failoverPriority: 3,
  },
};

/**
 * Global platform configuration
 */
export const GLOBAL_CONFIG: GlobalConfig = {
  platformName: 'UnifiedHealth Platform',
  globalFeatures: {
    multiRegion: true,
    globalRouting: true,
    crossRegionFailover: true,
  },
  serviceCatalog: [
    { name: 'api-gateway', type: 'core', global: false, required: true },
    { name: 'identity-service', type: 'core', global: false, required: true },
    { name: 'patient-core-service', type: 'domain', global: false, required: true },
    { name: 'provider-core-service', type: 'domain', global: false, required: true },
    { name: 'clinical-data-service', type: 'domain', global: false, required: true },
    { name: 'telehealth-service', type: 'domain', global: false, required: false },
    { name: 'billing-service', type: 'support', global: false, required: true },
    { name: 'notification-service', type: 'support', global: false, required: true },
    { name: 'audit-service', type: 'core', global: false, required: true },
  ],
  defaultCompliance: ['ISO27001', 'SOC2'],
  observability: {
    globalMetrics: true,
    routingLogs: true,
    alerting: true,
  },
  version: '1.0.0',
};
