import { OAuthProvider, OAuthProfile } from '../dtos/oauth.dto.js';
import { OAuthProviderConfig } from '../config/oauth.config.js';
import { logger } from '../utils/logger.js';

/**
 * Token response from OAuth provider
 */
export interface OAuthTokenResponse {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  tokenType: string;
  idToken?: string; // For OpenID Connect providers
  scope?: string;
}

/**
 * Base class for OAuth strategies
 */
export abstract class OAuthBaseStrategy {
  protected provider: OAuthProvider;
  protected config: OAuthProviderConfig;

  constructor(provider: OAuthProvider, config: OAuthProviderConfig) {
    this.provider = provider;
    this.config = config;
  }

  /**
   * Generate the authorization URL for the OAuth flow
   */
  getAuthorizationUrl(state: string, additionalParams?: Record<string, string>): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.callbackUrl,
      response_type: 'code',
      scope: this.config.scope.join(' '),
      state: state,
      ...additionalParams,
    });

    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<OAuthTokenResponse> {
    try {
      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.config.callbackUrl,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error('OAuth token exchange failed', {
          provider: this.provider,
          status: response.status,
          error: errorData,
        });
        throw new Error(`Token exchange failed: ${response.status}`);
      }

      const data = await response.json() as Record<string, unknown>;

      return {
        accessToken: data.access_token as string,
        refreshToken: (data.refresh_token as string) || null,
        expiresIn: (data.expires_in as number) || null,
        tokenType: (data.token_type as string) || 'Bearer',
        idToken: data.id_token as string | undefined,
        scope: data.scope as string | undefined,
      };
    } catch (error) {
      logger.error('OAuth token exchange error', {
        provider: this.provider,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Fetch user profile from the provider
   * Must be implemented by each provider strategy
   */
  abstract fetchUserProfile(tokens: OAuthTokenResponse): Promise<OAuthProfile>;

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResponse> {
    try {
      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error('OAuth token refresh failed', {
          provider: this.provider,
          status: response.status,
          error: errorData,
        });
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json() as Record<string, unknown>;

      return {
        accessToken: data.access_token as string,
        refreshToken: (data.refresh_token as string) || refreshToken, // Some providers return new refresh token
        expiresIn: (data.expires_in as number) || null,
        tokenType: (data.token_type as string) || 'Bearer',
        idToken: data.id_token as string | undefined,
        scope: data.scope as string | undefined,
      };
    } catch (error) {
      logger.error('OAuth token refresh error', {
        provider: this.provider,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Revoke tokens (if supported by provider)
   */
  async revokeToken(_token: string): Promise<boolean> {
    // Default implementation - override in specific strategies if supported
    logger.warn('Token revocation not implemented for provider', { provider: this.provider });
    return false;
  }

  /**
   * Get the provider name
   */
  getProvider(): OAuthProvider {
    return this.provider;
  }

  /**
   * Check if the strategy is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }
}
