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
import { TopicService } from './topic.service';
import { ClusterService } from './cluster.service';
import { PerformanceService } from './performance.service';
import { AIService } from './ai.service';
import { TenantId, UserId } from '../common/decorators/tenant.decorator';
import {
  CreateTopicDto,
  UpdateTopicDto,
  TopicQueryDto,
  TopicSuggestionsDto,
  CreateClusterDto,
  UpdateClusterDto,
  ClusterQueryDto,
  AddPageToClusterDto,
  SetPillarPageDto,
  PerformanceQueryDto,
  TopPagesQueryDto,
  GenerateOutlineDto,
  GenerateBriefDto,
  RepurposeContentDto,
} from './dto/intelligence.dto';

@ApiTags('Intelligence')
@ApiBearerAuth('JWT-auth')
@Controller('content')
export class IntelligenceController {
  constructor(
    private readonly topicService: TopicService,
    private readonly clusterService: ClusterService,
    private readonly performanceService: PerformanceService,
    private readonly aiService: AIService,
  ) {}

  // =====================================
  // Topics
  // =====================================

  @Get('topics')
  @ApiOperation({ summary: 'Get topic suggestions and list topics' })
  @ApiResponse({ status: 200, description: 'List of topics' })
  async getTopics(
    @TenantId() tenantId: string,
    @Query() query: TopicQueryDto,
  ) {
    return this.topicService.findAll(tenantId, query);
  }

  @Post('topics')
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({ status: 201, description: 'Topic created' })
  async createTopic(
    @TenantId() tenantId: string,
    @Body() createDto: CreateTopicDto,
  ) {
    return this.topicService.create(tenantId, createDto);
  }

  @Get('topics/suggestions')
  @ApiOperation({ summary: 'Get AI-powered topic suggestions' })
  @ApiResponse({ status: 200, description: 'Topic suggestions' })
  async getTopicSuggestions(
    @TenantId() tenantId: string,
    @Query() query: TopicSuggestionsDto,
  ) {
    return this.topicService.getSuggestions(tenantId, {
      keywords: query.keywords,
      content: query.content,
      limit: query.limit,
    });
  }

  @Get('topics/hierarchy')
  @ApiOperation({ summary: 'Get topic hierarchy tree' })
  @ApiResponse({ status: 200, description: 'Topic hierarchy' })
  async getTopicHierarchy(@TenantId() tenantId: string) {
    return this.topicService.getHierarchy(tenantId);
  }

  @Get('topics/:id')
  @ApiOperation({ summary: 'Get topic by ID' })
  @ApiParam({ name: 'id', description: 'Topic ID' })
  @ApiResponse({ status: 200, description: 'Topic found' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async getTopic(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.topicService.findById(tenantId, id);
  }

  @Put('topics/:id')
  @ApiOperation({ summary: 'Update a topic' })
  @ApiParam({ name: 'id', description: 'Topic ID' })
  @ApiResponse({ status: 200, description: 'Topic updated' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async updateTopic(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateTopicDto,
  ) {
    return this.topicService.update(tenantId, id, updateDto);
  }

  @Delete('topics/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a topic' })
  @ApiParam({ name: 'id', description: 'Topic ID' })
  @ApiResponse({ status: 204, description: 'Topic deleted' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async deleteTopic(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.topicService.delete(tenantId, id);
  }

  // =====================================
  // Topic Clusters
  // =====================================

  @Get('clusters')
  @ApiOperation({ summary: 'Get topic clusters with pillar-page mapping' })
  @ApiResponse({ status: 200, description: 'List of clusters' })
  async getClusters(
    @TenantId() tenantId: string,
    @Query() query: ClusterQueryDto,
  ) {
    return this.clusterService.findAll(tenantId, query);
  }

  @Post('clusters')
  @ApiOperation({ summary: 'Create a new topic cluster' })
  @ApiResponse({ status: 201, description: 'Cluster created' })
  async createCluster(
    @TenantId() tenantId: string,
    @Body() createDto: CreateClusterDto,
  ) {
    return this.clusterService.create(tenantId, createDto);
  }

  @Get('clusters/:id')
  @ApiOperation({ summary: 'Get cluster by ID with all mappings' })
  @ApiParam({ name: 'id', description: 'Cluster ID' })
  @ApiResponse({ status: 200, description: 'Cluster found' })
  @ApiResponse({ status: 404, description: 'Cluster not found' })
  async getCluster(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.clusterService.findById(tenantId, id);
  }

  @Put('clusters/:id')
  @ApiOperation({ summary: 'Update a cluster' })
  @ApiParam({ name: 'id', description: 'Cluster ID' })
  @ApiResponse({ status: 200, description: 'Cluster updated' })
  @ApiResponse({ status: 404, description: 'Cluster not found' })
  async updateCluster(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateClusterDto,
  ) {
    return this.clusterService.update(tenantId, id, updateDto);
  }

  @Delete('clusters/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a cluster' })
  @ApiParam({ name: 'id', description: 'Cluster ID' })
  @ApiResponse({ status: 204, description: 'Cluster deleted' })
  @ApiResponse({ status: 404, description: 'Cluster not found' })
  async deleteCluster(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.clusterService.delete(tenantId, id);
  }

  @Post('clusters/:id/pages')
  @ApiOperation({ summary: 'Add a page to a cluster' })
  @ApiParam({ name: 'id', description: 'Cluster ID' })
  @ApiResponse({ status: 200, description: 'Page added to cluster' })
  async addPageToCluster(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddPageToClusterDto,
  ) {
    return this.clusterService.addPageToCluster(
      tenantId,
      id,
      dto.pageId,
      dto.type,
      dto.position,
    );
  }

  @Delete('clusters/:id/pages/:pageId')
  @ApiOperation({ summary: 'Remove a page from a cluster' })
  @ApiParam({ name: 'id', description: 'Cluster ID' })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  @ApiResponse({ status: 200, description: 'Page removed from cluster' })
  async removePageFromCluster(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('pageId', ParseUUIDPipe) pageId: string,
  ) {
    return this.clusterService.removePageFromCluster(tenantId, id, pageId);
  }

  @Post('clusters/:id/pillar')
  @ApiOperation({ summary: 'Set pillar page for a cluster' })
  @ApiParam({ name: 'id', description: 'Cluster ID' })
  @ApiResponse({ status: 200, description: 'Pillar page set' })
  async setPillarPage(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SetPillarPageDto,
  ) {
    return this.clusterService.setPillarPage(tenantId, id, dto.pageId);
  }

  @Get('clusters/:id/visualization')
  @ApiOperation({ summary: 'Get cluster visualization data' })
  @ApiParam({ name: 'id', description: 'Cluster ID' })
  @ApiResponse({ status: 200, description: 'Visualization data' })
  async getClusterVisualization(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.clusterService.getVisualizationData(tenantId, id);
  }

  // =====================================
  // Performance Analytics
  // =====================================

  @Get('performance')
  @ApiOperation({ summary: 'Get content performance metrics' })
  @ApiResponse({ status: 200, description: 'Performance data' })
  async getPerformance(
    @TenantId() tenantId: string,
    @Query() query: PerformanceQueryDto,
  ) {
    return this.performanceService.getPerformance(tenantId, {
      pageId: query.pageId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      groupBy: query.groupBy,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get('performance/summary')
  @ApiOperation({ summary: 'Get performance summary for tenant' })
  @ApiResponse({ status: 200, description: 'Performance summary' })
  async getPerformanceSummary(
    @TenantId() tenantId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.performanceService.getPerformanceSummary(tenantId, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('performance/top')
  @ApiOperation({ summary: 'Get top performing pages' })
  @ApiResponse({ status: 200, description: 'Top pages' })
  async getTopPages(
    @TenantId() tenantId: string,
    @Query() query: TopPagesQueryDto,
  ) {
    return this.performanceService.getTopPages(tenantId, {
      metric: query.metric,
      limit: query.limit,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });
  }

  // =====================================
  // AI-Assisted Content Generation
  // =====================================

  @Post('outline/generate')
  @ApiOperation({ summary: 'Generate AI-assisted content outline' })
  @ApiResponse({ status: 201, description: 'Outline generated' })
  async generateOutline(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() dto: GenerateOutlineDto,
  ) {
    return this.aiService.generateOutline(tenantId, userId, {
      topic: dto.topic,
      keywords: dto.keywords,
      targetAudience: dto.targetAudience,
      contentType: dto.contentType as any,
      wordCount: dto.wordCount,
      tone: dto.tone,
    });
  }

  @Post('brief/generate')
  @ApiOperation({ summary: 'Generate AI-assisted content brief' })
  @ApiResponse({ status: 201, description: 'Brief generated' })
  async generateBrief(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() dto: GenerateBriefDto,
  ) {
    return this.aiService.generateBrief(tenantId, userId, {
      title: dto.title,
      objective: dto.objective,
      targetAudience: dto.targetAudience,
      keyMessages: dto.keyMessages,
      keywords: dto.keywords,
      competitorUrls: dto.competitorUrls,
      contentType: dto.contentType as any,
    });
  }

  @Post('repurpose')
  @ApiOperation({ summary: 'Repurpose content for different format' })
  @ApiResponse({ status: 201, description: 'Content repurposed' })
  async repurposeContent(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() dto: RepurposeContentDto,
  ) {
    return this.aiService.repurposeContent(tenantId, userId, {
      sourcePageId: dto.sourcePageId,
      targetType: dto.targetType as any,
      additionalInstructions: dto.additionalInstructions,
    });
  }
}
