import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { KeywordsService } from '../services/keywords.service';
import { KeywordResearchDto } from '../../../common/dto';

@ApiTags('SEO - Keywords')
@Controller('seo/keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post('research')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Keyword research',
    description: 'Research keywords with search volume, intent analysis, related keywords, and SERP features',
  })
  @ApiBody({ type: KeywordResearchDto })
  @ApiResponse({ status: 200, description: 'Keyword research results' })
  async researchKeywords(
    @Body() dto: KeywordResearchDto,
  ): Promise<any> {
    const results = await this.keywordsService.researchKeywords(dto);
    return {
      success: true,
      data: results,
      meta: {
        total: results.length,
        locale: dto.locale || 'en',
      },
    };
  }

  @Get('suggestions')
  @ApiOperation({
    summary: 'Get keyword suggestions',
    description: 'Get keyword suggestions based on existing content and SEO data',
  })
  @ApiQuery({ name: 'tenantId', required: true, description: 'Tenant ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max suggestions' })
  @ApiResponse({ status: 200, description: 'Keyword suggestions' })
  async getKeywordSuggestions(
    @Query('tenantId') tenantId: string,
    @Query('limit') limit?: number,
  ): Promise<any> {
    const suggestions = await this.keywordsService.suggestKeywords(tenantId, limit);
    return {
      success: true,
      data: suggestions,
    };
  }

  @Post('track')
  @ApiOperation({
    summary: 'Track keyword ranking',
    description: 'Track and update keyword ranking position',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        keyword: { type: 'string' },
        tenantId: { type: 'string' },
        locale: { type: 'string', default: 'en' },
        currentRank: { type: 'number' },
      },
      required: ['keyword', 'tenantId', 'currentRank'],
    },
  })
  @ApiResponse({ status: 200, description: 'Ranking tracked' })
  async trackRanking(
    @Body('keyword') keyword: string,
    @Body('tenantId') tenantId: string,
    @Body('locale') locale: string = 'en',
    @Body('currentRank') currentRank: number,
  ): Promise<any> {
    await this.keywordsService.trackKeywordRanking(
      keyword,
      tenantId,
      locale,
      currentRank,
    );
    return {
      success: true,
      message: 'Keyword ranking tracked',
    };
  }
}
