import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import {
  CreateTestimonialDto,
  UpdateTestimonialDto,
  ApproveTestimonialDto,
  TestimonialResponseDto,
  TestimonialListResponseDto,
} from './dto/testimonial.dto';

@Injectable()
export class TestimonialsService {
  private readonly logger = new Logger(TestimonialsService.name);
  private readonly CACHE_TTL = 300;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createTestimonial(
    tenantId: string,
    dto: CreateTestimonialDto,
  ): Promise<TestimonialResponseDto> {
    const testimonial = await this.prisma.testimonial.create({
      data: {
        tenantId,
        customerId: dto.customerId,
        customerName: dto.customerName,
        customerTitle: dto.customerTitle,
        customerCompany: dto.customerCompany,
        customerPhoto: dto.customerPhoto,
        content: dto.content,
        videoUrl: dto.videoUrl,
        rating: dto.rating,
        category: dto.category,
        tags: dto.tags || [],
        metadata: dto.metadata || {},
      },
    });

    await this.redis.invalidatePattern(`testimonials:${tenantId}:*`);

    return this.mapToResponse(testimonial);
  }

  async getTestimonials(
    tenantId: string,
    options: {
      isApproved?: boolean;
      isFeatured?: boolean;
      category?: string;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<TestimonialListResponseDto> {
    const cacheKey = `testimonials:${tenantId}:${JSON.stringify(options)}`;
    const cached = await this.redis.get<TestimonialListResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const where: Record<string, unknown> = { tenantId };
    if (options.isApproved !== undefined) where.isApproved = options.isApproved;
    if (options.isFeatured !== undefined) where.isFeatured = options.isFeatured;
    if (options.category) where.category = options.category;

    const [testimonials, total] = await Promise.all([
      this.prisma.testimonial.findMany({
        where,
        orderBy: [{ displayOrder: 'asc' }, { submittedAt: 'desc' }],
        skip: options.offset || 0,
        take: options.limit || 20,
      }),
      this.prisma.testimonial.count({ where }),
    ]);

    const response: TestimonialListResponseDto = {
      testimonials: testimonials.map((t) => this.mapToResponse(t)),
      total,
    };

    await this.redis.set(cacheKey, response, this.CACHE_TTL);

    return response;
  }

  async getTestimonialById(
    tenantId: string,
    testimonialId: string,
  ): Promise<TestimonialResponseDto> {
    const testimonial = await this.prisma.testimonial.findFirst({
      where: { id: testimonialId, tenantId },
    });

    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }

    return this.mapToResponse(testimonial);
  }

  async updateTestimonial(
    tenantId: string,
    testimonialId: string,
    dto: UpdateTestimonialDto,
  ): Promise<TestimonialResponseDto> {
    const testimonial = await this.prisma.testimonial.update({
      where: { id: testimonialId, tenantId },
      data: dto,
    });

    await this.redis.invalidatePattern(`testimonials:${tenantId}:*`);

    return this.mapToResponse(testimonial);
  }

  async approveTestimonial(
    tenantId: string,
    testimonialId: string,
    dto: ApproveTestimonialDto,
  ): Promise<TestimonialResponseDto> {
    const testimonial = await this.prisma.testimonial.update({
      where: { id: testimonialId, tenantId },
      data: {
        isApproved: true,
        approvedBy: dto.approvedBy,
        approvedAt: new Date(),
      },
    });

    await this.redis.invalidatePattern(`testimonials:${tenantId}:*`);

    return this.mapToResponse(testimonial);
  }

  async deleteTestimonial(
    tenantId: string,
    testimonialId: string,
  ): Promise<void> {
    await this.prisma.testimonial.delete({
      where: { id: testimonialId, tenantId },
    });

    await this.redis.invalidatePattern(`testimonials:${tenantId}:*`);
  }

  private mapToResponse(testimonial: {
    id: string;
    customerId: string | null;
    customerName: string;
    customerTitle: string | null;
    customerCompany: string | null;
    customerPhoto: string | null;
    content: string;
    videoUrl: string | null;
    rating: number | null;
    category: string | null;
    tags: unknown;
    isApproved: boolean;
    approvedBy: string | null;
    approvedAt: Date | null;
    isFeatured: boolean;
    displayOrder: number;
    submittedAt: Date;
  }): TestimonialResponseDto {
    return {
      id: testimonial.id,
      customerId: testimonial.customerId,
      customerName: testimonial.customerName,
      customerTitle: testimonial.customerTitle,
      customerCompany: testimonial.customerCompany,
      customerPhoto: testimonial.customerPhoto,
      content: testimonial.content,
      videoUrl: testimonial.videoUrl,
      rating: testimonial.rating,
      category: testimonial.category,
      tags: testimonial.tags as string[],
      isApproved: testimonial.isApproved,
      approvedBy: testimonial.approvedBy,
      approvedAt: testimonial.approvedAt,
      isFeatured: testimonial.isFeatured,
      displayOrder: testimonial.displayOrder,
      submittedAt: testimonial.submittedAt,
    };
  }
}
