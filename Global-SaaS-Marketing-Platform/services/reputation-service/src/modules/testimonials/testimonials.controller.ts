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
  ApiQuery,
} from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
  ApproveTestimonialDto,
  TestimonialResponseDto,
  TestimonialListResponseDto,
} from './dto/testimonial.dto';

@ApiTags('testimonials')
@ApiBearerAuth()
@Controller('reputation/testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @ApiOperation({
    summary: 'Submit a testimonial',
    description: 'Submit a new customer testimonial for approval.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Testimonial submitted successfully',
    type: TestimonialResponseDto,
  })
  async createTestimonial(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateTestimonialDto,
  ): Promise<TestimonialResponseDto> {
    return this.testimonialsService.createTestimonial(tenantId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get testimonials',
    description: 'Retrieve testimonials with optional filtering.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiQuery({ name: 'isApproved', required: false, type: Boolean })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Testimonials retrieved successfully',
    type: TestimonialListResponseDto,
  })
  async getTestimonials(
    @Headers('x-tenant-id') tenantId: string,
    @Query('isApproved') isApproved?: boolean,
    @Query('isFeatured') isFeatured?: boolean,
    @Query('category') category?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<TestimonialListResponseDto> {
    return this.testimonialsService.getTestimonials(tenantId, {
      isApproved,
      isFeatured,
      category,
      limit,
      offset,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get testimonial by ID',
    description: 'Retrieve a specific testimonial.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({ name: 'id', description: 'Testimonial identifier' })
  @ApiResponse({
    status: 200,
    description: 'Testimonial retrieved successfully',
    type: TestimonialResponseDto,
  })
  async getTestimonialById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ): Promise<TestimonialResponseDto> {
    return this.testimonialsService.getTestimonialById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update testimonial',
    description: 'Update testimonial details.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({ name: 'id', description: 'Testimonial identifier' })
  @ApiResponse({
    status: 200,
    description: 'Testimonial updated successfully',
    type: TestimonialResponseDto,
  })
  async updateTestimonial(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateTestimonialDto,
  ): Promise<TestimonialResponseDto> {
    return this.testimonialsService.updateTestimonial(tenantId, id, dto);
  }

  @Post(':id/approve')
  @ApiOperation({
    summary: 'Approve testimonial',
    description: 'Approve a testimonial for public display.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({ name: 'id', description: 'Testimonial identifier' })
  @ApiResponse({
    status: 200,
    description: 'Testimonial approved successfully',
    type: TestimonialResponseDto,
  })
  async approveTestimonial(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: ApproveTestimonialDto,
  ): Promise<TestimonialResponseDto> {
    return this.testimonialsService.approveTestimonial(tenantId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete testimonial',
    description: 'Delete a testimonial.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({ name: 'id', description: 'Testimonial identifier' })
  @ApiResponse({
    status: 204,
    description: 'Testimonial deleted successfully',
  })
  async deleteTestimonial(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.testimonialsService.deleteTestimonial(tenantId, id);
  }
}
