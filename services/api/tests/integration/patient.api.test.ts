import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp, createTestUser, getAuthHeader } from './helpers/testApp.js';

describe.skip('Patient API Integration Tests', () => {
  const app = createTestApp();

  describe.skip('POST /api/v1/patients', () => {
    it('should create a patient record', async () => {
      const { accessToken, user } = await createTestUser('patient');

      const response = await request(app)
        .post('/api/v1/patients')
        .set(getAuthHeader(accessToken))
        .send({
          userId: user.id,
          dateOfBirth: '1990-05-15',
          gender: 'male',
          bloodType: 'A+',
          allergies: ['Penicillin'],
          emergencyContact: {
            name: 'Jane Doe',
            phone: '+1234567890',
            relationship: 'spouse',
          },
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('medicalRecordNumber');
      expect(response.body.userId).toBe(user.id);
      expect(response.body.gender).toBe('male');
      expect(response.body.bloodType).toBe('A+');
    });

    it('should reject creating patient for another user (patient role)', async () => {
      const { accessToken } = await createTestUser('patient');

      const response = await request(app)
        .post('/api/v1/patients')
        .set(getAuthHeader(accessToken))
        .send({
          userId: 'different-user-id',
          dateOfBirth: '1990-05-15',
          gender: 'female',
        });

      expect(response.status).toBe(403);
    });

    it('should allow provider to create patient for any user', async () => {
      const { accessToken: providerToken } = await createTestUser('provider');
      const { user: patientUser } = await createTestUser('patient');

      const response = await request(app)
        .post('/api/v1/patients')
        .set(getAuthHeader(providerToken))
        .send({
          userId: patientUser.id,
          dateOfBirth: '1985-08-20',
          gender: 'female',
        });

      expect(response.status).toBe(201);
    });

    it('should validate required fields', async () => {
      const { accessToken, user } = await createTestUser('patient');

      const response = await request(app)
        .post('/api/v1/patients')
        .set(getAuthHeader(accessToken))
        .send({
          userId: user.id,
          // Missing dateOfBirth and gender
        });

      expect(response.status).toBe(400);
    });

    it('should validate gender enum', async () => {
      const { accessToken, user } = await createTestUser('patient');

      const response = await request(app)
        .post('/api/v1/patients')
        .set(getAuthHeader(accessToken))
        .send({
          userId: user.id,
          dateOfBirth: '1990-05-15',
          gender: 'invalid-gender',
        });

      expect(response.status).toBe(400);
    });
  });

  describe.skip('GET /api/v1/patients/:id', () => {
    it('should get patient by ID', async () => {
      const { accessToken, user } = await createTestUser('patient');

      // Create patient first
      const createResponse = await request(app)
        .post('/api/v1/patients')
        .set(getAuthHeader(accessToken))
        .send({
          userId: user.id,
          dateOfBirth: '1990-05-15',
          gender: 'male',
        });

      const patientId = createResponse.body.id;

      // Get patient
      const response = await request(app)
        .get(`/api/v1/patients/${patientId}`)
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(patientId);
    });

    it('should reject access to other patient records (patient role)', async () => {
      // Create first patient
      const { accessToken: token1, user: user1 } = await createTestUser('patient');
      const createResponse = await request(app)
        .post('/api/v1/patients')
        .set(getAuthHeader(token1))
        .send({
          userId: user1.id,
          dateOfBirth: '1990-05-15',
          gender: 'male',
        });

      const patientId = createResponse.body.id;

      // Create second patient and try to access first patient's record
      const { accessToken: token2 } = await createTestUser('patient');

      const response = await request(app)
        .get(`/api/v1/patients/${patientId}`)
        .set(getAuthHeader(token2));

      expect(response.status).toBe(403);
    });

    it('should allow provider to access any patient record', async () => {
      // Create patient
      const { accessToken: patientToken, user: patientUser } = await createTestUser('patient');
      const createResponse = await request(app)
        .post('/api/v1/patients')
        .set(getAuthHeader(patientToken))
        .send({
          userId: patientUser.id,
          dateOfBirth: '1990-05-15',
          gender: 'male',
        });

      const patientId = createResponse.body.id;

      // Provider accesses patient record
      const { accessToken: providerToken } = await createTestUser('provider');

      const response = await request(app)
        .get(`/api/v1/patients/${patientId}`)
        .set(getAuthHeader(providerToken));

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent patient', async () => {
      const { accessToken } = await createTestUser('provider');

      const response = await request(app)
        .get('/api/v1/patients/non-existent-id')
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(404);
    });
  });

  describe.skip('PATCH /api/v1/patients/:id', () => {
    it('should update patient record', async () => {
      const { accessToken, user } = await createTestUser('patient');

      // Create patient first
      const createResponse = await request(app)
        .post('/api/v1/patients')
        .set(getAuthHeader(accessToken))
        .send({
          userId: user.id,
          dateOfBirth: '1990-05-15',
          gender: 'male',
        });

      const patientId = createResponse.body.id;

      // Update patient
      const response = await request(app)
        .patch(`/api/v1/patients/${patientId}`)
        .set(getAuthHeader(accessToken))
        .send({
          bloodType: 'B+',
          allergies: ['Penicillin', 'Sulfa'],
        });

      expect(response.status).toBe(200);
      expect(response.body.bloodType).toBe('B+');
      expect(response.body.allergies).toContain('Sulfa');
    });

    it('should update emergency contact', async () => {
      const { accessToken, user } = await createTestUser('patient');

      const createResponse = await request(app)
        .post('/api/v1/patients')
        .set(getAuthHeader(accessToken))
        .send({
          userId: user.id,
          dateOfBirth: '1990-05-15',
          gender: 'male',
        });

      const patientId = createResponse.body.id;

      const response = await request(app)
        .patch(`/api/v1/patients/${patientId}`)
        .set(getAuthHeader(accessToken))
        .send({
          emergencyContact: {
            name: 'John Smith',
            phone: '+0987654321',
            relationship: 'brother',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body.emergencyContact.name).toBe('John Smith');
    });

    it('should reject update to other patient record (patient role)', async () => {
      // Create first patient
      const { accessToken: token1, user: user1 } = await createTestUser('patient');
      const createResponse = await request(app)
        .post('/api/v1/patients')
        .set(getAuthHeader(token1))
        .send({
          userId: user1.id,
          dateOfBirth: '1990-05-15',
          gender: 'male',
        });

      const patientId = createResponse.body.id;

      // Try to update with different patient's token
      const { accessToken: token2 } = await createTestUser('patient');

      const response = await request(app)
        .patch(`/api/v1/patients/${patientId}`)
        .set(getAuthHeader(token2))
        .send({ bloodType: 'O+' });

      expect(response.status).toBe(403);
    });
  });
});
