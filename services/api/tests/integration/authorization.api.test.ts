import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp, createTestUser, getAuthHeader } from './helpers/testApp.js';

/**
 * Authorization (Role-Based Access Control) Test Suite
 * Tests RBAC across all protected endpoints
 */
describe('Authorization - RBAC Test Suite', () => {
  const app = createTestApp();

  describe('Admin-Only Endpoints', () => {
    describe('GET /api/v1/roles', () => {
      it('should allow admin access', async () => {
        const { accessToken } = await createTestUser('admin');
        const response = await request(app)
          .get('/api/v1/roles')
          .set(getAuthHeader(accessToken));

        expect(response.status).toBe(200);
      });

      it('should deny patient access', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .get('/api/v1/roles')
          .set(getAuthHeader(accessToken));

        expect(response.status).toBe(403);
      });

      it('should deny provider access', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .get('/api/v1/roles')
          .set(getAuthHeader(accessToken));

        expect(response.status).toBe(403);
      });

      it('should deny unauthenticated access', async () => {
        const response = await request(app).get('/api/v1/roles');
        expect(response.status).toBe(401);
      });
    });

    describe('GET /api/v1/audit/events', () => {
      it('should allow admin access', async () => {
        const { accessToken } = await createTestUser('admin');
        const response = await request(app)
          .get('/api/v1/audit/events')
          .set(getAuthHeader(accessToken));

        expect([200, 404]).toContain(response.status);
      });

      it('should deny patient access', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .get('/api/v1/audit/events')
          .set(getAuthHeader(accessToken));

        expect(response.status).toBe(403);
      });

      it('should deny provider access', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .get('/api/v1/audit/events')
          .set(getAuthHeader(accessToken));

        expect(response.status).toBe(403);
      });
    });

    describe('POST /api/v1/notifications/email', () => {
      it('should allow admin access', async () => {
        const { accessToken } = await createTestUser('admin');
        const response = await request(app)
          .post('/api/v1/notifications/email')
          .set(getAuthHeader(accessToken))
          .send({
            to: 'test@example.com',
            subject: 'Test',
            body: 'Test message',
          });

        expect([200, 201, 400]).toContain(response.status);
      });

      it('should deny patient access', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .post('/api/v1/notifications/email')
          .set(getAuthHeader(accessToken))
          .send({
            to: 'test@example.com',
            subject: 'Test',
            body: 'Test message',
          });

        expect(response.status).toBe(403);
      });

      it('should deny provider access', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .post('/api/v1/notifications/email')
          .set(getAuthHeader(accessToken))
          .send({
            to: 'test@example.com',
            subject: 'Test',
            body: 'Test message',
          });

        expect(response.status).toBe(403);
      });
    });

    describe('POST /api/v1/push/send', () => {
      it('should allow admin access', async () => {
        const { accessToken } = await createTestUser('admin');
        const response = await request(app)
          .post('/api/v1/push/send')
          .set(getAuthHeader(accessToken))
          .send({
            userId: 'test-user-id',
            title: 'Test Notification',
            body: 'Test message',
          });

        expect([200, 201, 400, 404]).toContain(response.status);
      });

      it('should deny patient access', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .post('/api/v1/push/send')
          .set(getAuthHeader(accessToken))
          .send({
            userId: 'test-user-id',
            title: 'Test',
            body: 'Test',
          });

        expect(response.status).toBe(403);
      });

      it('should deny provider access', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .post('/api/v1/push/send')
          .set(getAuthHeader(accessToken))
          .send({
            userId: 'test-user-id',
            title: 'Test',
            body: 'Test',
          });

        expect(response.status).toBe(403);
      });
    });
  });

  describe('Provider and Admin Endpoints', () => {
    describe('POST /api/v1/encounters', () => {
      it('should allow provider access', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .post('/api/v1/encounters')
          .set(getAuthHeader(accessToken))
          .send({
            patientId: 'test-patient-id',
            type: 'outpatient',
            chiefComplaint: 'Test complaint',
          });

        expect([200, 201, 400, 404]).toContain(response.status);
      });

      it('should allow admin access', async () => {
        const { accessToken } = await createTestUser('admin');
        const response = await request(app)
          .post('/api/v1/encounters')
          .set(getAuthHeader(accessToken))
          .send({
            patientId: 'test-patient-id',
            type: 'outpatient',
            chiefComplaint: 'Test complaint',
          });

        expect([200, 201, 400, 404]).toContain(response.status);
      });

      it('should deny patient access', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .post('/api/v1/encounters')
          .set(getAuthHeader(accessToken))
          .send({
            patientId: 'test-patient-id',
            type: 'outpatient',
            chiefComplaint: 'Test complaint',
          });

        expect(response.status).toBe(403);
      });
    });

    describe('PATCH /api/v1/encounters/:id', () => {
      it('should allow provider access', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .patch('/api/v1/encounters/test-encounter-id')
          .set(getAuthHeader(accessToken))
          .send({
            status: 'in-progress',
          });

        expect([200, 400, 404]).toContain(response.status);
      });

      it('should allow admin access', async () => {
        const { accessToken } = await createTestUser('admin');
        const response = await request(app)
          .patch('/api/v1/encounters/test-encounter-id')
          .set(getAuthHeader(accessToken))
          .send({
            status: 'in-progress',
          });

        expect([200, 400, 404]).toContain(response.status);
      });

      it('should deny patient access', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .patch('/api/v1/encounters/test-encounter-id')
          .set(getAuthHeader(accessToken))
          .send({
            status: 'in-progress',
          });

        expect(response.status).toBe(403);
      });
    });

    describe('POST /api/v1/encounters/:id/notes', () => {
      it('should allow provider to add clinical notes', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .post('/api/v1/encounters/test-id/notes')
          .set(getAuthHeader(accessToken))
          .send({
            content: 'Patient shows improvement',
            noteType: 'progress',
          });

        expect([200, 201, 400, 404]).toContain(response.status);
      });

      it('should allow admin to add clinical notes', async () => {
        const { accessToken } = await createTestUser('admin');
        const response = await request(app)
          .post('/api/v1/encounters/test-id/notes')
          .set(getAuthHeader(accessToken))
          .send({
            content: 'Administrative note',
            noteType: 'admin',
          });

        expect([200, 201, 400, 404]).toContain(response.status);
      });

      it('should deny patient access to add notes', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .post('/api/v1/encounters/test-id/notes')
          .set(getAuthHeader(accessToken))
          .send({
            content: 'Patient note',
            noteType: 'patient',
          });

        expect(response.status).toBe(403);
      });
    });
  });

  describe('Authenticated User Endpoints (All Roles)', () => {
    describe('GET /api/v1/auth/me', () => {
      it('should allow patient access', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .get('/api/v1/auth/me')
          .set(getAuthHeader(accessToken));

        expect(response.status).toBe(200);
      });

      it('should allow provider access', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .get('/api/v1/auth/me')
          .set(getAuthHeader(accessToken));

        expect(response.status).toBe(200);
      });

      it('should allow admin access', async () => {
        const { accessToken } = await createTestUser('admin');
        const response = await request(app)
          .get('/api/v1/auth/me')
          .set(getAuthHeader(accessToken));

        expect(response.status).toBe(200);
      });
    });

    describe('GET /api/v1/dashboard/stats', () => {
      it('should allow patient access', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .get('/api/v1/dashboard/stats')
          .set(getAuthHeader(accessToken));

        expect([200, 404]).toContain(response.status);
      });

      it('should allow provider access', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .get('/api/v1/dashboard/stats')
          .set(getAuthHeader(accessToken));

        expect([200, 404]).toContain(response.status);
      });

      it('should allow admin access', async () => {
        const { accessToken } = await createTestUser('admin');
        const response = await request(app)
          .get('/api/v1/dashboard/stats')
          .set(getAuthHeader(accessToken));

        expect([200, 404]).toContain(response.status);
      });

      it('should deny unauthenticated access', async () => {
        const response = await request(app).get('/api/v1/dashboard/stats');
        expect(response.status).toBe(401);
      });
    });

    describe('POST /api/v1/appointments', () => {
      it('should allow patient to create appointment', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .post('/api/v1/appointments')
          .set(getAuthHeader(accessToken))
          .send({
            providerId: 'test-provider-id',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            type: 'telehealth',
            reason: 'Checkup',
          });

        expect([200, 201, 400, 404]).toContain(response.status);
      });

      it('should allow provider to create appointment', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .post('/api/v1/appointments')
          .set(getAuthHeader(accessToken))
          .send({
            patientId: 'test-patient-id',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            type: 'in-person',
            reason: 'Follow-up',
          });

        expect([200, 201, 400, 404]).toContain(response.status);
      });

      it('should allow admin to create appointment', async () => {
        const { accessToken } = await createTestUser('admin');
        const response = await request(app)
          .post('/api/v1/appointments')
          .set(getAuthHeader(accessToken))
          .send({
            patientId: 'test-patient-id',
            providerId: 'test-provider-id',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            type: 'telehealth',
            reason: 'Consultation',
          });

        expect([200, 201, 400, 404]).toContain(response.status);
      });
    });

    describe('GET /api/v1/documents', () => {
      it('should allow authenticated patient access', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .get('/api/v1/documents')
          .set(getAuthHeader(accessToken));

        expect([200, 404]).toContain(response.status);
      });

      it('should allow authenticated provider access', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .get('/api/v1/documents')
          .set(getAuthHeader(accessToken));

        expect([200, 404]).toContain(response.status);
      });

      it('should deny unauthenticated access', async () => {
        const response = await request(app).get('/api/v1/documents');
        expect(response.status).toBe(401);
      });
    });

    describe('POST /api/v1/consents', () => {
      it('should allow patient to create consent', async () => {
        const { accessToken } = await createTestUser('patient');
        const response = await request(app)
          .post('/api/v1/consents')
          .set(getAuthHeader(accessToken))
          .send({
            type: 'treatment',
            granted: true,
          });

        expect([200, 201, 400, 404]).toContain(response.status);
      });

      it('should allow provider to create consent', async () => {
        const { accessToken } = await createTestUser('provider');
        const response = await request(app)
          .post('/api/v1/consents')
          .set(getAuthHeader(accessToken))
          .send({
            patientId: 'test-patient-id',
            type: 'data-sharing',
            granted: true,
          });

        expect([200, 201, 400, 404]).toContain(response.status);
      });

      it('should deny unauthenticated access', async () => {
        const response = await request(app)
          .post('/api/v1/consents')
          .send({
            type: 'treatment',
            granted: true,
          });

        expect(response.status).toBe(401);
      });
    });
  });

  describe('Public Endpoints (No Authentication Required)', () => {
    describe('POST /api/v1/auth/register', () => {
      it('should allow unauthenticated registration', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `public-reg-${Date.now()}@example.com`,
            password: 'SecurePass123!@#',
            firstName: 'Public',
            lastName: 'User',
          });

        expect(response.status).toBe(201);
      });
    });

    describe('POST /api/v1/auth/login', () => {
      it('should allow unauthenticated login', async () => {
        const { email, password } = await createTestUser();

        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ email, password });

        expect(response.status).toBe(200);
      });
    });

    describe('GET /api/v1/plans', () => {
      it('should allow unauthenticated access to plans', async () => {
        const response = await request(app).get('/api/v1/plans');
        expect([200, 404]).toContain(response.status);
      });
    });

    describe('GET /api/v1/version', () => {
      it('should allow unauthenticated access to version', async () => {
        const response = await request(app).get('/api/v1/version');
        expect(response.status).toBe(200);
      });
    });

    describe('GET /api/v1/config/public', () => {
      it('should allow unauthenticated access to public config', async () => {
        const response = await request(app).get('/api/v1/config/public');
        expect([200, 404]).toContain(response.status);
      });
    });
  });

  describe('Cross-Role Authorization Scenarios', () => {
    it('should prevent patient from accessing provider-created encounter', async () => {
      const { accessToken: providerToken } = await createTestUser('provider');
      const { accessToken: patientToken } = await createTestUser('patient');

      // Provider creates encounter
      const createResponse = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(providerToken))
        .send({
          patientId: 'another-patient-id',
          type: 'outpatient',
          chiefComplaint: 'Test',
        });

      if (createResponse.status === 201) {
        const encounterId = createResponse.body.id;

        // Patient tries to update it
        const updateResponse = await request(app)
          .patch(`/api/v1/encounters/${encounterId}`)
          .set(getAuthHeader(patientToken))
          .send({ status: 'cancelled' });

        expect(updateResponse.status).toBe(403);
      }
    });

    it('should prevent patient from sending notifications', async () => {
      const { accessToken } = await createTestUser('patient');

      const response = await request(app)
        .post('/api/v1/notifications/email')
        .set(getAuthHeader(accessToken))
        .send({
          to: 'victim@example.com',
          subject: 'Phishing',
          body: 'Click here',
        });

      expect(response.status).toBe(403);
    });

    it('should prevent provider from accessing audit logs', async () => {
      const { accessToken } = await createTestUser('provider');

      const response = await request(app)
        .get('/api/v1/audit/events')
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(403);
    });
  });

  describe('Token Validation in Authorization', () => {
    it('should reject expired token even with correct role', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxfQ.invalid';

      const response = await request(app)
        .get('/api/v1/roles')
        .set(getAuthHeader(expiredToken));

      expect(response.status).toBe(401);
    });

    it('should reject malformed token', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/stats')
        .set(getAuthHeader('not-a-valid-token'));

      expect(response.status).toBe(401);
    });

    it('should reject empty bearer token', async () => {
      const response = await request(app)
        .get('/api/v1/dashboard/stats')
        .set({ Authorization: 'Bearer ' });

      expect(response.status).toBe(401);
    });
  });
});
