/**
 * DICOM/DICOMweb Type Definitions
 *
 * Based on:
 * - DICOM PS3.18 (Web Services): https://dicom.nema.org/medical/dicom/current/output/html/part18.html
 * - DICOM PS3.6 (Data Dictionary): https://dicom.nema.org/medical/dicom/current/output/html/part06.html
 * - DICOM PS3.4 (Service Class Specifications)
 * - IHE Radiology Technical Framework
 */

// ============================================================================
// Value Representation (VR) Types
// ============================================================================

/**
 * DICOM Value Representation (VR) codes
 * Defines the data type and format of DICOM tag values
 */
export type ValueRepresentation =
  | 'AE' // Application Entity (16 chars max)
  | 'AS' // Age String (4 chars)
  | 'AT' // Attribute Tag
  | 'CS' // Code String (16 chars max)
  | 'DA' // Date (YYYYMMDD)
  | 'DS' // Decimal String (16 chars max)
  | 'DT' // DateTime
  | 'FL' // Floating Point Single
  | 'FD' // Floating Point Double
  | 'IS' // Integer String (12 chars max)
  | 'LO' // Long String (64 chars max)
  | 'LT' // Long Text (10240 chars max)
  | 'OB' // Other Byte
  | 'OD' // Other Double
  | 'OF' // Other Float
  | 'OL' // Other Long
  | 'OW' // Other Word
  | 'PN' // Person Name
  | 'SH' // Short String (16 chars max)
  | 'SL' // Signed Long
  | 'SQ' // Sequence
  | 'SS' // Signed Short
  | 'ST' // Short Text (1024 chars max)
  | 'TM' // Time (HHMMSS.FFFFFF)
  | 'UC' // Unlimited Characters
  | 'UI' // Unique Identifier (64 chars max)
  | 'UL' // Unsigned Long
  | 'UN' // Unknown
  | 'UR' // URI/URL
  | 'US' // Unsigned Short
  | 'UT'; // Unlimited Text

/**
 * DICOM Tag definition with metadata
 */
export interface DICOMTag {
  /** Tag in format (XXXX,XXXX) */
  tag: string;
  /** Keyword/name of the attribute */
  keyword: string;
  /** Value Representation */
  vr: ValueRepresentation;
  /** Value Multiplicity (e.g., "1", "1-n", "2-2n") */
  vm: string;
  /** Description of the tag */
  description?: string;
  /** Whether this is a retired tag */
  retired?: boolean;
}

/**
 * DICOM Data Element with value
 */
export interface DICOMDataElement {
  /** Tag in format XXXXXXXX (no comma) */
  tag: string;
  /** Value Representation */
  vr: ValueRepresentation;
  /** Element value(s) */
  Value?: DICOMValue[];
  /** Binary data reference for bulkdata */
  BulkDataURI?: string;
  /** Inline binary data */
  InlineBinary?: string;
}

/**
 * DICOM value types
 */
export type DICOMValue =
  | string
  | number
  | DICOMPersonName
  | DICOMSequenceItem
  | null;

/**
 * DICOM Person Name (PN) structured format
 */
export interface DICOMPersonName {
  Alphabetic?: string;
  Ideographic?: string;
  Phonetic?: string;
}

/**
 * DICOM Sequence item
 */
export interface DICOMSequenceItem {
  [tag: string]: DICOMDataElement;
}

// ============================================================================
// SOP Class UIDs
// ============================================================================

/**
 * Common SOP Class UIDs for different modalities and services
 */
export const SOPClassUIDs = {
  // Storage SOP Classes - Computed Tomography
  CTImageStorage: '1.2.840.10008.5.1.4.1.1.2',
  EnhancedCTImageStorage: '1.2.840.10008.5.1.4.1.1.2.1',
  LegacyConvertedEnhancedCTImageStorage: '1.2.840.10008.5.1.4.1.1.2.2',

  // Storage SOP Classes - Magnetic Resonance
  MRImageStorage: '1.2.840.10008.5.1.4.1.1.4',
  EnhancedMRImageStorage: '1.2.840.10008.5.1.4.1.1.4.1',
  MRSpectroscopyStorage: '1.2.840.10008.5.1.4.1.1.4.2',
  EnhancedMRColorImageStorage: '1.2.840.10008.5.1.4.1.1.4.3',
  LegacyConvertedEnhancedMRImageStorage: '1.2.840.10008.5.1.4.1.1.4.4',

  // Storage SOP Classes - X-Ray
  ComputedRadiographyImageStorage: '1.2.840.10008.5.1.4.1.1.1',
  DigitalXRayImageStorageForPresentation: '1.2.840.10008.5.1.4.1.1.1.1',
  DigitalXRayImageStorageForProcessing: '1.2.840.10008.5.1.4.1.1.1.1.1',
  DigitalMammographyXRayImageStorageForPresentation: '1.2.840.10008.5.1.4.1.1.1.2',
  DigitalMammographyXRayImageStorageForProcessing: '1.2.840.10008.5.1.4.1.1.1.2.1',
  DigitalIntraOralXRayImageStorageForPresentation: '1.2.840.10008.5.1.4.1.1.1.3',
  DigitalIntraOralXRayImageStorageForProcessing: '1.2.840.10008.5.1.4.1.1.1.3.1',

  // Storage SOP Classes - Ultrasound
  UltrasoundMultiFrameImageStorage: '1.2.840.10008.5.1.4.1.1.3.1',
  UltrasoundImageStorage: '1.2.840.10008.5.1.4.1.1.6.1',
  EnhancedUSVolumeStorage: '1.2.840.10008.5.1.4.1.1.6.2',

  // Storage SOP Classes - Nuclear Medicine
  NuclearMedicineImageStorage: '1.2.840.10008.5.1.4.1.1.20',
  PositronEmissionTomographyImageStorage: '1.2.840.10008.5.1.4.1.1.128',
  EnhancedPETImageStorage: '1.2.840.10008.5.1.4.1.1.130',
  LegacyConvertedEnhancedPETImageStorage: '1.2.840.10008.5.1.4.1.1.128.1',

  // Storage SOP Classes - Secondary Capture
  SecondaryCaptureImageStorage: '1.2.840.10008.5.1.4.1.1.7',
  MultiFrameSingleBitSecondaryCaptureImageStorage: '1.2.840.10008.5.1.4.1.1.7.1',
  MultiFrameGrayscaleByteSecondaryCaptureImageStorage: '1.2.840.10008.5.1.4.1.1.7.2',
  MultiFrameGrayscaleWordSecondaryCaptureImageStorage: '1.2.840.10008.5.1.4.1.1.7.3',
  MultiFrameTrueColorSecondaryCaptureImageStorage: '1.2.840.10008.5.1.4.1.1.7.4',

  // Storage SOP Classes - Radiation Therapy
  RTImageStorage: '1.2.840.10008.5.1.4.1.1.481.1',
  RTDoseStorage: '1.2.840.10008.5.1.4.1.1.481.2',
  RTStructureSetStorage: '1.2.840.10008.5.1.4.1.1.481.3',
  RTBeamsTreatmentRecordStorage: '1.2.840.10008.5.1.4.1.1.481.4',
  RTPlanStorage: '1.2.840.10008.5.1.4.1.1.481.5',

  // Storage SOP Classes - Documents
  EncapsulatedPDFStorage: '1.2.840.10008.5.1.4.1.1.104.1',
  EncapsulatedCDAStorage: '1.2.840.10008.5.1.4.1.1.104.2',
  EncapsulatedSTLStorage: '1.2.840.10008.5.1.4.1.1.104.3',
  EncapsulatedOBJStorage: '1.2.840.10008.5.1.4.1.1.104.4',
  EncapsulatedMTLStorage: '1.2.840.10008.5.1.4.1.1.104.5',

  // Storage SOP Classes - Structured Reporting
  BasicTextSRStorage: '1.2.840.10008.5.1.4.1.1.88.11',
  EnhancedSRStorage: '1.2.840.10008.5.1.4.1.1.88.22',
  ComprehensiveSRStorage: '1.2.840.10008.5.1.4.1.1.88.33',
  Comprehensive3DSRStorage: '1.2.840.10008.5.1.4.1.1.88.34',
  ExtensibleSRStorage: '1.2.840.10008.5.1.4.1.1.88.35',

  // Storage SOP Classes - Ophthalmology
  OphthalmicTomographyImageStorage: '1.2.840.10008.5.1.4.1.1.77.1.5.4',
  OphthalmicPhotography8BitImageStorage: '1.2.840.10008.5.1.4.1.1.77.1.5.1',
  OphthalmicPhotography16BitImageStorage: '1.2.840.10008.5.1.4.1.1.77.1.5.2',

  // Storage SOP Classes - Visible Light
  VLEndoscopicImageStorage: '1.2.840.10008.5.1.4.1.1.77.1.1',
  VLMicroscopicImageStorage: '1.2.840.10008.5.1.4.1.1.77.1.2',
  VLSlideCoordinatesMicroscopicImageStorage: '1.2.840.10008.5.1.4.1.1.77.1.3',
  VLPhotographicImageStorage: '1.2.840.10008.5.1.4.1.1.77.1.4',
  VLWholeSlideMicroscopyImageStorage: '1.2.840.10008.5.1.4.1.1.77.1.6',

  // Query/Retrieve SOP Classes
  PatientRootQueryRetrieveInformationModelFind: '1.2.840.10008.5.1.4.1.2.1.1',
  PatientRootQueryRetrieveInformationModelMove: '1.2.840.10008.5.1.4.1.2.1.2',
  PatientRootQueryRetrieveInformationModelGet: '1.2.840.10008.5.1.4.1.2.1.3',
  StudyRootQueryRetrieveInformationModelFind: '1.2.840.10008.5.1.4.1.2.2.1',
  StudyRootQueryRetrieveInformationModelMove: '1.2.840.10008.5.1.4.1.2.2.2',
  StudyRootQueryRetrieveInformationModelGet: '1.2.840.10008.5.1.4.1.2.2.3',

  // Modality Worklist SOP Classes
  ModalityWorklistInformationModelFind: '1.2.840.10008.5.1.4.31',

  // Modality Performed Procedure Step SOP Classes
  ModalityPerformedProcedureStepSOPClass: '1.2.840.10008.3.1.2.3.3',
  ModalityPerformedProcedureStepRetrieveSOPClass: '1.2.840.10008.3.1.2.3.4',
  ModalityPerformedProcedureStepNotificationSOPClass: '1.2.840.10008.3.1.2.3.5',

  // Unified Procedure Step SOP Classes
  UnifiedProcedureStepPushSOPClass: '1.2.840.10008.5.1.4.34.6.1',
  UnifiedProcedureStepWatchSOPClass: '1.2.840.10008.5.1.4.34.6.2',
  UnifiedProcedureStepPullSOPClass: '1.2.840.10008.5.1.4.34.6.3',
  UnifiedProcedureStepEventSOPClass: '1.2.840.10008.5.1.4.34.6.4',
  UnifiedProcedureStepQuerySOPClass: '1.2.840.10008.5.1.4.34.6.5',

  // Storage Commitment SOP Classes
  StorageCommitmentPushModelSOPClass: '1.2.840.10008.1.20.1',

  // Verification SOP Class
  VerificationSOPClass: '1.2.840.10008.1.1',
} as const;

export type SOPClassUID = typeof SOPClassUIDs[keyof typeof SOPClassUIDs];

// ============================================================================
// Transfer Syntax UIDs
// ============================================================================

/**
 * Common Transfer Syntax UIDs
 */
export const TransferSyntaxUIDs = {
  // Uncompressed
  ImplicitVRLittleEndian: '1.2.840.10008.1.2',
  ExplicitVRLittleEndian: '1.2.840.10008.1.2.1',
  ExplicitVRBigEndian: '1.2.840.10008.1.2.2',
  DeflatedExplicitVRLittleEndian: '1.2.840.10008.1.2.1.99',

  // JPEG Lossy
  JPEGBaseline: '1.2.840.10008.1.2.4.50',
  JPEGExtended: '1.2.840.10008.1.2.4.51',
  JPEGSpectralSelection: '1.2.840.10008.1.2.4.53',
  JPEGFullProgression: '1.2.840.10008.1.2.4.55',

  // JPEG Lossless
  JPEGLossless: '1.2.840.10008.1.2.4.57',
  JPEGLosslessFirstOrder: '1.2.840.10008.1.2.4.70',

  // JPEG-LS
  JPEGLSLossless: '1.2.840.10008.1.2.4.80',
  JPEGLSNearLossless: '1.2.840.10008.1.2.4.81',

  // JPEG 2000
  JPEG2000Lossless: '1.2.840.10008.1.2.4.90',
  JPEG2000Lossy: '1.2.840.10008.1.2.4.91',
  JPEG2000Part2Lossless: '1.2.840.10008.1.2.4.92',
  JPEG2000Part2Lossy: '1.2.840.10008.1.2.4.93',

  // MPEG
  MPEG2: '1.2.840.10008.1.2.4.100',
  MPEG2HighProfile: '1.2.840.10008.1.2.4.101',
  MPEG4AVC: '1.2.840.10008.1.2.4.102',
  MPEG4AVCHP: '1.2.840.10008.1.2.4.103',
  MPEG4AVCBDHP: '1.2.840.10008.1.2.4.104',
  MPEG4AVCHP422: '1.2.840.10008.1.2.4.105',
  MPEG4AVCHP423D: '1.2.840.10008.1.2.4.106',
  MPEG4AVCHPSTEREO: '1.2.840.10008.1.2.4.107',
  HEVC: '1.2.840.10008.1.2.4.108',
  HEVC10: '1.2.840.10008.1.2.4.109',

  // RLE
  RLELossless: '1.2.840.10008.1.2.5',

  // High-Throughput JPEG 2000
  HTJ2KLossless: '1.2.840.10008.1.2.4.201',
  HTJ2KLosslessRPCL: '1.2.840.10008.1.2.4.202',
  HTJ2K: '1.2.840.10008.1.2.4.203',
} as const;

export type TransferSyntaxUID = typeof TransferSyntaxUIDs[keyof typeof TransferSyntaxUIDs];

// ============================================================================
// Modality Codes
// ============================================================================

/**
 * DICOM Modality Codes (CID 29)
 */
export const ModalityCodes = {
  AR: 'Autorefraction',
  ASMT: 'Content Assessment Results',
  AU: 'Audio',
  BDUS: 'Bone Densitometry (ultrasound)',
  BI: 'Biomagnetic Imaging',
  BMD: 'Bone Densitometry (X-Ray)',
  CR: 'Computed Radiography',
  CT: 'Computed Tomography',
  CTPROTOCOL: 'CT Protocol',
  DG: 'Diaphanography',
  DOC: 'Document',
  DX: 'Digital Radiography',
  ECG: 'Electrocardiography',
  EPS: 'Cardiac Electrophysiology',
  ES: 'Endoscopy',
  FID: 'Fiducials',
  GM: 'General Microscopy',
  HC: 'Hard Copy',
  HD: 'Hemodynamic Waveform',
  IO: 'Intra-Oral Radiography',
  IOL: 'Intraocular Lens Data',
  IVOCT: 'Intravascular Optical Coherence Tomography',
  IVUS: 'Intravascular Ultrasound',
  KER: 'Keratometry',
  KO: 'Key Object Selection',
  LEN: 'Lensometry',
  LS: 'Laser Surface Scan',
  MG: 'Mammography',
  MR: 'Magnetic Resonance',
  M3D: 'Model for 3D Manufacturing',
  NM: 'Nuclear Medicine',
  OAM: 'Ophthalmic Axial Measurements',
  OCT: 'Optical Coherence Tomography (non-Ophthalmic)',
  OP: 'Ophthalmic Photography',
  OPM: 'Ophthalmic Mapping',
  OPT: 'Ophthalmic Tomography',
  OPTBSV: 'Ophthalmic Tomography B-scan Volume Analysis',
  OPTENF: 'Ophthalmic Tomography En Face',
  OPV: 'Ophthalmic Visual Field',
  OSS: 'Optical Surface Scan',
  OT: 'Other',
  PA: 'Photoacoustic',
  PLAN: 'Plan',
  POS: 'Position Sensor',
  PR: 'Presentation State',
  PT: 'Positron Emission Tomography (PET)',
  PX: 'Panoramic X-Ray',
  REG: 'Registration',
  RESP: 'Respiratory Waveform',
  RF: 'Radio Fluoroscopy',
  RG: 'Radiographic Imaging (conventional film/screen)',
  RTDOSE: 'Radiotherapy Dose',
  RTIMAGE: 'Radiotherapy Image',
  RTPLAN: 'Radiotherapy Plan',
  RTRECORD: 'RT Treatment Record',
  RTSTRUCT: 'Radiotherapy Structure Set',
  RWV: 'Real World Value Map',
  SEG: 'Segmentation',
  SM: 'Slide Microscopy',
  SMR: 'Stereometric Relationship',
  SR: 'Structured Report',
  SRF: 'Subjective Refraction',
  STAIN: 'Automated Slide Stainer',
  TG: 'Thermography',
  US: 'Ultrasound',
  VA: 'Visual Acuity',
  XA: 'X-Ray Angiography',
  XC: 'External-camera Photography',
} as const;

export type ModalityCode = keyof typeof ModalityCodes;

// ============================================================================
// DICOM Entity Types
// ============================================================================

/**
 * DICOM Patient entity
 */
export interface DICOMPatient {
  /** Patient ID (0010,0020) */
  patientId: string;
  /** Patient's Name (0010,0010) */
  patientName?: DICOMPersonName | string;
  /** Patient's Birth Date (0010,0030) */
  patientBirthDate?: string;
  /** Patient's Sex (0010,0040) */
  patientSex?: 'M' | 'F' | 'O';
  /** Patient's Age (0010,1010) */
  patientAge?: string;
  /** Patient's Weight (0010,1030) */
  patientWeight?: number;
  /** Patient's Size (0010,1020) */
  patientSize?: number;
  /** Issuer of Patient ID (0010,0021) */
  issuerOfPatientId?: string;
  /** Other Patient IDs (0010,1000) */
  otherPatientIds?: string[];
  /** Patient Comments (0010,4000) */
  patientComments?: string;
  /** Ethnic Group (0010,2160) */
  ethnicGroup?: string;
  /** Patient's Address (0010,1040) */
  patientAddress?: string;
  /** Patient's Telephone Numbers (0010,2154) */
  patientTelephoneNumbers?: string[];
}

/**
 * DICOM Study entity
 */
export interface DICOMStudy {
  /** Study Instance UID (0020,000D) */
  studyInstanceUID: string;
  /** Study ID (0020,0010) */
  studyId?: string;
  /** Study Date (0008,0020) */
  studyDate?: string;
  /** Study Time (0008,0030) */
  studyTime?: string;
  /** Study Description (0008,1030) */
  studyDescription?: string;
  /** Accession Number (0008,0050) */
  accessionNumber?: string;
  /** Referring Physician's Name (0008,0090) */
  referringPhysicianName?: DICOMPersonName | string;
  /** Patient information */
  patient?: DICOMPatient;
  /** Modalities in Study (0008,0061) */
  modalitiesInStudy?: ModalityCode[];
  /** Number of Study Related Series (0020,1206) */
  numberOfStudyRelatedSeries?: number;
  /** Number of Study Related Instances (0020,1208) */
  numberOfStudyRelatedInstances?: number;
  /** Procedure Code Sequence (0008,1032) */
  procedureCodes?: CodeSequenceItem[];
  /** Name of Physician(s) Reading Study (0008,1060) */
  readingPhysicianName?: DICOMPersonName | string;
  /** Institution Name (0008,0080) */
  institutionName?: string;
  /** Reason For Study (0032,1030) - retired but commonly used */
  reasonForStudy?: string;
  /** Additional Patient History (0010,21B0) */
  additionalPatientHistory?: string;
  /** Series in this study */
  series?: DICOMSeries[];
  /** Retrieve URL */
  retrieveURL?: string;
}

/**
 * DICOM Series entity
 */
export interface DICOMSeries {
  /** Series Instance UID (0020,000E) */
  seriesInstanceUID: string;
  /** Series Number (0020,0011) */
  seriesNumber?: number;
  /** Series Date (0008,0021) */
  seriesDate?: string;
  /** Series Time (0008,0031) */
  seriesTime?: string;
  /** Series Description (0008,103E) */
  seriesDescription?: string;
  /** Modality (0008,0060) */
  modality: ModalityCode;
  /** Body Part Examined (0018,0015) */
  bodyPartExamined?: string;
  /** Patient Position (0018,5100) */
  patientPosition?: string;
  /** Protocol Name (0018,1030) */
  protocolName?: string;
  /** Performing Physician's Name (0008,1050) */
  performingPhysicianName?: DICOMPersonName | string;
  /** Operators' Name (0008,1070) */
  operatorsName?: DICOMPersonName | string;
  /** Laterality (0020,0060) */
  laterality?: 'L' | 'R' | '';
  /** Manufacturer (0008,0070) */
  manufacturer?: string;
  /** Manufacturer's Model Name (0008,1090) */
  manufacturerModelName?: string;
  /** Station Name (0008,1010) */
  stationName?: string;
  /** Number of Series Related Instances (0020,1209) */
  numberOfSeriesRelatedInstances?: number;
  /** Instances in this series */
  instances?: DICOMInstance[];
  /** Retrieve URL */
  retrieveURL?: string;
}

/**
 * DICOM Instance (Image/Object) entity
 */
export interface DICOMInstance {
  /** SOP Instance UID (0008,0018) */
  sopInstanceUID: string;
  /** SOP Class UID (0008,0016) */
  sopClassUID: string;
  /** Instance Number (0020,0013) */
  instanceNumber?: number;
  /** Content Date (0008,0023) */
  contentDate?: string;
  /** Content Time (0008,0033) */
  contentTime?: string;
  /** Image Type (0008,0008) */
  imageType?: string[];
  /** Rows (0028,0010) */
  rows?: number;
  /** Columns (0028,0011) */
  columns?: number;
  /** Bits Allocated (0028,0100) */
  bitsAllocated?: number;
  /** Bits Stored (0028,0101) */
  bitsStored?: number;
  /** High Bit (0028,0102) */
  highBit?: number;
  /** Pixel Representation (0028,0103) */
  pixelRepresentation?: number;
  /** Number of Frames (0028,0008) */
  numberOfFrames?: number;
  /** Photometric Interpretation (0028,0004) */
  photometricInterpretation?: string;
  /** Samples per Pixel (0028,0002) */
  samplesPerPixel?: number;
  /** Window Center (0028,1050) */
  windowCenter?: number | number[];
  /** Window Width (0028,1051) */
  windowWidth?: number | number[];
  /** Transfer Syntax UID (0002,0010) */
  transferSyntaxUID?: string;
  /** Retrieve URL */
  retrieveURL?: string;
  /** Available transfer syntaxes */
  availableTransferSyntaxUIDs?: string[];
}

/**
 * DICOM Code Sequence Item
 */
export interface CodeSequenceItem {
  /** Code Value (0008,0100) */
  codeValue: string;
  /** Coding Scheme Designator (0008,0102) */
  codingSchemeDesignator: string;
  /** Code Meaning (0008,0104) */
  codeMeaning: string;
  /** Coding Scheme Version (0008,0103) */
  codingSchemeVersion?: string;
}

// ============================================================================
// Modality Worklist Types
// ============================================================================

/**
 * DICOM Modality Worklist Item
 */
export interface DICOMWorklistItem {
  // Scheduled Procedure Step Module
  /** Scheduled Procedure Step ID (0040,0009) */
  scheduledProcedureStepId: string;
  /** Scheduled Procedure Step Description (0040,0007) */
  scheduledProcedureStepDescription?: string;
  /** Scheduled Procedure Step Start Date (0040,0002) */
  scheduledProcedureStepStartDate: string;
  /** Scheduled Procedure Step Start Time (0040,0003) */
  scheduledProcedureStepStartTime?: string;
  /** Scheduled Procedure Step End Date (0040,0004) */
  scheduledProcedureStepEndDate?: string;
  /** Scheduled Procedure Step End Time (0040,0005) */
  scheduledProcedureStepEndTime?: string;
  /** Scheduled Performing Physician's Name (0040,0006) */
  scheduledPerformingPhysicianName?: DICOMPersonName | string;
  /** Scheduled Protocol Code Sequence (0040,0008) */
  scheduledProtocolCodes?: CodeSequenceItem[];
  /** Scheduled Station AE Title (0040,0001) */
  scheduledStationAETitle?: string;
  /** Scheduled Station Name (0040,0010) */
  scheduledStationName?: string;
  /** Scheduled Procedure Step Location (0040,0011) */
  scheduledProcedureStepLocation?: string;
  /** Scheduled Procedure Step Status (0040,0020) */
  scheduledProcedureStepStatus?: 'SCHEDULED' | 'ARRIVED' | 'READY' | 'STARTED' | 'DEPARTED' | 'CANCELED' | 'DISCONTINUED' | 'COMPLETED';
  /** Modality (0008,0060) */
  modality: ModalityCode;

  // Requested Procedure Module
  /** Requested Procedure ID (0040,1001) */
  requestedProcedureId: string;
  /** Requested Procedure Description (0032,1060) */
  requestedProcedureDescription?: string;
  /** Requested Procedure Code Sequence (0032,1064) */
  requestedProcedureCodes?: CodeSequenceItem[];
  /** Study Instance UID (0020,000D) */
  studyInstanceUID: string;
  /** Accession Number (0008,0050) */
  accessionNumber: string;
  /** Referring Physician's Name (0008,0090) */
  referringPhysicianName?: DICOMPersonName | string;
  /** Requested Procedure Priority (0040,1003) */
  requestedProcedurePriority?: 'STAT' | 'HIGH' | 'ROUTINE' | 'MEDIUM' | 'LOW';
  /** Reason for the Requested Procedure (0040,1002) */
  reasonForRequestedProcedure?: string;
  /** Requested Procedure Comments (0040,1400) */
  requestedProcedureComments?: string;

  // Patient Module
  patient: DICOMPatient;

  // Visit Identification
  /** Admission ID (0038,0010) */
  admissionId?: string;
  /** Current Patient Location (0038,0300) */
  currentPatientLocation?: string;

  // Imaging Service Request
  /** Placer Order Number/Imaging Service Request (0040,2016) */
  placerOrderNumber?: string;
  /** Filler Order Number/Imaging Service Request (0040,2017) */
  fillerOrderNumber?: string;
  /** Order Placer Identifier Sequence */
  orderPlacerIdentifierSequence?: any[];
}

// ============================================================================
// DICOMweb Configuration
// ============================================================================

/**
 * DICOMweb endpoint configuration
 */
export interface DICOMwebEndpoint {
  /** Base URL of the DICOMweb server */
  baseUrl: string;
  /** QIDO-RS endpoint path (default: /dicomweb) */
  qidoPath?: string;
  /** WADO-RS endpoint path (default: /dicomweb) */
  wadoPath?: string;
  /** STOW-RS endpoint path (default: /dicomweb) */
  stowPath?: string;
  /** UPS-RS endpoint path (default: /dicomweb) */
  upsPath?: string;
  /** Authentication configuration */
  auth?: DICOMwebAuth;
  /** Custom headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Whether to send credentials with cross-origin requests */
  withCredentials?: boolean;
}

/**
 * DICOMweb authentication configuration
 */
export interface DICOMwebAuth {
  /** Authentication type */
  type: 'none' | 'basic' | 'bearer' | 'oauth2';
  /** Username for basic auth */
  username?: string;
  /** Password for basic auth */
  password?: string;
  /** Bearer token */
  token?: string;
  /** OAuth2 configuration */
  oauth2?: OAuth2Config;
}

/**
 * OAuth2 configuration for DICOMweb
 */
export interface OAuth2Config {
  /** OAuth2 token endpoint */
  tokenEndpoint: string;
  /** Client ID */
  clientId: string;
  /** Client secret */
  clientSecret?: string;
  /** OAuth2 scopes */
  scopes?: string[];
  /** Grant type */
  grantType: 'client_credentials' | 'authorization_code' | 'refresh_token';
  /** Authorization endpoint (for authorization_code flow) */
  authorizationEndpoint?: string;
  /** Redirect URI (for authorization_code flow) */
  redirectUri?: string;
  /** Current access token */
  accessToken?: string;
  /** Refresh token */
  refreshToken?: string;
  /** Token expiry time */
  expiresAt?: number;
}

// ============================================================================
// QIDO-RS Types (Query)
// ============================================================================

/**
 * QIDO-RS query parameters
 */
export interface QIDOQueryParams {
  /** Limit number of results */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Include fields in response */
  includefield?: string | string[];
  /** Fuzzy matching for patient name */
  fuzzymatching?: boolean;
}

/**
 * Study-level QIDO query parameters
 */
export interface QIDOStudyQuery extends QIDOQueryParams {
  // Patient-level
  PatientID?: string;
  PatientName?: string;
  PatientBirthDate?: string;
  PatientSex?: string;
  IssuerOfPatientID?: string;

  // Study-level
  StudyInstanceUID?: string;
  StudyDate?: string;
  StudyTime?: string;
  AccessionNumber?: string;
  ModalitiesInStudy?: string;
  StudyDescription?: string;
  ReferringPhysicianName?: string;
  StudyID?: string;
  InstitutionName?: string;

  // Any additional tag queries
  [tag: string]: string | number | boolean | string[] | undefined;
}

/**
 * Series-level QIDO query parameters
 */
export interface QIDOSeriesQuery extends QIDOQueryParams {
  // Series-level
  SeriesInstanceUID?: string;
  SeriesNumber?: string;
  Modality?: string;
  SeriesDescription?: string;
  SeriesDate?: string;
  SeriesTime?: string;
  PerformingPhysicianName?: string;
  ProtocolName?: string;
  BodyPartExamined?: string;

  // Any additional tag queries
  [tag: string]: string | number | boolean | string[] | undefined;
}

/**
 * Instance-level QIDO query parameters
 */
export interface QIDOInstanceQuery extends QIDOQueryParams {
  // Instance-level
  SOPInstanceUID?: string;
  SOPClassUID?: string;
  InstanceNumber?: string;
  Rows?: string;
  Columns?: string;
  BitsAllocated?: string;
  NumberOfFrames?: string;

  // Any additional tag queries
  [tag: string]: string | number | boolean | string[] | undefined;
}

/**
 * QIDO-RS response - array of DICOM JSON objects
 */
export type QIDOResponse = DICOMJSONObject[];

/**
 * DICOM JSON object format (PS3.18 F.2)
 */
export interface DICOMJSONObject {
  [tag: string]: DICOMJSONAttribute;
}

/**
 * DICOM JSON attribute format
 */
export interface DICOMJSONAttribute {
  /** Value Representation */
  vr: ValueRepresentation;
  /** Attribute value(s) */
  Value?: DICOMValue[];
  /** Bulk data URI */
  BulkDataURI?: string;
  /** Inline binary data (base64) */
  InlineBinary?: string;
}

// ============================================================================
// WADO-RS Types (Retrieve)
// ============================================================================

/**
 * WADO-RS accept media types
 */
export type WADOAcceptType =
  | 'multipart/related; type="application/dicom"'
  | 'multipart/related; type="application/octet-stream"'
  | 'application/dicom+json'
  | 'application/json'
  | 'multipart/related; type="image/jpeg"'
  | 'multipart/related; type="image/gif"'
  | 'multipart/related; type="image/png"'
  | 'multipart/related; type="image/jp2"'
  | 'multipart/related; type="image/jpx"'
  | 'multipart/related; type="video/mpeg"'
  | 'multipart/related; type="video/mp4"'
  | 'multipart/related; type="video/H265"'
  | 'application/pdf'
  | 'text/html'
  | 'text/plain'
  | 'text/xml'
  | 'text/rtf'
  | 'application/octet-stream';

/**
 * WADO-RS retrieve options
 */
export interface WADORetrieveOptions {
  /** Accept media type */
  accept?: WADOAcceptType | string;
  /** Transfer syntax for DICOM retrieval */
  transferSyntax?: TransferSyntaxUID | string;
  /** Quality for lossy retrieval (1-100) */
  quality?: number;
  /** Viewport width for rendered images */
  viewport?: { width: number; height: number };
  /** Window center/width for rendered images */
  window?: { center: number; width: number };
  /** Frame numbers to retrieve */
  frames?: number[];
  /** Annotation settings for rendered images */
  annotation?: string;
  /** Image region for rendered images */
  region?: { left: number; top: number; right: number; bottom: number };
}

/**
 * WADO-RS multipart response
 */
export interface WADOMultipartResponse {
  /** Content type of the response */
  contentType: string;
  /** Individual parts */
  parts: WADOResponsePart[];
}

/**
 * Individual part of a multipart response
 */
export interface WADOResponsePart {
  /** Content type of this part */
  contentType: string;
  /** Content location (instance UID) */
  contentLocation?: string;
  /** Binary data */
  data: ArrayBuffer;
}

// ============================================================================
// STOW-RS Types (Store)
// ============================================================================

/**
 * STOW-RS store request
 */
export interface STOWRequest {
  /** DICOM instances to store (as ArrayBuffer or Blob) */
  instances: Array<ArrayBuffer | Blob>;
  /** Study Instance UID (optional - creates new study if not provided) */
  studyInstanceUID?: string;
  /** Content type of instances */
  contentType?: 'application/dicom' | 'application/dicom+json';
}

/**
 * STOW-RS store response
 */
export interface STOWResponse {
  /** HTTP status code */
  status: number;
  /** Status message */
  message: string;
  /** Successfully stored instances */
  successfulInstances: STOWInstanceResult[];
  /** Failed instances */
  failedInstances: STOWInstanceResult[];
  /** Warning instances */
  warningInstances: STOWInstanceResult[];
  /** Raw response if available */
  rawResponse?: DICOMJSONObject;
}

/**
 * STOW-RS instance result
 */
export interface STOWInstanceResult {
  /** SOP Instance UID */
  sopInstanceUID: string;
  /** SOP Class UID */
  sopClassUID: string;
  /** Retrieve URL */
  retrieveURL?: string;
  /** Failure reason code */
  failureReason?: number;
  /** Warning reason */
  warningReason?: string;
}

// ============================================================================
// UPS-RS Types (Unified Procedure Step)
// ============================================================================

/**
 * UPS state values
 */
export type UPSState =
  | 'SCHEDULED'
  | 'IN PROGRESS'
  | 'CANCELED'
  | 'COMPLETED';

/**
 * UPS-RS workitem
 */
export interface UPSWorkitem {
  /** SOP Instance UID of the UPS */
  sopInstanceUID: string;
  /** Procedure Step State */
  procedureStepState: UPSState;
  /** Progress Information */
  progressInformation?: {
    numberOfCompletedSuboperations?: number;
    numberOfFailedSuboperations?: number;
    numberOfWarningSuboperations?: number;
    numberOfRemainingSuboperations?: number;
  };
  /** Scheduled Workitem Code Sequence */
  scheduledWorkitemCodes?: CodeSequenceItem[];
  /** Scheduled Station Name */
  scheduledStationName?: string;
  /** Scheduled Station AE Title */
  scheduledStationAETitle?: string;
  /** Scheduled Procedure Step Start DateTime */
  scheduledProcedureStepStartDateTime?: string;
  /** Scheduled Procedure Step Modification DateTime */
  scheduledProcedureStepModificationDateTime?: string;
  /** Input Information Sequence */
  inputInformationSequence?: any[];
  /** Output Information Sequence */
  outputInformationSequence?: any[];
  /** Worklist Label */
  worklistLabel?: string;
  /** Transaction UID (when claimed) */
  transactionUID?: string;
}

/**
 * UPS-RS query parameters
 */
export interface UPSQueryParams {
  /** Workitem UID */
  workitem?: string;
  /** Procedure Step State */
  ProcedureStepState?: UPSState;
  /** Scheduled Station AE Title */
  ScheduledStationAETitle?: string;
  /** Scheduled Station Name */
  ScheduledStationName?: string;
  /** Scheduled Procedure Step Start Date */
  ScheduledProcedureStepStartDate?: string;
  /** Worklist Label */
  WorklistLabel?: string;
  /** Limit */
  limit?: number;
  /** Offset */
  offset?: number;
}

/**
 * UPS-RS subscription
 */
export interface UPSSubscription {
  /** Subscriber AE Title */
  subscriberAETitle: string;
  /** Worklist UID (if global subscription) */
  worklistUID?: string;
  /** Workitem UID (if specific subscription) */
  workitemUID?: string;
  /** Whether to receive deletion events */
  deletionLock?: boolean;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * DICOMweb error
 */
export interface DICOMwebError {
  /** HTTP status code */
  status: number;
  /** Error message */
  message: string;
  /** Error code (if available) */
  code?: string;
  /** Additional details */
  details?: any;
  /** Original error */
  originalError?: Error;
}

/**
 * DICOM status codes
 */
export const DICOMStatusCodes = {
  // Success
  Success: 0x0000,
  SuccessWarningOutOfResources: 0xB000,
  SuccessWarningAttributeListError: 0xB007,
  SuccessWarningElementCoercion: 0xB006,
  SuccessWarningDataSetNotMatching: 0xB008,

  // Failures
  FailureOutOfResources: 0xA700,
  FailureDataSetNotMatching: 0xA900,
  FailureCannotUnderstand: 0xC000,
  FailureUIDExists: 0xC001,
  FailureNoSuchObjectInstance: 0xC002,
  FailureInvalidAttributeValue: 0xC003,
  FailureRefusedNotAuthorized: 0x0124,
  FailureRefusedOutOfResources: 0xA700,
  FailureInvalidArgumentValue: 0xA801,
  FailureProcessingFailure: 0x0110,
  FailureNoSuchAttribute: 0x0105,
  FailureMissingAttribute: 0x0120,
  FailureMissingAttributeValue: 0x0121,

  // Cancel
  Cancel: 0xFE00,

  // Pending
  Pending: 0xFF00,
  PendingWarning: 0xFF01,
} as const;

export type DICOMStatusCode = typeof DICOMStatusCodes[keyof typeof DICOMStatusCodes];
