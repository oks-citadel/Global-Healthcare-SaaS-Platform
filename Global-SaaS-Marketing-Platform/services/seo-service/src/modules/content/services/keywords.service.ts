import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { KeywordResearchDto, KeywordResultDto } from '../../../common/dto';

interface KeywordData {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  difficulty: number;
  searchIntent: 'informational' | 'navigational' | 'commercial' | 'transactional';
  intentConfidence: number;
  relatedKeywords: Array<{ keyword: string; volume: number; relevance: number }>;
  longTailVariants: Array<{ keyword: string; volume: number }>;
  questions: Array<{ question: string; volume: number }>;
  serpFeatures: string[];
}

@Injectable()
export class KeywordsService {
  private readonly logger = new Logger(KeywordsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Research keywords with volume, intent, and related data
   */
  async researchKeywords(dto: KeywordResearchDto): Promise<KeywordResultDto[]> {
    const results: KeywordResultDto[] = [];

    for (const keyword of dto.keywords) {
      // Check if we have cached data
      const cached = await this.getCachedKeywordData(keyword, dto.locale || 'en');

      if (cached) {
        results.push(this.mapToResult(cached, dto));
        continue;
      }

      // Generate keyword data (in production, this would call external APIs)
      const keywordData = await this.analyzeKeyword(keyword, dto.locale || 'en');

      // Cache the result
      await this.cacheKeywordData(keywordData, dto.tenantId, dto.locale || 'en');

      results.push(this.mapToResult(keywordData, dto));
    }

    return results;
  }

  /**
   * Analyze a single keyword
   */
  private async analyzeKeyword(keyword: string, locale: string): Promise<KeywordData> {
    // In production, this would integrate with SEMrush, Ahrefs, or similar APIs
    // For now, we'll generate simulated data

    const searchIntent = this.detectSearchIntent(keyword);
    const searchVolume = this.estimateSearchVolume(keyword);

    return {
      keyword,
      searchVolume,
      cpc: this.estimateCPC(keyword, searchIntent),
      competition: this.estimateCompetition(keyword),
      difficulty: this.estimateDifficulty(keyword),
      searchIntent,
      intentConfidence: 0.75 + Math.random() * 0.2,
      relatedKeywords: this.generateRelatedKeywords(keyword),
      longTailVariants: this.generateLongTailVariants(keyword),
      questions: this.generateQuestions(keyword),
      serpFeatures: this.detectSerpFeatures(keyword, searchIntent),
    };
  }

  /**
   * Detect search intent from keyword
   */
  private detectSearchIntent(keyword: string): KeywordData['searchIntent'] {
    const lowerKeyword = keyword.toLowerCase();

    // Transactional intent signals
    const transactionalPatterns = [
      'buy', 'purchase', 'order', 'price', 'cheap', 'discount', 'deal',
      'coupon', 'sale', 'shop', 'subscribe', 'download', 'get',
    ];
    if (transactionalPatterns.some(p => lowerKeyword.includes(p))) {
      return 'transactional';
    }

    // Commercial intent signals
    const commercialPatterns = [
      'best', 'top', 'review', 'comparison', 'vs', 'versus', 'alternative',
      'compare', 'rating', 'recommended', 'affordable',
    ];
    if (commercialPatterns.some(p => lowerKeyword.includes(p))) {
      return 'commercial';
    }

    // Navigational intent signals
    const navigationalPatterns = [
      'login', 'sign in', 'website', 'official', 'contact', 'support',
      'address', 'phone', 'location', 'near me',
    ];
    if (navigationalPatterns.some(p => lowerKeyword.includes(p))) {
      return 'navigational';
    }

    // Default to informational
    return 'informational';
  }

  /**
   * Estimate search volume (simulated)
   */
  private estimateSearchVolume(keyword: string): number {
    // Base volume on keyword length and common patterns
    const baseVolume = 1000;
    const lengthFactor = Math.max(0.1, 1 - keyword.length * 0.05);
    const randomFactor = 0.5 + Math.random();

    return Math.round(baseVolume * lengthFactor * randomFactor);
  }

  /**
   * Estimate CPC (simulated)
   */
  private estimateCPC(keyword: string, intent: string): number {
    const baseCPC: Record<string, number> = {
      transactional: 2.5,
      commercial: 1.8,
      navigational: 0.5,
      informational: 0.8,
    };

    const base = baseCPC[intent] || 1;
    return Math.round((base + Math.random() * 2) * 100) / 100;
  }

  /**
   * Estimate competition level (simulated)
   */
  private estimateCompetition(keyword: string): number {
    return Math.round((0.3 + Math.random() * 0.6) * 100) / 100;
  }

  /**
   * Estimate keyword difficulty (simulated)
   */
  private estimateDifficulty(keyword: string): number {
    const words = keyword.split(' ').length;
    // Long-tail keywords are generally easier
    const baseDifficulty = 50 - words * 5;
    return Math.max(10, Math.min(90, baseDifficulty + Math.random() * 30));
  }

  /**
   * Generate related keywords
   */
  private generateRelatedKeywords(keyword: string): Array<{ keyword: string; volume: number; relevance: number }> {
    const prefixes = ['best', 'top', 'how to', 'what is', 'guide to'];
    const suffixes = ['guide', 'tutorial', 'tips', 'examples', 'tools'];

    const related: Array<{ keyword: string; volume: number; relevance: number }> = [];

    // Add prefix variations
    for (const prefix of prefixes.slice(0, 3)) {
      related.push({
        keyword: `${prefix} ${keyword}`,
        volume: Math.round(this.estimateSearchVolume(keyword) * (0.2 + Math.random() * 0.3)),
        relevance: 0.7 + Math.random() * 0.25,
      });
    }

    // Add suffix variations
    for (const suffix of suffixes.slice(0, 3)) {
      related.push({
        keyword: `${keyword} ${suffix}`,
        volume: Math.round(this.estimateSearchVolume(keyword) * (0.2 + Math.random() * 0.3)),
        relevance: 0.7 + Math.random() * 0.25,
      });
    }

    return related.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Generate long-tail variants
   */
  private generateLongTailVariants(keyword: string): Array<{ keyword: string; volume: number }> {
    const modifiers = [
      'for beginners', 'for small business', 'in 2024', 'free',
      'online', 'step by step', 'complete', 'ultimate',
    ];

    return modifiers.slice(0, 5).map(mod => ({
      keyword: `${keyword} ${mod}`,
      volume: Math.round(this.estimateSearchVolume(keyword) * (0.1 + Math.random() * 0.2)),
    }));
  }

  /**
   * Generate question-based keywords
   */
  private generateQuestions(keyword: string): Array<{ question: string; volume: number }> {
    const questionStarters = [
      'how to', 'what is', 'why', 'when to', 'where to find',
      'how does', 'what are the benefits of', 'how much does',
    ];

    return questionStarters.slice(0, 5).map(starter => ({
      question: `${starter} ${keyword}`,
      volume: Math.round(this.estimateSearchVolume(keyword) * (0.15 + Math.random() * 0.2)),
    }));
  }

  /**
   * Detect likely SERP features
   */
  private detectSerpFeatures(keyword: string, intent: string): string[] {
    const features: string[] = [];

    // Question keywords often get featured snippets
    if (keyword.match(/^(how|what|why|when|where|who)/i)) {
      features.push('featured_snippet');
      features.push('people_also_ask');
    }

    // Commercial keywords get shopping results
    if (intent === 'commercial' || intent === 'transactional') {
      features.push('shopping_results');
      features.push('ads');
    }

    // Add common features based on keyword patterns
    if (keyword.includes('review') || keyword.includes('best')) {
      features.push('review_stars');
    }

    if (keyword.includes('video') || keyword.includes('tutorial')) {
      features.push('video_carousel');
    }

    // Most keywords can have knowledge panel
    if (Math.random() > 0.5) {
      features.push('knowledge_panel');
    }

    // Image pack for visual queries
    if (keyword.match(/(design|photo|image|picture|example)/i)) {
      features.push('image_pack');
    }

    return features;
  }

  /**
   * Get cached keyword data
   */
  private async getCachedKeywordData(keyword: string, locale: string): Promise<KeywordData | null> {
    const cached = await this.prisma.keywordResearch.findFirst({
      where: {
        keyword: keyword.toLowerCase(),
        locale,
        lastUpdated: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      },
    });

    if (!cached) return null;

    return {
      keyword: cached.keyword,
      searchVolume: cached.searchVolume || 0,
      cpc: cached.cpc || 0,
      competition: cached.competition || 0,
      difficulty: cached.difficulty || 0,
      searchIntent: (cached.searchIntent as KeywordData['searchIntent']) || 'informational',
      intentConfidence: cached.intentConfidence || 0.5,
      relatedKeywords: (cached.relatedKeywords as any) || [],
      longTailVariants: (cached.longTailVariants as any) || [],
      questions: (cached.questions as any) || [],
      serpFeatures: cached.serpFeatures || [],
    };
  }

  /**
   * Cache keyword data
   */
  private async cacheKeywordData(data: KeywordData, tenantId?: string, locale = 'en'): Promise<void> {
    await this.prisma.keywordResearch.upsert({
      where: {
        tenantId_keyword_locale: {
          tenantId: tenantId || 'global',
          keyword: data.keyword.toLowerCase(),
          locale,
        },
      },
      update: {
        searchVolume: data.searchVolume,
        cpc: data.cpc,
        competition: data.competition,
        difficulty: data.difficulty,
        searchIntent: data.searchIntent.toUpperCase() as any,
        intentConfidence: data.intentConfidence,
        relatedKeywords: data.relatedKeywords as any,
        longTailVariants: data.longTailVariants as any,
        questions: data.questions as any,
        serpFeatures: data.serpFeatures,
        lastUpdated: new Date(),
      },
      create: {
        tenantId: tenantId || 'global',
        keyword: data.keyword.toLowerCase(),
        locale,
        searchVolume: data.searchVolume,
        cpc: data.cpc,
        competition: data.competition,
        difficulty: data.difficulty,
        searchIntent: data.searchIntent.toUpperCase() as any,
        intentConfidence: data.intentConfidence,
        relatedKeywords: data.relatedKeywords as any,
        longTailVariants: data.longTailVariants as any,
        questions: data.questions as any,
        serpFeatures: data.serpFeatures,
      },
    });
  }

  /**
   * Map keyword data to result DTO
   */
  private mapToResult(data: KeywordData, dto: KeywordResearchDto): KeywordResultDto {
    return {
      keyword: data.keyword,
      searchVolume: data.searchVolume,
      cpc: data.cpc,
      competition: data.competition,
      difficulty: data.difficulty,
      searchIntent: data.searchIntent,
      intentConfidence: data.intentConfidence,
      relatedKeywords: dto.includeRelated ? data.relatedKeywords : undefined,
      longTailVariants: dto.includeLongTail ? data.longTailVariants : undefined,
      questions: dto.includeQuestions ? data.questions : undefined,
      serpFeatures: dto.includeSerpFeatures ? data.serpFeatures : undefined,
    };
  }

  /**
   * Track keyword ranking (for monitoring)
   */
  async trackKeywordRanking(
    keyword: string,
    tenantId: string,
    locale: string,
    currentRank: number,
  ): Promise<void> {
    const existing = await this.prisma.keywordResearch.findUnique({
      where: {
        tenantId_keyword_locale: {
          tenantId,
          keyword: keyword.toLowerCase(),
          locale,
        },
      },
    });

    const rankHistory = (existing?.rankHistory as any[]) || [];
    rankHistory.push({
      date: new Date().toISOString(),
      position: currentRank,
    });

    // Keep last 90 days of history
    const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const filteredHistory = rankHistory.filter(
      (entry: any) => new Date(entry.date) > cutoffDate,
    );

    await this.prisma.keywordResearch.update({
      where: {
        tenantId_keyword_locale: {
          tenantId,
          keyword: keyword.toLowerCase(),
          locale,
        },
      },
      data: {
        currentRank,
        rankHistory: filteredHistory as any,
        lastUpdated: new Date(),
      },
    });
  }

  /**
   * Get keyword suggestions based on existing content
   */
  async suggestKeywords(tenantId: string, limit = 20): Promise<KeywordResultDto[]> {
    // Get existing keywords with good metrics
    const keywords = await this.prisma.keywordResearch.findMany({
      where: {
        tenantId,
        searchVolume: { gt: 100 },
        difficulty: { lt: 60 },
      },
      orderBy: [
        { searchVolume: 'desc' },
        { difficulty: 'asc' },
      ],
      take: limit,
    });

    return keywords.map(k => ({
      keyword: k.keyword,
      searchVolume: k.searchVolume || undefined,
      cpc: k.cpc || undefined,
      competition: k.competition || undefined,
      difficulty: k.difficulty || undefined,
      searchIntent: k.searchIntent?.toLowerCase() as any,
      intentConfidence: k.intentConfidence || undefined,
    }));
  }
}
