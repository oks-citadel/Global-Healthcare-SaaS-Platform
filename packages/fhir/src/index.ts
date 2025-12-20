/**
 * @global-health/fhir
 * FHIR R4 Resource Types, Validation, and Utilities
 */

// Export all type definitions
export * from './types/base';
export * from './types/patient';
export * from './types/practitioner';
export * from './types/organization';
export * from './types/encounter';
export * from './types/appointment';
export * from './types/observation';
export * from './types/condition';
export * from './types/medication-request';
export * from './types/diagnostic-report';
export * from './types/allergy-intolerance';
export * from './types/consent';

// Export validation
export * from './validation/schemas';
export * from './validation/validator';

// Export conversion utilities
export * from './conversion/r4-to-r5';
export * from './conversion/r5-to-r4';

// Export terminology hooks
export * from './terminology/hooks';

// Export utilities
export * from './utils/export';
