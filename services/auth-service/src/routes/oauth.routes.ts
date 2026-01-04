import { Router } from 'express';
import { oauthController } from '../controllers/oauth.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rate-limit.middleware.js';

const router: ReturnType<typeof Router> = Router();

/**
 * Public routes
 */

// Get enabled OAuth providers
router.get('/providers', oauthController.getProviders.bind(oauthController));

// Initiate OAuth flow (redirects to provider)
// Uses optional auth - if authenticated, allows account linking
router.get(
  '/:provider',
  authLimiter,
  optionalAuth,
  oauthController.initiateOAuth.bind(oauthController)
);

// OAuth callback (GET - for Google, Facebook)
router.get(
  '/:provider/callback',
  oauthController.handleCallback.bind(oauthController)
);

// OAuth callback (POST - for Apple Sign-In form_post)
router.post(
  '/:provider/callback',
  oauthController.handleCallbackPost.bind(oauthController)
);

// Token exchange endpoint (for mobile/SPA flows)
router.post(
  '/:provider/token',
  authLimiter,
  oauthController.exchangeToken.bind(oauthController)
);

/**
 * Protected routes (require authentication)
 */

// Initiate account linking
router.post(
  '/link/:provider',
  authenticate,
  authLimiter,
  oauthController.initiateLinkAccount.bind(oauthController)
);

// Unlink a social account
router.delete(
  '/unlink/:provider',
  authenticate,
  oauthController.unlinkAccount.bind(oauthController)
);

// Get linked social accounts
router.get(
  '/accounts',
  authenticate,
  oauthController.getLinkedAccounts.bind(oauthController)
);

export default router;
