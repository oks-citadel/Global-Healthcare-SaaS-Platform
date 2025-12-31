/**
 * C-CDA 2.1 Template IDs and OIDs
 * Based on HL7 C-CDA 2.1 Specification and ONC 2015 Certification Requirements
 */

// =============================================================================
// Root OIDs
// =============================================================================

/**
 * HL7 OID for C-CDA templates
 */
export const HL7_CDA_OID = '2.16.840.1.113883.10.20.22';

/**
 * HL7 root OID
 */
export const HL7_ROOT_OID = '2.16.840.1.113883';

/**
 * LOINC Code System OID
 */
export const LOINC_OID = '2.16.840.1.113883.6.1';

/**
 * SNOMED CT Code System OID
 */
export const SNOMED_CT_OID = '2.16.840.1.113883.6.96';

/**
 * RxNorm Code System OID
 */
export const RXNORM_OID = '2.16.840.1.113883.6.88';

/**
 * ICD-10-CM Code System OID
 */
export const ICD10_CM_OID = '2.16.840.1.113883.6.90';

/**
 * ICD-10-PCS Code System OID
 */
export const ICD10_PCS_OID = '2.16.840.1.113883.6.4';

/**
 * CPT Code System OID
 */
export const CPT_OID = '2.16.840.1.113883.6.12';

/**
 * CVX (Vaccine Administered) Code System OID
 */
export const CVX_OID = '2.16.840.1.113883.12.292';

/**
 * NDC (National Drug Code) OID
 */
export const NDC_OID = '2.16.840.1.113883.6.69';

/**
 * UCUM (Unified Code for Units of Measure) OID
 */
export const UCUM_OID = '2.16.840.1.113883.6.8';

/**
 * NCI Thesaurus OID
 */
export const NCI_OID = '2.16.840.1.113883.3.26.1.1';

/**
 * HL7 ActCode OID
 */
export const HL7_ACTCODE_OID = '2.16.840.1.113883.5.4';

/**
 * HL7 RoleCode OID
 */
export const HL7_ROLECODE_OID = '2.16.840.1.113883.5.111';

/**
 * HL7 ParticipationType OID
 */
export const HL7_PARTICIPATION_TYPE_OID = '2.16.840.1.113883.5.90';

/**
 * HL7 NullFlavor OID
 */
export const HL7_NULL_FLAVOR_OID = '2.16.840.1.113883.5.1008';

/**
 * HL7 Confidentiality Code OID
 */
export const HL7_CONFIDENTIALITY_OID = '2.16.840.1.113883.5.25';

/**
 * HL7 Administrative Gender OID
 */
export const HL7_ADMIN_GENDER_OID = '2.16.840.1.113883.5.1';

/**
 * HL7 Marital Status OID
 */
export const HL7_MARITAL_STATUS_OID = '2.16.840.1.113883.5.2';

/**
 * CDC Race and Ethnicity OID
 */
export const CDC_RACE_ETHNICITY_OID = '2.16.840.1.113883.6.238';

/**
 * Language (ISO 639) OID
 */
export const ISO_639_OID = '2.16.840.1.113883.1.11.11526';

// =============================================================================
// Document Type Template IDs
// =============================================================================

export const DocumentTemplateIds = {
  /**
   * US Realm Header (required for all US C-CDA documents)
   */
  US_REALM_HEADER: '2.16.840.1.113883.10.20.22.1.1',

  /**
   * Continuity of Care Document (CCD)
   */
  CCD: '2.16.840.1.113883.10.20.22.1.2',

  /**
   * History and Physical Note
   */
  HISTORY_AND_PHYSICAL: '2.16.840.1.113883.10.20.22.1.3',

  /**
   * Consultation Note
   */
  CONSULTATION_NOTE: '2.16.840.1.113883.10.20.22.1.4',

  /**
   * Procedure Note
   */
  PROCEDURE_NOTE: '2.16.840.1.113883.10.20.22.1.6',

  /**
   * Operative Note
   */
  OPERATIVE_NOTE: '2.16.840.1.113883.10.20.22.1.7',

  /**
   * Discharge Summary
   */
  DISCHARGE_SUMMARY: '2.16.840.1.113883.10.20.22.1.8',

  /**
   * Progress Note
   */
  PROGRESS_NOTE: '2.16.840.1.113883.10.20.22.1.9',

  /**
   * Unstructured Document
   */
  UNSTRUCTURED_DOCUMENT: '2.16.840.1.113883.10.20.22.1.10',

  /**
   * Referral Note
   */
  REFERRAL_NOTE: '2.16.840.1.113883.10.20.22.1.14',

  /**
   * Care Plan
   */
  CARE_PLAN: '2.16.840.1.113883.10.20.22.1.15',

  /**
   * Transfer Summary
   */
  TRANSFER_SUMMARY: '2.16.840.1.113883.10.20.22.1.13',
} as const;

// =============================================================================
// Section Template IDs
// =============================================================================

export const SectionTemplateIds = {
  // Problem Section
  PROBLEMS: '2.16.840.1.113883.10.20.22.2.5',
  PROBLEMS_ENTRIES_REQUIRED: '2.16.840.1.113883.10.20.22.2.5.1',
  PROBLEMS_ENTRIES_OPTIONAL: '2.16.840.1.113883.10.20.22.2.5',

  // Medications Section
  MEDICATIONS: '2.16.840.1.113883.10.20.22.2.1',
  MEDICATIONS_ENTRIES_REQUIRED: '2.16.840.1.113883.10.20.22.2.1.1',
  MEDICATIONS_ENTRIES_OPTIONAL: '2.16.840.1.113883.10.20.22.2.1',
  ADMISSION_MEDICATIONS: '2.16.840.1.113883.10.20.22.2.44',
  DISCHARGE_MEDICATIONS: '2.16.840.1.113883.10.20.22.2.11.1',
  MEDICATIONS_ADMINISTERED: '2.16.840.1.113883.10.20.22.2.38',

  // Allergies Section
  ALLERGIES: '2.16.840.1.113883.10.20.22.2.6',
  ALLERGIES_ENTRIES_REQUIRED: '2.16.840.1.113883.10.20.22.2.6.1',
  ALLERGIES_ENTRIES_OPTIONAL: '2.16.840.1.113883.10.20.22.2.6',

  // Procedures Section
  PROCEDURES: '2.16.840.1.113883.10.20.22.2.7',
  PROCEDURES_ENTRIES_REQUIRED: '2.16.840.1.113883.10.20.22.2.7.1',
  PROCEDURES_ENTRIES_OPTIONAL: '2.16.840.1.113883.10.20.22.2.7',

  // Results Section
  RESULTS: '2.16.840.1.113883.10.20.22.2.3',
  RESULTS_ENTRIES_REQUIRED: '2.16.840.1.113883.10.20.22.2.3.1',
  RESULTS_ENTRIES_OPTIONAL: '2.16.840.1.113883.10.20.22.2.3',

  // Vital Signs Section
  VITAL_SIGNS: '2.16.840.1.113883.10.20.22.2.4',
  VITAL_SIGNS_ENTRIES_REQUIRED: '2.16.840.1.113883.10.20.22.2.4.1',
  VITAL_SIGNS_ENTRIES_OPTIONAL: '2.16.840.1.113883.10.20.22.2.4',

  // Immunizations Section
  IMMUNIZATIONS: '2.16.840.1.113883.10.20.22.2.2',
  IMMUNIZATIONS_ENTRIES_REQUIRED: '2.16.840.1.113883.10.20.22.2.2.1',
  IMMUNIZATIONS_ENTRIES_OPTIONAL: '2.16.840.1.113883.10.20.22.2.2',

  // Encounters Section
  ENCOUNTERS: '2.16.840.1.113883.10.20.22.2.22',
  ENCOUNTERS_ENTRIES_REQUIRED: '2.16.840.1.113883.10.20.22.2.22.1',
  ENCOUNTERS_ENTRIES_OPTIONAL: '2.16.840.1.113883.10.20.22.2.22',

  // Plan of Treatment Section
  PLAN_OF_TREATMENT: '2.16.840.1.113883.10.20.22.2.10',

  // Social History Section
  SOCIAL_HISTORY: '2.16.840.1.113883.10.20.22.2.17',

  // Family History Section
  FAMILY_HISTORY: '2.16.840.1.113883.10.20.22.2.15',

  // Functional Status Section
  FUNCTIONAL_STATUS: '2.16.840.1.113883.10.20.22.2.14',

  // Medical Equipment Section
  MEDICAL_EQUIPMENT: '2.16.840.1.113883.10.20.22.2.23',

  // Payers Section
  PAYERS: '2.16.840.1.113883.10.20.22.2.18',

  // Advance Directives Section
  ADVANCE_DIRECTIVES: '2.16.840.1.113883.10.20.22.2.21',
  ADVANCE_DIRECTIVES_ENTRIES_REQUIRED: '2.16.840.1.113883.10.20.22.2.21.1',

  // Chief Complaint Section
  CHIEF_COMPLAINT: '1.3.6.1.4.1.19376.1.5.3.1.1.13.2.1',
  CHIEF_COMPLAINT_AND_REASON_FOR_VISIT: '2.16.840.1.113883.10.20.22.2.13',

  // History of Present Illness Section
  HISTORY_OF_PRESENT_ILLNESS: '1.3.6.1.4.1.19376.1.5.3.1.3.4',

  // Review of Systems Section
  REVIEW_OF_SYSTEMS: '1.3.6.1.4.1.19376.1.5.3.1.3.18',

  // Physical Exam Section
  PHYSICAL_EXAM: '2.16.840.1.113883.10.20.2.10',

  // Assessment Section
  ASSESSMENT: '2.16.840.1.113883.10.20.22.2.8',

  // Assessment and Plan Section
  ASSESSMENT_AND_PLAN: '2.16.840.1.113883.10.20.22.2.9',

  // Reason for Visit Section
  REASON_FOR_VISIT: '2.16.840.1.113883.10.20.22.2.12',

  // Reason for Referral Section
  REASON_FOR_REFERRAL: '1.3.6.1.4.1.19376.1.5.3.1.3.1',

  // Hospital Admission Diagnosis Section
  HOSPITAL_ADMISSION_DIAGNOSIS: '2.16.840.1.113883.10.20.22.2.43',

  // Hospital Discharge Diagnosis Section
  HOSPITAL_DISCHARGE_DIAGNOSIS: '2.16.840.1.113883.10.20.22.2.24',

  // Discharge Instructions Section
  DISCHARGE_INSTRUCTIONS: '2.16.840.1.113883.10.20.22.2.41',

  // Hospital Course Section
  HOSPITAL_COURSE: '1.3.6.1.4.1.19376.1.5.3.1.3.5',

  // Discharge Condition Section
  DISCHARGE_CONDITION: '2.16.840.1.113883.10.20.22.2.42',

  // Goals Section
  GOALS: '2.16.840.1.113883.10.20.22.2.60',

  // Health Concerns Section
  HEALTH_CONCERNS: '2.16.840.1.113883.10.20.22.2.58',

  // Interventions Section
  INTERVENTIONS: '2.16.840.1.113883.10.20.21.2.3',

  // Health Status Evaluations Section
  HEALTH_STATUS_EVALUATIONS: '2.16.840.1.113883.10.20.22.2.61',

  // Instructions Section
  INSTRUCTIONS: '2.16.840.1.113883.10.20.22.2.45',

  // Mental Status Section
  MENTAL_STATUS: '2.16.840.1.113883.10.20.22.2.56',

  // General Status Section
  GENERAL_STATUS: '2.16.840.1.113883.10.20.2.5',

  // Postoperative Diagnosis Section
  POSTOPERATIVE_DIAGNOSIS: '2.16.840.1.113883.10.20.22.2.35',

  // Preoperative Diagnosis Section
  PREOPERATIVE_DIAGNOSIS: '2.16.840.1.113883.10.20.22.2.34',

  // Operative Note Surgical Procedure Section
  OPERATIVE_NOTE_SURGICAL_PROCEDURE: '2.16.840.1.113883.10.20.22.2.40',

  // Procedure Description Section
  PROCEDURE_DESCRIPTION: '2.16.840.1.113883.10.20.22.2.27',

  // Procedure Indications Section
  PROCEDURE_INDICATIONS: '2.16.840.1.113883.10.20.22.2.29',

  // Anesthesia Section
  ANESTHESIA: '2.16.840.1.113883.10.20.22.2.25',

  // Complications Section
  COMPLICATIONS: '2.16.840.1.113883.10.20.22.2.37',

  // Procedure Findings Section
  PROCEDURE_FINDINGS: '2.16.840.1.113883.10.20.22.2.28',

  // Surgical Drains Section
  SURGICAL_DRAINS: '2.16.840.1.113883.10.20.7.13',

  // Procedure Specimens Taken Section
  PROCEDURE_SPECIMENS_TAKEN: '2.16.840.1.113883.10.20.22.2.31',

  // Procedure Estimated Blood Loss Section
  PROCEDURE_ESTIMATED_BLOOD_LOSS: '2.16.840.1.113883.10.20.18.2.9',

  // Procedure Implants Section
  PROCEDURE_IMPLANTS: '2.16.840.1.113883.10.20.22.2.40',

  // Procedure Disposition Section
  PROCEDURE_DISPOSITION: '2.16.840.1.113883.10.20.18.2.12',
} as const;

// =============================================================================
// Entry Template IDs
// =============================================================================

export const EntryTemplateIds = {
  // Problem Entry Templates
  PROBLEM_CONCERN_ACT: '2.16.840.1.113883.10.20.22.4.3',
  PROBLEM_OBSERVATION: '2.16.840.1.113883.10.20.22.4.4',
  PROBLEM_STATUS: '2.16.840.1.113883.10.20.22.4.6',
  HEALTH_STATUS_OBSERVATION: '2.16.840.1.113883.10.20.22.4.5',
  AGE_OBSERVATION: '2.16.840.1.113883.10.20.22.4.31',
  PROGNOSIS_OBSERVATION: '2.16.840.1.113883.10.20.22.4.113',
  PRIORITY_PREFERENCE: '2.16.840.1.113883.10.20.22.4.143',

  // Medication Entry Templates
  MEDICATION_ACTIVITY: '2.16.840.1.113883.10.20.22.4.16',
  MEDICATION_SUPPLY_ORDER: '2.16.840.1.113883.10.20.22.4.17',
  MEDICATION_DISPENSE: '2.16.840.1.113883.10.20.22.4.18',
  MEDICATION_INFORMATION: '2.16.840.1.113883.10.20.22.4.23',
  IMMUNIZATION_MEDICATION_INFORMATION: '2.16.840.1.113883.10.20.22.4.54',
  DRUG_VEHICLE: '2.16.840.1.113883.10.20.22.4.24',
  INDICATION: '2.16.840.1.113883.10.20.22.4.19',
  INSTRUCTIONS: '2.16.840.1.113883.10.20.22.4.20',
  PRECONDITION_FOR_SUBSTANCE_ADMINISTRATION: '2.16.840.1.113883.10.20.22.4.25',
  MEDICATION_FREE_TEXT_SIG: '2.16.840.1.113883.10.20.22.4.147',
  ADMISSION_MEDICATION: '2.16.840.1.113883.10.20.22.4.36',
  DISCHARGE_MEDICATION: '2.16.840.1.113883.10.20.22.4.35',

  // Allergy Entry Templates
  ALLERGY_CONCERN_ACT: '2.16.840.1.113883.10.20.22.4.30',
  ALLERGY_OBSERVATION: '2.16.840.1.113883.10.20.22.4.7',
  ALLERGY_STATUS_OBSERVATION: '2.16.840.1.113883.10.20.22.4.28',
  REACTION_OBSERVATION: '2.16.840.1.113883.10.20.22.4.9',
  SEVERITY_OBSERVATION: '2.16.840.1.113883.10.20.22.4.8',
  CRITICALITY_OBSERVATION: '2.16.840.1.113883.10.20.22.4.145',

  // Procedure Entry Templates
  PROCEDURE_ACTIVITY_PROCEDURE: '2.16.840.1.113883.10.20.22.4.14',
  PROCEDURE_ACTIVITY_ACT: '2.16.840.1.113883.10.20.22.4.12',
  PROCEDURE_ACTIVITY_OBSERVATION: '2.16.840.1.113883.10.20.22.4.13',
  SERVICE_DELIVERY_LOCATION: '2.16.840.1.113883.10.20.22.4.32',
  PRODUCT_INSTANCE: '2.16.840.1.113883.10.20.22.4.37',

  // Result Entry Templates
  RESULT_ORGANIZER: '2.16.840.1.113883.10.20.22.4.1',
  RESULT_OBSERVATION: '2.16.840.1.113883.10.20.22.4.2',

  // Vital Signs Entry Templates
  VITAL_SIGNS_ORGANIZER: '2.16.840.1.113883.10.20.22.4.26',
  VITAL_SIGN_OBSERVATION: '2.16.840.1.113883.10.20.22.4.27',

  // Immunization Entry Templates
  IMMUNIZATION_ACTIVITY: '2.16.840.1.113883.10.20.22.4.52',
  IMMUNIZATION_REFUSAL_REASON: '2.16.840.1.113883.10.20.22.4.53',

  // Encounter Entry Templates
  ENCOUNTER_ACTIVITY: '2.16.840.1.113883.10.20.22.4.49',
  ENCOUNTER_DIAGNOSIS: '2.16.840.1.113883.10.20.22.4.80',

  // Social History Entry Templates
  SOCIAL_HISTORY_OBSERVATION: '2.16.840.1.113883.10.20.22.4.38',
  SMOKING_STATUS_OBSERVATION: '2.16.840.1.113883.10.20.22.4.78',
  TOBACCO_USE: '2.16.840.1.113883.10.20.22.4.85',
  PREGNANCY_OBSERVATION: '2.16.840.1.113883.10.20.15.3.8',
  BIRTH_SEX_OBSERVATION: '2.16.840.1.113883.10.20.22.4.200',

  // Family History Entry Templates
  FAMILY_HISTORY_ORGANIZER: '2.16.840.1.113883.10.20.22.4.45',
  FAMILY_HISTORY_OBSERVATION: '2.16.840.1.113883.10.20.22.4.46',
  FAMILY_HISTORY_DEATH_OBSERVATION: '2.16.840.1.113883.10.20.22.4.47',

  // Functional Status Entry Templates
  FUNCTIONAL_STATUS_OBSERVATION: '2.16.840.1.113883.10.20.22.4.67',
  COGNITIVE_STATUS_OBSERVATION: '2.16.840.1.113883.10.20.22.4.68',
  CAREGIVER_CHARACTERISTICS: '2.16.840.1.113883.10.20.22.4.72',
  ASSESSMENT_SCALE_OBSERVATION: '2.16.840.1.113883.10.20.22.4.69',
  SELF_CARE_ACTIVITIES: '2.16.840.1.113883.10.20.22.4.128',
  SENSORY_STATUS: '2.16.840.1.113883.10.20.22.4.127',

  // Medical Equipment Entry Templates
  NON_MEDICINAL_SUPPLY_ACTIVITY: '2.16.840.1.113883.10.20.22.4.50',
  MEDICAL_EQUIPMENT_ORGANIZER: '2.16.840.1.113883.10.20.22.4.135',
  PROCEDURE_ACTIVITY_PROCEDURE_V2: '2.16.840.1.113883.10.20.22.4.14',

  // Payers Entry Templates
  COVERAGE_ACTIVITY: '2.16.840.1.113883.10.20.22.4.60',
  POLICY_ACTIVITY: '2.16.840.1.113883.10.20.22.4.61',
  AUTHORIZATION_ACTIVITY: '2.16.840.1.113883.10.20.22.4.136',

  // Advance Directive Entry Templates
  ADVANCE_DIRECTIVE_OBSERVATION: '2.16.840.1.113883.10.20.22.4.48',
  ADVANCE_DIRECTIVE_ORGANIZER: '2.16.840.1.113883.10.20.22.4.108',

  // Plan Entry Templates
  PLANNED_ACT: '2.16.840.1.113883.10.20.22.4.39',
  PLANNED_ENCOUNTER: '2.16.840.1.113883.10.20.22.4.40',
  PLANNED_OBSERVATION: '2.16.840.1.113883.10.20.22.4.44',
  PLANNED_PROCEDURE: '2.16.840.1.113883.10.20.22.4.41',
  PLANNED_MEDICATION_ACTIVITY: '2.16.840.1.113883.10.20.22.4.42',
  PLANNED_SUPPLY: '2.16.840.1.113883.10.20.22.4.43',
  PLANNED_IMMUNIZATION_ACTIVITY: '2.16.840.1.113883.10.20.22.4.120',
  GOAL_OBSERVATION: '2.16.840.1.113883.10.20.22.4.121',
  HEALTH_CONCERN_ACT: '2.16.840.1.113883.10.20.22.4.132',
  INTERVENTION_ACT: '2.16.840.1.113883.10.20.22.4.131',
  OUTCOME_OBSERVATION: '2.16.840.1.113883.10.20.22.4.144',

  // Care Team Entry Templates
  CARE_TEAM_ORGANIZER: '2.16.840.1.113883.10.20.22.4.500',
  CARE_TEAM_MEMBER_ACT: '2.16.840.1.113883.10.20.22.4.501',

  // Hospital Discharge Entry Templates
  HOSPITAL_DISCHARGE_DIAGNOSIS: '2.16.840.1.113883.10.20.22.4.33',
  HOSPITAL_ADMISSION_DIAGNOSIS: '2.16.840.1.113883.10.20.22.4.34',

  // Author Entry Template
  AUTHOR_PARTICIPATION: '2.16.840.1.113883.10.20.22.4.119',

  // Comment Entry Template
  COMMENT_ACTIVITY: '2.16.840.1.113883.10.20.22.4.64',

  // External Document Reference
  EXTERNAL_DOCUMENT_REFERENCE: '2.16.840.1.113883.10.20.22.4.115',
} as const;

// =============================================================================
// LOINC Codes for Sections
// =============================================================================

export const SectionLoincCodes = {
  ALLERGIES: '48765-2',
  MEDICATIONS: '10160-0',
  MEDICATIONS_ADMINISTERED: '29549-3',
  ADMISSION_MEDICATIONS: '42346-7',
  DISCHARGE_MEDICATIONS: '10183-2',
  PROBLEMS: '11450-4',
  PROCEDURES: '47519-4',
  RESULTS: '30954-2',
  VITAL_SIGNS: '8716-3',
  IMMUNIZATIONS: '11369-6',
  ENCOUNTERS: '46240-8',
  PLAN_OF_TREATMENT: '18776-5',
  SOCIAL_HISTORY: '29762-2',
  FAMILY_HISTORY: '10157-6',
  FUNCTIONAL_STATUS: '47420-5',
  MEDICAL_EQUIPMENT: '46264-8',
  PAYERS: '48768-6',
  ADVANCE_DIRECTIVES: '42348-3',
  CHIEF_COMPLAINT: '10154-3',
  CHIEF_COMPLAINT_AND_REASON_FOR_VISIT: '46239-0',
  HISTORY_OF_PRESENT_ILLNESS: '10164-2',
  REVIEW_OF_SYSTEMS: '10187-3',
  PHYSICAL_EXAM: '29545-1',
  ASSESSMENT: '51848-0',
  ASSESSMENT_AND_PLAN: '51847-2',
  REASON_FOR_VISIT: '29299-5',
  REASON_FOR_REFERRAL: '42349-1',
  HOSPITAL_ADMISSION_DIAGNOSIS: '46241-6',
  HOSPITAL_DISCHARGE_DIAGNOSIS: '11535-2',
  HOSPITAL_COURSE: '8648-8',
  DISCHARGE_INSTRUCTIONS: '8653-8',
  DISCHARGE_CONDITION: '59284-0',
  GOALS: '61146-7',
  HEALTH_CONCERNS: '75310-3',
  INTERVENTIONS: '62387-6',
  HEALTH_STATUS_EVALUATIONS: '11383-7',
  MENTAL_STATUS: '10190-7',
  GENERAL_STATUS: '10210-3',
  POSTOPERATIVE_DIAGNOSIS: '10218-6',
  PREOPERATIVE_DIAGNOSIS: '10219-4',
  PROCEDURE_DESCRIPTION: '29554-3',
  PROCEDURE_INDICATIONS: '59768-2',
  ANESTHESIA: '59774-0',
  COMPLICATIONS: '55109-3',
  PROCEDURE_FINDINGS: '59776-5',
  SURGICAL_DRAINS: '11537-8',
  PROCEDURE_SPECIMENS_TAKEN: '59773-2',
  PROCEDURE_ESTIMATED_BLOOD_LOSS: '59770-8',
  PROCEDURE_IMPLANTS: '59771-6',
  INSTRUCTIONS: '69730-0',
} as const;

// =============================================================================
// Document LOINC Codes
// =============================================================================

export const DocumentLoincCodes = {
  CCD: '34133-9',
  DISCHARGE_SUMMARY: '18842-5',
  HISTORY_AND_PHYSICAL: '34117-2',
  CONSULTATION_NOTE: '11488-4',
  PROGRESS_NOTE: '11506-3',
  PROCEDURE_NOTE: '28570-0',
  OPERATIVE_NOTE: '11504-8',
  REFERRAL_NOTE: '57133-1',
  CARE_PLAN: '52521-2',
  TRANSFER_SUMMARY: '18761-7',
} as const;

// =============================================================================
// Status Codes
// =============================================================================

export const StatusCodes = {
  COMPLETED: 'completed',
  ACTIVE: 'active',
  ABORTED: 'aborted',
  CANCELLED: 'cancelled',
  SUSPENDED: 'suspended',
  NORMAL: 'normal',
  NEW: 'new',
  HELD: 'held',
  NULLIFIED: 'nullified',
  OBSOLETE: 'obsolete',
} as const;

// =============================================================================
// Act Codes
// =============================================================================

export const ActCodes = {
  // Concern acts
  CONCERN: 'CONC',
  PROBLEM_LIST_ENTRY: 'PROBLISTREV',

  // Observation acts
  ASSERTION: 'ASSERTION',

  // Substance administration
  SUBSTANCE_ADMINISTRATION: 'SBADM',

  // Supply
  SUPPLY: 'SPLY',

  // Procedure
  PROCEDURE: 'PROC',

  // Encounter
  ENCOUNTER: 'ENC',

  // Coverage
  COVERAGE: 'COV',

  // Policy
  POLICY: 'POLICY',
} as const;

// =============================================================================
// Mood Codes
// =============================================================================

export const MoodCodes = {
  EVENT: 'EVN',           // Event - what happened
  INTENT: 'INT',          // Intent - plan to do
  REQUEST: 'RQO',         // Request/order
  PROMISE: 'PRMS',        // Promise
  PROPOSAL: 'PRP',        // Proposal
  GOAL: 'GOL',            // Goal
  CRITERION: 'CRT',       // Criterion
  EXPECTATION: 'EXPEC',   // Expectation
  DEFINITION: 'DEF',      // Definition
  APPOINTMENT: 'APT',     // Appointment
  APPOINTMENT_REQUEST: 'ARQ', // Appointment request
} as const;

// =============================================================================
// Clinical Status Codes
// =============================================================================

export const ClinicalStatusCodes = {
  // Problem status
  PROBLEM_ACTIVE: '55561003',
  PROBLEM_INACTIVE: '73425007',
  PROBLEM_RESOLVED: '413322009',

  // Allergy status
  ALLERGY_ACTIVE: '55561003',
  ALLERGY_INACTIVE: '73425007',
  ALLERGY_RESOLVED: '413322009',

  // Verification status
  CONFIRMED: '410605003',
  UNCONFIRMED: '415684004',
  PROVISIONAL: '723510000',
  DIFFERENTIAL: '47965005',
  REFUTED: '410516002',
  ENTERED_IN_ERROR: '723510000',
} as const;

// =============================================================================
// Severity Codes (SNOMED CT)
// =============================================================================

export const SeverityCodes = {
  MILD: '255604002',
  MILD_TO_MODERATE: '371923003',
  MODERATE: '6736007',
  MODERATE_TO_SEVERE: '371924009',
  SEVERE: '24484000',
  LIFE_THREATENING: '442452003',
  FATAL: '399166001',
} as const;

// =============================================================================
// Criticality Codes
// =============================================================================

export const CriticalityCodes = {
  HIGH: 'CRITH',
  LOW: 'CRITL',
  UNABLE_TO_ASSESS: 'CRITU',
} as const;

// =============================================================================
// Type Exports
// =============================================================================

export type DocumentTemplateId = typeof DocumentTemplateIds[keyof typeof DocumentTemplateIds];
export type SectionTemplateId = typeof SectionTemplateIds[keyof typeof SectionTemplateIds];
export type EntryTemplateId = typeof EntryTemplateIds[keyof typeof EntryTemplateIds];
export type SectionLoincCode = typeof SectionLoincCodes[keyof typeof SectionLoincCodes];
export type DocumentLoincCode = typeof DocumentLoincCodes[keyof typeof DocumentLoincCodes];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get template ID with extension for versioning
 */
export function getTemplateIdWithVersion(
  templateId: string,
  version: string = '2015-08-01'
): { root: string; extension: string } {
  return {
    root: templateId,
    extension: version,
  };
}

/**
 * Get document type from template IDs
 */
export function getDocumentTypeFromTemplateId(templateId: string): string | null {
  for (const [key, value] of Object.entries(DocumentTemplateIds)) {
    if (value === templateId) {
      return key;
    }
  }
  return null;
}

/**
 * Get section type from template ID
 */
export function getSectionTypeFromTemplateId(templateId: string): string | null {
  for (const [key, value] of Object.entries(SectionTemplateIds)) {
    if (value === templateId) {
      return key;
    }
  }
  return null;
}

/**
 * Validate that a template ID is a known C-CDA template
 */
export function isValidTemplateId(templateId: string): boolean {
  const allTemplates = [
    ...Object.values(DocumentTemplateIds),
    ...Object.values(SectionTemplateIds),
    ...Object.values(EntryTemplateIds),
  ];
  return allTemplates.includes(templateId);
}

/**
 * Get OID for a code system by name
 */
export function getCodeSystemOid(codeSystemName: string): string | null {
  const codeSystemMap: Record<string, string> = {
    LOINC: LOINC_OID,
    'SNOMED CT': SNOMED_CT_OID,
    SNOMED: SNOMED_CT_OID,
    RxNorm: RXNORM_OID,
    'ICD-10-CM': ICD10_CM_OID,
    'ICD-10-PCS': ICD10_PCS_OID,
    CPT: CPT_OID,
    CVX: CVX_OID,
    NDC: NDC_OID,
    UCUM: UCUM_OID,
  };
  return codeSystemMap[codeSystemName] || null;
}
