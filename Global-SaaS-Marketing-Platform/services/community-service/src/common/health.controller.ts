import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Kubernetes liveness probe' })
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Kubernetes readiness probe' })
  ready() {
    return { status: 'ready', timestamp: new Date().toISOString() };
  }

  @Get('info')
  @ApiOperation({ summary: 'Service information' })
  info() {
    return {
      service: 'community-service',
      version: '1.0.0',
      description: 'Internal Community and Social Analytics Service',
    };
  }
}
