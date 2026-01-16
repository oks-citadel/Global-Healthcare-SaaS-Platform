import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../common/cache/redis.service';

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {
    super();
  }

  async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.prisma.healthCheck();
      if (isHealthy) {
        return this.getStatus('database', true, { type: 'postgresql' });
      }
      throw new HealthCheckError('Database check failed', this.getStatus('database', false));
    } catch (error) {
      throw new HealthCheckError('Database check failed', this.getStatus('database', false, { error: error.message }));
    }
  }

  async checkRedis(): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.redis.healthCheck();
      if (isHealthy) {
        return this.getStatus('redis', true, { type: 'redis' });
      }
      throw new HealthCheckError('Redis check failed', this.getStatus('redis', false));
    } catch (error) {
      throw new HealthCheckError('Redis check failed', this.getStatus('redis', false, { error: error.message }));
    }
  }

  async checkMemory(): Promise<HealthIndicatorResult> {
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const rssMB = Math.round(memUsage.rss / 1024 / 1024);

    // Alert if using more than 512MB heap
    const isHealthy = heapUsedMB < 512;

    return this.getStatus('memory', isHealthy, {
      heapUsed: `${heapUsedMB}MB`,
      heapTotal: `${heapTotalMB}MB`,
      rss: `${rssMB}MB`,
    });
  }
}
