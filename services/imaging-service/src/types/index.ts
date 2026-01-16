import { Priority, Modality, OrderStatus, StudyStatus, ReportStatus, Severity } from '../generated/client';

export interface CreateImagingOrderDTO {
  patientId: string;
  providerId: string;
  facilityId: string;
  priority?: Priority;
  modality: Modality;
  bodyPart: string;
  clinicalIndication: string;
  instructions?: string;
  urgency?: string;
  transportRequired?: boolean;
  contrastAllergy?: boolean;
  contrastNotes?: string;
  scheduledAt?: Date;
  requestedBy: string;
}

export interface UpdateImagingOrderDTO {
  priority?: Priority;
  status?: OrderStatus;
  scheduledAt?: Date;
  instructions?: string;
}

export interface CreateStudyDTO {
  orderId: string;
  studyDate: Date;
  studyTime?: string;
  studyDescription: string;
  modality: Modality;
  bodyPart: string;
  patientId: string;
  patientName: string;
  patientDOB?: Date;
  patientSex?: string;
  performingPhysician?: string;
  operatorName?: string;
  institutionName?: string;
  stationName?: string;
  priority?: Priority;
}

export interface UpdateStudyDTO {
  status?: StudyStatus;
  numberOfSeries?: number;
  numberOfInstances?: number;
  performingPhysician?: string;
}

export interface CreateImageDTO {
  studyId: string;
  seriesInstanceUID: string;
  sopInstanceUID: string;
  instanceNumber: number;
  seriesNumber: number;
  seriesDescription?: string;
  imageType?: string;
  photometricInterpretation?: string;
  rows?: number;
  columns?: number;
  bitsAllocated?: number;
  bitsStored?: number;
  pixelSpacing?: string;
  sliceThickness?: number;
  sliceLocation?: number;
  imagePosition?: string;
  imageOrientation?: string;
  acquisitionDate?: Date;
  acquisitionTime?: string;
  contentDate?: Date;
  contentTime?: string;
  windowCenter?: string;
  windowWidth?: string;
  storageUrl: string;
  thumbnailUrl?: string;
  fileSize: bigint;
  transferSyntaxUID?: string;
  metadata?: any;
}

export interface CreateRadiologyReportDTO {
  studyId: string;
  radiologistId: string;
  radiologistName: string;
  clinicalHistory?: string;
  technique?: string;
  comparison?: string;
  findings: string;
  impression: string;
  recommendations?: string;
  status?: ReportStatus;
  template?: string;
}

export interface UpdateRadiologyReportDTO {
  status?: ReportStatus;
  findings?: string;
  impression?: string;
  recommendations?: string;
  amendmentReason?: string;
  signedBy?: string;
}

export interface CreateCriticalFindingDTO {
  studyId: string;
  reportId?: string;
  finding: string;
  severity: Severity;
  category: string;
  bodyPart?: string;
  reportedBy: string;
  notifiedTo: string[];
  followUpRequired?: boolean;
  followUpAction?: string;
  notes?: string;
}

export interface UpdateCriticalFindingDTO {
  acknowledgedBy?: string;
  followUpStatus?: string;
  notes?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ImagingOrderFilters extends PaginationParams {
  patientId?: string;
  providerId?: string;
  facilityId?: string;
  status?: OrderStatus;
  modality?: Modality;
  priority?: Priority;
  startDate?: Date;
  endDate?: Date;
}

export interface StudyFilters extends PaginationParams {
  patientId?: string;
  orderId?: string;
  modality?: Modality;
  status?: StudyStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface DicomMetadata {
  studyInstanceUID: string;
  seriesInstanceUID: string;
  sopInstanceUID: string;
  patientID: string;
  patientName: string;
  studyDate: string;
  modality: string;
  studyDescription: string;
  seriesDescription?: string;
  instanceNumber: number;
  [key: string]: any;
}

export { Priority, Modality, OrderStatus, StudyStatus, ReportStatus, Severity };
