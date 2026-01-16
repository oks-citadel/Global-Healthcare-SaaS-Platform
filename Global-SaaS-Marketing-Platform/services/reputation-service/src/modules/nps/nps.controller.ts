import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
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
import { NpsService } from './nps.service';
import {
  CreateNpsSurveyDto,
  SubmitNpsResponseDto,
  NpsSurveyResponseDto,
  NpsResponseDto,
  NpsResultsDto,
} from './dto/nps.dto';

@ApiTags('nps')
@ApiBearerAuth()
@Controller('reputation/nps')
export class NpsController {
  constructor(private readonly npsService: NpsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create NPS survey',
    description: 'Create a new NPS survey.',
  })
  @ApiHeader({ name: 'x-tenant-id', description: 'Tenant identifier', required: true })
  @ApiResponse({ status: 201, type: NpsSurveyResponseDto })
  async createSurvey(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateNpsSurveyDto,
  ): Promise<NpsSurveyResponseDto> {
    return this.npsService.createSurvey(tenantId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get NPS surveys',
    description: 'Retrieve all NPS surveys.',
  })
  @ApiHeader({ name: 'x-tenant-id', description: 'Tenant identifier', required: true })
  @ApiResponse({ status: 200, type: [NpsSurveyResponseDto] })
  async getSurveys(
    @Headers('x-tenant-id') tenantId: string,
  ): Promise<NpsSurveyResponseDto[]> {
    return this.npsService.getSurveys(tenantId);
  }

  @Post('respond')
  @ApiOperation({
    summary: 'Submit NPS response',
    description: 'Submit a response to an NPS survey.',
  })
  @ApiHeader({ name: 'x-tenant-id', description: 'Tenant identifier', required: true })
  @ApiResponse({ status: 201, type: NpsResponseDto })
  async submitResponse(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: SubmitNpsResponseDto,
  ): Promise<NpsResponseDto> {
    return this.npsService.submitResponse(tenantId, dto);
  }

  @Get('results')
  @ApiOperation({
    summary: 'Get NPS results',
    description: 'Get aggregated NPS results and statistics.',
  })
  @ApiHeader({ name: 'x-tenant-id', description: 'Tenant identifier', required: true })
  @ApiQuery({ name: 'surveyId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, type: NpsResultsDto })
  async getResults(
    @Headers('x-tenant-id') tenantId: string,
    @Query('surveyId') surveyId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<NpsResultsDto> {
    return this.npsService.getResults(
      tenantId,
      surveyId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':surveyId/responses')
  @ApiOperation({
    summary: 'Get survey responses',
    description: 'Get individual responses for an NPS survey.',
  })
  @ApiHeader({ name: 'x-tenant-id', description: 'Tenant identifier', required: true })
  @ApiParam({ name: 'surveyId', description: 'Survey identifier' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  async getResponses(
    @Headers('x-tenant-id') tenantId: string,
    @Param('surveyId') surveyId: string,
    @Query('category') category?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<{ responses: NpsResponseDto[]; total: number }> {
    return this.npsService.getResponses(tenantId, surveyId, { category, limit, offset });
  }
}
