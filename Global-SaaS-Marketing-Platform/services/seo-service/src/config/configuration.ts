export interface AppConfig {
  nodeEnv: string;
  port: number;
  host: string;
  apiPrefix: string;
  corsOrigins: string[];
}

export interface DatabaseConfig {
  url: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  keyPrefix: string;
  ttl: {
    sitemap: number;
    robots: number;
    manifest: number;
    pageSeo: number;
    webVitals: number;
  };
}

export interface CrawlerConfig {
  maxConcurrency: number;
  maxRequestsPerCrawl: number;
  requestTimeout: number;
  navigationTimeout: number;
  userAgent: string;
  respectRobotsTxt: boolean;
}

export interface SeoConfig {
  defaultLocale: string;
  supportedLocales: string[];
  sitemapMaxUrls: number;
  auditMaxPages: number;
  contentFreshnessThresholdDays: number;
}

export interface ExternalApisConfig {
  googleSearchConsoleApiKey?: string;
  googlePageSpeedApiKey?: string;
  semrushApiKey?: string;
  ahrefsApiKey?: string;
}

export interface Configuration {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  crawler: CrawlerConfig;
  seo: SeoConfig;
  externalApis: ExternalApisConfig;
}

export default (): Configuration => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/seo_service',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'seo:',
    ttl: {
      sitemap: parseInt(process.env.REDIS_TTL_SITEMAP || '3600', 10), // 1 hour
      robots: parseInt(process.env.REDIS_TTL_ROBOTS || '86400', 10), // 24 hours
      manifest: parseInt(process.env.REDIS_TTL_MANIFEST || '86400', 10), // 24 hours
      pageSeo: parseInt(process.env.REDIS_TTL_PAGE_SEO || '1800', 10), // 30 minutes
      webVitals: parseInt(process.env.REDIS_TTL_WEB_VITALS || '3600', 10), // 1 hour
    },
  },
  crawler: {
    maxConcurrency: parseInt(process.env.CRAWLER_MAX_CONCURRENCY || '5', 10),
    maxRequestsPerCrawl: parseInt(process.env.CRAWLER_MAX_REQUESTS || '100', 10),
    requestTimeout: parseInt(process.env.CRAWLER_REQUEST_TIMEOUT || '30000', 10),
    navigationTimeout: parseInt(process.env.CRAWLER_NAVIGATION_TIMEOUT || '60000', 10),
    userAgent: process.env.CRAWLER_USER_AGENT || 'MarketingPlatformBot/1.0 (+https://example.com/bot)',
    respectRobotsTxt: process.env.CRAWLER_RESPECT_ROBOTS !== 'false',
  },
  seo: {
    defaultLocale: process.env.SEO_DEFAULT_LOCALE || 'en',
    supportedLocales: process.env.SEO_SUPPORTED_LOCALES?.split(',') || ['en', 'es', 'fr', 'de', 'ja', 'zh'],
    sitemapMaxUrls: parseInt(process.env.SEO_SITEMAP_MAX_URLS || '50000', 10),
    auditMaxPages: parseInt(process.env.SEO_AUDIT_MAX_PAGES || '1000', 10),
    contentFreshnessThresholdDays: parseInt(process.env.SEO_CONTENT_FRESHNESS_DAYS || '90', 10),
  },
  externalApis: {
    googleSearchConsoleApiKey: process.env.GOOGLE_SEARCH_CONSOLE_API_KEY,
    googlePageSpeedApiKey: process.env.GOOGLE_PAGESPEED_API_KEY,
    semrushApiKey: process.env.SEMRUSH_API_KEY,
    ahrefsApiKey: process.env.AHREFS_API_KEY,
  },
});
