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
import { PricingService } from './pricing.service';

@ApiTags('pricing')
@ApiBearerAuth()
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('localized')
  @ApiOperation({ summary: 'Get localized pricing' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiQuery({ name: 'localeCode', required: true })
  @ApiQuery({ name: 'productId', required: false })
  async getLocalizedPricing(
    @Headers('x-tenant-id') tenantId: string,
    @Query('localeCode') localeCode: string,
    @Query('productId') productId?: string,
  ) {
    return this.pricingService.getLocalizedPricing(tenantId, localeCode, productId);
  }

  @Get('currency')
  @ApiOperation({ summary: 'Get currencies' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  async getCurrencies(@Query('activeOnly') activeOnly?: boolean) {
    return this.pricingService.getCurrencies(activeOnly !== false);
  }

  @Get('currency/convert')
  @ApiOperation({ summary: 'Convert price between currencies' })
  @ApiQuery({ name: 'amount', required: true, type: Number })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  async convertPrice(
    @Query('amount') amount: number,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.pricingService.convertPrice(amount, from, to);
  }

  @Post('localized')
  @ApiOperation({ summary: 'Set localized pricing' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async setLocalizedPricing(
    @Headers('x-tenant-id') tenantId: string,
    @Body()
    dto: {
      localeCode: string;
      productId: string;
      planId?: string;
      basePrice: number;
      localPrice: number;
      currencyCode: string;
      exchangeRate: number;
      adjustmentType?: string;
      adjustmentValue?: number;
      taxRate?: number;
      taxInclusive?: boolean;
      validFrom: Date;
      validTo?: Date;
      metadata?: Record<string, unknown>;
    },
  ) {
    return this.pricingService.setLocalizedPricing(tenantId, dto);
  }
}
