import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
  IsUrl,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateTestimonialDto {
  @ApiPropertyOptional({ description: 'Customer ID' })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ description: 'Customer name' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  customerName: string;

  @ApiPropertyOptional({ description: 'Customer title/position' })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  customerTitle?: string;

  @ApiPropertyOptional({ description: 'Customer company' })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  customerCompany?: string;

  @ApiPropertyOptional({ description: 'Customer photo URL' })
  @IsUrl()
  @IsOptional()
  customerPhoto?: string;

  @ApiProperty({ description: 'Testimonial content' })
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content: string;

  @ApiPropertyOptional({ description: 'Video testimonial URL' })
  @IsUrl()
  @IsOptional()
  videoUrl?: string;

  @ApiPropertyOptional({ description: 'Rating', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiPropertyOptional({ description: 'Category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdateTestimonialDto {
  @ApiPropertyOptional({ description: 'Testimonial content' })
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'Is featured' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Display order' })
  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @ApiPropertyOptional({ description: 'Category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class ApproveTestimonialDto {
  @ApiProperty({ description: 'Approver identifier' })
  @IsString()
  approvedBy: string;
}

export class TestimonialResponseDto {
  @ApiProperty({ description: 'Testimonial ID' })
  id: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string | null;

  @ApiProperty({ description: 'Customer name' })
  customerName: string;

  @ApiProperty({ description: 'Customer title' })
  customerTitle: string | null;

  @ApiProperty({ description: 'Customer company' })
  customerCompany: string | null;

  @ApiProperty({ description: 'Customer photo URL' })
  customerPhoto: string | null;

  @ApiProperty({ description: 'Testimonial content' })
  content: string;

  @ApiProperty({ description: 'Video URL' })
  videoUrl: string | null;

  @ApiProperty({ description: 'Rating' })
  rating: number | null;

  @ApiProperty({ description: 'Category' })
  category: string | null;

  @ApiProperty({ description: 'Tags' })
  tags: string[];

  @ApiProperty({ description: 'Is approved' })
  isApproved: boolean;

  @ApiProperty({ description: 'Approved by' })
  approvedBy: string | null;

  @ApiProperty({ description: 'Approved at' })
  approvedAt: Date | null;

  @ApiProperty({ description: 'Is featured' })
  isFeatured: boolean;

  @ApiProperty({ description: 'Display order' })
  displayOrder: number;

  @ApiProperty({ description: 'Submitted at' })
  submittedAt: Date;
}

export class TestimonialListResponseDto {
  @ApiProperty({ type: [TestimonialResponseDto] })
  testimonials: TestimonialResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;
}
