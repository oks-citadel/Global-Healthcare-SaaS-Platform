import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContentService } from './content.service';
import { VersionService } from './version.service';
import { PublishService } from './publish.service';
import { TenantId, UserId } from '../common/decorators/tenant.decorator';
import {
  CreateContentPageDto,
  UpdateContentPageDto,
  ContentPageQueryDto,
  PublishContentDto,
  ScheduleContentDto,
  SaveDraftDto,
  VersionQueryDto,
  RestoreVersionDto,
  CompareVersionsDto,
} from './dto/content.dto';

@ApiTags('Content')
@ApiBearerAuth('JWT-auth')
@Controller('content')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly versionService: VersionService,
    private readonly publishService: PublishService,
  ) {}

  // =====================================
  // Content Pages - CRUD Operations
  // =====================================

  @Post('pages')
  @ApiOperation({ summary: 'Create a new content page' })
  @ApiResponse({ status: 201, description: 'Page created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async createPage(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() createDto: CreateContentPageDto,
  ) {
    return this.contentService.create(tenantId, userId, createDto);
  }

  @Get('pages')
  @ApiOperation({ summary: 'List all content pages with filtering' })
  @ApiResponse({ status: 200, description: 'List of pages' })
  async listPages(
    @TenantId() tenantId: string,
    @Query() query: ContentPageQueryDto,
  ) {
    return this.contentService.findAll(tenantId, query);
  }

  @Get('pages/:id')
  @ApiOperation({ summary: 'Get a content page by ID' })
  @ApiParam({ name: 'id', description: 'Page ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Page found' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async getPageById(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.contentService.findById(tenantId, id);
  }

  @Get('pages/slug/:slug')
  @ApiOperation({ summary: 'Get a content page by slug' })
  @ApiParam({ name: 'slug', description: 'Page slug' })
  @ApiResponse({ status: 200, description: 'Page found' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async getPageBySlug(
    @TenantId() tenantId: string,
    @Param('slug') slug: string,
  ) {
    return this.contentService.findBySlug(tenantId, slug);
  }

  @Put('pages/:id')
  @ApiOperation({ summary: 'Update a content page' })
  @ApiParam({ name: 'id', description: 'Page ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Page updated successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async updatePage(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateContentPageDto,
  ) {
    return this.contentService.update(tenantId, id, userId, updateDto);
  }

  @Delete('pages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a content page (soft delete)' })
  @ApiParam({ name: 'id', description: 'Page ID (UUID)' })
  @ApiResponse({ status: 204, description: 'Page deleted successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async deletePage(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.contentService.delete(tenantId, id, userId);
  }

  // =====================================
  // Publishing Operations
  // =====================================

  @Post('publish')
  @ApiOperation({ summary: 'Publish content immediately' })
  @ApiResponse({ status: 200, description: 'Content published' })
  @ApiResponse({ status: 400, description: 'Invalid content for publishing' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async publishContent(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() publishDto: PublishContentDto,
  ) {
    return this.publishService.publish(tenantId, publishDto.pageId, userId);
  }

  @Post('schedule')
  @ApiOperation({ summary: 'Schedule content for future publishing' })
  @ApiResponse({ status: 200, description: 'Content scheduled' })
  @ApiResponse({ status: 400, description: 'Invalid schedule date' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async scheduleContent(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() scheduleDto: ScheduleContentDto,
  ) {
    return this.publishService.schedule(
      tenantId,
      scheduleDto.pageId,
      new Date(scheduleDto.scheduledAt),
      userId,
    );
  }

  @Post('draft')
  @ApiOperation({ summary: 'Save content as draft' })
  @ApiResponse({ status: 200, description: 'Draft saved' })
  @ApiResponse({ status: 201, description: 'New draft created' })
  async saveDraft(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() draftDto: SaveDraftDto,
  ) {
    return this.publishService.saveDraft(tenantId, userId, {
      pageId: draftDto.pageId,
      title: draftDto.title,
      content: draftDto.content,
      excerpt: draftDto.excerpt,
    });
  }

  @Post('unpublish/:id')
  @ApiOperation({ summary: 'Unpublish content' })
  @ApiParam({ name: 'id', description: 'Page ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Content unpublished' })
  @ApiResponse({ status: 400, description: 'Page is not published' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async unpublishContent(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.publishService.unpublish(tenantId, id, userId);
  }

  @Post('archive/:id')
  @ApiOperation({ summary: 'Archive content' })
  @ApiParam({ name: 'id', description: 'Page ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Content archived' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async archiveContent(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.publishService.archive(tenantId, id, userId);
  }

  @Post('cancel-schedule/:id')
  @ApiOperation({ summary: 'Cancel scheduled publishing' })
  @ApiParam({ name: 'id', description: 'Page ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Schedule cancelled' })
  @ApiResponse({ status: 400, description: 'Page is not scheduled' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  async cancelSchedule(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.publishService.cancelSchedule(tenantId, id, userId);
  }

  // =====================================
  // Version History
  // =====================================

  @Get('versions/:id')
  @ApiOperation({ summary: 'Get version history for a page' })
  @ApiParam({ name: 'id', description: 'Page ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Version history' })
  async getVersionHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: VersionQueryDto,
  ) {
    return this.versionService.getVersionHistory(id, query.page, query.limit);
  }

  @Get('versions/:id/:versionNumber')
  @ApiOperation({ summary: 'Get a specific version' })
  @ApiParam({ name: 'id', description: 'Page ID (UUID)' })
  @ApiParam({ name: 'versionNumber', description: 'Version number' })
  @ApiResponse({ status: 200, description: 'Version details' })
  @ApiResponse({ status: 404, description: 'Version not found' })
  async getVersion(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('versionNumber') versionNumber: number,
  ) {
    return this.versionService.getVersion(id, Number(versionNumber));
  }

  @Post('versions/:id/restore')
  @ApiOperation({ summary: 'Restore page to a specific version' })
  @ApiParam({ name: 'id', description: 'Page ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Page restored' })
  @ApiResponse({ status: 404, description: 'Version not found' })
  async restoreVersion(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() restoreDto: RestoreVersionDto,
  ) {
    return this.versionService.restoreVersion(
      id,
      restoreDto.versionNumber,
      userId,
    );
  }

  @Post('versions/:id/compare')
  @ApiOperation({ summary: 'Compare two versions' })
  @ApiParam({ name: 'id', description: 'Page ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Version comparison' })
  async compareVersions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() compareDto: CompareVersionsDto,
  ) {
    return this.versionService.compareVersions(
      id,
      compareDto.versionA,
      compareDto.versionB,
    );
  }

  // =====================================
  // Search
  // =====================================

  @Get('search')
  @ApiOperation({ summary: 'Full-text search content pages' })
  @ApiResponse({ status: 200, description: 'Search results' })
  async searchPages(
    @TenantId() tenantId: string,
    @Query('q') query: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.contentService.searchPages(tenantId, query, {
      type,
      status,
      page: page || 1,
      limit: limit || 10,
    });
  }
}
