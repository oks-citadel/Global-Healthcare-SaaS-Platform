import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { PrismaClient } from '../generated/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface FhirRequest {
  resourceType: string;
  operation: 'read' | 'search' | 'create' | 'update' | 'delete' | 'batch';
  resourceId?: string;
  parameters?: Record<string, string>;
  body?: any;
  endpointId?: string;
}

export interface FhirResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode: number;
  headers?: Record<string, string>;
}

export interface FhirEndpointConfig {
  id: string;
  url: string;
  fhirVersion: string;
  authType: string;
  tokenEndpoint?: string;
  clientId?: string;
  clientSecret?: string;
  scopes: string[];
}

export class FhirProxyService {
  private tokenCache: Map<string, { token: string; expiresAt: Date }> = new Map();

  /**
   * Route a FHIR request to an external endpoint
   */
  async routeRequest(request: FhirRequest, endpointId?: string): Promise<FhirResponse> {
    try {
      // Get endpoint configuration
      const endpoint = await this.getEndpoint(endpointId || request.endpointId);
      if (!endpoint) {
        return {
          success: false,
          error: 'FHIR endpoint not found',
          statusCode: 404,
        };
      }

      // Get axios client with authentication
      const client = await this.getAuthenticatedClient(endpoint);

      // Build request URL
      const url = this.buildUrl(endpoint.url, request);

      // Execute request
      const response = await this.executeRequest(client, request, url);

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
        headers: response.headers as Record<string, string>,
      };
    } catch (error: any) {
      logger.error('FHIR proxy request failed', {
        resourceType: request.resourceType,
        operation: request.operation,
        error: error.message,
      });

      return {
        success: false,
        error: error.response?.data?.issue?.[0]?.diagnostics || error.message,
        statusCode: error.response?.status || 500,
      };
    }
  }

  /**
   * Search for resources across multiple endpoints
   */
  async searchAcrossEndpoints(
    resourceType: string,
    parameters: Record<string, string>,
    endpointIds?: string[]
  ): Promise<FhirResponse> {
    try {
      // Get all active endpoints or specific ones
      const endpoints = await prisma.fhirEndpoint.findMany({
        where: {
          status: 'active',
          ...(endpointIds && { id: { in: endpointIds } }),
          supportedResources: { has: resourceType },
        },
      });

      if (endpoints.length === 0) {
        return {
          success: false,
          error: 'No FHIR endpoints available for this resource type',
          statusCode: 404,
        };
      }

      // Query all endpoints in parallel
      const results = await Promise.allSettled(
        endpoints.map(async (endpoint) => {
          const client = await this.getAuthenticatedClient(endpoint as unknown as FhirEndpointConfig);
          const url = `${endpoint.url}/${resourceType}?${new URLSearchParams(parameters).toString()}`;
          return client.get(url);
        })
      );

      // Aggregate results
      const aggregatedEntries: any[] = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const bundle = result.value.data;
          if (bundle.entry) {
            aggregatedEntries.push(...bundle.entry.map((entry: any) => ({
              ...entry,
              _source: endpoints[index].url,
            })));
          }
        } else {
          errors.push(`${endpoints[index].name}: ${result.reason.message}`);
        }
      });

      return {
        success: true,
        data: {
          resourceType: 'Bundle',
          type: 'searchset',
          total: aggregatedEntries.length,
          entry: aggregatedEntries,
          _errors: errors.length > 0 ? errors : undefined,
        },
        statusCode: 200,
      };
    } catch (error: any) {
      logger.error('Cross-endpoint FHIR search failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        statusCode: 500,
      };
    }
  }

  /**
   * Execute a FHIR batch/transaction bundle
   */
  async executeBatch(bundle: any, endpointId: string): Promise<FhirResponse> {
    try {
      const endpoint = await this.getEndpoint(endpointId);
      if (!endpoint) {
        return {
          success: false,
          error: 'FHIR endpoint not found',
          statusCode: 404,
        };
      }

      const client = await this.getAuthenticatedClient(endpoint);
      const response = await client.post(endpoint.url, bundle, {
        headers: {
          'Content-Type': 'application/fhir+json',
        },
      });

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      logger.error('FHIR batch execution failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        statusCode: error.response?.status || 500,
      };
    }
  }

  /**
   * Get capability statement from an endpoint
   */
  async getCapabilityStatement(endpointId: string): Promise<FhirResponse> {
    try {
      const endpoint = await this.getEndpoint(endpointId);
      if (!endpoint) {
        return {
          success: false,
          error: 'FHIR endpoint not found',
          statusCode: 404,
        };
      }

      const client = await this.getAuthenticatedClient(endpoint);
      const response = await client.get(`${endpoint.url}/metadata`);

      // Cache the capability statement
      await prisma.fhirEndpoint.update({
        where: { id: endpointId },
        data: {
          capabilityStatement: response.data,
          supportedResources: this.extractSupportedResources(response.data),
          lastHealthCheck: new Date(),
          healthStatus: 'healthy',
        },
      });

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error: any) {
      logger.error('Failed to get capability statement', { error: error.message });
      return {
        success: false,
        error: error.message,
        statusCode: error.response?.status || 500,
      };
    }
  }

  /**
   * Register a new FHIR endpoint
   */
  async registerEndpoint(config: {
    name: string;
    url: string;
    fhirVersion: string;
    authType: string;
    tokenEndpoint?: string;
    clientId?: string;
    clientSecret?: string;
    scopes?: string[];
    organizationName?: string;
    organizationNpi?: string;
  }): Promise<FhirResponse> {
    try {
      const endpoint = await prisma.fhirEndpoint.create({
        data: {
          name: config.name,
          url: config.url,
          fhirVersion: config.fhirVersion,
          authType: config.authType as any,
          tokenEndpoint: config.tokenEndpoint,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          scopes: config.scopes || [],
          organizationName: config.organizationName,
          organizationNpi: config.organizationNpi,
          status: 'testing',
        },
      });

      // Try to fetch capability statement
      await this.getCapabilityStatement(endpoint.id);

      return {
        success: true,
        data: endpoint,
        statusCode: 201,
      };
    } catch (error: any) {
      logger.error('Failed to register FHIR endpoint', { error: error.message });
      return {
        success: false,
        error: error.message,
        statusCode: 500,
      };
    }
  }

  /**
   * Get endpoint configuration
   */
  private async getEndpoint(endpointId?: string): Promise<FhirEndpointConfig | null> {
    if (!endpointId) {
      // Get default endpoint
      const endpoint = await prisma.fhirEndpoint.findFirst({
        where: { status: 'active' },
      });
      return endpoint as unknown as FhirEndpointConfig;
    }

    const endpoint = await prisma.fhirEndpoint.findUnique({
      where: { id: endpointId },
    });
    return endpoint as unknown as FhirEndpointConfig;
  }

  /**
   * Get authenticated axios client for endpoint
   */
  private async getAuthenticatedClient(endpoint: FhirEndpointConfig): Promise<AxiosInstance> {
    const config: AxiosRequestConfig = {
      timeout: 30000,
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
      },
    };

    if (endpoint.authType === 'oauth2' && endpoint.tokenEndpoint && endpoint.clientId) {
      const token = await this.getOAuth2Token(endpoint);
      config.headers!['Authorization'] = `Bearer ${token}`;
    } else if (endpoint.authType === 'basic' && endpoint.clientId && endpoint.clientSecret) {
      const credentials = Buffer.from(`${endpoint.clientId}:${endpoint.clientSecret}`).toString('base64');
      config.headers!['Authorization'] = `Basic ${credentials}`;
    }

    return axios.create(config);
  }

  /**
   * Get OAuth2 access token (with caching)
   */
  private async getOAuth2Token(endpoint: FhirEndpointConfig): Promise<string> {
    const cached = this.tokenCache.get(endpoint.id);
    if (cached && cached.expiresAt > new Date()) {
      return cached.token;
    }

    const response = await axios.post(
      endpoint.tokenEndpoint!,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: endpoint.clientId!,
        client_secret: endpoint.clientSecret!,
        scope: endpoint.scopes.join(' '),
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const expiresIn = response.data.expires_in || 3600;
    const expiresAt = new Date(Date.now() + (expiresIn - 60) * 1000);

    this.tokenCache.set(endpoint.id, {
      token: response.data.access_token,
      expiresAt,
    });

    return response.data.access_token;
  }

  /**
   * Build FHIR request URL
   */
  private buildUrl(baseUrl: string, request: FhirRequest): string {
    let url = `${baseUrl}/${request.resourceType}`;

    if (request.resourceId) {
      url += `/${request.resourceId}`;
    }

    if (request.parameters && Object.keys(request.parameters).length > 0) {
      url += `?${new URLSearchParams(request.parameters).toString()}`;
    }

    return url;
  }

  /**
   * Execute FHIR request
   */
  private async executeRequest(
    client: AxiosInstance,
    request: FhirRequest,
    url: string
  ): Promise<AxiosResponse> {
    switch (request.operation) {
      case 'read':
      case 'search':
        return client.get(url);
      case 'create':
        return client.post(url, request.body);
      case 'update':
        return client.put(url, request.body);
      case 'delete':
        return client.delete(url);
      case 'batch':
        return client.post(url.replace(`/${request.resourceType}`, ''), request.body);
      default:
        throw new Error(`Unsupported FHIR operation: ${request.operation}`);
    }
  }

  /**
   * Extract supported resources from capability statement
   */
  private extractSupportedResources(capabilityStatement: any): string[] {
    const resources: string[] = [];
    if (capabilityStatement.rest) {
      for (const rest of capabilityStatement.rest) {
        if (rest.resource) {
          for (const resource of rest.resource) {
            if (resource.type) {
              resources.push(resource.type);
            }
          }
        }
      }
    }
    return resources;
  }
}

export default new FhirProxyService();
