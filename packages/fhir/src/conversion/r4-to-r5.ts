/**
 * FHIR R4 to R5 conversion utilities
 *
 * Note: This is a simplified mapping. Full R4->R5 conversion requires
 * handling breaking changes and new required fields.
 *
 * Key differences between R4 and R5:
 * - CodeableConcept simplified in some resources
 * - New resources and elements added
 * - Some elements renamed or restructured
 */

import type { Patient } from '../types/patient';
import type { Practitioner } from '../types/practitioner';
import type { Organization } from '../types/organization';

export interface ConversionResult<T = any> {
  success: boolean;
  data?: T;
  warnings?: string[];
  errors?: string[];
}

/**
 * Convert Patient from R4 to R5
 */
export function convertPatientR4ToR5(r4Patient: Patient): ConversionResult {
  const warnings: string[] = [];

  try {
    // R5 Patient is largely compatible with R4
    // Main changes: added elements, no breaking changes to existing elements
    const r5Patient = {
      ...r4Patient,
      // R5 additions (set defaults)
      _birthDate: r4Patient.birthDate ? undefined : undefined,
    };

    return {
      success: true,
      data: r5Patient,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Convert Practitioner from R4 to R5
 */
export function convertPractitionerR4ToR5(r4Practitioner: Practitioner): ConversionResult {
  const warnings: string[] = [];

  try {
    // R5 Practitioner is largely compatible with R4
    const r5Practitioner = {
      ...r4Practitioner,
    };

    return {
      success: true,
      data: r5Practitioner,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Convert Organization from R4 to R5
 */
export function convertOrganizationR4ToR5(r4Organization: Organization): ConversionResult {
  const warnings: string[] = [];

  try {
    // R5 Organization has some changes
    const r5Organization = {
      ...r4Organization,
      // R5 changed 'contact' structure slightly
    };

    return {
      success: true,
      data: r5Organization,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Generic R4 to R5 converter
 * Routes to specific converters based on resourceType
 */
export function convertR4ToR5(resource: any): ConversionResult {
  if (!resource?.resourceType) {
    return {
      success: false,
      errors: ['Resource must have a resourceType'],
    };
  }

  switch (resource.resourceType) {
    case 'Patient':
      return convertPatientR4ToR5(resource);
    case 'Practitioner':
      return convertPractitionerR4ToR5(resource);
    case 'Organization':
      return convertOrganizationR4ToR5(resource);
    case 'Encounter':
    case 'Appointment':
    case 'Observation':
    case 'Condition':
    case 'MedicationRequest':
    case 'DiagnosticReport':
    case 'AllergyIntolerance':
    case 'Consent':
      // Most resources have minimal changes between R4 and R5
      return {
        success: true,
        data: resource,
        warnings: [`${resource.resourceType}: Using R4 structure, manual review recommended for R5 compliance`],
      };
    default:
      return {
        success: false,
        errors: [`Unsupported resource type for conversion: ${resource.resourceType}`],
      };
  }
}

/**
 * Batch convert multiple resources from R4 to R5
 */
export function batchConvertR4ToR5(resources: any[]): ConversionResult[] {
  return resources.map(resource => convertR4ToR5(resource));
}

/**
 * Convert FHIR Bundle from R4 to R5
 */
export function convertBundleR4ToR5(bundle: any): ConversionResult {
  if (bundle.resourceType !== 'Bundle') {
    return {
      success: false,
      errors: ['Resource is not a Bundle'],
    };
  }

  const convertedEntries = bundle.entry?.map((entry: any) => {
    if (entry.resource) {
      const result = convertR4ToR5(entry.resource);
      return {
        ...entry,
        resource: result.data,
      };
    }
    return entry;
  });

  return {
    success: true,
    data: {
      ...bundle,
      entry: convertedEntries,
    },
  };
}
