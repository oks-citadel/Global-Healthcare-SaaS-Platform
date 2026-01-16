import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsArray, IsBoolean, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaginationDto } from './core.dto';

// ==========================================
// WEB VITALS DTOs
// ==========================================

export class WebVitalsQueryDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenant?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ enum: ['mobile', 'desktop', 'tablet'] })
  @IsOptional()
  @IsEnum(['mobile', 'desktop', 'tablet'])
  deviceType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

export class WebVitalsResultDto {
  @ApiProperty()
  url: string;

  @ApiProperty({ enum: ['mobile', 'desktop', 'tablet'] })
  deviceType: string;

  @ApiPropertyOptional({ description: 'Largest Contentful Paint (ms)' })
  lcp?: number;

  @ApiPropertyOptional({ description: 'Interaction to Next Paint (ms)' })
  inp?: number;

  @ApiPropertyOptional({ description: 'Cumulative Layout Shift' })
  cls?: number;

  @ApiPropertyOptional({ description: 'First Contentful Paint (ms)' })
  fcp?: number;

  @ApiPropertyOptional({ description: 'Time to First Byte (ms)' })
  ttfb?: number;

  @ApiPropertyOptional({ description: 'Speed Index' })
  si?: number;

  @ApiPropertyOptional({ description: 'Total Blocking Time (ms)' })
  tbt?: number;

  @ApiProperty()
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };

  @ApiProperty()
  assessment: {
    lcp: 'good' | 'needs-improvement' | 'poor';
    inp: 'good' | 'needs-improvement' | 'poor';
    cls: 'good' | 'needs-improvement' | 'poor';
    overall: 'good' | 'needs-improvement' | 'poor';
  };

  @ApiProperty()
  measuredAt: Date;
}

// ==========================================
// PAGE SPEED DTOs
// ==========================================

export class PageSpeedQueryDto {
  @ApiPropertyOptional({ enum: ['mobile', 'desktop'], default: 'mobile' })
  @IsOptional()
  @IsEnum(['mobile', 'desktop'])
  strategy?: string = 'mobile';

  @ApiPropertyOptional({ type: [String], description: 'Categories to analyze' })
  @IsOptional()
  @IsArray()
  @IsEnum(['performance', 'accessibility', 'best-practices', 'seo'], { each: true })
  categories?: string[];
}

export class PageSpeedResultDto {
  @ApiProperty()
  url: string;

  @ApiProperty({ enum: ['mobile', 'desktop'] })
  strategy: string;

  @ApiProperty()
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };

  @ApiProperty()
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
    speedIndex: number;
    interactive: number;
  };

  @ApiProperty({ type: 'array' })
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    savings: number;
    priority: 'high' | 'medium' | 'low';
  }>;

  @ApiProperty({ type: 'array' })
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    details?: any;
  }>;

  @ApiProperty()
  fetchTime: Date;
}

// ==========================================
// MOBILE FRIENDLY DTOs
// ==========================================

export class MobileFriendlyResultDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  isMobileFriendly: boolean;

  @ApiProperty()
  testStatus: 'COMPLETE' | 'INTERNAL_ERROR' | 'PAGE_UNREACHABLE';

  @ApiPropertyOptional({ type: 'array' })
  issues?: Array<{
    rule: string;
    severity: 'error' | 'warning';
    message: string;
  }>;

  @ApiPropertyOptional()
  screenshot?: string;

  @ApiPropertyOptional()
  resourcesBlocked?: number;

  @ApiProperty()
  viewport: {
    width: number;
    height: number;
    deviceScaleFactor: number;
  };

  @ApiProperty()
  analyzedAt: Date;
}

// ==========================================
// ACCESSIBILITY DTOs
// ==========================================

export class AccessibilityQueryDto {
  @ApiPropertyOptional({ enum: ['WCAG2A', 'WCAG2AA', 'WCAG2AAA'], default: 'WCAG2AA' })
  @IsOptional()
  @IsEnum(['WCAG2A', 'WCAG2AA', 'WCAG2AAA'])
  standard?: string = 'WCAG2AA';

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeWarnings?: boolean = true;
}

export class AccessibilityResultDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  score: number;

  @ApiProperty({ enum: ['WCAG2A', 'WCAG2AA', 'WCAG2AAA'] })
  standard: string;

  @ApiProperty()
  summary: {
    violations: number;
    passes: number;
    incomplete: number;
    inapplicable: number;
  };

  @ApiProperty({ type: 'array' })
  violations: Array<{
    id: string;
    impact: 'critical' | 'serious' | 'moderate' | 'minor';
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{
      html: string;
      target: string[];
      failureSummary: string;
    }>;
  }>;

  @ApiPropertyOptional({ type: 'array' })
  warnings?: Array<{
    id: string;
    description: string;
    help: string;
    nodes: Array<{
      html: string;
      target: string[];
    }>;
  }>;

  @ApiProperty()
  analyzedAt: Date;
}

// ==========================================
// INDEX COVERAGE DTOs
// ==========================================

export class IndexCoverageQueryDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenant?: string;

  @ApiPropertyOptional({ enum: ['indexed', 'not_indexed', 'excluded', 'discovered', 'unknown'] })
  @IsOptional()
  @IsEnum(['indexed', 'not_indexed', 'excluded', 'discovered', 'unknown'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasIssues?: boolean;
}

export class IndexCoverageResultDto {
  @ApiProperty()
  summary: {
    total: number;
    indexed: number;
    notIndexed: number;
    excluded: number;
    errors: number;
  };

  @ApiProperty({ type: 'array' })
  pages: Array<{
    url: string;
    status: 'indexed' | 'not_indexed' | 'excluded' | 'discovered' | 'unknown';
    crawlStatus: 'crawled' | 'not_crawled' | 'crawl_error' | 'blocked';
    lastCrawled?: Date;
    lastIndexed?: Date;
    issues?: Array<{ type: string; message: string }>;
    robotsBlocked: boolean;
    noindexDetected: boolean;
  }>;

  @ApiProperty()
  coverage: {
    indexedPercentage: number;
    errorPercentage: number;
    excludedPercentage: number;
  };
}

// ==========================================
// CANONICAL DTOs
// ==========================================

export class CanonicalQueryDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenant?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasMismatch?: boolean;
}

export class CanonicalResultDto {
  @ApiProperty()
  summary: {
    total: number;
    valid: number;
    mismatched: number;
    missing: number;
  };

  @ApiProperty({ type: 'array' })
  canonicals: Array<{
    url: string;
    declaredCanonical: string | null;
    googleSelectedCanonical?: string;
    hasMismatch: boolean;
    status: 'valid' | 'mismatch' | 'missing' | 'self-referencing';
    recommendation?: string;
  }>;
}

// ==========================================
// HREFLANG DTOs
// ==========================================

export class HreflangQueryDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tenant?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasIssues?: boolean;
}

export class HreflangResultDto {
  @ApiProperty()
  summary: {
    totalGroups: number;
    totalUrls: number;
    validGroups: number;
    groupsWithIssues: number;
  };

  @ApiProperty({ type: 'array' })
  groups: Array<{
    groupId: string;
    urls: Array<{
      url: string;
      locale: string;
      region?: string;
      hasReturnTag: boolean;
      isValid: boolean;
    }>;
    issues: Array<{
      type: 'missing_return_tag' | 'invalid_locale' | 'missing_self_reference' | 'duplicate_locale';
      message: string;
      affectedUrls: string[];
    }>;
  }>;

  @ApiPropertyOptional({ type: 'object', description: 'Locale coverage map' })
  localeCoverage?: Record<string, number>;
}
