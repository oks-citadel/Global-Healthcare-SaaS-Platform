import {
  Controller,
  Post,
  Delete,
  Get,
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
import { ReactionsService } from './reactions.service';

@ApiTags('Community - Reactions')
@ApiBearerAuth()
@ApiHeader({ name: 'x-tenant-id', required: true, description: 'Tenant ID' })
@Controller('community/reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Add reaction to content' })
  @ApiResponse({ status: 201, description: 'Reaction added successfully' })
  async addReaction(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: {
      targetType: 'post' | 'comment';
      targetId: string;
      userId: string;
      reactionType: string;
    },
  ) {
    return this.reactionsService.addReaction(tenantId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a reaction' })
  @ApiParam({ name: 'id', description: 'Reaction ID' })
  @ApiResponse({ status: 200, description: 'Reaction removed successfully' })
  async removeReaction(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.reactionsService.removeReaction(tenantId, id);
  }

  @Get()
  @ApiOperation({ summary: 'Get reactions for content' })
  @ApiQuery({ name: 'targetType', required: true, enum: ['post', 'comment'] })
  @ApiQuery({ name: 'targetId', required: true })
  @ApiResponse({ status: 200, description: 'Reactions retrieved successfully' })
  async getReactions(
    @Headers('x-tenant-id') tenantId: string,
    @Query('targetType') targetType: 'post' | 'comment',
    @Query('targetId') targetId: string,
  ) {
    return this.reactionsService.getReactions(tenantId, targetType, targetId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get reaction summary for content' })
  @ApiQuery({ name: 'targetType', required: true, enum: ['post', 'comment'] })
  @ApiQuery({ name: 'targetId', required: true })
  @ApiResponse({ status: 200, description: 'Reaction summary retrieved' })
  async getReactionSummary(
    @Headers('x-tenant-id') tenantId: string,
    @Query('targetType') targetType: 'post' | 'comment',
    @Query('targetId') targetId: string,
  ) {
    return this.reactionsService.getReactionSummary(tenantId, targetType, targetId);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get available reaction types' })
  @ApiResponse({ status: 200, description: 'Reaction types retrieved' })
  async getReactionTypes() {
    return this.reactionsService.getReactionTypes();
  }
}
