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
  ApiQuery,
} from '@nestjs/swagger';
import { LandingService } from './landing.service';
import {
  CreateLandingPageDto,
  UpdateLandingPageDto,
  CreateVariantDto,
  LandingPageResponseDto,
  VariantResponseDto,
  CroSuggestionDto,
} from './dto/landing.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('landing')
@ApiBearerAuth()
@Controller('growth/landing')
export class LandingController {
  constructor(private readonly landingService: LandingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new landing page' })
  @ApiResponse({ status: 201, description: 'Landing page created successfully', type: LandingPageResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async create(@Body() dto: CreateLandingPageDto) {
    return this.landingService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all landing pages with pagination' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, title, or slug' })
  @ApiResponse({ status: 200, description: 'List of landing pages' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.landingService.findAll(pagination, status, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a landing page by ID' })
  @ApiParam({ name: 'id', description: 'Landing page ID' })
  @ApiResponse({ status: 200, description: 'Landing page details', type: LandingPageResponseDto })
  @ApiResponse({ status: 404, description: 'Landing page not found' })
  async findOne(@Param('id') id: string) {
    return this.landingService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a landing page' })
  @ApiParam({ name: 'id', description: 'Landing page ID' })
  @ApiResponse({ status: 200, description: 'Landing page updated successfully', type: LandingPageResponseDto })
  @ApiResponse({ status: 404, description: 'Landing page not found' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async update(@Param('id') id: string, @Body() dto: UpdateLandingPageDto) {
    return this.landingService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a landing page (soft delete)' })
  @ApiParam({ name: 'id', description: 'Landing page ID' })
  @ApiResponse({ status: 200, description: 'Landing page deleted successfully' })
  @ApiResponse({ status: 404, description: 'Landing page not found' })
  async remove(@Param('id') id: string) {
    return this.landingService.remove(id);
  }

  @Get(':id/variants')
  @ApiOperation({ summary: 'Get all variants of a landing page' })
  @ApiParam({ name: 'id', description: 'Landing page ID' })
  @ApiResponse({ status: 200, description: 'List of variants', type: [VariantResponseDto] })
  @ApiResponse({ status: 404, description: 'Landing page not found' })
  async getVariants(@Param('id') id: string) {
    return this.landingService.getVariants(id);
  }

  @Post(':id/variants')
  @ApiOperation({ summary: 'Create a new variant for a landing page' })
  @ApiParam({ name: 'id', description: 'Landing page ID' })
  @ApiResponse({ status: 201, description: 'Variant created successfully', type: VariantResponseDto })
  @ApiResponse({ status: 404, description: 'Landing page not found' })
  @ApiResponse({ status: 409, description: 'Variant code already exists' })
  async createVariant(@Param('id') id: string, @Body() dto: CreateVariantDto) {
    return this.landingService.createVariant(id, dto);
  }
}

@ApiTags('cro')
@ApiBearerAuth()
@Controller('growth/cro')
export class CroController {
  constructor(private readonly landingService: LandingService) {}

  @Get('suggestions')
  @ApiOperation({ summary: 'Get CRO suggestions for a landing page' })
  @ApiQuery({ name: 'landingPageId', description: 'Landing page ID' })
  @ApiResponse({ status: 200, description: 'CRO suggestions', type: [CroSuggestionDto] })
  @ApiResponse({ status: 404, description: 'Landing page not found' })
  async getSuggestions(@Query('landingPageId') landingPageId: string) {
    return this.landingService.getCroSuggestions(landingPageId);
  }
}
