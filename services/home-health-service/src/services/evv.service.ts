import { PrismaClient, EVVVerificationMethod } from '../generated/client';

const prisma = new PrismaClient();

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface EVVClockInData {
  visitId: string;
  caregiverId: string;
  location: GeoLocation;
  deviceId?: string;
  deviceType?: string;
  ipAddress?: string;
  verificationMethod: EVVVerificationMethod;
}

export interface EVVClockOutData extends EVVClockInData {
  signature?: string;
}

export interface EVVComplianceReport {
  visitId: string;
  isCompliant: boolean;
  issues: string[];
  clockInRecord?: any;
  clockOutRecord?: any;
  locationVerified: boolean;
  timingVerified: boolean;
  signatureVerified: boolean;
}

export class EVVService {
  private readonly DEFAULT_GEOFENCE_RADIUS = 100; // meters

  // Calculate distance between two points in meters
  private calculateDistanceMeters(point1: GeoLocation, point2: GeoLocation): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) *
        Math.cos(this.toRadians(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Verify if location is within geofence of patient's home
  async verifyLocation(visitId: string, location: GeoLocation): Promise<{
    isWithinGeofence: boolean;
    distanceFromHome: number;
    geofenceRadius: number;
  }> {
    const visit = await prisma.homeVisit.findUnique({
      where: { id: visitId },
      include: { patientHome: true },
    });

    if (!visit || !visit.patientHome.latitude || !visit.patientHome.longitude) {
      throw new Error('Visit or patient home location not found');
    }

    const patientLocation: GeoLocation = {
      latitude: visit.patientHome.latitude,
      longitude: visit.patientHome.longitude,
    };

    const distanceFromHome = this.calculateDistanceMeters(location, patientLocation);
    const geofenceRadius = this.DEFAULT_GEOFENCE_RADIUS;
    const isWithinGeofence = distanceFromHome <= geofenceRadius;

    return {
      isWithinGeofence,
      distanceFromHome: Math.round(distanceFromHome),
      geofenceRadius,
    };
  }

  // Record clock-in for EVV
  async clockIn(data: EVVClockInData): Promise<any> {
    const locationVerification = await this.verifyLocation(data.visitId, data.location);

    // Update visit status
    await prisma.homeVisit.update({
      where: { id: data.visitId },
      data: {
        status: 'arrived',
        actualStartTime: new Date(),
        startLatitude: data.location.latitude,
        startLongitude: data.location.longitude,
      },
    });

    // Create EVV record
    const evvRecord = await prisma.eVVRecord.create({
      data: {
        visitId: data.visitId,
        recordType: 'clock_in',
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        accuracy: data.location.accuracy,
        deviceId: data.deviceId,
        deviceType: data.deviceType,
        ipAddress: data.ipAddress,
        verificationMethod: data.verificationMethod,
        isVerified: locationVerification.isWithinGeofence,
        distanceFromHome: locationVerification.distanceFromHome,
        isWithinGeofence: locationVerification.isWithinGeofence,
        geofenceRadius: locationVerification.geofenceRadius,
        verificationNotes: locationVerification.isWithinGeofence
          ? 'Location verified within geofence'
          : `Location ${locationVerification.distanceFromHome}m from patient home (outside ${locationVerification.geofenceRadius}m geofence)`,
      },
    });

    // Create time entry
    await prisma.timeEntry.create({
      data: {
        caregiverId: data.caregiverId,
        visitId: data.visitId,
        entryType: 'visit',
        startTime: new Date(),
        startLatitude: data.location.latitude,
        startLongitude: data.location.longitude,
      },
    });

    return {
      evvRecord,
      locationVerification,
    };
  }

  // Record clock-out for EVV
  async clockOut(data: EVVClockOutData): Promise<any> {
    const locationVerification = await this.verifyLocation(data.visitId, data.location);

    const visit = await prisma.homeVisit.findUnique({
      where: { id: data.visitId },
    });

    if (!visit) throw new Error('Visit not found');

    const actualEndTime = new Date();
    const actualDuration = visit.actualStartTime
      ? Math.round((actualEndTime.getTime() - visit.actualStartTime.getTime()) / 60000)
      : null;

    // Update visit status
    await prisma.homeVisit.update({
      where: { id: data.visitId },
      data: {
        status: 'completed',
        actualEndTime,
        actualDuration,
        endLatitude: data.location.latitude,
        endLongitude: data.location.longitude,
        caregiverSignature: data.signature,
        signedAt: data.signature ? new Date() : null,
      },
    });

    // Create EVV record
    const evvRecord = await prisma.eVVRecord.create({
      data: {
        visitId: data.visitId,
        recordType: 'clock_out',
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        accuracy: data.location.accuracy,
        deviceId: data.deviceId,
        deviceType: data.deviceType,
        ipAddress: data.ipAddress,
        verificationMethod: data.verificationMethod,
        isVerified: locationVerification.isWithinGeofence,
        distanceFromHome: locationVerification.distanceFromHome,
        isWithinGeofence: locationVerification.isWithinGeofence,
        geofenceRadius: locationVerification.geofenceRadius,
        verificationNotes: locationVerification.isWithinGeofence
          ? 'Location verified within geofence'
          : `Location ${locationVerification.distanceFromHome}m from patient home`,
      },
    });

    // Update time entry
    await prisma.timeEntry.updateMany({
      where: {
        caregiverId: data.caregiverId,
        visitId: data.visitId,
        endTime: null,
      },
      data: {
        endTime: actualEndTime,
        duration: actualDuration,
        endLatitude: data.location.latitude,
        endLongitude: data.location.longitude,
      },
    });

    return {
      evvRecord,
      locationVerification,
      duration: actualDuration,
    };
  }

  // Record location update during visit
  async recordLocationUpdate(visitId: string, location: GeoLocation, deviceId?: string): Promise<any> {
    const locationVerification = await this.verifyLocation(visitId, location);

    return await prisma.eVVRecord.create({
      data: {
        visitId,
        recordType: 'location_update',
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        deviceId,
        verificationMethod: 'gps',
        isVerified: locationVerification.isWithinGeofence,
        distanceFromHome: locationVerification.distanceFromHome,
        isWithinGeofence: locationVerification.isWithinGeofence,
        geofenceRadius: locationVerification.geofenceRadius,
      },
    });
  }

  // Get EVV records for a visit
  async getVisitEVVRecords(visitId: string) {
    return await prisma.eVVRecord.findMany({
      where: { visitId },
      orderBy: { timestamp: 'asc' },
    });
  }

  // Generate EVV compliance report for a visit
  async generateComplianceReport(visitId: string): Promise<EVVComplianceReport> {
    const visit = await prisma.homeVisit.findUnique({
      where: { id: visitId },
      include: {
        evvRecords: { orderBy: { timestamp: 'asc' } },
        patientHome: true,
      },
    });

    if (!visit) throw new Error('Visit not found');

    const issues: string[] = [];
    const clockInRecord = visit.evvRecords.find(r => r.recordType === 'clock_in');
    const clockOutRecord = visit.evvRecords.find(r => r.recordType === 'clock_out');

    // Check clock-in
    if (!clockInRecord) {
      issues.push('Missing clock-in record');
    } else if (!clockInRecord.isWithinGeofence) {
      issues.push(`Clock-in location outside geofence (${clockInRecord.distanceFromHome}m from patient home)`);
    }

    // Check clock-out
    if (!clockOutRecord) {
      issues.push('Missing clock-out record');
    } else if (!clockOutRecord.isWithinGeofence) {
      issues.push(`Clock-out location outside geofence (${clockOutRecord.distanceFromHome}m from patient home)`);
    }

    // Check timing
    if (visit.actualStartTime && visit.actualEndTime) {
      const scheduledStart = new Date(`${visit.scheduledDate.toISOString().split('T')[0]}T${visit.scheduledStartTime}`);

      const startDiff = Math.abs(visit.actualStartTime.getTime() - scheduledStart.getTime()) / 60000;

      if (startDiff > 30) {
        issues.push(`Visit started ${Math.round(startDiff)} minutes ${visit.actualStartTime > scheduledStart ? 'late' : 'early'}`);
      }

      if (visit.actualDuration && visit.estimatedDuration) {
        const durationDiff = Math.abs(visit.actualDuration - visit.estimatedDuration);
        if (durationDiff > 30) {
          issues.push(`Visit duration varied by ${durationDiff} minutes from estimate`);
        }
      }
    }

    // Check signature
    if (!visit.caregiverSignature && !visit.patientSignature) {
      issues.push('Missing visit signatures');
    }

    const locationVerified = !!(clockInRecord?.isWithinGeofence && clockOutRecord?.isWithinGeofence);
    const timingVerified = !!(visit.actualStartTime && visit.actualEndTime);
    const signatureVerified = !!(visit.caregiverSignature || visit.patientSignature);

    return {
      visitId,
      isCompliant: issues.length === 0,
      issues,
      clockInRecord,
      clockOutRecord,
      locationVerified,
      timingVerified,
      signatureVerified,
    };
  }

  // Bulk compliance check for multiple visits
  async bulkComplianceCheck(visitIds: string[]): Promise<EVVComplianceReport[]> {
    const reports: EVVComplianceReport[] = [];

    for (const visitId of visitIds) {
      try {
        const report = await this.generateComplianceReport(visitId);
        reports.push(report);
      } catch (error) {
        reports.push({
          visitId,
          isCompliant: false,
          issues: ['Error generating compliance report'],
          locationVerified: false,
          timingVerified: false,
          signatureVerified: false,
        });
      }
    }

    return reports;
  }

  // Get EVV statistics for a date range
  async getEVVStatistics(startDate: Date, endDate: Date, caregiverId?: string) {
    const where: any = {
      scheduledDate: { gte: startDate, lte: endDate },
      status: 'completed',
    };

    if (caregiverId) {
      where.caregiverId = caregiverId;
    }

    const visits = await prisma.homeVisit.findMany({
      where,
      include: { evvRecords: true },
    });

    let compliantCount = 0;
    let locationIssues = 0;
    let timingIssues = 0;
    let signatureIssues = 0;

    for (const visit of visits) {
      const clockIn = visit.evvRecords.find(r => r.recordType === 'clock_in');
      const clockOut = visit.evvRecords.find(r => r.recordType === 'clock_out');

      const hasLocationIssue = !(clockIn?.isWithinGeofence && clockOut?.isWithinGeofence);
      const hasTimingIssue = !visit.actualStartTime || !visit.actualEndTime;
      const hasSignatureIssue = !visit.caregiverSignature && !visit.patientSignature;

      if (hasLocationIssue) locationIssues++;
      if (hasTimingIssue) timingIssues++;
      if (hasSignatureIssue) signatureIssues++;

      if (!hasLocationIssue && !hasTimingIssue && !hasSignatureIssue) {
        compliantCount++;
      }
    }

    return {
      totalVisits: visits.length,
      compliantVisits: compliantCount,
      complianceRate: visits.length > 0 ? Math.round((compliantCount / visits.length) * 100) : 0,
      locationIssues,
      timingIssues,
      signatureIssues,
    };
  }

  // Manual EVV override (for supervisor use)
  async manualOverride(evvRecordId: string, data: {
    overrideReason: string;
    overrideBy: string;
  }) {
    return await prisma.eVVRecord.update({
      where: { id: evvRecordId },
      data: {
        verificationMethod: 'manual_override',
        isVerified: true,
        verificationNotes: `Manual override by ${data.overrideBy}: ${data.overrideReason}`,
      },
    });
  }

  // Capture signature for EVV
  async captureSignature(visitId: string, data: {
    signatureType: 'caregiver' | 'patient';
    signature: string;
    location: GeoLocation;
  }) {
    const updateData: any = {
      signedAt: new Date(),
    };

    if (data.signatureType === 'caregiver') {
      updateData.caregiverSignature = data.signature;
    } else {
      updateData.patientSignature = data.signature;
    }

    await prisma.homeVisit.update({
      where: { id: visitId },
      data: updateData,
    });

    // Record signature capture in EVV
    return await prisma.eVVRecord.create({
      data: {
        visitId,
        recordType: 'signature_capture',
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        verificationMethod: 'gps',
        isVerified: true,
        verificationNotes: `${data.signatureType} signature captured`,
      },
    });
  }
}

export default new EVVService();
