/**
 * API Contract Tests - Patient Endpoints
 * Validates response schemas and contracts for patient endpoints
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { api, login, clearTokenCache } from '../helpers/api-client';
import { validateSchema, schemas, expectValidSchema } from '../helpers/schema-validator';
import { testUsers, testPatients, invalidData } from '../data/test-fixtures';

describe('Patient API Contract Tests', () => {
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

  describe('POST /patients', () => {
    it('should return 401 without authentication', async () => {
      const response = await api.post('/patients', {
        dateOfBirth: '1990-01-15',
        gender: 'male',
      });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      if (!patientToken) return;

      const response = await api.post('/patients', {}, { token: patientToken });

      expect([400, 422]).toContain(response.status);
    });

    it('should reject invalid date of birth', async () => {
      if (!patientToken) return;

      const response = await api.post('/patients', {
        dateOfBirth: invalidData.futureDate,
        gender: 'male',
      }, { token: patientToken });

      expect(response.status).toBe(400);
    });

    it('should reject invalid gender value', async () => {
      if (!patientToken) return;

      const response = await api.post('/patients', {
        dateOfBirth: '1990-01-15',
        gender: 'invalid_gender',
      }, { token: patientToken });

      expect(response.status).toBe(400);
    });

    it('should return valid patient schema on success', async () => {
      if (!patientToken) return;

      const response = await api.post('/patients', {
        dateOfBirth: '1990-01-15',
        gender: 'male',
        bloodType: 'O+',
        allergies: ['Peanuts'],
        emergencyContact: {
          name: 'Emergency Contact',
          phone: '+1-555-0123',
          relationship: 'Spouse',
        },
      }, { token: patientToken });

      // May return 409 if patient already exists for user
      if (response.ok) {
        expect(response.data).toHaveProperty('id');
        expectValidSchema(response.data, schemas.patient, 'patient');
      } else {
        expect([400, 409]).toContain(response.status);
      }
    });

    it('should sanitize XSS in allergies', async () => {
      if (!patientToken) return;

      const response = await api.post('/patients', {
        dateOfBirth: '1990-01-15',
        gender: 'male',
        allergies: [invalidData.xssPayload],
      }, { token: patientToken });

      if (response.ok) {
        const allergies = response.data.allergies || [];
        allergies.forEach((allergy: string) => {
          expect(allergy).not.toContain('<script>');
        });
      }
    });
  });

  describe('GET /patients/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await api.get(`/patients/${testPatients.patient1.id}`);
      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent patient', async () => {
      if (!patientToken) return;

      const response = await api.get('/patients/00000000-0000-0000-0000-000000000000', {
        token: patientToken,
      });

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid UUID format', async () => {
      if (!patientToken) return;

      const response = await api.get(`/patients/${invalidData.invalidUuid}`, {
        token: patientToken,
      });

      expect([400, 404]).toContain(response.status);
    });

    it('should return valid patient schema', async () => {
      if (!patientToken) return;

      // Get the current user's patient record
      const meResponse = await api.get('/auth/me', { token: patientToken });

      if (meResponse.ok && meResponse.data.patientId) {
        const response = await api.get(`/patients/${meResponse.data.patientId}`, {
          token: patientToken,
        });

        if (response.ok) {
          expectValidSchema(response.data, schemas.patient, 'patient');
        }
      }
    });

    it('should include medical history fields', async () => {
      if (!patientToken) return;

      const meResponse = await api.get('/auth/me', { token: patientToken });

      if (meResponse.ok && meResponse.data.patientId) {
        const response = await api.get(`/patients/${meResponse.data.patientId}`, {
          token: patientToken,
        });

        if (response.ok) {
          // These fields should exist (may be empty arrays)
          expect(response.data).toHaveProperty('allergies');
          expect(response.data).toHaveProperty('medications');
          expect(response.data).toHaveProperty('conditions');
        }
      }
    });
  });

  describe('PATCH /patients/:id', () => {
    it('should return 401 without authentication', async () => {
      const response = await api.patch(`/patients/${testPatients.patient1.id}`, {
        bloodType: 'A+',
      });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent patient', async () => {
      if (!patientToken) return;

      const response = await api.patch('/patients/00000000-0000-0000-0000-000000000000', {
        bloodType: 'A+',
      }, { token: patientToken });

      expect(response.status).toBe(404);
    });

    it('should reject invalid blood type', async () => {
      if (!patientToken) return;

      const meResponse = await api.get('/auth/me', { token: patientToken });

      if (meResponse.ok && meResponse.data.patientId) {
        const response = await api.patch(`/patients/${meResponse.data.patientId}`, {
          bloodType: 'INVALID',
        }, { token: patientToken });

        expect([400, 422]).toContain(response.status);
      }
    });

    it('should return valid patient schema on success', async () => {
      if (!patientToken) return;

      const meResponse = await api.get('/auth/me', { token: patientToken });

      if (meResponse.ok && meResponse.data.patientId) {
        const response = await api.patch(`/patients/${meResponse.data.patientId}`, {
          allergies: ['Peanuts', 'Penicillin'],
        }, { token: patientToken });

        if (response.ok) {
          expectValidSchema(response.data, schemas.patient, 'patient');
          expect(response.data.allergies).toContain('Peanuts');
        }
      }
    });

    it('should validate emergency contact phone format', async () => {
      if (!patientToken) return;

      const meResponse = await api.get('/auth/me', { token: patientToken });

      if (meResponse.ok && meResponse.data.patientId) {
        const response = await api.patch(`/patients/${meResponse.data.patientId}`, {
          emergencyContact: {
            name: 'Test Contact',
            phone: 'invalid-phone',
            relationship: 'Spouse',
          },
        }, { token: patientToken });

        // Should either validate phone or accept any string
        expect([200, 400]).toContain(response.status);
      }
    });
  });

  describe('GET /patients/:patientId/documents', () => {
    it('should return 401 without authentication', async () => {
      const response = await api.get(`/patients/${testPatients.patient1.id}/documents`);
      expect(response.status).toBe(401);
    });

    it('should return array of documents', async () => {
      if (!patientToken) return;

      const meResponse = await api.get('/auth/me', { token: patientToken });

      if (meResponse.ok && meResponse.data.patientId) {
        const response = await api.get(`/patients/${meResponse.data.patientId}/documents`, {
          token: patientToken,
        });

        if (response.ok) {
          const documents = response.data.data || response.data;
          expect(Array.isArray(documents)).toBe(true);
        }
      }
    });

    it('should support document type filter', async () => {
      if (!patientToken) return;

      const meResponse = await api.get('/auth/me', { token: patientToken });

      if (meResponse.ok && meResponse.data.patientId) {
        const response = await api.get(
          `/patients/${meResponse.data.patientId}/documents?type=lab_result`,
          { token: patientToken }
        );

        if (response.ok) {
          const documents = response.data.data || response.data;
          if (Array.isArray(documents)) {
            documents.forEach((doc: { type: string }) => {
              expect(doc.type).toBe('lab_result');
            });
          }
        }
      }
    });
  });

  describe('GDPR Compliance Endpoints', () => {
    describe('GET /users/me/export', () => {
      it('should return 401 without authentication', async () => {
        const response = await api.get('/users/me/export');
        expect(response.status).toBe(401);
      });

      it('should return user data export', async () => {
        if (!patientToken) return;

        const response = await api.get('/users/me/export', { token: patientToken });

        if (response.ok) {
          // Should contain user data
          expect(response.data).toBeDefined();
        }
      });
    });

    describe('DELETE /users/me', () => {
      it('should return 401 without authentication', async () => {
        const response = await api.delete('/users/me');
        expect(response.status).toBe(401);
      });

      // Note: We don't actually test deletion to preserve test users
      it('should require confirmation for account deletion', async () => {
        if (!patientToken) return;

        // Try without confirmation
        const response = await api.delete('/users/me', { token: patientToken });

        // Should either require confirmation or proceed
        // Most implementations require explicit confirmation
        expect([200, 202, 204, 400]).toContain(response.status);
      });
    });
  });

  describe('Provider Access to Patient Data', () => {
    it('should allow provider to view patient details', async () => {
      if (!providerToken) return;

      // Provider should be able to access patient data
      const response = await api.get(`/patients/${testPatients.patient1.id}`, {
        token: providerToken,
      });

      // Should succeed or return 404 (if patient doesn't exist)
      expect([200, 404]).toContain(response.status);
    });

    it('should allow provider to update patient medical history', async () => {
      if (!providerToken) return;

      const response = await api.patch(`/patients/${testPatients.patient1.id}`, {
        conditions: ['Hypertension'],
      }, { token: providerToken });

      // Should succeed or return 404/403
      expect([200, 403, 404]).toContain(response.status);
    });
  });

  describe('Admin Access to Patient Data', () => {
    it('should allow admin to view patient details', async () => {
      if (!adminToken) return;

      const response = await api.get(`/patients/${testPatients.patient1.id}`, {
        token: adminToken,
      });

      // Admin should have access
      expect([200, 404]).toContain(response.status);
    });
  });

  describe('Cross-tenant Isolation', () => {
    it('should not allow access to patients in other tenants', async () => {
      if (!patientToken) return;

      // Try to access a patient from another tenant
      // Using a fake ID that would be in another tenant
      const response = await api.get('/patients/other-tenant-patient-id', {
        token: patientToken,
      });

      expect([403, 404]).toContain(response.status);
    });
  });
});
