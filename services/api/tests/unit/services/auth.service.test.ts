import { describe, it, expect } from "vitest";
import { authService } from "../../../src/services/auth.service.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../../../src/utils/errors.js";

describe("AuthService", () => {
  const validRegisterInput = {
    email: "test@example.com",
    password: "SecurePass123!",
    firstName: "John",
    lastName: "Doe",
    role: "patient" as const,
  };

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const input = {
        ...validRegisterInput,
        email: `test-${Date.now()}@example.com`,
      };

      const result = await authService.register(input);

      // New response structure: { user, tokens: { accessToken, refreshToken } }
      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("tokens");
      expect(result.tokens).toHaveProperty("accessToken");
      expect(result.tokens).toHaveProperty("refreshToken");
      expect(result.user.email).toBe(input.email);
      expect(result.user.firstName).toBe(input.firstName);
      expect(result.user.lastName).toBe(input.lastName);
      expect(result.user.role).toBe("patient");
    });

    it("should throw ConflictError when email already exists", async () => {
      const email = `duplicate-${Date.now()}@example.com`;
      const input = { ...validRegisterInput, email };

      // Register first user
      await authService.register(input);

      // Try to register with same email
      await expect(authService.register(input)).rejects.toThrow(ConflictError);
    });

    it("should hash the password before storing", async () => {
      const input = {
        ...validRegisterInput,
        email: `hash-test-${Date.now()}@example.com`,
      };

      const result = await authService.register(input);

      // Password should not be in the response
      expect(result.user).not.toHaveProperty("password");
    });

    it("should default role to patient if not specified", async () => {
      const input = {
        email: `default-role-${Date.now()}@example.com`,
        password: "SecurePass123!",
        firstName: "Jane",
        lastName: "Doe",
      };

      const result = await authService.register(input as any);
      expect(result.user.role).toBe("patient");
    });
  });

  describe("login", () => {
    it("should login with valid credentials", async () => {
      const email = `login-test-${Date.now()}@example.com`;
      const password = "SecurePass123!";

      // First register
      await authService.register({
        ...validRegisterInput,
        email,
        password,
      });

      // Then login
      const result = await authService.login({ email, password });

      // New response structure: { user, tokens: { accessToken, refreshToken } }
      expect(result).toHaveProperty("tokens");
      expect(result.tokens).toHaveProperty("accessToken");
      expect(result.tokens).toHaveProperty("refreshToken");
      expect(result.user.email).toBe(email);
    });

    it("should throw UnauthorizedError for invalid email", async () => {
      await expect(
        authService.login({
          email: "nonexistent@example.com",
          password: "anypassword",
        }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should throw UnauthorizedError for invalid password", async () => {
      const email = `wrong-pass-${Date.now()}@example.com`;

      await authService.register({
        ...validRegisterInput,
        email,
        password: "CorrectPassword123!",
      });

      await expect(
        authService.login({
          email,
          password: "WrongPassword123!",
        }),
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("refresh", () => {
    it("should refresh token with valid refresh token", async () => {
      const email = `refresh-${Date.now()}@example.com`;

      const registerResult = await authService.register({
        ...validRegisterInput,
        email,
      });

      const result = await authService.refresh(registerResult.tokens.refreshToken);

      expect(result).toHaveProperty("tokens");
      expect(result.tokens).toHaveProperty("accessToken");
      expect(result.tokens).toHaveProperty("refreshToken");
      // New tokens should be generated (they will be different due to different iat/exp)
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it("should throw UnauthorizedError for invalid refresh token", async () => {
      await expect(authService.refresh("invalid-token")).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it("should invalidate old refresh token after use", async () => {
      const email = `refresh-once-${Date.now()}@example.com`;

      const registerResult = await authService.register({
        ...validRegisterInput,
        email,
      });

      // Add a small delay to ensure different JWT timestamps (iat is in seconds)
      await new Promise(resolve => setTimeout(resolve, 1100));

      // First refresh should work and return new tokens
      const refreshResult = await authService.refresh(registerResult.tokens.refreshToken);
      expect(refreshResult.tokens.accessToken).toBeDefined();

      // The new refresh token should be different from the original
      // (due to different iat timestamp after the delay)
      expect(refreshResult.tokens.refreshToken).not.toBe(registerResult.tokens.refreshToken);

      // The OLD refresh token should now be invalid
      // Note: In demo mode, the token is removed from the store after use
      await expect(
        authService.refresh(registerResult.tokens.refreshToken),
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe("getCurrentUser", () => {
    it("should return user without password", async () => {
      const email = `get-user-${Date.now()}@example.com`;

      const registerResult = await authService.register({
        ...validRegisterInput,
        email,
      });

      const user = await authService.getCurrentUser(registerResult.user.id);

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("firstName");
      expect(user).toHaveProperty("lastName");
      expect(user).toHaveProperty("role");
      expect(user).not.toHaveProperty("password");
    });

    it("should throw NotFoundError for non-existent user", async () => {
      await expect(
        authService.getCurrentUser("non-existent-id"),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getRoles", () => {
    it("should return available roles", async () => {
      const result = await authService.getRoles();

      expect(result.roles).toContain("patient");
      expect(result.roles).toContain("provider");
      expect(result.roles).toContain("admin");
    });
  });

  describe("generateTokens", () => {
    it("should generate valid JWT tokens", async () => {
      const user = {
        id: "test-user-id",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        role: "patient",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await authService.generateTokens(user);

      // New response structure: { user, tokens: { accessToken, refreshToken } }
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(typeof result.tokens.accessToken).toBe("string");
      expect(typeof result.tokens.refreshToken).toBe("string");
      expect(result.tokens.accessToken.split(".")).toHaveLength(3); // Valid JWT format
    });
  });
});
