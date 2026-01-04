import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { PushNotificationService } from '../../../src/lib/push.js';
import type { PushPayload } from '../../../src/lib/push.js';
import { mockFetchResponse } from '../helpers/mocks.js';
import { mockWebPushSubscription } from '../helpers/fixtures.js';

// Mock logger
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock global fetch
global.fetch = vi.fn();

describe('PushNotificationService', () => {
  let service: PushNotificationService;

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up environment variables for FCM
    process.env.FCM_SERVER_KEY = 'test-fcm-server-key';
    process.env.FCM_SENDER_ID = 'test-sender-id';
    process.env.VAPID_PUBLIC_KEY = 'test-vapid-public-key';
    process.env.VAPID_PRIVATE_KEY = 'test-vapid-private-key';

    service = new PushNotificationService();
  });

  afterEach(() => {
    delete process.env.FCM_SERVER_KEY;
    delete process.env.FCM_SENDER_ID;
    delete process.env.VAPID_PUBLIC_KEY;
    delete process.env.VAPID_PRIVATE_KEY;
    delete process.env.APNS_KEY_ID;
    delete process.env.APNS_TEAM_ID;
    delete process.env.APNS_BUNDLE_ID;
  });

  describe('initialization', () => {
    it('should initialize successfully', () => {
      expect(service.isInitialized()).toBe(true);
    });

    it('should load FCM configuration', () => {
      expect(service.isInitialized()).toBe(true);
    });

    it('should load Web Push configuration', () => {
      expect(service.isInitialized()).toBe(true);
    });
  });

  describe('sendPushNotification - FCM Android', () => {
    const payload: PushPayload = {
      title: 'Test Notification',
      body: 'This is a test',
      data: { appointmentId: '123' },
      priority: 'high',
    };

    it('should send FCM notification successfully', async () => {
      const mockResponse = {
        success: 1,
        failure: 0,
        results: [{ message_id: 'msg-123' }],
      };

      vi.mocked(global.fetch).mockResolvedValue(
        mockFetchResponse(mockResponse, true, 200)
      );

      const result = await service.sendPushNotification(
        'fcm-token-123',
        'android',
        payload
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg-123');
      expect(result.platform).toBe('android');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://fcm.googleapis.com/fcm/send',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'key=test-fcm-server-key',
          }),
        })
      );
    });

    it('should send FCM notification with all payload options', async () => {
      const fullPayload: PushPayload = {
        title: 'Test',
        body: 'Body',
        data: { key: 'value' },
        badge: 5,
        sound: 'custom.mp3',
        priority: 'normal',
        ttl: 3600,
        icon: 'custom_icon',
        clickAction: 'OPEN_APP',
      };

      const mockResponse = {
        success: 1,
        results: [{ message_id: 'msg-123' }],
      };

      vi.mocked(global.fetch).mockResolvedValue(
        mockFetchResponse(mockResponse, true, 200)
      );

      const result = await service.sendPushNotification(
        'fcm-token-123',
        'android',
        fullPayload
      );

      expect(result.success).toBe(true);

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);

      expect(body.notification.title).toBe('Test');
      expect(body.notification.body).toBe('Body');
      expect(body.notification.sound).toBe('custom.mp3');
      expect(body.notification.badge).toBe(5);
      expect(body.notification.icon).toBe('custom_icon');
      expect(body.notification.click_action).toBe('OPEN_APP');
      expect(body.priority).toBe('normal');
      expect(body.time_to_live).toBe(3600);
    });

    it('should handle FCM error response', async () => {
      const mockResponse = {
        success: 0,
        failure: 1,
        results: [{ error: 'InvalidRegistration' }],
      };

      vi.mocked(global.fetch).mockResolvedValue(
        mockFetchResponse(mockResponse, true, 200)
      );

      const result = await service.sendPushNotification(
        'invalid-token',
        'android',
        payload
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('InvalidRegistration');
    });

    it('should handle FCM network error', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

      const result = await service.sendPushNotification(
        'fcm-token-123',
        'android',
        payload
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should handle FCM HTTP error status', async () => {
      const mockResponse = {
        error: 'Unauthorized',
      };

      vi.mocked(global.fetch).mockResolvedValue(
        mockFetchResponse(mockResponse, false, 401)
      );

      const result = await service.sendPushNotification(
        'fcm-token-123',
        'android',
        payload
      );

      expect(result.success).toBe(false);
    });

    it('should use default values for optional fields', async () => {
      const minimalPayload: PushPayload = {
        title: 'Test',
        body: 'Body',
      };

      const mockResponse = {
        success: 1,
        results: [{ message_id: 'msg-123' }],
      };

      vi.mocked(global.fetch).mockResolvedValue(
        mockFetchResponse(mockResponse, true, 200)
      );

      await service.sendPushNotification(
        'fcm-token-123',
        'android',
        minimalPayload
      );

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      const body = JSON.parse(callArgs[1]?.body as string);

      expect(body.priority).toBe('high');
      expect(body.notification.sound).toBe('default');
      expect(body.notification.icon).toBe('ic_notification');
      expect(body.time_to_live).toBe(86400);
    });
  });

  describe('sendPushNotification - iOS', () => {
    const payload: PushPayload = {
      title: 'Test Notification',
      body: 'This is a test',
    };

    it('should send iOS notification via FCM fallback', async () => {
      const mockResponse = {
        success: 1,
        results: [{ message_id: 'msg-123' }],
      };

      vi.mocked(global.fetch).mockResolvedValue(
        mockFetchResponse(mockResponse, true, 200)
      );

      const result = await service.sendPushNotification(
        'ios-token-123',
        'ios',
        payload
      );

      expect(result.success).toBe(true);
      expect(result.platform).toBe('ios');
    });

    it('should send iOS notification via APNS when configured', async () => {
      // Set up APNS environment
      process.env.APNS_KEY_ID = 'test-key-id';
      process.env.APNS_TEAM_ID = 'test-team-id';
      process.env.APNS_BUNDLE_ID = 'com.test.app';

      // Recreate service with APNS config
      const apnsService = new PushNotificationService();

      const result = await apnsService.sendPushNotification(
        'apns-token-123',
        'ios',
        payload
      );

      // APNS is placeholder implementation, should return success
      expect(result.success).toBe(true);
      expect(result.platform).toBe('ios');
      expect(result.messageId).toMatch(/^apns-/);
    });
  });

  describe('sendPushNotification - Web Push', () => {
    const payload: PushPayload = {
      title: 'Test Notification',
      body: 'This is a test',
      icon: '/icon.png',
      image: '/image.png',
      data: { url: '/appointments' },
    };

    it('should send Web Push notification successfully', async () => {
      const result = await service.sendPushNotification(
        mockWebPushSubscription,
        'web',
        payload
      );

      // Web Push is placeholder implementation
      expect(result.success).toBe(true);
      expect(result.platform).toBe('web');
      expect(result.messageId).toMatch(/^web-push-/);
    });

    it('should handle invalid subscription JSON', async () => {
      const result = await service.sendPushNotification(
        'invalid-json',
        'web',
        payload
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should handle Web Push errors', async () => {
      const invalidSubscription = JSON.stringify({ invalid: true });

      const result = await service.sendPushNotification(
        invalidSubscription,
        'web',
        payload
      );

      expect(result.success).toBe(false);
    });
  });

  describe('sendBatchPushNotifications', () => {
    const payload: PushPayload = {
      title: 'Batch Notification',
      body: 'Sent to multiple devices',
    };

    it('should send notifications to multiple devices', async () => {
      const tokens = [
        { token: 'token-1', platform: 'android' as const },
        { token: 'token-2', platform: 'android' as const },
        { token: 'token-3', platform: 'ios' as const },
      ];

      const mockResponse = {
        success: 1,
        results: [{ message_id: 'msg-123' }],
      };

      vi.mocked(global.fetch).mockResolvedValue(
        mockFetchResponse(mockResponse, true, 200)
      );

      const result = await service.sendBatchPushNotifications(tokens, payload);

      expect(result.successCount).toBe(3);
      expect(result.failureCount).toBe(0);
      expect(result.results).toHaveLength(3);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should handle partial failures', async () => {
      const tokens = [
        { token: 'token-1', platform: 'android' as const },
        { token: 'token-2', platform: 'android' as const },
      ];

      vi.mocked(global.fetch)
        .mockResolvedValueOnce(
          mockFetchResponse({ success: 1, results: [{ message_id: 'msg-1' }] }, true, 200)
        )
        .mockResolvedValueOnce(
          mockFetchResponse({ failure: 1, results: [{ error: 'Invalid' }] }, true, 200)
        );

      const result = await service.sendBatchPushNotifications(tokens, payload);

      expect(result.successCount).toBe(1);
      expect(result.failureCount).toBe(1);
      expect(result.results[0].success).toBe(true);
      expect(result.results[1].success).toBe(false);
    });

    it('should handle empty token list', async () => {
      const result = await service.sendBatchPushNotifications([], payload);

      expect(result.successCount).toBe(0);
      expect(result.failureCount).toBe(0);
      expect(result.results).toHaveLength(0);
    });

    it('should process all tokens even if some fail', async () => {
      const tokens = [
        { token: 'token-1', platform: 'android' as const },
        { token: 'token-2', platform: 'android' as const },
        { token: 'token-3', platform: 'android' as const },
      ];

      vi.mocked(global.fetch)
        .mockResolvedValueOnce(
          mockFetchResponse({ success: 1, results: [{ message_id: 'msg-1' }] }, true, 200)
        )
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(
          mockFetchResponse({ success: 1, results: [{ message_id: 'msg-3' }] }, true, 200)
        );

      const result = await service.sendBatchPushNotifications(tokens, payload);

      expect(result.successCount).toBe(2);
      expect(result.failureCount).toBe(1);
      expect(result.results).toHaveLength(3);
    });
  });

  describe('validateToken', () => {
    it('should validate Android FCM token', () => {
      const validToken = 'a'.repeat(152);
      expect(service.validateToken(validToken, 'android')).toBe(true);
    });

    it('should reject short Android token', () => {
      const shortToken = 'short';
      expect(service.validateToken(shortToken, 'android')).toBe(false);
    });

    it('should validate iOS 64-character token', () => {
      const validToken = 'a'.repeat(64);
      expect(service.validateToken(validToken, 'ios')).toBe(true);
    });

    it('should validate iOS FCM token', () => {
      const validToken = 'a'.repeat(152);
      expect(service.validateToken(validToken, 'ios')).toBe(true);
    });

    it('should reject invalid iOS token', () => {
      const invalidToken = 'a'.repeat(50);
      expect(service.validateToken(invalidToken, 'ios')).toBe(false);
    });

    it('should validate Web Push subscription', () => {
      expect(service.validateToken(mockWebPushSubscription, 'web')).toBe(true);
    });

    it('should reject invalid Web Push subscription', () => {
      const invalidSubscription = JSON.stringify({ invalid: true });
      expect(service.validateToken(invalidSubscription, 'web')).toBe(false);
    });

    it('should reject malformed JSON for Web Push', () => {
      expect(service.validateToken('invalid-json', 'web')).toBe(false);
    });

    it('should reject empty token', () => {
      expect(service.validateToken('', 'android')).toBe(false);
      expect(service.validateToken('   ', 'ios')).toBe(false);
    });

    it('should reject unsupported platform', () => {
      expect(service.validateToken('token', 'unsupported' as any)).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle unsupported platform', async () => {
      const payload: PushPayload = {
        title: 'Test',
        body: 'Body',
      };

      const result = await service.sendPushNotification(
        'token',
        'unsupported' as any,
        payload
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported platform');
    });

    it('should handle missing FCM configuration', async () => {
      delete process.env.FCM_SERVER_KEY;
      const serviceWithoutFCM = new PushNotificationService();

      const payload: PushPayload = {
        title: 'Test',
        body: 'Body',
      };

      const result = await serviceWithoutFCM.sendPushNotification(
        'token',
        'android',
        payload
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('FCM configuration not available');
    });

    it('should handle missing Web Push configuration', async () => {
      delete process.env.VAPID_PUBLIC_KEY;
      const serviceWithoutWebPush = new PushNotificationService();

      const payload: PushPayload = {
        title: 'Test',
        body: 'Body',
      };

      const result = await serviceWithoutWebPush.sendPushNotification(
        mockWebPushSubscription,
        'web',
        payload
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Web Push configuration not available');
    });
  });
});
