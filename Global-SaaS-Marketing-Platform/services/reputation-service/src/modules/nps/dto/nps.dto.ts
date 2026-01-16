import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsObject,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateNpsSurveyDto {
  @ApiProperty({ description: 'Survey name' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ description: 'Survey description' })
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Survey trigger',
    enum: ['manual', 'post_purchase', 'post_support', 'scheduled'],
  })
  @IsEnum(['manual', 'post_purchase', 'post_support', 'scheduled'])
  trigger: string;

  @ApiPropertyOptional({ description: 'Trigger configuration' })
  @IsObject()
  @IsOptional()
  triggerConfig?: Record<string, unknown>;
}

export class SubmitNpsResponseDto {
  @ApiProperty({ description: 'Survey ID' })
  @IsString()
  surveyId: string;

  @ApiPropertyOptional({ description: 'Customer ID' })
  @IsString()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Customer email' })
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiProperty({ description: 'NPS score (0-10)', minimum: 0, maximum: 10 })
  @IsNumber()
  @Min(0)
  @Max(10)
  score: number;

  @ApiPropertyOptional({ description: 'Additional feedback' })
  @IsString()
  @MaxLength(5000)
  @IsOptional()
  feedback?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class NpsSurveyResponseDto {
  @ApiProperty({ description: 'Survey ID' })
  id: string;

  @ApiProperty({ description: 'Survey name' })
  name: string;

  @ApiProperty({ description: 'Description' })
  description: string | null;

  @ApiProperty({ description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Trigger type' })
  trigger: string;

  @ApiProperty({ description: 'Trigger config' })
  triggerConfig: Record<string, unknown> | null;

  @ApiProperty({ description: 'Created date' })
  createdAt: Date;
}

export class NpsResponseDto {
  @ApiProperty({ description: 'Response ID' })
  id: string;

  @ApiProperty({ description: 'Survey ID' })
  surveyId: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string | null;

  @ApiProperty({ description: 'Customer email' })
  customerEmail: string | null;

  @ApiProperty({ description: 'NPS score' })
  score: number;

  @ApiProperty({ description: 'Category (promoter/passive/detractor)' })
  category: string;

  @ApiProperty({ description: 'Feedback' })
  feedback: string | null;

  @ApiProperty({ description: 'Tags' })
  tags: string[];

  @ApiProperty({ description: 'Submitted date' })
  submittedAt: Date;
}

export class NpsResultsDto {
  @ApiProperty({ description: 'NPS score (-100 to 100)' })
  npsScore: number;

  @ApiProperty({ description: 'Total responses' })
  totalResponses: number;

  @ApiProperty({ description: 'Promoters count (9-10)' })
  promoters: number;

  @ApiProperty({ description: 'Passives count (7-8)' })
  passives: number;

  @ApiProperty({ description: 'Detractors count (0-6)' })
  detractors: number;

  @ApiProperty({ description: 'Promoters percentage' })
  promoterPercentage: number;

  @ApiProperty({ description: 'Passives percentage' })
  passivePercentage: number;

  @ApiProperty({ description: 'Detractors percentage' })
  detractorPercentage: number;

  @ApiProperty({ description: 'Average score' })
  averageScore: number;

  @ApiProperty({ description: 'Response rate' })
  responseRate: number | null;

  @ApiProperty({ description: 'Score distribution' })
  scoreDistribution: Record<number, number>;

  @ApiProperty({ description: 'Trend data' })
  trend: Array<{ date: string; npsScore: number; responses: number }>;
}
