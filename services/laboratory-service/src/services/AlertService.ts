import { PrismaClient, LabResult } from '@prisma/client';
import { CriticalValueAlert } from '../types';
import logger from '../utils/logger';

export class AlertService {
  private prisma: PrismaClient;
  private notificationServiceUrl: string;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002';
  }

  async createCriticalValueAlert(result: LabResult, testName: string, patientId: string, providerId: string) {
    try {
      // Note: Using existing schema without CriticalValueAlert model
      // In production, you would use the updated schema
      const alert = {
        id: `alert-${Date.now()}`,
        resultId: result.id,
        patientId,
        providerId,
        testName,
        componentName: result.componentName,
        value: result.value,
        referenceRange: result.referenceRange,
        alertedAt: new Date(),
        notificationSent: false,
        escalated: false,
      };

      logger.info('Critical value alert created (placeholder)', {
        alertId: alert.id,
        resultId: result.id,
        componentName: result.componentName,
        value: result.value,
      });

      // Send notification
      await this.sendCriticalValueNotification(alert as any);

      // TODO: Uncomment when CriticalValueAlert model is added
      /*
      const alert = await this.prisma.criticalValueAlert.create({
        data: {
          resultId: result.id,
          patientId,
          providerId,
          testName,
          componentName: result.componentName,
          value: result.value,
          referenceRange: result.referenceRange,
          notificationSent: false,
          escalated: false,
        },
      });

      // Send notification
      await this.sendCriticalValueNotification(alert);
      */

      return alert;
    } catch (error) {
      logger.error('Error creating critical value alert', { error });
      throw error;
    }
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string, notes?: string) {
    try {
      // TODO: Uncomment when CriticalValueAlert model is added
      /*
      const alert = await this.prisma.criticalValueAlert.update({
        where: { id: alertId },
        data: {
          acknowledgedAt: new Date(),
          acknowledgedBy,
          notes,
        },
      });

      logger.info('Critical value alert acknowledged', {
        alertId: alert.id,
        acknowledgedBy,
      });

      return alert;
      */
      return null;
    } catch (error) {
      logger.error('Error acknowledging alert', { error, alertId });
      throw error;
    }
  }

  async escalateAlert(alertId: string) {
    try {
      // TODO: Uncomment when CriticalValueAlert model is added
      /*
      const alert = await this.prisma.criticalValueAlert.update({
        where: { id: alertId },
        data: {
          escalated: true,
        },
      });

      logger.info('Critical value alert escalated', {
        alertId: alert.id,
      });

      // Send escalation notification
      await this.sendEscalationNotification(alert);

      return alert;
      */
      return null;
    } catch (error) {
      logger.error('Error escalating alert', { error, alertId });
      throw error;
    }
  }

  async getUnacknowledgedAlerts(providerId?: string) {
    try {
      // TODO: Uncomment when CriticalValueAlert model is added
      /*
      const where: any = {
        acknowledgedAt: null,
      };

      if (providerId) {
        where.providerId = providerId;
      }

      const alerts = await this.prisma.criticalValueAlert.findMany({
        where,
        orderBy: { alertedAt: 'desc' },
      });

      return alerts;
      */
      return [];
    } catch (error) {
      logger.error('Error fetching unacknowledged alerts', { error });
      throw error;
    }
  }

  async getAlertsByPatient(patientId: string, limit: number = 20) {
    try {
      // TODO: Uncomment when CriticalValueAlert model is added
      /*
      const alerts = await this.prisma.criticalValueAlert.findMany({
        where: { patientId },
        orderBy: { alertedAt: 'desc' },
        take: limit,
      });

      return alerts;
      */
      return [];
    } catch (error) {
      logger.error('Error fetching patient alerts', { error, patientId });
      throw error;
    }
  }

  async getAlertsByProvider(providerId: string, limit: number = 20) {
    try {
      // TODO: Uncomment when CriticalValueAlert model is added
      /*
      const alerts = await this.prisma.criticalValueAlert.findMany({
        where: { providerId },
        orderBy: { alertedAt: 'desc' },
        take: limit,
      });

      return alerts;
      */
      return [];
    } catch (error) {
      logger.error('Error fetching provider alerts', { error, providerId });
      throw error;
    }
  }

  private async sendCriticalValueNotification(alert: CriticalValueAlert) {
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

  private async sendEscalationNotification(alert: any) {
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

  private async sendNotification(notification: any) {
    try {
      // In production, this would call the notification service API
      // For now, just log it
      logger.info('Notification to be sent', { notification });

      // Example implementation:
      /*
      const response = await fetch(`${this.notificationServiceUrl}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error(`Notification service error: ${response.statusText}`);
      }
      */
    } catch (error) {
      logger.error('Error calling notification service', { error });
    }
  }

  async checkAndCreateAlertsForResult(
    result: LabResult,
    testName: string,
    patientId: string,
    providerId: string
  ) {
    if (result.isCritical) {
      await this.createCriticalValueAlert(result, testName, patientId, providerId);
    }
  }

  async getAlertStatistics() {
    try {
      // TODO: Uncomment when CriticalValueAlert model is added
      /*
      const [total, unacknowledged, acknowledged, escalated] = await Promise.all([
        this.prisma.criticalValueAlert.count(),
        this.prisma.criticalValueAlert.count({ where: { acknowledgedAt: null } }),
        this.prisma.criticalValueAlert.count({ where: { acknowledgedAt: { not: null } } }),
        this.prisma.criticalValueAlert.count({ where: { escalated: true } }),
      ]);

      return {
        total,
        unacknowledged,
        acknowledged,
        escalated,
      };
      */
      return {
        total: 0,
        unacknowledged: 0,
        acknowledged: 0,
        escalated: 0,
      };
    } catch (error) {
      logger.error('Error fetching alert statistics', { error });
      throw error;
    }
  }
}
