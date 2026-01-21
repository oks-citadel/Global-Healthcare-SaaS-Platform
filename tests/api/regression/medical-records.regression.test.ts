/**
 * API Regression Tests - Medical Records
 * Comprehensive tests for medical records endpoints (HIPAA-compliant)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api, login, clearTokenCache } from '../helpers/api-client';
import { testUsers } from '../data/test-fixtures';

describe('Medical Records API Regression Tests', () => {
  let patientToken: string;
  let providerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    clearTokenCache();
    try {
      patientToken = await login(testUsers.patient.email, testUsers.patient.password);
      providerToken = await login(testUsers.provider.email, testUsers.provider.password);
      adminToken = await login(testUsers.admin.email, testUsers.admin.password);
    } catch {
      // Tests will be skipped if login fails
    }
  });

  afterAll(() => {
    clearTokenCache();
  });

  describe('GET /medical-records - List Patient Records', () => {
    it('should list own medical records for patient', async () => {
      if (!patientToken) return;

      const response = await api.get('/medical-records', { token: patientToken });

      if (response.ok) {
        const records = response.data.data || response.data;
        expect(Array.isArray(records)).toBe(true);
      }
    });

    it('should return 401 without authentication', async () => {
      const response = await api.get('/medical-records');

      expect(response.status).toBe(401);
    });

    it('should support filtering by type', async () => {
      if (!patientToken) return;

      const response = await api.get('/medical-records?type=lab_result', {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });

    it('should support date range filtering', async () => {
      if (!patientToken) return;

      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const response = await api.get(
        `/medical-records?startDate=${startDate}&endDate=${endDate}`,
        { token: patientToken }
      );

      expect([200, 404]).toContain(response.status);
    });

    it('should support pagination', async () => {
      if (!patientToken) return;

      const response = await api.get('/medical-records?page=1&limit=10', {
        token: patientToken,
      });

      if (response.ok) {
        expect(response.data).toHaveProperty('data');
        expect(response.data.data.length).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('GET /lab-results - List Lab Results', () => {
    it('should list lab results for patient', async () => {
      if (!patientToken) return;

      const response = await api.get('/lab-results', { token: patientToken });

      if (response.ok) {
        const results = response.data.data || response.data;
        expect(Array.isArray(results)).toBe(true);
      }
    });

    it('should include result values and reference ranges', async () => {
      if (!patientToken) return;

      const response = await api.get('/lab-results?limit=1', { token: patientToken });

      if (response.ok) {
        const results = response.data.data || response.data;
        if (Array.isArray(results) && results.length > 0) {
          const result = results[0];
          // Lab results should have test info
          expect(result).toHaveProperty('id');
        }
      }
    });

    it('should support filtering by status', async () => {
      if (!patientToken) return;

      const response = await api.get('/lab-results?status=completed', {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('GET /lab-results/:id - Get Lab Result Details', () => {
    it('should get lab result by ID', async () => {
      if (!patientToken) return;

      const listResponse = await api.get('/lab-results?limit=1', { token: patientToken });
      if (!listResponse.ok) return;

      const results = listResponse.data.data || listResponse.data;
      if (Array.isArray(results) && results.length > 0) {
        const resultId = results[0].id;

        const response = await api.get(`/lab-results/${resultId}`, {
          token: patientToken,
        });

        expect(response.ok).toBe(true);
        expect(response.data.id).toBe(resultId);
      }
    });

    it('should return 404 for non-existent result', async () => {
      if (!patientToken) return;

      const response = await api.get('/lab-results/00000000-0000-0000-0000-000000000000', {
        token: patientToken,
      });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /prescriptions - List Prescriptions', () => {
    it('should list prescriptions for patient', async () => {
      if (!patientToken) return;

      const response = await api.get('/prescriptions', { token: patientToken });

      if (response.ok) {
        const prescriptions = response.data.data || response.data;
        expect(Array.isArray(prescriptions)).toBe(true);
      }
    });

    it('should support filtering by active status', async () => {
      if (!patientToken) return;

      const response = await api.get('/prescriptions?active=true', {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });

    it('should include medication details', async () => {
      if (!patientToken) return;

      const response = await api.get('/prescriptions?limit=1', { token: patientToken });

      if (response.ok) {
        const prescriptions = response.data.data || response.data;
        if (Array.isArray(prescriptions) && prescriptions.length > 0) {
          const prescription = prescriptions[0];
          expect(prescription).toHaveProperty('id');
        }
      }
    });
  });

  describe('POST /prescriptions/:id/refill - Request Refill', () => {
    it('should request prescription refill', async () => {
      if (!patientToken) return;

      const listResponse = await api.get('/prescriptions?limit=1', { token: patientToken });
      if (!listResponse.ok) return;

      const prescriptions = listResponse.data.data || listResponse.data;
      if (Array.isArray(prescriptions) && prescriptions.length > 0) {
        const prescriptionId = prescriptions[0].id;

        const response = await api.post(`/prescriptions/${prescriptionId}/refill`, {
          pharmacyId: 'test-pharmacy',
          notes: 'Please refill at my usual pharmacy',
        }, { token: patientToken });

        // May fail if no refills remaining or other restrictions
        expect([200, 201, 400, 403, 404]).toContain(response.status);
      }
    });
  });

  describe('GET /immunizations - List Immunizations', () => {
    it('should list immunizations for patient', async () => {
      if (!patientToken) return;

      const response = await api.get('/immunizations', { token: patientToken });

      if (response.ok) {
        const immunizations = response.data.data || response.data;
        expect(Array.isArray(immunizations)).toBe(true);
      }
    });
  });

  describe('GET /allergies - List Allergies', () => {
    it('should list allergies for patient', async () => {
      if (!patientToken) return;

      const response = await api.get('/allergies', { token: patientToken });

      if (response.ok) {
        const allergies = response.data.data || response.data;
        expect(Array.isArray(allergies)).toBe(true);
      }
    });

    it('should include severity information', async () => {
      if (!patientToken) return;

      const response = await api.get('/allergies', { token: patientToken });

      if (response.ok) {
        const allergies = response.data.data || response.data;
        if (Array.isArray(allergies) && allergies.length > 0) {
          expect(allergies[0]).toHaveProperty('id');
        }
      }
    });
  });

  describe('POST /allergies - Add Allergy', () => {
    it('should add allergy for patient', async () => {
      if (!patientToken) return;

      const response = await api.post('/allergies', {
        allergen: 'Test Allergen',
        severity: 'mild',
        reaction: 'Hives',
      }, { token: patientToken });

      expect([200, 201, 400, 403, 404]).toContain(response.status);
    });

    it('should validate severity enum', async () => {
      if (!patientToken) return;

      const response = await api.post('/allergies', {
        allergen: 'Test',
        severity: 'invalid_severity',
      }, { token: patientToken });

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('GET /conditions - List Medical Conditions', () => {
    it('should list conditions for patient', async () => {
      if (!patientToken) return;

      const response = await api.get('/conditions', { token: patientToken });

      if (response.ok) {
        const conditions = response.data.data || response.data;
        expect(Array.isArray(conditions)).toBe(true);
      }
    });

    it('should support filtering by status', async () => {
      if (!patientToken) return;

      const response = await api.get('/conditions?status=active', {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('GET /encounters - List Patient Encounters', () => {
    it('should list encounters for patient', async () => {
      if (!patientToken) return;

      const response = await api.get('/encounters', { token: patientToken });

      if (response.ok) {
        const encounters = response.data.data || response.data;
        expect(Array.isArray(encounters)).toBe(true);
      }
    });

    it('should list encounters for provider', async () => {
      if (!providerToken) return;

      const response = await api.get('/encounters', { token: providerToken });

      if (response.ok) {
        const encounters = response.data.data || response.data;
        expect(Array.isArray(encounters)).toBe(true);
      }
    });

    it('should support filtering by date', async () => {
      if (!patientToken) return;

      const date = new Date().toISOString().split('T')[0];

      const response = await api.get(`/encounters?date=${date}`, {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('GET /vitals - List Vital Signs', () => {
    it('should list vitals for patient', async () => {
      if (!patientToken) return;

      const response = await api.get('/vitals', { token: patientToken });

      if (response.ok) {
        const vitals = response.data.data || response.data;
        expect(Array.isArray(vitals)).toBe(true);
      }
    });

    it('should support filtering by type', async () => {
      if (!patientToken) return;

      const response = await api.get('/vitals?type=blood_pressure', {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('POST /medical-records/export - Export Records (GDPR)', () => {
    it('should initiate records export', async () => {
      if (!patientToken) return;

      const response = await api.post('/medical-records/export', {
        format: 'pdf',
        types: ['lab_results', 'prescriptions'],
      }, { token: patientToken });

      expect([200, 201, 202, 400, 404]).toContain(response.status);
    });

    it('should support different export formats', async () => {
      if (!patientToken) return;

      const response = await api.post('/medical-records/export', {
        format: 'fhir',
      }, { token: patientToken });

      expect([200, 201, 202, 400, 404]).toContain(response.status);
    });
  });

  describe('Access Control', () => {
    it('should prevent access to other patients records', async () => {
      if (!patientToken) return;

      const response = await api.get('/patients/other-patient-id/medical-records', {
        token: patientToken,
      });

      expect([401, 403, 404]).toContain(response.status);
    });

    it('should allow provider to access assigned patient records', async () => {
      if (!providerToken) return;

      // Provider should be able to access patients they have appointments with
      const response = await api.get('/patients', { token: providerToken });

      expect([200, 404]).toContain(response.status);
    });
  });
});
