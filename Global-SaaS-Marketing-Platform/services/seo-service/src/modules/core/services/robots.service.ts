import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../common/cache/redis.service';
import { UpdateRobotsConfigDto, UserAgentRuleDto } from '../../../common/dto';

interface RobotsRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
}

@Injectable()
export class RobotsService {
  private readonly logger = new Logger(RobotsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate robots.txt for a tenant
   */
  async generateRobotsTxt(tenantSlug?: string): Promise<string> {
    // If no tenant specified, return default robots.txt
    if (!tenantSlug) {
      return this.getDefaultRobotsTxt();
    }

    // Check cache first
    const cached = await this.redis.getRobots(tenantSlug);
    if (cached) return cached;

    // Find tenant
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: { robotsConfig: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant '${tenantSlug}' not found`);
    }

    // Generate robots.txt content
    const content = tenant.robotsConfig
      ? this.buildRobotsTxt(tenant.robotsConfig, tenant.domain)
      : this.getDefaultRobotsTxt(tenant.domain);

    // Cache the result
    await this.redis.setRobots(tenantSlug, content);

    return content;
  }

  /**
   * Update robots.txt configuration
   */
  async updateRobotsConfig(dto: UpdateRobotsConfigDto): Promise<void> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID '${dto.tenantId}' not found`);
    }

    await this.prisma.robotsConfig.upsert({
      where: { tenantId: dto.tenantId },
      update: {
        userAgentRules: dto.userAgentRules as any,
        sitemapUrls: dto.sitemapUrls,
        crawlDelay: dto.crawlDelay,
        customDirectives: dto.customDirectives,
      },
      create: {
        tenantId: dto.tenantId,
        userAgentRules: dto.userAgentRules as any,
        sitemapUrls: dto.sitemapUrls || [],
        crawlDelay: dto.crawlDelay,
        customDirectives: dto.customDirectives,
      },
    });

    // Invalidate cache
    await this.redis.invalidateRobots(tenant.slug);

    this.logger.log(`Updated robots.txt config for tenant: ${tenant.slug}`);
  }

  /**
   * Get robots.txt configuration
   */
  async getRobotsConfig(tenantId: string): Promise<{
    userAgentRules: UserAgentRuleDto[];
    sitemapUrls: string[];
    crawlDelay?: number;
    customDirectives?: string;
  } | null> {
    const config = await this.prisma.robotsConfig.findUnique({
      where: { tenantId },
    });

    if (!config) return null;

    return {
      userAgentRules: config.userAgentRules as unknown as UserAgentRuleDto[],
      sitemapUrls: config.sitemapUrls,
      crawlDelay: config.crawlDelay || undefined,
      customDirectives: config.customDirectives || undefined,
    };
  }

  /**
   * Build robots.txt content from config
   */
  private buildRobotsTxt(
    config: {
      userAgentRules: any;
      sitemapUrls: string[];
      crawlDelay?: number | null;
      customDirectives?: string | null;
    },
    domain: string,
  ): string {
    const lines: string[] = [];

    // Parse user agent rules
    const rules = (config.userAgentRules || []) as RobotsRule[];

    // If no rules defined, use default
    if (rules.length === 0) {
      lines.push('User-agent: *');
      lines.push('Allow: /');
    } else {
      for (const rule of rules) {
        lines.push(`User-agent: ${rule.userAgent}`);

        if (rule.crawlDelay) {
          lines.push(`Crawl-delay: ${rule.crawlDelay}`);
        }

        for (const allow of rule.allow || []) {
          lines.push(`Allow: ${allow}`);
        }

        for (const disallow of rule.disallow || []) {
          lines.push(`Disallow: ${disallow}`);
        }

        lines.push(''); // Empty line between rules
      }
    }

    // Add global crawl delay if set
    if (config.crawlDelay && rules.length === 0) {
      lines.push(`Crawl-delay: ${config.crawlDelay}`);
      lines.push('');
    }

    // Add custom directives
    if (config.customDirectives) {
      lines.push(config.customDirectives);
      lines.push('');
    }

    // Add sitemap URLs
    if (config.sitemapUrls && config.sitemapUrls.length > 0) {
      for (const sitemapUrl of config.sitemapUrls) {
        lines.push(`Sitemap: ${sitemapUrl}`);
      }
    } else {
      // Add default sitemap URL
      lines.push(`Sitemap: https://${domain}/sitemap.xml`);
    }

    return lines.join('\n');
  }

  /**
   * Get default robots.txt
   */
  private getDefaultRobotsTxt(domain?: string): string {
    const lines = [
      '# Default robots.txt',
      '',
      'User-agent: *',
      'Allow: /',
      '',
      '# Disallow admin and API paths',
      'Disallow: /admin/',
      'Disallow: /api/',
      'Disallow: /_next/',
      'Disallow: /private/',
      '',
      '# Block common bots that waste resources',
      'User-agent: AhrefsBot',
      'Crawl-delay: 10',
      '',
      'User-agent: SemrushBot',
      'Crawl-delay: 10',
      '',
      'User-agent: MJ12bot',
      'Disallow: /',
      '',
    ];

    if (domain) {
      lines.push(`Sitemap: https://${domain}/sitemap.xml`);
    }

    return lines.join('\n');
  }

  /**
   * Validate robots.txt syntax
   */
  validateRobotsTxt(content: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const lines = content.split('\n');

    let hasUserAgent = false;
    let currentUserAgent: string | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNum = i + 1;

      // Skip empty lines and comments
      if (!line || line.startsWith('#')) continue;

      // Parse directive
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) {
        errors.push(`Line ${lineNum}: Invalid format - missing colon`);
        continue;
      }

      const directive = line.substring(0, colonIndex).trim().toLowerCase();
      const value = line.substring(colonIndex + 1).trim();

      switch (directive) {
        case 'user-agent':
          hasUserAgent = true;
          currentUserAgent = value;
          if (!value) {
            errors.push(`Line ${lineNum}: User-agent value is empty`);
          }
          break;

        case 'allow':
        case 'disallow':
          if (!currentUserAgent) {
            errors.push(
              `Line ${lineNum}: ${directive} directive must come after User-agent`,
            );
          }
          if (value && !value.startsWith('/') && value !== '*') {
            warnings.push(
              `Line ${lineNum}: Path '${value}' should start with /`,
            );
          }
          break;

        case 'sitemap':
          if (!value.startsWith('http')) {
            errors.push(
              `Line ${lineNum}: Sitemap URL must be absolute URL`,
            );
          }
          break;

        case 'crawl-delay':
          const delay = parseInt(value, 10);
          if (isNaN(delay) || delay < 0) {
            errors.push(
              `Line ${lineNum}: Crawl-delay must be a positive number`,
            );
          }
          if (delay > 60) {
            warnings.push(
              `Line ${lineNum}: Crawl-delay of ${delay}s is very high`,
            );
          }
          break;

        case 'host':
          // Yandex-specific directive
          if (!value) {
            warnings.push(`Line ${lineNum}: Host directive has no value`);
          }
          break;

        default:
          warnings.push(
            `Line ${lineNum}: Unknown directive '${directive}'`,
          );
      }
    }

    if (!hasUserAgent) {
      errors.push('No User-agent directive found');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Test if a URL is allowed for a user agent
   */
  testUrl(robotsTxt: string, url: string, userAgent: string = '*'): boolean {
    const lines = robotsTxt.split('\n');
    let currentAgent: string | null = null;
    let matchedAgent = false;

    const allowRules: string[] = [];
    const disallowRules: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) continue;

      const directive = trimmed.substring(0, colonIndex).trim().toLowerCase();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (directive === 'user-agent') {
        if (matchedAgent && currentAgent) {
          // We've finished processing our matched agent
          break;
        }
        currentAgent = value;
        matchedAgent = value === '*' || value.toLowerCase() === userAgent.toLowerCase();
      } else if (matchedAgent) {
        if (directive === 'allow') {
          allowRules.push(value);
        } else if (directive === 'disallow') {
          disallowRules.push(value);
        }
      }
    }

    // Parse URL path
    const urlPath = new URL(url).pathname;

    // Check allow rules first (they take precedence for same-length matches)
    for (const rule of allowRules) {
      if (this.matchesRule(urlPath, rule)) {
        return true;
      }
    }

    // Check disallow rules
    for (const rule of disallowRules) {
      if (this.matchesRule(urlPath, rule)) {
        return false;
      }
    }

    // Default to allowed
    return true;
  }

  private matchesRule(path: string, rule: string): boolean {
    if (!rule) return true; // Empty disallow means allow all

    // Convert robots.txt pattern to regex
    let pattern = rule
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape regex special chars except *
      .replace(/\*/g, '.*'); // Convert * to .*

    // End of pattern matching
    if (rule.endsWith('$')) {
      pattern = pattern.slice(0, -2) + '$';
    } else {
      pattern = '^' + pattern;
    }

    const regex = new RegExp(pattern);
    return regex.test(path);
  }
}
