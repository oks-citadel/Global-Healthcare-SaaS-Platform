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
import { PersonalizationEngineService } from './personalization-engine.service';
import { RulesService } from './rules.service';
import {
  RecommendRequestDto,
  RecommendResponseDto,
  NextBestActionRequestDto,
  NextBestActionResponseDto,
  ContentRequestDto,
  ContentResponseDto,
  CreateRuleDto,
  UpdateRuleDto,
  RuleResponseDto,
  RuleQueryDto,
  PaginatedRulesDto,
} from './dto/personalization.dto';

@ApiTags('personalization')
@ApiBearerAuth()
@Controller('personalization')
export class PersonalizationEngineController {
  constructor(
    private readonly personalizationService: PersonalizationEngineService,
    private readonly rulesService: RulesService,
  ) {}

  // Recommendation Endpoints
  @Post('recommend')
  @ApiOperation({ summary: 'Get personalized recommendations for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Personalized recommendations',
    type: RecommendResponseDto,
  })
  async getRecommendations(
    @Body() dto: RecommendRequestDto,
  ): Promise<RecommendResponseDto> {
    return this.personalizationService.getRecommendations(dto);
  }

  // Next Best Action Endpoints
  @Post('next-best-action')
  @ApiOperation({ summary: 'Get next best actions for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Next best actions',
    type: NextBestActionResponseDto,
  })
  async getNextBestActions(
    @Body() dto: NextBestActionRequestDto,
  ): Promise<NextBestActionResponseDto> {
    return this.personalizationService.getNextBestActions(dto);
  }

  // Content Personalization Endpoints
  @Post('content')
  @ApiOperation({ summary: 'Get personalized content for a user and slot' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Personalized content',
    type: ContentResponseDto,
  })
  async getPersonalizedContent(
    @Body() dto: ContentRequestDto,
  ): Promise<ContentResponseDto> {
    return this.personalizationService.getPersonalizedContent(dto);
  }

  // Personalization Rules Endpoints
  @Post('rules')
  @ApiOperation({ summary: 'Create a new personalization rule' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Rule created successfully',
    type: RuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Rule with this key already exists',
  })
  async createRule(@Body() dto: CreateRuleDto): Promise<RuleResponseDto> {
    return this.rulesService.create(dto);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get all personalization rules with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of rules',
    type: PaginatedRulesDto,
  })
  async findAllRules(@Query() query: RuleQueryDto): Promise<PaginatedRulesDto> {
    return this.rulesService.findAll(query);
  }

  @Get('rules/:key')
  @ApiOperation({ summary: 'Get a personalization rule by key' })
  @ApiParam({ name: 'key', description: 'Rule key' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Personalization rule',
    type: RuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule not found',
  })
  async findRuleByKey(@Param('key') key: string): Promise<RuleResponseDto> {
    return this.rulesService.findByKey(key);
  }

  @Put('rules/:key')
  @ApiOperation({ summary: 'Update a personalization rule' })
  @ApiParam({ name: 'key', description: 'Rule key' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Rule updated successfully',
    type: RuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule not found',
  })
  async updateRule(
    @Param('key') key: string,
    @Body() dto: UpdateRuleDto,
  ): Promise<RuleResponseDto> {
    return this.rulesService.update(key, dto);
  }

  @Delete('rules/:key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a personalization rule' })
  @ApiParam({ name: 'key', description: 'Rule key' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Rule deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rule not found',
  })
  async deleteRule(@Param('key') key: string): Promise<void> {
    return this.rulesService.delete(key);
  }
}
