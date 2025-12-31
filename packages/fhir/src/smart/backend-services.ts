/**
 * SMART Backend Services (System-to-System) Authorization
 * Implements SMART Backend Services: Authorization Guide
 * http://hl7.org/fhir/smart-app-launch/backend-services.html
 */

import {
  BackendServicesConfig,
  BackendServicesJWTClaims,
  SMARTConfiguration,
  SMARTToken,
} from './types';

/**
 * Generate a cryptographically secure random string for JWT ID
 */
function generateJTI(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
}

/**
 * Base64URL encode a string
 */
function base64UrlEncode(data: string | ArrayBuffer): string {
  let str: string;
  if (typeof data === 'string') {
    str = btoa(data);
  } else {
    str = btoa(String.fromCharCode(...new Uint8Array(data)));
  }
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Import a PEM-encoded private key for JWT signing
 */
async function importPrivateKey(
  pem: string,
  algorithm: 'RS384' | 'ES384'
): Promise<CryptoKey> {
  // Remove PEM headers and whitespace
  const pemContents = pem
    .replace(/-----BEGIN (RSA |EC )?PRIVATE KEY-----/, '')
    .replace(/-----END (RSA |EC )?PRIVATE KEY-----/, '')
    .replace(/\s/g, '');

  // Decode base64
  const binaryDer = atob(pemContents);
  const binaryArray = new Uint8Array(binaryDer.length);
  for (let i = 0; i < binaryDer.length; i++) {
    binaryArray[i] = binaryDer.charCodeAt(i);
  }

  // Import based on algorithm
  if (algorithm === 'RS384') {
    return crypto.subtle.importKey(
      'pkcs8',
      binaryArray,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-384',
      },
      false,
      ['sign']
    );
  } else {
    // ES384
    return crypto.subtle.importKey(
      'pkcs8',
      binaryArray,
      {
        name: 'ECDSA',
        namedCurve: 'P-384',
      },
      false,
      ['sign']
    );
  }
}

/**
 * Sign data using the private key
 */
async function signData(
  data: string,
  privateKey: CryptoKey,
  algorithm: 'RS384' | 'ES384'
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  if (algorithm === 'RS384') {
    return crypto.subtle.sign(
      {
        name: 'RSASSA-PKCS1-v1_5',
      },
      privateKey,
      encodedData
    );
  } else {
    // ES384
    return crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: 'SHA-384',
      },
      privateKey,
      encodedData
    );
  }
}

/**
 * Create a signed JWT for client assertion
 */
export async function createClientAssertionJWT(
  config: BackendServicesConfig,
  tokenEndpoint: string
): Promise<string> {
  const algorithm = config.algorithm || 'RS384';
  const now = Math.floor(Date.now() / 1000);
  const tokenLifetime = config.tokenLifetime || 300; // Default 5 minutes

  // JWT Header
  const header = {
    alg: algorithm,
    typ: 'JWT',
    kid: config.privateKeyId,
  };

  // JWT Payload
  const payload: BackendServicesJWTClaims = {
    iss: config.clientId,
    sub: config.clientId,
    aud: tokenEndpoint,
    jti: generateJTI(),
    exp: now + tokenLifetime,
    iat: now,
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  // Import private key and sign
  const privateKey = await importPrivateKey(config.privateKey, algorithm);
  const signature = await signData(signingInput, privateKey, algorithm);

  // Encode signature
  const encodedSignature = base64UrlEncode(signature);

  return `${signingInput}.${encodedSignature}`;
}

/**
 * Backend Services Client for system-to-system authorization
 */
export class BackendServicesClient {
  private config: BackendServicesConfig;
  private smartConfig: SMARTConfiguration | null = null;
  private currentToken: SMARTToken | null = null;
  private tokenObtainedAt: number = 0;

  constructor(config: BackendServicesConfig) {
    this.config = config;
  }

  /**
   * Discover SMART configuration
   */
  async getConfiguration(): Promise<SMARTConfiguration> {
    if (this.smartConfig) {
      return this.smartConfig;
    }

    // Fetch from .well-known endpoint
    const wellKnownUrl = new URL(
      '/.well-known/smart-configuration',
      this.config.fhirBaseUrl
    ).toString();

    const response = await fetch(wellKnownUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch SMART configuration: ${response.status} ${response.statusText}`
      );
    }

    this.smartConfig = await response.json();
    return this.smartConfig!;
  }

  /**
   * Validate that the server supports Backend Services
   */
  async validateServerSupport(): Promise<{
    supported: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    try {
      const config = await this.getConfiguration();

      // Check for client_credentials grant type
      if (
        config.grant_types_supported &&
        !config.grant_types_supported.includes('client_credentials')
      ) {
        issues.push('Server does not support client_credentials grant type');
      }

      // Check for private_key_jwt authentication
      if (
        config.token_endpoint_auth_methods_supported &&
        !config.token_endpoint_auth_methods_supported.includes('private_key_jwt')
      ) {
        issues.push(
          'Server does not support private_key_jwt authentication method'
        );
      }

      // Check for confidential-asymmetric client type
      if (!config.capabilities.includes('client-confidential-asymmetric')) {
        issues.push(
          'Server does not support confidential asymmetric clients'
        );
      }

      return {
        supported: issues.length === 0,
        issues,
      };
    } catch (error) {
      return {
        supported: false,
        issues: [
          `Failed to validate server: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ],
      };
    }
  }

  /**
   * Get an access token using client credentials grant
   */
  async getAccessToken(): Promise<SMARTToken> {
    // Check if we have a valid cached token
    if (this.currentToken && !this.isTokenExpired()) {
      return this.currentToken;
    }

    const config = await this.getConfiguration();

    // Create client assertion JWT
    const clientAssertion = await createClientAssertionJWT(
      this.config,
      config.token_endpoint
    );

    // Build token request
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      scope: this.config.scope,
      client_assertion_type:
        'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: clientAssertion,
    });

    // Make token request
    const response = await fetch(config.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage: string;
      try {
        const errorJson = JSON.parse(errorBody);
        errorMessage = `Backend Services token request failed: ${errorJson.error} - ${errorJson.error_description}`;
      } catch {
        errorMessage = `Backend Services token request failed: ${response.status} ${response.statusText} - ${errorBody}`;
      }
      throw new Error(errorMessage);
    }

    this.currentToken = await response.json();
    this.tokenObtainedAt = Date.now();

    return this.currentToken!;
  }

  /**
   * Check if the current token is expired
   */
  private isTokenExpired(): boolean {
    if (!this.currentToken || !this.tokenObtainedAt) {
      return true;
    }

    const expiresIn = this.currentToken.expires_in || 300;
    // Add 60 second buffer
    const expirationTime = this.tokenObtainedAt + expiresIn * 1000 - 60000;

    return Date.now() >= expirationTime;
  }

  /**
   * Make an authenticated request to the FHIR server
   */
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();

    const url = path.startsWith('http')
      ? path
      : new URL(path, this.config.fhirBaseUrl).toString();

    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/fhir+json',
        Authorization: `${token.token_type} ${token.access_token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `FHIR request failed: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }

    return response.json();
  }

  /**
   * Clear cached token
   */
  clearToken(): void {
    this.currentToken = null;
    this.tokenObtainedAt = 0;
  }
}

/**
 * Create a Backend Services client instance
 */
export function createBackendServicesClient(
  config: BackendServicesConfig
): BackendServicesClient {
  return new BackendServicesClient(config);
}

/**
 * Bulk Data Export Types
 */
export interface BulkDataExportParams {
  /** Output format (default: application/fhir+ndjson) */
  _outputFormat?: string;

  /** Export data since this timestamp */
  _since?: string;

  /** Specific resource types to export */
  _type?: string[];

  /** Type-level filters */
  _typeFilter?: string[];

  /** Elements to include */
  _elements?: string[];

  /** Include referenced resources */
  includeAssociatedData?: string[];
}

export interface BulkDataExportStatus {
  /** Export status */
  transactionTime: string;

  /** Request URL */
  request: string;

  /** Require access token for downloads */
  requiresAccessToken: boolean;

  /** Output files */
  output: Array<{
    type: string;
    url: string;
    count?: number;
  }>;

  /** Errors */
  error?: Array<{
    type: string;
    url: string;
    count?: number;
  }>;

  /** Extension data */
  extension?: Record<string, unknown>;
}

/**
 * Bulk Data Export Client
 * Extends Backend Services for FHIR Bulk Data Export operations
 */
export class BulkDataClient extends BackendServicesClient {
  /**
   * Initiate a system-level bulk data export
   */
  async initiateSystemExport(
    params: BulkDataExportParams = {}
  ): Promise<string> {
    return this.initiateExport('/$export', params);
  }

  /**
   * Initiate a patient-level bulk data export
   */
  async initiatePatientExport(
    params: BulkDataExportParams = {}
  ): Promise<string> {
    return this.initiateExport('/Patient/$export', params);
  }

  /**
   * Initiate a group-level bulk data export
   */
  async initiateGroupExport(
    groupId: string,
    params: BulkDataExportParams = {}
  ): Promise<string> {
    return this.initiateExport(`/Group/${groupId}/$export`, params);
  }

  /**
   * Initiate bulk export and return status URL
   */
  private async initiateExport(
    endpoint: string,
    params: BulkDataExportParams
  ): Promise<string> {
    const token = await this.getAccessToken();

    // Build query parameters
    const queryParams = new URLSearchParams();

    if (params._outputFormat) {
      queryParams.set('_outputFormat', params._outputFormat);
    }
    if (params._since) {
      queryParams.set('_since', params._since);
    }
    if (params._type?.length) {
      queryParams.set('_type', params._type.join(','));
    }
    if (params._typeFilter?.length) {
      for (const filter of params._typeFilter) {
        queryParams.append('_typeFilter', filter);
      }
    }
    if (params._elements?.length) {
      queryParams.set('_elements', params._elements.join(','));
    }

    const url = new URL(endpoint, this.config.fhirBaseUrl);
    url.search = queryParams.toString();

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/fhir+json',
        Authorization: `${token.token_type} ${token.access_token}`,
        Prefer: 'respond-async',
      },
    });

    if (response.status !== 202) {
      const errorBody = await response.text();
      throw new Error(
        `Bulk export initiation failed: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }

    const contentLocation = response.headers.get('Content-Location');
    if (!contentLocation) {
      throw new Error('No Content-Location header in bulk export response');
    }

    return contentLocation;
  }

  /**
   * Check bulk export status
   */
  async checkExportStatus(
    statusUrl: string
  ): Promise<{ complete: boolean; status?: BulkDataExportStatus; retryAfter?: number }> {
    const token = await this.getAccessToken();

    const response = await fetch(statusUrl, {
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
    });

    if (response.status === 202) {
      // Still in progress
      const retryAfter = response.headers.get('Retry-After');
      return {
        complete: false,
        retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
      };
    }

    if (response.status === 200) {
      // Complete
      const status = await response.json();
      return {
        complete: true,
        status,
      };
    }

    const errorBody = await response.text();
    throw new Error(
      `Bulk export status check failed: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  /**
   * Cancel a bulk export
   */
  async cancelExport(statusUrl: string): Promise<void> {
    const token = await this.getAccessToken();

    const response = await fetch(statusUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      const errorBody = await response.text();
      throw new Error(
        `Bulk export cancellation failed: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }
  }

  /**
   * Download a bulk export file
   */
  async downloadExportFile(fileUrl: string): Promise<ReadableStream<Uint8Array> | null> {
    const token = await this.getAccessToken();

    const response = await fetch(fileUrl, {
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
        Accept: 'application/fhir+ndjson',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Bulk export file download failed: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }

    return response.body;
  }

  /**
   * Wait for export completion with polling
   */
  async waitForExport(
    statusUrl: string,
    options: {
      /** Maximum wait time in milliseconds */
      maxWait?: number;
      /** Polling interval in milliseconds */
      pollInterval?: number;
      /** Callback for progress updates */
      onProgress?: (status: { complete: boolean; retryAfter?: number }) => void;
    } = {}
  ): Promise<BulkDataExportStatus> {
    const maxWait = options.maxWait || 3600000; // Default 1 hour
    const pollInterval = options.pollInterval || 10000; // Default 10 seconds
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const result = await this.checkExportStatus(statusUrl);

      if (options.onProgress) {
        options.onProgress({ complete: result.complete, retryAfter: result.retryAfter });
      }

      if (result.complete && result.status) {
        return result.status;
      }

      // Wait before next poll
      const waitTime = result.retryAfter
        ? result.retryAfter * 1000
        : pollInterval;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    throw new Error('Bulk export timed out');
  }
}

/**
 * Create a Bulk Data client instance
 */
export function createBulkDataClient(
  config: BackendServicesConfig
): BulkDataClient {
  return new BulkDataClient(config);
}
