import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const prisma = new PrismaClient();

export interface CCDADocument {
  id: string;
  documentType: string;
  patientId: string;
  title?: string;
  creationTime: Date;
  author?: {
    id?: string;
    name?: string;
    organization?: string;
  };
  sections: CCDASection[];
  rawXml?: string;
}

export interface CCDASection {
  code: string;
  title: string;
  content: any;
}

export interface CCDAQueryParams {
  patientId?: string;
  documentType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  authorOrganization?: string;
}

export class CCDAExchangeService {
  private parser: XMLParser;
  private builder: XMLBuilder;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseAttributeValue: true,
    });

    this.builder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      format: true,
    });
  }

  /**
   * Parse a C-CDA document from XML
   */
  parse(xmlContent: string): CCDADocument {
    const parsed = this.parser.parse(xmlContent);
    const clinicalDocument = parsed.ClinicalDocument;

    if (!clinicalDocument) {
      throw new Error('Invalid C-CDA document: missing ClinicalDocument root element');
    }

    // Extract document ID
    const id = this.extractId(clinicalDocument.id);

    // Extract document type from templateId
    const documentType = this.determineDocumentType(clinicalDocument.templateId);

    // Extract patient ID from recordTarget
    const patientId = this.extractPatientId(clinicalDocument.recordTarget);

    // Extract creation time
    const creationTime = this.parseHL7DateTime(clinicalDocument.effectiveTime?.['@_value']);

    // Extract author information
    const author = this.extractAuthor(clinicalDocument.author);

    // Extract title
    const title = clinicalDocument.title || documentType;

    // Extract sections from structuredBody
    const sections = this.extractSections(clinicalDocument.component?.structuredBody?.component);

    return {
      id,
      documentType,
      patientId,
      title,
      creationTime,
      author,
      sections,
      rawXml: xmlContent,
    };
  }

  /**
   * Generate a C-CDA document from structured data
   */
  generate(data: {
    documentType: string;
    patientId: string;
    patient: {
      firstName: string;
      lastName: string;
      dob: string;
      gender: string;
      address?: any;
      phone?: string;
    };
    author: {
      name: string;
      organization: string;
      npi?: string;
    };
    sections: Array<{
      code: string;
      title: string;
      entries: any[];
    }>;
  }): string {
    const documentId = uuidv4();
    const now = new Date();

    const clinicalDocument = {
      ClinicalDocument: {
        '@_xmlns': 'urn:hl7-org:v3',
        '@_xmlns:sdtc': 'urn:hl7-org:sdtc',
        '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        realmCode: { '@_code': 'US' },
        typeId: { '@_root': '2.16.840.1.113883.1.3', '@_extension': 'POCD_HD000040' },
        templateId: this.getTemplateIds(data.documentType),
        id: { '@_root': '2.16.840.1.113883.19', '@_extension': documentId },
        code: this.getDocumentCode(data.documentType),
        title: data.sections[0]?.title || 'Clinical Document',
        effectiveTime: { '@_value': this.formatHL7DateTime(now) },
        confidentialityCode: { '@_code': 'N', '@_codeSystem': '2.16.840.1.113883.5.25' },
        languageCode: { '@_code': 'en-US' },
        recordTarget: {
          patientRole: {
            id: { '@_root': '2.16.840.1.113883.19', '@_extension': data.patientId },
            addr: this.formatAddress(data.patient.address),
            telecom: data.patient.phone ? { '@_value': `tel:${data.patient.phone}` } : undefined,
            patient: {
              name: {
                given: data.patient.firstName,
                family: data.patient.lastName,
              },
              administrativeGenderCode: {
                '@_code': data.patient.gender === 'male' ? 'M' : 'F',
                '@_codeSystem': '2.16.840.1.113883.5.1',
              },
              birthTime: { '@_value': data.patient.dob.replace(/-/g, '') },
            },
          },
        },
        author: {
          time: { '@_value': this.formatHL7DateTime(now) },
          assignedAuthor: {
            id: data.author.npi
              ? { '@_root': '2.16.840.1.113883.4.6', '@_extension': data.author.npi }
              : { '@_nullFlavor': 'UNK' },
            assignedPerson: {
              name: data.author.name,
            },
            representedOrganization: {
              name: data.author.organization,
            },
          },
        },
        custodian: {
          assignedCustodian: {
            representedCustodianOrganization: {
              id: { '@_root': '2.16.840.1.113883.19' },
              name: data.author.organization,
            },
          },
        },
        component: {
          structuredBody: {
            component: data.sections.map((section) => this.buildSection(section)),
          },
        },
      },
    };

    return this.builder.build(clinicalDocument);
  }

  /**
   * Store a C-CDA document
   */
  async store(document: CCDADocument, source?: string): Promise<string> {
    const contentHash = crypto
      .createHash('sha256')
      .update(document.rawXml || '')
      .digest('hex');

    const stored = await prisma.cCDADocument.create({
      data: {
        documentId: document.id,
        documentType: this.mapDocumentType(document.documentType),
        patientId: document.patientId,
        title: document.title,
        creationTime: document.creationTime,
        effectiveTime: document.creationTime,
        authorId: document.author?.id,
        authorName: document.author?.name,
        authorOrganization: document.author?.organization,
        contentHash,
        sizeBytes: document.rawXml?.length || 0,
        exchangeStatus: source ? 'received' : 'local',
        sourceOrganization: source,
      },
    });

    return stored.id;
  }

  /**
   * Query C-CDA documents
   */
  async query(params: CCDAQueryParams): Promise<CCDADocument[]> {
    const where: any = {};

    if (params.patientId) {
      where.patientId = params.patientId;
    }
    if (params.documentType) {
      where.documentType = params.documentType;
    }
    if (params.dateFrom || params.dateTo) {
      where.creationTime = {};
      if (params.dateFrom) where.creationTime.gte = params.dateFrom;
      if (params.dateTo) where.creationTime.lte = params.dateTo;
    }
    if (params.authorOrganization) {
      where.authorOrganization = { contains: params.authorOrganization, mode: 'insensitive' };
    }

    const documents = await prisma.cCDADocument.findMany({
      where,
      orderBy: { creationTime: 'desc' },
      take: 100,
    });

    return documents.map((doc) => ({
      id: doc.documentId,
      documentType: doc.documentType,
      patientId: doc.patientId,
      title: doc.title || undefined,
      creationTime: doc.creationTime,
      author: {
        id: doc.authorId || undefined,
        name: doc.authorName || undefined,
        organization: doc.authorOrganization || undefined,
      },
      sections: [],
    }));
  }

  /**
   * Retrieve a C-CDA document by ID
   */
  async retrieve(documentId: string): Promise<CCDADocument | null> {
    const doc = await prisma.cCDADocument.findUnique({
      where: { documentId },
    });

    if (!doc) {
      return null;
    }

    return {
      id: doc.documentId,
      documentType: doc.documentType,
      patientId: doc.patientId,
      title: doc.title || undefined,
      creationTime: doc.creationTime,
      author: {
        id: doc.authorId || undefined,
        name: doc.authorName || undefined,
        organization: doc.authorOrganization || undefined,
      },
      sections: [],
    };
  }

  /**
   * Validate a C-CDA document against schema
   */
  validate(xmlContent: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      const parsed = this.parser.parse(xmlContent);

      if (!parsed.ClinicalDocument) {
        errors.push('Missing ClinicalDocument root element');
        return { valid: false, errors };
      }

      const doc = parsed.ClinicalDocument;

      // Required elements
      if (!doc.typeId) errors.push('Missing typeId element');
      if (!doc.id) errors.push('Missing id element');
      if (!doc.code) errors.push('Missing code element');
      if (!doc.effectiveTime) errors.push('Missing effectiveTime element');
      if (!doc.recordTarget) errors.push('Missing recordTarget element');
      if (!doc.author) errors.push('Missing author element');
      if (!doc.custodian) errors.push('Missing custodian element');

      // Validate patient information
      if (doc.recordTarget?.patientRole) {
        const patientRole = doc.recordTarget.patientRole;
        if (!patientRole.id) errors.push('Missing patient id');
        if (!patientRole.patient) errors.push('Missing patient element');
      }

      return { valid: errors.length === 0, errors };
    } catch (error: any) {
      errors.push(`XML parsing error: ${error.message}`);
      return { valid: false, errors };
    }
  }

  /**
   * Convert C-CDA to FHIR Bundle
   */
  toFhir(document: CCDADocument): any {
    const bundle: any = {
      resourceType: 'Bundle',
      type: 'document',
      timestamp: document.creationTime.toISOString(),
      entry: [],
    };

    // Add Patient resource
    const patientResource = {
      resourceType: 'Patient',
      id: document.patientId,
    };
    bundle.entry.push({ resource: patientResource });

    // Add Composition resource
    const composition = {
      resourceType: 'Composition',
      id: document.id,
      status: 'final',
      type: {
        coding: [
          {
            system: 'http://loinc.org',
            code: this.getLoincCode(document.documentType),
            display: document.title,
          },
        ],
      },
      subject: { reference: `Patient/${document.patientId}` },
      date: document.creationTime.toISOString(),
      author: document.author
        ? [{ display: document.author.name }]
        : [],
      title: document.title,
      section: document.sections.map((section) => ({
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: section.code,
              display: section.title,
            },
          ],
        },
        title: section.title,
      })),
    };
    bundle.entry.push({ resource: composition });

    return bundle;
  }

  // Helper methods
  private extractId(idElement: any): string {
    if (!idElement) return uuidv4();
    if (Array.isArray(idElement)) {
      const id = idElement.find((i) => i['@_extension']);
      return id?.['@_extension'] || idElement[0]?.['@_root'] || uuidv4();
    }
    return idElement['@_extension'] || idElement['@_root'] || uuidv4();
  }

  private determineDocumentType(templateId: any): string {
    const templates = Array.isArray(templateId) ? templateId : [templateId];
    const templateRoots = templates.map((t) => t?.['@_root']).filter(Boolean);

    const typeMap: Record<string, string> = {
      '2.16.840.1.113883.10.20.22.1.2': 'ccd',
      '2.16.840.1.113883.10.20.22.1.8': 'discharge_summary',
      '2.16.840.1.113883.10.20.22.1.9': 'progress_note',
      '2.16.840.1.113883.10.20.22.1.3': 'history_and_physical',
      '2.16.840.1.113883.10.20.22.1.4': 'consultation_note',
      '2.16.840.1.113883.10.20.22.1.7': 'operative_note',
      '2.16.840.1.113883.10.20.22.1.6': 'procedure_note',
      '2.16.840.1.113883.10.20.22.1.14': 'referral_note',
      '2.16.840.1.113883.10.20.22.1.13': 'transfer_summary',
      '2.16.840.1.113883.10.20.22.1.15': 'care_plan',
    };

    for (const root of templateRoots) {
      if (typeMap[root]) {
        return typeMap[root];
      }
    }

    return 'unstructured';
  }

  private extractPatientId(recordTarget: any): string {
    const patientRole = recordTarget?.patientRole;
    if (!patientRole) return '';

    const id = Array.isArray(patientRole.id) ? patientRole.id[0] : patientRole.id;
    return id?.['@_extension'] || '';
  }

  private parseHL7DateTime(value: string | undefined): Date {
    if (!value) return new Date();

    // HL7 datetime format: YYYYMMDDHHMMSS.SSSZ or YYYYMMDD
    const year = parseInt(value.substring(0, 4));
    const month = parseInt(value.substring(4, 6)) - 1;
    const day = parseInt(value.substring(6, 8));
    const hour = value.length >= 10 ? parseInt(value.substring(8, 10)) : 0;
    const minute = value.length >= 12 ? parseInt(value.substring(10, 12)) : 0;
    const second = value.length >= 14 ? parseInt(value.substring(12, 14)) : 0;

    return new Date(year, month, day, hour, minute, second);
  }

  private formatHL7DateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private extractAuthor(author: any): CCDADocument['author'] {
    if (!author) return undefined;

    const firstAuthor = Array.isArray(author) ? author[0] : author;
    const assignedAuthor = firstAuthor?.assignedAuthor;

    return {
      id: assignedAuthor?.id?.['@_extension'],
      name:
        typeof assignedAuthor?.assignedPerson?.name === 'string'
          ? assignedAuthor.assignedPerson.name
          : [
              assignedAuthor?.assignedPerson?.name?.given,
              assignedAuthor?.assignedPerson?.name?.family,
            ]
              .filter(Boolean)
              .join(' '),
      organization:
        typeof assignedAuthor?.representedOrganization?.name === 'string'
          ? assignedAuthor.representedOrganization.name
          : undefined,
    };
  }

  private extractSections(components: any): CCDASection[] {
    if (!components) return [];

    const componentArray = Array.isArray(components) ? components : [components];

    return componentArray
      .filter((c) => c?.section)
      .map((c) => ({
        code: c.section.code?.['@_code'] || '',
        title:
          typeof c.section.title === 'string'
            ? c.section.title
            : c.section.title?.['#text'] || '',
        content: c.section.text || c.section.entry || null,
      }));
  }

  private getTemplateIds(documentType: string): any[] {
    const baseTemplates = [
      { '@_root': '2.16.840.1.113883.10.20.22.1.1' }, // US Realm Header
    ];

    const typeTemplates: Record<string, string> = {
      ccd: '2.16.840.1.113883.10.20.22.1.2',
      discharge_summary: '2.16.840.1.113883.10.20.22.1.8',
      progress_note: '2.16.840.1.113883.10.20.22.1.9',
      history_and_physical: '2.16.840.1.113883.10.20.22.1.3',
      consultation_note: '2.16.840.1.113883.10.20.22.1.4',
      operative_note: '2.16.840.1.113883.10.20.22.1.7',
      procedure_note: '2.16.840.1.113883.10.20.22.1.6',
      referral_note: '2.16.840.1.113883.10.20.22.1.14',
      transfer_summary: '2.16.840.1.113883.10.20.22.1.13',
      care_plan: '2.16.840.1.113883.10.20.22.1.15',
    };

    if (typeTemplates[documentType]) {
      baseTemplates.push({ '@_root': typeTemplates[documentType] });
    }

    return baseTemplates;
  }

  private getDocumentCode(documentType: string): any {
    const codes: Record<string, { code: string; displayName: string }> = {
      ccd: { code: '34133-9', displayName: 'Summarization of Episode Note' },
      discharge_summary: { code: '18842-5', displayName: 'Discharge Summary' },
      progress_note: { code: '11506-3', displayName: 'Progress Note' },
      history_and_physical: { code: '34117-2', displayName: 'History and Physical Note' },
      consultation_note: { code: '11488-4', displayName: 'Consultation Note' },
      operative_note: { code: '11504-8', displayName: 'Operative Note' },
      procedure_note: { code: '28570-0', displayName: 'Procedure Note' },
      referral_note: { code: '57133-1', displayName: 'Referral Note' },
      transfer_summary: { code: '18761-7', displayName: 'Transfer Summary Note' },
      care_plan: { code: '18776-5', displayName: 'Plan of Care Note' },
    };

    const typeCode = codes[documentType] || codes.ccd;

    return {
      '@_code': typeCode.code,
      '@_codeSystem': '2.16.840.1.113883.6.1',
      '@_codeSystemName': 'LOINC',
      '@_displayName': typeCode.displayName,
    };
  }

  private getLoincCode(documentType: string): string {
    const codes: Record<string, string> = {
      ccd: '34133-9',
      discharge_summary: '18842-5',
      progress_note: '11506-3',
      history_and_physical: '34117-2',
      consultation_note: '11488-4',
      operative_note: '11504-8',
      procedure_note: '28570-0',
      referral_note: '57133-1',
      transfer_summary: '18761-7',
      care_plan: '18776-5',
    };
    return codes[documentType] || '34133-9';
  }

  private formatAddress(address: any): any {
    if (!address) return { '@_nullFlavor': 'UNK' };

    return {
      streetAddressLine: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.zip,
      country: address.country || 'US',
    };
  }

  private buildSection(section: { code: string; title: string; entries: any[] }): any {
    return {
      section: {
        templateId: { '@_root': '2.16.840.1.113883.10.20.22.2.1' },
        code: {
          '@_code': section.code,
          '@_codeSystem': '2.16.840.1.113883.6.1',
          '@_codeSystemName': 'LOINC',
          '@_displayName': section.title,
        },
        title: section.title,
        text: this.buildNarrativeText(section.entries),
        entry: section.entries.map((e) => this.buildEntry(e)),
      },
    };
  }

  private buildNarrativeText(entries: any[]): any {
    // Build human-readable narrative
    return {
      table: {
        tbody: {
          tr: entries.map((e, i) => ({
            td: [e.display || e.code || `Entry ${i + 1}`],
          })),
        },
      },
    };
  }

  private buildEntry(entry: any): any {
    // Build machine-readable entry
    return {
      observation: {
        '@_classCode': 'OBS',
        '@_moodCode': 'EVN',
        templateId: { '@_root': '2.16.840.1.113883.10.20.22.4.2' },
        id: { '@_root': uuidv4() },
        code: {
          '@_code': entry.code,
          '@_codeSystem': entry.codeSystem || '2.16.840.1.113883.6.1',
          '@_displayName': entry.display,
        },
        statusCode: { '@_code': 'completed' },
        effectiveTime: entry.effectiveTime
          ? { '@_value': entry.effectiveTime }
          : undefined,
        value: entry.value
          ? {
              '@_xsi:type': 'PQ',
              '@_value': entry.value,
              '@_unit': entry.unit || '',
            }
          : undefined,
      },
    };
  }

  private mapDocumentType(type: string): any {
    return type as any;
  }
}

export default new CCDAExchangeService();
