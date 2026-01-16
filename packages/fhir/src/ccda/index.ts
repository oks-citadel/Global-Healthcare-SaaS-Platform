/**
 * C-CDA (Consolidated Clinical Document Architecture) Module
 *
 * This module provides comprehensive support for C-CDA 2.1 documents including:
 * - Type definitions for all C-CDA document types and sections
 * - XML parsing and generation
 * - Bidirectional mapping between C-CDA and FHIR R4 resources
 * - Template IDs and OIDs for ONC certification compliance
 *
 * Based on:
 * - HL7 C-CDA 2.1 Specification
 * - ONC 2015 Edition Certification Requirements
 * - FHIR R4 Specification
 *
 * @module @global-health/fhir/ccda
 */

// =============================================================================
// Type Exports
// =============================================================================

export {
  // Base C-CDA data types
  II,
  CD,
  CE,
  CV,
  CS,
  TS,
  IVL_TS,
  PQ,
  IVL_PQ,
  AD,
  TEL,
  PN,
  EN,
  ON,
  ST,
  NullFlavor,
  AddressUse,
  TelecomUse,
  NameUse,
  IVL_INT,
  RTO_PQ_PQ,

  // Participant types
  CCDAAuthor,
  CCDAAssignedAuthor,
  CCDAPerson,
  CCDAOrganization,
  CCDARecordTarget,
  CCDAPatientRole,
  CCDAPatient,
  CCDAGuardian,
  CCDABirthplace,
  CCDALanguageCommunication,
  CCDACustodian,
  CCDAAssignedCustodian,
  CCDAInformant,
  CCDAAssignedEntity,
  CCDARelatedEntity,
  CCDADocumentationOf,
  CCDAServiceEvent,
  CCDAPerformer,
  CCDAEncompassingEncounter,
  CCDAEncounterParticipant,
  CCDALocation,
  CCDAHealthCareFacility,
  CCDADataEnterer,
  CCDAInformationRecipient,
  CCDAIntendedRecipient,
  CCDALegalAuthenticator,
  CCDAAuthenticator,
  CCDAInFulfillmentOf,
  CCDAOrder,
  CCDARelatedDocument,
  CCDAParentDocument,
  CCDAAuthorization,
  CCDAConsent,
  CCDAComponentOf,
  CCDAParticipant,
  CCDAParticipantRole,
  CCDAPlayingEntity,

  // Section types
  CCDASection,
  CCDANarrativeBlock,
  CCDAReference,
  CCDAProblemsSection,
  CCDAMedicationsSection,
  CCDAAllergiesSection,
  CCDAProceduresSection,
  CCDAResultsSection,
  CCDAVitalSignsSection,
  CCDAImmunizationsSection,
  CCDAEncountersSection,
  CCDAPlanOfTreatmentSection,
  CCDASocialHistorySection,
  CCDAFamilyHistorySection,
  CCDAMedicalEquipmentSection,
  CCDAPayersSection,
  CCDAAdvanceDirectivesSection,
  CCDAFunctionalStatusSection,
  CCDADischargeInstructionsSection,
  CCDAHospitalDischargeDiagnosisSection,
  CCDAReasonForReferralSection,
  CCDAHospitalCourseSection,
  CCDAAssessmentSection,
  CCDAChiefComplaintSection,
  CCDAHistoryOfPresentIllnessSection,
  CCDAReviewOfSystemsSection,
  CCDAPhysicalExamSection,
  CCDAGoalsSection,
  CCDAHealthConcernsSection,

  // Entry types
  CCDAEntry,
  CCDAProblemConcernAct,
  CCDAProblemObservation,
  CCDAHealthStatusObservation,
  CCDAPrognosisObservation,
  CCDAMedicationActivity,
  CCDAConsumable,
  CCDAManufacturedProduct,
  CCDAManufacturedMaterial,
  CCDAPrecondition,
  CCDACriterion,
  CCDAIndication,
  CCDAInstructions,
  CCDASupplyOrder,
  CCDAProduct,
  CCDADispense,
  CCDADrugVehicle,
  CCDAAllergyConcernAct,
  CCDAAllergyObservation,
  CCDAAllergyStatusObservation,
  CCDAReactionObservation,
  CCDASeverityObservation,
  CCDAProcedureEntry,
  CCDASpecimen,
  CCDASpecimenRole,
  CCDASpecimenPlayingEntity,
  CCDAServiceDeliveryLocation,
  CCDAProductInstance,
  CCDAPlayingDevice,
  CCDAResultOrganizer,
  CCDAResultObservation,
  CCDAReferenceRange,
  CCDAObservationRange,
  CCDAVitalSignsOrganizer,
  CCDAVitalSignObservation,
  CCDAImmunizationActivity,
  CCDAImmunizationRefusalReason,
  CCDAEncounterActivity,
  CCDAEncounterDiagnosis,
  CCDAPlanOfTreatmentEntry,
  CCDASocialHistoryObservation,
  CCDAFamilyHistoryOrganizer,
  CCDAFamilyHistorySubject,
  CCDARelatedSubject,
  CCDAFamilyHistoryObservation,
  CCDAFamilyHistoryDeathObservation,
  CCDAMedicalEquipmentEntry,
  CCDACoverageActivity,
  CCDAPolicyActivity,
  CCDAAdvanceDirectiveObservation,
  CCDAExternalDocument,
  CCDAFunctionalStatusEntry,
  CCDADischargeInstruction,
  CCDAHospitalDischargeDiagnosis,
  CCDAGoalObservation,
  CCDAHealthConcernAct,

  // Document types
  CCDADocumentHeader,
  CCDADocument,
  CCDAStructuredBody,
  CCDANonXMLBody,
  CCDAComponent,
  ContinuityOfCareDocument,
  DischargeSummary,
  ReferralNote,
  ProgressNote,
  ConsultationNote,
  HistoryAndPhysical,
  OperativeNote,
  CarePlan,
  CCDADocumentType,
  CCDADocumentTypeCode,
  CCDADocumentTypeCodes,
} from './types';

// =============================================================================
// Template and OID Exports
// =============================================================================

export {
  // Root OIDs
  HL7_CDA_OID,
  HL7_ROOT_OID,
  LOINC_OID,
  SNOMED_CT_OID,
  RXNORM_OID,
  ICD10_CM_OID,
  ICD10_PCS_OID,
  CPT_OID,
  CVX_OID,
  NDC_OID,
  UCUM_OID,
  NCI_OID,
  HL7_ACTCODE_OID,
  HL7_ROLECODE_OID,
  HL7_PARTICIPATION_TYPE_OID,
  HL7_NULL_FLAVOR_OID,
  HL7_CONFIDENTIALITY_OID,
  HL7_ADMIN_GENDER_OID,
  HL7_MARITAL_STATUS_OID,
  CDC_RACE_ETHNICITY_OID,
  ISO_639_OID,

  // Template IDs
  DocumentTemplateIds,
  SectionTemplateIds,
  EntryTemplateIds,

  // LOINC codes
  SectionLoincCodes,
  DocumentLoincCodes,

  // Status and code constants
  StatusCodes,
  ActCodes,
  MoodCodes,
  ClinicalStatusCodes,
  SeverityCodes,
  CriticalityCodes,

  // Type exports
  DocumentTemplateId,
  SectionTemplateId,
  EntryTemplateId,
  SectionLoincCode,
  DocumentLoincCode,

  // Helper functions
  getTemplateIdWithVersion,
  getDocumentTypeFromTemplateId,
  getSectionTypeFromTemplateId,
  isValidTemplateId,
  getCodeSystemOid,
} from './templates';

// =============================================================================
// Parser Exports
// =============================================================================

export {
  CCDAParser,
  CCDAParserResult,
  CCDAParserOptions,
  parseCCDA,
  extractPatientInfo,
  getSections,
  findSectionByTemplateId,
  findSectionByLoincCode,
} from './parser';

// =============================================================================
// Generator Exports
// =============================================================================

export {
  CCDAGenerator,
  CCDAGeneratorOptions,
  generateCCDA,
  createCCDADocument,
} from './generator';

// =============================================================================
// FHIR Mapping Exports
// =============================================================================

export {
  // Types
  Procedure,
  Immunization,
  MedicationStatement,
  Bundle,
  BundleEntry,
  CCDAToFHIRMappingOptions,

  // Main conversion functions
  ccdaToFhirBundle,
  fhirBundleToCCDA,

  // Section-specific conversions
  convertProblemsSectionToConditions,
  convertMedicationsSectionToMedicationResources,
  convertAllergiesSectionToAllergyIntolerances,
  convertProceduresSectionToProcedures,
  convertResultsSectionToObservations,
  convertVitalSignsSectionToObservations,
  convertImmunizationsSectionToImmunizations,
} from './fhir-mapping';

// =============================================================================
// Convenience Re-exports
// =============================================================================

/**
 * Parse a C-CDA XML string and convert directly to a FHIR Bundle
 */
export function ccdaXmlToFhirBundle(
  xmlString: string,
  mappingOptions?: import('./fhir-mapping').CCDAToFHIRMappingOptions
): import('./fhir-mapping').Bundle | null {
  const { parseCCDA } = require('./parser');
  const { ccdaToFhirBundle } = require('./fhir-mapping');

  const result = parseCCDA(xmlString);
  if (!result.isValid || !result.document) {
    return null;
  }

  return ccdaToFhirBundle(result.document, mappingOptions);
}

/**
 * Convert a FHIR Bundle to C-CDA XML string
 */
export function fhirBundleToCcdaXml(
  bundle: import('./fhir-mapping').Bundle,
  documentType: import('./types').CCDADocumentTypeCode = 'CCD',
  generatorOptions?: import('./generator').CCDAGeneratorOptions
): string {
  const { fhirBundleToCCDA } = require('./fhir-mapping');
  const { generateCCDA } = require('./generator');

  const ccdaDocument = fhirBundleToCCDA(bundle, documentType);
  return generateCCDA(ccdaDocument, documentType, generatorOptions);
}
