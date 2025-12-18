/**
 * Frontend Application Insights Configuration
 * Unified Healthcare Platform
 *
 * This configuration enables comprehensive frontend monitoring including:
 * - Page load performance
 * - User interactions
 * - JavaScript errors
 * - Custom events
 * - User behavior analytics
 */

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

// ==========================================
// Configuration Interface
// ==========================================

export interface FrontendMonitoringConfig {
  instrumentationKey?: string;
  connectionString?: string;
  enableAutoRouteTracking?: boolean;
  enableCorsCorrelation?: boolean;
  enableRequestHeaderTracking?: boolean;
  enableResponseHeaderTracking?: boolean;
  disableFetchTracking?: boolean;
  disableAjaxTracking?: boolean;
  disableExceptionTracking?: boolean;
  disableTelemetry?: boolean;
  samplingPercentage?: number;
  maxAjaxCallsPerView?: number;
  disableDataLossAnalysis?: boolean;
  disableCorrelationHeaders?: boolean;
  correlationHeaderExcludedDomains?: string[];
  enableDebug?: boolean;
}

// ==========================================
// Initialize Application Insights
// ==========================================

export const initializeAppInsights = (config: FrontendMonitoringConfig = {}) => {
  const reactPlugin = new ReactPlugin();

  const appInsights = new ApplicationInsights({
    config: {
      // Connection configuration
      instrumentationKey: config.instrumentationKey || process.env.NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATION_KEY,
      connectionString: config.connectionString || process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING,

      // Automatic tracking
      enableAutoRouteTracking: config.enableAutoRouteTracking ?? true,
      autoTrackPageVisitTime: true,
      enableCorsCorrelation: config.enableCorsCorrelation ?? true,
      enableRequestHeaderTracking: config.enableRequestHeaderTracking ?? true,
      enableResponseHeaderTracking: config.enableResponseHeaderTracking ?? true,

      // Disable options
      disableFetchTracking: config.disableFetchTracking ?? false,
      disableAjaxTracking: config.disableAjaxTracking ?? false,
      disableExceptionTracking: config.disableExceptionTracking ?? false,
      disableTelemetry: config.disableTelemetry ?? false,

      // Sampling and throttling
      samplingPercentage: config.samplingPercentage ?? 100,
      maxAjaxCallsPerView: config.maxAjaxCallsPerView ?? 500,

      // Advanced options
      disableDataLossAnalysis: config.disableDataLossAnalysis ?? false,
      disableCorrelationHeaders: config.disableCorrelationHeaders ?? false,
      correlationHeaderExcludedDomains: config.correlationHeaderExcludedDomains ?? [
        '*.queue.core.windows.net',
        '*.blob.core.windows.net',
      ],

      // Extensions
      extensions: [reactPlugin],

      // Additional configuration
      enableDebug: config.enableDebug ?? (process.env.NODE_ENV === 'development'),
      loggingLevelConsole: process.env.NODE_ENV === 'development' ? 2 : 0,
      loggingLevelTelemetry: process.env.NODE_ENV === 'development' ? 2 : 1,

      // Cookie configuration
      cookieCfg: {
        enabled: true,
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      },

      // Session configuration
      enableSessionStorageBuffer: true,
      isStorageUseDisabled: false,
      isCookieUseDisabled: false,

      // Performance
      maxBatchSizeInBytes: 10000,
      maxBatchInterval: 15000,
      disableFlushOnBeforeUnload: false,

      // Privacy and compliance
      enableUnhandledPromiseRejectionTracking: true,
    },
  });

  appInsights.loadAppInsights();

  // Set authenticated user context (for HIPAA-compliant tracking)
  const setUserContext = (userId: string, accountId?: string) => {
    appInsights.setAuthenticatedUserContext(userId, accountId, true);
  };

  // Clear user context on logout
  const clearUserContext = () => {
    appInsights.clearAuthenticatedUserContext();
  };

  return {
    appInsights,
    reactPlugin,
    setUserContext,
    clearUserContext,
  };
};

// ==========================================
// Custom Event Tracking
// ==========================================

export class FrontendMonitoring {
  private appInsights: ApplicationInsights;

  constructor(appInsights: ApplicationInsights) {
    this.appInsights = appInsights;
  }

  /**
   * Track custom events
   */
  trackEvent(name: string, properties?: Record<string, any>, measurements?: Record<string, number>) {
    this.appInsights.trackEvent({ name }, properties, measurements);
  }

  /**
   * Track page views
   */
  trackPageView(name?: string, url?: string, properties?: Record<string, any>) {
    this.appInsights.trackPageView({
      name,
      uri: url,
      properties,
    });
  }

  /**
   * Track exceptions
   */
  trackException(error: Error, severityLevel?: number, properties?: Record<string, any>) {
    this.appInsights.trackException({
      exception: error,
      severityLevel,
      properties,
    });
  }

  /**
   * Track custom metrics
   */
  trackMetric(name: string, average: number, properties?: Record<string, any>) {
    this.appInsights.trackMetric({
      name,
      average,
    }, properties);
  }

  /**
   * Track dependencies (external API calls)
   */
  trackDependency(
    id: string,
    method: string,
    absoluteUrl: string,
    pathName: string,
    totalTime: number,
    success: boolean,
    resultCode: number,
    properties?: Record<string, any>
  ) {
    this.appInsights.trackDependencyData({
      id,
      method,
      absoluteUrl,
      pathName,
      totalTime,
      success,
      resultCode,
      properties,
    });
  }

  /**
   * Track user actions
   */
  trackUserAction(action: string, properties?: Record<string, any>) {
    this.trackEvent('UserAction', {
      action,
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track business events
   */
  trackBusinessEvent(eventType: string, properties?: Record<string, any>) {
    this.trackEvent('BusinessEvent', {
      eventType,
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number, properties?: Record<string, any>) {
    this.trackMetric(metric, value, {
      category: 'Performance',
      ...properties,
    });
  }

  /**
   * Flush telemetry (useful before page unload)
   */
  flush() {
    this.appInsights.flush();
  }
}

// ==========================================
// Predefined Event Trackers
// ==========================================

export class HealthcareEventTrackers {
  private monitoring: FrontendMonitoring;

  constructor(monitoring: FrontendMonitoring) {
    this.monitoring = monitoring;
  }

  /**
   * Track appointment-related events
   */
  trackAppointmentEvent(
    action: 'created' | 'cancelled' | 'rescheduled' | 'completed' | 'viewed',
    appointmentId: string,
    properties?: Record<string, any>
  ) {
    this.monitoring.trackBusinessEvent('Appointment', {
      action,
      appointmentId,
      ...properties,
    });
  }

  /**
   * Track consultation events
   */
  trackConsultationEvent(
    action: 'started' | 'ended' | 'joined' | 'left',
    consultationId: string,
    duration?: number,
    properties?: Record<string, any>
  ) {
    this.monitoring.trackBusinessEvent('Consultation', {
      action,
      consultationId,
      duration,
      ...properties,
    });
  }

  /**
   * Track prescription events
   */
  trackPrescriptionEvent(
    action: 'issued' | 'viewed' | 'downloaded',
    prescriptionId: string,
    properties?: Record<string, any>
  ) {
    this.monitoring.trackBusinessEvent('Prescription', {
      action,
      prescriptionId,
      ...properties,
    });
  }

  /**
   * Track payment events
   */
  trackPaymentEvent(
    action: 'initiated' | 'completed' | 'failed' | 'refunded',
    paymentId: string,
    amount?: number,
    currency?: string,
    properties?: Record<string, any>
  ) {
    this.monitoring.trackBusinessEvent('Payment', {
      action,
      paymentId,
      amount,
      currency,
      ...properties,
    });
  }

  /**
   * Track medical record access
   */
  trackMedicalRecordAccess(
    action: 'viewed' | 'downloaded' | 'shared',
    recordId: string,
    recordType: string,
    properties?: Record<string, any>
  ) {
    this.monitoring.trackBusinessEvent('MedicalRecordAccess', {
      action,
      recordId,
      recordType,
      ...properties,
      // Important for HIPAA audit trail
      accessTimestamp: new Date().toISOString(),
    });
  }

  /**
   * Track user authentication events
   */
  trackAuthEvent(
    action: 'login' | 'logout' | 'register' | 'password_reset' | 'mfa_enabled',
    userId?: string,
    properties?: Record<string, any>
  ) {
    this.monitoring.trackBusinessEvent('Authentication', {
      action,
      userId,
      ...properties,
    });
  }

  /**
   * Track search events
   */
  trackSearchEvent(
    searchQuery: string,
    searchType: string,
    resultCount: number,
    properties?: Record<string, any>
  ) {
    this.monitoring.trackUserAction('Search', {
      searchQuery,
      searchType,
      resultCount,
      ...properties,
    });
  }

  /**
   * Track form submissions
   */
  trackFormSubmission(
    formName: string,
    success: boolean,
    validationErrors?: string[],
    properties?: Record<string, any>
  ) {
    this.monitoring.trackUserAction('FormSubmission', {
      formName,
      success,
      validationErrors,
      ...properties,
    });
  }

  /**
   * Track navigation events
   */
  trackNavigation(
    from: string,
    to: string,
    properties?: Record<string, any>
  ) {
    this.monitoring.trackUserAction('Navigation', {
      from,
      to,
      ...properties,
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(
    featureName: string,
    properties?: Record<string, any>
  ) {
    this.monitoring.trackUserAction('FeatureUsage', {
      featureName,
      ...properties,
    });
  }
}

// ==========================================
// Performance Monitoring
// ==========================================

export class PerformanceMonitoring {
  private monitoring: FrontendMonitoring;

  constructor(monitoring: FrontendMonitoring) {
    this.monitoring = monitoring;
  }

  /**
   * Track Web Vitals
   */
  trackWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.monitoring.trackPerformance('LCP', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          this.monitoring.trackPerformance('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.monitoring.trackPerformance('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * Track API call performance
   */
  trackAPICallPerformance(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number,
    success: boolean
  ) {
    this.monitoring.trackPerformance(`API_${method}_${endpoint}`, duration, {
      endpoint,
      method,
      statusCode,
      success,
    });
  }

  /**
   * Track component render performance
   */
  trackComponentRender(componentName: string, duration: number) {
    this.monitoring.trackPerformance(`ComponentRender_${componentName}`, duration, {
      componentName,
    });
  }

  /**
   * Track resource loading performance
   */
  trackResourceLoad(resourceType: string, resourceName: string, duration: number) {
    this.monitoring.trackPerformance(`ResourceLoad_${resourceType}`, duration, {
      resourceType,
      resourceName,
    });
  }
}

// ==========================================
// Error Boundary Integration
// ==========================================

export class ErrorMonitoring {
  private monitoring: FrontendMonitoring;

  constructor(monitoring: FrontendMonitoring) {
    this.monitoring = monitoring;
  }

  /**
   * Track React error boundary errors
   */
  trackErrorBoundary(error: Error, errorInfo: any) {
    this.monitoring.trackException(error, 3, {
      type: 'ErrorBoundary',
      componentStack: errorInfo.componentStack,
    });
  }

  /**
   * Track API errors
   */
  trackAPIError(
    error: Error,
    endpoint: string,
    method: string,
    statusCode?: number,
    responseData?: any
  ) {
    this.monitoring.trackException(error, 2, {
      type: 'APIError',
      endpoint,
      method,
      statusCode,
      responseData: JSON.stringify(responseData),
    });
  }

  /**
   * Track validation errors
   */
  trackValidationError(formName: string, errors: Record<string, string>) {
    this.monitoring.trackEvent('ValidationError', {
      formName,
      errors: JSON.stringify(errors),
      errorCount: Object.keys(errors).length,
    });
  }

  /**
   * Track network errors
   */
  trackNetworkError(error: Error, url: string) {
    this.monitoring.trackException(error, 2, {
      type: 'NetworkError',
      url,
    });
  }
}

// ==========================================
// Usage Example
// ==========================================

/*
// In your main app file (e.g., _app.tsx for Next.js)

import { initializeAppInsights, FrontendMonitoring, HealthcareEventTrackers, PerformanceMonitoring } from './monitoring/frontend-monitoring-config';

// Initialize Application Insights
const { appInsights, setUserContext, clearUserContext } = initializeAppInsights();

// Create monitoring instances
const monitoring = new FrontendMonitoring(appInsights);
const eventTrackers = new HealthcareEventTrackers(monitoring);
const perfMonitoring = new PerformanceMonitoring(monitoring);

// Track Web Vitals
perfMonitoring.trackWebVitals();

// Set user context after login
setUserContext('user-123', 'account-456');

// Track events
eventTrackers.trackAppointmentEvent('created', 'appt-123', {
  providerId: 'provider-456',
  patientId: 'patient-789',
});

// Track performance
perfMonitoring.trackAPICallPerformance('/api/appointments', 'POST', 245, 201, true);

// Clear user context on logout
clearUserContext();

export { monitoring, eventTrackers, perfMonitoring };
*/

export default {
  initializeAppInsights,
  FrontendMonitoring,
  HealthcareEventTrackers,
  PerformanceMonitoring,
  ErrorMonitoring,
};
