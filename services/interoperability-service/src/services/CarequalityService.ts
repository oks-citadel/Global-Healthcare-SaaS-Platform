import axios, { AxiosInstance } from 'axios';
import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

const prisma = new PrismaClient();

export interface CarequalityQuery {
  queryType: 'patient-discovery' | 'document-query' | 'document-retrieve';
  patient?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
    identifiers?: Array<{
      value: string;
      system: string;
    }>;
  };
  documentQuery?: {
    patientId: string;
    homeCommunityId: string;
    documentType?: string[];
    dateFrom?: string;
    dateTo?: string;
  };
  documentRetrieve?: {
    documentUniqueId: string;
    repositoryUniqueId: string;
    homeCommunityId: string;
  };
  purposeOfUse: string;
  requestingOrganization: {
    name: string;
    oid: string;
    homeCommunityId: string;
  };
  targetCommunities?: string[];
}

export interface CarequalityResponse {
  success: boolean;
  queryId: string;
  results?: any[];
  errors?: string[];
}

export class CarequalityService {
  private httpClient: AxiosInstance;
  private xmlParser: XMLParser;
  private xmlBuilder: XMLBuilder;
  private carequalityDirectory: Map<string, any> = new Map();

  constructor() {
    this.httpClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/soap+xml',
        'Accept': 'application/soap+xml',
      },
    });

    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    this.xmlBuilder = new XMLBuilder({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      format: true,
    });

    this.loadDirectory();
  }

  /**
   * Load Carequality directory
   */
  private async loadDirectory(): Promise<void> {
    // In production, this would fetch from Carequality directory service
    // For now, initialize with mock data
    const communities = [
      {
        homeCommunityId: '2.16.840.1.113883.3.6147',
        name: 'Epic Systems',
        endpoint: 'https://epic.example.org/carequality',
        services: ['XCPD', 'XCA-Query', 'XCA-Retrieve'],
      },
      {
        homeCommunityId: '2.16.840.1.113883.3.464',
        name: 'Cerner',
        endpoint: 'https://cerner.example.org/carequality',
        services: ['XCPD', 'XCA-Query', 'XCA-Retrieve'],
      },
    ];

    communities.forEach((c) => this.carequalityDirectory.set(c.homeCommunityId, c));
  }

  /**
   * Execute a Carequality query
   */
  async query(request: CarequalityQuery): Promise<CarequalityResponse> {
    const queryId = uuidv4();

    try {
      switch (request.queryType) {
        case 'patient-discovery':
          return await this.executePatientDiscovery(request, queryId);
        case 'document-query':
          return await this.executeDocumentQuery(request, queryId);
        case 'document-retrieve':
          return await this.executeDocumentRetrieve(request, queryId);
        default:
          return {
            success: false,
            queryId,
            errors: [`Unsupported query type: ${request.queryType}`],
          };
      }
    } catch (error: any) {
      logger.error('Carequality query failed', { queryId, error: error.message });
      return {
        success: false,
        queryId,
        errors: [error.message],
      };
    }
  }

  /**
   * Execute XCPD Patient Discovery
   */
  private async executePatientDiscovery(
    request: CarequalityQuery,
    queryId: string
  ): Promise<CarequalityResponse> {
    const results: any[] = [];
    const errors: string[] = [];

    // Get target communities
    const targetCommunities = request.targetCommunities?.length
      ? request.targetCommunities
      : Array.from(this.carequalityDirectory.keys());

    // Build XCPD request
    const xcpdRequest = this.buildXCPDRequest(request, queryId);

    // Query each community
    const promises = targetCommunities.map(async (communityId) => {
      const community = this.carequalityDirectory.get(communityId);
      if (!community || !community.services.includes('XCPD')) {
        return;
      }

      try {
        const response = await this.sendXCPDRequest(community, xcpdRequest);
        const patients = this.parseXCPDResponse(response);
        results.push(
          ...patients.map((p: any) => ({
            ...p,
            homeCommunityId: communityId,
            source: community.name,
          }))
        );
      } catch (error: any) {
        errors.push(`${community.name}: ${error.message}`);
      }
    });

    await Promise.all(promises);

    // Log the query
    await this.logQuery(queryId, 'patient-discovery', request, results.length, errors);

    return {
      success: errors.length === 0 || results.length > 0,
      queryId,
      results,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Execute XCA Document Query
   */
  private async executeDocumentQuery(
    request: CarequalityQuery,
    queryId: string
  ): Promise<CarequalityResponse> {
    if (!request.documentQuery) {
      return {
        success: false,
        queryId,
        errors: ['Document query parameters required'],
      };
    }

    const community = this.carequalityDirectory.get(request.documentQuery.homeCommunityId);
    if (!community) {
      return {
        success: false,
        queryId,
        errors: ['Home community not found'],
      };
    }

    try {
      // Build XCA query request
      const xcaRequest = this.buildXCAQueryRequest(request, queryId);

      // Send request
      const response = await this.sendXCAQueryRequest(community, xcaRequest);
      const documents = this.parseXCAQueryResponse(response);

      // Log the query
      await this.logQuery(queryId, 'document-query', request, documents.length, []);

      return {
        success: true,
        queryId,
        results: documents,
      };
    } catch (error: any) {
      await this.logQuery(queryId, 'document-query', request, 0, [error.message]);
      return {
        success: false,
        queryId,
        errors: [error.message],
      };
    }
  }

  /**
   * Execute XCA Document Retrieve
   */
  private async executeDocumentRetrieve(
    request: CarequalityQuery,
    queryId: string
  ): Promise<CarequalityResponse> {
    if (!request.documentRetrieve) {
      return {
        success: false,
        queryId,
        errors: ['Document retrieve parameters required'],
      };
    }

    const community = this.carequalityDirectory.get(request.documentRetrieve.homeCommunityId);
    if (!community) {
      return {
        success: false,
        queryId,
        errors: ['Home community not found'],
      };
    }

    try {
      // Build XCA retrieve request
      const xcaRequest = this.buildXCARetrieveRequest(request, queryId);

      // Send request
      const response = await this.sendXCARetrieveRequest(community, xcaRequest);
      const document = this.parseXCARetrieveResponse(response);

      // Log the query
      await this.logQuery(queryId, 'document-retrieve', request, document ? 1 : 0, []);

      return {
        success: !!document,
        queryId,
        results: document ? [document] : [],
      };
    } catch (error: any) {
      await this.logQuery(queryId, 'document-retrieve', request, 0, [error.message]);
      return {
        success: false,
        queryId,
        errors: [error.message],
      };
    }
  }

  /**
   * Build XCPD (Cross-Community Patient Discovery) request
   */
  private buildXCPDRequest(request: CarequalityQuery, queryId: string): string {
    const patient = request.patient || {};

    const soapEnvelope = {
      'soap:Envelope': {
        '@_xmlns:soap': 'http://www.w3.org/2003/05/soap-envelope',
        '@_xmlns:urn': 'urn:hl7-org:v3',
        '@_xmlns:wsa': 'http://www.w3.org/2005/08/addressing',
        'soap:Header': {
          'wsa:Action': 'urn:hl7-org:v3:PRPA_IN201305UV02:CrossGatewayPatientDiscovery',
          'wsa:MessageID': `urn:uuid:${queryId}`,
          'wsa:To': 'http://carequality.example.org/xcpd',
        },
        'soap:Body': {
          'urn:PRPA_IN201305UV02': {
            '@_ITSVersion': 'XML_1.0',
            'urn:id': { '@_root': '2.16.840.1.113883.1.6', '@_extension': queryId },
            'urn:creationTime': { '@_value': this.formatHL7DateTime(new Date()) },
            'urn:interactionId': { '@_root': '2.16.840.1.113883.1.6', '@_extension': 'PRPA_IN201305UV02' },
            'urn:processingCode': { '@_code': 'P' },
            'urn:processingModeCode': { '@_code': 'T' },
            'urn:acceptAckCode': { '@_code': 'AL' },
            'urn:receiver': {
              '@_typeCode': 'RCV',
              'urn:device': {
                '@_classCode': 'DEV',
                '@_determinerCode': 'INSTANCE',
                'urn:id': { '@_root': '2.16.840.1.113883.3.6147' },
              },
            },
            'urn:sender': {
              '@_typeCode': 'SND',
              'urn:device': {
                '@_classCode': 'DEV',
                '@_determinerCode': 'INSTANCE',
                'urn:id': { '@_root': request.requestingOrganization.oid },
              },
            },
            'urn:controlActProcess': {
              '@_classCode': 'CACT',
              '@_moodCode': 'EVN',
              'urn:code': { '@_code': 'PRPA_TE201305UV02' },
              'urn:queryByParameter': {
                'urn:queryId': { '@_root': '2.16.840.1.113883.1.6', '@_extension': queryId },
                'urn:statusCode': { '@_code': 'new' },
                'urn:responseModalityCode': { '@_code': 'R' },
                'urn:responsePriorityCode': { '@_code': 'I' },
                'urn:parameterList': {
                  'urn:livingSubjectName': patient.firstName || patient.lastName ? {
                    'urn:value': {
                      'urn:given': patient.firstName,
                      'urn:family': patient.lastName,
                    },
                    'urn:semanticsText': 'LivingSubject.name',
                  } : undefined,
                  'urn:livingSubjectBirthTime': patient.dateOfBirth ? {
                    'urn:value': { '@_value': patient.dateOfBirth.replace(/-/g, '') },
                    'urn:semanticsText': 'LivingSubject.birthTime',
                  } : undefined,
                  'urn:livingSubjectAdministrativeGender': patient.gender ? {
                    'urn:value': { '@_code': patient.gender === 'male' ? 'M' : 'F' },
                    'urn:semanticsText': 'LivingSubject.administrativeGender',
                  } : undefined,
                },
              },
            },
          },
        },
      },
    };

    return this.xmlBuilder.build(soapEnvelope);
  }

  /**
   * Build XCA Query request
   */
  private buildXCAQueryRequest(request: CarequalityQuery, queryId: string): string {
    const docQuery = request.documentQuery!;

    const soapEnvelope = {
      'soap:Envelope': {
        '@_xmlns:soap': 'http://www.w3.org/2003/05/soap-envelope',
        '@_xmlns:query': 'urn:oasis:names:tc:ebxml-regrep:xsd:query:3.0',
        '@_xmlns:rim': 'urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0',
        '@_xmlns:wsa': 'http://www.w3.org/2005/08/addressing',
        'soap:Header': {
          'wsa:Action': 'urn:ihe:iti:2007:CrossGatewayQuery',
          'wsa:MessageID': `urn:uuid:${queryId}`,
        },
        'soap:Body': {
          'query:AdhocQueryRequest': {
            '@_federated': 'false',
            'rim:AdhocQuery': {
              '@_id': 'urn:uuid:14d4debf-8f97-4251-9a74-a90016b0af0d',
              'rim:Slot': [
                {
                  '@_name': '$XDSDocumentEntryPatientId',
                  'rim:ValueList': {
                    'rim:Value': `'${docQuery.patientId}^^^&${docQuery.homeCommunityId}&ISO'`,
                  },
                },
                {
                  '@_name': '$XDSDocumentEntryStatus',
                  'rim:ValueList': {
                    'rim:Value': "'urn:oasis:names:tc:ebxml-regrep:StatusType:Approved'",
                  },
                },
              ],
            },
          },
        },
      },
    };

    // Add date range if specified
    if (docQuery.dateFrom) {
      soapEnvelope['soap:Envelope']['soap:Body']['query:AdhocQueryRequest']['rim:AdhocQuery']['rim:Slot'].push({
        '@_name': '$XDSDocumentEntryCreationTimeFrom',
        'rim:ValueList': {
          'rim:Value': docQuery.dateFrom.replace(/-/g, ''),
        },
      });
    }

    if (docQuery.dateTo) {
      soapEnvelope['soap:Envelope']['soap:Body']['query:AdhocQueryRequest']['rim:AdhocQuery']['rim:Slot'].push({
        '@_name': '$XDSDocumentEntryCreationTimeTo',
        'rim:ValueList': {
          'rim:Value': docQuery.dateTo.replace(/-/g, ''),
        },
      });
    }

    return this.xmlBuilder.build(soapEnvelope);
  }

  /**
   * Build XCA Retrieve request
   */
  private buildXCARetrieveRequest(request: CarequalityQuery, queryId: string): string {
    const docRetrieve = request.documentRetrieve!;

    const soapEnvelope = {
      'soap:Envelope': {
        '@_xmlns:soap': 'http://www.w3.org/2003/05/soap-envelope',
        '@_xmlns:xds': 'urn:ihe:iti:xds-b:2007',
        '@_xmlns:wsa': 'http://www.w3.org/2005/08/addressing',
        'soap:Header': {
          'wsa:Action': 'urn:ihe:iti:2007:CrossGatewayRetrieve',
          'wsa:MessageID': `urn:uuid:${queryId}`,
        },
        'soap:Body': {
          'xds:RetrieveDocumentSetRequest': {
            'xds:DocumentRequest': {
              'xds:HomeCommunityId': docRetrieve.homeCommunityId,
              'xds:RepositoryUniqueId': docRetrieve.repositoryUniqueId,
              'xds:DocumentUniqueId': docRetrieve.documentUniqueId,
            },
          },
        },
      },
    };

    return this.xmlBuilder.build(soapEnvelope);
  }

  /**
   * Send XCPD request
   */
  private async sendXCPDRequest(community: any, request: string): Promise<any> {
    logger.info('Sending XCPD request', { community: community.name });

    const response = await this.httpClient.post(`${community.endpoint}/xcpd`, request);
    return this.xmlParser.parse(response.data);
  }

  /**
   * Send XCA Query request
   */
  private async sendXCAQueryRequest(community: any, request: string): Promise<any> {
    logger.info('Sending XCA Query request', { community: community.name });

    const response = await this.httpClient.post(`${community.endpoint}/xca-query`, request);
    return this.xmlParser.parse(response.data);
  }

  /**
   * Send XCA Retrieve request
   */
  private async sendXCARetrieveRequest(community: any, request: string): Promise<any> {
    logger.info('Sending XCA Retrieve request', { community: community.name });

    const response = await this.httpClient.post(`${community.endpoint}/xca-retrieve`, request);
    return this.xmlParser.parse(response.data);
  }

  /**
   * Parse XCPD response
   */
  private parseXCPDResponse(response: any): any[] {
    const patients: any[] = [];

    try {
      const body = response?.['soap:Envelope']?.['soap:Body'];
      const xcpdResponse = body?.['urn:PRPA_IN201306UV02'];
      const subjects = xcpdResponse?.['urn:controlActProcess']?.['urn:subject'];

      if (!subjects) return patients;

      const subjectArray = Array.isArray(subjects) ? subjects : [subjects];

      for (const subject of subjectArray) {
        const patient = subject?.['urn:registrationEvent']?.['urn:subject1']?.['urn:patient'];
        if (patient) {
          const patientPerson = patient?.['urn:patientPerson'];
          patients.push({
            patientId: patient?.['urn:id']?.['@_extension'],
            firstName: patientPerson?.['urn:name']?.['urn:given'],
            lastName: patientPerson?.['urn:name']?.['urn:family'],
            dateOfBirth: patientPerson?.['urn:birthTime']?.['@_value'],
            gender: patientPerson?.['urn:administrativeGenderCode']?.['@_code'],
          });
        }
      }
    } catch (error) {
      logger.warn('Error parsing XCPD response', { error });
    }

    return patients;
  }

  /**
   * Parse XCA Query response
   */
  private parseXCAQueryResponse(response: any): any[] {
    const documents: any[] = [];

    try {
      const body = response?.['soap:Envelope']?.['soap:Body'];
      const queryResponse = body?.['query:AdhocQueryResponse'];
      const objects = queryResponse?.['rim:RegistryObjectList']?.['rim:ExtrinsicObject'];

      if (!objects) return documents;

      const objectArray = Array.isArray(objects) ? objects : [objects];

      for (const obj of objectArray) {
        const slots = obj?.['rim:Slot'] || [];
        const slotMap = new Map<string, string>();

        for (const slot of (Array.isArray(slots) ? slots : [slots])) {
          slotMap.set(slot['@_name'], slot['rim:ValueList']?.['rim:Value']);
        }

        documents.push({
          documentUniqueId: obj?.['rim:ExternalIdentifier']?.find(
            (e: any) => e['@_identificationScheme'] === 'urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab'
          )?.['@_value'],
          repositoryUniqueId: slotMap.get('repositoryUniqueId'),
          title: obj?.['rim:Name']?.['rim:LocalizedString']?.['@_value'],
          creationTime: slotMap.get('creationTime'),
          mimeType: obj?.['@_mimeType'],
          size: slotMap.get('size'),
        });
      }
    } catch (error) {
      logger.warn('Error parsing XCA Query response', { error });
    }

    return documents;
  }

  /**
   * Parse XCA Retrieve response
   */
  private parseXCARetrieveResponse(response: any): any {
    try {
      const body = response?.['soap:Envelope']?.['soap:Body'];
      const retrieveResponse = body?.['xds:RetrieveDocumentSetResponse'];
      const documentResponse = retrieveResponse?.['xds:DocumentResponse'];

      if (!documentResponse) return null;

      return {
        documentUniqueId: documentResponse['xds:DocumentUniqueId'],
        repositoryUniqueId: documentResponse['xds:RepositoryUniqueId'],
        homeCommunityId: documentResponse['xds:HomeCommunityId'],
        mimeType: documentResponse['xds:mimeType'],
        document: documentResponse['xds:Document'], // Base64 encoded
      };
    } catch (error) {
      logger.warn('Error parsing XCA Retrieve response', { error });
      return null;
    }
  }

  /**
   * Format HL7 datetime
   */
  private formatHL7DateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  /**
   * Log Carequality query
   */
  private async logQuery(
    queryId: string,
    queryType: string,
    request: CarequalityQuery,
    resultCount: number,
    errors: string[]
  ): Promise<void> {
    await prisma.transactionLog.create({
      data: {
        transactionId: queryId,
        type: queryType === 'document-retrieve' ? 'carequality_retrieve' : 'carequality_query',
        direction: 'outbound',
        status: errors.length === 0 ? 'completed' : 'failed',
        payload: {
          queryType,
          purposeOfUse: request.purposeOfUse,
          requestingOrganization: request.requestingOrganization.name,
          resultCount,
        },
        errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
        completedAt: new Date(),
      },
    });
  }

  /**
   * Register organization in Carequality network
   */
  async registerOrganization(data: {
    organizationName: string;
    homeCommunityId: string;
    implementerOid: string;
    npi?: string;
    endpoints: Array<{
      service: string;
      url: string;
    }>;
  }): Promise<any> {
    const participant = await prisma.networkParticipant.create({
      data: {
        network: 'carequality',
        participantId: data.homeCommunityId,
        organizationName: data.organizationName,
        organizationOid: data.homeCommunityId,
        npi: data.npi,
        carequalityId: data.homeCommunityId,
        implementerOid: data.implementerOid,
        status: 'pending',
        capabilities: { services: data.endpoints.map((e) => e.service) },
        queryEndpoint: data.endpoints.find((e) => e.service === 'XCA-Query')?.url,
        retrieveEndpoint: data.endpoints.find((e) => e.service === 'XCA-Retrieve')?.url,
      },
    });

    logger.info('Carequality organization registered', {
      organizationName: data.organizationName,
      participantId: participant.id,
    });

    return participant;
  }

  /**
   * Search Carequality directory
   */
  async searchDirectory(filters: {
    name?: string;
    state?: string;
    services?: string[];
  }): Promise<any[]> {
    const results: any[] = [];

    for (const [id, community] of this.carequalityDirectory) {
      let match = true;

      if (filters.name && !community.name.toLowerCase().includes(filters.name.toLowerCase())) {
        match = false;
      }

      if (filters.services) {
        const hasAllServices = filters.services.every((s) => community.services.includes(s));
        if (!hasAllServices) match = false;
      }

      if (match) {
        results.push({
          homeCommunityId: id,
          ...community,
        });
      }
    }

    return results;
  }
}

export default new CarequalityService();
