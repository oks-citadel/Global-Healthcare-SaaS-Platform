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
export {
  ConversionResult,
  convertPatientR4ToR5,
  convertPractitionerR4ToR5,
  convertOrganizationR4ToR5,
  convertR4ToR5,
  batchConvertR4ToR5,
  convertBundleR4ToR5
} from './conversion/r4-to-r5';

export {
  convertPatientR5ToR4,
  convertPractitionerR5ToR4,
  convertOrganizationR5ToR4,
  convertR5ToR4,
  batchConvertR5ToR4,
  convertBundleR5ToR4
} from './conversion/r5-to-r4';

// Export terminology hooks
export * from './terminology/hooks';

// Export utilities
export * from './utils/export';

// Export C-CDA (Clinical Document Architecture) module
// Provides support for HL7 C-CDA 2.1 documents including parsing, generation,
// and bidirectional mapping to FHIR R4 resources
export * as ccda from './ccda';

// Export X12 EDI transaction support
export * from './x12';

// Export SMART on FHIR authorization support
// Provides SMART App Launch IG 2.0 compliant authorization including
// EHR launch, standalone launch, backend services, and bulk data export
export * as smart from './smart';

// Export DICOM/DICOMweb integration module
// Provides comprehensive DICOM support including DICOMweb client (QIDO-RS, WADO-RS,
// STOW-RS, UPS-RS), FHIR-DICOM bidirectional mapping, Modality Worklist (MWL),
// and MPPS support per DICOM PS3.18 and IHE Radiology profiles
export * as dicom from './dicom';
