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
import { SchemaService } from '../services/schema.service';
import { GenerateSchemaDto } from '../../../common/dto';

@ApiTags('SEO - Structured Data')
@Controller('seo/schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate JSON-LD structured data',
    description: 'Generate schema.org JSON-LD structured data for various content types',
  })
  @ApiBody({ type: GenerateSchemaDto })
  @ApiResponse({ status: 200, description: 'Generated structured data' })
  @ApiResponse({ status: 400, description: 'Unsupported schema type' })
  async generateSchema(
    @Body() dto: GenerateSchemaDto,
  ): Promise<any> {
    const result = await this.schemaService.generateSchema(dto);
    return {
      success: true,
      data: result,
    };
  }

  @Get('templates')
  @ApiOperation({
    summary: 'Get schema templates',
    description: 'Get available structured data templates',
  })
  @ApiQuery({ name: 'tenantId', required: false, description: 'Filter by tenant' })
  @ApiResponse({ status: 200, description: 'List of schema templates' })
  async getSchemaTemplates(
    @Query('tenantId') tenantId?: string,
  ): Promise<any> {
    const templates = await this.schemaService.getSchemaTemplates(tenantId);
    return {
      success: true,
      data: templates,
    };
  }

  @Post('templates')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Save schema template',
    description: 'Save a custom structured data template for reuse',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Template name' },
        schemaType: { type: 'string', description: 'Schema type (e.g., Product, Article)' },
        template: { type: 'object', description: 'JSON-LD template' },
        tenantId: { type: 'string', description: 'Tenant ID (optional)' },
      },
      required: ['name', 'schemaType', 'template'],
    },
  })
  @ApiResponse({ status: 201, description: 'Template saved' })
  async saveSchemaTemplate(
    @Body('name') name: string,
    @Body('schemaType') schemaType: string,
    @Body('template') template: any,
    @Body('tenantId') tenantId?: string,
  ): Promise<any> {
    await this.schemaService.saveSchemaTemplate(name, schemaType, template, tenantId);
    return {
      success: true,
      message: 'Schema template saved',
    };
  }

  @Get('types')
  @ApiOperation({
    summary: 'Get supported schema types',
    description: 'Get a list of all supported schema.org types',
  })
  @ApiResponse({ status: 200, description: 'List of supported schema types' })
  async getSupportedTypes(): Promise<any> {
    const types = [
      { type: 'Organization', description: 'Business or organization information', category: 'business' },
      { type: 'LocalBusiness', description: 'Local business with physical location', category: 'business' },
      { type: 'Product', description: 'Product with pricing and reviews', category: 'ecommerce' },
      { type: 'Article', description: 'News or general article', category: 'content' },
      { type: 'BlogPosting', description: 'Blog post content', category: 'content' },
      { type: 'WebPage', description: 'Generic web page', category: 'content' },
      { type: 'WebSite', description: 'Website with search functionality', category: 'content' },
      { type: 'BreadcrumbList', description: 'Breadcrumb navigation', category: 'navigation' },
      { type: 'FAQPage', description: 'FAQ page with questions and answers', category: 'content' },
      { type: 'HowTo', description: 'Step-by-step instructions', category: 'content' },
      { type: 'Event', description: 'Event with date, location, and tickets', category: 'events' },
      { type: 'Person', description: 'Person profile', category: 'people' },
      { type: 'Review', description: 'Single review', category: 'reviews' },
      { type: 'AggregateRating', description: 'Aggregate rating from multiple reviews', category: 'reviews' },
      { type: 'VideoObject', description: 'Video content', category: 'media' },
      { type: 'ImageObject', description: 'Image content', category: 'media' },
      { type: 'SoftwareApplication', description: 'Software or app listing', category: 'software' },
      { type: 'Course', description: 'Educational course', category: 'education' },
      { type: 'Recipe', description: 'Recipe with ingredients and instructions', category: 'food' },
      { type: 'JobPosting', description: 'Job listing', category: 'jobs' },
    ];

    return {
      success: true,
      data: types,
      meta: {
        total: types.length,
        categories: [...new Set(types.map((t) => t.category))],
      },
    };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate structured data',
    description: 'Validate existing JSON-LD structured data',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        jsonLd: { type: 'object', description: 'JSON-LD to validate' },
      },
      required: ['jsonLd'],
    },
  })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validateSchema(
    @Body('jsonLd') jsonLd: any,
  ): Promise<any> {
    // Basic validation
    const errors: Array<{ path: string; message: string }> = [];
    const warnings: Array<{ path: string; message: string }> = [];

    if (!jsonLd['@context']) {
      errors.push({ path: '@context', message: '@context is required' });
    } else if (jsonLd['@context'] !== 'https://schema.org') {
      warnings.push({ path: '@context', message: 'Should use https://schema.org' });
    }

    if (!jsonLd['@type']) {
      errors.push({ path: '@type', message: '@type is required' });
    }

    return {
      success: true,
      data: {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
        warnings: warnings.length > 0 ? warnings : undefined,
        schemaType: jsonLd['@type'],
      },
    };
  }
}
