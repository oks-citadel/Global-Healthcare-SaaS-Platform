/**
 * Azure Application Insights Integration
 * Comprehensive monitoring and distributed tracing for the The Unified Health Platform
 */

import * as appInsights from 'applicationinsights';
import { RequestHandler } from 'express';

export interface AzureInsightsConfig {
  instrumentationKey?: string;
  connectionString?: string;
  enableAutoCollect?: boolean;
  enableLiveMetrics?: boolean;
  enableDistributedTracing?: boolean;
  samplingPercentage?: number;
  maxBatchSize?: number;
  maxBatchIntervalMs?: number;
  disableExceptionTracking?: boolean;
  enableDebug?: boolean;
  roleName?: string;
  roleInstance?: string;
}

export class AzureInsightsService {
  private client: appInsights.TelemetryClient | null = null;
  private isInitialized = false;

  /**
   * Initialize Azure Application Insights
   */
  initialize(config: AzureInsightsConfig = {}): void {
    const {
      instrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATION_KEY,
      connectionString = process.env.APPINSIGHTS_CONNECTION_STRING,
      enableAutoCollect = true,
      enableLiveMetrics = true,
      enableDistributedTracing = true,
      samplingPercentage = 100,
      maxBatchSize = 250,
      maxBatchIntervalMs = 15000,
      disableExceptionTracking = false,
      enableDebug = process.env.NODE_ENV === 'development',
      roleName = process.env.SERVICE_NAME || 'unified-health-api',
      roleInstance = process.env.HOSTNAME || process.env.POD_NAME || 'unknown',
    } = config;

    // Skip initialization if no credentials provided
    if (!instrumentationKey && !connectionString) {
      console.warn('Azure Application Insights not configured - skipping initialization');
      return;
    }

    try {
      // Setup Application Insights
      if (connectionString) {
        appInsights.setup(connectionString);
      } else if (instrumentationKey) {
        appInsights.setup(instrumentationKey);
      }

      // Configure auto-collection
      if (enableAutoCollect) {
        appInsights
          .setAutoDependencyCorrelation(enableDistributedTracing)
          .setAutoCollectRequests(true)
          .setAutoCollectPerformance(true, true)
          .setAutoCollectExceptions(!disableExceptionTracking)
          .setAutoCollectDependencies(true)
          .setAutoCollectConsole(true, true)
          .setUseDiskRetryCaching(true);
      }

      // Enable live metrics
      if (enableLiveMetrics) {
        appInsights.setAutoCollectHeartbeat(true);
      }

      // Set internal logging
      if (enableDebug) {
        appInsights.setInternalLogging(true, true);
      }

      // Configure default client
      appInsights.defaultClient.context.tags[
        appInsights.defaultClient.context.keys.cloudRole
      ] = roleName;
      appInsights.defaultClient.context.tags[
        appInsights.defaultClient.context.keys.cloudRoleInstance
      ] = roleInstance;

      // Set sampling percentage
      appInsights.defaultClient.config.samplingPercentage = samplingPercentage;
      appInsights.defaultClient.config.maxBatchSize = maxBatchSize;
      appInsights.defaultClient.config.maxBatchIntervalMs = maxBatchIntervalMs;

      // Start collecting telemetry
      appInsights.start();

      this.client = appInsights.defaultClient;
      this.isInitialized = true;

      console.log(`Azure Application Insights initialized for ${roleName}`);
    } catch (error) {
      console.error('Failed to initialize Azure Application Insights:', error);
    }
  }

  /**
   * Get the telemetry client
   */
  getClient(): appInsights.TelemetryClient | null {
    return this.client;
  }

  /**
   * Check if Application Insights is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.client !== null;
  }

  /**
   * Track a custom event
   */
  trackEvent(
    name: string,
    properties?: { [key: string]: string },
    measurements?: { [key: string]: number }
  ): void {
    if (!this.client) return;

    this.client.trackEvent({
      name,
      properties: this.sanitizeProperties(properties),
      measurements,
    });
  }

  /**
   * Track a custom metric
   */
  trackMetric(
    name: string,
    value: number,
    properties?: { [key: string]: string }
  ): void {
    if (!this.client) return;

    this.client.trackMetric({
      name,
      value,
      properties: this.sanitizeProperties(properties),
    });
  }

  /**
   * Track an exception
   */
  trackException(
    error: Error,
    properties?: { [key: string]: string },
    measurements?: { [key: string]: number }
  ): void {
    if (!this.client) return;

    this.client.trackException({
      exception: error,
      properties: this.sanitizeProperties(properties),
      measurements,
    });
  }

  /**
   * Track a trace/log message
   */
  trackTrace(
    message: string,
    severity: appInsights.Contracts.SeverityLevel = appInsights.Contracts.SeverityLevel.Information,
    properties?: { [key: string]: string }
  ): void {
    if (!this.client) return;

    this.client.trackTrace({
      message,
      severity,
      properties: this.sanitizeProperties(properties),
    });
  }

  /**
   * Track a dependency call (external service, database, etc.)
   */
  trackDependency(
    dependencyTypeName: string,
    name: string,
    data: string,
    duration: number,
    success: boolean,
    resultCode?: number | string,
    properties?: { [key: string]: string }
  ): void {
    if (!this.client) return;

    this.client.trackDependency({
      dependencyTypeName,
      name,
      data,
      duration,
      success,
      resultCode: resultCode?.toString(),
      properties: this.sanitizeProperties(properties),
    });
  }

  /**
   * Track a custom availability test result
   */
  trackAvailability(
    name: string,
    duration: number,
    success: boolean,
    runLocation: string,
    message?: string,
    properties?: { [key: string]: string }
  ): void {
    if (!this.client) return;

    this.client.trackAvailability({
      name,
      duration,
      success,
      runLocation,
      message,
      properties: this.sanitizeProperties(properties),
    });
  }

  /**
   * Flush all pending telemetry
   */
  async flush(): Promise<void> {
    if (!this.client) return;

    return new Promise((resolve) => {
      this.client!.flush({
        callback: () => resolve(),
      });
    });
  }

  /**
   * Sanitize properties to remove PII/PHI data
   */
  private sanitizeProperties(
    properties?: { [key: string]: string }
  ): { [key: string]: string } | undefined {
    if (!properties) return undefined;

    const sanitized: { [key: string]: string } = {};
    const piiFields = [
      'password',
      'ssn',
      'social_security',
      'credit_card',
      'email',
      'phone',
      'address',
      'dob',
      'date_of_birth',
      'medical_record',
      'patient_id',
    ];

    for (const [key, value] of Object.entries(properties)) {
      const lowerKey = key.toLowerCase();
      if (piiFields.some((field) => lowerKey.includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}

// Singleton instance
export const azureInsights = new AzureInsightsService();

/**
 * Express middleware for Application Insights request tracking
 */
export function createAzureInsightsMiddleware(): RequestHandler {
  return (req, res, next) => {
    if (!azureInsights.isReady()) {
      return next();
    }

    const startTime = Date.now();
    const client = azureInsights.getClient();

    if (!client) {
      return next();
    }

    // Track request start
    const originalEnd = res.end;
    res.end = function (this: typeof res, ...args: any[]) {
      const duration = Date.now() - startTime;

      // Track request
      client.trackRequest({
        name: `${req.method} ${req.route?.path || req.path}`,
        url: req.url,
        duration,
        resultCode: res.statusCode,
        success: res.statusCode < 400,
        properties: {
          method: req.method,
          path: req.path,
          userAgent: req.get('user-agent') || 'unknown',
          ip: req.ip || 'unknown',
        },
      });

      return originalEnd.apply(this, args);
    };

    next();
  };
}

/**
 * Track business metrics for healthcare platform
 */
export class HealthcareMetricsTracker {
  constructor(private insights: AzureInsightsService) {}

  /**
   * Track appointment created
   */
  trackAppointmentCreated(
    appointmentType: string,
    specialty?: string,
    duration?: number
  ): void {
    this.insights.trackEvent('AppointmentCreated', {
      appointmentType,
      specialty: specialty || 'general',
    });

    this.insights.trackMetric('appointments_created', 1, {
      type: appointmentType,
    });
  }

  /**
   * Track appointment cancelled
   */
  trackAppointmentCancelled(reason: string, advanceNotice: number): void {
    this.insights.trackEvent('AppointmentCancelled', {
      reason,
    });

    this.insights.trackMetric('appointment_cancellation_notice_hours', advanceNotice);
  }

  /**
   * Track consultation started
   */
  trackConsultationStarted(type: string, specialty: string): void {
    this.insights.trackEvent('ConsultationStarted', {
      consultationType: type,
      specialty,
    });
  }

  /**
   * Track consultation completed
   */
  trackConsultationCompleted(
    type: string,
    specialty: string,
    durationMinutes: number,
    prescriptionIssued: boolean
  ): void {
    this.insights.trackEvent('ConsultationCompleted', {
      consultationType: type,
      specialty,
      prescriptionIssued: prescriptionIssued.toString(),
    });

    this.insights.trackMetric('consultation_duration_minutes', durationMinutes, {
      type,
      specialty,
    });
  }

  /**
   * Track prescription issued
   */
  trackPrescriptionIssued(medicationType: string, quantity: number): void {
    this.insights.trackEvent('PrescriptionIssued', {
      medicationType,
    });

    this.insights.trackMetric('prescription_quantity', quantity);
  }

  /**
   * Track payment processed
   */
  trackPaymentProcessed(
    amount: number,
    currency: string,
    method: string,
    success: boolean
  ): void {
    this.insights.trackEvent('PaymentProcessed', {
      currency,
      method,
      success: success.toString(),
    });

    if (success) {
      this.insights.trackMetric(`payment_amount_${currency}`, amount, {
        method,
      });
    }
  }

  /**
   * Track medical record access
   */
  trackMedicalRecordAccess(
    recordType: string,
    accessType: string,
    userRole: string
  ): void {
    this.insights.trackEvent('MedicalRecordAccessed', {
      recordType,
      accessType,
      userRole,
    });

    // Track for security monitoring
    this.insights.trackMetric('medical_record_accesses', 1, {
      userRole,
    });
  }

  /**
   * Track user registration
   */
  trackUserRegistration(role: string, organizationType?: string): void {
    this.insights.trackEvent('UserRegistered', {
      role,
      organizationType: organizationType || 'individual',
    });
  }

  /**
   * Track login attempt
   */
  trackLoginAttempt(success: boolean, role?: string, failureReason?: string): void {
    this.insights.trackEvent('LoginAttempt', {
      success: success.toString(),
      role: role || 'unknown',
      failureReason: failureReason || 'none',
    });

    this.insights.trackMetric('login_attempts', 1, {
      success: success.toString(),
    });
  }

  /**
   * Track video call quality
   */
  trackVideoCallQuality(
    duration: number,
    packetLoss: number,
    jitter: number,
    latency: number
  ): void {
    this.insights.trackEvent('VideoCallCompleted');

    this.insights.trackMetric('video_call_duration_seconds', duration);
    this.insights.trackMetric('video_call_packet_loss_percent', packetLoss);
    this.insights.trackMetric('video_call_jitter_ms', jitter);
    this.insights.trackMetric('video_call_latency_ms', latency);
  }

  /**
   * Track lab order
   */
  trackLabOrderCreated(testType: string, priority: string): void {
    this.insights.trackEvent('LabOrderCreated', {
      testType,
      priority,
    });
  }

  /**
   * Track lab result ready
   */
  trackLabResultReady(testType: string, turnaroundTimeHours: number): void {
    this.insights.trackEvent('LabResultReady', {
      testType,
    });

    this.insights.trackMetric('lab_turnaround_time_hours', turnaroundTimeHours, {
      testType,
    });
  }
}

// Export singleton metrics tracker
export const healthcareMetrics = new HealthcareMetricsTracker(azureInsights);
