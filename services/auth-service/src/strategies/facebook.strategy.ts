import { OAuthBaseStrategy, OAuthTokenResponse } from './oauth-base.strategy.js';
import { OAuthProfile } from '../dtos/oauth.dto.js';
import { oauthConfig } from '../config/oauth.config.js';
import { logger } from '../utils/logger.js';

/**
 * Facebook Graph API user info response
 */
interface FacebookUserInfo {
  id: string;
  email?: string;
  name: string;
  first_name?: string;
  last_name?: string;
  picture?: {
    data: {
      url: string;
      width: number;
      height: number;
    };
  };
}

/**
 * Facebook OAuth Strategy
 */
export class FacebookStrategy extends OAuthBaseStrategy {
  constructor() {
    super('facebook', oauthConfig.providers.facebook);
  }

  /**
   * Override to add Facebook-specific parameters
   */
  getAuthorizationUrl(state: string, additionalParams?: Record<string, string>): string {
    return super.getAuthorizationUrl(state, {
      auth_type: 'rerequest', // Re-request declined permissions
      ...additionalParams,
    });
  }

  /**
   * Fetch user profile from Facebook
   */
  async fetchUserProfile(tokens: OAuthTokenResponse): Promise<OAuthProfile> {
    try {
      // Facebook requires specifying fields to retrieve
      const fields = 'id,email,name,first_name,last_name,picture.type(large)';
      const url = `${this.config.userInfoUrl}?fields=${encodeURIComponent(fields)}&access_token=${encodeURIComponent(tokens.accessToken)}`;

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error('Facebook profile fetch failed', {
          status: response.status,
          error: errorData,
        });
        throw new Error(`Failed to fetch Facebook profile: ${response.status}`);
      }

      const data = await response.json() as FacebookUserInfo;

      logger.info('Facebook profile fetched successfully', {
        providerId: data.id,
        email: data.email,
      });

      // Calculate token expiry - Facebook tokens typically expire in 60 days
      let tokenExpiresAt: Date | null = null;
      if (tokens.expiresIn) {
        tokenExpiresAt = new Date();
        tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + tokens.expiresIn);
      }

      return {
        providerId: data.id,
        provider: 'facebook',
        email: data.email || null,
        // Facebook doesn't provide email_verified, assume verified if email exists
        emailVerified: !!data.email,
        displayName: data.name,
        firstName: data.first_name || null,
        lastName: data.last_name || null,
        avatarUrl: data.picture?.data?.url || null,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt,
        rawProfile: data as unknown as Record<string, unknown>,
      };
    } catch (error) {
      logger.error('Facebook profile fetch error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Exchange short-lived token for long-lived token
   */
  async exchangeForLongLivedToken(shortLivedToken: string): Promise<OAuthTokenResponse> {
    try {
      const url = new URL(this.config.tokenUrl);
      url.searchParams.set('grant_type', 'fb_exchange_token');
      url.searchParams.set('client_id', this.config.clientId);
      url.searchParams.set('client_secret', this.config.clientSecret);
      url.searchParams.set('fb_exchange_token', shortLivedToken);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error('Facebook long-lived token exchange failed', {
          status: response.status,
          error: errorData,
        });
        throw new Error(`Long-lived token exchange failed: ${response.status}`);
      }

      const data = await response.json() as Record<string, unknown>;

      return {
        accessToken: data.access_token as string,
        refreshToken: null, // Facebook doesn't use refresh tokens
        expiresIn: data.expires_in as number,
        tokenType: (data.token_type as string) || 'Bearer',
      };
    } catch (error) {
      logger.error('Facebook long-lived token exchange error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Debug and inspect token (useful for checking permissions)
   */
  async inspectToken(token: string): Promise<{
    isValid: boolean;
    userId?: string;
    scopes?: string[];
    expiresAt?: Date;
  }> {
    try {
      const appToken = `${this.config.clientId}|${this.config.clientSecret}`;
      const url = `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(token)}&access_token=${encodeURIComponent(appToken)}`;

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        return { isValid: false };
      }

      const data = await response.json() as { data?: { is_valid?: boolean; user_id?: string; scopes?: string[]; expires_at?: number } };

      return {
        isValid: data.data?.is_valid || false,
        userId: data.data?.user_id,
        scopes: data.data?.scopes,
        expiresAt: data.data?.expires_at
          ? new Date(data.data.expires_at * 1000)
          : undefined,
      };
    } catch (error) {
      logger.error('Facebook token inspection error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return { isValid: false };
    }
  }
}

// Export singleton instance
export const facebookStrategy = new FacebookStrategy();
