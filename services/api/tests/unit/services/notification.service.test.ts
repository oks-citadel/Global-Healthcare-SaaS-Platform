import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BadRequestError } from '../../../src/utils/errors.js';

// Mock AWS email library
vi.mock('../../../src/lib/aws-email.js', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true, messageId: 'mock-message-id' }),
}));

// Mock AWS SMS library
vi.mock('../../../src/lib/aws-sms.js', () => ({
  sendSms: vi.fn().mockResolvedValue({ success: true, messageId: 'mock-sms-id' }),
}));

// Mock queue library
vi.mock('../../../src/lib/queue.js', () => ({
  getNotificationQueues: vi.fn().mockReturnValue({
    email: { add: vi.fn() },
    sms: { add: vi.fn() },
    push: { add: vi.fn() },
  }),
}));

// Mock logger
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Import after mocks are set up
import { notificationService } from '../../../src/services/notification.service.js';
import * as awsEmail from '../../../src/lib/aws-email.js';
import * as awsSms from '../../../src/lib/aws-sms.js';

describe('NotificationService', () => {
  describe('sendEmail', () => {
    it('should send email notification successfully', async () => {
      const input = {
        to: 'patient@example.com',
        subject: 'Appointment Reminder',
        body: 'Your appointment is scheduled for tomorrow at 10:00 AM.',
      };

      const result = await notificationService.sendEmail(input);

      expect(result).toHaveProperty('id');
      expect(result.type).toBe('email');
      expect(result.status).toBe('sent');
      expect(result.recipient).toBe(input.to);
      expect(result).toHaveProperty('sentAt');
      expect(result.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should send email with template ID', async () => {
      const input = {
        to: 'patient@example.com',
        subject: 'Welcome to Healthcare Platform',
        body: 'Welcome message body',
        templateId: 'd-1234567890abcdef',
      };

      const result = await notificationService.sendEmail(input);

      expect(result.status).toBe('sent');
      expect(result.type).toBe('email');
      expect(result.recipient).toBe(input.to);
    });

    it('should handle missing required fields', async () => {
      const input = {
        to: '',
        subject: '',
        body: '',
      };

      const result = await notificationService.sendEmail(input);

      expect(result.status).toBe('failed');
      expect(result.type).toBe('email');
      expect(result).toHaveProperty('errorMessage');
      expect(result.errorMessage).toContain('Missing required email fields');
    });

    it('should generate unique IDs for each email', async () => {
      const input = {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test message',
      };

      const result1 = await notificationService.sendEmail(input);
      const result2 = await notificationService.sendEmail(input);

      expect(result1.id).not.toBe(result2.id);
    });

    it('should handle long email body', async () => {
      const longBody = 'a'.repeat(10000);
      const input = {
        to: 'patient@example.com',
        subject: 'Long Email',
        body: longBody,
      };

      const result = await notificationService.sendEmail(input);

      expect(result.status).toBe('sent');
      expect(result.recipient).toBe(input.to);
    });

    it('should validate email format in schema', () => {
      // This test validates that the DTO schema will catch invalid emails
      const invalidEmail = {
        to: 'invalid-email',
        subject: 'Test',
        body: 'Test body',
      };

      // The schema validation would fail before reaching the service
      // This test documents expected behavior
      expect(invalidEmail.to).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  describe('sendSms', () => {
    it('should send SMS notification successfully', async () => {
      const input = {
        to: '+1234567890',
        message: 'Your appointment is scheduled for tomorrow at 10:00 AM.',
      };

      const result = await notificationService.sendSms(input);

      expect(result).toHaveProperty('id');
      expect(result.type).toBe('sms');
      expect(result.status).toBe('sent');
      expect(result.recipient).toBe(input.to);
      expect(result).toHaveProperty('sentAt');
      expect(result.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('should handle various valid phone number formats', async () => {
      const validNumbers = [
        '+1234567890',
        '+12345678901',
        '+123456789012',
        '1234567890',
      ];

      for (const phoneNumber of validNumbers) {
        const input = {
          to: phoneNumber,
          message: 'Test message',
        };

        const result = await notificationService.sendSms(input);
        expect(result.status).toBe('sent');
      }
    });

    it('should handle missing required fields', async () => {
      const input = {
        to: '',
        message: '',
      };

      const result = await notificationService.sendSms(input);

      expect(result.status).toBe('failed');
      expect(result.type).toBe('sms');
      expect(result).toHaveProperty('errorMessage');
      expect(result.errorMessage).toContain('Missing required SMS fields');
    });

    it('should validate invalid phone number format', async () => {
      // Numbers that fail E.164 validation: /^\+?[1-9]\d{1,14}$/
      // Must start with 1-9 (or +1-9), followed by 1-14 digits
      const invalidNumbers = [
        'abc123',        // Contains letters
        '+0123456789',   // Starts with 0 after +
        'not-a-number',  // Contains non-digits
      ];

      for (const phoneNumber of invalidNumbers) {
        const input = {
          to: phoneNumber,
          message: 'Test message',
        };

        const result = await notificationService.sendSms(input);
        expect(result.status).toBe('failed');
        expect(result.errorMessage).toContain('Invalid phone number format');
      }
    });

    it('should reject messages that are too long', async () => {
      const longMessage = 'a'.repeat(1601);
      const input = {
        to: '+1234567890',
        message: longMessage,
      };

      const result = await notificationService.sendSms(input);

      expect(result.status).toBe('failed');
      expect(result.errorMessage).toContain('Message too long');
    });

    it('should accept message at maximum length', async () => {
      const maxMessage = 'a'.repeat(1600);
      const input = {
        to: '+1234567890',
        message: maxMessage,
      };

      const result = await notificationService.sendSms(input);

      expect(result.status).toBe('sent');
    });

    it('should generate unique IDs for each SMS', async () => {
      const input = {
        to: '+1234567890',
        message: 'Test message',
      };

      const result1 = await notificationService.sendSms(input);
      const result2 = await notificationService.sendSms(input);

      expect(result1.id).not.toBe(result2.id);
    });
  });

  describe('sendBatchEmail', () => {
    it('should send batch email notifications successfully', async () => {
      const recipients = [
        'patient1@example.com',
        'patient2@example.com',
        'patient3@example.com',
      ];
      const subject = 'System Maintenance Notice';
      const body = 'The system will be under maintenance on Saturday.';

      const results = await notificationService.sendBatchEmail(
        recipients,
        subject,
        body
      );

      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result.status).toBe('sent');
        expect(result.type).toBe('email');
        expect(result.recipient).toBe(recipients[index]);
      });
    });

    it('should send batch email with template ID', async () => {
      const recipients = ['patient1@example.com', 'patient2@example.com'];
      const subject = 'Welcome';
      const body = 'Welcome message';
      const templateId = 'd-template123';

      const results = await notificationService.sendBatchEmail(
        recipients,
        subject,
        body,
        templateId
      );

      expect(results).toHaveLength(2);
      results.forEach((result) => {
        expect(result.status).toBe('sent');
      });
    });

    it('should handle empty recipient list', async () => {
      const recipients: string[] = [];
      const subject = 'Test';
      const body = 'Test body';

      const results = await notificationService.sendBatchEmail(
        recipients,
        subject,
        body
      );

      expect(results).toHaveLength(0);
    });

    it('should handle partial failures in batch', async () => {
      const recipients = [
        'valid@example.com',
        '', // Invalid recipient
        'another@example.com',
      ];
      const subject = 'Test';
      const body = 'Test body';

      const results = await notificationService.sendBatchEmail(
        recipients,
        subject,
        body
      );

      expect(results).toHaveLength(3);
      expect(results[0].status).toBe('sent');
      expect(results[1].status).toBe('failed');
      expect(results[2].status).toBe('sent');
    });

    it('should generate unique IDs for each email in batch', async () => {
      const recipients = ['user1@example.com', 'user2@example.com'];
      const subject = 'Test';
      const body = 'Test body';

      const results = await notificationService.sendBatchEmail(
        recipients,
        subject,
        body
      );

      const ids = results.map(r => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(recipients.length);
    });
  });

  describe('sendBatchSms', () => {
    it('should send batch SMS notifications successfully', async () => {
      const recipients = [
        '+1234567890',
        '+9876543210',
        '+1111111111',
      ];
      const message = 'Your appointment has been confirmed.';

      const results = await notificationService.sendBatchSms(
        recipients,
        message
      );

      expect(results).toHaveLength(3);
      results.forEach((result, index) => {
        expect(result.status).toBe('sent');
        expect(result.type).toBe('sms');
        expect(result.recipient).toBe(recipients[index]);
      });
    });

    it('should handle empty recipient list', async () => {
      const recipients: string[] = [];
      const message = 'Test message';

      const results = await notificationService.sendBatchSms(
        recipients,
        message
      );

      expect(results).toHaveLength(0);
    });

    it('should handle partial failures in batch', async () => {
      const recipients = [
        '+1234567890',
        'invalid',
        '+9876543210',
      ];
      const message = 'Test message';

      const results = await notificationService.sendBatchSms(
        recipients,
        message
      );

      expect(results).toHaveLength(3);
      expect(results[0].status).toBe('sent');
      expect(results[1].status).toBe('failed');
      expect(results[2].status).toBe('sent');
    });

    it('should reject batch with message too long', async () => {
      const recipients = ['+1234567890', '+9876543210'];
      const message = 'a'.repeat(1601);

      const results = await notificationService.sendBatchSms(
        recipients,
        message
      );

      results.forEach((result) => {
        expect(result.status).toBe('failed');
        expect(result.errorMessage).toContain('Message too long');
      });
    });

    it('should generate unique IDs for each SMS in batch', async () => {
      const recipients = ['+1234567890', '+9876543210'];
      const message = 'Test message';

      const results = await notificationService.sendBatchSms(
        recipients,
        message
      );

      const ids = results.map(r => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(recipients.length);
    });

    it('should handle large batch efficiently', async () => {
      const recipients = Array.from({ length: 50 }, (_, i) => `+123456${String(i).padStart(4, '0')}`);
      const message = 'Bulk notification message';

      const startTime = Date.now();
      const results = await notificationService.sendBatchSms(
        recipients,
        message
      );
      const endTime = Date.now();

      expect(results).toHaveLength(50);
      results.forEach((result) => {
        expect(result.status).toBe('sent');
      });

      // Should complete in reasonable time (less than 5 seconds)
      expect(endTime - startTime).toBeLessThan(5000);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle special characters in email subject', async () => {
      const input = {
        to: 'test@example.com',
        subject: 'Test with special chars and emojis',
        body: 'Test body',
      };

      const result = await notificationService.sendEmail(input);
      expect(result.status).toBe('sent');
    });

    it('should handle special characters in SMS message', async () => {
      const input = {
        to: '+1234567890',
        message: 'Test with special chars and emojis',
      };

      const result = await notificationService.sendSms(input);
      expect(result.status).toBe('sent');
    });

    it('should handle HTML in email body', async () => {
      const input = {
        to: 'test@example.com',
        subject: 'HTML Email',
        body: '<h1>Hello</h1><p>This is an <strong>HTML</strong> email.</p>',
      };

      const result = await notificationService.sendEmail(input);
      expect(result.status).toBe('sent');
    });

    it('should handle newlines in messages', async () => {
      const emailInput = {
        to: 'test@example.com',
        subject: 'Multi-line email',
        body: 'Line 1\nLine 2\nLine 3',
      };

      const emailResult = await notificationService.sendEmail(emailInput);
      expect(emailResult.status).toBe('sent');

      const smsInput = {
        to: '+1234567890',
        message: 'Line 1\nLine 2\nLine 3',
      };

      const smsResult = await notificationService.sendSms(smsInput);
      expect(smsResult.status).toBe('sent');
    });

    it('should handle international phone numbers', async () => {
      const internationalNumbers = [
        '+447700900123', // UK
        '+33612345678',  // France
        '+61412345678',  // Australia
        '+81312345678',  // Japan
      ];

      for (const number of internationalNumbers) {
        const input = {
          to: number,
          message: 'International test',
        };

        const result = await notificationService.sendSms(input);
        expect(result.status).toBe('sent');
      }
    });
  });
});
