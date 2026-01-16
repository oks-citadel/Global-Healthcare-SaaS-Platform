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
import { ChurnService } from './churn.service';
import {
  ChurnPredictionRequestDto,
  ChurnPredictionResponseDto,
  BatchChurnPredictionRequestDto,
  BatchChurnPredictionResponseDto,
} from './dto/churn-prediction.dto';

@ApiTags('churn')
@ApiBearerAuth()
@Controller('ai/churn')
export class ChurnController {
  constructor(private readonly churnService: ChurnService) {}

  @Post('predict')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Predict customer churn',
    description:
      'Uses ML models to predict the probability of customer churn. Returns risk level, contributing factors, and recommended retention actions.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Churn prediction generated',
    type: ChurnPredictionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  async predictChurn(
    @Headers('x-tenant-id') tenantId: string,
    @Body() request: ChurnPredictionRequestDto,
  ): Promise<ChurnPredictionResponseDto> {
    return this.churnService.predictChurn(tenantId, request);
  }

  @Post('predict/batch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Batch predict churn for multiple customers',
    description:
      'Analyze multiple customers in a single request with summary statistics.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Batch predictions generated',
    type: BatchChurnPredictionResponseDto,
  })
  async batchPredictChurn(
    @Headers('x-tenant-id') tenantId: string,
    @Body() request: BatchChurnPredictionRequestDto,
  ): Promise<BatchChurnPredictionResponseDto> {
    return this.churnService.batchPredictChurn(tenantId, request);
  }

  @Get('high-risk')
  @ApiOperation({
    summary: 'Get high-risk customers',
    description: 'Retrieve customers with high or critical churn risk.',
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
    description: 'High-risk customers retrieved',
    type: [ChurnPredictionResponseDto],
  })
  async getHighRiskCustomers(
    @Headers('x-tenant-id') tenantId: string,
    @Query('limit') limit?: number,
  ): Promise<ChurnPredictionResponseDto[]> {
    return this.churnService.getHighRiskCustomers(tenantId, limit);
  }

  @Get(':customerId/history')
  @ApiOperation({
    summary: 'Get churn prediction history',
    description: 'Retrieve historical churn predictions for a customer.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({
    name: 'customerId',
    description: 'Customer identifier',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of records',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Prediction history retrieved',
    type: [ChurnPredictionResponseDto],
  })
  async getChurnHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('customerId') customerId: string,
    @Query('limit') limit?: number,
  ): Promise<ChurnPredictionResponseDto[]> {
    return this.churnService.getChurnHistory(tenantId, customerId, limit);
  }
}
