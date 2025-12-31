/**
 * C-CDA (Consolidated Clinical Document Architecture) Types
 * Based on HL7 C-CDA 2.1 Specification
 * http://www.hl7.org/implement/standards/product_brief.cfm?product_id=492
 */

// =============================================================================
// Base C-CDA Types
// =============================================================================

/**
 * HL7 II (Instance Identifier) data type
 */
export interface II {
  root: string;
  extension?: string;
  assigningAuthorityName?: string;
  displayable?: boolean;
}

/**
 * HL7 CD (Concept Descriptor) data type
 */
export interface CD {
  code?: string;
  codeSystem?: string;
  codeSystemName?: string;
  displayName?: string;
  originalText?: string;
  nullFlavor?: NullFlavor;
  translations?: CD[];
}

/**
 * HL7 CE (Coded With Equivalents) data type
 */
export interface CE extends CD {}

/**
 * HL7 CV (Coded Value) data type
 */
export interface CV extends CD {}

/**
 * HL7 TS (Timestamp) data type - represents a point in time
 */
export interface TS {
  value?: string;
  nullFlavor?: NullFlavor;
}

/**
 * HL7 IVL_TS (Interval of Timestamps) data type
 */
export interface IVL_TS {
  low?: TS;
  high?: TS;
  center?: TS;
  width?: PQ;
  nullFlavor?: NullFlavor;
}

/**
 * HL7 PQ (Physical Quantity) data type
 */
export interface PQ {
  value?: number;
  unit?: string;
  nullFlavor?: NullFlavor;
}

/**
 * HL7 IVL_PQ (Interval of Physical Quantities) data type
 */
export interface IVL_PQ {
  low?: PQ;
  high?: PQ;
  center?: PQ;
  width?: PQ;
  nullFlavor?: NullFlavor;
}

/**
 * HL7 AD (Address) data type
 */
export interface AD {
  use?: AddressUse[];
  streetAddressLine?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  nullFlavor?: NullFlavor;
}

/**
 * HL7 TEL (Telecommunication Address) data type
 */
export interface TEL {
  value?: string;
  use?: TelecomUse[];
  nullFlavor?: NullFlavor;
}

/**
 * HL7 PN (Person Name) data type
 */
export interface PN {
  use?: NameUse[];
  prefix?: string[];
  given?: string[];
  family?: string;
  suffix?: string[];
  nullFlavor?: NullFlavor;
}

/**
 * HL7 EN (Entity Name) data type
 */
export interface EN extends PN {}

/**
 * HL7 ON (Organization Name) data type
 */
export interface ON {
  name?: string;
  nullFlavor?: NullFlavor;
}

/**
 * NullFlavor values per HL7 v3
 */
export type NullFlavor =
  | 'NI'    // No Information
  | 'INV'   // Invalid
  | 'DER'   // Derived
  | 'OTH'   // Other
  | 'NINF'  // Negative Infinity
  | 'PINF'  // Positive Infinity
  | 'UNC'   // Unencoded
  | 'MSK'   // Masked
  | 'NA'    // Not Applicable
  | 'UNK'   // Unknown
  | 'ASKU'  // Asked But Unknown
  | 'NAV'   // Not Available
  | 'NASK'  // Not Asked
  | 'TRC'   // Trace
  | 'QS';   // Sufficient Quantity

/**
 * Address use codes
 */
export type AddressUse = 'H' | 'HP' | 'HV' | 'WP' | 'DIR' | 'PUB' | 'BAD' | 'TMP' | 'PHYS' | 'PST';

/**
 * Telecommunication use codes
 */
export type TelecomUse = 'H' | 'HP' | 'HV' | 'WP' | 'DIR' | 'PUB' | 'BAD' | 'TMP' | 'MC' | 'EC';

/**
 * Name use codes
 */
export type NameUse = 'L' | 'OR' | 'SRCH' | 'PHON' | 'SNDX' | 'ABC' | 'IDE' | 'SYL' | 'A' | 'C' | 'I' | 'P' | 'ASGN';

// =============================================================================
// C-CDA Participant Types
// =============================================================================

/**
 * Author participant
 */
export interface CCDAAuthor {
  time?: TS;
  assignedAuthor: CCDAAssignedAuthor;
}

/**
 * Assigned author
 */
export interface CCDAAssignedAuthor {
  id?: II[];
  code?: CE;
  addr?: AD[];
  telecom?: TEL[];
  assignedPerson?: CCDAPerson;
  representedOrganization?: CCDAOrganization;
}

/**
 * Person entity
 */
export interface CCDAPerson {
  name?: PN[];
}

/**
 * Organization entity
 */
export interface CCDAOrganization {
  id?: II[];
  name?: ON[];
  telecom?: TEL[];
  addr?: AD[];
  standardIndustryClassCode?: CE;
}

/**
 * Record target (patient)
 */
export interface CCDARecordTarget {
  patientRole: CCDAPatientRole;
}

/**
 * Patient role
 */
export interface CCDAPatientRole {
  id?: II[];
  addr?: AD[];
  telecom?: TEL[];
  patient?: CCDAPatient;
  providerOrganization?: CCDAOrganization;
}

/**
 * Patient demographic information
 */
export interface CCDAPatient {
  name?: PN[];
  administrativeGenderCode?: CE;
  birthTime?: TS;
  maritalStatusCode?: CE;
  religiousAffiliationCode?: CE;
  raceCode?: CE;
  sdtc_raceCode?: CE[];  // C-CDA R2.1 extension for multiple races
  ethnicGroupCode?: CE;
  sdtc_ethnicGroupCode?: CE[];  // C-CDA R2.1 extension
  guardian?: CCDAGuardian[];
  birthplace?: CCDABirthplace;
  languageCommunication?: CCDALanguageCommunication[];
}

/**
 * Guardian information
 */
export interface CCDAGuardian {
  code?: CE;
  addr?: AD[];
  telecom?: TEL[];
  guardianPerson?: CCDAPerson;
  guardianOrganization?: CCDAOrganization;
}

/**
 * Birthplace information
 */
export interface CCDABirthplace {
  place: {
    addr?: AD;
  };
}

/**
 * Language communication
 */
export interface CCDALanguageCommunication {
  languageCode?: CS;
  modeCode?: CE;
  proficiencyLevelCode?: CE;
  preferenceInd?: boolean;
}

/**
 * CS (Coded Simple) data type
 */
export interface CS {
  code?: string;
  nullFlavor?: NullFlavor;
}

/**
 * Custodian
 */
export interface CCDACustodian {
  assignedCustodian: CCDAAssignedCustodian;
}

/**
 * Assigned custodian
 */
export interface CCDAAssignedCustodian {
  representedCustodianOrganization: CCDAOrganization;
}

/**
 * Informant
 */
export interface CCDAInformant {
  assignedEntity?: CCDAAssignedEntity;
  relatedEntity?: CCDARelatedEntity;
}

/**
 * Assigned entity (provider)
 */
export interface CCDAAssignedEntity {
  id?: II[];
  code?: CE;
  addr?: AD[];
  telecom?: TEL[];
  assignedPerson?: CCDAPerson;
  representedOrganization?: CCDAOrganization;
}

/**
 * Related entity (family member, contact, etc.)
 */
export interface CCDARelatedEntity {
  classCode?: string;
  code?: CE;
  addr?: AD[];
  telecom?: TEL[];
  relatedPerson?: CCDAPerson;
}

/**
 * Documentation of service event
 */
export interface CCDADocumentationOf {
  serviceEvent: CCDAServiceEvent;
}

/**
 * Service event
 */
export interface CCDAServiceEvent {
  classCode?: string;
  code?: CE;
  effectiveTime?: IVL_TS;
  performer?: CCDAPerformer[];
}

/**
 * Performer
 */
export interface CCDAPerformer {
  typeCode?: string;
  functionCode?: CE;
  time?: IVL_TS;
  assignedEntity?: CCDAAssignedEntity;
}

/**
 * Encompassing encounter
 */
export interface CCDAEncompassingEncounter {
  id?: II[];
  code?: CE;
  effectiveTime?: IVL_TS;
  dischargeDispositionCode?: CE;
  responsibleParty?: CCDAAssignedEntity;
  encounterParticipant?: CCDAEncounterParticipant[];
  location?: CCDALocation;
}

/**
 * Encounter participant
 */
export interface CCDAEncounterParticipant {
  typeCode?: string;
  time?: IVL_TS;
  assignedEntity?: CCDAAssignedEntity;
}

/**
 * Location
 */
export interface CCDALocation {
  healthCareFacility?: CCDAHealthCareFacility;
}

/**
 * Healthcare facility
 */
export interface CCDAHealthCareFacility {
  id?: II[];
  code?: CE;
  location?: {
    name?: EN;
    addr?: AD;
  };
  serviceProviderOrganization?: CCDAOrganization;
}

// =============================================================================
// C-CDA Section Types
// =============================================================================

/**
 * Base C-CDA Section
 */
export interface CCDASection {
  templateId?: II[];
  id?: II;
  code?: CE;
  title?: string;
  text?: CCDANarrativeBlock;
  confidentialityCode?: CE;
  languageCode?: CS;
  entries?: CCDAEntry[];
}

/**
 * Narrative block for human-readable section content
 */
export interface CCDANarrativeBlock {
  content: string;  // XHTML content
  references?: CCDAReference[];
}

/**
 * Reference within narrative
 */
export interface CCDAReference {
  id: string;
  value?: string;
}

/**
 * Problems Section (2.16.840.1.113883.10.20.22.2.5.1)
 */
export interface CCDAProblemsSection extends CCDASection {
  entries?: CCDAProblemConcernAct[];
}

/**
 * Problem Concern Act
 */
export interface CCDAProblemConcernAct {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  author?: CCDAAuthor[];
  problemObservations?: CCDAProblemObservation[];
}

/**
 * Problem Observation
 */
export interface CCDAProblemObservation {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  value?: CD;
  author?: CCDAAuthor[];
  problemStatus?: CD;
  healthStatusObservation?: CCDAHealthStatusObservation;
  ageAtOnset?: PQ;
  prognosisObservation?: CCDAPrognosisObservation;
}

/**
 * Health Status Observation
 */
export interface CCDAHealthStatusObservation {
  templateId?: II[];
  code?: CD;
  statusCode?: CS;
  value?: CD;
}

/**
 * Prognosis Observation
 */
export interface CCDAPrognosisObservation {
  templateId?: II[];
  code?: CD;
  statusCode?: CS;
  value?: CD;
}

/**
 * Medications Section (2.16.840.1.113883.10.20.22.2.1.1)
 */
export interface CCDAMedicationsSection extends CCDASection {
  entries?: CCDAMedicationActivity[];
}

/**
 * Medication Activity
 */
export interface CCDAMedicationActivity {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS | TS[];
  repeatNumber?: IVL_INT;
  routeCode?: CE;
  approachSiteCode?: CD;
  doseQuantity?: IVL_PQ | PQ;
  rateQuantity?: IVL_PQ | PQ;
  maxDoseQuantity?: RTO_PQ_PQ;
  administrationUnitCode?: CE;
  consumable: CCDAConsumable;
  performer?: CCDAPerformer[];
  author?: CCDAAuthor[];
  informant?: CCDAInformant[];
  participant?: CCDAParticipant[];
  precondition?: CCDAPrecondition[];
  indication?: CCDAIndication[];
  instructions?: CCDAInstructions;
  supplyOrder?: CCDASupplyOrder;
  dispense?: CCDADispense[];
  drugVehicle?: CCDADrugVehicle;
}

/**
 * Interval of integers
 */
export interface IVL_INT {
  low?: number;
  high?: number;
  nullFlavor?: NullFlavor;
}

/**
 * Ratio of physical quantities
 */
export interface RTO_PQ_PQ {
  numerator?: PQ;
  denominator?: PQ;
}

/**
 * Consumable (medication)
 */
export interface CCDAConsumable {
  manufacturedProduct: CCDAManufacturedProduct;
}

/**
 * Manufactured product
 */
export interface CCDAManufacturedProduct {
  templateId?: II[];
  id?: II[];
  manufacturedMaterial?: CCDAManufacturedMaterial;
  manufacturerOrganization?: CCDAOrganization;
}

/**
 * Manufactured material
 */
export interface CCDAManufacturedMaterial {
  code?: CE;
  name?: string;
  lotNumberText?: string;
}

/**
 * Participant
 */
export interface CCDAParticipant {
  typeCode?: string;
  participantRole?: CCDAParticipantRole;
}

/**
 * Participant role
 */
export interface CCDAParticipantRole {
  classCode?: string;
  id?: II[];
  code?: CE;
  addr?: AD[];
  telecom?: TEL[];
  playingEntity?: CCDAPlayingEntity;
}

/**
 * Playing entity
 */
export interface CCDAPlayingEntity {
  classCode?: string;
  code?: CE;
  name?: EN[];
}

/**
 * Precondition
 */
export interface CCDAPrecondition {
  criterion: CCDACriterion;
}

/**
 * Criterion
 */
export interface CCDACriterion {
  code?: CD;
  value?: CD | PQ | IVL_PQ;
}

/**
 * Indication
 */
export interface CCDAIndication {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  value?: CD;
}

/**
 * Instructions
 */
export interface CCDAInstructions {
  templateId?: II[];
  code?: CD;
  text?: string;
  statusCode?: CS;
}

/**
 * Supply order
 */
export interface CCDASupplyOrder {
  templateId?: II[];
  id?: II[];
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  repeatNumber?: IVL_INT;
  quantity?: PQ;
  product?: CCDAProduct;
  author?: CCDAAuthor[];
  performer?: CCDAPerformer[];
}

/**
 * Product reference
 */
export interface CCDAProduct {
  manufacturedProduct: CCDAManufacturedProduct;
}

/**
 * Dispense event
 */
export interface CCDADispense {
  templateId?: II[];
  id?: II[];
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  repeatNumber?: IVL_INT;
  quantity?: PQ;
  product?: CCDAProduct;
  performer?: CCDAPerformer[];
}

/**
 * Drug vehicle
 */
export interface CCDADrugVehicle {
  templateId?: II[];
  code?: CE;
  name?: string;
}

/**
 * Allergies Section (2.16.840.1.113883.10.20.22.2.6.1)
 */
export interface CCDAAllergiesSection extends CCDASection {
  entries?: CCDAAllergyConcernAct[];
}

/**
 * Allergy Concern Act
 */
export interface CCDAAllergyConcernAct {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  author?: CCDAAuthor[];
  allergyObservations?: CCDAAllergyObservation[];
}

/**
 * Allergy Observation
 */
export interface CCDAAllergyObservation {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  value?: CD;
  author?: CCDAAuthor[];
  participant?: CCDAParticipant[];
  allergyStatusObservation?: CCDAAllergyStatusObservation;
  reactionObservations?: CCDAReactionObservation[];
  severityObservation?: CCDASeverityObservation;
  criticality?: CD;
}

/**
 * Allergy Status Observation
 */
export interface CCDAAllergyStatusObservation {
  templateId?: II[];
  code?: CD;
  statusCode?: CS;
  value?: CD;
}

/**
 * Reaction Observation
 */
export interface CCDAReactionObservation {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  value?: CD;
  severityObservation?: CCDASeverityObservation;
}

/**
 * Severity Observation
 */
export interface CCDASeverityObservation {
  templateId?: II[];
  code?: CD;
  statusCode?: CS;
  value?: CD;
}

/**
 * Procedures Section (2.16.840.1.113883.10.20.22.2.7.1)
 */
export interface CCDAProceduresSection extends CCDASection {
  entries?: CCDAProcedureEntry[];
}

/**
 * Procedure Entry (can be act, observation, or procedure)
 */
export interface CCDAProcedureEntry {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  priorityCode?: CE;
  methodCode?: CE;
  targetSiteCode?: CD[];
  specimen?: CCDASpecimen[];
  performer?: CCDAPerformer[];
  author?: CCDAAuthor[];
  participant?: CCDAParticipant[];
  serviceDeliveryLocation?: CCDAServiceDeliveryLocation;
  productInstance?: CCDAProductInstance;
}

/**
 * Specimen
 */
export interface CCDASpecimen {
  specimenRole: CCDASpecimenRole;
}

/**
 * Specimen role
 */
export interface CCDASpecimenRole {
  id?: II[];
  specimenPlayingEntity?: CCDASpecimenPlayingEntity;
}

/**
 * Specimen playing entity
 */
export interface CCDASpecimenPlayingEntity {
  code?: CE;
  name?: EN[];
}

/**
 * Service delivery location
 */
export interface CCDAServiceDeliveryLocation {
  templateId?: II[];
  id?: II[];
  code?: CE;
  addr?: AD[];
  telecom?: TEL[];
  playingEntity?: CCDAPlayingEntity;
}

/**
 * Product instance (device)
 */
export interface CCDAProductInstance {
  templateId?: II[];
  id?: II[];
  playingDevice?: CCDAPlayingDevice;
  scopingEntity?: CCDAOrganization;
}

/**
 * Playing device
 */
export interface CCDAPlayingDevice {
  code?: CE;
  manufacturerModelName?: string;
  softwareName?: string;
}

/**
 * Results Section (2.16.840.1.113883.10.20.22.2.3.1)
 */
export interface CCDAResultsSection extends CCDASection {
  entries?: CCDAResultOrganizer[];
}

/**
 * Result Organizer
 */
export interface CCDAResultOrganizer {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  author?: CCDAAuthor[];
  resultObservations?: CCDAResultObservation[];
}

/**
 * Result Observation
 */
export interface CCDAResultObservation {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS | TS;
  value?: PQ | CD | ST | IVL_PQ | RTO_PQ_PQ;
  interpretationCode?: CE[];
  methodCode?: CE;
  targetSiteCode?: CD;
  author?: CCDAAuthor[];
  referenceRange?: CCDAReferenceRange[];
}

/**
 * String data type
 */
export interface ST {
  value?: string;
  mediaType?: string;
  representation?: string;
}

/**
 * Reference range
 */
export interface CCDAReferenceRange {
  observationRange: CCDAObservationRange;
}

/**
 * Observation range
 */
export interface CCDAObservationRange {
  text?: string;
  value?: IVL_PQ;
  interpretationCode?: CE;
}

/**
 * Vital Signs Section (2.16.840.1.113883.10.20.22.2.4.1)
 */
export interface CCDAVitalSignsSection extends CCDASection {
  entries?: CCDAVitalSignsOrganizer[];
}

/**
 * Vital Signs Organizer
 */
export interface CCDAVitalSignsOrganizer {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS | TS;
  author?: CCDAAuthor[];
  vitalSignObservations?: CCDAVitalSignObservation[];
}

/**
 * Vital Sign Observation
 */
export interface CCDAVitalSignObservation {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: TS;
  value?: PQ;
  interpretationCode?: CE[];
  methodCode?: CE;
  targetSiteCode?: CD;
  author?: CCDAAuthor[];
}

/**
 * Immunizations Section (2.16.840.1.113883.10.20.22.2.2.1)
 */
export interface CCDAImmunizationsSection extends CCDASection {
  entries?: CCDAImmunizationActivity[];
}

/**
 * Immunization Activity
 */
export interface CCDAImmunizationActivity {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS | TS;
  routeCode?: CE;
  approachSiteCode?: CD;
  doseQuantity?: PQ;
  administrationUnitCode?: CE;
  consumable: CCDAConsumable;
  performer?: CCDAPerformer[];
  author?: CCDAAuthor[];
  informant?: CCDAInformant[];
  participant?: CCDAParticipant[];
  immunizationRefusalReason?: CCDAImmunizationRefusalReason;
  indication?: CCDAIndication[];
  instructions?: CCDAInstructions;
  medicationSupplyOrder?: CCDASupplyOrder;
  medicationDispense?: CCDADispense[];
  reactionObservation?: CCDAReactionObservation;
  negationInd?: boolean;
}

/**
 * Immunization Refusal Reason
 */
export interface CCDAImmunizationRefusalReason {
  templateId?: II[];
  code?: CD;
}

/**
 * Encounters Section (2.16.840.1.113883.10.20.22.2.22.1)
 */
export interface CCDAEncountersSection extends CCDASection {
  entries?: CCDAEncounterActivity[];
}

/**
 * Encounter Activity
 */
export interface CCDAEncounterActivity {
  templateId?: II[];
  id?: II[];
  code?: CD;
  effectiveTime?: IVL_TS;
  dischargeDispositionCode?: CE;
  performer?: CCDAPerformer[];
  author?: CCDAAuthor[];
  participant?: CCDAParticipant[];
  encounterDiagnosis?: CCDAEncounterDiagnosis[];
  indication?: CCDAIndication[];
  serviceDeliveryLocation?: CCDAServiceDeliveryLocation[];
}

/**
 * Encounter Diagnosis
 */
export interface CCDAEncounterDiagnosis {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  problemObservation?: CCDAProblemObservation;
}

/**
 * Plan of Treatment Section (2.16.840.1.113883.10.20.22.2.10)
 */
export interface CCDAPlanOfTreatmentSection extends CCDASection {
  entries?: CCDAPlanOfTreatmentEntry[];
}

/**
 * Plan of Treatment Entry
 */
export interface CCDAPlanOfTreatmentEntry {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  moodCode?: string;
  text?: string;
  author?: CCDAAuthor[];
}

/**
 * Social History Section (2.16.840.1.113883.10.20.22.2.17)
 */
export interface CCDASocialHistorySection extends CCDASection {
  entries?: CCDASocialHistoryObservation[];
}

/**
 * Social History Observation
 */
export interface CCDASocialHistoryObservation {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  value?: CD | PQ | ST;
  author?: CCDAAuthor[];
}

/**
 * Family History Section (2.16.840.1.113883.10.20.22.2.15)
 */
export interface CCDAFamilyHistorySection extends CCDASection {
  entries?: CCDAFamilyHistoryOrganizer[];
}

/**
 * Family History Organizer
 */
export interface CCDAFamilyHistoryOrganizer {
  templateId?: II[];
  id?: II[];
  statusCode?: CS;
  subject: CCDAFamilyHistorySubject;
  familyHistoryObservations?: CCDAFamilyHistoryObservation[];
}

/**
 * Family History Subject
 */
export interface CCDAFamilyHistorySubject {
  relatedSubject: CCDARelatedSubject;
}

/**
 * Related Subject
 */
export interface CCDARelatedSubject {
  classCode?: string;
  code?: CE;
  subject?: {
    administrativeGenderCode?: CE;
    birthTime?: TS;
    deceasedInd?: boolean;
  };
}

/**
 * Family History Observation
 */
export interface CCDAFamilyHistoryObservation {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  value?: CD;
  ageAtOnset?: PQ;
  familyHistoryDeathObservation?: CCDAFamilyHistoryDeathObservation;
}

/**
 * Family History Death Observation
 */
export interface CCDAFamilyHistoryDeathObservation {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  value?: CD;
}

/**
 * Medical Equipment Section (2.16.840.1.113883.10.20.22.2.23)
 */
export interface CCDAMedicalEquipmentSection extends CCDASection {
  entries?: CCDAMedicalEquipmentEntry[];
}

/**
 * Medical Equipment Entry
 */
export interface CCDAMedicalEquipmentEntry {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  participant?: CCDAParticipant[];
}

/**
 * Payers Section (2.16.840.1.113883.10.20.22.2.18)
 */
export interface CCDAPayersSection extends CCDASection {
  entries?: CCDACoverageActivity[];
}

/**
 * Coverage Activity
 */
export interface CCDACoverageActivity {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  policyActivity?: CCDAPolicyActivity;
}

/**
 * Policy Activity
 */
export interface CCDAPolicyActivity {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  performer?: CCDAPerformer[];
  participant?: CCDAParticipant[];
}

/**
 * Advance Directives Section (2.16.840.1.113883.10.20.22.2.21.1)
 */
export interface CCDAAdvanceDirectivesSection extends CCDASection {
  entries?: CCDAAdvanceDirectiveObservation[];
}

/**
 * Advance Directive Observation
 */
export interface CCDAAdvanceDirectiveObservation {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  value?: CD;
  author?: CCDAAuthor[];
  participant?: CCDAParticipant[];
  reference?: CCDAExternalDocument;
}

/**
 * External Document Reference
 */
export interface CCDAExternalDocument {
  templateId?: II[];
  id?: II[];
  code?: CD;
  text?: ST;
  setId?: II;
  versionNumber?: number;
}

/**
 * Functional Status Section (2.16.840.1.113883.10.20.22.2.14)
 */
export interface CCDAFunctionalStatusSection extends CCDASection {
  entries?: CCDAFunctionalStatusEntry[];
}

/**
 * Functional Status Entry
 */
export interface CCDAFunctionalStatusEntry {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  value?: CD | PQ;
  author?: CCDAAuthor[];
}

/**
 * Discharge Instructions Section
 */
export interface CCDADischargeInstructionsSection extends CCDASection {
  entries?: CCDADischargeInstruction[];
}

/**
 * Discharge Instruction
 */
export interface CCDADischargeInstruction {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  text?: string;
}

/**
 * Hospital Discharge Diagnosis Section
 */
export interface CCDAHospitalDischargeDiagnosisSection extends CCDASection {
  entries?: CCDAHospitalDischargeDiagnosis[];
}

/**
 * Hospital Discharge Diagnosis
 */
export interface CCDAHospitalDischargeDiagnosis {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  problemObservation?: CCDAProblemObservation;
}

/**
 * Reason for Referral Section
 */
export interface CCDAReasonForReferralSection extends CCDASection {
  text?: CCDANarrativeBlock;
}

/**
 * Hospital Course Section
 */
export interface CCDAHospitalCourseSection extends CCDASection {
  text?: CCDANarrativeBlock;
}

/**
 * Assessment Section
 */
export interface CCDAAssessmentSection extends CCDASection {
  text?: CCDANarrativeBlock;
}

/**
 * Chief Complaint Section
 */
export interface CCDAChiefComplaintSection extends CCDASection {
  text?: CCDANarrativeBlock;
}

/**
 * History of Present Illness Section
 */
export interface CCDAHistoryOfPresentIllnessSection extends CCDASection {
  text?: CCDANarrativeBlock;
}

/**
 * Review of Systems Section
 */
export interface CCDAReviewOfSystemsSection extends CCDASection {
  text?: CCDANarrativeBlock;
}

/**
 * Physical Exam Section
 */
export interface CCDAPhysicalExamSection extends CCDASection {
  text?: CCDANarrativeBlock;
}

/**
 * Goals Section
 */
export interface CCDAGoalsSection extends CCDASection {
  entries?: CCDAGoalObservation[];
}

/**
 * Goal Observation
 */
export interface CCDAGoalObservation {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  value?: CD | PQ | ST;
  author?: CCDAAuthor[];
}

/**
 * Health Concerns Section
 */
export interface CCDAHealthConcernsSection extends CCDASection {
  entries?: CCDAHealthConcernAct[];
}

/**
 * Health Concern Act
 */
export interface CCDAHealthConcernAct {
  templateId?: II[];
  id?: II[];
  code?: CD;
  statusCode?: CS;
  effectiveTime?: IVL_TS;
  author?: CCDAAuthor[];
  healthConcernObservation?: CCDAProblemObservation;
}

// =============================================================================
// C-CDA Entry Types
// =============================================================================

/**
 * Base C-CDA Entry
 */
export interface CCDAEntry {
  typeCode?: string;
  contextConductionInd?: boolean;
  act?: CCDAProblemConcernAct | CCDAAllergyConcernAct | CCDACoverageActivity | CCDAHealthConcernAct;
  observation?: CCDAProblemObservation | CCDAAllergyObservation | CCDAResultObservation | CCDASocialHistoryObservation;
  procedure?: CCDAProcedureEntry;
  substanceAdministration?: CCDAMedicationActivity | CCDAImmunizationActivity;
  supply?: CCDASupplyOrder;
  organizer?: CCDAResultOrganizer | CCDAVitalSignsOrganizer | CCDAFamilyHistoryOrganizer;
  encounter?: CCDAEncounterActivity;
}

// =============================================================================
// C-CDA Document Types
// =============================================================================

/**
 * Base C-CDA Document Header
 */
export interface CCDADocumentHeader {
  realmCode?: CS;
  typeId?: II;
  templateId?: II[];
  id: II;
  code: CE;
  title: string;
  effectiveTime: TS;
  confidentialityCode: CE;
  languageCode?: CS;
  setId?: II;
  versionNumber?: number;
  copyTime?: TS;
  recordTarget: CCDARecordTarget[];
  author: CCDAAuthor[];
  dataEnterer?: CCDADataEnterer;
  informant?: CCDAInformant[];
  custodian: CCDACustodian;
  informationRecipient?: CCDAInformationRecipient[];
  legalAuthenticator?: CCDALegalAuthenticator;
  authenticator?: CCDAAuthenticator[];
  participant?: CCDAParticipant[];
  inFulfillmentOf?: CCDAInFulfillmentOf[];
  documentationOf?: CCDADocumentationOf[];
  relatedDocument?: CCDARelatedDocument[];
  authorization?: CCDAAuthorization[];
  componentOf?: CCDAComponentOf;
}

/**
 * Data Enterer
 */
export interface CCDADataEnterer {
  time?: TS;
  assignedEntity: CCDAAssignedEntity;
}

/**
 * Information Recipient
 */
export interface CCDAInformationRecipient {
  intendedRecipient: CCDAIntendedRecipient;
}

/**
 * Intended Recipient
 */
export interface CCDAIntendedRecipient {
  id?: II[];
  addr?: AD[];
  telecom?: TEL[];
  informationRecipient?: CCDAPerson;
  receivedOrganization?: CCDAOrganization;
}

/**
 * Legal Authenticator
 */
export interface CCDALegalAuthenticator {
  time: TS;
  signatureCode: CS;
  assignedEntity: CCDAAssignedEntity;
}

/**
 * Authenticator
 */
export interface CCDAAuthenticator {
  time: TS;
  signatureCode: CS;
  assignedEntity: CCDAAssignedEntity;
}

/**
 * In Fulfillment Of
 */
export interface CCDAInFulfillmentOf {
  order: CCDAOrder;
}

/**
 * Order
 */
export interface CCDAOrder {
  id?: II[];
  code?: CE;
  priorityCode?: CE;
}

/**
 * Related Document
 */
export interface CCDARelatedDocument {
  typeCode: string;
  parentDocument: CCDAParentDocument;
}

/**
 * Parent Document
 */
export interface CCDAParentDocument {
  id?: II[];
  code?: CE;
  text?: ST;
  setId?: II;
  versionNumber?: number;
}

/**
 * Authorization
 */
export interface CCDAAuthorization {
  consent: CCDAConsent;
}

/**
 * Consent
 */
export interface CCDAConsent {
  id?: II[];
  code?: CE;
  statusCode?: CS;
}

/**
 * Component Of (encounter context)
 */
export interface CCDAComponentOf {
  encompassingEncounter: CCDAEncompassingEncounter;
}

/**
 * Base C-CDA Document
 */
export interface CCDADocument extends CCDADocumentHeader {
  component: {
    structuredBody?: CCDAStructuredBody;
    nonXMLBody?: CCDANonXMLBody;
  };
}

/**
 * Structured Body
 */
export interface CCDAStructuredBody {
  confidentialityCode?: CE;
  languageCode?: CS;
  components: CCDAComponent[];
}

/**
 * Non-XML Body
 */
export interface CCDANonXMLBody {
  confidentialityCode?: CE;
  languageCode?: CS;
  text: {
    mediaType: string;
    representation?: string;
    content: string;
  };
}

/**
 * Component containing a section
 */
export interface CCDAComponent {
  section: CCDASection;
}

// =============================================================================
// Document Type Interfaces
// =============================================================================

/**
 * Continuity of Care Document (CCD)
 * Template ID: 2.16.840.1.113883.10.20.22.1.2
 */
export interface ContinuityOfCareDocument extends CCDADocument {
  component: {
    structuredBody: {
      components: CCDAComponent[];
    };
  };
  // Required sections for CCD
  allergiesSection?: CCDAAllergiesSection;
  medicationsSection?: CCDAMedicationsSection;
  problemsSection?: CCDAProblemsSection;
  proceduresSection?: CCDAProceduresSection;
  resultsSection?: CCDAResultsSection;
  // Optional sections
  encountersSection?: CCDAEncountersSection;
  immunizationsSection?: CCDAImmunizationsSection;
  vitalSignsSection?: CCDAVitalSignsSection;
  socialHistorySection?: CCDASocialHistorySection;
  familyHistorySection?: CCDAFamilyHistorySection;
  planOfTreatmentSection?: CCDAPlanOfTreatmentSection;
  payersSection?: CCDAPayersSection;
  advanceDirectivesSection?: CCDAAdvanceDirectivesSection;
  functionalStatusSection?: CCDAFunctionalStatusSection;
  medicalEquipmentSection?: CCDAMedicalEquipmentSection;
}

/**
 * Discharge Summary
 * Template ID: 2.16.840.1.113883.10.20.22.1.8
 */
export interface DischargeSummary extends CCDADocument {
  component: {
    structuredBody: {
      components: CCDAComponent[];
    };
  };
  // Required sections
  allergiesSection?: CCDAAllergiesSection;
  hospitalDischargeDiagnosisSection?: CCDAHospitalDischargeDiagnosisSection;
  hospitalDischargeInstructionsSection?: CCDADischargeInstructionsSection;
  hospitalDischargeMedicationsSection?: CCDAMedicationsSection;
  // Recommended sections
  admissionMedicationsSection?: CCDAMedicationsSection;
  chiefComplaintSection?: CCDAChiefComplaintSection;
  dischargeConditionSection?: CCDASection;
  historyOfPresentIllnessSection?: CCDAHistoryOfPresentIllnessSection;
  hospitalCourseSection?: CCDAHospitalCourseSection;
  planOfTreatmentSection?: CCDAPlanOfTreatmentSection;
  problemsSection?: CCDAProblemsSection;
  proceduresSection?: CCDAProceduresSection;
  reasonForVisitSection?: CCDASection;
  vitalSignsSection?: CCDAVitalSignsSection;
}

/**
 * Referral Note
 * Template ID: 2.16.840.1.113883.10.20.22.1.14
 */
export interface ReferralNote extends CCDADocument {
  component: {
    structuredBody: {
      components: CCDAComponent[];
    };
  };
  // Required sections
  allergiesSection?: CCDAAllergiesSection;
  medicationsSection?: CCDAMedicationsSection;
  problemsSection?: CCDAProblemsSection;
  reasonForReferralSection?: CCDAReasonForReferralSection;
  // Recommended sections
  familyHistorySection?: CCDAFamilyHistorySection;
  functionalStatusSection?: CCDAFunctionalStatusSection;
  immunizationsSection?: CCDAImmunizationsSection;
  mentalStatusSection?: CCDASection;
  physicalExamSection?: CCDAPhysicalExamSection;
  planOfTreatmentSection?: CCDAPlanOfTreatmentSection;
  proceduresSection?: CCDAProceduresSection;
  resultsSection?: CCDAResultsSection;
  reviewOfSystemsSection?: CCDAReviewOfSystemsSection;
  socialHistorySection?: CCDASocialHistorySection;
  vitalSignsSection?: CCDAVitalSignsSection;
  historyOfPresentIllnessSection?: CCDAHistoryOfPresentIllnessSection;
  assessmentSection?: CCDAAssessmentSection;
}

/**
 * Progress Note
 * Template ID: 2.16.840.1.113883.10.20.22.1.9
 */
export interface ProgressNote extends CCDADocument {
  component: {
    structuredBody: {
      components: CCDAComponent[];
    };
  };
  // Required sections (at least one)
  assessmentSection?: CCDAAssessmentSection;
  planOfTreatmentSection?: CCDAPlanOfTreatmentSection;
  assessmentAndPlanSection?: CCDASection;
  // Optional sections
  allergiesSection?: CCDAAllergiesSection;
  chiefComplaintSection?: CCDAChiefComplaintSection;
  interventionsSection?: CCDASection;
  medicationsSection?: CCDAMedicationsSection;
  objectiveSection?: CCDASection;
  physicalExamSection?: CCDAPhysicalExamSection;
  problemsSection?: CCDAProblemsSection;
  resultsSection?: CCDAResultsSection;
  reviewOfSystemsSection?: CCDAReviewOfSystemsSection;
  subjectiveSection?: CCDASection;
  vitalSignsSection?: CCDAVitalSignsSection;
}

/**
 * Consultation Note
 * Template ID: 2.16.840.1.113883.10.20.22.1.4
 */
export interface ConsultationNote extends CCDADocument {
  component: {
    structuredBody: {
      components: CCDAComponent[];
    };
  };
  // Required sections
  allergiesSection?: CCDAAllergiesSection;
  assessmentSection?: CCDAAssessmentSection;
  historyOfPresentIllnessSection?: CCDAHistoryOfPresentIllnessSection;
  physicalExamSection?: CCDAPhysicalExamSection;
  reasonForReferralSection?: CCDAReasonForReferralSection;
  // Recommended sections
  medicationsSection?: CCDAMedicationsSection;
  planOfTreatmentSection?: CCDAPlanOfTreatmentSection;
  problemsSection?: CCDAProblemsSection;
}

/**
 * History and Physical
 * Template ID: 2.16.840.1.113883.10.20.22.1.3
 */
export interface HistoryAndPhysical extends CCDADocument {
  component: {
    structuredBody: {
      components: CCDAComponent[];
    };
  };
  // Required sections
  allergiesSection?: CCDAAllergiesSection;
  chiefComplaintSection?: CCDAChiefComplaintSection;
  familyHistorySection?: CCDAFamilyHistorySection;
  historyOfPresentIllnessSection?: CCDAHistoryOfPresentIllnessSection;
  medicationsSection?: CCDAMedicationsSection;
  physicalExamSection?: CCDAPhysicalExamSection;
  resultsSection?: CCDAResultsSection;
  reviewOfSystemsSection?: CCDAReviewOfSystemsSection;
  socialHistorySection?: CCDASocialHistorySection;
  vitalSignsSection?: CCDAVitalSignsSection;
  // Recommended sections
  assessmentSection?: CCDAAssessmentSection;
  planOfTreatmentSection?: CCDAPlanOfTreatmentSection;
  problemsSection?: CCDAProblemsSection;
  proceduresSection?: CCDAProceduresSection;
}

/**
 * Operative Note
 * Template ID: 2.16.840.1.113883.10.20.22.1.7
 */
export interface OperativeNote extends CCDADocument {
  component: {
    structuredBody: {
      components: CCDAComponent[];
    };
  };
  // Required sections
  anesthesiaSection?: CCDASection;
  complicationsSection?: CCDASection;
  operativeNoteFluidSection?: CCDASection;
  operativeNoteSurgicalProcedureSection?: CCDASection;
  planOfTreatmentSection?: CCDAPlanOfTreatmentSection;
  postoperativeDiagnosisSection?: CCDASection;
  preoperativeDiagnosisSection?: CCDASection;
  procedureDescriptionSection?: CCDASection;
  procedureDispositionSection?: CCDASection;
  procedureEstimatedBloodLossSection?: CCDASection;
  procedureFindingsSection?: CCDASection;
  procedureImplantsSection?: CCDASection;
  procedureIndicationsSection?: CCDASection;
  procedureSpecimensTakenSection?: CCDASection;
  surgicalDrainsSection?: CCDASection;
  // Recommended sections
  allergiesSection?: CCDAAllergiesSection;
  medicationsSection?: CCDAMedicationsSection;
}

/**
 * Care Plan
 * Template ID: 2.16.840.1.113883.10.20.22.1.15
 */
export interface CarePlan extends CCDADocument {
  component: {
    structuredBody: {
      components: CCDAComponent[];
    };
  };
  // Required sections
  healthConcernsSection?: CCDAHealthConcernsSection;
  goalsSection?: CCDAGoalsSection;
  interventionsSection?: CCDASection;
  healthStatusEvaluationsSection?: CCDASection;
  // Recommended sections
  allergiesSection?: CCDAAllergiesSection;
  medicationsSection?: CCDAMedicationsSection;
  problemsSection?: CCDAProblemsSection;
}

/**
 * Union type for all C-CDA document types
 */
export type CCDADocumentType =
  | ContinuityOfCareDocument
  | DischargeSummary
  | ReferralNote
  | ProgressNote
  | ConsultationNote
  | HistoryAndPhysical
  | OperativeNote
  | CarePlan;

/**
 * Document type identifiers
 */
export type CCDADocumentTypeCode =
  | 'CCD'
  | 'DISCHARGE_SUMMARY'
  | 'REFERRAL_NOTE'
  | 'PROGRESS_NOTE'
  | 'CONSULTATION_NOTE'
  | 'HISTORY_AND_PHYSICAL'
  | 'OPERATIVE_NOTE'
  | 'CARE_PLAN';

/**
 * Mapping of document types to their LOINC codes
 */
export const CCDADocumentTypeCodes: Record<CCDADocumentTypeCode, string> = {
  CCD: '34133-9',
  DISCHARGE_SUMMARY: '18842-5',
  REFERRAL_NOTE: '57133-1',
  PROGRESS_NOTE: '11506-3',
  CONSULTATION_NOTE: '11488-4',
  HISTORY_AND_PHYSICAL: '34117-2',
  OPERATIVE_NOTE: '11504-8',
  CARE_PLAN: '52521-2'
};
