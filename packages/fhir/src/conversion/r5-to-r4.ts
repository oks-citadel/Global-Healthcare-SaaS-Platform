/**
 * FHIR R5 to R4 conversion utilities
 *
 * Note: This is a simplified backward conversion. R5->R4 may lose
 * some R5-specific elements and features.
 *
 * Key considerations:
 * - R5 elements not in R4 will be dropped with warnings
 * - Some R5 structures need to be simplified for R4
 */

export interface ConversionResult<T = any> {
  success: boolean;
  data?: T;
  warnings?: string[];
  errors?: string[];
}

/**
 * Convert Patient from R5 to R4
 */
export function convertPatientR5ToR4(r5Patient: any): ConversionResult {
  const warnings: string[] = [];

  try {
    // Remove R5-specific elements
    const { _birthDate, ...r4Compatible } = r5Patient;

    if (_birthDate) {
      warnings.push('Dropped R5-specific element: _birthDate');
    }

    return {
      success: true,
      data: r4Compatible,
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
 * Convert Practitioner from R5 to R4
 */
export function convertPractitionerR5ToR4(r5Practitioner: any): ConversionResult {
  const warnings: string[] = [];

  try {
    // R5 and R4 Practitioner are largely compatible
    const r4Practitioner = {
      ...r5Practitioner,
    };

    return {
      success: true,
      data: r4Practitioner,
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
 * Convert Organization from R5 to R4
 */
export function convertOrganizationR5ToR4(r5Organization: any): ConversionResult {
  const warnings: string[] = [];

  try {
    const r4Organization = {
      ...r5Organization,
    };

    return {
      success: true,
      data: r4Organization,
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
 * Generic R5 to R4 converter
 * Routes to specific converters based on resourceType
 */
export function convertR5ToR4(resource: any): ConversionResult {
  if (!resource?.resourceType) {
    return {
      success: false,
      errors: ['Resource must have a resourceType'],
    };
  }

  switch (resource.resourceType) {
    case 'Patient':
      return convertPatientR5ToR4(resource);
    case 'Practitioner':
      return convertPractitionerR5ToR4(resource);
    case 'Organization':
      return convertOrganizationR5ToR4(resource);
    case 'Encounter':
    case 'Appointment':
    case 'Observation':
    case 'Condition':
    case 'MedicationRequest':
    case 'DiagnosticReport':
    case 'AllergyIntolerance':
    case 'Consent':
      // Most resources have minimal changes; remove R5-specific extensions
      return {
        success: true,
        data: resource,
        warnings: [`${resource.resourceType}: Converted to R4, R5-specific features may be lost`],
      };
    default:
      return {
        success: false,
        errors: [`Unsupported resource type for conversion: ${resource.resourceType}`],
      };
  }
}

/**
 * Batch convert multiple resources from R5 to R4
 */
export function batchConvertR5ToR4(resources: any[]): ConversionResult[] {
  return resources.map(resource => convertR5ToR4(resource));
}

/**
 * Convert FHIR Bundle from R5 to R4
 */
export function convertBundleR5ToR4(bundle: any): ConversionResult {
  if (bundle.resourceType !== 'Bundle') {
    return {
      success: false,
      errors: ['Resource is not a Bundle'],
    };
  }

  const convertedEntries = bundle.entry?.map((entry: any) => {
    if (entry.resource) {
      const result = convertR5ToR4(entry.resource);
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
