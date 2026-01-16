import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createTestApp, createTestUser, getAuthHeader } from './helpers/testApp.js';

describe('Auth API Integration Tests', () => {
  const app = createTestApp();

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `register-test-${Date.now()}@example.com`,
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe',
          role: 'patient',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.firstName).toBe('John');
      expect(response.body.tokenType).toBe('Bearer');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(400);
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `weak-pass-${Date.now()}@example.com`,
          password: '123',
          firstName: 'John',
          lastName: 'Doe',
        });

      expect(response.status).toBe(400);
    });

    it('should reject duplicate email registration', async () => {
      const email = `duplicate-${Date.now()}@example.com`;

      // First registration
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe',
        });

      // Duplicate registration
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'AnotherPass123!',
          firstName: 'Jane',
          lastName: 'Doe',
        });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const email = `login-${Date.now()}@example.com`;
      const password = 'SecurePass123!';

      // Register first
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email,
          password,
          firstName: 'John',
          lastName: 'Doe',
        });

      // Login
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email, password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should reject login with invalid password', async () => {
      const email = `bad-pass-${Date.now()}@example.com`;

      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email,
          password: 'CorrectPass123!',
          firstName: 'John',
          lastName: 'Doe',
        });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email, password: 'WrongPass123!' });

      expect(response.status).toBe(401);
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'AnyPass123!',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh access token', async () => {
      const { refreshToken } = await createTestUser();

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user info', async () => {
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
      const response = await request(app)
        .get('/api/v1/auth/me');

      expect(response.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set(getAuthHeader('invalid-token'));

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      const { accessToken } = await createTestUser();

      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });

  describe('GET /api/v1/roles', () => {
    it('should return roles for admin', async () => {
      const { accessToken } = await createTestUser('admin');

      const response = await request(app)
        .get('/api/v1/roles')
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(200);
      expect(response.body.roles).toContain('patient');
      expect(response.body.roles).toContain('provider');
      expect(response.body.roles).toContain('admin');
    });

    it('should reject roles request for non-admin', async () => {
      const { accessToken } = await createTestUser('patient');

      const response = await request(app)
        .get('/api/v1/roles')
        .set(getAuthHeader(accessToken));

      expect(response.status).toBe(403);
    });
  });
});
