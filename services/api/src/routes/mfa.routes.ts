import { Router, RequestHandler } from "express";
import { mfaController } from "../controllers/mfa.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import rateLimit from "express-rate-limit";

const router = Router();

/**
 * Rate limiter for MFA verification endpoints
 * Strict limits to prevent brute force attacks
 */
const mfaVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many MFA verification attempts. Please try again later.",
  },
});

/**
 * Rate limiter for MFA enrollment
 */
const mfaEnrollLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many MFA enrollment attempts. Please try again later.",
  },
});

// ==========================================
// Protected MFA Management Routes (require authentication)
// Note: mfaController uses @ts-nocheck, so type assertions are needed
// until that controller is migrated to strict mode
// ==========================================

/**
 * GET /auth/mfa/status
 * Get current MFA status for the authenticated user
 */
router.get("/status", authenticate, mfaController.getStatus as unknown as RequestHandler);

/**
 * POST /auth/mfa/enroll
 * Initiate MFA enrollment - generates secret and QR code
 */
router.post(
  "/enroll",
  [authenticate, mfaEnrollLimiter as unknown as RequestHandler],
  mfaController.enableMfa as unknown as RequestHandler
);

/**
 * POST /auth/mfa/verify
 * Verify MFA setup with initial TOTP code
 * Enables MFA and returns backup codes
 */
router.post(
  "/verify",
  [authenticate, mfaVerifyLimiter as unknown as RequestHandler],
  mfaController.verifySetup as unknown as RequestHandler,
);

/**
 * POST /auth/mfa/disable
 * Disable MFA (requires password and valid MFA code)
 */
router.post(
  "/disable",
  [authenticate, mfaVerifyLimiter as unknown as RequestHandler],
  mfaController.disableMfa as unknown as RequestHandler,
);

/**
 * POST /auth/mfa/backup-codes/regenerate
 * Regenerate backup codes (requires password and valid MFA code)
 */
router.post(
  "/backup-codes/regenerate",
  [authenticate, mfaVerifyLimiter as unknown as RequestHandler],
  mfaController.regenerateBackupCodes as unknown as RequestHandler,
);

// ==========================================
// Public MFA Verification Route (for login flow)
// ==========================================

/**
 * POST /auth/mfa/verify-login
 * Verify MFA code during login (after password verification)
 * Requires mfaToken from login response
 */
router.post(
  "/verify-login",
  mfaVerifyLimiter as unknown as RequestHandler,
  mfaController.verifyMfaLogin as unknown as RequestHandler
);

export { router as mfaRoutes };
