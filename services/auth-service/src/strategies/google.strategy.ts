import { OAuthBaseStrategy, OAuthTokenResponse } from './oauth-base.strategy.js';
import { OAuthProfile } from '../dtos/oauth.dto.js';
import { oauthConfig } from '../config/oauth.config.js';
import { logger } from '../utils/logger.js';

/**
 * Google OAuth2 user info response
 */
interface GoogleUserInfo {
  sub: string;          // Unique Google user ID
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale?: string;
}

/**
 * Google OAuth Strategy
 */
export class GoogleStrategy extends OAuthBaseStrategy {
  constructor() {
    super('google', oauthConfig.providers.google);
  }

  /**
   * Override to add Google-specific parameters
   */
  getAuthorizationUrl(state: string, additionalParams?: Record<string, string>): string {
    return super.getAuthorizationUrl(state, {
      access_type: 'offline', // Request refresh token
      prompt: 'consent',       // Force consent to ensure refresh token
      ...additionalParams,
    });
  }

  /**
   * Fetch user profile from Google
   */
  async fetchUserProfile(tokens: OAuthTokenResponse): Promise<OAuthProfile> {
    try {
      const response = await fetch(this.config.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error('Google profile fetch failed', {
          status: response.status,
          error: errorData,
        });
        throw new Error(`Failed to fetch Google profile: ${response.status}`);
      }

      const data = await response.json() as GoogleUserInfo;

      logger.info('Google profile fetched successfully', {
        providerId: data.sub,
        email: data.email,
      });

      // Calculate token expiry
      let tokenExpiresAt: Date | null = null;
      if (tokens.expiresIn) {
        tokenExpiresAt = new Date();
        tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + tokens.expiresIn);
      }

      return {
        providerId: data.sub,
        provider: 'google',
        email: data.email,
        emailVerified: data.email_verified,
        displayName: data.name,
        firstName: data.given_name,
        lastName: data.family_name,
        avatarUrl: data.picture,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt,
        rawProfile: data as unknown as Record<string, unknown>,
      };
    } catch (error) {
      logger.error('Google profile fetch error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Revoke Google tokens
   */
  async revokeToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (!response.ok) {
        logger.warn('Google token revocation failed', { status: response.status });
        return false;
      }

      logger.info('Google token revoked successfully');
      return true;
    } catch (error) {
      logger.error('Google token revocation error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }
}

// Export singleton instance
export const googleStrategy = new GoogleStrategy();
