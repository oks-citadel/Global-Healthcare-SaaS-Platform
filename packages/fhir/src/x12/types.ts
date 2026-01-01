/**
 * X12 EDI Transaction Types
 * Healthcare EDI Standards for Claims, Eligibility, and Prior Authorization
 * Based on ASC X12 standards commonly used in US healthcare
 */

// ============================================================================
// Base Types and Enums
// ============================================================================

export type X12TransactionType =
  | '837P'   // Professional Claim
  | '837I'   // Institutional Claim
  | '835'    // Payment/Remittance Advice
  | '270'    // Eligibility Inquiry
  | '271'    // Eligibility Response
  | '276'    // Claim Status Inquiry
  | '277'    // Claim Status Response
  | '278';   // Prior Authorization

export type X12VersionCode = '005010X222A1' | '005010X223A2' | '005010X224A2' | '005010X279A1' | '005010X212';

export interface X12Segment {
  segmentId: string;
  elements: string[];
}

export interface X12Loop {
  loopId: string;
  segments: X12Segment[];
  childLoops?: X12Loop[];
}

// ============================================================================
// Envelope Segments (ISA/GS/ST/SE/GE/IEA)
// ============================================================================

export interface ISASegment {
  authorizationQualifier: string;           // ISA01
  authorizationInfo: string;                 // ISA02
  securityQualifier: string;                 // ISA03
  securityInfo: string;                      // ISA04
  senderIdQualifier: string;                 // ISA05
  senderId: string;                          // ISA06
  receiverIdQualifier: string;               // ISA07
  receiverId: string;                        // ISA08
  date: string;                              // ISA09 (YYMMDD)
  time: string;                              // ISA10 (HHMM)
  repetitionSeparator: string;               // ISA11
  versionNumber: string;                     // ISA12
  controlNumber: string;                     // ISA13
  acknowledgmentRequested: '0' | '1';        // ISA14
  usageIndicator: 'T' | 'P';                 // ISA15 (T=Test, P=Production)
  componentSeparator: string;                // ISA16
}

export interface GSSegment {
  functionalIdCode: string;                  // GS01 (HC=Healthcare Claim)
  applicationSenderCode: string;             // GS02
  applicationReceiverCode: string;           // GS03
  date: string;                              // GS04 (CCYYMMDD)
  time: string;                              // GS05 (HHMM or HHMMSS)
  groupControlNumber: string;                // GS06
  responsibleAgencyCode: string;             // GS07 (X = X12)
  versionCode: X12VersionCode;               // GS08
}

export interface STSegment {
  transactionSetIdCode: string;              // ST01 (837, 835, 270, 271, 276, 277, 278)
  transactionSetControlNumber: string;       // ST02
  implementationConventionReference?: string; // ST03
}

export interface X12Envelope {
  isa: ISASegment;
  gs: GSSegment;
  st: STSegment;
}

// ============================================================================
// Common Data Types
// ============================================================================

export interface X12Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode?: string;
}

export interface X12Name {
  lastName: string;
  firstName?: string;
  middleName?: string;
  prefix?: string;
  suffix?: string;
  entityType: '1' | '2';  // 1=Person, 2=Non-Person
}

export interface X12EntityIdentifier {
  entityIdentifierCode: string;  // NM1 segment entity codes
  entityTypeQualifier: '1' | '2';
  name: X12Name;
  identificationCodeQualifier?: string;
  identificationCode?: string;
}

export interface X12DateRange {
  fromDate: string;  // CCYYMMDD
  toDate?: string;   // CCYYMMDD
}

export interface X12MonetaryAmount {
  amount: number;
  qualifier?: string;
}

export interface X12ServiceLine {
  lineNumber: number;
  procedureCode: string;
  procedureModifiers?: string[];
  diagnosisPointers: number[];
  chargeAmount: number;
  units: number;
  unitType: string;  // UN=Unit, MJ=Minutes, etc.
  serviceDate: string;
  serviceDateEnd?: string;
  placeOfService?: string;
  renderingProvider?: X12EntityIdentifier;
  referenceIds?: X12ReferenceId[];
}

export interface X12ReferenceId {
  qualifier: string;
  value: string;
  description?: string;
}

export interface X12DiagnosisCode {
  code: string;
  codeType: 'ABK' | 'BK' | 'ABF' | 'BF';  // ICD-10-CM, ICD-9-CM, ICD-10-PCS, ICD-9-PCS
  isPrincipal: boolean;
}

// ============================================================================
// Base X12 Transaction
// ============================================================================

export interface X12Transaction {
  transactionType: X12TransactionType;
  envelope: X12Envelope;
  rawSegments?: X12Segment[];
  loops?: X12Loop[];
  createdAt?: string;
  validationErrors?: string[];
}

// ============================================================================
// 837P - Professional Claim
// ============================================================================

export interface X12_837P_Subscriber {
  memberId: string;
  name: X12Name;
  address?: X12Address;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'U';
  groupNumber?: string;
  relationshipCode: string;  // 18=Self, 01=Spouse, 19=Child, etc.
}

export interface X12_837P_Patient {
  name: X12Name;
  address?: X12Address;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'U';
  relationshipToSubscriber: string;
}

export interface X12_837P_BillingProvider {
  name: string;
  npi: string;
  taxonomyCode?: string;
  address: X12Address;
  taxId: string;
  taxIdQualifier: 'EI' | 'SY';  // EIN or SSN
  contactName?: string;
  contactPhone?: string;
}

export interface X12_837P_RenderingProvider {
  name: X12Name;
  npi: string;
  taxonomyCode?: string;
}

export interface X12_837P_ReferringProvider {
  name: X12Name;
  npi: string;
}

export interface X12_837P_Payer {
  name: string;
  payerId: string;
  address?: X12Address;
}

export interface X12_837P_ClaimInformation {
  claimId: string;
  totalChargeAmount: number;
  facilityCode: string;
  frequencyCode: '1' | '7' | '8';  // 1=Original, 7=Replacement, 8=Void
  providerSignatureOnFile: boolean;
  assignmentOfBenefits: boolean;
  releaseOfInformation: 'Y' | 'I' | 'N';
  patientPaidAmount?: number;
  serviceFacilityLocation?: X12Address;
  priorAuthorizationNumber?: string;
  referralNumber?: string;
  claimNote?: string;
}

export interface X12_837P extends X12Transaction {
  transactionType: '837P';
  billingProvider: X12_837P_BillingProvider;
  subscriber: X12_837P_Subscriber;
  patient?: X12_837P_Patient;  // Only if patient is not the subscriber
  payer: X12_837P_Payer;
  renderingProvider?: X12_837P_RenderingProvider;
  referringProvider?: X12_837P_ReferringProvider;
  claimInformation: X12_837P_ClaimInformation;
  diagnosisCodes: X12DiagnosisCode[];
  serviceLines: X12ServiceLine[];
}

// ============================================================================
// 837I - Institutional Claim
// ============================================================================

export interface X12_837I_FacilityInfo {
  typeOfBill: string;  // 4-digit code
  admissionDate?: string;
  admissionHour?: string;
  admissionTypeCode?: string;
  admissionSourceCode?: string;
  patientStatusCode?: string;
  dischargeDate?: string;
  dischargeHour?: string;
}

export interface X12_837I_AttendingProvider {
  name: X12Name;
  npi: string;
  taxonomyCode?: string;
}

export interface X12_837I_OperatingProvider {
  name: X12Name;
  npi: string;
}

export interface X12_837I_OtherProvider {
  providerType: string;
  name: X12Name;
  npi: string;
}

export interface X12_837I_ValueCode {
  code: string;
  amount: number;
}

export interface X12_837I_ConditionCode {
  code: string;
}

export interface X12_837I_OccurrenceCode {
  code: string;
  date: string;
}

export interface X12_837I_ServiceLine {
  lineNumber: number;
  revenueCode: string;
  procedureCode?: string;
  procedureModifiers?: string[];
  serviceDate: string;
  serviceDateEnd?: string;
  serviceUnits: number;
  unitType: string;
  chargeAmount: number;
  nonCoveredCharges?: number;
  diagnosisPointers?: number[];
}

export interface X12_837I extends X12Transaction {
  transactionType: '837I';
  billingProvider: X12_837P_BillingProvider;
  payToProvider?: X12_837P_BillingProvider;
  subscriber: X12_837P_Subscriber;
  patient?: X12_837P_Patient;
  payer: X12_837P_Payer;
  attendingProvider?: X12_837I_AttendingProvider;
  operatingProvider?: X12_837I_OperatingProvider;
  otherProviders?: X12_837I_OtherProvider[];
  claimInformation: X12_837P_ClaimInformation;
  facilityInfo: X12_837I_FacilityInfo;
  diagnosisCodes: X12DiagnosisCode[];
  procedureCodes?: Array<{
    code: string;
    date: string;
  }>;
  conditionCodes?: X12_837I_ConditionCode[];
  occurrenceCodes?: X12_837I_OccurrenceCode[];
  valueCodes?: X12_837I_ValueCode[];
  serviceLines: X12_837I_ServiceLine[];
}

// ============================================================================
// 835 - Payment/Remittance Advice
// ============================================================================

export interface X12_835_PayerInfo {
  name: string;
  payerId: string;
  address?: X12Address;
  contactName?: string;
  contactPhone?: string;
}

export interface X12_835_PayeeInfo {
  name: string;
  npi: string;
  taxId?: string;
  address?: X12Address;
}

export interface X12_835_ClaimPayment {
  claimId: string;
  claimStatus: '1' | '2' | '3' | '4' | '19' | '20' | '21' | '22' | '23';
  totalClaimChargeAmount: number;
  totalClaimPaymentAmount: number;
  patientResponsibilityAmount?: number;
  claimFilingIndicator?: string;
  payerClaimControlNumber?: string;
  facilityCode?: string;
  claimFrequencyCode?: string;
  patientName?: X12Name;
  subscriberName?: X12Name;
  correctedPatientInfo?: {
    firstName?: string;
    lastName?: string;
    memberId?: string;
  };
  serviceDateRange?: X12DateRange;
  serviceLines: X12_835_ServiceLinePayment[];
  adjustments?: X12_835_ClaimAdjustment[];
}

export interface X12_835_ServiceLinePayment {
  procedureCode: string;
  procedureModifiers?: string[];
  chargeAmount: number;
  paidAmount: number;
  revenueCode?: string;
  units?: number;
  serviceDate?: string;
  adjustments?: X12_835_Adjustment[];
  remarkCodes?: string[];
  allowedAmount?: number;
}

export interface X12_835_Adjustment {
  groupCode: 'CO' | 'CR' | 'OA' | 'PI' | 'PR';  // Contractual, Correction, Other, Payer, Patient
  reasonCode: string;
  amount: number;
  quantity?: number;
}

export interface X12_835_ClaimAdjustment {
  adjustmentGroupCode: string;
  adjustmentReasonCode: string;
  adjustmentAmount: number;
  adjustmentQuantity?: number;
}

export interface X12_835_ProviderSummary {
  fiscalPeriodEnd: string;
  claimCount: number;
  totalClaimChargeAmount: number;
  totalClaimPaymentAmount: number;
}

export interface X12_835 extends X12Transaction {
  transactionType: '835';
  payerInfo: X12_835_PayerInfo;
  payeeInfo: X12_835_PayeeInfo;
  paymentMethod: 'ACH' | 'CHK' | 'NON';  // ACH, Check, Non-payment
  paymentDate: string;
  paymentAmount: number;
  checkOrEFTNumber?: string;
  providerSummary?: X12_835_ProviderSummary;
  claimPayments: X12_835_ClaimPayment[];
}

// ============================================================================
// 270 - Eligibility Inquiry
// ============================================================================

export interface X12_270_InformationSource {
  name: string;
  payerId: string;
}

export interface X12_270_InformationReceiver {
  name: string;
  npi: string;
  referenceId?: string;
}

export interface X12_270_Subscriber {
  memberId: string;
  name: X12Name;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'U';
  groupNumber?: string;
  address?: X12Address;
  relationshipCode?: string;
}

export interface X12_270_Dependent {
  name: X12Name;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'U';
  relationshipCode: string;
}

export interface X12_270_EligibilityInquiry {
  serviceTypeCode: string;  // 30=Health Benefit Plan Coverage, 1=Medical Care, etc.
  serviceDate?: string;
  serviceDateRange?: X12DateRange;
  procedureCode?: string;
  diagnosisCode?: string;
  facilityTypeCode?: string;
}

export interface X12_270 extends X12Transaction {
  transactionType: '270';
  informationSource: X12_270_InformationSource;
  informationReceiver: X12_270_InformationReceiver;
  subscriber: X12_270_Subscriber;
  dependent?: X12_270_Dependent;
  eligibilityInquiries: X12_270_EligibilityInquiry[];
}

// ============================================================================
// 271 - Eligibility Response
// ============================================================================

export interface X12_271_EligibilityBenefit {
  informationStatusCode: '1' | '6';  // 1=Active, 6=Inactive
  benefitCoverageLevel?: string;  // IND=Individual, FAM=Family, etc.
  serviceTypeCode: string;
  insuranceTypeCode?: string;
  planCoverageDescription?: string;
  timePeriodQualifier?: string;
  monetaryAmount?: number;
  percent?: number;
  quantity?: number;
  authorizationRequired?: boolean;
  inPlanNetworkIndicator?: 'Y' | 'N' | 'W' | 'U';
  compositeDiagnosisCodePointer?: string;
  dateRange?: X12DateRange;
  entityInfo?: X12EntityIdentifier;
  additionalInfo?: string[];
}

export interface X12_271_SubscriberResponse {
  memberId: string;
  name: X12Name;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'U';
  groupNumber?: string;
  groupName?: string;
  address?: X12Address;
  subscriberDates?: Array<{
    qualifier: string;
    date: string;
  }>;
  eligibilityBenefits: X12_271_EligibilityBenefit[];
}

export interface X12_271 extends X12Transaction {
  transactionType: '271';
  informationSource: X12_270_InformationSource;
  informationReceiver: X12_270_InformationReceiver;
  subscriber: X12_271_SubscriberResponse;
  dependent?: {
    name: X12Name;
    dateOfBirth?: string;
    gender?: 'M' | 'F' | 'U';
    relationshipCode: string;
    eligibilityBenefits: X12_271_EligibilityBenefit[];
  };
  requestValidation?: {
    validRequest: boolean;
    rejectReasonCode?: string;
    followUpActionCode?: string;
  };
}

// ============================================================================
// 276 - Claim Status Inquiry
// ============================================================================

export interface X12_276_ClaimStatusInquiry {
  claimId: string;
  claimSubmissionDate?: string;
  serviceLineInfo?: {
    procedureCode?: string;
    serviceDate?: string;
    chargeAmount?: number;
  };
}

export interface X12_276 extends X12Transaction {
  transactionType: '276';
  informationSource: X12_270_InformationSource;
  informationReceiver: X12_270_InformationReceiver;
  serviceProvider?: {
    name: string;
    npi: string;
    taxId?: string;
  };
  subscriber: X12_270_Subscriber;
  dependent?: X12_270_Dependent;
  claimStatusInquiries: X12_276_ClaimStatusInquiry[];
}

// ============================================================================
// 277 - Claim Status Response
// ============================================================================

export interface X12_277_ClaimStatus {
  claimId: string;
  claimStatusCategoryCode: string;  // A0-A8, various status categories
  claimStatusCode: string;
  effectiveDate?: string;
  totalClaimChargeAmount?: number;
  totalClaimPaymentAmount?: number;
  payerClaimControlNumber?: string;
  adjudicationDate?: string;
  remittanceDate?: string;
  checkDate?: string;
  checkNumber?: string;
  serviceLineStatuses?: X12_277_ServiceLineStatus[];
}

export interface X12_277_ServiceLineStatus {
  procedureCode?: string;
  procedureModifiers?: string[];
  serviceDate?: string;
  chargeAmount?: number;
  paidAmount?: number;
  statusCategoryCode: string;
  statusCode: string;
}

export interface X12_277 extends X12Transaction {
  transactionType: '277';
  informationSource: X12_270_InformationSource;
  informationReceiver: X12_270_InformationReceiver;
  serviceProvider?: {
    name: string;
    npi: string;
  };
  subscriber: {
    memberId: string;
    name: X12Name;
  };
  dependent?: {
    name: X12Name;
    relationshipCode: string;
  };
  claimStatuses: X12_277_ClaimStatus[];
}

// ============================================================================
// 278 - Prior Authorization Request/Response
// ============================================================================

export type X12_278_ActionCode = 'AR' | 'CT';  // AR=Request, CT=Response

export interface X12_278_UMOInfo {
  name: string;
  payerId: string;
  contactName?: string;
  contactPhone?: string;
}

export interface X12_278_RequesterInfo {
  name: string;
  npi: string;
  taxonomyCode?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface X12_278_PatientEvent {
  eventDate: string;
  eventDateEnd?: string;
  admissionDate?: string;
  dischargeDate?: string;
  eventCategoryCode?: string;
  certificationConditionCode?: string;
}

export interface X12_278_ServiceInfo {
  serviceTypeCode: string;
  procedureCode?: string;
  procedureModifiers?: string[];
  diagnosisCode?: string;
  facilityCode?: string;
  serviceQuantity?: number;
  serviceQuantityQualifier?: string;  // DA=Days, VS=Visits, etc.
}

export interface X12_278_CertificationInfo {
  certificationNumber?: string;
  certificationActionCode?: 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6';  // Certified, Modified, etc.
  certificationDecisionReasonCode?: string;
  certificationEffectiveDate?: string;
  certificationExpirationDate?: string;
  approvedQuantity?: number;
  approvedQuantityQualifier?: string;
}

export interface X12_278 extends X12Transaction {
  transactionType: '278';
  actionCode: X12_278_ActionCode;  // Request or Response
  umoInfo: X12_278_UMOInfo;  // Utilization Management Organization
  requesterInfo: X12_278_RequesterInfo;
  subscriber: X12_270_Subscriber;
  dependent?: X12_270_Dependent;
  patientEvent: X12_278_PatientEvent;
  serviceInfo: X12_278_ServiceInfo[];
  certificationInfo?: X12_278_CertificationInfo;  // In response
  attendingProvider?: {
    name: X12Name;
    npi: string;
    taxonomyCode?: string;
  };
  referringProvider?: {
    name: X12Name;
    npi: string;
  };
  renderingProvider?: {
    name: X12Name;
    npi: string;
    taxonomyCode?: string;
  };
  serviceFacility?: {
    name: string;
    npi?: string;
    address?: X12Address;
  };
}

// ============================================================================
// Parsing and Generation Types
// ============================================================================

export interface X12ParseOptions {
  segmentTerminator?: string;       // Default: '~'
  elementSeparator?: string;        // Default: '*'
  componentSeparator?: string;      // Default: ':'
  repetitionSeparator?: string;     // Default: '^'
  strict?: boolean;                 // Strict validation mode
}

export interface X12GenerateOptions {
  segmentTerminator?: string;
  elementSeparator?: string;
  componentSeparator?: string;
  repetitionSeparator?: string;
  lineBreaks?: boolean;             // Add line breaks after segments
}

export interface X12ValidationResult {
  valid: boolean;
  errors: X12ValidationError[];
  warnings: X12ValidationWarning[];
}

export interface X12ValidationError {
  code: string;
  message: string;
  segment?: string;
  element?: number;
  loop?: string;
}

export interface X12ValidationWarning {
  code: string;
  message: string;
  segment?: string;
  element?: number;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isX12_837P(tx: X12Transaction): tx is X12_837P {
  return tx.transactionType === '837P';
}

export function isX12_837I(tx: X12Transaction): tx is X12_837I {
  return tx.transactionType === '837I';
}

export function isX12_835(tx: X12Transaction): tx is X12_835 {
  return tx.transactionType === '835';
}

export function isX12_270(tx: X12Transaction): tx is X12_270 {
  return tx.transactionType === '270';
}

export function isX12_271(tx: X12Transaction): tx is X12_271 {
  return tx.transactionType === '271';
}

export function isX12_276(tx: X12Transaction): tx is X12_276 {
  return tx.transactionType === '276';
}

export function isX12_277(tx: X12Transaction): tx is X12_277 {
  return tx.transactionType === '277';
}

export function isX12_278(tx: X12Transaction): tx is X12_278 {
  return tx.transactionType === '278';
}
