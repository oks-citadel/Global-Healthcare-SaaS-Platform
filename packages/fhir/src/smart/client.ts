/**
 * SMART on FHIR Client
 * Implements SMART App Launch IG 2.0: http://hl7.org/fhir/smart-app-launch/
 */

import {
  SMARTConfiguration,
  SMARTToken,
  SMARTContext,
  SMARTLaunchParams,
  SMARTClientConfig,
  SMARTAuthorizationRequest,
  SMARTTokenRequest,
  SMARTError,
  ISMARTClient,
  SMARTStorage,
} from './types';
import { parseScopes, checkAccess } from './scopes';
import { extractOAuthURIs, CapabilityStatement } from './capability';

/**
 * Default in-memory storage implementation
 */
class InMemoryStorage implements SMARTStorage {
  private store = new Map<string, string>();

  async set(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }
}

/**
 * Storage keys used by SMART client
 */
const STORAGE_KEYS = {
  STATE: 'smart_state',
  CODE_VERIFIER: 'smart_code_verifier',
  TOKEN: 'smart_token',
  CONFIGURATION: 'smart_configuration',
} as const;

/**
 * Generate a cryptographically secure random string
 */
function generateRandomString(length: number): string {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((x) => charset[x % charset.length])
    .join('');
}

/**
 * Generate PKCE code verifier (43-128 characters)
 */
export function generateCodeVerifier(): string {
  return generateRandomString(64);
}

/**
 * Generate PKCE code challenge from verifier using S256
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);

  // Base64url encode without padding
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Generate a state parameter for CSRF protection
 */
export function generateState(): string {
  return generateRandomString(32);
}

/**
 * SMART on FHIR Client Implementation
 */
export class SMARTClient implements ISMARTClient {
  private config: SMARTClientConfig;
  private storage: SMARTStorage;
  private smartConfig: SMARTConfiguration | null = null;
  private currentToken: SMARTToken | null = null;

  constructor(config: SMARTClientConfig) {
    this.config = config;
    this.storage = config.storage || new InMemoryStorage();
  }

  /**
   * Discover SMART configuration from .well-known endpoint
   */
  async getConfiguration(): Promise<SMARTConfiguration> {
    if (this.smartConfig) {
      return this.smartConfig;
    }

    // Try .well-known/smart-configuration first (preferred)
    try {
      const wellKnownUrl = new URL(
        '/.well-known/smart-configuration',
        this.config.fhirBaseUrl
      ).toString();

      const response = await fetch(wellKnownUrl, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        this.smartConfig = await response.json() as SMARTConfiguration;
        await this.storage.set(
          STORAGE_KEYS.CONFIGURATION,
          JSON.stringify(this.smartConfig)
        );
        return this.smartConfig!;
      }
    } catch {
      // Fall back to CapabilityStatement
    }

    // Fall back to CapabilityStatement metadata endpoint
    const metadataUrl = new URL('/metadata', this.config.fhirBaseUrl).toString();
    const metadataResponse = await fetch(metadataUrl, {
      headers: {
        Accept: 'application/fhir+json',
      },
    });

    if (!metadataResponse.ok) {
      throw new Error(
        `Failed to fetch SMART configuration: ${metadataResponse.status} ${metadataResponse.statusText}`
      );
    }

    const capabilityStatement = await metadataResponse.json() as CapabilityStatement;
    const oauthUris = extractOAuthURIs(capabilityStatement);

    if (!oauthUris.authorization_endpoint || !oauthUris.token_endpoint) {
      throw new Error(
        'SMART configuration not found in .well-known or CapabilityStatement'
      );
    }

    this.smartConfig = {
      authorization_endpoint: oauthUris.authorization_endpoint,
      token_endpoint: oauthUris.token_endpoint,
      registration_endpoint: oauthUris.registration_endpoint,
      capabilities: [],
      ...oauthUris,
    } as SMARTConfiguration;

    await this.storage.set(
      STORAGE_KEYS.CONFIGURATION,
      JSON.stringify(this.smartConfig)
    );

    return this.smartConfig;
  }

  /**
   * Build authorization URL with all required parameters
   */
  private async buildAuthorizationUrl(
    options: {
      launch?: string;
      patientId?: string;
    } = {}
  ): Promise<string> {
    const config = await this.getConfiguration();

    // Generate PKCE parameters
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Generate state
    const state = this.config.stateGenerator
      ? this.config.stateGenerator()
      : generateState();

    // Store PKCE verifier and state
    await this.storage.set(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);
    await this.storage.set(STORAGE_KEYS.STATE, state);

    // Build authorization request
    const params: SMARTAuthorizationRequest = {
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      state,
      aud: this.config.fhirBaseUrl,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    };

    // Add launch parameter for EHR launch
    if (options.launch) {
      params.launch = options.launch;
    }

    // Build URL
    const authUrl = new URL(config.authorization_endpoint);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        authUrl.searchParams.set(key, value);
      }
    });

    return authUrl.toString();
  }

  /**
   * Generate authorization URL for EHR launch flow
   */
  async authorizeEHRLaunch(launchParams: SMARTLaunchParams): Promise<string> {
    // Validate issuer matches configured FHIR base URL
    if (launchParams.iss !== this.config.fhirBaseUrl) {
      throw new Error(
        `Issuer mismatch: expected ${this.config.fhirBaseUrl}, got ${launchParams.iss}`
      );
    }

    return this.buildAuthorizationUrl({
      launch: launchParams.launch,
    });
  }

  /**
   * Generate authorization URL for standalone launch flow
   */
  async authorizeStandalone(patientId?: string): Promise<string> {
    return this.buildAuthorizationUrl({
      patientId,
    });
  }

  /**
   * Handle authorization callback
   */
  async handleCallback(callbackUrl: string): Promise<SMARTToken> {
    const url = new URL(callbackUrl);

    // Check for error response
    const error = url.searchParams.get('error');
    if (error) {
      const errorResponse: SMARTError = {
        error: error as SMARTError['error'],
        error_description: url.searchParams.get('error_description') ?? undefined,
        error_uri: url.searchParams.get('error_uri') ?? undefined,
        state: url.searchParams.get('state') ?? undefined,
      };
      throw new Error(
        `Authorization failed: ${errorResponse.error} - ${errorResponse.error_description}`
      );
    }

    // Extract authorization code and state
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) {
      throw new Error('Authorization code not found in callback URL');
    }

    // Validate state parameter
    const storedState = await this.storage.get(STORAGE_KEYS.STATE);
    if (state !== storedState) {
      throw new Error('State mismatch - possible CSRF attack');
    }

    // Get code verifier
    const codeVerifier = await this.storage.get(STORAGE_KEYS.CODE_VERIFIER);

    // Exchange code for token
    const token = await this.exchangeCodeForToken(code, codeVerifier ?? undefined);

    // Clean up stored values
    await this.storage.remove(STORAGE_KEYS.STATE);
    await this.storage.remove(STORAGE_KEYS.CODE_VERIFIER);

    return token;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForToken(
    code: string,
    codeVerifier?: string
  ): Promise<SMARTToken> {
    const config = await this.getConfiguration();

    const tokenRequest: SMARTTokenRequest = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.redirectUri,
    };

    // Add PKCE code verifier if available
    if (codeVerifier) {
      tokenRequest.code_verifier = codeVerifier;
    }

    // Add client authentication
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (this.config.clientSecret) {
      // Confidential client with client_secret
      if (
        this.config.tokenEndpointAuthMethod === 'client_secret_basic' ||
        !this.config.tokenEndpointAuthMethod
      ) {
        const credentials = btoa(
          `${this.config.clientId}:${this.config.clientSecret}`
        );
        headers['Authorization'] = `Basic ${credentials}`;
      } else if (this.config.tokenEndpointAuthMethod === 'client_secret_post') {
        tokenRequest.client_id = this.config.clientId;
        (tokenRequest as unknown as Record<string, string>).client_secret =
          this.config.clientSecret;
      }
    } else if (this.config.privateKey) {
      // Confidential client with private_key_jwt
      const assertion = await this.createClientAssertion(config.token_endpoint);
      tokenRequest.client_assertion = assertion;
      tokenRequest.client_assertion_type =
        'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';
    } else {
      // Public client
      tokenRequest.client_id = this.config.clientId;
    }

    // Make token request
    const body = new URLSearchParams(
      Object.entries(tokenRequest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    ).toString();

    const response = await fetch(config.token_endpoint, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage: string;
      try {
        const errorJson = JSON.parse(errorBody) as SMARTError;
        errorMessage = `Token exchange failed: ${errorJson.error} - ${errorJson.error_description}`;
      } catch {
        errorMessage = `Token exchange failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const token = (await response.json()) as SMARTToken;

    // Add timestamp
    token.obtained_at = Date.now();

    // Store token
    this.currentToken = token;
    await this.storage.set(STORAGE_KEYS.TOKEN, JSON.stringify(token));

    return token;
  }

  /**
   * Refresh an access token
   */
  async refreshToken(refreshToken: string): Promise<SMARTToken> {
    const config = await this.getConfiguration();

    const tokenRequest: SMARTTokenRequest = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      scope: this.config.scope,
    };

    // Add client authentication
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (this.config.clientSecret) {
      if (
        this.config.tokenEndpointAuthMethod === 'client_secret_basic' ||
        !this.config.tokenEndpointAuthMethod
      ) {
        const credentials = btoa(
          `${this.config.clientId}:${this.config.clientSecret}`
        );
        headers['Authorization'] = `Basic ${credentials}`;
      } else if (this.config.tokenEndpointAuthMethod === 'client_secret_post') {
        tokenRequest.client_id = this.config.clientId;
        (tokenRequest as unknown as Record<string, string>).client_secret =
          this.config.clientSecret;
      }
    } else if (this.config.privateKey) {
      const assertion = await this.createClientAssertion(config.token_endpoint);
      tokenRequest.client_assertion = assertion;
      tokenRequest.client_assertion_type =
        'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';
    } else {
      tokenRequest.client_id = this.config.clientId;
    }

    const body = new URLSearchParams(
      Object.entries(tokenRequest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    ).toString();

    const response = await fetch(config.token_endpoint, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMessage: string;
      try {
        const errorJson = JSON.parse(errorBody) as SMARTError;
        errorMessage = `Token refresh failed: ${errorJson.error} - ${errorJson.error_description}`;
      } catch {
        errorMessage = `Token refresh failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const token = (await response.json()) as SMARTToken;
    token.obtained_at = Date.now();

    // Preserve refresh token if not returned
    if (!token.refresh_token && refreshToken) {
      token.refresh_token = refreshToken;
    }

    this.currentToken = token;
    await this.storage.set(STORAGE_KEYS.TOKEN, JSON.stringify(token));

    return token;
  }

  /**
   * Create JWT client assertion for private_key_jwt authentication
   */
  private async createClientAssertion(audience: string): Promise<string> {
    if (!this.config.privateKey) {
      throw new Error('Private key required for client assertion');
    }

    // Import private key
    const privateKey = await this.importPrivateKey(this.config.privateKey);

    // Create JWT header
    const header = {
      alg: 'RS384',
      typ: 'JWT',
      kid: this.config.privateKeyId,
    };

    // Create JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: this.config.clientId,
      sub: this.config.clientId,
      aud: audience,
      jti: generateRandomString(32),
      exp: now + 300, // 5 minutes
      iat: now,
    };

    // Encode header and payload
    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    // Sign
    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-384',
      },
      privateKey,
      encoder.encode(signingInput)
    );

    const encodedSignature = this.base64UrlEncode(
      String.fromCharCode(...new Uint8Array(signature))
    );

    return `${signingInput}.${encodedSignature}`;
  }

  /**
   * Import PEM private key
   */
  private async importPrivateKey(pem: string): Promise<CryptoKey> {
    // Remove PEM header/footer and decode
    const pemContents = pem
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/-----BEGIN RSA PRIVATE KEY-----/, '')
      .replace(/-----END RSA PRIVATE KEY-----/, '')
      .replace(/\s/g, '');

    const binaryDer = atob(pemContents);
    const binaryArray = new Uint8Array(binaryDer.length);
    for (let i = 0; i < binaryDer.length; i++) {
      binaryArray[i] = binaryDer.charCodeAt(i);
    }

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
  }

  /**
   * Base64URL encode
   */
  private base64UrlEncode(str: string): string {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  /**
   * Get current token
   */
  getToken(): SMARTToken | null {
    return this.currentToken;
  }

  /**
   * Check if current token is expired
   */
  isTokenExpired(): boolean {
    if (!this.currentToken) {
      return true;
    }

    const { obtained_at, expires_in } = this.currentToken;
    if (!obtained_at || !expires_in) {
      return false; // Can't determine, assume not expired
    }

    // Add 60 second buffer
    const expirationTime = obtained_at + expires_in * 1000 - 60000;
    return Date.now() >= expirationTime;
  }

  /**
   * Get current token with automatic refresh
   */
  async getValidToken(): Promise<SMARTToken | null> {
    if (!this.currentToken) {
      // Try to load from storage
      const stored = await this.storage.get(STORAGE_KEYS.TOKEN);
      if (stored) {
        this.currentToken = JSON.parse(stored);
      }
    }

    if (!this.currentToken) {
      return null;
    }

    // Refresh if expired
    if (this.isTokenExpired() && this.currentToken.refresh_token) {
      return this.refreshToken(this.currentToken.refresh_token);
    }

    return this.currentToken;
  }

  /**
   * Get launch context from token
   */
  getContext(): SMARTContext {
    const context: SMARTContext = {};

    if (this.currentToken) {
      if (this.currentToken.patient) {
        context.patient = this.currentToken.patient;
      }
      if (this.currentToken.encounter) {
        context.encounter = this.currentToken.encounter;
      }
      if (this.currentToken.fhirUser) {
        context.fhirUser = this.currentToken.fhirUser;
      }
      if (this.currentToken.need_patient_banner !== undefined) {
        context.need_patient_banner = this.currentToken.need_patient_banner;
      }
      if (this.currentToken.smart_style_url) {
        context.smart_style_url = this.currentToken.smart_style_url;
      }
      if (this.currentToken.tenant) {
        context.tenant = this.currentToken.tenant;
      }
    }

    return context;
  }

  /**
   * Check if a scope is granted
   */
  hasScope(scope: string): boolean {
    if (!this.currentToken?.scope) {
      return false;
    }

    const grantedScopes = this.currentToken.scope.split(/\s+/);
    return grantedScopes.includes(scope);
  }

  /**
   * Check if access is granted for a resource operation
   */
  hasAccess(
    resourceType: string,
    operation: 'read' | 'write' | 'create' | 'update' | 'delete' | 'search'
  ): boolean {
    if (!this.currentToken?.scope) {
      return false;
    }

    const scopes = parseScopes(this.currentToken.scope);
    return checkAccess(scopes, resourceType, operation);
  }

  /**
   * Make authenticated FHIR request
   */
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getValidToken();

    if (!token) {
      throw new Error('No valid access token available');
    }

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
      if (response.status === 401) {
        // Try to refresh token and retry
        if (token.refresh_token) {
          const newToken = await this.refreshToken(token.refresh_token);
          return this.request<T>(path, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `${newToken.token_type} ${newToken.access_token}`,
            },
          });
        }
      }

      const errorBody = await response.text();
      throw new Error(
        `FHIR request failed: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Clear stored tokens and configuration
   */
  async logout(): Promise<void> {
    this.currentToken = null;
    this.smartConfig = null;
    await this.storage.remove(STORAGE_KEYS.TOKEN);
    await this.storage.remove(STORAGE_KEYS.STATE);
    await this.storage.remove(STORAGE_KEYS.CODE_VERIFIER);
    await this.storage.remove(STORAGE_KEYS.CONFIGURATION);
  }
}

/**
 * Create a SMART client instance
 */
export function createSMARTClient(config: SMARTClientConfig): SMARTClient {
  return new SMARTClient(config);
}

/**
 * Parse SMART launch parameters from URL
 */
export function parseLaunchParams(url: string): SMARTLaunchParams | null {
  const urlObj = new URL(url);
  const launch = urlObj.searchParams.get('launch');
  const iss = urlObj.searchParams.get('iss');

  if (!launch || !iss) {
    return null;
  }

  return {
    launch,
    iss,
    aud: urlObj.searchParams.get('aud') ?? undefined,
  };
}

/**
 * Check if URL contains SMART launch parameters
 */
export function isEHRLaunch(url: string): boolean {
  const urlObj = new URL(url);
  return (
    urlObj.searchParams.has('launch') && urlObj.searchParams.has('iss')
  );
}
