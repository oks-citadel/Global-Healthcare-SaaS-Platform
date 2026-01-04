/**
 * DICOM Types and Interfaces
 *
 * Comprehensive type definitions for DICOM network operations
 * following DICOM PS3.4, PS3.7, and PS3.8 standards.
 */

// =============================================================================
// DICOM UID Constants
// =============================================================================

export const DICOM_UIDS = {
  // Verification SOP Class
  VerificationSOPClass: '1.2.840.10008.1.1',

  // Query/Retrieve SOP Classes - Study Root
  StudyRootQueryRetrieveInfoModelFind: '1.2.840.10008.5.1.4.1.2.2.1',
  StudyRootQueryRetrieveInfoModelMove: '1.2.840.10008.5.1.4.1.2.2.2',
  StudyRootQueryRetrieveInfoModelGet: '1.2.840.10008.5.1.4.1.2.2.3',

  // Query/Retrieve SOP Classes - Patient Root
  PatientRootQueryRetrieveInfoModelFind: '1.2.840.10008.5.1.4.1.2.1.1',
  PatientRootQueryRetrieveInfoModelMove: '1.2.840.10008.5.1.4.1.2.1.2',
  PatientRootQueryRetrieveInfoModelGet: '1.2.840.10008.5.1.4.1.2.1.3',

  // Modality Worklist
  ModalityWorklistInformationModelFind: '1.2.840.10008.5.1.4.31',

  // Storage SOP Classes
  CTImageStorage: '1.2.840.10008.5.1.4.1.1.2',
  MRImageStorage: '1.2.840.10008.5.1.4.1.1.4',
  CRImageStorage: '1.2.840.10008.5.1.4.1.1.1',
  DXImageStorageForPresentation: '1.2.840.10008.5.1.4.1.1.1.1',
  DXImageStorageForProcessing: '1.2.840.10008.5.1.4.1.1.1.1.1',
  USImageStorage: '1.2.840.10008.5.1.4.1.1.6.1',
  USMultiframeImageStorage: '1.2.840.10008.5.1.4.1.1.3.1',
  NMImageStorage: '1.2.840.10008.5.1.4.1.1.20',
  PETImageStorage: '1.2.840.10008.5.1.4.1.1.128',
  XAImageStorage: '1.2.840.10008.5.1.4.1.1.12.1',
  RFImageStorage: '1.2.840.10008.5.1.4.1.1.12.2',
  SecondaryCaptureImageStorage: '1.2.840.10008.5.1.4.1.1.7',
  DigitalMammographyXRayImageStorageForPresentation: '1.2.840.10008.5.1.4.1.1.1.2',
  DigitalMammographyXRayImageStorageForProcessing: '1.2.840.10008.5.1.4.1.1.1.2.1',
  EnhancedCTImageStorage: '1.2.840.10008.5.1.4.1.1.2.1',
  EnhancedMRImageStorage: '1.2.840.10008.5.1.4.1.1.4.1',

  // Transfer Syntaxes
  ImplicitVRLittleEndian: '1.2.840.10008.1.2',
  ExplicitVRLittleEndian: '1.2.840.10008.1.2.1',
  ExplicitVRBigEndian: '1.2.840.10008.1.2.2',
  JPEGLossless: '1.2.840.10008.1.2.4.70',
  JPEGBaseline: '1.2.840.10008.1.2.4.50',
  JPEG2000Lossless: '1.2.840.10008.1.2.4.90',
  JPEG2000Lossy: '1.2.840.10008.1.2.4.91',

  // Application Context
  DICOMApplicationContextName: '1.2.840.10008.3.1.1.1',
} as const;

// =============================================================================
// DICOM Tags (Common ones used in PACS operations)
// =============================================================================

export const DICOM_TAGS = {
  // Patient Level
  PatientID: '00100020',
  PatientName: '00100010',
  PatientBirthDate: '00100030',
  PatientSex: '00100040',
  PatientAge: '00101010',
  PatientWeight: '00101030',

  // Study Level
  StudyInstanceUID: '0020000D',
  StudyDate: '00080020',
  StudyTime: '00080030',
  StudyDescription: '00081030',
  AccessionNumber: '00080050',
  ReferringPhysicianName: '00080090',
  StudyID: '00200010',
  NumberOfStudyRelatedSeries: '00201206',
  NumberOfStudyRelatedInstances: '00201208',
  ModalitiesInStudy: '00080061',

  // Series Level
  SeriesInstanceUID: '0020000E',
  SeriesNumber: '00200011',
  SeriesDescription: '0008103E',
  Modality: '00080060',
  BodyPartExamined: '00180015',
  NumberOfSeriesRelatedInstances: '00201209',
  PerformingPhysicianName: '00081050',
  OperatorsName: '00081070',

  // Instance Level
  SOPInstanceUID: '00080018',
  SOPClassUID: '00080016',
  InstanceNumber: '00200013',
  ContentDate: '00080023',
  ContentTime: '00080033',
  AcquisitionDate: '00080022',
  AcquisitionTime: '00080032',
  ImageType: '00080008',
  Rows: '00280010',
  Columns: '00280011',
  BitsAllocated: '00280100',
  BitsStored: '00280101',
  PixelSpacing: '00280030',
  SliceThickness: '00180050',
  SliceLocation: '00201041',
  ImagePositionPatient: '00200032',
  ImageOrientationPatient: '00200037',
  WindowCenter: '00281050',
  WindowWidth: '00281051',
  PhotometricInterpretation: '00280004',
  TransferSyntaxUID: '00020010',

  // Institution
  InstitutionName: '00080080',
  StationName: '00081010',

  // Query/Retrieve Level
  QueryRetrieveLevel: '00080052',
  RetrieveAETitle: '00080054',

  // Scheduled Procedure Step (Worklist)
  ScheduledProcedureStepSequence: '00400100',
  ScheduledStationAETitle: '00400001',
  ScheduledProcedureStepStartDate: '00400002',
  ScheduledProcedureStepStartTime: '00400003',
  ScheduledPerformingPhysicianName: '00400006',
  ScheduledProcedureStepDescription: '00400007',
  ScheduledStationName: '00400010',
  ScheduledProcedureStepID: '00400009',
  RequestedProcedureDescription: '00321060',
  RequestedProcedureID: '00401001',
} as const;

// =============================================================================
// Query/Retrieve Levels
// =============================================================================

export type QueryRetrieveLevel = 'PATIENT' | 'STUDY' | 'SERIES' | 'IMAGE';

// =============================================================================
// PACS Configuration Types
// =============================================================================

export interface PACSEndpointConfig {
  /** Unique identifier for this PACS endpoint */
  id: string;
  /** Human-readable name for this endpoint */
  name: string;
  /** AE Title of this application (calling AE) */
  aeTitle: string;
  /** AE Title of the remote PACS (called AE) */
  calledAETitle: string;
  /** PACS hostname or IP */
  host: string;
  /** PACS port */
  port: number;
  /** Connection timeout in milliseconds */
  timeout: number;
  /** Whether to use TLS for connection */
  useTLS: boolean;
  /** TLS certificate path (required if useTLS is true) */
  tlsCertPath?: string;
  /** TLS key path (required if useTLS is true) */
  tlsKeyPath?: string;
  /** TLS CA certificate path */
  tlsCaPath?: string;
  /** Whether to verify TLS certificates */
  tlsVerify: boolean;
  /** Maximum concurrent associations */
  maxAssociations: number;
  /** Supported transfer syntaxes */
  transferSyntaxes: string[];
  /** Supported SOP Classes for storage */
  storageSopClasses: string[];
  /** Whether this is the default PACS */
  isDefault: boolean;
  /** Priority order for selection */
  priority: number;
  /** Whether this endpoint is enabled */
  enabled: boolean;
}

export interface PACSConfiguration {
  /** Local SCP configuration for receiving images */
  localScp: {
    aeTitle: string;
    port: number;
    useTLS: boolean;
    tlsCertPath?: string;
    tlsKeyPath?: string;
    tlsCaPath?: string;
    maxConnections: number;
    storageDirectory: string;
  };
  /** Remote PACS endpoints */
  remoteEndpoints: PACSEndpointConfig[];
  /** Connection pool settings */
  connectionPool: {
    minConnections: number;
    maxConnections: number;
    idleTimeout: number;
    acquireTimeout: number;
    evictionInterval: number;
  };
  /** Operation timeouts */
  timeouts: {
    association: number;
    pdu: number;
    artim: number;
    cFind: number;
    cMove: number;
    cStore: number;
  };
  /** Retry settings */
  retry: {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
  };
}

// =============================================================================
// DICOM Association Types
// =============================================================================

export interface AssociationContext {
  /** Association ID */
  id: string;
  /** Local AE Title */
  callingAETitle: string;
  /** Remote AE Title */
  calledAETitle: string;
  /** Remote host */
  host: string;
  /** Remote port */
  port: number;
  /** Negotiated presentation contexts */
  presentationContexts: PresentationContext[];
  /** Association start time */
  startTime: Date;
  /** Maximum PDU length */
  maxPduLength: number;
  /** Whether association is established */
  isEstablished: boolean;
}

export interface PresentationContext {
  /** Presentation context ID (odd number 1-255) */
  id: number;
  /** Abstract Syntax UID (SOP Class) */
  abstractSyntax: string;
  /** Transfer Syntaxes */
  transferSyntaxes: string[];
  /** Accepted transfer syntax (after negotiation) */
  acceptedTransferSyntax?: string;
  /** Acceptance result */
  result?: PresentationContextResult;
}

export enum PresentationContextResult {
  Acceptance = 0,
  UserRejection = 1,
  NoReason = 2,
  AbstractSyntaxNotSupported = 3,
  TransferSyntaxesNotSupported = 4,
}

export interface AssociationState {
  /** Current state of the association */
  state: 'idle' | 'connecting' | 'associated' | 'releasing' | 'aborted' | 'closed';
  /** Last activity time */
  lastActivity: Date;
  /** Number of pending operations */
  pendingOperations: number;
  /** Error if any */
  error?: Error;
}

// =============================================================================
// C-FIND Types
// =============================================================================

export interface CFindRequest {
  /** Query level */
  level: QueryRetrieveLevel;
  /** Query keys/values */
  queryKeys: DicomDataset;
  /** Maximum results to return */
  maxResults?: number;
  /** Priority */
  priority?: CFindPriority;
}

export enum CFindPriority {
  Low = 0x0002,
  Medium = 0x0000,
  High = 0x0001,
}

export interface CFindResponse {
  /** Status of the response */
  status: CFindStatus;
  /** Matching dataset (null for final response) */
  dataset?: DicomDataset;
  /** Number of remaining matches */
  remainingMatches?: number;
  /** Error message if status indicates error */
  errorMessage?: string;
}

export enum CFindStatus {
  Success = 0x0000,
  Pending = 0xFF00,
  PendingWarning = 0xFF01,
  Cancel = 0xFE00,
  OutOfResources = 0xA700,
  IdentifierDoesNotMatchSOPClass = 0xA900,
  UnableToProcess = 0xC000,
}

// Patient-level query results
export interface PatientQueryResult {
  patientId: string;
  patientName: string;
  patientBirthDate?: string;
  patientSex?: string;
  numberOfPatientRelatedStudies?: number;
  numberOfPatientRelatedSeries?: number;
  numberOfPatientRelatedInstances?: number;
}

// Study-level query results
export interface StudyQueryResult {
  studyInstanceUID: string;
  studyDate?: string;
  studyTime?: string;
  studyDescription?: string;
  accessionNumber?: string;
  patientId: string;
  patientName: string;
  patientBirthDate?: string;
  patientSex?: string;
  referringPhysicianName?: string;
  modalitiesInStudy?: string[];
  numberOfStudyRelatedSeries?: number;
  numberOfStudyRelatedInstances?: number;
  institutionName?: string;
}

// Series-level query results
export interface SeriesQueryResult {
  seriesInstanceUID: string;
  studyInstanceUID: string;
  seriesNumber?: number;
  seriesDescription?: string;
  modality: string;
  bodyPartExamined?: string;
  numberOfSeriesRelatedInstances?: number;
  performingPhysicianName?: string;
  operatorsName?: string;
}

// Instance-level query results
export interface InstanceQueryResult {
  sopInstanceUID: string;
  sopClassUID: string;
  seriesInstanceUID: string;
  studyInstanceUID: string;
  instanceNumber?: number;
  contentDate?: string;
  contentTime?: string;
  imageType?: string[];
  rows?: number;
  columns?: number;
}

// =============================================================================
// C-MOVE Types
// =============================================================================

export interface CMoveRequest {
  /** Query level */
  level: QueryRetrieveLevel;
  /** Destination AE Title */
  destinationAETitle: string;
  /** Identifier dataset */
  identifier: DicomDataset;
  /** Priority */
  priority?: CMovePriority;
}

export enum CMovePriority {
  Low = 0x0002,
  Medium = 0x0000,
  High = 0x0001,
}

export interface CMoveResponse {
  /** Status of the response */
  status: CMoveStatus;
  /** Number of remaining sub-operations */
  remainingSubOperations?: number;
  /** Number of completed sub-operations */
  completedSubOperations?: number;
  /** Number of failed sub-operations */
  failedSubOperations?: number;
  /** Number of warning sub-operations */
  warningSubOperations?: number;
  /** Error message if status indicates error */
  errorMessage?: string;
}

export enum CMoveStatus {
  Success = 0x0000,
  Pending = 0xFF00,
  Cancel = 0xFE00,
  OutOfResources = 0xA701,
  OutOfResourcesUnableToCalculate = 0xA702,
  MoveDestinationUnknown = 0xA801,
  IdentifierDoesNotMatchSOPClass = 0xA900,
  UnableToProcess = 0xC000,
  SubOperationsCompleteWithFailures = 0xB000,
  SubOperationsCompleteWithWarnings = 0x0001,
}

export interface CMoveProgress {
  /** Total instances to retrieve */
  totalInstances: number;
  /** Completed instances */
  completedInstances: number;
  /** Failed instances */
  failedInstances: number;
  /** Warning instances */
  warningInstances: number;
  /** Current percentage */
  percentage: number;
  /** Current instance being retrieved */
  currentInstance?: string;
}

// =============================================================================
// C-STORE Types
// =============================================================================

export interface CStoreRequest {
  /** SOP Class UID */
  sopClassUID: string;
  /** SOP Instance UID */
  sopInstanceUID: string;
  /** Transfer Syntax UID */
  transferSyntaxUID: string;
  /** DICOM dataset to store */
  dataset: Buffer | DicomDataset;
  /** Priority */
  priority?: CStorePriority;
  /** Move originator AE Title (for C-MOVE sub-operations) */
  moveOriginatorAETitle?: string;
  /** Move originator Message ID */
  moveOriginatorMessageID?: number;
}

export enum CStorePriority {
  Low = 0x0002,
  Medium = 0x0000,
  High = 0x0001,
}

export interface CStoreResponse {
  /** Status of the response */
  status: CStoreStatus;
  /** Affected SOP Class UID */
  affectedSOPClassUID: string;
  /** Affected SOP Instance UID */
  affectedSOPInstanceUID: string;
  /** Error message if status indicates error */
  errorMessage?: string;
}

export enum CStoreStatus {
  Success = 0x0000,
  WarningCoercionOfDataElements = 0xB000,
  WarningDataSetDoesNotMatchSOPClass = 0xB007,
  WarningElementsDiscarded = 0xB006,
  OutOfResources = 0xA700,
  DataSetDoesNotMatchSOPClassError = 0xA900,
  CannotUnderstand = 0xC000,
}

// =============================================================================
// C-ECHO Types
// =============================================================================

export interface CEchoRequest {
  /** Optional message ID */
  messageId?: number;
}

export interface CEchoResponse {
  /** Status of the response */
  status: CEchoStatus;
  /** Latency in milliseconds */
  latencyMs: number;
  /** Error message if status indicates error */
  errorMessage?: string;
}

export enum CEchoStatus {
  Success = 0x0000,
  UnrecognizedOperation = 0x0211,
  RefusedNotAuthorized = 0x0124,
}

// =============================================================================
// Modality Worklist Types
// =============================================================================

export interface MWLQueryRequest {
  /** Scheduled procedure step start date range */
  scheduledDateRange?: {
    start?: string;
    end?: string;
  };
  /** Modality filter */
  modality?: string;
  /** Station AE Title filter */
  stationAETitle?: string;
  /** Patient ID filter */
  patientId?: string;
  /** Accession number filter */
  accessionNumber?: string;
  /** Maximum results */
  maxResults?: number;
}

export interface MWLQueryResult {
  /** Accession Number */
  accessionNumber: string;
  /** Patient ID */
  patientId: string;
  /** Patient Name */
  patientName: string;
  /** Patient Birth Date */
  patientBirthDate?: string;
  /** Patient Sex */
  patientSex?: string;
  /** Study Instance UID */
  studyInstanceUID?: string;
  /** Requested Procedure Description */
  requestedProcedureDescription?: string;
  /** Requested Procedure ID */
  requestedProcedureID?: string;
  /** Scheduled Procedure Step items */
  scheduledProcedureSteps: ScheduledProcedureStep[];
  /** Referring Physician Name */
  referringPhysicianName?: string;
}

export interface ScheduledProcedureStep {
  /** Scheduled Station AE Title */
  scheduledStationAETitle?: string;
  /** Scheduled Procedure Step Start Date */
  scheduledStartDate: string;
  /** Scheduled Procedure Step Start Time */
  scheduledStartTime?: string;
  /** Modality */
  modality: string;
  /** Scheduled Performing Physician Name */
  scheduledPerformingPhysicianName?: string;
  /** Scheduled Procedure Step Description */
  scheduledProcedureStepDescription?: string;
  /** Scheduled Station Name */
  scheduledStationName?: string;
  /** Scheduled Procedure Step ID */
  scheduledProcedureStepID?: string;
}

// =============================================================================
// DICOM Dataset Types
// =============================================================================

export interface DicomDataset {
  [tag: string]: DicomElement | DicomDataset[] | undefined;
}

export interface DicomElement {
  /** VR (Value Representation) */
  vr: ValueRepresentation;
  /** Value(s) */
  value: DicomValue | DicomValue[];
}

export type DicomValue =
  | string
  | number
  | Buffer
  | Date
  | DicomDataset
  | null;

export type ValueRepresentation =
  | 'AE' // Application Entity
  | 'AS' // Age String
  | 'AT' // Attribute Tag
  | 'CS' // Code String
  | 'DA' // Date
  | 'DS' // Decimal String
  | 'DT' // Date Time
  | 'FL' // Floating Point Single
  | 'FD' // Floating Point Double
  | 'IS' // Integer String
  | 'LO' // Long String
  | 'LT' // Long Text
  | 'OB' // Other Byte
  | 'OD' // Other Double
  | 'OF' // Other Float
  | 'OL' // Other Long
  | 'OW' // Other Word
  | 'PN' // Person Name
  | 'SH' // Short String
  | 'SL' // Signed Long
  | 'SQ' // Sequence
  | 'SS' // Signed Short
  | 'ST' // Short Text
  | 'TM' // Time
  | 'UC' // Unlimited Characters
  | 'UI' // Unique Identifier
  | 'UL' // Unsigned Long
  | 'UN' // Unknown
  | 'UR' // URI/URL
  | 'US' // Unsigned Short
  | 'UT'; // Unlimited Text

// =============================================================================
// Connection Pool Types
// =============================================================================

export interface PooledConnection {
  /** Connection ID */
  id: string;
  /** Association context */
  association: AssociationContext;
  /** Whether connection is in use */
  inUse: boolean;
  /** Creation time */
  createdAt: Date;
  /** Last used time */
  lastUsedAt: Date;
  /** Number of times used */
  useCount: number;
}

export interface ConnectionPoolStats {
  /** Total connections in pool */
  totalConnections: number;
  /** Connections currently in use */
  activeConnections: number;
  /** Idle connections */
  idleConnections: number;
  /** Pending connection requests */
  pendingRequests: number;
  /** Total connections created */
  totalCreated: number;
  /** Total connections destroyed */
  totalDestroyed: number;
  /** Average acquisition time (ms) */
  avgAcquisitionTime: number;
}

// =============================================================================
// Event Types
// =============================================================================

export interface PACSEvent {
  /** Event type */
  type: PACSEventType;
  /** Timestamp */
  timestamp: Date;
  /** Associated endpoint ID */
  endpointId?: string;
  /** Event details */
  details: Record<string, unknown>;
}

export type PACSEventType =
  | 'association.requested'
  | 'association.accepted'
  | 'association.rejected'
  | 'association.released'
  | 'association.aborted'
  | 'operation.cfind.started'
  | 'operation.cfind.completed'
  | 'operation.cfind.failed'
  | 'operation.cmove.started'
  | 'operation.cmove.progress'
  | 'operation.cmove.completed'
  | 'operation.cmove.failed'
  | 'operation.cstore.received'
  | 'operation.cstore.completed'
  | 'operation.cstore.failed'
  | 'operation.cecho.completed'
  | 'connection.pool.exhausted'
  | 'connection.pool.recovered'
  | 'error.timeout'
  | 'error.network'
  | 'error.protocol';

// =============================================================================
// Audit Log Types
// =============================================================================

export interface PACSAuditEntry {
  /** Entry ID */
  id: string;
  /** Timestamp */
  timestamp: Date;
  /** Operation type */
  operation: PACSOperation;
  /** User ID performing the operation */
  userId?: string;
  /** Patient ID involved */
  patientId?: string;
  /** Study Instance UID involved */
  studyInstanceUID?: string;
  /** Source endpoint */
  sourceEndpoint?: string;
  /** Destination endpoint */
  destinationEndpoint?: string;
  /** Operation result */
  result: 'success' | 'failure' | 'partial';
  /** Additional details */
  details: Record<string, unknown>;
  /** Error message if failed */
  errorMessage?: string;
}

export type PACSOperation =
  | 'C-ECHO'
  | 'C-FIND-PATIENT'
  | 'C-FIND-STUDY'
  | 'C-FIND-SERIES'
  | 'C-FIND-INSTANCE'
  | 'C-MOVE-STUDY'
  | 'C-MOVE-SERIES'
  | 'C-MOVE-INSTANCE'
  | 'C-STORE-SEND'
  | 'C-STORE-RECEIVE'
  | 'MWL-QUERY'
  | 'ASSOCIATION-REQUEST'
  | 'ASSOCIATION-RELEASE';

// =============================================================================
// Error Types
// =============================================================================

export class DicomError extends Error {
  constructor(
    message: string,
    public readonly code: DicomErrorCode,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DicomError';
  }
}

export enum DicomErrorCode {
  // Association errors
  AssociationRejected = 'ASSOCIATION_REJECTED',
  AssociationAborted = 'ASSOCIATION_ABORTED',
  AssociationTimeout = 'ASSOCIATION_TIMEOUT',

  // Network errors
  ConnectionFailed = 'CONNECTION_FAILED',
  ConnectionTimeout = 'CONNECTION_TIMEOUT',
  ConnectionClosed = 'CONNECTION_CLOSED',

  // Protocol errors
  InvalidPDU = 'INVALID_PDU',
  InvalidDIMSE = 'INVALID_DIMSE',
  UnsupportedSOPClass = 'UNSUPPORTED_SOP_CLASS',
  UnsupportedTransferSyntax = 'UNSUPPORTED_TRANSFER_SYNTAX',

  // Operation errors
  OperationFailed = 'OPERATION_FAILED',
  OperationCancelled = 'OPERATION_CANCELLED',
  OperationTimeout = 'OPERATION_TIMEOUT',

  // Data errors
  InvalidDataset = 'INVALID_DATASET',
  MissingRequiredTag = 'MISSING_REQUIRED_TAG',
  InvalidTagValue = 'INVALID_TAG_VALUE',

  // Storage errors
  StorageFailed = 'STORAGE_FAILED',
  DuplicateInstance = 'DUPLICATE_INSTANCE',

  // Configuration errors
  InvalidConfiguration = 'INVALID_CONFIGURATION',
  EndpointNotFound = 'ENDPOINT_NOT_FOUND',
}
