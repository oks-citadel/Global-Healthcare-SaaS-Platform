/**
 * SMART on FHIR CapabilityStatement Utilities
 * Parse and validate FHIR CapabilityStatement for SMART capabilities
 */

import {
  SMARTConfiguration,
  SMARTCapability,
  SMARTTokenEndpointAuthMethod,
  SMARTGrantType,
} from './types';

/**
 * Extension URLs for SMART capabilities in CapabilityStatement
 */
export const SMART_EXTENSION_URLS = {
  /** OAuth URIs extension */
  OAUTH_URIS: 'http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris',

  /** Authorization endpoint extension */
  AUTHORIZE: 'authorize',

  /** Token endpoint extension */
  TOKEN: 'token',

  /** Registration endpoint extension */
  REGISTER: 'register',

  /** Management endpoint extension */
  MANAGE: 'manage',

  /** Introspection endpoint extension */
  INTROSPECT: 'introspect',

  /** Revocation endpoint extension */
  REVOKE: 'revoke',

  /** SMART capabilities extension (deprecated in favor of .well-known) */
  CAPABILITIES:
    'http://fhir-registry.smarthealthit.org/StructureDefinition/capabilities',
} as const;

/**
 * Security service coding for SMART
 */
export const SMART_SECURITY_SERVICE = {
  system: 'http://terminology.hl7.org/CodeSystem/restful-security-service',
  code: 'SMART-on-FHIR',
  display: 'SMART on FHIR',
} as const;

/**
 * Simplified CapabilityStatement structure for SMART extraction
 */
export interface CapabilityStatementSecurity {
  extension?: Array<{
    url: string;
    extension?: Array<{
      url: string;
      valueUri?: string;
      valueCode?: string;
    }>;
    valueCode?: string;
  }>;
  service?: Array<{
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  }>;
}

export interface CapabilityStatementRest {
  mode: 'server' | 'client';
  security?: CapabilityStatementSecurity;
  resource?: Array<{
    type: string;
    interaction?: Array<{
      code: string;
    }>;
    searchParam?: Array<{
      name: string;
      type: string;
    }>;
  }>;
}

export interface CapabilityStatement {
  resourceType: 'CapabilityStatement';
  id?: string;
  status: 'draft' | 'active' | 'retired' | 'unknown';
  kind: 'instance' | 'capability' | 'requirements';
  fhirVersion: string;
  format: string[];
  rest?: CapabilityStatementRest[];
  implementation?: {
    description?: string;
    url?: string;
  };
}

/**
 * Extract SMART OAuth URIs from CapabilityStatement security extension
 */
export function extractOAuthURIs(
  capabilityStatement: CapabilityStatement
): Partial<SMARTConfiguration> {
  const config: Partial<SMARTConfiguration> = {};
  const serverRest = capabilityStatement.rest?.find((r) => r.mode === 'server');

  if (!serverRest?.security?.extension) {
    return config;
  }

  for (const ext of serverRest.security.extension) {
    if (ext.url === SMART_EXTENSION_URLS.OAUTH_URIS && ext.extension) {
      for (const inner of ext.extension) {
        switch (inner.url) {
          case SMART_EXTENSION_URLS.AUTHORIZE:
            if (inner.valueUri) config.authorization_endpoint = inner.valueUri;
            break;
          case SMART_EXTENSION_URLS.TOKEN:
            if (inner.valueUri) config.token_endpoint = inner.valueUri;
            break;
          case SMART_EXTENSION_URLS.REGISTER:
            if (inner.valueUri) config.registration_endpoint = inner.valueUri;
            break;
          case SMART_EXTENSION_URLS.MANAGE:
            if (inner.valueUri) config.management_endpoint = inner.valueUri;
            break;
          case SMART_EXTENSION_URLS.INTROSPECT:
            if (inner.valueUri) config.introspection_endpoint = inner.valueUri;
            break;
          case SMART_EXTENSION_URLS.REVOKE:
            if (inner.valueUri) config.revocation_endpoint = inner.valueUri;
            break;
        }
      }
    }
  }

  return config;
}

/**
 * Extract SMART capabilities from CapabilityStatement (deprecated method)
 * Modern servers should use .well-known/smart-configuration instead
 */
export function extractCapabilitiesFromCapabilityStatement(
  capabilityStatement: CapabilityStatement
): SMARTCapability[] {
  const capabilities: SMARTCapability[] = [];
  const serverRest = capabilityStatement.rest?.find((r) => r.mode === 'server');

  if (!serverRest?.security?.extension) {
    return capabilities;
  }

  for (const ext of serverRest.security.extension) {
    if (ext.url === SMART_EXTENSION_URLS.CAPABILITIES && ext.valueCode) {
      capabilities.push(ext.valueCode as SMARTCapability);
    }
  }

  return capabilities;
}

/**
 * Check if CapabilityStatement indicates SMART on FHIR support
 */
export function supportsSMARTonFHIR(
  capabilityStatement: CapabilityStatement
): boolean {
  const serverRest = capabilityStatement.rest?.find((r) => r.mode === 'server');

  if (!serverRest?.security?.service) {
    return false;
  }

  return serverRest.security.service.some((service) =>
    service.coding?.some(
      (coding) =>
        coding.system === SMART_SECURITY_SERVICE.system &&
        coding.code === SMART_SECURITY_SERVICE.code
    )
  );
}

/**
 * Extract supported resource types from CapabilityStatement
 */
export function extractSupportedResources(
  capabilityStatement: CapabilityStatement
): Map<string, Set<string>> {
  const resources = new Map<string, Set<string>>();
  const serverRest = capabilityStatement.rest?.find((r) => r.mode === 'server');

  if (!serverRest?.resource) {
    return resources;
  }

  for (const resource of serverRest.resource) {
    const interactions = new Set<string>();

    if (resource.interaction) {
      for (const interaction of resource.interaction) {
        interactions.add(interaction.code);
      }
    }

    resources.set(resource.type, interactions);
  }

  return resources;
}

/**
 * Client capabilities required for SMART authorization
 */
export interface SMARTClientCapabilities {
  /** Client type */
  clientType: 'public' | 'confidential-symmetric' | 'confidential-asymmetric';

  /** Supported grant types */
  grantTypes: SMARTGrantType[];

  /** Token endpoint auth method */
  tokenEndpointAuthMethod: SMARTTokenEndpointAuthMethod;

  /** Supports PKCE */
  supportsPKCE: boolean;

  /** Requested scopes */
  requestedScopes: string[];

  /** Launch mode */
  launchMode: 'ehr' | 'standalone' | 'both';
}

/**
 * Validation result for client against server capabilities
 */
export interface CapabilityValidationResult {
  /** Whether client is compatible with server */
  compatible: boolean;

  /** List of issues found */
  issues: string[];

  /** List of warnings (non-blocking) */
  warnings: string[];

  /** Required capabilities that are missing */
  missingCapabilities: SMARTCapability[];
}

/**
 * Validate client capabilities against server SMART configuration
 */
export function validateClientAgainstServer(
  clientCapabilities: SMARTClientCapabilities,
  serverConfig: SMARTConfiguration
): CapabilityValidationResult {
  const result: CapabilityValidationResult = {
    compatible: true,
    issues: [],
    warnings: [],
    missingCapabilities: [],
  };

  const serverCapabilities = new Set(serverConfig.capabilities);

  // Check client type support
  const clientTypeCapability = `client-${clientCapabilities.clientType}` as SMARTCapability;
  if (!serverCapabilities.has(clientTypeCapability)) {
    result.compatible = false;
    result.issues.push(
      `Server does not support client type: ${clientCapabilities.clientType}`
    );
    result.missingCapabilities.push(clientTypeCapability);
  }

  // Check launch mode support
  if (
    clientCapabilities.launchMode === 'ehr' ||
    clientCapabilities.launchMode === 'both'
  ) {
    if (!serverCapabilities.has('launch-ehr')) {
      result.compatible = false;
      result.issues.push('Server does not support EHR launch');
      result.missingCapabilities.push('launch-ehr');
    }
  }

  if (
    clientCapabilities.launchMode === 'standalone' ||
    clientCapabilities.launchMode === 'both'
  ) {
    if (!serverCapabilities.has('launch-standalone')) {
      result.compatible = false;
      result.issues.push('Server does not support standalone launch');
      result.missingCapabilities.push('launch-standalone');
    }
  }

  // Check grant type support
  if (serverConfig.grant_types_supported) {
    for (const grantType of clientCapabilities.grantTypes) {
      if (!serverConfig.grant_types_supported.includes(grantType)) {
        result.compatible = false;
        result.issues.push(`Server does not support grant type: ${grantType}`);
      }
    }
  }

  // Check PKCE support
  if (clientCapabilities.supportsPKCE) {
    if (
      !serverConfig.code_challenge_methods_supported?.includes('S256')
    ) {
      result.warnings.push(
        'Server may not support PKCE with S256. Client should handle gracefully.'
      );
    }
  }

  // Check if PKCE is required
  if (
    serverCapabilities.has('pkce-required') &&
    !clientCapabilities.supportsPKCE
  ) {
    result.compatible = false;
    result.issues.push('Server requires PKCE but client does not support it');
  }

  // Check token endpoint auth method
  if (serverConfig.token_endpoint_auth_methods_supported) {
    if (
      !serverConfig.token_endpoint_auth_methods_supported.includes(
        clientCapabilities.tokenEndpointAuthMethod
      )
    ) {
      result.compatible = false;
      result.issues.push(
        `Server does not support token endpoint auth method: ${clientCapabilities.tokenEndpointAuthMethod}`
      );
    }
  }

  // Check scope support
  if (serverConfig.scopes_supported) {
    const supportedScopeSet = new Set(serverConfig.scopes_supported);
    for (const scope of clientCapabilities.requestedScopes) {
      if (!supportedScopeSet.has(scope)) {
        // Check if wildcard is supported
        const parts = scope.split('/');
        if (parts.length === 2) {
          const [category, rest] = parts;
          const wildcardScope = `${category}/*${rest.includes('.') ? rest.substring(rest.indexOf('.')) : ''}`;
          if (!supportedScopeSet.has(wildcardScope)) {
            result.warnings.push(
              `Scope may not be supported: ${scope}. Server will determine actual granted scopes.`
            );
          }
        }
      }
    }
  }

  // Check offline access
  if (clientCapabilities.requestedScopes.includes('offline_access')) {
    if (!serverCapabilities.has('permission-offline')) {
      result.issues.push(
        'Client requests offline_access but server does not support it'
      );
      result.missingCapabilities.push('permission-offline');
    }
  }

  return result;
}

/**
 * Build required scopes based on CapabilityStatement resources
 */
export function buildScopesFromCapabilityStatement(
  capabilityStatement: CapabilityStatement,
  options: {
    category: 'patient' | 'user' | 'system';
    v2Format?: boolean;
    resourceTypes?: string[];
  }
): string[] {
  const scopes: string[] = [];
  const resources = extractSupportedResources(capabilityStatement);

  for (const [resourceType, interactions] of resources) {
    // Filter by requested resource types if specified
    if (
      options.resourceTypes &&
      !options.resourceTypes.includes(resourceType)
    ) {
      continue;
    }

    if (options.v2Format) {
      // SMART 2.0 format
      const ops: string[] = [];
      if (interactions.has('create')) ops.push('c');
      if (interactions.has('read')) ops.push('r');
      if (interactions.has('update')) ops.push('u');
      if (interactions.has('delete')) ops.push('d');
      if (
        interactions.has('search-type') ||
        interactions.has('search-system')
      ) {
        ops.push('s');
      }

      if (ops.length > 0) {
        scopes.push(`${options.category}/${resourceType}.${ops.join('')}`);
      }
    } else {
      // SMART 1.0 format
      const hasRead =
        interactions.has('read') ||
        interactions.has('vread') ||
        interactions.has('search-type') ||
        interactions.has('search-system');
      const hasWrite =
        interactions.has('create') ||
        interactions.has('update') ||
        interactions.has('patch') ||
        interactions.has('delete');

      if (hasRead && hasWrite) {
        scopes.push(`${options.category}/${resourceType}.*`);
      } else if (hasRead) {
        scopes.push(`${options.category}/${resourceType}.read`);
      } else if (hasWrite) {
        scopes.push(`${options.category}/${resourceType}.write`);
      }
    }
  }

  return scopes;
}

/**
 * Fetch and parse CapabilityStatement from FHIR server
 */
export async function fetchCapabilityStatement(
  fhirBaseUrl: string,
  options?: RequestInit
): Promise<CapabilityStatement> {
  const url = new URL('/metadata', fhirBaseUrl).toString();

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/fhir+json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CapabilityStatement: ${response.status} ${response.statusText}`
    );
  }

  const capability = (await response.json()) as CapabilityStatement;

  if (capability.resourceType !== 'CapabilityStatement') {
    throw new Error(
      `Expected CapabilityStatement but got ${capability.resourceType}`
    );
  }

  return capability;
}

/**
 * Check if server supports specific FHIR interactions for a resource
 */
export function supportsInteraction(
  capabilityStatement: CapabilityStatement,
  resourceType: string,
  interaction: string
): boolean {
  const resources = extractSupportedResources(capabilityStatement);
  const resourceInteractions = resources.get(resourceType);

  return resourceInteractions?.has(interaction) ?? false;
}

/**
 * Get all searchable parameters for a resource type
 */
export function getSearchParameters(
  capabilityStatement: CapabilityStatement,
  resourceType: string
): Array<{ name: string; type: string }> {
  const serverRest = capabilityStatement.rest?.find((r) => r.mode === 'server');
  const resource = serverRest?.resource?.find((r) => r.type === resourceType);

  return resource?.searchParam ?? [];
}
