import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../common/cache/redis.service';
import { UpdateManifestConfigDto } from '../../../common/dto';

interface WebAppManifest {
  name: string;
  short_name?: string;
  description?: string;
  start_url: string;
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  background_color: string;
  theme_color: string;
  orientation?: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
  scope?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  categories?: string[];
  screenshots?: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
  shortcuts?: Array<{
    name: string;
    url: string;
    description?: string;
    icons?: Array<{
      src: string;
      sizes: string;
      type: string;
    }>;
  }>;
  related_applications?: Array<{
    platform: string;
    url: string;
    id?: string;
  }>;
  prefer_related_applications?: boolean;
}

@Injectable()
export class ManifestService {
  private readonly logger = new Logger(ManifestService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Generate manifest.json for a tenant
   */
  async generateManifest(tenantSlug?: string): Promise<WebAppManifest> {
    // If no tenant specified, return default manifest
    if (!tenantSlug) {
      return this.getDefaultManifest();
    }

    // Check cache first
    const cached = await this.redis.getManifest(tenantSlug);
    if (cached) {
      return JSON.parse(cached);
    }

    // Find tenant
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: { manifestConfig: true },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant '${tenantSlug}' not found`);
    }

    // Generate manifest
    const manifest = tenant.manifestConfig
      ? this.buildManifest(tenant.manifestConfig)
      : this.getDefaultManifest(tenant.name);

    // Cache the result
    await this.redis.setManifest(tenantSlug, JSON.stringify(manifest));

    return manifest;
  }

  /**
   * Update manifest configuration
   */
  async updateManifestConfig(dto: UpdateManifestConfigDto): Promise<void> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID '${dto.tenantId}' not found`);
    }

    await this.prisma.manifestConfig.upsert({
      where: { tenantId: dto.tenantId },
      update: {
        name: dto.name,
        shortName: dto.shortName,
        description: dto.description,
        startUrl: dto.startUrl,
        display: dto.display,
        backgroundColor: dto.backgroundColor,
        themeColor: dto.themeColor,
        orientation: dto.orientation,
        icons: dto.icons as any,
        scope: dto.scope,
        lang: dto.lang,
        dir: dto.dir,
        categories: dto.categories,
        screenshots: dto.screenshots as any,
        shortcuts: dto.shortcuts as any,
      },
      create: {
        tenantId: dto.tenantId,
        name: dto.name,
        shortName: dto.shortName,
        description: dto.description,
        startUrl: dto.startUrl || '/',
        display: dto.display || 'standalone',
        backgroundColor: dto.backgroundColor || '#ffffff',
        themeColor: dto.themeColor || '#000000',
        orientation: dto.orientation || 'portrait-primary',
        icons: (dto.icons || []) as any,
        scope: dto.scope,
        lang: dto.lang || 'en',
        dir: dto.dir || 'ltr',
        categories: dto.categories || [],
        screenshots: dto.screenshots as any,
        shortcuts: dto.shortcuts as any,
      },
    });

    // Invalidate cache
    await this.redis.invalidateManifest(tenant.slug);

    this.logger.log(`Updated manifest config for tenant: ${tenant.slug}`);
  }

  /**
   * Get manifest configuration
   */
  async getManifestConfig(tenantId: string): Promise<UpdateManifestConfigDto | null> {
    const config = await this.prisma.manifestConfig.findUnique({
      where: { tenantId },
    });

    if (!config) return null;

    return {
      tenantId: config.tenantId,
      name: config.name,
      shortName: config.shortName || undefined,
      description: config.description || undefined,
      startUrl: config.startUrl,
      display: config.display as any,
      backgroundColor: config.backgroundColor,
      themeColor: config.themeColor,
      orientation: config.orientation as any,
      icons: config.icons as any,
      scope: config.scope || undefined,
      lang: config.lang,
      dir: config.dir as any,
      categories: config.categories,
      screenshots: config.screenshots as any,
      shortcuts: config.shortcuts as any,
    };
  }

  /**
   * Build manifest from config
   */
  private buildManifest(config: {
    name: string;
    shortName?: string | null;
    description?: string | null;
    startUrl: string;
    display: string;
    backgroundColor: string;
    themeColor: string;
    orientation: string;
    icons: any;
    scope?: string | null;
    lang: string;
    dir: string;
    categories: string[];
    screenshots?: any;
    shortcuts?: any;
  }): WebAppManifest {
    const manifest: WebAppManifest = {
      name: config.name,
      start_url: config.startUrl,
      display: config.display as WebAppManifest['display'],
      background_color: config.backgroundColor,
      theme_color: config.themeColor,
      icons: config.icons || [],
    };

    if (config.shortName) {
      manifest.short_name = config.shortName;
    }

    if (config.description) {
      manifest.description = config.description;
    }

    if (config.orientation) {
      manifest.orientation = config.orientation;
    }

    if (config.scope) {
      manifest.scope = config.scope;
    }

    if (config.lang) {
      manifest.lang = config.lang;
    }

    if (config.dir) {
      manifest.dir = config.dir as WebAppManifest['dir'];
    }

    if (config.categories && config.categories.length > 0) {
      manifest.categories = config.categories;
    }

    if (config.screenshots) {
      manifest.screenshots = config.screenshots;
    }

    if (config.shortcuts) {
      manifest.shortcuts = config.shortcuts;
    }

    return manifest;
  }

  /**
   * Get default manifest
   */
  private getDefaultManifest(name?: string): WebAppManifest {
    return {
      name: name || 'Marketing Platform',
      short_name: name ? name.substring(0, 12) : 'Platform',
      description: 'Global SaaS Marketing Platform',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#0066cc',
      orientation: 'portrait-primary',
      icons: [
        {
          src: '/icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: '/icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png',
        },
        {
          src: '/icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/icons/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png',
        },
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png',
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
      lang: 'en',
      dir: 'ltr',
      categories: ['business', 'marketing', 'productivity'],
    };
  }

  /**
   * Validate manifest
   */
  validateManifest(manifest: Partial<WebAppManifest>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!manifest.name) {
      errors.push('name is required');
    } else if (manifest.name.length > 45) {
      warnings.push('name should be 45 characters or less for best display');
    }

    if (!manifest.start_url) {
      errors.push('start_url is required');
    }

    if (!manifest.display) {
      warnings.push('display is recommended');
    }

    // Icons validation
    if (!manifest.icons || manifest.icons.length === 0) {
      errors.push('At least one icon is required');
    } else {
      const sizes = manifest.icons.map((i) => i.sizes);

      // Check for recommended sizes
      const recommendedSizes = ['192x192', '512x512'];
      for (const size of recommendedSizes) {
        if (!sizes.includes(size)) {
          warnings.push(`Icon size ${size} is recommended`);
        }
      }

      // Check for maskable icon
      const hasMaskable = manifest.icons.some((i) => i.purpose?.includes('maskable'));
      if (!hasMaskable) {
        warnings.push('A maskable icon is recommended for Android');
      }
    }

    // Short name validation
    if (manifest.short_name && manifest.short_name.length > 12) {
      warnings.push('short_name should be 12 characters or less');
    }

    // Colors validation
    if (manifest.background_color && !this.isValidColor(manifest.background_color)) {
      errors.push('background_color must be a valid color (hex format recommended)');
    }

    if (manifest.theme_color && !this.isValidColor(manifest.theme_color)) {
      errors.push('theme_color must be a valid color (hex format recommended)');
    }

    // Description length
    if (manifest.description && manifest.description.length > 300) {
      warnings.push('description should be 300 characters or less');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private isValidColor(color: string): boolean {
    // Check hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) return true;
    if (/^#[0-9A-Fa-f]{3}$/.test(color)) return true;

    // Check rgb/rgba
    if (/^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/.test(color)) return true;
    if (/^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*[\d.]+\)$/.test(color)) return true;

    // Check named colors (basic)
    const namedColors = [
      'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
      'pink', 'brown', 'gray', 'grey', 'transparent',
    ];
    return namedColors.includes(color.toLowerCase());
  }
}
