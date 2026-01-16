import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry: client.Registry;

  // Counters
  public readonly httpRequestsTotal: client.Counter<string>;
  public readonly sitemapGenerations: client.Counter<string>;
  public readonly auditRuns: client.Counter<string>;
  public readonly keywordResearches: client.Counter<string>;
  public readonly contentOptimizations: client.Counter<string>;

  // Gauges
  public readonly activeAudits: client.Gauge<string>;
  public readonly cachedSitemaps: client.Gauge<string>;

  // Histograms
  public readonly httpRequestDuration: client.Histogram<string>;
  public readonly sitemapGenerationDuration: client.Histogram<string>;
  public readonly auditDuration: client.Histogram<string>;

  constructor() {
    this.registry = new client.Registry();

    // Set default labels
    this.registry.setDefaultLabels({ app: 'seo-service' });

    // HTTP metrics
    this.httpRequestsTotal = new client.Counter({
      name: 'seo_http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
      registers: [this.registry],
    });

    this.httpRequestDuration = new client.Histogram({
      name: 'seo_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    });

    // Sitemap metrics
    this.sitemapGenerations = new client.Counter({
      name: 'seo_sitemap_generations_total',
      help: 'Total number of sitemap generations',
      labelNames: ['tenant', 'locale'],
      registers: [this.registry],
    });

    this.sitemapGenerationDuration = new client.Histogram({
      name: 'seo_sitemap_generation_duration_seconds',
      help: 'Sitemap generation duration in seconds',
      labelNames: ['tenant', 'locale'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [this.registry],
    });

    this.cachedSitemaps = new client.Gauge({
      name: 'seo_cached_sitemaps',
      help: 'Number of cached sitemaps',
      registers: [this.registry],
    });

    // Audit metrics
    this.auditRuns = new client.Counter({
      name: 'seo_audit_runs_total',
      help: 'Total number of SEO audits run',
      labelNames: ['tenant', 'type', 'status'],
      registers: [this.registry],
    });

    this.auditDuration = new client.Histogram({
      name: 'seo_audit_duration_seconds',
      help: 'SEO audit duration in seconds',
      labelNames: ['tenant', 'type'],
      buckets: [1, 5, 10, 30, 60, 120, 300],
      registers: [this.registry],
    });

    this.activeAudits = new client.Gauge({
      name: 'seo_active_audits',
      help: 'Number of currently running audits',
      registers: [this.registry],
    });

    // Content optimization metrics
    this.keywordResearches = new client.Counter({
      name: 'seo_keyword_researches_total',
      help: 'Total number of keyword research requests',
      labelNames: ['locale'],
      registers: [this.registry],
    });

    this.contentOptimizations = new client.Counter({
      name: 'seo_content_optimizations_total',
      help: 'Total number of content optimizations',
      labelNames: ['tenant'],
      registers: [this.registry],
    });
  }

  async onModuleInit() {
    // Collect default metrics (CPU, memory, etc.)
    client.collectDefaultMetrics({ register: this.registry });
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  getContentType(): string {
    return this.registry.contentType;
  }
}
