import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Registry,
  Counter,
  Histogram,
  Gauge,
  collectDefaultMetrics,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry: Registry;

  // HTTP metrics
  public readonly httpRequestsTotal: Counter;
  public readonly httpRequestDuration: Histogram;

  // Content metrics
  public readonly contentPagesTotal: Gauge;
  public readonly contentVersionsCreated: Counter;
  public readonly contentPublished: Counter;
  public readonly contentSearches: Counter;

  // AI metrics
  public readonly aiOutlinesGenerated: Counter;
  public readonly aiBriefsGenerated: Counter;
  public readonly aiRepurposesGenerated: Counter;
  public readonly aiRequestDuration: Histogram;

  // Cache metrics
  public readonly cacheHits: Counter;
  public readonly cacheMisses: Counter;

  // Database metrics
  public readonly dbQueryDuration: Histogram;

  constructor() {
    this.registry = new Registry();

    // HTTP metrics
    this.httpRequestsTotal = new Counter({
      name: 'content_service_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new Histogram({
      name: 'content_service_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    });

    // Content metrics
    this.contentPagesTotal = new Gauge({
      name: 'content_service_pages_total',
      help: 'Total number of content pages',
      labelNames: ['tenant_id', 'status', 'type'],
      registers: [this.registry],
    });

    this.contentVersionsCreated = new Counter({
      name: 'content_service_versions_created_total',
      help: 'Total number of content versions created',
      labelNames: ['tenant_id'],
      registers: [this.registry],
    });

    this.contentPublished = new Counter({
      name: 'content_service_published_total',
      help: 'Total number of content publications',
      labelNames: ['tenant_id', 'type'],
      registers: [this.registry],
    });

    this.contentSearches = new Counter({
      name: 'content_service_searches_total',
      help: 'Total number of content searches',
      labelNames: ['tenant_id'],
      registers: [this.registry],
    });

    // AI metrics
    this.aiOutlinesGenerated = new Counter({
      name: 'content_service_ai_outlines_generated_total',
      help: 'Total number of AI outlines generated',
      labelNames: ['tenant_id', 'content_type'],
      registers: [this.registry],
    });

    this.aiBriefsGenerated = new Counter({
      name: 'content_service_ai_briefs_generated_total',
      help: 'Total number of AI briefs generated',
      labelNames: ['tenant_id', 'content_type'],
      registers: [this.registry],
    });

    this.aiRepurposesGenerated = new Counter({
      name: 'content_service_ai_repurposes_generated_total',
      help: 'Total number of AI content repurposes',
      labelNames: ['tenant_id', 'source_type', 'target_type'],
      registers: [this.registry],
    });

    this.aiRequestDuration = new Histogram({
      name: 'content_service_ai_request_duration_seconds',
      help: 'AI request duration in seconds',
      labelNames: ['operation'],
      buckets: [0.5, 1, 2, 5, 10, 30, 60],
      registers: [this.registry],
    });

    // Cache metrics
    this.cacheHits = new Counter({
      name: 'content_service_cache_hits_total',
      help: 'Total number of cache hits',
      labelNames: ['cache_type'],
      registers: [this.registry],
    });

    this.cacheMisses = new Counter({
      name: 'content_service_cache_misses_total',
      help: 'Total number of cache misses',
      labelNames: ['cache_type'],
      registers: [this.registry],
    });

    // Database metrics
    this.dbQueryDuration = new Histogram({
      name: 'content_service_db_query_duration_seconds',
      help: 'Database query duration in seconds',
      labelNames: ['operation', 'model'],
      buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
      registers: [this.registry],
    });
  }

  onModuleInit() {
    // Collect default Node.js metrics
    collectDefaultMetrics({
      register: this.registry,
      prefix: 'content_service_',
    });
  }

  /**
   * Get all metrics in Prometheus format
   */
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  /**
   * Get content type for metrics
   */
  getContentType(): string {
    return this.registry.contentType;
  }

  /**
   * Record HTTP request
   */
  recordHttpRequest(
    method: string,
    path: string,
    status: number,
    duration: number,
  ) {
    this.httpRequestsTotal.inc({ method, path, status: String(status) });
    this.httpRequestDuration.observe(
      { method, path, status: String(status) },
      duration / 1000,
    );
  }

  /**
   * Record cache operation
   */
  recordCacheOperation(hit: boolean, cacheType: string = 'redis') {
    if (hit) {
      this.cacheHits.inc({ cache_type: cacheType });
    } else {
      this.cacheMisses.inc({ cache_type: cacheType });
    }
  }

  /**
   * Record database query
   */
  recordDbQuery(operation: string, model: string, duration: number) {
    this.dbQueryDuration.observe({ operation, model }, duration / 1000);
  }

  /**
   * Record AI operation
   */
  recordAiOperation(
    operation: 'outline' | 'brief' | 'repurpose',
    tenantId: string,
    duration: number,
    labels: Record<string, string> = {},
  ) {
    this.aiRequestDuration.observe({ operation }, duration / 1000);

    switch (operation) {
      case 'outline':
        this.aiOutlinesGenerated.inc({
          tenant_id: tenantId,
          content_type: labels.contentType || 'unknown',
        });
        break;
      case 'brief':
        this.aiBriefsGenerated.inc({
          tenant_id: tenantId,
          content_type: labels.contentType || 'unknown',
        });
        break;
      case 'repurpose':
        this.aiRepurposesGenerated.inc({
          tenant_id: tenantId,
          source_type: labels.sourceType || 'unknown',
          target_type: labels.targetType || 'unknown',
        });
        break;
    }
  }

  /**
   * Update content page gauge
   */
  updateContentPagesTotal(
    tenantId: string,
    status: string,
    type: string,
    count: number,
  ) {
    this.contentPagesTotal.set({ tenant_id: tenantId, status, type }, count);
  }

  /**
   * Record content version creation
   */
  recordVersionCreated(tenantId: string) {
    this.contentVersionsCreated.inc({ tenant_id: tenantId });
  }

  /**
   * Record content publication
   */
  recordContentPublished(tenantId: string, type: string) {
    this.contentPublished.inc({ tenant_id: tenantId, type });
  }

  /**
   * Record content search
   */
  recordContentSearch(tenantId: string) {
    this.contentSearches.inc({ tenant_id: tenantId });
  }
}
