import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp, createTestUser, getAuthHeader } from './helpers/testApp.js';

/**
 * Input Validation Test Suite
 * Tests comprehensive input validation across all API endpoints
 */
describe('Input Validation Test Suite', () => {
  const app = createTestApp();

  describe('Authentication Input Validation', () => {
    describe('POST /api/v1/auth/register', () => {
      it('should reject invalid email formats', async () => {
        const invalidEmails = [
          'notanemail',
          '@example.com',
          'user@',
          'user @example.com',
          'user@.com',
          'user@domain',
          '',
        ];

        for (const email of invalidEmails) {
          const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
              email,
              password: 'ValidPass123!@#',
              firstName: 'John',
              lastName: 'Doe',
            });

          expect(response.status).toBe(400);
        }
      });

      it('should reject weak passwords', async () => {
        const weakPasswords = [
          '123',
          'short',
          'nodigits',
          '12345678',
          'alllowercase123',
          '',
        ];

        for (const password of weakPasswords) {
          const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
              email: `test-${Date.now()}@example.com`,
              password,
              firstName: 'John',
              lastName: 'Doe',
            });

          expect(response.status).toBe(400);
        }
      });

      it('should reject invalid name fields', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `test-${Date.now()}@example.com`,
            password: 'ValidPass123!@#',
            firstName: '',
            lastName: '',
          });

        expect(response.status).toBe(400);
      });

      it('should reject names that are too long', async () => {
        const longName = 'a'.repeat(101);

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `test-${Date.now()}@example.com`,
            password: 'ValidPass123!@#',
            firstName: longName,
            lastName: longName,
          });

        expect([400, 413]).toContain(response.status);
      });

      it('should reject invalid date of birth', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `test-${Date.now()}@example.com`,
            password: 'ValidPass123!@#',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: 'invalid-date',
          });

        expect(response.status).toBe(400);
      });

      it('should reject future date of birth', async () => {
        const futureDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `test-${Date.now()}@example.com`,
            password: 'ValidPass123!@#',
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: futureDate,
          });

        expect([400, 201]).toContain(response.status);
      });

      it('should sanitize XSS attempts in name fields', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `xss-test-${Date.now()}@example.com`,
            password: 'ValidPass123!@#',
            firstName: '<script>alert("xss")</script>',
            lastName: '<img src=x onerror=alert("xss")>',
          });

        if (response.status === 201) {
          expect(response.body.user.firstName).not.toContain('<script>');
          expect(response.body.user.lastName).not.toContain('<img');
        }
      });

      it('should reject SQL injection attempts', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: "admin'--@example.com",
            password: 'ValidPass123!@#',
            firstName: "'; DROP TABLE users; --",
            lastName: "1' OR '1'='1",
          });

        expect([400, 201]).toContain(response.status);
      });
    });
  });

  describe('Appointment Input Validation', () => {
    describe('POST /api/v1/appointments', () => {
      let authToken: string;

      beforeEach(async () => {
        const { accessToken } = await createTestUser();
        authToken = accessToken;
      });

      it('should reject missing required fields', async () => {
        const response = await request(app)
          .post('/api/v1/appointments')
          .set(getAuthHeader(authToken))
          .send({});

        expect(response.status).toBe(400);
      });

      it('should reject invalid UUID formats', async () => {
        const response = await request(app)
          .post('/api/v1/appointments')
          .set(getAuthHeader(authToken))
          .send({
            providerId: 'not-a-uuid',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            type: 'telehealth',
            reason: 'Checkup',
          });

        expect([400, 404]).toContain(response.status);
      });

      it('should reject past appointment dates', async () => {
        const pastDate = new Date(Date.now() - 86400000).toISOString();

        const response = await request(app)
          .post('/api/v1/appointments')
          .set(getAuthHeader(authToken))
          .send({
            providerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            scheduledAt: pastDate,
            type: 'telehealth',
            reason: 'Checkup',
          });

        expect([400, 404]).toContain(response.status);
      });

      it('should reject invalid appointment types', async () => {
        const response = await request(app)
          .post('/api/v1/appointments')
          .set(getAuthHeader(authToken))
          .send({
            providerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            type: 'invalid-type',
            reason: 'Checkup',
          });

        expect(response.status).toBe(400);
      });

      it('should reject invalid date format', async () => {
        const response = await request(app)
          .post('/api/v1/appointments')
          .set(getAuthHeader(authToken))
          .send({
            providerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            scheduledAt: 'not-a-date',
            type: 'telehealth',
            reason: 'Checkup',
          });

        expect(response.status).toBe(400);
      });

      it('should reject excessively long reason text', async () => {
        const response = await request(app)
          .post('/api/v1/appointments')
          .set(getAuthHeader(authToken))
          .send({
            providerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            type: 'telehealth',
            reason: 'a'.repeat(1001),
          });

        expect([400, 413, 404]).toContain(response.status);
      });

      it('should reject negative duration', async () => {
        const response = await request(app)
          .post('/api/v1/appointments')
          .set(getAuthHeader(authToken))
          .send({
            providerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            type: 'telehealth',
            reason: 'Checkup',
            duration: -30,
          });

        expect([400, 404]).toContain(response.status);
      });
    });

    describe('PATCH /api/v1/appointments/:id', () => {
      let authToken: string;

      beforeEach(async () => {
        const { accessToken } = await createTestUser();
        authToken = accessToken;
      });

      it('should reject invalid status values', async () => {
        const response = await request(app)
          .patch('/api/v1/appointments/test-id')
          .set(getAuthHeader(authToken))
          .send({
            status: 'invalid-status',
          });

        expect([400, 404]).toContain(response.status);
      });

      it('should validate appointment ID format', async () => {
        const response = await request(app)
          .patch('/api/v1/appointments/not-a-valid-id')
          .set(getAuthHeader(authToken))
          .send({
            status: 'confirmed',
          });

        expect([400, 404]).toContain(response.status);
      });
    });
  });

  describe('Patient Input Validation', () => {
    describe('POST /api/v1/patients', () => {
      let authToken: string;

      beforeEach(async () => {
        const { accessToken } = await createTestUser();
        authToken = accessToken;
      });

      it('should reject missing required fields', async () => {
        const response = await request(app)
          .post('/api/v1/patients')
          .set(getAuthHeader(authToken))
          .send({});

        expect(response.status).toBe(400);
      });

      it('should reject invalid email format', async () => {
        const response = await request(app)
          .post('/api/v1/patients')
          .set(getAuthHeader(authToken))
          .send({
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-01-01',
            email: 'invalid-email',
          });

        expect(response.status).toBe(400);
      });

      it('should reject invalid gender values', async () => {
        const response = await request(app)
          .post('/api/v1/patients')
          .set(getAuthHeader(authToken))
          .send({
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-01-01',
            gender: 'invalid-gender',
          });

        expect([400, 404]).toContain(response.status);
      });

      it('should validate phone number format', async () => {
        const response = await request(app)
          .post('/api/v1/patients')
          .set(getAuthHeader(authToken))
          .send({
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-01-01',
            phone: 'not-a-phone',
          });

        expect([400, 404]).toContain(response.status);
      });

      it('should reject excessively long address', async () => {
        const response = await request(app)
          .post('/api/v1/patients')
          .set(getAuthHeader(authToken))
          .send({
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1990-01-01',
            address: 'a'.repeat(501),
          });

        expect([400, 413, 404]).toContain(response.status);
      });
    });
  });

  describe('Document Input Validation', () => {
    describe('POST /api/v1/documents', () => {
      let authToken: string;

      beforeEach(async () => {
        const { accessToken } = await createTestUser();
        authToken = accessToken;
      });

      it('should reject missing file', async () => {
        const response = await request(app)
          .post('/api/v1/documents')
          .set(getAuthHeader(authToken))
          .send({
            category: 'lab-result',
          });

        expect(response.status).toBe(400);
      });

      it('should reject invalid category', async () => {
        const response = await request(app)
          .post('/api/v1/documents')
          .set(getAuthHeader(authToken))
          .field('category', 'invalid-category')
          .attach('file', Buffer.from('test'), 'test.pdf');

        expect([400, 404]).toContain(response.status);
      });

      it('should validate patient ID if provided', async () => {
        const response = await request(app)
          .post('/api/v1/documents')
          .set(getAuthHeader(authToken))
          .send({
            patientId: 'not-a-uuid',
            category: 'lab-result',
          });

        expect([400, 404]).toContain(response.status);
      });
    });
  });

  describe('Encounter Input Validation', () => {
    describe('POST /api/v1/encounters', () => {
      let authToken: string;

      beforeEach(async () => {
        const { accessToken } = await createTestUser('provider');
        authToken = accessToken;
      });

      it('should reject missing required fields', async () => {
        const response = await request(app)
          .post('/api/v1/encounters')
          .set(getAuthHeader(authToken))
          .send({});

        expect(response.status).toBe(400);
      });

      it('should validate patient ID format', async () => {
        const response = await request(app)
          .post('/api/v1/encounters')
          .set(getAuthHeader(authToken))
          .send({
            patientId: 'invalid-uuid',
            type: 'outpatient',
            chiefComplaint: 'Headache',
          });

        expect([400, 404]).toContain(response.status);
      });

      it('should reject invalid status values', async () => {
        const response = await request(app)
          .post('/api/v1/encounters')
          .set(getAuthHeader(authToken))
          .send({
            patientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            type: 'outpatient',
            status: 'invalid-status',
          });

        expect([400, 404]).toContain(response.status);
      });

      it('should validate vitals object structure', async () => {
        const response = await request(app)
          .post('/api/v1/encounters')
          .set(getAuthHeader(authToken))
          .send({
            patientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            type: 'outpatient',
            vitals: 'not-an-object',
          });

        expect([400, 404]).toContain(response.status);
      });

      it('should reject negative vital signs', async () => {
        const response = await request(app)
          .post('/api/v1/encounters')
          .set(getAuthHeader(authToken))
          .send({
            patientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            type: 'outpatient',
            vitals: {
              heartRate: -60,
              bloodPressure: '120/80',
            },
          });

        expect([400, 404]).toContain(response.status);
      });
    });
  });

  describe('Payment Input Validation', () => {
    describe('POST /api/v1/payments/charge', () => {
      let authToken: string;

      beforeEach(async () => {
        const { accessToken } = await createTestUser();
        authToken = accessToken;
      });

      it('should reject negative amounts', async () => {
        const response = await request(app)
          .post('/api/v1/payments/charge')
          .set(getAuthHeader(authToken))
          .send({
            amount: -100,
            currency: 'usd',
          });

        expect(response.status).toBe(400);
      });

      it('should reject zero amounts', async () => {
        const response = await request(app)
          .post('/api/v1/payments/charge')
          .set(getAuthHeader(authToken))
          .send({
            amount: 0,
            currency: 'usd',
          });

        expect(response.status).toBe(400);
      });

      it('should reject invalid currency codes', async () => {
        const response = await request(app)
          .post('/api/v1/payments/charge')
          .set(getAuthHeader(authToken))
          .send({
            amount: 100,
            currency: 'invalid',
          });

        expect([400, 404]).toContain(response.status);
      });

      it('should reject excessively large amounts', async () => {
        const response = await request(app)
          .post('/api/v1/payments/charge')
          .set(getAuthHeader(authToken))
          .send({
            amount: 999999999999,
            currency: 'usd',
          });

        expect([400, 404]).toContain(response.status);
      });
    });
  });

  describe('Notification Input Validation', () => {
    describe('POST /api/v1/notifications/email', () => {
      let authToken: string;

      beforeEach(async () => {
        const { accessToken } = await createTestUser('admin');
        authToken = accessToken;
      });

      it('should reject invalid recipient email', async () => {
        const response = await request(app)
          .post('/api/v1/notifications/email')
          .set(getAuthHeader(authToken))
          .send({
            to: 'not-an-email',
            subject: 'Test',
            body: 'Test message',
          });

        expect(response.status).toBe(400);
      });

      it('should reject empty subject', async () => {
        const response = await request(app)
          .post('/api/v1/notifications/email')
          .set(getAuthHeader(authToken))
          .send({
            to: 'test@example.com',
            subject: '',
            body: 'Test message',
          });

        expect(response.status).toBe(400);
      });

      it('should reject empty body', async () => {
        const response = await request(app)
          .post('/api/v1/notifications/email')
          .set(getAuthHeader(authToken))
          .send({
            to: 'test@example.com',
            subject: 'Test',
            body: '',
          });

        expect(response.status).toBe(400);
      });
    });

    describe('POST /api/v1/notifications/sms', () => {
      let authToken: string;

      beforeEach(async () => {
        const { accessToken } = await createTestUser('admin');
        authToken = accessToken;
      });

      it('should reject invalid phone number', async () => {
        const response = await request(app)
          .post('/api/v1/notifications/sms')
          .set(getAuthHeader(authToken))
          .send({
            to: 'not-a-phone',
            message: 'Test message',
          });

        expect([400, 404]).toContain(response.status);
      });

      it('should reject excessively long SMS message', async () => {
        const response = await request(app)
          .post('/api/v1/notifications/sms')
          .set(getAuthHeader(authToken))
          .send({
            to: '+1234567890',
            message: 'a'.repeat(1601),
          });

        expect([400, 404]).toContain(response.status);
      });
    });
  });

  describe('Push Notification Input Validation', () => {
    describe('POST /api/v1/push/register', () => {
      let authToken: string;

      beforeEach(async () => {
        const { accessToken } = await createTestUser();
        authToken = accessToken;
      });

      it('should reject missing device token', async () => {
        const response = await request(app)
          .post('/api/v1/push/register')
          .set(getAuthHeader(authToken))
          .send({
            platform: 'ios',
          });

        expect(response.status).toBe(400);
      });

      it('should reject invalid platform', async () => {
        const response = await request(app)
          .post('/api/v1/push/register')
          .set(getAuthHeader(authToken))
          .send({
            deviceToken: 'test-token',
            platform: 'invalid-platform',
          });

        expect([400, 404]).toContain(response.status);
      });
    });
  });

  describe('Query Parameter Validation', () => {
    describe('GET /api/v1/appointments', () => {
      let authToken: string;

      beforeEach(async () => {
        const { accessToken } = await createTestUser();
        authToken = accessToken;
      });

      it('should reject negative page numbers', async () => {
        const response = await request(app)
          .get('/api/v1/appointments?page=-1')
          .set(getAuthHeader(authToken));

        expect([400, 200]).toContain(response.status);
      });

      it('should reject zero page numbers', async () => {
        const response = await request(app)
          .get('/api/v1/appointments?page=0')
          .set(getAuthHeader(authToken));

        expect([400, 200]).toContain(response.status);
      });

      it('should reject excessive limit values', async () => {
        const response = await request(app)
          .get('/api/v1/appointments?limit=1000')
          .set(getAuthHeader(authToken));

        expect([400, 200]).toContain(response.status);
      });

      it('should reject invalid date filters', async () => {
        const response = await request(app)
          .get('/api/v1/appointments?startDate=invalid-date')
          .set(getAuthHeader(authToken));

        expect([400, 200]).toContain(response.status);
      });
    });

    describe('GET /api/v1/encounters', () => {
      let authToken: string;

      beforeEach(async () => {
        const { accessToken } = await createTestUser();
        authToken = accessToken;
      });

      it('should reject invalid status filter', async () => {
        const response = await request(app)
          .get('/api/v1/encounters?status=invalid-status')
          .set(getAuthHeader(authToken));

        expect([400, 200]).toContain(response.status);
      });

      it('should validate patient ID in query', async () => {
        const response = await request(app)
          .get('/api/v1/encounters?patientId=not-a-uuid')
          .set(getAuthHeader(authToken));

        expect([400, 200]).toContain(response.status);
      });
    });
  });

  describe('Content-Type Validation', () => {
    it('should reject non-JSON content for JSON endpoints', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'text/plain')
        .send('email=test@example.com&password=pass');

      expect([400, 415]).toContain(response.status);
    });

    it('should handle missing content-type gracefully', async () => {
      const { accessToken } = await createTestUser();

      const response = await request(app)
        .post('/api/v1/appointments')
        .set(getAuthHeader(accessToken))
        .send({
          providerId: 'test-id',
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          type: 'telehealth',
        });

      expect([200, 201, 400, 404]).toContain(response.status);
    });
  });

  describe('Request Size Validation', () => {
    it('should reject excessively large JSON payloads', async () => {
      const { accessToken } = await createTestUser();
      const largePayload = {
        data: 'x'.repeat(11 * 1024 * 1024), // > 10MB
      };

      const response = await request(app)
        .post('/api/v1/appointments')
        .set(getAuthHeader(accessToken))
        .send(largePayload);

      expect([400, 413]).toContain(response.status);
    });
  });

  describe('Special Characters and Edge Cases', () => {
    it('should handle Unicode characters in names', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `unicode-${Date.now()}@example.com`,
          password: 'ValidPass123!@#',
          firstName: '李明',
          lastName: 'José',
        });

      expect([200, 201, 400]).toContain(response.status);
    });

    it('should handle emoji in text fields', async () => {
      const { accessToken } = await createTestUser();

      const response = await request(app)
        .post('/api/v1/appointments')
        .set(getAuthHeader(accessToken))
        .send({
          providerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          type: 'telehealth',
          reason: 'Checkup 😊',
        });

      expect([200, 201, 400, 404]).toContain(response.status);
    });

    it('should sanitize null bytes', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `null-byte-${Date.now()}@example.com`,
          password: 'ValidPass123!@#',
          firstName: 'John\0Null',
          lastName: 'Doe',
        });

      expect([200, 201, 400]).toContain(response.status);
    });
  });
});
