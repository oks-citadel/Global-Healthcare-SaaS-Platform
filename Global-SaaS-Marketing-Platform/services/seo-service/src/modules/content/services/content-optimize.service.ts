import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as cheerio from 'cheerio';
import { PrismaService } from '../../../prisma/prisma.service';
import { ContentOptimizeDto, ContentOptimizationResultDto } from '../../../common/dto';

interface ReadabilityMetrics {
  fleschKincaid: number;
  avgSentenceLength: number;
  avgWordLength: number;
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
}

interface KeywordAnalysis {
  targetKeyword: string;
  density: number;
  count: number;
  placements: Record<string, boolean>;
}

interface StructureAnalysis {
  headingStructure: Record<string, number>;
  imageAnalysis: { count: number; withAlt: number; withoutAlt: number };
  linkAnalysis: { internal: number; external: number; broken: number };
}

interface ContentSuggestion {
  type: string;
  priority: 'high' | 'medium' | 'low';
  current?: string;
  suggested: string;
  reason: string;
}

@Injectable()
export class ContentOptimizeService {
  private readonly logger = new Logger(ContentOptimizeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Optimize content and generate suggestions
   */
  async optimizeContent(dto: ContentOptimizeDto): Promise<ContentOptimizationResultDto> {
    let content = dto.content || '';
    let htmlContent = '';

    // Fetch content from URL if provided
    if (dto.url && !content) {
      const fetched = await this.fetchContent(dto.url);
      htmlContent = fetched.html;
      content = fetched.text;
    }

    // Analyze content
    const readabilityMetrics = dto.analyzeReadability
      ? this.analyzeReadability(content)
      : undefined;

    const keywordAnalysis = dto.analyzeKeywords && dto.targetKeyword
      ? this.analyzeKeywords(content, htmlContent, dto.targetKeyword)
      : undefined;

    const structureAnalysis = dto.analyzeStructure && htmlContent
      ? this.analyzeStructure(htmlContent)
      : undefined;

    // Calculate scores
    const readabilityScore = readabilityMetrics
      ? this.calculateReadabilityScore(readabilityMetrics)
      : undefined;

    const keywordScore = keywordAnalysis
      ? this.calculateKeywordScore(keywordAnalysis)
      : undefined;

    const structureScore = structureAnalysis
      ? this.calculateStructureScore(structureAnalysis)
      : undefined;

    // Calculate overall score
    const scores = [readabilityScore, keywordScore, structureScore].filter(
      (s) => s !== undefined,
    ) as number[];
    const overallScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    // Generate suggestions
    const suggestions = dto.generateSuggestions
      ? this.generateSuggestions(
          readabilityMetrics,
          keywordAnalysis,
          structureAnalysis,
          content,
        )
      : undefined;

    // Store analysis result
    if (dto.tenantId) {
      await this.storeAnalysis(dto, {
        overallScore,
        readabilityScore,
        keywordScore,
        structureScore,
        readabilityMetrics,
        keywordAnalysis,
        structureAnalysis,
        suggestions,
      });
    }

    return {
      overallScore,
      readabilityScore,
      keywordScore,
      structureScore,
      engagementScore: this.calculateEngagementScore(content, structureAnalysis),
      readabilityMetrics,
      keywordAnalysis: keywordAnalysis
        ? {
            targetKeyword: keywordAnalysis.targetKeyword,
            density: keywordAnalysis.density,
            placements: keywordAnalysis.placements,
          }
        : undefined,
      structureAnalysis,
      suggestions,
    };
  }

  /**
   * Fetch content from URL
   */
  private async fetchContent(url: string): Promise<{ html: string; text: string }> {
    try {
      const response = await this.httpService.axiosRef.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'MarketingPlatformBot/1.0 SEO Analyzer',
        },
      });

      const $ = cheerio.load(response.data);

      // Remove script and style elements
      $('script, style, nav, footer, header, aside').remove();

      // Get main content
      const mainContent = $('main, article, .content, #content, .post').first();
      const html = mainContent.length ? mainContent.html() || '' : $('body').html() || '';
      const text = mainContent.length ? mainContent.text() : $('body').text();

      return {
        html: response.data,
        text: text.replace(/\s+/g, ' ').trim(),
      };
    } catch (error) {
      this.logger.error(`Failed to fetch content from ${url}:`, error);
      throw new Error(`Failed to fetch content: ${error.message}`);
    }
  }

  /**
   * Analyze readability metrics
   */
  private analyzeReadability(text: string): ReadabilityMetrics {
    // Clean text
    const cleanText = text.replace(/\s+/g, ' ').trim();

    // Count words
    const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
    const wordCount = words.length;

    // Count sentences
    const sentences = cleanText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const sentenceCount = sentences.length;

    // Count syllables (approximation)
    const totalSyllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0);

    // Calculate metrics
    const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const avgWordLength = wordCount > 0
      ? words.reduce((sum, w) => sum + w.length, 0) / wordCount
      : 0;

    // Flesch-Kincaid Grade Level
    const fleschKincaid = sentenceCount > 0 && wordCount > 0
      ? 0.39 * (wordCount / sentenceCount) + 11.8 * (totalSyllables / wordCount) - 15.59
      : 0;

    // Count paragraphs
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
    const paragraphCount = paragraphs.length || 1;

    return {
      fleschKincaid: Math.max(0, Math.round(fleschKincaid * 10) / 10),
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      avgWordLength: Math.round(avgWordLength * 10) / 10,
      wordCount,
      paragraphCount,
      sentenceCount,
    };
  }

  /**
   * Count syllables in a word (approximation)
   */
  private countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;

    const vowelGroups = word.match(/[aeiouy]+/g);
    let count = vowelGroups ? vowelGroups.length : 1;

    // Adjust for common patterns
    if (word.endsWith('e') && !word.endsWith('le')) count--;
    if (word.endsWith('es') || word.endsWith('ed')) count--;
    if (count < 1) count = 1;

    return count;
  }

  /**
   * Analyze keyword usage
   */
  private analyzeKeywords(
    text: string,
    html: string,
    targetKeyword: string,
  ): KeywordAnalysis {
    const lowerText = text.toLowerCase();
    const lowerKeyword = targetKeyword.toLowerCase();
    const words = lowerText.split(/\s+/).length;

    // Count keyword occurrences
    const keywordRegex = new RegExp(lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(keywordRegex);
    const count = matches ? matches.length : 0;

    // Calculate density
    const keywordWords = targetKeyword.split(/\s+/).length;
    const density = words > 0 ? (count * keywordWords / words) * 100 : 0;

    // Check placements
    const $ = html ? cheerio.load(html) : null;

    const placements: Record<string, boolean> = {
      title: $ ? $('title').text().toLowerCase().includes(lowerKeyword) : false,
      h1: $ ? $('h1').text().toLowerCase().includes(lowerKeyword) : false,
      h2: $ ? $('h2').toArray().some((el) => $(el).text().toLowerCase().includes(lowerKeyword)) : false,
      firstParagraph: lowerText.slice(0, 500).includes(lowerKeyword),
      metaDescription: $ ? $('meta[name="description"]').attr('content')?.toLowerCase().includes(lowerKeyword) || false : false,
      url: false, // Would need URL to check
      imgAlt: $ ? $('img[alt]').toArray().some((el) => $(el).attr('alt')?.toLowerCase().includes(lowerKeyword)) : false,
    };

    return {
      targetKeyword,
      density: Math.round(density * 100) / 100,
      count,
      placements,
    };
  }

  /**
   * Analyze content structure
   */
  private analyzeStructure(html: string): StructureAnalysis {
    const $ = cheerio.load(html);

    // Heading structure
    const headingStructure: Record<string, number> = {
      h1: $('h1').length,
      h2: $('h2').length,
      h3: $('h3').length,
      h4: $('h4').length,
      h5: $('h5').length,
      h6: $('h6').length,
    };

    // Image analysis
    const images = $('img');
    const imagesWithAlt = $('img[alt]').filter((_, el) => $(el).attr('alt')?.trim().length! > 0);

    const imageAnalysis = {
      count: images.length,
      withAlt: imagesWithAlt.length,
      withoutAlt: images.length - imagesWithAlt.length,
    };

    // Link analysis
    const links = $('a[href]');
    let internal = 0;
    let external = 0;

    links.each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.startsWith('http') && !href.includes(this.configService.get('app.host') || 'localhost')) {
        external++;
      } else if (href.startsWith('/') || href.startsWith('#') || !href.startsWith('http')) {
        internal++;
      } else {
        internal++;
      }
    });

    const linkAnalysis = {
      internal,
      external,
      broken: 0, // Would need to check each link
    };

    return {
      headingStructure,
      imageAnalysis,
      linkAnalysis,
    };
  }

  /**
   * Calculate readability score (0-100)
   */
  private calculateReadabilityScore(metrics: ReadabilityMetrics): number {
    let score = 100;

    // Penalize for very high grade level (>12 is college level)
    if (metrics.fleschKincaid > 12) {
      score -= (metrics.fleschKincaid - 12) * 5;
    }
    if (metrics.fleschKincaid > 16) {
      score -= 20;
    }

    // Penalize for too long sentences
    if (metrics.avgSentenceLength > 25) {
      score -= (metrics.avgSentenceLength - 25) * 2;
    }

    // Penalize for too short content
    if (metrics.wordCount < 300) {
      score -= (300 - metrics.wordCount) * 0.1;
    }

    // Reward for optimal word count
    if (metrics.wordCount >= 1000 && metrics.wordCount <= 2500) {
      score += 5;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate keyword score (0-100)
   */
  private calculateKeywordScore(analysis: KeywordAnalysis): number {
    let score = 0;

    // Keyword density (optimal: 1-2%)
    if (analysis.density >= 0.5 && analysis.density <= 2.5) {
      score += 25;
    } else if (analysis.density > 2.5) {
      score += Math.max(0, 25 - (analysis.density - 2.5) * 10);
    } else {
      score += analysis.density * 50;
    }

    // Placement scoring
    const placementScores: Record<string, number> = {
      title: 20,
      h1: 15,
      h2: 10,
      firstParagraph: 15,
      metaDescription: 10,
      imgAlt: 5,
    };

    for (const [placement, points] of Object.entries(placementScores)) {
      if (analysis.placements[placement]) {
        score += points;
      }
    }

    return Math.min(100, Math.round(score));
  }

  /**
   * Calculate structure score (0-100)
   */
  private calculateStructureScore(analysis: StructureAnalysis): number {
    let score = 50;

    // H1 check (should have exactly 1)
    if (analysis.headingStructure.h1 === 1) {
      score += 15;
    } else if (analysis.headingStructure.h1 > 1) {
      score -= 10;
    } else {
      score -= 15;
    }

    // H2 check (should have multiple)
    if (analysis.headingStructure.h2 >= 2 && analysis.headingStructure.h2 <= 10) {
      score += 15;
    } else if (analysis.headingStructure.h2 > 0) {
      score += 5;
    }

    // Image alt text
    if (analysis.imageAnalysis.count > 0) {
      const altPercentage = analysis.imageAnalysis.withAlt / analysis.imageAnalysis.count;
      score += Math.round(altPercentage * 10);

      if (altPercentage === 1) {
        score += 5;
      }
    }

    // Internal links
    if (analysis.linkAnalysis.internal >= 3) {
      score += 5;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate engagement score (0-100)
   */
  private calculateEngagementScore(
    content: string,
    structure?: StructureAnalysis,
  ): number {
    let score = 50;

    // Check for engaging elements
    const hasQuestions = /\?/.test(content);
    const hasLists = /<[ou]l/i.test(content) || /^\s*[-*•]\s/m.test(content);
    const hasNumbers = /\d+/.test(content);

    if (hasQuestions) score += 10;
    if (hasLists) score += 10;
    if (hasNumbers) score += 5;

    // Media elements
    if (structure) {
      if (structure.imageAnalysis.count > 0) score += 10;
      if (structure.imageAnalysis.count >= 3) score += 5;
    }

    // Action words
    const actionWords = ['discover', 'learn', 'get', 'start', 'try', 'find', 'create'];
    const hasActionWords = actionWords.some((w) => content.toLowerCase().includes(w));
    if (hasActionWords) score += 10;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Generate optimization suggestions
   */
  private generateSuggestions(
    readability?: ReadabilityMetrics,
    keyword?: KeywordAnalysis,
    structure?: StructureAnalysis,
    content?: string,
  ): ContentSuggestion[] {
    const suggestions: ContentSuggestion[] = [];

    // Readability suggestions
    if (readability) {
      if (readability.fleschKincaid > 12) {
        suggestions.push({
          type: 'readability',
          priority: 'high',
          current: `Grade level: ${readability.fleschKincaid}`,
          suggested: 'Simplify language to grade 8-10 reading level',
          reason: 'Content is too complex for general audiences',
        });
      }

      if (readability.avgSentenceLength > 25) {
        suggestions.push({
          type: 'readability',
          priority: 'medium',
          current: `Average sentence: ${readability.avgSentenceLength} words`,
          suggested: 'Break long sentences into shorter ones (15-20 words)',
          reason: 'Long sentences reduce readability',
        });
      }

      if (readability.wordCount < 300) {
        suggestions.push({
          type: 'content_length',
          priority: 'high',
          current: `Word count: ${readability.wordCount}`,
          suggested: 'Expand content to at least 1,000 words',
          reason: 'Short content often ranks poorly',
        });
      }
    }

    // Keyword suggestions
    if (keyword) {
      if (keyword.density < 0.5) {
        suggestions.push({
          type: 'keyword_density',
          priority: 'high',
          current: `Keyword density: ${keyword.density}%`,
          suggested: `Include "${keyword.targetKeyword}" more naturally (aim for 1-2%)`,
          reason: 'Low keyword presence may hurt relevance',
        });
      } else if (keyword.density > 3) {
        suggestions.push({
          type: 'keyword_density',
          priority: 'high',
          current: `Keyword density: ${keyword.density}%`,
          suggested: 'Reduce keyword usage to avoid over-optimization',
          reason: 'Keyword stuffing can trigger penalties',
        });
      }

      if (!keyword.placements.title) {
        suggestions.push({
          type: 'keyword_placement',
          priority: 'high',
          suggested: `Add "${keyword.targetKeyword}" to the page title`,
          reason: 'Title tag is critical for SEO',
        });
      }

      if (!keyword.placements.h1) {
        suggestions.push({
          type: 'keyword_placement',
          priority: 'high',
          suggested: `Include "${keyword.targetKeyword}" in the H1 heading`,
          reason: 'H1 is a strong ranking signal',
        });
      }

      if (!keyword.placements.firstParagraph) {
        suggestions.push({
          type: 'keyword_placement',
          priority: 'medium',
          suggested: `Mention "${keyword.targetKeyword}" in the first paragraph`,
          reason: 'Early mention signals relevance',
        });
      }

      if (!keyword.placements.metaDescription) {
        suggestions.push({
          type: 'keyword_placement',
          priority: 'medium',
          suggested: `Include "${keyword.targetKeyword}" in meta description`,
          reason: 'Improves click-through rate from SERPs',
        });
      }
    }

    // Structure suggestions
    if (structure) {
      if (structure.headingStructure.h1 === 0) {
        suggestions.push({
          type: 'structure',
          priority: 'high',
          suggested: 'Add an H1 heading to the page',
          reason: 'H1 is essential for SEO and accessibility',
        });
      } else if (structure.headingStructure.h1 > 1) {
        suggestions.push({
          type: 'structure',
          priority: 'high',
          current: `${structure.headingStructure.h1} H1 headings`,
          suggested: 'Use only one H1 heading per page',
          reason: 'Multiple H1s dilute page focus',
        });
      }

      if (structure.headingStructure.h2 < 2) {
        suggestions.push({
          type: 'structure',
          priority: 'medium',
          suggested: 'Add more H2 subheadings to break up content',
          reason: 'Improves scannability and SEO',
        });
      }

      if (structure.imageAnalysis.withoutAlt > 0) {
        suggestions.push({
          type: 'accessibility',
          priority: 'high',
          current: `${structure.imageAnalysis.withoutAlt} images without alt text`,
          suggested: 'Add descriptive alt text to all images',
          reason: 'Required for accessibility and image SEO',
        });
      }

      if (structure.imageAnalysis.count === 0) {
        suggestions.push({
          type: 'engagement',
          priority: 'medium',
          suggested: 'Add relevant images to the content',
          reason: 'Images improve engagement and reduce bounce rate',
        });
      }

      if (structure.linkAnalysis.internal < 3) {
        suggestions.push({
          type: 'internal_linking',
          priority: 'medium',
          current: `${structure.linkAnalysis.internal} internal links`,
          suggested: 'Add more internal links to related content',
          reason: 'Improves site navigation and spreads link equity',
        });
      }
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return suggestions;
  }

  /**
   * Store analysis result in database
   */
  private async storeAnalysis(
    dto: ContentOptimizeDto,
    result: ContentOptimizationResultDto,
  ): Promise<void> {
    await this.prisma.contentAnalysis.create({
      data: {
        tenantId: dto.tenantId!,
        url: dto.url,
        content: dto.content?.slice(0, 10000), // Store first 10k chars
        overallScore: result.overallScore,
        readabilityScore: result.readabilityScore,
        keywordScore: result.keywordScore,
        structureScore: result.structureScore,
        engagementScore: result.engagementScore,
        fleschKincaid: result.readabilityMetrics?.fleschKincaid,
        avgSentenceLength: result.readabilityMetrics?.avgSentenceLength,
        avgWordLength: result.readabilityMetrics?.avgWordLength,
        wordCount: result.readabilityMetrics?.wordCount,
        paragraphCount: result.readabilityMetrics?.paragraphCount,
        targetKeyword: result.keywordAnalysis?.targetKeyword,
        keywordDensity: result.keywordAnalysis?.density,
        keywordPlacements: result.keywordAnalysis?.placements as any,
        headingStructure: result.structureAnalysis?.headingStructure as any,
        imageAnalysis: result.structureAnalysis?.imageAnalysis as any,
        linkAnalysis: result.structureAnalysis?.linkAnalysis as any,
        nlpSuggestions: result.suggestions as any,
        analyzedAt: new Date(),
      },
    });
  }
}
