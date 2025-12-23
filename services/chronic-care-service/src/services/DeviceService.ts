import { PrismaClient, DeviceType, DeviceStatus } from '../generated/client';
import AlertService from './AlertService';
import EngagementService from './EngagementService';

const prisma = new PrismaClient();

export class DeviceService {
  async registerDevice(data: {
    patientId: string;
    deviceType: DeviceType;
    manufacturer?: string;
    model?: string;
    serialNumber: string;
  }) {
    // Check if device already exists
    const existingDevice = await prisma.monitoringDevice.findUnique({
      where: { serialNumber: data.serialNumber },
    });

    if (existingDevice) {
      if (existingDevice.patientId !== data.patientId) {
        throw new Error('Device is already registered to another patient');
      }
      return existingDevice;
    }

    const device = await prisma.monitoringDevice.create({
      data,
    });

    // Track engagement
    await EngagementService.trackEngagement({
      patientId: data.patientId,
      engagementType: 'device_sync',
      activityType: 'device_registered',
      description: `Registered ${data.deviceType}`,
      metadata: { deviceId: device.id, deviceType: data.deviceType },
    });

    return device;
  }

  async getDevicesByPatient(patientId: string, status?: DeviceStatus) {
    const where: any = { patientId };

    if (status) {
      where.status = status;
    }

    return await prisma.monitoringDevice.findMany({
      where,
      include: {
        readings: {
          orderBy: { recordedAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDeviceById(id: string) {
    return await prisma.monitoringDevice.findUnique({
      where: { id },
      include: {
        readings: {
          orderBy: { recordedAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async updateDevice(id: string, data: Partial<{
    manufacturer: string;
    model: string;
    status: DeviceStatus;
    batteryLevel: number;
  }>) {
    return await prisma.monitoringDevice.update({
      where: { id },
      data,
    });
  }

  async syncDevice(deviceId: string, batteryLevel?: number) {
    const device = await prisma.monitoringDevice.update({
      where: { id: deviceId },
      data: {
        lastSyncAt: new Date(),
        batteryLevel: batteryLevel !== undefined ? batteryLevel : undefined,
      },
    });

    // Track engagement
    await EngagementService.trackEngagement({
      patientId: device.patientId,
      engagementType: 'device_sync',
      activityType: 'device_synced',
      description: `Synced ${device.deviceType}`,
      metadata: { deviceId, batteryLevel },
    });

    // Check battery level and create alert if low
    if (batteryLevel !== undefined && batteryLevel < 20) {
      await AlertService.createAlert({
        patientId: device.patientId,
        alertType: 'device_offline',
        severity: batteryLevel < 10 ? 'warning' : 'info',
        title: 'Low Device Battery',
        description: `${device.deviceType} battery is at ${batteryLevel}%`,
      });
    }

    return device;
  }

  async decommissionDevice(id: string) {
    return await this.updateDevice(id, {
      status: 'decommissioned',
    });
  }

  async checkDeviceHealth(patientId: string) {
    const devices = await this.getDevicesByPatient(patientId, 'active');
    const healthReport = [];

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    for (const device of devices) {
      const issues = [];

      // Check last sync time
      if (!device.lastSyncAt) {
        issues.push('Never synced');
      } else if (device.lastSyncAt < threeDaysAgo) {
        issues.push('Not synced in 3+ days');

        // Create alert for inactive device
        await AlertService.createAlert({
          patientId,
          alertType: 'device_offline',
          severity: 'warning',
          title: 'Device Offline',
          description: `${device.deviceType} has not synced since ${device.lastSyncAt.toISOString()}`,
        });
      } else if (device.lastSyncAt < oneDayAgo) {
        issues.push('Not synced in 24+ hours');
      }

      // Check battery level
      if (device.batteryLevel !== null) {
        if (device.batteryLevel < 10) {
          issues.push('Critical battery level');
        } else if (device.batteryLevel < 20) {
          issues.push('Low battery level');
        }
      }

      healthReport.push({
        deviceId: device.id,
        deviceType: device.deviceType,
        status: device.status,
        lastSync: device.lastSyncAt,
        batteryLevel: device.batteryLevel,
        issues,
        healthy: issues.length === 0,
      });
    }

    return healthReport;
  }

  async getDeviceReadings(deviceId: string, limit: number = 50) {
    return await prisma.vitalReading.findMany({
      where: { deviceId },
      orderBy: { recordedAt: 'desc' },
      take: limit,
    });
  }

  async getDeviceStatistics(deviceId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const device = await this.getDeviceById(deviceId);
    if (!device) {
      throw new Error('Device not found');
    }

    const readings = await prisma.vitalReading.count({
      where: {
        deviceId,
        recordedAt: { gte: startDate },
      },
    });

    const avgReadingsPerDay = readings / days;

    return {
      deviceId,
      deviceType: device.deviceType,
      status: device.status,
      totalReadings: readings,
      period: `${days} days`,
      avgReadingsPerDay: avgReadingsPerDay.toFixed(2),
      lastSync: device.lastSyncAt,
      batteryLevel: device.batteryLevel,
    };
  }

  async deleteDevice(id: string) {
    // First check if device has any readings
    const readingsCount = await prisma.vitalReading.count({
      where: { deviceId: id },
    });

    if (readingsCount > 0) {
      // Don't delete, just decommission
      return await this.decommissionDevice(id);
    }

    // Safe to delete if no readings
    return await prisma.monitoringDevice.delete({
      where: { id },
    });
  }

  async getDevicesByType(patientId: string, deviceType: DeviceType) {
    return await prisma.monitoringDevice.findMany({
      where: {
        patientId,
        deviceType,
        status: 'active',
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new DeviceService();
