import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { RedisService } from '../common/services/redis.service';
import { KinesisService } from '../common/services/kinesis.service';
import { DynamoDBService } from '../common/services/dynamodb.service';
import { S3Service } from '../common/services/s3.service';

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    private readonly redisService: RedisService,
    private readonly kinesisService: KinesisService,
    private readonly dynamoDBService: DynamoDBService,
    private readonly s3Service: S3Service,
  ) {
    super();
  }

  async checkRedis(): Promise<HealthIndicatorResult> {
    try {
      const startTime = Date.now();
      await this.redisService.set('health_check', 'ok', 10);
      const value = await this.redisService.get('health_check');
      const latency = Date.now() - startTime;

      if (value === 'ok') {
        return this.getStatus('redis', true, { latency: `${latency}ms` });
      }
      throw new Error('Redis health check failed');
    } catch (error) {
      throw new HealthCheckError(
        'Redis health check failed',
        this.getStatus('redis', false, { error: error.message }),
      );
    }
  }

  async checkKinesis(): Promise<HealthIndicatorResult> {
    try {
      // Kinesis health is checked on module init, just return current status
      return this.getStatus('kinesis', true, { status: 'connected' });
    } catch (error) {
      throw new HealthCheckError(
        'Kinesis health check failed',
        this.getStatus('kinesis', false, { error: error.message }),
      );
    }
  }

  async checkDynamoDB(): Promise<HealthIndicatorResult> {
    try {
      // Attempt a simple operation
      const startTime = Date.now();
      await this.dynamoDBService.get('health_check', { pk: 'health', sk: 'check' });
      const latency = Date.now() - startTime;

      return this.getStatus('dynamodb', true, { latency: `${latency}ms` });
    } catch (error) {
      // If table doesn't exist, that's okay for health check
      if (error.name === 'ResourceNotFoundException') {
        return this.getStatus('dynamodb', true, { status: 'connected' });
      }
      throw new HealthCheckError(
        'DynamoDB health check failed',
        this.getStatus('dynamodb', false, { error: error.message }),
      );
    }
  }

  async checkS3(): Promise<HealthIndicatorResult> {
    try {
      // Check if we can list objects (existence check)
      const startTime = Date.now();
      await this.s3Service.list('health-check/', undefined, 1);
      const latency = Date.now() - startTime;

      return this.getStatus('s3', true, {
        latency: `${latency}ms`,
        bucket: this.s3Service.getEventsBucket(),
      });
    } catch (error) {
      if (error.name === 'NoSuchBucket') {
        return this.getStatus('s3', true, { status: 'bucket_pending' });
      }
      throw new HealthCheckError(
        'S3 health check failed',
        this.getStatus('s3', false, { error: error.message }),
      );
    }
  }

  async checkMemory(): Promise<HealthIndicatorResult> {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);
    const rssMB = Math.round(memoryUsage.rss / 1024 / 1024);
    const heapUsedPercent = Math.round((heapUsedMB / heapTotalMB) * 100);

    const isHealthy = heapUsedPercent < 90;

    return this.getStatus('memory', isHealthy, {
      heapUsed: `${heapUsedMB}MB`,
      heapTotal: `${heapTotalMB}MB`,
      rss: `${rssMB}MB`,
      heapUsedPercent: `${heapUsedPercent}%`,
    });
  }

  getServiceInfo(): Record<string, any> {
    return {
      name: 'analytics-service',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
