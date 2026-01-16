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
import { RewardsService } from './rewards.service';
import {
  CreateRewardDto,
  IssueRewardDto,
  RewardResponseDto,
  UserRewardResponseDto,
} from './dto/reward.dto';

@ApiTags('rewards')
@ApiBearerAuth()
@Controller('growth/rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reward' })
  @ApiResponse({ status: 201, description: 'Reward created', type: RewardResponseDto })
  async create(@Body() dto: CreateRewardDto) {
    return this.rewardsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rewards' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiResponse({ status: 200, description: 'List of rewards', type: [RewardResponseDto] })
  async findAll(@Query('isActive') isActive?: string) {
    const active = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.rewardsService.findAll(active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reward by ID' })
  @ApiParam({ name: 'id', description: 'Reward ID' })
  @ApiResponse({ status: 200, description: 'Reward details', type: RewardResponseDto })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  async findOne(@Param('id') id: string) {
    return this.rewardsService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get reward statistics' })
  @ApiParam({ name: 'id', description: 'Reward ID' })
  @ApiResponse({ status: 200, description: 'Reward statistics' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  async getStats(@Param('id') id: string) {
    return this.rewardsService.getRewardStats(id);
  }

  @Post('issue')
  @ApiOperation({ summary: 'Issue a reward to a user' })
  @ApiResponse({ status: 201, description: 'Reward issued', type: UserRewardResponseDto })
  @ApiResponse({ status: 400, description: 'Reward not available' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  async issueReward(@Body() dto: IssueRewardDto) {
    return this.rewardsService.issueReward(dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get rewards for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'User rewards', type: [UserRewardResponseDto] })
  async getUserRewards(
    @Param('userId') userId: string,
    @Query('status') status?: string,
  ) {
    return this.rewardsService.getUserRewards(userId, status);
  }

  @Post('redeem')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redeem a reward' })
  @ApiResponse({ status: 200, description: 'Reward redeemed' })
  @ApiResponse({ status: 400, description: 'Reward cannot be redeemed' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  async redeemReward(
    @Body('codeOrId') codeOrId: string,
    @Body('userId') userId: string,
  ) {
    return this.rewardsService.redeemReward(codeOrId, userId);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate a reward code' })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validateReward(
    @Body('codeOrId') codeOrId: string,
    @Body('userId') userId: string,
  ) {
    return this.rewardsService.validateReward(codeOrId, userId);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a user reward' })
  @ApiParam({ name: 'id', description: 'User reward ID' })
  @ApiResponse({ status: 200, description: 'Reward cancelled' })
  @ApiResponse({ status: 400, description: 'Reward cannot be cancelled' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  async cancelReward(@Param('id') id: string) {
    return this.rewardsService.cancelReward(id);
  }
}
