/**
 * SMART on FHIR Authorization Types
 * Based on SMART App Launch IG 2.0: http://hl7.org/fhir/smart-app-launch/
 */

/**
 * SMART on FHIR Well-Known Configuration
 * Discovered from {fhir-base}/.well-known/smart-configuration
 */
export interface SMARTConfiguration {
  /** REQUIRED: URL to the OAuth2 authorization endpoint */
  authorization_endpoint: string;

  /** REQUIRED: URL to the OAuth2 token endpoint */
  token_endpoint: string;

  /** OPTIONAL: URL to the OAuth2 dynamic client registration endpoint */
  registration_endpoint?: string;

  /** OPTIONAL: URL to the OAuth2 token introspection endpoint */
  introspection_endpoint?: string;

  /** OPTIONAL: URL to the OAuth2 token revocation endpoint */
  revocation_endpoint?: string;

  /** OPTIONAL: URL where to manage client authorizations */
  management_endpoint?: string;

  /** OPTIONAL: URL to OAuth2 userinfo endpoint */
  userinfo_endpoint?: string;

  /** OPTIONAL: URL to JWKS containing server's public keys */
  jwks_uri?: string;

  /** OPTIONAL: FHIR Resource Server's FHIR Base URL */
  issuer?: string;

  /** REQUIRED: Array of grant types supported */
  grant_types_supported?: SMARTGrantType[];

  /** REQUIRED: Array of scopes a client may request */
  scopes_supported?: string[];

  /** REQUIRED: Array of response types supported */
  response_types_supported?: SMARTResponseType[];

  /** OPTIONAL: Array of PKCE code challenge methods supported */
  code_challenge_methods_supported?: ('plain' | 'S256')[];

  /** REQUIRED: Array of strings representing SMART capabilities */
  capabilities: SMARTCapability[];

  /** OPTIONAL: Supported token endpoint authentication methods */
  token_endpoint_auth_methods_supported?: SMARTTokenEndpointAuthMethod[];

  /** OPTIONAL: Supported token endpoint signing algorithms */
  token_endpoint_auth_signing_alg_values_supported?: string[];
}

/**
 * SMART Grant Types
 */
export type SMARTGrantType =
  | 'authorization_code'
  | 'client_credentials'
  | 'refresh_token';

/**
 * SMART Response Types
 */
export type SMARTResponseType = 'code' | 'token';

/**
 * SMART Token Endpoint Authentication Methods
 */
export type SMARTTokenEndpointAuthMethod =
  | 'client_secret_basic'
  | 'client_secret_post'
  | 'private_key_jwt';

/**
 * SMART Capabilities as defined in SMART App Launch IG 2.0
 */
export type SMARTCapability =
  // Launch modes
  | 'launch-ehr'
  | 'launch-standalone'
  // Authorization modes
  | 'authorize-post'
  // Client types
  | 'client-public'
  | 'client-confidential-symmetric'
  | 'client-confidential-asymmetric'
  // SSO
  | 'sso-openid-connect'
  // Launch context
  | 'context-passthrough-banner'
  | 'context-passthrough-style'
  | 'context-ehr-patient'
  | 'context-ehr-encounter'
  | 'context-standalone-patient'
  | 'context-standalone-encounter'
  // Permissions
  | 'permission-offline'
  | 'permission-online'
  | 'permission-patient'
  | 'permission-user'
  | 'permission-v1'
  | 'permission-v2'
  // PKCE
  | 'pkce-required';

/**
 * SMART Scope Categories
 */
export type SMARTScopeCategory = 'patient' | 'user' | 'system' | 'launch';

/**
 * SMART Scope Operations (SMART 2.0 granular scopes)
 */
export type SMARTScopeOperation = 'c' | 'r' | 'u' | 'd' | 's';

/**
 * Structured representation of a SMART scope
 */
export interface SMARTScope {
  /** The scope category: patient, user, system, or launch */
  category: SMARTScopeCategory;

  /** The FHIR resource type (e.g., 'Patient', 'Observation', '*') */
  resourceType: string;

  /** The operations granted (SMART 2.0: 'cruds' or subset) */
  operations?: SMARTScopeOperation[];

  /** For v1 scopes: 'read' or 'write' or '*' */
  v1Permission?: 'read' | 'write' | '*';

  /** For launch scopes: the launch context type */
  launchContext?: string;

  /** The original scope string */
  raw: string;
}

/**
 * SMART Launch Context returned after authorization
 */
export interface SMARTContext {
  /** Patient ID in context (if patient scope granted) */
  patient?: string;

  /** Encounter ID in context (if encounter scope granted) */
  encounter?: string;

  /** FHIR User reference (e.g., 'Practitioner/123') */
  fhirUser?: string;

  /** Need patient banner (EHR launch) */
  need_patient_banner?: boolean;

  /** Smart style URL (EHR launch) */
  smart_style_url?: string;

  /** Tenant identifier for multi-tenant systems */
  tenant?: string;

  /** Intent (for deep linking) */
  intent?: string;

  /** Additional context parameters */
  [key: string]: unknown;
}

/**
 * SMART Token Response
 */
export interface SMARTToken {
  /** The access token issued by the authorization server */
  access_token: string;

  /** The type of the token issued (typically 'Bearer') */
  token_type: 'Bearer' | string;

  /** The lifetime in seconds of the access token */
  expires_in: number;

  /** The scope of the access token */
  scope: string;

  /** Patient ID in context (if patient scope granted) */
  patient?: string;

  /** Encounter ID in context (if encounter scope granted) */
  encounter?: string;

  /** ID token for OpenID Connect flows */
  id_token?: string;

  /** Refresh token for offline access */
  refresh_token?: string;

  /** FHIR User reference */
  fhirUser?: string;

  /** Need patient banner flag */
  need_patient_banner?: boolean;

  /** Smart style URL */
  smart_style_url?: string;

  /** Tenant identifier */
  tenant?: string;

  /** Timestamp when token was obtained */
  obtained_at?: number;

  /** Additional token response fields */
  [key: string]: unknown;
}

/**
 * SMART Launch Parameters (received on EHR launch)
 */
export interface SMARTLaunchParams {
  /** Opaque launch context identifier */
  launch: string;

  /** FHIR server issuer URL */
  iss: string;

  /** Intended audience (FHIR server base URL) */
  aud?: string;
}

/**
 * SMART Authorization Request Parameters
 */
export interface SMARTAuthorizationRequest {
  /** OAuth2 response type (always 'code' for SMART) */
  response_type: 'code';

  /** Client identifier */
  client_id: string;

  /** Redirect URI after authorization */
  redirect_uri: string;

  /** Requested scopes */
  scope: string;

  /** State parameter for CSRF protection */
  state: string;

  /** FHIR server base URL */
  aud: string;

  /** Launch context (for EHR launch) */
  launch?: string;

  /** PKCE code challenge */
  code_challenge?: string;

  /** PKCE code challenge method */
  code_challenge_method?: 'S256' | 'plain';
}

/**
 * SMART Authorization Response
 */
export interface SMARTAuthorizationResponse {
  /** Authorization code */
  code: string;

  /** State parameter (must match request) */
  state: string;
}

/**
 * SMART Token Request Parameters
 */
export interface SMARTTokenRequest {
  /** Grant type */
  grant_type: 'authorization_code' | 'refresh_token' | 'client_credentials';

  /** Authorization code (for authorization_code grant) */
  code?: string;

  /** Redirect URI (must match authorization request) */
  redirect_uri?: string;

  /** PKCE code verifier */
  code_verifier?: string;

  /** Refresh token (for refresh_token grant) */
  refresh_token?: string;

  /** Requested scope (for refresh) */
  scope?: string;

  /** Client ID (for public clients) */
  client_id?: string;

  /** Client assertion (for private_key_jwt) */
  client_assertion?: string;

  /** Client assertion type */
  client_assertion_type?: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';
}

/**
 * SMART Client Configuration
 */
export interface SMARTClientConfig {
  /** FHIR server base URL */
  fhirBaseUrl: string;

  /** Client identifier */
  clientId: string;

  /** Client secret (for confidential clients) */
  clientSecret?: string;

  /** Redirect URI for authorization callback */
  redirectUri: string;

  /** Scopes to request */
  scope: string;

  /** Private key for JWT authentication (PEM format) */
  privateKey?: string;

  /** Private key ID (kid) for JWT authentication */
  privateKeyId?: string;

  /** Token endpoint authentication method */
  tokenEndpointAuthMethod?: SMARTTokenEndpointAuthMethod;

  /** Custom state generator */
  stateGenerator?: () => string;

  /** Storage adapter for PKCE and state */
  storage?: SMARTStorage;
}

/**
 * Storage interface for SMART client state
 */
export interface SMARTStorage {
  /** Store a value */
  set(key: string, value: string): Promise<void>;

  /** Retrieve a value */
  get(key: string): Promise<string | null>;

  /** Remove a value */
  remove(key: string): Promise<void>;
}

/**
 * SMART Client Interface
 */
export interface ISMARTClient {
  /** Get the SMART configuration */
  getConfiguration(): Promise<SMARTConfiguration>;

  /** Generate authorization URL for EHR launch */
  authorizeEHRLaunch(launchParams: SMARTLaunchParams): Promise<string>;

  /** Generate authorization URL for standalone launch */
  authorizeStandalone(patientId?: string): Promise<string>;

  /** Handle authorization callback */
  handleCallback(callbackUrl: string): Promise<SMARTToken>;

  /** Exchange authorization code for tokens */
  exchangeCodeForToken(
    code: string,
    codeVerifier?: string
  ): Promise<SMARTToken>;

  /** Refresh an access token */
  refreshToken(refreshToken: string): Promise<SMARTToken>;

  /** Get current token */
  getToken(): SMARTToken | null;

  /** Get launch context */
  getContext(): SMARTContext;

  /** Check if a scope is granted */
  hasScope(scope: string): boolean;

  /** Make authenticated FHIR request */
  request<T>(path: string, options?: RequestInit): Promise<T>;
}

/**
 * Backend Services Client Configuration
 */
export interface BackendServicesConfig {
  /** FHIR server base URL */
  fhirBaseUrl: string;

  /** Client identifier */
  clientId: string;

  /** Private key for JWT signing (PEM format) */
  privateKey: string;

  /** Private key ID (kid) for JWKS lookup */
  privateKeyId: string;

  /** Scopes to request */
  scope: string;

  /** JWT signing algorithm (default: RS384) */
  algorithm?: 'RS384' | 'ES384';

  /** Token lifetime in seconds (default: 300) */
  tokenLifetime?: number;
}

/**
 * JWT Claims for Backend Services Authentication
 */
export interface BackendServicesJWTClaims {
  /** Issuer (client_id) */
  iss: string;

  /** Subject (client_id) */
  sub: string;

  /** Audience (token endpoint) */
  aud: string;

  /** JWT ID (unique identifier) */
  jti: string;

  /** Expiration time */
  exp: number;

  /** Issued at time */
  iat: number;
}

/**
 * ID Token Claims (OpenID Connect)
 */
export interface SMARTIdTokenClaims {
  /** Issuer */
  iss: string;

  /** Subject (user identifier) */
  sub: string;

  /** Audience (client_id) */
  aud: string | string[];

  /** Expiration time */
  exp: number;

  /** Issued at time */
  iat: number;

  /** Auth time */
  auth_time?: number;

  /** Nonce */
  nonce?: string;

  /** FHIR User reference */
  fhirUser?: string;

  /** Profile URL */
  profile?: string;

  /** Additional claims */
  [key: string]: unknown;
}

/**
 * Error response from SMART authorization server
 */
export interface SMARTError {
  /** Error code */
  error: SMARTErrorCode;

  /** Human-readable error description */
  error_description?: string;

  /** URI for additional error information */
  error_uri?: string;

  /** State parameter (if applicable) */
  state?: string;
}

/**
 * SMART Error Codes
 */
export type SMARTErrorCode =
  | 'invalid_request'
  | 'unauthorized_client'
  | 'access_denied'
  | 'unsupported_response_type'
  | 'invalid_scope'
  | 'server_error'
  | 'temporarily_unavailable'
  | 'invalid_grant'
  | 'invalid_client'
  | 'unsupported_grant_type';

/**
 * FHIR Resource Types (common subset for SMART scopes)
 */
export type FHIRResourceType =
  | 'Patient'
  | 'Practitioner'
  | 'PractitionerRole'
  | 'Organization'
  | 'Encounter'
  | 'Observation'
  | 'Condition'
  | 'Procedure'
  | 'MedicationRequest'
  | 'MedicationStatement'
  | 'MedicationAdministration'
  | 'DiagnosticReport'
  | 'DocumentReference'
  | 'ImagingStudy'
  | 'AllergyIntolerance'
  | 'Immunization'
  | 'CarePlan'
  | 'CareTeam'
  | 'Goal'
  | 'ServiceRequest'
  | 'Appointment'
  | 'Consent'
  | 'Coverage'
  | 'Claim'
  | 'ExplanationOfBenefit'
  | 'Device'
  | 'DeviceUseStatement'
  | 'List'
  | 'Bundle'
  | 'Binary'
  | string; // Allow any FHIR resource type
