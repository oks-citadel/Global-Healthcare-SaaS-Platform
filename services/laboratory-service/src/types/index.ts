import { OrderStatus, OrderPriority, TestCategory, TestStatus } from '@prisma/client';

export interface CreateLabOrderInput {
  patientId: string;
  encounterId?: string;
  priority?: OrderPriority;
  tests: Array<{
    testCode: string;
    testName: string;
    category: TestCategory;
  }>;
  clinicalInfo?: string;
  diagnosis?: string;
}

export interface UpdateLabOrderInput {
  status?: OrderStatus;
  collectedAt?: Date;
  completedAt?: Date;
  reportUrl?: string;
}

export interface CreateLabResultInput {
  testId: string;
  componentCode?: string;
  componentName: string;
  value: string;
  numericValue?: number;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  isCritical?: boolean;
  abnormalFlag?: string;
  interpretation?: string;
  notes?: string;
  performedBy?: string;
  verifiedBy?: string;
}

export interface CreateSampleInput {
  orderId: string;
  sampleType: string;
  containerType?: string;
  volume?: string;
  bodySource?: string;
  collectedBy?: string;
  priority?: OrderPriority;
  notes?: string;
}

export interface UpdateSampleInput {
  status?: string;
  receivedAt?: Date;
  condition?: string;
  location?: string;
  rejectionReason?: string;
}

export interface CreateTestCatalogInput {
  code: string;
  name: string;
  category: TestCategory;
  loincCode?: string;
  description?: string;
  methodology?: string;
  preparation?: string;
  sampleType: string;
  containerType?: string;
  minVolume?: string;
  turnaroundTime?: string;
  price: number;
  currency?: string;
  requiresFasting?: boolean;
  requiresConsent?: boolean;
  ageRestriction?: string;
}

export interface ReferenceRangeInput {
  componentCode?: string;
  componentName: string;
  lowValue?: number;
  highValue?: number;
  textValue?: string;
  unit?: string;
  criticalLow?: number;
  criticalHigh?: number;
  ageMin?: number;
  ageMax?: number;
  gender?: string;
  condition?: string;
  interpretation?: string;
}

export interface FilterOptions {
  patientId?: string;
  providerId?: string;
  status?: OrderStatus;
  priority?: OrderPriority;
  startDate?: Date;
  endDate?: Date;
  category?: TestCategory;
  limit?: number;
  offset?: number;
}

export interface FHIRDiagnosticReport {
  resourceType: 'DiagnosticReport';
  id?: string;
  status: string;
  category: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  subject: {
    reference: string;
  };
  encounter?: {
    reference: string;
  };
  effectiveDateTime?: string;
  issued?: string;
  performer?: Array<{
    reference: string;
  }>;
  resultsInterpreter?: Array<{
    reference: string;
  }>;
  specimen?: Array<{
    reference: string;
  }>;
  result?: Array<{
    reference: string;
  }>;
  conclusion?: string;
  conclusionCode?: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
}

export interface FHIRObservation {
  resourceType: 'Observation';
  id?: string;
  status: string;
  category?: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text: string;
  };
  subject: {
    reference: string;
  };
  effectiveDateTime?: string;
  issued?: string;
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  valueString?: string;
  interpretation?: Array<{
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }>;
  referenceRange?: Array<{
    low?: {
      value: number;
      unit: string;
    };
    high?: {
      value: number;
      unit: string;
    };
    type?: {
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    };
  }>;
  note?: Array<{
    text: string;
  }>;
}

export interface HL7Message {
  messageType: string;
  messageControlId: string;
  sendingApplication: string;
  sendingFacility: string;
  receivingApplication: string;
  receivingFacility: string;
  timestamp: Date;
  segments: HL7Segment[];
}

export interface HL7Segment {
  type: string;
  fields: string[];
}

export interface CriticalValueAlert {
  resultId: string;
  patientId: string;
  providerId: string;
  testName: string;
  componentName: string;
  value: string;
  referenceRange?: string;
  severity: 'high' | 'critical';
}

export interface PDFReportOptions {
  orderId: string;
  includeGraphs?: boolean;
  includeHistory?: boolean;
  template?: string;
}

export type { OrderStatus, OrderPriority, TestCategory, TestStatus };
