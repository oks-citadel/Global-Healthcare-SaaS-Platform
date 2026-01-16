import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import { BedrockProvider } from '../../providers/bedrock.provider';
import {
  ContentGenerationRequestDto,
  ContentGenerationResponseDto,
  ContentOptimizationRequestDto,
  ContentOptimizationResponseDto,
  ContentImprovementDto,
} from './dto/content-generation.dto';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  private readonly lengthMap: Record<string, { min: number; max: number }> = {
    short: { min: 100, max: 300 },
    medium: { min: 500, max: 1000 },
    long: { min: 1500, max: 3000 },
  };

  private readonly contentTypePrompts: Record<string, string> = {
    blog_post: 'Write a comprehensive blog post',
    email: 'Write a marketing email',
    social_post: 'Write a social media post',
    ad_copy: 'Write compelling ad copy',
    landing_page: 'Write landing page content',
    product_description: 'Write a product description',
    meta_description: 'Write an SEO meta description (150-160 characters)',
    headline: 'Write multiple headline options',
  };

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private bedrock: BedrockProvider,
  ) {}

  async generateContent(
    tenantId: string,
    request: ContentGenerationRequestDto,
  ): Promise<ContentGenerationResponseDto> {
    const startTime = Date.now();

    try {
      const prompt = this.buildGenerationPrompt(request);
      const lengthConfig = this.lengthMap[request.length || 'medium'];

      // Generate main content
      const response = await this.bedrock.invoke({
        prompt,
        maxTokens: this.calculateMaxTokens(request.contentType, request.length || 'medium'),
        temperature: 0.7,
      });

      const generatedContent = response.completion.trim();

      // Generate variations for short content
      const variations = await this.generateVariations(request, generatedContent);

      // Generate headlines
      const headlines = await this.generateHeadlines(request);

      // Generate meta description
      const metaDescription = await this.generateMetaDescription(
        request.topic,
        generatedContent,
      );

      // Calculate metrics
      const wordCount = this.countWords(generatedContent);
      const readabilityScore = this.calculateReadabilityScore(generatedContent);
      const keywordUsage = this.analyzeKeywordUsage(
        generatedContent,
        request.keywords || [],
      );

      const result: ContentGenerationResponseDto = {
        id: crypto.randomUUID(),
        contentType: request.contentType,
        generatedContent,
        variations,
        headlines,
        metaDescription,
        keywordUsage,
        readabilityScore,
        wordCount,
        readingTime: Math.ceil(wordCount / 200),
        modelUsed: 'anthropic.claude-3-sonnet',
        tokensUsed: response.usage.inputTokens + response.usage.outputTokens,
        generatedAt: new Date(),
      };

      // Store in database
      await this.prisma.generatedContent.create({
        data: {
          id: result.id,
          tenantId,
          contentType: request.contentType,
          prompt: request.topic,
          generatedText: generatedContent,
          metadata: {
            tone: request.tone,
            targetAudience: request.targetAudience,
            keywords: request.keywords,
            variations,
            headlines,
          },
          modelUsed: result.modelUsed,
          tokensUsed: result.tokensUsed,
          qualityScore: readabilityScore,
        },
      });

      this.logger.debug(
        `Content generated in ${Date.now() - startTime}ms, ${wordCount} words`,
      );

      return result;
    } catch (error) {
      this.logger.error(`Content generation failed: ${error}`);
      throw error;
    }
  }

  async optimizeContent(
    tenantId: string,
    request: ContentOptimizationRequestDto,
  ): Promise<ContentOptimizationResponseDto> {
    const startTime = Date.now();

    try {
      const prompt = this.buildOptimizationPrompt(request);

      const response = await this.bedrock.invoke({
        prompt,
        maxTokens: Math.max(4096, request.content.length * 2),
        temperature: 0.3,
      });

      const optimizedContent = this.extractOptimizedContent(response.completion);

      // Generate improvements list
      const improvements = await this.identifyImprovements(
        request.content,
        optimizedContent,
        request.optimizationType,
      );

      // Calculate scores
      const originalReadability = this.calculateReadabilityScore(request.content);
      const optimizedReadability = this.calculateReadabilityScore(optimizedContent);
      const originalSeo = this.calculateSeoScore(
        request.content,
        request.targetKeywords || [],
      );
      const optimizedSeo = this.calculateSeoScore(
        optimizedContent,
        request.targetKeywords || [],
      );

      // Generate additional suggestions
      const suggestions = await this.generateSuggestions(
        optimizedContent,
        request.optimizationType,
      );

      const result: ContentOptimizationResponseDto = {
        id: crypto.randomUUID(),
        optimizedContent,
        improvements,
        comparison: {
          originalWordCount: this.countWords(request.content),
          optimizedWordCount: this.countWords(optimizedContent),
          originalReadabilityScore: originalReadability,
          optimizedReadabilityScore: optimizedReadability,
          originalSeoScore: originalSeo,
          optimizedSeoScore: optimizedSeo,
        },
        readabilityScore: optimizedReadability,
        seoScore: optimizedSeo,
        suggestions,
        modelUsed: 'anthropic.claude-3-sonnet',
        optimizedAt: new Date(),
      };

      // Store in database
      await this.prisma.contentOptimization.create({
        data: {
          id: result.id,
          tenantId,
          originalContent: request.content,
          optimizedContent,
          optimizationType: request.optimizationType,
          improvements: improvements,
          readabilityScore: optimizedReadability,
          seoScore: optimizedSeo,
          modelUsed: result.modelUsed,
        },
      });

      this.logger.debug(
        `Content optimized in ${Date.now() - startTime}ms`,
      );

      return result;
    } catch (error) {
      this.logger.error(`Content optimization failed: ${error}`);
      throw error;
    }
  }

  async getGeneratedContentHistory(
    tenantId: string,
    limit = 20,
  ): Promise<ContentGenerationResponseDto[]> {
    const content = await this.prisma.generatedContent.findMany({
      where: { tenantId },
      orderBy: { generatedAt: 'desc' },
      take: limit,
    });

    return content.map((c) => {
      const metadata = c.metadata as {
        variations?: string[];
        headlines?: string[];
      };
      return {
        id: c.id,
        contentType: c.contentType,
        generatedContent: c.generatedText,
        variations: metadata?.variations || [],
        headlines: metadata?.headlines || [],
        metaDescription: '',
        keywordUsage: {},
        readabilityScore: c.qualityScore || 0,
        wordCount: this.countWords(c.generatedText),
        readingTime: Math.ceil(this.countWords(c.generatedText) / 200),
        modelUsed: c.modelUsed,
        tokensUsed: c.tokensUsed,
        generatedAt: c.generatedAt,
      };
    });
  }

  private buildGenerationPrompt(request: ContentGenerationRequestDto): string {
    const basePrompt = this.contentTypePrompts[request.contentType];
    const lengthConfig = this.lengthMap[request.length || 'medium'];

    let prompt = `${basePrompt} about "${request.topic}".

Requirements:
- Tone: ${request.tone || 'professional'}
- Target length: ${lengthConfig.min}-${lengthConfig.max} words`;

    if (request.targetAudience) {
      prompt += `\n- Target audience: ${request.targetAudience}`;
    }

    if (request.keywords?.length) {
      prompt += `\n- Include these keywords naturally: ${request.keywords.join(', ')}`;
    }

    if (request.brand?.name) {
      prompt += `\n- Brand: ${request.brand.name}`;
    }

    if (request.brand?.voice) {
      prompt += `\n- Brand voice: ${request.brand.voice}`;
    }

    if (request.brand?.guidelines) {
      prompt += `\n- Guidelines: ${request.brand.guidelines}`;
    }

    if (request.additionalContext) {
      prompt += `\n- Additional context: ${request.additionalContext}`;
    }

    prompt += '\n\nWrite only the content without any preamble or explanation.';

    return prompt;
  }

  private buildOptimizationPrompt(
    request: ContentOptimizationRequestDto,
  ): string {
    const optimizationInstructions: Record<string, string> = {
      seo: `Optimize this content for SEO:
- Improve keyword placement and density for: ${request.targetKeywords?.join(', ') || 'relevant terms'}
- Ensure proper heading structure
- Add internal linking suggestions
- Improve meta-friendliness`,
      readability: `Improve the readability of this content:
- Shorten complex sentences
- Use simpler vocabulary where appropriate
- Improve paragraph structure
- Add transitions between ideas
- Target reading level: ${request.targetReadingLevel || 'high_school'}`,
      engagement: `Optimize this content for engagement:
- Add compelling hooks
- Include questions to engage readers
- Add calls-to-action
- Make content more scannable
- Add emotional appeal`,
      conversion: `Optimize this content for conversion:
- Strengthen value propositions
- Add social proof elements
- Improve calls-to-action
- Address objections
- Create urgency`,
      tone: `Adjust the tone of this content to be more ${request.targetTone || 'professional'}:
- Maintain the core message
- Adjust vocabulary and phrasing
- Ensure consistency throughout`,
      grammar: `Improve the grammar and style of this content:
- Fix grammatical errors
- Improve punctuation
- Enhance sentence structure
- Ensure consistency
- Polish the overall writing`,
    };

    let prompt = `${optimizationInstructions[request.optimizationType]}

Original content:
"""
${request.content}
"""

${request.preserveLength ? 'Keep the optimized content approximately the same length.' : ''}

Provide the optimized content only, without explanations.`;

    return prompt;
  }

  private async generateVariations(
    request: ContentGenerationRequestDto,
    original: string,
  ): Promise<string[]> {
    if (
      request.contentType !== 'headline' &&
      request.contentType !== 'social_post' &&
      request.contentType !== 'ad_copy'
    ) {
      return [];
    }

    try {
      const response = await this.bedrock.generateJson<{ variations: string[] }>(
        `Generate 3 alternative versions of this ${request.contentType}:
"${original}"

Keep the same message but vary the style and approach.`,
        `{"variations": ["string", "string", "string"]}`,
        1024,
      );
      return response.variations;
    } catch {
      return [];
    }
  }

  private async generateHeadlines(
    request: ContentGenerationRequestDto,
  ): Promise<string[]> {
    try {
      const response = await this.bedrock.generateJson<{ headlines: string[] }>(
        `Generate 5 compelling headlines for ${request.contentType} about "${request.topic}".
Tone: ${request.tone || 'professional'}
${request.keywords?.length ? `Include keywords: ${request.keywords.join(', ')}` : ''}`,
        `{"headlines": ["string", "string", "string", "string", "string"]}`,
        512,
      );
      return response.headlines;
    } catch {
      return [`Guide to ${request.topic}`, `Understanding ${request.topic}`];
    }
  }

  private async generateMetaDescription(
    topic: string,
    content: string,
  ): Promise<string> {
    try {
      const response = await this.bedrock.invoke({
        prompt: `Write a compelling SEO meta description (150-160 characters) for this content about "${topic}":

${content.substring(0, 500)}...

Output only the meta description, nothing else.`,
        maxTokens: 100,
        temperature: 0.5,
      });
      return response.completion.trim().substring(0, 160);
    } catch {
      return `Learn everything about ${topic}. Comprehensive guide with expert insights.`;
    }
  }

  private async identifyImprovements(
    original: string,
    optimized: string,
    optimizationType: string,
  ): Promise<ContentImprovementDto[]> {
    try {
      const response = await this.bedrock.generateJson<{
        improvements: Array<{
          type: string;
          original: string;
          improved: string;
          reason: string;
        }>;
      }>(
        `Analyze the differences between original and optimized content for ${optimizationType} improvements.

Original (excerpt):
"${original.substring(0, 500)}"

Optimized (excerpt):
"${optimized.substring(0, 500)}"

List up to 5 specific improvements made.`,
        `{
          "improvements": [
            {"type": "string", "original": "string", "improved": "string", "reason": "string"}
          ]
        }`,
        1024,
      );
      return response.improvements;
    } catch {
      return [];
    }
  }

  private async generateSuggestions(
    content: string,
    optimizationType: string,
  ): Promise<string[]> {
    try {
      const response = await this.bedrock.generateJson<{ suggestions: string[] }>(
        `Suggest 3 additional ways to improve this content for ${optimizationType}:
"${content.substring(0, 500)}..."`,
        `{"suggestions": ["string", "string", "string"]}`,
        512,
      );
      return response.suggestions;
    } catch {
      return [
        'Consider adding more specific examples',
        'Include data or statistics to support claims',
        'Add a clear call-to-action',
      ];
    }
  }

  private extractOptimizedContent(response: string): string {
    // Remove any preamble the model might have added
    const content = response
      .replace(/^(Here is|Here's|The optimized content|Optimized content:|Optimized version:).*/im, '')
      .trim();
    return content;
  }

  private calculateMaxTokens(contentType: string, length: string): number {
    const baseTokens: Record<string, number> = {
      blog_post: 4000,
      email: 1000,
      social_post: 500,
      ad_copy: 500,
      landing_page: 3000,
      product_description: 1000,
      meta_description: 200,
      headline: 200,
    };

    const lengthMultiplier: Record<string, number> = {
      short: 0.5,
      medium: 1,
      long: 2,
    };

    return Math.round(
      (baseTokens[contentType] || 2000) * (lengthMultiplier[length] || 1),
    );
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  }

  private calculateReadabilityScore(text: string): number {
    // Simplified Flesch-Kincaid approximation
    const words = this.countWords(text);
    const sentences = (text.match(/[.!?]+/g) || []).length || 1;
    const syllables = this.countSyllables(text);

    const avgWordsPerSentence = words / sentences;
    const avgSyllablesPerWord = syllables / words;

    // Flesch Reading Ease formula
    const score =
      206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private countSyllables(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    let count = 0;

    for (const word of words) {
      // Simple syllable estimation
      const vowels = word.match(/[aeiouy]+/g);
      count += vowels ? vowels.length : 1;
    }

    return count;
  }

  private calculateSeoScore(text: string, keywords: string[]): number {
    if (!keywords.length) return 70;

    let score = 50;
    const lowerText = text.toLowerCase();

    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      const occurrences = (lowerText.match(new RegExp(keywordLower, 'g')) || [])
        .length;

      if (occurrences > 0) {
        score += 10;
      }
      if (occurrences >= 2) {
        score += 5;
      }
    }

    // Check for header-like structures
    if (text.includes('#') || text.match(/^[A-Z][^.!?]*$/m)) {
      score += 10;
    }

    return Math.min(100, score);
  }

  private analyzeKeywordUsage(
    text: string,
    keywords: string[],
  ): Record<string, number> {
    const usage: Record<string, number> = {};
    const lowerText = text.toLowerCase();

    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();
      const matches = lowerText.match(new RegExp(keywordLower, 'g'));
      usage[keyword] = matches ? matches.length : 0;
    }

    return usage;
  }
}
