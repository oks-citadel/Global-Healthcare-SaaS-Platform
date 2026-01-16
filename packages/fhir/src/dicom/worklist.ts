/**
 * Modality Worklist Integration
 *
 * Implements:
 * - Modality Worklist (MWL) query generation and response parsing
 * - Modality Performed Procedure Step (MPPS) support
 * - IHE Scheduled Workflow (SWF) profile support
 *
 * Based on:
 * - DICOM PS3.4 Annex K (Basic Worklist Management Service)
 * - DICOM PS3.4 Annex F (Modality Performed Procedure Step)
 * - IHE Radiology Technical Framework Vol 2
 */

import {
  DICOMWorklistItem,
  DICOMPatient,
  DICOMPersonName,
  DICOMJSONObject,
  DICOMJSONAttribute,
  ModalityCode,
  CodeSequenceItem,
  ValueRepresentation,
} from './types';

import {
  normalizeTag,
  PatientTags,
  StudyTags,
  WorklistTags,
  CodeSequenceTags,
} from './tags';

// ============================================================================
// MWL Query Builder
// ============================================================================

/**
 * Modality Worklist query parameters
 */
export interface MWLQueryParams {
  // Patient-level matching
  patientId?: string;
  patientName?: string;
  patientBirthDate?: string;
  patientSex?: 'M' | 'F' | 'O';

  // Visit-level matching
  admissionId?: string;
  currentPatientLocation?: string;

  // Scheduled Procedure Step matching
  scheduledStationAETitle?: string;
  scheduledStationName?: string;
  scheduledProcedureStepStartDate?: string;
  scheduledProcedureStepStartTime?: string;
  scheduledProcedureStepEndDate?: string;
  scheduledProcedureStepEndTime?: string;
  scheduledPerformingPhysicianName?: string;
  scheduledProcedureStepStatus?: string;
  modality?: ModalityCode | ModalityCode[];

  // Requested Procedure matching
  requestedProcedureId?: string;
  accessionNumber?: string;
  studyInstanceUID?: string;
  referringPhysicianName?: string;
  requestedProcedurePriority?: string;

  // Imaging Service Request matching
  placerOrderNumber?: string;
  fillerOrderNumber?: string;

  // Date range support
  scheduledDateRange?: {
    start?: string; // YYYYMMDD
    end?: string;   // YYYYMMDD
  };
}

/**
 * Build a DICOM JSON query object for MWL
 */
export function buildMWLQuery(params: MWLQueryParams): DICOMJSONObject {
  const query: DICOMJSONObject = {};

  // =========================================================================
  // Patient Module
  // =========================================================================

  // Patient ID (0010,0020)
  if (params.patientId !== undefined) {
    query['00100020'] = createQueryAttribute('LO', params.patientId);
  } else {
    // Always request Patient ID
    query['00100020'] = createQueryAttribute('LO');
  }

  // Patient's Name (0010,0010)
  if (params.patientName !== undefined) {
    query['00100010'] = createQueryAttribute('PN', params.patientName);
  } else {
    query['00100010'] = createQueryAttribute('PN');
  }

  // Patient's Birth Date (0010,0030)
  if (params.patientBirthDate !== undefined) {
    query['00100030'] = createQueryAttribute('DA', params.patientBirthDate);
  } else {
    query['00100030'] = createQueryAttribute('DA');
  }

  // Patient's Sex (0010,0040)
  if (params.patientSex !== undefined) {
    query['00100040'] = createQueryAttribute('CS', params.patientSex);
  } else {
    query['00100040'] = createQueryAttribute('CS');
  }

  // Issuer of Patient ID (0010,0021)
  query['00100021'] = createQueryAttribute('LO');

  // Other Patient IDs Sequence (0010,1002)
  query['00101002'] = createQueryAttribute('SQ');

  // =========================================================================
  // Visit Identification Module
  // =========================================================================

  // Admission ID (0038,0010)
  if (params.admissionId !== undefined) {
    query['00380010'] = createQueryAttribute('LO', params.admissionId);
  } else {
    query['00380010'] = createQueryAttribute('LO');
  }

  // Current Patient Location (0038,0300)
  if (params.currentPatientLocation !== undefined) {
    query['00380300'] = createQueryAttribute('LO', params.currentPatientLocation);
  } else {
    query['00380300'] = createQueryAttribute('LO');
  }

  // =========================================================================
  // Imaging Service Request Module
  // =========================================================================

  // Accession Number (0008,0050)
  if (params.accessionNumber !== undefined) {
    query['00080050'] = createQueryAttribute('SH', params.accessionNumber);
  } else {
    query['00080050'] = createQueryAttribute('SH');
  }

  // Referring Physician's Name (0008,0090)
  if (params.referringPhysicianName !== undefined) {
    query['00080090'] = createQueryAttribute('PN', params.referringPhysicianName);
  } else {
    query['00080090'] = createQueryAttribute('PN');
  }

  // Placer Order Number/Imaging Service Request (0040,2016)
  if (params.placerOrderNumber !== undefined) {
    query['00402016'] = createQueryAttribute('LO', params.placerOrderNumber);
  } else {
    query['00402016'] = createQueryAttribute('LO');
  }

  // Filler Order Number/Imaging Service Request (0040,2017)
  if (params.fillerOrderNumber !== undefined) {
    query['00402017'] = createQueryAttribute('LO', params.fillerOrderNumber);
  } else {
    query['00402017'] = createQueryAttribute('LO');
  }

  // =========================================================================
  // Requested Procedure Module
  // =========================================================================

  // Study Instance UID (0020,000D)
  if (params.studyInstanceUID !== undefined) {
    query['0020000D'] = createQueryAttribute('UI', params.studyInstanceUID);
  } else {
    query['0020000D'] = createQueryAttribute('UI');
  }

  // Requested Procedure ID (0040,1001)
  if (params.requestedProcedureId !== undefined) {
    query['00401001'] = createQueryAttribute('SH', params.requestedProcedureId);
  } else {
    query['00401001'] = createQueryAttribute('SH');
  }

  // Requested Procedure Description (0032,1060)
  query['00321060'] = createQueryAttribute('LO');

  // Requested Procedure Code Sequence (0032,1064)
  query['00321064'] = createQueryAttribute('SQ');

  // Requested Procedure Priority (0040,1003)
  if (params.requestedProcedurePriority !== undefined) {
    query['00401003'] = createQueryAttribute('SH', params.requestedProcedurePriority);
  } else {
    query['00401003'] = createQueryAttribute('SH');
  }

  // Reason for the Requested Procedure (0040,1002)
  query['00401002'] = createQueryAttribute('LO');

  // Requested Procedure Comments (0040,1400)
  query['00401400'] = createQueryAttribute('LT');

  // =========================================================================
  // Scheduled Procedure Step Sequence (0040,0100)
  // =========================================================================

  const spsItem: DICOMJSONObject = {};

  // Scheduled Station AE Title (0040,0001)
  if (params.scheduledStationAETitle !== undefined) {
    spsItem['00400001'] = createQueryAttribute('AE', params.scheduledStationAETitle);
  } else {
    spsItem['00400001'] = createQueryAttribute('AE');
  }

  // Scheduled Procedure Step Start Date (0040,0002)
  let dateValue: string | undefined;
  if (params.scheduledDateRange) {
    dateValue = buildDateRange(params.scheduledDateRange.start, params.scheduledDateRange.end);
  } else if (params.scheduledProcedureStepStartDate !== undefined) {
    dateValue = params.scheduledProcedureStepStartDate;
  }
  if (dateValue !== undefined) {
    spsItem['00400002'] = createQueryAttribute('DA', dateValue);
  } else {
    spsItem['00400002'] = createQueryAttribute('DA');
  }

  // Scheduled Procedure Step Start Time (0040,0003)
  if (params.scheduledProcedureStepStartTime !== undefined) {
    spsItem['00400003'] = createQueryAttribute('TM', params.scheduledProcedureStepStartTime);
  } else {
    spsItem['00400003'] = createQueryAttribute('TM');
  }

  // Scheduled Procedure Step End Date (0040,0004)
  if (params.scheduledProcedureStepEndDate !== undefined) {
    spsItem['00400004'] = createQueryAttribute('DA', params.scheduledProcedureStepEndDate);
  } else {
    spsItem['00400004'] = createQueryAttribute('DA');
  }

  // Scheduled Procedure Step End Time (0040,0005)
  if (params.scheduledProcedureStepEndTime !== undefined) {
    spsItem['00400005'] = createQueryAttribute('TM', params.scheduledProcedureStepEndTime);
  } else {
    spsItem['00400005'] = createQueryAttribute('TM');
  }

  // Scheduled Performing Physician's Name (0040,0006)
  if (params.scheduledPerformingPhysicianName !== undefined) {
    spsItem['00400006'] = createQueryAttribute('PN', params.scheduledPerformingPhysicianName);
  } else {
    spsItem['00400006'] = createQueryAttribute('PN');
  }

  // Scheduled Procedure Step Description (0040,0007)
  spsItem['00400007'] = createQueryAttribute('LO');

  // Scheduled Protocol Code Sequence (0040,0008)
  spsItem['00400008'] = createQueryAttribute('SQ');

  // Scheduled Procedure Step ID (0040,0009)
  spsItem['00400009'] = createQueryAttribute('SH');

  // Scheduled Station Name (0040,0010)
  if (params.scheduledStationName !== undefined) {
    spsItem['00400010'] = createQueryAttribute('SH', params.scheduledStationName);
  } else {
    spsItem['00400010'] = createQueryAttribute('SH');
  }

  // Scheduled Procedure Step Location (0040,0011)
  spsItem['00400011'] = createQueryAttribute('SH');

  // Modality (0008,0060)
  if (params.modality !== undefined) {
    const modalityValue = Array.isArray(params.modality)
      ? params.modality.join('\\')
      : params.modality;
    spsItem['00080060'] = createQueryAttribute('CS', modalityValue);
  } else {
    spsItem['00080060'] = createQueryAttribute('CS');
  }

  // Scheduled Procedure Step Status (0040,0020)
  if (params.scheduledProcedureStepStatus !== undefined) {
    spsItem['00400020'] = createQueryAttribute('CS', params.scheduledProcedureStepStatus);
  } else {
    spsItem['00400020'] = createQueryAttribute('CS');
  }

  // Add SPS sequence to query
  query['00400100'] = {
    vr: 'SQ',
    Value: [spsItem],
  };

  return query;
}

/**
 * Create a query attribute (empty value for return key, or specific value for matching)
 */
function createQueryAttribute(
  vr: ValueRepresentation,
  value?: string | null
): DICOMJSONAttribute {
  if (value === undefined || value === null) {
    // Return key - request this attribute in response
    return { vr };
  }

  if (vr === 'PN') {
    // Person name as object
    return {
      vr,
      Value: [{ Alphabetic: value }],
    };
  }

  if (vr === 'SQ') {
    // Sequence - empty for return key
    return { vr };
  }

  // String or other value
  return {
    vr,
    Value: [value],
  };
}

/**
 * Build DICOM date range string
 */
function buildDateRange(start?: string, end?: string): string {
  if (start && end) {
    return `${start}-${end}`;
  }
  if (start) {
    return `${start}-`;
  }
  if (end) {
    return `-${end}`;
  }
  return '';
}

// ============================================================================
// MWL Response Parser
// ============================================================================

/**
 * Parse MWL query response into worklist items
 */
export function parseMWLResponse(response: DICOMJSONObject[]): DICOMWorklistItem[] {
  return response.map(parseMWLItem);
}

/**
 * Parse a single MWL response item
 */
export function parseMWLItem(item: DICOMJSONObject): DICOMWorklistItem {
  // Parse patient information
  const patient: DICOMPatient = {
    patientId: getStringValue(item, '00100020') ?? '',
    patientName: getPersonName(item, '00100010'),
    patientBirthDate: getStringValue(item, '00100030'),
    patientSex: getStringValue(item, '00100040') as 'M' | 'F' | 'O' | undefined,
    issuerOfPatientId: getStringValue(item, '00100021'),
  };

  // Parse Scheduled Procedure Step Sequence (first item)
  const spsSequence = item['00400100']?.Value as DICOMJSONObject[] | undefined;
  const sps = spsSequence?.[0] ?? {};

  // Parse Scheduled Protocol Code Sequence
  const protocolSequence = sps['00400008']?.Value as DICOMJSONObject[] | undefined;
  const scheduledProtocolCodes: CodeSequenceItem[] = protocolSequence
    ? protocolSequence.map(parseCodeSequenceItem)
    : [];

  // Parse Requested Procedure Code Sequence
  const requestedCodeSequence = item['00321064']?.Value as DICOMJSONObject[] | undefined;
  const requestedProcedureCodes: CodeSequenceItem[] = requestedCodeSequence
    ? requestedCodeSequence.map(parseCodeSequenceItem)
    : [];

  const worklistItem: DICOMWorklistItem = {
    // Scheduled Procedure Step
    scheduledProcedureStepId: getStringValue(sps, '00400009') ?? '',
    scheduledProcedureStepDescription: getStringValue(sps, '00400007'),
    scheduledProcedureStepStartDate: getStringValue(sps, '00400002') ?? '',
    scheduledProcedureStepStartTime: getStringValue(sps, '00400003'),
    scheduledProcedureStepEndDate: getStringValue(sps, '00400004'),
    scheduledProcedureStepEndTime: getStringValue(sps, '00400005'),
    scheduledPerformingPhysicianName: getPersonName(sps, '00400006'),
    scheduledProtocolCodes,
    scheduledStationAETitle: getStringValue(sps, '00400001'),
    scheduledStationName: getStringValue(sps, '00400010'),
    scheduledProcedureStepLocation: getStringValue(sps, '00400011'),
    scheduledProcedureStepStatus: getStringValue(sps, '00400020') as DICOMWorklistItem['scheduledProcedureStepStatus'],
    modality: (getStringValue(sps, '00080060') ?? 'OT') as ModalityCode,

    // Requested Procedure
    requestedProcedureId: getStringValue(item, '00401001') ?? '',
    requestedProcedureDescription: getStringValue(item, '00321060'),
    requestedProcedureCodes,
    studyInstanceUID: getStringValue(item, '0020000D') ?? '',
    accessionNumber: getStringValue(item, '00080050') ?? '',
    referringPhysicianName: getPersonName(item, '00080090'),
    requestedProcedurePriority: getStringValue(item, '00401003') as DICOMWorklistItem['requestedProcedurePriority'],
    reasonForRequestedProcedure: getStringValue(item, '00401002'),
    requestedProcedureComments: getStringValue(item, '00401400'),

    // Patient
    patient,

    // Visit
    admissionId: getStringValue(item, '00380010'),
    currentPatientLocation: getStringValue(item, '00380300'),

    // Imaging Service Request
    placerOrderNumber: getStringValue(item, '00402016'),
    fillerOrderNumber: getStringValue(item, '00402017'),
  };

  return worklistItem;
}

/**
 * Parse a Code Sequence item
 */
function parseCodeSequenceItem(item: DICOMJSONObject): CodeSequenceItem {
  return {
    codeValue: getStringValue(item, '00080100') ?? '',
    codingSchemeDesignator: getStringValue(item, '00080102') ?? '',
    codeMeaning: getStringValue(item, '00080104') ?? '',
    codingSchemeVersion: getStringValue(item, '00080103'),
  };
}

/**
 * Get string value from DICOM JSON attribute
 */
function getStringValue(obj: DICOMJSONObject, tag: string): string | undefined {
  const attr = obj[tag];
  if (!attr?.Value || attr.Value.length === 0) return undefined;

  const value = attr.Value[0];
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return undefined;
}

/**
 * Get person name from DICOM JSON attribute
 */
function getPersonName(obj: DICOMJSONObject, tag: string): DICOMPersonName | string | undefined {
  const attr = obj[tag];
  if (!attr?.Value || attr.Value.length === 0) return undefined;

  const value = attr.Value[0];
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'Alphabetic' in value) {
    return value as DICOMPersonName;
  }
  return undefined;
}

// ============================================================================
// MPPS (Modality Performed Procedure Step)
// ============================================================================

/**
 * MPPS Status values
 */
export type MPPSStatus = 'IN PROGRESS' | 'COMPLETED' | 'DISCONTINUED';

/**
 * MPPS N-CREATE request data
 */
export interface MPPSCreateRequest {
  /** Performed Procedure Step ID */
  performedProcedureStepId: string;
  /** Performed Station AE Title */
  performedStationAETitle: string;
  /** Performed Station Name */
  performedStationName?: string;
  /** Performed Location */
  performedLocation?: string;
  /** Performed Procedure Step Start Date (YYYYMMDD) */
  performedProcedureStepStartDate: string;
  /** Performed Procedure Step Start Time (HHMMSS) */
  performedProcedureStepStartTime: string;
  /** Performed Procedure Step Status */
  performedProcedureStepStatus: MPPSStatus;
  /** Modality */
  modality: ModalityCode;
  /** Study Instance UID */
  studyInstanceUID: string;
  /** Performed Protocol Codes */
  performedProtocolCodes?: CodeSequenceItem[];
  /** Scheduled Step Attributes */
  scheduledStepAttributesSequence?: ScheduledStepAttributes[];
  /** Patient information */
  patient: DICOMPatient;
  /** Referenced Study Component Sequence */
  referencedStudyComponentSequence?: ReferencedStudyComponent[];
}

/**
 * Scheduled Step Attributes for MPPS
 */
export interface ScheduledStepAttributes {
  studyInstanceUID: string;
  accessionNumber?: string;
  requestedProcedureId?: string;
  requestedProcedureDescription?: string;
  scheduledProcedureStepId?: string;
  scheduledProcedureStepDescription?: string;
  scheduledProtocolCodes?: CodeSequenceItem[];
}

/**
 * Referenced Study Component
 */
export interface ReferencedStudyComponent {
  referencedSOPClassUID: string;
  referencedSOPInstanceUID: string;
}

/**
 * MPPS N-SET (Update) request data
 */
export interface MPPSUpdateRequest {
  /** Performed Procedure Step Status (required for completion) */
  performedProcedureStepStatus?: MPPSStatus;
  /** Performed Procedure Step End Date (YYYYMMDD) */
  performedProcedureStepEndDate?: string;
  /** Performed Procedure Step End Time (HHMMSS) */
  performedProcedureStepEndTime?: string;
  /** Performed Procedure Step Description */
  performedProcedureStepDescription?: string;
  /** Performed Series Sequence */
  performedSeriesSequence?: PerformedSeries[];
  /** Discontinuation Reason Code Sequence (for DISCONTINUED status) */
  discontinuationReasonCodes?: CodeSequenceItem[];
}

/**
 * Performed Series for MPPS update
 */
export interface PerformedSeries {
  seriesInstanceUID: string;
  seriesDescription?: string;
  performingPhysicianName?: DICOMPersonName | string;
  operatorsName?: DICOMPersonName | string;
  protocolName?: string;
  retrieveAETitle?: string;
  referencedImageSequence?: ReferencedImage[];
  referencedNonImageCompositeSequence?: ReferencedImage[];
}

/**
 * Referenced Image
 */
export interface ReferencedImage {
  referencedSOPClassUID: string;
  referencedSOPInstanceUID: string;
}

/**
 * Build DICOM JSON for MPPS N-CREATE
 */
export function buildMPPSCreate(request: MPPSCreateRequest): DICOMJSONObject {
  const mpps: DICOMJSONObject = {};

  // Specific Character Set (0008,0005)
  mpps['00080005'] = { vr: 'CS', Value: ['ISO_IR 100'] };

  // Performed Procedure Step ID (0040,0253)
  mpps['00400253'] = { vr: 'SH', Value: [request.performedProcedureStepId] };

  // Performed Station AE Title (0040,0241)
  mpps['00400241'] = { vr: 'AE', Value: [request.performedStationAETitle] };

  // Performed Station Name (0040,0242)
  if (request.performedStationName) {
    mpps['00400242'] = { vr: 'SH', Value: [request.performedStationName] };
  }

  // Performed Location (0040,0243)
  if (request.performedLocation) {
    mpps['00400243'] = { vr: 'SH', Value: [request.performedLocation] };
  }

  // Performed Procedure Step Start Date (0040,0244)
  mpps['00400244'] = { vr: 'DA', Value: [request.performedProcedureStepStartDate] };

  // Performed Procedure Step Start Time (0040,0245)
  mpps['00400245'] = { vr: 'TM', Value: [request.performedProcedureStepStartTime] };

  // Performed Procedure Step Status (0040,0252)
  mpps['00400252'] = { vr: 'CS', Value: [request.performedProcedureStepStatus] };

  // Modality (0008,0060)
  mpps['00080060'] = { vr: 'CS', Value: [request.modality] };

  // Study Instance UID (0020,000D)
  mpps['0020000D'] = { vr: 'UI', Value: [request.studyInstanceUID] };

  // Performed Protocol Code Sequence (0040,0260)
  if (request.performedProtocolCodes?.length) {
    mpps['00400260'] = {
      vr: 'SQ',
      Value: request.performedProtocolCodes.map(buildCodeSequenceItem),
    };
  }

  // Scheduled Step Attributes Sequence (0040,0270)
  if (request.scheduledStepAttributesSequence?.length) {
    mpps['00400270'] = {
      vr: 'SQ',
      Value: request.scheduledStepAttributesSequence.map(buildScheduledStepAttributes),
    };
  }

  // Patient Module
  mpps['00100020'] = { vr: 'LO', Value: [request.patient.patientId] };
  if (request.patient.patientName) {
    const pn = typeof request.patient.patientName === 'string'
      ? request.patient.patientName
      : request.patient.patientName.Alphabetic;
    if (pn) {
      mpps['00100010'] = { vr: 'PN', Value: [{ Alphabetic: pn }] };
    }
  }
  if (request.patient.patientBirthDate) {
    mpps['00100030'] = { vr: 'DA', Value: [request.patient.patientBirthDate] };
  }
  if (request.patient.patientSex) {
    mpps['00100040'] = { vr: 'CS', Value: [request.patient.patientSex] };
  }

  // Performed Series Sequence (0040,0340) - empty at creation
  mpps['00400340'] = { vr: 'SQ', Value: [] };

  return mpps;
}

/**
 * Build DICOM JSON for MPPS N-SET (update)
 */
export function buildMPPSUpdate(request: MPPSUpdateRequest): DICOMJSONObject {
  const mpps: DICOMJSONObject = {};

  // Performed Procedure Step Status (0040,0252)
  if (request.performedProcedureStepStatus) {
    mpps['00400252'] = { vr: 'CS', Value: [request.performedProcedureStepStatus] };
  }

  // Performed Procedure Step End Date (0040,0250)
  if (request.performedProcedureStepEndDate) {
    mpps['00400250'] = { vr: 'DA', Value: [request.performedProcedureStepEndDate] };
  }

  // Performed Procedure Step End Time (0040,0251)
  if (request.performedProcedureStepEndTime) {
    mpps['00400251'] = { vr: 'TM', Value: [request.performedProcedureStepEndTime] };
  }

  // Performed Procedure Step Description (0040,0254)
  if (request.performedProcedureStepDescription) {
    mpps['00400254'] = { vr: 'LO', Value: [request.performedProcedureStepDescription] };
  }

  // Performed Series Sequence (0040,0340)
  if (request.performedSeriesSequence?.length) {
    mpps['00400340'] = {
      vr: 'SQ',
      Value: request.performedSeriesSequence.map(buildPerformedSeriesItem),
    };
  }

  // Procedure Step Discontinuation Reason Code Sequence (0040,0281)
  if (request.discontinuationReasonCodes?.length) {
    mpps['00400281'] = {
      vr: 'SQ',
      Value: request.discontinuationReasonCodes.map(buildCodeSequenceItem),
    };
  }

  return mpps;
}

/**
 * Build Code Sequence Item JSON
 */
function buildCodeSequenceItem(code: CodeSequenceItem): DICOMJSONObject {
  const item: DICOMJSONObject = {
    '00080100': { vr: 'SH', Value: [code.codeValue] },
    '00080102': { vr: 'SH', Value: [code.codingSchemeDesignator] },
    '00080104': { vr: 'LO', Value: [code.codeMeaning] },
  };

  if (code.codingSchemeVersion) {
    item['00080103'] = { vr: 'SH', Value: [code.codingSchemeVersion] };
  }

  return item;
}

/**
 * Build Scheduled Step Attributes Item
 */
function buildScheduledStepAttributes(attrs: ScheduledStepAttributes): DICOMJSONObject {
  const item: DICOMJSONObject = {
    '0020000D': { vr: 'UI', Value: [attrs.studyInstanceUID] },
  };

  if (attrs.accessionNumber) {
    item['00080050'] = { vr: 'SH', Value: [attrs.accessionNumber] };
  }
  if (attrs.requestedProcedureId) {
    item['00401001'] = { vr: 'SH', Value: [attrs.requestedProcedureId] };
  }
  if (attrs.requestedProcedureDescription) {
    item['00321060'] = { vr: 'LO', Value: [attrs.requestedProcedureDescription] };
  }
  if (attrs.scheduledProcedureStepId) {
    item['00400009'] = { vr: 'SH', Value: [attrs.scheduledProcedureStepId] };
  }
  if (attrs.scheduledProcedureStepDescription) {
    item['00400007'] = { vr: 'LO', Value: [attrs.scheduledProcedureStepDescription] };
  }
  if (attrs.scheduledProtocolCodes?.length) {
    item['00400008'] = {
      vr: 'SQ',
      Value: attrs.scheduledProtocolCodes.map(buildCodeSequenceItem),
    };
  }

  return item;
}

/**
 * Build Performed Series Item
 */
function buildPerformedSeriesItem(series: PerformedSeries): DICOMJSONObject {
  const item: DICOMJSONObject = {
    '0020000E': { vr: 'UI', Value: [series.seriesInstanceUID] },
  };

  if (series.seriesDescription) {
    item['0008103E'] = { vr: 'LO', Value: [series.seriesDescription] };
  }
  if (series.performingPhysicianName) {
    const pn = typeof series.performingPhysicianName === 'string'
      ? series.performingPhysicianName
      : series.performingPhysicianName.Alphabetic;
    if (pn) {
      item['00081050'] = { vr: 'PN', Value: [{ Alphabetic: pn }] };
    }
  }
  if (series.operatorsName) {
    const on = typeof series.operatorsName === 'string'
      ? series.operatorsName
      : series.operatorsName.Alphabetic;
    if (on) {
      item['00081070'] = { vr: 'PN', Value: [{ Alphabetic: on }] };
    }
  }
  if (series.protocolName) {
    item['00181030'] = { vr: 'LO', Value: [series.protocolName] };
  }
  if (series.retrieveAETitle) {
    item['00080054'] = { vr: 'AE', Value: [series.retrieveAETitle] };
  }

  // Referenced Image Sequence (0008,1140)
  if (series.referencedImageSequence?.length) {
    item['00081140'] = {
      vr: 'SQ',
      Value: series.referencedImageSequence.map((img) => ({
        '00081150': { vr: 'UI', Value: [img.referencedSOPClassUID] },
        '00081155': { vr: 'UI', Value: [img.referencedSOPInstanceUID] },
      })) as any[],
    };
  }

  // Referenced Non-Image Composite SOP Instance Sequence (0040,0220)
  if (series.referencedNonImageCompositeSequence?.length) {
    item['00400220'] = {
      vr: 'SQ',
      Value: series.referencedNonImageCompositeSequence.map((ref) => ({
        '00081150': { vr: 'UI', Value: [ref.referencedSOPClassUID] },
        '00081155': { vr: 'UI', Value: [ref.referencedSOPInstanceUID] },
      })) as any[],
    };
  }

  return item;
}

// ============================================================================
// Worklist Utilities
// ============================================================================

/**
 * Generate a unique Study Instance UID
 * Format: root.datetime.random
 */
export function generateStudyInstanceUID(organizationRoot: string = '2.25'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `${organizationRoot}.${timestamp}.${random}`;
}

/**
 * Generate a unique SOP Instance UID
 */
export function generateSOPInstanceUID(organizationRoot: string = '2.25'): string {
  const timestamp = Date.now();
  const random1 = Math.floor(Math.random() * 1000000);
  const random2 = Math.floor(Math.random() * 1000000);
  return `${organizationRoot}.${timestamp}.${random1}.${random2}`;
}

/**
 * Generate a unique Series Instance UID
 */
export function generateSeriesInstanceUID(organizationRoot: string = '2.25'): string {
  return generateSOPInstanceUID(organizationRoot);
}

/**
 * Format current date as DICOM DA (YYYYMMDD)
 */
export function getCurrentDICOMDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Format current time as DICOM TM (HHMMSS.FFFFFF)
 */
export function getCurrentDICOMTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  return `${hours}${minutes}${seconds}.${milliseconds}000`;
}

/**
 * Validate DICOM date format (YYYYMMDD)
 */
export function isValidDICOMDate(date: string): boolean {
  if (!/^\d{8}$/.test(date)) return false;

  const year = parseInt(date.substring(0, 4), 10);
  const month = parseInt(date.substring(4, 6), 10);
  const day = parseInt(date.substring(6, 8), 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Basic validation - could be more sophisticated
  const daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth;
}

/**
 * Validate DICOM time format (HHMMSS or HHMMSS.FFFFFF)
 */
export function isValidDICOMTime(time: string): boolean {
  if (!/^\d{6}(\.\d{1,6})?$/.test(time)) return false;

  const hours = parseInt(time.substring(0, 2), 10);
  const minutes = parseInt(time.substring(2, 4), 10);
  const seconds = parseInt(time.substring(4, 6), 10);

  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59;
}

/**
 * Filter worklist items by criteria
 */
export function filterWorklistItems(
  items: DICOMWorklistItem[],
  filter: {
    modality?: ModalityCode | ModalityCode[];
    status?: DICOMWorklistItem['scheduledProcedureStepStatus'] | DICOMWorklistItem['scheduledProcedureStepStatus'][];
    dateRange?: { start?: Date; end?: Date };
    stationAETitle?: string;
  }
): DICOMWorklistItem[] {
  return items.filter((item) => {
    // Filter by modality
    if (filter.modality) {
      const modalities = Array.isArray(filter.modality) ? filter.modality : [filter.modality];
      if (!modalities.includes(item.modality)) return false;
    }

    // Filter by status
    if (filter.status) {
      const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
      if (item.scheduledProcedureStepStatus && !statuses.includes(item.scheduledProcedureStepStatus)) {
        return false;
      }
    }

    // Filter by date range
    if (filter.dateRange) {
      const itemDate = item.scheduledProcedureStepStartDate;
      if (itemDate) {
        const year = parseInt(itemDate.substring(0, 4), 10);
        const month = parseInt(itemDate.substring(4, 6), 10) - 1;
        const day = parseInt(itemDate.substring(6, 8), 10);
        const date = new Date(year, month, day);

        if (filter.dateRange.start && date < filter.dateRange.start) return false;
        if (filter.dateRange.end && date > filter.dateRange.end) return false;
      }
    }

    // Filter by station AE Title
    if (filter.stationAETitle) {
      if (item.scheduledStationAETitle !== filter.stationAETitle) return false;
    }

    return true;
  });
}

/**
 * Sort worklist items
 */
export function sortWorklistItems(
  items: DICOMWorklistItem[],
  sortBy: 'date' | 'time' | 'patientName' | 'accessionNumber' | 'priority',
  order: 'asc' | 'desc' = 'asc'
): DICOMWorklistItem[] {
  const sorted = [...items].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = (a.scheduledProcedureStepStartDate ?? '').localeCompare(
          b.scheduledProcedureStepStartDate ?? ''
        );
        break;

      case 'time':
        comparison = (a.scheduledProcedureStepStartTime ?? '').localeCompare(
          b.scheduledProcedureStepStartTime ?? ''
        );
        break;

      case 'patientName':
        const nameA = typeof a.patient.patientName === 'string'
          ? a.patient.patientName
          : a.patient.patientName?.Alphabetic ?? '';
        const nameB = typeof b.patient.patientName === 'string'
          ? b.patient.patientName
          : b.patient.patientName?.Alphabetic ?? '';
        comparison = nameA.localeCompare(nameB);
        break;

      case 'accessionNumber':
        comparison = (a.accessionNumber ?? '').localeCompare(b.accessionNumber ?? '');
        break;

      case 'priority':
        const priorityOrder: Record<string, number> = {
          'STAT': 0,
          'HIGH': 1,
          'ROUTINE': 2,
          'MEDIUM': 3,
          'LOW': 4,
        };
        const priorityA = priorityOrder[a.requestedProcedurePriority ?? 'ROUTINE'] ?? 2;
        const priorityB = priorityOrder[b.requestedProcedurePriority ?? 'ROUTINE'] ?? 2;
        comparison = priorityA - priorityB;
        break;
    }

    return order === 'desc' ? -comparison : comparison;
  });

  return sorted;
}
