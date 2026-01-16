import { PrismaClient, VitalType } from '../generated/client';
import AlertService from './AlertService';
import EngagementService from './EngagementService';

const prisma = new PrismaClient();

export interface VitalReading {
  vitalType: VitalType;
  value: number;
  unit: string;
  notes?: string;
  recordedAt?: Date;
  deviceId?: string;
  carePlanId?: string;
}

export class VitalSignService {
  async submitVitalReading(patientId: string, reading: VitalReading) {
    const vitalReading = await prisma.vitalReading.create({
      data: {
        patientId,
        vitalType: reading.vitalType,
        value: reading.value,
        unit: reading.unit,
        notes: reading.notes,
        recordedAt: reading.recordedAt || new Date(),
        deviceId: reading.deviceId,
        carePlanId: reading.carePlanId,
        isAbnormal: false, // Will be updated by threshold check
      },
    });

    // Evaluate thresholds and create alerts if needed
    await AlertService.evaluateVitalThresholds(patientId, vitalReading);

    // Track engagement
    await EngagementService.trackEngagement({
      patientId,
      carePlanId: reading.carePlanId,
      engagementType: 'vital_reading',
      activityType: `vital_reading_${reading.vitalType}`,
      description: `Recorded ${reading.vitalType}: ${reading.value} ${reading.unit}`,
      metadata: { vitalType: reading.vitalType, value: reading.value },
    });

    return vitalReading;
  }

  async submitBatchVitalReadings(patientId: string, readings: VitalReading[]) {
    const results = [];

    for (const reading of readings) {
      try {
        const result = await this.submitVitalReading(patientId, reading);
        results.push({ success: true, data: result });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          reading: reading.vitalType
        });
      }
    }

    return results;
  }

  async getVitalHistory(
    patientId: string,
    options?: {
      vitalType?: VitalType;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      carePlanId?: string;
    }
  ) {
    const where: any = { patientId };

    if (options?.vitalType) {
      where.vitalType = options.vitalType;
    }

    if (options?.carePlanId) {
      where.carePlanId = options.carePlanId;
    }

    if (options?.startDate || options?.endDate) {
      where.recordedAt = {};
      if (options.startDate) {
        where.recordedAt.gte = options.startDate;
      }
      if (options.endDate) {
        where.recordedAt.lte = options.endDate;
      }
    }

    return await prisma.vitalReading.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: options?.limit || 100,
      include: {
        device: true,
        carePlan: {
          select: {
            id: true,
            condition: true,
          },
        },
      },
    });
  }

  async getVitalStatistics(
    patientId: string,
    vitalType: VitalType,
    startDate?: Date,
    endDate?: Date
  ) {
    const where: any = { patientId, vitalType };

    if (startDate || endDate) {
      where.recordedAt = {};
      if (startDate) {
        where.recordedAt.gte = startDate;
      }
      if (endDate) {
        where.recordedAt.lte = endDate;
      }
    }

    const readings = await prisma.vitalReading.findMany({
      where,
      select: { value: true, recordedAt: true },
      orderBy: { recordedAt: 'asc' },
    });

    if (readings.length === 0) {
      return null;
    }

    const values = readings.map(r => r.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    return {
      vitalType,
      count: readings.length,
      average: avg,
      min,
      max,
      median,
      latest: readings[readings.length - 1],
      oldest: readings[0],
    };
  }

  async getLatestVitalsByPatient(patientId: string) {
    const vitalTypes = Object.values(VitalType);
    const latestVitals = [];

    for (const vitalType of vitalTypes) {
      const latest = await prisma.vitalReading.findFirst({
        where: { patientId, vitalType },
        orderBy: { recordedAt: 'desc' },
        include: {
          device: true,
        },
      });

      if (latest) {
        latestVitals.push(latest);
      }
    }

    return latestVitals;
  }

  async getAbnormalReadings(patientId: string, limit: number = 50) {
    return await prisma.vitalReading.findMany({
      where: {
        patientId,
        isAbnormal: true,
      },
      orderBy: { recordedAt: 'desc' },
      take: limit,
      include: {
        device: true,
        carePlan: {
          select: {
            id: true,
            condition: true,
          },
        },
      },
    });
  }

  async updateVitalReading(id: string, data: {
    isAbnormal?: boolean;
    notes?: string;
  }) {
    return await prisma.vitalReading.update({
      where: { id },
      data,
    });
  }
}

export default new VitalSignService();
