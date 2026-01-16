import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../common/services/redis.service';

export interface ServiceMetrics {
  requests: {
    total: number;
    success: number;
    failed: number;
    avgLatencyMs: number;
  };
  events: {
    ingested: number;
    processed: number;
    failed: number;
    batchSize: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
  };
  system: {
    cpuUsage: number;
    memoryUsage: number;
    uptime: number;
    activeConnections: number;
  };
  throughput: {
    eventsPerSecond: number;
    requestsPerSecond: number;
  };
}

@Injectable()
export class MetricsService implements OnModuleInit {
  private metrics: ServiceMetrics;
  private startTime: number;
  private requestLatencies: number[] = [];

  constructor(private readonly redisService: RedisService) {
    this.resetMetrics();
    this.startTime = Date.now();
  }

  async onModuleInit() {
    // Load persisted metrics from Redis if available
    try {
      const persisted = await this.redisService.getJson<Partial<ServiceMetrics>>(
        'service_metrics',
      );
      if (persisted) {
        this.metrics = { ...this.metrics, ...persisted };
      }
    } catch {
      // Start fresh if no persisted metrics
    }

    // Periodically persist metrics
    setInterval(() => this.persistMetrics(), 60000);
  }

  private resetMetrics() {
    this.metrics = {
      requests: {
        total: 0,
        success: 0,
        failed: 0,
        avgLatencyMs: 0,
      },
      events: {
        ingested: 0,
        processed: 0,
        failed: 0,
        batchSize: 0,
      },
      cache: {
        hits: 0,
        misses: 0,
        hitRate: 0,
      },
      system: {
        cpuUsage: 0,
        memoryUsage: 0,
        uptime: 0,
        activeConnections: 0,
      },
      throughput: {
        eventsPerSecond: 0,
        requestsPerSecond: 0,
      },
    };
  }

  private async persistMetrics() {
    try {
      await this.redisService.setJson('service_metrics', this.metrics, 86400);
    } catch {
      // Ignore persistence errors
    }
  }

  recordRequest(success: boolean, latencyMs: number) {
    this.metrics.requests.total++;
    if (success) {
      this.metrics.requests.success++;
    } else {
      this.metrics.requests.failed++;
    }

    // Track last 1000 latencies for average calculation
    this.requestLatencies.push(latencyMs);
    if (this.requestLatencies.length > 1000) {
      this.requestLatencies.shift();
    }

    this.metrics.requests.avgLatencyMs =
      this.requestLatencies.reduce((a, b) => a + b, 0) / this.requestLatencies.length;
  }

  recordEventIngestion(count: number, success: boolean) {
    if (success) {
      this.metrics.events.ingested += count;
      this.metrics.events.processed += count;
    } else {
      this.metrics.events.failed += count;
    }
    this.metrics.events.batchSize = count;
  }

  recordCacheHit() {
    this.metrics.cache.hits++;
    this.updateCacheHitRate();
  }

  recordCacheMiss() {
    this.metrics.cache.misses++;
    this.updateCacheHitRate();
  }

  private updateCacheHitRate() {
    const total = this.metrics.cache.hits + this.metrics.cache.misses;
    this.metrics.cache.hitRate = total > 0
      ? Math.round((this.metrics.cache.hits / total) * 10000) / 100
      : 0;
  }

  updateSystemMetrics() {
    const memoryUsage = process.memoryUsage();
    const uptime = Math.round(process.uptime());
    const uptimeSeconds = (Date.now() - this.startTime) / 1000;

    this.metrics.system = {
      cpuUsage: this.getCpuUsage(),
      memoryUsage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
      uptime,
      activeConnections: 0, // Would be populated from connection pool
    };

    this.metrics.throughput = {
      eventsPerSecond: uptimeSeconds > 0
        ? Math.round((this.metrics.events.ingested / uptimeSeconds) * 100) / 100
        : 0,
      requestsPerSecond: uptimeSeconds > 0
        ? Math.round((this.metrics.requests.total / uptimeSeconds) * 100) / 100
        : 0,
    };
  }

  private getCpuUsage(): number {
    const cpuUsage = process.cpuUsage();
    const totalUsage = cpuUsage.user + cpuUsage.system;
    // Convert microseconds to percentage (rough estimate)
    return Math.min(100, Math.round((totalUsage / 1000000) * 100) / 100);
  }

  getMetrics(): ServiceMetrics {
    this.updateSystemMetrics();
    return { ...this.metrics };
  }

  getPrometheusMetrics(): string {
    this.updateSystemMetrics();

    const lines: string[] = [];

    // Request metrics
    lines.push('# HELP analytics_requests_total Total number of requests');
    lines.push('# TYPE analytics_requests_total counter');
    lines.push(`analytics_requests_total{status="success"} ${this.metrics.requests.success}`);
    lines.push(`analytics_requests_total{status="failed"} ${this.metrics.requests.failed}`);

    lines.push('# HELP analytics_request_latency_ms Average request latency in milliseconds');
    lines.push('# TYPE analytics_request_latency_ms gauge');
    lines.push(`analytics_request_latency_ms ${Math.round(this.metrics.requests.avgLatencyMs)}`);

    // Event metrics
    lines.push('# HELP analytics_events_total Total number of events');
    lines.push('# TYPE analytics_events_total counter');
    lines.push(`analytics_events_total{status="ingested"} ${this.metrics.events.ingested}`);
    lines.push(`analytics_events_total{status="processed"} ${this.metrics.events.processed}`);
    lines.push(`analytics_events_total{status="failed"} ${this.metrics.events.failed}`);

    // Cache metrics
    lines.push('# HELP analytics_cache_total Cache hits and misses');
    lines.push('# TYPE analytics_cache_total counter');
    lines.push(`analytics_cache_total{type="hit"} ${this.metrics.cache.hits}`);
    lines.push(`analytics_cache_total{type="miss"} ${this.metrics.cache.misses}`);

    lines.push('# HELP analytics_cache_hit_rate Cache hit rate percentage');
    lines.push('# TYPE analytics_cache_hit_rate gauge');
    lines.push(`analytics_cache_hit_rate ${this.metrics.cache.hitRate}`);

    // System metrics
    lines.push('# HELP analytics_memory_usage_percent Memory usage percentage');
    lines.push('# TYPE analytics_memory_usage_percent gauge');
    lines.push(`analytics_memory_usage_percent ${this.metrics.system.memoryUsage}`);

    lines.push('# HELP analytics_uptime_seconds Service uptime in seconds');
    lines.push('# TYPE analytics_uptime_seconds gauge');
    lines.push(`analytics_uptime_seconds ${this.metrics.system.uptime}`);

    // Throughput metrics
    lines.push('# HELP analytics_events_per_second Events ingested per second');
    lines.push('# TYPE analytics_events_per_second gauge');
    lines.push(`analytics_events_per_second ${this.metrics.throughput.eventsPerSecond}`);

    lines.push('# HELP analytics_requests_per_second Requests per second');
    lines.push('# TYPE analytics_requests_per_second gauge');
    lines.push(`analytics_requests_per_second ${this.metrics.throughput.requestsPerSecond}`);

    return lines.join('\n');
  }
}
