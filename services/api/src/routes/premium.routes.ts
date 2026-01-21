import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { ForbiddenError } from "../utils/errors.js";
import { prisma } from "../lib/prisma.js";

// ==========================================
// Type Definitions
// ==========================================

interface VideoSessionRequest {
  patientId: string;
  providerId: string;
}

interface VideoSessionResponse {
  success: boolean;
  sessionId: string;
  userId: string;
  patientId: string;
  providerId: string;
  roomUrl: string;
  expiresAt: string;
  message: string;
}

interface SymptomsAnalysisRequest {
  symptoms: string[];
}

interface ConditionProbability {
  name: string;
  probability: number;
}

interface SymptomsAnalysisResponse {
  success: boolean;
  analysisId: string;
  userId: string;
  symptoms: string[];
  possibleConditions: ConditionProbability[];
  recommendation: string;
  disclaimer: string;
  analyzedAt: string;
}

interface ExportRecordsRequest {
  format?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

interface ExportRecordsResponse {
  success: boolean;
  exportId: string;
  userId: string;
  format: string;
  dateRange?: {
    from: string;
    to: string;
  };
  status: string;
  estimatedCompletionTime: string;
  message: string;
}

interface SubscriptionWithPlan {
  id: string;
  userId: string;
  status: string;
  tier?: string;
  plan: {
    id: string;
    name: string;
    tier?: string;
  } | null;
}

const router = Router();

/**
 * Payment Required Error
 * Returns 402 status code for subscription-gated features
 */
class PaymentRequiredError extends Error {
  statusCode = 402;
  code = "ERR_PAYMENT_REQUIRED";

  constructor(message: string = "Active subscription required") {
    super(message);
    this.name = "PaymentRequiredError";
  }
}

/**
 * Middleware to check subscription status
 * Returns 402 Payment Required if user has no active subscription
 */
const requireSubscription = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return next(new ForbiddenError("Authentication required"));
    }

    // Check for active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: req.user.userId,
        status: "active",
      },
    });

    if (!subscription) {
      return next(
        new PaymentRequiredError(
          "Active subscription required for this feature",
        ),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check premium tier subscription
 * Returns 402 Payment Required if user doesn't have premium tier
 */
const requirePremiumTier = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return next(new ForbiddenError("Authentication required"));
    }

    // Check for active subscription with premium tier
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: req.user.userId,
        status: "active",
      },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      return next(
        new PaymentRequiredError(
          "Premium subscription required for this feature",
        ),
      );
    }

    // Check if subscription tier is premium or higher
    // Free tier subscriptions don't qualify for AI features
    const subscriptionWithTier = subscription as unknown as SubscriptionWithPlan;
    const tier =
      subscriptionWithTier.tier || subscriptionWithTier.plan?.tier || "free";
    if (tier === "free") {
      return next(
        new PaymentRequiredError(
          "Premium tier subscription required for AI features",
        ),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Premium Feature Controller Stubs
// ==========================================

const premiumController = {
  /**
   * POST /telehealth/video-session
   * Create a telehealth video session
   *
   * @requires Active subscription
   */
  createVideoSession: async (
    req: Request,
    res: Response<VideoSessionResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { patientId, providerId } = req.body as VideoSessionRequest;

      // Stub response for video session creation
      res.status(200).json({
        success: true,
        sessionId: `session-${Date.now()}`,
        userId,
        patientId,
        providerId,
        roomUrl: `https://telehealth.example.com/room/${Date.now()}`,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        message: "Video session created successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /ai/analyze-symptoms
   * AI-powered symptom analysis
   *
   * @requires Premium tier subscription
   */
  analyzeSymptoms: async (
    req: Request,
    res: Response<SymptomsAnalysisResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { symptoms } = req.body as SymptomsAnalysisRequest;

      // Stub response for AI symptom analysis
      res.status(200).json({
        success: true,
        analysisId: `analysis-${Date.now()}`,
        userId,
        symptoms,
        possibleConditions: [
          { name: "Common Cold", probability: 0.75 },
          { name: "Flu", probability: 0.2 },
          { name: "Other", probability: 0.05 },
        ],
        recommendation:
          "Please consult with a healthcare provider for proper diagnosis.",
        disclaimer:
          "This AI analysis is for informational purposes only and does not constitute medical advice.",
        analyzedAt: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /export/medical-records
   * Export medical records in various formats
   *
   * @requires Active subscription
   */
  exportMedicalRecords: async (
    req: Request,
    res: Response<ExportRecordsResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const { format, dateRange } = req.body as ExportRecordsRequest;

      // Stub response for medical records export
      res.status(200).json({
        success: true,
        exportId: `export-${Date.now()}`,
        userId,
        format: format || "pdf",
        dateRange,
        status: "processing",
        estimatedCompletionTime: new Date(
          Date.now() + 5 * 60 * 1000,
        ).toISOString(),
        message:
          "Medical records export initiated. You will be notified when ready.",
      });
    } catch (error) {
      next(error);
    }
  },
};

// ==========================================
// Premium Feature Routes
// ==========================================

// Telehealth video session - requires active subscription
router.post(
  "/telehealth/video-session",
  authenticate,
  requireSubscription,
  premiumController.createVideoSession,
);

// AI symptom analysis - requires premium tier
router.post(
  "/ai/analyze-symptoms",
  authenticate,
  requirePremiumTier,
  premiumController.analyzeSymptoms,
);

// Medical records export - requires active subscription
router.post(
  "/export/medical-records",
  authenticate,
  requireSubscription,
  premiumController.exportMedicalRecords,
);

export { router as premiumRoutes, PaymentRequiredError };
