/**
 * Audit Event Emitter
 * Creates and manages audit events based on country requirements
 */

import { CountryConfigLoader } from '@global-health/country-config';
import type { AuditEvent, AuditEventType } from './types';

export interface AuditEventListener {
  (event: AuditEvent): void | Promise<void>;
}

export class AuditEmitter {
  private static listeners: AuditEventListener[] = [];
  private static events: AuditEvent[] = [];
  private static readonly MAX_EVENTS = 10000; // In-memory limit

  /**
   * Emit an audit event
   */
  static async emit(
    type: AuditEventType,
    action: string,
    outcome: 'success' | 'failure',
    context: {
      userId?: string;
      patientId?: string;
      resourceType?: string;
      resourceId?: string;
      countryCode?: string;
      ipAddress?: string;
      userAgent?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    const event: AuditEvent = {
      id: this.generateEventId(),
      type,
      timestamp: new Date().toISOString(),
      action,
      outcome,
      ...context,
    };

    // Check if this event type is required for the country
    if (context.countryCode) {
      const config = CountryConfigLoader.load(context.countryCode);
      if (config && config.audit.required) {
        if (!config.audit.requiredEvents.includes(type)) {
          // Event not required, but we'll still record it
          if (event.metadata) {
            event.metadata.optional = true;
          } else {
            event.metadata = { optional: true };
          }
        }
      }
    }

    // Store event
    this.storeEvent(event);

    // Notify listeners
    await this.notifyListeners(event);
  }

  /**
   * Add an event listener
   */
  static addListener(listener: AuditEventListener): void {
    this.listeners.push(listener);
  }

  /**
   * Remove an event listener
   */
  static removeListener(listener: AuditEventListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Remove all listeners
   */
  static removeAllListeners(): void {
    this.listeners = [];
  }

  /**
   * Get all audit events
   */
  static getEvents(filter?: {
    userId?: string;
    patientId?: string;
    type?: AuditEventType;
    startDate?: string;
    endDate?: string;
  }): AuditEvent[] {
    let filtered = [...this.events];

    if (filter) {
      if (filter.userId) {
        filtered = filtered.filter(e => e.userId === filter.userId);
      }
      if (filter.patientId) {
        filtered = filtered.filter(e => e.patientId === filter.patientId);
      }
      if (filter.type) {
        filtered = filtered.filter(e => e.type === filter.type);
      }
      if (filter.startDate) {
        filtered = filtered.filter(e => e.timestamp >= filter.startDate!);
      }
      if (filter.endDate) {
        filtered = filtered.filter(e => e.timestamp <= filter.endDate!);
      }
    }

    return filtered;
  }

  /**
   * Get required audit events for a country
   */
  static getRequiredEvents(countryCode: string): AuditEventType[] {
    const config = CountryConfigLoader.load(countryCode);

    if (!config || !config.audit.required) {
      return [];
    }

    return config.audit.requiredEvents;
  }

  /**
   * Check if an event type is required for a country
   */
  static isEventRequired(
    eventType: AuditEventType,
    countryCode: string
  ): boolean {
    const requiredEvents = this.getRequiredEvents(countryCode);
    return requiredEvents.includes(eventType);
  }

  /**
   * Generate audit report
   */
  static generateReport(
    countryCode: string,
    startDate: string,
    endDate: string
  ): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsByOutcome: Record<string, number>;
    eventsByUser: Record<string, number>;
    events: AuditEvent[];
  } {
    const events = this.getEvents({ startDate, endDate }).filter(
      e => e.countryCode === countryCode
    );

    const eventsByType: Record<string, number> = {};
    const eventsByOutcome: Record<string, number> = {};
    const eventsByUser: Record<string, number> = {};

    events.forEach(event => {
      // Count by type
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;

      // Count by outcome
      eventsByOutcome[event.outcome] = (eventsByOutcome[event.outcome] || 0) + 1;

      // Count by user
      if (event.userId) {
        eventsByUser[event.userId] = (eventsByUser[event.userId] || 0) + 1;
      }
    });

    return {
      totalEvents: events.length,
      eventsByType,
      eventsByOutcome,
      eventsByUser,
      events,
    };
  }

  /**
   * Export events as NDJSON (for log shipping)
   */
  static exportAsNDJSON(events?: AuditEvent[]): string {
    const eventsToExport = events || this.events;
    return eventsToExport.map(event => JSON.stringify(event)).join('\n');
  }

  /**
   * Clear all events (use with caution, check retention requirements)
   */
  static clearEvents(): void {
    this.events = [];
  }

  /**
   * Purge old events based on retention policy
   */
  static purgeOldEvents(countryCode: string): number {
    const config = CountryConfigLoader.load(countryCode);

    if (!config) {
      return 0;
    }

    const retentionDays = config.retention.auditLogs * 365; // Convert years to days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    const cutoffISO = cutoffDate.toISOString();

    const initialCount = this.events.length;

    this.events = this.events.filter(
      event => event.timestamp >= cutoffISO || event.countryCode !== countryCode
    );

    return initialCount - this.events.length;
  }

  /**
   * Store event in memory
   */
  private static storeEvent(event: AuditEvent): void {
    this.events.push(event);

    // Trim if exceeding max
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }
  }

  /**
   * Notify all listeners
   */
  private static async notifyListeners(event: AuditEvent): Promise<void> {
    const promises = this.listeners.map(listener => {
      try {
        return Promise.resolve(listener(event));
      } catch (error) {
        console.error('Error in audit listener:', error);
        return Promise.resolve();
      }
    });

    await Promise.all(promises);
  }

  /**
   * Generate unique event ID
   */
  private static generateEventId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create audit event decorator for methods
   */
  static createDecorator(
    type: AuditEventType,
    action: string,
    getContext?: (args: any[]) => {
      userId?: string;
      patientId?: string;
      resourceType?: string;
      resourceId?: string;
      countryCode?: string;
    }
  ) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        const context = getContext ? getContext(args) : {};
        let outcome: 'success' | 'failure' = 'success';
        let error: any;

        try {
          const result = await originalMethod.apply(this, args);
          return result;
        } catch (err) {
          outcome = 'failure';
          error = err;
          throw err;
        } finally {
          await AuditEmitter.emit(type, action, outcome, {
            ...context,
            metadata: error ? { error: error.message } : undefined,
          });
        }
      };

      return descriptor;
    };
  }

  /**
   * Get event count
   */
  static getEventCount(): number {
    return this.events.length;
  }

  /**
   * Get listener count
   */
  static getListenerCount(): number {
    return this.listeners.length;
  }
}
