import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ReindexService } from '../services/reindex.service';
import { ReindexRequestDto } from '../../../common/dto';

@ApiTags('SEO - Reindex')
@Controller('seo/reindex')
export class ReindexController {
  constructor(private readonly reindexService: ReindexService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Queue sitemap refresh / reindex',
    description: 'Queue a sitemap refresh or URL reindex job. Supports single URL, bulk URLs, full site, or sitemap refresh.',
  })
  @ApiBody({ type: ReindexRequestDto })
  @ApiResponse({ status: 202, description: 'Reindex job queued' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async queueReindex(
    @Body() dto: ReindexRequestDto,
  ): Promise<any> {
    const job = await this.reindexService.queueReindex(dto);
    return {
      success: true,
      message: 'Reindex job queued',
      data: job,
    };
  }

  @Get('jobs')
  @ApiOperation({
    summary: 'List reindex jobs',
    description: 'Get a list of reindex jobs with their status',
  })
  @ApiQuery({ name: 'tenantId', required: false, description: 'Filter by tenant ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of jobs to return', type: Number })
  @ApiResponse({ status: 200, description: 'List of reindex jobs' })
  async listReindexJobs(
    @Query('tenantId') tenantId?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number,
  ): Promise<any> {
    const jobs = await this.reindexService.listReindexJobs(tenantId, status, limit);
    return { success: true, data: jobs };
  }

  @Get('jobs/:jobId')
  @ApiOperation({
    summary: 'Get reindex job status',
    description: 'Get the status and details of a specific reindex job',
  })
  @ApiParam({ name: 'jobId', description: 'Reindex job ID' })
  @ApiResponse({ status: 200, description: 'Reindex job details' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getReindexJob(
    @Param('jobId') jobId: string,
  ): Promise<any> {
    const job = await this.reindexService.getReindexJob(jobId);
    return { success: true, data: job };
  }

  @Delete('jobs/:jobId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Cancel reindex job',
    description: 'Cancel a pending or running reindex job',
  })
  @ApiParam({ name: 'jobId', description: 'Reindex job ID' })
  @ApiResponse({ status: 204, description: 'Job cancelled' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  @ApiResponse({ status: 400, description: 'Job cannot be cancelled' })
  async cancelReindexJob(
    @Param('jobId') jobId: string,
  ): Promise<void> {
    await this.reindexService.cancelReindexJob(jobId);
  }

  @Post('google-indexing')
  @ApiOperation({
    summary: 'Submit URLs to Google Indexing API',
    description: 'Submit URLs directly to Google Indexing API for faster indexing (requires API setup)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        urls: {
          type: 'array',
          items: { type: 'string' },
          description: 'URLs to submit for indexing',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Submission result' })
  async submitToGoogleIndexing(
    @Body('urls') urls: string[],
  ): Promise<any> {
    const result = await this.reindexService.submitToGoogleIndexingApi(urls);
    return { success: true, ...result };
  }

  @Post('ping')
  @ApiOperation({
    summary: 'Ping search engines',
    description: 'Notify search engines about sitemap updates',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sitemapUrl: {
          type: 'string',
          description: 'Full URL of the sitemap',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Ping result' })
  async pingSitemapUpdate(
    @Body('sitemapUrl') sitemapUrl: string,
  ): Promise<any> {
    const result = await this.reindexService.pingSitemapUpdate(sitemapUrl);
    return {
      success: true,
      message: 'Search engines notified',
      results: result,
    };
  }
}
