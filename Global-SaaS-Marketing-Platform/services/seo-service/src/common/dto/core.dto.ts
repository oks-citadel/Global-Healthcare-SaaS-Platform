import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsUrl, IsArray, IsBoolean, IsNumber, IsEnum, Min, Max, IsObject, ValidateNested, MinLength, MaxLength } from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ==========================================
// COMMON DTOs
// ==========================================

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class ApiResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiPropertyOptional()
  data?: T;

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional()
  error?: string;

  @ApiPropertyOptional()
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// ==========================================
// PAGE SEO DTOs
// ==========================================

export class PageSeoQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenant?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeStructuredData?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeHreflang?: boolean = true;
}

export class CreatePageSeoDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiProperty({ example: 'about-us' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  slug: string;

  @ApiPropertyOptional({ default: 'en' })
  @IsOptional()
  @IsString()
  locale?: string = 'en';

  @ApiProperty({ example: 'About Our Company | Brand Name', maxLength: 70 })
  @IsString()
  @MinLength(1)
  @MaxLength(70)
  title: string;

  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaKeywords?: string[] = [];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  canonicalUrl?: string;

  @ApiPropertyOptional({ type: 'object', example: { en: 'https://example.com/en/about', es: 'https://example.com/es/about' } })
  @IsOptional()
  @IsObject()
  hreflangTags?: Record<string, string>;

  @ApiPropertyOptional({ maxLength: 95 })
  @IsOptional()
  @IsString()
  @MaxLength(95)
  ogTitle?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  ogDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  ogImage?: string;

  @ApiPropertyOptional({ default: 'website' })
  @IsOptional()
  @IsString()
  ogType?: string = 'website';

  @ApiPropertyOptional({ enum: ['summary', 'summary_large_image', 'app', 'player'], default: 'summary_large_image' })
  @IsOptional()
  @IsEnum(['summary', 'summary_large_image', 'app', 'player'])
  twitterCard?: string = 'summary_large_image';

  @ApiPropertyOptional({ maxLength: 70 })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  twitterTitle?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  twitterDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  twitterImage?: string;

  @ApiPropertyOptional({ default: 'index, follow' })
  @IsOptional()
  @IsString()
  robotsDirectives?: string = 'index, follow';

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @IsObject()
  structuredData?: Record<string, any>;

  @ApiPropertyOptional({ default: 0.5, minimum: 0, maximum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  priority?: number = 0.5;

  @ApiPropertyOptional({ enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'], default: 'weekly' })
  @IsOptional()
  @IsEnum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
  changeFrequency?: string = 'weekly';

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = true;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isIndexable?: boolean = true;
}

export class UpdatePageSeoDto {
  @ApiPropertyOptional({ example: 'about-us' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({ maxLength: 70 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(70)
  title?: string;

  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  metaKeywords?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  canonicalUrl?: string;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @IsObject()
  hreflangTags?: Record<string, string>;

  @ApiPropertyOptional({ maxLength: 95 })
  @IsOptional()
  @IsString()
  @MaxLength(95)
  ogTitle?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  ogDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  ogImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogType?: string;

  @ApiPropertyOptional({ enum: ['summary', 'summary_large_image', 'app', 'player'] })
  @IsOptional()
  @IsEnum(['summary', 'summary_large_image', 'app', 'player'])
  twitterCard?: string;

  @ApiPropertyOptional({ maxLength: 70 })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  twitterTitle?: string;

  @ApiPropertyOptional({ maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  twitterDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  twitterImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  robotsDirectives?: string;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @IsObject()
  structuredData?: Record<string, any>;

  @ApiPropertyOptional({ minimum: 0, maximum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  priority?: number;

  @ApiPropertyOptional({ enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'] })
  @IsOptional()
  @IsEnum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'])
  changeFrequency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isIndexable?: boolean;
}

// ==========================================
// REINDEX DTOs
// ==========================================

export class ReindexRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @ApiPropertyOptional({ type: [String], maxItems: 1000 })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  urls?: string[];

  @ApiPropertyOptional({ enum: ['sitemap', 'single_url', 'bulk_urls', 'full_site'], default: 'sitemap' })
  @IsOptional()
  @IsEnum(['sitemap', 'single_url', 'bulk_urls', 'full_site'])
  type?: string = 'sitemap';

  @ApiPropertyOptional({ default: 5, minimum: 1, maximum: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  priority?: number = 5;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  notifyOnComplete?: boolean = false;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  webhookUrl?: string;
}

// ==========================================
// AUDIT DTOs
// ==========================================

export class AuditQueryDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenant?: string;

  @ApiPropertyOptional({ enum: ['full', 'technical', 'content', 'links', 'performance', 'accessibility'] })
  @IsOptional()
  @IsEnum(['full', 'technical', 'content', 'links', 'performance', 'accessibility'])
  type?: string;

  @ApiPropertyOptional({ enum: ['pending', 'scheduled', 'running', 'completed', 'failed', 'cancelled'] })
  @IsOptional()
  @IsEnum(['pending', 'scheduled', 'running', 'completed', 'failed', 'cancelled'])
  status?: string;
}

export class ScheduleAuditDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiPropertyOptional({ enum: ['full', 'technical', 'content', 'links', 'performance', 'accessibility'], default: 'full' })
  @IsOptional()
  @IsEnum(['full', 'technical', 'content', 'links', 'performance', 'accessibility'])
  type?: string = 'full';

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  scheduledAt?: Date;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  recurring?: boolean = false;

  @ApiPropertyOptional({ example: '0 0 * * 0', description: 'Cron expression for recurring audits' })
  @IsOptional()
  @IsString()
  cronExpression?: string;

  @ApiPropertyOptional({ default: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxPages?: number = 1000;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  notifyOnComplete?: boolean = true;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  webhookUrl?: string;
}

// ==========================================
// SITEMAP DTOs
// ==========================================

export class SitemapQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenant?: string;

  @ApiPropertyOptional({ enum: ['index', 'pages', 'blog', 'products', 'images', 'videos', 'news'] })
  @IsOptional()
  @IsEnum(['index', 'pages', 'blog', 'products', 'images', 'videos', 'news'])
  type?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  forceRefresh?: boolean = false;
}

// ==========================================
// ROBOTS DTOs
// ==========================================

export class UserAgentRuleDto {
  @ApiProperty({ default: '*' })
  @IsString()
  userAgent: string = '*';

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allow?: string[] = [];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disallow?: string[] = [];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  crawlDelay?: number;
}

export class UpdateRobotsConfigDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiPropertyOptional({ type: [UserAgentRuleDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAgentRuleDto)
  userAgentRules?: UserAgentRuleDto[] = [];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  sitemapUrls?: string[] = [];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  crawlDelay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customDirectives?: string;
}

// ==========================================
// MANIFEST DTOs
// ==========================================

export class ManifestIconDto {
  @ApiProperty()
  @IsString()
  src: string;

  @ApiProperty({ example: '192x192' })
  @IsString()
  sizes: string;

  @ApiPropertyOptional({ default: 'image/png' })
  @IsOptional()
  @IsString()
  type?: string = 'image/png';

  @ApiPropertyOptional({ enum: ['any', 'maskable', 'monochrome'] })
  @IsOptional()
  @IsEnum(['any', 'maskable', 'monochrome'])
  purpose?: string;
}

export class ManifestShortcutDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [ManifestIconDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManifestIconDto)
  icons?: ManifestIconDto[];
}

export class UpdateManifestConfigDto {
  @ApiProperty()
  @IsUUID()
  tenantId: string;

  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ maxLength: 25 })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  shortName?: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ default: '/' })
  @IsOptional()
  @IsString()
  startUrl?: string = '/';

  @ApiPropertyOptional({ enum: ['fullscreen', 'standalone', 'minimal-ui', 'browser'], default: 'standalone' })
  @IsOptional()
  @IsEnum(['fullscreen', 'standalone', 'minimal-ui', 'browser'])
  display?: string = 'standalone';

  @ApiPropertyOptional({ default: '#ffffff' })
  @IsOptional()
  @IsString()
  backgroundColor?: string = '#ffffff';

  @ApiPropertyOptional({ default: '#000000' })
  @IsOptional()
  @IsString()
  themeColor?: string = '#000000';

  @ApiPropertyOptional({ default: 'portrait-primary' })
  @IsOptional()
  @IsString()
  orientation?: string = 'portrait-primary';

  @ApiPropertyOptional({ type: [ManifestIconDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManifestIconDto)
  icons?: ManifestIconDto[] = [];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  scope?: string;

  @ApiPropertyOptional({ default: 'en' })
  @IsOptional()
  @IsString()
  lang?: string = 'en';

  @ApiPropertyOptional({ enum: ['ltr', 'rtl', 'auto'], default: 'ltr' })
  @IsOptional()
  @IsEnum(['ltr', 'rtl', 'auto'])
  dir?: string = 'ltr';

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[] = [];

  @ApiPropertyOptional({ type: [ManifestIconDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManifestIconDto)
  screenshots?: ManifestIconDto[];

  @ApiPropertyOptional({ type: [ManifestShortcutDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManifestShortcutDto)
  shortcuts?: ManifestShortcutDto[];
}
