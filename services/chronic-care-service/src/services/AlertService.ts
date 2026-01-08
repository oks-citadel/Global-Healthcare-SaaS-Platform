import { PrismaClient, AlertType, AlertSeverity, VitalType, VitalReading } from '../generated/client';

const prisma = new PrismaClient();

export class AlertService {
  async createAlert(data: {
    patientId: string;
    carePlanId?: string;
    alertType: AlertType;
    severity: AlertSeverity;
    title: string;
    description: string;
  }) {
    return await prisma.alert.create({
      data,
    });
  }

  async getAlerts(filters: {
    patientId?: string;
    providerId?: string;
    carePlanId?: string;
    status?: string;
    severity?: AlertSeverity;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const where: any = {};

    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    if (filters.carePlanId) {
      where.carePlanId = filters.carePlanId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.severity) {
      where.severity = filters.severity;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    // If providerId is provided, find alerts for patients under this provider
    if (filters.providerId) {
      const carePlans = await prisma.carePlan.findMany({
        where: { providerId: filters.providerId },
        select: { patientId: true },
      });
      const patientIds = [...new Set(carePlans.map(cp => cp.patientId))];
      where.patientId = { in: patientIds };
    }

    return await prisma.alert.findMany({
      where,
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' },
      ],
      take: filters.limit || 100,
      include: {
        carePlan: {
          select: {
            id: true,
            condition: true,
            providerId: true,
          },
        },
      },
    });
  }

  async acknowledgeAlert(id: string, userId: string) {
    return await prisma.alert.update({
      where: { id },
      data: {
        status: 'acknowledged',
        acknowledgedBy: userId,
        acknowledgedAt: new Date(),
      },
    });
  }

  async resolveAlert(id: string, userId: string) {
    return await prisma.alert.update({
      where: { id },
      data: {
        status: 'resolved',
        resolvedAt: new Date(),
        acknowledgedBy: userId,
        acknowledgedAt: new Date(),
      },
    });
  }

  async dismissAlert(id: string) {
    return await prisma.alert.update({
      where: { id },
      data: {
        status: 'dismissed',
      },
    });
  }

  async evaluateVitalThresholds(patientId: string, vitalReading: VitalReading) {
    // Get active thresholds for this patient and vital type
    const thresholds = await prisma.alertThreshold.findMany({
      where: {
        patientId,
        vitalType: vitalReading.vitalType,
        isActive: true,
      },
    });

    if (thresholds.length === 0) {
      return null;
    }

    const value = vitalReading.value;
    const alertsCreated = [];

    for (const threshold of thresholds) {
      let severity: AlertSeverity | null = null;
      let message = '';

      // Check critical thresholds
      if (threshold.criticalMin !== null && value < threshold.criticalMin) {
        severity = 'critical';
        message = `${vitalReading.vitalType} critically low: ${value} (threshold: ${threshold.criticalMin})`;
      } else if (threshold.criticalMax !== null && value > threshold.criticalMax) {
        severity = 'critical';
        message = `${vitalReading.vitalType} critically high: ${value} (threshold: ${threshold.criticalMax})`;
      }
      // Check warning thresholds
      else if (threshold.warningMin !== null && value < threshold.warningMin) {
        severity = 'warning';
        message = `${vitalReading.vitalType} below normal: ${value} (threshold: ${threshold.warningMin})`;
      } else if (threshold.warningMax !== null && value > threshold.warningMax) {
        severity = 'warning';
        message = `${vitalReading.vitalType} above normal: ${value} (threshold: ${threshold.warningMax})`;
      }

      if (severity) {
        // Update vital reading to mark as abnormal
        await prisma.vitalReading.update({
          where: { id: vitalReading.id },
          data: { isAbnormal: true },
        });

        // Create alert
        const alert = await this.createAlert({
          patientId,
          carePlanId: vitalReading.carePlanId || undefined,
          alertType: 'vital_out_of_range',
          severity,
          title: `${vitalReading.vitalType} ${severity === 'critical' ? 'Critical' : 'Warning'}`,
          description: message,
        });

        alertsCreated.push(alert);
      }
    }

    return alertsCreated;
  }

  async createThreshold(data: {
    patientId: string;
    carePlanId?: string;
    vitalType: VitalType;
    condition?: string;
    minValue?: number;
    maxValue?: number;
    criticalMin?: number;
    criticalMax?: number;
    warningMin?: number;
    warningMax?: number;
  }) {
    return await prisma.alertThreshold.create({
      data,
    });
  }

  async updateThreshold(id: string, data: Partial<{
    minValue: number;
    maxValue: number;
    criticalMin: number;
    criticalMax: number;
    warningMin: number;
    warningMax: number;
    isActive: boolean;
  }>) {
    return await prisma.alertThreshold.update({
      where: { id },
      data,
    });
  }

  async getThresholds(patientId: string, vitalType?: VitalType) {
    const where: any = { patientId, isActive: true };

    if (vitalType) {
      where.vitalType = vitalType;
    }

    return await prisma.alertThreshold.findMany({
      where,
      orderBy: { vitalType: 'asc' },
    });
  }

  async deactivateThreshold(id: string) {
    return await prisma.alertThreshold.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getAlertSummary(patientId: string) {
    const alerts = await prisma.alert.findMany({
      where: { patientId },
      select: {
        severity: true,
        status: true,
      },
    });

    const summary = {
      total: alerts.length,
      new: alerts.filter(a => a.status === 'new').length,
      acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
      resolved: alerts.filter(a => a.status === 'resolved').length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      warning: alerts.filter(a => a.severity === 'warning').length,
      info: alerts.filter(a => a.severity === 'info').length,
    };

    return summary;
  }
}

export default new AlertService();
