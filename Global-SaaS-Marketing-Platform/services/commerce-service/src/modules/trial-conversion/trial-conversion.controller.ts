import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TrialConversionService } from './trial-conversion.service';
import {
  CreateTrialUserDto,
  TrialUserResponseDto,
  TrialConversionQueryDto,
  ConversionMetricsDto,
  CreateNudgeDto,
  NudgeResponseDto,
  TrialAtRiskDto,
} from './dto/trial.dto';

@ApiTags('trial')
@ApiBearerAuth()
@Controller('commerce/trial')
export class TrialConversionController {
  constructor(private readonly trialConversionService: TrialConversionService) {}

  @Post('users')
  @ApiOperation({ summary: 'Create a new trial user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Trial user created successfully',
    type: TrialUserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Trial user already exists',
  })
  async createTrialUser(
    @Body() dto: CreateTrialUserDto,
  ): Promise<TrialUserResponseDto> {
    return this.trialConversionService.createTrialUser(dto);
  }

  @Get('conversion')
  @ApiOperation({ summary: 'Get trial conversion metrics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversion metrics',
    type: ConversionMetricsDto,
  })
  async getConversionMetrics(
    @Query() query: TrialConversionQueryDto,
  ): Promise<ConversionMetricsDto> {
    return this.trialConversionService.getConversionMetrics(query);
  }

  @Get('at-risk')
  @ApiOperation({ summary: 'Get trial users at risk of not converting' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of at-risk trial users',
    type: [TrialAtRiskDto],
  })
  async getTrialsAtRisk(
    @Query() query: TrialConversionQueryDto,
  ): Promise<TrialAtRiskDto[]> {
    return this.trialConversionService.getTrialsAtRisk(query);
  }

  @Post('nudges')
  @ApiOperation({ summary: 'Send a nudge to a trial user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Nudge sent successfully',
    type: NudgeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Trial user not found',
  })
  async sendNudge(@Body() dto: CreateNudgeDto): Promise<NudgeResponseDto> {
    return this.trialConversionService.sendNudge(dto);
  }
}
