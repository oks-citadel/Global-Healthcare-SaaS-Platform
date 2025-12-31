/**
 * SMART on FHIR Scope Utilities
 * Based on SMART App Launch IG 2.0: http://hl7.org/fhir/smart-app-launch/scopes-and-launch-context.html
 */

import {
  SMARTScope,
  SMARTScopeCategory,
  SMARTScopeOperation,
  FHIRResourceType,
  SMARTCapability,
} from './types';

/**
 * Regular expression for SMART 1.0 scope format
 * Examples: patient/Observation.read, user/*.write, system/Patient.*
 */
const SCOPE_V1_REGEX =
  /^(patient|user|system)\/([A-Za-z]+|\*)\.(read|write|\*)$/;

/**
 * Regular expression for SMART 2.0 scope format
 * Examples: patient/Observation.rs, user/*.cruds, system/Patient.c
 */
const SCOPE_V2_REGEX = /^(patient|user|system)\/([A-Za-z]+|\*)\.([cruds]+)$/;

/**
 * Regular expression for launch scopes
 * Examples: launch, launch/patient, launch/encounter
 */
const LAUNCH_SCOPE_REGEX = /^launch(?:\/([a-z]+))?$/;

/**
 * Special/context scopes
 */
const CONTEXT_SCOPES = new Set([
  'openid',
  'fhirUser',
  'profile',
  'offline_access',
  'online_access',
]);

/**
 * Parse a single scope string into a structured SMARTScope object
 */
export function parseScope(scopeString: string): SMARTScope | null {
  const trimmed = scopeString.trim();

  // Check for context scopes
  if (CONTEXT_SCOPES.has(trimmed)) {
    return {
      category: 'launch',
      resourceType: '*',
      launchContext: trimmed,
      raw: trimmed,
    };
  }

  // Check for launch scopes
  const launchMatch = trimmed.match(LAUNCH_SCOPE_REGEX);
  if (launchMatch) {
    return {
      category: 'launch',
      resourceType: '*',
      launchContext: launchMatch[1] || 'ehr',
      raw: trimmed,
    };
  }

  // Check for SMART 2.0 format
  const v2Match = trimmed.match(SCOPE_V2_REGEX);
  if (v2Match) {
    const [, category, resourceType, operations] = v2Match;
    return {
      category: category as SMARTScopeCategory,
      resourceType,
      operations: operations.split('') as SMARTScopeOperation[],
      raw: trimmed,
    };
  }

  // Check for SMART 1.0 format
  const v1Match = trimmed.match(SCOPE_V1_REGEX);
  if (v1Match) {
    const [, category, resourceType, permission] = v1Match;
    return {
      category: category as SMARTScopeCategory,
      resourceType,
      v1Permission: permission as 'read' | 'write' | '*',
      raw: trimmed,
    };
  }

  return null;
}

/**
 * Parse a space-separated scope string into an array of SMARTScope objects
 */
export function parseScopes(scopeString: string): SMARTScope[] {
  const scopes: SMARTScope[] = [];
  const scopeStrings = scopeString.split(/\s+/).filter(Boolean);

  for (const s of scopeStrings) {
    const parsed = parseScope(s);
    if (parsed) {
      scopes.push(parsed);
    }
  }

  return scopes;
}

/**
 * Build a scope string from a structured scope object
 */
export function buildScope(scope: SMARTScope): string {
  // Handle context scopes
  if (scope.category === 'launch' && scope.launchContext) {
    if (CONTEXT_SCOPES.has(scope.launchContext)) {
      return scope.launchContext;
    }
    return scope.launchContext === 'ehr' ? 'launch' : `launch/${scope.launchContext}`;
  }

  // Handle SMART 2.0 format
  if (scope.operations && scope.operations.length > 0) {
    return `${scope.category}/${scope.resourceType}.${scope.operations.join('')}`;
  }

  // Handle SMART 1.0 format
  if (scope.v1Permission) {
    return `${scope.category}/${scope.resourceType}.${scope.v1Permission}`;
  }

  return scope.raw;
}

/**
 * Build a scope string from multiple scope objects
 */
export function buildScopes(scopes: SMARTScope[]): string {
  return scopes.map(buildScope).join(' ');
}

/**
 * Check if a scope grants read access to a resource
 */
export function scopeGrantsRead(scope: SMARTScope): boolean {
  // SMART 2.0
  if (scope.operations) {
    return scope.operations.includes('r') || scope.operations.includes('s');
  }

  // SMART 1.0
  if (scope.v1Permission) {
    return scope.v1Permission === 'read' || scope.v1Permission === '*';
  }

  return false;
}

/**
 * Check if a scope grants write access to a resource
 */
export function scopeGrantsWrite(scope: SMARTScope): boolean {
  // SMART 2.0
  if (scope.operations) {
    return (
      scope.operations.includes('c') ||
      scope.operations.includes('u') ||
      scope.operations.includes('d')
    );
  }

  // SMART 1.0
  if (scope.v1Permission) {
    return scope.v1Permission === 'write' || scope.v1Permission === '*';
  }

  return false;
}

/**
 * Check if a scope grants access to a specific resource type
 */
export function scopeGrantsResourceAccess(
  scope: SMARTScope,
  resourceType: FHIRResourceType
): boolean {
  return scope.resourceType === '*' || scope.resourceType === resourceType;
}

/**
 * Check if scopes grant a specific operation on a resource type
 */
export function checkAccess(
  scopes: SMARTScope[],
  resourceType: FHIRResourceType,
  operation: 'read' | 'write' | 'create' | 'update' | 'delete' | 'search',
  category?: SMARTScopeCategory
): boolean {
  for (const scope of scopes) {
    // Filter by category if specified
    if (category && scope.category !== category) {
      continue;
    }

    // Check resource type
    if (!scopeGrantsResourceAccess(scope, resourceType)) {
      continue;
    }

    // Check operation
    if (scope.operations) {
      // SMART 2.0
      switch (operation) {
        case 'read':
          if (scope.operations.includes('r')) return true;
          break;
        case 'search':
          if (scope.operations.includes('s') || scope.operations.includes('r'))
            return true;
          break;
        case 'create':
          if (scope.operations.includes('c')) return true;
          break;
        case 'update':
          if (scope.operations.includes('u')) return true;
          break;
        case 'delete':
          if (scope.operations.includes('d')) return true;
          break;
        case 'write':
          if (
            scope.operations.includes('c') ||
            scope.operations.includes('u') ||
            scope.operations.includes('d')
          )
            return true;
          break;
      }
    } else if (scope.v1Permission) {
      // SMART 1.0
      switch (operation) {
        case 'read':
        case 'search':
          if (scope.v1Permission === 'read' || scope.v1Permission === '*')
            return true;
          break;
        case 'write':
        case 'create':
        case 'update':
        case 'delete':
          if (scope.v1Permission === 'write' || scope.v1Permission === '*')
            return true;
          break;
      }
    }
  }

  return false;
}

/**
 * Options for building scopes from requirements
 */
export interface ScopeRequirements {
  /** Scope category: patient, user, or system */
  category: SMARTScopeCategory;

  /** Resource types to access */
  resources: Array<{
    type: FHIRResourceType;
    operations: Array<'read' | 'write' | 'create' | 'update' | 'delete' | 'search'>;
  }>;

  /** Use SMART 2.0 format */
  v2Format?: boolean;

  /** Include launch scope */
  launch?: boolean | 'patient' | 'encounter';

  /** Include openid scope */
  openid?: boolean;

  /** Include fhirUser scope */
  fhirUser?: boolean;

  /** Request offline access */
  offlineAccess?: boolean;
}

/**
 * Build scope string from requirements
 */
export function buildScopesFromRequirements(
  requirements: ScopeRequirements
): string {
  const scopes: string[] = [];

  // Add launch scope
  if (requirements.launch) {
    if (requirements.launch === true) {
      scopes.push('launch');
    } else {
      scopes.push(`launch/${requirements.launch}`);
    }
  }

  // Add OpenID Connect scopes
  if (requirements.openid) {
    scopes.push('openid');
  }
  if (requirements.fhirUser) {
    scopes.push('fhirUser');
  }

  // Add offline access
  if (requirements.offlineAccess) {
    scopes.push('offline_access');
  }

  // Add resource scopes
  for (const resource of requirements.resources) {
    if (requirements.v2Format) {
      // SMART 2.0 format
      const ops = new Set<string>();
      for (const op of resource.operations) {
        switch (op) {
          case 'create':
            ops.add('c');
            break;
          case 'read':
            ops.add('r');
            break;
          case 'update':
            ops.add('u');
            break;
          case 'delete':
            ops.add('d');
            break;
          case 'search':
            ops.add('s');
            break;
          case 'write':
            ops.add('c');
            ops.add('u');
            ops.add('d');
            break;
        }
      }
      scopes.push(
        `${requirements.category}/${resource.type}.${Array.from(ops).join('')}`
      );
    } else {
      // SMART 1.0 format
      const hasRead = resource.operations.some((op) =>
        ['read', 'search'].includes(op)
      );
      const hasWrite = resource.operations.some((op) =>
        ['write', 'create', 'update', 'delete'].includes(op)
      );

      if (hasRead && hasWrite) {
        scopes.push(`${requirements.category}/${resource.type}.*`);
      } else if (hasRead) {
        scopes.push(`${requirements.category}/${resource.type}.read`);
      } else if (hasWrite) {
        scopes.push(`${requirements.category}/${resource.type}.write`);
      }
    }
  }

  return scopes.join(' ');
}

/**
 * Validate requested scopes against server capabilities
 */
export function validateScopesAgainstCapabilities(
  requestedScopes: string[],
  supportedScopes: string[],
  capabilities: SMARTCapability[]
): { valid: boolean; unsupported: string[]; errors: string[] } {
  const unsupported: string[] = [];
  const errors: string[] = [];

  // Create a set of supported scopes for faster lookup
  const supportedSet = new Set(supportedScopes);

  // Check if v2 scopes are supported
  const supportsV2 = capabilities.includes('permission-v2');
  const supportsV1 = capabilities.includes('permission-v1') || !supportsV2;

  for (const scope of requestedScopes) {
    // Check if scope is in supported list (if provided)
    if (supportedScopes.length > 0 && !supportedSet.has(scope)) {
      // Check for wildcard support
      const parsed = parseScope(scope);
      if (parsed && parsed.resourceType !== '*') {
        const wildcardScope = `${parsed.category}/*${
          parsed.operations ? '.' + parsed.operations.join('') : ''
        }${parsed.v1Permission ? '.' + parsed.v1Permission : ''}`;
        if (!supportedSet.has(wildcardScope) && !supportedSet.has(scope)) {
          unsupported.push(scope);
        }
      } else if (!supportedSet.has(scope)) {
        unsupported.push(scope);
      }
    }

    // Validate scope format
    const parsed = parseScope(scope);
    if (!parsed && !CONTEXT_SCOPES.has(scope)) {
      errors.push(`Invalid scope format: ${scope}`);
      continue;
    }

    // Check v1/v2 format compatibility
    if (parsed) {
      if (parsed.operations && !supportsV2) {
        errors.push(
          `Server does not support SMART 2.0 scopes: ${scope}. Use v1 format (read/write/*).`
        );
      }
      if (parsed.v1Permission && !supportsV1) {
        errors.push(
          `Server requires SMART 2.0 scopes: ${scope}. Use v2 format (cruds).`
        );
      }
    }

    // Check capability requirements
    if (parsed?.category === 'patient') {
      const hasPatientPermission = capabilities.includes('permission-patient');
      const hasContextPatient =
        capabilities.includes('context-ehr-patient') ||
        capabilities.includes('context-standalone-patient');
      if (!hasPatientPermission && !hasContextPatient) {
        errors.push(
          `Server may not support patient-level scopes: ${scope}`
        );
      }
    }

    if (parsed?.category === 'user') {
      if (!capabilities.includes('permission-user')) {
        errors.push(`Server may not support user-level scopes: ${scope}`);
      }
    }

    if (scope === 'offline_access') {
      if (!capabilities.includes('permission-offline')) {
        errors.push('Server does not support offline_access scope');
      }
    }
  }

  return {
    valid: unsupported.length === 0 && errors.length === 0,
    unsupported,
    errors,
  };
}

/**
 * Convert SMART 1.0 scopes to 2.0 format
 */
export function convertV1ToV2Scope(scope: SMARTScope): SMARTScope {
  if (scope.v1Permission && !scope.operations) {
    const operations: SMARTScopeOperation[] = [];
    switch (scope.v1Permission) {
      case 'read':
        operations.push('r', 's');
        break;
      case 'write':
        operations.push('c', 'u', 'd');
        break;
      case '*':
        operations.push('c', 'r', 'u', 'd', 's');
        break;
    }
    return {
      ...scope,
      operations,
      v1Permission: undefined,
      raw: buildScope({ ...scope, operations, v1Permission: undefined }),
    };
  }
  return scope;
}

/**
 * Convert SMART 2.0 scopes to 1.0 format
 */
export function convertV2ToV1Scope(scope: SMARTScope): SMARTScope {
  if (scope.operations && !scope.v1Permission) {
    const hasRead =
      scope.operations.includes('r') || scope.operations.includes('s');
    const hasWrite =
      scope.operations.includes('c') ||
      scope.operations.includes('u') ||
      scope.operations.includes('d');

    let v1Permission: 'read' | 'write' | '*';
    if (hasRead && hasWrite) {
      v1Permission = '*';
    } else if (hasRead) {
      v1Permission = 'read';
    } else if (hasWrite) {
      v1Permission = 'write';
    } else {
      return scope; // No operations, return as-is
    }

    return {
      ...scope,
      v1Permission,
      operations: undefined,
      raw: buildScope({ ...scope, v1Permission, operations: undefined }),
    };
  }
  return scope;
}

/**
 * Get the effective permissions from a set of scopes for a resource type
 */
export function getEffectivePermissions(
  scopes: SMARTScope[],
  resourceType: FHIRResourceType,
  category?: SMARTScopeCategory
): {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  search: boolean;
} {
  return {
    create: checkAccess(scopes, resourceType, 'create', category),
    read: checkAccess(scopes, resourceType, 'read', category),
    update: checkAccess(scopes, resourceType, 'update', category),
    delete: checkAccess(scopes, resourceType, 'delete', category),
    search: checkAccess(scopes, resourceType, 'search', category),
  };
}

/**
 * Extract patient context requirement from scopes
 */
export function requiresPatientContext(scopes: SMARTScope[]): boolean {
  return scopes.some(
    (scope) =>
      scope.category === 'patient' ||
      (scope.category === 'launch' && scope.launchContext === 'patient')
  );
}

/**
 * Extract encounter context requirement from scopes
 */
export function requiresEncounterContext(scopes: SMARTScope[]): boolean {
  return scopes.some(
    (scope) =>
      scope.category === 'launch' && scope.launchContext === 'encounter'
  );
}

/**
 * Check if scopes request OpenID Connect
 */
export function requestsOpenIDConnect(scopes: SMARTScope[]): boolean {
  return scopes.some(
    (scope) =>
      scope.category === 'launch' && scope.launchContext === 'openid'
  );
}

/**
 * Check if scopes request offline access
 */
export function requestsOfflineAccess(scopes: SMARTScope[]): boolean {
  return scopes.some(
    (scope) =>
      scope.category === 'launch' && scope.launchContext === 'offline_access'
  );
}
