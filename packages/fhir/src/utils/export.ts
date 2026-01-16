/**
 * FHIR Export Utilities
 * Utilities for exporting FHIR resources in various formats
 */

import type { DomainResource } from '../types/base';

export interface ExportOptions {
  pretty?: boolean;
  includeNarrative?: boolean;
  includeExtensions?: boolean;
}

/**
 * Export a FHIR resource as JSON
 */
export function exportAsJSON(
  resource: DomainResource,
  options: ExportOptions = {}
): string {
  const { pretty = true } = options;

  if (pretty) {
    return JSON.stringify(resource, null, 2);
  }

  return JSON.stringify(resource);
}

/**
 * Export multiple resources as a FHIR Bundle
 */
export function exportAsBundle(
  resources: DomainResource[],
  type: 'collection' | 'searchset' | 'transaction' | 'batch' = 'collection',
  options: ExportOptions = {}
): string {
  const bundle = {
    resourceType: 'Bundle',
    type,
    total: resources.length,
    entry: resources.map(resource => ({
      fullUrl: `urn:uuid:${resource.id || generateUUID()}`,
      resource,
    })),
  };

  return exportAsJSON(bundle as any, options);
}

/**
 * Export resource as NDJSON (Newline Delimited JSON)
 * Used for bulk data export
 */
export function exportAsNDJSON(resources: DomainResource[]): string {
  return resources.map(resource => JSON.stringify(resource)).join('\n');
}

/**
 * Create a FHIR Bundle for transaction/batch operations
 */
export function createTransactionBundle(
  operations: Array<{
    method: 'POST' | 'PUT' | 'DELETE' | 'GET' | 'PATCH';
    url: string;
    resource?: DomainResource;
  }>
): any {
  return {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: operations.map(op => ({
      request: {
        method: op.method,
        url: op.url,
      },
      resource: op.resource,
    })),
  };
}

/**
 * Generate a simple UUID (v4)
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Filter resource to include only specified elements
 * Useful for implementing _elements parameter
 */
export function filterElements(
  resource: DomainResource,
  elements: string[]
): Partial<DomainResource> {
  const filtered: any = {
    resourceType: resource.resourceType,
    id: resource.id,
  };

  elements.forEach(element => {
    const parts = element.split('.');
    let source: any = resource;
    let target: any = filtered;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        if (source[part] !== undefined) {
          target[part] = source[part];
        }
      } else {
        if (!source[part]) break;
        if (!target[part]) target[part] = {};
        source = source[part];
        target = target[part];
      }
    }
  });

  return filtered;
}

/**
 * Create a minimal resource (only mandatory fields)
 */
export function createMinimalResource(resource: DomainResource): Partial<DomainResource> {
  const minimal: any = {
    resourceType: resource.resourceType,
  };

  // Add resource-specific mandatory fields
  switch (resource.resourceType) {
    case 'Patient':
      // Patient has no mandatory fields beyond resourceType
      break;
    case 'Observation':
      minimal.status = (resource as any).status;
      minimal.code = (resource as any).code;
      break;
    case 'Condition':
      minimal.subject = (resource as any).subject;
      break;
    // Add more resource-specific logic as needed
  }

  return minimal;
}

/**
 * Export resource summary (useful for search results)
 */
export function exportSummary(resource: DomainResource): Partial<DomainResource> {
  const summary: any = {
    resourceType: resource.resourceType,
    id: resource.id,
    meta: resource.meta,
  };

  // Add resource-specific summary elements
  switch (resource.resourceType) {
    case 'Patient':
      const patient = resource as any;
      summary.identifier = patient.identifier;
      summary.name = patient.name;
      summary.gender = patient.gender;
      summary.birthDate = patient.birthDate;
      break;
    case 'Practitioner':
      const practitioner = resource as any;
      summary.identifier = practitioner.identifier;
      summary.name = practitioner.name;
      break;
    // Add more as needed
  }

  return summary;
}

/**
 * Calculate resource size in bytes
 */
export function getResourceSize(resource: DomainResource): number {
  return new Blob([JSON.stringify(resource)]).size;
}

/**
 * Split large bundle into smaller chunks
 */
export function splitBundle(
  bundle: any,
  maxEntriesPerBundle: number = 100
): any[] {
  if (bundle.resourceType !== 'Bundle' || !bundle.entry) {
    throw new Error('Invalid bundle');
  }

  const chunks: any[] = [];
  const entries = bundle.entry;

  for (let i = 0; i < entries.length; i += maxEntriesPerBundle) {
    chunks.push({
      ...bundle,
      entry: entries.slice(i, i + maxEntriesPerBundle),
      total: Math.min(maxEntriesPerBundle, entries.length - i),
    });
  }

  return chunks;
}
