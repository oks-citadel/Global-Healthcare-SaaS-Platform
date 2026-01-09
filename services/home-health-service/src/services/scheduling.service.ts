import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface RouteStop {
  visitId: string;
  patientId: string;
  address: string;
  location: GeoLocation;
  scheduledStartTime: string;
  scheduledEndTime: string;
  estimatedDuration: number;
  priority: string;
  visitType: string;
}

export interface OptimizedRoute {
  caregiverId: string;
  date: Date;
  stops: RouteStop[];
  totalDistance: number; // miles
  totalDuration: number; // minutes
  estimatedStartTime: string;
  estimatedEndTime: string;
}

export interface CaregiverMatch {
  caregiverId: string;
  caregiverName: string;
  matchScore: number;
  distance: number;
  availableSlots: string[];
  specialties: string[];
  languages: string[];
}

export class SchedulingService {
  // Calculate distance between two points using Haversine formula
  private calculateDistance(point1: GeoLocation, point2: GeoLocation): number {
    const R = 3959; // Earth's radius in miles
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

  // Find available caregivers for a patient based on location, skills, and availability
  async findMatchingCaregivers(options: {
    patientLocation: GeoLocation;
    visitType: string;
    requiredSpecialties?: string[];
    preferredLanguage?: string;
    date: Date;
    duration: number;
  }): Promise<CaregiverMatch[]> {
    const dayOfWeek = options.date.getDay();

    // Get all active caregivers with their schedules
    const caregivers = await prisma.caregiver.findMany({
      where: {
        status: 'active',
      },
      include: {
        schedules: {
          where: { dayOfWeek, isAvailable: true },
        },
        visits: {
          where: {
            scheduledDate: {
              gte: new Date(options.date.setHours(0, 0, 0, 0)),
              lt: new Date(options.date.setHours(23, 59, 59, 999)),
            },
            status: { in: ['scheduled', 'confirmed'] },
          },
        },
      },
    });

    const matches: CaregiverMatch[] = [];

    for (const caregiver of caregivers) {
      // Check if caregiver has home location set
      if (!caregiver.homeLatitude || !caregiver.homeLongitude) continue;

      // Calculate distance from caregiver to patient
      const distance = this.calculateDistance(
        { latitude: caregiver.homeLatitude, longitude: caregiver.homeLongitude },
        options.patientLocation
      );

      // Check if within service radius
      if (distance > caregiver.serviceRadius) continue;

      // Calculate match score
      let matchScore = 100;

      // Distance factor (closer = higher score)
      matchScore -= (distance / caregiver.serviceRadius) * 20;

      // Check specialties
      if (options.requiredSpecialties && options.requiredSpecialties.length > 0) {
        const matchedSpecialties = options.requiredSpecialties.filter(s =>
          caregiver.specialties.includes(s)
        );
        if (matchedSpecialties.length === 0) {
          matchScore -= 30;
        } else {
          matchScore += (matchedSpecialties.length / options.requiredSpecialties.length) * 10;
        }
      }

      // Check language preference
      if (options.preferredLanguage && caregiver.languages.includes(options.preferredLanguage)) {
        matchScore += 10;
      }

      // Check daily visit limit
      const scheduledVisitsCount = caregiver.visits.length;
      if (scheduledVisitsCount >= caregiver.maxDailyVisits) continue;

      // Calculate available slots
      const availableSlots = this.calculateAvailableSlots(
        caregiver.schedules[0],
        caregiver.visits,
        options.duration
      );

      if (availableSlots.length === 0) continue;

      matches.push({
        caregiverId: caregiver.id,
        caregiverName: `${caregiver.firstName} ${caregiver.lastName}`,
        matchScore: Math.max(0, Math.min(100, matchScore)),
        distance,
        availableSlots,
        specialties: caregiver.specialties,
        languages: caregiver.languages,
      });
    }

    // Sort by match score (descending)
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  private calculateAvailableSlots(
    schedule: any,
    existingVisits: any[],
    duration: number
  ): string[] {
    if (!schedule) return [];

    const slots: string[] = [];
    const startMinutes = this.timeToMinutes(schedule.startTime);
    const endMinutes = this.timeToMinutes(schedule.endTime);

    // Get busy periods from existing visits
    const busyPeriods = existingVisits.map(v => ({
      start: this.timeToMinutes(v.scheduledStartTime),
      end: this.timeToMinutes(v.scheduledEndTime),
    }));

    // Generate 30-minute slots
    for (let time = startMinutes; time + duration <= endMinutes; time += 30) {
      const slotEnd = time + duration;
      const isAvailable = !busyPeriods.some(
        period => time < period.end && slotEnd > period.start
      );

      if (isAvailable) {
        slots.push(this.minutesToTime(time));
      }
    }

    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // Optimize route for a caregiver's daily visits
  async optimizeRoute(caregiverId: string, date: Date): Promise<OptimizedRoute> {
    const caregiver = await prisma.caregiver.findUnique({
      where: { id: caregiverId },
    });

    if (!caregiver) throw new Error('Caregiver not found');

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const visits = await prisma.homeVisit.findMany({
      where: {
        caregiverId,
        scheduledDate: { gte: startOfDay, lte: endOfDay },
        status: { in: ['scheduled', 'confirmed'] },
      },
      include: {
        patientHome: true,
      },
      orderBy: { scheduledStartTime: 'asc' },
    });

    if (visits.length === 0) {
      return {
        caregiverId,
        date,
        stops: [],
        totalDistance: 0,
        totalDuration: 0,
        estimatedStartTime: '',
        estimatedEndTime: '',
      };
    }

    // Build stops array
    const stops: RouteStop[] = visits.map(visit => ({
      visitId: visit.id,
      patientId: visit.patientId,
      address: visit.patientHome.address,
      location: {
        latitude: visit.patientHome.latitude || 0,
        longitude: visit.patientHome.longitude || 0,
      },
      scheduledStartTime: visit.scheduledStartTime,
      scheduledEndTime: visit.scheduledEndTime,
      estimatedDuration: visit.estimatedDuration,
      priority: visit.priority,
      visitType: visit.visitType,
    }));

    // Calculate distances between consecutive stops
    let totalDistance = 0;
    const caregiverHome: GeoLocation = {
      latitude: caregiver.homeLatitude || 0,
      longitude: caregiver.homeLongitude || 0,
    };

    // Distance from home to first stop
    if (stops.length > 0 && stops[0].location.latitude !== 0) {
      totalDistance += this.calculateDistance(caregiverHome, stops[0].location);
    }

    // Distances between stops
    for (let i = 0; i < stops.length - 1; i++) {
      if (stops[i].location.latitude !== 0 && stops[i + 1].location.latitude !== 0) {
        totalDistance += this.calculateDistance(stops[i].location, stops[i + 1].location);
      }
    }

    // Distance from last stop back home
    if (stops.length > 0 && stops[stops.length - 1].location.latitude !== 0) {
      totalDistance += this.calculateDistance(stops[stops.length - 1].location, caregiverHome);
    }

    // Calculate total duration (visit time + estimated travel time)
    const totalVisitDuration = stops.reduce((sum, s) => sum + s.estimatedDuration, 0);
    const estimatedTravelTime = Math.round((totalDistance / 30) * 60); // Assume 30 mph average
    const totalDuration = totalVisitDuration + estimatedTravelTime;

    return {
      caregiverId,
      date,
      stops,
      totalDistance: Math.round(totalDistance * 100) / 100,
      totalDuration,
      estimatedStartTime: stops[0]?.scheduledStartTime || '',
      estimatedEndTime: stops[stops.length - 1]?.scheduledEndTime || '',
    };
  }

  // Get caregiver's schedule for a week
  async getCaregiverWeeklySchedule(caregiverId: string, startDate: Date) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    const [schedule, visits] = await Promise.all([
      prisma.caregiverSchedule.findMany({
        where: { caregiverId },
        orderBy: { dayOfWeek: 'asc' },
      }),
      prisma.homeVisit.findMany({
        where: {
          caregiverId,
          scheduledDate: { gte: startDate, lt: endDate },
          status: { in: ['scheduled', 'confirmed', 'in_progress'] },
        },
        include: { patientHome: true },
        orderBy: [{ scheduledDate: 'asc' }, { scheduledStartTime: 'asc' }],
      }),
    ]);

    // Group visits by date
    const visitsByDate: Record<string, typeof visits> = {};
    visits.forEach(visit => {
      const dateKey = visit.scheduledDate.toISOString().split('T')[0];
      if (!visitsByDate[dateKey]) visitsByDate[dateKey] = [];
      visitsByDate[dateKey].push(visit);
    });

    return {
      caregiverId,
      startDate,
      endDate,
      schedule,
      visitsByDate,
      totalVisits: visits.length,
    };
  }

  // Update caregiver's current location
  async updateCaregiverLocation(caregiverId: string, location: GeoLocation) {
    return await prisma.caregiver.update({
      where: { id: caregiverId },
      data: {
        currentLatitude: location.latitude,
        currentLongitude: location.longitude,
        lastLocationUpdate: new Date(),
      },
    });
  }

  // Get estimated arrival time for next visit
  async getEstimatedArrival(caregiverId: string, visitId: string): Promise<{
    estimatedMinutes: number;
    distance: number;
  } | null> {
    const [caregiver, visit] = await Promise.all([
      prisma.caregiver.findUnique({ where: { id: caregiverId } }),
      prisma.homeVisit.findUnique({
        where: { id: visitId },
        include: { patientHome: true },
      }),
    ]);

    if (!caregiver || !visit) return null;
    if (!caregiver.currentLatitude || !caregiver.currentLongitude) return null;
    if (!visit.patientHome.latitude || !visit.patientHome.longitude) return null;

    const distance = this.calculateDistance(
      { latitude: caregiver.currentLatitude, longitude: caregiver.currentLongitude },
      { latitude: visit.patientHome.latitude, longitude: visit.patientHome.longitude }
    );

    // Estimate time based on 25 mph average speed in residential areas
    const estimatedMinutes = Math.round((distance / 25) * 60);

    return { estimatedMinutes, distance: Math.round(distance * 100) / 100 };
  }

  // Auto-assign caregiver to unassigned visits
  async autoAssignCaregivers(date: Date) {
    // Find visits without caregivers or pending assignment
    const unassignedVisits = await prisma.homeVisit.findMany({
      where: {
        scheduledDate: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(23, 59, 59, 999)),
        },
        status: 'scheduled',
        // caregiverId is null or needs reassignment logic
      },
      include: { patientHome: true },
    });

    const assignments: { visitId: string; caregiverId: string; caregiverName: string }[] = [];

    for (const visit of unassignedVisits) {
      if (!visit.patientHome.latitude || !visit.patientHome.longitude) continue;

      const matches = await this.findMatchingCaregivers({
        patientLocation: {
          latitude: visit.patientHome.latitude,
          longitude: visit.patientHome.longitude,
        },
        visitType: visit.visitType,
        date,
        duration: visit.estimatedDuration,
      });

      if (matches.length > 0) {
        const bestMatch = matches[0];
        await prisma.homeVisit.update({
          where: { id: visit.id },
          data: { caregiverId: bestMatch.caregiverId },
        });
        assignments.push({
          visitId: visit.id,
          caregiverId: bestMatch.caregiverId,
          caregiverName: bestMatch.caregiverName,
        });
      }
    }

    return assignments;
  }

  // Record mileage for a caregiver
  async recordMileage(data: {
    caregiverId: string;
    startAddress: string;
    endAddress: string;
    distance: number;
    purpose?: string;
    startLocation?: GeoLocation;
    endLocation?: GeoLocation;
    routeData?: any;
  }) {
    const ratePerMile = 0.67; // 2024 IRS standard mileage rate

    return await prisma.mileageEntry.create({
      data: {
        caregiverId: data.caregiverId,
        startAddress: data.startAddress,
        endAddress: data.endAddress,
        distance: data.distance,
        purpose: data.purpose,
        startLatitude: data.startLocation?.latitude,
        startLongitude: data.startLocation?.longitude,
        endLatitude: data.endLocation?.latitude,
        endLongitude: data.endLocation?.longitude,
        routeData: data.routeData,
        ratePerMile,
        totalAmount: data.distance * ratePerMile,
      },
    });
  }

  // Get mileage summary for a caregiver
  async getMileageSummary(caregiverId: string, startDate: Date, endDate: Date) {
    const entries = await prisma.mileageEntry.findMany({
      where: {
        caregiverId,
        date: { gte: startDate, lte: endDate },
      },
    });

    return {
      totalEntries: entries.length,
      totalMiles: entries.reduce((sum, e) => sum + e.distance, 0),
      totalAmount: entries.reduce((sum, e) => sum + (e.totalAmount || 0), 0),
      pendingApproval: entries.filter(e => e.status === 'pending').length,
      approved: entries.filter(e => e.status === 'approved').length,
    };
  }
}

export default new SchedulingService();
