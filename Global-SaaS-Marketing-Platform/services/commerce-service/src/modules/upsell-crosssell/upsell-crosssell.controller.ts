import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UpsellCrosssellService } from './upsell-crosssell.service';
import {
  CreateOfferDto,
  OfferResponseDto,
  GetOffersQueryDto,
  OfferWithProductsDto,
} from './dto/offer.dto';

@ApiTags('upsell', 'cross-sell')
@ApiBearerAuth()
@Controller('commerce')
export class UpsellCrosssellController {
  constructor(private readonly upsellCrosssellService: UpsellCrosssellService) {}

  @Get('upsell/offers')
  @ApiOperation({ summary: 'Get upsell offers for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of upsell offers with product details',
    type: [OfferWithProductsDto],
  })
  async getUpsellOffers(
    @Query() query: GetOffersQueryDto,
  ): Promise<OfferWithProductsDto[]> {
    return this.upsellCrosssellService.getUpsellOffers(query);
  }

  @Get('cross-sell/offers')
  @ApiOperation({ summary: 'Get cross-sell offers for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of cross-sell offers with product details',
    type: [OfferWithProductsDto],
  })
  async getCrossSellOffers(
    @Query() query: GetOffersQueryDto,
  ): Promise<OfferWithProductsDto[]> {
    return this.upsellCrosssellService.getCrossSellOffers(query);
  }

  @Post('offers')
  @ApiOperation({ summary: 'Create a new upsell/cross-sell offer' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Offer created successfully',
    type: OfferResponseDto,
  })
  async createOffer(@Body() dto: CreateOfferDto): Promise<OfferResponseDto> {
    return this.upsellCrosssellService.create(dto);
  }

  @Post('offers/:id/click')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Track offer click' })
  @ApiParam({ name: 'id', description: 'Offer ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Click tracked',
  })
  async trackClick(@Param('id') id: string): Promise<void> {
    return this.upsellCrosssellService.trackClick(id);
  }

  @Post('offers/:id/conversion')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Track offer conversion' })
  @ApiParam({ name: 'id', description: 'Offer ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Conversion tracked',
  })
  async trackConversion(@Param('id') id: string): Promise<void> {
    return this.upsellCrosssellService.trackConversion(id);
  }
}
