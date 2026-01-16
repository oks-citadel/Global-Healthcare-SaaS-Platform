import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import { BedrockProvider } from '../../providers/bedrock.provider';
import {
  SeoOpportunityQueryDto,
  SeoOpportunityResponseDto,
  SeoOpportunitiesListResponseDto,
  KeywordGapAnalysisDto,
  KeywordGapResponseDto,
} from './dto/seo-opportunity.dto';

@Injectable()
export class SeoService {
  private readonly logger = new Logger(SeoService.name);
  private readonly CACHE_TTL = 86400; // 24 hours

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private bedrock: BedrockProvider,
  ) {}

  async discoverOpportunities(
    tenantId: string,
    query: SeoOpportunityQueryDto,
  ): Promise<SeoOpportunitiesListResponseDto> {
    const cacheKey = `seo-opportunities:${tenantId}:${JSON.stringify(query)}`;

    // Check cache
    const cached = await this.redis.get<SeoOpportunitiesListResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Generate opportunities based on query parameters
      const opportunities = await this.generateOpportunities(tenantId, query);

      // Calculate summary statistics
      const summary = this.calculateSummary(opportunities);

      const response: SeoOpportunitiesListResponseDto = {
        opportunities: opportunities.slice(query.offset || 0, (query.offset || 0) + (query.limit || 20)),
        total: opportunities.length,
        summary,
      };

      // Cache result
      await this.redis.set(cacheKey, response, this.CACHE_TTL);

      // Store opportunities in database
      await this.storeOpportunities(tenantId, opportunities);

      return response;
    } catch (error) {
      this.logger.error(`SEO discovery failed: ${error}`);
      throw error;
    }
  }

  async getStoredOpportunities(
    tenantId: string,
    query: SeoOpportunityQueryDto,
  ): Promise<SeoOpportunitiesListResponseDto> {
    const where: Record<string, unknown> = { tenantId };

    if (query.minSearchVolume) {
      where.searchVolume = { gte: query.minSearchVolume };
    }
    if (query.maxDifficulty) {
      where.difficulty = { lte: query.maxDifficulty };
    }

    const [opportunities, total] = await Promise.all([
      this.prisma.seoOpportunity.findMany({
        where,
        orderBy: { opportunityScore: 'desc' },
        skip: query.offset || 0,
        take: query.limit || 20,
      }),
      this.prisma.seoOpportunity.count({ where }),
    ]);

    const mappedOpportunities: SeoOpportunityResponseDto[] = opportunities.map(
      (o) => ({
        id: o.id,
        keyword: o.keyword,
        searchVolume: o.searchVolume,
        difficulty: o.difficulty,
        currentRank: o.currentRank,
        opportunityScore: o.opportunityScore,
        estimatedTraffic: this.estimateTraffic(o.searchVolume, o.currentRank || 50),
        trafficValue: this.calculateTrafficValue(o.searchVolume, o.difficulty),
        opportunityType: this.classifyOpportunity(o.difficulty, o.currentRank),
        searchIntent: 'informational',
        suggestedContent: o.suggestedContent as SeoOpportunityResponseDto['suggestedContent'],
        competitors: o.competitors as SeoOpportunityResponseDto['competitors'],
        recommendations: [],
        discoveredAt: o.discoveredAt,
      }),
    );

    return {
      opportunities: mappedOpportunities,
      total,
      summary: this.calculateSummary(mappedOpportunities),
    };
  }

  async analyzeKeywordGap(
    tenantId: string,
    analysis: KeywordGapAnalysisDto,
  ): Promise<KeywordGapResponseDto> {
    const cacheKey = `keyword-gap:${tenantId}:${analysis.domain}:${analysis.competitors.join(',')}`;

    const cached = await this.redis.get<KeywordGapResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // Generate gap analysis using AI
      const gapData = await this.bedrock.generateJson<{
        unique: string[];
        missing: string[];
        improvement: string[];
      }>(
        `Analyze keyword gap between domain "${analysis.domain}" and competitors: ${analysis.competitors.join(', ')}.
        Generate realistic SEO keyword suggestions for each category.`,
        `{
          "unique": ["keyword1", "keyword2", "keyword3"],
          "missing": ["keyword1", "keyword2", "keyword3"],
          "improvement": ["keyword1", "keyword2", "keyword3"]
        }`,
        1024,
      );

      const response: KeywordGapResponseDto = {
        uniqueKeywords: await this.keywordsToOpportunities(gapData.unique, 'unique'),
        missingKeywords: await this.keywordsToOpportunities(gapData.missing, 'missing'),
        improvementOpportunities: await this.keywordsToOpportunities(
          gapData.improvement,
          'improvement',
        ),
      };

      await this.redis.set(cacheKey, response, this.CACHE_TTL);

      return response;
    } catch (error) {
      this.logger.error(`Keyword gap analysis failed: ${error}`);
      throw error;
    }
  }

  private async generateOpportunities(
    tenantId: string,
    query: SeoOpportunityQueryDto,
  ): Promise<SeoOpportunityResponseDto[]> {
    const opportunities: SeoOpportunityResponseDto[] = [];

    // Use AI to generate keyword opportunities
    const seedContext = query.keywords?.join(', ') || query.industry || 'general business';

    try {
      const aiKeywords = await this.bedrock.generateJson<{
        keywords: Array<{
          keyword: string;
          searchVolume: number;
          difficulty: number;
          intent: string;
        }>;
      }>(
        `Generate 30 SEO keyword opportunities for: ${seedContext}.
        Include a mix of difficulty levels and search intents.
        Focus on keywords with commercial or informational intent.`,
        `{
          "keywords": [
            {"keyword": "string", "searchVolume": 1000, "difficulty": 50, "intent": "informational|commercial|transactional|navigational"}
          ]
        }`,
        2048,
      );

      for (const kw of aiKeywords.keywords) {
        // Apply filters
        if (query.minSearchVolume && kw.searchVolume < query.minSearchVolume) continue;
        if (query.maxDifficulty && kw.difficulty > query.maxDifficulty) continue;

        const opportunityScore = this.calculateOpportunityScore(kw.searchVolume, kw.difficulty);
        const currentRank = Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 1 : null;

        opportunities.push({
          id: crypto.randomUUID(),
          keyword: kw.keyword,
          searchVolume: kw.searchVolume,
          difficulty: kw.difficulty,
          currentRank,
          opportunityScore,
          estimatedTraffic: this.estimateTraffic(kw.searchVolume, currentRank || 50),
          trafficValue: this.calculateTrafficValue(kw.searchVolume, kw.difficulty),
          opportunityType: this.classifyOpportunity(kw.difficulty, currentRank),
          searchIntent: kw.intent,
          suggestedContent: await this.generateContentSuggestion(kw.keyword, kw.intent),
          competitors: this.generateCompetitorData(query.competitors || []),
          recommendations: this.generateRecommendations(kw.difficulty, currentRank),
          discoveredAt: new Date(),
        });
      }
    } catch (error) {
      this.logger.warn(`AI keyword generation failed, using fallback: ${error}`);
      // Fallback: generate basic opportunities
      const fallbackKeywords = this.getFallbackKeywords(query);
      for (const keyword of fallbackKeywords) {
        const searchVolume = Math.floor(Math.random() * 10000) + 100;
        const difficulty = Math.floor(Math.random() * 100);

        opportunities.push({
          id: crypto.randomUUID(),
          keyword,
          searchVolume,
          difficulty,
          currentRank: null,
          opportunityScore: this.calculateOpportunityScore(searchVolume, difficulty),
          estimatedTraffic: this.estimateTraffic(searchVolume, 50),
          trafficValue: this.calculateTrafficValue(searchVolume, difficulty),
          opportunityType: this.classifyOpportunity(difficulty, null),
          searchIntent: 'informational',
          suggestedContent: {
            type: 'blog_post',
            title: `Complete Guide to ${keyword}`,
            outline: ['Introduction', 'Key Concepts', 'Best Practices', 'Conclusion'],
            wordCount: 2000,
          },
          competitors: [],
          recommendations: ['Create comprehensive content', 'Build backlinks'],
          discoveredAt: new Date(),
        });
      }
    }

    // Sort by opportunity score
    return opportunities.sort((a, b) => b.opportunityScore - a.opportunityScore);
  }

  private calculateOpportunityScore(searchVolume: number, difficulty: number): number {
    // Higher search volume and lower difficulty = higher score
    const volumeScore = Math.min(searchVolume / 1000, 50);
    const difficultyScore = 50 - difficulty / 2;
    return Math.round(volumeScore + difficultyScore);
  }

  private estimateTraffic(searchVolume: number, rank: number): number {
    // CTR estimates by position
    const ctrByPosition: Record<number, number> = {
      1: 0.28,
      2: 0.15,
      3: 0.11,
      4: 0.08,
      5: 0.07,
      6: 0.05,
      7: 0.04,
      8: 0.03,
      9: 0.03,
      10: 0.02,
    };

    const ctr = ctrByPosition[Math.min(rank, 10)] || 0.01;
    return Math.round(searchVolume * ctr);
  }

  private calculateTrafficValue(searchVolume: number, difficulty: number): number {
    // Estimated CPC increases with difficulty
    const estimatedCpc = 0.5 + (difficulty / 100) * 4;
    const estimatedTraffic = this.estimateTraffic(searchVolume, 5);
    return Math.round(estimatedTraffic * estimatedCpc);
  }

  private classifyOpportunity(
    difficulty: number,
    currentRank: number | null,
  ): string {
    if (currentRank && currentRank <= 20 && difficulty < 50) {
      return 'quick_win';
    }
    if (difficulty < 30) {
      return 'long_tail';
    }
    if (difficulty > 70) {
      return 'competitive';
    }
    return 'featured_snippet';
  }

  private async generateContentSuggestion(
    keyword: string,
    intent: string,
  ): Promise<SeoOpportunityResponseDto['suggestedContent']> {
    const contentTypes: Record<string, string> = {
      informational: 'blog_post',
      commercial: 'comparison_guide',
      transactional: 'landing_page',
      navigational: 'resource_page',
    };

    return {
      type: contentTypes[intent] || 'blog_post',
      title: `Complete Guide to ${keyword}`,
      outline: [
        'Introduction',
        `What is ${keyword}`,
        'Key Benefits',
        'How to Implement',
        'Best Practices',
        'Common Mistakes',
        'Conclusion',
      ],
      wordCount: intent === 'informational' ? 2500 : 1500,
    };
  }

  private generateCompetitorData(
    competitors: string[],
  ): SeoOpportunityResponseDto['competitors'] {
    return competitors.slice(0, 3).map((domain) => ({
      domain,
      rank: Math.floor(Math.random() * 10) + 1,
      contentScore: Math.floor(Math.random() * 30) + 70,
    }));
  }

  private generateRecommendations(
    difficulty: number,
    currentRank: number | null,
  ): string[] {
    const recommendations: string[] = [];

    if (currentRank) {
      if (currentRank > 10 && currentRank <= 20) {
        recommendations.push('Optimize on-page SEO to break into top 10');
        recommendations.push('Add internal links from high-authority pages');
      } else if (currentRank > 20) {
        recommendations.push('Create comprehensive, long-form content');
        recommendations.push('Build quality backlinks from relevant sites');
      }
    } else {
      recommendations.push('Create new content targeting this keyword');
      recommendations.push('Ensure proper keyword placement in title and headers');
    }

    if (difficulty > 60) {
      recommendations.push('Focus on building domain authority first');
      recommendations.push('Consider targeting related long-tail keywords');
    }

    return recommendations;
  }

  private getFallbackKeywords(query: SeoOpportunityQueryDto): string[] {
    const base = query.keywords?.[0] || query.industry || 'business';
    return [
      `${base} guide`,
      `${base} tips`,
      `${base} best practices`,
      `how to ${base}`,
      `${base} examples`,
      `${base} tools`,
      `${base} software`,
      `${base} strategies`,
    ];
  }

  private async keywordsToOpportunities(
    keywords: string[],
    type: string,
  ): Promise<SeoOpportunityResponseDto[]> {
    return keywords.map((keyword) => {
      const searchVolume = Math.floor(Math.random() * 5000) + 500;
      const difficulty = Math.floor(Math.random() * 60) + 20;

      return {
        id: crypto.randomUUID(),
        keyword,
        searchVolume,
        difficulty,
        currentRank: type === 'unique' ? Math.floor(Math.random() * 20) + 1 : null,
        opportunityScore: this.calculateOpportunityScore(searchVolume, difficulty),
        estimatedTraffic: this.estimateTraffic(searchVolume, 10),
        trafficValue: this.calculateTrafficValue(searchVolume, difficulty),
        opportunityType: type === 'improvement' ? 'quick_win' : 'competitive',
        searchIntent: 'informational',
        suggestedContent: {
          type: 'blog_post',
          title: `Guide to ${keyword}`,
          outline: ['Introduction', 'Details', 'Conclusion'],
          wordCount: 2000,
        },
        competitors: [],
        recommendations: this.generateRecommendations(difficulty, null),
        discoveredAt: new Date(),
      };
    });
  }

  private calculateSummary(
    opportunities: SeoOpportunityResponseDto[],
  ): SeoOpportunitiesListResponseDto['summary'] {
    return {
      totalSearchVolume: opportunities.reduce((sum, o) => sum + o.searchVolume, 0),
      averageDifficulty:
        opportunities.reduce((sum, o) => sum + o.difficulty, 0) / opportunities.length || 0,
      quickWinCount: opportunities.filter((o) => o.opportunityType === 'quick_win').length,
      totalTrafficPotential: opportunities.reduce((sum, o) => sum + o.estimatedTraffic, 0),
    };
  }

  private async storeOpportunities(
    tenantId: string,
    opportunities: SeoOpportunityResponseDto[],
  ): Promise<void> {
    const data = opportunities.map((o) => ({
      id: o.id,
      tenantId,
      keyword: o.keyword,
      searchVolume: o.searchVolume,
      difficulty: o.difficulty,
      currentRank: o.currentRank,
      opportunityScore: o.opportunityScore,
      suggestedContent: o.suggestedContent,
      competitors: o.competitors,
      discoveredAt: o.discoveredAt,
    }));

    await this.prisma.seoOpportunity.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
