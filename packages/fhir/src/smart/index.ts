/**
 * SMART on FHIR Authorization Support
 * Implements SMART App Launch IG 2.0: http://hl7.org/fhir/smart-app-launch/
 *
 * This module provides comprehensive SMART on FHIR authorization support including:
 * - EHR Launch flow
 * - Standalone Launch flow
 * - Backend Services (system-to-system) authorization
 * - PKCE support
 * - Scope parsing and validation (SMART 1.0 and 2.0 formats)
 * - CapabilityStatement parsing for SMART capabilities
 * - Bulk Data Export client
 */

// Export all types
export type {
  // Configuration types
  SMARTConfiguration,
  SMARTCapability,
  SMARTGrantType,
  SMARTResponseType,
  SMARTTokenEndpointAuthMethod,

  // Scope types
  SMARTScope,
  SMARTScopeCategory,
  SMARTScopeOperation,

  // Context and token types
  SMARTContext,
  SMARTToken,
  SMARTLaunchParams,

  // Request/response types
  SMARTAuthorizationRequest,
  SMARTAuthorizationResponse,
  SMARTTokenRequest,

  // Error types
  SMARTError,
  SMARTErrorCode,

  // Client configuration
  SMARTClientConfig,
  SMARTStorage,
  ISMARTClient,

  // Backend services
  BackendServicesConfig,
  BackendServicesJWTClaims,

  // OIDC
  SMARTIdTokenClaims,

  // FHIR types
  FHIRResourceType,
} from './types';

// Export client
export {
  SMARTClient,
  createSMARTClient,
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  parseLaunchParams,
  isEHRLaunch,
} from './client';

// Export scope utilities
export {
  parseScope,
  parseScopes,
  buildScope,
  buildScopes,
  scopeGrantsRead,
  scopeGrantsWrite,
  scopeGrantsResourceAccess,
  checkAccess,
  buildScopesFromRequirements,
  validateScopesAgainstCapabilities,
  convertV1ToV2Scope,
  convertV2ToV1Scope,
  getEffectivePermissions,
  requiresPatientContext,
  requiresEncounterContext,
  requestsOpenIDConnect,
  requestsOfflineAccess,
} from './scopes';

export type { ScopeRequirements } from './scopes';

// Export capability utilities
export {
  SMART_EXTENSION_URLS,
  SMART_SECURITY_SERVICE,
  extractOAuthURIs,
  extractCapabilitiesFromCapabilityStatement,
  supportsSMARTonFHIR,
  extractSupportedResources,
  validateClientAgainstServer,
  buildScopesFromCapabilityStatement,
  fetchCapabilityStatement,
  supportsInteraction,
  getSearchParameters,
} from './capability';

export type {
  CapabilityStatement,
  CapabilityStatementRest,
  CapabilityStatementSecurity,
  SMARTClientCapabilities,
  CapabilityValidationResult,
} from './capability';

// Export backend services
export {
  BackendServicesClient,
  createBackendServicesClient,
  createClientAssertionJWT,
  BulkDataClient,
  createBulkDataClient,
} from './backend-services';

export type {
  BulkDataExportParams,
  BulkDataExportStatus,
} from './backend-services';
