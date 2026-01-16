import {
  Controller,
  Get,
  Post,
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
import { AbTestService } from './ab-test.service';
import { CreateABTestDto, ABTestResponseDto, ABTestResultsDto } from './dto/ab-test.dto';

@ApiTags('ab-test')
@ApiBearerAuth()
@Controller('growth/ab-test')
export class AbTestController {
  constructor(private readonly abTestService: AbTestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new A/B test' })
  @ApiResponse({ status: 201, description: 'A/B test created successfully', type: ABTestResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - traffic percentages must sum to 100' })
  async create(@Body() dto: CreateABTestDto) {
    return this.abTestService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all A/B tests' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'landingPageId', required: false, description: 'Filter by landing page' })
  @ApiResponse({ status: 200, description: 'List of A/B tests', type: [ABTestResponseDto] })
  async findAll(
    @Query('status') status?: string,
    @Query('landingPageId') landingPageId?: string,
  ) {
    return this.abTestService.findAll(status, landingPageId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an A/B test by ID' })
  @ApiParam({ name: 'id', description: 'A/B test ID' })
  @ApiResponse({ status: 200, description: 'A/B test details', type: ABTestResponseDto })
  @ApiResponse({ status: 404, description: 'A/B test not found' })
  async findOne(@Param('id') id: string) {
    return this.abTestService.findOne(id);
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start an A/B test' })
  @ApiParam({ name: 'id', description: 'A/B test ID' })
  @ApiResponse({ status: 200, description: 'A/B test started', type: ABTestResponseDto })
  @ApiResponse({ status: 400, description: 'Test cannot be started' })
  @ApiResponse({ status: 404, description: 'A/B test not found' })
  async start(@Param('id') id: string) {
    return this.abTestService.start(id);
  }

  @Post(':id/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop an A/B test' })
  @ApiParam({ name: 'id', description: 'A/B test ID' })
  @ApiResponse({ status: 200, description: 'A/B test stopped', type: ABTestResponseDto })
  @ApiResponse({ status: 400, description: 'Test cannot be stopped' })
  @ApiResponse({ status: 404, description: 'A/B test not found' })
  async stop(@Param('id') id: string) {
    return this.abTestService.stop(id);
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get A/B test results and analysis' })
  @ApiParam({ name: 'id', description: 'A/B test ID' })
  @ApiResponse({ status: 200, description: 'A/B test results', type: ABTestResultsDto })
  @ApiResponse({ status: 404, description: 'A/B test not found' })
  async getResults(@Param('id') id: string) {
    return this.abTestService.getResults(id);
  }

  @Get(':id/variant')
  @ApiOperation({ summary: 'Get a variant for a visitor (for client-side testing)' })
  @ApiParam({ name: 'id', description: 'A/B test ID' })
  @ApiResponse({ status: 200, description: 'Assigned variant' })
  @ApiResponse({ status: 400, description: 'Test is not running' })
  @ApiResponse({ status: 404, description: 'A/B test not found' })
  async getVariantForVisitor(@Param('id') id: string) {
    return this.abTestService.getVariantForVisitor(id);
  }

  @Post(':id/visit/:variantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record a visit for a variant' })
  @ApiParam({ name: 'id', description: 'A/B test ID' })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  @ApiResponse({ status: 200, description: 'Visit recorded' })
  async recordVisit(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
  ) {
    await this.abTestService.recordVisit(id, variantId);
    return { success: true };
  }

  @Post(':id/convert/:variantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Record a conversion for a variant' })
  @ApiParam({ name: 'id', description: 'A/B test ID' })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  @ApiResponse({ status: 200, description: 'Conversion recorded' })
  async recordConversion(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
  ) {
    await this.abTestService.recordConversion(id, variantId);
    return { success: true };
  }
}
