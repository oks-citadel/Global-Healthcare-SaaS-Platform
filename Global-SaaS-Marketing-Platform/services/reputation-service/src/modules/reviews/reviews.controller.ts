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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
  RespondToReviewDto,
  ReviewQueryDto,
  ReviewResponseDto,
  ReviewListResponseDto,
} from './dto/review.dto';

@ApiTags('reviews')
@ApiBearerAuth()
@Controller('reputation/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new review',
    description: 'Add a new customer review from any source.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: ReviewResponseDto,
  })
  async createReview(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.createReview(tenantId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get reviews',
    description: 'Retrieve reviews with filtering and pagination.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
    type: ReviewListResponseDto,
  })
  async getReviews(
    @Headers('x-tenant-id') tenantId: string,
    @Query() query: ReviewQueryDto,
  ): Promise<ReviewListResponseDto> {
    return this.reviewsService.getReviews(tenantId, query);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get review statistics',
    description: 'Get aggregate statistics for reviews.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Review statistics retrieved',
  })
  async getReviewStats(
    @Headers('x-tenant-id') tenantId: string,
    @Query('source') source?: string,
  ) {
    return this.reviewsService.getReviewStats(tenantId, source);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get review by ID',
    description: 'Retrieve a specific review by its ID.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Review identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Review retrieved successfully',
    type: ReviewResponseDto,
  })
  async getReviewById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.getReviewById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update review',
    description: 'Update review properties like visibility and tags.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Review identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: ReviewResponseDto,
  })
  async updateReview(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.updateReview(tenantId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete review',
    description: 'Delete a review.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Review identifier',
  })
  @ApiResponse({
    status: 204,
    description: 'Review deleted successfully',
  })
  async deleteReview(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.reviewsService.deleteReview(tenantId, id);
  }

  @Post(':id/respond')
  @ApiOperation({
    summary: 'Respond to review',
    description: 'Add a response to a customer review.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Review identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Response added successfully',
    type: ReviewResponseDto,
  })
  async respondToReview(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: RespondToReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.respondToReview(tenantId, id, dto);
  }
}
