import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
  PostResponseDto,
  TrendingQueryDto,
} from './dto';

@ApiTags('Community - Posts')
@ApiBearerAuth()
@ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
@Controller('community')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('posts')
  @ApiOperation({ summary: 'Create a new community post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  async createPost(
    @Headers('x-tenant-id') tenantId: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.postsService.createPost(tenantId, createPostDto);
  }

  @Get('posts')
  @ApiOperation({ summary: 'List community posts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'authorId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ['published', 'draft', 'archived'] })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  async getPosts(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: PostQueryDto,
  ): Promise<{ data: PostResponseDto[]; pagination: any }> {
    return this.postsService.getPosts(tenantId, query);
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Get a community post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPost(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ): Promise<PostResponseDto> {
    return this.postsService.getPost(tenantId, id);
  }

  @Put('posts/:id')
  @ApiOperation({ summary: 'Update a community post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async updatePost(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postsService.updatePost(tenantId, id, updatePostDto);
  }

  @Delete('posts/:id')
  @ApiOperation({ summary: 'Delete a community post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async deletePost(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.postsService.deletePost(tenantId, id);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending topics and posts' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'period', required: false, enum: ['day', 'week', 'month'] })
  @ApiResponse({ status: 200, description: 'Trending content retrieved successfully' })
  async getTrending(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: TrendingQueryDto,
  ): Promise<{ topics: any[]; posts: PostResponseDto[] }> {
    return this.postsService.getTrending(tenantId, query);
  }
}
