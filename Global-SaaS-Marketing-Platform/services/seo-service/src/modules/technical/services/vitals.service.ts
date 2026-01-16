import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../common/cache/redis.service';
import { WebVitalsQueryDto, WebVitalsResultDto } from '../../../common/dto';

interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint (ms)
  inp: number; // Interaction to Next Paint (ms)
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint (ms)
  ttfb: number; // Time to First Byte (ms)
  si: number; // Speed Index
  tbt: number; // Total Blocking Time (ms)
}

interface VitalsAssessment {
  lcp: 'good' | 'needs-improvement' | 'poor';
  inp: 'good' | 'needs-improvement' | 'poor';
  cls: 'good' | 'needs-improvement' | 'poor';
  overall: 'good' | 'needs-improvement' | 'poor';
}

@Injectable()
export class VitalsService {
  private readonly logger = new Logger(VitalsService.name);

  // Thresholds for Core Web Vitals
  private readonly thresholds = {
    lcp: { good: 2500, poor: 4000 }, // ms
    inp: { good: 200, poor: 500 }, // ms
    cls: { good: 0.1, poor: 0.25 },
    fcp: { good: 1800, poor: 3000 }, // ms
    ttfb: { good: 800, poor: 1800 }, // ms
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get Core Web Vitals for URLs
   */
  async getWebVitals(query: WebVitalsQueryDto): Promise<{
    items: WebVitalsResultDto[];
    summary: {
      avgLcp: number;
      avgInp: number;
      avgCls: number;
      overallAssessment: string;
    };
  }> {
    const where: any = {};

    // Filter by tenant
    if (query.tenant) {
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: query.tenant },
      });
      if (tenant) {
        where.tenantId = tenant.id;
      }
    }

    // Filter by URL
    if (query.url) {
      where.url = query.url;
    }

    // Filter by device type
    if (query.deviceType) {
      where.deviceType = query.deviceType.toUpperCase();
    }

    // Filter by date range
    if (query.startDate || query.endDate) {
      where.measuredAt = {};
      if (query.startDate) where.measuredAt.gte = query.startDate;
      if (query.endDate) where.measuredAt.lte = query.endDate;
    }

    // Get vitals data
    const vitals = await this.prisma.webVitals.findMany({
      where,
      orderBy: { measuredAt: 'desc' },
      take: query.limit || 20,
    });

    // Map to results
    const items: WebVitalsResultDto[] = vitals.map((v) => this.mapToResult(v));

    // Calculate summary
    const summary = this.calculateSummary(vitals);

    return { items, summary };
  }

  /**
   * Measure Web Vitals for a URL
   */
  async measureVitals(
    url: string,
    tenantId?: string,
    deviceType: 'mobile' | 'desktop' = 'mobile',
  ): Promise<WebVitalsResultDto> {
    // Check cache first
    const cached = await this.redis.getWebVitals<WebVitalsResultDto>(url, deviceType);
    if (cached) return cached;

    // In production, this would use Lighthouse or PageSpeed Insights API
    // For now, we'll simulate the measurement
    const vitals = await this.simulateMeasurement(url, deviceType);

    // Store in database
    const stored = await this.prisma.webVitals.create({
      data: {
        tenantId: tenantId || 'global',
        url,
        deviceType: deviceType.toUpperCase() as any,
        lcp: vitals.lcp,
        inp: vitals.inp,
        cls: vitals.cls,
        fcp: vitals.fcp,
        ttfb: vitals.ttfb,
        si: vitals.si,
        tbt: vitals.tbt,
        performanceScore: vitals.scores.performance,
        accessibilityScore: vitals.scores.accessibility,
        bestPracticesScore: vitals.scores.bestPractices,
        seoScore: vitals.scores.seo,
        fullReport: vitals as any,
        measuredAt: new Date(),
      },
    });

    const result = this.mapToResult(stored);

    // Cache for 1 hour
    await this.redis.setWebVitals(url, result, deviceType);

    return result;
  }

  /**
   * Get historical vitals data
   */
  async getVitalsHistory(
    url: string,
    days: number = 30,
    deviceType?: string,
  ): Promise<{
    url: string;
    history: Array<{
      date: Date;
      lcp: number;
      inp: number;
      cls: number;
      performanceScore: number;
    }>;
    trend: {
      lcpChange: number;
      inpChange: number;
      clsChange: number;
      improving: boolean;
    };
  }> {
    const where: any = {
      url,
      measuredAt: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    };

    if (deviceType) {
      where.deviceType = deviceType.toUpperCase();
    }

    const vitals = await this.prisma.webVitals.findMany({
      where,
      orderBy: { measuredAt: 'asc' },
      select: {
        measuredAt: true,
        lcp: true,
        inp: true,
        cls: true,
        performanceScore: true,
      },
    });

    const history = vitals.map((v) => ({
      date: v.measuredAt,
      lcp: v.lcp || 0,
      inp: v.inp || 0,
      cls: v.cls || 0,
      performanceScore: v.performanceScore || 0,
    }));

    // Calculate trends
    let trend = {
      lcpChange: 0,
      inpChange: 0,
      clsChange: 0,
      improving: false,
    };

    if (history.length >= 2) {
      const first = history[0];
      const last = history[history.length - 1];

      trend = {
        lcpChange: first.lcp > 0 ? ((last.lcp - first.lcp) / first.lcp) * 100 : 0,
        inpChange: first.inp > 0 ? ((last.inp - first.inp) / first.inp) * 100 : 0,
        clsChange: first.cls > 0 ? ((last.cls - first.cls) / first.cls) * 100 : 0,
        improving: false,
      };

      // Negative change is good for LCP, INP, CLS
      trend.improving = trend.lcpChange < 0 && trend.inpChange < 0 && trend.clsChange < 0;
    }

    return { url, history, trend };
  }

  /**
   * Get vitals by tenant with aggregation
   */
  async getTenantVitalsSummary(tenantId: string): Promise<{
    overview: {
      totalUrls: number;
      avgPerformance: number;
      passingCoreWebVitals: number;
      failingCoreWebVitals: number;
    };
    byDeviceType: Record<string, { count: number; avgPerformance: number }>;
    worstPerforming: Array<{ url: string; performanceScore: number; lcp: number }>;
  }> {
    const vitals = await this.prisma.webVitals.findMany({
      where: { tenantId },
      orderBy: { measuredAt: 'desc' },
    });

    // Get unique URLs (latest measurement only)
    const latestByUrl = new Map<string, any>();
    for (const v of vitals) {
      if (!latestByUrl.has(v.url)) {
        latestByUrl.set(v.url, v);
      }
    }

    const uniqueVitals = Array.from(latestByUrl.values());

    // Calculate overview
    const avgPerformance = uniqueVitals.length > 0
      ? uniqueVitals.reduce((sum, v) => sum + (v.performanceScore || 0), 0) / uniqueVitals.length
      : 0;

    const passing = uniqueVitals.filter((v) => this.passesCorWebVitals(v)).length;

    // Group by device type
    const byDeviceType: Record<string, { count: number; total: number }> = {};
    for (const v of uniqueVitals) {
      const device = v.deviceType.toLowerCase();
      if (!byDeviceType[device]) {
        byDeviceType[device] = { count: 0, total: 0 };
      }
      byDeviceType[device].count++;
      byDeviceType[device].total += v.performanceScore || 0;
    }

    const deviceSummary: Record<string, { count: number; avgPerformance: number }> = {};
    for (const [device, data] of Object.entries(byDeviceType)) {
      deviceSummary[device] = {
        count: data.count,
        avgPerformance: data.count > 0 ? Math.round(data.total / data.count) : 0,
      };
    }

    // Get worst performing
    const worstPerforming = uniqueVitals
      .sort((a, b) => (a.performanceScore || 0) - (b.performanceScore || 0))
      .slice(0, 10)
      .map((v) => ({
        url: v.url,
        performanceScore: v.performanceScore || 0,
        lcp: v.lcp || 0,
      }));

    return {
      overview: {
        totalUrls: uniqueVitals.length,
        avgPerformance: Math.round(avgPerformance),
        passingCoreWebVitals: passing,
        failingCoreWebVitals: uniqueVitals.length - passing,
      },
      byDeviceType: deviceSummary,
      worstPerforming,
    };
  }

  /**
   * Simulate vitals measurement
   */
  private async simulateMeasurement(
    url: string,
    deviceType: string,
  ): Promise<{
    lcp: number;
    inp: number;
    cls: number;
    fcp: number;
    ttfb: number;
    si: number;
    tbt: number;
    scores: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
    };
  }> {
    // Simulate realistic values (in production, use Lighthouse or PSI API)
    const isMobile = deviceType === 'mobile';
    const baseMultiplier = isMobile ? 1.3 : 1;

    const lcp = Math.round((1800 + Math.random() * 2000) * baseMultiplier);
    const inp = Math.round((100 + Math.random() * 200) * baseMultiplier);
    const cls = Math.round((0.05 + Math.random() * 0.15) * 1000) / 1000;
    const fcp = Math.round((1000 + Math.random() * 1500) * baseMultiplier);
    const ttfb = Math.round((400 + Math.random() * 600) * baseMultiplier);
    const si = Math.round((2000 + Math.random() * 2000) * baseMultiplier);
    const tbt = Math.round((200 + Math.random() * 400) * baseMultiplier);

    // Calculate performance score based on metrics
    const performanceScore = this.calculatePerformanceScore(lcp, inp, cls, fcp, tbt);

    return {
      lcp,
      inp,
      cls,
      fcp,
      ttfb,
      si,
      tbt,
      scores: {
        performance: performanceScore,
        accessibility: Math.round(70 + Math.random() * 30),
        bestPractices: Math.round(75 + Math.random() * 25),
        seo: Math.round(80 + Math.random() * 20),
      },
    };
  }

  /**
   * Calculate performance score
   */
  private calculatePerformanceScore(
    lcp: number,
    inp: number,
    cls: number,
    fcp: number,
    tbt: number,
  ): number {
    // Simplified Lighthouse scoring algorithm
    let score = 100;

    // LCP scoring (25% weight)
    if (lcp > this.thresholds.lcp.poor) {
      score -= 25;
    } else if (lcp > this.thresholds.lcp.good) {
      score -= 12;
    }

    // INP scoring (25% weight)
    if (inp > this.thresholds.inp.poor) {
      score -= 25;
    } else if (inp > this.thresholds.inp.good) {
      score -= 12;
    }

    // CLS scoring (25% weight)
    if (cls > this.thresholds.cls.poor) {
      score -= 25;
    } else if (cls > this.thresholds.cls.good) {
      score -= 12;
    }

    // FCP + TBT (25% weight combined)
    if (fcp > this.thresholds.fcp.poor) {
      score -= 12;
    } else if (fcp > this.thresholds.fcp.good) {
      score -= 6;
    }

    if (tbt > 600) {
      score -= 13;
    } else if (tbt > 300) {
      score -= 6;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Assess individual metric
   */
  private assessMetric(
    value: number,
    thresholds: { good: number; poor: number },
  ): 'good' | 'needs-improvement' | 'poor' {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Check if passes Core Web Vitals
   */
  private passesCorWebVitals(vitals: any): boolean {
    const lcp = vitals.lcp || 0;
    const inp = vitals.inp || 0;
    const cls = vitals.cls || 0;

    return (
      lcp <= this.thresholds.lcp.good &&
      inp <= this.thresholds.inp.good &&
      cls <= this.thresholds.cls.good
    );
  }

  /**
   * Map database record to result
   */
  private mapToResult(vitals: any): WebVitalsResultDto {
    const assessment: VitalsAssessment = {
      lcp: this.assessMetric(vitals.lcp || 0, this.thresholds.lcp),
      inp: this.assessMetric(vitals.inp || 0, this.thresholds.inp),
      cls: this.assessMetric(vitals.cls || 0, this.thresholds.cls),
      overall: 'good',
    };

    // Overall is worst of the three
    if (assessment.lcp === 'poor' || assessment.inp === 'poor' || assessment.cls === 'poor') {
      assessment.overall = 'poor';
    } else if (
      assessment.lcp === 'needs-improvement' ||
      assessment.inp === 'needs-improvement' ||
      assessment.cls === 'needs-improvement'
    ) {
      assessment.overall = 'needs-improvement';
    }

    return {
      url: vitals.url,
      deviceType: vitals.deviceType.toLowerCase(),
      lcp: vitals.lcp,
      inp: vitals.inp,
      cls: vitals.cls,
      fcp: vitals.fcp,
      ttfb: vitals.ttfb,
      si: vitals.si,
      tbt: vitals.tbt,
      scores: {
        performance: vitals.performanceScore || 0,
        accessibility: vitals.accessibilityScore || 0,
        bestPractices: vitals.bestPracticesScore || 0,
        seo: vitals.seoScore || 0,
      },
      assessment,
      measuredAt: vitals.measuredAt,
    };
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummary(vitals: any[]): {
    avgLcp: number;
    avgInp: number;
    avgCls: number;
    overallAssessment: string;
  } {
    if (vitals.length === 0) {
      return {
        avgLcp: 0,
        avgInp: 0,
        avgCls: 0,
        overallAssessment: 'unknown',
      };
    }

    const avgLcp = vitals.reduce((sum, v) => sum + (v.lcp || 0), 0) / vitals.length;
    const avgInp = vitals.reduce((sum, v) => sum + (v.inp || 0), 0) / vitals.length;
    const avgCls = vitals.reduce((sum, v) => sum + (v.cls || 0), 0) / vitals.length;

    let overallAssessment = 'good';
    if (
      avgLcp > this.thresholds.lcp.poor ||
      avgInp > this.thresholds.inp.poor ||
      avgCls > this.thresholds.cls.poor
    ) {
      overallAssessment = 'poor';
    } else if (
      avgLcp > this.thresholds.lcp.good ||
      avgInp > this.thresholds.inp.good ||
      avgCls > this.thresholds.cls.good
    ) {
      overallAssessment = 'needs-improvement';
    }

    return {
      avgLcp: Math.round(avgLcp),
      avgInp: Math.round(avgInp),
      avgCls: Math.round(avgCls * 1000) / 1000,
      overallAssessment,
    };
  }
}
