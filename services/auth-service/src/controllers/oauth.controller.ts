import { Request, Response, NextFunction } from 'express';
import { oauthService } from '../services/oauth.service.js';
import {
  OAuthProviderSchema,
  OAuthCallbackSchema,
  UnlinkSocialAccountSchema,
} from '../dtos/oauth.dto.js';
import { BadRequestError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class OAuthController {
  /**
   * GET /auth/oauth/providers
   * Get list of enabled OAuth providers
   */
  async getProviders(_req: Request, res: Response, next: NextFunction) {
    try {
      const providers = oauthService.getEnabledProviders();

      res.json({
        success: true,
        data: {
          providers,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auth/oauth/:provider
   * Initiate OAuth flow - redirects to provider's authorization page
   */
  async initiateOAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const provider = OAuthProviderSchema.parse(req.params.provider);
      const redirectUrl = req.query.redirect_url as string | undefined;
      const linkAccount = req.query.link === 'true';

      // Check if linking to existing account
      let userId: string | undefined;
      if (linkAccount) {
        if (!req.user) {
          throw new BadRequestError(
            'Authentication required to link social accounts'
          );
        }
        userId = req.user.userId;
      }

      const { authorizationUrl, state } = await oauthService.initiateOAuth(
        provider,
        userId,
        redirectUrl
      );

      // Set state in cookie for additional security (optional)
      res.cookie('oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 10 * 60 * 1000, // 10 minutes
      });

      // Redirect to provider
      res.redirect(authorizationUrl);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auth/oauth/:provider/callback
   * Handle OAuth callback from provider
   */
  async handleCallback(req: Request, res: Response, _next: NextFunction) {
    try {
      const provider = OAuthProviderSchema.parse(req.params.provider);

      // Check for OAuth error
      if (req.query.error) {
        logger.warn('OAuth provider returned error', {
          provider,
          error: req.query.error,
          description: req.query.error_description,
        });

        return res.redirect(
          `/auth/error?error=${encodeURIComponent(req.query.error as string)}&provider=${provider}`
        );
      }

      // Parse callback data
      const input = OAuthCallbackSchema.parse({
        code: req.query.code || req.body?.code,
        state: req.query.state || req.body?.state,
        user: req.body?.user ? JSON.parse(req.body.user) : undefined,
      });

      // Verify state from cookie matches (optional additional security)
      const cookieState = req.cookies?.oauth_state;
      if (cookieState && cookieState !== input.state) {
        logger.warn('OAuth state cookie mismatch');
      }

      // Clear state cookie
      res.clearCookie('oauth_state');

      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await oauthService.handleCallback(
        provider,
        input.code,
        input.state,
        input.user,
        ipAddress,
        userAgent
      );

      logger.info('OAuth callback successful', {
        provider,
        isNewUser: result.isNewUser,
        userId: result.authResponse.user.id,
      });

      // Build redirect URL with tokens
      const redirectUrl = new URL(result.redirectUrl);
      redirectUrl.searchParams.set('access_token', result.authResponse.tokens.accessToken);
      redirectUrl.searchParams.set('refresh_token', result.authResponse.tokens.refreshToken);
      redirectUrl.searchParams.set('is_new_user', String(result.isNewUser));

      res.redirect(redirectUrl.toString());
    } catch (error) {
      logger.error('OAuth callback error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: req.params.provider,
      });

      // Redirect to error page
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      res.redirect(`/auth/error?error=${encodeURIComponent(errorMessage)}`);
    }
  }

  /**
   * POST /auth/oauth/:provider/callback
   * Handle OAuth callback (POST for Apple Sign-In form_post response mode)
   */
  async handleCallbackPost(req: Request, res: Response, next: NextFunction) {
    // Apple Sign-In uses form_post, so the data comes in req.body
    return this.handleCallback(req, res, next);
  }

  /**
   * POST /auth/oauth/:provider/token
   * Exchange authorization code for tokens (for mobile/SPA flows)
   */
  async exchangeToken(req: Request, res: Response, next: NextFunction) {
    try {
      const provider = OAuthProviderSchema.parse(req.params.provider);
      const input = OAuthCallbackSchema.parse(req.body);

      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await oauthService.handleCallback(
        provider,
        input.code,
        input.state,
        input.user,
        ipAddress,
        userAgent
      );

      res.json({
        success: true,
        data: {
          user: result.authResponse.user,
          tokens: result.authResponse.tokens,
          isNewUser: result.isNewUser,
        },
        message: result.isNewUser
          ? 'Account created successfully'
          : 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/oauth/link/:provider
   * Initiate linking a social account (for authenticated users)
   */
  async initiateLinkAccount(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new BadRequestError('Authentication required');
      }

      const provider = OAuthProviderSchema.parse(req.params.provider);
      const redirectUrl = req.body.redirectUrl as string | undefined;

      const { authorizationUrl, state } = await oauthService.initiateOAuth(
        provider,
        req.user.userId,
        redirectUrl
      );

      // For API calls, return the URL instead of redirecting
      res.json({
        success: true,
        data: {
          authorizationUrl,
          state,
        },
        message: 'Redirect to authorization URL to link account',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /auth/oauth/unlink/:provider
   * Unlink a social account
   */
  async unlinkAccount(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new BadRequestError('Authentication required');
      }

      const input = UnlinkSocialAccountSchema.parse({
        provider: req.params.provider,
      });

      const result = await oauthService.unlinkSocialAccount(
        req.user.userId,
        input.provider
      );

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auth/oauth/accounts
   * Get user's linked social accounts
   */
  async getLinkedAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new BadRequestError('Authentication required');
      }

      const accounts = await oauthService.getLinkedAccounts(req.user.userId);

      res.json({
        success: true,
        data: {
          accounts,
          availableProviders: oauthService.getEnabledProviders().filter(
            (provider) => !accounts.some((a) => a.provider === provider)
          ),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const oauthController = new OAuthController();
