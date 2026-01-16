import axios, { AxiosInstance } from 'axios';
import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export interface CommonWellPatient {
  id?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  phone?: string;
  email?: string;
  identifiers?: Array<{
    value: string;
    system: string;
    type: string;
  }>;
}

export interface CommonWellLinkRequest {
  localPatientId: string;
  commonwellPersonId: string;
  organizationId: string;
  linkStrength: 'definite' | 'probable' | 'possible';
}

export interface CommonWellResponse {
  success: boolean;
  requestId: string;
  data?: any;
  errors?: string[];
}

export class CommonWellService {
  private httpClient: AxiosInstance;
  private baseUrl: string;
  private orgId: string;

  constructor() {
    this.baseUrl = process.env.COMMONWELL_API_URL || 'https://api.commonwellalliance.org';
    this.orgId = process.env.COMMONWELL_ORG_ID || '';

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor for authentication
    this.httpClient.interceptors.request.use(async (config) => {
      const token = await this.getAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  /**
   * Search for a person in CommonWell network
   */
  async searchPerson(demographics: CommonWellPatient): Promise<CommonWellResponse> {
    const requestId = uuidv4();

    try {
      logger.info('Searching CommonWell for person', {
        requestId,
        lastName: demographics.lastName,
      });

      const response = await this.httpClient.post('/v1/person/search', {
        firstName: demographics.firstName,
        lastName: demographics.lastName,
        dateOfBirth: demographics.dateOfBirth,
        gender: demographics.gender,
        address: demographics.address,
        identifiers: demographics.identifiers,
      });

      const matches = response.data.matches || [];

      // Log the query
      await this.logTransaction(requestId, 'commonwell_query', matches.length, []);

      return {
        success: true,
        requestId,
        data: {
          matches: matches.map((m: any) => ({
            personId: m.id,
            confidence: m.confidence,
            demographics: m.demographics,
            links: m.links,
          })),
          totalCount: matches.length,
        },
      };
    } catch (error: any) {
      logger.error('CommonWell person search failed', {
        requestId,
        error: error.message,
      });

      await this.logTransaction(requestId, 'commonwell_query', 0, [error.message]);

      return {
        success: false,
        requestId,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Register a new person in CommonWell
   */
  async registerPerson(patient: CommonWellPatient): Promise<CommonWellResponse> {
    const requestId = uuidv4();

    try {
      logger.info('Registering person in CommonWell', {
        requestId,
        lastName: patient.lastName,
      });

      const response = await this.httpClient.post('/v1/person', {
        demographics: {
          firstName: patient.firstName,
          lastName: patient.lastName,
          middleName: patient.middleName,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          address: patient.address,
          phone: patient.phone,
          email: patient.email,
        },
        identifiers: patient.identifiers,
        organizationId: this.orgId,
      });

      const personId = response.data.id;

      // Store the CommonWell link locally
      await prisma.networkParticipant.create({
        data: {
          network: 'commonwell',
          participantId: personId,
          organizationName: 'Person',
          commonwellId: personId,
          status: 'active',
        },
      });

      await this.logTransaction(requestId, 'commonwell_link', 1, []);

      return {
        success: true,
        requestId,
        data: {
          personId,
          status: 'registered',
        },
      };
    } catch (error: any) {
      logger.error('CommonWell person registration failed', {
        requestId,
        error: error.message,
      });

      await this.logTransaction(requestId, 'commonwell_link', 0, [error.message]);

      return {
        success: false,
        requestId,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Link a local patient to a CommonWell person
   */
  async linkPatient(request: CommonWellLinkRequest): Promise<CommonWellResponse> {
    const requestId = uuidv4();

    try {
      logger.info('Linking patient to CommonWell person', {
        requestId,
        localPatientId: request.localPatientId,
        commonwellPersonId: request.commonwellPersonId,
      });

      const response = await this.httpClient.post(
        `/v1/person/${request.commonwellPersonId}/link`,
        {
          patientId: request.localPatientId,
          organizationId: request.organizationId || this.orgId,
          linkStrength: request.linkStrength,
        }
      );

      await this.logTransaction(requestId, 'commonwell_link', 1, []);

      return {
        success: true,
        requestId,
        data: {
          linkId: response.data.linkId,
          status: 'linked',
        },
      };
    } catch (error: any) {
      logger.error('CommonWell patient linking failed', {
        requestId,
        error: error.message,
      });

      await this.logTransaction(requestId, 'commonwell_link', 0, [error.message]);

      return {
        success: false,
        requestId,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Unlink a patient from CommonWell
   */
  async unlinkPatient(localPatientId: string, commonwellPersonId: string): Promise<CommonWellResponse> {
    const requestId = uuidv4();

    try {
      logger.info('Unlinking patient from CommonWell', {
        requestId,
        localPatientId,
        commonwellPersonId,
      });

      await this.httpClient.delete(
        `/v1/person/${commonwellPersonId}/link/${localPatientId}`
      );

      await this.logTransaction(requestId, 'commonwell_link', 1, []);

      return {
        success: true,
        requestId,
        data: {
          status: 'unlinked',
        },
      };
    } catch (error: any) {
      logger.error('CommonWell patient unlinking failed', {
        requestId,
        error: error.message,
      });

      await this.logTransaction(requestId, 'commonwell_link', 0, [error.message]);

      return {
        success: false,
        requestId,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Get person details from CommonWell
   */
  async getPerson(personId: string): Promise<CommonWellResponse> {
    const requestId = uuidv4();

    try {
      const response = await this.httpClient.get(`/v1/person/${personId}`);

      await this.logTransaction(requestId, 'commonwell_query', 1, []);

      return {
        success: true,
        requestId,
        data: response.data,
      };
    } catch (error: any) {
      logger.error('CommonWell get person failed', {
        requestId,
        personId,
        error: error.message,
      });

      await this.logTransaction(requestId, 'commonwell_query', 0, [error.message]);

      return {
        success: false,
        requestId,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Query for patient documents across the network
   */
  async queryDocuments(personId: string, options?: {
    documentType?: string[];
    dateFrom?: string;
    dateTo?: string;
  }): Promise<CommonWellResponse> {
    const requestId = uuidv4();

    try {
      logger.info('Querying CommonWell for documents', {
        requestId,
        personId,
      });

      const params: any = {};
      if (options?.documentType) params.type = options.documentType.join(',');
      if (options?.dateFrom) params.fromDate = options.dateFrom;
      if (options?.dateTo) params.toDate = options.dateTo;

      const response = await this.httpClient.get(
        `/v1/person/${personId}/documents`,
        { params }
      );

      const documents = response.data.documents || [];

      await this.logTransaction(requestId, 'commonwell_query', documents.length, []);

      return {
        success: true,
        requestId,
        data: {
          documents: documents.map((d: any) => ({
            id: d.id,
            title: d.title,
            type: d.type,
            creationDate: d.creationDate,
            author: d.author,
            organization: d.organization,
            size: d.size,
            mimeType: d.mimeType,
          })),
          totalCount: documents.length,
        },
      };
    } catch (error: any) {
      logger.error('CommonWell document query failed', {
        requestId,
        personId,
        error: error.message,
      });

      await this.logTransaction(requestId, 'commonwell_query', 0, [error.message]);

      return {
        success: false,
        requestId,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Retrieve a specific document
   */
  async retrieveDocument(personId: string, documentId: string): Promise<CommonWellResponse> {
    const requestId = uuidv4();

    try {
      logger.info('Retrieving document from CommonWell', {
        requestId,
        personId,
        documentId,
      });

      const response = await this.httpClient.get(
        `/v1/person/${personId}/documents/${documentId}`,
        { responseType: 'arraybuffer' }
      );

      await this.logTransaction(requestId, 'commonwell_query', 1, []);

      return {
        success: true,
        requestId,
        data: {
          documentId,
          content: Buffer.from(response.data).toString('base64'),
          contentType: response.headers['content-type'],
        },
      };
    } catch (error: any) {
      logger.error('CommonWell document retrieval failed', {
        requestId,
        documentId,
        error: error.message,
      });

      await this.logTransaction(requestId, 'commonwell_query', 0, [error.message]);

      return {
        success: false,
        requestId,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Update patient consent preferences
   */
  async updateConsent(personId: string, consent: {
    status: 'opt-in' | 'opt-out';
    purpose?: string[];
    validFrom?: string;
    validTo?: string;
  }): Promise<CommonWellResponse> {
    const requestId = uuidv4();

    try {
      logger.info('Updating CommonWell consent', {
        requestId,
        personId,
        status: consent.status,
      });

      const response = await this.httpClient.put(
        `/v1/person/${personId}/consent`,
        consent
      );

      await this.logTransaction(requestId, 'commonwell_link', 1, []);

      return {
        success: true,
        requestId,
        data: {
          consentId: response.data.id,
          status: consent.status,
        },
      };
    } catch (error: any) {
      logger.error('CommonWell consent update failed', {
        requestId,
        personId,
        error: error.message,
      });

      await this.logTransaction(requestId, 'commonwell_link', 0, [error.message]);

      return {
        success: false,
        requestId,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Get consent status for a person
   */
  async getConsent(personId: string): Promise<CommonWellResponse> {
    const requestId = uuidv4();

    try {
      const response = await this.httpClient.get(`/v1/person/${personId}/consent`);

      await this.logTransaction(requestId, 'commonwell_query', 1, []);

      return {
        success: true,
        requestId,
        data: response.data,
      };
    } catch (error: any) {
      logger.error('CommonWell get consent failed', {
        requestId,
        personId,
        error: error.message,
      });

      await this.logTransaction(requestId, 'commonwell_query', 0, [error.message]);

      return {
        success: false,
        requestId,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Register organization in CommonWell
   */
  async registerOrganization(data: {
    name: string;
    npi: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
    contact: {
      name: string;
      email: string;
      phone: string;
    };
  }): Promise<CommonWellResponse> {
    const requestId = uuidv4();

    try {
      logger.info('Registering organization in CommonWell', {
        requestId,
        organizationName: data.name,
      });

      const response = await this.httpClient.post('/v1/organization', data);

      const orgId = response.data.id;

      // Store locally
      await prisma.networkParticipant.create({
        data: {
          network: 'commonwell',
          participantId: orgId,
          organizationName: data.name,
          npi: data.npi,
          commonwellId: orgId,
          commonwellOrgId: orgId,
          status: 'pending',
        },
      });

      await this.logTransaction(requestId, 'commonwell_link', 1, []);

      return {
        success: true,
        requestId,
        data: {
          organizationId: orgId,
          status: 'pending_verification',
        },
      };
    } catch (error: any) {
      logger.error('CommonWell organization registration failed', {
        requestId,
        error: error.message,
      });

      await this.logTransaction(requestId, 'commonwell_link', 0, [error.message]);

      return {
        success: false,
        requestId,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Get network status and statistics
   */
  async getNetworkStatus(): Promise<CommonWellResponse> {
    const requestId = uuidv4();

    try {
      const response = await this.httpClient.get('/v1/status');

      return {
        success: true,
        requestId,
        data: {
          status: response.data.status,
          organizations: response.data.organizationCount,
          patients: response.data.patientCount,
          documents: response.data.documentCount,
        },
      };
    } catch (error: any) {
      logger.error('CommonWell status check failed', {
        requestId,
        error: error.message,
      });

      return {
        success: false,
        requestId,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Get OAuth2 access token
   */
  private async getAccessToken(): Promise<string> {
    // In production, this would use OAuth2 client credentials flow
    // with the CommonWell authorization server
    const clientId = process.env.COMMONWELL_CLIENT_ID;
    const clientSecret = process.env.COMMONWELL_CLIENT_SECRET;
    const tokenUrl = process.env.COMMONWELL_TOKEN_URL || `${this.baseUrl}/oauth2/token`;

    if (!clientId || !clientSecret) {
      // Return mock token for development
      return 'mock-commonwell-token';
    }

    try {
      const response = await axios.post(
        tokenUrl,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'person.read person.write document.read document.write',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      return response.data.access_token;
    } catch (error) {
      logger.error('Failed to get CommonWell access token', { error });
      throw new Error('CommonWell authentication failed');
    }
  }

  /**
   * Log transaction for audit
   */
  private async logTransaction(
    requestId: string,
    type: string,
    resultCount: number,
    errors: string[]
  ): Promise<void> {
    await prisma.transactionLog.create({
      data: {
        transactionId: requestId,
        type: type as any,
        direction: 'outbound',
        status: errors.length === 0 ? 'completed' : 'failed',
        payload: { resultCount },
        errorMessage: errors.length > 0 ? errors.join('; ') : undefined,
        completedAt: new Date(),
      },
    });
  }
}

export default new CommonWellService();
