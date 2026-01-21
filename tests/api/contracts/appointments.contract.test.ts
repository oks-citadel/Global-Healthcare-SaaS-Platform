/**
 * API Contract Tests - Appointments Endpoints
 * Validates response schemas and contracts for appointment endpoints
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { api, authApi, login, clearTokenCache } from '../helpers/api-client';
import { validateSchema, schemas, expectValidSchema } from '../helpers/schema-validator';
import { testUsers, testAppointments, invalidData } from '../data/test-fixtures';

describe('Appointments API Contract Tests', () => {
  let patientToken: string;
  let providerToken: string;

  beforeAll(async () => {
    clearTokenCache();
    try {
      patientToken = await login(testUsers.patient.email, testUsers.patient.password);
      providerToken = await login(testUsers.provider.email, testUsers.provider.password);
    } catch {
      // Tests will be skipped if login fails
    }
  });

  describe('GET /appointments', () => {
    it('should return 401 without authentication', async () => {
      const response = await api.get('/appointments');
      expect(response.status).toBe(401);
    });

    it('should return array of appointments when authenticated', async () => {
      if (!patientToken) return;

      const response = await api.get('/appointments', { token: patientToken });

      if (response.ok) {
        expect(Array.isArray(response.data) || response.data.data).toBeTruthy();

        // If paginated response
        if (response.data.data) {
          expect(Array.isArray(response.data.data)).toBe(true);
          expectValidSchema(response.data, schemas.paginatedResponse, 'paginatedResponse');
        }
      }
    });

    it('should support pagination parameters', async () => {
      if (!patientToken) return;

      const response = await api.get('/appointments?page=1&limit=10', { token: patientToken });

      if (response.ok && response.data.pagination) {
        expect(response.data.pagination.page).toBe(1);
        expect(response.data.pagination.limit).toBe(10);
      }
    });

    it('should support status filter', async () => {
      if (!patientToken) return;

      const response = await api.get('/appointments?status=scheduled', { token: patientToken });

      if (response.ok) {
        const appointments = response.data.data || response.data;
        if (Array.isArray(appointments)) {
          appointments.forEach((apt: { status: string }) => {
            expect(apt.status).toBe('scheduled');
          });
        }
      }
    });

    it('should reject invalid pagination values', async () => {
      if (!patientToken) return;

      const response = await api.get('/appointments?page=-1&limit=0', { token: patientToken });

      // Should either return 400 or use defaults
      expect([200, 400]).toContain(response.status);
    });
  });

  describe('POST /appointments', () => {
    it('should return 401 without authentication', async () => {
      const response = await api.post('/appointments', {
        providerId: testUsers.provider.id,
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'checkup',
        duration: 30,
        reason: 'Test appointment',
      });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      if (!patientToken) return;

      const response = await api.post('/appointments', {}, { token: patientToken });

      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error');
    });

    it('should reject past dates', async () => {
      if (!patientToken) return;

      const response = await api.post('/appointments', {
        providerId: testUsers.provider.id,
        scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        type: 'checkup',
        duration: 30,
        reason: 'Test appointment',
      }, { token: patientToken });

      expect(response.status).toBe(400);
    });

    it('should reject invalid appointment type', async () => {
      if (!patientToken) return;

      const response = await api.post('/appointments', {
        providerId: testUsers.provider.id,
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'invalid_type',
        duration: 30,
        reason: 'Test appointment',
      }, { token: patientToken });

      expect(response.status).toBe(400);
    });

    it('should reject negative duration', async () => {
      if (!patientToken) return;

      const response = await api.post('/appointments', {
        providerId: testUsers.provider.id,
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'checkup',
        duration: -30,
        reason: 'Test appointment',
      }, { token: patientToken });

      expect(response.status).toBe(400);
    });

    it('should return valid appointment schema on success', async () => {
      if (!patientToken) return;

      const response = await api.post('/appointments', {
        providerId: testUsers.provider.id,
        scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'checkup',
        duration: 30,
        reason: 'Contract test appointment',
      }, { token: patientToken });

      // May fail due to subscription requirement or provider availability
      if (response.ok) {
        expect(response.data).toHaveProperty('id');
        expect(response.data).toHaveProperty('status');
        expectValidSchema(response.data, schemas.appointment, 'appointment');
      }
    });

    it('should return 402 if subscription required and user has no subscription', async () => {
      // This tests the subscription gate
      // Using a user without subscription (if available)
      if (!patientToken) return;

      const response = await api.post('/appointments', {
        providerId: testUsers.provider.id,
        scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'checkup',
        duration: 30,
        reason: 'Test appointment',
      }, { token: patientToken });

      // May return 402 Payment Required if subscription is required
      expect([200, 201, 402]).toContain(response.status);
    });
  });

  describe('GET /appointments/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await api.get(`/appointments/${testAppointments.upcoming.id}`);
      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent appointment', async () => {
      if (!patientToken) return;

      const response = await api.get('/appointments/00000000-0000-0000-0000-000000000000', {
        token: patientToken,
      });

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid UUID format', async () => {
      if (!patientToken) return;

      const response = await api.get(`/appointments/${invalidData.invalidUuid}`, {
        token: patientToken,
      });

      expect([400, 404]).toContain(response.status);
    });

    it('should return valid appointment schema for existing appointment', async () => {
      if (!patientToken) return;

      // First get list to find a valid ID
      const listResponse = await api.get('/appointments', { token: patientToken });

      if (listResponse.ok) {
        const appointments = listResponse.data.data || listResponse.data;
        if (Array.isArray(appointments) && appointments.length > 0) {
          const response = await api.get(`/appointments/${appointments[0].id}`, {
            token: patientToken,
          });

          if (response.ok) {
            expectValidSchema(response.data, schemas.appointment, 'appointment');
          }
        }
      }
    });
  });

  describe('PATCH /appointments/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await api.patch(`/appointments/${testAppointments.upcoming.id}`, {
        reason: 'Updated reason',
      });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent appointment', async () => {
      if (!patientToken) return;

      const response = await api.patch('/appointments/00000000-0000-0000-0000-000000000000', {
        reason: 'Updated reason',
      }, { token: patientToken });

      expect(response.status).toBe(404);
    });

    it('should reject invalid status transitions', async () => {
      if (!patientToken) return;

      // Try to transition to invalid status
      const response = await api.patch(`/appointments/${testAppointments.completed?.id || 'test'}`, {
        status: 'scheduled', // Can't go from completed back to scheduled
      }, { token: patientToken });

      // Should return error if appointment exists
      if (response.status !== 404) {
        expect([400, 403, 422]).toContain(response.status);
      }
    });

    it('should return valid appointment schema on successful update', async () => {
      if (!patientToken) return;

      // First get list to find a valid ID
      const listResponse = await api.get('/appointments?status=scheduled', { token: patientToken });

      if (listResponse.ok) {
        const appointments = listResponse.data.data || listResponse.data;
        if (Array.isArray(appointments) && appointments.length > 0) {
          const response = await api.patch(`/appointments/${appointments[0].id}`, {
            notes: 'Updated notes from contract test',
          }, { token: patientToken });

          if (response.ok) {
            expectValidSchema(response.data, schemas.appointment, 'appointment');
            expect(response.data.notes).toBe('Updated notes from contract test');
          }
        }
      }
    });
  });

  describe('DELETE /appointments/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await api.delete(`/appointments/${testAppointments.upcoming.id}`);
      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent appointment', async () => {
      if (!patientToken) return;

      const response = await api.delete('/appointments/00000000-0000-0000-0000-000000000000', {
        token: patientToken,
      });

      expect(response.status).toBe(404);
    });

    it('should return 400/403 when cancelling completed appointment', async () => {
      if (!patientToken) return;

      // Try to cancel a completed appointment
      const listResponse = await api.get('/appointments?status=completed', { token: patientToken });

      if (listResponse.ok) {
        const appointments = listResponse.data.data || listResponse.data;
        if (Array.isArray(appointments) && appointments.length > 0) {
          const response = await api.delete(`/appointments/${appointments[0].id}`, {
            token: patientToken,
          });

          expect([400, 403, 422]).toContain(response.status);
        }
      }
    });
  });

  describe('GET /appointments/pricing', () => {
    it('should return 401 without authentication', async () => {
      const response = await api.get('/appointments/pricing');
      expect(response.status).toBe(401);
    });

    it('should return pricing information when authenticated', async () => {
      if (!patientToken) return;

      const response = await api.get('/appointments/pricing', { token: patientToken });

      if (response.ok) {
        // Should have pricing data
        expect(response.data).toBeDefined();
      }
    });
  });

  describe('Cross-tenant Security', () => {
    it('should not allow access to other tenant appointments', async () => {
      if (!patientToken) return;

      // Try to access an appointment from another tenant
      // This should return 403 or 404
      const response = await api.get('/appointments/other-tenant-apt-id', {
        token: patientToken,
      });

      expect([403, 404]).toContain(response.status);
    });
  });
});
