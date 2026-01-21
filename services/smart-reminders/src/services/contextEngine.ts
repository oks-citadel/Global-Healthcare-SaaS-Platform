/**
 * Context Engine
 * Gathers and manages contextual information for smart reminder delivery
 */

import { logger } from '../utils/logger.js';

// User context types
export interface UserContext {
  userId: string;
  patientId?: string;

  // Location context
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: string;
    locationId?: string;
    locationType?: string;
  };

  // Device context
  device?: {
    platform: 'ios' | 'android' | 'web';
    deviceId?: string;
    pushToken?: string;
    appVersion?: string;
    isOnline: boolean;
    batteryLevel?: number;
    isCharging?: boolean;
  };

  // Activity context
  activity?: {
    currentActivity: 'stationary' | 'walking' | 'running' | 'driving' | 'sleeping' | 'unknown';
    confidence: number;
    lastUpdated: string;
  };

  // Health context
  health?: {
    recentVitals?: Record<string, { value: number; unit: string; timestamp: string }>;
    activeMedications?: Array<{ id: string; name: string; nextDose?: string }>;
    activeConditions?: string[];
    lastAppointment?: string;
    nextAppointment?: string;
  };

  // Schedule context
  schedule?: {
    currentEvent?: {
      id: string;
      title: string;
      startTime: string;
      endTime: string;
    };
    nextEvent?: {
      id: string;
      title: string;
      startTime: string;
    };
    isBusy: boolean;
    isQuietHours: boolean;
  };

  // Preferences
  preferences?: {
    timezone: string;
    quietHoursStart: string;
    quietHoursEnd: string;
    preferredChannels: string[];
    language: string;
  };

  // Engagement context
  engagement?: {
    lastAppOpen: string;
    lastNotificationInteraction: string;
    averageResponseTime: number; // minutes
    preferredInteractionTimes: string[]; // HH:MM format
    snoozePatterns?: Record<string, number>; // category -> avg snooze count
  };

  retrievedAt: string;
}

// Context provider interfaces
interface LocationProvider {
  getLocation(userId: string): Promise<UserContext['location'] | undefined>;
}

interface DeviceProvider {
  getDeviceInfo(userId: string): Promise<UserContext['device'] | undefined>;
}

interface ActivityProvider {
  getCurrentActivity(userId: string): Promise<UserContext['activity'] | undefined>;
}

interface HealthProvider {
  getHealthContext(patientId: string): Promise<UserContext['health'] | undefined>;
}

interface ScheduleProvider {
  getScheduleContext(userId: string): Promise<UserContext['schedule'] | undefined>;
}

interface PreferencesProvider {
  getPreferences(userId: string): Promise<UserContext['preferences'] | undefined>;
}

interface EngagementProvider {
  getEngagementContext(userId: string): Promise<UserContext['engagement'] | undefined>;
}

// Mock implementations
class MockLocationProvider implements LocationProvider {
  async getLocation(userId: string): Promise<UserContext['location'] | undefined> {
    return {
      latitude: 40.7128,
      longitude: -74.006,
      accuracy: 10,
      timestamp: new Date().toISOString(),
      locationType: 'home',
    };
  }
}

class MockDeviceProvider implements DeviceProvider {
  async getDeviceInfo(userId: string): Promise<UserContext['device'] | undefined> {
    return {
      platform: 'ios',
      deviceId: `device-${userId}`,
      pushToken: `push-token-${userId}`,
      appVersion: '2.1.0',
      isOnline: true,
      batteryLevel: 75,
      isCharging: false,
    };
  }
}

class MockActivityProvider implements ActivityProvider {
  async getCurrentActivity(userId: string): Promise<UserContext['activity'] | undefined> {
    return {
      currentActivity: 'stationary',
      confidence: 0.95,
      lastUpdated: new Date().toISOString(),
    };
  }
}

class MockHealthProvider implements HealthProvider {
  async getHealthContext(patientId: string): Promise<UserContext['health'] | undefined> {
    return {
      recentVitals: {
        blood_pressure: {
          value: 120,
          unit: 'mmHg systolic',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        heart_rate: {
          value: 72,
          unit: 'bpm',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
      },
      activeMedications: [
        { id: 'med-1', name: 'Metformin', nextDose: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() },
        { id: 'med-2', name: 'Lisinopril', nextDose: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
      ],
      activeConditions: ['Type 2 Diabetes', 'Hypertension'],
      nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}

class MockScheduleProvider implements ScheduleProvider {
  async getScheduleContext(userId: string): Promise<UserContext['schedule'] | undefined> {
    const now = new Date();
    const currentHour = now.getHours();
    const isQuietHours = currentHour >= 22 || currentHour < 7;

    return {
      isBusy: false,
      isQuietHours,
      nextEvent: {
        id: 'event-1',
        title: 'Team Meeting',
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      },
    };
  }
}

class MockPreferencesProvider implements PreferencesProvider {
  async getPreferences(userId: string): Promise<UserContext['preferences'] | undefined> {
    return {
      timezone: 'America/New_York',
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
      preferredChannels: ['push', 'in_app'],
      language: 'en',
    };
  }
}

class MockEngagementProvider implements EngagementProvider {
  async getEngagementContext(userId: string): Promise<UserContext['engagement'] | undefined> {
    return {
      lastAppOpen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      lastNotificationInteraction: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      averageResponseTime: 5, // minutes
      preferredInteractionTimes: ['08:00', '12:00', '18:00', '21:00'],
    };
  }
}

// Context Engine
export class ContextEngine {
  private locationProvider: LocationProvider;
  private deviceProvider: DeviceProvider;
  private activityProvider: ActivityProvider;
  private healthProvider: HealthProvider;
  private scheduleProvider: ScheduleProvider;
  private preferencesProvider: PreferencesProvider;
  private engagementProvider: EngagementProvider;

  private contextCache: Map<string, { context: UserContext; expiresAt: number }> = new Map();
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutes

  constructor(providers?: {
    location?: LocationProvider;
    device?: DeviceProvider;
    activity?: ActivityProvider;
    health?: HealthProvider;
    schedule?: ScheduleProvider;
    preferences?: PreferencesProvider;
    engagement?: EngagementProvider;
  }) {
    this.locationProvider = providers?.location || new MockLocationProvider();
    this.deviceProvider = providers?.device || new MockDeviceProvider();
    this.activityProvider = providers?.activity || new MockActivityProvider();
    this.healthProvider = providers?.health || new MockHealthProvider();
    this.scheduleProvider = providers?.schedule || new MockScheduleProvider();
    this.preferencesProvider = providers?.preferences || new MockPreferencesProvider();
    this.engagementProvider = providers?.engagement || new MockEngagementProvider();
  }

  async getFullContext(userId: string, patientId?: string): Promise<UserContext> {
    // Check cache first
    const cacheKey = `${userId}-${patientId || 'no-patient'}`;
    const cached = this.contextCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      logger.debug(`Returning cached context for user ${userId}`);
      return cached.context;
    }

    logger.info(`Gathering full context for user ${userId}`);

    try {
      // Gather all context in parallel
      const [
        location,
        device,
        activity,
        health,
        schedule,
        preferences,
        engagement,
      ] = await Promise.all([
        this.locationProvider.getLocation(userId).catch(() => undefined),
        this.deviceProvider.getDeviceInfo(userId).catch(() => undefined),
        this.activityProvider.getCurrentActivity(userId).catch(() => undefined),
        patientId
          ? this.healthProvider.getHealthContext(patientId).catch(() => undefined)
          : Promise.resolve(undefined),
        this.scheduleProvider.getScheduleContext(userId).catch(() => undefined),
        this.preferencesProvider.getPreferences(userId).catch(() => undefined),
        this.engagementProvider.getEngagementContext(userId).catch(() => undefined),
      ]);

      const context: UserContext = {
        userId,
        patientId,
        location,
        device,
        activity,
        health,
        schedule,
        preferences,
        engagement,
        retrievedAt: new Date().toISOString(),
      };

      // Update cache
      this.contextCache.set(cacheKey, {
        context,
        expiresAt: Date.now() + this.cacheTTL,
      });

      return context;
    } catch (error) {
      logger.error(`Error gathering context for user ${userId}:`, { error });
      throw error;
    }
  }

  async getMinimalContext(userId: string): Promise<Partial<UserContext>> {
    // Get only essential context for quick decisions
    const [device, preferences, schedule] = await Promise.all([
      this.deviceProvider.getDeviceInfo(userId).catch(() => undefined),
      this.preferencesProvider.getPreferences(userId).catch(() => undefined),
      this.scheduleProvider.getScheduleContext(userId).catch(() => undefined),
    ]);

    return {
      userId,
      device,
      preferences,
      schedule,
      retrievedAt: new Date().toISOString(),
    };
  }

  isGoodTimeToNotify(context: UserContext): {
    canNotify: boolean;
    reason: string;
    suggestedDelay?: number;
  } {
    // Check quiet hours
    if (context.schedule?.isQuietHours) {
      const now = new Date();
      const quietEnd = context.preferences?.quietHoursEnd || '07:00';
      const [endHour, endMinute] = quietEnd.split(':').map(Number);
      const endTime = new Date(now);
      endTime.setHours(endHour, endMinute, 0, 0);
      if (endTime < now) {
        endTime.setDate(endTime.getDate() + 1);
      }
      const delayMs = endTime.getTime() - now.getTime();

      return {
        canNotify: false,
        reason: 'User is in quiet hours',
        suggestedDelay: delayMs,
      };
    }

    // Check if user is busy
    if (context.schedule?.currentEvent) {
      const eventEnd = new Date(context.schedule.currentEvent.endTime);
      const delayMs = eventEnd.getTime() - Date.now();

      if (delayMs > 0) {
        return {
          canNotify: false,
          reason: `User is in event: ${context.schedule.currentEvent.title}`,
          suggestedDelay: delayMs,
        };
      }
    }

    // Check activity - don't notify while driving
    if (context.activity?.currentActivity === 'driving') {
      return {
        canNotify: false,
        reason: 'User appears to be driving',
        suggestedDelay: 30 * 60 * 1000, // 30 minutes
      };
    }

    // Check device status
    if (context.device && !context.device.isOnline) {
      return {
        canNotify: false,
        reason: 'Device is offline',
        suggestedDelay: 5 * 60 * 1000, // 5 minutes
      };
    }

    // Check battery (don't drain battery with non-urgent notifications)
    if (context.device?.batteryLevel && context.device.batteryLevel < 10 && !context.device.isCharging) {
      return {
        canNotify: false,
        reason: 'Device battery is critically low',
        suggestedDelay: 15 * 60 * 1000, // 15 minutes
      };
    }

    return {
      canNotify: true,
      reason: 'Good time to notify',
    };
  }

  getBestChannel(context: UserContext): string {
    const preferredChannels = context.preferences?.preferredChannels || ['push', 'in_app'];

    // If user recently used the app, prefer in-app
    if (context.engagement?.lastAppOpen) {
      const lastOpen = new Date(context.engagement.lastAppOpen);
      const minutesSinceOpen = (Date.now() - lastOpen.getTime()) / (60 * 1000);

      if (minutesSinceOpen < 5 && preferredChannels.includes('in_app')) {
        return 'in_app';
      }
    }

    // Default to first preferred channel that's available
    if (context.device?.pushToken && preferredChannels.includes('push')) {
      return 'push';
    }

    return preferredChannels[0] || 'in_app';
  }

  clearCache(userId?: string): void {
    if (userId) {
      for (const key of this.contextCache.keys()) {
        if (key.startsWith(userId)) {
          this.contextCache.delete(key);
        }
      }
    } else {
      this.contextCache.clear();
    }
  }
}

export default ContextEngine;
