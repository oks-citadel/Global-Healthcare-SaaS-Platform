/**
 * Travel Trigger
 * Evaluates travel-related conditions for smart reminders
 */

import {
  TriggerCondition,
  TriggerEvaluationResult,
  TravelConditionParams,
} from '../models/TriggerCondition.js';
import { logger } from '../utils/logger.js';

// Travel itinerary interface
interface TravelItinerary {
  id: string;
  userId: string;
  trips: TravelTrip[];
}

interface TravelTrip {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'cruise' | 'other';
  status: 'confirmed' | 'pending' | 'cancelled';

  departure: {
    location: string;
    city: string;
    country: string;
    countryCode: string;
    timezone: string;
    dateTime: string;
  };

  arrival: {
    location: string;
    city: string;
    country: string;
    countryCode: string;
    timezone: string;
    dateTime: string;
  };

  returnTrip?: {
    departureDateTime: string;
    arrivalDateTime: string;
  };

  durationHours: number;
  isInternational: boolean;
  timezoneChangeHours: number;
  healthAdvisories?: string[];
  requiredVaccinations?: string[];
}

// Travel service interface
interface TravelService {
  getUpcomingTrips(userId: string, daysAhead?: number): Promise<TravelItinerary>;
  getTripById(tripId: string): Promise<TravelTrip | null>;
}

// Mock travel service
class MockTravelService implements TravelService {
  async getUpcomingTrips(userId: string, daysAhead: number = 30): Promise<TravelItinerary> {
    // Return mock data - in production, this would integrate with calendar,
    // email parsing, or travel booking services
    const now = new Date();

    return {
      id: `itinerary-${userId}`,
      userId,
      trips: [
        {
          id: 'trip-1',
          type: 'flight',
          status: 'confirmed',
          departure: {
            location: 'JFK',
            city: 'New York',
            country: 'United States',
            countryCode: 'US',
            timezone: 'America/New_York',
            dateTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          arrival: {
            location: 'LAX',
            city: 'Los Angeles',
            country: 'United States',
            countryCode: 'US',
            timezone: 'America/Los_Angeles',
            dateTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
          },
          returnTrip: {
            departureDateTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            arrivalDateTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
          },
          durationHours: 6,
          isInternational: false,
          timezoneChangeHours: 3,
          healthAdvisories: [],
          requiredVaccinations: [],
        },
      ],
    };
  }

  async getTripById(tripId: string): Promise<TravelTrip | null> {
    const itinerary = await this.getUpcomingTrips('mock-user');
    return itinerary.trips.find((t) => t.id === tripId) || null;
  }
}

// Travel trigger evaluator
export class TravelTrigger {
  private travelService: TravelService;
  private userTimezone: string;

  constructor(travelService?: TravelService) {
    this.travelService = travelService || new MockTravelService();
    this.userTimezone = 'America/New_York'; // Default, should be from user settings
  }

  async evaluate(
    trigger: TriggerCondition,
    userContext: {
      userId: string;
      homeTimezone?: string;
    }
  ): Promise<TriggerEvaluationResult> {
    const params = trigger.travelParams;
    if (!params) {
      return this.createResult(trigger, false, 'No travel parameters configured');
    }

    if (userContext.homeTimezone) {
      this.userTimezone = userContext.homeTimezone;
    }

    try {
      // Get upcoming trips
      const itinerary = await this.travelService.getUpcomingTrips(
        userContext.userId,
        14 // Look 2 weeks ahead
      );

      if (!itinerary.trips || itinerary.trips.length === 0) {
        return this.createResult(trigger, false, 'No upcoming trips found');
      }

      const now = new Date();
      const results: Array<{ condition: string; met: boolean; detail: string; trip?: TravelTrip }> = [];

      for (const trip of itinerary.trips) {
        if (trip.status === 'cancelled') continue;

        const departureTime = new Date(trip.departure.dateTime);
        const arrivalTime = new Date(trip.arrival.dateTime);
        const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        const hoursUntilArrival = (arrivalTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Check travel type
        if (params.travelType && params.travelType !== 'any') {
          if (trip.type !== params.travelType) continue;
        }

        // Check destination type
        if (params.destinationType && params.destinationType !== 'any') {
          const isInternational = trip.isInternational;
          if (params.destinationType === 'international' && !isInternational) continue;
          if (params.destinationType === 'domestic' && isInternational) continue;
        }

        // Check timezone change
        if (params.timezoneChange) {
          if (trip.timezoneChangeHours === 0) continue;
          if (params.timezoneChangeHours && trip.timezoneChangeHours < params.timezoneChangeHours) {
            continue;
          }
        }

        // Check travel duration
        if (params.travelDurationHours) {
          if (params.travelDurationHours.min && trip.durationHours < params.travelDurationHours.min) {
            continue;
          }
          if (params.travelDurationHours.max && trip.durationHours > params.travelDurationHours.max) {
            continue;
          }
        }

        // Check departure window
        if (params.departureWindow) {
          const hoursBefore = params.departureWindow.hoursBefore || 24;
          const hoursAfter = params.departureWindow.hoursAfter || 0;

          if (hoursUntilDeparture <= hoursBefore && hoursUntilDeparture >= -hoursAfter) {
            results.push({
              condition: 'departure_window',
              met: true,
              detail: `Departure in ${hoursUntilDeparture.toFixed(1)} hours (within ${hoursBefore}h before to ${hoursAfter}h after window)`,
              trip,
            });
          }
        }

        // Check return window
        if (params.returnWindow && trip.returnTrip) {
          const returnDeparture = new Date(trip.returnTrip.departureDateTime);
          const hoursUntilReturn = (returnDeparture.getTime() - now.getTime()) / (1000 * 60 * 60);
          const hoursBefore = params.returnWindow.hoursBefore || 0;
          const hoursAfter = params.returnWindow.hoursAfter || 24;

          if (hoursUntilReturn >= -hoursBefore && hoursUntilReturn <= hoursAfter) {
            results.push({
              condition: 'return_window',
              met: true,
              detail: `Return trip in ${hoursUntilReturn.toFixed(1)} hours`,
              trip,
            });
          }
        }

        // Check high risk destination
        if (params.highRiskDestination && trip.healthAdvisories && trip.healthAdvisories.length > 0) {
          results.push({
            condition: 'high_risk_destination',
            met: true,
            detail: `Health advisories for ${trip.arrival.city}: ${trip.healthAdvisories.join(', ')}`,
            trip,
          });
        }

        // Check required vaccinations
        if (params.requiresVaccination && trip.requiredVaccinations && trip.requiredVaccinations.length > 0) {
          results.push({
            condition: 'vaccination_required',
            met: true,
            detail: `Vaccinations required: ${trip.requiredVaccinations.join(', ')}`,
            trip,
          });
        }

        // If no specific window set, check if there's an upcoming trip within default window
        if (!params.departureWindow && !params.returnWindow) {
          if (hoursUntilDeparture > 0 && hoursUntilDeparture <= 48) {
            results.push({
              condition: 'upcoming_travel',
              met: true,
              detail: `Trip to ${trip.arrival.city} departing in ${hoursUntilDeparture.toFixed(1)} hours`,
              trip,
            });
          }
        }
      }

      const triggered = results.filter((r) => r.met).length > 0;
      const matchedTrips = results.filter((r) => r.met).map((r) => r.trip);

      logger.info(
        `Travel trigger ${trigger.id} evaluated: ${triggered ? 'TRIGGERED' : 'NOT TRIGGERED'}`,
        {
          triggerId: trigger.id,
          tripsEvaluated: itinerary.trips.length,
          triggered,
          matchedTrips: matchedTrips.length,
        }
      );

      return this.createResult(
        trigger,
        triggered,
        triggered
          ? `Travel conditions met: ${results.filter((r) => r.met).map((r) => r.detail).join('; ')}`
          : 'No travel conditions met',
        {
          upcomingTrips: itinerary.trips.map((t) => ({
            id: t.id,
            type: t.type,
            destination: t.arrival.city,
            departureTime: t.departure.dateTime,
            isInternational: t.isInternational,
            timezoneChange: t.timezoneChangeHours,
          })),
          matchedConditions: results.filter((r) => r.met),
        }
      );
    } catch (error) {
      logger.error(`Travel trigger evaluation failed: ${error}`, {
        triggerId: trigger.id,
        error,
      });
      return this.createResult(trigger, false, `Evaluation error: ${error}`);
    }
  }

  private createResult(
    trigger: TriggerCondition,
    triggered: boolean,
    reason: string,
    context?: Record<string, unknown>
  ): TriggerEvaluationResult {
    return {
      triggerId: trigger.id,
      triggerType: 'travel',
      triggered,
      evaluatedAt: new Date().toISOString(),
      reason,
      context,
      confidence: triggered ? 0.9 : 1.0,
      nextEvaluationAt: new Date(
        Date.now() + trigger.evaluationIntervalMinutes * 60 * 1000
      ).toISOString(),
    };
  }
}

export default TravelTrigger;
