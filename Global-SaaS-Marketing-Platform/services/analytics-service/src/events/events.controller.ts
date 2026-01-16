import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import {
  IngestEventDto,
  BatchIngestDto,
  ValidateEventDto,
  IngestResponseDto,
  BatchIngestResponseDto,
  ValidationResultDto,
} from './dto/ingest-event.dto';

@ApiTags('Events')
@ApiBearerAuth()
@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('ingest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ingest a single tracking event',
    description: `
Ingests a single tracking event into the analytics pipeline.
Events are validated, enriched with metadata, and sent to Kinesis for real-time processing.

**Supported Event Types:**
- \`page_view\` - Page view tracking
- \`click\` - Click events
- \`form_submit\` - Form submissions
- \`purchase\` - Transaction/purchase events
- \`user_signup\` - User registration
- \`user_login\` - Login attempts
- \`scroll\` - Scroll depth tracking
- \`error\` - JavaScript errors
- \`custom_*\` - Custom events (prefix with "custom_")
    `,
  })
  @ApiBody({ type: IngestEventDto })
  @ApiResponse({
    status: 200,
    description: 'Event successfully ingested',
    type: IngestResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid event payload',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async ingestEvent(@Body() eventDto: IngestEventDto): Promise<IngestResponseDto> {
    return this.eventsService.ingestEvent(eventDto);
  }

  @Post('batch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Batch ingest multiple tracking events',
    description: `
Ingests multiple tracking events in a single request for improved throughput.
Maximum batch size is 1000 events.

**Features:**
- Atomic batch processing with partial success support
- Events are validated individually
- Failed events are reported with their index and error
- Successfully ingested events are processed even if some fail
    `,
  })
  @ApiBody({ type: BatchIngestDto })
  @ApiResponse({
    status: 200,
    description: 'Batch processing complete',
    type: BatchIngestResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid batch payload',
  })
  async batchIngestEvents(@Body() batchDto: BatchIngestDto): Promise<BatchIngestResponseDto> {
    return this.eventsService.batchIngestEvents(batchDto);
  }

  @Get('schema')
  @ApiOperation({
    summary: 'Get event schema definitions',
    description: `
Returns the schema definitions for all supported event types.
Use this endpoint to understand the required and optional fields for each event type.

**Response includes:**
- Schema for each event type
- Required and optional fields
- Field types and constraints
- Example payloads
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Event schema definitions',
    schema: {
      type: 'object',
      properties: {
        schemas: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              required_fields: { type: 'array', items: { type: 'string' } },
              json_schema: { type: 'object' },
            },
          },
        },
        supported_event_types: {
          type: 'array',
          items: { type: 'string' },
        },
        custom_events: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            example: { type: 'string' },
          },
        },
      },
    },
  })
  getEventSchemas(): Record<string, any> {
    return this.eventsService.getEventSchemas();
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate an event payload',
    description: `
Validates an event payload against the schema without ingesting it.
Useful for debugging and testing event payloads before sending them.

**Features:**
- Full schema validation
- Detailed error messages with field paths
- Option to validate against specific event type schema
    `,
  })
  @ApiBody({ type: ValidateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Validation result',
    type: ValidationResultDto,
  })
  validateEvent(@Body() dto: ValidateEventDto): ValidationResultDto {
    return this.eventsService.validateEventPayload(dto);
  }
}
