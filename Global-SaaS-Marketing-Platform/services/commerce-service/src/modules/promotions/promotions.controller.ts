import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import {
  CreateCouponDto,
  CouponResponseDto,
  CouponQueryDto,
  PaginatedCouponsDto,
  ValidateCouponDto,
  ValidationResultDto,
  RedeemCouponDto,
  RedemptionResponseDto,
} from './dto/coupon.dto';

@ApiTags('promotions')
@ApiBearerAuth()
@Controller('commerce/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post('coupons')
  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Coupon created successfully',
    type: CouponResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Coupon with this code already exists',
  })
  async create(@Body() dto: CreateCouponDto): Promise<CouponResponseDto> {
    return this.promotionsService.create(dto);
  }

  @Get('coupons')
  @ApiOperation({ summary: 'Get all coupons with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of coupons',
    type: PaginatedCouponsDto,
  })
  async findAll(@Query() query: CouponQueryDto): Promise<PaginatedCouponsDto> {
    return this.promotionsService.findAll(query);
  }

  @Get('coupons/:code')
  @ApiOperation({ summary: 'Get a coupon by code' })
  @ApiParam({ name: 'code', description: 'Coupon code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Coupon details',
    type: CouponResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Coupon not found',
  })
  async findByCode(@Param('code') code: string): Promise<CouponResponseDto> {
    return this.promotionsService.findByCode(code);
  }

  @Post('coupons/:code/validate')
  @ApiOperation({ summary: 'Validate a coupon for a user' })
  @ApiParam({ name: 'code', description: 'Coupon code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Validation result',
    type: ValidationResultDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Coupon not found',
  })
  async validate(
    @Param('code') code: string,
    @Body() dto: ValidateCouponDto,
  ): Promise<ValidationResultDto> {
    return this.promotionsService.validate(code, dto);
  }

  @Post('coupons/:code/redeem')
  @ApiOperation({ summary: 'Redeem a coupon' })
  @ApiParam({ name: 'code', description: 'Coupon code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Redemption successful',
    type: RedemptionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Coupon not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Coupon is not valid',
  })
  async redeem(
    @Param('code') code: string,
    @Body() dto: RedeemCouponDto,
  ): Promise<RedemptionResponseDto> {
    return this.promotionsService.redeem(code, dto);
  }
}
