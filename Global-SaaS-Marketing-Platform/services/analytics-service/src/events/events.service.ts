import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { KinesisService } from '../common/services/kinesis.service';
import { DynamoDBService } from '../common/services/dynamodb.service';
import { S3Service } from '../common/services/s3.service';
import { RedisService } from '../common/services/redis.service';
import {
  IngestEventDto,
  BatchIngestDto,
  IngestResponseDto,
  BatchIngestResponseDto,
  ValidateEventDto,
  ValidationResultDto,
} from './dto/ingest-event.dto';
import {
  TrackingEventSchema,
  EventSchemaDefinitions,
  BaseEventSchema,
} from '../common/schemas/event.schema';
import { ZodError } from 'zod';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly kinesisService: KinesisService,
    private readonly dynamoDBService: DynamoDBService,
    private readonly s3Service: S3Service,
    private readonly redisService: RedisService,
  ) {}

  async ingestEvent(eventDto: IngestEventDto): Promise<IngestResponseDto> {
    const eventId = eventDto.event_id || uuidv4();
    const timestamp = this.normalizeTimestamp(eventDto.timestamp);

    try {
      // Validate event
      const validationResult = this.validateEventPayload({ event: eventDto });
      if (!validationResult.valid) {
        return {
          success: false,
          event_id: eventId,
          error: validationResult.errors?.map((e) => e.message).join('; '),
        };
      }

      // Prepare event with metadata
      const enrichedEvent = {
        ...eventDto,
        event_id: eventId,
        timestamp,
        received_at: new Date().toISOString(),
        processed: false,
      };

      // Send to Kinesis for real-time processing
      const sequenceNumber = await this.kinesisService.putRecord({
        partitionKey: eventDto.organization_id,
        data: enrichedEvent,
      });

      // Update real-time counters in DynamoDB
      await this.updateRealTimeCounters(eventDto, timestamp);

      // Track unique users in Redis
      const date = timestamp.split('T')[0];
      await this.redisService.trackUniqueUser(
        eventDto.organization_id,
        eventDto.user.user_id || eventDto.user.anonymous_id,
        date,
      );

      // Increment event counter in Redis
      await this.redisService.incrementEventCounter(
        eventDto.organization_id,
        eventDto.event_type,
        date,
      );

      this.logger.debug(`Event ${eventId} ingested successfully`);

      return {
        success: true,
        event_id: eventId,
        sequence_number: sequenceNumber,
      };
    } catch (error) {
      this.logger.error(`Failed to ingest event: ${error.message}`);
      return {
        success: false,
        event_id: eventId,
        error: error.message,
      };
    }
  }

  async batchIngestEvents(batchDto: BatchIngestDto): Promise<BatchIngestResponseDto> {
    const batchId = batchDto.batch_id || uuidv4();
    const failures: Array<{ index: number; error: string }> = [];
    const validEvents: Array<{ index: number; event: IngestEventDto; eventId: string }> = [];

    // Validate all events first
    for (let i = 0; i < batchDto.events.length; i++) {
      const event = batchDto.events[i];
      const eventId = event.event_id || uuidv4();
      const validation = this.validateEventPayload({ event });

      if (!validation.valid) {
        failures.push({
          index: i,
          error: validation.errors?.map((e) => e.message).join('; ') || 'Validation failed',
        });
      } else {
        validEvents.push({ index: i, event, eventId });
      }
    }

    if (validEvents.length === 0) {
      return {
        batch_id: batchId,
        total: batchDto.events.length,
        success_count: 0,
        failed_count: batchDto.events.length,
        failures,
      };
    }

    try {
      // Prepare Kinesis records
      const kinesisRecords = validEvents.map(({ event, eventId }) => ({
        partitionKey: event.organization_id,
        data: {
          ...event,
          event_id: eventId,
          timestamp: this.normalizeTimestamp(event.timestamp),
          received_at: new Date().toISOString(),
          batch_id: batchId,
        },
      }));

      // Send to Kinesis with retry
      const kinesisResult = await this.kinesisService.putRecordsWithRetry(kinesisRecords);

      // Add Kinesis failures to the failure list
      if (kinesisResult.failedCount > 0) {
        // Note: We'd need to track which specific records failed from Kinesis
        this.logger.warn(`${kinesisResult.failedCount} records failed in Kinesis`);
      }

      // Store batch to S3 for archival
      const s3Events = validEvents.map(({ event, eventId }) => ({
        eventType: event.event_type,
        timestamp: new Date(this.normalizeTimestamp(event.timestamp)),
        data: {
          ...event,
          event_id: eventId,
        },
      }));

      // Group events by organization for S3 storage
      const eventsByOrg = new Map<string, typeof s3Events>();
      for (let i = 0; i < validEvents.length; i++) {
        const orgId = validEvents[i].event.organization_id;
        if (!eventsByOrg.has(orgId)) {
          eventsByOrg.set(orgId, []);
        }
        eventsByOrg.get(orgId)!.push(s3Events[i]);
      }

      // Store to S3
      for (const [orgId, events] of eventsByOrg) {
        await this.s3Service.storeEventBatch(orgId, events);
      }

      // Update counters for valid events
      for (const { event, eventId } of validEvents) {
        const timestamp = this.normalizeTimestamp(event.timestamp);
        const date = timestamp.split('T')[0];

        await this.redisService.incrementEventCounter(
          event.organization_id,
          event.event_type,
          date,
        );

        await this.redisService.trackUniqueUser(
          event.organization_id,
          event.user.user_id || event.user.anonymous_id,
          date,
        );
      }

      this.logger.log(`Batch ${batchId}: ${validEvents.length} events ingested`);

      return {
        batch_id: batchId,
        total: batchDto.events.length,
        success_count: validEvents.length,
        failed_count: failures.length,
        failures: failures.length > 0 ? failures : undefined,
      };
    } catch (error) {
      this.logger.error(`Batch ingestion failed: ${error.message}`);

      return {
        batch_id: batchId,
        total: batchDto.events.length,
        success_count: 0,
        failed_count: batchDto.events.length,
        failures: [{ index: -1, error: `Batch processing failed: ${error.message}` }],
      };
    }
  }

  validateEventPayload(dto: ValidateEventDto): ValidationResultDto {
    try {
      let schema = TrackingEventSchema;

      // Use specific schema if requested
      if (dto.schema && EventSchemaDefinitions[dto.schema]) {
        schema = EventSchemaDefinitions[dto.schema].schema;
      }

      const result = schema.safeParse(dto.event);

      if (result.success) {
        return {
          valid: true,
          event_id: result.data.event_id,
        };
      }

      const errors = result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));

      return {
        valid: false,
        errors,
      };
    } catch (error) {
      return {
        valid: false,
        errors: [
          {
            path: '',
            message: error.message,
            code: 'VALIDATION_ERROR',
          },
        ],
      };
    }
  }

  getEventSchemas(): Record<string, any> {
    const schemas: Record<string, any> = {};

    for (const [key, def] of Object.entries(EventSchemaDefinitions)) {
      schemas[key] = {
        name: def.name,
        description: def.description,
        required_fields: def.required_fields,
        // Convert Zod schema to JSON Schema representation
        json_schema: this.zodToJsonSchema(def.schema),
      };
    }

    return {
      schemas,
      supported_event_types: Object.keys(EventSchemaDefinitions),
      custom_events: {
        description: 'Custom events should have event_type starting with "custom_"',
        example: 'custom_button_click',
      },
    };
  }

  private normalizeTimestamp(timestamp: string | number): string {
    if (typeof timestamp === 'number') {
      // Assume Unix timestamp in seconds or milliseconds
      const ts = timestamp > 10000000000 ? timestamp : timestamp * 1000;
      return new Date(ts).toISOString();
    }
    return new Date(timestamp).toISOString();
  }

  private async updateRealTimeCounters(
    event: IngestEventDto,
    timestamp: string,
  ): Promise<void> {
    const date = timestamp.split('T')[0];
    const hour = new Date(timestamp).getUTCHours();

    // Update daily event counter
    await this.dynamoDBService.incrementCounter(
      'event_counters',
      {
        pk: `ORG#${event.organization_id}`,
        sk: `DATE#${date}#TYPE#${event.event_type}`,
      },
      'event_count',
    );

    // Update hourly event counter
    await this.dynamoDBService.incrementCounter(
      'event_counters',
      {
        pk: `ORG#${event.organization_id}`,
        sk: `DATE#${date}#HOUR#${hour}#TYPE#${event.event_type}`,
      },
      'event_count',
    );

    // Update unique users set for the day (using HyperLogLog in Redis)
    const userId = event.user.user_id || event.user.anonymous_id;
    await this.redisService.pfadd(
      `hll:users:${event.organization_id}:${date}`,
      userId,
    );
  }

  private zodToJsonSchema(schema: any): Record<string, any> {
    // Simplified Zod to JSON Schema conversion
    // In production, use a library like zod-to-json-schema
    try {
      const shape = schema._def?.shape?.() || schema._def?.schema?._def?.shape?.() || {};
      const properties: Record<string, any> = {};
      const required: string[] = [];

      for (const [key, value] of Object.entries(shape)) {
        const field = value as any;
        properties[key] = this.zodFieldToJsonSchema(field);

        if (!field.isOptional?.()) {
          required.push(key);
        }
      }

      return {
        type: 'object',
        properties,
        required,
      };
    } catch {
      return { type: 'object' };
    }
  }

  private zodFieldToJsonSchema(field: any): Record<string, any> {
    const typeName = field._def?.typeName;

    switch (typeName) {
      case 'ZodString':
        return { type: 'string' };
      case 'ZodNumber':
        return { type: 'number' };
      case 'ZodBoolean':
        return { type: 'boolean' };
      case 'ZodArray':
        return { type: 'array', items: this.zodFieldToJsonSchema(field._def.type) };
      case 'ZodObject':
        return this.zodToJsonSchema(field);
      case 'ZodOptional':
        return this.zodFieldToJsonSchema(field._def.innerType);
      case 'ZodEnum':
        return { type: 'string', enum: field._def.values };
      case 'ZodRecord':
        return { type: 'object', additionalProperties: true };
      default:
        return { type: 'any' };
    }
  }
}
