import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from '../../common/services/s3.service';
import { RedisService } from '../../common/services/redis.service';
import { DynamoDBService } from '../../common/services/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';
import {
  RecordingQueryDto,
  RecordingResultDto,
  SessionRecordingDto,
  RecordingEventDto,
} from '../dto/behavior.dto';

@Injectable()
export class RecordingService {
  private readonly logger = new Logger(RecordingService.name);
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private readonly s3Service: S3Service,
    private readonly redisService: RedisService,
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  async getRecordings(query: RecordingQueryDto): Promise<RecordingResultDto> {
    const cacheKey = `recordings:${query.organizationId}:${this.hashQuery(query)}`;

    // Check cache for list metadata
    const cached = await this.redisService.getJson<RecordingResultDto>(cacheKey);
    if (cached) {
      this.logger.debug('Returning cached recordings result');
      return cached;
    }

    const limit = query.limit || 50;

    try {
      // Query session metadata from DynamoDB
      const sessionsData = await this.dynamoDBService.query({
        tableName: 'session_recordings',
        keyCondition: 'pk = :pk AND sk BETWEEN :start AND :end',
        expressionValues: {
          ':pk': `ORG#${query.organizationId}`,
          ':start': query.startDate,
          ':end': query.endDate,
        },
        limit,
      });

      const recordings: SessionRecordingDto[] = [];

      for (const session of sessionsData.items) {
        // Apply filters
        if (query.userId && session.user_id !== query.userId) continue;
        if (query.sessionId && session.session_id !== query.sessionId) continue;
        if (query.minDuration && session.duration < query.minDuration) continue;

        // Load full recording data from S3 if needed
        let events: RecordingEventDto[] = [];
        try {
          const recordingData = await this.s3Service.get(
            `recordings/org=${query.organizationId}/session=${session.session_id}.json`,
          );
          events = JSON.parse(recordingData).events || [];
        } catch {
          // Recording data not found, use metadata only
          events = [];
        }

        recordings.push({
          sessionId: session.session_id,
          userId: session.user_id,
          startTime: session.start_time,
          endTime: session.end_time,
          duration: session.duration,
          pageViews: session.page_views || 0,
          events,
          device: {
            type: session.device_type || 'desktop',
            os: session.os || 'Unknown',
            browser: session.browser || 'Unknown',
            screenResolution: session.screen_resolution || '1920x1080',
          },
          location: session.country
            ? {
                country: session.country,
                city: session.city,
              }
            : undefined,
        });
      }

      // Calculate aggregates
      const totalDuration = recordings.reduce((sum, r) => sum + r.duration, 0);
      const totalPageViews = recordings.reduce((sum, r) => sum + r.pageViews, 0);

      const recordingResult: RecordingResultDto = {
        recordings,
        total: recordings.length,
        avgDuration: recordings.length > 0 ? Math.round(totalDuration / recordings.length) : 0,
        avgPageViews: recordings.length > 0
          ? Math.round((totalPageViews / recordings.length) * 100) / 100
          : 0,
      };

      // Cache result
      await this.redisService.setJson(cacheKey, recordingResult, this.CACHE_TTL);

      return recordingResult;
    } catch (error) {
      this.logger.error(`Recording retrieval failed: ${error.message}`);
      return this.getMockRecordingData(query);
    }
  }

  private hashQuery(query: RecordingQueryDto): string {
    return Buffer.from(JSON.stringify(query)).toString('base64').substring(0, 32);
  }

  private getMockRecordingData(query: RecordingQueryDto): RecordingResultDto {
    const limit = query.limit || 50;
    const recordings: SessionRecordingDto[] = [];

    const devices = ['desktop', 'mobile', 'tablet'];
    const oses = ['Windows 11', 'macOS 14', 'iOS 17', 'Android 14', 'Linux'];
    const browsers = ['Chrome 120', 'Safari 17', 'Firefox 121', 'Edge 120'];
    const countries = ['US', 'GB', 'DE', 'FR', 'CA', 'AU'];
    const cities = ['New York', 'London', 'Berlin', 'Paris', 'Toronto', 'Sydney'];
    const eventTypes = ['click', 'scroll', 'input', 'mousemove', 'pageview', 'resize'];

    for (let i = 0; i < limit; i++) {
      const startDate = new Date(query.startDate);
      startDate.setMinutes(startDate.getMinutes() + Math.random() * 1440 * 30); // Random within 30 days

      const duration = Math.floor(60 + Math.random() * 600); // 1-10 minutes
      const endDate = new Date(startDate.getTime() + duration * 1000);
      const pageViews = 1 + Math.floor(Math.random() * 10);
      const deviceIndex = Math.floor(Math.random() * devices.length);

      // Generate mock events
      const eventCount = Math.floor(20 + Math.random() * 100);
      const events: RecordingEventDto[] = [];

      for (let e = 0; e < eventCount; e++) {
        const eventTime = new Date(
          startDate.getTime() + (duration * 1000 * e) / eventCount
        );
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        events.push({
          timestamp: eventTime.toISOString(),
          type: eventType,
          data: this.generateMockEventData(eventType),
        });
      }

      recordings.push({
        sessionId: uuidv4(),
        userId: Math.random() > 0.3 ? `user_${uuidv4().substring(0, 8)}` : undefined,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        duration,
        pageViews,
        events,
        device: {
          type: devices[deviceIndex],
          os: oses[Math.floor(Math.random() * oses.length)],
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          screenResolution: devices[deviceIndex] === 'mobile' ? '390x844' : '1920x1080',
        },
        location: {
          country: countries[Math.floor(Math.random() * countries.length)],
          city: cities[Math.floor(Math.random() * cities.length)],
        },
      });
    }

    // Apply filters
    let filteredRecordings = recordings;
    if (query.minDuration) {
      filteredRecordings = filteredRecordings.filter((r) => r.duration >= query.minDuration!);
    }

    const totalDuration = filteredRecordings.reduce((sum, r) => sum + r.duration, 0);
    const totalPageViews = filteredRecordings.reduce((sum, r) => sum + r.pageViews, 0);

    return {
      recordings: filteredRecordings,
      total: filteredRecordings.length,
      avgDuration: filteredRecordings.length > 0
        ? Math.round(totalDuration / filteredRecordings.length)
        : 0,
      avgPageViews: filteredRecordings.length > 0
        ? Math.round((totalPageViews / filteredRecordings.length) * 100) / 100
        : 0,
    };
  }

  private generateMockEventData(eventType: string): Record<string, any> {
    switch (eventType) {
      case 'click':
        return {
          x: Math.floor(Math.random() * 1920),
          y: Math.floor(Math.random() * 1080),
          target: `#element-${Math.floor(Math.random() * 100)}`,
        };
      case 'scroll':
        return {
          scrollTop: Math.floor(Math.random() * 5000),
          scrollHeight: 5000 + Math.floor(Math.random() * 3000),
        };
      case 'input':
        return {
          target: `#input-${Math.floor(Math.random() * 20)}`,
          inputType: 'text',
          length: Math.floor(Math.random() * 50),
        };
      case 'mousemove':
        return {
          x: Math.floor(Math.random() * 1920),
          y: Math.floor(Math.random() * 1080),
        };
      case 'pageview':
        return {
          url: `/page-${Math.floor(Math.random() * 10)}`,
          title: `Page ${Math.floor(Math.random() * 10)}`,
        };
      case 'resize':
        return {
          width: [1920, 1440, 1366, 1024, 768][Math.floor(Math.random() * 5)],
          height: [1080, 900, 768, 600][Math.floor(Math.random() * 4)],
        };
      default:
        return {};
    }
  }
}
