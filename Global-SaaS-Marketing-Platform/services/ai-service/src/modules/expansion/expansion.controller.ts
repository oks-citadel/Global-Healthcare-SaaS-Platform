import {
  Controller,
  Post,
  Get,
  Body,
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
  ApiQuery,
} from '@nestjs/swagger';
import { ExpansionService } from './expansion.service';
import {
  ExpansionPredictionRequestDto,
  ExpansionPredictionResponseDto,
  BatchExpansionRequestDto,
  BatchExpansionResponseDto,
} from './dto/expansion-prediction.dto';

@ApiTags('expansion')
@ApiBearerAuth()
@Controller('ai/expansion')
export class ExpansionController {
  constructor(private readonly expansionService: ExpansionService) {}

  @Post('predict')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Predict expansion opportunity',
    description:
      'Analyzes customer data to predict upsell and expansion opportunities with specific product recommendations.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Expansion prediction generated',
    type: ExpansionPredictionResponseDto,
  })
  async predictExpansion(
    @Headers('x-tenant-id') tenantId: string,
    @Body() request: ExpansionPredictionRequestDto,
  ): Promise<ExpansionPredictionResponseDto> {
    return this.expansionService.predictExpansion(tenantId, request);
  }

  @Post('predict/batch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Batch predict expansion opportunities',
    description:
      'Analyze multiple customers for expansion opportunities in a single request.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Batch predictions generated',
    type: BatchExpansionResponseDto,
  })
  async batchPredictExpansion(
    @Headers('x-tenant-id') tenantId: string,
    @Body() request: BatchExpansionRequestDto,
  ): Promise<BatchExpansionResponseDto> {
    return this.expansionService.batchPredictExpansion(tenantId, request);
  }

  @Get('opportunities')
  @ApiOperation({
    summary: 'Get top expansion opportunities',
    description:
      'Retrieve customers with the highest expansion potential sorted by predicted revenue.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of results',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Top opportunities retrieved',
    type: [ExpansionPredictionResponseDto],
  })
  async getTopOpportunities(
    @Headers('x-tenant-id') tenantId: string,
    @Query('limit') limit?: number,
  ): Promise<ExpansionPredictionResponseDto[]> {
    return this.expansionService.getTopOpportunities(tenantId, limit);
  }
}
