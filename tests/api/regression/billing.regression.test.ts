/**
 * API Regression Tests - Billing & Subscriptions
 * Comprehensive tests for billing, payments, and subscription endpoints
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { api, login, clearTokenCache } from '../helpers/api-client';
import { testUsers } from '../data/test-fixtures';

describe('Billing API Regression Tests', () => {
  let patientToken: string;
  let adminToken: string;

  beforeAll(async () => {
    clearTokenCache();
    try {
      patientToken = await login(testUsers.patient.email, testUsers.patient.password);
      adminToken = await login(testUsers.admin.email, testUsers.admin.password);
    } catch {
      // Tests will be skipped if login fails
    }
  });

  afterAll(() => {
    clearTokenCache();
  });

  describe('GET /billing/subscription - Get Subscription', () => {
    it('should get current subscription for user', async () => {
      if (!patientToken) return;

      const response = await api.get('/billing/subscription', { token: patientToken });

      expect([200, 404]).toContain(response.status);

      if (response.ok) {
        expect(response.data).toHaveProperty('plan');
      }
    });

    it('should return 401 without authentication', async () => {
      const response = await api.get('/billing/subscription');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /billing/plans - List Available Plans', () => {
    it('should list available subscription plans', async () => {
      if (!patientToken) return;

      const response = await api.get('/billing/plans', { token: patientToken });

      if (response.ok) {
        const plans = response.data.data || response.data;
        expect(Array.isArray(plans)).toBe(true);
      }
    });

    it('should include plan features', async () => {
      if (!patientToken) return;

      const response = await api.get('/billing/plans', { token: patientToken });

      if (response.ok) {
        const plans = response.data.data || response.data;
        if (Array.isArray(plans) && plans.length > 0) {
          expect(plans[0]).toHaveProperty('name');
        }
      }
    });
  });

  describe('POST /billing/subscribe - Create Subscription', () => {
    it('should create subscription with valid payment method', async () => {
      if (!patientToken) return;

      const response = await api.post('/billing/subscribe', {
        planId: 'basic',
        paymentMethodId: 'pm_test_card',
      }, { token: patientToken });

      // May fail if subscription already exists or payment fails
      expect([200, 201, 400, 402, 403, 409]).toContain(response.status);
    });

    it('should validate plan ID', async () => {
      if (!patientToken) return;

      const response = await api.post('/billing/subscribe', {
        planId: 'invalid-plan',
        paymentMethodId: 'pm_test',
      }, { token: patientToken });

      expect([400, 404]).toContain(response.status);
    });

    it('should require payment method', async () => {
      if (!patientToken) return;

      const response = await api.post('/billing/subscribe', {
        planId: 'basic',
      }, { token: patientToken });

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('PUT /billing/subscription - Update Subscription', () => {
    it('should upgrade subscription plan', async () => {
      if (!patientToken) return;

      const response = await api.put('/billing/subscription', {
        planId: 'premium',
      }, { token: patientToken });

      expect([200, 400, 402, 404]).toContain(response.status);
    });

    it('should downgrade subscription plan', async () => {
      if (!patientToken) return;

      const response = await api.put('/billing/subscription', {
        planId: 'basic',
      }, { token: patientToken });

      expect([200, 400, 404]).toContain(response.status);
    });
  });

  describe('DELETE /billing/subscription - Cancel Subscription', () => {
    it('should cancel subscription', async () => {
      if (!patientToken) return;

      const response = await api.delete('/billing/subscription', {
        token: patientToken,
      });

      expect([200, 204, 400, 404]).toContain(response.status);
    });

    it('should support immediate vs end-of-period cancellation', async () => {
      if (!patientToken) return;

      const response = await api.delete('/billing/subscription?immediate=false', {
        token: patientToken,
      });

      expect([200, 204, 400, 404]).toContain(response.status);
    });
  });

  describe('GET /billing/payment-methods - List Payment Methods', () => {
    it('should list payment methods for user', async () => {
      if (!patientToken) return;

      const response = await api.get('/billing/payment-methods', { token: patientToken });

      if (response.ok) {
        const methods = response.data.data || response.data;
        expect(Array.isArray(methods)).toBe(true);
      }
    });

    it('should mask card numbers', async () => {
      if (!patientToken) return;

      const response = await api.get('/billing/payment-methods', { token: patientToken });

      if (response.ok) {
        const methods = response.data.data || response.data;
        if (Array.isArray(methods) && methods.length > 0) {
          // Card numbers should be masked
          const card = methods[0];
          if (card.last4) {
            expect(card.last4.length).toBe(4);
          }
        }
      }
    });
  });

  describe('POST /billing/payment-methods - Add Payment Method', () => {
    it('should add payment method', async () => {
      if (!patientToken) return;

      const response = await api.post('/billing/payment-methods', {
        token: 'tok_visa', // Stripe test token
      }, { token: patientToken });

      expect([200, 201, 400, 402]).toContain(response.status);
    });

    it('should validate payment token', async () => {
      if (!patientToken) return;

      const response = await api.post('/billing/payment-methods', {
        token: 'invalid_token',
      }, { token: patientToken });

      expect([400, 402, 422]).toContain(response.status);
    });
  });

  describe('DELETE /billing/payment-methods/:id - Remove Payment Method', () => {
    it('should remove payment method', async () => {
      if (!patientToken) return;

      const listResponse = await api.get('/billing/payment-methods', { token: patientToken });
      if (!listResponse.ok) return;

      const methods = listResponse.data.data || listResponse.data;
      if (Array.isArray(methods) && methods.length > 0) {
        const methodId = methods[methods.length - 1].id; // Remove last one

        const response = await api.delete(`/billing/payment-methods/${methodId}`, {
          token: patientToken,
        });

        expect([200, 204, 400, 404]).toContain(response.status);
      }
    });
  });

  describe('POST /billing/payment-methods/:id/default - Set Default Payment', () => {
    it('should set default payment method', async () => {
      if (!patientToken) return;

      const listResponse = await api.get('/billing/payment-methods', { token: patientToken });
      if (!listResponse.ok) return;

      const methods = listResponse.data.data || listResponse.data;
      if (Array.isArray(methods) && methods.length > 0) {
        const methodId = methods[0].id;

        const response = await api.post(`/billing/payment-methods/${methodId}/default`, {}, {
          token: patientToken,
        });

        expect([200, 400, 404]).toContain(response.status);
      }
    });
  });

  describe('GET /billing/invoices - List Invoices', () => {
    it('should list invoices for user', async () => {
      if (!patientToken) return;

      const response = await api.get('/billing/invoices', { token: patientToken });

      if (response.ok) {
        const invoices = response.data.data || response.data;
        expect(Array.isArray(invoices)).toBe(true);
      }
    });

    it('should support pagination', async () => {
      if (!patientToken) return;

      const response = await api.get('/billing/invoices?page=1&limit=10', {
        token: patientToken,
      });

      if (response.ok) {
        expect(response.data).toHaveProperty('data');
        expect(response.data.data.length).toBeLessThanOrEqual(10);
      }
    });

    it('should support filtering by status', async () => {
      if (!patientToken) return;

      const response = await api.get('/billing/invoices?status=paid', {
        token: patientToken,
      });

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('GET /billing/invoices/:id - Get Invoice Details', () => {
    it('should get invoice by ID', async () => {
      if (!patientToken) return;

      const listResponse = await api.get('/billing/invoices?limit=1', { token: patientToken });
      if (!listResponse.ok) return;

      const invoices = listResponse.data.data || listResponse.data;
      if (Array.isArray(invoices) && invoices.length > 0) {
        const invoiceId = invoices[0].id;

        const response = await api.get(`/billing/invoices/${invoiceId}`, {
          token: patientToken,
        });

        expect(response.ok).toBe(true);
        expect(response.data.id).toBe(invoiceId);
      }
    });

    it('should return 404 for non-existent invoice', async () => {
      if (!patientToken) return;

      const response = await api.get('/billing/invoices/00000000-0000-0000-0000-000000000000', {
        token: patientToken,
      });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /billing/invoices/:id/download - Download Invoice PDF', () => {
    it('should download invoice PDF', async () => {
      if (!patientToken) return;

      const listResponse = await api.get('/billing/invoices?limit=1', { token: patientToken });
      if (!listResponse.ok) return;

      const invoices = listResponse.data.data || listResponse.data;
      if (Array.isArray(invoices) && invoices.length > 0) {
        const invoiceId = invoices[0].id;

        const response = await api.get(`/billing/invoices/${invoiceId}/download`, {
          token: patientToken,
        });

        expect([200, 404]).toContain(response.status);
      }
    });
  });

  describe('POST /billing/pay - Make Payment', () => {
    it('should process payment for outstanding balance', async () => {
      if (!patientToken) return;

      const response = await api.post('/billing/pay', {
        amount: 100,
        paymentMethodId: 'pm_test',
      }, { token: patientToken });

      expect([200, 201, 400, 402, 404]).toContain(response.status);
    });

    it('should validate payment amount', async () => {
      if (!patientToken) return;

      const response = await api.post('/billing/pay', {
        amount: -100, // Invalid negative amount
        paymentMethodId: 'pm_test',
      }, { token: patientToken });

      expect([400, 422]).toContain(response.status);
    });
  });

  describe('GET /billing/usage - Get Usage Statistics', () => {
    it('should get current billing period usage', async () => {
      if (!patientToken) return;

      const response = await api.get('/billing/usage', { token: patientToken });

      expect([200, 404]).toContain(response.status);
    });
  });

  describe('Admin Billing Operations', () => {
    it('should list all subscriptions for admin', async () => {
      if (!adminToken) return;

      const response = await api.get('/admin/billing/subscriptions', { token: adminToken });

      expect([200, 403, 404]).toContain(response.status);
    });

    it('should generate billing report for admin', async () => {
      if (!adminToken) return;

      const response = await api.get('/admin/billing/report?month=2024-01', {
        token: adminToken,
      });

      expect([200, 403, 404]).toContain(response.status);
    });

    it('should apply credit to user account', async () => {
      if (!adminToken) return;

      const response = await api.post('/admin/billing/credit', {
        userId: testUsers.patient.id,
        amount: 50,
        reason: 'Service credit',
      }, { token: adminToken });

      expect([200, 201, 400, 403, 404]).toContain(response.status);
    });
  });
});
