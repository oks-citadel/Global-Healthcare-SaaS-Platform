import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { ContentService } from './content.service';
import {
  ContentGenerationRequestDto,
  ContentGenerationResponseDto,
  ContentOptimizationRequestDto,
  ContentOptimizationResponseDto,
} from './dto/content-generation.dto';

@ApiTags('content')
@ApiBearerAuth()
@Controller('ai/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate AI content',
    description:
      'Generate marketing content using AI including blog posts, emails, social posts, ad copy, and more.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Content generated successfully',
    type: ContentGenerationResponseDto,
  })
  async generateContent(
    @Headers('x-tenant-id') tenantId: string,
    @Body() request: ContentGenerationRequestDto,
  ): Promise<ContentGenerationResponseDto> {
    return this.contentService.generateContent(tenantId, request);
  }

  @Post('optimize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Optimize existing content',
    description:
      'Optimize content for SEO, readability, engagement, conversion, tone, or grammar.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Content optimized successfully',
    type: ContentOptimizationResponseDto,
  })
  async optimizeContent(
    @Headers('x-tenant-id') tenantId: string,
    @Body() request: ContentOptimizationRequestDto,
  ): Promise<ContentOptimizationResponseDto> {
    return this.contentService.optimizeContent(tenantId, request);
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get content generation history',
    description: 'Retrieve previously generated content.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of records',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Content history retrieved',
    type: [ContentGenerationResponseDto],
  })
  async getContentHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Query('limit') limit?: number,
  ): Promise<ContentGenerationResponseDto[]> {
    return this.contentService.getGeneratedContentHistory(tenantId, limit);
  }
}
