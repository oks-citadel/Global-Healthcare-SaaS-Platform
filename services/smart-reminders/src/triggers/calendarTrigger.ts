/**
 * Calendar Trigger
 * Evaluates calendar-based conditions for smart reminders
 */

import {
  TriggerCondition,
  TriggerEvaluationResult,
  // @ts-ignore - CalendarConditionParams imported for type reference
  CalendarConditionParams,
} from '../models/TriggerCondition.js';
import { logger } from '../utils/logger.js';

// Calendar event interface
interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  status: 'confirmed' | 'tentative' | 'cancelled';
  busyStatus: 'busy' | 'free' | 'tentative' | 'out_of_office';
  eventType?: 'appointment' | 'meeting' | 'travel' | 'exercise' | 'meal' | 'medication' | 'custom';
  attendees?: Array<{
    email: string;
    name?: string;
    status: 'accepted' | 'declined' | 'tentative' | 'pending';
  }>;
  reminders?: Array<{
    method: 'popup' | 'email';
    minutes: number;
  }>;
  metadata?: Record<string, unknown>;
}

// Calendar service interface
interface CalendarService {
  getEvents(
    userId: string,
    startDate: Date,
    endDate: Date,
    calendarIds?: string[]
  ): Promise<CalendarEvent[]>;
  getEventById(eventId: string): Promise<CalendarEvent | null>;
}

// Mock calendar service
class MockCalendarService implements CalendarService {
  async getEvents(
    _userId: string,
    _startDate: Date,
    _endDate: Date,
    _calendarIds?: string[]
  ): Promise<CalendarEvent[]> {
    const now = new Date();

    // Generate some mock events
    return [
      {
        id: 'event-1',
        calendarId: 'primary',
        title: 'Doctor Appointment',
        description: 'Annual checkup with Dr. Smith',
        location: 'Medical Center',
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        allDay: false,
        status: 'confirmed',
        busyStatus: 'busy',
        eventType: 'appointment',
      },
      {
        id: 'event-2',
        calendarId: 'primary',
        title: 'Team Meeting',
        description: 'Weekly sync',
        startTime: new Date(now.getTime() + 5 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        allDay: false,
        status: 'confirmed',
        busyStatus: 'busy',
        eventType: 'meeting',
      },
      {
        id: 'event-3',
        calendarId: 'personal',
        title: 'Gym Session',
        description: 'Cardio workout',
        location: 'Fitness Center',
        startTime: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString(),
        allDay: false,
        status: 'confirmed',
        busyStatus: 'busy',
        eventType: 'exercise',
      },
    ];
  }

  async getEventById(eventId: string): Promise<CalendarEvent | null> {
    const events = await this.getEvents('mock', new Date(), new Date(Date.now() + 24 * 60 * 60 * 1000));
    return events.find((e) => e.id === eventId) || null;
  }
}

// Calendar trigger evaluator
export class CalendarTrigger {
  private calendarService: CalendarService;

  constructor(calendarService?: CalendarService) {
    this.calendarService = calendarService || new MockCalendarService();
  }

  async evaluate(
    trigger: TriggerCondition,
    userContext: {
      userId: string;
      timezone?: string;
    }
  ): Promise<TriggerEvaluationResult> {
    const params = trigger.calendarParams;
    if (!params) {
      return this.createResult(trigger, false, 'No calendar parameters configured');
    }

    try {
      const now = new Date();
      const lookAheadHours = Math.max(
        params.beforeEvent?.minutes ? params.beforeEvent.minutes / 60 + 2 : 4,
        params.noEventsFor?.hours || 4
      );

      // Get events for evaluation window
      const events = await this.calendarService.getEvents(
        userContext.userId,
        new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago (for "during event")
        new Date(now.getTime() + lookAheadHours * 60 * 60 * 1000),
        params.calendarIds
      );

      // Filter out cancelled events
      const activeEvents = events.filter((e) => e.status !== 'cancelled');

      const results: Array<{ condition: string; met: boolean; detail: string; event?: CalendarEvent }> = [];

      // Filter by event types if specified
      let relevantEvents = activeEvents;
      if (params.eventTypes && params.eventTypes.length > 0) {
        relevantEvents = activeEvents.filter(
          (e) => e.eventType && params.eventTypes!.includes(e.eventType as any)
        );
      }

      // Filter by keywords if specified
      if (params.eventKeywords && params.eventKeywords.length > 0) {
        relevantEvents = relevantEvents.filter((e) => {
          const searchText = `${e.title} ${e.description || ''} ${e.location || ''}`.toLowerCase();
          return params.eventKeywords!.some((kw) => searchText.includes(kw.toLowerCase()));
        });
      }

      // Filter by busy status if specified
      if (params.busyStatus) {
        relevantEvents = relevantEvents.filter((e) => e.busyStatus === params.busyStatus);
      }

      // Check "before event" condition
      if (params.beforeEvent) {
        const minutesBefore = params.beforeEvent.minutes;
        const windowStart = now;
        const windowEnd = new Date(now.getTime() + minutesBefore * 60 * 1000);

        for (const event of relevantEvents) {
          const eventStart = new Date(event.startTime);
          if (eventStart >= windowStart && eventStart <= windowEnd) {
            const minutesUntil = Math.round((eventStart.getTime() - now.getTime()) / (60 * 1000));
            results.push({
              condition: 'before_event',
              met: true,
              detail: `"${event.title}" starts in ${minutesUntil} minutes`,
              event,
            });
          }
        }
      }

      // Check "after event" condition
      if (params.afterEvent) {
        const minutesAfter = params.afterEvent.minutes;

        for (const event of relevantEvents) {
          const eventEnd = new Date(event.endTime);
          const minutesSinceEnd = Math.round((now.getTime() - eventEnd.getTime()) / (60 * 1000));

          if (minutesSinceEnd >= 0 && minutesSinceEnd <= minutesAfter) {
            results.push({
              condition: 'after_event',
              met: true,
              detail: `"${event.title}" ended ${minutesSinceEnd} minutes ago`,
              event,
            });
          }
        }
      }

      // Check "during event" condition
      if (params.duringEvent) {
        for (const event of relevantEvents) {
          const eventStart = new Date(event.startTime);
          const eventEnd = new Date(event.endTime);

          if (now >= eventStart && now <= eventEnd) {
            results.push({
              condition: 'during_event',
              met: true,
              detail: `Currently during "${event.title}"`,
              event,
            });
          }
        }
      }

      // Check "no events for X hours" condition
      if (params.noEventsFor && params.noEventsFor.hours) {
        const windowEnd = new Date(now.getTime() + params.noEventsFor.hours * 60 * 60 * 1000);
        const upcomingEvents = relevantEvents.filter((e) => {
          const eventStart = new Date(e.startTime);
          return eventStart >= now && eventStart <= windowEnd;
        });

        if (upcomingEvents.length === 0) {
          results.push({
            condition: 'no_events',
            met: true,
            detail: `No events for the next ${params.noEventsFor.hours} hours`,
          });
        }
      }

      // If no specific timing condition, check for any matching events
      if (!params.beforeEvent && !params.afterEvent && !params.duringEvent && !params.noEventsFor) {
        // Default: trigger if there are relevant upcoming events within 2 hours
        const upcomingEvents = relevantEvents.filter((e) => {
          const eventStart = new Date(e.startTime);
          const hoursUntil = (eventStart.getTime() - now.getTime()) / (60 * 60 * 1000);
          return hoursUntil > 0 && hoursUntil <= 2;
        });

        for (const event of upcomingEvents) {
          const minutesUntil = Math.round(
            (new Date(event.startTime).getTime() - now.getTime()) / (60 * 1000)
          );
          results.push({
            condition: 'upcoming_event',
            met: true,
            detail: `"${event.title}" in ${minutesUntil} minutes`,
            event,
          });
        }
      }

      const triggered = results.filter((r) => r.met).length > 0;

      logger.info(
        `Calendar trigger ${trigger.id} evaluated: ${triggered ? 'TRIGGERED' : 'NOT TRIGGERED'}`,
        {
          triggerId: trigger.id,
          eventsFound: activeEvents.length,
          relevantEvents: relevantEvents.length,
          triggered,
        }
      );

      return this.createResult(
        trigger,
        triggered,
        triggered
          ? results.filter((r) => r.met).map((r) => r.detail).join('; ')
          : 'No calendar conditions met',
        {
          upcomingEvents: relevantEvents.slice(0, 5).map((e) => ({
            id: e.id,
            title: e.title,
            startTime: e.startTime,
            eventType: e.eventType,
          })),
          matchedConditions: results.filter((r) => r.met),
        }
      );
    } catch (error) {
      logger.error(`Calendar trigger evaluation failed: ${error}`, {
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
      triggerType: 'calendar',
      triggered,
      evaluatedAt: new Date().toISOString(),
      reason,
      context,
      confidence: triggered ? 0.95 : 1.0,
      nextEvaluationAt: new Date(
        Date.now() + trigger.evaluationIntervalMinutes * 60 * 1000
      ).toISOString(),
    };
  }
}

export default CalendarTrigger;
