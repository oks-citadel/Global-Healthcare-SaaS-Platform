/**
 * Insecure Error Leakage Tests
 *
 * These tests verify that error responses don't leak sensitive information
 * such as stack traces, internal table names, or system details.
 *
 * OWASP Reference: API7:2023 Server Side Request Forgery
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";
import express, { Express } from "express";
import jwt from "jsonwebtoken";
import { routes } from "../../../src/routes/index.js";
import { errorHandler } from "../../../src/middleware/error.middleware.js";

// Define secret as a literal inside mock to avoid hoisting issues
vi.mock("../../../src/lib/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    patient: {
      findUnique: vi.fn(),
      create: vi.fn(),
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
      secret: "test-secret-key-for-security-tests-only-32chars",
    },
    logging: {
      level: "error",
    },
  },
}));

const TEST_JWT_SECRET = "test-secret-key-for-security-tests-only-32chars";

describe("Error Leakage Prevention Tests", () => {
  let app: Express;

  const user = {
    userId: "user-123",
    email: "user@test.com",
    role: "patient" as const,
  };

  function createToken(user: {
    userId: string;
    email: string;
    role: string;
  }): string {
    return "Bearer " + jwt.sign(user, TEST_JWT_SECRET, { expiresIn: "1h" });
  }

  beforeEach(() => {
    // Set production mode for error sanitization
    process.env.NODE_ENV = "production";

    app = express();
    // Disable X-Powered-By header (security best practice)
    app.disable("x-powered-by");
    app.use(express.json());
    app.use("/api/v1", routes);
    app.use(errorHandler);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Stack Trace Protection", () => {
    it("should not expose stack traces in production errors", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      // Force an error
      (prisma.patient.findUnique as any).mockRejectedValue(
        new Error("Database connection failed"),
      );

      const response = await request(app)
        .get("/api/v1/patients/patient-123")
        .set("Authorization", createToken(user));

      // Check that response doesn't contain stack trace
      expect(response.body.stack).toBeUndefined();
      expect(JSON.stringify(response.body)).not.toContain("at ");
      expect(JSON.stringify(response.body)).not.toContain(".ts:");
      expect(JSON.stringify(response.body)).not.toContain(".js:");
      expect(JSON.stringify(response.body)).not.toContain("node_modules");
    });

    it("should not expose file paths in error messages", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      (prisma.patient.create as any).mockRejectedValue(
        new Error("ENOENT: /var/app/config/secret.key not found"),
      );

      const response = await request(app)
        .post("/api/v1/patients")
        .set("Authorization", createToken(user))
        .send({
          userId: "user-123",
          dateOfBirth: "1990-01-01",
          gender: "male",
        });

      expect(JSON.stringify(response.body)).not.toContain("/var/");
      expect(JSON.stringify(response.body)).not.toContain("/app/");
      expect(JSON.stringify(response.body)).not.toContain("secret.key");
    });
  });

  describe("Database Error Sanitization", () => {
    it("should not expose table names in error responses", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      // Simulate Prisma error with table name
      const prismaError = {
        code: "P2002",
        meta: {
          target: ["email"],
          model_name: "User",
          constraint: "users_email_key",
        },
        message: "Unique constraint violation on the fields: (`email`)",
      };
      (prisma.patient.create as any).mockRejectedValue(prismaError);

      const response = await request(app)
        .post("/api/v1/patients")
        .set("Authorization", createToken(user))
        .send({
          userId: "user-123",
          dateOfBirth: "1990-01-01",
          gender: "male",
        });

      // Should not expose internal constraint names
      expect(JSON.stringify(response.body)).not.toContain("users_email_key");
      expect(JSON.stringify(response.body)).not.toContain("model_name");
    });

    it("should not expose SQL in error messages", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      const sqlError = new Error(
        'SELECT * FROM "users" WHERE "email" = \'test@example.com\' failed',
      );
      (prisma.user.findUnique as any).mockRejectedValue(sqlError);

      const response = await request(app)
        .get("/api/v1/users/user-123")
        .set("Authorization", createToken(user));

      expect(JSON.stringify(response.body)).not.toContain("SELECT");
      expect(JSON.stringify(response.body)).not.toContain("FROM");
      expect(JSON.stringify(response.body)).not.toContain('"users"');
    });

    it("should not expose connection strings", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      const connError = new Error(
        "Connection failed to postgresql://admin:secretpassword@db.example.com:5432/healthcare",
      );
      (prisma.user.findUnique as any).mockRejectedValue(connError);

      const response = await request(app)
        .get("/api/v1/users/user-123")
        .set("Authorization", createToken(user));

      expect(JSON.stringify(response.body)).not.toContain("postgresql://");
      expect(JSON.stringify(response.body)).not.toContain("secretpassword");
      expect(JSON.stringify(response.body)).not.toContain(":5432");
    });
  });

  describe("Internal Field Protection", () => {
    it("should not expose internal IDs in error context", async () => {
      const response = await request(app)
        .get("/api/v1/patients/internal-uuid-12345")
        .set("Authorization", createToken(user));

      // If 404, should not confirm whether the ID exists
      if (response.status === 404) {
        expect(response.body.message).not.toContain("internal-uuid-12345");
      }
    });

    it("should not expose role information in auth errors", async () => {
      const response = await request(app)
        .get("/api/v1/admin/users")
        .set("Authorization", createToken(user));

      // Should not say "requires admin role" - that reveals role structure
      expect(JSON.stringify(response.body)).not.toMatch(/requires.*admin/i);
      expect(JSON.stringify(response.body)).not.toMatch(/role.*admin/i);
    });
  });

  describe("Version and Technology Disclosure", () => {
    it("should not expose server version in headers", async () => {
      const response = await request(app)
        .get("/api/v1/version")
        .set("Authorization", createToken(user));

      expect(response.headers["x-powered-by"]).toBeUndefined();
      expect(response.headers["server"]).toBeUndefined();
    });

    it("should not expose framework details in errors", async () => {
      // Force a parsing error
      const response = await request(app)
        .post("/api/v1/patients")
        .set("Authorization", createToken(user))
        .set("Content-Type", "application/json")
        .send('{"invalid json');

      expect(JSON.stringify(response.body)).not.toContain("Express");
      expect(JSON.stringify(response.body)).not.toContain("body-parser");
    });
  });

  describe("Validation Error Sanitization", () => {
    it("should provide safe validation errors without internal details", async () => {
      const response = await request(app).post("/api/v1/auth/register").send({
        email: "invalid-email",
        password: "short",
      });

      // Should have validation error
      expect([400, 422]).toContain(response.status);

      // Should be user-friendly without internal details
      if (response.body.details) {
        for (const detail of response.body.details) {
          expect(detail).not.toHaveProperty("stack");
          expect(detail).not.toHaveProperty("_original");
        }
      }
    });
  });

  describe("Sensitive Data Masking", () => {
    it("should mask passwords in error responses", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "MySecretPassword123!",
      });

      // Even in error, password should never be echoed back
      expect(JSON.stringify(response.body)).not.toContain(
        "MySecretPassword123!",
      );
    });

    it("should mask tokens in error responses", async () => {
      const fakeToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoidGVzdCJ9.fake";

      const response = await request(app).post("/api/v1/auth/refresh").send({
        refreshToken: fakeToken,
      });

      // Token should not be in error response
      expect(JSON.stringify(response.body)).not.toContain(fakeToken);
    });

    it("should mask API keys in error responses", async () => {
      const response = await request(app)
        .get("/api/v1/patients")
        .set("X-API-Key", "sk_live_abc123secretkey456")
        .set("Authorization", "Bearer invalid-token");

      expect(JSON.stringify(response.body)).not.toContain(
        "sk_live_abc123secretkey456",
      );
    });
  });

  describe("Rate Limit Error Safety", () => {
    it("should not expose rate limit internals", async () => {
      // Make many requests to trigger rate limit
      const requests = Array(20)
        .fill(null)
        .map(() =>
          request(app).post("/api/v1/auth/login").send({
            email: "test@example.com",
            password: "password",
          }),
        );

      const responses = await Promise.all(requests);
      const rateLimited = responses.find((r) => r.status === 429);

      if (rateLimited) {
        // Should not expose internal rate limit configuration
        expect(rateLimited.body).not.toHaveProperty("windowMs");
        expect(rateLimited.body).not.toHaveProperty("max");
        expect(rateLimited.body).not.toHaveProperty("store");
      }
    });
  });

  describe("Generic Error Messages", () => {
    it("should return generic error for unhandled exceptions", async () => {
      const { prisma } = await import("../../../src/lib/prisma.js");

      // Throw an unexpected error
      (prisma.user.findUnique as any).mockRejectedValue(
        new Error("Unexpected internal error with sensitive details"),
      );

      const response = await request(app)
        .get("/api/v1/users/user-123")
        .set("Authorization", createToken(user));

      expect(response.status).toBe(500);
      // Should be generic, not the actual error message
      expect(response.body.message).not.toContain("Unexpected internal error");
      expect(response.body.message).toMatch(/unexpected|internal|error/i);
    });
  });
});
