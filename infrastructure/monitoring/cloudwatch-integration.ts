/**
 * AWS CloudWatch Monitoring Integration
 * Comprehensive monitoring, logging, and distributed tracing for the Unified Healthcare Platform
 * Replaces Azure Application Insights with AWS-native observability
 */

import {
  CloudWatchClient,
  PutMetricDataCommand,
  PutMetricAlarmCommand,
  DeleteAlarmsCommand,
  DescribeAlarmsCommand,
  MetricDatum,
  StandardUnit,
  ComparisonOperator,
  Statistic,
  TreatMissingData,
} from '@aws-sdk/client-cloudwatch';

import {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  PutLogEventsCommand,
  DescribeLogGroupsCommand,
  DescribeLogStreamsCommand,
  InputLogEvent,
  PutRetentionPolicyCommand,
} from '@aws-sdk/client-cloudwatch-logs';

import AWSXRay from 'aws-xray-sdk';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// Configuration Interfaces
// ============================================================================

export interface CloudWatchConfig {
  region?: string;
  namespace?: string;
  logGroupName?: string;
  serviceName?: string;
  environment?: string;
  enableXRay?: boolean;
  enableMetrics?: boolean;
  enableLogs?: boolean;
  metricResolution?: number; // 1 for high resolution, 60 for standard
  logRetentionDays?: number;
  batchSize?: number;
  flushIntervalMs?: number;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp?: Date;
  correlationId?: string;
  traceId?: string;
  spanId?: string;
  metadata?: Record<string, unknown>;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface MetricDefinition {
  name: string;
  value: number;
  unit?: StandardUnit;
  dimensions?: Record<string, string>;
  timestamp?: Date;
  storageResolution?: number;
}

export interface AlarmConfig {
  alarmName: string;
  metricName: string;
  namespace?: string;
  threshold: number;
  comparisonOperator: ComparisonOperator;
  evaluationPeriods: number;
  period: number;
  statistic: Statistic;
  description?: string;
  actionsEnabled?: boolean;
  alarmActions?: string[];
  okActions?: string[];
  insufficientDataActions?: string[];
  dimensions?: Record<string, string>;
  treatMissingData?: TreatMissingData;
  datapointsToAlarm?: number;
}

export interface DashboardWidget {
  type: 'metric' | 'text' | 'log' | 'alarm';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, unknown>;
}

// ============================================================================
// CloudWatch Logs Integration
// ============================================================================

export class CloudWatchLogger {
  private client: CloudWatchLogsClient;
  private logGroupName: string;
  private logStreamName: string;
  private sequenceToken: string | undefined;
  private logBuffer: InputLogEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;
  private serviceName: string;
  private environment: string;
  private batchSize: number;
  private flushIntervalMs: number;

  constructor(config: CloudWatchConfig) {
    this.client = new CloudWatchLogsClient({
      region: config.region || process.env.AWS_REGION || 'us-east-1',
    });
    this.logGroupName = config.logGroupName || `/unified-health/${config.environment || 'production'}`;
    this.logStreamName = `${config.serviceName || 'api'}-${new Date().toISOString().split('T')[0]}-${uuidv4().slice(0, 8)}`;
    this.serviceName = config.serviceName || process.env.SERVICE_NAME || 'unified-health-api';
    this.environment = config.environment || process.env.NODE_ENV || 'production';
    this.batchSize = config.batchSize || 100;
    this.flushIntervalMs = config.flushIntervalMs || 5000;
  }

  /**
   * Initialize the logger - create log group and stream
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create log group if it doesn't exist
      await this.ensureLogGroup();

      // Create log stream
      await this.createLogStream();

      // Start the flush timer
      this.startFlushTimer();

      this.isInitialized = true;
      console.log(`CloudWatch Logger initialized: ${this.logGroupName}/${this.logStreamName}`);
    } catch (error) {
      console.error('Failed to initialize CloudWatch Logger:', error);
      throw error;
    }
  }

  /**
   * Ensure log group exists with proper retention
   */
  private async ensureLogGroup(): Promise<void> {
    try {
      const describeCommand = new DescribeLogGroupsCommand({
        logGroupNamePrefix: this.logGroupName,
      });
      const response = await this.client.send(describeCommand);

      const exists = response.logGroups?.some(lg => lg.logGroupName === this.logGroupName);

      if (!exists) {
        await this.client.send(new CreateLogGroupCommand({
          logGroupName: this.logGroupName,
        }));

        // Set retention policy (30 days by default for healthcare compliance)
        await this.client.send(new PutRetentionPolicyCommand({
          logGroupName: this.logGroupName,
          retentionInDays: 30,
        }));
      }
    } catch (error: any) {
      if (error.name !== 'ResourceAlreadyExistsException') {
        throw error;
      }
    }
  }

  /**
   * Create a new log stream
   */
  private async createLogStream(): Promise<void> {
    try {
      await this.client.send(new CreateLogStreamCommand({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
      }));
    } catch (error: any) {
      if (error.name !== 'ResourceAlreadyExistsException') {
        throw error;
      }
    }
  }

  /**
   * Start the flush timer
   */
  private startFlushTimer(): void {
    if (this.flushTimer) return;

    this.flushTimer = setInterval(() => {
      this.flush().catch(console.error);
    }, this.flushIntervalMs);
  }

  /**
   * Stop the flush timer
   */
  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Log a message with structured JSON format
   */
  log(entry: LogEntry): void {
    const logEvent: InputLogEvent = {
      timestamp: entry.timestamp?.getTime() || Date.now(),
      message: JSON.stringify({
        level: entry.level,
        message: entry.message,
        service: this.serviceName,
        environment: this.environment,
        correlationId: entry.correlationId,
        traceId: entry.traceId,
        spanId: entry.spanId,
        timestamp: new Date().toISOString(),
        ...this.sanitizeMetadata(entry.metadata),
      }),
    };

    this.logBuffer.push(logEvent);

    // Auto-flush if buffer is full
    if (this.logBuffer.length >= this.batchSize) {
      this.flush().catch(console.error);
    }
  }

  /**
   * Log convenience methods
   */
  debug(message: string, metadata?: Record<string, unknown>, correlationId?: string): void {
    this.log({ level: 'debug', message, metadata, correlationId });
  }

  info(message: string, metadata?: Record<string, unknown>, correlationId?: string): void {
    this.log({ level: 'info', message, metadata, correlationId });
  }

  warn(message: string, metadata?: Record<string, unknown>, correlationId?: string): void {
    this.log({ level: 'warn', message, metadata, correlationId });
  }

  error(message: string, metadata?: Record<string, unknown>, correlationId?: string): void {
    this.log({ level: 'error', message, metadata, correlationId });
  }

  /**
   * Flush buffered logs to CloudWatch
   */
  async flush(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    const events = [...this.logBuffer];
    this.logBuffer = [];

    // Sort events by timestamp (required by CloudWatch)
    events.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    try {
      const command = new PutLogEventsCommand({
        logGroupName: this.logGroupName,
        logStreamName: this.logStreamName,
        logEvents: events,
        sequenceToken: this.sequenceToken,
      });

      const response = await this.client.send(command);
      this.sequenceToken = response.nextSequenceToken;
    } catch (error: any) {
      // Handle sequence token issues
      if (error.name === 'InvalidSequenceTokenException') {
        this.sequenceToken = error.expectedSequenceToken;
        // Retry
        const retryCommand = new PutLogEventsCommand({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
          logEvents: events,
          sequenceToken: this.sequenceToken,
        });
        const response = await this.client.send(retryCommand);
        this.sequenceToken = response.nextSequenceToken;
      } else {
        console.error('Failed to flush logs to CloudWatch:', error);
        // Put events back in buffer for retry
        this.logBuffer = [...events, ...this.logBuffer];
      }
    }
  }

  /**
   * Sanitize metadata to remove PII/PHI
   */
  private sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> {
    if (!metadata) return {};

    const sanitized: Record<string, unknown> = {};
    const piiFields = [
      'password', 'ssn', 'social_security', 'credit_card', 'email',
      'phone', 'address', 'dob', 'date_of_birth', 'medical_record',
      'patient_id', 'patient_name', 'diagnosis', 'medication',
    ];

    for (const [key, value] of Object.entries(metadata)) {
      const lowerKey = key.toLowerCase();
      if (piiFields.some(field => lowerKey.includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeMetadata(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Shutdown the logger gracefully
   */
  async shutdown(): Promise<void> {
    this.stopFlushTimer();
    await this.flush();
    this.isInitialized = false;
  }
}

// ============================================================================
// CloudWatch Metrics Integration
// ============================================================================

export class CloudWatchMetrics {
  private client: CloudWatchClient;
  private namespace: string;
  private defaultDimensions: Record<string, string>;
  private metricsBuffer: MetricDatum[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private batchSize: number;
  private flushIntervalMs: number;
  private resolution: number;

  constructor(config: CloudWatchConfig) {
    this.client = new CloudWatchClient({
      region: config.region || process.env.AWS_REGION || 'us-east-1',
    });
    this.namespace = config.namespace || 'UnifiedHealth';
    this.defaultDimensions = {
      Service: config.serviceName || process.env.SERVICE_NAME || 'unified-health-api',
      Environment: config.environment || process.env.NODE_ENV || 'production',
    };
    this.batchSize = config.batchSize || 20; // CloudWatch limit is 20 metrics per request
    this.flushIntervalMs = config.flushIntervalMs || 60000;
    this.resolution = config.metricResolution || 60;
  }

  /**
   * Initialize the metrics collector
   */
  initialize(): void {
    this.startFlushTimer();
    console.log(`CloudWatch Metrics initialized: namespace=${this.namespace}`);
  }

  /**
   * Start the flush timer
   */
  private startFlushTimer(): void {
    if (this.flushTimer) return;

    this.flushTimer = setInterval(() => {
      this.flush().catch(console.error);
    }, this.flushIntervalMs);
  }

  /**
   * Stop the flush timer
   */
  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Record a metric
   */
  putMetric(metric: MetricDefinition): void {
    const dimensions = {
      ...this.defaultDimensions,
      ...metric.dimensions,
    };

    const metricDatum: MetricDatum = {
      MetricName: metric.name,
      Value: metric.value,
      Unit: metric.unit || StandardUnit.None,
      Timestamp: metric.timestamp || new Date(),
      StorageResolution: metric.storageResolution || this.resolution,
      Dimensions: Object.entries(dimensions).map(([Name, Value]) => ({ Name, Value })),
    };

    this.metricsBuffer.push(metricDatum);

    // Auto-flush if buffer is full
    if (this.metricsBuffer.length >= this.batchSize) {
      this.flush().catch(console.error);
    }
  }

  /**
   * Pre-defined metric helpers
   */

  // API Metrics
  recordApiLatency(endpoint: string, method: string, durationMs: number): void {
    this.putMetric({
      name: 'APILatency',
      value: durationMs,
      unit: StandardUnit.Milliseconds,
      dimensions: { Endpoint: endpoint, Method: method },
    });
  }

  recordApiError(endpoint: string, method: string, statusCode: number): void {
    this.putMetric({
      name: 'APIErrors',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { Endpoint: endpoint, Method: method, StatusCode: statusCode.toString() },
    });
  }

  recordApiRequest(endpoint: string, method: string): void {
    this.putMetric({
      name: 'APIRequests',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { Endpoint: endpoint, Method: method },
    });
  }

  // Database Metrics
  recordDbConnectionPoolSize(active: number, idle: number, waiting: number): void {
    this.putMetric({
      name: 'DBConnectionPoolActive',
      value: active,
      unit: StandardUnit.Count,
    });
    this.putMetric({
      name: 'DBConnectionPoolIdle',
      value: idle,
      unit: StandardUnit.Count,
    });
    this.putMetric({
      name: 'DBConnectionPoolWaiting',
      value: waiting,
      unit: StandardUnit.Count,
    });
  }

  recordDbQueryDuration(operation: string, table: string, durationMs: number): void {
    this.putMetric({
      name: 'DBQueryDuration',
      value: durationMs,
      unit: StandardUnit.Milliseconds,
      dimensions: { Operation: operation, Table: table },
    });
  }

  // Cache Metrics
  recordCacheHit(cacheName: string): void {
    this.putMetric({
      name: 'CacheHits',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { CacheName: cacheName },
    });
  }

  recordCacheMiss(cacheName: string): void {
    this.putMetric({
      name: 'CacheMisses',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { CacheName: cacheName },
    });
  }

  // Business Metrics
  recordAppointmentCreated(appointmentType: string): void {
    this.putMetric({
      name: 'AppointmentsCreated',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { AppointmentType: appointmentType },
    });
  }

  recordPatientRegistered(): void {
    this.putMetric({
      name: 'PatientsRegistered',
      value: 1,
      unit: StandardUnit.Count,
    });
  }

  recordConsultationCompleted(consultationType: string, durationMinutes: number): void {
    this.putMetric({
      name: 'ConsultationsCompleted',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { ConsultationType: consultationType },
    });
    this.putMetric({
      name: 'ConsultationDuration',
      value: durationMinutes,
      unit: StandardUnit.Count,
      dimensions: { ConsultationType: consultationType },
    });
  }

  recordPrescriptionIssued(medicationType: string): void {
    this.putMetric({
      name: 'PrescriptionsIssued',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { MedicationType: medicationType },
    });
  }

  recordPaymentProcessed(currency: string, amount: number, success: boolean): void {
    this.putMetric({
      name: success ? 'PaymentsSuccessful' : 'PaymentsFailed',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { Currency: currency },
    });
    if (success) {
      this.putMetric({
        name: 'PaymentAmount',
        value: amount,
        unit: StandardUnit.None,
        dimensions: { Currency: currency },
      });
    }
  }

  recordLabOrderCreated(testType: string): void {
    this.putMetric({
      name: 'LabOrdersCreated',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { TestType: testType },
    });
  }

  /**
   * Flush buffered metrics to CloudWatch
   */
  async flush(): Promise<void> {
    if (this.metricsBuffer.length === 0) return;

    // CloudWatch accepts max 20 metrics per request
    while (this.metricsBuffer.length > 0) {
      const batch = this.metricsBuffer.splice(0, 20);

      try {
        const command = new PutMetricDataCommand({
          Namespace: this.namespace,
          MetricData: batch,
        });

        await this.client.send(command);
      } catch (error) {
        console.error('Failed to flush metrics to CloudWatch:', error);
        // Put metrics back for retry
        this.metricsBuffer = [...batch, ...this.metricsBuffer];
        break;
      }
    }
  }

  /**
   * Shutdown metrics gracefully
   */
  async shutdown(): Promise<void> {
    this.stopFlushTimer();
    await this.flush();
  }
}

// ============================================================================
// CloudWatch Alarms Manager
// ============================================================================

export class CloudWatchAlarmsManager {
  private client: CloudWatchClient;
  private namespace: string;
  private snsTopicArn?: string;

  constructor(config: CloudWatchConfig, snsTopicArn?: string) {
    this.client = new CloudWatchClient({
      region: config.region || process.env.AWS_REGION || 'us-east-1',
    });
    this.namespace = config.namespace || 'UnifiedHealth';
    this.snsTopicArn = snsTopicArn || process.env.CLOUDWATCH_ALARM_SNS_TOPIC;
  }

  /**
   * Create a CloudWatch alarm
   */
  async createAlarm(config: AlarmConfig): Promise<void> {
    const dimensions = config.dimensions
      ? Object.entries(config.dimensions).map(([Name, Value]) => ({ Name, Value }))
      : undefined;

    const alarmActions = config.alarmActions || (this.snsTopicArn ? [this.snsTopicArn] : []);
    const okActions = config.okActions || (this.snsTopicArn ? [this.snsTopicArn] : []);

    const command = new PutMetricAlarmCommand({
      AlarmName: config.alarmName,
      AlarmDescription: config.description,
      MetricName: config.metricName,
      Namespace: config.namespace || this.namespace,
      Statistic: config.statistic,
      Period: config.period,
      EvaluationPeriods: config.evaluationPeriods,
      DatapointsToAlarm: config.datapointsToAlarm || config.evaluationPeriods,
      Threshold: config.threshold,
      ComparisonOperator: config.comparisonOperator,
      Dimensions: dimensions,
      ActionsEnabled: config.actionsEnabled ?? true,
      AlarmActions: alarmActions,
      OKActions: okActions,
      InsufficientDataActions: config.insufficientDataActions || [],
      TreatMissingData: config.treatMissingData || TreatMissingData.MISSING,
    });

    await this.client.send(command);
    console.log(`Created CloudWatch alarm: ${config.alarmName}`);
  }

  /**
   * Delete alarms
   */
  async deleteAlarms(alarmNames: string[]): Promise<void> {
    const command = new DeleteAlarmsCommand({
      AlarmNames: alarmNames,
    });

    await this.client.send(command);
    console.log(`Deleted CloudWatch alarms: ${alarmNames.join(', ')}`);
  }

  /**
   * Get alarm status
   */
  async getAlarmStatus(alarmNames?: string[]): Promise<{ name: string; state: string }[]> {
    const command = new DescribeAlarmsCommand({
      AlarmNames: alarmNames,
    });

    const response = await this.client.send(command);
    return (response.MetricAlarms || []).map(alarm => ({
      name: alarm.AlarmName || '',
      state: alarm.StateValue || 'UNKNOWN',
    }));
  }

  /**
   * Create standard healthcare platform alarms
   */
  async createStandardAlarms(): Promise<void> {
    const alarms: AlarmConfig[] = [
      {
        alarmName: 'UnifiedHealth-HighAPILatency',
        metricName: 'APILatency',
        threshold: 1000, // 1 second
        comparisonOperator: ComparisonOperator.GreaterThanThreshold,
        evaluationPeriods: 3,
        period: 300, // 5 minutes
        statistic: Statistic.Average,
        description: 'API latency is above 1 second',
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
      {
        alarmName: 'UnifiedHealth-HighErrorRate',
        metricName: 'APIErrors',
        threshold: 10,
        comparisonOperator: ComparisonOperator.GreaterThanThreshold,
        evaluationPeriods: 2,
        period: 300,
        statistic: Statistic.Sum,
        description: 'API error rate is elevated',
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
      {
        alarmName: 'UnifiedHealth-LowCacheHitRate',
        metricName: 'CacheMisses',
        threshold: 100,
        comparisonOperator: ComparisonOperator.GreaterThanThreshold,
        evaluationPeriods: 3,
        period: 300,
        statistic: Statistic.Sum,
        description: 'Cache miss rate is high',
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
      {
        alarmName: 'UnifiedHealth-DBConnectionPoolExhausted',
        metricName: 'DBConnectionPoolWaiting',
        threshold: 5,
        comparisonOperator: ComparisonOperator.GreaterThanThreshold,
        evaluationPeriods: 2,
        period: 60,
        statistic: Statistic.Maximum,
        description: 'Database connection pool is near exhaustion',
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
      {
        alarmName: 'UnifiedHealth-HighDBQueryLatency',
        metricName: 'DBQueryDuration',
        threshold: 500, // 500ms
        comparisonOperator: ComparisonOperator.GreaterThanThreshold,
        evaluationPeriods: 3,
        period: 300,
        statistic: Statistic.Average,
        description: 'Database query latency is high',
        treatMissingData: TreatMissingData.NOT_BREACHING,
      },
    ];

    for (const alarm of alarms) {
      try {
        await this.createAlarm(alarm);
      } catch (error) {
        console.error(`Failed to create alarm ${alarm.alarmName}:`, error);
      }
    }
  }
}

// ============================================================================
// AWS X-Ray Tracing Integration
// ============================================================================

export class XRayTracing {
  private serviceName: string;
  private isEnabled: boolean;

  constructor(config: CloudWatchConfig) {
    this.serviceName = config.serviceName || process.env.SERVICE_NAME || 'unified-health-api';
    this.isEnabled = config.enableXRay !== false;
  }

  /**
   * Initialize X-Ray tracing
   */
  initialize(): void {
    if (!this.isEnabled) {
      console.log('X-Ray tracing is disabled');
      return;
    }

    // Configure X-Ray SDK
    AWSXRay.setDaemonAddress(process.env.XRAY_DAEMON_ADDRESS || '127.0.0.1:2000');

    // Enable automatic instrumentation for HTTP calls
    AWSXRay.captureHTTPsGlobal(require('http'));
    AWSXRay.captureHTTPsGlobal(require('https'));

    // Capture AWS SDK calls
    AWSXRay.captureAWS(require('aws-sdk'));

    console.log(`X-Ray tracing initialized for service: ${this.serviceName}`);
  }

  /**
   * Create Express middleware for X-Ray tracing
   */
  createMiddleware(): RequestHandler {
    if (!this.isEnabled) {
      return (_req, _res, next) => next();
    }

    return AWSXRay.express.openSegment(this.serviceName);
  }

  /**
   * Create Express middleware for closing X-Ray segments
   */
  createCloseMiddleware(): RequestHandler {
    if (!this.isEnabled) {
      return (_req, _res, next) => next();
    }

    return AWSXRay.express.closeSegment();
  }

  /**
   * Start a new subsegment for custom tracing
   */
  startSubsegment(name: string): AWSXRay.Subsegment | null {
    if (!this.isEnabled) return null;

    try {
      const segment = AWSXRay.getSegment();
      if (segment) {
        return segment.addNewSubsegment(name);
      }
    } catch (error) {
      console.warn('Failed to start X-Ray subsegment:', error);
    }
    return null;
  }

  /**
   * Close a subsegment
   */
  closeSubsegment(subsegment: AWSXRay.Subsegment | null, error?: Error): void {
    if (!subsegment) return;

    if (error) {
      subsegment.addError(error);
    }
    subsegment.close();
  }

  /**
   * Add annotation to current segment
   */
  addAnnotation(key: string, value: string | number | boolean): void {
    if (!this.isEnabled) return;

    try {
      const segment = AWSXRay.getSegment();
      if (segment) {
        segment.addAnnotation(key, value);
      }
    } catch (error) {
      console.warn('Failed to add X-Ray annotation:', error);
    }
  }

  /**
   * Add metadata to current segment
   */
  addMetadata(key: string, value: unknown, namespace?: string): void {
    if (!this.isEnabled) return;

    try {
      const segment = AWSXRay.getSegment();
      if (segment) {
        segment.addMetadata(key, value, namespace || 'default');
      }
    } catch (error) {
      console.warn('Failed to add X-Ray metadata:', error);
    }
  }

  /**
   * Get current trace ID
   */
  getTraceId(): string | null {
    if (!this.isEnabled) return null;

    try {
      const segment = AWSXRay.getSegment();
      return segment?.trace_id || null;
    } catch {
      return null;
    }
  }

  /**
   * Capture async function with tracing
   */
  async captureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) return fn();

    const subsegment = this.startSubsegment(name);
    try {
      const result = await fn();
      this.closeSubsegment(subsegment);
      return result;
    } catch (error) {
      this.closeSubsegment(subsegment, error as Error);
      throw error;
    }
  }
}

// ============================================================================
// Express Middleware Integration
// ============================================================================

export interface CloudWatchMiddlewareOptions {
  logger: CloudWatchLogger;
  metrics: CloudWatchMetrics;
  xray?: XRayTracing;
  excludePaths?: string[];
  logRequestBody?: boolean;
  logResponseBody?: boolean;
}

/**
 * Create comprehensive CloudWatch middleware for Express
 */
export function createCloudWatchMiddleware(options: CloudWatchMiddlewareOptions): RequestHandler[] {
  const { logger, metrics, xray, excludePaths = ['/health', '/metrics', '/ready'], logRequestBody = false } = options;

  const middlewares: RequestHandler[] = [];

  // X-Ray opening middleware
  if (xray) {
    middlewares.push(xray.createMiddleware());
  }

  // Main monitoring middleware
  middlewares.push((req: Request, res: Response, next: NextFunction) => {
    // Skip excluded paths
    if (excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    const startTime = Date.now();
    const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
    const traceId = xray?.getTraceId() || undefined;

    // Attach correlation ID to request
    (req as any).correlationId = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);

    // Log request
    logger.info(`Incoming request: ${req.method} ${req.path}`, {
      method: req.method,
      path: req.path,
      query: req.query,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      ...(logRequestBody && { body: req.body }),
    }, correlationId);

    // Record request metric
    metrics.recordApiRequest(req.path, req.method);

    // Override res.end to capture response
    const originalEnd = res.end;
    res.end = function(this: Response, ...args: any[]): Response {
      const duration = Date.now() - startTime;

      // Record latency metric
      metrics.recordApiLatency(req.path, req.method, duration);

      // Record error if status >= 400
      if (res.statusCode >= 400) {
        metrics.recordApiError(req.path, req.method, res.statusCode);
      }

      // Log response
      logger.info(`Response: ${req.method} ${req.path} ${res.statusCode} ${duration}ms`, {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        traceId,
      }, correlationId);

      return originalEnd.apply(this, args);
    };

    next();
  });

  // X-Ray closing middleware
  if (xray) {
    middlewares.push(xray.createCloseMiddleware());
  }

  return middlewares;
}

// ============================================================================
// Health Check Configuration
// ============================================================================

export interface HealthCheckConfig {
  name: string;
  endpoint: string;
  intervalSeconds: number;
  timeoutSeconds: number;
  successThreshold: number;
  failureThreshold: number;
  expectedStatusCode?: number;
  expectedResponseTime?: number;
  regions?: string[];
}

/**
 * Generate CloudWatch Synthetics canary configuration
 */
export function generateCanaryConfig(config: HealthCheckConfig): Record<string, unknown> {
  return {
    Name: config.name,
    RuntimeVersion: 'syn-nodejs-puppeteer-6.2',
    ArtifactS3Location: `s3://unified-health-canary-artifacts/${config.name}`,
    ExecutionRoleArn: '${CANARY_EXECUTION_ROLE_ARN}',
    Schedule: {
      Expression: `rate(${config.intervalSeconds} seconds)`,
      DurationInSeconds: 0, // Run indefinitely
    },
    RunConfig: {
      TimeoutInSeconds: config.timeoutSeconds,
      MemoryInMB: 960,
      ActiveTracing: true,
    },
    SuccessRetentionPeriodInDays: 31,
    FailureRetentionPeriodInDays: 31,
    Code: {
      Handler: 'apiCanaryBlueprint.handler',
      Script: generateCanaryScript(config),
    },
    Tags: {
      Environment: '${ENVIRONMENT}',
      Service: 'unified-health',
    },
  };
}

/**
 * Generate canary script for health checks
 */
function generateCanaryScript(config: HealthCheckConfig): string {
  return `
const synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

const apiCanaryBlueprint = async function () {
  const requestOptions = {
    hostname: new URL('${config.endpoint}').hostname,
    method: 'GET',
    path: new URL('${config.endpoint}').pathname,
    port: 443,
    protocol: 'https:',
    headers: {
      'User-Agent': 'CloudWatch-Synthetics-Canary',
    },
  };

  const stepConfig = {
    includeRequestHeaders: true,
    includeResponseHeaders: true,
    includeRequestBody: false,
    includeResponseBody: true,
    continueOnHttpStepFailure: true,
  };

  let response = await synthetics.executeHttpStep(
    'Verify ${config.name}',
    requestOptions,
    validateResponse,
    stepConfig
  );

  return response;
};

const validateResponse = async function (res) {
  return new Promise((resolve, reject) => {
    const expectedStatusCode = ${config.expectedStatusCode || 200};

    if (res.statusCode !== expectedStatusCode) {
      throw new Error(\`Expected status code \${expectedStatusCode} but got \${res.statusCode}\`);
    }

    let responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });

    res.on('end', () => {
      try {
        const body = JSON.parse(responseBody);
        if (body.status !== 'healthy') {
          throw new Error('Service is not healthy');
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
};

exports.handler = async () => {
  return await apiCanaryBlueprint();
};
`;
}

// ============================================================================
// Dashboard Widget Helpers
// ============================================================================

export class DashboardBuilder {
  private widgets: DashboardWidget[] = [];
  private namespace: string;

  constructor(namespace: string = 'UnifiedHealth') {
    this.namespace = namespace;
  }

  /**
   * Add a metric widget
   */
  addMetricWidget(
    title: string,
    metrics: { name: string; stat: string; dimensions?: Record<string, string> }[],
    position: { x: number; y: number },
    size: { width: number; height: number } = { width: 6, height: 6 }
  ): this {
    const metricsList = metrics.map(m => [
      this.namespace,
      m.name,
      ...Object.entries(m.dimensions || {}).flat(),
      { stat: m.stat },
    ]);

    this.widgets.push({
      type: 'metric',
      title,
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      properties: {
        metrics: metricsList,
        view: 'timeSeries',
        stacked: false,
        region: '${AWS::Region}',
        period: 300,
      },
    });

    return this;
  }

  /**
   * Add a log widget
   */
  addLogWidget(
    title: string,
    logGroupName: string,
    query: string,
    position: { x: number; y: number },
    size: { width: number; height: number } = { width: 12, height: 6 }
  ): this {
    this.widgets.push({
      type: 'log',
      title,
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      properties: {
        query: `SOURCE '${logGroupName}' | ${query}`,
        region: '${AWS::Region}',
        view: 'table',
      },
    });

    return this;
  }

  /**
   * Add an alarm widget
   */
  addAlarmWidget(
    title: string,
    alarmNames: string[],
    position: { x: number; y: number },
    size: { width: number; height: number } = { width: 6, height: 3 }
  ): this {
    this.widgets.push({
      type: 'alarm',
      title,
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      properties: {
        alarms: alarmNames.map(name => `arn:aws:cloudwatch:\${AWS::Region}:\${AWS::AccountId}:alarm:${name}`),
        title,
      },
    });

    return this;
  }

  /**
   * Add a text widget
   */
  addTextWidget(
    markdown: string,
    position: { x: number; y: number },
    size: { width: number; height: number } = { width: 24, height: 2 }
  ): this {
    this.widgets.push({
      type: 'text',
      title: '',
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height,
      properties: {
        markdown,
      },
    });

    return this;
  }

  /**
   * Build the dashboard JSON
   */
  build(): Record<string, unknown> {
    return {
      widgets: this.widgets.map(w => ({
        type: w.type,
        x: w.x,
        y: w.y,
        width: w.width,
        height: w.height,
        properties: w.properties,
      })),
    };
  }
}

// ============================================================================
// Main CloudWatch Service
// ============================================================================

export class CloudWatchService {
  public logger: CloudWatchLogger;
  public metrics: CloudWatchMetrics;
  public alarms: CloudWatchAlarmsManager;
  public xray: XRayTracing;
  private config: CloudWatchConfig;

  constructor(config: CloudWatchConfig = {}) {
    this.config = {
      region: config.region || process.env.AWS_REGION || 'us-east-1',
      namespace: config.namespace || 'UnifiedHealth',
      logGroupName: config.logGroupName || `/unified-health/${config.environment || process.env.NODE_ENV || 'production'}`,
      serviceName: config.serviceName || process.env.SERVICE_NAME || 'unified-health-api',
      environment: config.environment || process.env.NODE_ENV || 'production',
      enableXRay: config.enableXRay !== false,
      enableMetrics: config.enableMetrics !== false,
      enableLogs: config.enableLogs !== false,
      metricResolution: config.metricResolution || 60,
      logRetentionDays: config.logRetentionDays || 30,
      batchSize: config.batchSize || 100,
      flushIntervalMs: config.flushIntervalMs || 5000,
    };

    this.logger = new CloudWatchLogger(this.config);
    this.metrics = new CloudWatchMetrics(this.config);
    this.alarms = new CloudWatchAlarmsManager(this.config);
    this.xray = new XRayTracing(this.config);
  }

  /**
   * Initialize all CloudWatch services
   */
  async initialize(): Promise<void> {
    if (this.config.enableLogs) {
      await this.logger.initialize();
    }

    if (this.config.enableMetrics) {
      this.metrics.initialize();
    }

    if (this.config.enableXRay) {
      this.xray.initialize();
    }

    console.log('CloudWatch services initialized');
  }

  /**
   * Create Express middleware
   */
  createMiddleware(options?: Partial<CloudWatchMiddlewareOptions>): RequestHandler[] {
    return createCloudWatchMiddleware({
      logger: this.logger,
      metrics: this.metrics,
      xray: this.xray,
      ...options,
    });
  }

  /**
   * Shutdown all services gracefully
   */
  async shutdown(): Promise<void> {
    await Promise.all([
      this.logger.shutdown(),
      this.metrics.shutdown(),
    ]);
    console.log('CloudWatch services shut down');
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let cloudWatchInstance: CloudWatchService | null = null;

/**
 * Get or create CloudWatch service instance
 */
export function getCloudWatchService(config?: CloudWatchConfig): CloudWatchService {
  if (!cloudWatchInstance) {
    cloudWatchInstance = new CloudWatchService(config);
  }
  return cloudWatchInstance;
}

/**
 * Export singleton for convenience
 */
export const cloudWatch = {
  get instance(): CloudWatchService {
    return getCloudWatchService();
  },
  initialize: async (config?: CloudWatchConfig): Promise<CloudWatchService> => {
    const service = getCloudWatchService(config);
    await service.initialize();
    return service;
  },
};

// ============================================================================
// Healthcare-specific Metrics Tracker (matching Azure pattern)
// ============================================================================

export class HealthcareMetricsTracker {
  constructor(private metrics: CloudWatchMetrics) {}

  trackAppointmentCreated(appointmentType: string, specialty?: string): void {
    this.metrics.recordAppointmentCreated(appointmentType);
    if (specialty) {
      this.metrics.putMetric({
        name: 'AppointmentsBySpecialty',
        value: 1,
        unit: StandardUnit.Count,
        dimensions: { Specialty: specialty },
      });
    }
  }

  trackAppointmentCancelled(reason: string, advanceNoticeHours: number): void {
    this.metrics.putMetric({
      name: 'AppointmentsCancelled',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { CancellationReason: reason },
    });
    this.metrics.putMetric({
      name: 'CancellationNoticeHours',
      value: advanceNoticeHours,
      unit: StandardUnit.Count,
    });
  }

  trackConsultationStarted(type: string, specialty: string): void {
    this.metrics.putMetric({
      name: 'ConsultationsStarted',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { ConsultationType: type, Specialty: specialty },
    });
  }

  trackConsultationCompleted(type: string, specialty: string, durationMinutes: number, prescriptionIssued: boolean): void {
    this.metrics.recordConsultationCompleted(type, durationMinutes);
    if (prescriptionIssued) {
      this.metrics.putMetric({
        name: 'ConsultationsWithPrescription',
        value: 1,
        unit: StandardUnit.Count,
        dimensions: { Specialty: specialty },
      });
    }
  }

  trackPrescriptionIssued(medicationType: string, quantity: number): void {
    this.metrics.recordPrescriptionIssued(medicationType);
    this.metrics.putMetric({
      name: 'PrescriptionQuantity',
      value: quantity,
      unit: StandardUnit.Count,
      dimensions: { MedicationType: medicationType },
    });
  }

  trackPaymentProcessed(amount: number, currency: string, method: string, success: boolean): void {
    this.metrics.recordPaymentProcessed(currency, amount, success);
    this.metrics.putMetric({
      name: 'PaymentsByMethod',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { PaymentMethod: method, Status: success ? 'success' : 'failed' },
    });
  }

  trackMedicalRecordAccess(recordType: string, accessType: string, userRole: string): void {
    this.metrics.putMetric({
      name: 'MedicalRecordAccesses',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { RecordType: recordType, AccessType: accessType, UserRole: userRole },
    });
  }

  trackUserRegistration(role: string, organizationType?: string): void {
    this.metrics.recordPatientRegistered();
    this.metrics.putMetric({
      name: 'UserRegistrations',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { Role: role, OrganizationType: organizationType || 'individual' },
    });
  }

  trackLoginAttempt(success: boolean, role?: string, failureReason?: string): void {
    this.metrics.putMetric({
      name: success ? 'LoginSuccess' : 'LoginFailure',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: {
        Role: role || 'unknown',
        ...(failureReason && { FailureReason: failureReason }),
      },
    });
  }

  trackVideoCallQuality(duration: number, packetLoss: number, jitter: number, latency: number): void {
    this.metrics.putMetric({ name: 'VideoCallDuration', value: duration, unit: StandardUnit.Seconds });
    this.metrics.putMetric({ name: 'VideoCallPacketLoss', value: packetLoss, unit: StandardUnit.Percent });
    this.metrics.putMetric({ name: 'VideoCallJitter', value: jitter, unit: StandardUnit.Milliseconds });
    this.metrics.putMetric({ name: 'VideoCallLatency', value: latency, unit: StandardUnit.Milliseconds });
  }

  trackLabOrderCreated(testType: string, priority: string): void {
    this.metrics.recordLabOrderCreated(testType);
    this.metrics.putMetric({
      name: 'LabOrdersByPriority',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { Priority: priority },
    });
  }

  trackLabResultReady(testType: string, turnaroundTimeHours: number): void {
    this.metrics.putMetric({
      name: 'LabResultsReady',
      value: 1,
      unit: StandardUnit.Count,
      dimensions: { TestType: testType },
    });
    this.metrics.putMetric({
      name: 'LabTurnaroundTime',
      value: turnaroundTimeHours,
      unit: StandardUnit.Count,
      dimensions: { TestType: testType },
    });
  }
}

// Export healthcare metrics tracker factory
export function createHealthcareMetrics(service: CloudWatchService): HealthcareMetricsTracker {
  return new HealthcareMetricsTracker(service.metrics);
}
