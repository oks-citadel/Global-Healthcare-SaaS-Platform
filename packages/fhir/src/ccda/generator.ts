/**
 * C-CDA Generator
 * Generates C-CDA 2.1 compliant XML documents
 * Based on HL7 C-CDA 2.1 Specification and ONC Certification Requirements
 */

import {
  CCDADocument,
  CCDADocumentHeader,
  CCDARecordTarget,
  CCDAAuthor,
  CCDACustodian,
  CCDAPatientRole,
  CCDAPatient,
  CCDAPerson,
  CCDAOrganization,
  CCDAAssignedAuthor,
  CCDAAssignedEntity,
  CCDAComponent,
  CCDASection,
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
  CCDADocumentTypeCode,
  ContinuityOfCareDocument,
  DischargeSummary,
  ReferralNote,
  ProgressNote,
  CCDAReactionObservation,
  CCDASeverityObservation,
  CCDANarrativeBlock,
} from './types';

import {
  DocumentTemplateIds,
  SectionTemplateIds,
  EntryTemplateIds,
  SectionLoincCodes,
  DocumentLoincCodes,
  LOINC_OID,
  SNOMED_CT_OID,
  RXNORM_OID,
  HL7_ACTCODE_OID,
  HL7_CONFIDENTIALITY_OID,
  StatusCodes,
  ActCodes,
  MoodCodes,
} from './templates';

/**
 * Generator options
 */
export interface CCDAGeneratorOptions {
  /** Include human-readable narrative sections */
  includeNarrative?: boolean;
  /** Pretty print XML output */
  prettyPrint?: boolean;
  /** Indent string for pretty printing */
  indent?: string;
  /** Include XML declaration */
  includeXmlDeclaration?: boolean;
  /** Include stylesheet reference */
  stylesheetHref?: string;
  /** Default language code */
  defaultLanguage?: string;
  /** Default confidentiality code */
  defaultConfidentiality?: string;
  /** Organization OID for generating IDs */
  organizationOid?: string;
}

/**
 * Default generator options
 */
const DEFAULT_OPTIONS: CCDAGeneratorOptions = {
  includeNarrative: true,
  prettyPrint: true,
  indent: '  ',
  includeXmlDeclaration: true,
  defaultLanguage: 'en-US',
  defaultConfidentiality: 'N',
  organizationOid: '2.16.840.1.113883.3.0000',
};

/**
 * C-CDA Document Generator
 */
export class CCDAGenerator {
  private options: CCDAGeneratorOptions;
  private currentIndent: number = 0;

  constructor(options: CCDAGeneratorOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Generate a complete C-CDA document
   */
  generate(document: CCDADocument, documentType: CCDADocumentTypeCode = 'CCD'): string {
    this.currentIndent = 0;
    let xml = '';

    if (this.options.includeXmlDeclaration) {
      xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
    }

    if (this.options.stylesheetHref) {
      xml += `<?xml-stylesheet type="text/xsl" href="${this.options.stylesheetHref}"?>\n`;
    }

    xml += this.generateClinicalDocument(document, documentType);

    return xml;
  }

  /**
   * Generate ClinicalDocument root element
   */
  private generateClinicalDocument(document: CCDADocument, documentType: CCDADocumentTypeCode): string {
    const attrs = [
      'xmlns="urn:hl7-org:v3"',
      'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
      'xmlns:sdtc="urn:hl7-org:sdtc"',
      'xsi:schemaLocation="urn:hl7-org:v3 CDA.xsd"',
    ];

    let content = '';

    // Realm code
    content += this.generateElement('realmCode', { code: 'US' });

    // Type ID
    content += this.generateElement('typeId', {
      root: '2.16.840.1.113883.1.3',
      extension: 'POCD_HD000040',
    });

    // Template IDs
    content += this.generateTemplateIds(documentType);

    // Document ID
    content += this.generateII('id', document.id);

    // Code
    content += this.generateCE('code', this.getDocumentCode(documentType));

    // Title
    content += this.generateTextElement('title', document.title);

    // Effective time
    content += this.generateTS('effectiveTime', document.effectiveTime);

    // Confidentiality code
    content += this.generateCE('confidentialityCode', document.confidentialityCode || {
      code: this.options.defaultConfidentiality,
      codeSystem: HL7_CONFIDENTIALITY_OID,
    });

    // Language code
    content += this.generateElement('languageCode', {
      code: document.languageCode?.code || this.options.defaultLanguage || 'en-US',
    });

    // Set ID and version (if present)
    if (document.setId) {
      content += this.generateII('setId', document.setId);
    }
    if (document.versionNumber !== undefined) {
      content += this.generateElement('versionNumber', { value: document.versionNumber.toString() });
    }

    // Record targets (patients)
    for (const rt of document.recordTarget) {
      content += this.generateRecordTarget(rt);
    }

    // Authors
    for (const author of document.author) {
      content += this.generateAuthor(author);
    }

    // Custodian
    content += this.generateCustodian(document.custodian);

    // Documentation of (service event)
    if (document.documentationOf) {
      for (const docOf of document.documentationOf) {
        content += this.generateDocumentationOf(docOf);
      }
    }

    // Component (body)
    if (document.component?.structuredBody) {
      content += this.generateComponent(document.component.structuredBody);
    }

    return this.wrapElement('ClinicalDocument', content, attrs.join(' '));
  }

  /**
   * Generate template IDs based on document type
   */
  private generateTemplateIds(documentType: CCDADocumentTypeCode): string {
    let xml = '';

    // US Realm Header template (required for all US C-CDA documents)
    xml += this.generateII('templateId', {
      root: DocumentTemplateIds.US_REALM_HEADER,
      extension: '2015-08-01',
    });

    // Document-specific template
    const templateId = this.getDocumentTemplateId(documentType);
    if (templateId) {
      xml += this.generateII('templateId', {
        root: templateId,
        extension: '2015-08-01',
      });
    }

    return xml;
  }

  /**
   * Get document template ID for document type
   */
  private getDocumentTemplateId(documentType: CCDADocumentTypeCode): string {
    switch (documentType) {
      case 'CCD':
        return DocumentTemplateIds.CCD;
      case 'DISCHARGE_SUMMARY':
        return DocumentTemplateIds.DISCHARGE_SUMMARY;
      case 'REFERRAL_NOTE':
        return DocumentTemplateIds.REFERRAL_NOTE;
      case 'PROGRESS_NOTE':
        return DocumentTemplateIds.PROGRESS_NOTE;
      case 'CONSULTATION_NOTE':
        return DocumentTemplateIds.CONSULTATION_NOTE;
      case 'HISTORY_AND_PHYSICAL':
        return DocumentTemplateIds.HISTORY_AND_PHYSICAL;
      case 'OPERATIVE_NOTE':
        return DocumentTemplateIds.OPERATIVE_NOTE;
      case 'CARE_PLAN':
        return DocumentTemplateIds.CARE_PLAN;
      default:
        return DocumentTemplateIds.CCD;
    }
  }

  /**
   * Get document code for document type
   */
  private getDocumentCode(documentType: CCDADocumentTypeCode): CE {
    const loincCode = DocumentLoincCodes[documentType] || DocumentLoincCodes.CCD;
    return {
      code: loincCode,
      codeSystem: LOINC_OID,
      codeSystemName: 'LOINC',
      displayName: this.getDocumentDisplayName(documentType),
    };
  }

  /**
   * Get document display name
   */
  private getDocumentDisplayName(documentType: CCDADocumentTypeCode): string {
    switch (documentType) {
      case 'CCD':
        return 'Continuity of Care Document';
      case 'DISCHARGE_SUMMARY':
        return 'Discharge Summary';
      case 'REFERRAL_NOTE':
        return 'Referral Note';
      case 'PROGRESS_NOTE':
        return 'Progress Note';
      case 'CONSULTATION_NOTE':
        return 'Consultation Note';
      case 'HISTORY_AND_PHYSICAL':
        return 'History and Physical';
      case 'OPERATIVE_NOTE':
        return 'Operative Note';
      case 'CARE_PLAN':
        return 'Care Plan';
      default:
        return 'Clinical Document';
    }
  }

  /**
   * Generate record target (patient)
   */
  private generateRecordTarget(recordTarget: CCDARecordTarget): string {
    let content = '';
    content += this.generatePatientRole(recordTarget.patientRole);
    return this.wrapElement('recordTarget', content);
  }

  /**
   * Generate patient role
   */
  private generatePatientRole(patientRole: CCDAPatientRole): string {
    let content = '';

    // IDs
    if (patientRole.id) {
      for (const id of patientRole.id) {
        content += this.generateII('id', id);
      }
    }

    // Addresses
    if (patientRole.addr) {
      for (const addr of patientRole.addr) {
        content += this.generateAD('addr', addr);
      }
    }

    // Telecoms
    if (patientRole.telecom) {
      for (const tel of patientRole.telecom) {
        content += this.generateTEL('telecom', tel);
      }
    }

    // Patient
    if (patientRole.patient) {
      content += this.generatePatient(patientRole.patient);
    }

    return this.wrapElement('patientRole', content);
  }

  /**
   * Generate patient demographics
   */
  private generatePatient(patient: CCDAPatient): string {
    let content = '';

    // Names
    if (patient.name) {
      for (const name of patient.name) {
        content += this.generatePN('name', name);
      }
    }

    // Administrative gender
    if (patient.administrativeGenderCode) {
      content += this.generateCE('administrativeGenderCode', patient.administrativeGenderCode);
    }

    // Birth time
    if (patient.birthTime) {
      content += this.generateTS('birthTime', patient.birthTime);
    }

    // Marital status
    if (patient.maritalStatusCode) {
      content += this.generateCE('maritalStatusCode', patient.maritalStatusCode);
    }

    // Race code
    if (patient.raceCode) {
      content += this.generateCE('raceCode', patient.raceCode);
    }

    // Ethnic group code
    if (patient.ethnicGroupCode) {
      content += this.generateCE('ethnicGroupCode', patient.ethnicGroupCode);
    }

    // Language communication
    if (patient.languageCommunication) {
      for (const lang of patient.languageCommunication) {
        let langContent = '';
        if (lang.languageCode) {
          langContent += this.generateElement('languageCode', { code: lang.languageCode.code || 'en-US' });
        }
        if (lang.preferenceInd !== undefined) {
          langContent += this.generateElement('preferenceInd', { value: lang.preferenceInd.toString() });
        }
        content += this.wrapElement('languageCommunication', langContent);
      }
    }

    return this.wrapElement('patient', content);
  }

  /**
   * Generate author
   */
  private generateAuthor(author: CCDAAuthor): string {
    let content = '';

    // Time
    if (author.time) {
      content += this.generateTS('time', author.time);
    }

    // Assigned author
    content += this.generateAssignedAuthor(author.assignedAuthor);

    return this.wrapElement('author', content);
  }

  /**
   * Generate assigned author
   */
  private generateAssignedAuthor(assignedAuthor: CCDAAssignedAuthor): string {
    let content = '';

    // IDs
    if (assignedAuthor.id) {
      for (const id of assignedAuthor.id) {
        content += this.generateII('id', id);
      }
    }

    // Code
    if (assignedAuthor.code) {
      content += this.generateCE('code', assignedAuthor.code);
    }

    // Addresses
    if (assignedAuthor.addr) {
      for (const addr of assignedAuthor.addr) {
        content += this.generateAD('addr', addr);
      }
    }

    // Telecoms
    if (assignedAuthor.telecom) {
      for (const tel of assignedAuthor.telecom) {
        content += this.generateTEL('telecom', tel);
      }
    }

    // Assigned person
    if (assignedAuthor.assignedPerson) {
      content += this.generatePerson('assignedPerson', assignedAuthor.assignedPerson);
    }

    // Represented organization
    if (assignedAuthor.representedOrganization) {
      content += this.generateOrganization('representedOrganization', assignedAuthor.representedOrganization);
    }

    return this.wrapElement('assignedAuthor', content);
  }

  /**
   * Generate person
   */
  private generatePerson(tagName: string, person: CCDAPerson): string {
    let content = '';

    if (person.name) {
      for (const name of person.name) {
        content += this.generatePN('name', name);
      }
    }

    return this.wrapElement(tagName, content);
  }

  /**
   * Generate organization
   */
  private generateOrganization(tagName: string, org: CCDAOrganization): string {
    let content = '';

    // IDs
    if (org.id) {
      for (const id of org.id) {
        content += this.generateII('id', id);
      }
    }

    // Names
    if (org.name) {
      for (const name of org.name) {
        content += this.generateTextElement('name', name.name || '');
      }
    }

    // Telecoms
    if (org.telecom) {
      for (const tel of org.telecom) {
        content += this.generateTEL('telecom', tel);
      }
    }

    // Addresses
    if (org.addr) {
      for (const addr of org.addr) {
        content += this.generateAD('addr', addr);
      }
    }

    return this.wrapElement(tagName, content);
  }

  /**
   * Generate custodian
   */
  private generateCustodian(custodian: CCDACustodian): string {
    let content = '';

    let acContent = '';
    acContent += this.generateOrganization(
      'representedCustodianOrganization',
      custodian.assignedCustodian.representedCustodianOrganization
    );
    content += this.wrapElement('assignedCustodian', acContent);

    return this.wrapElement('custodian', content);
  }

  /**
   * Generate documentation of
   */
  private generateDocumentationOf(docOf: { serviceEvent: any }): string {
    let content = '';

    const se = docOf.serviceEvent;
    let seContent = '';

    const seAttrs = se.classCode ? `classCode="${se.classCode}"` : 'classCode="PCPR"';

    if (se.code) {
      seContent += this.generateCE('code', se.code);
    }

    if (se.effectiveTime) {
      seContent += this.generateIVL_TS('effectiveTime', se.effectiveTime);
    }

    content += this.wrapElement('serviceEvent', seContent, seAttrs);

    return this.wrapElement('documentationOf', content);
  }

  /**
   * Generate component (body)
   */
  private generateComponent(structuredBody: { components: CCDAComponent[] }): string {
    let sbContent = '';

    for (const comp of structuredBody.components) {
      sbContent += this.generateSectionComponent(comp.section);
    }

    const sbElement = this.wrapElement('structuredBody', sbContent);
    return this.wrapElement('component', sbElement);
  }

  /**
   * Generate section component
   */
  private generateSectionComponent(section: CCDASection): string {
    const sectionContent = this.generateSection(section);
    return this.wrapElement('component', sectionContent);
  }

  /**
   * Generate section
   */
  private generateSection(section: CCDASection): string {
    let content = '';

    // Template IDs
    if (section.templateId) {
      for (const tid of section.templateId) {
        content += this.generateII('templateId', tid);
      }
    }

    // ID
    if (section.id) {
      content += this.generateII('id', section.id);
    }

    // Code
    if (section.code) {
      content += this.generateCE('code', section.code);
    }

    // Title
    if (section.title) {
      content += this.generateTextElement('title', section.title);
    }

    // Narrative text
    if (this.options.includeNarrative && section.text) {
      content += this.generateNarrativeText(section.text);
    }

    // Generate entries based on section type
    content += this.generateSectionEntries(section);

    return this.wrapElement('section', content);
  }

  /**
   * Generate narrative text block
   */
  private generateNarrativeText(text: CCDANarrativeBlock): string {
    // Wrap content in text element - content should be valid XHTML
    return this.wrapElement('text', text.content);
  }

  /**
   * Generate section entries based on section type
   */
  private generateSectionEntries(section: CCDASection): string {
    let content = '';

    // Determine section type by template ID and generate appropriate entries
    const templateId = section.templateId?.[0]?.root;

    if (this.isProblemsSection(section)) {
      const problemsSection = section as CCDAProblemsSection;
      if (problemsSection.entries) {
        for (const entry of problemsSection.entries) {
          content += this.generateProblemEntry(entry);
        }
      }
    } else if (this.isMedicationsSection(section)) {
      const medsSection = section as CCDAMedicationsSection;
      if (medsSection.entries) {
        for (const entry of medsSection.entries) {
          content += this.generateMedicationEntry(entry);
        }
      }
    } else if (this.isAllergiesSection(section)) {
      const allergiesSection = section as CCDAAllergiesSection;
      if (allergiesSection.entries) {
        for (const entry of allergiesSection.entries) {
          content += this.generateAllergyEntry(entry);
        }
      }
    } else if (this.isProceduresSection(section)) {
      const proceduresSection = section as CCDAProceduresSection;
      if (proceduresSection.entries) {
        for (const entry of proceduresSection.entries) {
          content += this.generateProcedureEntry(entry);
        }
      }
    } else if (this.isResultsSection(section)) {
      const resultsSection = section as CCDAResultsSection;
      if (resultsSection.entries) {
        for (const entry of resultsSection.entries) {
          content += this.generateResultEntry(entry);
        }
      }
    } else if (this.isVitalSignsSection(section)) {
      const vitalsSection = section as CCDAVitalSignsSection;
      if (vitalsSection.entries) {
        for (const entry of vitalsSection.entries) {
          content += this.generateVitalSignsEntry(entry);
        }
      }
    } else if (this.isImmunizationsSection(section)) {
      const immunizationsSection = section as CCDAImmunizationsSection;
      if (immunizationsSection.entries) {
        for (const entry of immunizationsSection.entries) {
          content += this.generateImmunizationEntry(entry);
        }
      }
    }

    return content;
  }

  /**
   * Type guards for section types
   */
  private isProblemsSection(section: CCDASection): section is CCDAProblemsSection {
    const templateId = section.templateId?.[0]?.root;
    return templateId === SectionTemplateIds.PROBLEMS ||
      templateId === SectionTemplateIds.PROBLEMS_ENTRIES_REQUIRED;
  }

  private isMedicationsSection(section: CCDASection): section is CCDAMedicationsSection {
    const templateId = section.templateId?.[0]?.root;
    return templateId === SectionTemplateIds.MEDICATIONS ||
      templateId === SectionTemplateIds.MEDICATIONS_ENTRIES_REQUIRED;
  }

  private isAllergiesSection(section: CCDASection): section is CCDAAllergiesSection {
    const templateId = section.templateId?.[0]?.root;
    return templateId === SectionTemplateIds.ALLERGIES ||
      templateId === SectionTemplateIds.ALLERGIES_ENTRIES_REQUIRED;
  }

  private isProceduresSection(section: CCDASection): section is CCDAProceduresSection {
    const templateId = section.templateId?.[0]?.root;
    return templateId === SectionTemplateIds.PROCEDURES ||
      templateId === SectionTemplateIds.PROCEDURES_ENTRIES_REQUIRED;
  }

  private isResultsSection(section: CCDASection): section is CCDAResultsSection {
    const templateId = section.templateId?.[0]?.root;
    return templateId === SectionTemplateIds.RESULTS ||
      templateId === SectionTemplateIds.RESULTS_ENTRIES_REQUIRED;
  }

  private isVitalSignsSection(section: CCDASection): section is CCDAVitalSignsSection {
    const templateId = section.templateId?.[0]?.root;
    return templateId === SectionTemplateIds.VITAL_SIGNS ||
      templateId === SectionTemplateIds.VITAL_SIGNS_ENTRIES_REQUIRED;
  }

  private isImmunizationsSection(section: CCDASection): section is CCDAImmunizationsSection {
    const templateId = section.templateId?.[0]?.root;
    return templateId === SectionTemplateIds.IMMUNIZATIONS ||
      templateId === SectionTemplateIds.IMMUNIZATIONS_ENTRIES_REQUIRED;
  }

  /**
   * Generate problem entry
   */
  private generateProblemEntry(concernAct: CCDAProblemConcernAct): string {
    let entryContent = '';
    let actContent = '';

    // Template IDs
    actContent += this.generateII('templateId', { root: EntryTemplateIds.PROBLEM_CONCERN_ACT, extension: '2015-08-01' });

    // IDs
    if (concernAct.id) {
      for (const id of concernAct.id) {
        actContent += this.generateII('id', id);
      }
    }

    // Code
    actContent += this.generateCD('code', concernAct.code || {
      code: ActCodes.CONCERN,
      codeSystem: HL7_ACTCODE_OID,
      displayName: 'Concern',
    });

    // Status code
    actContent += this.generateElement('statusCode', { code: concernAct.statusCode?.code || StatusCodes.ACTIVE });

    // Effective time
    if (concernAct.effectiveTime) {
      actContent += this.generateIVL_TS('effectiveTime', concernAct.effectiveTime);
    }

    // Problem observations
    if (concernAct.problemObservations) {
      for (const obs of concernAct.problemObservations) {
        actContent += this.generateProblemObservation(obs);
      }
    }

    entryContent += this.wrapElement('act', actContent, 'classCode="ACT" moodCode="EVN"');

    return this.wrapElement('entry', entryContent, 'typeCode="DRIV"');
  }

  /**
   * Generate problem observation
   */
  private generateProblemObservation(obs: CCDAProblemObservation): string {
    let erContent = '';
    let obsContent = '';

    // Template IDs
    obsContent += this.generateII('templateId', { root: EntryTemplateIds.PROBLEM_OBSERVATION, extension: '2015-08-01' });

    // IDs
    if (obs.id) {
      for (const id of obs.id) {
        obsContent += this.generateII('id', id);
      }
    }

    // Code
    obsContent += this.generateCD('code', obs.code || {
      code: 'ASSERTION',
      codeSystem: HL7_ACTCODE_OID,
    });

    // Status code
    obsContent += this.generateElement('statusCode', { code: obs.statusCode?.code || StatusCodes.COMPLETED });

    // Effective time
    if (obs.effectiveTime) {
      obsContent += this.generateIVL_TS('effectiveTime', obs.effectiveTime);
    }

    // Value (diagnosis code)
    if (obs.value) {
      obsContent += this.generateCD('value', obs.value, 'xsi:type="CD"');
    }

    erContent += this.wrapElement('observation', obsContent, 'classCode="OBS" moodCode="EVN"');

    return this.wrapElement('entryRelationship', erContent, 'typeCode="SUBJ"');
  }

  /**
   * Generate medication entry
   */
  private generateMedicationEntry(activity: CCDAMedicationActivity): string {
    let entryContent = '';
    let saContent = '';

    // Template IDs
    saContent += this.generateII('templateId', { root: EntryTemplateIds.MEDICATION_ACTIVITY, extension: '2014-06-09' });

    // IDs
    if (activity.id) {
      for (const id of activity.id) {
        saContent += this.generateII('id', id);
      }
    }

    // Status code
    saContent += this.generateElement('statusCode', { code: activity.statusCode?.code || StatusCodes.ACTIVE });

    // Effective time
    if (activity.effectiveTime) {
      saContent += this.generateIVL_TS('effectiveTime', activity.effectiveTime as IVL_TS);
    }

    // Route code
    if (activity.routeCode) {
      saContent += this.generateCE('routeCode', activity.routeCode);
    }

    // Dose quantity
    if (activity.doseQuantity) {
      saContent += this.generatePQ('doseQuantity', activity.doseQuantity);
    }

    // Consumable
    saContent += this.generateConsumable(activity.consumable);

    entryContent += this.wrapElement('substanceAdministration', saContent, 'classCode="SBADM" moodCode="EVN"');

    return this.wrapElement('entry', entryContent, 'typeCode="DRIV"');
  }

  /**
   * Generate consumable
   */
  private generateConsumable(consumable: any): string {
    let mpContent = '';

    // Template IDs
    mpContent += this.generateII('templateId', { root: EntryTemplateIds.MEDICATION_INFORMATION, extension: '2014-06-09' });

    // IDs
    if (consumable.manufacturedProduct?.id) {
      for (const id of consumable.manufacturedProduct.id) {
        mpContent += this.generateII('id', id);
      }
    }

    // Manufactured material
    if (consumable.manufacturedProduct?.manufacturedMaterial) {
      let mmContent = '';
      const mm = consumable.manufacturedProduct.manufacturedMaterial;

      if (mm.code) {
        mmContent += this.generateCE('code', mm.code);
      }

      mpContent += this.wrapElement('manufacturedMaterial', mmContent);
    }

    const mpElement = this.wrapElement('manufacturedProduct', mpContent, 'classCode="MANU"');
    return this.wrapElement('consumable', mpElement);
  }

  /**
   * Generate allergy entry
   */
  private generateAllergyEntry(concernAct: CCDAAllergyConcernAct): string {
    let entryContent = '';
    let actContent = '';

    // Template IDs
    actContent += this.generateII('templateId', { root: EntryTemplateIds.ALLERGY_CONCERN_ACT, extension: '2015-08-01' });

    // IDs
    if (concernAct.id) {
      for (const id of concernAct.id) {
        actContent += this.generateII('id', id);
      }
    }

    // Code
    actContent += this.generateCD('code', concernAct.code || {
      code: ActCodes.CONCERN,
      codeSystem: HL7_ACTCODE_OID,
      displayName: 'Concern',
    });

    // Status code
    actContent += this.generateElement('statusCode', { code: concernAct.statusCode?.code || StatusCodes.ACTIVE });

    // Effective time
    if (concernAct.effectiveTime) {
      actContent += this.generateIVL_TS('effectiveTime', concernAct.effectiveTime);
    }

    // Allergy observations
    if (concernAct.allergyObservations) {
      for (const obs of concernAct.allergyObservations) {
        actContent += this.generateAllergyObservation(obs);
      }
    }

    entryContent += this.wrapElement('act', actContent, 'classCode="ACT" moodCode="EVN"');

    return this.wrapElement('entry', entryContent, 'typeCode="DRIV"');
  }

  /**
   * Generate allergy observation
   */
  private generateAllergyObservation(obs: CCDAAllergyObservation): string {
    let erContent = '';
    let obsContent = '';

    // Template IDs
    obsContent += this.generateII('templateId', { root: EntryTemplateIds.ALLERGY_OBSERVATION, extension: '2014-06-09' });

    // IDs
    if (obs.id) {
      for (const id of obs.id) {
        obsContent += this.generateII('id', id);
      }
    }

    // Code
    obsContent += this.generateCD('code', obs.code || {
      code: 'ASSERTION',
      codeSystem: HL7_ACTCODE_OID,
    });

    // Status code
    obsContent += this.generateElement('statusCode', { code: obs.statusCode?.code || StatusCodes.COMPLETED });

    // Effective time
    if (obs.effectiveTime) {
      obsContent += this.generateIVL_TS('effectiveTime', obs.effectiveTime);
    }

    // Value (allergy type)
    if (obs.value) {
      obsContent += this.generateCD('value', obs.value, 'xsi:type="CD"');
    }

    // Reaction observations
    if (obs.reactionObservations) {
      for (const reaction of obs.reactionObservations) {
        obsContent += this.generateReactionObservation(reaction);
      }
    }

    // Severity observation
    if (obs.severityObservation) {
      obsContent += this.generateSeverityObservation(obs.severityObservation);
    }

    erContent += this.wrapElement('observation', obsContent, 'classCode="OBS" moodCode="EVN"');

    return this.wrapElement('entryRelationship', erContent, 'typeCode="SUBJ"');
  }

  /**
   * Generate reaction observation
   */
  private generateReactionObservation(reaction: CCDAReactionObservation): string {
    let erContent = '';
    let obsContent = '';

    // Template IDs
    obsContent += this.generateII('templateId', { root: EntryTemplateIds.REACTION_OBSERVATION, extension: '2014-06-09' });

    // IDs
    if (reaction.id) {
      for (const id of reaction.id) {
        obsContent += this.generateII('id', id);
      }
    }

    // Code
    obsContent += this.generateCD('code', reaction.code || {
      code: 'ASSERTION',
      codeSystem: HL7_ACTCODE_OID,
    });

    // Status code
    obsContent += this.generateElement('statusCode', { code: reaction.statusCode?.code || StatusCodes.COMPLETED });

    // Value (reaction)
    if (reaction.value) {
      obsContent += this.generateCD('value', reaction.value, 'xsi:type="CD"');
    }

    erContent += this.wrapElement('observation', obsContent, 'classCode="OBS" moodCode="EVN"');

    return this.wrapElement('entryRelationship', erContent, 'typeCode="MFST" inversionInd="true"');
  }

  /**
   * Generate severity observation
   */
  private generateSeverityObservation(severity: CCDASeverityObservation): string {
    let erContent = '';
    let obsContent = '';

    // Template IDs
    obsContent += this.generateII('templateId', { root: EntryTemplateIds.SEVERITY_OBSERVATION, extension: '2014-06-09' });

    // Code
    obsContent += this.generateCD('code', severity.code || {
      code: 'SEV',
      codeSystem: HL7_ACTCODE_OID,
      displayName: 'Severity Observation',
    });

    // Status code
    obsContent += this.generateElement('statusCode', { code: StatusCodes.COMPLETED });

    // Value (severity)
    if (severity.value) {
      obsContent += this.generateCD('value', severity.value, 'xsi:type="CD"');
    }

    erContent += this.wrapElement('observation', obsContent, 'classCode="OBS" moodCode="EVN"');

    return this.wrapElement('entryRelationship', erContent, 'typeCode="SUBJ" inversionInd="true"');
  }

  /**
   * Generate procedure entry
   */
  private generateProcedureEntry(procedure: CCDAProcedureEntry): string {
    let entryContent = '';
    let procContent = '';

    // Template IDs
    procContent += this.generateII('templateId', { root: EntryTemplateIds.PROCEDURE_ACTIVITY_PROCEDURE, extension: '2014-06-09' });

    // IDs
    if (procedure.id) {
      for (const id of procedure.id) {
        procContent += this.generateII('id', id);
      }
    }

    // Code
    if (procedure.code) {
      procContent += this.generateCD('code', procedure.code);
    }

    // Status code
    procContent += this.generateElement('statusCode', { code: procedure.statusCode?.code || StatusCodes.COMPLETED });

    // Effective time
    if (procedure.effectiveTime) {
      procContent += this.generateIVL_TS('effectiveTime', procedure.effectiveTime);
    }

    entryContent += this.wrapElement('procedure', procContent, 'classCode="PROC" moodCode="EVN"');

    return this.wrapElement('entry', entryContent, 'typeCode="DRIV"');
  }

  /**
   * Generate result entry (organizer)
   */
  private generateResultEntry(organizer: CCDAResultOrganizer): string {
    let entryContent = '';
    let orgContent = '';

    // Template IDs
    orgContent += this.generateII('templateId', { root: EntryTemplateIds.RESULT_ORGANIZER, extension: '2015-08-01' });

    // IDs
    if (organizer.id) {
      for (const id of organizer.id) {
        orgContent += this.generateII('id', id);
      }
    }

    // Code
    if (organizer.code) {
      orgContent += this.generateCD('code', organizer.code);
    }

    // Status code
    orgContent += this.generateElement('statusCode', { code: organizer.statusCode?.code || StatusCodes.COMPLETED });

    // Result observations
    if (organizer.resultObservations) {
      for (const obs of organizer.resultObservations) {
        orgContent += this.generateResultObservationComponent(obs);
      }
    }

    entryContent += this.wrapElement('organizer', orgContent, 'classCode="BATTERY" moodCode="EVN"');

    return this.wrapElement('entry', entryContent, 'typeCode="DRIV"');
  }

  /**
   * Generate result observation component
   */
  private generateResultObservationComponent(obs: CCDAResultObservation): string {
    let compContent = '';
    let obsContent = '';

    // Template IDs
    obsContent += this.generateII('templateId', { root: EntryTemplateIds.RESULT_OBSERVATION, extension: '2015-08-01' });

    // IDs
    if (obs.id) {
      for (const id of obs.id) {
        obsContent += this.generateII('id', id);
      }
    }

    // Code
    if (obs.code) {
      obsContent += this.generateCD('code', obs.code);
    }

    // Status code
    obsContent += this.generateElement('statusCode', { code: obs.statusCode?.code || StatusCodes.COMPLETED });

    // Effective time
    if (obs.effectiveTime) {
      if ('value' in obs.effectiveTime) {
        obsContent += this.generateTS('effectiveTime', obs.effectiveTime as TS);
      }
    }

    // Value
    if (obs.value) {
      if ('value' in obs.value && 'unit' in obs.value) {
        // PQ value
        obsContent += this.generatePQ('value', obs.value as PQ, 'xsi:type="PQ"');
      } else if ('code' in obs.value) {
        // CD value
        obsContent += this.generateCD('value', obs.value as CD, 'xsi:type="CD"');
      }
    }

    // Interpretation code
    if (obs.interpretationCode) {
      for (const ic of obs.interpretationCode) {
        obsContent += this.generateCE('interpretationCode', ic);
      }
    }

    compContent += this.wrapElement('observation', obsContent, 'classCode="OBS" moodCode="EVN"');

    return this.wrapElement('component', compContent);
  }

  /**
   * Generate vital signs entry (organizer)
   */
  private generateVitalSignsEntry(organizer: CCDAVitalSignsOrganizer): string {
    let entryContent = '';
    let orgContent = '';

    // Template IDs
    orgContent += this.generateII('templateId', { root: EntryTemplateIds.VITAL_SIGNS_ORGANIZER, extension: '2015-08-01' });

    // IDs
    if (organizer.id) {
      for (const id of organizer.id) {
        orgContent += this.generateII('id', id);
      }
    }

    // Code
    orgContent += this.generateCD('code', organizer.code || {
      code: '46680005',
      codeSystem: SNOMED_CT_OID,
      codeSystemName: 'SNOMED CT',
      displayName: 'Vital Signs',
    });

    // Status code
    orgContent += this.generateElement('statusCode', { code: organizer.statusCode?.code || StatusCodes.COMPLETED });

    // Effective time
    if (organizer.effectiveTime) {
      if ('value' in organizer.effectiveTime) {
        orgContent += this.generateTS('effectiveTime', organizer.effectiveTime as TS);
      }
    }

    // Vital sign observations
    if (organizer.vitalSignObservations) {
      for (const obs of organizer.vitalSignObservations) {
        orgContent += this.generateVitalSignObservationComponent(obs);
      }
    }

    entryContent += this.wrapElement('organizer', orgContent, 'classCode="CLUSTER" moodCode="EVN"');

    return this.wrapElement('entry', entryContent, 'typeCode="DRIV"');
  }

  /**
   * Generate vital sign observation component
   */
  private generateVitalSignObservationComponent(obs: CCDAVitalSignObservation): string {
    let compContent = '';
    let obsContent = '';

    // Template IDs
    obsContent += this.generateII('templateId', { root: EntryTemplateIds.VITAL_SIGN_OBSERVATION, extension: '2014-06-09' });

    // IDs
    if (obs.id) {
      for (const id of obs.id) {
        obsContent += this.generateII('id', id);
      }
    }

    // Code
    if (obs.code) {
      obsContent += this.generateCD('code', obs.code);
    }

    // Status code
    obsContent += this.generateElement('statusCode', { code: obs.statusCode?.code || StatusCodes.COMPLETED });

    // Effective time
    if (obs.effectiveTime) {
      obsContent += this.generateTS('effectiveTime', obs.effectiveTime);
    }

    // Value
    if (obs.value) {
      obsContent += this.generatePQ('value', obs.value, 'xsi:type="PQ"');
    }

    // Interpretation code
    if (obs.interpretationCode) {
      for (const ic of obs.interpretationCode) {
        obsContent += this.generateCE('interpretationCode', ic);
      }
    }

    compContent += this.wrapElement('observation', obsContent, 'classCode="OBS" moodCode="EVN"');

    return this.wrapElement('component', compContent);
  }

  /**
   * Generate immunization entry
   */
  private generateImmunizationEntry(activity: CCDAImmunizationActivity): string {
    let entryContent = '';
    let saContent = '';

    const negationInd = activity.negationInd ? 'negationInd="true"' : '';

    // Template IDs
    saContent += this.generateII('templateId', { root: EntryTemplateIds.IMMUNIZATION_ACTIVITY, extension: '2015-08-01' });

    // IDs
    if (activity.id) {
      for (const id of activity.id) {
        saContent += this.generateII('id', id);
      }
    }

    // Status code
    saContent += this.generateElement('statusCode', { code: activity.statusCode?.code || StatusCodes.COMPLETED });

    // Effective time
    if (activity.effectiveTime) {
      if ('value' in activity.effectiveTime) {
        saContent += this.generateTS('effectiveTime', activity.effectiveTime as TS);
      }
    }

    // Route code
    if (activity.routeCode) {
      saContent += this.generateCE('routeCode', activity.routeCode);
    }

    // Dose quantity
    if (activity.doseQuantity) {
      saContent += this.generatePQ('doseQuantity', activity.doseQuantity);
    }

    // Consumable
    saContent += this.generateImmunizationConsumable(activity.consumable);

    const attrs = `classCode="SBADM" moodCode="EVN"${negationInd ? ' ' + negationInd : ''}`;
    entryContent += this.wrapElement('substanceAdministration', saContent, attrs);

    return this.wrapElement('entry', entryContent, 'typeCode="DRIV"');
  }

  /**
   * Generate immunization consumable
   */
  private generateImmunizationConsumable(consumable: any): string {
    let mpContent = '';

    // Template IDs
    mpContent += this.generateII('templateId', { root: EntryTemplateIds.IMMUNIZATION_MEDICATION_INFORMATION, extension: '2014-06-09' });

    // Manufactured material
    if (consumable.manufacturedProduct?.manufacturedMaterial) {
      let mmContent = '';
      const mm = consumable.manufacturedProduct.manufacturedMaterial;

      if (mm.code) {
        mmContent += this.generateCE('code', mm.code);
      }

      if (mm.lotNumberText) {
        mmContent += this.generateTextElement('lotNumberText', mm.lotNumberText);
      }

      mpContent += this.wrapElement('manufacturedMaterial', mmContent);
    }

    const mpElement = this.wrapElement('manufacturedProduct', mpContent, 'classCode="MANU"');
    return this.wrapElement('consumable', mpElement);
  }

  // ==========================================================================
  // XML Generation Helpers
  // ==========================================================================

  /**
   * Generate II element
   */
  private generateII(tagName: string, ii: II): string {
    const attrs: string[] = [];
    attrs.push(`root="${this.escapeXml(ii.root)}"`);
    if (ii.extension) {
      attrs.push(`extension="${this.escapeXml(ii.extension)}"`);
    }
    if (ii.assigningAuthorityName) {
      attrs.push(`assigningAuthorityName="${this.escapeXml(ii.assigningAuthorityName)}"`);
    }
    return this.generateElement(tagName, null, attrs.join(' '));
  }

  /**
   * Generate CE element
   */
  private generateCE(tagName: string, ce: CE | undefined, additionalAttrs?: string): string {
    if (!ce) return '';

    const attrs: string[] = [];
    if (additionalAttrs) {
      attrs.push(additionalAttrs);
    }
    if (ce.code) {
      attrs.push(`code="${this.escapeXml(ce.code)}"`);
    }
    if (ce.codeSystem) {
      attrs.push(`codeSystem="${this.escapeXml(ce.codeSystem)}"`);
    }
    if (ce.codeSystemName) {
      attrs.push(`codeSystemName="${this.escapeXml(ce.codeSystemName)}"`);
    }
    if (ce.displayName) {
      attrs.push(`displayName="${this.escapeXml(ce.displayName)}"`);
    }
    if (ce.nullFlavor) {
      attrs.push(`nullFlavor="${ce.nullFlavor}"`);
    }

    return this.generateElement(tagName, null, attrs.join(' '));
  }

  /**
   * Generate CD element
   */
  private generateCD(tagName: string, cd: CD | undefined, additionalAttrs?: string): string {
    return this.generateCE(tagName, cd, additionalAttrs);
  }

  /**
   * Generate TS element
   */
  private generateTS(tagName: string, ts: TS | undefined): string {
    if (!ts) return '';

    const attrs: string[] = [];
    if (ts.value) {
      attrs.push(`value="${this.escapeXml(ts.value)}"`);
    }
    if (ts.nullFlavor) {
      attrs.push(`nullFlavor="${ts.nullFlavor}"`);
    }

    return this.generateElement(tagName, null, attrs.join(' '));
  }

  /**
   * Generate IVL_TS element
   */
  private generateIVL_TS(tagName: string, ivl: IVL_TS | undefined): string {
    if (!ivl) return '';

    let content = '';

    if (ivl.low) {
      content += this.generateTS('low', ivl.low);
    }
    if (ivl.high) {
      content += this.generateTS('high', ivl.high);
    }

    if (content) {
      return this.wrapElement(tagName, content);
    }

    // If no low/high, check for nullFlavor
    if (ivl.nullFlavor) {
      return this.generateElement(tagName, null, `nullFlavor="${ivl.nullFlavor}"`);
    }

    return '';
  }

  /**
   * Generate PQ element
   */
  private generatePQ(tagName: string, pq: PQ | undefined, additionalAttrs?: string): string {
    if (!pq) return '';

    const attrs: string[] = [];
    if (additionalAttrs) {
      attrs.push(additionalAttrs);
    }
    if (pq.value !== undefined) {
      attrs.push(`value="${pq.value}"`);
    }
    if (pq.unit) {
      attrs.push(`unit="${this.escapeXml(pq.unit)}"`);
    }
    if (pq.nullFlavor) {
      attrs.push(`nullFlavor="${pq.nullFlavor}"`);
    }

    return this.generateElement(tagName, null, attrs.join(' '));
  }

  /**
   * Generate AD element
   */
  private generateAD(tagName: string, ad: AD): string {
    let content = '';

    if (ad.streetAddressLine) {
      for (const line of ad.streetAddressLine) {
        content += this.generateTextElement('streetAddressLine', line);
      }
    }
    if (ad.city) {
      content += this.generateTextElement('city', ad.city);
    }
    if (ad.state) {
      content += this.generateTextElement('state', ad.state);
    }
    if (ad.postalCode) {
      content += this.generateTextElement('postalCode', ad.postalCode);
    }
    if (ad.country) {
      content += this.generateTextElement('country', ad.country);
    }

    const useAttr = ad.use && ad.use.length > 0 ? `use="${ad.use.join(' ')}"` : '';
    return this.wrapElement(tagName, content, useAttr);
  }

  /**
   * Generate TEL element
   */
  private generateTEL(tagName: string, tel: TEL): string {
    const attrs: string[] = [];
    if (tel.value) {
      attrs.push(`value="${this.escapeXml(tel.value)}"`);
    }
    if (tel.use && tel.use.length > 0) {
      attrs.push(`use="${tel.use.join(' ')}"`);
    }

    return this.generateElement(tagName, null, attrs.join(' '));
  }

  /**
   * Generate PN element
   */
  private generatePN(tagName: string, pn: PN): string {
    let content = '';

    if (pn.prefix) {
      for (const p of pn.prefix) {
        content += this.generateTextElement('prefix', p);
      }
    }
    if (pn.given) {
      for (const g of pn.given) {
        content += this.generateTextElement('given', g);
      }
    }
    if (pn.family) {
      content += this.generateTextElement('family', pn.family);
    }
    if (pn.suffix) {
      for (const s of pn.suffix) {
        content += this.generateTextElement('suffix', s);
      }
    }

    const useAttr = pn.use && pn.use.length > 0 ? `use="${pn.use.join(' ')}"` : '';
    return this.wrapElement(tagName, content, useAttr);
  }

  /**
   * Generate a simple element with attributes
   */
  private generateElement(tagName: string, attrs?: Record<string, string> | null, attrString?: string): string {
    let attrStr = attrString || '';

    if (attrs) {
      const attrParts = Object.entries(attrs)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${k}="${this.escapeXml(String(v))}"`);
      attrStr = attrParts.join(' ');
    }

    const indent = this.getIndent();

    if (attrStr) {
      return `${indent}<${tagName} ${attrStr}/>\n`;
    }
    return `${indent}<${tagName}/>\n`;
  }

  /**
   * Generate a text element
   */
  private generateTextElement(tagName: string, text: string): string {
    const indent = this.getIndent();
    return `${indent}<${tagName}>${this.escapeXml(text)}</${tagName}>\n`;
  }

  /**
   * Wrap content in an element
   */
  private wrapElement(tagName: string, content: string, attrs?: string): string {
    const indent = this.getIndent();
    const attrStr = attrs ? ` ${attrs}` : '';

    if (!content || content.trim() === '') {
      return `${indent}<${tagName}${attrStr}/>\n`;
    }

    this.currentIndent++;
    const result = `${indent}<${tagName}${attrStr}>\n${content}${indent}</${tagName}>\n`;
    this.currentIndent--;

    return result;
  }

  /**
   * Get current indentation string
   */
  private getIndent(): string {
    if (!this.options.prettyPrint) {
      return '';
    }
    return (this.options.indent || '  ').repeat(this.currentIndent);
  }

  /**
   * Escape XML special characters
   */
  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

/**
 * Convenience function to generate a C-CDA document
 */
export function generateCCDA(
  document: CCDADocument,
  documentType: CCDADocumentTypeCode = 'CCD',
  options?: CCDAGeneratorOptions
): string {
  const generator = new CCDAGenerator(options);
  return generator.generate(document, documentType);
}

/**
 * Create a new C-CDA document with required header elements
 */
export function createCCDADocument(params: {
  documentType: CCDADocumentTypeCode;
  patientId: string;
  patientName: { given: string[]; family: string };
  patientBirthDate: string;
  patientGender: string;
  authorId: string;
  authorName: { given: string[]; family: string };
  organizationId: string;
  organizationName: string;
  effectiveTime?: string;
}): CCDADocument {
  const now = params.effectiveTime || new Date().toISOString().replace(/[-:]/g, '').split('.')[0];

  return {
    realmCode: { code: 'US' },
    typeId: {
      root: '2.16.840.1.113883.1.3',
      extension: 'POCD_HD000040',
    },
    templateId: [
      { root: DocumentTemplateIds.US_REALM_HEADER, extension: '2015-08-01' },
    ],
    id: {
      root: DEFAULT_OPTIONS.organizationOid!,
      extension: `DOC-${Date.now()}`,
    },
    code: {
      code: DocumentLoincCodes[params.documentType],
      codeSystem: LOINC_OID,
      codeSystemName: 'LOINC',
    },
    title: getDocumentTitle(params.documentType),
    effectiveTime: { value: now },
    confidentialityCode: {
      code: 'N',
      codeSystem: HL7_CONFIDENTIALITY_OID,
    },
    languageCode: { code: 'en-US' },
    recordTarget: [{
      patientRole: {
        id: [{ root: params.organizationId, extension: params.patientId }],
        patient: {
          name: [{
            given: params.patientName.given,
            family: params.patientName.family,
          }],
          administrativeGenderCode: {
            code: params.patientGender,
            codeSystem: '2.16.840.1.113883.5.1',
          },
          birthTime: { value: params.patientBirthDate.replace(/-/g, '') },
        },
      },
    }],
    author: [{
      time: { value: now },
      assignedAuthor: {
        id: [{ root: params.organizationId, extension: params.authorId }],
        assignedPerson: {
          name: [{
            given: params.authorName.given,
            family: params.authorName.family,
          }],
        },
        representedOrganization: {
          id: [{ root: params.organizationId }],
          name: [{ name: params.organizationName }],
        },
      },
    }],
    custodian: {
      assignedCustodian: {
        representedCustodianOrganization: {
          id: [{ root: params.organizationId }],
          name: [{ name: params.organizationName }],
        },
      },
    },
    component: {
      structuredBody: {
        components: [],
      },
    },
  };
}

/**
 * Get document title for document type
 */
function getDocumentTitle(documentType: CCDADocumentTypeCode): string {
  switch (documentType) {
    case 'CCD':
      return 'Continuity of Care Document';
    case 'DISCHARGE_SUMMARY':
      return 'Discharge Summary';
    case 'REFERRAL_NOTE':
      return 'Referral Note';
    case 'PROGRESS_NOTE':
      return 'Progress Note';
    case 'CONSULTATION_NOTE':
      return 'Consultation Note';
    case 'HISTORY_AND_PHYSICAL':
      return 'History and Physical';
    case 'OPERATIVE_NOTE':
      return 'Operative Note';
    case 'CARE_PLAN':
      return 'Care Plan';
    default:
      return 'Clinical Document';
  }
}
