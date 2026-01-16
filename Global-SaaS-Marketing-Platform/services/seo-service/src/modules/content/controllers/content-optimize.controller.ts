import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ContentOptimizeService } from '../services/content-optimize.service';
import { ContentOptimizeDto } from '../../../common/dto';

@ApiTags('SEO - Content Optimization')
@Controller('seo/content')
export class ContentOptimizeController {
  constructor(private readonly contentOptimizeService: ContentOptimizeService) {}

  @Post('optimize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Optimize content',
    description: 'Analyze content and get on-page scoring with NLP suggestions for optimization',
  })
  @ApiBody({ type: ContentOptimizeDto })
  @ApiResponse({ status: 200, description: 'Content optimization results' })
  @ApiResponse({ status: 400, description: 'Invalid input - must provide URL or content' })
  async optimizeContent(
    @Body() dto: ContentOptimizeDto,
  ): Promise<any> {
    const result = await this.contentOptimizeService.optimizeContent(dto);
    return {
      success: true,
      data: result,
    };
  }

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Analyze content (alias)',
    description: 'Alias for content optimization - analyze content for SEO improvements',
  })
  @ApiBody({ type: ContentOptimizeDto })
  @ApiResponse({ status: 200, description: 'Content analysis results' })
  async analyzeContent(
    @Body() dto: ContentOptimizeDto,
  ): Promise<any> {
    return this.optimizeContent(dto);
  }

  @Post('readability')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check readability',
    description: 'Analyze content readability metrics (Flesch-Kincaid, sentence length, etc.)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Text content to analyze' },
        url: { type: 'string', description: 'URL to fetch and analyze' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Readability analysis' })
  async checkReadability(
    @Body('content') content?: string,
    @Body('url') url?: string,
  ): Promise<any> {
    const result = await this.contentOptimizeService.optimizeContent({
      content,
      url,
      analyzeReadability: true,
      analyzeKeywords: false,
      analyzeStructure: false,
      generateSuggestions: false,
    });

    return {
      success: true,
      data: {
        readabilityScore: result.readabilityScore,
        metrics: result.readabilityMetrics,
      },
    };
  }

  @Post('keyword-check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check keyword usage',
    description: 'Analyze keyword density and placement in content',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Text content to analyze' },
        url: { type: 'string', description: 'URL to fetch and analyze' },
        targetKeyword: { type: 'string', description: 'Target keyword to check' },
      },
      required: ['targetKeyword'],
    },
  })
  @ApiResponse({ status: 200, description: 'Keyword analysis' })
  async checkKeywordUsage(
    @Body('content') content?: string,
    @Body('url') url?: string,
    @Body('targetKeyword') targetKeyword?: string,
  ): Promise<any> {
    const result = await this.contentOptimizeService.optimizeContent({
      content,
      url,
      targetKeyword,
      analyzeReadability: false,
      analyzeKeywords: true,
      analyzeStructure: false,
      generateSuggestions: true,
    });

    return {
      success: true,
      data: {
        keywordScore: result.keywordScore,
        analysis: result.keywordAnalysis,
        suggestions: result.suggestions?.filter((s) => s.type.includes('keyword')),
      },
    };
  }
}
