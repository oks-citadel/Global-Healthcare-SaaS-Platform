import {
  Controller,
  Post,
  Get,
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
import { LeadsService } from './leads.service';
import {
  LeadScoringRequestDto,
  LeadScoringResponseDto,
  BatchLeadScoringRequestDto,
  BatchLeadScoringResponseDto,
} from './dto/lead-scoring.dto';

@ApiTags('leads')
@ApiBearerAuth()
@Controller('ai/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('score')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Score a lead',
    description:
      'Uses ML models to predict lead quality and conversion probability. Returns a score from 0-100 along with contributing factors and recommended actions.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lead scored successfully',
    type: LeadScoringResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async scoreLead(
    @Headers('x-tenant-id') tenantId: string,
    @Body() request: LeadScoringRequestDto,
  ): Promise<LeadScoringResponseDto> {
    return this.leadsService.scoreLeads(tenantId, request);
  }

  @Post('score/batch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Batch score multiple leads',
    description:
      'Score multiple leads in a single request. Useful for bulk processing and periodic re-scoring.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Leads scored successfully',
    type: BatchLeadScoringResponseDto,
  })
  async batchScoreLeads(
    @Headers('x-tenant-id') tenantId: string,
    @Body() request: BatchLeadScoringRequestDto,
  ): Promise<BatchLeadScoringResponseDto> {
    return this.leadsService.batchScoreLeads(tenantId, request);
  }

  @Get(':leadId/history')
  @ApiOperation({
    summary: 'Get lead score history',
    description:
      'Retrieve historical scores for a lead to track progression over time.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({
    name: 'leadId',
    description: 'Lead identifier',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of records to return',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Score history retrieved',
    type: [LeadScoringResponseDto],
  })
  async getLeadScoreHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('leadId') leadId: string,
    @Query('limit') limit?: number,
  ): Promise<LeadScoringResponseDto[]> {
    return this.leadsService.getLeadScoreHistory(tenantId, leadId, limit);
  }
}
