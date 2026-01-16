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
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';

@ApiTags('compliance')
@ApiBearerAuth()
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('messages')
  @ApiOperation({ summary: 'Get compliance messages' })
  @ApiHeader({ name: 'x-tenant-id', required: false })
  @ApiQuery({ name: 'region', required: true })
  @ApiQuery({ name: 'languageCode', required: true })
  @ApiQuery({ name: 'type', required: false })
  async getComplianceMessages(
    @Headers('x-tenant-id') tenantId: string | undefined,
    @Query('region') region: string,
    @Query('languageCode') languageCode: string,
    @Query('type') type?: string,
  ) {
    return this.complianceService.getComplianceMessages(
      tenantId || null,
      region,
      languageCode,
      type,
    );
  }

  @Post('messages')
  @ApiOperation({ summary: 'Create compliance message' })
  @ApiHeader({ name: 'x-tenant-id', required: false })
  async createComplianceMessage(
    @Headers('x-tenant-id') tenantId: string | undefined,
    @Body()
    dto: {
      type: string;
      region: string;
      languageCode: string;
      title: string;
      content: string;
      actionText?: string;
      rejectText?: string;
      learnMoreUrl?: string;
      version: string;
      effectiveFrom: Date;
    },
  ) {
    return this.complianceService.createComplianceMessage(tenantId || null, dto);
  }

  @Get('consents')
  @ApiOperation({ summary: 'Get required consents by region' })
  @ApiQuery({ name: 'region', required: true })
  async getRequiredConsents(@Query('region') region: string) {
    return this.complianceService.getRequiredConsents(region);
  }
}
