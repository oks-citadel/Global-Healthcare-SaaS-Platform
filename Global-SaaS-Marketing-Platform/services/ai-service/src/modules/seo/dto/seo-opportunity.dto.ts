import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class SeoOpportunityQueryDto {
  @ApiPropertyOptional({ description: 'Domain to analyze' })
  @IsString()
  @IsOptional()
  domain?: string;

  @ApiPropertyOptional({ description: 'Industry vertical' })
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiPropertyOptional({ description: 'Competitor domains', type: [String] })
  @IsArray()
  @IsOptional()
  competitors?: string[];

  @ApiPropertyOptional({ description: 'Seed keywords', type: [String] })
  @IsArray()
  @IsOptional()
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Minimum search volume' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minSearchVolume?: number;

  @ApiPropertyOptional({ description: 'Maximum keyword difficulty (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  maxDifficulty?: number;

  @ApiPropertyOptional({ description: 'Number of results', default: 20 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Offset for pagination', default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}

export class SuggestedContentDto {
  @ApiProperty({ description: 'Content type' })
  type: string;

  @ApiProperty({ description: 'Suggested title' })
  title: string;

  @ApiProperty({ description: 'Content outline', type: [String] })
  outline: string[];

  @ApiProperty({ description: 'Target word count' })
  wordCount: number;
}

export class CompetitorDataDto {
  @ApiProperty({ description: 'Competitor domain' })
  domain: string;

  @ApiProperty({ description: 'Current rank' })
  rank: number;

  @ApiProperty({ description: 'Content quality score' })
  contentScore: number;
}

export class SeoOpportunityResponseDto {
  @ApiProperty({ description: 'Opportunity identifier' })
  id: string;

  @ApiProperty({ description: 'Target keyword' })
  keyword: string;

  @ApiProperty({ description: 'Monthly search volume' })
  searchVolume: number;

  @ApiProperty({ description: 'Keyword difficulty (0-100)' })
  difficulty: number;

  @ApiProperty({ description: 'Current rank (null if not ranking)' })
  currentRank: number | null;

  @ApiProperty({ description: 'Opportunity score (0-100)' })
  opportunityScore: number;

  @ApiProperty({ description: 'Estimated traffic if ranked' })
  estimatedTraffic: number;

  @ApiProperty({ description: 'Traffic potential value' })
  trafficValue: number;

  @ApiProperty({
    description: 'Opportunity type',
    enum: ['quick_win', 'competitive', 'long_tail', 'featured_snippet'],
  })
  opportunityType: string;

  @ApiProperty({ description: 'Search intent' })
  searchIntent: string;

  @ApiProperty({ description: 'Suggested content', type: SuggestedContentDto })
  suggestedContent: SuggestedContentDto;

  @ApiProperty({ description: 'Competitor data', type: [CompetitorDataDto] })
  competitors: CompetitorDataDto[];

  @ApiProperty({ description: 'Recommended actions', type: [String] })
  recommendations: string[];

  @ApiProperty({ description: 'Discovery timestamp' })
  discoveredAt: Date;
}

export class SeoOpportunitiesListResponseDto {
  @ApiProperty({ type: [SeoOpportunityResponseDto] })
  opportunities: SeoOpportunityResponseDto[];

  @ApiProperty({ description: 'Total count' })
  total: number;

  @ApiProperty({ description: 'Summary statistics' })
  summary: {
    totalSearchVolume: number;
    averageDifficulty: number;
    quickWinCount: number;
    totalTrafficPotential: number;
  };
}

export class KeywordGapAnalysisDto {
  @ApiProperty({ description: 'Your domain' })
  @IsString()
  domain: string;

  @ApiProperty({ description: 'Competitor domains', type: [String] })
  @IsArray()
  competitors: string[];
}

export class KeywordGapResponseDto {
  @ApiProperty({ description: 'Keywords you rank for but competitors do not' })
  uniqueKeywords: SeoOpportunityResponseDto[];

  @ApiProperty({ description: 'Keywords competitors rank for but you do not' })
  missingKeywords: SeoOpportunityResponseDto[];

  @ApiProperty({ description: 'Keywords both rank for with improvement potential' })
  improvementOpportunities: SeoOpportunityResponseDto[];
}
