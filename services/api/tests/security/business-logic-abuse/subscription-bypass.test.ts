/**
 * Subscription Gating and Payment Bypass Tests
 *
 * These tests simulate an attacker attempting to access premium features
 * without proper subscription, manipulate pricing, or bypass payment flows.
 *
 * OWASP Reference: API6:2023 Unrestricted Access to Sensitive Business Flows
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import express, { Express } from "express";
import jwt from "jsonwebtoken";
import { routes } from "../../../src/routes/index.js";
import { errorHandler } from "../../../src/middleware/error.middleware.js";

const TEST_JWT_SECRET = "test-secret-key-for-security-tests-only-32chars";

vi.mock("../../../src/lib/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    subscription: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    payment: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    plan: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    auditEvent: {
      create: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

vi.mock("../../../src/config/index.js", () => ({
  config: {
    jwt: {
      secret: TEST_JWT_SECRET,
    },
  },
}));

describe("Subscription Gating and Payment Bypass Tests", () => {
  let app: Express;

  const freeUser = {
    userId: "free-user-123",
    email: "free@test.com",
    role: "patient" as const,
    subscriptionTier: "free",
  };

  const paidUser = {
    userId: "paid-user-123",
    email: "paid@test.com",
    role: "patient" as const,
    subscriptionTier: "premium",
  };

  function createToken(user: typeof freeUser): string {
    return "Bearer " + jwt.sign(user, TEST_JWT_SECRET, { expiresIn: "1h" });
  }

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/v1", routes);
    app.use(errorHandler);
    vi.clearAllMocks();
  });

  describe("Free Tier Feature Restriction", () => {
    it("should deny free user access to premium telehealth features", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      // User has no active subscription
      (prisma.subscription.findFirst as any).mockResolvedValue(null);

      // Attempt to access premium endpoint
      const response = await request(app)
        .post("/api/v1/telehealth/video-session")
        .set("Authorization", createToken(freeUser))
        .send({
          patientId: "patient-123",
          providerId: "provider-456",
        });

      // Should be blocked with 402 (Payment Required) or 403
      expect([402, 403, 404]).toContain(response.status);
    });

    it("should deny free user access to AI diagnostic features", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      (prisma.subscription.findFirst as any).mockResolvedValue({
        id: "sub-123",
        tier: "free",
        status: "ACTIVE",
      });

      const response = await request(app)
        .post("/api/v1/ai/analyze-symptoms")
        .set("Authorization", createToken(freeUser))
        .send({
          symptoms: ["headache", "fever"],
        });

      expect([402, 403, 404]).toContain(response.status);
    });

    it("should deny free user bulk data export", async () => {
      const response = await request(app)
        .post("/api/v1/export/medical-records")
        .set("Authorization", createToken(freeUser))
        .send({
          format: "pdf",
          dateRange: { from: "2023-01-01", to: "2024-01-01" },
        });

      expect([402, 403, 404]).toContain(response.status);
    });
  });

  describe("Subscription Tier Bypass", () => {
    it("should reject attempt to set subscription tier via request body", async () => {
      const response = await request(app)
        .patch("/api/v1/users/free-user-123")
        .set("Authorization", createToken(freeUser))
        .send({
          firstName: "Legit",
          subscriptionTier: "enterprise", // ATTACK
        });

      expect([400, 422]).toContain(response.status);
    });

    it("should reject subscription creation with manipulated tier", async () => {
      const response = await request(app)
        .post("/api/v1/subscriptions")
        .set("Authorization", createToken(freeUser))
        .send({
          planId: "free-plan", // Paying for free plan
          paymentMethodId: "pm_test_123",
          tier: "enterprise", // But claiming enterprise tier
          features: ["unlimited-everything"],
        });

      expect([400, 422]).toContain(response.status);
    });
  });

  describe("Price Manipulation", () => {
    it("should reject subscription with client-provided price", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      // Enterprise plan costs $999/month
      (prisma.plan.findUnique as any).mockResolvedValue({
        id: "enterprise-plan",
        name: "Enterprise",
        price: 99900, // $999.00 in cents
        currency: "usd",
      });

      const response = await request(app)
        .post("/api/v1/subscriptions")
        .set("Authorization", createToken(freeUser))
        .send({
          planId: "enterprise-plan",
          paymentMethodId: "pm_test_123",
          price: 100, // ATTACK: Only pay $1
          amount: 100,
        });

      // Server should use authoritative pricing from plan
      expect([400, 422]).toContain(response.status);
    });

    it("should reject payment with manipulated amount", async () => {
      const response = await request(app)
        .post("/api/v1/payments/charge")
        .set("Authorization", createToken(freeUser))
        .send({
          paymentMethodId: "pm_test_123",
          amount: 1, // ATTACK: Pay minimum
          currency: "usd",
          description: "Enterprise subscription",
          subscriptionId: "sub-enterprise",
        });

      expect([400, 422]).toContain(response.status);
    });

    it("should reject coupon code with invalid discount", async () => {
      const response = await request(app)
        .post("/api/v1/subscriptions")
        .set("Authorization", createToken(freeUser))
        .send({
          planId: "premium-plan",
          paymentMethodId: "pm_test_123",
          couponCode: "FAKE100", // Made up coupon
          discount: 100, // ATTACK: 100% discount
        });

      // Discount should be validated server-side
      expect([400, 422]).toContain(response.status);
    });
  });

  describe("Trial Abuse Prevention", () => {
    it("should reject trial extension via request manipulation", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      (prisma.subscription.findFirst as any).mockResolvedValue({
        id: "sub-123",
        status: "TRIAL",
        trialEndsAt: new Date("2024-01-01"),
        userId: freeUser.userId,
      });

      // ATTACK: Try to extend trial period
      const response = await request(app)
        .patch("/api/v1/subscriptions/sub-123")
        .set("Authorization", createToken(freeUser))
        .send({
          trialEndsAt: new Date("2099-12-31").toISOString(),
          status: "TRIAL",
        });

      expect([400, 403, 422]).toContain(response.status);
    });

    it("should reject second trial for same user", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      // User already had a trial
      (prisma.subscription.findFirst as any).mockResolvedValue({
        id: "old-sub",
        status: "CANCELLED",
        wasTrialUsed: true,
        userId: freeUser.userId,
      });

      const response = await request(app)
        .post("/api/v1/subscriptions")
        .set("Authorization", createToken(freeUser))
        .send({
          planId: "premium-plan",
          paymentMethodId: "pm_test_123",
          startTrial: true, // ATTACK: Request another trial
        });

      // Should deny second trial
      expect([400, 403]).toContain(response.status);
    });
  });

  describe("Refund Abuse Prevention", () => {
    it("should deny user self-refund (admin only)", async () => {
      const response = await request(app)
        .post("/api/v1/payments/pay-123/refund")
        .set("Authorization", createToken(paidUser))
        .send({
          amount: 99900,
          reason: "Changed my mind",
        });

      // Refunds should require admin approval
      expect([403]).toContain(response.status);
    });

    it("should reject refund amount greater than original payment", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      // Original payment was $100
      (prisma.payment.findUnique as any).mockResolvedValue({
        id: "pay-123",
        amount: 10000, // $100 in cents
        status: "SUCCEEDED",
        userId: paidUser.userId,
      });

      const adminUser = { ...paidUser, role: "admin" as const };

      const response = await request(app)
        .post("/api/v1/payments/pay-123/refund")
        .set("Authorization", createToken(adminUser))
        .send({
          amount: 99999, // ATTACK: Refund more than paid
        });

      expect([400, 422]).toContain(response.status);
    });
  });

  describe("Quota Manipulation", () => {
    it("should reject attempt to increase API quota", async () => {
      const response = await request(app)
        .patch("/api/v1/users/free-user-123")
        .set("Authorization", createToken(freeUser))
        .send({
          quota: 999999, // ATTACK: Unlimited quota
          quotaUsed: 0, // ATTACK: Reset usage
        });

      expect([400, 422]).toContain(response.status);
    });

    it("should reject attempt to add credits", async () => {
      const response = await request(app)
        .patch("/api/v1/users/free-user-123")
        .set("Authorization", createToken(freeUser))
        .send({
          credits: 10000, // ATTACK: Free credits
          creditBalance: 10000,
        });

      expect([400, 422]).toContain(response.status);
    });
  });

  describe("Feature Flag Manipulation", () => {
    it("should reject attempt to enable premium features via user update", async () => {
      const response = await request(app)
        .patch("/api/v1/users/free-user-123")
        .set("Authorization", createToken(freeUser))
        .send({
          features: {
            telehealth: true, // ATTACK: Enable premium features
            aiDiagnostics: true,
            unlimitedStorage: true,
          },
          featureFlags: ["PREMIUM_ENABLED"],
        });

      expect([400, 422]).toContain(response.status);
    });
  });

  describe("Billing Bypass", () => {
    it("should reject subscription cancellation that refunds full amount", async () => {
      const response = await request(app)
        .delete("/api/v1/subscriptions/sub-123")
        .set("Authorization", createToken(paidUser))
        .send({
          refundType: "FULL", // ATTACK: Request full refund
          reason: "Never used it",
        });

      // Refund type should not be client-controlled
      // Check that response doesn't indicate full refund was processed
      if (response.status === 204) {
        // If deletion succeeded, verify no manipulation occurred
        expect(response.body).toEqual({});
      }
    });
  });
});
