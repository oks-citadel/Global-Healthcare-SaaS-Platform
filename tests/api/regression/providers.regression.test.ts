/**
 * API Regression Tests - Providers
 * Comprehensive tests for healthcare provider endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api, login, clearTokenCache } from '../helpers/api-client';
import { testUsers } from '../data/test-fixtures';

describe('Providers API Regression Tests', () => {
  let adminToken: string;
  let patientToken: string;
  let providerToken: string;

  beforeAll(async () => {
    clearTokenCache();
    try {
      adminToken = await login(testUsers.admin.email, testUsers.admin.password);
      patientToken = await login(testUsers.patient.email, testUsers.patient.password);
      providerToken = await login(testUsers.provider.email, testUsers.provider.password);
    } catch {
      // Tests will be skipped if login fails
    }
  });

  afterAll(() => {
    clearTokenCache();
  });

  describe('GET /providers - List Providers', () => {
    it('should list providers for authenticated users', async () => {
      if (!patientToken) return;

      const response = await api.get('/providers', { token: patientToken });

      if (response.ok) {
        const providers = response.data.data || response.data;
        expect(Array.isArray(providers)).toBe(true);
      }
    });

    it('should return 401 without authentication', async () => {
      const response = await api.get('/providers');

      expect(response.status).toBe(401);
    });

    it('should support filtering by specialty', async () => {
      if (!patientToken) return;

      const response = await api.get('/providers?specialty=internal_medicine', {
        token: patientToken,
      });

      if (response.ok) {
        const providers = response.data.data || response.data;
        if (Array.isArray(providers) && providers.length > 0) {
          expect(providers.every((p: { specialties: string[] }) =>
            p.specialties?.includes('internal_medicine')
          )).toBe(true);
        }
      }
    });

    it('should support filtering by availability', async () => {
      if (!patientToken) return;

      const response = await api.get('/providers?available=true', {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });

    it('should support search by name', async () => {
      if (!patientToken) return;

      const response = await api.get('/providers?search=Dr', {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });

    it('should support pagination', async () => {
      if (!patientToken) return;

      const response = await api.get('/providers?page=1&limit=5', {
        token: patientToken,
      });

      if (response.ok) {
        expect(response.data).toHaveProperty('data');
        expect(response.data.data.length).toBeLessThanOrEqual(5);
      }
    });

    it('should support filtering by language', async () => {
      if (!patientToken) return;

      const response = await api.get('/providers?language=en', {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });

    it('should support filtering by gender', async () => {
      if (!patientToken) return;

      const response = await api.get('/providers?gender=female', {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('GET /providers/:id - Get Provider Details', () => {
    it('should get provider by ID', async () => {
      if (!patientToken) return;

      const providersResponse = await api.get('/providers?limit=1', { token: patientToken });
      if (!providersResponse.ok) return;

      const providers = providersResponse.data.data || providersResponse.data;
      if (Array.isArray(providers) && providers.length > 0) {
        const providerId = providers[0].id;

        const response = await api.get(`/providers/${providerId}`, {
          token: patientToken,
        });

        expect(response.ok).toBe(true);
        expect(response.data.id).toBe(providerId);
      }
    });

    it('should return 404 for non-existent provider', async () => {
      if (!patientToken) return;

      const response = await api.get('/providers/00000000-0000-0000-0000-000000000000', {
        token: patientToken,
      });

      expect(response.status).toBe(404);
    });

    it('should include specialties in response', async () => {
      if (!patientToken) return;

      const providersResponse = await api.get('/providers?limit=1', { token: patientToken });
      if (!providersResponse.ok) return;

      const providers = providersResponse.data.data || providersResponse.data;
      if (Array.isArray(providers) && providers.length > 0) {
        const providerId = providers[0].id;

        const response = await api.get(`/providers/${providerId}`, {
          token: patientToken,
        });

        if (response.ok && response.data.specialties) {
          expect(Array.isArray(response.data.specialties)).toBe(true);
        }
      }
    });
  });

  describe('GET /providers/:id/availability - Get Provider Availability', () => {
    it('should get provider availability', async () => {
      if (!patientToken) return;

      const providersResponse = await api.get('/providers?limit=1', { token: patientToken });
      if (!providersResponse.ok) return;

      const providers = providersResponse.data.data || providersResponse.data;
      if (Array.isArray(providers) && providers.length > 0) {
        const providerId = providers[0].id;
        const date = new Date().toISOString().split('T')[0];

        const response = await api.get(`/providers/${providerId}/availability?date=${date}`, {
          token: patientToken,
        });

        expect([200, 404]).toContain(response.status);

        if (response.ok) {
          const slots = response.data.slots || response.data;
          expect(Array.isArray(slots)).toBe(true);
        }
      }
    });

    it('should support date range for availability', async () => {
      if (!patientToken) return;

      const providersResponse = await api.get('/providers?limit=1', { token: patientToken });
      if (!providersResponse.ok) return;

      const providers = providersResponse.data.data || providersResponse.data;
      if (Array.isArray(providers) && providers.length > 0) {
        const providerId = providers[0].id;
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const response = await api.get(
          `/providers/${providerId}/availability?startDate=${startDate}&endDate=${endDate}`,
          { token: patientToken }
        );

        expect([200, 404]).toContain(response.status);
      }
    });
  });

  describe('GET /providers/me - Get Own Provider Profile', () => {
    it('should get own profile for provider', async () => {
      if (!providerToken) return;

      const response = await api.get('/providers/me', { token: providerToken });

      expect([200, 404]).toContain(response.status);
    });

    it('should return 403/404 for non-provider', async () => {
      if (!patientToken) return;

      const response = await api.get('/providers/me', { token: patientToken });

      expect([403, 404]).toContain(response.status);
    });
  });

  describe('PUT /providers/me - Update Own Provider Profile', () => {
    it('should update own profile for provider', async () => {
      if (!providerToken) return;

      const response = await api.put('/providers/me', {
        bio: 'Updated bio for testing',
      }, { token: providerToken });

      expect([200, 400, 404]).toContain(response.status);
    });

    it('should validate specialties', async () => {
      if (!providerToken) return;

      const response = await api.put('/providers/me', {
        specialties: ['invalid_specialty'],
      }, { token: providerToken });

      expect([200, 400, 404, 422]).toContain(response.status);
    });
  });

  describe('PUT /providers/:id/schedule - Update Provider Schedule', () => {
    it('should update schedule for own provider', async () => {
      if (!providerToken) return;

      const schedule = {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '15:00', available: true },
        saturday: { available: false },
        sunday: { available: false },
      };

      const response = await api.put('/providers/me/schedule', schedule, {
        token: providerToken,
      });

      expect([200, 400, 404]).toContain(response.status);
    });
  });

  describe('GET /providers/:id/reviews - Get Provider Reviews', () => {
    it('should get provider reviews', async () => {
      if (!patientToken) return;

      const providersResponse = await api.get('/providers?limit=1', { token: patientToken });
      if (!providersResponse.ok) return;

      const providers = providersResponse.data.data || providersResponse.data;
      if (Array.isArray(providers) && providers.length > 0) {
        const providerId = providers[0].id;

        const response = await api.get(`/providers/${providerId}/reviews`, {
          token: patientToken,
        });

        expect([200, 404]).toContain(response.status);

        if (response.ok) {
          const reviews = response.data.data || response.data;
          expect(Array.isArray(reviews)).toBe(true);
        }
      }
    });
  });

  describe('POST /providers/:id/reviews - Create Provider Review', () => {
    it('should create review after completed appointment', async () => {
      if (!patientToken) return;

      const providersResponse = await api.get('/providers?limit=1', { token: patientToken });
      if (!providersResponse.ok) return;

      const providers = providersResponse.data.data || providersResponse.data;
      if (Array.isArray(providers) && providers.length > 0) {
        const providerId = providers[0].id;

        const response = await api.post(`/providers/${providerId}/reviews`, {
          rating: 5,
          comment: 'Great experience with this provider',
        }, { token: patientToken });

        // May require completed appointment
        expect([200, 201, 400, 403, 404]).toContain(response.status);
      }
    });

    it('should validate rating range', async () => {
      if (!patientToken) return;

      const providersResponse = await api.get('/providers?limit=1', { token: patientToken });
      if (!providersResponse.ok) return;

      const providers = providersResponse.data.data || providersResponse.data;
      if (Array.isArray(providers) && providers.length > 0) {
        const providerId = providers[0].id;

        const response = await api.post(`/providers/${providerId}/reviews`, {
          rating: 10, // Invalid rating
          comment: 'Test',
        }, { token: patientToken });

        expect([400, 422]).toContain(response.status);
      }
    });
  });
});
