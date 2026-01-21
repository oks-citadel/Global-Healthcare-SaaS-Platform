/**
 * Microsoft OAuth2 Strategy
 * Implements Microsoft/Azure AD authentication using OAuth 2.0
 * Supports both Microsoft personal accounts and organizational accounts
 */

import { OAuthBaseStrategy, OAuthTokenResponse } from './oauth-base.strategy.js';
import { OAuthProfile } from '../dtos/oauth.dto.js';
import { oauthConfig } from '../config/oauth.config.js';
import { logger } from '../utils/logger.js';

/**
 * Microsoft Graph API user info response
 */
interface MicrosoftUserInfo {
  id: string;                    // Unique Microsoft user ID
  userPrincipalName: string;     // Usually the email for work/school accounts
  mail: string | null;           // Primary email address
  displayName: string;
  givenName: string | null;
  surname: string | null;
  jobTitle: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
  businessPhones: string[];
  mobilePhone: string | null;
}

/**
 * Microsoft OAuth token response with additional fields
 */
interface MicrosoftTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
  id_token?: string;
}

/**
 * Microsoft OAuth Strategy
 */
export class MicrosoftStrategy extends OAuthBaseStrategy {
  private readonly graphApiUrl: string = 'https://graph.microsoft.com/v1.0';

  constructor() {
    // Use Microsoft config from oauthConfig
    const microsoftConfig = oauthConfig.providers.microsoft ?? {
      enabled: false,
      clientId: '',
      clientSecret: '',
      callbackUrl: '',
      scope: [],
      authorizationUrl: '',
      tokenUrl: '',
      userInfoUrl: '',
    };
    super('microsoft', microsoftConfig);
  }

  /**
   * Override to add Microsoft-specific parameters
   */
  getAuthorizationUrl(state: string, additionalParams?: Record<string, string>): string {
    return super.getAuthorizationUrl(state, {
      response_type: 'code',
      response_mode: 'query',
      prompt: 'select_account', // Let user choose account
      ...additionalParams,
    });
  }

  /**
   * Exchange code for tokens - Microsoft uses form data
   */
  async exchangeCodeForTokens(code: string): Promise<OAuthTokenResponse> {
    try {
      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code: code,
          redirect_uri: this.config.callbackUrl,
          grant_type: 'authorization_code',
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error('Microsoft token exchange failed', {
          status: response.status,
          error: errorData,
        });
        throw new Error(`Token exchange failed: ${response.status}`);
      }

      const data = await response.json() as MicrosoftTokenResponse;

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || null,
        expiresIn: data.expires_in,
        tokenType: data.token_type,
        idToken: data.id_token,
        scope: data.scope,
      };
    } catch (error) {
      logger.error('Microsoft token exchange error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Fetch user profile from Microsoft Graph API
   */
  async fetchUserProfile(tokens: OAuthTokenResponse): Promise<OAuthProfile> {
    try {
      const response = await fetch(`${this.graphApiUrl}/me`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error('Microsoft profile fetch failed', {
          status: response.status,
          error: errorData,
        });
        throw new Error(`Failed to fetch Microsoft profile: ${response.status}`);
      }

      const data = await response.json() as MicrosoftUserInfo;

      logger.info('Microsoft profile fetched successfully', {
        providerId: data.id,
        email: data.mail || data.userPrincipalName,
      });

      // Calculate token expiry
      let tokenExpiresAt: Date | null = null;
      if (tokens.expiresIn) {
        tokenExpiresAt = new Date();
        tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + tokens.expiresIn);
      }

      // Determine email - prefer mail, fall back to userPrincipalName
      const email = data.mail || data.userPrincipalName;
      const emailVerified = !!email; // Microsoft accounts are generally verified

      return {
        providerId: data.id,
        provider: 'microsoft',
        email: email,
        emailVerified: emailVerified,
        displayName: data.displayName,
        firstName: data.givenName,
        lastName: data.surname,
        avatarUrl: null, // Microsoft requires separate call for profile photo
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt,
        rawProfile: data as unknown as Record<string, unknown>,
      };
    } catch (error) {
      logger.error('Microsoft profile fetch error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get user profile photo URL (optional - requires additional API call)
   */
  async getProfilePhoto(accessToken: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.graphApiUrl}/me/photo/$value`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        // Photo might not exist for all accounts
        if (response.status === 404) {
          return null;
        }
        logger.warn('Microsoft photo fetch failed', { status: response.status });
        return null;
      }

      // Convert to base64 data URL
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      logger.warn('Error fetching Microsoft profile photo', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResponse> {
    try {
      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error('Microsoft token refresh failed', {
          status: response.status,
          error: errorData,
        });
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json() as MicrosoftTokenResponse;

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || refreshToken,
        expiresIn: data.expires_in,
        tokenType: data.token_type,
        idToken: data.id_token,
        scope: data.scope,
      };
    } catch (error) {
      logger.error('Microsoft token refresh error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Revoke Microsoft tokens
   * Note: Microsoft doesn't have a standard token revocation endpoint
   * Token revocation is typically handled by user signing out of Azure AD
   */
  async revokeToken(_token: string): Promise<boolean> {
    logger.warn('Microsoft token revocation - tokens expire automatically');
    return true;
  }
}

// Export singleton instance
export const microsoftStrategy = new MicrosoftStrategy();
