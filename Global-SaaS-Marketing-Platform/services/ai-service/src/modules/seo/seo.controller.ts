import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { SeoService } from './seo.service';
import {
  SeoOpportunityQueryDto,
  SeoOpportunitiesListResponseDto,
  KeywordGapAnalysisDto,
  KeywordGapResponseDto,
} from './dto/seo-opportunity.dto';

@ApiTags('seo')
@ApiBearerAuth()
@Controller('ai/seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('opportunities')
  @ApiOperation({
    summary: 'Discover SEO opportunities',
    description:
      'Uses AI to discover keyword opportunities based on industry, competitors, and seed keywords.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'SEO opportunities discovered',
    type: SeoOpportunitiesListResponseDto,
  })
  async discoverOpportunities(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: SeoOpportunityQueryDto,
  ): Promise<SeoOpportunitiesListResponseDto> {
    return this.seoService.discoverOpportunities(tenantId, query);
  }

  @Get('opportunities/stored')
  @ApiOperation({
    summary: 'Get stored SEO opportunities',
    description: 'Retrieve previously discovered and stored SEO opportunities.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Stored opportunities retrieved',
    type: SeoOpportunitiesListResponseDto,
  })
  async getStoredOpportunities(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: SeoOpportunityQueryDto,
  ): Promise<SeoOpportunitiesListResponseDto> {
    return this.seoService.getStoredOpportunities(tenantId, query);
  }

  @Post('keyword-gap')
  @ApiOperation({
    summary: 'Analyze keyword gap',
    description:
      'Compare your domain against competitors to find keyword opportunities.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Keyword gap analysis complete',
    type: KeywordGapResponseDto,
  })
  async analyzeKeywordGap(
    @Headers('x-tenant-id') tenantId: string,
    @Body() analysis: KeywordGapAnalysisDto,
  ): Promise<KeywordGapResponseDto> {
    return this.seoService.analyzeKeywordGap(tenantId, analysis);
  }
}
