/**
 * C-CDA to FHIR Mapping Utilities
 * Converts between C-CDA sections and FHIR R4 resources
 * Based on HL7 C-CDA 2.1 and FHIR R4 specifications
 */

import {
  // FHIR Types
  Condition,
  MedicationRequest,
  AllergyIntolerance,
  AllergyIntoleranceReaction,
  Observation,
  DiagnosticReport,
  Patient,
  Identifier,
  CodeableConcept,
  Coding,
  Reference,
  Period,
  HumanName,
  Address,
  ContactPoint,
  Quantity,
  Annotation,
} from '../index';

import {
  // C-CDA Types
  CCDADocument,
  CCDAProblemsSection,
  CCDAMedicationsSection,
  CCDAAllergiesSection,
  CCDAProceduresSection,
  CCDAResultsSection,
  CCDAVitalSignsSection,
  CCDAImmunizationsSection,
  CCDAProblemConcernAct,
  CCDAProblemObservation,
  CCDAMedicationActivity,
  CCDAAllergyConcernAct,
  CCDAAllergyObservation,
  CCDAProcedureEntry,
  CCDAResultOrganizer,
  CCDAResultObservation,
  CCDAVitalSignsOrganizer,
  CCDAVitalSignObservation,
  CCDAImmunizationActivity,
  CCDAPatient,
  CCDAPatientRole,
  II,
  CE,
  CD,
  TS,
  IVL_TS,
  AD,
  TEL,
  PN,
  PQ,
  CCDASection,
  CCDAComponent,
  ContinuityOfCareDocument,
} from './types';

import {
  LOINC_OID,
  SNOMED_CT_OID,
  RXNORM_OID,
  ICD10_CM_OID,
  CVX_OID,
  CPT_OID,
  SectionTemplateIds,
} from './templates';

import { getSections, findSectionByTemplateId } from './parser';

// =============================================================================
// Type Definitions for FHIR Resources not fully defined in base types
// =============================================================================

/**
 * FHIR Procedure resource
 */
export interface Procedure {
  resourceType: 'Procedure';
  id?: string;
  identifier?: Identifier[];
  status: 'preparation' | 'in-progress' | 'not-done' | 'on-hold' | 'stopped' | 'completed' | 'entered-in-error' | 'unknown';
  code?: CodeableConcept;
  subject: Reference;
  performedDateTime?: string;
  performedPeriod?: Period;
  performer?: Array<{
    actor: Reference;
  }>;
  bodySite?: CodeableConcept[];
  note?: Annotation[];
}

/**
 * FHIR Immunization resource
 */
export interface Immunization {
  resourceType: 'Immunization';
  id?: string;
  identifier?: Identifier[];
  status: 'completed' | 'entered-in-error' | 'not-done';
  vaccineCode: CodeableConcept;
  patient: Reference;
  occurrenceDateTime?: string;
  primarySource?: boolean;
  lotNumber?: string;
  site?: CodeableConcept;
  route?: CodeableConcept;
  doseQuantity?: Quantity;
  performer?: Array<{
    actor: Reference;
  }>;
  note?: Annotation[];
  reasonCode?: CodeableConcept[];
  statusReason?: CodeableConcept;
}

/**
 * FHIR MedicationStatement resource
 */
export interface MedicationStatement {
  resourceType: 'MedicationStatement';
  id?: string;
  identifier?: Identifier[];
  status: 'active' | 'completed' | 'entered-in-error' | 'intended' | 'stopped' | 'on-hold' | 'unknown' | 'not-taken';
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  dateAsserted?: string;
  informationSource?: Reference;
  dosage?: any[];
  note?: Annotation[];
}

/**
 * FHIR Bundle resource
 */
export interface Bundle {
  resourceType: 'Bundle';
  id?: string;
  type: 'document' | 'message' | 'transaction' | 'transaction-response' | 'batch' | 'batch-response' | 'history' | 'searchset' | 'collection';
  timestamp?: string;
  total?: number;
  entry?: BundleEntry[];
}

/**
 * FHIR Bundle Entry
 */
export interface BundleEntry {
  fullUrl?: string;
  resource?: any;
  request?: {
    method: string;
    url: string;
  };
}

// =============================================================================
// Mapping Options
// =============================================================================

export interface CCDAToFHIRMappingOptions {
  /** Generate UUIDs for resource IDs */
  generateIds?: boolean;
  /** Base URL for resource references */
  baseUrl?: string;
  /** Patient reference to use in resources */
  patientReference?: Reference;
  /** Include narrative text in resources */
  includeNarrative?: boolean;
  /** Default code system for unmapped codes */
  defaultCodeSystem?: string;
}

const DEFAULT_MAPPING_OPTIONS: CCDAToFHIRMappingOptions = {
  generateIds: true,
  baseUrl: 'urn:uuid:',
  includeNarrative: true,
};

// =============================================================================
// Main Mapping Functions
// =============================================================================

/**
 * Convert a C-CDA document to a FHIR Bundle
 */
export function ccdaToFhirBundle(
  document: CCDADocument,
  options: CCDAToFHIRMappingOptions = {}
): Bundle {
  const opts = { ...DEFAULT_MAPPING_OPTIONS, ...options };
  const entries: BundleEntry[] = [];

  // Convert patient
  const patientRef = opts.patientReference || convertRecordTargetToPatient(document, entries, opts);

  // Get all sections
  const sections = getSections(document);

  for (const section of sections) {
    const templateId = section.templateId?.[0]?.root;
    if (!templateId) continue;

    switch (templateId) {
      case SectionTemplateIds.PROBLEMS:
      case SectionTemplateIds.PROBLEMS_ENTRIES_REQUIRED:
        convertProblemsSectionToConditions(section as CCDAProblemsSection, patientRef, entries, opts);
        break;

      case SectionTemplateIds.MEDICATIONS:
      case SectionTemplateIds.MEDICATIONS_ENTRIES_REQUIRED:
        convertMedicationsSectionToMedicationResources(section as CCDAMedicationsSection, patientRef, entries, opts);
        break;

      case SectionTemplateIds.ALLERGIES:
      case SectionTemplateIds.ALLERGIES_ENTRIES_REQUIRED:
        convertAllergiesSectionToAllergyIntolerances(section as CCDAAllergiesSection, patientRef, entries, opts);
        break;

      case SectionTemplateIds.PROCEDURES:
      case SectionTemplateIds.PROCEDURES_ENTRIES_REQUIRED:
        convertProceduresSectionToProcedures(section as CCDAProceduresSection, patientRef, entries, opts);
        break;

      case SectionTemplateIds.RESULTS:
      case SectionTemplateIds.RESULTS_ENTRIES_REQUIRED:
        convertResultsSectionToObservations(section as CCDAResultsSection, patientRef, entries, opts);
        break;

      case SectionTemplateIds.VITAL_SIGNS:
      case SectionTemplateIds.VITAL_SIGNS_ENTRIES_REQUIRED:
        convertVitalSignsSectionToObservations(section as CCDAVitalSignsSection, patientRef, entries, opts);
        break;

      case SectionTemplateIds.IMMUNIZATIONS:
      case SectionTemplateIds.IMMUNIZATIONS_ENTRIES_REQUIRED:
        convertImmunizationsSectionToImmunizations(section as CCDAImmunizationsSection, patientRef, entries, opts);
        break;
    }
  }

  return {
    resourceType: 'Bundle',
    id: opts.generateIds ? generateUUID() : undefined,
    type: 'document',
    timestamp: new Date().toISOString(),
    entry: entries,
  };
}

/**
 * Convert record target to FHIR Patient
 */
function convertRecordTargetToPatient(
  document: CCDADocument,
  entries: BundleEntry[],
  options: CCDAToFHIRMappingOptions
): Reference {
  if (!document.recordTarget || document.recordTarget.length === 0) {
    return { reference: 'Patient/unknown' };
  }

  const recordTarget = document.recordTarget[0];
  const patientRole = recordTarget.patientRole;
  const ccdaPatient = patientRole?.patient;

  const patient: Patient = {
    resourceType: 'Patient',
    id: options.generateIds ? generateUUID() : undefined,
  };

  // Convert identifiers
  if (patientRole?.id) {
    patient.identifier = patientRole.id.map(ii => convertIIToIdentifier(ii));
  }

  // Convert name
  if (ccdaPatient?.name) {
    patient.name = ccdaPatient.name.map(pn => convertPNToHumanName(pn));
  }

  // Convert gender
  if (ccdaPatient?.administrativeGenderCode) {
    patient.gender = mapGenderCode(ccdaPatient.administrativeGenderCode.code);
  }

  // Convert birth date
  if (ccdaPatient?.birthTime) {
    patient.birthDate = convertTSToDate(ccdaPatient.birthTime);
  }

  // Convert address
  if (patientRole?.addr) {
    patient.address = patientRole.addr.map(ad => convertADToAddress(ad));
  }

  // Convert telecom
  if (patientRole?.telecom) {
    patient.telecom = patientRole.telecom.map(tel => convertTELToContactPoint(tel));
  }

  // Convert marital status
  if (ccdaPatient?.maritalStatusCode) {
    patient.maritalStatus = convertCEToCodeableConcept(ccdaPatient.maritalStatusCode);
  }

  const fullUrl = options.baseUrl + (patient.id || generateUUID());
  entries.push({
    fullUrl,
    resource: patient,
  });

  return { reference: fullUrl };
}

// =============================================================================
// Section to FHIR Resource Conversions
// =============================================================================

/**
 * Convert Problems Section to FHIR Conditions
 */
export function convertProblemsSectionToConditions(
  section: CCDAProblemsSection,
  patientRef: Reference,
  entries: BundleEntry[],
  options: CCDAToFHIRMappingOptions
): Condition[] {
  const conditions: Condition[] = [];

  if (!section.entries) return conditions;

  for (const concernAct of section.entries) {
    if (!concernAct.problemObservations) continue;

    for (const obs of concernAct.problemObservations) {
      const condition = convertProblemObservationToCondition(obs, concernAct, patientRef, options);
      conditions.push(condition);

      const fullUrl = options.baseUrl + (condition.id || generateUUID());
      entries.push({
        fullUrl,
        resource: condition,
      });
    }
  }

  return conditions;
}

/**
 * Convert Problem Observation to FHIR Condition
 */
function convertProblemObservationToCondition(
  obs: CCDAProblemObservation,
  concernAct: CCDAProblemConcernAct,
  patientRef: Reference,
  options: CCDAToFHIRMappingOptions
): Condition {
  const condition: Condition = {
    resourceType: 'Condition',
    id: options.generateIds ? generateUUID() : undefined,
    subject: patientRef,
  };

  // Convert identifiers
  if (obs.id) {
    condition.identifier = obs.id.map(ii => convertIIToIdentifier(ii));
  }

  // Convert code (diagnosis)
  if (obs.value) {
    condition.code = convertCDToCodeableConcept(obs.value);
  }

  // Convert clinical status from concern act status
  if (concernAct.statusCode?.code) {
    condition.clinicalStatus = mapProblemStatusToClinicalStatus(concernAct.statusCode.code);
  }

  // Convert verification status
  condition.verificationStatus = {
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
      code: 'confirmed',
    }],
  };

  // Convert onset/abatement from effective time
  if (obs.effectiveTime) {
    if (obs.effectiveTime.low?.value) {
      condition.onsetDateTime = convertTSToDateTime(obs.effectiveTime.low);
    }
    if (obs.effectiveTime.high?.value) {
      condition.abatementDateTime = convertTSToDateTime(obs.effectiveTime.high);
    }
  }

  // Set category
  condition.category = [{
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/condition-category',
      code: 'problem-list-item',
      display: 'Problem List Item',
    }],
  }];

  return condition;
}

/**
 * Convert Medications Section to FHIR MedicationRequest/MedicationStatement
 */
export function convertMedicationsSectionToMedicationResources(
  section: CCDAMedicationsSection,
  patientRef: Reference,
  entries: BundleEntry[],
  options: CCDAToFHIRMappingOptions
): (MedicationRequest | MedicationStatement)[] {
  const resources: (MedicationRequest | MedicationStatement)[] = [];

  if (!section.entries) return resources;

  for (const activity of section.entries) {
    // Convert to MedicationStatement for historical medications
    const medStatement = convertMedicationActivityToMedicationStatement(activity, patientRef, options);
    resources.push(medStatement);

    const fullUrl = options.baseUrl + (medStatement.id || generateUUID());
    entries.push({
      fullUrl,
      resource: medStatement,
    });
  }

  return resources;
}

/**
 * Convert Medication Activity to FHIR MedicationStatement
 */
function convertMedicationActivityToMedicationStatement(
  activity: CCDAMedicationActivity,
  patientRef: Reference,
  options: CCDAToFHIRMappingOptions
): MedicationStatement {
  const medStatement: MedicationStatement = {
    resourceType: 'MedicationStatement',
    id: options.generateIds ? generateUUID() : undefined,
    status: mapMedicationStatusToFHIR(activity.statusCode?.code),
    subject: patientRef,
  };

  // Convert identifiers
  if (activity.id) {
    medStatement.identifier = activity.id.map(ii => convertIIToIdentifier(ii));
  }

  // Convert medication code
  if (activity.consumable?.manufacturedProduct?.manufacturedMaterial?.code) {
    medStatement.medicationCodeableConcept = convertCEToCodeableConcept(
      activity.consumable.manufacturedProduct.manufacturedMaterial.code
    );
  }

  // Convert effective time
  if (activity.effectiveTime) {
    if ('low' in activity.effectiveTime || 'high' in activity.effectiveTime) {
      medStatement.effectivePeriod = convertIVL_TSToPeriod(activity.effectiveTime);
    }
  }

  // Convert dosage
  if (activity.doseQuantity || activity.routeCode) {
    medStatement.dosage = [{
      route: activity.routeCode ? convertCEToCodeableConcept(activity.routeCode) : undefined,
      doseAndRate: activity.doseQuantity ? [{
        doseQuantity: convertPQToQuantity(activity.doseQuantity),
      }] : undefined,
    }];
  }

  return medStatement;
}

/**
 * Convert Allergies Section to FHIR AllergyIntolerance resources
 */
export function convertAllergiesSectionToAllergyIntolerances(
  section: CCDAAllergiesSection,
  patientRef: Reference,
  entries: BundleEntry[],
  options: CCDAToFHIRMappingOptions
): AllergyIntolerance[] {
  const allergies: AllergyIntolerance[] = [];

  if (!section.entries) return allergies;

  for (const concernAct of section.entries) {
    if (!concernAct.allergyObservations) continue;

    for (const obs of concernAct.allergyObservations) {
      const allergy = convertAllergyObservationToAllergyIntolerance(obs, concernAct, patientRef, options);
      allergies.push(allergy);

      const fullUrl = options.baseUrl + (allergy.id || generateUUID());
      entries.push({
        fullUrl,
        resource: allergy,
      });
    }
  }

  return allergies;
}

/**
 * Convert Allergy Observation to FHIR AllergyIntolerance
 */
function convertAllergyObservationToAllergyIntolerance(
  obs: CCDAAllergyObservation,
  concernAct: CCDAAllergyConcernAct,
  patientRef: Reference,
  options: CCDAToFHIRMappingOptions
): AllergyIntolerance {
  const allergy: AllergyIntolerance = {
    resourceType: 'AllergyIntolerance',
    id: options.generateIds ? generateUUID() : undefined,
    patient: patientRef,
  };

  // Convert identifiers
  if (obs.id) {
    allergy.identifier = obs.id.map(ii => convertIIToIdentifier(ii));
  }

  // Convert clinical status from concern act status
  if (concernAct.statusCode?.code) {
    allergy.clinicalStatus = mapAllergyStatusToClinicalStatus(concernAct.statusCode.code);
  }

  // Convert verification status
  allergy.verificationStatus = {
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification',
      code: 'confirmed',
    }],
  };

  // Convert allergy type from value
  if (obs.value) {
    allergy.type = mapAllergyTypeCode(obs.value.code);
    allergy.code = convertCDToCodeableConcept(obs.value);
  }

  // Convert onset
  if (obs.effectiveTime?.low) {
    allergy.onsetDateTime = convertTSToDateTime(obs.effectiveTime.low);
  }

  // Convert reactions
  if (obs.reactionObservations && obs.reactionObservations.length > 0) {
    allergy.reaction = obs.reactionObservations.map(reaction => {
      const fhirReaction: AllergyIntoleranceReaction = {
        manifestation: [],
      };

      if (reaction.value) {
        fhirReaction.manifestation.push(convertCDToCodeableConcept(reaction.value));
      }

      return fhirReaction;
    });
  }

  // Convert severity
  if (obs.severityObservation?.value) {
    const severity = mapSeverityCode(obs.severityObservation.value.code);
    if (allergy.reaction && allergy.reaction.length > 0) {
      allergy.reaction[0].severity = severity;
    }
  }

  // Convert criticality
  if (obs.criticality) {
    allergy.criticality = mapCriticalityCode(obs.criticality.code);
  }

  return allergy;
}

/**
 * Convert Procedures Section to FHIR Procedure resources
 */
export function convertProceduresSectionToProcedures(
  section: CCDAProceduresSection,
  patientRef: Reference,
  entries: BundleEntry[],
  options: CCDAToFHIRMappingOptions
): Procedure[] {
  const procedures: Procedure[] = [];

  if (!section.entries) return procedures;

  for (const entry of section.entries) {
    const procedure = convertProcedureEntryToProcedure(entry, patientRef, options);
    procedures.push(procedure);

    const fullUrl = options.baseUrl + (procedure.id || generateUUID());
    entries.push({
      fullUrl,
      resource: procedure,
    });
  }

  return procedures;
}

/**
 * Convert Procedure Entry to FHIR Procedure
 */
function convertProcedureEntryToProcedure(
  entry: CCDAProcedureEntry,
  patientRef: Reference,
  options: CCDAToFHIRMappingOptions
): Procedure {
  const procedure: Procedure = {
    resourceType: 'Procedure',
    id: options.generateIds ? generateUUID() : undefined,
    status: mapProcedureStatusToFHIR(entry.statusCode?.code),
    subject: patientRef,
  };

  // Convert identifiers
  if (entry.id) {
    procedure.identifier = entry.id.map(ii => convertIIToIdentifier(ii));
  }

  // Convert code
  if (entry.code) {
    procedure.code = convertCDToCodeableConcept(entry.code);
  }

  // Convert performed time
  if (entry.effectiveTime) {
    if ('low' in entry.effectiveTime || 'high' in entry.effectiveTime) {
      procedure.performedPeriod = convertIVL_TSToPeriod(entry.effectiveTime);
    } else if ('value' in entry.effectiveTime) {
      procedure.performedDateTime = convertTSToDateTime(entry.effectiveTime as TS);
    }
  }

  // Convert body site
  if (entry.targetSiteCode && entry.targetSiteCode.length > 0) {
    procedure.bodySite = entry.targetSiteCode.map(site => convertCDToCodeableConcept(site));
  }

  return procedure;
}

/**
 * Convert Results Section to FHIR Observations and DiagnosticReports
 */
export function convertResultsSectionToObservations(
  section: CCDAResultsSection,
  patientRef: Reference,
  entries: BundleEntry[],
  options: CCDAToFHIRMappingOptions
): (Observation | DiagnosticReport)[] {
  const resources: (Observation | DiagnosticReport)[] = [];

  if (!section.entries) return resources;

  for (const organizer of section.entries) {
    // Create DiagnosticReport for the organizer
    const report = convertResultOrganizerToDiagnosticReport(organizer, patientRef, options);
    const reportFullUrl = options.baseUrl + (report.id || generateUUID());
    const observationRefs: Reference[] = [];

    // Convert result observations
    if (organizer.resultObservations) {
      for (const obs of organizer.resultObservations) {
        const observation = convertResultObservationToObservation(obs, patientRef, options);
        resources.push(observation);

        const obsFullUrl = options.baseUrl + (observation.id || generateUUID());
        entries.push({
          fullUrl: obsFullUrl,
          resource: observation,
        });

        observationRefs.push({ reference: obsFullUrl });
      }
    }

    report.result = observationRefs;
    resources.push(report);

    entries.push({
      fullUrl: reportFullUrl,
      resource: report,
    });
  }

  return resources;
}

/**
 * Convert Result Organizer to FHIR DiagnosticReport
 */
function convertResultOrganizerToDiagnosticReport(
  organizer: CCDAResultOrganizer,
  patientRef: Reference,
  options: CCDAToFHIRMappingOptions
): DiagnosticReport {
  const report: DiagnosticReport = {
    resourceType: 'DiagnosticReport',
    id: options.generateIds ? generateUUID() : undefined,
    status: mapResultStatusToFHIR(organizer.statusCode?.code),
    code: organizer.code ? convertCDToCodeableConcept(organizer.code) : { text: 'Laboratory Results' },
    subject: patientRef,
  };

  // Convert identifiers
  if (organizer.id) {
    report.identifier = organizer.id.map(ii => convertIIToIdentifier(ii));
  }

  // Convert effective time
  if (organizer.effectiveTime) {
    if ('low' in organizer.effectiveTime || 'high' in organizer.effectiveTime) {
      report.effectivePeriod = convertIVL_TSToPeriod(organizer.effectiveTime);
    }
  }

  // Set category
  report.category = [{
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/v2-0074',
      code: 'LAB',
      display: 'Laboratory',
    }],
  }];

  return report;
}

/**
 * Convert Result Observation to FHIR Observation
 */
function convertResultObservationToObservation(
  obs: CCDAResultObservation,
  patientRef: Reference,
  options: CCDAToFHIRMappingOptions
): Observation {
  const observation: Observation = {
    resourceType: 'Observation',
    id: options.generateIds ? generateUUID() : undefined,
    status: mapObservationStatusToFHIR(obs.statusCode?.code),
    code: obs.code ? convertCDToCodeableConcept(obs.code) : { text: 'Unknown' },
    subject: patientRef,
  };

  // Convert identifiers
  if (obs.id) {
    observation.identifier = obs.id.map(ii => convertIIToIdentifier(ii));
  }

  // Convert effective time
  if (obs.effectiveTime) {
    if ('value' in obs.effectiveTime) {
      observation.effectiveDateTime = convertTSToDateTime(obs.effectiveTime);
    }
  }

  // Convert value
  if (obs.value) {
    if ('value' in obs.value && 'unit' in obs.value) {
      // PQ value
      observation.valueQuantity = convertPQToQuantity(obs.value as PQ);
    } else if ('code' in obs.value) {
      // CD value
      observation.valueCodeableConcept = convertCDToCodeableConcept(obs.value as CD);
    }
  }

  // Convert interpretation
  if (obs.interpretationCode && obs.interpretationCode.length > 0) {
    observation.interpretation = obs.interpretationCode.map(ic => convertCEToCodeableConcept(ic));
  }

  // Set category
  observation.category = [{
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/observation-category',
      code: 'laboratory',
      display: 'Laboratory',
    }],
  }];

  return observation;
}

/**
 * Convert Vital Signs Section to FHIR Observations
 */
export function convertVitalSignsSectionToObservations(
  section: CCDAVitalSignsSection,
  patientRef: Reference,
  entries: BundleEntry[],
  options: CCDAToFHIRMappingOptions
): Observation[] {
  const observations: Observation[] = [];

  if (!section.entries) return observations;

  for (const organizer of section.entries) {
    if (!organizer.vitalSignObservations) continue;

    for (const obs of organizer.vitalSignObservations) {
      const observation = convertVitalSignObservationToObservation(obs, organizer, patientRef, options);
      observations.push(observation);

      const fullUrl = options.baseUrl + (observation.id || generateUUID());
      entries.push({
        fullUrl,
        resource: observation,
      });
    }
  }

  return observations;
}

/**
 * Convert Vital Sign Observation to FHIR Observation
 */
function convertVitalSignObservationToObservation(
  obs: CCDAVitalSignObservation,
  organizer: CCDAVitalSignsOrganizer,
  patientRef: Reference,
  options: CCDAToFHIRMappingOptions
): Observation {
  const observation: Observation = {
    resourceType: 'Observation',
    id: options.generateIds ? generateUUID() : undefined,
    status: mapObservationStatusToFHIR(obs.statusCode?.code),
    code: obs.code ? convertCDToCodeableConcept(obs.code) : { text: 'Vital Sign' },
    subject: patientRef,
  };

  // Convert identifiers
  if (obs.id) {
    observation.identifier = obs.id.map(ii => convertIIToIdentifier(ii));
  }

  // Convert effective time
  if (obs.effectiveTime?.value) {
    observation.effectiveDateTime = convertTSToDateTime(obs.effectiveTime);
  } else if (organizer.effectiveTime) {
    if ('value' in organizer.effectiveTime) {
      observation.effectiveDateTime = convertTSToDateTime(organizer.effectiveTime as TS);
    }
  }

  // Convert value
  if (obs.value) {
    observation.valueQuantity = convertPQToQuantity(obs.value);
  }

  // Convert interpretation
  if (obs.interpretationCode && obs.interpretationCode.length > 0) {
    observation.interpretation = obs.interpretationCode.map(ic => convertCEToCodeableConcept(ic));
  }

  // Set category for vital signs
  observation.category = [{
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/observation-category',
      code: 'vital-signs',
      display: 'Vital Signs',
    }],
  }];

  return observation;
}

/**
 * Convert Immunizations Section to FHIR Immunization resources
 */
export function convertImmunizationsSectionToImmunizations(
  section: CCDAImmunizationsSection,
  patientRef: Reference,
  entries: BundleEntry[],
  options: CCDAToFHIRMappingOptions
): Immunization[] {
  const immunizations: Immunization[] = [];

  if (!section.entries) return immunizations;

  for (const activity of section.entries) {
    const immunization = convertImmunizationActivityToImmunization(activity, patientRef, options);
    immunizations.push(immunization);

    const fullUrl = options.baseUrl + (immunization.id || generateUUID());
    entries.push({
      fullUrl,
      resource: immunization,
    });
  }

  return immunizations;
}

/**
 * Convert Immunization Activity to FHIR Immunization
 */
function convertImmunizationActivityToImmunization(
  activity: CCDAImmunizationActivity,
  patientRef: Reference,
  options: CCDAToFHIRMappingOptions
): Immunization {
  const immunization: Immunization = {
    resourceType: 'Immunization',
    id: options.generateIds ? generateUUID() : undefined,
    status: activity.negationInd ? 'not-done' : mapImmunizationStatusToFHIR(activity.statusCode?.code),
    vaccineCode: activity.consumable?.manufacturedProduct?.manufacturedMaterial?.code
      ? convertCEToCodeableConcept(activity.consumable.manufacturedProduct.manufacturedMaterial.code)
      : { text: 'Unknown Vaccine' },
    patient: patientRef,
    primarySource: true,
  };

  // Convert identifiers
  if (activity.id) {
    immunization.identifier = activity.id.map(ii => convertIIToIdentifier(ii));
  }

  // Convert occurrence time
  if (activity.effectiveTime) {
    if ('value' in activity.effectiveTime) {
      immunization.occurrenceDateTime = convertTSToDateTime(activity.effectiveTime as TS);
    }
  }

  // Convert route
  if (activity.routeCode) {
    immunization.route = convertCEToCodeableConcept(activity.routeCode);
  }

  // Convert dose quantity
  if (activity.doseQuantity) {
    immunization.doseQuantity = convertPQToQuantity(activity.doseQuantity);
  }

  // Convert lot number
  if (activity.consumable?.manufacturedProduct?.manufacturedMaterial?.lotNumberText) {
    immunization.lotNumber = activity.consumable.manufacturedProduct.manufacturedMaterial.lotNumberText;
  }

  return immunization;
}

// =============================================================================
// FHIR to C-CDA Conversion
// =============================================================================

/**
 * Convert a FHIR Bundle to a C-CDA document structure
 */
export function fhirBundleToCCDA(
  bundle: Bundle,
  documentType: string = 'CCD'
): CCDADocument {
  const document: CCDADocument = {
    id: { root: '2.16.840.1.113883.3.0000', extension: bundle.id || generateUUID() },
    code: { code: '34133-9', codeSystem: LOINC_OID, displayName: 'Summarization of Episode Note' },
    title: 'Clinical Document',
    effectiveTime: { value: new Date().toISOString().replace(/[-:]/g, '').split('.')[0] },
    confidentialityCode: { code: 'N', codeSystem: '2.16.840.1.113883.5.25' },
    recordTarget: [],
    author: [],
    custodian: {
      assignedCustodian: {
        representedCustodianOrganization: {
          id: [{ root: '2.16.840.1.113883.3.0000' }],
          name: [{ name: 'Healthcare Organization' }],
        },
      },
    },
    component: {
      structuredBody: {
        components: [],
      },
    },
  };

  if (!bundle.entry) return document;

  // Group resources by type
  const patients: Patient[] = [];
  const conditions: Condition[] = [];
  const medications: (MedicationRequest | MedicationStatement)[] = [];
  const allergies: AllergyIntolerance[] = [];
  const procedures: Procedure[] = [];
  const observations: Observation[] = [];
  const immunizations: Immunization[] = [];

  for (const entry of bundle.entry) {
    if (!entry.resource) continue;

    switch (entry.resource.resourceType) {
      case 'Patient':
        patients.push(entry.resource);
        break;
      case 'Condition':
        conditions.push(entry.resource);
        break;
      case 'MedicationRequest':
      case 'MedicationStatement':
        medications.push(entry.resource);
        break;
      case 'AllergyIntolerance':
        allergies.push(entry.resource);
        break;
      case 'Procedure':
        procedures.push(entry.resource);
        break;
      case 'Observation':
        observations.push(entry.resource);
        break;
      case 'Immunization':
        immunizations.push(entry.resource);
        break;
    }
  }

  // Convert patient
  if (patients.length > 0) {
    document.recordTarget = patients.map(p => convertPatientToRecordTarget(p));
  }

  // Create sections
  const components: CCDAComponent[] = [];

  if (conditions.length > 0) {
    components.push({
      section: convertConditionsToProblemsSection(conditions),
    });
  }

  if (medications.length > 0) {
    components.push({
      section: convertMedicationsToMedicationsSection(medications),
    });
  }

  if (allergies.length > 0) {
    components.push({
      section: convertAllergiesToAllergiesSection(allergies),
    });
  }

  if (procedures.length > 0) {
    components.push({
      section: convertProceduresToProceduresSection(procedures),
    });
  }

  // Split observations by category
  const vitalSigns = observations.filter(o =>
    o.category?.some(c => c.coding?.some(coding => coding.code === 'vital-signs'))
  );
  const labResults = observations.filter(o =>
    o.category?.some(c => c.coding?.some(coding => coding.code === 'laboratory'))
  );

  if (vitalSigns.length > 0) {
    components.push({
      section: convertObservationsToVitalSignsSection(vitalSigns),
    });
  }

  if (labResults.length > 0) {
    components.push({
      section: convertObservationsToResultsSection(labResults),
    });
  }

  if (immunizations.length > 0) {
    components.push({
      section: convertImmunizationsToImmunizationsSection(immunizations),
    });
  }

  if (document.component?.structuredBody) {
    document.component.structuredBody.components = components;
  }

  return document;
}

// =============================================================================
// FHIR to C-CDA Helper Functions
// =============================================================================

/**
 * Convert Patient to RecordTarget
 */
function convertPatientToRecordTarget(patient: Patient): any {
  return {
    patientRole: {
      id: patient.identifier?.map(id => ({
        root: id.system || '2.16.840.1.113883.3.0000',
        extension: id.value,
      })),
      addr: patient.address?.map(addr => ({
        streetAddressLine: addr.line,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
      })),
      telecom: patient.telecom?.map(tel => ({
        value: tel.value,
        use: mapContactPointUseToTELUse(tel.use),
      })),
      patient: {
        name: patient.name?.map(name => ({
          given: name.given,
          family: name.family,
          prefix: name.prefix,
          suffix: name.suffix,
        })),
        administrativeGenderCode: patient.gender ? {
          code: mapFHIRGenderToHL7(patient.gender),
          codeSystem: '2.16.840.1.113883.5.1',
        } : undefined,
        birthTime: patient.birthDate ? {
          value: patient.birthDate.replace(/-/g, ''),
        } : undefined,
      },
    },
  };
}

/**
 * Convert Conditions to Problems Section
 */
function convertConditionsToProblemsSection(conditions: Condition[]): CCDAProblemsSection {
  return {
    templateId: [{ root: SectionTemplateIds.PROBLEMS_ENTRIES_REQUIRED }],
    code: { code: '11450-4', codeSystem: LOINC_OID, displayName: 'Problem List' },
    title: 'Problems',
    entries: conditions.map(condition => ({
      templateId: [{ root: '2.16.840.1.113883.10.20.22.4.3' }],
      id: condition.identifier?.map(id => ({ root: id.system || '', extension: id.value })),
      code: { code: 'CONC', codeSystem: '2.16.840.1.113883.5.6' },
      statusCode: { code: condition.clinicalStatus?.coding?.[0]?.code === 'active' ? 'active' : 'completed' },
      effectiveTime: {
        low: condition.onsetDateTime ? { value: condition.onsetDateTime.replace(/[-:T]/g, '').split('.')[0] } : undefined,
        high: condition.abatementDateTime ? { value: condition.abatementDateTime.replace(/[-:T]/g, '').split('.')[0] } : undefined,
      },
      problemObservations: [{
        templateId: [{ root: '2.16.840.1.113883.10.20.22.4.4' }],
        code: { code: 'ASSERTION', codeSystem: '2.16.840.1.113883.5.4' },
        statusCode: { code: 'completed' },
        value: condition.code ? {
          code: condition.code.coding?.[0]?.code,
          codeSystem: mapFHIRSystemToOID(condition.code.coding?.[0]?.system),
          displayName: condition.code.coding?.[0]?.display || condition.code.text,
        } : undefined,
      }],
    })),
  };
}

/**
 * Convert Medications to Medications Section
 */
function convertMedicationsToMedicationsSection(medications: (MedicationRequest | MedicationStatement)[]): CCDAMedicationsSection {
  return {
    templateId: [{ root: SectionTemplateIds.MEDICATIONS_ENTRIES_REQUIRED }],
    code: { code: '10160-0', codeSystem: LOINC_OID, displayName: 'History of Medication Use' },
    title: 'Medications',
    entries: medications.map(med => {
      const medCode = 'medicationCodeableConcept' in med ? med.medicationCodeableConcept : undefined;
      return {
        templateId: [{ root: '2.16.840.1.113883.10.20.22.4.16' }],
        id: med.identifier?.map(id => ({ root: id.system || '', extension: id.value })),
        statusCode: { code: med.status === 'active' ? 'active' : 'completed' },
        consumable: {
          manufacturedProduct: {
            templateId: [{ root: '2.16.840.1.113883.10.20.22.4.23' }],
            manufacturedMaterial: {
              code: medCode ? {
                code: medCode.coding?.[0]?.code,
                codeSystem: mapFHIRSystemToOID(medCode.coding?.[0]?.system),
                displayName: medCode.coding?.[0]?.display || medCode.text,
              } : undefined,
            },
          },
        },
      };
    }),
  };
}

/**
 * Convert Allergies to Allergies Section
 */
function convertAllergiesToAllergiesSection(allergies: AllergyIntolerance[]): CCDAAllergiesSection {
  return {
    templateId: [{ root: SectionTemplateIds.ALLERGIES_ENTRIES_REQUIRED }],
    code: { code: '48765-2', codeSystem: LOINC_OID, displayName: 'Allergies and Adverse Reactions' },
    title: 'Allergies',
    entries: allergies.map(allergy => ({
      templateId: [{ root: '2.16.840.1.113883.10.20.22.4.30' }],
      id: allergy.identifier?.map(id => ({ root: id.system || '', extension: id.value })),
      code: { code: 'CONC', codeSystem: '2.16.840.1.113883.5.6' },
      statusCode: { code: allergy.clinicalStatus?.coding?.[0]?.code === 'active' ? 'active' : 'completed' },
      allergyObservations: [{
        templateId: [{ root: '2.16.840.1.113883.10.20.22.4.7' }],
        code: { code: 'ASSERTION', codeSystem: '2.16.840.1.113883.5.4' },
        statusCode: { code: 'completed' },
        value: allergy.code ? {
          code: allergy.code.coding?.[0]?.code,
          codeSystem: mapFHIRSystemToOID(allergy.code.coding?.[0]?.system),
          displayName: allergy.code.coding?.[0]?.display || allergy.code.text,
        } : undefined,
        reactionObservations: allergy.reaction?.map(r => ({
          templateId: [{ root: '2.16.840.1.113883.10.20.22.4.9' }],
          code: { code: 'ASSERTION', codeSystem: '2.16.840.1.113883.5.4' },
          statusCode: { code: 'completed' },
          value: r.manifestation?.[0] ? {
            code: r.manifestation[0].coding?.[0]?.code,
            codeSystem: mapFHIRSystemToOID(r.manifestation[0].coding?.[0]?.system),
            displayName: r.manifestation[0].coding?.[0]?.display || r.manifestation[0].text,
          } : undefined,
        })),
      }],
    })),
  };
}

/**
 * Convert Procedures to Procedures Section
 */
function convertProceduresToProceduresSection(procedures: Procedure[]): CCDAProceduresSection {
  return {
    templateId: [{ root: SectionTemplateIds.PROCEDURES_ENTRIES_REQUIRED }],
    code: { code: '47519-4', codeSystem: LOINC_OID, displayName: 'History of Procedures' },
    title: 'Procedures',
    entries: procedures.map(proc => ({
      templateId: [{ root: '2.16.840.1.113883.10.20.22.4.14' }],
      id: proc.identifier?.map(id => ({ root: id.system || '', extension: id.value })),
      code: proc.code ? {
        code: proc.code.coding?.[0]?.code,
        codeSystem: mapFHIRSystemToOID(proc.code.coding?.[0]?.system),
        displayName: proc.code.coding?.[0]?.display || proc.code.text,
      } : undefined,
      statusCode: { code: proc.status === 'completed' ? 'completed' : 'active' },
      effectiveTime: proc.performedDateTime ? {
        low: { value: proc.performedDateTime.replace(/[-:T]/g, '').split('.')[0] },
      } : undefined,
    })),
  };
}

/**
 * Convert Observations to Vital Signs Section
 */
function convertObservationsToVitalSignsSection(observations: Observation[]): CCDAVitalSignsSection {
  // Group observations by effective time
  const groupedByTime: Map<string, Observation[]> = new Map();

  for (const obs of observations) {
    const time = obs.effectiveDateTime || 'unknown';
    if (!groupedByTime.has(time)) {
      groupedByTime.set(time, []);
    }
    groupedByTime.get(time)!.push(obs);
  }

  return {
    templateId: [{ root: SectionTemplateIds.VITAL_SIGNS_ENTRIES_REQUIRED }],
    code: { code: '8716-3', codeSystem: LOINC_OID, displayName: 'Vital Signs' },
    title: 'Vital Signs',
    entries: Array.from(groupedByTime.entries()).map(([time, obs]) => ({
      templateId: [{ root: '2.16.840.1.113883.10.20.22.4.26' }],
      code: { code: '46680005', codeSystem: SNOMED_CT_OID, displayName: 'Vital Signs' },
      statusCode: { code: 'completed' },
      effectiveTime: time !== 'unknown' ? { value: time.replace(/[-:T]/g, '').split('.')[0] } : undefined,
      vitalSignObservations: obs.map(o => ({
        templateId: [{ root: '2.16.840.1.113883.10.20.22.4.27' }],
        code: o.code ? {
          code: o.code.coding?.[0]?.code,
          codeSystem: mapFHIRSystemToOID(o.code.coding?.[0]?.system),
          displayName: o.code.coding?.[0]?.display || o.code.text,
        } : undefined,
        statusCode: { code: 'completed' },
        effectiveTime: o.effectiveDateTime ? { value: o.effectiveDateTime.replace(/[-:T]/g, '').split('.')[0] } : undefined,
        value: o.valueQuantity ? {
          value: o.valueQuantity.value,
          unit: o.valueQuantity.unit,
        } : undefined,
      })),
    })),
  };
}

/**
 * Convert Observations to Results Section
 */
function convertObservationsToResultsSection(observations: Observation[]): CCDAResultsSection {
  return {
    templateId: [{ root: SectionTemplateIds.RESULTS_ENTRIES_REQUIRED }],
    code: { code: '30954-2', codeSystem: LOINC_OID, displayName: 'Results' },
    title: 'Results',
    entries: [{
      templateId: [{ root: '2.16.840.1.113883.10.20.22.4.1' }],
      code: { code: '26436-6', codeSystem: LOINC_OID, displayName: 'Laboratory Studies' },
      statusCode: { code: 'completed' },
      resultObservations: observations.map(obs => ({
        templateId: [{ root: '2.16.840.1.113883.10.20.22.4.2' }],
        id: obs.identifier?.map(id => ({ root: id.system || '', extension: id.value })),
        code: obs.code ? {
          code: obs.code.coding?.[0]?.code,
          codeSystem: mapFHIRSystemToOID(obs.code.coding?.[0]?.system),
          displayName: obs.code.coding?.[0]?.display || obs.code.text,
        } : undefined,
        statusCode: { code: 'completed' },
        effectiveTime: obs.effectiveDateTime ? { value: obs.effectiveDateTime.replace(/[-:T]/g, '').split('.')[0] } : undefined,
        value: obs.valueQuantity ? {
          value: obs.valueQuantity.value,
          unit: obs.valueQuantity.unit,
        } : undefined,
      })),
    }],
  };
}

/**
 * Convert Immunizations to Immunizations Section
 */
function convertImmunizationsToImmunizationsSection(immunizations: Immunization[]): CCDAImmunizationsSection {
  return {
    templateId: [{ root: SectionTemplateIds.IMMUNIZATIONS_ENTRIES_REQUIRED }],
    code: { code: '11369-6', codeSystem: LOINC_OID, displayName: 'History of Immunization' },
    title: 'Immunizations',
    entries: immunizations.map(imm => ({
      templateId: [{ root: '2.16.840.1.113883.10.20.22.4.52' }],
      id: imm.identifier?.map(id => ({ root: id.system || '', extension: id.value })),
      statusCode: { code: imm.status === 'completed' ? 'completed' : 'active' },
      effectiveTime: imm.occurrenceDateTime ? { value: imm.occurrenceDateTime.replace(/[-:T]/g, '').split('.')[0] } : undefined,
      routeCode: imm.route ? {
        code: imm.route.coding?.[0]?.code,
        codeSystem: mapFHIRSystemToOID(imm.route.coding?.[0]?.system),
        displayName: imm.route.coding?.[0]?.display,
      } : undefined,
      doseQuantity: imm.doseQuantity ? {
        value: imm.doseQuantity.value,
        unit: imm.doseQuantity.unit,
      } : undefined,
      consumable: {
        manufacturedProduct: {
          templateId: [{ root: '2.16.840.1.113883.10.20.22.4.54' }],
          manufacturedMaterial: {
            code: imm.vaccineCode ? {
              code: imm.vaccineCode.coding?.[0]?.code,
              codeSystem: mapFHIRSystemToOID(imm.vaccineCode.coding?.[0]?.system),
              displayName: imm.vaccineCode.coding?.[0]?.display || imm.vaccineCode.text,
            } : undefined,
            lotNumberText: imm.lotNumber,
          },
        },
      },
      negationInd: imm.status === 'not-done',
    })),
  };
}

// =============================================================================
// Data Type Conversion Helpers
// =============================================================================

/**
 * Convert II to FHIR Identifier
 */
function convertIIToIdentifier(ii: II): Identifier {
  return {
    system: `urn:oid:${ii.root}`,
    value: ii.extension || ii.root,
  };
}

/**
 * Convert CE/CD to FHIR CodeableConcept
 */
function convertCEToCodeableConcept(ce: CE): CodeableConcept {
  const coding: Coding = {};

  if (ce.codeSystem) {
    coding.system = mapOIDToFHIRSystem(ce.codeSystem);
  }
  if (ce.code) {
    coding.code = ce.code;
  }
  if (ce.displayName) {
    coding.display = ce.displayName;
  }

  return {
    coding: ce.code ? [coding] : undefined,
    text: ce.displayName || ce.originalText,
  };
}

/**
 * Convert CD to FHIR CodeableConcept
 */
function convertCDToCodeableConcept(cd: CD): CodeableConcept {
  return convertCEToCodeableConcept(cd);
}

/**
 * Convert TS to FHIR date string
 */
function convertTSToDate(ts: TS): string | undefined {
  if (!ts.value) return undefined;

  // HL7 format: YYYYMMDD or YYYYMMDDHHMMSS
  const value = ts.value;
  if (value.length >= 8) {
    return `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`;
  }
  return undefined;
}

/**
 * Convert TS to FHIR dateTime string
 */
function convertTSToDateTime(ts: TS): string | undefined {
  if (!ts.value) return undefined;

  const value = ts.value;
  if (value.length >= 14) {
    return `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}T${value.substring(8, 10)}:${value.substring(10, 12)}:${value.substring(12, 14)}`;
  } else if (value.length >= 8) {
    return `${value.substring(0, 4)}-${value.substring(4, 6)}-${value.substring(6, 8)}`;
  }
  return undefined;
}

/**
 * Convert IVL_TS to FHIR Period
 */
function convertIVL_TSToPeriod(ivl: IVL_TS): Period {
  return {
    start: ivl.low ? convertTSToDateTime(ivl.low) : undefined,
    end: ivl.high ? convertTSToDateTime(ivl.high) : undefined,
  };
}

/**
 * Convert PQ to FHIR Quantity
 */
function convertPQToQuantity(pq: PQ): Quantity {
  return {
    value: pq.value,
    unit: pq.unit,
    system: 'http://unitsofmeasure.org',
    code: pq.unit,
  };
}

/**
 * Convert PN to FHIR HumanName
 */
function convertPNToHumanName(pn: PN): HumanName {
  return {
    use: pn.use?.[0] === 'L' ? 'official' : undefined,
    family: pn.family,
    given: pn.given,
    prefix: pn.prefix,
    suffix: pn.suffix,
  };
}

/**
 * Convert AD to FHIR Address
 */
function convertADToAddress(ad: AD): Address {
  return {
    use: mapAddressUseToFHIR(ad.use?.[0]),
    line: ad.streetAddressLine,
    city: ad.city,
    state: ad.state,
    postalCode: ad.postalCode,
    country: ad.country,
  };
}

/**
 * Convert TEL to FHIR ContactPoint
 */
function convertTELToContactPoint(tel: TEL): ContactPoint {
  const value = tel.value || '';
  let system: ContactPoint['system'] = 'other';

  if (value.startsWith('tel:')) {
    system = 'phone';
  } else if (value.startsWith('mailto:')) {
    system = 'email';
  } else if (value.startsWith('fax:')) {
    system = 'fax';
  }

  return {
    system,
    value: value.replace(/^(tel:|mailto:|fax:)/, ''),
    use: mapTelecomUseToFHIR(tel.use?.[0]),
  };
}

// =============================================================================
// Code Mapping Helpers
// =============================================================================

/**
 * Map HL7 OID to FHIR system URI
 */
function mapOIDToFHIRSystem(oid: string): string {
  const mapping: Record<string, string> = {
    [LOINC_OID]: 'http://loinc.org',
    [SNOMED_CT_OID]: 'http://snomed.info/sct',
    [RXNORM_OID]: 'http://www.nlm.nih.gov/research/umls/rxnorm',
    [ICD10_CM_OID]: 'http://hl7.org/fhir/sid/icd-10-cm',
    [CVX_OID]: 'http://hl7.org/fhir/sid/cvx',
    [CPT_OID]: 'http://www.ama-assn.org/go/cpt',
  };
  return mapping[oid] || `urn:oid:${oid}`;
}

/**
 * Map FHIR system URI to HL7 OID
 */
function mapFHIRSystemToOID(system: string | undefined): string {
  if (!system) return '';

  const mapping: Record<string, string> = {
    'http://loinc.org': LOINC_OID,
    'http://snomed.info/sct': SNOMED_CT_OID,
    'http://www.nlm.nih.gov/research/umls/rxnorm': RXNORM_OID,
    'http://hl7.org/fhir/sid/icd-10-cm': ICD10_CM_OID,
    'http://hl7.org/fhir/sid/cvx': CVX_OID,
    'http://www.ama-assn.org/go/cpt': CPT_OID,
  };

  if (system.startsWith('urn:oid:')) {
    return system.replace('urn:oid:', '');
  }

  return mapping[system] || '';
}

/**
 * Map gender code
 */
function mapGenderCode(code: string | undefined): Patient['gender'] {
  switch (code) {
    case 'M':
      return 'male';
    case 'F':
      return 'female';
    case 'UN':
      return 'other';
    default:
      return 'unknown';
  }
}

/**
 * Map FHIR gender to HL7
 */
function mapFHIRGenderToHL7(gender: Patient['gender']): string {
  switch (gender) {
    case 'male':
      return 'M';
    case 'female':
      return 'F';
    case 'other':
      return 'UN';
    default:
      return 'UNK';
  }
}

/**
 * Map problem status to clinical status
 */
function mapProblemStatusToClinicalStatus(statusCode: string): CodeableConcept {
  const code = statusCode === 'active' ? 'active' : 'resolved';
  return {
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
      code,
    }],
  };
}

/**
 * Map allergy status to clinical status
 */
function mapAllergyStatusToClinicalStatus(statusCode: string): CodeableConcept {
  const code = statusCode === 'active' ? 'active' : 'resolved';
  return {
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical',
      code,
    }],
  };
}

/**
 * Map medication status to FHIR
 */
function mapMedicationStatusToFHIR(statusCode: string | undefined): MedicationStatement['status'] {
  switch (statusCode) {
    case 'active':
      return 'active';
    case 'completed':
      return 'completed';
    case 'suspended':
    case 'held':
      return 'on-hold';
    case 'aborted':
    case 'cancelled':
      return 'stopped';
    default:
      return 'unknown';
  }
}

/**
 * Map procedure status to FHIR
 */
function mapProcedureStatusToFHIR(statusCode: string | undefined): Procedure['status'] {
  switch (statusCode) {
    case 'completed':
      return 'completed';
    case 'active':
      return 'in-progress';
    case 'aborted':
    case 'cancelled':
      return 'stopped';
    default:
      return 'unknown';
  }
}

/**
 * Map result status to FHIR
 */
function mapResultStatusToFHIR(statusCode: string | undefined): DiagnosticReport['status'] {
  switch (statusCode) {
    case 'completed':
      return 'final';
    case 'active':
      return 'preliminary';
    case 'aborted':
    case 'cancelled':
      return 'cancelled';
    default:
      return 'unknown';
  }
}

/**
 * Map observation status to FHIR
 */
function mapObservationStatusToFHIR(statusCode: string | undefined): Observation['status'] {
  switch (statusCode) {
    case 'completed':
      return 'final';
    case 'active':
      return 'preliminary';
    case 'aborted':
    case 'cancelled':
      return 'cancelled';
    default:
      return 'unknown';
  }
}

/**
 * Map immunization status to FHIR
 */
function mapImmunizationStatusToFHIR(statusCode: string | undefined): Immunization['status'] {
  switch (statusCode) {
    case 'completed':
      return 'completed';
    case 'aborted':
    case 'cancelled':
      return 'not-done';
    default:
      return 'completed';
  }
}

/**
 * Map allergy type code
 */
function mapAllergyTypeCode(code: string | undefined): AllergyIntolerance['type'] {
  // SNOMED codes for allergy types
  const allergyTypes: Record<string, AllergyIntolerance['type']> = {
    '419511003': 'allergy', // Propensity to adverse reactions to drug
    '418038007': 'allergy', // Propensity to adverse reactions to substance
    '59037007': 'intolerance', // Drug intolerance
    '235719002': 'intolerance', // Food intolerance
  };
  return allergyTypes[code || ''] || 'allergy';
}

/**
 * Map severity code
 */
function mapSeverityCode(code: string | undefined): AllergyIntoleranceReaction['severity'] {
  switch (code) {
    case '255604002': // Mild
      return 'mild';
    case '6736007': // Moderate
      return 'moderate';
    case '24484000': // Severe
    case '442452003': // Life threatening
      return 'severe';
    default:
      return 'moderate';
  }
}

/**
 * Map criticality code
 */
function mapCriticalityCode(code: string | undefined): AllergyIntolerance['criticality'] {
  switch (code) {
    case 'CRITH':
      return 'high';
    case 'CRITL':
      return 'low';
    default:
      return 'unable-to-assess';
  }
}

/**
 * Map address use
 */
function mapAddressUseToFHIR(use: string | undefined): Address['use'] {
  switch (use) {
    case 'H':
    case 'HP':
      return 'home';
    case 'WP':
      return 'work';
    case 'TMP':
      return 'temp';
    case 'BAD':
    case 'OLD':
      return 'old';
    default:
      return undefined;
  }
}

/**
 * Map telecom use
 */
function mapTelecomUseToFHIR(use: string | undefined): ContactPoint['use'] {
  switch (use) {
    case 'H':
    case 'HP':
      return 'home';
    case 'WP':
      return 'work';
    case 'TMP':
      return 'temp';
    case 'MC':
      return 'mobile';
    case 'BAD':
    case 'OLD':
      return 'old';
    default:
      return undefined;
  }
}

/**
 * Map ContactPoint use to TEL use
 */
function mapContactPointUseToTELUse(use: ContactPoint['use']): string[] {
  switch (use) {
    case 'home':
      return ['H'];
    case 'work':
      return ['WP'];
    case 'temp':
      return ['TMP'];
    case 'mobile':
      return ['MC'];
    case 'old':
      return ['OLD'];
    default:
      return [];
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Generate a UUID
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
