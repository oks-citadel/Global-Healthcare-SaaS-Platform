/**
 * DICOM Tag Definitions
 *
 * Based on DICOM PS3.6 Data Dictionary
 * https://dicom.nema.org/medical/dicom/current/output/html/part06.html
 */

import { DICOMTag, ValueRepresentation } from './types';

// ============================================================================
// Tag Format Utilities
// ============================================================================

/**
 * Convert tag from (XXXX,XXXX) format to XXXXXXXX format
 */
export function normalizeTag(tag: string): string {
  // Remove parentheses and comma
  return tag.replace(/[(),]/g, '').toUpperCase();
}

/**
 * Convert tag from XXXXXXXX format to (XXXX,XXXX) format
 */
export function formatTag(tag: string): string {
  const normalized = normalizeTag(tag);
  return `(${normalized.slice(0, 4)},${normalized.slice(4)})`;
}

/**
 * Get tag group (first 4 hex digits)
 */
export function getTagGroup(tag: string): string {
  return normalizeTag(tag).slice(0, 4);
}

/**
 * Get tag element (last 4 hex digits)
 */
export function getTagElement(tag: string): string {
  return normalizeTag(tag).slice(4);
}

/**
 * Check if tag is a private tag (odd group number)
 */
export function isPrivateTag(tag: string): boolean {
  const group = parseInt(getTagGroup(tag), 16);
  return group % 2 === 1;
}

/**
 * Check if tag is a group length tag (element 0000)
 */
export function isGroupLengthTag(tag: string): boolean {
  return getTagElement(tag) === '0000';
}

// ============================================================================
// Patient-Level Tags (Group 0010)
// ============================================================================

export const PatientTags = {
  // Patient Identification
  PatientName: {
    tag: '(0010,0010)',
    keyword: 'PatientName',
    vr: 'PN' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s full name',
  },
  PatientID: {
    tag: '(0010,0020)',
    keyword: 'PatientID',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Primary identifier for the patient',
  },
  IssuerOfPatientID: {
    tag: '(0010,0021)',
    keyword: 'IssuerOfPatientID',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Identifier of the Assigning Authority that issued the Patient ID',
  },
  TypeOfPatientID: {
    tag: '(0010,0022)',
    keyword: 'TypeOfPatientID',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Type of Patient ID',
  },
  IssuerOfPatientIDQualifiersSequence: {
    tag: '(0010,0024)',
    keyword: 'IssuerOfPatientIDQualifiersSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Attributes specifying the issuer of the Patient ID',
  },
  OtherPatientIDs: {
    tag: '(0010,1000)',
    keyword: 'OtherPatientIDs',
    vr: 'LO' as ValueRepresentation,
    vm: '1-n',
    description: 'Other identifiers used to identify the patient',
    retired: true,
  },
  OtherPatientIDsSequence: {
    tag: '(0010,1002)',
    keyword: 'OtherPatientIDsSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Sequence of other patient identifiers',
  },
  OtherPatientNames: {
    tag: '(0010,1001)',
    keyword: 'OtherPatientNames',
    vr: 'PN' as ValueRepresentation,
    vm: '1-n',
    description: 'Other names for the patient',
  },

  // Patient Demographics
  PatientBirthDate: {
    tag: '(0010,0030)',
    keyword: 'PatientBirthDate',
    vr: 'DA' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s date of birth',
  },
  PatientBirthTime: {
    tag: '(0010,0032)',
    keyword: 'PatientBirthTime',
    vr: 'TM' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s time of birth',
  },
  PatientSex: {
    tag: '(0010,0040)',
    keyword: 'PatientSex',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s sex: M, F, or O',
  },
  PatientAge: {
    tag: '(0010,1010)',
    keyword: 'PatientAge',
    vr: 'AS' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s age at the time of the study',
  },
  PatientSize: {
    tag: '(0010,1020)',
    keyword: 'PatientSize',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s height in meters',
  },
  PatientWeight: {
    tag: '(0010,1030)',
    keyword: 'PatientWeight',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s weight in kilograms',
  },
  PatientBodyMassIndex: {
    tag: '(0010,1022)',
    keyword: 'PatientBodyMassIndex',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s Body Mass Index',
  },
  EthnicGroup: {
    tag: '(0010,2160)',
    keyword: 'EthnicGroup',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s ethnic group',
  },

  // Patient Address/Contact
  PatientAddress: {
    tag: '(0010,1040)',
    keyword: 'PatientAddress',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s street address',
  },
  PatientTelephoneNumbers: {
    tag: '(0010,2154)',
    keyword: 'PatientTelephoneNumbers',
    vr: 'SH' as ValueRepresentation,
    vm: '1-n',
    description: 'Patient\'s telephone numbers',
  },
  CountryOfResidence: {
    tag: '(0010,2150)',
    keyword: 'CountryOfResidence',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Country in which patient resides',
  },
  RegionOfResidence: {
    tag: '(0010,2152)',
    keyword: 'RegionOfResidence',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Region in which patient resides',
  },

  // Patient Comments
  PatientComments: {
    tag: '(0010,4000)',
    keyword: 'PatientComments',
    vr: 'LT' as ValueRepresentation,
    vm: '1',
    description: 'Comments about the patient',
  },

  // Patient Insurance
  PatientInsurancePlanCodeSequence: {
    tag: '(0010,0050)',
    keyword: 'PatientInsurancePlanCodeSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s insurance plan code sequence',
  },

  // Patient Medical
  PregnancyStatus: {
    tag: '(0010,21C0)',
    keyword: 'PregnancyStatus',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: 'Pregnancy status: 1=not pregnant, 2=possibly pregnant, 3=definitely pregnant, 4=unknown',
  },
  LastMenstrualDate: {
    tag: '(0010,21D0)',
    keyword: 'LastMenstrualDate',
    vr: 'DA' as ValueRepresentation,
    vm: '1',
    description: 'Date of last menstrual period',
  },
  SmokingStatus: {
    tag: '(0010,21A0)',
    keyword: 'SmokingStatus',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s smoking status',
  },
  AdditionalPatientHistory: {
    tag: '(0010,21B0)',
    keyword: 'AdditionalPatientHistory',
    vr: 'LT' as ValueRepresentation,
    vm: '1',
    description: 'Additional patient history',
  },
  PatientSpeciesDescription: {
    tag: '(0010,2201)',
    keyword: 'PatientSpeciesDescription',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Species of the patient (for veterinary)',
  },
  PatientBreedDescription: {
    tag: '(0010,2292)',
    keyword: 'PatientBreedDescription',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Breed of the patient (for veterinary)',
  },
  ResponsiblePerson: {
    tag: '(0010,2297)',
    keyword: 'ResponsiblePerson',
    vr: 'PN' as ValueRepresentation,
    vm: '1',
    description: 'Name of person responsible for patient (for pediatric/veterinary)',
  },
  ResponsibleOrganization: {
    tag: '(0010,2299)',
    keyword: 'ResponsibleOrganization',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Organization responsible for patient',
  },
} as const;

// ============================================================================
// Study-Level Tags (Group 0008 and 0020)
// ============================================================================

export const StudyTags = {
  // Study Identification
  StudyInstanceUID: {
    tag: '(0020,000D)',
    keyword: 'StudyInstanceUID',
    vr: 'UI' as ValueRepresentation,
    vm: '1',
    description: 'Unique identifier for the study',
  },
  StudyID: {
    tag: '(0020,0010)',
    keyword: 'StudyID',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'User or equipment generated study identifier',
  },
  StudyDate: {
    tag: '(0008,0020)',
    keyword: 'StudyDate',
    vr: 'DA' as ValueRepresentation,
    vm: '1',
    description: 'Date the study started',
  },
  StudyTime: {
    tag: '(0008,0030)',
    keyword: 'StudyTime',
    vr: 'TM' as ValueRepresentation,
    vm: '1',
    description: 'Time the study started',
  },
  StudyDescription: {
    tag: '(0008,1030)',
    keyword: 'StudyDescription',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Description of the study',
  },
  AccessionNumber: {
    tag: '(0008,0050)',
    keyword: 'AccessionNumber',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'RIS-generated number that identifies the order',
  },
  IssuerOfAccessionNumberSequence: {
    tag: '(0008,0051)',
    keyword: 'IssuerOfAccessionNumberSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Identifier of the Assigning Authority that issued the Accession Number',
  },

  // Study Referring/Reading Physicians
  ReferringPhysicianName: {
    tag: '(0008,0090)',
    keyword: 'ReferringPhysicianName',
    vr: 'PN' as ValueRepresentation,
    vm: '1',
    description: 'Name of the referring physician',
  },
  ReferringPhysicianIdentificationSequence: {
    tag: '(0008,0096)',
    keyword: 'ReferringPhysicianIdentificationSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Identification of the referring physician',
  },
  NameOfPhysiciansReadingStudy: {
    tag: '(0008,1060)',
    keyword: 'NameOfPhysiciansReadingStudy',
    vr: 'PN' as ValueRepresentation,
    vm: '1-n',
    description: 'Names of physicians reading the study',
  },
  PhysiciansReadingStudyIdentificationSequence: {
    tag: '(0008,1062)',
    keyword: 'PhysiciansReadingStudyIdentificationSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Identification of physicians reading the study',
  },
  PhysiciansOfRecord: {
    tag: '(0008,1048)',
    keyword: 'PhysiciansOfRecord',
    vr: 'PN' as ValueRepresentation,
    vm: '1-n',
    description: 'Physicians of record for the study',
  },

  // Study Procedure
  ProcedureCodeSequence: {
    tag: '(0008,1032)',
    keyword: 'ProcedureCodeSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Procedure code sequence',
  },
  ReasonForStudy: {
    tag: '(0032,1030)',
    keyword: 'ReasonForStudy',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Reason for the study',
    retired: true,
  },
  ReasonForPerformedProcedureCodeSequence: {
    tag: '(0040,1012)',
    keyword: 'ReasonForPerformedProcedureCodeSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Coded reason for performed procedure',
  },
  RequestingService: {
    tag: '(0032,1033)',
    keyword: 'RequestingService',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Requesting service or department',
  },
  RequestingPhysician: {
    tag: '(0032,1032)',
    keyword: 'RequestingPhysician',
    vr: 'PN' as ValueRepresentation,
    vm: '1',
    description: 'Physician requesting the procedure',
  },

  // Study Institution
  InstitutionName: {
    tag: '(0008,0080)',
    keyword: 'InstitutionName',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Name of the institution where study was performed',
  },
  InstitutionAddress: {
    tag: '(0008,0081)',
    keyword: 'InstitutionAddress',
    vr: 'ST' as ValueRepresentation,
    vm: '1',
    description: 'Address of the institution',
  },
  InstitutionalDepartmentName: {
    tag: '(0008,1040)',
    keyword: 'InstitutionalDepartmentName',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Department in the institution where study was performed',
  },

  // Study Counts
  NumberOfStudyRelatedSeries: {
    tag: '(0020,1206)',
    keyword: 'NumberOfStudyRelatedSeries',
    vr: 'IS' as ValueRepresentation,
    vm: '1',
    description: 'Number of series in the study',
  },
  NumberOfStudyRelatedInstances: {
    tag: '(0020,1208)',
    keyword: 'NumberOfStudyRelatedInstances',
    vr: 'IS' as ValueRepresentation,
    vm: '1',
    description: 'Number of instances in the study',
  },
  ModalitiesInStudy: {
    tag: '(0008,0061)',
    keyword: 'ModalitiesInStudy',
    vr: 'CS' as ValueRepresentation,
    vm: '1-n',
    description: 'All modalities in the study',
  },
  SOPClassesInStudy: {
    tag: '(0008,0062)',
    keyword: 'SOPClassesInStudy',
    vr: 'UI' as ValueRepresentation,
    vm: '1-n',
    description: 'All SOP Classes in the study',
  },

  // Study Comments
  StudyComments: {
    tag: '(0032,4000)',
    keyword: 'StudyComments',
    vr: 'LT' as ValueRepresentation,
    vm: '1',
    description: 'Comments about the study',
    retired: true,
  },

  // Study Priority/Status
  StudyPriorityID: {
    tag: '(0032,000C)',
    keyword: 'StudyPriorityID',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Study priority',
    retired: true,
  },
  StudyStatusID: {
    tag: '(0032,000A)',
    keyword: 'StudyStatusID',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Study status',
    retired: true,
  },
} as const;

// ============================================================================
// Series-Level Tags (Group 0008 and 0020)
// ============================================================================

export const SeriesTags = {
  // Series Identification
  SeriesInstanceUID: {
    tag: '(0020,000E)',
    keyword: 'SeriesInstanceUID',
    vr: 'UI' as ValueRepresentation,
    vm: '1',
    description: 'Unique identifier for the series',
  },
  SeriesNumber: {
    tag: '(0020,0011)',
    keyword: 'SeriesNumber',
    vr: 'IS' as ValueRepresentation,
    vm: '1',
    description: 'Number identifying the series',
  },
  SeriesDate: {
    tag: '(0008,0021)',
    keyword: 'SeriesDate',
    vr: 'DA' as ValueRepresentation,
    vm: '1',
    description: 'Date the series started',
  },
  SeriesTime: {
    tag: '(0008,0031)',
    keyword: 'SeriesTime',
    vr: 'TM' as ValueRepresentation,
    vm: '1',
    description: 'Time the series started',
  },
  SeriesDescription: {
    tag: '(0008,103E)',
    keyword: 'SeriesDescription',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Description of the series',
  },
  Modality: {
    tag: '(0008,0060)',
    keyword: 'Modality',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Type of equipment that acquired the data',
  },

  // Series Performer
  PerformingPhysicianName: {
    tag: '(0008,1050)',
    keyword: 'PerformingPhysicianName',
    vr: 'PN' as ValueRepresentation,
    vm: '1-n',
    description: 'Name of physician(s) performing the procedure',
  },
  PerformingPhysicianIdentificationSequence: {
    tag: '(0008,1052)',
    keyword: 'PerformingPhysicianIdentificationSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Identification of the performing physician',
  },
  OperatorsName: {
    tag: '(0008,1070)',
    keyword: 'OperatorsName',
    vr: 'PN' as ValueRepresentation,
    vm: '1-n',
    description: 'Name(s) of the operator(s)',
  },
  OperatorIdentificationSequence: {
    tag: '(0008,1072)',
    keyword: 'OperatorIdentificationSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Identification of the operator',
  },

  // Series Anatomy
  BodyPartExamined: {
    tag: '(0018,0015)',
    keyword: 'BodyPartExamined',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Body part examined',
  },
  Laterality: {
    tag: '(0020,0060)',
    keyword: 'Laterality',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Laterality of body part: L, R, or blank',
  },
  PatientPosition: {
    tag: '(0018,5100)',
    keyword: 'PatientPosition',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Patient position during acquisition',
  },
  AnatomicalOrientationType: {
    tag: '(0010,2210)',
    keyword: 'AnatomicalOrientationType',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Type of anatomical orientation (BIPED, QUADRUPED)',
  },

  // Series Protocol
  ProtocolName: {
    tag: '(0018,1030)',
    keyword: 'ProtocolName',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'User-defined name for the protocol used',
  },
  SeriesDescriptionCodeSequence: {
    tag: '(0008,103F)',
    keyword: 'SeriesDescriptionCodeSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Coded description of the series',
  },

  // Series Equipment
  Manufacturer: {
    tag: '(0008,0070)',
    keyword: 'Manufacturer',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Manufacturer of the equipment',
  },
  ManufacturerModelName: {
    tag: '(0008,1090)',
    keyword: 'ManufacturerModelName',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Model name of the equipment',
  },
  StationName: {
    tag: '(0008,1010)',
    keyword: 'StationName',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'User-defined name for the equipment',
  },
  DeviceSerialNumber: {
    tag: '(0018,1000)',
    keyword: 'DeviceSerialNumber',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Serial number of the equipment',
  },
  SoftwareVersions: {
    tag: '(0018,1020)',
    keyword: 'SoftwareVersions',
    vr: 'LO' as ValueRepresentation,
    vm: '1-n',
    description: 'Software versions of the equipment',
  },

  // Series Counts
  NumberOfSeriesRelatedInstances: {
    tag: '(0020,1209)',
    keyword: 'NumberOfSeriesRelatedInstances',
    vr: 'IS' as ValueRepresentation,
    vm: '1',
    description: 'Number of instances in the series',
  },

  // Series Timing
  PerformedProcedureStepStartDate: {
    tag: '(0040,0244)',
    keyword: 'PerformedProcedureStepStartDate',
    vr: 'DA' as ValueRepresentation,
    vm: '1',
    description: 'Date the procedure step started',
  },
  PerformedProcedureStepStartTime: {
    tag: '(0040,0245)',
    keyword: 'PerformedProcedureStepStartTime',
    vr: 'TM' as ValueRepresentation,
    vm: '1',
    description: 'Time the procedure step started',
  },
  PerformedProcedureStepEndDate: {
    tag: '(0040,0250)',
    keyword: 'PerformedProcedureStepEndDate',
    vr: 'DA' as ValueRepresentation,
    vm: '1',
    description: 'Date the procedure step ended',
  },
  PerformedProcedureStepEndTime: {
    tag: '(0040,0251)',
    keyword: 'PerformedProcedureStepEndTime',
    vr: 'TM' as ValueRepresentation,
    vm: '1',
    description: 'Time the procedure step ended',
  },
  PerformedProcedureStepID: {
    tag: '(0040,0253)',
    keyword: 'PerformedProcedureStepID',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'Identifier for the procedure step',
  },
  PerformedProcedureStepDescription: {
    tag: '(0040,0254)',
    keyword: 'PerformedProcedureStepDescription',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Description of the procedure step',
  },
} as const;

// ============================================================================
// Instance-Level Tags (SOP Common Module)
// ============================================================================

export const InstanceTags = {
  // SOP Common
  SOPClassUID: {
    tag: '(0008,0016)',
    keyword: 'SOPClassUID',
    vr: 'UI' as ValueRepresentation,
    vm: '1',
    description: 'Unique identifier for the SOP Class',
  },
  SOPInstanceUID: {
    tag: '(0008,0018)',
    keyword: 'SOPInstanceUID',
    vr: 'UI' as ValueRepresentation,
    vm: '1',
    description: 'Unique identifier for the SOP Instance',
  },
  InstanceNumber: {
    tag: '(0020,0013)',
    keyword: 'InstanceNumber',
    vr: 'IS' as ValueRepresentation,
    vm: '1',
    description: 'Number identifying the instance',
  },
  InstanceCreationDate: {
    tag: '(0008,0012)',
    keyword: 'InstanceCreationDate',
    vr: 'DA' as ValueRepresentation,
    vm: '1',
    description: 'Date the instance was created',
  },
  InstanceCreationTime: {
    tag: '(0008,0013)',
    keyword: 'InstanceCreationTime',
    vr: 'TM' as ValueRepresentation,
    vm: '1',
    description: 'Time the instance was created',
  },
  ContentDate: {
    tag: '(0008,0023)',
    keyword: 'ContentDate',
    vr: 'DA' as ValueRepresentation,
    vm: '1',
    description: 'Date the content was created',
  },
  ContentTime: {
    tag: '(0008,0033)',
    keyword: 'ContentTime',
    vr: 'TM' as ValueRepresentation,
    vm: '1',
    description: 'Time the content was created',
  },
  AcquisitionDate: {
    tag: '(0008,0022)',
    keyword: 'AcquisitionDate',
    vr: 'DA' as ValueRepresentation,
    vm: '1',
    description: 'Date the acquisition started',
  },
  AcquisitionTime: {
    tag: '(0008,0032)',
    keyword: 'AcquisitionTime',
    vr: 'TM' as ValueRepresentation,
    vm: '1',
    description: 'Time the acquisition started',
  },
  AcquisitionDateTime: {
    tag: '(0008,002A)',
    keyword: 'AcquisitionDateTime',
    vr: 'DT' as ValueRepresentation,
    vm: '1',
    description: 'DateTime the acquisition started',
  },
  AcquisitionNumber: {
    tag: '(0020,0012)',
    keyword: 'AcquisitionNumber',
    vr: 'IS' as ValueRepresentation,
    vm: '1',
    description: 'Number identifying the acquisition',
  },

  // Image Type
  ImageType: {
    tag: '(0008,0008)',
    keyword: 'ImageType',
    vr: 'CS' as ValueRepresentation,
    vm: '2-n',
    description: 'Image characteristics (e.g., ORIGINAL/DERIVED, PRIMARY/SECONDARY)',
  },

  // Transfer Syntax
  TransferSyntaxUID: {
    tag: '(0002,0010)',
    keyword: 'TransferSyntaxUID',
    vr: 'UI' as ValueRepresentation,
    vm: '1',
    description: 'Transfer Syntax used to encode the instance',
  },

  // Specific Character Set
  SpecificCharacterSet: {
    tag: '(0008,0005)',
    keyword: 'SpecificCharacterSet',
    vr: 'CS' as ValueRepresentation,
    vm: '1-n',
    description: 'Character Set used for character data',
  },

  // Instance Coercion
  InstanceCoercionDateTime: {
    tag: '(0008,0015)',
    keyword: 'InstanceCoercionDateTime',
    vr: 'DT' as ValueRepresentation,
    vm: '1',
    description: 'DateTime of last coercion',
  },

  // Timezone
  TimezoneOffsetFromUTC: {
    tag: '(0008,0201)',
    keyword: 'TimezoneOffsetFromUTC',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'Timezone offset in format +/-HHMM',
  },
} as const;

// ============================================================================
// Image Pixel Module Tags (Group 0028)
// ============================================================================

export const ImagePixelTags = {
  SamplesPerPixel: {
    tag: '(0028,0002)',
    keyword: 'SamplesPerPixel',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: 'Number of samples per pixel',
  },
  PhotometricInterpretation: {
    tag: '(0028,0004)',
    keyword: 'PhotometricInterpretation',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Intended interpretation of pixel data',
  },
  Rows: {
    tag: '(0028,0010)',
    keyword: 'Rows',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: 'Number of rows in the image',
  },
  Columns: {
    tag: '(0028,0011)',
    keyword: 'Columns',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: 'Number of columns in the image',
  },
  BitsAllocated: {
    tag: '(0028,0100)',
    keyword: 'BitsAllocated',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: 'Number of bits allocated per pixel',
  },
  BitsStored: {
    tag: '(0028,0101)',
    keyword: 'BitsStored',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: 'Number of bits stored per pixel',
  },
  HighBit: {
    tag: '(0028,0102)',
    keyword: 'HighBit',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: 'Most significant bit for pixel data',
  },
  PixelRepresentation: {
    tag: '(0028,0103)',
    keyword: 'PixelRepresentation',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: '0=unsigned, 1=signed pixel values',
  },
  PlanarConfiguration: {
    tag: '(0028,0006)',
    keyword: 'PlanarConfiguration',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: 'How color samples are encoded',
  },
  NumberOfFrames: {
    tag: '(0028,0008)',
    keyword: 'NumberOfFrames',
    vr: 'IS' as ValueRepresentation,
    vm: '1',
    description: 'Number of frames in a multi-frame image',
  },
  PixelData: {
    tag: '(7FE0,0010)',
    keyword: 'PixelData',
    vr: 'OW' as ValueRepresentation,
    vm: '1',
    description: 'Pixel data',
  },
  PixelAspectRatio: {
    tag: '(0028,0034)',
    keyword: 'PixelAspectRatio',
    vr: 'IS' as ValueRepresentation,
    vm: '2',
    description: 'Ratio of vertical to horizontal pixel spacing',
  },
  SmallestImagePixelValue: {
    tag: '(0028,0106)',
    keyword: 'SmallestImagePixelValue',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: 'Smallest pixel value in the image',
  },
  LargestImagePixelValue: {
    tag: '(0028,0107)',
    keyword: 'LargestImagePixelValue',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: 'Largest pixel value in the image',
  },

  // VOI LUT
  WindowCenter: {
    tag: '(0028,1050)',
    keyword: 'WindowCenter',
    vr: 'DS' as ValueRepresentation,
    vm: '1-n',
    description: 'Window center for display',
  },
  WindowWidth: {
    tag: '(0028,1051)',
    keyword: 'WindowWidth',
    vr: 'DS' as ValueRepresentation,
    vm: '1-n',
    description: 'Window width for display',
  },
  WindowCenterWidthExplanation: {
    tag: '(0028,1055)',
    keyword: 'WindowCenterWidthExplanation',
    vr: 'LO' as ValueRepresentation,
    vm: '1-n',
    description: 'Explanation of window center/width values',
  },
  RescaleIntercept: {
    tag: '(0028,1052)',
    keyword: 'RescaleIntercept',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Rescale intercept for modality LUT',
  },
  RescaleSlope: {
    tag: '(0028,1053)',
    keyword: 'RescaleSlope',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Rescale slope for modality LUT',
  },
  RescaleType: {
    tag: '(0028,1054)',
    keyword: 'RescaleType',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Units of output values',
  },
} as const;

// ============================================================================
// Modality-Specific Tags
// ============================================================================

export const CTImageTags = {
  KVP: {
    tag: '(0018,0060)',
    keyword: 'KVP',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Peak kilo voltage output of the X-Ray generator',
  },
  XRayTubeCurrent: {
    tag: '(0018,1151)',
    keyword: 'XRayTubeCurrent',
    vr: 'IS' as ValueRepresentation,
    vm: '1',
    description: 'X-Ray tube current in mA',
  },
  ExposureTime: {
    tag: '(0018,1150)',
    keyword: 'ExposureTime',
    vr: 'IS' as ValueRepresentation,
    vm: '1',
    description: 'Exposure time in milliseconds',
  },
  Exposure: {
    tag: '(0018,1152)',
    keyword: 'Exposure',
    vr: 'IS' as ValueRepresentation,
    vm: '1',
    description: 'Exposure in mAs',
  },
  SliceThickness: {
    tag: '(0018,0050)',
    keyword: 'SliceThickness',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Nominal slice thickness in mm',
  },
  SpacingBetweenSlices: {
    tag: '(0018,0088)',
    keyword: 'SpacingBetweenSlices',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Spacing between slices in mm',
  },
  DataCollectionDiameter: {
    tag: '(0018,0090)',
    keyword: 'DataCollectionDiameter',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Diameter of data collection region in mm',
  },
  ReconstructionDiameter: {
    tag: '(0018,1100)',
    keyword: 'ReconstructionDiameter',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Diameter of reconstruction region in mm',
  },
  GantryDetectorTilt: {
    tag: '(0018,1120)',
    keyword: 'GantryDetectorTilt',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Gantry tilt in degrees',
  },
  TableHeight: {
    tag: '(0018,1130)',
    keyword: 'TableHeight',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Table height in mm',
  },
  RotationDirection: {
    tag: '(0018,1140)',
    keyword: 'RotationDirection',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Direction of rotation (CW or CC)',
  },
  ConvolutionKernel: {
    tag: '(0018,1210)',
    keyword: 'ConvolutionKernel',
    vr: 'SH' as ValueRepresentation,
    vm: '1-n',
    description: 'Convolution kernel or algorithm used in reconstruction',
  },
  CTDIvol: {
    tag: '(0018,9345)',
    keyword: 'CTDIvol',
    vr: 'FD' as ValueRepresentation,
    vm: '1',
    description: 'Computed Tomography Dose Index (volume)',
  },
} as const;

export const MRImageTags = {
  MagneticFieldStrength: {
    tag: '(0018,0087)',
    keyword: 'MagneticFieldStrength',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Magnetic field strength in Tesla',
  },
  SequenceName: {
    tag: '(0018,0024)',
    keyword: 'SequenceName',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'User-defined sequence name',
  },
  ScanningSequence: {
    tag: '(0018,0020)',
    keyword: 'ScanningSequence',
    vr: 'CS' as ValueRepresentation,
    vm: '1-n',
    description: 'Type of scanning sequence (SE, IR, GR, EP, RM)',
  },
  SequenceVariant: {
    tag: '(0018,0021)',
    keyword: 'SequenceVariant',
    vr: 'CS' as ValueRepresentation,
    vm: '1-n',
    description: 'Variant of the scanning sequence',
  },
  ScanOptions: {
    tag: '(0018,0022)',
    keyword: 'ScanOptions',
    vr: 'CS' as ValueRepresentation,
    vm: '1-n',
    description: 'Scan options used',
  },
  RepetitionTime: {
    tag: '(0018,0080)',
    keyword: 'RepetitionTime',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Repetition time in ms',
  },
  EchoTime: {
    tag: '(0018,0081)',
    keyword: 'EchoTime',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Echo time in ms',
  },
  InversionTime: {
    tag: '(0018,0082)',
    keyword: 'InversionTime',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Inversion time in ms',
  },
  FlipAngle: {
    tag: '(0018,1314)',
    keyword: 'FlipAngle',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Flip angle in degrees',
  },
  NumberOfAverages: {
    tag: '(0018,0083)',
    keyword: 'NumberOfAverages',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Number of averages',
  },
  ImagingFrequency: {
    tag: '(0018,0084)',
    keyword: 'ImagingFrequency',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Precession frequency in MHz',
  },
  EchoNumbers: {
    tag: '(0018,0086)',
    keyword: 'EchoNumbers',
    vr: 'IS' as ValueRepresentation,
    vm: '1-n',
    description: 'Echo number(s) in multi-echo sequence',
  },
  PixelBandwidth: {
    tag: '(0018,0095)',
    keyword: 'PixelBandwidth',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Bandwidth per pixel in Hz',
  },
  AcquisitionMatrix: {
    tag: '(0018,1310)',
    keyword: 'AcquisitionMatrix',
    vr: 'US' as ValueRepresentation,
    vm: '4',
    description: 'Acquisition matrix dimensions',
  },
  SAR: {
    tag: '(0018,1316)',
    keyword: 'SAR',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Specific Absorption Rate in W/kg',
  },
  dBdt: {
    tag: '(0018,1318)',
    keyword: 'dBdt',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Rate of change of magnetic field gradient',
  },
} as const;

export const UltrasoundTags = {
  TransducerType: {
    tag: '(0018,6031)',
    keyword: 'TransducerType',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Type of transducer',
  },
  TransducerFrequency: {
    tag: '(0018,6030)',
    keyword: 'TransducerFrequency',
    vr: 'UL' as ValueRepresentation,
    vm: '1',
    description: 'Nominal transducer frequency in Hz',
  },
  DepthOfScanField: {
    tag: '(0018,5050)',
    keyword: 'DepthOfScanField',
    vr: 'IS' as ValueRepresentation,
    vm: '1',
    description: 'Depth of scan field in mm',
  },
  MechanicalIndex: {
    tag: '(0018,5022)',
    keyword: 'MechanicalIndex',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Mechanical index',
  },
  ThermalIndex: {
    tag: '(0018,5024)',
    keyword: 'ThermalIndex',
    vr: 'DS' as ValueRepresentation,
    vm: '1',
    description: 'Thermal index',
  },
  ImageType: {
    tag: '(0008,0008)',
    keyword: 'ImageType',
    vr: 'CS' as ValueRepresentation,
    vm: '2-n',
    description: 'Ultrasound image type',
  },
  UltrasoundColorDataPresent: {
    tag: '(0028,0014)',
    keyword: 'UltrasoundColorDataPresent',
    vr: 'US' as ValueRepresentation,
    vm: '1',
    description: 'Whether color data is present',
  },
} as const;

// ============================================================================
// Worklist Tags (Scheduled Procedure Step)
// ============================================================================

export const WorklistTags = {
  // Scheduled Procedure Step
  ScheduledProcedureStepSequence: {
    tag: '(0040,0100)',
    keyword: 'ScheduledProcedureStepSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Scheduled Procedure Step Sequence',
  },
  ScheduledStationAETitle: {
    tag: '(0040,0001)',
    keyword: 'ScheduledStationAETitle',
    vr: 'AE' as ValueRepresentation,
    vm: '1-n',
    description: 'Scheduled Station AE Title',
  },
  ScheduledProcedureStepStartDate: {
    tag: '(0040,0002)',
    keyword: 'ScheduledProcedureStepStartDate',
    vr: 'DA' as ValueRepresentation,
    vm: '1',
    description: 'Scheduled Procedure Step Start Date',
  },
  ScheduledProcedureStepStartTime: {
    tag: '(0040,0003)',
    keyword: 'ScheduledProcedureStepStartTime',
    vr: 'TM' as ValueRepresentation,
    vm: '1',
    description: 'Scheduled Procedure Step Start Time',
  },
  ScheduledProcedureStepEndDate: {
    tag: '(0040,0004)',
    keyword: 'ScheduledProcedureStepEndDate',
    vr: 'DA' as ValueRepresentation,
    vm: '1',
    description: 'Scheduled Procedure Step End Date',
  },
  ScheduledProcedureStepEndTime: {
    tag: '(0040,0005)',
    keyword: 'ScheduledProcedureStepEndTime',
    vr: 'TM' as ValueRepresentation,
    vm: '1',
    description: 'Scheduled Procedure Step End Time',
  },
  ScheduledPerformingPhysicianName: {
    tag: '(0040,0006)',
    keyword: 'ScheduledPerformingPhysicianName',
    vr: 'PN' as ValueRepresentation,
    vm: '1',
    description: 'Scheduled Performing Physician\'s Name',
  },
  ScheduledProcedureStepDescription: {
    tag: '(0040,0007)',
    keyword: 'ScheduledProcedureStepDescription',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Scheduled Procedure Step Description',
  },
  ScheduledProtocolCodeSequence: {
    tag: '(0040,0008)',
    keyword: 'ScheduledProtocolCodeSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Scheduled Protocol Code Sequence',
  },
  ScheduledProcedureStepID: {
    tag: '(0040,0009)',
    keyword: 'ScheduledProcedureStepID',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'Scheduled Procedure Step ID',
  },
  ScheduledStationName: {
    tag: '(0040,0010)',
    keyword: 'ScheduledStationName',
    vr: 'SH' as ValueRepresentation,
    vm: '1-n',
    description: 'Scheduled Station Name',
  },
  ScheduledProcedureStepLocation: {
    tag: '(0040,0011)',
    keyword: 'ScheduledProcedureStepLocation',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'Scheduled Procedure Step Location',
  },
  ScheduledProcedureStepStatus: {
    tag: '(0040,0020)',
    keyword: 'ScheduledProcedureStepStatus',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Scheduled Procedure Step Status',
  },
  CommentsOnTheScheduledProcedureStep: {
    tag: '(0040,0400)',
    keyword: 'CommentsOnTheScheduledProcedureStep',
    vr: 'LT' as ValueRepresentation,
    vm: '1',
    description: 'Comments on the Scheduled Procedure Step',
  },

  // Requested Procedure
  RequestedProcedureID: {
    tag: '(0040,1001)',
    keyword: 'RequestedProcedureID',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'Requested Procedure ID',
  },
  ReasonForRequestedProcedure: {
    tag: '(0040,1002)',
    keyword: 'ReasonForRequestedProcedure',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Reason for the Requested Procedure',
  },
  RequestedProcedurePriority: {
    tag: '(0040,1003)',
    keyword: 'RequestedProcedurePriority',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'Requested Procedure Priority',
  },
  PatientTransportArrangements: {
    tag: '(0040,1004)',
    keyword: 'PatientTransportArrangements',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Patient Transport Arrangements',
  },
  RequestedProcedureDescription: {
    tag: '(0032,1060)',
    keyword: 'RequestedProcedureDescription',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Requested Procedure Description',
  },
  RequestedProcedureCodeSequence: {
    tag: '(0032,1064)',
    keyword: 'RequestedProcedureCodeSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Requested Procedure Code Sequence',
  },
  RequestedProcedureComments: {
    tag: '(0040,1400)',
    keyword: 'RequestedProcedureComments',
    vr: 'LT' as ValueRepresentation,
    vm: '1',
    description: 'Comments about the Requested Procedure',
  },

  // Imaging Service Request
  PlacerOrderNumberImagingServiceRequest: {
    tag: '(0040,2016)',
    keyword: 'PlacerOrderNumberImagingServiceRequest',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Placer Order Number for Imaging Service Request',
  },
  FillerOrderNumberImagingServiceRequest: {
    tag: '(0040,2017)',
    keyword: 'FillerOrderNumberImagingServiceRequest',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Filler Order Number for Imaging Service Request',
  },

  // Visit/Admission
  AdmissionID: {
    tag: '(0038,0010)',
    keyword: 'AdmissionID',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Admission ID',
  },
  IssuerOfAdmissionID: {
    tag: '(0038,0011)',
    keyword: 'IssuerOfAdmissionID',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Issuer of Admission ID',
    retired: true,
  },
  IssuerOfAdmissionIDSequence: {
    tag: '(0038,0014)',
    keyword: 'IssuerOfAdmissionIDSequence',
    vr: 'SQ' as ValueRepresentation,
    vm: '1',
    description: 'Issuer of Admission ID Sequence',
  },
  CurrentPatientLocation: {
    tag: '(0038,0300)',
    keyword: 'CurrentPatientLocation',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Current Patient Location',
  },
  PatientInstitutionResidence: {
    tag: '(0038,0400)',
    keyword: 'PatientInstitutionResidence',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Patient\'s Institution Residence',
  },
} as const;

// ============================================================================
// Code Sequence Tags
// ============================================================================

export const CodeSequenceTags = {
  CodeValue: {
    tag: '(0008,0100)',
    keyword: 'CodeValue',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'Code Value',
  },
  CodingSchemeDesignator: {
    tag: '(0008,0102)',
    keyword: 'CodingSchemeDesignator',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'Coding Scheme Designator',
  },
  CodingSchemeVersion: {
    tag: '(0008,0103)',
    keyword: 'CodingSchemeVersion',
    vr: 'SH' as ValueRepresentation,
    vm: '1',
    description: 'Coding Scheme Version',
  },
  CodeMeaning: {
    tag: '(0008,0104)',
    keyword: 'CodeMeaning',
    vr: 'LO' as ValueRepresentation,
    vm: '1',
    description: 'Code Meaning',
  },
  MappingResource: {
    tag: '(0008,0105)',
    keyword: 'MappingResource',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Mapping Resource',
  },
  ContextGroupVersion: {
    tag: '(0008,0106)',
    keyword: 'ContextGroupVersion',
    vr: 'DT' as ValueRepresentation,
    vm: '1',
    description: 'Context Group Version',
  },
  ContextIdentifier: {
    tag: '(0008,010F)',
    keyword: 'ContextIdentifier',
    vr: 'CS' as ValueRepresentation,
    vm: '1',
    description: 'Context Identifier',
  },
  ContextUID: {
    tag: '(0008,0117)',
    keyword: 'ContextUID',
    vr: 'UI' as ValueRepresentation,
    vm: '1',
    description: 'Context UID',
  },
} as const;

// ============================================================================
// Tag to Keyword Mapping
// ============================================================================

/**
 * Complete mapping of normalized tags to their definitions
 */
export const TagDictionary: Record<string, DICOMTag> = {};

// Populate the dictionary from all tag groups
const allTagGroups = [
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
];

for (const tagGroup of allTagGroups) {
  for (const [, tagDef] of Object.entries(tagGroup)) {
    const normalized = normalizeTag(tagDef.tag);
    TagDictionary[normalized] = tagDef as DICOMTag;
  }
}

/**
 * Keyword to tag mapping
 */
export const KeywordToTag: Record<string, string> = {};

for (const [normalized, tagDef] of Object.entries(TagDictionary)) {
  KeywordToTag[tagDef.keyword] = normalized;
}

/**
 * Get tag definition by tag or keyword
 */
export function getTagDefinition(tagOrKeyword: string): DICOMTag | undefined {
  // Check if it's a keyword
  if (KeywordToTag[tagOrKeyword]) {
    return TagDictionary[KeywordToTag[tagOrKeyword]];
  }

  // Try as a tag
  const normalized = normalizeTag(tagOrKeyword);
  return TagDictionary[normalized];
}

/**
 * Get keyword for a tag
 */
export function getKeyword(tag: string): string | undefined {
  const normalized = normalizeTag(tag);
  return TagDictionary[normalized]?.keyword;
}

/**
 * Get VR for a tag
 */
export function getVR(tag: string): ValueRepresentation | undefined {
  const normalized = normalizeTag(tag);
  return TagDictionary[normalized]?.vr;
}

// ============================================================================
// VR Definitions and Utilities
// ============================================================================

/**
 * VR to JavaScript type mapping
 */
export const VRTypeInfo: Record<
  ValueRepresentation,
  {
    description: string;
    maxLength?: number;
    jsType: 'string' | 'number' | 'binary' | 'sequence' | 'personName';
    isNumeric: boolean;
  }
> = {
  AE: { description: 'Application Entity', maxLength: 16, jsType: 'string', isNumeric: false },
  AS: { description: 'Age String', maxLength: 4, jsType: 'string', isNumeric: false },
  AT: { description: 'Attribute Tag', jsType: 'string', isNumeric: false },
  CS: { description: 'Code String', maxLength: 16, jsType: 'string', isNumeric: false },
  DA: { description: 'Date', jsType: 'string', isNumeric: false },
  DS: { description: 'Decimal String', maxLength: 16, jsType: 'number', isNumeric: true },
  DT: { description: 'DateTime', jsType: 'string', isNumeric: false },
  FL: { description: 'Floating Point Single', jsType: 'number', isNumeric: true },
  FD: { description: 'Floating Point Double', jsType: 'number', isNumeric: true },
  IS: { description: 'Integer String', maxLength: 12, jsType: 'number', isNumeric: true },
  LO: { description: 'Long String', maxLength: 64, jsType: 'string', isNumeric: false },
  LT: { description: 'Long Text', maxLength: 10240, jsType: 'string', isNumeric: false },
  OB: { description: 'Other Byte', jsType: 'binary', isNumeric: false },
  OD: { description: 'Other Double', jsType: 'binary', isNumeric: false },
  OF: { description: 'Other Float', jsType: 'binary', isNumeric: false },
  OL: { description: 'Other Long', jsType: 'binary', isNumeric: false },
  OW: { description: 'Other Word', jsType: 'binary', isNumeric: false },
  PN: { description: 'Person Name', jsType: 'personName', isNumeric: false },
  SH: { description: 'Short String', maxLength: 16, jsType: 'string', isNumeric: false },
  SL: { description: 'Signed Long', jsType: 'number', isNumeric: true },
  SQ: { description: 'Sequence', jsType: 'sequence', isNumeric: false },
  SS: { description: 'Signed Short', jsType: 'number', isNumeric: true },
  ST: { description: 'Short Text', maxLength: 1024, jsType: 'string', isNumeric: false },
  TM: { description: 'Time', jsType: 'string', isNumeric: false },
  UC: { description: 'Unlimited Characters', jsType: 'string', isNumeric: false },
  UI: { description: 'Unique Identifier', maxLength: 64, jsType: 'string', isNumeric: false },
  UL: { description: 'Unsigned Long', jsType: 'number', isNumeric: true },
  UN: { description: 'Unknown', jsType: 'binary', isNumeric: false },
  UR: { description: 'URI/URL', jsType: 'string', isNumeric: false },
  US: { description: 'Unsigned Short', jsType: 'number', isNumeric: true },
  UT: { description: 'Unlimited Text', jsType: 'string', isNumeric: false },
};

/**
 * Check if VR is numeric
 */
export function isNumericVR(vr: ValueRepresentation): boolean {
  return VRTypeInfo[vr]?.isNumeric ?? false;
}

/**
 * Check if VR is binary
 */
export function isBinaryVR(vr: ValueRepresentation): boolean {
  return VRTypeInfo[vr]?.jsType === 'binary';
}

/**
 * Check if VR is a sequence
 */
export function isSequenceVR(vr: ValueRepresentation): boolean {
  return vr === 'SQ';
}
