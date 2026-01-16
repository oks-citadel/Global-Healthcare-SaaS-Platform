import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReferralsService } from './referrals.service';
import {
  CreateReferralProgramDto,
  GenerateReferralCodeDto,
  RedeemReferralDto,
  ReferralCodeResponseDto,
  ReferralRedemptionResponseDto,
  ReferralTrackingDto,
} from './dto/referral.dto';

@ApiTags('referrals')
@ApiBearerAuth()
@Controller('growth/referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post('programs')
  @ApiOperation({ summary: 'Create a new referral program' })
  @ApiResponse({ status: 201, description: 'Referral program created' })
  async createProgram(@Body() dto: CreateReferralProgramDto) {
    return this.referralsService.createProgram(dto);
  }

  @Get('programs')
  @ApiOperation({ summary: 'Get all referral programs' })
  @ApiResponse({ status: 200, description: 'List of referral programs' })
  async getPrograms() {
    return this.referralsService.getPrograms();
  }

  @Post('code')
  @ApiOperation({ summary: 'Generate a referral code for a user' })
  @ApiResponse({ status: 201, description: 'Referral code generated', type: ReferralCodeResponseDto })
  @ApiResponse({ status: 404, description: 'Program not found' })
  @ApiResponse({ status: 409, description: 'Custom code already exists' })
  async generateCode(@Body() dto: GenerateReferralCodeDto) {
    return this.referralsService.generateCode(dto);
  }

  @Post('redeem')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redeem a referral code' })
  @ApiResponse({ status: 200, description: 'Referral redeemed', type: ReferralRedemptionResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  @ApiResponse({ status: 404, description: 'Code not found' })
  async redeemCode(@Body() dto: RedeemReferralDto) {
    return this.referralsService.redeemCode(dto);
  }

  @Get('track')
  @ApiOperation({ summary: 'Track referral code performance' })
  @ApiQuery({ name: 'code', description: 'Referral code to track' })
  @ApiResponse({ status: 200, description: 'Referral tracking data', type: ReferralTrackingDto })
  @ApiResponse({ status: 404, description: 'Code not found' })
  async trackReferral(@Query('code') code: string) {
    return this.referralsService.trackReferral(code);
  }

  @Post('click')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track a click on a referral link' })
  @ApiResponse({ status: 200, description: 'Click tracked' })
  async trackClick(@Body('code') code: string) {
    return this.referralsService.trackClick(code);
  }
}
