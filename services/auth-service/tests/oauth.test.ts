import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Mock the config before importing services
vi.mock("../src/config/oauth.config.js", () => ({
  oauthConfig: {
    stateExpiryMinutes: 10,
    callbackBaseUrl: "http://localhost:3001",
    defaultRedirectUrl: "http://localhost:3000/auth/callback",
    allowedRedirectPatterns: ["http://localhost:3000/*"],
    tokenEncryptionKey: "test-encryption-key-32-characters",
    providers: {
      google: {
        enabled: true,
        clientId: "test-google-client-id",
        clientSecret: "test-google-client-secret",
        callbackUrl: "http://localhost:3001/auth/oauth/google/callback",
        scope: ["openid", "email", "profile"],
        authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        userInfoUrl: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      facebook: {
        enabled: true,
        clientId: "test-facebook-app-id",
        clientSecret: "test-facebook-app-secret",
        callbackUrl: "http://localhost:3001/auth/oauth/facebook/callback",
        scope: ["email", "public_profile"],
        authorizationUrl: "https://www.facebook.com/v18.0/dialog/oauth",
        tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
        userInfoUrl: "https://graph.facebook.com/v18.0/me",
      },
      apple: {
        enabled: false,
        clientId: "",
        clientSecret: "",
        callbackUrl: "http://localhost:3001/auth/oauth/apple/callback",
        scope: ["name", "email"],
        authorizationUrl: "https://appleid.apple.com/auth/authorize",
        tokenUrl: "https://appleid.apple.com/auth/token",
        userInfoUrl: "",
      },
    },
  },
  getAppleConfig: () => null,
  validateOAuthConfig: () => ({ valid: true, warnings: [], errors: [] }),
}));

// Mock Prisma
vi.mock("../src/utils/prisma.js", () => ({
  prisma: {
    oAuthState: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    socialAccount: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
    },
    $transaction: vi.fn((ops) => Promise.all(ops)),
  },
}));

// Mock logger
vi.mock("../src/utils/logger.js", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock config
vi.mock("../src/config/index.js", () => ({
  config: {
    jwt: {
      algorithm: "HS256",
      secret: "test-jwt-secret-at-least-32-characters",
      expiresIn: "15m",
      refreshExpiresIn: "30d",
    },
    security: {
      bcryptRounds: 10,
    },
  },
}));

describe("OAuth Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getEnabledProviders", () => {
    it("should return list of enabled providers", async () => {
      const { getEnabledProviders } =
        await import("../src/strategies/index.js");
      const providers = getEnabledProviders();

      expect(providers).toContain("google");
      expect(providers).toContain("facebook");
      expect(providers).not.toContain("apple");
    });
  });

  describe("isProviderEnabled", () => {
    it("should return true for enabled providers", async () => {
      const { isProviderEnabled } = await import("../src/strategies/index.js");

      expect(isProviderEnabled("google")).toBe(true);
      expect(isProviderEnabled("facebook")).toBe(true);
      expect(isProviderEnabled("apple")).toBe(false);
    });
  });

  describe("Google Strategy", () => {
    it("should generate correct authorization URL", async () => {
      const { googleStrategy } =
        await import("../src/strategies/google.strategy.js");

      const url = googleStrategy.getAuthorizationUrl("test-state-123");

      expect(url).toContain("https://accounts.google.com/o/oauth2/v2/auth");
      expect(url).toContain("client_id=test-google-client-id");
      expect(url).toContain("state=test-state-123");
      expect(url).toContain("access_type=offline");
      expect(url).toContain("prompt=consent");
      // Spaces in scope can be encoded as %20 or + in URLs
      expect(url).toMatch(/scope=openid(%20|\+)email(%20|\+)profile/);
    });
  });

  describe("Facebook Strategy", () => {
    it("should generate correct authorization URL", async () => {
      const { facebookStrategy } =
        await import("../src/strategies/facebook.strategy.js");

      const url = facebookStrategy.getAuthorizationUrl("test-state-456");

      expect(url).toContain("https://www.facebook.com/v18.0/dialog/oauth");
      expect(url).toContain("client_id=test-facebook-app-id");
      expect(url).toContain("state=test-state-456");
      // Spaces in scope can be encoded as %20 or + in URLs
      expect(url).toMatch(/scope=email(%20|\+)public_profile/);
    });
  });
});

describe("OAuth DTOs", () => {
  describe("OAuthProviderSchema", () => {
    it("should validate valid providers", async () => {
      const { OAuthProviderSchema } = await import("../src/dtos/oauth.dto.js");

      expect(() => OAuthProviderSchema.parse("google")).not.toThrow();
      expect(() => OAuthProviderSchema.parse("facebook")).not.toThrow();
      expect(() => OAuthProviderSchema.parse("apple")).not.toThrow();
    });

    it("should reject invalid providers", async () => {
      const { OAuthProviderSchema } = await import("../src/dtos/oauth.dto.js");

      expect(() => OAuthProviderSchema.parse("invalid")).toThrow();
      expect(() => OAuthProviderSchema.parse("")).toThrow();
    });
  });

  describe("OAuthCallbackSchema", () => {
    it("should validate callback input", async () => {
      const { OAuthCallbackSchema } = await import("../src/dtos/oauth.dto.js");

      const validInput = {
        code: "auth-code-123",
        state: "state-token-456",
      };

      const result = OAuthCallbackSchema.parse(validInput);
      expect(result.code).toBe("auth-code-123");
      expect(result.state).toBe("state-token-456");
    });

    it("should reject missing code", async () => {
      const { OAuthCallbackSchema } = await import("../src/dtos/oauth.dto.js");

      expect(() =>
        OAuthCallbackSchema.parse({
          state: "state-token-456",
        }),
      ).toThrow();
    });

    it("should reject missing state", async () => {
      const { OAuthCallbackSchema } = await import("../src/dtos/oauth.dto.js");

      expect(() =>
        OAuthCallbackSchema.parse({
          code: "auth-code-123",
        }),
      ).toThrow();
    });
  });

  describe("UnlinkSocialAccountSchema", () => {
    it("should validate unlink input", async () => {
      const { UnlinkSocialAccountSchema } =
        await import("../src/dtos/oauth.dto.js");

      const result = UnlinkSocialAccountSchema.parse({ provider: "google" });
      expect(result.provider).toBe("google");
    });
  });
});

describe("OAuth Error Codes", () => {
  it("should have all required error codes", async () => {
    const { OAuthErrorCode } = await import("../src/dtos/oauth.dto.js");

    expect(OAuthErrorCode.PROVIDER_ERROR).toBe("PROVIDER_ERROR");
    expect(OAuthErrorCode.INVALID_STATE).toBe("INVALID_STATE");
    expect(OAuthErrorCode.STATE_EXPIRED).toBe("STATE_EXPIRED");
    expect(OAuthErrorCode.EMAIL_CONFLICT).toBe("EMAIL_CONFLICT");
    expect(OAuthErrorCode.ACCOUNT_ALREADY_LINKED).toBe(
      "ACCOUNT_ALREADY_LINKED",
    );
    expect(OAuthErrorCode.ACCOUNT_NOT_LINKED).toBe("ACCOUNT_NOT_LINKED");
    expect(OAuthErrorCode.CANNOT_UNLINK_ONLY_AUTH).toBe(
      "CANNOT_UNLINK_ONLY_AUTH",
    );
  });
});
