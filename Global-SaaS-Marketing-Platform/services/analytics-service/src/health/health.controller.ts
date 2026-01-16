import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HealthCheckResult } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { MetricsService, ServiceMetrics } from './metrics.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private healthService: HealthService,
    private metricsService: MetricsService,
  ) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @HealthCheck()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: `
Returns the health status of the service and its dependencies.

**Checked Components:**
- Redis (cache)
- Kinesis (event streaming)
- DynamoDB (data storage)
- S3 (event archival)
- Memory usage

**Response:**
- 200 OK if all checks pass
- 503 Service Unavailable if any check fails
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['ok', 'error'] },
        info: { type: 'object' },
        error: { type: 'object' },
        details: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Service is unhealthy',
  })
  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.healthService.checkRedis(),
      () => this.healthService.checkDynamoDB(),
      () => this.healthService.checkS3(),
      () => this.healthService.checkMemory(),
    ]);
  }

  @Get('health/live')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Liveness probe',
    description: 'Simple liveness check - returns OK if the service is running',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is live',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  async liveness(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/ready')
  @HttpCode(HttpStatus.OK)
  @HealthCheck()
  @ApiOperation({
    summary: 'Readiness probe',
    description: 'Checks if the service is ready to accept traffic',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is ready',
  })
  @ApiResponse({
    status: 503,
    description: 'Service is not ready',
  })
  async readiness(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.healthService.checkRedis(),
      () => this.healthService.checkDynamoDB(),
    ]);
  }

  @Get('info')
  @ApiOperation({
    summary: 'Service information',
    description: 'Returns general information about the service',
  })
  @ApiResponse({
    status: 200,
    description: 'Service information',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'analytics-service' },
        version: { type: 'string', example: '1.0.0' },
        environment: { type: 'string', example: 'production' },
        nodeVersion: { type: 'string', example: 'v20.10.0' },
        uptime: { type: 'number', example: 3600 },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  getInfo(): Record<string, any> {
    return this.healthService.getServiceInfo();
  }

  @Get('metrics')
  @ApiOperation({
    summary: 'Service metrics',
    description: `
Returns detailed service metrics in JSON format.

**Metrics Include:**
- Request statistics (total, success, failed, latency)
- Event ingestion metrics
- Cache hit/miss rates
- System metrics (CPU, memory, uptime)
- Throughput (events/sec, requests/sec)
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Service metrics',
    schema: {
      type: 'object',
      properties: {
        requests: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            success: { type: 'number' },
            failed: { type: 'number' },
            avgLatencyMs: { type: 'number' },
          },
        },
        events: {
          type: 'object',
          properties: {
            ingested: { type: 'number' },
            processed: { type: 'number' },
            failed: { type: 'number' },
          },
        },
        cache: {
          type: 'object',
          properties: {
            hits: { type: 'number' },
            misses: { type: 'number' },
            hitRate: { type: 'number' },
          },
        },
        system: {
          type: 'object',
          properties: {
            cpuUsage: { type: 'number' },
            memoryUsage: { type: 'number' },
            uptime: { type: 'number' },
          },
        },
        throughput: {
          type: 'object',
          properties: {
            eventsPerSecond: { type: 'number' },
            requestsPerSecond: { type: 'number' },
          },
        },
      },
    },
  })
  getMetrics(): ServiceMetrics {
    return this.metricsService.getMetrics();
  }

  @Get('metrics/prometheus')
  @ApiOperation({
    summary: 'Prometheus metrics',
    description: 'Returns service metrics in Prometheus exposition format',
  })
  @ApiResponse({
    status: 200,
    description: 'Prometheus metrics',
    content: {
      'text/plain': {
        schema: {
          type: 'string',
          example: '# HELP analytics_requests_total Total requests\nanalytics_requests_total{status="success"} 1000',
        },
      },
    },
  })
  getPrometheusMetrics(): string {
    return this.metricsService.getPrometheusMetrics();
  }
}
