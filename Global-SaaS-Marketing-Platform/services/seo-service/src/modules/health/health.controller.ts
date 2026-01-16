import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthService: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Health check', description: 'Returns overall health status of the service' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async check() {
    return this.health.check([
      () => this.healthService.checkDatabase(),
      () => this.healthService.checkRedis(),
      () => this.healthService.checkMemory(),
    ]);
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe', description: 'Returns if the service is alive (for K8s)' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  async liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe', description: 'Returns if the service is ready to accept traffic (for K8s)' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  async readiness() {
    return this.health.check([
      () => this.healthService.checkDatabase(),
      () => this.healthService.checkRedis(),
    ]);
  }
}
