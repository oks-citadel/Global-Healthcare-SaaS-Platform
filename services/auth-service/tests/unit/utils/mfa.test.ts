/**
 * Unit Tests for MFA Utilities
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock config before importing
vi.mock("../../../src/config/index.js", () => ({
  config: {
    mfa: {
      encryptionKey: "test-mfa-encryption-key-32chars!",
      issuer: "Unified Health Test",
    },
  },
}));

// Import after mocking
import { MfaUtils } from "../../../src/utils/mfa";

describe("MfaUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateSecret", () => {
    it("should generate a secret string", () => {
      const secret = MfaUtils.generateSecret();

      expect(secret).toBeDefined();
      expect(typeof secret).toBe("string");
      expect(secret.length).toBeGreaterThan(0);
    });

    it("should generate unique secrets", () => {
      const secret1 = MfaUtils.generateSecret();
      const secret2 = MfaUtils.generateSecret();

      expect(secret1).not.toBe(secret2);
    });
  });

  describe("encryptSecret and decryptSecret", () => {
    it("should encrypt and decrypt secret correctly", () => {
      const originalSecret = MfaUtils.generateSecret();
      const encrypted = MfaUtils.encryptSecret(originalSecret);
      const decrypted = MfaUtils.decryptSecret(encrypted);

      expect(decrypted).toBe(originalSecret);
    });

    it("should produce different encrypted values for same input", () => {
      const secret = "test-secret-value";
      const encrypted1 = MfaUtils.encryptSecret(secret);
      const encrypted2 = MfaUtils.encryptSecret(secret);

      // Due to random IV, encrypted values should differ
      expect(encrypted1).not.toBe(encrypted2);
    });

    it("should handle empty string", () => {
      const encrypted = MfaUtils.encryptSecret("");
      const decrypted = MfaUtils.decryptSecret(encrypted);

      expect(decrypted).toBe("");
    });

    it("should handle special characters", () => {
      const specialSecret = "test!@#$%^&*()_+-=[]{}|;:,.<>?";
      const encrypted = MfaUtils.encryptSecret(specialSecret);
      const decrypted = MfaUtils.decryptSecret(encrypted);

      expect(decrypted).toBe(specialSecret);
    });
  });

  describe("generateOtpAuthUrl", () => {
    it("should generate valid OTP auth URL", () => {
      const secret = "JBSWY3DPEHPK3PXP";
      const email = "test@example.com";

      const url = MfaUtils.generateOtpAuthUrl(secret, email);

      expect(url).toContain("otpauth://totp/");
      // Email is URL-encoded in OTP auth URLs (@ becomes %40)
      expect(url).toContain(encodeURIComponent(email));
      expect(url).toContain(secret);
      expect(url).toContain("issuer=Unified Health Test");
    });

    it("should URL encode email with special characters", () => {
      const secret = "JBSWY3DPEHPK3PXP";
      const email = "user+test@example.com";

      const url = MfaUtils.generateOtpAuthUrl(secret, email);

      expect(url).toContain("otpauth://totp/");
    });
  });

  describe("verifyToken", () => {
    it("should return false for invalid token format", () => {
      const secret = "JBSWY3DPEHPK3PXP";

      const result = MfaUtils.verifyToken("invalid", secret);

      expect(result).toBe(false);
    });

    it("should return false for non-numeric token", () => {
      const secret = "JBSWY3DPEHPK3PXP";

      const result = MfaUtils.verifyToken("abcdef", secret);

      expect(result).toBe(false);
    });

    it("should handle empty token", () => {
      const secret = "JBSWY3DPEHPK3PXP";

      const result = MfaUtils.verifyToken("", secret);

      expect(result).toBe(false);
    });

    it("should handle empty secret", () => {
      const result = MfaUtils.verifyToken("123456", "");

      expect(result).toBe(false);
    });
  });

  describe("generateBackupCodes", () => {
    it("should generate 10 backup codes", () => {
      const codes = MfaUtils.generateBackupCodes();

      expect(codes).toHaveLength(10);
    });

    it("should generate codes in correct format", () => {
      const codes = MfaUtils.generateBackupCodes();

      codes.forEach((code) => {
        // Format: XXXX-XXXX (8 hex chars with dash)
        expect(code).toMatch(/^[A-F0-9]{4}-[A-F0-9]{4}$/);
      });
    });

    it("should generate unique codes", () => {
      const codes = MfaUtils.generateBackupCodes();
      const uniqueCodes = new Set(codes);

      expect(uniqueCodes.size).toBe(codes.length);
    });

    it("should generate different codes on each call", () => {
      const codes1 = MfaUtils.generateBackupCodes();
      const codes2 = MfaUtils.generateBackupCodes();

      // At least some codes should be different
      const matches = codes1.filter((code) => codes2.includes(code));
      expect(matches.length).toBeLessThan(codes1.length);
    });
  });

  describe("hashBackupCode", () => {
    it("should hash backup code consistently", () => {
      const code = "ABCD-1234";

      const hash1 = MfaUtils.hashBackupCode(code);
      const hash2 = MfaUtils.hashBackupCode(code);

      expect(hash1).toBe(hash2);
    });

    it("should normalize code before hashing (remove dashes)", () => {
      const codeWithDash = "ABCD-1234";
      const codeWithoutDash = "ABCD1234";

      const hash1 = MfaUtils.hashBackupCode(codeWithDash);
      const hash2 = MfaUtils.hashBackupCode(codeWithoutDash);

      expect(hash1).toBe(hash2);
    });

    it("should be case insensitive", () => {
      const upperCode = "ABCD-1234";
      const lowerCode = "abcd-1234";

      const hash1 = MfaUtils.hashBackupCode(upperCode);
      const hash2 = MfaUtils.hashBackupCode(lowerCode);

      expect(hash1).toBe(hash2);
    });

    it("should produce 64-character hex string (SHA-256)", () => {
      const code = "ABCD-1234";

      const hash = MfaUtils.hashBackupCode(code);

      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe("hashBackupCodes", () => {
    it("should hash array of codes", () => {
      const codes = ["ABCD-1234", "EFGH-5678", "IJKL-9012"];

      const hashes = MfaUtils.hashBackupCodes(codes);

      expect(hashes).toHaveLength(3);
      hashes.forEach((hash) => {
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
      });
    });

    it("should preserve order", () => {
      const codes = ["ABCD-1234", "EFGH-5678"];

      const hashes = MfaUtils.hashBackupCodes(codes);
      const hash1 = MfaUtils.hashBackupCode(codes[0]);
      const hash2 = MfaUtils.hashBackupCode(codes[1]);

      expect(hashes[0]).toBe(hash1);
      expect(hashes[1]).toBe(hash2);
    });
  });

  describe("verifyBackupCode", () => {
    it("should return valid and index for matching code", () => {
      const codes = ["ABCD-1234", "EFGH-5678", "IJKL-9012"];
      const hashes = MfaUtils.hashBackupCodes(codes);

      const result = MfaUtils.verifyBackupCode("EFGH-5678", hashes);

      expect(result.valid).toBe(true);
      expect(result.index).toBe(1);
    });

    it("should return invalid for non-matching code", () => {
      const codes = ["ABCD-1234", "EFGH-5678"];
      const hashes = MfaUtils.hashBackupCodes(codes);

      const result = MfaUtils.verifyBackupCode("XXXX-0000", hashes);

      expect(result.valid).toBe(false);
      expect(result.index).toBe(-1);
    });

    it("should be case insensitive", () => {
      const codes = ["ABCD-1234"];
      const hashes = MfaUtils.hashBackupCodes(codes);

      const result = MfaUtils.verifyBackupCode("abcd-1234", hashes);

      expect(result.valid).toBe(true);
    });

    it("should work without dashes", () => {
      const codes = ["ABCD-1234"];
      const hashes = MfaUtils.hashBackupCodes(codes);

      const result = MfaUtils.verifyBackupCode("ABCD1234", hashes);

      expect(result.valid).toBe(true);
    });

    it("should return invalid for empty hashes array", () => {
      const result = MfaUtils.verifyBackupCode("ABCD-1234", []);

      expect(result.valid).toBe(false);
      expect(result.index).toBe(-1);
    });
  });

  describe("generateSetupToken", () => {
    it("should generate a 64-character hex string", () => {
      const token = MfaUtils.generateSetupToken();

      expect(token).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should generate unique tokens", () => {
      const token1 = MfaUtils.generateSetupToken();
      const token2 = MfaUtils.generateSetupToken();

      expect(token1).not.toBe(token2);
    });
  });
});
