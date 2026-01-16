import {
  Controller,
  Get,
  Put,
  Param,
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
  ApiParam,
} from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import {
  GrowthRecommendationQueryDto,
  GrowthRecommendationsListResponseDto,
  GrowthRecommendationResponseDto,
  UpdateRecommendationStatusDto,
} from './dto/growth-recommendation.dto';

@ApiTags('recommendations')
@ApiBearerAuth()
@Controller('ai/recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('growth')
  @ApiOperation({
    summary: 'Get growth recommendations',
    description:
      'AI-generated growth recommendations across AARRR funnel stages with actionable insights.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Growth recommendations retrieved',
    type: GrowthRecommendationsListResponseDto,
  })
  async getGrowthRecommendations(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: GrowthRecommendationQueryDto,
  ): Promise<GrowthRecommendationsListResponseDto> {
    return this.recommendationsService.getGrowthRecommendations(tenantId, query);
  }

  @Get('growth/:id')
  @ApiOperation({
    summary: 'Get recommendation by ID',
    description: 'Retrieve a specific growth recommendation.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Recommendation identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Recommendation retrieved',
    type: GrowthRecommendationResponseDto,
  })
  async getRecommendationById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ): Promise<GrowthRecommendationResponseDto> {
    return this.recommendationsService.getRecommendationById(tenantId, id);
  }

  @Put('growth/:id/status')
  @ApiOperation({
    summary: 'Update recommendation status',
    description: 'Update the status of a growth recommendation.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Recommendation identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Status updated',
    type: GrowthRecommendationResponseDto,
  })
  async updateRecommendationStatus(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() update: UpdateRecommendationStatusDto,
  ): Promise<GrowthRecommendationResponseDto> {
    return this.recommendationsService.updateRecommendationStatus(
      tenantId,
      id,
      update,
    );
  }
}
