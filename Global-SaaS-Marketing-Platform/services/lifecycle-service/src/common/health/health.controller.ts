import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async check() {
    const dbHealth = await this.checkDatabase();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'lifecycle-service',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: dbHealth,
      },
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  async readiness() {
    const dbHealth = await this.checkDatabase();

    if (!dbHealth.healthy) {
      return {
        status: 'not_ready',
        checks: { database: dbHealth },
      };
    }

    return {
      status: 'ready',
      checks: { database: dbHealth },
    };
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  live() {
    return { status: 'alive' };
  }

  private async checkDatabase(): Promise<{ healthy: boolean; latency?: number; error?: string }> {
    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;
      return { healthy: true, latency };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
}
