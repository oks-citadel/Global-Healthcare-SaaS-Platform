/**
 * C-CDA Parser
 * Parses C-CDA XML documents into TypeScript data structures
 * Compliant with HL7 C-CDA 2.1 Specification
 */

import {
  CCDADocument,
  CCDASection,
  CCDADocumentHeader,
  CCDARecordTarget,
  CCDAAuthor,
  CCDACustodian,
  CCDAPatient,
  CCDAPatientRole,
  CCDAPerson,
  CCDAOrganization,
  II,
  CE,
  CD,
  TS,
  IVL_TS,
  AD,
  TEL,
  PN,
  PQ,
  CS,
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
  CCDAEncounterActivity,
  CCDASocialHistoryObservation,
  CCDAFamilyHistoryOrganizer,
  CCDAConsumable,
  CCDAManufacturedProduct,
  CCDAManufacturedMaterial,
  CCDAReactionObservation,
  CCDASeverityObservation,
  CCDADocumentTypeCode,
  CCDAAssignedAuthor,
  CCDAAssignedEntity,
  CCDAPerformer,
  CCDAInformant,
  CCDADocumentationOf,
  CCDAServiceEvent,
  CCDAComponent,
  CCDAStructuredBody,
  ContinuityOfCareDocument,
  DischargeSummary,
  ReferralNote,
  ProgressNote,
  CCDANarrativeBlock,
} from './types';

import {
  DocumentTemplateIds,
  SectionTemplateIds,
  EntryTemplateIds,
  LOINC_OID,
  SNOMED_CT_OID,
  RXNORM_OID,
  getDocumentTypeFromTemplateId,
} from './templates';

/**
 * XML Node interface for parsed XML
 */
interface XMLNode {
  nodeName: string;
  nodeType: number;
  textContent: string | null;
  attributes: NamedNodeMap | null;
  childNodes: NodeListOf<ChildNode>;
  children: HTMLCollection;
  getElementsByTagName(name: string): HTMLCollectionOf<Element>;
  getAttribute(name: string): string | null;
  querySelector(selector: string): Element | null;
  querySelectorAll(selector: string): NodeListOf<Element>;
}

/**
 * Parser result containing the parsed document and any warnings/errors
 */
export interface CCDAParserResult {
  document: CCDADocument | null;
  documentType: CCDADocumentTypeCode | null;
  warnings: string[];
  errors: string[];
  isValid: boolean;
}

/**
 * Parser options
 */
export interface CCDAParserOptions {
  /** Validate template IDs against known C-CDA templates */
  validateTemplates?: boolean;
  /** Parse narrative text blocks */
  parseNarrative?: boolean;
  /** Strict mode - fail on any validation error */
  strictMode?: boolean;
  /** Custom namespace prefix for CDA elements */
  namespacePrefix?: string;
}

/**
 * Default parser options
 */
const DEFAULT_OPTIONS: CCDAParserOptions = {
  validateTemplates: true,
  parseNarrative: true,
  strictMode: false,
  namespacePrefix: '',
};

/**
 * C-CDA Document Parser
 */
export class CCDAParser {
  private options: CCDAParserOptions;
  private warnings: string[] = [];
  private errors: string[] = [];
  private xmlDoc: Document | null = null;

  constructor(options: CCDAParserOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Parse a C-CDA XML string into a structured document
   */
  parse(xmlString: string): CCDAParserResult {
    this.warnings = [];
    this.errors = [];
    this.xmlDoc = null;

    try {
      // Parse the XML string
      const parser = new DOMParser();
      this.xmlDoc = parser.parseFromString(xmlString, 'application/xml');

      // Check for parse errors
      const parseError = this.xmlDoc.querySelector('parsererror');
      if (parseError) {
        this.errors.push(`XML Parse Error: ${parseError.textContent}`);
        return this.createResult(null, null);
      }

      // Get the root element
      const root = this.xmlDoc.documentElement;
      if (!root || root.nodeName !== 'ClinicalDocument') {
        this.errors.push('Invalid C-CDA document: Root element must be ClinicalDocument');
        return this.createResult(null, null);
      }

      // Parse the document
      const document = this.parseDocument(root);
      const documentType = this.determineDocumentType(root);

      return this.createResult(document, documentType);
    } catch (error) {
      this.errors.push(`Parse error: ${error instanceof Error ? error.message : String(error)}`);
      return this.createResult(null, null);
    }
  }

  /**
   * Parse document header and body
   */
  private parseDocument(root: Element): CCDADocument {
    const header = this.parseHeader(root);
    const body = this.parseBody(root);

    return {
      ...header,
      component: body,
    };
  }

  /**
   * Parse document header elements
   */
  private parseHeader(root: Element): CCDADocumentHeader {
    return {
      realmCode: this.parseCS(this.getElement(root, 'realmCode')),
      typeId: this.parseII(this.getElement(root, 'typeId')),
      templateId: this.parseIIArray(root, 'templateId'),
      id: this.parseII(this.getElement(root, 'id')) || { root: '' },
      code: this.parseCE(this.getElement(root, 'code')) || { code: '', codeSystem: '' },
      title: this.getElementText(root, 'title') || '',
      effectiveTime: this.parseTS(this.getElement(root, 'effectiveTime')) || { value: '' },
      confidentialityCode: this.parseCE(this.getElement(root, 'confidentialityCode')) || { code: '' },
      languageCode: this.parseCS(this.getElement(root, 'languageCode')),
      setId: this.parseII(this.getElement(root, 'setId')),
      versionNumber: this.parseInteger(this.getElement(root, 'versionNumber')),
      recordTarget: this.parseRecordTargets(root),
      author: this.parseAuthors(root),
      custodian: this.parseCustodian(root),
      informant: this.parseInformants(root),
      documentationOf: this.parseDocumentationOf(root),
    };
  }

  /**
   * Parse document body
   */
  private parseBody(root: Element): { structuredBody?: CCDAStructuredBody } {
    const componentEl = this.getElement(root, 'component');
    if (!componentEl) {
      return {};
    }

    const structuredBody = this.getElement(componentEl, 'structuredBody');
    if (structuredBody) {
      return {
        structuredBody: this.parseStructuredBody(structuredBody),
      };
    }

    return {};
  }

  /**
   * Parse structured body with sections
   */
  private parseStructuredBody(bodyEl: Element): CCDAStructuredBody {
    const components: CCDAComponent[] = [];
    const componentEls = this.getElements(bodyEl, 'component');

    for (const compEl of componentEls) {
      const sectionEl = this.getElement(compEl, 'section');
      if (sectionEl) {
        const section = this.parseSection(sectionEl);
        if (section) {
          components.push({ section });
        }
      }
    }

    return { components };
  }

  /**
   * Parse a section based on its template ID
   */
  private parseSection(sectionEl: Element): CCDASection | null {
    const templateIds = this.parseIIArray(sectionEl, 'templateId');
    const code = this.parseCE(this.getElement(sectionEl, 'code'));
    const title = this.getElementText(sectionEl, 'title');

    const baseSection: CCDASection = {
      templateId: templateIds,
      code,
      title: title || undefined,
      text: this.options.parseNarrative ? this.parseNarrative(sectionEl) : undefined,
    };

    // Determine section type and parse entries accordingly
    const templateId = templateIds[0]?.root;
    if (!templateId) {
      return baseSection;
    }

    switch (templateId) {
      case SectionTemplateIds.PROBLEMS:
      case SectionTemplateIds.PROBLEMS_ENTRIES_REQUIRED:
        return this.parseProblemsSection(sectionEl, baseSection);

      case SectionTemplateIds.MEDICATIONS:
      case SectionTemplateIds.MEDICATIONS_ENTRIES_REQUIRED:
        return this.parseMedicationsSection(sectionEl, baseSection);

      case SectionTemplateIds.ALLERGIES:
      case SectionTemplateIds.ALLERGIES_ENTRIES_REQUIRED:
        return this.parseAllergiesSection(sectionEl, baseSection);

      case SectionTemplateIds.PROCEDURES:
      case SectionTemplateIds.PROCEDURES_ENTRIES_REQUIRED:
        return this.parseProceduresSection(sectionEl, baseSection);

      case SectionTemplateIds.RESULTS:
      case SectionTemplateIds.RESULTS_ENTRIES_REQUIRED:
        return this.parseResultsSection(sectionEl, baseSection);

      case SectionTemplateIds.VITAL_SIGNS:
      case SectionTemplateIds.VITAL_SIGNS_ENTRIES_REQUIRED:
        return this.parseVitalSignsSection(sectionEl, baseSection);

      case SectionTemplateIds.IMMUNIZATIONS:
      case SectionTemplateIds.IMMUNIZATIONS_ENTRIES_REQUIRED:
        return this.parseImmunizationsSection(sectionEl, baseSection);

      case SectionTemplateIds.ENCOUNTERS:
      case SectionTemplateIds.ENCOUNTERS_ENTRIES_REQUIRED:
        return this.parseEncountersSection(sectionEl, baseSection);

      case SectionTemplateIds.PLAN_OF_TREATMENT:
        return this.parsePlanOfTreatmentSection(sectionEl, baseSection);

      case SectionTemplateIds.SOCIAL_HISTORY:
        return this.parseSocialHistorySection(sectionEl, baseSection);

      case SectionTemplateIds.FAMILY_HISTORY:
        return this.parseFamilyHistorySection(sectionEl, baseSection);

      default:
        return baseSection;
    }
  }

  /**
   * Parse Problems Section
   */
  private parseProblemsSection(sectionEl: Element, base: CCDASection): CCDAProblemsSection {
    const entries: CCDAProblemConcernAct[] = [];
    const entryEls = this.getElements(sectionEl, 'entry');

    for (const entryEl of entryEls) {
      const actEl = this.getElement(entryEl, 'act');
      if (actEl) {
        const concernAct = this.parseProblemConcernAct(actEl);
        if (concernAct) {
          entries.push(concernAct);
        }
      }
    }

    return { ...base, entries };
  }

  /**
   * Parse Problem Concern Act
   */
  private parseProblemConcernAct(actEl: Element): CCDAProblemConcernAct | null {
    const templateIds = this.parseIIArray(actEl, 'templateId');
    const ids = this.parseIIArray(actEl, 'id');
    const code = this.parseCD(this.getElement(actEl, 'code'));
    const statusCode = this.parseCS(this.getElement(actEl, 'statusCode'));
    const effectiveTime = this.parseIVL_TS(this.getElement(actEl, 'effectiveTime'));

    const problemObservations: CCDAProblemObservation[] = [];
    const entryRelationships = this.getElements(actEl, 'entryRelationship');

    for (const erEl of entryRelationships) {
      const obsEl = this.getElement(erEl, 'observation');
      if (obsEl) {
        const obs = this.parseProblemObservation(obsEl);
        if (obs) {
          problemObservations.push(obs);
        }
      }
    }

    return {
      templateId: templateIds,
      id: ids,
      code,
      statusCode,
      effectiveTime,
      problemObservations,
    };
  }

  /**
   * Parse Problem Observation
   */
  private parseProblemObservation(obsEl: Element): CCDAProblemObservation | null {
    return {
      templateId: this.parseIIArray(obsEl, 'templateId'),
      id: this.parseIIArray(obsEl, 'id'),
      code: this.parseCD(this.getElement(obsEl, 'code')),
      statusCode: this.parseCS(this.getElement(obsEl, 'statusCode')),
      effectiveTime: this.parseIVL_TS(this.getElement(obsEl, 'effectiveTime')),
      value: this.parseCD(this.getElement(obsEl, 'value')),
    };
  }

  /**
   * Parse Medications Section
   */
  private parseMedicationsSection(sectionEl: Element, base: CCDASection): CCDAMedicationsSection {
    const entries: CCDAMedicationActivity[] = [];
    const entryEls = this.getElements(sectionEl, 'entry');

    for (const entryEl of entryEls) {
      const saEl = this.getElement(entryEl, 'substanceAdministration');
      if (saEl) {
        const activity = this.parseMedicationActivity(saEl);
        if (activity) {
          entries.push(activity);
        }
      }
    }

    return { ...base, entries };
  }

  /**
   * Parse Medication Activity
   */
  private parseMedicationActivity(saEl: Element): CCDAMedicationActivity | null {
    const consumableEl = this.getElement(saEl, 'consumable');
    if (!consumableEl) {
      this.warnings.push('Medication activity missing consumable');
      return null;
    }

    const consumable = this.parseConsumable(consumableEl);

    return {
      templateId: this.parseIIArray(saEl, 'templateId'),
      id: this.parseIIArray(saEl, 'id'),
      statusCode: this.parseCS(this.getElement(saEl, 'statusCode')),
      effectiveTime: this.parseIVL_TS(this.getElement(saEl, 'effectiveTime')),
      routeCode: this.parseCE(this.getElement(saEl, 'routeCode')),
      doseQuantity: this.parsePQ(this.getElement(saEl, 'doseQuantity')),
      rateQuantity: this.parsePQ(this.getElement(saEl, 'rateQuantity')),
      consumable,
    };
  }

  /**
   * Parse Consumable
   */
  private parseConsumable(consumableEl: Element): CCDAConsumable {
    const mpEl = this.getElement(consumableEl, 'manufacturedProduct');
    return {
      manufacturedProduct: this.parseManufacturedProduct(mpEl),
    };
  }

  /**
   * Parse Manufactured Product
   */
  private parseManufacturedProduct(mpEl: Element | null): CCDAManufacturedProduct {
    if (!mpEl) {
      return { templateId: [], manufacturedMaterial: {} };
    }

    const mmEl = this.getElement(mpEl, 'manufacturedMaterial');

    return {
      templateId: this.parseIIArray(mpEl, 'templateId'),
      id: this.parseIIArray(mpEl, 'id'),
      manufacturedMaterial: this.parseManufacturedMaterial(mmEl),
    };
  }

  /**
   * Parse Manufactured Material
   */
  private parseManufacturedMaterial(mmEl: Element | null): CCDAManufacturedMaterial {
    if (!mmEl) {
      return {};
    }

    return {
      code: this.parseCE(this.getElement(mmEl, 'code')),
      name: this.getElementText(mmEl, 'name') || undefined,
    };
  }

  /**
   * Parse Allergies Section
   */
  private parseAllergiesSection(sectionEl: Element, base: CCDASection): CCDAAllergiesSection {
    const entries: CCDAAllergyConcernAct[] = [];
    const entryEls = this.getElements(sectionEl, 'entry');

    for (const entryEl of entryEls) {
      const actEl = this.getElement(entryEl, 'act');
      if (actEl) {
        const concernAct = this.parseAllergyConcernAct(actEl);
        if (concernAct) {
          entries.push(concernAct);
        }
      }
    }

    return { ...base, entries };
  }

  /**
   * Parse Allergy Concern Act
   */
  private parseAllergyConcernAct(actEl: Element): CCDAAllergyConcernAct | null {
    const allergyObservations: CCDAAllergyObservation[] = [];
    const entryRelationships = this.getElements(actEl, 'entryRelationship');

    for (const erEl of entryRelationships) {
      const obsEl = this.getElement(erEl, 'observation');
      if (obsEl) {
        const obs = this.parseAllergyObservation(obsEl);
        if (obs) {
          allergyObservations.push(obs);
        }
      }
    }

    return {
      templateId: this.parseIIArray(actEl, 'templateId'),
      id: this.parseIIArray(actEl, 'id'),
      code: this.parseCD(this.getElement(actEl, 'code')),
      statusCode: this.parseCS(this.getElement(actEl, 'statusCode')),
      effectiveTime: this.parseIVL_TS(this.getElement(actEl, 'effectiveTime')),
      allergyObservations,
    };
  }

  /**
   * Parse Allergy Observation
   */
  private parseAllergyObservation(obsEl: Element): CCDAAllergyObservation | null {
    const reactionObservations: CCDAReactionObservation[] = [];
    let severityObservation: CCDASeverityObservation | undefined;

    const entryRelationships = this.getElements(obsEl, 'entryRelationship');
    for (const erEl of entryRelationships) {
      const nestedObs = this.getElement(erEl, 'observation');
      if (nestedObs) {
        const templateIds = this.parseIIArray(nestedObs, 'templateId');
        const templateId = templateIds[0]?.root;

        if (templateId === EntryTemplateIds.REACTION_OBSERVATION) {
          reactionObservations.push(this.parseReactionObservation(nestedObs));
        } else if (templateId === EntryTemplateIds.SEVERITY_OBSERVATION) {
          severityObservation = this.parseSeverityObservation(nestedObs);
        }
      }
    }

    return {
      templateId: this.parseIIArray(obsEl, 'templateId'),
      id: this.parseIIArray(obsEl, 'id'),
      code: this.parseCD(this.getElement(obsEl, 'code')),
      statusCode: this.parseCS(this.getElement(obsEl, 'statusCode')),
      effectiveTime: this.parseIVL_TS(this.getElement(obsEl, 'effectiveTime')),
      value: this.parseCD(this.getElement(obsEl, 'value')),
      reactionObservations,
      severityObservation,
    };
  }

  /**
   * Parse Reaction Observation
   */
  private parseReactionObservation(obsEl: Element): CCDAReactionObservation {
    return {
      templateId: this.parseIIArray(obsEl, 'templateId'),
      id: this.parseIIArray(obsEl, 'id'),
      code: this.parseCD(this.getElement(obsEl, 'code')),
      statusCode: this.parseCS(this.getElement(obsEl, 'statusCode')),
      effectiveTime: this.parseIVL_TS(this.getElement(obsEl, 'effectiveTime')),
      value: this.parseCD(this.getElement(obsEl, 'value')),
    };
  }

  /**
   * Parse Severity Observation
   */
  private parseSeverityObservation(obsEl: Element): CCDASeverityObservation {
    return {
      templateId: this.parseIIArray(obsEl, 'templateId'),
      code: this.parseCD(this.getElement(obsEl, 'code')),
      statusCode: this.parseCS(this.getElement(obsEl, 'statusCode')),
      value: this.parseCD(this.getElement(obsEl, 'value')),
    };
  }

  /**
   * Parse Procedures Section
   */
  private parseProceduresSection(sectionEl: Element, base: CCDASection): CCDAProceduresSection {
    const entries: CCDAProcedureEntry[] = [];
    const entryEls = this.getElements(sectionEl, 'entry');

    for (const entryEl of entryEls) {
      // Procedures can be procedure, act, or observation
      const procEl = this.getElement(entryEl, 'procedure') ||
        this.getElement(entryEl, 'act') ||
        this.getElement(entryEl, 'observation');

      if (procEl) {
        const entry = this.parseProcedureEntry(procEl);
        if (entry) {
          entries.push(entry);
        }
      }
    }

    return { ...base, entries };
  }

  /**
   * Parse Procedure Entry
   */
  private parseProcedureEntry(procEl: Element): CCDAProcedureEntry | null {
    return {
      templateId: this.parseIIArray(procEl, 'templateId'),
      id: this.parseIIArray(procEl, 'id'),
      code: this.parseCD(this.getElement(procEl, 'code')),
      statusCode: this.parseCS(this.getElement(procEl, 'statusCode')),
      effectiveTime: this.parseIVL_TS(this.getElement(procEl, 'effectiveTime')),
      priorityCode: this.parseCE(this.getElement(procEl, 'priorityCode')),
      methodCode: this.parseCE(this.getElement(procEl, 'methodCode')),
    };
  }

  /**
   * Parse Results Section
   */
  private parseResultsSection(sectionEl: Element, base: CCDASection): CCDAResultsSection {
    const entries: CCDAResultOrganizer[] = [];
    const entryEls = this.getElements(sectionEl, 'entry');

    for (const entryEl of entryEls) {
      const orgEl = this.getElement(entryEl, 'organizer');
      if (orgEl) {
        const organizer = this.parseResultOrganizer(orgEl);
        if (organizer) {
          entries.push(organizer);
        }
      }
    }

    return { ...base, entries };
  }

  /**
   * Parse Result Organizer
   */
  private parseResultOrganizer(orgEl: Element): CCDAResultOrganizer | null {
    const resultObservations: CCDAResultObservation[] = [];
    const componentEls = this.getElements(orgEl, 'component');

    for (const compEl of componentEls) {
      const obsEl = this.getElement(compEl, 'observation');
      if (obsEl) {
        const obs = this.parseResultObservation(obsEl);
        if (obs) {
          resultObservations.push(obs);
        }
      }
    }

    return {
      templateId: this.parseIIArray(orgEl, 'templateId'),
      id: this.parseIIArray(orgEl, 'id'),
      code: this.parseCD(this.getElement(orgEl, 'code')),
      statusCode: this.parseCS(this.getElement(orgEl, 'statusCode')),
      effectiveTime: this.parseIVL_TS(this.getElement(orgEl, 'effectiveTime')),
      resultObservations,
    };
  }

  /**
   * Parse Result Observation
   */
  private parseResultObservation(obsEl: Element): CCDAResultObservation | null {
    const valueEl = this.getElement(obsEl, 'value');
    let value: PQ | CD | undefined;

    if (valueEl) {
      const xsiType = valueEl.getAttribute('xsi:type');
      if (xsiType === 'PQ') {
        value = this.parsePQ(valueEl);
      } else if (xsiType === 'CD' || xsiType === 'CE') {
        value = this.parseCD(valueEl);
      }
    }

    return {
      templateId: this.parseIIArray(obsEl, 'templateId'),
      id: this.parseIIArray(obsEl, 'id'),
      code: this.parseCD(this.getElement(obsEl, 'code')),
      statusCode: this.parseCS(this.getElement(obsEl, 'statusCode')),
      effectiveTime: this.parseTS(this.getElement(obsEl, 'effectiveTime')),
      value,
      interpretationCode: this.parseCEArray(obsEl, 'interpretationCode'),
    };
  }

  /**
   * Parse Vital Signs Section
   */
  private parseVitalSignsSection(sectionEl: Element, base: CCDASection): CCDAVitalSignsSection {
    const entries: CCDAVitalSignsOrganizer[] = [];
    const entryEls = this.getElements(sectionEl, 'entry');

    for (const entryEl of entryEls) {
      const orgEl = this.getElement(entryEl, 'organizer');
      if (orgEl) {
        const organizer = this.parseVitalSignsOrganizer(orgEl);
        if (organizer) {
          entries.push(organizer);
        }
      }
    }

    return { ...base, entries };
  }

  /**
   * Parse Vital Signs Organizer
   */
  private parseVitalSignsOrganizer(orgEl: Element): CCDAVitalSignsOrganizer | null {
    const vitalSignObservations: CCDAVitalSignObservation[] = [];
    const componentEls = this.getElements(orgEl, 'component');

    for (const compEl of componentEls) {
      const obsEl = this.getElement(compEl, 'observation');
      if (obsEl) {
        const obs = this.parseVitalSignObservation(obsEl);
        if (obs) {
          vitalSignObservations.push(obs);
        }
      }
    }

    return {
      templateId: this.parseIIArray(orgEl, 'templateId'),
      id: this.parseIIArray(orgEl, 'id'),
      code: this.parseCD(this.getElement(orgEl, 'code')),
      statusCode: this.parseCS(this.getElement(orgEl, 'statusCode')),
      effectiveTime: this.parseTS(this.getElement(orgEl, 'effectiveTime')),
      vitalSignObservations,
    };
  }

  /**
   * Parse Vital Sign Observation
   */
  private parseVitalSignObservation(obsEl: Element): CCDAVitalSignObservation | null {
    return {
      templateId: this.parseIIArray(obsEl, 'templateId'),
      id: this.parseIIArray(obsEl, 'id'),
      code: this.parseCD(this.getElement(obsEl, 'code')),
      statusCode: this.parseCS(this.getElement(obsEl, 'statusCode')),
      effectiveTime: this.parseTS(this.getElement(obsEl, 'effectiveTime')),
      value: this.parsePQ(this.getElement(obsEl, 'value')),
      interpretationCode: this.parseCEArray(obsEl, 'interpretationCode'),
    };
  }

  /**
   * Parse Immunizations Section
   */
  private parseImmunizationsSection(sectionEl: Element, base: CCDASection): CCDAImmunizationsSection {
    const entries: CCDAImmunizationActivity[] = [];
    const entryEls = this.getElements(sectionEl, 'entry');

    for (const entryEl of entryEls) {
      const saEl = this.getElement(entryEl, 'substanceAdministration');
      if (saEl) {
        const activity = this.parseImmunizationActivity(saEl);
        if (activity) {
          entries.push(activity);
        }
      }
    }

    return { ...base, entries };
  }

  /**
   * Parse Immunization Activity
   */
  private parseImmunizationActivity(saEl: Element): CCDAImmunizationActivity | null {
    const consumableEl = this.getElement(saEl, 'consumable');
    if (!consumableEl) {
      return null;
    }

    return {
      templateId: this.parseIIArray(saEl, 'templateId'),
      id: this.parseIIArray(saEl, 'id'),
      statusCode: this.parseCS(this.getElement(saEl, 'statusCode')),
      effectiveTime: this.parseTS(this.getElement(saEl, 'effectiveTime')),
      routeCode: this.parseCE(this.getElement(saEl, 'routeCode')),
      doseQuantity: this.parsePQ(this.getElement(saEl, 'doseQuantity')),
      consumable: this.parseConsumable(consumableEl),
      negationInd: saEl.getAttribute('negationInd') === 'true',
    };
  }

  /**
   * Parse Encounters Section
   */
  private parseEncountersSection(sectionEl: Element, base: CCDASection): CCDAEncountersSection {
    const entries: CCDAEncounterActivity[] = [];
    const entryEls = this.getElements(sectionEl, 'entry');

    for (const entryEl of entryEls) {
      const encEl = this.getElement(entryEl, 'encounter');
      if (encEl) {
        const activity = this.parseEncounterActivity(encEl);
        if (activity) {
          entries.push(activity);
        }
      }
    }

    return { ...base, entries };
  }

  /**
   * Parse Encounter Activity
   */
  private parseEncounterActivity(encEl: Element): CCDAEncounterActivity | null {
    return {
      templateId: this.parseIIArray(encEl, 'templateId'),
      id: this.parseIIArray(encEl, 'id'),
      code: this.parseCD(this.getElement(encEl, 'code')),
      effectiveTime: this.parseIVL_TS(this.getElement(encEl, 'effectiveTime')),
    };
  }

  /**
   * Parse Plan of Treatment Section
   */
  private parsePlanOfTreatmentSection(sectionEl: Element, base: CCDASection): CCDAPlanOfTreatmentSection {
    return {
      ...base,
      entries: [], // Simplified - would parse plan entries
    };
  }

  /**
   * Parse Social History Section
   */
  private parseSocialHistorySection(sectionEl: Element, base: CCDASection): CCDASocialHistorySection {
    const entries: CCDASocialHistoryObservation[] = [];
    const entryEls = this.getElements(sectionEl, 'entry');

    for (const entryEl of entryEls) {
      const obsEl = this.getElement(entryEl, 'observation');
      if (obsEl) {
        entries.push({
          templateId: this.parseIIArray(obsEl, 'templateId'),
          id: this.parseIIArray(obsEl, 'id'),
          code: this.parseCD(this.getElement(obsEl, 'code')),
          statusCode: this.parseCS(this.getElement(obsEl, 'statusCode')),
          effectiveTime: this.parseIVL_TS(this.getElement(obsEl, 'effectiveTime')),
          value: this.parseCD(this.getElement(obsEl, 'value')),
        });
      }
    }

    return { ...base, entries };
  }

  /**
   * Parse Family History Section
   */
  private parseFamilyHistorySection(sectionEl: Element, base: CCDASection): CCDAFamilyHistorySection {
    const entries: CCDAFamilyHistoryOrganizer[] = [];
    const entryEls = this.getElements(sectionEl, 'entry');

    for (const entryEl of entryEls) {
      const orgEl = this.getElement(entryEl, 'organizer');
      if (orgEl) {
        entries.push({
          templateId: this.parseIIArray(orgEl, 'templateId'),
          id: this.parseIIArray(orgEl, 'id'),
          statusCode: this.parseCS(this.getElement(orgEl, 'statusCode')),
          subject: {
            relatedSubject: {
              code: this.parseCE(this.getElement(orgEl, 'subject/relatedSubject/code')),
            },
          },
          familyHistoryObservations: [],
        });
      }
    }

    return { ...base, entries };
  }

  /**
   * Parse narrative text block
   */
  private parseNarrative(sectionEl: Element): CCDANarrativeBlock | undefined {
    const textEl = this.getElement(sectionEl, 'text');
    if (!textEl) {
      return undefined;
    }

    return {
      content: textEl.innerHTML || '',
    };
  }

  // ==========================================================================
  // Header Parsing Methods
  // ==========================================================================

  /**
   * Parse record targets (patients)
   */
  private parseRecordTargets(root: Element): CCDARecordTarget[] {
    const targets: CCDARecordTarget[] = [];
    const rtEls = this.getElements(root, 'recordTarget');

    for (const rtEl of rtEls) {
      const prEl = this.getElement(rtEl, 'patientRole');
      if (prEl) {
        targets.push({
          patientRole: this.parsePatientRole(prEl),
        });
      }
    }

    return targets;
  }

  /**
   * Parse patient role
   */
  private parsePatientRole(prEl: Element): CCDAPatientRole {
    const patientEl = this.getElement(prEl, 'patient');

    return {
      id: this.parseIIArray(prEl, 'id'),
      addr: this.parseADArray(prEl, 'addr'),
      telecom: this.parseTELArray(prEl, 'telecom'),
      patient: patientEl ? this.parsePatient(patientEl) : undefined,
    };
  }

  /**
   * Parse patient demographics
   */
  private parsePatient(patientEl: Element): CCDAPatient {
    return {
      name: this.parsePNArray(patientEl, 'name'),
      administrativeGenderCode: this.parseCE(this.getElement(patientEl, 'administrativeGenderCode')),
      birthTime: this.parseTS(this.getElement(patientEl, 'birthTime')),
      maritalStatusCode: this.parseCE(this.getElement(patientEl, 'maritalStatusCode')),
      raceCode: this.parseCE(this.getElement(patientEl, 'raceCode')),
      ethnicGroupCode: this.parseCE(this.getElement(patientEl, 'ethnicGroupCode')),
    };
  }

  /**
   * Parse authors
   */
  private parseAuthors(root: Element): CCDAAuthor[] {
    const authors: CCDAAuthor[] = [];
    const authorEls = this.getElements(root, 'author');

    for (const authorEl of authorEls) {
      const aaEl = this.getElement(authorEl, 'assignedAuthor');
      if (aaEl) {
        authors.push({
          time: this.parseTS(this.getElement(authorEl, 'time')),
          assignedAuthor: this.parseAssignedAuthor(aaEl),
        });
      }
    }

    return authors;
  }

  /**
   * Parse assigned author
   */
  private parseAssignedAuthor(aaEl: Element): CCDAAssignedAuthor {
    const personEl = this.getElement(aaEl, 'assignedPerson');
    const orgEl = this.getElement(aaEl, 'representedOrganization');

    return {
      id: this.parseIIArray(aaEl, 'id'),
      code: this.parseCE(this.getElement(aaEl, 'code')),
      addr: this.parseADArray(aaEl, 'addr'),
      telecom: this.parseTELArray(aaEl, 'telecom'),
      assignedPerson: personEl ? this.parsePerson(personEl) : undefined,
      representedOrganization: orgEl ? this.parseOrganization(orgEl) : undefined,
    };
  }

  /**
   * Parse person
   */
  private parsePerson(personEl: Element): CCDAPerson {
    return {
      name: this.parsePNArray(personEl, 'name'),
    };
  }

  /**
   * Parse organization
   */
  private parseOrganization(orgEl: Element): CCDAOrganization {
    return {
      id: this.parseIIArray(orgEl, 'id'),
      name: this.parseONArray(orgEl, 'name'),
      telecom: this.parseTELArray(orgEl, 'telecom'),
      addr: this.parseADArray(orgEl, 'addr'),
    };
  }

  /**
   * Parse custodian
   */
  private parseCustodian(root: Element): CCDACustodian {
    const custodianEl = this.getElement(root, 'custodian');
    const acEl = custodianEl ? this.getElement(custodianEl, 'assignedCustodian') : null;
    const rcoEl = acEl ? this.getElement(acEl, 'representedCustodianOrganization') : null;

    return {
      assignedCustodian: {
        representedCustodianOrganization: rcoEl
          ? this.parseOrganization(rcoEl)
          : { id: [], name: [], telecom: [], addr: [] },
      },
    };
  }

  /**
   * Parse informants
   */
  private parseInformants(root: Element): CCDAInformant[] {
    const informants: CCDAInformant[] = [];
    const infEls = this.getElements(root, 'informant');

    for (const infEl of infEls) {
      const aeEl = this.getElement(infEl, 'assignedEntity');
      if (aeEl) {
        informants.push({
          assignedEntity: this.parseAssignedEntity(aeEl),
        });
      }
    }

    return informants;
  }

  /**
   * Parse assigned entity
   */
  private parseAssignedEntity(aeEl: Element): CCDAAssignedEntity {
    const personEl = this.getElement(aeEl, 'assignedPerson');
    const orgEl = this.getElement(aeEl, 'representedOrganization');

    return {
      id: this.parseIIArray(aeEl, 'id'),
      code: this.parseCE(this.getElement(aeEl, 'code')),
      addr: this.parseADArray(aeEl, 'addr'),
      telecom: this.parseTELArray(aeEl, 'telecom'),
      assignedPerson: personEl ? this.parsePerson(personEl) : undefined,
      representedOrganization: orgEl ? this.parseOrganization(orgEl) : undefined,
    };
  }

  /**
   * Parse documentation of
   */
  private parseDocumentationOf(root: Element): CCDADocumentationOf[] {
    const docOf: CCDADocumentationOf[] = [];
    const doEls = this.getElements(root, 'documentationOf');

    for (const doEl of doEls) {
      const seEl = this.getElement(doEl, 'serviceEvent');
      if (seEl) {
        docOf.push({
          serviceEvent: this.parseServiceEvent(seEl),
        });
      }
    }

    return docOf;
  }

  /**
   * Parse service event
   */
  private parseServiceEvent(seEl: Element): CCDAServiceEvent {
    return {
      classCode: seEl.getAttribute('classCode') || undefined,
      code: this.parseCE(this.getElement(seEl, 'code')),
      effectiveTime: this.parseIVL_TS(this.getElement(seEl, 'effectiveTime')),
      performer: this.parsePerformers(seEl),
    };
  }

  /**
   * Parse performers
   */
  private parsePerformers(parent: Element): CCDAPerformer[] {
    const performers: CCDAPerformer[] = [];
    const perfEls = this.getElements(parent, 'performer');

    for (const perfEl of perfEls) {
      const aeEl = this.getElement(perfEl, 'assignedEntity');
      performers.push({
        typeCode: perfEl.getAttribute('typeCode') || undefined,
        functionCode: this.parseCE(this.getElement(perfEl, 'functionCode')),
        time: this.parseIVL_TS(this.getElement(perfEl, 'time')),
        assignedEntity: aeEl ? this.parseAssignedEntity(aeEl) : undefined,
      });
    }

    return performers;
  }

  // ==========================================================================
  // Data Type Parsing Methods
  // ==========================================================================

  /**
   * Parse II (Instance Identifier)
   */
  private parseII(el: Element | null): II | undefined {
    if (!el) return undefined;

    const root = el.getAttribute('root');
    if (!root) return undefined;

    return {
      root,
      extension: el.getAttribute('extension') || undefined,
      assigningAuthorityName: el.getAttribute('assigningAuthorityName') || undefined,
    };
  }

  /**
   * Parse array of II
   */
  private parseIIArray(parent: Element, tagName: string): II[] {
    const elements = this.getElements(parent, tagName);
    const result: II[] = [];

    for (const el of elements) {
      const ii = this.parseII(el);
      if (ii) {
        result.push(ii);
      }
    }

    return result;
  }

  /**
   * Parse CE (Coded Element)
   */
  private parseCE(el: Element | null): CE | undefined {
    if (!el) return undefined;

    return {
      code: el.getAttribute('code') || undefined,
      codeSystem: el.getAttribute('codeSystem') || undefined,
      codeSystemName: el.getAttribute('codeSystemName') || undefined,
      displayName: el.getAttribute('displayName') || undefined,
      nullFlavor: (el.getAttribute('nullFlavor') as any) || undefined,
    };
  }

  /**
   * Parse array of CE
   */
  private parseCEArray(parent: Element, tagName: string): CE[] {
    const elements = this.getElements(parent, tagName);
    const result: CE[] = [];

    for (const el of elements) {
      const ce = this.parseCE(el);
      if (ce) {
        result.push(ce);
      }
    }

    return result;
  }

  /**
   * Parse CD (Coded Descriptor)
   */
  private parseCD(el: Element | null): CD | undefined {
    return this.parseCE(el); // CD extends CE
  }

  /**
   * Parse CS (Coded Simple)
   */
  private parseCS(el: Element | null): CS | undefined {
    if (!el) return undefined;

    return {
      code: el.getAttribute('code') || undefined,
      nullFlavor: (el.getAttribute('nullFlavor') as any) || undefined,
    };
  }

  /**
   * Parse TS (Timestamp)
   */
  private parseTS(el: Element | null): TS | undefined {
    if (!el) return undefined;

    return {
      value: el.getAttribute('value') || undefined,
      nullFlavor: (el.getAttribute('nullFlavor') as any) || undefined,
    };
  }

  /**
   * Parse IVL_TS (Interval of Time)
   */
  private parseIVL_TS(el: Element | null): IVL_TS | undefined {
    if (!el) return undefined;

    // Check if it's a simple value (TS) or an interval
    const value = el.getAttribute('value');
    if (value) {
      return { low: { value }, high: { value } };
    }

    return {
      low: this.parseTS(this.getElement(el, 'low')),
      high: this.parseTS(this.getElement(el, 'high')),
      nullFlavor: (el.getAttribute('nullFlavor') as any) || undefined,
    };
  }

  /**
   * Parse PQ (Physical Quantity)
   */
  private parsePQ(el: Element | null): PQ | undefined {
    if (!el) return undefined;

    const value = el.getAttribute('value');

    return {
      value: value ? parseFloat(value) : undefined,
      unit: el.getAttribute('unit') || undefined,
      nullFlavor: (el.getAttribute('nullFlavor') as any) || undefined,
    };
  }

  /**
   * Parse AD (Address)
   */
  private parseAD(el: Element | null): AD | undefined {
    if (!el) return undefined;

    const streetAddressLines: string[] = [];
    const salEls = this.getElements(el, 'streetAddressLine');
    for (const sal of salEls) {
      if (sal.textContent) {
        streetAddressLines.push(sal.textContent);
      }
    }

    return {
      use: this.parseUseAttribute(el) as any[],
      streetAddressLine: streetAddressLines.length > 0 ? streetAddressLines : undefined,
      city: this.getElementText(el, 'city') || undefined,
      state: this.getElementText(el, 'state') || undefined,
      postalCode: this.getElementText(el, 'postalCode') || undefined,
      country: this.getElementText(el, 'country') || undefined,
    };
  }

  /**
   * Parse array of AD
   */
  private parseADArray(parent: Element, tagName: string): AD[] {
    const elements = this.getElements(parent, tagName);
    const result: AD[] = [];

    for (const el of elements) {
      const ad = this.parseAD(el);
      if (ad) {
        result.push(ad);
      }
    }

    return result;
  }

  /**
   * Parse TEL (Telecommunication)
   */
  private parseTEL(el: Element | null): TEL | undefined {
    if (!el) return undefined;

    return {
      value: el.getAttribute('value') || undefined,
      use: this.parseUseAttribute(el) as any[],
    };
  }

  /**
   * Parse array of TEL
   */
  private parseTELArray(parent: Element, tagName: string): TEL[] {
    const elements = this.getElements(parent, tagName);
    const result: TEL[] = [];

    for (const el of elements) {
      const tel = this.parseTEL(el);
      if (tel) {
        result.push(tel);
      }
    }

    return result;
  }

  /**
   * Parse PN (Person Name)
   */
  private parsePN(el: Element | null): PN | undefined {
    if (!el) return undefined;

    const given: string[] = [];
    const givenEls = this.getElements(el, 'given');
    for (const g of givenEls) {
      if (g.textContent) {
        given.push(g.textContent);
      }
    }

    const prefix: string[] = [];
    const prefixEls = this.getElements(el, 'prefix');
    for (const p of prefixEls) {
      if (p.textContent) {
        prefix.push(p.textContent);
      }
    }

    const suffix: string[] = [];
    const suffixEls = this.getElements(el, 'suffix');
    for (const s of suffixEls) {
      if (s.textContent) {
        suffix.push(s.textContent);
      }
    }

    return {
      use: this.parseUseAttribute(el) as any[],
      prefix: prefix.length > 0 ? prefix : undefined,
      given: given.length > 0 ? given : undefined,
      family: this.getElementText(el, 'family') || undefined,
      suffix: suffix.length > 0 ? suffix : undefined,
    };
  }

  /**
   * Parse array of PN
   */
  private parsePNArray(parent: Element, tagName: string): PN[] {
    const elements = this.getElements(parent, tagName);
    const result: PN[] = [];

    for (const el of elements) {
      const pn = this.parsePN(el);
      if (pn) {
        result.push(pn);
      }
    }

    return result;
  }

  /**
   * Parse ON (Organization Name) array
   */
  private parseONArray(parent: Element, tagName: string): { name?: string }[] {
    const elements = this.getElements(parent, tagName);
    const result: { name?: string }[] = [];

    for (const el of elements) {
      result.push({ name: el.textContent || undefined });
    }

    return result;
  }

  /**
   * Parse use attribute
   */
  private parseUseAttribute(el: Element): string[] {
    const use = el.getAttribute('use');
    if (!use) return [];
    return use.split(' ').filter(u => u.length > 0);
  }

  /**
   * Parse integer value
   */
  private parseInteger(el: Element | null): number | undefined {
    if (!el) return undefined;
    const value = el.getAttribute('value');
    if (!value) return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  /**
   * Get a single child element by tag name
   */
  private getElement(parent: Element, tagName: string): Element | null {
    // Handle XPath-like expressions
    if (tagName.includes('/')) {
      const parts = tagName.split('/');
      let current: Element | null = parent;
      for (const part of parts) {
        if (!current) return null;
        current = this.getElement(current, part);
      }
      return current;
    }

    const children = parent.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeName === tagName || child.localName === tagName) {
        return child;
      }
    }
    return null;
  }

  /**
   * Get all child elements by tag name
   */
  private getElements(parent: Element, tagName: string): Element[] {
    const result: Element[] = [];
    const children = parent.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeName === tagName || child.localName === tagName) {
        result.push(child);
      }
    }
    return result;
  }

  /**
   * Get text content of a child element
   */
  private getElementText(parent: Element, tagName: string): string | null {
    const el = this.getElement(parent, tagName);
    return el ? el.textContent : null;
  }

  /**
   * Determine document type from template IDs
   */
  private determineDocumentType(root: Element): CCDADocumentTypeCode | null {
    const templateIds = this.parseIIArray(root, 'templateId');

    for (const templateId of templateIds) {
      switch (templateId.root) {
        case DocumentTemplateIds.CCD:
          return 'CCD';
        case DocumentTemplateIds.DISCHARGE_SUMMARY:
          return 'DISCHARGE_SUMMARY';
        case DocumentTemplateIds.REFERRAL_NOTE:
          return 'REFERRAL_NOTE';
        case DocumentTemplateIds.PROGRESS_NOTE:
          return 'PROGRESS_NOTE';
        case DocumentTemplateIds.CONSULTATION_NOTE:
          return 'CONSULTATION_NOTE';
        case DocumentTemplateIds.HISTORY_AND_PHYSICAL:
          return 'HISTORY_AND_PHYSICAL';
        case DocumentTemplateIds.OPERATIVE_NOTE:
          return 'OPERATIVE_NOTE';
        case DocumentTemplateIds.CARE_PLAN:
          return 'CARE_PLAN';
      }
    }

    return null;
  }

  /**
   * Create parser result
   */
  private createResult(
    document: CCDADocument | null,
    documentType: CCDADocumentTypeCode | null
  ): CCDAParserResult {
    return {
      document,
      documentType,
      warnings: this.warnings,
      errors: this.errors,
      isValid: this.errors.length === 0 && document !== null,
    };
  }
}

/**
 * Convenience function to parse a C-CDA document
 */
export function parseCCDA(xmlString: string, options?: CCDAParserOptions): CCDAParserResult {
  const parser = new CCDAParser(options);
  return parser.parse(xmlString);
}

/**
 * Extract patient information from a parsed C-CDA document
 */
export function extractPatientInfo(document: CCDADocument): CCDAPatient | null {
  if (!document.recordTarget || document.recordTarget.length === 0) {
    return null;
  }

  return document.recordTarget[0].patientRole?.patient || null;
}

/**
 * Get all sections from a parsed C-CDA document
 */
export function getSections(document: CCDADocument): CCDASection[] {
  if (!document.component?.structuredBody?.components) {
    return [];
  }

  return document.component.structuredBody.components.map(c => c.section);
}

/**
 * Find a section by template ID
 */
export function findSectionByTemplateId(
  document: CCDADocument,
  templateId: string
): CCDASection | null {
  const sections = getSections(document);

  for (const section of sections) {
    if (section.templateId?.some(t => t.root === templateId)) {
      return section;
    }
  }

  return null;
}

/**
 * Find a section by LOINC code
 */
export function findSectionByLoincCode(
  document: CCDADocument,
  loincCode: string
): CCDASection | null {
  const sections = getSections(document);

  for (const section of sections) {
    if (section.code?.code === loincCode && section.code?.codeSystem === LOINC_OID) {
      return section;
    }
  }

  return null;
}
