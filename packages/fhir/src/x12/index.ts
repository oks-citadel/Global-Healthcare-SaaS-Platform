/**
 * X12 EDI Transaction Support
 * Provides parsing, generation, and FHIR mapping for healthcare EDI transactions
 *
 * Supported Transaction Types:
 * - 837P: Professional Claim
 * - 837I: Institutional Claim
 * - 835: Payment/Remittance Advice
 * - 270: Eligibility Inquiry
 * - 271: Eligibility Response
 * - 276: Claim Status Inquiry
 * - 277: Claim Status Response
 * - 278: Prior Authorization Request/Response
 */

// ============================================================================
// Type Definitions
// ============================================================================

export {
  // Base types
  X12TransactionType,
  X12VersionCode,
  X12Segment,
  X12Loop,
  X12Envelope,
  ISASegment,
  GSSegment,
  STSegment,
  X12Transaction,

  // Common data types
  X12Address,
  X12Name,
  X12EntityIdentifier,
  X12DateRange,
  X12MonetaryAmount,
  X12ServiceLine,
  X12ReferenceId,
  X12DiagnosisCode,

  // 837P Professional Claim
  X12_837P,
  X12_837P_Subscriber,
  X12_837P_Patient,
  X12_837P_BillingProvider,
  X12_837P_RenderingProvider,
  X12_837P_ReferringProvider,
  X12_837P_Payer,
  X12_837P_ClaimInformation,

  // 837I Institutional Claim
  X12_837I,
  X12_837I_FacilityInfo,
  X12_837I_AttendingProvider,
  X12_837I_OperatingProvider,
  X12_837I_OtherProvider,
  X12_837I_ValueCode,
  X12_837I_ConditionCode,
  X12_837I_OccurrenceCode,
  X12_837I_ServiceLine,

  // 835 Payment/Remittance
  X12_835,
  X12_835_PayerInfo,
  X12_835_PayeeInfo,
  X12_835_ClaimPayment,
  X12_835_ServiceLinePayment,
  X12_835_Adjustment,
  X12_835_ClaimAdjustment,
  X12_835_ProviderSummary,

  // 270 Eligibility Inquiry
  X12_270,
  X12_270_InformationSource,
  X12_270_InformationReceiver,
  X12_270_Subscriber,
  X12_270_Dependent,
  X12_270_EligibilityInquiry,

  // 271 Eligibility Response
  X12_271,
  X12_271_EligibilityBenefit,
  X12_271_SubscriberResponse,

  // 276 Claim Status Inquiry
  X12_276,
  X12_276_ClaimStatusInquiry,

  // 277 Claim Status Response
  X12_277,
  X12_277_ClaimStatus,
  X12_277_ServiceLineStatus,

  // 278 Prior Authorization
  X12_278,
  X12_278_ActionCode,
  X12_278_UMOInfo,
  X12_278_RequesterInfo,
  X12_278_PatientEvent,
  X12_278_ServiceInfo,
  X12_278_CertificationInfo,

  // Options and validation
  X12ParseOptions,
  X12GenerateOptions,
  X12ValidationResult,
  X12ValidationError,
  X12ValidationWarning,

  // Type guards
  isX12_837P,
  isX12_837I,
  isX12_835,
  isX12_270,
  isX12_271,
  isX12_276,
  isX12_277,
  isX12_278,
} from './types';

// ============================================================================
// Parser
// ============================================================================

export { X12Parser, x12Parser } from './parser';

// ============================================================================
// Generator
// ============================================================================

export { X12Generator, x12Generator } from './generator';

// ============================================================================
// FHIR Mapping
// ============================================================================

export {
  // FHIR resource types (Claim-specific)
  FHIRClaim,
  FHIRClaimCareTeam,
  FHIRClaimSupportingInfo,
  FHIRClaimDiagnosis,
  FHIRClaimProcedure,
  FHIRClaimInsurance,
  FHIRClaimItem,
  FHIRClaimItemDetail,
  FHIRExplanationOfBenefit,
  FHIREOBInsurance,
  FHIREOBItem,
  FHIREOBAdjudication,
  FHIREOBTotal,
  FHIREOBPayment,
  FHIRCoverage,
  FHIRCoverageClass,
  FHIRCoverageCostToBeneficiary,
  FHIRServiceRequest,

  // X12 to FHIR mapping functions
  x12_837P_to_FHIRClaim,
  x12_837I_to_FHIRClaim,
  x12_835_to_FHIRExplanationOfBenefit,
  x12_271_to_FHIRCoverage,
  x12_278_to_FHIRServiceRequest,

  // FHIR to X12 mapping functions
  FHIRClaim_to_x12_837P,
  FHIREob_to_x12_835_ClaimPayment,
  FHIRCoverage_to_x12_271_EligibilityBenefit,
  FHIRServiceRequest_to_x12_278,

  // Mapper utility object
  X12FHIRMapper,
} from './fhir-mapping';

// ============================================================================
// Convenience Functions
// ============================================================================

import { X12Parser } from './parser';
import { X12Generator } from './generator';
import { X12Transaction, X12ParseOptions, X12GenerateOptions } from './types';

/**
 * Parse an X12 EDI string into a structured transaction object
 */
export function parseX12(ediString: string, options?: X12ParseOptions): X12Transaction {
  const parser = new X12Parser(options);
  return parser.parse(ediString);
}

/**
 * Validate an X12 EDI string
 */
export function validateX12(ediString: string, options?: X12ParseOptions) {
  const parser = new X12Parser(options);
  return parser.validate(ediString);
}

/**
 * Generate an X12 EDI string from a transaction object
 */
export function generateX12(transaction: X12Transaction, options?: X12GenerateOptions): string {
  const generator = new X12Generator(options);
  return generator.generate(transaction);
}

/**
 * Create a default X12 envelope for a transaction
 */
export function createX12Envelope(
  transactionType: import('./types').X12TransactionType,
  senderId: string,
  receiverId: string,
  controlNumber: string,
  options?: X12GenerateOptions
) {
  const generator = new X12Generator(options);
  return generator.generateDefaultEnvelope(transactionType, senderId, receiverId, controlNumber);
}
