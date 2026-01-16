// X12 835 Remittance Advice Types
export interface X12835RemittanceAdvice {
  claimId: string;
  payerId: string;
  payerName: string;
  claimStatus: 'paid' | 'denied' | 'partial';
  billedAmount: number;
  allowedAmount: number;
  paidAmount: number;
  patientResponsibility: number;
  adjustments: ClaimAdjustment[];
  serviceLines: ServiceLine[];
}

export interface ClaimAdjustment {
  groupCode: 'CO' | 'OA' | 'PI' | 'PR'; // Contractual Obligation, Other Adjustment, Payer Initiated, Patient Responsibility
  carcCode: string; // Claim Adjustment Reason Code
  carcDescription: string;
  rarcCodes: string[]; // Remittance Advice Remark Codes
  adjustmentAmount: number;
}

export interface ServiceLine {
  procedureCode: string;
  modifiers: string[];
  billedAmount: number;
  allowedAmount: number;
  paidAmount: number;
  deniedAmount: number;
  adjustmentReasons: ClaimAdjustment[];
}

// X12 277 Claim Status Types
export interface X12277ClaimStatus {
  claimId: string;
  statusCategoryCode: string;
  statusCode: string;
  statusDescription: string;
  effectiveDate: Date;
  actionCode?: string;
}

// Common CARC codes used in healthcare
export const COMMON_CARC_CODES: Record<string, string> = {
  '1': 'Deductible Amount',
  '2': 'Coinsurance Amount',
  '3': 'Co-payment Amount',
  '4': 'Procedure code inconsistent with modifier',
  '5': 'Procedure code inconsistent with place of service',
  '6': 'Procedure/Revenue code inconsistent with diagnosis',
  '16': 'Claim/Service lacks information needed for adjudication',
  '18': 'Exact duplicate claim/service',
  '19': 'Claim denied as a duplicate',
  '22': 'Care coordination adjustment',
  '23': 'Payment adjusted due to authorization/pre-certification',
  '26': 'Expenses incurred prior to coverage',
  '27': 'Expenses incurred after coverage terminated',
  '29': 'Timely filing limit exceeded',
  '31': 'Patient cannot be identified',
  '32': 'Our records indicate patient is enrolled in a Medicare Advantage Plan',
  '33': 'Patient ineligible for benefits',
  '45': 'Charges exceed fee schedule/maximum allowable',
  '50': 'Non-covered service',
  '55': 'Procedure/Treatment/Service not provided or authorized',
  '96': 'Non-covered charge(s)',
  '97': 'Payment adjusted due to bundling rules',
  '119': 'Benefit maximum reached',
  '151': 'Payment adjusted for out-of-network status',
  '197': 'Precertification/authorization/notification absent',
  '204': 'Service not covered under current benefit plan',
  '252': 'Attachment/Other documentation required',
};

// Denial Categories with associated CARC codes
export const DENIAL_CATEGORY_CARC_MAPPING: Record<string, string[]> = {
  prior_authorization: ['23', '55', '197'],
  medical_necessity: ['50', '55', '96', '204'],
  coding_error: ['4', '5', '6', '16'],
  duplicate_claim: ['18', '19'],
  timely_filing: ['29'],
  eligibility: ['26', '27', '31', '32', '33'],
  coordination_of_benefits: ['22'],
  bundling: ['97'],
  modifier_issue: ['4'],
  documentation: ['16', '252'],
  non_covered_service: ['50', '96', '204'],
  out_of_network: ['151'],
  benefit_exhausted: ['119'],
};

// Risk prediction types
export interface DenialRiskPrediction {
  claimId: string;
  overallRiskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  riskFactors: RiskFactor[];
  recommendations: string[];
  predictedDenialProbability: number;
  suggestedModifications?: ClaimModification[];
}

export interface RiskFactor {
  factor: string;
  score: number;
  weight: number;
  description: string;
  category: string;
}

export interface ClaimModification {
  field: string;
  currentValue: string;
  suggestedValue: string;
  reason: string;
}

// Appeal generation types
export interface AppealLetterRequest {
  denialId: string;
  appealType: 'clinical_review' | 'administrative_review' | 'peer_to_peer' | 'external_review' | 'expedited';
  additionalContext?: string;
  clinicalNotes?: string;
  medicalRecords?: string[];
}

export interface AppealLetterResponse {
  appealId: string;
  letterContent: string;
  letterHtml: string;
  suggestedDocuments: string[];
  payerSpecificRequirements: string[];
  filingDeadline: Date;
  successProbability: number;
}

// Analytics types
export interface DenialAnalytics {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalDenials: number;
    totalDeniedAmount: number;
    totalRecovered: number;
    totalWrittenOff: number;
    recoveryRate: number;
    averageRecoveryTime: number;
  };
  byCategory: CategoryBreakdown[];
  byPayer: PayerBreakdown[];
  byProcedure: ProcedureBreakdown[];
  trends: TrendData[];
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  amount: number;
  recovered: number;
  recoveryRate: number;
}

export interface PayerBreakdown {
  payerId: string;
  payerName: string;
  count: number;
  amount: number;
  recovered: number;
  recoveryRate: number;
  topDenialReasons: string[];
}

export interface ProcedureBreakdown {
  procedureCode: string;
  description: string;
  count: number;
  amount: number;
  denialRate: number;
  topReasons: string[];
}

export interface TrendData {
  period: string;
  denials: number;
  deniedAmount: number;
  appeals: number;
  recovered: number;
}

// Staff productivity types
export interface StaffProductivityMetrics {
  staffId: string;
  staffName: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    denialsReviewed: number;
    appealsCreated: number;
    appealsSubmitted: number;
    appealsOverturned: number;
    overturnRate: number;
    averageProcessingTime: number;
    totalRecovered: number;
    averageRecoveryPerAppeal: number;
  };
  comparison?: {
    vsPrevious: number; // Percentage change
    vsTeamAverage: number;
  };
}

// Payer strategy types
export interface PayerAppealStrategy {
  payerId: string;
  payerName: string;
  generalStrategy: string;
  denialSpecificStrategies: DenialSpecificStrategy[];
  successFactors: string[];
  pitfallsToAvoid: string[];
  contactInfo: {
    appealAddress?: string;
    faxNumber?: string;
    email?: string;
    portalUrl?: string;
  };
  deadlines: {
    firstLevel: number;
    secondLevel: number;
    externalReview: number;
  };
  requiredDocuments: string[];
  preferredSubmissionMethod: 'electronic' | 'fax' | 'mail' | 'portal';
}

export interface DenialSpecificStrategy {
  carcCode: string;
  category: string;
  strategy: string;
  keyArguments: string[];
  successRate: number;
}
