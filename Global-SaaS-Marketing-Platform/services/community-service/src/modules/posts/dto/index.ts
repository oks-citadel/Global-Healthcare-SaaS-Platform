import { IsString, IsOptional, IsArray, IsEnum, IsBoolean, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'Author user ID' })
  @IsString()
  authorId: string;

  @ApiProperty({ description: 'Post title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Post content (markdown supported)' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'Post category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Tags for the post', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ enum: ['published', 'draft'], default: 'published' })
  @IsOptional()
  @IsEnum(['published', 'draft'])
  status?: string;

  @ApiPropertyOptional({ description: 'Pin post to top', default: false })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

export class UpdatePostDto {
  @ApiPropertyOptional({ description: 'Post title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Post content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Post category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Tags for the post', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ enum: ['published', 'draft', 'archived'] })
  @IsOptional()
  @IsEnum(['published', 'draft', 'archived'])
  status?: string;

  @ApiPropertyOptional({ description: 'Pin post to top' })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}

export class PostQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiPropertyOptional({ enum: ['published', 'draft', 'archived'] })
  @IsOptional()
  @IsEnum(['published', 'draft', 'archived'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

export class TrendingQueryDto {
  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ enum: ['day', 'week', 'month'], default: 'week' })
  @IsOptional()
  @IsEnum(['day', 'week', 'month'])
  period?: string;
}

export class PostResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  category?: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  status: string;

  @ApiProperty()
  isPinned: boolean;

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  likeCount: number;

  @ApiProperty()
  commentCount: number;

  @ApiProperty()
  shareCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
