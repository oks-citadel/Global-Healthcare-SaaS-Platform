import { PrismaClient, LabResult } from '../generated/client';
import { CriticalValueAlert } from '../types';
import logger from '../utils/logger';

/**
 * In-memory storage for critical value alerts.
 * This serves as a temporary data store until the CriticalValueAlert model is added to the Prisma schema.
 * In production, replace this with proper database persistence.
 */
interface StoredAlert {
  id: string;
  resultId: string;
  patientId: string;
  providerId: string;
  testName: string;
  componentName: string;
  value: string;
  referenceRange?: string;
  severity: 'high' | 'critical';
  alertedAt: Date;
  notificationSent: boolean;
  escalated: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  notes?: string;
}

/**
 * AlertService handles critical value alerts for laboratory results.
 *
 * This service manages the lifecycle of critical value alerts including:
 * - Creating alerts when critical lab values are detected
 * - Sending notifications to providers
 * - Tracking acknowledgment status
 * - Escalating unacknowledged alerts
 *
 * NOTE: Currently uses in-memory storage. When the CriticalValueAlert model is added
 * to the Prisma schema, update the implementation to use database persistence.
 */
export class AlertService {
  private notificationServiceUrl: string;

  /**
   * In-memory storage for alerts until database model is available.
   * Key: alert ID, Value: StoredAlert object
   */
  private alertStore: Map<string, StoredAlert> = new Map();

  constructor(_prisma: PrismaClient) {
    this.notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002';
  }

  /**
   * Creates a critical value alert for a lab result.
   * @param result - The lab result that triggered the alert
   * @param testName - Name of the test
   * @param patientId - ID of the patient
   * @param providerId - ID of the ordering provider
   * @returns The created alert object
   */
  async createCriticalValueAlert(result: LabResult, testName: string, patientId: string, providerId: string): Promise<StoredAlert> {
    try {
      const alertId = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const alert: StoredAlert = {
        id: alertId,
        resultId: result.id,
        patientId,
        providerId,
        testName,
        componentName: result.componentName,
        value: result.value,
        referenceRange: result.referenceRange || undefined,
        severity: 'critical',
        alertedAt: new Date(),
        notificationSent: false,
        escalated: false,
      };

      // Store the alert in memory
      this.alertStore.set(alertId, alert);

      logger.info('Critical value alert created', {
        alertId: alert.id,
        resultId: result.id,
        componentName: result.componentName,
        value: result.value,
        patientId,
        providerId,
      });

      // Send notification to the provider
      await this.sendCriticalValueNotification({
        resultId: result.id,
        patientId,
        providerId,
        testName,
        componentName: result.componentName,
        value: result.value,
        referenceRange: result.referenceRange || undefined,
        severity: 'critical',
      });

      // Update notification status
      alert.notificationSent = true;
      this.alertStore.set(alertId, alert);

      return alert;
    } catch (error) {
      logger.error('Error creating critical value alert', { error });
      throw error;
    }
  }

  /**
   * Acknowledges a critical value alert.
   * @param alertId - The ID of the alert to acknowledge
   * @param acknowledgedBy - The ID of the user acknowledging the alert
   * @param notes - Optional notes about the acknowledgment
   * @returns The updated alert object or null if not found
   */
  async acknowledgeAlert(alertId: string, acknowledgedBy: string, notes?: string): Promise<StoredAlert | null> {
    try {
      const alert = this.alertStore.get(alertId);

      if (!alert) {
        logger.warn('Alert not found for acknowledgment', { alertId });
        return null;
      }

      // Update the alert with acknowledgment details
      alert.acknowledgedAt = new Date();
      alert.acknowledgedBy = acknowledgedBy;
      if (notes) {
        alert.notes = notes;
      }

      this.alertStore.set(alertId, alert);

      logger.info('Critical value alert acknowledged', {
        alertId: alert.id,
        acknowledgedBy,
        acknowledgedAt: alert.acknowledgedAt,
      });

      return alert;
    } catch (error) {
      logger.error('Error acknowledging alert', { error, alertId });
      throw error;
    }
  }

  /**
   * Escalates an unacknowledged critical value alert.
   * @param alertId - The ID of the alert to escalate
   * @returns The updated alert object or null if not found
   */
  async escalateAlert(alertId: string): Promise<StoredAlert | null> {
    try {
      const alert = this.alertStore.get(alertId);

      if (!alert) {
        logger.warn('Alert not found for escalation', { alertId });
        return null;
      }

      // Mark as escalated
      alert.escalated = true;
      this.alertStore.set(alertId, alert);

      logger.info('Critical value alert escalated', {
        alertId: alert.id,
        patientId: alert.patientId,
        providerId: alert.providerId,
      });

      // Send escalation notification to administrators
      await this.sendEscalationNotification(alert);

      return alert;
    } catch (error) {
      logger.error('Error escalating alert', { error, alertId });
      throw error;
    }
  }

  /**
   * Retrieves all unacknowledged alerts, optionally filtered by provider.
   * @param providerId - Optional provider ID to filter alerts
   * @returns Array of unacknowledged alerts
   */
  async getUnacknowledgedAlerts(providerId?: string): Promise<StoredAlert[]> {
    try {
      const alerts = Array.from(this.alertStore.values())
        .filter(alert => {
          // Filter for unacknowledged alerts
          if (alert.acknowledgedAt) {
            return false;
          }
          // Optionally filter by provider
          if (providerId && alert.providerId !== providerId) {
            return false;
          }
          return true;
        })
        .sort((a, b) => b.alertedAt.getTime() - a.alertedAt.getTime());

      logger.debug('Retrieved unacknowledged alerts', {
        count: alerts.length,
        providerId,
      });

      return alerts;
    } catch (error) {
      logger.error('Error fetching unacknowledged alerts', { error });
      throw error;
    }
  }

  /**
   * Retrieves alerts for a specific patient.
   * @param patientId - The patient ID to filter by
   * @param limit - Maximum number of alerts to return (default: 20)
   * @returns Array of alerts for the patient
   */
  async getAlertsByPatient(patientId: string, limit: number = 20): Promise<StoredAlert[]> {
    try {
      const alerts = Array.from(this.alertStore.values())
        .filter(alert => alert.patientId === patientId)
        .sort((a, b) => b.alertedAt.getTime() - a.alertedAt.getTime())
        .slice(0, limit);

      logger.debug('Retrieved patient alerts', {
        patientId,
        count: alerts.length,
      });

      return alerts;
    } catch (error) {
      logger.error('Error fetching patient alerts', { error, patientId });
      throw error;
    }
  }

  /**
   * Retrieves alerts for a specific provider.
   * @param providerId - The provider ID to filter by
   * @param limit - Maximum number of alerts to return (default: 20)
   * @returns Array of alerts for the provider
   */
  async getAlertsByProvider(providerId: string, limit: number = 20): Promise<StoredAlert[]> {
    try {
      const alerts = Array.from(this.alertStore.values())
        .filter(alert => alert.providerId === providerId)
        .sort((a, b) => b.alertedAt.getTime() - a.alertedAt.getTime())
        .slice(0, limit);

      logger.debug('Retrieved provider alerts', {
        providerId,
        count: alerts.length,
      });

      return alerts;
    } catch (error) {
      logger.error('Error fetching provider alerts', { error, providerId });
      throw error;
    }
  }

  /**
   * Sends a critical value notification to the provider.
   * @param alert - The alert data for the notification
   */
  private async sendCriticalValueNotification(alert: CriticalValueAlert): Promise<void> {
    try {
      const notification = {
        type: 'critical_lab_value',
        recipientId: alert.providerId,
        recipientType: 'provider',
        priority: 'urgent',
        title: 'Critical Lab Value Alert',
        message: `Critical value detected for ${alert.componentName}: ${alert.value}${
          alert.referenceRange ? ` (Reference: ${alert.referenceRange})` : ''
        }`,
        data: {
          alertId: alert.resultId,
          patientId: alert.patientId,
          testName: alert.testName,
          componentName: alert.componentName,
          value: alert.value,
          severity: alert.severity || 'critical',
        },
      };

      // Call notification service
      await this.sendNotification(notification);

      logger.info('Critical value notification sent', {
        alertId: alert.resultId,
        providerId: alert.providerId,
      });
    } catch (error) {
      logger.error('Error sending critical value notification', { error, alert });
    }
  }

  /**
   * Sends an escalation notification for an unacknowledged alert.
   * @param alert - The alert that is being escalated
   */
  private async sendEscalationNotification(alert: StoredAlert): Promise<void> {
    try {
      const notification = {
        type: 'escalated_critical_value',
        recipientType: 'admin',
        priority: 'stat',
        title: 'Escalated Critical Lab Value',
        message: `Unacknowledged critical value for ${alert.componentName}: ${alert.value}`,
        data: {
          alertId: alert.id,
          patientId: alert.patientId,
          providerId: alert.providerId,
          testName: alert.testName,
          escalatedAt: new Date().toISOString(),
          originalAlertTime: alert.alertedAt.toISOString(),
        },
      };

      await this.sendNotification(notification);

      logger.info('Escalation notification sent', {
        alertId: alert.id,
      });
    } catch (error) {
      logger.error('Error sending escalation notification', { error });
    }
  }

  /**
   * Sends a notification to the notification service.
   * In production, this makes an HTTP call to the notification service API.
   * @param notification - The notification payload to send
   */
  private async sendNotification(notification: Record<string, unknown>): Promise<void> {
    try {
      // Log the notification for debugging
      logger.info('Sending notification to notification service', {
        type: notification.type,
        recipientType: notification.recipientType,
        priority: notification.priority,
      });

      // Make HTTP call to notification service
      const response = await fetch(`${this.notificationServiceUrl}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        // Log the error but don't throw - notification failures shouldn't block alert creation
        logger.warn(`Notification service returned non-OK status: ${response.status}`, {
          statusText: response.statusText,
          notification,
        });
      } else {
        logger.debug('Notification sent successfully', { type: notification.type });
      }
    } catch (error) {
      // Log error but don't throw - notification failures shouldn't block alert creation
      logger.error('Error calling notification service', {
        error,
        url: this.notificationServiceUrl,
      });
    }
  }

  /**
   * Checks if a lab result is critical and creates an alert if necessary.
   * @param result - The lab result to check
   * @param testName - Name of the test
   * @param patientId - ID of the patient
   * @param providerId - ID of the ordering provider
   */
  async checkAndCreateAlertsForResult(
    result: LabResult,
    testName: string,
    patientId: string,
    providerId: string
  ): Promise<void> {
    if ((result as LabResult & { isCritical?: boolean }).isCritical) {
      await this.createCriticalValueAlert(result, testName, patientId, providerId);
    }
  }

  /**
   * Retrieves statistics about alerts.
   * @returns Object containing alert statistics
   */
  async getAlertStatistics(): Promise<{
    total: number;
    unacknowledged: number;
    acknowledged: number;
    escalated: number;
  }> {
    try {
      const alerts = Array.from(this.alertStore.values());

      const stats = {
        total: alerts.length,
        unacknowledged: alerts.filter(a => !a.acknowledgedAt).length,
        acknowledged: alerts.filter(a => a.acknowledgedAt).length,
        escalated: alerts.filter(a => a.escalated).length,
      };

      logger.debug('Retrieved alert statistics', stats);

      return stats;
    } catch (error) {
      logger.error('Error fetching alert statistics', { error });
      throw error;
    }
  }

  /**
   * Retrieves a single alert by ID.
   * @param alertId - The ID of the alert to retrieve
   * @returns The alert object or null if not found
   */
  async getAlertById(alertId: string): Promise<StoredAlert | null> {
    try {
      const alert = this.alertStore.get(alertId) || null;

      if (!alert) {
        logger.debug('Alert not found', { alertId });
      }

      return alert;
    } catch (error) {
      logger.error('Error fetching alert', { error, alertId });
      throw error;
    }
  }

  /**
   * Clears all alerts from memory. Useful for testing.
   * WARNING: This will delete all alert data. Use with caution.
   */
  async clearAllAlerts(): Promise<void> {
    this.alertStore.clear();
    logger.warn('All alerts cleared from memory');
  }
}
