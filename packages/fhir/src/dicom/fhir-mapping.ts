/**
 * FHIR-DICOM Mapping Utilities
 *
 * Provides bidirectional mapping between DICOM and FHIR resources:
 * - DICOMStudy <-> FHIR ImagingStudy
 * - DICOMWorklistItem <-> FHIR Task
 * - DICOM Modality Worklist <-> FHIR ServiceRequest
 * - FHIR DiagnosticReport with imaging references
 * - FHIR Endpoint for DICOM access
 *
 * Based on:
 * - HL7 FHIR R4: http://hl7.org/fhir/R4/
 * - IHE RAD TF: FHIR-DICOM Mapping Guide
 * - DICOM PS3.18: Web Services
 */

import {
  DICOMStudy,
  DICOMSeries,
  DICOMInstance,
  DICOMPatient,
  DICOMWorklistItem,
  DICOMPersonName,
  DICOMwebEndpoint,
  ModalityCode,
  ModalityCodes,
  SOPClassUIDs,
  CodeSequenceItem,
} from './types';

import {
  CodeableConcept,
  Coding,
  Reference,
  Identifier,
  HumanName,
  Period,
  Annotation,
} from '../types/base';

import { DiagnosticReport } from '../types/diagnostic-report';

// ============================================================================
// FHIR ImagingStudy Resource Type
// ============================================================================

/**
 * FHIR ImagingStudy resource (R4)
 * http://hl7.org/fhir/R4/imagingstudy.html
 */
export interface FHIRImagingStudy {
  resourceType: 'ImagingStudy';
  id?: string;
  identifier?: Identifier[];
  status: 'registered' | 'available' | 'cancelled' | 'entered-in-error' | 'unknown';
  modality?: Coding[];
  subject: Reference;
  encounter?: Reference;
  started?: string; // dateTime
  basedOn?: Reference[];
  referrer?: Reference;
  interpreter?: Reference[];
  endpoint?: Reference[];
  numberOfSeries?: number;
  numberOfInstances?: number;
  procedureReference?: Reference;
  procedureCode?: CodeableConcept[];
  location?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
  description?: string;
  series?: FHIRImagingStudySeries[];
}

/**
 * FHIR ImagingStudy Series
 */
export interface FHIRImagingStudySeries {
  uid: string;
  number?: number;
  modality: Coding;
  description?: string;
  numberOfInstances?: number;
  endpoint?: Reference[];
  bodySite?: Coding;
  laterality?: Coding;
  specimen?: Reference[];
  started?: string; // dateTime
  performer?: FHIRImagingStudyPerformer[];
  instance?: FHIRImagingStudyInstance[];
}

/**
 * FHIR ImagingStudy Performer
 */
export interface FHIRImagingStudyPerformer {
  function?: CodeableConcept;
  actor: Reference;
}

/**
 * FHIR ImagingStudy Instance
 */
export interface FHIRImagingStudyInstance {
  uid: string;
  sopClass: Coding;
  number?: number;
  title?: string;
}

// ============================================================================
// FHIR Task Resource Type (for Worklist)
// ============================================================================

/**
 * FHIR Task resource (R4) - simplified for worklist
 * http://hl7.org/fhir/R4/task.html
 */
export interface FHIRTask {
  resourceType: 'Task';
  id?: string;
  identifier?: Identifier[];
  instantiatesCanonical?: string;
  instantiatesUri?: string;
  basedOn?: Reference[];
  groupIdentifier?: Identifier;
  partOf?: Reference[];
  status: FHIRTaskStatus;
  statusReason?: CodeableConcept;
  businessStatus?: CodeableConcept;
  intent: 'unknown' | 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  code?: CodeableConcept;
  description?: string;
  focus?: Reference;
  for?: Reference;
  encounter?: Reference;
  executionPeriod?: Period;
  authoredOn?: string; // dateTime
  lastModified?: string; // dateTime
  requester?: Reference;
  performerType?: CodeableConcept[];
  owner?: Reference;
  location?: Reference;
  reasonCode?: CodeableConcept;
  reasonReference?: Reference;
  insurance?: Reference[];
  note?: Annotation[];
  relevantHistory?: Reference[];
  restriction?: FHIRTaskRestriction;
  input?: FHIRTaskInput[];
  output?: FHIRTaskOutput[];
}

export type FHIRTaskStatus =
  | 'draft'
  | 'requested'
  | 'received'
  | 'accepted'
  | 'rejected'
  | 'ready'
  | 'cancelled'
  | 'in-progress'
  | 'on-hold'
  | 'failed'
  | 'completed'
  | 'entered-in-error';

export interface FHIRTaskRestriction {
  repetitions?: number;
  period?: Period;
  recipient?: Reference[];
}

export interface FHIRTaskInput {
  type: CodeableConcept;
  valueString?: string;
  valueReference?: Reference;
  // Other value[x] types as needed
}

export interface FHIRTaskOutput {
  type: CodeableConcept;
  valueString?: string;
  valueReference?: Reference;
  // Other value[x] types as needed
}

// ============================================================================
// FHIR Endpoint Resource Type
// ============================================================================

/**
 * FHIR Endpoint resource (R4)
 * http://hl7.org/fhir/R4/endpoint.html
 */
export interface FHIREndpoint {
  resourceType: 'Endpoint';
  id?: string;
  identifier?: Identifier[];
  status: 'active' | 'suspended' | 'error' | 'off' | 'entered-in-error' | 'test';
  connectionType: Coding;
  name?: string;
  managingOrganization?: Reference;
  contact?: { system?: string; value?: string; use?: string }[];
  period?: Period;
  payloadType: CodeableConcept[];
  payloadMimeType?: string[];
  address: string;
  header?: string[];
}

// ============================================================================
// FHIR ServiceRequest Resource Type (for Orders)
// ============================================================================

/**
 * FHIR ServiceRequest resource (R4) - simplified for imaging orders
 * http://hl7.org/fhir/R4/servicerequest.html
 */
export interface FHIRServiceRequest {
  resourceType: 'ServiceRequest';
  id?: string;
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  replaces?: Reference[];
  requisition?: Identifier;
  status: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown';
  intent: 'proposal' | 'plan' | 'directive' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  category?: CodeableConcept[];
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  doNotPerform?: boolean;
  code?: CodeableConcept;
  orderDetail?: CodeableConcept[];
  quantityQuantity?: { value?: number; unit?: string };
  quantityRatio?: { numerator?: { value?: number }; denominator?: { value?: number } };
  quantityRange?: { low?: { value?: number }; high?: { value?: number } };
  subject: Reference;
  encounter?: Reference;
  occurrenceDateTime?: string;
  occurrencePeriod?: Period;
  occurrenceTiming?: any;
  asNeededBoolean?: boolean;
  asNeededCodeableConcept?: CodeableConcept;
  authoredOn?: string;
  requester?: Reference;
  performerType?: CodeableConcept;
  performer?: Reference[];
  locationCode?: CodeableConcept[];
  locationReference?: Reference[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  insurance?: Reference[];
  supportingInfo?: Reference[];
  specimen?: Reference[];
  bodySite?: CodeableConcept[];
  note?: Annotation[];
  patientInstruction?: string;
  relevantHistory?: Reference[];
}

// ============================================================================
// Coding System Constants
// ============================================================================

/**
 * DICOM-related coding systems
 */
export const DICOMCodingSystems = {
  /** DICOM UID Registry */
  DICOM_UID: 'urn:ietf:rfc:3986',
  /** DCM code system (DICOM Controlled Terminology) */
  DCM: 'http://dicom.nema.org/resources/ontology/DCM',
  /** DICOM SOP Class UIDs */
  SOP_CLASS: 'urn:ietf:rfc:3986',
  /** Endpoint connection type */
  ENDPOINT_CONNECTION_TYPE: 'http://terminology.hl7.org/CodeSystem/endpoint-connection-type',
  /** SNOMED CT */
  SNOMED: 'http://snomed.info/sct',
  /** LOINC */
  LOINC: 'http://loinc.org',
  /** HL7 Task Status */
  TASK_STATUS: 'http://hl7.org/fhir/task-status',
  /** HL7 Service Request Intent */
  REQUEST_INTENT: 'http://hl7.org/fhir/request-intent',
  /** HL7 Request Priority */
  REQUEST_PRIORITY: 'http://hl7.org/fhir/request-priority',
  /** IHE Radiology */
  IHE_RAD: 'http://ihe.net/fhir/rad/CodeSystem',
} as const;

/**
 * DICOM modality to FHIR modality coding
 */
export const ModalityCodeMapping: Record<ModalityCode, Coding> = Object.fromEntries(
  Object.entries(ModalityCodes).map(([code, display]) => [
    code,
    {
      system: DICOMCodingSystems.DCM,
      code,
      display,
    },
  ])
) as Record<ModalityCode, Coding>;

// ============================================================================
// DICOM to FHIR Mapping Functions
// ============================================================================

/**
 * Convert DICOM Person Name to FHIR HumanName
 */
export function dicomPersonNameToFHIR(
  pn: DICOMPersonName | string | undefined
): HumanName | undefined {
  if (!pn) return undefined;

  const nameString = typeof pn === 'string' ? pn : pn.Alphabetic;
  if (!nameString) return undefined;

  // DICOM PN format: family^given^middle^prefix^suffix
  const parts = nameString.split('^');
  const [family, given, middle, prefix, suffix] = parts;

  const humanName: HumanName = {
    text: nameString.replace(/\^/g, ' ').trim(),
  };

  if (family) humanName.family = family;
  if (given) {
    humanName.given = [given];
    if (middle) humanName.given.push(middle);
  }
  if (prefix) humanName.prefix = [prefix];
  if (suffix) humanName.suffix = [suffix];

  return humanName;
}

/**
 * Convert FHIR HumanName to DICOM Person Name
 */
export function fhirTodicomPersonName(name: HumanName | undefined): string | undefined {
  if (!name) return undefined;

  const family = name.family ?? '';
  const given = name.given?.join('^') ?? '';
  const prefix = name.prefix?.join(' ') ?? '';
  const suffix = name.suffix?.join(' ') ?? '';

  // DICOM format: family^given^middle^prefix^suffix
  const parts = [family, given, '', prefix, suffix];

  // Trim trailing empty parts
  while (parts.length > 0 && !parts[parts.length - 1]) {
    parts.pop();
  }

  return parts.join('^') || undefined;
}

/**
 * Convert DICOM date (YYYYMMDD) to FHIR date (YYYY-MM-DD)
 */
export function dicomDateToFHIR(date: string | undefined): string | undefined {
  if (!date || date.length < 8) return undefined;

  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);

  return `${year}-${month}-${day}`;
}

/**
 * Convert FHIR date (YYYY-MM-DD) to DICOM date (YYYYMMDD)
 */
export function fhirDateToDICOM(date: string | undefined): string | undefined {
  if (!date) return undefined;
  return date.replace(/-/g, '');
}

/**
 * Convert DICOM time (HHMMSS.FFFFFF) to FHIR time (HH:MM:SS)
 */
export function dicomTimeToFHIR(time: string | undefined): string | undefined {
  if (!time || time.length < 4) return undefined;

  const hours = time.substring(0, 2);
  const minutes = time.substring(2, 4);
  const seconds = time.length >= 6 ? time.substring(4, 6) : '00';

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Convert DICOM date+time to FHIR dateTime
 */
export function dicomDateTimeToFHIR(
  date: string | undefined,
  time: string | undefined
): string | undefined {
  const fhirDate = dicomDateToFHIR(date);
  if (!fhirDate) return undefined;

  const fhirTime = dicomTimeToFHIR(time);
  if (!fhirTime) return fhirDate;

  return `${fhirDate}T${fhirTime}`;
}

/**
 * Convert DICOM Code Sequence Item to FHIR Coding
 */
export function dicomCodeToCoding(code: CodeSequenceItem): Coding {
  return {
    system: mapCodingScheme(code.codingSchemeDesignator),
    version: code.codingSchemeVersion,
    code: code.codeValue,
    display: code.codeMeaning,
  };
}

/**
 * Map DICOM coding scheme designator to FHIR system URI
 */
function mapCodingScheme(designator: string): string {
  const schemeMap: Record<string, string> = {
    'DCM': DICOMCodingSystems.DCM,
    'SCT': DICOMCodingSystems.SNOMED,
    'LN': DICOMCodingSystems.LOINC,
    'SRT': DICOMCodingSystems.SNOMED,
    '99SDM': DICOMCodingSystems.DCM,
  };

  return schemeMap[designator] ?? `urn:oid:${designator}`;
}

/**
 * Convert DICOMStudy to FHIR ImagingStudy
 */
export function dicomStudyToFHIRImagingStudy(
  study: DICOMStudy,
  options: {
    patientReference?: string;
    endpointReference?: string;
    practitionerReference?: string;
  } = {}
): FHIRImagingStudy {
  const imagingStudy: FHIRImagingStudy = {
    resourceType: 'ImagingStudy',
    identifier: [
      {
        system: DICOMCodingSystems.DICOM_UID,
        value: `urn:oid:${study.studyInstanceUID}`,
      },
    ],
    status: 'available',
    subject: {
      reference: options.patientReference ?? `Patient/${study.patient?.patientId}`,
    },
  };

  // Study ID
  if (study.studyId) {
    imagingStudy.identifier!.push({
      type: {
        coding: [{
          system: DICOMCodingSystems.DCM,
          code: 'ACSN',
          display: 'Accession Number',
        }],
      },
      value: study.studyId,
    });
  }

  // Accession Number
  if (study.accessionNumber) {
    imagingStudy.identifier!.push({
      type: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
          code: 'ACSN',
        }],
      },
      value: study.accessionNumber,
    });
  }

  // Modalities
  if (study.modalitiesInStudy?.length) {
    imagingStudy.modality = study.modalitiesInStudy.map(
      (m) => ModalityCodeMapping[m] ?? { system: DICOMCodingSystems.DCM, code: m }
    );
  }

  // Started date/time
  const startedDateTime = dicomDateTimeToFHIR(study.studyDate, study.studyTime);
  if (startedDateTime) {
    imagingStudy.started = startedDateTime;
  }

  // Referring physician
  if (study.referringPhysicianName) {
    imagingStudy.referrer = {
      display: formatPersonName(study.referringPhysicianName),
    };
    if (options.practitionerReference) {
      imagingStudy.referrer.reference = options.practitionerReference;
    }
  }

  // Endpoint
  if (options.endpointReference) {
    imagingStudy.endpoint = [{ reference: options.endpointReference }];
  } else if (study.retrieveURL) {
    imagingStudy.endpoint = [{ display: study.retrieveURL }];
  }

  // Counts
  if (study.numberOfStudyRelatedSeries !== undefined) {
    imagingStudy.numberOfSeries = study.numberOfStudyRelatedSeries;
  }
  if (study.numberOfStudyRelatedInstances !== undefined) {
    imagingStudy.numberOfInstances = study.numberOfStudyRelatedInstances;
  }

  // Procedure codes
  if (study.procedureCodes?.length) {
    imagingStudy.procedureCode = study.procedureCodes.map((code) => ({
      coding: [dicomCodeToCoding(code)],
    }));
  }

  // Description
  if (study.studyDescription) {
    imagingStudy.description = study.studyDescription;
  }

  // Reason for study
  if (study.reasonForStudy) {
    imagingStudy.reasonCode = [{
      text: study.reasonForStudy,
    }];
  }

  // Series
  if (study.series?.length) {
    imagingStudy.series = study.series.map((series) =>
      dicomSeriesToFHIRSeries(series)
    );
  }

  return imagingStudy;
}

/**
 * Convert DICOMSeries to FHIR ImagingStudy.series
 */
export function dicomSeriesToFHIRSeries(series: DICOMSeries): FHIRImagingStudySeries {
  const fhirSeries: FHIRImagingStudySeries = {
    uid: series.seriesInstanceUID,
    modality: ModalityCodeMapping[series.modality] ?? {
      system: DICOMCodingSystems.DCM,
      code: series.modality,
    },
  };

  if (series.seriesNumber !== undefined) {
    fhirSeries.number = series.seriesNumber;
  }

  if (series.seriesDescription) {
    fhirSeries.description = series.seriesDescription;
  }

  if (series.numberOfSeriesRelatedInstances !== undefined) {
    fhirSeries.numberOfInstances = series.numberOfSeriesRelatedInstances;
  }

  // Body site
  if (series.bodyPartExamined) {
    fhirSeries.bodySite = {
      system: DICOMCodingSystems.SNOMED,
      code: series.bodyPartExamined,
      display: series.bodyPartExamined,
    };
  }

  // Laterality
  if (series.laterality) {
    const lateralityMap: Record<string, Coding> = {
      'L': { system: DICOMCodingSystems.SNOMED, code: '7771000', display: 'Left' },
      'R': { system: DICOMCodingSystems.SNOMED, code: '24028007', display: 'Right' },
    };
    fhirSeries.laterality = lateralityMap[series.laterality];
  }

  // Started
  const startedDateTime = dicomDateTimeToFHIR(series.seriesDate, series.seriesTime);
  if (startedDateTime) {
    fhirSeries.started = startedDateTime;
  }

  // Performer
  if (series.performingPhysicianName) {
    fhirSeries.performer = [{
      function: {
        coding: [{
          system: DICOMCodingSystems.DCM,
          code: '121094',
          display: 'Performing Physician',
        }],
      },
      actor: {
        display: formatPersonName(series.performingPhysicianName),
      },
    }];
  }

  // Instances
  if (series.instances?.length) {
    fhirSeries.instance = series.instances.map((instance) =>
      dicomInstanceToFHIRInstance(instance)
    );
  }

  return fhirSeries;
}

/**
 * Convert DICOMInstance to FHIR ImagingStudy.series.instance
 */
export function dicomInstanceToFHIRInstance(
  instance: DICOMInstance
): FHIRImagingStudyInstance {
  const fhirInstance: FHIRImagingStudyInstance = {
    uid: instance.sopInstanceUID,
    sopClass: {
      system: DICOMCodingSystems.DICOM_UID,
      code: `urn:oid:${instance.sopClassUID}`,
    },
  };

  if (instance.instanceNumber !== undefined) {
    fhirInstance.number = instance.instanceNumber;
  }

  // Set title based on SOP Class
  const sopClassTitle = getSopClassTitle(instance.sopClassUID);
  if (sopClassTitle) {
    fhirInstance.title = sopClassTitle;
  }

  return fhirInstance;
}

/**
 * Get human-readable title for SOP Class
 */
function getSopClassTitle(sopClassUID: string): string | undefined {
  const sopClassTitles: Record<string, string> = {
    [SOPClassUIDs.CTImageStorage]: 'CT Image',
    [SOPClassUIDs.MRImageStorage]: 'MR Image',
    [SOPClassUIDs.UltrasoundImageStorage]: 'Ultrasound Image',
    [SOPClassUIDs.DigitalXRayImageStorageForPresentation]: 'Digital X-Ray Image',
    [SOPClassUIDs.ComputedRadiographyImageStorage]: 'CR Image',
    [SOPClassUIDs.DigitalMammographyXRayImageStorageForPresentation]: 'Mammography Image',
    [SOPClassUIDs.PositronEmissionTomographyImageStorage]: 'PET Image',
    [SOPClassUIDs.NuclearMedicineImageStorage]: 'Nuclear Medicine Image',
    [SOPClassUIDs.SecondaryCaptureImageStorage]: 'Secondary Capture Image',
    [SOPClassUIDs.EncapsulatedPDFStorage]: 'PDF Document',
    [SOPClassUIDs.BasicTextSRStorage]: 'Structured Report',
    [SOPClassUIDs.EnhancedSRStorage]: 'Enhanced Structured Report',
    [SOPClassUIDs.ComprehensiveSRStorage]: 'Comprehensive Structured Report',
  };

  return sopClassTitles[sopClassUID];
}

/**
 * Format DICOM person name for display
 */
function formatPersonName(pn: DICOMPersonName | string | undefined): string {
  if (!pn) return '';
  const nameString = typeof pn === 'string' ? pn : pn.Alphabetic;
  return nameString?.replace(/\^/g, ' ').trim() ?? '';
}

/**
 * Convert DICOMWorklistItem to FHIR Task
 */
export function dicomWorklistToFHIRTask(
  worklistItem: DICOMWorklistItem,
  options: {
    patientReference?: string;
    practitionerReference?: string;
    locationReference?: string;
  } = {}
): FHIRTask {
  const task: FHIRTask = {
    resourceType: 'Task',
    identifier: [
      {
        system: 'urn:dicom:scheduled-procedure-step-id',
        value: worklistItem.scheduledProcedureStepId,
      },
    ],
    status: mapWorklistStatusToTaskStatus(worklistItem.scheduledProcedureStepStatus),
    intent: 'order',
    for: {
      reference: options.patientReference ?? `Patient/${worklistItem.patient.patientId}`,
    },
  };

  // Requested Procedure ID
  if (worklistItem.requestedProcedureId) {
    task.identifier!.push({
      system: 'urn:dicom:requested-procedure-id',
      value: worklistItem.requestedProcedureId,
    });
  }

  // Accession Number
  if (worklistItem.accessionNumber) {
    task.identifier!.push({
      type: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
          code: 'ACSN',
        }],
      },
      value: worklistItem.accessionNumber,
    });
  }

  // Study Instance UID
  if (worklistItem.studyInstanceUID) {
    task.identifier!.push({
      system: DICOMCodingSystems.DICOM_UID,
      value: `urn:oid:${worklistItem.studyInstanceUID}`,
    });
  }

  // Priority
  task.priority = mapWorklistPriorityToFHIR(worklistItem.requestedProcedurePriority);

  // Code (modality)
  task.code = {
    coding: [
      ModalityCodeMapping[worklistItem.modality] ?? {
        system: DICOMCodingSystems.DCM,
        code: worklistItem.modality,
      },
    ],
    text: worklistItem.scheduledProcedureStepDescription,
  };

  // Description
  if (worklistItem.requestedProcedureDescription) {
    task.description = worklistItem.requestedProcedureDescription;
  }

  // Execution period
  const startDateTime = dicomDateTimeToFHIR(
    worklistItem.scheduledProcedureStepStartDate,
    worklistItem.scheduledProcedureStepStartTime
  );
  const endDateTime = dicomDateTimeToFHIR(
    worklistItem.scheduledProcedureStepEndDate,
    worklistItem.scheduledProcedureStepEndTime
  );

  if (startDateTime || endDateTime) {
    task.executionPeriod = {};
    if (startDateTime) task.executionPeriod.start = startDateTime;
    if (endDateTime) task.executionPeriod.end = endDateTime;
  }

  // Requester (referring physician)
  if (worklistItem.referringPhysicianName) {
    task.requester = {
      display: formatPersonName(worklistItem.referringPhysicianName),
    };
    if (options.practitionerReference) {
      task.requester.reference = options.practitionerReference;
    }
  }

  // Owner (scheduled performing physician)
  if (worklistItem.scheduledPerformingPhysicianName) {
    task.owner = {
      display: formatPersonName(worklistItem.scheduledPerformingPhysicianName),
    };
  }

  // Location
  if (worklistItem.scheduledProcedureStepLocation || worklistItem.currentPatientLocation) {
    task.location = {
      display:
        worklistItem.scheduledProcedureStepLocation ??
        worklistItem.currentPatientLocation,
    };
    if (options.locationReference) {
      task.location.reference = options.locationReference;
    }
  }

  // Reason
  if (worklistItem.reasonForRequestedProcedure) {
    task.reasonCode = {
      text: worklistItem.reasonForRequestedProcedure,
    };
  }

  // Notes
  if (worklistItem.requestedProcedureComments) {
    task.note = [{
      text: worklistItem.requestedProcedureComments,
    }];
  }

  // Input: Scheduled Protocol Codes
  if (worklistItem.scheduledProtocolCodes?.length) {
    task.input = worklistItem.scheduledProtocolCodes.map((code) => ({
      type: {
        coding: [{
          system: DICOMCodingSystems.DCM,
          code: '121058',
          display: 'Scheduled Protocol Code Sequence',
        }],
      },
      valueString: `${code.codingSchemeDesignator}:${code.codeValue} - ${code.codeMeaning}`,
    }));
  }

  return task;
}

/**
 * Map worklist status to FHIR Task status
 */
function mapWorklistStatusToTaskStatus(
  status: DICOMWorklistItem['scheduledProcedureStepStatus']
): FHIRTaskStatus {
  const statusMap: Record<string, FHIRTaskStatus> = {
    'SCHEDULED': 'ready',
    'ARRIVED': 'received',
    'READY': 'ready',
    'STARTED': 'in-progress',
    'DEPARTED': 'completed',
    'CANCELED': 'cancelled',
    'DISCONTINUED': 'cancelled',
    'COMPLETED': 'completed',
  };

  return statusMap[status ?? ''] ?? 'requested';
}

/**
 * Map worklist priority to FHIR priority
 */
function mapWorklistPriorityToFHIR(
  priority: DICOMWorklistItem['requestedProcedurePriority']
): 'routine' | 'urgent' | 'asap' | 'stat' {
  const priorityMap: Record<string, 'routine' | 'urgent' | 'asap' | 'stat'> = {
    'STAT': 'stat',
    'HIGH': 'asap',
    'ROUTINE': 'routine',
    'MEDIUM': 'routine',
    'LOW': 'routine',
  };

  return priorityMap[priority ?? ''] ?? 'routine';
}

/**
 * Convert DICOMWorklistItem to FHIR ServiceRequest
 */
export function dicomWorklistToFHIRServiceRequest(
  worklistItem: DICOMWorklistItem,
  options: {
    patientReference?: string;
    practitionerReference?: string;
  } = {}
): FHIRServiceRequest {
  const serviceRequest: FHIRServiceRequest = {
    resourceType: 'ServiceRequest',
    identifier: [
      {
        system: 'urn:dicom:requested-procedure-id',
        value: worklistItem.requestedProcedureId,
      },
    ],
    status: 'active',
    intent: 'order',
    subject: {
      reference: options.patientReference ?? `Patient/${worklistItem.patient.patientId}`,
    },
  };

  // Accession Number (requisition)
  if (worklistItem.accessionNumber) {
    serviceRequest.requisition = {
      system: 'urn:dicom:accession-number',
      value: worklistItem.accessionNumber,
    };
  }

  // Priority
  serviceRequest.priority = mapWorklistPriorityToFHIR(worklistItem.requestedProcedurePriority);

  // Category (Imaging)
  serviceRequest.category = [{
    coding: [{
      system: DICOMCodingSystems.SNOMED,
      code: '363679005',
      display: 'Imaging',
    }],
  }];

  // Code (procedure code or modality)
  if (worklistItem.requestedProcedureCodes?.length) {
    serviceRequest.code = {
      coding: worklistItem.requestedProcedureCodes.map(dicomCodeToCoding),
    };
  } else {
    serviceRequest.code = {
      coding: [
        ModalityCodeMapping[worklistItem.modality] ?? {
          system: DICOMCodingSystems.DCM,
          code: worklistItem.modality,
        },
      ],
      text: worklistItem.requestedProcedureDescription,
    };
  }

  // Occurrence (scheduled time)
  const occurrenceDateTime = dicomDateTimeToFHIR(
    worklistItem.scheduledProcedureStepStartDate,
    worklistItem.scheduledProcedureStepStartTime
  );
  if (occurrenceDateTime) {
    serviceRequest.occurrenceDateTime = occurrenceDateTime;
  }

  // Requester
  if (worklistItem.referringPhysicianName) {
    serviceRequest.requester = {
      display: formatPersonName(worklistItem.referringPhysicianName),
    };
    if (options.practitionerReference) {
      serviceRequest.requester.reference = options.practitionerReference;
    }
  }

  // Performer
  if (worklistItem.scheduledPerformingPhysicianName) {
    serviceRequest.performer = [{
      display: formatPersonName(worklistItem.scheduledPerformingPhysicianName),
    }];
  }

  // Reason
  if (worklistItem.reasonForRequestedProcedure) {
    serviceRequest.reasonCode = [{
      text: worklistItem.reasonForRequestedProcedure,
    }];
  }

  // Note
  if (worklistItem.requestedProcedureComments) {
    serviceRequest.note = [{
      text: worklistItem.requestedProcedureComments,
    }];
  }

  return serviceRequest;
}

/**
 * Create FHIR DiagnosticReport with imaging references
 */
export function createImagingDiagnosticReport(options: {
  study: DICOMStudy;
  patientReference: string;
  performerReference?: string;
  conclusion?: string;
  conclusionCodes?: CodeSequenceItem[];
  imagingStudyReference?: string;
}): DiagnosticReport {
  const report: DiagnosticReport = {
    resourceType: 'DiagnosticReport',
    status: 'final',
    category: [{
      coding: [{
        system: DICOMCodingSystems.LOINC,
        code: '18748-4',
        display: 'Diagnostic imaging study',
      }],
    }],
    code: {
      text: options.study.studyDescription ?? 'Imaging Study',
    },
    subject: {
      reference: options.patientReference,
    },
  };

  // Identifier (accession number)
  if (options.study.accessionNumber) {
    report.identifier = [{
      type: {
        coding: [{
          system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
          code: 'ACSN',
        }],
      },
      value: options.study.accessionNumber,
    }];
  }

  // Effective date/time
  const effectiveDateTime = dicomDateTimeToFHIR(
    options.study.studyDate,
    options.study.studyTime
  );
  if (effectiveDateTime) {
    report.effectiveDateTime = effectiveDateTime;
  }

  // Issued
  report.issued = new Date().toISOString();

  // Performer
  if (options.performerReference) {
    report.performer = [{ reference: options.performerReference }];
  } else if (options.study.readingPhysicianName) {
    report.performer = [{
      display: formatPersonName(options.study.readingPhysicianName),
    }];
  }

  // Imaging study reference
  if (options.imagingStudyReference) {
    report.imagingStudy = [{ reference: options.imagingStudyReference }];
  }

  // Conclusion
  if (options.conclusion) {
    report.conclusion = options.conclusion;
  }

  // Conclusion codes
  if (options.conclusionCodes?.length) {
    report.conclusionCode = options.conclusionCodes.map((code) => ({
      coding: [dicomCodeToCoding(code)],
    }));
  }

  return report;
}

/**
 * Create FHIR Endpoint for DICOMweb access
 */
export function createDICOMwebEndpoint(
  dicomEndpoint: DICOMwebEndpoint,
  options: {
    id?: string;
    name?: string;
    organizationReference?: string;
  } = {}
): FHIREndpoint {
  return {
    resourceType: 'Endpoint',
    id: options.id,
    status: 'active',
    connectionType: {
      system: DICOMCodingSystems.ENDPOINT_CONNECTION_TYPE,
      code: 'dicom-wado-rs',
      display: 'DICOM WADO-RS',
    },
    name: options.name ?? 'DICOMweb Endpoint',
    managingOrganization: options.organizationReference
      ? { reference: options.organizationReference }
      : undefined,
    payloadType: [
      {
        coding: [{
          system: DICOMCodingSystems.DCM,
          code: 'DICOM',
          display: 'DICOM Objects',
        }],
      },
    ],
    payloadMimeType: [
      'application/dicom',
      'application/dicom+json',
      'multipart/related',
    ],
    address: dicomEndpoint.baseUrl,
    header: dicomEndpoint.headers
      ? Object.entries(dicomEndpoint.headers).map(([k, v]) => `${k}: ${v}`)
      : undefined,
  };
}

// ============================================================================
// FHIR to DICOM Mapping Functions
// ============================================================================

/**
 * Extract DICOM Patient from FHIR Patient reference data
 */
export function fhirPatientToDICOM(patientData: {
  id?: string;
  name?: HumanName[];
  birthDate?: string;
  gender?: string;
}): DICOMPatient {
  const patient: DICOMPatient = {
    patientId: patientData.id ?? '',
  };

  // Name
  const officialName = patientData.name?.find((n) => n.use === 'official') ??
    patientData.name?.[0];
  if (officialName) {
    patient.patientName = fhirTodicomPersonName(officialName);
  }

  // Birth date
  if (patientData.birthDate) {
    patient.patientBirthDate = fhirDateToDICOM(patientData.birthDate);
  }

  // Sex
  if (patientData.gender) {
    const genderMap: Record<string, 'M' | 'F' | 'O'> = {
      'male': 'M',
      'female': 'F',
      'other': 'O',
      'unknown': 'O',
    };
    patient.patientSex = genderMap[patientData.gender];
  }

  return patient;
}

/**
 * Extract worklist query parameters from FHIR ServiceRequest
 */
export function fhirServiceRequestToWorklistQuery(
  serviceRequest: FHIRServiceRequest
): Partial<DICOMWorklistItem> {
  const query: Partial<DICOMWorklistItem> = {};

  // Requisition as accession number
  if (serviceRequest.requisition?.value) {
    query.accessionNumber = serviceRequest.requisition.value;
  }

  // Requested procedure ID
  const procedureIdIdentifier = serviceRequest.identifier?.find(
    (id) => id.system === 'urn:dicom:requested-procedure-id'
  );
  if (procedureIdIdentifier?.value) {
    query.requestedProcedureId = procedureIdIdentifier.value;
  }

  // Modality from code
  if (serviceRequest.code?.coding) {
    const modalityCoding = serviceRequest.code.coding.find(
      (c) => c.system === DICOMCodingSystems.DCM
    );
    if (modalityCoding?.code) {
      query.modality = modalityCoding.code as ModalityCode;
    }
  }

  // Scheduled date from occurrence
  if (serviceRequest.occurrenceDateTime) {
    query.scheduledProcedureStepStartDate = fhirDateToDICOM(
      serviceRequest.occurrenceDateTime.split('T')[0]
    );
  }

  // Priority
  if (serviceRequest.priority) {
    const priorityMap: Record<string, DICOMWorklistItem['requestedProcedurePriority']> = {
      'stat': 'STAT',
      'asap': 'HIGH',
      'urgent': 'HIGH',
      'routine': 'ROUTINE',
    };
    query.requestedProcedurePriority = priorityMap[serviceRequest.priority];
  }

  return query;
}
