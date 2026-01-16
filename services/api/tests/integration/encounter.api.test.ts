import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp, createTestUser, getAuthHeader } from './helpers/testApp.js';

describe('Encounter API Integration Tests', () => {
  const app = createTestApp();

  describe('POST /api/v1/encounters', () => {
    it('should create an encounter (provider)', async () => {
      const { accessToken, user } = await createTestUser('provider');

      const response = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(accessToken))
        .send({
          patientId: 'patient-123',
          providerId: user.id,
          type: 'virtual',
          reasonForVisit: 'Annual checkup',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('planned');
      expect(response.body.type).toBe('virtual');
    });

    it('should reject encounter creation by patient', async () => {
      const { accessToken } = await createTestUser('patient');

      const response = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(accessToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'virtual',
        });

      expect(response.status).toBe(403);
    });

    it('should allow admin to create encounter', async () => {
      const { accessToken } = await createTestUser('admin');

      const response = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(accessToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'in_person',
        });

      expect(response.status).toBe(201);
    });

    it('should validate encounter type', async () => {
      const { accessToken } = await createTestUser('provider');

      const response = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(accessToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'invalid-type',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/encounters/:id', () => {
    it('should get encounter by ID', async () => {
      const { accessToken } = await createTestUser('provider');

      // Create encounter first
      const createResponse = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(accessToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'virtual',
        });

      const encounterId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/v1/encounters/${encounterId}`)
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(encounterId);
    });

    it('should return 404 for non-existent encounter', async () => {
      const { accessToken } = await createTestUser('provider');

      const response = await request(app)
        .get('/api/v1/encounters/non-existent-id')
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/v1/encounters/:id', () => {
    it('should update encounter status', async () => {
      const { accessToken } = await createTestUser('provider');

      // Create encounter
      const createResponse = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(accessToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'virtual',
        });

      const encounterId = createResponse.body.id;

      // Update status
      const response = await request(app)
        .patch(`/api/v1/encounters/${encounterId}`)
        .set(getAuthHeader(accessToken))
        .send({ status: 'in_progress' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('in_progress');
      expect(response.body.startedAt).not.toBeNull();
    });

    it('should reject invalid status transition', async () => {
      const { accessToken } = await createTestUser('provider');

      const createResponse = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(accessToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'virtual',
        });

      const encounterId = createResponse.body.id;

      // Try to go directly to finished (invalid)
      const response = await request(app)
        .patch(`/api/v1/encounters/${encounterId}`)
        .set(getAuthHeader(accessToken))
        .send({ status: 'finished' });

      expect(response.status).toBe(400);
    });

    it('should reject update by patient', async () => {
      const { accessToken: providerToken } = await createTestUser('provider');
      const { accessToken: patientToken } = await createTestUser('patient');

      const createResponse = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(providerToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'virtual',
        });

      const encounterId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/v1/encounters/${encounterId}`)
        .set(getAuthHeader(patientToken))
        .send({ status: 'in_progress' });

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/v1/encounters/:id/notes', () => {
    it('should add clinical note to encounter', async () => {
      const { accessToken } = await createTestUser('provider');

      const createResponse = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(accessToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'virtual',
        });

      const encounterId = createResponse.body.id;

      const response = await request(app)
        .post(`/api/v1/encounters/${encounterId}/notes`)
        .set(getAuthHeader(accessToken))
        .send({
          noteType: 'progress',
          content: 'Patient reports improvement in symptoms.',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.noteType).toBe('progress');
      expect(response.body.content).toBe('Patient reports improvement in symptoms.');
    });

    it('should reject note from patient', async () => {
      const { accessToken: providerToken } = await createTestUser('provider');
      const { accessToken: patientToken } = await createTestUser('patient');

      const createResponse = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(providerToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'virtual',
        });

      const encounterId = createResponse.body.id;

      const response = await request(app)
        .post(`/api/v1/encounters/${encounterId}/notes`)
        .set(getAuthHeader(patientToken))
        .send({
          noteType: 'progress',
          content: 'Test note',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/v1/encounters/:id/notes', () => {
    it('should get clinical notes for encounter', async () => {
      const { accessToken } = await createTestUser('provider');

      const createResponse = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(accessToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'virtual',
        });

      const encounterId = createResponse.body.id;

      // Add a note
      await request(app)
        .post(`/api/v1/encounters/${encounterId}/notes`)
        .set(getAuthHeader(accessToken))
        .send({
          noteType: 'assessment',
          content: 'Initial assessment complete.',
        });

      const response = await request(app)
        .get(`/api/v1/encounters/${encounterId}/notes`)
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/encounters/:id/start', () => {
    it('should start an encounter', async () => {
      const { accessToken } = await createTestUser('provider');

      const createResponse = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(accessToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'virtual',
        });

      const encounterId = createResponse.body.id;

      const response = await request(app)
        .post(`/api/v1/encounters/${encounterId}/start`)
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('in_progress');
      expect(response.body.startedAt).not.toBeNull();
    });
  });

  describe('POST /api/v1/encounters/:id/end', () => {
    it('should end an encounter', async () => {
      const { accessToken } = await createTestUser('provider');

      const createResponse = await request(app)
        .post('/api/v1/encounters')
        .set(getAuthHeader(accessToken))
        .send({
          patientId: 'patient-123',
          providerId: 'provider-456',
          type: 'virtual',
        });

      const encounterId = createResponse.body.id;

      // Start first
      await request(app)
        .post(`/api/v1/encounters/${encounterId}/start`)
        .set(getAuthHeader(accessToken));

      // End
      const response = await request(app)
        .post(`/api/v1/encounters/${encounterId}/end`)
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('finished');
      expect(response.body.endedAt).not.toBeNull();
    });
  });
});
