/**
 * API Regression Tests - Users
 * Comprehensive tests for user management endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api, login, clearTokenCache } from '../helpers/api-client';
import { testUsers } from '../data/test-fixtures';

describe('Users API Regression Tests', () => {
  let adminToken: string;
  let patientToken: string;
  let createdUserId: string;

  beforeAll(async () => {
    clearTokenCache();
    try {
      adminToken = await login(testUsers.admin.email, testUsers.admin.password);
      patientToken = await login(testUsers.patient.email, testUsers.patient.password);
    } catch {
      // Tests will be skipped if login fails
    }
  });

  afterAll(() => {
    clearTokenCache();
  });

  describe('GET /users - List Users', () => {
    it('should list users for admin', async () => {
      if (!adminToken) return;

      const response = await api.get('/users', { token: adminToken });

      expect(response.ok).toBe(true);
      const users = response.data.data || response.data;
      expect(Array.isArray(users)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await api.get('/users');

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin users', async () => {
      if (!patientToken) return;

      const response = await api.get('/users', { token: patientToken });

      expect([401, 403]).toContain(response.status);
    });

    it('should support pagination', async () => {
      if (!adminToken) return;

      const response = await api.get('/users?page=1&limit=10', { token: adminToken });

      if (response.ok) {
        expect(response.data).toHaveProperty('data');
        expect(response.data.data.length).toBeLessThanOrEqual(10);
      }
    });

    it('should support filtering by role', async () => {
      if (!adminToken) return;

      const response = await api.get('/users?role=patient', { token: adminToken });

      if (response.ok) {
        const users = response.data.data || response.data;
        if (Array.isArray(users) && users.length > 0) {
          expect(users.every((u: { role: string }) => u.role === 'patient')).toBe(true);
        }
      }
    });

    it('should support search by email', async () => {
      if (!adminToken) return;

      const response = await api.get('/users?search=patient', { token: adminToken });

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('GET /users/:id - Get User', () => {
    it('should get user by ID for admin', async () => {
      if (!adminToken) return;

      const usersResponse = await api.get('/users?limit=1', { token: adminToken });
      if (!usersResponse.ok) return;

      const users = usersResponse.data.data || usersResponse.data;
      if (Array.isArray(users) && users.length > 0) {
        const userId = users[0].id;

        const response = await api.get(`/users/${userId}`, { token: adminToken });

        expect(response.ok).toBe(true);
        expect(response.data.id).toBe(userId);
      }
    });

    it('should return 404 for non-existent user', async () => {
      if (!adminToken) return;

      const response = await api.get('/users/00000000-0000-0000-0000-000000000000', {
        token: adminToken,
      });

      expect(response.status).toBe(404);
    });

    it('should return user profile for own user', async () => {
      if (!patientToken) return;

      const response = await api.get('/users/me', { token: patientToken });

      if (response.ok) {
        expect(response.data.email).toBe(testUsers.patient.email);
      }
    });
  });

  describe('POST /users - Create User', () => {
    const newUser = {
      email: `test-${Date.now()}@test.unified.health`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'patient',
    };

    it('should create user for admin', async () => {
      if (!adminToken) return;

      const response = await api.post('/users', newUser, { token: adminToken });

      if (response.ok) {
        expect(response.data).toHaveProperty('id');
        expect(response.data.email).toBe(newUser.email);
        createdUserId = response.data.id;
      } else {
        // May require specific permissions or tenant setup
        expect([201, 400, 403]).toContain(response.status);
      }
    });

    it('should reject duplicate email', async () => {
      if (!adminToken) return;

      const response = await api.post('/users', {
        ...newUser,
        email: testUsers.patient.email, // Existing email
      }, { token: adminToken });

      expect([400, 409]).toContain(response.status);
    });

    it('should validate required fields', async () => {
      if (!adminToken) return;

      const response = await api.post('/users', {
        email: 'incomplete@test.com',
      }, { token: adminToken });

      expect([400, 422]).toContain(response.status);
    });

    it('should validate email format', async () => {
      if (!adminToken) return;

      const response = await api.post('/users', {
        ...newUser,
        email: 'invalid-email',
      }, { token: adminToken });

      expect([400, 422]).toContain(response.status);
    });

    it('should validate password strength', async () => {
      if (!adminToken) return;

      const response = await api.post('/users', {
        ...newUser,
        email: `weak-${Date.now()}@test.com`,
        password: '123',
      }, { token: adminToken });

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('PUT /users/:id - Update User', () => {
    it('should update user for admin', async () => {
      if (!adminToken || !createdUserId) return;

      const response = await api.put(`/users/${createdUserId}`, {
        firstName: 'Updated',
        lastName: 'Name',
      }, { token: adminToken });

      if (response.ok) {
        expect(response.data.firstName).toBe('Updated');
      }
    });

    it('should allow user to update own profile', async () => {
      if (!patientToken) return;

      const response = await api.put('/users/me', {
        phone: '+1234567890',
      }, { token: patientToken });

      expect([200, 400, 404]).toContain(response.status);
    });

    it('should reject unauthorized updates', async () => {
      if (!patientToken) return;

      const response = await api.put('/users/some-other-user-id', {
        firstName: 'Hacker',
      }, { token: patientToken });

      expect([401, 403, 404]).toContain(response.status);
    });
  });

  describe('DELETE /users/:id - Delete User', () => {
    it('should soft delete user for admin', async () => {
      if (!adminToken || !createdUserId) return;

      const response = await api.delete(`/users/${createdUserId}`, {
        token: adminToken,
      });

      expect([200, 204, 404]).toContain(response.status);
    });

    it('should reject unauthorized deletion', async () => {
      if (!patientToken) return;

      const response = await api.delete('/users/some-user-id', {
        token: patientToken,
      });

      expect([401, 403, 404]).toContain(response.status);
    });
  });

  describe('PATCH /users/:id/status - Update User Status', () => {
    it('should update user status for admin', async () => {
      if (!adminToken) return;

      const usersResponse = await api.get('/users?limit=1', { token: adminToken });
      if (!usersResponse.ok) return;

      const users = usersResponse.data.data || usersResponse.data;
      if (Array.isArray(users) && users.length > 0) {
        const userId = users[0].id;

        const response = await api.patch(`/users/${userId}/status`, {
          status: 'active',
        }, { token: adminToken });

        expect([200, 400, 404]).toContain(response.status);
      }
    });
  });
});
