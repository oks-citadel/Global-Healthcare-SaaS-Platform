import axios, { AxiosInstance } from 'axios';
import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export interface TEFCAQuery {
  queryType: 'patient-discovery' | 'document-query' | 'document-retrieve';
  patientDemographics?: {
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
    ssn?: string;
    mrn?: string;
  };
  documentQuery?: {
    patientId: string;
    documentType?: string;
    dateFrom?: string;
    dateTo?: string;
  };
  documentRetrieve?: {
    documentId: string;
    repositoryId: string;
  };
  purposeOfUse: 'TREATMENT' | 'PAYMENT' | 'OPERATIONS' | 'PUBLIC_HEALTH' | 'INDIVIDUAL_ACCESS';
  requestingOrganization: {
    name: string;
    oid: string;
    npi?: string;
  };
  targetQHINs?: string[];
}

export interface TEFCAResponse {
  success: boolean;
  queryId: string;
  results?: any[];
  errors?: string[];
  responseTime?: number;
}

export interface QHINEndpoint {
  id: string;
  name: string;
  endpoint: string;
  status: string;
  capabilities: string[];
}

export class TEFCAService {
  private qhinEndpoints: Map<string, QHINEndpoint> = new Map();
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Initialize known QHIN endpoints (would be loaded from configuration)
    this.initializeQHINEndpoints();
  }

  /**
   * Initialize QHIN endpoint registry
   */
  private initializeQHINEndpoints(): void {
    // These would be loaded from configuration or database
    const qhins: QHINEndpoint[] = [
      {
        id: 'ehealth-exchange',
        name: 'eHealth Exchange',
        endpoint: process.env.TEFCA_EHEALTH_EXCHANGE_URL || 'https://api.ehealthexchange.org',
        status: 'active',
        capabilities: ['patient-discovery', 'document-query', 'document-retrieve'],
      },
      {
        id: 'commonwell',
        name: 'CommonWell Health Alliance',
        endpoint: process.env.TEFCA_COMMONWELL_URL || 'https://api.commonwellalliance.org',
        status: 'active',
        capabilities: ['patient-discovery', 'document-query', 'document-retrieve'],
      },
      {
        id: 'carequality',
        name: 'Carequality',
        endpoint: process.env.TEFCA_CAREQUALITY_URL || 'https://api.carequality.org',
        status: 'active',
        capabilities: ['patient-discovery', 'document-query', 'document-retrieve'],
      },
    ];

    qhins.forEach((qhin) => this.qhinEndpoints.set(qhin.id, qhin));
  }

  /**
   * Execute a TEFCA query
   */
  async query(request: TEFCAQuery): Promise<TEFCAResponse> {
    const queryId = uuidv4();
    const startTime = Date.now();

    try {
      // Validate purpose of use
      if (!this.validatePurposeOfUse(request.purposeOfUse)) {
        return {
          success: false,
          queryId,
          errors: ['Invalid or unsupported purpose of use'],
        };
      }

      // Get target QHINs
      const targetQHINs = request.targetQHINs?.length
        ? request.targetQHINs
        : Array.from(this.qhinEndpoints.keys());

      // Execute query based on type
      let results: any[] = [];
      let errors: string[] = [];

      switch (request.queryType) {
        case 'patient-discovery':
          ({ results, errors } = await this.executePatientDiscovery(request, targetQHINs, queryId));
          break;
        case 'document-query':
          ({ results, errors } = await this.executeDocumentQuery(request, targetQHINs, queryId));
          break;
        case 'document-retrieve':
          ({ results, errors } = await this.executeDocumentRetrieve(request, queryId));
          break;
        default:
          return {
            success: false,
            queryId,
            errors: [`Unsupported query type: ${request.queryType}`],
          };
      }

      const responseTime = Date.now() - startTime;

      // Log the query
      await this.logQuery(queryId, request, results.length, errors, responseTime);

      return {
        success: errors.length === 0,
        queryId,
        results,
        errors: errors.length > 0 ? errors : undefined,
        responseTime,
      };
    } catch (error: any) {
      logger.error('TEFCA query failed', { queryId, error: error.message });
      return {
        success: false,
        queryId,
        errors: [error.message],
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Execute patient discovery across QHINs
   */
  private async executePatientDiscovery(
    request: TEFCAQuery,
    targetQHINs: string[],
    queryId: string
  ): Promise<{ results: any[]; errors: string[] }> {
    const results: any[] = [];
    const errors: string[] = [];

    const promises = targetQHINs.map(async (qhinId) => {
      const qhin = this.qhinEndpoints.get(qhinId);
      if (!qhin || !qhin.capabilities.includes('patient-discovery')) {
        return;
      }

      try {
        const response = await this.sendPatientDiscoveryRequest(qhin, request, queryId);
        if (response.patients) {
          results.push(
            ...response.patients.map((p: any) => ({
              ...p,
              source: qhin.name,
              sourceQHIN: qhinId,
            }))
          );
        }
      } catch (error: any) {
        errors.push(`${qhin.name}: ${error.message}`);
      }
    });

    await Promise.all(promises);

    // Deduplicate and score matches
    const dedupedResults = this.deduplicatePatients(results);

    return { results: dedupedResults, errors };
  }

  /**
   * Execute document query across QHINs
   */
  private async executeDocumentQuery(
    request: TEFCAQuery,
    targetQHINs: string[],
    queryId: string
  ): Promise<{ results: any[]; errors: string[] }> {
    const results: any[] = [];
    const errors: string[] = [];

    if (!request.documentQuery?.patientId) {
      return { results: [], errors: ['Patient ID is required for document query'] };
    }

    const promises = targetQHINs.map(async (qhinId) => {
      const qhin = this.qhinEndpoints.get(qhinId);
      if (!qhin || !qhin.capabilities.includes('document-query')) {
        return;
      }

      try {
        const response = await this.sendDocumentQueryRequest(qhin, request, queryId);
        if (response.documents) {
          results.push(
            ...response.documents.map((d: any) => ({
              ...d,
              source: qhin.name,
              sourceQHIN: qhinId,
            }))
          );
        }
      } catch (error: any) {
        errors.push(`${qhin.name}: ${error.message}`);
      }
    });

    await Promise.all(promises);

    return { results, errors };
  }

  /**
   * Execute document retrieve from specific repository
   */
  private async executeDocumentRetrieve(
    request: TEFCAQuery,
    queryId: string
  ): Promise<{ results: any[]; errors: string[] }> {
    if (!request.documentRetrieve?.documentId || !request.documentRetrieve?.repositoryId) {
      return {
        results: [],
        errors: ['Document ID and Repository ID are required'],
      };
    }

    // Find the QHIN that hosts this repository
    const qhin = this.findQHINByRepository(request.documentRetrieve.repositoryId);
    if (!qhin) {
      return {
        results: [],
        errors: ['Repository not found in any connected QHIN'],
      };
    }

    try {
      const response = await this.sendDocumentRetrieveRequest(qhin, request, queryId);
      return {
        results: response.document ? [response.document] : [],
        errors: [],
      };
    } catch (error: any) {
      return {
        results: [],
        errors: [error.message],
      };
    }
  }

  /**
   * Send patient discovery request to a QHIN
   */
  private async sendPatientDiscoveryRequest(
    qhin: QHINEndpoint,
    request: TEFCAQuery,
    queryId: string
  ): Promise<any> {
    const tefcaRequest = {
      messageId: queryId,
      timestamp: new Date().toISOString(),
      requestingOrganization: request.requestingOrganization,
      purposeOfUse: request.purposeOfUse,
      patientDemographics: request.patientDemographics,
    };

    logger.info('Sending patient discovery request', {
      queryId,
      qhin: qhin.name,
    });

    const response = await this.httpClient.post(
      `${qhin.endpoint}/tefca/v1/patient-discovery`,
      tefcaRequest,
      {
        headers: this.buildTEFCAHeaders(queryId),
      }
    );

    return response.data;
  }

  /**
   * Send document query request to a QHIN
   */
  private async sendDocumentQueryRequest(
    qhin: QHINEndpoint,
    request: TEFCAQuery,
    queryId: string
  ): Promise<any> {
    const tefcaRequest = {
      messageId: queryId,
      timestamp: new Date().toISOString(),
      requestingOrganization: request.requestingOrganization,
      purposeOfUse: request.purposeOfUse,
      patientId: request.documentQuery?.patientId,
      documentType: request.documentQuery?.documentType,
      dateRange: {
        from: request.documentQuery?.dateFrom,
        to: request.documentQuery?.dateTo,
      },
    };

    logger.info('Sending document query request', {
      queryId,
      qhin: qhin.name,
      patientId: request.documentQuery?.patientId,
    });

    const response = await this.httpClient.post(
      `${qhin.endpoint}/tefca/v1/document-query`,
      tefcaRequest,
      {
        headers: this.buildTEFCAHeaders(queryId),
      }
    );

    return response.data;
  }

  /**
   * Send document retrieve request to a QHIN
   */
  private async sendDocumentRetrieveRequest(
    qhin: QHINEndpoint,
    request: TEFCAQuery,
    queryId: string
  ): Promise<any> {
    const tefcaRequest = {
      messageId: queryId,
      timestamp: new Date().toISOString(),
      requestingOrganization: request.requestingOrganization,
      purposeOfUse: request.purposeOfUse,
      documentId: request.documentRetrieve?.documentId,
      repositoryId: request.documentRetrieve?.repositoryId,
    };

    logger.info('Sending document retrieve request', {
      queryId,
      qhin: qhin.name,
      documentId: request.documentRetrieve?.documentId,
    });

    const response = await this.httpClient.post(
      `${qhin.endpoint}/tefca/v1/document-retrieve`,
      tefcaRequest,
      {
        headers: this.buildTEFCAHeaders(queryId),
      }
    );

    return response.data;
  }

  /**
   * Build TEFCA-compliant headers
   */
  private buildTEFCAHeaders(queryId: string): Record<string, string> {
    return {
      'X-TEFCA-Query-ID': queryId,
      'X-TEFCA-Version': '1.0',
      'X-TEFCA-Timestamp': new Date().toISOString(),
      // In production, would include digital signature
    };
  }

  /**
   * Validate purpose of use
   */
  private validatePurposeOfUse(purpose: string): boolean {
    const validPurposes = [
      'TREATMENT',
      'PAYMENT',
      'OPERATIONS',
      'PUBLIC_HEALTH',
      'INDIVIDUAL_ACCESS',
    ];
    return validPurposes.includes(purpose);
  }

  /**
   * Deduplicate patient records from multiple sources
   */
  private deduplicatePatients(patients: any[]): any[] {
    const patientMap = new Map<string, any>();

    for (const patient of patients) {
      // Create a composite key for deduplication
      const key = this.createPatientKey(patient);
      const existing = patientMap.get(key);

      if (!existing) {
        patientMap.set(key, {
          ...patient,
          sources: [patient.source],
          matchScore: patient.matchScore || 1.0,
        });
      } else {
        // Merge sources and calculate combined match score
        existing.sources.push(patient.source);
        existing.matchScore = Math.max(existing.matchScore, patient.matchScore || 1.0);
      }
    }

    return Array.from(patientMap.values()).sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Create a unique key for patient deduplication
   */
  private createPatientKey(patient: any): string {
    const parts = [
      patient.firstName?.toLowerCase(),
      patient.lastName?.toLowerCase(),
      patient.dateOfBirth,
      patient.gender,
    ].filter(Boolean);
    return parts.join('|');
  }

  /**
   * Find QHIN by repository ID
   */
  private findQHINByRepository(repositoryId: string): QHINEndpoint | null {
    // In production, would look up repository-to-QHIN mapping
    // For now, return the first QHIN with document retrieve capability
    for (const qhin of this.qhinEndpoints.values()) {
      if (qhin.capabilities.includes('document-retrieve')) {
        return qhin;
      }
    }
    return null;
  }

  /**
   * Log TEFCA query for audit
   */
  private async logQuery(
    queryId: string,
    request: TEFCAQuery,
    resultCount: number,
    errors: string[],
    responseTime: number
  ): Promise<void> {
    await prisma.transactionLog.create({
      data: {
        transactionId: queryId,
        type: request.queryType === 'patient-discovery' ? 'tefca_query' : 'tefca_response',
        direction: 'outbound',
        status: errors.length === 0 ? 'completed' : 'failed',
        payload: {
          queryType: request.queryType,
          purposeOfUse: request.purposeOfUse,
          requestingOrganization: request.requestingOrganization.name,
          resultCount,
        },
        processingTimeMs: responseTime,
        errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
        completedAt: new Date(),
      },
    });
  }

  /**
   * Register organization as TEFCA participant
   */
  async registerParticipant(data: {
    organizationName: string;
    organizationOid: string;
    npi?: string;
    tefcaRole: 'QHIN' | 'Participant' | 'Subparticipant';
    capabilities: string[];
  }): Promise<any> {
    const participant = await prisma.networkParticipant.create({
      data: {
        network: 'tefca',
        participantId: data.organizationOid,
        organizationName: data.organizationName,
        organizationOid: data.organizationOid,
        npi: data.npi,
        status: 'pending',
        tefcaRole: data.tefcaRole,
        capabilities: { capabilities: data.capabilities },
        supportedPurposes: ['TREATMENT', 'PAYMENT', 'OPERATIONS'],
      },
    });

    logger.info('TEFCA participant registered', {
      organizationName: data.organizationName,
      participantId: participant.id,
    });

    return participant;
  }

  /**
   * Get TEFCA participant status
   */
  async getParticipantStatus(participantId: string): Promise<any> {
    return prisma.networkParticipant.findFirst({
      where: {
        network: 'tefca',
        participantId,
      },
    });
  }

  /**
   * List available QHINs
   */
  listQHINs(): QHINEndpoint[] {
    return Array.from(this.qhinEndpoints.values());
  }
}

export default new TEFCAService();
