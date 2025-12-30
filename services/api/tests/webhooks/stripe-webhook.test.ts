import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import Stripe from 'stripe';
import { app } from '../../src/app.js';
import { prisma } from '../../src/lib/prisma.js';
import { stripe } from '../../src/lib/stripe.js';

/**
 * Stripe Webhook Integration Tests
 *
 * These tests verify that webhook handling works correctly with:
 * - Signature verification
 * - Idempotency handling
 * - Database updates
 * - Notification triggers
 * - Error handling
 * - Retry logic
 */

describe('Stripe Webhook Integration', () => {
  const WEBHOOK_SECRET = 'whsec_test_secret';
  const ENDPOINT = '/webhooks/stripe';

  beforeEach(async () => {
    // Set environment variables
    process.env.STRIPE_WEBHOOK_SECRET = WEBHOOK_SECRET;
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock';

    // Clear database
    await prisma.webhookEventLog.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.subscription.deleteMany();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Webhook Signature Verification', () => {
    it('should reject webhook with invalid signature', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        object: 'event',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test',
            amount: 1000,
            currency: 'usd',
          },
        },
      });

      const response = await request(app)
        .post(ENDPOINT)
        .set('stripe-signature', 'invalid_signature')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid signature');
    });

    it('should reject webhook with missing signature', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        object: 'event',
        type: 'payment_intent.succeeded',
      });

      const response = await request(app)
        .post(ENDPOINT)
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Missing stripe-signature');
    });

    it('should accept webhook with valid signature', async () => {
      const event = {
        id: 'evt_test_webhook',
        object: 'event',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test',
            amount: 1000,
            currency: 'usd',
            metadata: { userId: 'user_123' },
          },
        },
      };

      const payload = JSON.stringify(event);
      const signature = generateTestSignature(payload, WEBHOOK_SECRET);

      // Mock Stripe webhook verification
      vi.spyOn(stripe.webhooks, 'constructEvent').mockReturnValue(event as any);

      const response = await request(app)
        .post(ENDPOINT)
        .set('stripe-signature', signature)
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
    });
  });

  describe('Idempotency Handling', () => {
    it('should process event only once', async () => {
      const event = createMockEvent('payment_intent.succeeded', {
        id: 'pi_test_idempotency',
        amount: 1000,
        currency: 'usd',
        metadata: { userId: 'user_123' },
      });

      const payload = JSON.stringify(event);
      const signature = generateTestSignature(payload, WEBHOOK_SECRET);

      vi.spyOn(stripe.webhooks, 'constructEvent').mockReturnValue(event as any);

      // First request - should succeed
      const response1 = await request(app)
        .post(ENDPOINT)
        .set('stripe-signature', signature)
        .send(payload);

      expect(response1.status).toBe(200);

      // Second request - should detect duplicate
      const response2 = await request(app)
        .post(ENDPOINT)
        .set('stripe-signature', signature)
        .send(payload);

      expect(response2.status).toBe(200);
      expect(response2.body.error).toContain('already processed');

      // Verify only one event log exists
      const logs = await prisma.webhookEventLog.findMany({
        where: { eventId: event.id },
      });
      expect(logs.length).toBe(1);
    });
  });

  describe('Payment Intent Events', () => {
    it('should handle payment_intent.succeeded', async () => {
      // Create test payment
      const payment = await prisma.payment.create({
        data: {
          userId: 'user_123',
          stripePaymentIntentId: 'pi_test_success',
          amount: 10.0,
          currency: 'USD',
          status: 'processing',
        },
      });

      const event = createMockEvent('payment_intent.succeeded', {
        id: 'pi_test_success',
        amount: 1000,
        currency: 'usd',
        status: 'succeeded',
        metadata: { userId: 'user_123' },
      });

      await sendWebhookEvent(event);

      // Verify payment status updated
      const updatedPayment = await prisma.payment.findUnique({
        where: { id: payment.id },
      });
      expect(updatedPayment?.status).toBe('succeeded');

      // Verify event logged
      const log = await prisma.webhookEventLog.findUnique({
        where: { eventId: event.id },
      });
      expect(log?.status).toBe('succeeded');
    });

    it('should handle payment_intent.payment_failed', async () => {
      // Create test payment
      const payment = await prisma.payment.create({
        data: {
          userId: 'user_123',
          stripePaymentIntentId: 'pi_test_failed',
          amount: 10.0,
          currency: 'USD',
          status: 'processing',
        },
      });

      const event = createMockEvent('payment_intent.payment_failed', {
        id: 'pi_test_failed',
        amount: 1000,
        currency: 'usd',
        status: 'requires_payment_method',
        last_payment_error: {
          code: 'card_declined',
          message: 'Your card was declined',
        },
        metadata: { userId: 'user_123' },
      });

      await sendWebhookEvent(event);

      // Verify payment status updated
      const updatedPayment = await prisma.payment.findUnique({
        where: { id: payment.id },
      });
      expect(updatedPayment?.status).toBe('failed');
      expect(updatedPayment?.failedReason).toContain('card was declined');
    });
  });

  describe('Subscription Events', () => {
    it('should handle customer.subscription.created', async () => {
      const event = createMockEvent('customer.subscription.created', {
        id: 'sub_test_created',
        customer: 'cus_test',
        status: 'active',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 2592000, // 30 days
        items: {
          data: [{ price: { id: 'price_test' } }],
        },
        metadata: { userId: 'user_123' },
      });

      await sendWebhookEvent(event);

      // Verify subscription created
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: 'sub_test_created' },
      });
      expect(subscription).toBeDefined();
      expect(subscription?.status).toBe('active');
      expect(subscription?.userId).toBe('user_123');
    });

    it('should handle customer.subscription.updated', async () => {
      // Create test subscription
      await prisma.subscription.create({
        data: {
          userId: 'user_123',
          planId: 'price_test',
          stripeSubscriptionId: 'sub_test_updated',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 2592000000),
        },
      });

      const event = createMockEvent('customer.subscription.updated', {
        id: 'sub_test_updated',
        customer: 'cus_test',
        status: 'past_due',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 2592000,
        items: {
          data: [{ price: { id: 'price_test' } }],
        },
        metadata: { userId: 'user_123' },
      });

      await sendWebhookEvent(event);

      // Verify subscription updated
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: 'sub_test_updated' },
      });
      expect(subscription?.status).toBe('past_due');
    });

    it('should handle customer.subscription.deleted', async () => {
      // Create test subscription
      await prisma.subscription.create({
        data: {
          userId: 'user_123',
          planId: 'price_test',
          stripeSubscriptionId: 'sub_test_deleted',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 2592000000),
        },
      });

      const event = createMockEvent('customer.subscription.deleted', {
        id: 'sub_test_deleted',
        customer: 'cus_test',
        status: 'canceled',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 2592000,
        items: {
          data: [{ price: { id: 'price_test' } }],
        },
        metadata: { userId: 'user_123' },
      });

      await sendWebhookEvent(event);

      // Verify subscription cancelled
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: 'sub_test_deleted' },
      });
      expect(subscription?.status).toBe('cancelled');
    });
  });

  describe('Invoice Events', () => {
    it('should handle invoice.paid', async () => {
      const event = createMockEvent('invoice.paid', {
        id: 'in_test_paid',
        customer: 'cus_test',
        customer_email: 'test@example.com',
        amount_paid: 1000,
        currency: 'usd',
        status: 'paid',
        subscription: 'sub_test',
        created: Math.floor(Date.now() / 1000),
      });

      await sendWebhookEvent(event);

      // Verify event processed
      const log = await prisma.webhookEventLog.findUnique({
        where: { eventId: event.id },
      });
      expect(log?.status).toBe('succeeded');
    });

    it('should handle invoice.payment_failed', async () => {
      // Create test subscription
      await prisma.subscription.create({
        data: {
          userId: 'user_123',
          planId: 'price_test',
          stripeSubscriptionId: 'sub_test_invoice_failed',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 2592000000),
        },
      });

      const event = createMockEvent('invoice.payment_failed', {
        id: 'in_test_failed',
        customer: 'cus_test',
        customer_email: 'test@example.com',
        amount_due: 1000,
        currency: 'usd',
        status: 'open',
        subscription: 'sub_test_invoice_failed',
        attempt_count: 1,
      });

      await sendWebhookEvent(event);

      // Verify subscription status updated to past_due
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: 'sub_test_invoice_failed' },
      });
      expect(subscription?.status).toBe('past_due');
    });
  });

  describe('Charge Events', () => {
    it('should handle charge.refunded', async () => {
      // Create test payment
      const payment = await prisma.payment.create({
        data: {
          userId: 'user_123',
          stripePaymentIntentId: 'pi_test_refund',
          amount: 10.0,
          currency: 'USD',
          status: 'succeeded',
        },
      });

      const event = createMockEvent('charge.refunded', {
        id: 'ch_test_refund',
        payment_intent: 'pi_test_refund',
        amount: 1000,
        amount_refunded: 1000,
        currency: 'usd',
        refunded: true,
        receipt_email: 'test@example.com',
      });

      await sendWebhookEvent(event);

      // Verify payment refunded
      const updatedPayment = await prisma.payment.findUnique({
        where: { id: payment.id },
      });
      expect(updatedPayment?.status).toBe('refunded');
      expect(updatedPayment?.refundedAmount).toBe(10.0);
      expect(updatedPayment?.refundedAt).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should retry failed operations', async () => {
      // Mock database error on first attempt, success on retry
      let attemptCount = 0;
      vi.spyOn(prisma.payment, 'updateMany').mockImplementation(async () => {
        attemptCount++;
        if (attemptCount === 1) {
          throw new Error('Database connection error');
        }
        return { count: 1 };
      });

      const event = createMockEvent('payment_intent.succeeded', {
        id: 'pi_test_retry',
        amount: 1000,
        currency: 'usd',
        metadata: { userId: 'user_123' },
      });

      await sendWebhookEvent(event);

      // Verify retry occurred
      expect(attemptCount).toBeGreaterThan(1);
    });

    it('should log failed events after all retries', async () => {
      // Mock persistent database error
      vi.spyOn(prisma.payment, 'updateMany').mockRejectedValue(
        new Error('Persistent database error')
      );

      const event = createMockEvent('payment_intent.succeeded', {
        id: 'pi_test_fail',
        amount: 1000,
        currency: 'usd',
        metadata: { userId: 'user_123' },
      });

      await sendWebhookEvent(event);

      // Verify event logged as failed
      const log = await prisma.webhookEventLog.findUnique({
        where: { eventId: event.id },
      });
      expect(log?.status).toBe('failed');
      expect(log?.error).toContain('database error');
      expect(log?.retryCount).toBeGreaterThan(0);
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get(`${ENDPOINT}/health`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.configured).toBe(true);
    });
  });
});

// Helper functions

function createMockEvent(type: string, data: any): Stripe.Event {
  return {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    object: 'event',
    type,
    data: {
      object: data,
    },
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    pending_webhooks: 0,
    request: null,
    api_version: '2023-10-16',
  } as any;
}

function generateTestSignature(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  // In real tests, use actual HMAC signing
  return `t=${timestamp},v1=mock_signature`;
}

async function sendWebhookEvent(event: Stripe.Event): Promise<request.Response> {
  const payload = JSON.stringify(event);
  const signature = generateTestSignature(payload, process.env.STRIPE_WEBHOOK_SECRET!);

  vi.spyOn(stripe.webhooks, 'constructEvent').mockReturnValue(event);

  return request(app)
    .post('/webhooks/stripe')
    .set('stripe-signature', signature)
    .send(payload);
}
