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
import { CampaignsService } from './campaigns.service';
import {
  CampaignForecastRequestDto,
  CampaignForecastResponseDto,
  CampaignScenariosResponseDto,
} from './dto/campaign-forecast.dto';

@ApiTags('campaigns')
@ApiBearerAuth()
@Controller('ai/campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post('forecast')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Forecast campaign performance',
    description:
      'Uses ML models and historical data to forecast campaign reach, conversions, revenue, and ROI.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Campaign forecast generated',
    type: CampaignForecastResponseDto,
  })
  async forecastCampaign(
    @Headers('x-tenant-id') tenantId: string,
    @Body() request: CampaignForecastRequestDto,
  ): Promise<CampaignForecastResponseDto> {
    return this.campaignsService.forecastCampaign(tenantId, request);
  }

  @Post('scenarios')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate campaign scenarios',
    description:
      'Generate multiple budget scenarios with forecasted outcomes to optimize campaign planning.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Campaign scenarios generated',
    type: CampaignScenariosResponseDto,
  })
  async generateScenarios(
    @Headers('x-tenant-id') tenantId: string,
    @Body() request: CampaignForecastRequestDto,
  ): Promise<CampaignScenariosResponseDto> {
    return this.campaignsService.generateScenarios(tenantId, request);
  }

  @Get(':campaignId/history')
  @ApiOperation({
    summary: 'Get forecast history',
    description: 'Retrieve historical forecasts for a campaign.',
  })
  @ApiHeader({
    name: 'x-tenant-id',
    description: 'Tenant identifier',
    required: true,
  })
  @ApiParam({
    name: 'campaignId',
    description: 'Campaign identifier',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of records',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Forecast history retrieved',
    type: [CampaignForecastResponseDto],
  })
  async getForecastHistory(
    @Headers('x-tenant-id') tenantId: string,
    @Param('campaignId') campaignId: string,
    @Query('limit') limit?: number,
  ): Promise<CampaignForecastResponseDto[]> {
    return this.campaignsService.getForecastHistory(tenantId, campaignId, limit);
  }
}
