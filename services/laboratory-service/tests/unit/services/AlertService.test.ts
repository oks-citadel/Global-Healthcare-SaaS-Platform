/**
 * Unit Tests for AlertService
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlertService } from '../../../src/services/AlertService';
import { mockPrismaClient, mockFetchResponse } from '../helpers/mocks';
import { mockLabResult, mockCriticalResult } from '../helpers/fixtures';

// Mock logger
vi.mock('../../../src/utils/logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AlertService', () => {
  let alertService: AlertService;
  let mockPrisma: ReturnType<typeof mockPrismaClient>;

  beforeEach(() => {
    mockPrisma = mockPrismaClient();
    alertService = new AlertService(mockPrisma as any);
    vi.clearAllMocks();
    mockFetch.mockResolvedValue(mockFetchResponse({ success: true }));
  });

  describe('createCriticalValueAlert', () => {
    it('should create a critical value alert successfully', async () => {
      const result = await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'Complete Blood Count',
        'patient-123',
        'provider-123'
      );

      expect(result).toBeDefined();
      expect(result.resultId).toBe('result-critical-123');
      expect(result.patientId).toBe('patient-123');
      expect(result.providerId).toBe('provider-123');
      expect(result.severity).toBe('critical');
      expect(result.notificationSent).toBe(true);
    });

    it('should generate unique alert ID', async () => {
      const result1 = await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );
      const result2 = await alertService.createCriticalValueAlert(
        { ...mockCriticalResult, id: 'result-456' } as any,
        'CBC',
        'patient-123',
        'provider-123'
      );

      expect(result1.id).not.toBe(result2.id);
    });

    it('should send notification after creating alert', async () => {
      await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/notifications'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should handle notification failure gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Should not throw even if notification fails
      const result = await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );

      expect(result).toBeDefined();
    });
  });

  describe('acknowledgeAlert', () => {
    it('should acknowledge an alert', async () => {
      // First create an alert
      const alert = await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );

      // Then acknowledge it
      const acknowledged = await alertService.acknowledgeAlert(
        alert.id,
        'Dr. Johnson',
        'Patient notified, treatment started'
      );

      expect(acknowledged).toBeDefined();
      expect(acknowledged?.acknowledgedBy).toBe('Dr. Johnson');
      expect(acknowledged?.acknowledgedAt).toBeDefined();
      expect(acknowledged?.notes).toBe('Patient notified, treatment started');
    });

    it('should return null for non-existent alert', async () => {
      const result = await alertService.acknowledgeAlert(
        'non-existent',
        'Dr. Johnson'
      );

      expect(result).toBeNull();
    });
  });

  describe('escalateAlert', () => {
    it('should escalate an alert', async () => {
      const alert = await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );

      const escalated = await alertService.escalateAlert(alert.id);

      expect(escalated).toBeDefined();
      expect(escalated?.escalated).toBe(true);
    });

    it('should send escalation notification', async () => {
      const alert = await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );

      mockFetch.mockClear();
      await alertService.escalateAlert(alert.id);

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should return null for non-existent alert', async () => {
      const result = await alertService.escalateAlert('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('getUnacknowledgedAlerts', () => {
    it('should return unacknowledged alerts', async () => {
      // Create multiple alerts
      await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );
      await alertService.createCriticalValueAlert(
        { ...mockCriticalResult, id: 'result-456' } as any,
        'BMP',
        'patient-456',
        'provider-123'
      );

      const unacknowledged = await alertService.getUnacknowledgedAlerts();

      expect(unacknowledged).toHaveLength(2);
    });

    it('should filter by provider ID', async () => {
      await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );
      await alertService.createCriticalValueAlert(
        { ...mockCriticalResult, id: 'result-456' } as any,
        'BMP',
        'patient-456',
        'provider-456'
      );

      const filtered = await alertService.getUnacknowledgedAlerts('provider-123');

      expect(filtered).toHaveLength(1);
      expect(filtered[0].providerId).toBe('provider-123');
    });

    it('should not include acknowledged alerts', async () => {
      const alert = await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );
      await alertService.acknowledgeAlert(alert.id, 'Dr. Test');

      const unacknowledged = await alertService.getUnacknowledgedAlerts();

      expect(unacknowledged).toHaveLength(0);
    });

    it('should sort by alertedAt descending', async () => {
      await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      await alertService.createCriticalValueAlert(
        { ...mockCriticalResult, id: 'result-456' } as any,
        'BMP',
        'patient-456',
        'provider-123'
      );

      const alerts = await alertService.getUnacknowledgedAlerts();

      expect(alerts[0].testName).toBe('BMP'); // Most recent first
    });
  });

  describe('getAlertsByPatient', () => {
    it('should return alerts for a patient', async () => {
      await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );
      await alertService.createCriticalValueAlert(
        { ...mockCriticalResult, id: 'result-456' } as any,
        'BMP',
        'patient-456',
        'provider-123'
      );

      const patientAlerts = await alertService.getAlertsByPatient('patient-123');

      expect(patientAlerts).toHaveLength(1);
      expect(patientAlerts[0].patientId).toBe('patient-123');
    });

    it('should respect limit parameter', async () => {
      for (let i = 0; i < 5; i++) {
        await alertService.createCriticalValueAlert(
          { ...mockCriticalResult, id: `result-${i}` } as any,
          'CBC',
          'patient-123',
          'provider-123'
        );
      }

      const limited = await alertService.getAlertsByPatient('patient-123', 3);

      expect(limited).toHaveLength(3);
    });
  });

  describe('getAlertsByProvider', () => {
    it('should return alerts for a provider', async () => {
      await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );
      await alertService.createCriticalValueAlert(
        { ...mockCriticalResult, id: 'result-456' } as any,
        'BMP',
        'patient-456',
        'provider-456'
      );

      const providerAlerts = await alertService.getAlertsByProvider('provider-123');

      expect(providerAlerts).toHaveLength(1);
      expect(providerAlerts[0].providerId).toBe('provider-123');
    });
  });

  describe('getAlertStatistics', () => {
    it('should return alert statistics', async () => {
      // Create some alerts
      const alert1 = await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );
      await alertService.createCriticalValueAlert(
        { ...mockCriticalResult, id: 'result-456' } as any,
        'BMP',
        'patient-456',
        'provider-123'
      );

      // Acknowledge one
      await alertService.acknowledgeAlert(alert1.id, 'Dr. Test');

      const stats = await alertService.getAlertStatistics();

      expect(stats.total).toBe(2);
      expect(stats.acknowledged).toBe(1);
      expect(stats.unacknowledged).toBe(1);
      expect(stats.escalated).toBe(0);
    });

    it('should count escalated alerts', async () => {
      const alert = await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );
      await alertService.escalateAlert(alert.id);

      const stats = await alertService.getAlertStatistics();

      expect(stats.escalated).toBe(1);
    });
  });

  describe('getAlertById', () => {
    it('should return alert by ID', async () => {
      const created = await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );

      const found = await alertService.getAlertById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent ID', async () => {
      const result = await alertService.getAlertById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('clearAllAlerts', () => {
    it('should clear all alerts', async () => {
      await alertService.createCriticalValueAlert(
        mockCriticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );
      await alertService.createCriticalValueAlert(
        { ...mockCriticalResult, id: 'result-456' } as any,
        'BMP',
        'patient-456',
        'provider-123'
      );

      await alertService.clearAllAlerts();
      const stats = await alertService.getAlertStatistics();

      expect(stats.total).toBe(0);
    });
  });

  describe('checkAndCreateAlertsForResult', () => {
    it('should create alert for critical result', async () => {
      const criticalResult = { ...mockLabResult, isCritical: true };

      await alertService.checkAndCreateAlertsForResult(
        criticalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );

      const stats = await alertService.getAlertStatistics();
      expect(stats.total).toBe(1);
    });

    it('should not create alert for non-critical result', async () => {
      const normalResult = { ...mockLabResult, isCritical: false };

      await alertService.checkAndCreateAlertsForResult(
        normalResult as any,
        'CBC',
        'patient-123',
        'provider-123'
      );

      const stats = await alertService.getAlertStatistics();
      expect(stats.total).toBe(0);
    });
  });
});
