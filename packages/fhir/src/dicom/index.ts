/**
 * DICOM/DICOMweb Integration Module
 *
 * Provides comprehensive DICOM support including:
 * - DICOMweb client (QIDO-RS, WADO-RS, STOW-RS, UPS-RS)
 * - FHIR-DICOM bidirectional mapping
 * - Modality Worklist (MWL) support
 * - MPPS (Modality Performed Procedure Step) support
 * - DICOM tag definitions and utilities
 *
 * Standards compliance:
 * - DICOM PS3.18 (Web Services)
 * - DICOM PS3.4 (Service Class Specifications)
 * - DICOM PS3.6 (Data Dictionary)
 * - IHE Radiology Technical Framework
 * - HL7 FHIR R4
 *
 * @packageDocumentation
 */

// ============================================================================
// Type Exports
// ============================================================================

export {
  // Value Representation
  ValueRepresentation,
  DICOMTag,
  DICOMDataElement,
  DICOMValue,
  DICOMPersonName,
  DICOMSequenceItem,

  // SOP Classes and Transfer Syntaxes
  SOPClassUIDs,
  SOPClassUID,
  TransferSyntaxUIDs,
  TransferSyntaxUID,

  // Modality Codes
  ModalityCodes,
  ModalityCode,

  // DICOM Entities
  DICOMPatient,
  DICOMStudy,
  DICOMSeries,
  DICOMInstance,
  CodeSequenceItem,

  // Worklist Types
  DICOMWorklistItem,

  // DICOMweb Configuration
  DICOMwebEndpoint,
  DICOMwebAuth,
  OAuth2Config,
  DICOMwebError,

  // QIDO-RS Types
  QIDOQueryParams,
  QIDOStudyQuery,
  QIDOSeriesQuery,
  QIDOInstanceQuery,
  QIDOResponse,
  DICOMJSONObject,
  DICOMJSONAttribute,

  // WADO-RS Types
  WADOAcceptType,
  WADORetrieveOptions,
  WADOMultipartResponse,
  WADOResponsePart,

  // STOW-RS Types
  STOWRequest,
  STOWResponse,
  STOWInstanceResult,

  // UPS-RS Types
  UPSState,
  UPSWorkitem,
  UPSQueryParams,
  UPSSubscription,

  // Status Codes
  DICOMStatusCodes,
  DICOMStatusCode,
} from './types';

// ============================================================================
// Tag Exports
// ============================================================================

export {
  // Tag Groups
  PatientTags,
  StudyTags,
  SeriesTags,
  InstanceTags,
  ImagePixelTags,
  CTImageTags,
  MRImageTags,
  UltrasoundTags,
  WorklistTags,
  CodeSequenceTags,

  // Tag Utilities
  normalizeTag,
  formatTag,
  getTagGroup,
  getTagElement,
  isPrivateTag,
  isGroupLengthTag,

  // Tag Lookup
  TagDictionary,
  KeywordToTag,
  getTagDefinition,
  getKeyword,
  getVR,

  // VR Utilities
  VRTypeInfo,
  isNumericVR,
  isBinaryVR,
  isSequenceVR,
} from './tags';

// ============================================================================
// DICOMweb Client Exports
// ============================================================================

export {
  DICOMwebClient,
  createDICOMwebClient,
} from './dicomweb-client';

// ============================================================================
// FHIR Mapping Exports
// ============================================================================

export {
  // FHIR Resource Types
  FHIRImagingStudy,
  FHIRImagingStudySeries,
  FHIRImagingStudyPerformer,
  FHIRImagingStudyInstance,
  FHIRTask,
  FHIRTaskStatus,
  FHIRTaskRestriction,
  FHIRTaskInput,
  FHIRTaskOutput,
  FHIREndpoint,
  FHIRServiceRequest,

  // Coding Systems
  DICOMCodingSystems,
  ModalityCodeMapping,

  // Person Name Conversion
  dicomPersonNameToFHIR,
  fhirTodicomPersonName,

  // Date/Time Conversion
  dicomDateToFHIR,
  fhirDateToDICOM,
  dicomTimeToFHIR,
  dicomDateTimeToFHIR,

  // Code Conversion
  dicomCodeToCoding,

  // DICOM to FHIR Mapping
  dicomStudyToFHIRImagingStudy,
  dicomSeriesToFHIRSeries,
  dicomInstanceToFHIRInstance,
  dicomWorklistToFHIRTask,
  dicomWorklistToFHIRServiceRequest,

  // FHIR to DICOM Mapping
  fhirPatientToDICOM,
  fhirServiceRequestToWorklistQuery,

  // Resource Creation
  createImagingDiagnosticReport,
  createDICOMwebEndpoint,
} from './fhir-mapping';

// ============================================================================
// Worklist Exports
// ============================================================================

export {
  // MWL Query Types
  MWLQueryParams,

  // MWL Query Building
  buildMWLQuery,

  // MWL Response Parsing
  parseMWLResponse,
  parseMWLItem,

  // MPPS Types
  MPPSStatus,
  MPPSCreateRequest,
  MPPSUpdateRequest,
  ScheduledStepAttributes,
  ReferencedStudyComponent,
  PerformedSeries,
  ReferencedImage,

  // MPPS Building
  buildMPPSCreate,
  buildMPPSUpdate,

  // UID Generation
  generateStudyInstanceUID,
  generateSOPInstanceUID,
  generateSeriesInstanceUID,

  // Date/Time Utilities
  getCurrentDICOMDate,
  getCurrentDICOMTime,
  isValidDICOMDate,
  isValidDICOMTime,

  // Worklist Utilities
  filterWorklistItems,
  sortWorklistItems,
} from './worklist';

// ============================================================================
// Re-export everything as a namespace for convenience
// ============================================================================

import * as types from './types';
import * as tags from './tags';
import * as dicomwebClient from './dicomweb-client';
import * as fhirMapping from './fhir-mapping';
import * as worklist from './worklist';

export const DICOM = {
  ...types,
  ...tags,
  ...dicomwebClient,
  ...fhirMapping,
  ...worklist,
};

export default DICOM;
