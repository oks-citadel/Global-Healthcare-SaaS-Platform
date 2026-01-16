import { Router } from "express";
import { mfaController } from "../controllers/mfa.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rate-limit.middleware.js";

const router: ReturnType<typeof Router> = Router();

// Protected routes (require authentication)
router.get(
  "/status",
  authenticate,
  mfaController.getStatus.bind(mfaController),
);
router.post(
  "/enable",
  authenticate,
  mfaController.enableMfa.bind(mfaController),
);
router.post(
  "/verify-setup",
  authenticate,
  mfaController.verifySetup.bind(mfaController),
);
router.post(
  "/disable",
  authenticate,
  mfaController.disableMfa.bind(mfaController),
);
router.post(
  "/backup-codes/regenerate",
  authenticate,
  mfaController.regenerateBackupCodes.bind(mfaController),
);

// Public route for MFA verification during login (rate limited)
router.post(
  "/verify-login",
  authLimiter,
  mfaController.verifyMfaLogin.bind(mfaController),
);

export default router;
