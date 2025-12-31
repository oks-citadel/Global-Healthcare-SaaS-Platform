/**
 * DICOMweb Client
 *
 * Implements DICOMweb services per DICOM PS3.18:
 * - QIDO-RS (Query based on ID for DICOM Objects by RESTful Services)
 * - WADO-RS (Web Access to DICOM Objects by RESTful Services)
 * - STOW-RS (STore Over the Web by RESTful Services)
 * - UPS-RS (Unified Procedure Step by RESTful Services)
 *
 * References:
 * - DICOM PS3.18: https://dicom.nema.org/medical/dicom/current/output/html/part18.html
 * - IHE RAD TF Vol 2: https://www.ihe.net/Technical_Framework/
 */

import {
  DICOMwebEndpoint,
  DICOMwebAuth,
  OAuth2Config,
  DICOMwebError,
  DICOMStudy,
  DICOMSeries,
  DICOMInstance,
  DICOMPatient,
  DICOMPersonName,
  QIDOStudyQuery,
  QIDOSeriesQuery,
  QIDOInstanceQuery,
  QIDOResponse,
  DICOMJSONObject,
  DICOMJSONAttribute,
  WADORetrieveOptions,
  WADOMultipartResponse,
  WADOResponsePart,
  STOWRequest,
  STOWResponse,
  STOWInstanceResult,
  UPSWorkitem,
  UPSQueryParams,
  UPSSubscription,
  UPSState,
  ModalityCode,
} from './types';
import { normalizeTag, KeywordToTag } from './tags';

// ============================================================================
// DICOMweb Client Configuration
// ============================================================================

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  timeout: 30000,
  qidoPath: '/dicomweb',
  wadoPath: '/dicomweb',
  stowPath: '/dicomweb',
  upsPath: '/dicomweb',
};

/**
 * Media type constants
 */
const MediaTypes = {
  DICOM: 'application/dicom',
  DICOM_JSON: 'application/dicom+json',
  JSON: 'application/json',
  MULTIPART_RELATED: 'multipart/related',
  OCTET_STREAM: 'application/octet-stream',
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  GIF: 'image/gif',
} as const;

// ============================================================================
// DICOMweb Client Class
// ============================================================================

/**
 * DICOMweb Client for interacting with DICOM web services
 */
export class DICOMwebClient {
  private config: Required<DICOMwebEndpoint>;
  private accessToken?: string;
  private tokenExpiresAt?: number;

  constructor(endpoint: DICOMwebEndpoint) {
    this.config = {
      baseUrl: endpoint.baseUrl.replace(/\/$/, ''), // Remove trailing slash
      qidoPath: endpoint.qidoPath ?? DEFAULT_CONFIG.qidoPath,
      wadoPath: endpoint.wadoPath ?? DEFAULT_CONFIG.wadoPath,
      stowPath: endpoint.stowPath ?? DEFAULT_CONFIG.stowPath,
      upsPath: endpoint.upsPath ?? DEFAULT_CONFIG.upsPath,
      auth: endpoint.auth ?? { type: 'none' },
      headers: endpoint.headers ?? {},
      timeout: endpoint.timeout ?? DEFAULT_CONFIG.timeout,
      withCredentials: endpoint.withCredentials ?? false,
    };
  }

  // ==========================================================================
  // Authentication
  // ==========================================================================

  /**
   * Get authorization headers
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const auth = this.config.auth;

    switch (auth.type) {
      case 'none':
        return {};

      case 'basic':
        if (!auth.username || !auth.password) {
          throw this.createError(401, 'Basic auth requires username and password');
        }
        const credentials = Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
        return { Authorization: `Basic ${credentials}` };

      case 'bearer':
        if (!auth.token) {
          throw this.createError(401, 'Bearer auth requires token');
        }
        return { Authorization: `Bearer ${auth.token}` };

      case 'oauth2':
        const token = await this.getOAuth2Token();
        return { Authorization: `Bearer ${token}` };

      default:
        return {};
    }
  }

  /**
   * Get OAuth2 access token
   */
  private async getOAuth2Token(): Promise<string> {
    const oauth2 = this.config.auth.oauth2;
    if (!oauth2) {
      throw this.createError(401, 'OAuth2 configuration required');
    }

    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt - 60000) {
      return this.accessToken;
    }

    // Use refresh token if available
    if (oauth2.refreshToken && oauth2.grantType === 'refresh_token') {
      return this.refreshOAuth2Token(oauth2);
    }

    // Get new token based on grant type
    switch (oauth2.grantType) {
      case 'client_credentials':
        return this.getClientCredentialsToken(oauth2);

      case 'authorization_code':
        // For authorization_code, the token should be obtained through the browser flow
        // and provided in the config. This is just for token refresh.
        if (oauth2.accessToken) {
          this.accessToken = oauth2.accessToken;
          this.tokenExpiresAt = oauth2.expiresAt;
          return oauth2.accessToken;
        }
        throw this.createError(401, 'Authorization code flow requires existing token');

      default:
        throw this.createError(401, `Unsupported grant type: ${oauth2.grantType}`);
    }
  }

  /**
   * Get token using client credentials grant
   */
  private async getClientCredentialsToken(oauth2: OAuth2Config): Promise<string> {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: oauth2.clientId,
    });

    if (oauth2.clientSecret) {
      body.append('client_secret', oauth2.clientSecret);
    }

    if (oauth2.scopes?.length) {
      body.append('scope', oauth2.scopes.join(' '));
    }

    const response = await fetch(oauth2.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw this.createError(response.status, 'Failed to obtain OAuth2 token');
    }

    const data = await response.json() as { access_token: string; expires_in?: number };
    this.accessToken = data.access_token;
    this.tokenExpiresAt = data.expires_in
      ? Date.now() + data.expires_in * 1000
      : undefined;

    return this.accessToken;
  }

  /**
   * Refresh OAuth2 token
   */
  private async refreshOAuth2Token(oauth2: OAuth2Config): Promise<string> {
    if (!oauth2.refreshToken) {
      throw this.createError(401, 'No refresh token available');
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: oauth2.refreshToken,
      client_id: oauth2.clientId,
    });

    if (oauth2.clientSecret) {
      body.append('client_secret', oauth2.clientSecret);
    }

    const response = await fetch(oauth2.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw this.createError(response.status, 'Failed to refresh OAuth2 token');
    }

    const data = await response.json() as { access_token: string; expires_in?: number; refresh_token?: string };
    this.accessToken = data.access_token;
    this.tokenExpiresAt = data.expires_in
      ? Date.now() + data.expires_in * 1000
      : undefined;

    // Update refresh token if a new one was provided
    if (data.refresh_token && this.config.auth.oauth2) {
      this.config.auth.oauth2.refreshToken = data.refresh_token;
    }

    return this.accessToken;
  }

  // ==========================================================================
  // HTTP Request Helpers
  // ==========================================================================

  /**
   * Make an HTTP request
   */
  private async request<T>(
    method: string,
    path: string,
    options: {
      headers?: Record<string, string>;
      body?: BodyInit;
      accept?: string;
      contentType?: string;
      parseJson?: boolean;
    } = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    const authHeaders = await this.getAuthHeaders();

    const headers: Record<string, string> = {
      ...this.config.headers,
      ...authHeaders,
      ...options.headers,
    };

    if (options.accept) {
      headers['Accept'] = options.accept;
    }

    if (options.contentType) {
      headers['Content-Type'] = options.contentType;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: options.body,
        signal: controller.signal,
        credentials: this.config.withCredentials ? 'include' : 'same-origin',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw this.createError(response.status, errorText || response.statusText);
      }

      if (options.parseJson !== false) {
        return await response.json() as T;
      }

      return response as unknown as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw this.createError(408, 'Request timeout');
      }

      if ((error as DICOMwebError).status) {
        throw error;
      }

      throw this.createError(500, `Request failed: ${(error as Error).message}`);
    }
  }

  /**
   * Create a DICOMweb error
   */
  private createError(status: number, message: string, details?: unknown): DICOMwebError {
    return {
      status,
      message,
      details,
    };
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      // Convert keyword to tag if needed
      const paramKey = KeywordToTag[key] ?? key;

      if (Array.isArray(value)) {
        for (const v of value) {
          searchParams.append(paramKey, String(v));
        }
      } else {
        searchParams.append(paramKey, String(value));
      }
    }

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // ==========================================================================
  // QIDO-RS (Query)
  // ==========================================================================

  /**
   * Query for studies (QIDO-RS)
   * GET {baseUrl}/studies
   */
  async queryStudies(query: QIDOStudyQuery = {}): Promise<DICOMStudy[]> {
    const path = `${this.config.qidoPath}/studies${this.buildQueryString(query)}`;

    const response = await this.request<QIDOResponse>('GET', path, {
      accept: MediaTypes.DICOM_JSON,
    });

    return response.map((item) => this.parseStudyFromJSON(item));
  }

  /**
   * Query for series within a study (QIDO-RS)
   * GET {baseUrl}/studies/{studyUID}/series
   */
  async querySeries(studyUID: string, query: QIDOSeriesQuery = {}): Promise<DICOMSeries[]> {
    const path = `${this.config.qidoPath}/studies/${encodeURIComponent(studyUID)}/series${this.buildQueryString(query)}`;

    const response = await this.request<QIDOResponse>('GET', path, {
      accept: MediaTypes.DICOM_JSON,
    });

    return response.map((item) => this.parseSeriesFromJSON(item));
  }

  /**
   * Query for instances within a series (QIDO-RS)
   * GET {baseUrl}/studies/{studyUID}/series/{seriesUID}/instances
   */
  async queryInstances(
    studyUID: string,
    seriesUID: string,
    query: QIDOInstanceQuery = {}
  ): Promise<DICOMInstance[]> {
    const path = `${this.config.qidoPath}/studies/${encodeURIComponent(studyUID)}/series/${encodeURIComponent(seriesUID)}/instances${this.buildQueryString(query)}`;

    const response = await this.request<QIDOResponse>('GET', path, {
      accept: MediaTypes.DICOM_JSON,
    });

    return response.map((item) => this.parseInstanceFromJSON(item));
  }

  /**
   * Query for all instances in a study (QIDO-RS)
   * GET {baseUrl}/studies/{studyUID}/instances
   */
  async queryStudyInstances(
    studyUID: string,
    query: QIDOInstanceQuery = {}
  ): Promise<DICOMInstance[]> {
    const path = `${this.config.qidoPath}/studies/${encodeURIComponent(studyUID)}/instances${this.buildQueryString(query)}`;

    const response = await this.request<QIDOResponse>('GET', path, {
      accept: MediaTypes.DICOM_JSON,
    });

    return response.map((item) => this.parseInstanceFromJSON(item));
  }

  // ==========================================================================
  // WADO-RS (Retrieve)
  // ==========================================================================

  /**
   * Retrieve a study (WADO-RS)
   * GET {baseUrl}/studies/{studyUID}
   */
  async retrieveStudy(
    studyUID: string,
    options: WADORetrieveOptions = {}
  ): Promise<WADOMultipartResponse> {
    const path = `${this.config.wadoPath}/studies/${encodeURIComponent(studyUID)}`;
    return this.retrieveMultipart(path, options);
  }

  /**
   * Retrieve a series (WADO-RS)
   * GET {baseUrl}/studies/{studyUID}/series/{seriesUID}
   */
  async retrieveSeries(
    studyUID: string,
    seriesUID: string,
    options: WADORetrieveOptions = {}
  ): Promise<WADOMultipartResponse> {
    const path = `${this.config.wadoPath}/studies/${encodeURIComponent(studyUID)}/series/${encodeURIComponent(seriesUID)}`;
    return this.retrieveMultipart(path, options);
  }

  /**
   * Retrieve an instance (WADO-RS)
   * GET {baseUrl}/studies/{studyUID}/series/{seriesUID}/instances/{instanceUID}
   */
  async retrieveInstance(
    studyUID: string,
    seriesUID: string,
    instanceUID: string,
    options: WADORetrieveOptions = {}
  ): Promise<WADOMultipartResponse> {
    const path = `${this.config.wadoPath}/studies/${encodeURIComponent(studyUID)}/series/${encodeURIComponent(seriesUID)}/instances/${encodeURIComponent(instanceUID)}`;
    return this.retrieveMultipart(path, options);
  }

  /**
   * Retrieve specific frames from an instance (WADO-RS)
   * GET {baseUrl}/studies/{studyUID}/series/{seriesUID}/instances/{instanceUID}/frames/{frames}
   */
  async retrieveFrames(
    studyUID: string,
    seriesUID: string,
    instanceUID: string,
    frames: number[],
    options: WADORetrieveOptions = {}
  ): Promise<WADOMultipartResponse> {
    const frameList = frames.join(',');
    const path = `${this.config.wadoPath}/studies/${encodeURIComponent(studyUID)}/series/${encodeURIComponent(seriesUID)}/instances/${encodeURIComponent(instanceUID)}/frames/${frameList}`;
    return this.retrieveMultipart(path, options);
  }

  /**
   * Retrieve instance metadata (WADO-RS)
   * GET {baseUrl}/studies/{studyUID}/series/{seriesUID}/instances/{instanceUID}/metadata
   */
  async retrieveInstanceMetadata(
    studyUID: string,
    seriesUID: string,
    instanceUID: string
  ): Promise<DICOMJSONObject[]> {
    const path = `${this.config.wadoPath}/studies/${encodeURIComponent(studyUID)}/series/${encodeURIComponent(seriesUID)}/instances/${encodeURIComponent(instanceUID)}/metadata`;

    return this.request<DICOMJSONObject[]>('GET', path, {
      accept: MediaTypes.DICOM_JSON,
    });
  }

  /**
   * Retrieve study metadata (WADO-RS)
   * GET {baseUrl}/studies/{studyUID}/metadata
   */
  async retrieveStudyMetadata(studyUID: string): Promise<DICOMJSONObject[]> {
    const path = `${this.config.wadoPath}/studies/${encodeURIComponent(studyUID)}/metadata`;

    return this.request<DICOMJSONObject[]>('GET', path, {
      accept: MediaTypes.DICOM_JSON,
    });
  }

  /**
   * Retrieve series metadata (WADO-RS)
   * GET {baseUrl}/studies/{studyUID}/series/{seriesUID}/metadata
   */
  async retrieveSeriesMetadata(
    studyUID: string,
    seriesUID: string
  ): Promise<DICOMJSONObject[]> {
    const path = `${this.config.wadoPath}/studies/${encodeURIComponent(studyUID)}/series/${encodeURIComponent(seriesUID)}/metadata`;

    return this.request<DICOMJSONObject[]>('GET', path, {
      accept: MediaTypes.DICOM_JSON,
    });
  }

  /**
   * Retrieve rendered image (WADO-RS)
   * GET {baseUrl}/studies/{studyUID}/series/{seriesUID}/instances/{instanceUID}/rendered
   */
  async retrieveRenderedImage(
    studyUID: string,
    seriesUID: string,
    instanceUID: string,
    options: WADORetrieveOptions & { accept?: 'image/jpeg' | 'image/png' | 'image/gif' } = {}
  ): Promise<ArrayBuffer> {
    let path = `${this.config.wadoPath}/studies/${encodeURIComponent(studyUID)}/series/${encodeURIComponent(seriesUID)}/instances/${encodeURIComponent(instanceUID)}/rendered`;

    const params: string[] = [];
    if (options.viewport) {
      params.push(`viewport=${options.viewport.width},${options.viewport.height}`);
    }
    if (options.window) {
      params.push(`window=${options.window.center},${options.window.width}`);
    }
    if (options.quality) {
      params.push(`quality=${options.quality}`);
    }
    if (options.annotation) {
      params.push(`annotation=${options.annotation}`);
    }

    if (params.length > 0) {
      path += `?${params.join('&')}`;
    }

    const response = await this.request<Response>('GET', path, {
      accept: options.accept ?? MediaTypes.JPEG,
      parseJson: false,
    });

    return response.arrayBuffer();
  }

  /**
   * Retrieve thumbnail (WADO-RS)
   * GET {baseUrl}/studies/{studyUID}/series/{seriesUID}/instances/{instanceUID}/thumbnail
   */
  async retrieveThumbnail(
    studyUID: string,
    seriesUID: string,
    instanceUID: string,
    options: { viewport?: { width: number; height: number } } = {}
  ): Promise<ArrayBuffer> {
    let path = `${this.config.wadoPath}/studies/${encodeURIComponent(studyUID)}/series/${encodeURIComponent(seriesUID)}/instances/${encodeURIComponent(instanceUID)}/thumbnail`;

    if (options.viewport) {
      path += `?viewport=${options.viewport.width},${options.viewport.height}`;
    }

    const response = await this.request<Response>('GET', path, {
      accept: MediaTypes.JPEG,
      parseJson: false,
    });

    return response.arrayBuffer();
  }

  /**
   * Internal: Retrieve multipart response
   */
  private async retrieveMultipart(
    path: string,
    options: WADORetrieveOptions
  ): Promise<WADOMultipartResponse> {
    const accept = options.accept ?? `${MediaTypes.MULTIPART_RELATED}; type="${MediaTypes.DICOM}"`;

    // Add transfer syntax parameter if specified
    let fullPath = path;
    if (options.transferSyntax) {
      fullPath += `?transferSyntax=${encodeURIComponent(options.transferSyntax)}`;
    }

    const response = await this.request<Response>('GET', fullPath, {
      accept,
      parseJson: false,
    });

    const contentType = response.headers.get('Content-Type') ?? '';
    const arrayBuffer = await response.arrayBuffer();

    // Parse multipart response
    return this.parseMultipartResponse(contentType, arrayBuffer);
  }

  /**
   * Parse multipart/related response
   */
  private parseMultipartResponse(
    contentType: string,
    data: ArrayBuffer
  ): WADOMultipartResponse {
    // Extract boundary from content type
    const boundaryMatch = contentType.match(/boundary=([^;]+)/i);
    if (!boundaryMatch) {
      // Single part response
      return {
        contentType,
        parts: [{ contentType, data }],
      };
    }

    const boundary = boundaryMatch[1].replace(/^["']|["']$/g, '');
    const boundaryBytes = new TextEncoder().encode(`--${boundary}`);
    const endBoundaryBytes = new TextEncoder().encode(`--${boundary}--`);

    const uint8Array = new Uint8Array(data);
    const parts: WADOResponsePart[] = [];

    let currentIndex = 0;

    // Find all parts
    while (currentIndex < uint8Array.length) {
      // Find boundary
      const boundaryIndex = this.findBytes(uint8Array, boundaryBytes, currentIndex);
      if (boundaryIndex === -1) break;

      // Check if this is the end boundary
      const isEndBoundary =
        this.findBytes(uint8Array, endBoundaryBytes, boundaryIndex) === boundaryIndex;
      if (isEndBoundary) break;

      // Skip past boundary and CRLF
      let headerStart = boundaryIndex + boundaryBytes.length;
      while (
        headerStart < uint8Array.length &&
        (uint8Array[headerStart] === 13 || uint8Array[headerStart] === 10)
      ) {
        headerStart++;
      }

      // Find end of headers (double CRLF)
      const headerEnd = this.findDoubleNewline(uint8Array, headerStart);
      if (headerEnd === -1) break;

      // Parse headers
      const headerBytes = uint8Array.slice(headerStart, headerEnd);
      const headerText = new TextDecoder().decode(headerBytes);
      const headers = this.parseHeaders(headerText);

      // Find next boundary
      const nextBoundaryIndex = this.findBytes(uint8Array, boundaryBytes, headerEnd);
      const dataEnd =
        nextBoundaryIndex !== -1 ? nextBoundaryIndex - 2 : uint8Array.length; // -2 for CRLF before boundary

      // Extract data
      const dataStart = headerEnd + 4; // Skip double CRLF
      const partData = uint8Array.slice(dataStart, dataEnd).buffer;

      parts.push({
        contentType: headers['content-type'] ?? MediaTypes.OCTET_STREAM,
        contentLocation: headers['content-location'],
        data: partData,
      });

      currentIndex = nextBoundaryIndex !== -1 ? nextBoundaryIndex : uint8Array.length;
    }

    return { contentType, parts };
  }

  /**
   * Find byte sequence in array
   */
  private findBytes(haystack: Uint8Array, needle: Uint8Array, start: number): number {
    outer: for (let i = start; i <= haystack.length - needle.length; i++) {
      for (let j = 0; j < needle.length; j++) {
        if (haystack[i + j] !== needle[j]) continue outer;
      }
      return i;
    }
    return -1;
  }

  /**
   * Find double newline (CRLF CRLF or LF LF)
   */
  private findDoubleNewline(data: Uint8Array, start: number): number {
    for (let i = start; i < data.length - 3; i++) {
      // Check for CRLF CRLF
      if (
        data[i] === 13 &&
        data[i + 1] === 10 &&
        data[i + 2] === 13 &&
        data[i + 3] === 10
      ) {
        return i;
      }
      // Check for LF LF
      if (data[i] === 10 && data[i + 1] === 10) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Parse HTTP headers
   */
  private parseHeaders(headerText: string): Record<string, string> {
    const headers: Record<string, string> = {};
    const lines = headerText.split(/\r?\n/);

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim().toLowerCase();
        const value = line.slice(colonIndex + 1).trim();
        headers[key] = value;
      }
    }

    return headers;
  }

  // ==========================================================================
  // STOW-RS (Store)
  // ==========================================================================

  /**
   * Store DICOM instances (STOW-RS)
   * POST {baseUrl}/studies[/{studyUID}]
   */
  async storeInstances(request: STOWRequest): Promise<STOWResponse> {
    const path = request.studyInstanceUID
      ? `${this.config.stowPath}/studies/${encodeURIComponent(request.studyInstanceUID)}`
      : `${this.config.stowPath}/studies`;

    // Create multipart body
    const boundary = this.generateBoundary();
    const body = await this.createMultipartBody(request.instances, boundary);

    const contentType = `${MediaTypes.MULTIPART_RELATED}; type="${request.contentType ?? MediaTypes.DICOM}"; boundary=${boundary}`;

    try {
      const response = await this.request<DICOMJSONObject>('POST', path, {
        body,
        contentType,
        accept: MediaTypes.DICOM_JSON,
      });

      return this.parseSTOWResponse(response);
    } catch (error) {
      const dicomError = error as DICOMwebError;
      return {
        status: dicomError.status || 500,
        message: dicomError.message || 'Store failed',
        successfulInstances: [],
        failedInstances: [],
        warningInstances: [],
      };
    }
  }

  /**
   * Generate multipart boundary
   */
  private generateBoundary(): string {
    return `----DICOMwebBoundary${Date.now()}${Math.random().toString(36).slice(2)}`;
  }

  /**
   * Create multipart request body
   */
  private async createMultipartBody(
    instances: Array<ArrayBuffer | Blob>,
    boundary: string
  ): Promise<Blob> {
    const parts: BlobPart[] = [];
    const encoder = new TextEncoder();

    for (const instance of instances) {
      // Add boundary and headers
      const header =
        `--${boundary}\r\n` +
        `Content-Type: ${MediaTypes.DICOM}\r\n` +
        '\r\n';
      parts.push(encoder.encode(header));

      // Add instance data
      if (instance instanceof Blob) {
        parts.push(instance);
      } else {
        parts.push(new Uint8Array(instance));
      }

      parts.push(encoder.encode('\r\n'));
    }

    // Add closing boundary
    parts.push(encoder.encode(`--${boundary}--\r\n`));

    return new Blob(parts);
  }

  /**
   * Parse STOW-RS response
   */
  private parseSTOWResponse(response: DICOMJSONObject): STOWResponse {
    const successfulInstances: STOWInstanceResult[] = [];
    const failedInstances: STOWInstanceResult[] = [];
    const warningInstances: STOWInstanceResult[] = [];

    // Parse Referenced SOP Sequence (00081199) - successful instances
    const referencedSOPSequence = response['00081199']?.Value as DICOMJSONObject[] | undefined;
    if (referencedSOPSequence) {
      for (const item of referencedSOPSequence) {
        successfulInstances.push({
          sopClassUID: this.getStringValue(item, '00081150') ?? '',
          sopInstanceUID: this.getStringValue(item, '00081155') ?? '',
          retrieveURL: this.getStringValue(item, '00081190'),
        });
      }
    }

    // Parse Failed SOP Sequence (00081198)
    const failedSOPSequence = response['00081198']?.Value as DICOMJSONObject[] | undefined;
    if (failedSOPSequence) {
      for (const item of failedSOPSequence) {
        failedInstances.push({
          sopClassUID: this.getStringValue(item, '00081150') ?? '',
          sopInstanceUID: this.getStringValue(item, '00081155') ?? '',
          failureReason: this.getNumberValue(item, '00081197'),
        });
      }
    }

    // Determine overall status
    const status = failedInstances.length > 0 ? 409 : 200;
    const message =
      failedInstances.length > 0
        ? `Stored ${successfulInstances.length} instances, ${failedInstances.length} failed`
        : `Successfully stored ${successfulInstances.length} instances`;

    return {
      status,
      message,
      successfulInstances,
      failedInstances,
      warningInstances,
      rawResponse: response,
    };
  }

  // ==========================================================================
  // UPS-RS (Unified Procedure Step)
  // ==========================================================================

  /**
   * Query worklist (UPS-RS)
   * GET {baseUrl}/workitems
   */
  async queryWorkitems(query: UPSQueryParams = {}): Promise<UPSWorkitem[]> {
    const path = `${this.config.upsPath}/workitems${this.buildQueryString(query)}`;

    const response = await this.request<DICOMJSONObject[]>('GET', path, {
      accept: MediaTypes.DICOM_JSON,
    });

    return response.map((item) => this.parseWorkitemFromJSON(item));
  }

  /**
   * Create a workitem (UPS-RS)
   * POST {baseUrl}/workitems
   */
  async createWorkitem(workitem: DICOMJSONObject): Promise<string> {
    const path = `${this.config.upsPath}/workitems`;

    const response = await this.request<Response>('POST', path, {
      body: JSON.stringify(workitem),
      contentType: MediaTypes.DICOM_JSON,
      accept: MediaTypes.DICOM_JSON,
      parseJson: false,
    });

    // Get workitem UID from Location header
    const location = response.headers.get('Location');
    if (location) {
      const uidMatch = location.match(/workitems\/(.+)/);
      if (uidMatch) {
        return uidMatch[1];
      }
    }

    throw this.createError(500, 'Failed to get workitem UID from response');
  }

  /**
   * Retrieve a workitem (UPS-RS)
   * GET {baseUrl}/workitems/{workitemUID}
   */
  async retrieveWorkitem(workitemUID: string): Promise<UPSWorkitem> {
    const path = `${this.config.upsPath}/workitems/${encodeURIComponent(workitemUID)}`;

    const response = await this.request<DICOMJSONObject[]>('GET', path, {
      accept: MediaTypes.DICOM_JSON,
    });

    if (response.length === 0) {
      throw this.createError(404, 'Workitem not found');
    }

    return this.parseWorkitemFromJSON(response[0]);
  }

  /**
   * Update workitem (UPS-RS)
   * POST {baseUrl}/workitems/{workitemUID}
   */
  async updateWorkitem(workitemUID: string, updates: DICOMJSONObject): Promise<void> {
    const path = `${this.config.upsPath}/workitems/${encodeURIComponent(workitemUID)}`;

    await this.request<void>('POST', path, {
      body: JSON.stringify(updates),
      contentType: MediaTypes.DICOM_JSON,
    });
  }

  /**
   * Change workitem state (UPS-RS)
   * PUT {baseUrl}/workitems/{workitemUID}/state/{transactionUID}
   */
  async changeWorkitemState(
    workitemUID: string,
    transactionUID: string,
    newState: UPSState
  ): Promise<void> {
    const path = `${this.config.upsPath}/workitems/${encodeURIComponent(workitemUID)}/state/${encodeURIComponent(transactionUID)}`;

    const body: DICOMJSONObject = {
      '00741000': { vr: 'CS', Value: [newState] }, // Procedure Step State
    };

    await this.request<void>('PUT', path, {
      body: JSON.stringify(body),
      contentType: MediaTypes.DICOM_JSON,
    });
  }

  /**
   * Request cancellation of workitem (UPS-RS)
   * POST {baseUrl}/workitems/{workitemUID}/cancelrequest
   */
  async requestWorkitemCancellation(
    workitemUID: string,
    reason?: string
  ): Promise<void> {
    const path = `${this.config.upsPath}/workitems/${encodeURIComponent(workitemUID)}/cancelrequest`;

    const body: DICOMJSONObject = {};
    if (reason) {
      body['00741238'] = { vr: 'LT', Value: [reason] }; // Reason for Cancellation
    }

    await this.request<void>('POST', path, {
      body: JSON.stringify(body),
      contentType: MediaTypes.DICOM_JSON,
    });
  }

  /**
   * Subscribe to workitem (UPS-RS)
   * POST {baseUrl}/workitems/{workitemUID}/subscribers/{subscriberAETitle}
   */
  async subscribeToWorkitem(
    workitemUID: string,
    subscriberAETitle: string,
    deletionLock?: boolean
  ): Promise<void> {
    let path = `${this.config.upsPath}/workitems/${encodeURIComponent(workitemUID)}/subscribers/${encodeURIComponent(subscriberAETitle)}`;

    if (deletionLock !== undefined) {
      path += `?deletionlock=${deletionLock}`;
    }

    await this.request<void>('POST', path, {});
  }

  /**
   * Unsubscribe from workitem (UPS-RS)
   * DELETE {baseUrl}/workitems/{workitemUID}/subscribers/{subscriberAETitle}
   */
  async unsubscribeFromWorkitem(
    workitemUID: string,
    subscriberAETitle: string
  ): Promise<void> {
    const path = `${this.config.upsPath}/workitems/${encodeURIComponent(workitemUID)}/subscribers/${encodeURIComponent(subscriberAETitle)}`;

    await this.request<void>('DELETE', path, {});
  }

  /**
   * Subscribe to worklist (global subscription) (UPS-RS)
   * POST {baseUrl}/workitems/1.2.840.10008.5.1.4.34.5/subscribers/{subscriberAETitle}
   */
  async subscribeToWorklist(
    subscriberAETitle: string,
    deletionLock?: boolean
  ): Promise<void> {
    // Global subscription uses well-known UID
    const globalWorklistUID = '1.2.840.10008.5.1.4.34.5';
    await this.subscribeToWorkitem(globalWorklistUID, subscriberAETitle, deletionLock);
  }

  // ==========================================================================
  // JSON Parsing Helpers
  // ==========================================================================

  /**
   * Get string value from DICOM JSON attribute
   */
  private getStringValue(obj: DICOMJSONObject, tag: string): string | undefined {
    const attr = obj[tag];
    if (!attr?.Value || attr.Value.length === 0) return undefined;

    const value = attr.Value[0];
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (value && typeof value === 'object' && 'Alphabetic' in value) {
      return (value as DICOMPersonName).Alphabetic;
    }
    return undefined;
  }

  /**
   * Get number value from DICOM JSON attribute
   */
  private getNumberValue(obj: DICOMJSONObject, tag: string): number | undefined {
    const attr = obj[tag];
    if (!attr?.Value || attr.Value.length === 0) return undefined;

    const value = attr.Value[0];
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }

  /**
   * Get string array from DICOM JSON attribute
   */
  private getStringArrayValue(obj: DICOMJSONObject, tag: string): string[] | undefined {
    const attr = obj[tag];
    if (!attr?.Value || attr.Value.length === 0) return undefined;

    return attr.Value.filter((v): v is string => typeof v === 'string');
  }

  /**
   * Get person name from DICOM JSON attribute
   */
  private getPersonName(obj: DICOMJSONObject, tag: string): DICOMPersonName | string | undefined {
    const attr = obj[tag];
    if (!attr?.Value || attr.Value.length === 0) return undefined;

    const value = attr.Value[0];
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && 'Alphabetic' in value) {
      return value as DICOMPersonName;
    }
    return undefined;
  }

  /**
   * Parse DICOMStudy from JSON
   */
  private parseStudyFromJSON(json: DICOMJSONObject): DICOMStudy {
    return {
      studyInstanceUID: this.getStringValue(json, '0020000D') ?? '',
      studyId: this.getStringValue(json, '00200010'),
      studyDate: this.getStringValue(json, '00080020'),
      studyTime: this.getStringValue(json, '00080030'),
      studyDescription: this.getStringValue(json, '00081030'),
      accessionNumber: this.getStringValue(json, '00080050'),
      referringPhysicianName: this.getPersonName(json, '00080090'),
      modalitiesInStudy: this.getStringArrayValue(json, '00080061') as ModalityCode[] | undefined,
      numberOfStudyRelatedSeries: this.getNumberValue(json, '00201206'),
      numberOfStudyRelatedInstances: this.getNumberValue(json, '00201208'),
      institutionName: this.getStringValue(json, '00080080'),
      retrieveURL: this.getStringValue(json, '00081190'),
      patient: {
        patientId: this.getStringValue(json, '00100020') ?? '',
        patientName: this.getPersonName(json, '00100010'),
        patientBirthDate: this.getStringValue(json, '00100030'),
        patientSex: this.getStringValue(json, '00100040') as 'M' | 'F' | 'O' | undefined,
      },
    };
  }

  /**
   * Parse DICOMSeries from JSON
   */
  private parseSeriesFromJSON(json: DICOMJSONObject): DICOMSeries {
    return {
      seriesInstanceUID: this.getStringValue(json, '0020000E') ?? '',
      seriesNumber: this.getNumberValue(json, '00200011'),
      seriesDate: this.getStringValue(json, '00080021'),
      seriesTime: this.getStringValue(json, '00080031'),
      seriesDescription: this.getStringValue(json, '0008103E'),
      modality: (this.getStringValue(json, '00080060') ?? 'OT') as ModalityCode,
      bodyPartExamined: this.getStringValue(json, '00180015'),
      patientPosition: this.getStringValue(json, '00185100'),
      protocolName: this.getStringValue(json, '00181030'),
      performingPhysicianName: this.getPersonName(json, '00081050'),
      operatorsName: this.getPersonName(json, '00081070'),
      laterality: this.getStringValue(json, '00200060') as 'L' | 'R' | '' | undefined,
      manufacturer: this.getStringValue(json, '00080070'),
      manufacturerModelName: this.getStringValue(json, '00081090'),
      stationName: this.getStringValue(json, '00081010'),
      numberOfSeriesRelatedInstances: this.getNumberValue(json, '00201209'),
      retrieveURL: this.getStringValue(json, '00081190'),
    };
  }

  /**
   * Parse DICOMInstance from JSON
   */
  private parseInstanceFromJSON(json: DICOMJSONObject): DICOMInstance {
    return {
      sopInstanceUID: this.getStringValue(json, '00080018') ?? '',
      sopClassUID: this.getStringValue(json, '00080016') ?? '',
      instanceNumber: this.getNumberValue(json, '00200013'),
      contentDate: this.getStringValue(json, '00080023'),
      contentTime: this.getStringValue(json, '00080033'),
      imageType: this.getStringArrayValue(json, '00080008'),
      rows: this.getNumberValue(json, '00280010'),
      columns: this.getNumberValue(json, '00280011'),
      bitsAllocated: this.getNumberValue(json, '00280100'),
      bitsStored: this.getNumberValue(json, '00280101'),
      highBit: this.getNumberValue(json, '00280102'),
      pixelRepresentation: this.getNumberValue(json, '00280103'),
      numberOfFrames: this.getNumberValue(json, '00280008'),
      photometricInterpretation: this.getStringValue(json, '00280004'),
      samplesPerPixel: this.getNumberValue(json, '00280002'),
      windowCenter: this.getNumberValue(json, '00281050'),
      windowWidth: this.getNumberValue(json, '00281051'),
      transferSyntaxUID: this.getStringValue(json, '00020010'),
      retrieveURL: this.getStringValue(json, '00081190'),
    };
  }

  /**
   * Parse UPSWorkitem from JSON
   */
  private parseWorkitemFromJSON(json: DICOMJSONObject): UPSWorkitem {
    return {
      sopInstanceUID: this.getStringValue(json, '00080018') ?? '',
      procedureStepState: (this.getStringValue(json, '00741000') ?? 'SCHEDULED') as UPSState,
      scheduledStationName: this.getStringValue(json, '00400010'),
      scheduledStationAETitle: this.getStringValue(json, '00400001'),
      scheduledProcedureStepStartDateTime: this.getStringValue(json, '00404005'),
      scheduledProcedureStepModificationDateTime: this.getStringValue(json, '00404010'),
      worklistLabel: this.getStringValue(json, '00741202'),
      transactionUID: this.getStringValue(json, '00081195'),
    };
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a DICOMweb client
 */
export function createDICOMwebClient(endpoint: DICOMwebEndpoint): DICOMwebClient {
  return new DICOMwebClient(endpoint);
}
