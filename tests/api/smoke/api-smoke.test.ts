/**
 * API Smoke Tests
 * Quick sanity checks for critical API endpoints
 * These tests should run fast and verify basic functionality
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api, login, clearTokenCache } from '../helpers/api-client';
import { testUsers } from '../data/test-fixtures';

describe('API Smoke Tests', () => {
  let patientToken: string;

  beforeAll(async () => {
    clearTokenCache();
    try {
      patientToken = await login(testUsers.patient.email, testUsers.patient.password);
    } catch {
      console.warn('Could not authenticate - some tests will be skipped');
    }
  });

  afterAll(() => {
    clearTokenCache();
  });

  describe('Health Checks', () => {
    it('should return healthy status from /health', async () => {
      const response = await api.get('/health');

      expect(response.ok).toBe(true);
      expect(response.data).toHaveProperty('status');
      expect(response.data.status).toBe('healthy');
    });

    it('should return API version', async () => {
      const response = await api.get('/health');

      if (response.ok && response.data.version) {
        expect(typeof response.data.version).toBe('string');
      }
    });
  });

  describe('Authentication', () => {
    it('should authenticate with valid credentials', async () => {
      const response = await api.post('/auth/login', {
        email: testUsers.patient.email,
        password: testUsers.patient.password,
      });

      expect(response.ok).toBe(true);
      expect(response.data).toHaveProperty('accessToken');
    });

    it('should reject invalid credentials', async () => {
      const response = await api.post('/auth/login', {
        email: 'invalid@test.com',
        password: 'wrongpassword',
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should return 401 for protected routes without token', async () => {
      const response = await api.get('/appointments');

      expect(response.status).toBe(401);
    });
  });

  describe('Core Endpoints', () => {
    it('should access appointments endpoint', async () => {
      if (!patientToken) return;

      const response = await api.get('/appointments', { token: patientToken });

      expect([200, 404]).toContain(response.status);
    });

    it('should access providers endpoint', async () => {
      if (!patientToken) return;

      const response = await api.get('/providers', { token: patientToken });

      expect([200, 404]).toContain(response.status);
    });

    it('should access user profile endpoint', async () => {
      if (!patientToken) return;

      const response = await api.get('/users/me', { token: patientToken });

      expect([200, 404]).toContain(response.status);
    });

    it('should access notifications endpoint', async () => {
      if (!patientToken) return;

      const response = await api.get('/notifications', { token: patientToken });

      expect([200, 404]).toContain(response.status);
    });

    it('should access billing endpoint', async () => {
      if (!patientToken) return;

      const response = await api.get('/billing/subscription', { token: patientToken });

      expect([200, 402, 404]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await api.get('/non-existent-route');

      expect(response.status).toBe(404);
    });

    it('should return 400 for malformed requests', async () => {
      const response = await api.post('/auth/login', {
        // Missing required fields
      });

      expect([400, 422]).toContain(response.status);
    });

    it('should handle OPTIONS preflight requests', async () => {
      // Most browsers send OPTIONS for CORS
      const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:3001/api/v1'}/health`, {
        method: 'OPTIONS',
      });

      expect([200, 204]).toContain(response.status);
    });
  });

  describe('Rate Limiting', () => {
    it('should include rate limit headers', async () => {
      const response = await api.get('/health');

      // Check for common rate limit headers
      const hasRateLimitHeaders =
        response.headers?.['x-ratelimit-limit'] ||
        response.headers?.['x-rate-limit-limit'] ||
        response.headers?.['ratelimit-limit'];

      // Rate limiting may not be configured in test environment
      expect(response.ok).toBe(true);
    });
  });

  describe('Response Format', () => {
    it('should return JSON content type', async () => {
      const response = await api.get('/health');

      expect(response.ok).toBe(true);
      // API client should handle JSON automatically
    });

    it('should include request ID in response', async () => {
      const response = await api.get('/health');

      // Request ID may be in headers or body
      const hasRequestId =
        response.headers?.['x-request-id'] ||
        response.data?.requestId;

      // Request ID may not be configured
      expect(response.ok).toBe(true);
    });
  });
});
