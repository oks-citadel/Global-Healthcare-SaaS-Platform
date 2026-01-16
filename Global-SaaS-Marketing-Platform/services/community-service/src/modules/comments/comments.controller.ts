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
import { CommentsService } from './comments.service';

@ApiTags('Community - Comments')
@ApiBearerAuth()
@ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
@Controller('community/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  async createComment(
    @Headers('x-tenant-id') tenantId: string,
    @Body() createCommentDto: {
      postId: string;
      authorId: string;
      content: string;
      parentId?: string;
    },
  ) {
    return this.commentsService.createComment(tenantId, createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'List comments' })
  @ApiQuery({ name: 'postId', required: true, description: 'Post ID to get comments for' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
  async getComments(
    @Headers('x-tenant-id') tenantId: string,
    @Query('postId') postId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.commentsService.getComments(tenantId, postId, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment retrieved successfully' })
  async getComment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.commentsService.getComment(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  async updateComment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() updateCommentDto: { content: string },
  ) {
    return this.commentsService.updateComment(tenantId, id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  async deleteComment(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.commentsService.deleteComment(tenantId, id);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get replies to a comment' })
  @ApiParam({ name: 'id', description: 'Parent comment ID' })
  @ApiResponse({ status: 200, description: 'Replies retrieved successfully' })
  async getReplies(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.commentsService.getReplies(tenantId, id, { page, limit });
  }
}
