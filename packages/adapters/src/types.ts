/**
 * Provider Adapter Types
 * Interfaces for external healthcare system integrations
 */

// ============================================================================
// ADAPTER TYPES
// ============================================================================

/**
 * Adapter types
 */
export enum AdapterType {
  EHR = 'ehr',
  HIE = 'hie',
  LAB = 'lab',
  PHARMACY = 'pharmacy',
  IMAGING = 'imaging',
  PAYMENT = 'payment',
  IDENTITY = 'identity',
  SMS = 'sms',
  EMAIL = 'email',
  PUSH = 'push',
  CUSTOM = 'custom',
}

/**
 * Adapter status
 */
export enum AdapterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  PENDING_SETUP = 'pending_setup',
}

/**
 * Authentication method
 */
export enum AuthMethod {
  OAUTH2 = 'oauth2',
  API_KEY = 'api-key',
  MUTUAL_TLS = 'mutual-tls',
  SAML = 'saml',
  BASIC = 'basic',
  JWT = 'jwt',
}

// ============================================================================
// ADAPTER CONFIGURATION
// ============================================================================

/**
 * OAuth2 configuration
 */
export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  scopes: string[];
  redirectUri?: string;
}

/**
 * API key configuration
 */
export interface ApiKeyConfig {
  apiKey: string;
  headerName?: string;
  queryParam?: string;
}

/**
 * Mutual TLS configuration
 */
export interface MutualTlsConfig {
  clientCert: string;
  clientKey: string;
  caCert?: string;
  passphrase?: string;
}

/**
 * JWT configuration
 */
export interface JwtConfig {
  privateKey: string;
  publicKey?: string;
  algorithm: 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512';
  issuer: string;
  audience?: string;
  expiresIn?: number;
}

/**
 * Authentication configuration union
 */
export type AuthConfig = OAuth2Config | ApiKeyConfig | MutualTlsConfig | JwtConfig | { username: string; password: string };

/**
 * Adapter configuration
 */
export interface AdapterConfig {
  /** Unique adapter ID */
  id: string;

  /** Display name */
  name: string;

  /** Adapter type */
  type: AdapterType;

  /** Status */
  status: AdapterStatus;

  /** Base URL for API calls */
  baseUrl: string;

  /** Authentication method */
  authMethod: AuthMethod;

  /** Authentication configuration (stored in Key Vault) */
  authConfigKeyVaultRef: string;

  /** Country code (for country-specific adapters) */
  countryCode?: string;

  /** Region ID (for region-specific adapters) */
  regionId?: string;

  /** FHIR version supported */
  fhirVersion?: 'R4' | 'R5' | 'DSTU2' | 'STU3';

  /** Whether adapter supports SMART on FHIR */
  smartOnFhir?: boolean;

  /** Rate limiting configuration */
  rateLimit?: {
    requestsPerSecond: number;
    burstLimit: number;
  };

  /** Timeout in milliseconds */
  timeoutMs: number;

  /** Retry configuration */
  retry?: {
    maxRetries: number;
    backoffMs: number;
    backoffMultiplier: number;
  };

  /** Custom headers */
  headers?: Record<string, string>;

  /** Metadata */
  metadata?: Record<string, any>;

  /** Created at */
  createdAt: Date;

  /** Updated at */
  updatedAt: Date;
}

// ============================================================================
// ADAPTER REQUEST/RESPONSE
// ============================================================================

/**
 * Adapter request context
 */
export interface AdapterContext {
  /** Request ID for tracing */
  requestId: string;

  /** Organization ID */
  organizationId: string;

  /** Tenant ID */
  tenantId: string;

  /** User ID */
  userId?: string;

  /** Patient ID */
  patientId?: string;

  /** Country code */
  countryCode: string;

  /** Region ID */
  regionId: string;

  /** Correlation ID for distributed tracing */
  correlationId: string;

  /** Timestamp */
  timestamp: Date;
}

/**
 * Adapter request
 */
export interface AdapterRequest<T = any> {
  /** Adapter ID */
  adapterId: string;

  /** Operation name */
  operation: string;

  /** Request context */
  context: AdapterContext;

  /** Request payload */
  payload: T;

  /** Idempotency key */
  idempotencyKey?: string;

  /** Priority (for queue ordering) */
  priority?: 'high' | 'normal' | 'low';
}

/**
 * Adapter response
 */
export interface AdapterResponse<T = any> {
  /** Whether request was successful */
  success: boolean;

  /** Response data */
  data?: T;

  /** Error information */
  error?: AdapterError;

  /** Response metadata */
  metadata: {
    /** Request ID */
    requestId: string;
    /** Adapter ID */
    adapterId: string;
    /** Duration in milliseconds */
    durationMs: number;
    /** HTTP status code */
    statusCode?: number;
    /** Rate limit remaining */
    rateLimitRemaining?: number;
    /** Retry after (if rate limited) */
    retryAfter?: number;
  };
}

/**
 * Adapter error
 */
export interface AdapterError {
  /** Error code */
  code: string;

  /** Error message */
  message: string;

  /** Underlying error details */
  details?: any;

  /** Whether error is retryable */
  retryable: boolean;

  /** Suggested retry delay in milliseconds */
  retryDelayMs?: number;
}

// ============================================================================
// ADAPTER EVENTS
// ============================================================================

/**
 * Adapter event type
 */
export enum AdapterEventType {
  REQUEST_SENT = 'adapter.request.sent',
  REQUEST_SUCCESS = 'adapter.request.success',
  REQUEST_FAILED = 'adapter.request.failed',
  REQUEST_TIMEOUT = 'adapter.request.timeout',
  REQUEST_RETRIED = 'adapter.request.retried',
  RATE_LIMITED = 'adapter.rate_limited',
  CIRCUIT_OPENED = 'adapter.circuit.opened',
  CIRCUIT_CLOSED = 'adapter.circuit.closed',
  HEALTH_CHECK_PASSED = 'adapter.health.passed',
  HEALTH_CHECK_FAILED = 'adapter.health.failed',
}

/**
 * Adapter event
 */
export interface AdapterEvent {
  /** Event ID */
  id: string;

  /** Event type */
  type: AdapterEventType;

  /** Adapter ID */
  adapterId: string;

  /** Request ID */
  requestId?: string;

  /** Context */
  context?: Partial<AdapterContext>;

  /** Event data */
  data?: Record<string, any>;

  /** Timestamp */
  timestamp: Date;
}

// ============================================================================
// ADAPTER OPERATIONS
// ============================================================================

/**
 * Standard EHR operations
 */
export interface EhrOperations {
  // Patient operations
  getPatient(patientId: string, context: AdapterContext): Promise<AdapterResponse>;
  searchPatients(query: PatientSearchQuery, context: AdapterContext): Promise<AdapterResponse>;
  createPatient(patient: any, context: AdapterContext): Promise<AdapterResponse>;
  updatePatient(patientId: string, patient: any, context: AdapterContext): Promise<AdapterResponse>;

  // Encounter operations
  getEncounter(encounterId: string, context: AdapterContext): Promise<AdapterResponse>;
  searchEncounters(query: EncounterSearchQuery, context: AdapterContext): Promise<AdapterResponse>;

  // Clinical data
  getObservations(patientId: string, query: ObservationQuery, context: AdapterContext): Promise<AdapterResponse>;
  getConditions(patientId: string, context: AdapterContext): Promise<AdapterResponse>;
  getMedications(patientId: string, context: AdapterContext): Promise<AdapterResponse>;
  getAllergies(patientId: string, context: AdapterContext): Promise<AdapterResponse>;

  // Documents
  getDocuments(patientId: string, context: AdapterContext): Promise<AdapterResponse>;
  getDocument(documentId: string, context: AdapterContext): Promise<AdapterResponse>;
}

/**
 * Standard Lab operations
 */
export interface LabOperations {
  createOrder(order: LabOrder, context: AdapterContext): Promise<AdapterResponse>;
  cancelOrder(orderId: string, context: AdapterContext): Promise<AdapterResponse>;
  getOrderStatus(orderId: string, context: AdapterContext): Promise<AdapterResponse>;
  getResults(orderId: string, context: AdapterContext): Promise<AdapterResponse>;
  searchResults(query: LabResultQuery, context: AdapterContext): Promise<AdapterResponse>;
}

/**
 * Standard Pharmacy operations
 */
export interface PharmacyOperations {
  createPrescription(prescription: Prescription, context: AdapterContext): Promise<AdapterResponse>;
  cancelPrescription(prescriptionId: string, context: AdapterContext): Promise<AdapterResponse>;
  getPrescriptionStatus(prescriptionId: string, context: AdapterContext): Promise<AdapterResponse>;
  refillPrescription(prescriptionId: string, context: AdapterContext): Promise<AdapterResponse>;
  searchPharmacies(query: PharmacySearchQuery, context: AdapterContext): Promise<AdapterResponse>;
}

/**
 * Standard Imaging operations
 */
export interface ImagingOperations {
  createStudyOrder(order: ImagingOrder, context: AdapterContext): Promise<AdapterResponse>;
  getStudyStatus(studyId: string, context: AdapterContext): Promise<AdapterResponse>;
  getStudyReport(studyId: string, context: AdapterContext): Promise<AdapterResponse>;
  getStudyImages(studyId: string, context: AdapterContext): Promise<AdapterResponse>;
  searchStudies(query: ImagingSearchQuery, context: AdapterContext): Promise<AdapterResponse>;
}

// ============================================================================
// QUERY TYPES
// ============================================================================

export interface PatientSearchQuery {
  name?: string;
  birthDate?: string;
  identifier?: string;
  phone?: string;
  email?: string;
  address?: string;
  limit?: number;
  offset?: number;
}

export interface EncounterSearchQuery {
  patientId?: string;
  status?: string;
  type?: string;
  date?: string;
  dateRange?: { start: string; end: string };
  limit?: number;
  offset?: number;
}

export interface ObservationQuery {
  category?: string;
  code?: string;
  date?: string;
  dateRange?: { start: string; end: string };
  limit?: number;
}

export interface LabOrder {
  patientId: string;
  providerId: string;
  tests: Array<{ code: string; name: string }>;
  priority?: 'routine' | 'urgent' | 'stat';
  notes?: string;
  specimenType?: string;
  collectionDate?: string;
}

export interface LabResultQuery {
  patientId?: string;
  orderId?: string;
  testCode?: string;
  dateRange?: { start: string; end: string };
  status?: string;
  limit?: number;
}

export interface Prescription {
  patientId: string;
  providerId: string;
  medication: {
    code: string;
    name: string;
    strength?: string;
    form?: string;
  };
  dosage: {
    value: number;
    unit: string;
    frequency: string;
    route: string;
  };
  quantity: number;
  refills: number;
  notes?: string;
  pharmacyId?: string;
}

export interface PharmacySearchQuery {
  zipCode?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  radiusMiles?: number;
  is24Hour?: boolean;
  hasDelivery?: boolean;
  limit?: number;
}

export interface ImagingOrder {
  patientId: string;
  providerId: string;
  procedure: {
    code: string;
    name: string;
    modality: string;
  };
  priority?: 'routine' | 'urgent' | 'stat';
  clinicalHistory?: string;
  notes?: string;
  scheduledDate?: string;
  facilityId?: string;
}

export interface ImagingSearchQuery {
  patientId?: string;
  modality?: string;
  bodyPart?: string;
  dateRange?: { start: string; end: string };
  status?: string;
  limit?: number;
}

// ============================================================================
// ADAPTER REGISTRY
// ============================================================================

/**
 * Adapter registration
 */
export interface AdapterRegistration {
  /** Adapter configuration */
  config: AdapterConfig;

  /** Supported operations */
  operations: string[];

  /** Health check endpoint */
  healthCheckUrl?: string;

  /** Last health check result */
  lastHealthCheck?: {
    timestamp: Date;
    healthy: boolean;
    latencyMs: number;
    error?: string;
  };
}
