import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../common/services/cache.service';
import { ContentType, Prisma } from '@prisma/client';
import OpenAI from 'openai';

export interface GenerateOutlineDto {
  topic: string;
  keywords: string[];
  targetAudience?: string;
  contentType: ContentType;
  wordCount?: number;
  tone?: 'professional' | 'casual' | 'academic' | 'conversational';
}

export interface GenerateBriefDto {
  title: string;
  objective?: string;
  targetAudience?: string;
  keyMessages?: string[];
  keywords?: string[];
  competitorUrls?: string[];
  contentType: ContentType;
}

export interface RepurposeContentDto {
  sourcePageId: string;
  targetType: ContentType;
  additionalInstructions?: string;
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private openai: OpenAI;
  private model: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.model = this.configService.get<string>('OPENAI_MODEL', 'gpt-4-turbo-preview');

    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAI client initialized');
    } else {
      this.logger.warn('OpenAI API key not configured - AI features will be limited');
    }
  }

  /**
   * Generate content outline using AI
   */
  async generateOutline(tenantId: string, userId: string, data: GenerateOutlineDto) {
    if (!this.openai) {
      return this.generateMockOutline(data);
    }

    const prompt = this.buildOutlinePrompt(data);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert content strategist and SEO specialist. Generate detailed, well-structured content outlines optimized for search engines and reader engagement. Always respond in valid JSON format.`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const outline = JSON.parse(response.choices[0].message.content || '{}');

      // Save outline to database
      const savedOutline = await this.prisma.contentOutline.create({
        data: {
          tenantId,
          topic: data.topic,
          keywords: data.keywords,
          targetAudience: data.targetAudience,
          contentType: data.contentType,
          outline: outline as Prisma.InputJsonValue,
          modelUsed: this.model,
          createdBy: userId,
        },
      });

      this.logger.log(`Generated outline: ${savedOutline.id}`);

      return {
        id: savedOutline.id,
        outline,
      };
    } catch (error) {
      this.logger.error(`Failed to generate outline: ${error.message}`);
      return this.generateMockOutline(data);
    }
  }

  /**
   * Generate content brief using AI
   */
  async generateBrief(tenantId: string, userId: string, data: GenerateBriefDto) {
    if (!this.openai) {
      return this.generateMockBrief(data);
    }

    const prompt = this.buildBriefPrompt(data);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert content strategist. Generate comprehensive content briefs that provide writers with all the information they need to create high-quality, engaging content. Always respond in valid JSON format.`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const brief = JSON.parse(response.choices[0].message.content || '{}');

      // Save brief to database
      const savedBrief = await this.prisma.contentBrief.create({
        data: {
          tenantId,
          title: data.title,
          objective: data.objective,
          targetAudience: data.targetAudience,
          keyMessages: data.keyMessages || [],
          keywords: data.keywords || [],
          competitorUrls: data.competitorUrls || [],
          brief: brief as Prisma.InputJsonValue,
          wordCountMin: brief.wordCountRecommendation?.min,
          wordCountMax: brief.wordCountRecommendation?.max,
          suggestedHeadings: brief.suggestedHeadings || [],
          modelUsed: this.model,
          createdBy: userId,
        },
      });

      this.logger.log(`Generated brief: ${savedBrief.id}`);

      return {
        id: savedBrief.id,
        brief,
      };
    } catch (error) {
      this.logger.error(`Failed to generate brief: ${error.message}`);
      return this.generateMockBrief(data);
    }
  }

  /**
   * Repurpose content for different format
   */
  async repurposeContent(tenantId: string, userId: string, data: RepurposeContentDto) {
    // Get source content
    const sourcePage = await this.prisma.contentPage.findFirst({
      where: { id: data.sourcePageId, tenantId },
    });

    if (!sourcePage) {
      throw new Error(`Source page not found: ${data.sourcePageId}`);
    }

    if (!this.openai) {
      return this.generateMockRepurpose(sourcePage, data.targetType);
    }

    const prompt = this.buildRepurposePrompt(sourcePage, data);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert content repurposing specialist. Transform content from one format to another while maintaining the core message and value. Adapt the tone, structure, and length appropriately for the target format. Always respond in valid JSON format.`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const repurposedContent = JSON.parse(response.choices[0].message.content || '{}');

      // Save repurposed content
      const saved = await this.prisma.contentRepurpose.create({
        data: {
          tenantId,
          sourcePageId: data.sourcePageId,
          sourceType: sourcePage.type,
          targetType: data.targetType,
          targetContent: repurposedContent as Prisma.InputJsonValue,
          modelUsed: this.model,
          createdBy: userId,
        },
      });

      this.logger.log(`Repurposed content: ${saved.id}`);

      return {
        id: saved.id,
        sourceTitle: sourcePage.title,
        sourceType: sourcePage.type,
        targetType: data.targetType,
        content: repurposedContent,
      };
    } catch (error) {
      this.logger.error(`Failed to repurpose content: ${error.message}`);
      return this.generateMockRepurpose(sourcePage, data.targetType);
    }
  }

  /**
   * Build outline generation prompt
   */
  private buildOutlinePrompt(data: GenerateOutlineDto): string {
    return `Generate a detailed content outline for the following:

Topic: ${data.topic}
Content Type: ${data.contentType}
Target Keywords: ${data.keywords.join(', ')}
${data.targetAudience ? `Target Audience: ${data.targetAudience}` : ''}
${data.wordCount ? `Target Word Count: ${data.wordCount}` : ''}
${data.tone ? `Tone: ${data.tone}` : ''}

Please provide a JSON response with the following structure:
{
  "title": "Suggested title for the content",
  "metaDescription": "SEO-optimized meta description (max 160 characters)",
  "introduction": {
    "hook": "Engaging opening statement",
    "context": "Brief context setting",
    "thesis": "Main point or promise to the reader"
  },
  "sections": [
    {
      "heading": "H2 heading",
      "subHeadings": ["H3 subheading 1", "H3 subheading 2"],
      "keyPoints": ["Point 1", "Point 2"],
      "targetKeywords": ["keyword1", "keyword2"]
    }
  ],
  "conclusion": {
    "summary": "Key takeaways",
    "callToAction": "Suggested CTA"
  },
  "internalLinkingSuggestions": ["Topic 1", "Topic 2"],
  "estimatedWordCount": 1500,
  "estimatedReadTime": "6 min"
}`;
  }

  /**
   * Build brief generation prompt
   */
  private buildBriefPrompt(data: GenerateBriefDto): string {
    return `Generate a comprehensive content brief for the following:

Title: ${data.title}
Content Type: ${data.contentType}
${data.objective ? `Objective: ${data.objective}` : ''}
${data.targetAudience ? `Target Audience: ${data.targetAudience}` : ''}
${data.keyMessages?.length ? `Key Messages: ${data.keyMessages.join(', ')}` : ''}
${data.keywords?.length ? `Target Keywords: ${data.keywords.join(', ')}` : ''}
${data.competitorUrls?.length ? `Competitor URLs for reference: ${data.competitorUrls.join(', ')}` : ''}

Please provide a JSON response with the following structure:
{
  "title": "Finalized title",
  "objective": "Clear content objective",
  "targetAudience": {
    "demographics": "Who they are",
    "painPoints": ["Pain point 1", "Pain point 2"],
    "goals": ["Goal 1", "Goal 2"]
  },
  "keyMessages": ["Message 1", "Message 2"],
  "contentAngle": "Unique angle or perspective",
  "toneAndVoice": "Recommended tone description",
  "suggestedHeadings": ["Heading 1", "Heading 2", "Heading 3"],
  "mustInclude": ["Required element 1", "Required element 2"],
  "mustAvoid": ["Thing to avoid 1", "Thing to avoid 2"],
  "wordCountRecommendation": {
    "min": 1200,
    "max": 1800
  },
  "seoGuidelines": {
    "primaryKeyword": "main keyword",
    "secondaryKeywords": ["keyword1", "keyword2"],
    "keywordDensity": "1-2%",
    "metaTitleSuggestion": "Suggested meta title",
    "metaDescriptionSuggestion": "Suggested meta description"
  },
  "competitiveInsights": "Key insights from competitor analysis",
  "references": ["Suggested reference 1", "Suggested reference 2"],
  "callToAction": "Recommended CTA"
}`;
  }

  /**
   * Build repurpose prompt
   */
  private buildRepurposePrompt(sourcePage: any, data: RepurposeContentDto): string {
    const contentText =
      typeof sourcePage.content === 'string'
        ? sourcePage.content
        : JSON.stringify(sourcePage.content);

    return `Repurpose the following content from ${sourcePage.type} to ${data.targetType}:

Original Title: ${sourcePage.title}
Original Content:
${contentText.substring(0, 4000)}

${data.additionalInstructions ? `Additional Instructions: ${data.additionalInstructions}` : ''}

Please provide a JSON response with the repurposed content in a format appropriate for ${data.targetType}:
{
  "title": "New title for the repurposed content",
  "content": "The repurposed content (as structured JSON for rich content or plain text)",
  "excerpt": "Brief summary/excerpt",
  "metaTitle": "SEO meta title",
  "metaDescription": "SEO meta description",
  "keyPoints": ["Key point 1", "Key point 2"],
  "suggestedVisuals": ["Visual suggestion 1", "Visual suggestion 2"],
  "estimatedLength": "Estimated length/duration appropriate for target type"
}`;
  }

  /**
   * Generate mock outline when AI is not available
   */
  private generateMockOutline(data: GenerateOutlineDto) {
    return {
      id: null,
      outline: {
        title: `Guide to ${data.topic}`,
        metaDescription: `Learn everything about ${data.topic}. Comprehensive guide covering key aspects and best practices.`,
        introduction: {
          hook: `Understanding ${data.topic} is essential in today's landscape.`,
          context: 'This guide will walk you through the fundamentals.',
          thesis: `By the end, you'll have a clear understanding of ${data.topic}.`,
        },
        sections: [
          {
            heading: `What is ${data.topic}?`,
            subHeadings: ['Definition', 'Key Components'],
            keyPoints: ['Define the concept', 'Explain importance'],
            targetKeywords: data.keywords.slice(0, 2),
          },
          {
            heading: `Benefits of ${data.topic}`,
            subHeadings: ['Primary Benefits', 'Secondary Benefits'],
            keyPoints: ['List main benefits', 'Provide examples'],
            targetKeywords: data.keywords.slice(0, 2),
          },
          {
            heading: `How to Implement ${data.topic}`,
            subHeadings: ['Step 1', 'Step 2', 'Step 3'],
            keyPoints: ['Provide actionable steps', 'Include tips'],
            targetKeywords: data.keywords.slice(2),
          },
        ],
        conclusion: {
          summary: 'Key takeaways from this guide',
          callToAction: 'Start implementing these strategies today',
        },
        internalLinkingSuggestions: data.keywords,
        estimatedWordCount: data.wordCount || 1500,
        estimatedReadTime: `${Math.ceil((data.wordCount || 1500) / 250)} min`,
        _note: 'This is a mock outline. Configure OpenAI API for AI-generated content.',
      },
    };
  }

  /**
   * Generate mock brief when AI is not available
   */
  private generateMockBrief(data: GenerateBriefDto) {
    return {
      id: null,
      brief: {
        title: data.title,
        objective: data.objective || 'Educate and inform the target audience',
        targetAudience: {
          demographics: data.targetAudience || 'General audience',
          painPoints: ['Need for information', 'Looking for solutions'],
          goals: ['Learn about the topic', 'Find actionable insights'],
        },
        keyMessages: data.keyMessages || ['Key message 1', 'Key message 2'],
        contentAngle: 'Educational and practical approach',
        toneAndVoice: 'Professional yet accessible',
        suggestedHeadings: [
          'Introduction',
          'Main Concept',
          'Key Benefits',
          'Implementation Guide',
          'Conclusion',
        ],
        mustInclude: ['Clear definitions', 'Practical examples', 'Actionable tips'],
        mustAvoid: ['Jargon without explanation', 'Unsubstantiated claims'],
        wordCountRecommendation: { min: 1200, max: 1800 },
        seoGuidelines: {
          primaryKeyword: data.keywords?.[0] || 'main topic',
          secondaryKeywords: data.keywords?.slice(1) || [],
          keywordDensity: '1-2%',
          metaTitleSuggestion: data.title,
          metaDescriptionSuggestion: `Learn about ${data.title}. Comprehensive guide with practical insights.`,
        },
        competitiveInsights: 'Analysis not available without AI',
        references: ['Industry publications', 'Expert sources'],
        callToAction: 'Take the next step',
        _note: 'This is a mock brief. Configure OpenAI API for AI-generated content.',
      },
    };
  }

  /**
   * Generate mock repurpose when AI is not available
   */
  private generateMockRepurpose(sourcePage: any, targetType: ContentType) {
    return {
      id: null,
      sourceTitle: sourcePage.title,
      sourceType: sourcePage.type,
      targetType,
      content: {
        title: `${sourcePage.title} (${targetType} Version)`,
        content: `This is a placeholder for repurposed content from ${sourcePage.type} to ${targetType}.`,
        excerpt: sourcePage.excerpt || 'Repurposed content excerpt',
        metaTitle: sourcePage.metaTitle || sourcePage.title,
        metaDescription: sourcePage.metaDescription || 'Repurposed content description',
        keyPoints: ['Point 1', 'Point 2', 'Point 3'],
        suggestedVisuals: ['Infographic', 'Screenshots', 'Diagrams'],
        estimatedLength: 'Varies by format',
        _note: 'This is mock repurposed content. Configure OpenAI API for AI-generated content.',
      },
    };
  }
}
