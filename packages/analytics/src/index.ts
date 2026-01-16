/**
 * Unified Health Privacy-Compliant Analytics
 *
 * A HIPAA/GDPR-safe analytics system that:
 * - Never collects PII without explicit consent
 * - Anonymizes user identifiers
 * - Supports consent management
 * - Works with multiple analytics providers
 */

import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// ============================================================================
// Types & Schemas
// ============================================================================

export const ConsentLevelSchema = z.enum([
  "none",
  "essential",
  "analytics",
  "marketing",
  "all",
]);
export type ConsentLevel = z.infer<typeof ConsentLevelSchema>;

export const EventCategorySchema = z.enum([
  "page_view",
  "user_action",
  "system",
  "conversion",
  "error",
  "performance",
  "engagement",
]);
export type EventCategory = z.infer<typeof EventCategorySchema>;

export interface AnalyticsEvent {
  name: string;
  category: EventCategory;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface UserProperties {
  anonymousId: string;
  userId?: string;
  traits?: Record<string, any>;
}

export interface PageView {
  path: string;
  title?: string;
  referrer?: string;
  properties?: Record<string, any>;
}

export interface ConsentState {
  level: ConsentLevel;
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: string;
}

// ============================================================================
// Analytics Provider Interface
// ============================================================================

export interface AnalyticsProvider {
  name: string;
  requiredConsent: ConsentLevel;
  initialize(): Promise<void>;
  track(event: AnalyticsEvent, user: UserProperties): Promise<void>;
  page(pageView: PageView, user: UserProperties): Promise<void>;
  identify(user: UserProperties): Promise<void>;
  reset(): Promise<void>;
}

// ============================================================================
// Built-in Providers
// ============================================================================

/**
 * Console Provider - For development and debugging
 */
export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  name = "console";
  requiredConsent: ConsentLevel = "essential";

  async initialize(): Promise<void> {
    console.log("[Analytics] Console provider initialized");
  }

  async track(event: AnalyticsEvent, user: UserProperties): Promise<void> {
    console.log("[Analytics] Track:", {
      event: event.name,
      category: event.category,
      properties: event.properties,
      user: user.anonymousId,
      timestamp: event.timestamp || Date.now(),
    });
  }

  async page(pageView: PageView, user: UserProperties): Promise<void> {
    console.log("[Analytics] Page:", {
      path: pageView.path,
      title: pageView.title,
      user: user.anonymousId,
    });
  }

  async identify(user: UserProperties): Promise<void> {
    console.log("[Analytics] Identify:", {
      anonymousId: user.anonymousId,
      userId: user.userId ? "[REDACTED]" : undefined,
    });
  }

  async reset(): Promise<void> {
    console.log("[Analytics] Reset");
  }
}

/**
 * Server-side Analytics Provider - Sends events to your own backend
 */
export class ServerAnalyticsProvider implements AnalyticsProvider {
  name = "server";
  requiredConsent: ConsentLevel = "analytics";
  private endpoint: string;
  private batchSize: number;
  private flushInterval: number;
  private queue: Array<{ type: string; data: any }> = [];
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(options: {
    endpoint: string;
    batchSize?: number;
    flushInterval?: number;
  }) {
    this.endpoint = options.endpoint;
    this.batchSize = options.batchSize || 10;
    this.flushInterval = options.flushInterval || 5000;
  }

  async initialize(): Promise<void> {
    this.timer = setInterval(() => this.flush(), this.flushInterval);
  }

  async track(event: AnalyticsEvent, user: UserProperties): Promise<void> {
    this.queue.push({
      type: "track",
      data: {
        event: event.name,
        category: event.category,
        properties: this.sanitizeProperties(event.properties),
        anonymousId: user.anonymousId,
        timestamp: event.timestamp || Date.now(),
      },
    });

    if (this.queue.length >= this.batchSize) {
      await this.flush();
    }
  }

  async page(pageView: PageView, user: UserProperties): Promise<void> {
    this.queue.push({
      type: "page",
      data: {
        path: pageView.path,
        title: pageView.title,
        referrer: pageView.referrer,
        properties: this.sanitizeProperties(pageView.properties),
        anonymousId: user.anonymousId,
        timestamp: Date.now(),
      },
    });

    if (this.queue.length >= this.batchSize) {
      await this.flush();
    }
  }

  async identify(user: UserProperties): Promise<void> {
    // Only send anonymized identifier
    this.queue.push({
      type: "identify",
      data: {
        anonymousId: user.anonymousId,
        // Hash userId if present, never send PII
        hasUserId: !!user.userId,
        timestamp: Date.now(),
      },
    });
  }

  async reset(): Promise<void> {
    await this.flush();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: batch }),
      });
    } catch (error) {
      // Re-queue failed events
      this.queue.unshift(...batch);
      console.error("[Analytics] Failed to send events:", error);
    }
  }

  private sanitizeProperties(
    props?: Record<string, any>,
  ): Record<string, any> | undefined {
    if (!props) return undefined;

    // Remove any PII fields
    const piiFields = [
      "email",
      "phone",
      "ssn",
      "name",
      "address",
      "dob",
      "dateOfBirth",
      "password",
    ];
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(props)) {
      const lowerKey = key.toLowerCase();
      if (!piiFields.some((pii) => lowerKey.includes(pii))) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}

// ============================================================================
// Analytics Client
// ============================================================================

export interface AnalyticsClientOptions {
  providers: AnalyticsProvider[];
  defaultConsent?: ConsentLevel;
  debug?: boolean;
  anonymousIdKey?: string;
}

export class AnalyticsClient {
  private providers: AnalyticsProvider[];
  private consent: ConsentState;
  private user: UserProperties;
  private debug: boolean;
  private anonymousIdKey: string;
  private initialized = false;

  constructor(options: AnalyticsClientOptions) {
    this.providers = options.providers;
    this.debug = options.debug || false;
    this.anonymousIdKey = options.anonymousIdKey || "uh_analytics_id";

    this.consent = {
      level: options.defaultConsent || "none",
      essential: true, // Essential is always allowed
      analytics:
        options.defaultConsent === "analytics" ||
        options.defaultConsent === "all",
      marketing:
        options.defaultConsent === "marketing" ||
        options.defaultConsent === "all",
      updatedAt: new Date().toISOString(),
      version: "1.0",
    };

    this.user = {
      anonymousId: this.getOrCreateAnonymousId(),
    };
  }

  /**
   * Initialize analytics providers
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    for (const provider of this.providers) {
      if (this.hasConsent(provider.requiredConsent)) {
        try {
          await provider.initialize();
          this.log(`Provider ${provider.name} initialized`);
        } catch (error) {
          console.error(
            `[Analytics] Failed to initialize ${provider.name}:`,
            error,
          );
        }
      }
    }

    this.initialized = true;
  }

  /**
   * Track a custom event
   */
  async track(
    name: string,
    properties?: Record<string, any>,
    category: EventCategory = "user_action",
  ): Promise<void> {
    const event: AnalyticsEvent = {
      name,
      category,
      properties: this.sanitizeEventProperties(properties),
      timestamp: Date.now(),
    };

    await this.dispatchToProviders("track", event);
  }

  /**
   * Track a page view
   */
  async page(
    path: string,
    title?: string,
    properties?: Record<string, any>,
  ): Promise<void> {
    const pageView: PageView = {
      path,
      title,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
      properties: this.sanitizeEventProperties(properties),
    };

    await this.dispatchToProviders("page", pageView);
  }

  /**
   * Identify user (anonymized)
   */
  async identify(userId?: string, traits?: Record<string, any>): Promise<void> {
    if (userId) {
      // Hash the userId to anonymize it
      this.user.userId = await this.hashUserId(userId);
    }

    if (traits) {
      // Only keep non-PII traits
      this.user.traits = this.sanitizeUserTraits(traits);
    }

    await this.dispatchToProviders("identify", this.user);
  }

  /**
   * Reset analytics state (on logout)
   */
  async reset(): Promise<void> {
    this.user = {
      anonymousId: this.generateAnonymousId(),
    };

    this.saveAnonymousId(this.user.anonymousId);

    for (const provider of this.providers) {
      try {
        await provider.reset();
      } catch (error) {
        console.error(`[Analytics] Failed to reset ${provider.name}:`, error);
      }
    }
  }

  /**
   * Update consent settings
   */
  async updateConsent(level: ConsentLevel): Promise<void> {
    this.consent = {
      level,
      essential: true,
      analytics: level === "analytics" || level === "all",
      marketing: level === "marketing" || level === "all",
      updatedAt: new Date().toISOString(),
      version: "1.0",
    };

    // Re-initialize providers with new consent
    for (const provider of this.providers) {
      if (this.hasConsent(provider.requiredConsent)) {
        try {
          await provider.initialize();
        } catch (error) {
          console.error(
            `[Analytics] Failed to initialize ${provider.name}:`,
            error,
          );
        }
      }
    }

    // Track consent change (this is allowed under essential)
    await this.track("consent_updated", { level }, "system");
  }

  /**
   * Get current consent state
   */
  getConsent(): ConsentState {
    return { ...this.consent };
  }

  /**
   * Check if we have required consent
   */
  hasConsent(required: ConsentLevel): boolean {
    switch (required) {
      case "none":
      case "essential":
        return true;
      case "analytics":
        return this.consent.analytics;
      case "marketing":
        return this.consent.marketing;
      case "all":
        return this.consent.analytics && this.consent.marketing;
      default:
        return false;
    }
  }

  // ============================================================================
  // Predefined Event Helpers
  // ============================================================================

  /**
   * Track conversion event
   */
  async trackConversion(
    name: string,
    value?: number,
    properties?: Record<string, any>,
  ): Promise<void> {
    await this.track(name, { ...properties, value }, "conversion");
  }

  /**
   * Track error event
   */
  async trackError(
    error: Error | string,
    properties?: Record<string, any>,
  ): Promise<void> {
    const errorMessage = error instanceof Error ? error.message : error;
    await this.track(
      "error_occurred",
      {
        ...properties,
        error_message: errorMessage,
        // Don't include stack trace in production
      },
      "error",
    );
  }

  /**
   * Track performance metric
   */
  async trackPerformance(
    metric: string,
    value: number,
    properties?: Record<string, any>,
  ): Promise<void> {
    await this.track(metric, { ...properties, value }, "performance");
  }

  /**
   * Track engagement event
   */
  async trackEngagement(
    action: string,
    properties?: Record<string, any>,
  ): Promise<void> {
    await this.track(action, properties, "engagement");
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  private async dispatchToProviders(method: string, data: any): Promise<void> {
    const promises = this.providers
      .filter((provider) => this.hasConsent(provider.requiredConsent))
      .map(async (provider) => {
        try {
          switch (method) {
            case "track":
              await provider.track(data, this.user);
              break;
            case "page":
              await provider.page(data, this.user);
              break;
            case "identify":
              await provider.identify(data);
              break;
          }
        } catch (error) {
          console.error(
            `[Analytics] ${provider.name} ${method} failed:`,
            error,
          );
        }
      });

    await Promise.all(promises);
  }

  private getOrCreateAnonymousId(): string {
    if (typeof window === "undefined") {
      return this.generateAnonymousId();
    }

    const stored = localStorage.getItem(this.anonymousIdKey);
    if (stored) return stored;

    const newId = this.generateAnonymousId();
    this.saveAnonymousId(newId);
    return newId;
  }

  private generateAnonymousId(): string {
    return uuidv4();
  }

  private saveAnonymousId(id: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.anonymousIdKey, id);
    }
  }

  private async hashUserId(userId: string): Promise<string> {
    // Simple hash for anonymization (use crypto.subtle in browser)
    if (typeof window !== "undefined" && window.crypto?.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(userId);
      const hash = await window.crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }

    // Fallback for Node.js
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private sanitizeEventProperties(
    props?: Record<string, any>,
  ): Record<string, any> | undefined {
    if (!props) return undefined;

    const piiPatterns = [
      /email/i,
      /phone/i,
      /ssn/i,
      /social/i,
      /name/i,
      /address/i,
      /dob/i,
      /birth/i,
      /password/i,
      /credit/i,
      /card/i,
      /medical/i,
      /health/i,
      /diagnosis/i,
      /prescription/i,
      /insurance/i,
    ];

    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(props)) {
      if (!piiPatterns.some((pattern) => pattern.test(key))) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private sanitizeUserTraits(traits: Record<string, any>): Record<string, any> {
    // Only allow safe traits
    const allowedTraits = [
      "plan",
      "accountType",
      "role",
      "locale",
      "timezone",
      "createdAt",
    ];
    const sanitized: Record<string, any> = {};

    for (const key of allowedTraits) {
      if (key in traits) {
        sanitized[key] = traits[key];
      }
    }

    return sanitized;
  }

  private log(message: string, ...args: any[]): void {
    if (this.debug) {
      console.log(`[Analytics] ${message}`, ...args);
    }
  }
}

// ============================================================================
// Predefined Events for Unified Health
// ============================================================================

export const ANALYTICS_EVENTS = {
  // Authentication
  LOGIN_STARTED: "login_started",
  LOGIN_COMPLETED: "login_completed",
  LOGIN_FAILED: "login_failed",
  LOGOUT: "logout",
  SIGNUP_STARTED: "signup_started",
  SIGNUP_COMPLETED: "signup_completed",
  PASSWORD_RESET_REQUESTED: "password_reset_requested",

  // Appointments
  APPOINTMENT_SEARCH: "appointment_search",
  APPOINTMENT_SLOT_SELECTED: "appointment_slot_selected",
  APPOINTMENT_BOOKED: "appointment_booked",
  APPOINTMENT_CANCELLED: "appointment_cancelled",
  APPOINTMENT_RESCHEDULED: "appointment_rescheduled",

  // Telehealth
  TELEHEALTH_SESSION_JOINED: "telehealth_session_joined",
  TELEHEALTH_SESSION_LEFT: "telehealth_session_left",
  TELEHEALTH_TECHNICAL_ISSUE: "telehealth_technical_issue",

  // Billing
  CHECKOUT_STARTED: "checkout_started",
  PAYMENT_COMPLETED: "payment_completed",
  PAYMENT_FAILED: "payment_failed",
  SUBSCRIPTION_STARTED: "subscription_started",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",

  // Engagement
  FEATURE_USED: "feature_used",
  SEARCH_PERFORMED: "search_performed",
  PROFILE_UPDATED: "profile_updated",
  DOCUMENT_UPLOADED: "document_uploaded",
  MESSAGE_SENT: "message_sent",

  // Errors
  ERROR_OCCURRED: "error_occurred",
  API_ERROR: "api_error",
  VALIDATION_ERROR: "validation_error",
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

// ============================================================================
// Exports
// ============================================================================

export default AnalyticsClient;
