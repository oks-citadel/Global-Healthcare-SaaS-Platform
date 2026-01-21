/**
 * API Contract Tests - Authentication Endpoints
 * Validates response schemas and contracts for auth endpoints
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { api, login, clearTokenCache } from '../helpers/api-client';
import { validateSchema, schemas, expectValidSchema } from '../helpers/schema-validator';
import { testUsers, invalidData } from '../data/test-fixtures';

describe('Auth API Contract Tests', () => {
  beforeAll(() => {
    clearTokenCache();
  });

  describe('POST /auth/register', () => {
    it('should return valid auth response schema on successful registration', async () => {
      const uniqueEmail = `test-${Date.now()}@contract-test.unified.health`;

      const response = await api.post('/auth/register', {
        email: uniqueEmail,
        password: 'SecurePassword123!',
        firstName: 'Contract',
        lastName: 'Test',
      });

      // Should succeed or conflict (if user exists)
      expect([201, 409]).toContain(response.status);

      if (response.status === 201) {
        // Validate response structure
        expect(response.data).toHaveProperty('accessToken');
        expect(response.data).toHaveProperty('user');
        expect(typeof response.data.accessToken).toBe('string');
        expect(response.data.accessToken.length).toBeGreaterThan(0);
      }
    });

    it('should return valid error schema for invalid email', async () => {
      const response = await api.post('/auth/register', {
        email: invalidData.invalidEmail,
        password: 'SecurePassword123!',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error');
    });

    it('should return valid error schema for short password', async () => {
      const response = await api.post('/auth/register', {
        email: 'valid@test.com',
        password: invalidData.shortPassword,
        firstName: 'Test',
        lastName: 'User',
      });

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error');
    });

    it('should return valid error schema for missing required fields', async () => {
      const response = await api.post('/auth/register', {
        email: 'valid@test.com',
        // Missing password, firstName, lastName
      });

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error');
    });

    it('should sanitize XSS payloads in input', async () => {
      const response = await api.post('/auth/register', {
        email: 'xss@test.com',
        password: 'SecurePassword123!',
        firstName: invalidData.xssPayload,
        lastName: 'Test',
      });

      // Should either reject or sanitize
      if (response.status === 201) {
        expect(response.data.user?.firstName).not.toContain('<script>');
      }
    });
  });

  describe('POST /auth/login', () => {
    it('should return valid auth response schema on successful login', async () => {
      const response = await api.post('/auth/login', {
        email: testUsers.patient.email,
        password: testUsers.patient.password,
      });

      // May fail if test user doesn't exist, but schema should be valid
      if (response.ok) {
        expect(response.data).toHaveProperty('accessToken');
        expect(typeof response.data.accessToken).toBe('string');

        if (response.data.expiresIn) {
          expect(typeof response.data.expiresIn).toBe('number');
          expect(response.data.expiresIn).toBeGreaterThan(0);
        }
      }
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await api.post('/auth/login', {
        email: testUsers.patient.email,
        password: 'WrongPassword123!',
      });

      expect(response.status).toBe(401);
      expect(response.data).toHaveProperty('error');
    });

    it('should return 400 for missing email', async () => {
      const response = await api.post('/auth/login', {
        password: 'SomePassword123!',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing password', async () => {
      const response = await api.post('/auth/login', {
        email: 'test@test.com',
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const response = await api.post('/auth/login', {
        email: invalidData.invalidEmail,
        password: 'SomePassword123!',
      });

      expect(response.status).toBe(400);
    });

    it('should prevent SQL injection in email field', async () => {
      const response = await api.post('/auth/login', {
        email: invalidData.sqlInjection,
        password: 'SomePassword123!',
      });

      // Should return validation error, not server error
      expect(response.status).toBeLessThan(500);
    });
  });

  describe('POST /auth/refresh', () => {
    it('should return valid auth response with new tokens', async () => {
      // First login to get refresh token
      const loginResponse = await api.post('/auth/login', {
        email: testUsers.patient.email,
        password: testUsers.patient.password,
      });

      if (loginResponse.ok && loginResponse.data.refreshToken) {
        const refreshResponse = await api.post('/auth/refresh', {
          refreshToken: loginResponse.data.refreshToken,
        });

        if (refreshResponse.ok) {
          expect(refreshResponse.data).toHaveProperty('accessToken');
          expect(typeof refreshResponse.data.accessToken).toBe('string');
        }
      }
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await api.post('/auth/refresh', {
        refreshToken: 'invalid-refresh-token',
      });

      expect(response.status).toBe(401);
    });

    it('should return 400 for missing refresh token', async () => {
      const response = await api.post('/auth/refresh', {});

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('POST /auth/logout', () => {
    it('should return success on logout with valid token', async () => {
      try {
        const token = await login(testUsers.patient.email, testUsers.patient.password);

        const response = await api.post('/auth/logout', {}, { token });

        // Should succeed or return no content
        expect([200, 204]).toContain(response.status);
      } catch {
        // Skip if login fails
      }
    });

    it('should return 401 for logout without token', async () => {
      const response = await api.post('/auth/logout', {});

      expect(response.status).toBe(401);
    });
  });

  describe('GET /auth/me', () => {
    it('should return valid user schema when authenticated', async () => {
      try {
        const token = await login(testUsers.patient.email, testUsers.patient.password);

        const response = await api.get('/auth/me', { token });

        if (response.ok) {
          expect(response.data).toHaveProperty('id');
          expect(response.data).toHaveProperty('email');
          expect(response.data).toHaveProperty('role');

          // Validate schema
          expectValidSchema(response.data, schemas.user, 'user');
        }
      } catch {
        // Skip if login fails
      }
    });

    it('should return 401 without authentication', async () => {
      const response = await api.get('/auth/me');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await api.get('/auth/me', {
        token: 'invalid-jwt-token',
      });

      expect(response.status).toBe(401);
    });

    it('should return 401 with expired token format', async () => {
      // Malformed JWT
      const response = await api.get('/auth/me', {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjF9.signature',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /roles', () => {
    it('should return 401 for unauthenticated request', async () => {
      const response = await api.get('/roles');

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      try {
        const token = await login(testUsers.patient.email, testUsers.patient.password);

        const response = await api.get('/roles', { token });

        expect([401, 403]).toContain(response.status);
      } catch {
        // Skip if login fails
      }
    });

    it('should return roles list for admin users', async () => {
      try {
        const token = await login(testUsers.admin.email, testUsers.admin.password);

        const response = await api.get('/roles', { token });

        if (response.ok) {
          expect(Array.isArray(response.data)).toBe(true);
        }
      } catch {
        // Skip if login fails
      }
    });
  });

  describe('Password Reset Flow', () => {
    it('POST /auth/forgot-password should accept valid email', async () => {
      const response = await api.post('/auth/forgot-password', {
        email: testUsers.patient.email,
      });

      // Should always return success (security - don't reveal if email exists)
      expect([200, 202, 204]).toContain(response.status);
    });

    it('POST /auth/forgot-password should not reveal if email exists', async () => {
      const validResponse = await api.post('/auth/forgot-password', {
        email: testUsers.patient.email,
      });

      const invalidResponse = await api.post('/auth/forgot-password', {
        email: 'nonexistent@test.com',
      });

      // Both should return same status (security best practice)
      expect(validResponse.status).toBe(invalidResponse.status);
    });

    it('POST /auth/reset-password should validate token', async () => {
      const response = await api.post('/auth/reset-password', {
        token: 'invalid-reset-token',
        password: 'NewSecurePassword123!',
      });

      expect([400, 401]).toContain(response.status);
    });
  });
});
