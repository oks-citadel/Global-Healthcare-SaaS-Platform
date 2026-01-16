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
import { AffiliatesService } from './affiliates.service';
import {
  CreateAffiliateProgramDto,
  EnrollAffiliateDto,
  TrackConversionDto,
  AffiliateResponseDto,
  AffiliatePayoutSummaryDto,
} from './dto/affiliate.dto';

@ApiTags('affiliates')
@ApiBearerAuth()
@Controller('growth/affiliate')
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Post('programs')
  @ApiOperation({ summary: 'Create a new affiliate program' })
  @ApiResponse({ status: 201, description: 'Affiliate program created' })
  async createProgram(@Body() dto: CreateAffiliateProgramDto) {
    return this.affiliatesService.createProgram(dto);
  }

  @Get('programs')
  @ApiOperation({ summary: 'Get all affiliate programs' })
  @ApiResponse({ status: 200, description: 'List of affiliate programs' })
  async getPrograms() {
    return this.affiliatesService.getPrograms();
  }

  @Post('enroll')
  @ApiOperation({ summary: 'Enroll as an affiliate' })
  @ApiResponse({ status: 201, description: 'Affiliate enrolled successfully', type: AffiliateResponseDto })
  @ApiResponse({ status: 404, description: 'Program not found' })
  @ApiResponse({ status: 409, description: 'Already enrolled' })
  async enrollAffiliate(@Body() dto: EnrollAffiliateDto) {
    return this.affiliatesService.enrollAffiliate(dto);
  }

  @Post('track')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track an affiliate conversion' })
  @ApiResponse({ status: 200, description: 'Conversion tracked' })
  @ApiResponse({ status: 404, description: 'Affiliate not found' })
  @ApiResponse({ status: 409, description: 'Conversion already tracked' })
  async trackConversion(@Body() dto: TrackConversionDto) {
    return this.affiliatesService.trackConversion(dto);
  }

  @Get('payout')
  @ApiOperation({ summary: 'Get payout summary for an affiliate' })
  @ApiQuery({ name: 'affiliateId', description: 'Affiliate ID' })
  @ApiResponse({ status: 200, description: 'Payout summary', type: AffiliatePayoutSummaryDto })
  @ApiResponse({ status: 404, description: 'Affiliate not found' })
  async getPayoutSummary(@Query('affiliateId') affiliateId: string) {
    return this.affiliatesService.getPayoutSummary(affiliateId);
  }

  @Get(':affiliateCode')
  @ApiOperation({ summary: 'Get affiliate by code' })
  @ApiParam({ name: 'affiliateCode', description: 'Affiliate code' })
  @ApiResponse({ status: 200, description: 'Affiliate details', type: AffiliateResponseDto })
  @ApiResponse({ status: 404, description: 'Affiliate not found' })
  async getAffiliateByCode(@Param('affiliateCode') affiliateCode: string) {
    return this.affiliatesService.getAffiliateByCode(affiliateCode);
  }

  @Get(':affiliateId/stats')
  @ApiOperation({ summary: 'Get affiliate statistics' })
  @ApiParam({ name: 'affiliateId', description: 'Affiliate ID' })
  @ApiResponse({ status: 200, description: 'Affiliate statistics' })
  @ApiResponse({ status: 404, description: 'Affiliate not found' })
  async getAffiliateStats(@Param('affiliateId') affiliateId: string) {
    return this.affiliatesService.getAffiliateStats(affiliateId);
  }

  @Post(':affiliateId/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve an affiliate application' })
  @ApiParam({ name: 'affiliateId', description: 'Affiliate ID' })
  @ApiResponse({ status: 200, description: 'Affiliate approved' })
  @ApiResponse({ status: 404, description: 'Affiliate not found' })
  async approveAffiliate(@Param('affiliateId') affiliateId: string) {
    return this.affiliatesService.approveAffiliate(affiliateId);
  }

  @Post('click')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track an affiliate link click' })
  @ApiResponse({ status: 200, description: 'Click tracked' })
  async trackClick(@Body('affiliateCode') affiliateCode: string) {
    return this.affiliatesService.trackClick(affiliateCode);
  }
}
