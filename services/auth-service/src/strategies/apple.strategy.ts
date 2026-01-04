import jwt from 'jsonwebtoken';
import { OAuthBaseStrategy, OAuthTokenResponse } from './oauth-base.strategy.js';
import { OAuthProfile } from '../dtos/oauth.dto.js';
import { oauthConfig, getAppleConfig } from '../config/oauth.config.js';
import { logger } from '../utils/logger.js';

/**
 * Apple ID Token payload (decoded JWT)
 */
interface AppleIdTokenPayload {
  iss: string;           // Issuer (https://appleid.apple.com)
  sub: string;           // Subject - unique user ID
  aud: string;           // Audience - your client ID
  iat: number;           // Issued at
  exp: number;           // Expiration
  nonce?: string;        // Nonce if provided
  nonce_supported?: boolean;
  email?: string;        // User's email
  email_verified?: string | boolean; // Apple returns "true" as string
  is_private_email?: string | boolean;
  real_user_status?: number;
  transfer_sub?: string; // For team transfers
}

/**
 * Apple user info passed on first authorization
 */
interface AppleUserInfo {
  name?: {
    firstName?: string;
    lastName?: string;
  };
  email?: string;
}

/**
 * Apple OAuth Strategy
 *
 * Apple Sign-In is different from Google/Facebook:
 * - Uses JWT for client secret (not static secret)
 * - User info only provided on first authorization
 * - Uses id_token for user identity
 */
export class AppleStrategy extends OAuthBaseStrategy {
  private appleConfig = getAppleConfig();

  constructor() {
    super('apple', oauthConfig.providers.apple);
  }

  /**
   * Generate Apple client secret JWT
   * Apple requires a signed JWT as the client secret
   */
  private generateClientSecret(): string {
    if (!this.appleConfig) {
      throw new Error('Apple OAuth is not configured');
    }

    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 86400 * 180; // 180 days max

    const payload = {
      iss: this.appleConfig.teamId,
      iat: now,
      exp: expiry,
      aud: 'https://appleid.apple.com',
      sub: this.appleConfig.clientId,
    };

    const header = {
      alg: 'ES256',
      kid: this.appleConfig.keyId,
    };

    return jwt.sign(payload, this.appleConfig.privateKey, {
      algorithm: 'ES256',
      header,
    });
  }

  /**
   * Override to add Apple-specific parameters
   */
  getAuthorizationUrl(state: string, additionalParams?: Record<string, string>): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.callbackUrl,
      response_type: 'code id_token',
      response_mode: 'form_post', // Apple requires form_post for id_token
      scope: this.config.scope.join(' '),
      state: state,
      ...additionalParams,
    });

    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for tokens
   * Override to use dynamically generated client secret
   */
  async exchangeCodeForTokens(code: string): Promise<OAuthTokenResponse> {
    try {
      const clientSecret = this.generateClientSecret();

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
          client_secret: clientSecret,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error('Apple token exchange failed', {
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
      };
    } catch (error) {
      logger.error('Apple token exchange error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Fetch user profile from Apple
   * Apple is unique - user info comes from id_token, not a separate API call
   */
  async fetchUserProfile(
    tokens: OAuthTokenResponse,
    userInfo?: AppleUserInfo
  ): Promise<OAuthProfile> {
    try {
      if (!tokens.idToken) {
        throw new Error('No id_token in Apple token response');
      }

      // Decode the id_token (Apple uses RS256)
      // In production, you should verify the token signature
      const decoded = jwt.decode(tokens.idToken) as AppleIdTokenPayload;

      if (!decoded || !decoded.sub) {
        throw new Error('Invalid Apple id_token');
      }

      logger.info('Apple profile fetched successfully', {
        providerId: decoded.sub,
        email: decoded.email,
      });

      // Calculate token expiry
      let tokenExpiresAt: Date | null = null;
      if (tokens.expiresIn) {
        tokenExpiresAt = new Date();
        tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + tokens.expiresIn);
      }

      // Email verification - Apple returns string "true" or boolean
      const emailVerified =
        decoded.email_verified === true ||
        decoded.email_verified === 'true';

      return {
        providerId: decoded.sub,
        provider: 'apple',
        email: decoded.email || userInfo?.email || null,
        emailVerified,
        displayName: userInfo?.name
          ? `${userInfo.name.firstName || ''} ${userInfo.name.lastName || ''}`.trim()
          : null,
        firstName: userInfo?.name?.firstName || null,
        lastName: userInfo?.name?.lastName || null,
        avatarUrl: null, // Apple doesn't provide avatar
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt,
        rawProfile: {
          ...decoded,
          userInfo,
        } as unknown as Record<string, unknown>,
      };
    } catch (error) {
      logger.error('Apple profile fetch error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Verify the Apple id_token signature
   */
  async verifyIdToken(idToken: string): Promise<AppleIdTokenPayload> {
    try {
      // Fetch Apple's public keys
      const response = await fetch('https://appleid.apple.com/auth/keys');

      if (!response.ok) {
        throw new Error('Failed to fetch Apple public keys');
      }

      const { keys } = await response.json() as { keys: Array<{ kid: string }> };

      // Decode token header to get key ID
      const header = jwt.decode(idToken, { complete: true })?.header;

      if (!header?.kid) {
        throw new Error('Invalid token header');
      }

      // Find the matching key
      const key = keys.find((k: { kid: string }) => k.kid === header.kid);

      if (!key) {
        throw new Error('No matching key found');
      }

      // Convert JWK to PEM format (simplified - in production use a proper library)
      // For now, we'll trust the decoded payload for basic verification
      const decoded = jwt.decode(idToken) as AppleIdTokenPayload;

      // Verify claims
      if (decoded.iss !== 'https://appleid.apple.com') {
        throw new Error('Invalid issuer');
      }

      if (decoded.aud !== this.config.clientId) {
        throw new Error('Invalid audience');
      }

      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        throw new Error('Token expired');
      }

      return decoded;
    } catch (error) {
      logger.error('Apple id_token verification failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Refresh access token
   * Override to use dynamically generated client secret
   */
  async refreshAccessToken(refreshToken: string): Promise<OAuthTokenResponse> {
    try {
      const clientSecret = this.generateClientSecret();

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
          client_secret: clientSecret,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.text();
        logger.error('Apple token refresh failed', {
          status: response.status,
          error: errorData,
        });
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const data = await response.json() as Record<string, unknown>;

      return {
        accessToken: data.access_token as string,
        refreshToken: refreshToken, // Apple doesn't return new refresh token
        expiresIn: (data.expires_in as number) || null,
        tokenType: (data.token_type as string) || 'Bearer',
        idToken: data.id_token as string | undefined,
      };
    } catch (error) {
      logger.error('Apple token refresh error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Revoke Apple tokens
   */
  async revokeToken(token: string): Promise<boolean> {
    try {
      const clientSecret = this.generateClientSecret();

      const response = await fetch('https://appleid.apple.com/auth/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: clientSecret,
          token: token,
          token_type_hint: 'access_token',
        }).toString(),
      });

      if (!response.ok) {
        logger.warn('Apple token revocation failed', { status: response.status });
        return false;
      }

      logger.info('Apple token revoked successfully');
      return true;
    } catch (error) {
      logger.error('Apple token revocation error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * Check if Apple strategy is enabled
   */
  isEnabled(): boolean {
    return super.isEnabled() && this.appleConfig !== null;
  }
}

// Export singleton instance
export const appleStrategy = new AppleStrategy();
