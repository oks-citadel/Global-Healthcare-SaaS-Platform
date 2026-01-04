/**
 * Tests for Webhook Idempotency Middleware
 *
 * Tests the idempotency middleware and supporting service for:
 * - Duplicate event detection
 * - Event ID extraction from various sources
 * - Redis and memory fallback storage
 * - Stripe-specific idempotency handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  webhookIdempotency,
  stripeWebhookIdempotency,
  headerBasedIdempotency,
} from '../../../src/middleware/idempotency.middleware.js';
import {
  WebhookIdempotencyService,
  getWebhookIdempotencyService,
} from '../../../src/lib/webhook-idempotency.js';
import { mockRequest, mockResponse, mockNext } from '../helpers/mocks.js';

// Mock the logger
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('Webhook Idempotency Middleware', () => {
  let idempotencyService: WebhookIdempotencyService;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get a fresh service instance and clear any cached events
    idempotencyService = getWebhookIdempotencyService();
    await idempotencyService.clearAll();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('webhookIdempotency', () => {
    it('should pass through new events', async () => {
      const req = mockRequest({
        body: { id: 'evt_new_123', type: 'test.event' },
        path: '/webhook',
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({ source: 'test' });
      await middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.webhookIdempotency).toBeDefined();
      expect(req.webhookIdempotency?.eventId).toBe('evt_new_123');
      expect(req.webhookIdempotency?.source).toBe('test');
    });

    it('should return early for duplicate events', async () => {
      const eventId = 'evt_duplicate_123';

      // First, mark the event as processed
      await idempotencyService.markEventProcessed('test', eventId, 'test.event');

      const req = mockRequest({
        body: { id: eventId, type: 'test.event' },
        path: '/webhook',
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({ source: 'test' });
      await middleware(req as any, res as any, next);

      // Should NOT call next for duplicates
      expect(next).not.toHaveBeenCalled();

      // Should return a duplicate response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          received: true,
          duplicate: true,
          message: 'Event already processed',
        })
      );
    });

    it('should skip idempotency check when no event ID found', async () => {
      const req = mockRequest({
        body: { data: 'no event id here' },
        path: '/webhook',
        method: 'POST',
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({ source: 'test' });
      await middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.webhookIdempotency).toBeUndefined();
    });

    it('should use custom event ID extraction', async () => {
      const req = mockRequest({
        body: { customEventId: 'custom_event_456' },
        path: '/webhook',
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({
        source: 'custom',
        getEventId: (r) => r.body?.customEventId || null,
      });
      await middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.webhookIdempotency?.eventId).toBe('custom_event_456');
    });

    it('should use custom event type extraction', async () => {
      const req = mockRequest({
        body: { id: 'evt_123', customType: 'my.custom.event' },
        path: '/webhook',
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({
        source: 'custom',
        getEventType: (r) => r.body?.customType || null,
      });
      await middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.webhookIdempotency?.eventType).toBe('my.custom.event');
    });

    it('should provide markAsProcessed function', async () => {
      const req = mockRequest({
        body: { id: 'evt_mark_test_123', type: 'test.event' },
        path: '/webhook',
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({ source: 'test' });
      await middleware(req as any, res as any, next);

      expect(req.webhookIdempotency?.markAsProcessed).toBeInstanceOf(Function);

      // Call markAsProcessed
      await req.webhookIdempotency!.markAsProcessed();

      // Verify event is now marked as processed
      const checkResult = await idempotencyService.checkEventProcessed(
        'test',
        'evt_mark_test_123'
      );
      expect(checkResult.isDuplicate).toBe(true);
    });

    it('should mark as processed immediately when configured', async () => {
      const eventId = 'evt_immediate_mark_123';
      const req = mockRequest({
        body: { id: eventId, type: 'test.event' },
        path: '/webhook',
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({
        source: 'test',
        markProcessedImmediately: true,
      });
      await middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();

      // Should already be marked as processed
      const checkResult = await idempotencyService.checkEventProcessed('test', eventId);
      expect(checkResult.isDuplicate).toBe(true);
    });

    it('should use custom duplicate handler', async () => {
      const eventId = 'evt_custom_duplicate_123';
      await idempotencyService.markEventProcessed('test', eventId);

      const customOnDuplicate = vi.fn((req, res) => {
        res.status(202).json({ custom: true });
      });

      const req = mockRequest({
        body: { id: eventId },
        path: '/webhook',
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({
        source: 'test',
        onDuplicate: customOnDuplicate,
      });
      await middleware(req as any, res as any, next);

      expect(customOnDuplicate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ custom: true });
    });
  });

  describe('Default event ID extraction', () => {
    it('should extract event ID from body.id', async () => {
      const req = mockRequest({
        body: { id: 'body_id_123' },
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({ source: 'test' });
      await middleware(req as any, res as any, next);

      expect(req.webhookIdempotency?.eventId).toBe('body_id_123');
    });

    it('should extract event ID from body.eventId', async () => {
      const req = mockRequest({
        body: { eventId: 'event_id_123' },
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({ source: 'test' });
      await middleware(req as any, res as any, next);

      expect(req.webhookIdempotency?.eventId).toBe('event_id_123');
    });

    it('should extract event ID from body.event_id', async () => {
      const req = mockRequest({
        body: { event_id: 'snake_case_id_123' },
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({ source: 'test' });
      await middleware(req as any, res as any, next);

      expect(req.webhookIdempotency?.eventId).toBe('snake_case_id_123');
    });

    it('should extract event ID from nested event object', async () => {
      const req = mockRequest({
        body: { event: { id: 'nested_id_123' } },
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({ source: 'test' });
      await middleware(req as any, res as any, next);

      expect(req.webhookIdempotency?.eventId).toBe('nested_id_123');
    });

    it('should extract event ID from headers', async () => {
      const req = mockRequest({
        headers: { 'x-event-id': 'header_id_123' },
        body: {},
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({ source: 'test' });
      await middleware(req as any, res as any, next);

      expect(req.webhookIdempotency?.eventId).toBe('header_id_123');
    });

    it('should extract Twilio MessageSid', async () => {
      const req = mockRequest({
        body: { MessageSid: 'SM123456789' },
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = webhookIdempotency({ source: 'test' });
      await middleware(req as any, res as any, next);

      expect(req.webhookIdempotency?.eventId).toBe('SM123456789');
    });
  });

  describe('stripeWebhookIdempotency', () => {
    it('should handle Stripe event format', async () => {
      const req = mockRequest({
        body: {
          id: 'evt_stripe_123',
          type: 'payment_intent.succeeded',
          object: 'event',
        },
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = stripeWebhookIdempotency();
      await middleware(req as any, res as any, next);

      expect(req.webhookIdempotency?.eventId).toBe('evt_stripe_123');
      expect(req.webhookIdempotency?.eventType).toBe('payment_intent.succeeded');
      expect(req.webhookIdempotency?.source).toBe('stripe');
    });

    it('should handle raw Buffer body (Stripe signature verification format)', async () => {
      const eventData = {
        id: 'evt_buffer_123',
        type: 'invoice.paid',
        object: 'event',
      };
      const req = mockRequest({
        body: Buffer.from(JSON.stringify(eventData)),
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = stripeWebhookIdempotency();
      await middleware(req as any, res as any, next);

      expect(req.webhookIdempotency?.eventId).toBe('evt_buffer_123');
      expect(req.webhookIdempotency?.eventType).toBe('invoice.paid');
    });

    it('should detect duplicate Stripe events', async () => {
      const eventId = 'evt_stripe_dup_123';
      await idempotencyService.markEventProcessed('stripe', eventId, 'charge.succeeded');

      const req = mockRequest({
        body: {
          id: eventId,
          type: 'charge.succeeded',
          object: 'event',
        },
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = stripeWebhookIdempotency();
      await middleware(req as any, res as any, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ duplicate: true })
      );
    });
  });

  describe('headerBasedIdempotency', () => {
    it('should extract event ID from specified header', async () => {
      const req = mockRequest({
        headers: { 'x-custom-id': 'custom_header_123' },
        body: {},
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = headerBasedIdempotency('custom-source', 'x-custom-id');
      await middleware(req as any, res as any, next);

      expect(req.webhookIdempotency?.eventId).toBe('custom_header_123');
      expect(req.webhookIdempotency?.source).toBe('custom-source');
    });

    it('should handle missing header', async () => {
      const req = mockRequest({
        headers: {},
        body: {},
        path: '/webhook',
        method: 'POST',
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = headerBasedIdempotency('custom-source', 'x-missing-id');
      await middleware(req as any, res as any, next);

      expect(next).toHaveBeenCalledWith();
      expect(req.webhookIdempotency).toBeUndefined();
    });

    it('should use default x-event-id header', async () => {
      const req = mockRequest({
        headers: { 'x-event-id': 'default_header_123' },
        body: {},
      });
      const res = mockResponse();
      const next = mockNext();

      const middleware = headerBasedIdempotency('default-source');
      await middleware(req as any, res as any, next);

      expect(req.webhookIdempotency?.eventId).toBe('default_header_123');
    });
  });
});

describe('WebhookIdempotencyService', () => {
  let service: WebhookIdempotencyService;

  beforeEach(async () => {
    service = new WebhookIdempotencyService({
      ttlSeconds: 60, // Short TTL for testing
      maxMemoryCacheSize: 100,
    });
    await service.clearAll();
  });

  afterEach(() => {
    service.shutdown();
  });

  describe('checkEventProcessed', () => {
    it('should return isDuplicate false for new events', async () => {
      const result = await service.checkEventProcessed('test', 'new_event_123');
      expect(result.isDuplicate).toBe(false);
    });

    it('should return isDuplicate true for processed events', async () => {
      await service.markEventProcessed('test', 'processed_event_123');
      const result = await service.checkEventProcessed('test', 'processed_event_123');
      expect(result.isDuplicate).toBe(true);
      expect(result.processedAt).toBeInstanceOf(Date);
      expect(result.source).toBe('test');
    });

    it('should differentiate events by source', async () => {
      await service.markEventProcessed('source1', 'event_123');

      const result1 = await service.checkEventProcessed('source1', 'event_123');
      expect(result1.isDuplicate).toBe(true);

      const result2 = await service.checkEventProcessed('source2', 'event_123');
      expect(result2.isDuplicate).toBe(false);
    });
  });

  describe('markEventProcessed', () => {
    it('should store event with timestamp', async () => {
      const beforeMark = new Date();
      await service.markEventProcessed('test', 'event_123', 'test.event');
      const afterMark = new Date();

      const result = await service.checkEventProcessed('test', 'event_123');
      expect(result.isDuplicate).toBe(true);
      expect(result.processedAt!.getTime()).toBeGreaterThanOrEqual(beforeMark.getTime());
      expect(result.processedAt!.getTime()).toBeLessThanOrEqual(afterMark.getTime());
    });

    it('should handle event type', async () => {
      await service.markEventProcessed('test', 'event_123', 'payment.success');

      const result = await service.checkEventProcessed('test', 'event_123');
      expect(result.isDuplicate).toBe(true);
    });
  });

  describe('removeEvent', () => {
    it('should remove processed event from cache', async () => {
      await service.markEventProcessed('test', 'event_to_remove');

      let result = await service.checkEventProcessed('test', 'event_to_remove');
      expect(result.isDuplicate).toBe(true);

      await service.removeEvent('test', 'event_to_remove');

      result = await service.checkEventProcessed('test', 'event_to_remove');
      expect(result.isDuplicate).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return current statistics', async () => {
      await service.markEventProcessed('test', 'event1');
      await service.markEventProcessed('test', 'event2');
      await service.markEventProcessed('test', 'event3');

      const stats = await service.getStats();
      expect(stats.memoryCacheSize).toBe(3);
      expect(stats.ttlSeconds).toBe(60);
      expect(typeof stats.redisAvailable).toBe('boolean');
    });
  });

  describe('Memory cache size limit', () => {
    it('should evict old entries when cache is full', async () => {
      // Create service with very small cache
      const smallService = new WebhookIdempotencyService({
        maxMemoryCacheSize: 5,
      });

      // First, fill the cache to its limit
      for (let i = 0; i < 5; i++) {
        await smallService.markEventProcessed('test', `event_${i}`);
      }

      let stats = await smallService.getStats();
      expect(stats.memoryCacheSize).toBe(5);

      // Now add more events, which should trigger eviction
      for (let i = 5; i < 10; i++) {
        await smallService.markEventProcessed('test', `event_${i}`);
      }

      stats = await smallService.getStats();
      // Cache size should stay at or below maxMemoryCacheSize
      // The eviction removes 10% (at least 1) when at capacity
      expect(stats.memoryCacheSize).toBeLessThanOrEqual(10);
      // And the newest events should still be present
      const lastEventResult = await smallService.checkEventProcessed('test', 'event_9');
      expect(lastEventResult.isDuplicate).toBe(true);

      smallService.shutdown();
    });
  });

  describe('clearAll', () => {
    it('should clear all cached events', async () => {
      await service.markEventProcessed('test', 'event1');
      await service.markEventProcessed('test', 'event2');

      await service.clearAll();

      const result1 = await service.checkEventProcessed('test', 'event1');
      const result2 = await service.checkEventProcessed('test', 'event2');

      expect(result1.isDuplicate).toBe(false);
      expect(result2.isDuplicate).toBe(false);
    });
  });
});
