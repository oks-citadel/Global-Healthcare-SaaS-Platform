import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  HeadBucketCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export interface S3UploadOptions {
  bucket?: string;
  key: string;
  body: string | Buffer;
  contentType?: string;
  metadata?: Record<string, string>;
  tags?: Record<string, string>;
}

export interface S3EventStorageOptions {
  organizationId: string;
  eventType: string;
  timestamp: Date;
  data: Record<string, any>;
}

@Injectable()
export class S3Service implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);
  private client: S3Client;
  private eventsBucket: string;
  private analyticsBucket: string;

  constructor(private configService: ConfigService) {
    this.client = new S3Client({
      region: this.configService.get('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', ''),
      },
    });

    this.eventsBucket = this.configService.get(
      'S3_EVENTS_BUCKET',
      'analytics-events-store',
    );
    this.analyticsBucket = this.configService.get(
      'S3_ANALYTICS_BUCKET',
      'analytics-results-store',
    );
  }

  async onModuleInit() {
    this.logger.log('S3 service initialized');
  }

  async upload(options: S3UploadOptions): Promise<string> {
    const bucket = options.bucket || this.eventsBucket;
    const tagging = options.tags
      ? Object.entries(options.tags)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&')
      : undefined;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: options.key,
      Body: options.body,
      ContentType: options.contentType || 'application/json',
      Metadata: options.metadata,
      Tagging: tagging,
    });

    try {
      await this.client.send(command);
      this.logger.debug(`Uploaded to s3://${bucket}/${options.key}`);
      return `s3://${bucket}/${options.key}`;
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`);
      throw error;
    }
  }

  async get(key: string, bucket?: string): Promise<string> {
    const targetBucket = bucket || this.eventsBucket;

    const command = new GetObjectCommand({
      Bucket: targetBucket,
      Key: key,
    });

    try {
      const response = await this.client.send(command);
      return await response.Body?.transformToString() || '';
    } catch (error) {
      this.logger.error(`Get failed: ${error.message}`);
      throw error;
    }
  }

  async list(
    prefix: string,
    bucket?: string,
    maxKeys: number = 1000,
  ): Promise<string[]> {
    const targetBucket = bucket || this.eventsBucket;

    const command = new ListObjectsV2Command({
      Bucket: targetBucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
    });

    try {
      const response = await this.client.send(command);
      return response.Contents?.map((obj) => obj.Key || '') || [];
    } catch (error) {
      this.logger.error(`List failed: ${error.message}`);
      throw error;
    }
  }

  async delete(key: string, bucket?: string): Promise<void> {
    const targetBucket = bucket || this.eventsBucket;

    const command = new DeleteObjectCommand({
      Bucket: targetBucket,
      Key: key,
    });

    try {
      await this.client.send(command);
      this.logger.debug(`Deleted s3://${targetBucket}/${key}`);
    } catch (error) {
      this.logger.error(`Delete failed: ${error.message}`);
      throw error;
    }
  }

  async storeEvent(options: S3EventStorageOptions): Promise<string> {
    const { organizationId, eventType, timestamp, data } = options;
    const date = timestamp.toISOString().split('T')[0];
    const hour = timestamp.getUTCHours().toString().padStart(2, '0');
    const eventId = uuidv4();

    // Partitioned path for Athena/Hive compatibility
    const key = `events/org=${organizationId}/event_type=${eventType}/date=${date}/hour=${hour}/${eventId}.json`;

    await this.upload({
      bucket: this.eventsBucket,
      key,
      body: JSON.stringify({
        ...data,
        _metadata: {
          event_id: eventId,
          organization_id: organizationId,
          event_type: eventType,
          stored_at: new Date().toISOString(),
        },
      }),
      contentType: 'application/json',
      metadata: {
        'organization-id': organizationId,
        'event-type': eventType,
      },
    });

    return key;
  }

  async storeEventBatch(
    organizationId: string,
    events: Array<{ eventType: string; timestamp: Date; data: Record<string, any> }>,
  ): Promise<string[]> {
    const storedKeys: string[] = [];

    // Group events by type and hour for efficient storage
    const groupedEvents = new Map<string, Array<{ timestamp: Date; data: Record<string, any> }>>();

    for (const event of events) {
      const key = `${event.eventType}-${event.timestamp.toISOString().substring(0, 13)}`;
      if (!groupedEvents.has(key)) {
        groupedEvents.set(key, []);
      }
      groupedEvents.get(key)!.push({ timestamp: event.timestamp, data: event.data });
    }

    // Store each group as a newline-delimited JSON file
    for (const [groupKey, groupEvents] of groupedEvents) {
      const [eventType, hourStr] = groupKey.split('-');
      const timestamp = new Date(hourStr + ':00:00.000Z');
      const date = timestamp.toISOString().split('T')[0];
      const hour = timestamp.getUTCHours().toString().padStart(2, '0');
      const batchId = uuidv4();

      const key = `events/org=${organizationId}/event_type=${eventType}/date=${date}/hour=${hour}/batch_${batchId}.ndjson`;

      const ndjsonContent = groupEvents
        .map((e) =>
          JSON.stringify({
            ...e.data,
            _metadata: {
              event_id: uuidv4(),
              organization_id: organizationId,
              event_type: eventType,
              event_timestamp: e.timestamp.toISOString(),
              stored_at: new Date().toISOString(),
            },
          }),
        )
        .join('\n');

      await this.upload({
        bucket: this.eventsBucket,
        key,
        body: ndjsonContent,
        contentType: 'application/x-ndjson',
      });

      storedKeys.push(key);
    }

    return storedKeys;
  }

  async storeAnalyticsResult(
    organizationId: string,
    analysisType: string,
    result: Record<string, any>,
  ): Promise<string> {
    const timestamp = new Date();
    const date = timestamp.toISOString().split('T')[0];
    const resultId = uuidv4();

    const key = `results/org=${organizationId}/type=${analysisType}/date=${date}/${resultId}.json`;

    await this.upload({
      bucket: this.analyticsBucket,
      key,
      body: JSON.stringify({
        ...result,
        _metadata: {
          result_id: resultId,
          organization_id: organizationId,
          analysis_type: analysisType,
          generated_at: timestamp.toISOString(),
        },
      }),
      contentType: 'application/json',
    });

    return key;
  }

  getEventsBucket(): string {
    return this.eventsBucket;
  }

  getAnalyticsBucket(): string {
    return this.analyticsBucket;
  }
}
