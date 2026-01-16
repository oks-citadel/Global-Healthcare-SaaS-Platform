import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { CsatService } from './csat.service';

@ApiTags('csat')
@ApiBearerAuth()
@Controller('reputation/csat')
export class CsatController {
  constructor(private readonly csatService: CsatService) {}

  @Post()
  @ApiOperation({ summary: 'Create CSAT survey' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async createSurvey(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: {
      name: string;
      description?: string;
      question: string;
      scaleType: string;
      trigger: string;
      triggerConfig?: Record<string, unknown>;
    },
  ) {
    return this.csatService.createSurvey(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get CSAT surveys' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async getSurveys(@Headers('x-tenant-id') tenantId: string) {
    return this.csatService.getSurveys(tenantId);
  }

  @Post('respond')
  @ApiOperation({ summary: 'Submit CSAT response' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async submitResponse(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: {
      surveyId: string;
      customerId?: string;
      customerEmail?: string;
      score: number;
      maxScore: number;
      feedback?: string;
      interactionId?: string;
      interactionType?: string;
      tags?: string[];
      metadata?: Record<string, unknown>;
    },
  ) {
    return this.csatService.submitResponse(tenantId, dto);
  }

  @Get('results')
  @ApiOperation({ summary: 'Get CSAT results' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiQuery({ name: 'surveyId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async getResults(
    @Headers('x-tenant-id') tenantId: string,
    @Query('surveyId') surveyId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.csatService.getResults(
      tenantId,
      surveyId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}
