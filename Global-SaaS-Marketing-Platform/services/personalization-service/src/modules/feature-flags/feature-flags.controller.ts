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
import { FeatureFlagsService } from './feature-flags.service';
import {
  CreateFeatureFlagDto,
  UpdateFeatureFlagDto,
  FeatureFlagResponseDto,
  FlagQueryDto,
  PaginatedFlagsDto,
  EvaluateFlagRequestDto,
  EvaluateFlagResponseDto,
  BulkEvaluateRequestDto,
  BulkEvaluateResponseDto,
} from './dto/feature-flag.dto';

@ApiTags('feature-flags')
@ApiBearerAuth()
@Controller('flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlagsService: FeatureFlagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feature flag' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Feature flag created successfully',
    type: FeatureFlagResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Feature flag with this key already exists',
  })
  async create(@Body() dto: CreateFeatureFlagDto): Promise<FeatureFlagResponseDto> {
    return this.featureFlagsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feature flags with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of feature flags',
    type: PaginatedFlagsDto,
  })
  async findAll(@Query() query: FlagQueryDto): Promise<PaginatedFlagsDto> {
    return this.featureFlagsService.findAll(query);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get a feature flag by key' })
  @ApiParam({ name: 'key', description: 'Feature flag key' })
  @ApiQuery({ name: 'environment', required: false, description: 'Environment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Feature flag details',
    type: FeatureFlagResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feature flag not found',
  })
  async findByKey(
    @Param('key') key: string,
    @Query('environment') environment?: string,
  ): Promise<FeatureFlagResponseDto> {
    return this.featureFlagsService.findByKey(key, environment);
  }

  @Put(':key')
  @ApiOperation({ summary: 'Update a feature flag' })
  @ApiParam({ name: 'key', description: 'Feature flag key' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Feature flag updated successfully',
    type: FeatureFlagResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feature flag not found',
  })
  async update(
    @Param('key') key: string,
    @Body() dto: UpdateFeatureFlagDto,
  ): Promise<FeatureFlagResponseDto> {
    return this.featureFlagsService.update(key, dto);
  }

  @Delete(':key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a feature flag' })
  @ApiParam({ name: 'key', description: 'Feature flag key' })
  @ApiQuery({ name: 'environment', required: false, description: 'Environment' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Feature flag deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feature flag not found',
  })
  async delete(
    @Param('key') key: string,
    @Query('environment') environment?: string,
  ): Promise<void> {
    return this.featureFlagsService.delete(key, environment);
  }

  @Post(':key/evaluate')
  @ApiOperation({ summary: 'Evaluate a feature flag for a user' })
  @ApiParam({ name: 'key', description: 'Feature flag key' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Feature flag evaluation result',
    type: EvaluateFlagResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feature flag not found',
  })
  async evaluate(
    @Param('key') key: string,
    @Body() dto: EvaluateFlagRequestDto,
  ): Promise<EvaluateFlagResponseDto> {
    return this.featureFlagsService.evaluate(key, dto);
  }

  @Post('bulk-evaluate')
  @ApiOperation({ summary: 'Evaluate multiple feature flags for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bulk feature flag evaluation results',
    type: BulkEvaluateResponseDto,
  })
  async bulkEvaluate(
    @Body() dto: BulkEvaluateRequestDto,
  ): Promise<BulkEvaluateResponseDto> {
    return this.featureFlagsService.bulkEvaluate(dto);
  }
}
