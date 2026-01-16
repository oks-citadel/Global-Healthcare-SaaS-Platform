import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  CampaignResponseDto,
  CampaignMetricsDto,
  CampaignFilterDto,
} from './dto/campaign.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('campaigns')
@ApiBearerAuth()
@Controller('growth/campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({ status: 201, description: 'Campaign created successfully', type: CampaignResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of campaigns' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query() filters: CampaignFilterDto,
  ) {
    return this.campaignsService.findAll(pagination, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a campaign by ID' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign details', type: CampaignResponseDto })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign updated successfully', type: CampaignResponseDto })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.campaignsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a campaign (soft delete)' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign deleted successfully' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }

  @Get(':id/metrics')
  @ApiOperation({ summary: 'Get campaign metrics and analytics' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign metrics', type: CampaignMetricsDto })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async getMetrics(@Param('id') id: string) {
    return this.campaignsService.getMetrics(id);
  }
}
