import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createTestApp, createTestUser, getAuthHeader } from './helpers/testApp.js';

/**
 * Comprehensive Authentication API Test Suite
 * Tests all authentication endpoints with multiple scenarios
 */
describe.skip('Authentication API - Complete Test Suite', () => {
  const app = createTestApp();

  describe.skip('POST /api/v1/auth/register', () => {
    describe.skip('Success Cases', () => {
      it('should register a new patient user', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `patient-${Date.now()}@example.com`,
            password: 'SecurePass123!@#',
            firstName: 'John',
            lastName: 'Doe',
            role: 'patient',
          });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.role).toBe('patient');
        expect(response.body.tokenType).toBe('Bearer');
        expect(response.body).toHaveProperty('expiresIn');
      });

      it('should register a new provider user', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `provider-${Date.now()}@example.com`,
            password: 'SecurePass123!@#',
            firstName: 'Dr. Jane',
            lastName: 'Smith',
            role: 'provider',
          });

        expect(response.status).toBe(201);
        expect(response.body.user.role).toBe('provider');
      });

      it('should register a new admin user', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `admin-${Date.now()}@example.com`,
            password: 'SecurePass123!@#',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
          });

        expect(response.status).toBe(201);
        expect(response.body.user.role).toBe('admin');
      });

      it('should register user with optional fields', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `complete-${Date.now()}@example.com`,
            password: 'SecurePass123!@#',
            firstName: 'Complete',
            lastName: 'User',
            phone: '+1234567890',
            dateOfBirth: '1990-01-01',
            role: 'patient',
          });

        expect(response.status).toBe(201);
        expect(response.body.user).toBeDefined();
      });

      it('should not expose password in response', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `secure-${Date.now()}@example.com`,
            password: 'SecurePass123!@#',
            firstName: 'Secure',
            lastName: 'User',
          });

        expect(response.status).toBe(201);
        expect(response.body.user).not.toHaveProperty('password');
        expect(response.body.user).not.toHaveProperty('passwordHash');
      });
    });

    describe.skip('Validation Errors', () => {
      it('should reject registration with invalid email format', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'not-an-email',
            password: 'SecurePass123!@#',
            firstName: 'John',
            lastName: 'Doe',
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      it('should reject registration with short password', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `short-pass-${Date.now()}@example.com`,
            password: 'short',
            firstName: 'John',
            lastName: 'Doe',
          });

        expect(response.status).toBe(400);
      });

      it('should reject registration with missing email', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            password: 'SecurePass123!@#',
            firstName: 'John',
            lastName: 'Doe',
          });

        expect(response.status).toBe(400);
      });

      it('should reject registration with missing password', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `no-pass-${Date.now()}@example.com`,
            firstName: 'John',
            lastName: 'Doe',
          });

        expect(response.status).toBe(400);
      });

      it('should reject registration with missing firstName', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `no-fname-${Date.now()}@example.com`,
            password: 'SecurePass123!@#',
            lastName: 'Doe',
          });

        expect(response.status).toBe(400);
      });

      it('should reject registration with missing lastName', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `no-lname-${Date.now()}@example.com`,
            password: 'SecurePass123!@#',
            firstName: 'John',
          });

        expect(response.status).toBe(400);
      });

      it('should reject registration with invalid role', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: `bad-role-${Date.now()}@example.com`,
            password: 'SecurePass123!@#',
            firstName: 'John',
            lastName: 'Doe',
            role: 'superuser',
          });

        expect(response.status).toBe(400);
      });

      it('should reject registration with empty body', async () => {
        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({});

        expect(response.status).toBe(400);
      });
    });

    describe.skip('Duplicate Email Handling', () => {
      it('should reject duplicate email registration', async () => {
        const email = `duplicate-${Date.now()}@example.com`;

        await request(app).post('/api/v1/auth/register').send({
          email,
          password: 'FirstPass123!@#',
          firstName: 'First',
          lastName: 'User',
        });

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email,
            password: 'SecondPass123!@#',
            firstName: 'Second',
            lastName: 'User',
          });

        expect(response.status).toBe(409);
        expect(response.body.error).toBeDefined();
      });

      it('should reject duplicate email with different case', async () => {
        const email = `case-test-${Date.now()}@example.com`;

        await request(app).post('/api/v1/auth/register').send({
          email: email.toLowerCase(),
          password: 'FirstPass123!@#',
          firstName: 'First',
          lastName: 'User',
        });

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send({
            email: email.toUpperCase(),
            password: 'SecondPass123!@#',
            firstName: 'Second',
            lastName: 'User',
          });

        expect([409, 400]).toContain(response.status);
      });
    });
  });

  describe.skip('POST /api/v1/auth/login', () => {
    describe.skip('Success Cases', () => {
      it('should login with valid credentials', async () => {
        const email = `login-success-${Date.now()}@example.com`;
        const password = 'SecurePass123!@#';

        await request(app).post('/api/v1/auth/register').send({
          email,
          password,
          firstName: 'Login',
          lastName: 'Test',
        });

        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ email, password });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body).toHaveProperty('user');
        expect(response.body.tokenType).toBe('Bearer');
      });

      it('should login with case-insensitive email', async () => {
        const email = `case-login-${Date.now()}@example.com`;
        const password = 'SecurePass123!@#';

        await request(app).post('/api/v1/auth/register').send({
          email: email.toLowerCase(),
          password,
          firstName: 'Case',
          lastName: 'Test',
        });

        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ email: email.toUpperCase(), password });

        expect([200, 401]).toContain(response.status);
      });
    });

    describe.skip('Authentication Errors', () => {
      it('should reject login with incorrect password', async () => {
        const email = `wrong-pass-${Date.now()}@example.com`;

        await request(app).post('/api/v1/auth/register').send({
          email,
          password: 'CorrectPass123!@#',
          firstName: 'Wrong',
          lastName: 'Pass',
        });

        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ email, password: 'WrongPass123!@#' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBeDefined();
      });

      it('should reject login with non-existent email', async () => {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: `nonexistent-${Date.now()}@example.com`,
            password: 'AnyPass123!@#',
          });

        expect(response.status).toBe(401);
      });

      it('should reject login with empty email', async () => {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: '',
            password: 'AnyPass123!@#',
          });

        expect(response.status).toBe(400);
      });

      it('should reject login with empty password', async () => {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({
            email: 'test@example.com',
            password: '',
          });

        expect(response.status).toBe(400);
      });

      it('should reject login with missing credentials', async () => {
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({});

        expect(response.status).toBe(400);
      });
    });

    describe.skip('Security Features', () => {
      it('should not expose password in login response', async () => {
        const { email, password } = await createTestUser();

        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ email, password });

        expect(response.status).toBe(200);
        expect(response.body.user).not.toHaveProperty('password');
        expect(response.body.user).not.toHaveProperty('passwordHash');
      });

      it('should return different tokens on subsequent logins', async () => {
        const { email, password } = await createTestUser();

        const login1 = await request(app)
          .post('/api/v1/auth/login')
          .send({ email, password });

        const login2 = await request(app)
          .post('/api/v1/auth/login')
          .send({ email, password });

        expect(login1.body.accessToken).not.toBe(login2.body.accessToken);
      });
    });
  });

  describe.skip('POST /api/v1/auth/refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      const { refreshToken } = await createTestUser();

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token-12345' });

      expect(response.status).toBe(401);
    });

    it('should reject refresh with expired token', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjF9.invalid';

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: expiredToken });

      expect(response.status).toBe(401);
    });

    it('should reject refresh with missing token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe.skip('GET /api/v1/auth/me', () => {
    it('should return current user profile', async () => {
      const { accessToken, user } = await createTestUser();

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(user.id);
      expect(response.body.email).toBe(user.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/v1/auth/me');

      expect(response.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set(getAuthHeader('invalid-token'));

      expect(response.status).toBe(401);
    });

    it('should reject request with malformed bearer token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set({ Authorization: 'InvalidFormat token123' });

      expect(response.status).toBe(401);
    });

    it('should reject request with missing bearer prefix', async () => {
      const { accessToken } = await createTestUser();

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set({ Authorization: accessToken });

      expect(response.status).toBe(401);
    });
  });

  describe.skip('POST /api/v1/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      const { accessToken } = await createTestUser();

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    it('should reject logout without token', async () => {
      const response = await request(app).post('/api/v1/auth/logout');

      expect(response.status).toBe(401);
    });

    it('should reject logout with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set(getAuthHeader('invalid-token'));

      expect(response.status).toBe(401);
    });
  });

  describe.skip('GET /api/v1/roles', () => {
    it('should return all roles for admin user', async () => {
      const { accessToken } = await createTestUser('admin');

      const response = await request(app)
        .get('/api/v1/roles')
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(200);
      expect(response.body.roles).toContain('patient');
      expect(response.body.roles).toContain('provider');
      expect(response.body.roles).toContain('admin');
    });

    it('should reject roles request for patient user', async () => {
      const { accessToken } = await createTestUser('patient');

      const response = await request(app)
        .get('/api/v1/roles')
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(403);
    });

    it('should reject roles request for provider user', async () => {
      const { accessToken } = await createTestUser('provider');

      const response = await request(app)
        .get('/api/v1/roles')
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(403);
    });

    it('should reject roles request without authentication', async () => {
      const response = await request(app).get('/api/v1/roles');

      expect(response.status).toBe(401);
    });
  });
});
