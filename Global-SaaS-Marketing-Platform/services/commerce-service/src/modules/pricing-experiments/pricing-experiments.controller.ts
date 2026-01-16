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
import { PricingExperimentsService } from './pricing-experiments.service';
import {
  CreatePricingExperimentDto,
  PricingExperimentResponseDto,
  PricingExperimentQueryDto,
  PaginatedPricingExperimentsDto,
  GetPriceDto,
  PriceResponseDto,
} from './dto/pricing-experiment.dto';

@ApiTags('pricing')
@ApiBearerAuth()
@Controller('commerce/pricing')
export class PricingExperimentsController {
  constructor(
    private readonly pricingExperimentsService: PricingExperimentsService,
  ) {}

  @Post('experiments')
  @ApiOperation({ summary: 'Create a new pricing experiment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Experiment created successfully',
    type: PricingExperimentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Experiment with this key already exists',
  })
  async create(
    @Body() dto: CreatePricingExperimentDto,
  ): Promise<PricingExperimentResponseDto> {
    return this.pricingExperimentsService.create(dto);
  }

  @Get('experiments')
  @ApiOperation({ summary: 'Get all pricing experiments with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of pricing experiments',
    type: PaginatedPricingExperimentsDto,
  })
  async findAll(
    @Query() query: PricingExperimentQueryDto,
  ): Promise<PaginatedPricingExperimentsDto> {
    return this.pricingExperimentsService.findAll(query);
  }

  @Post('price')
  @ApiOperation({ summary: 'Get personalized price for a user and product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Price for the product',
    type: PriceResponseDto,
  })
  async getPrice(@Body() dto: GetPriceDto): Promise<PriceResponseDto> {
    return this.pricingExperimentsService.getPrice(dto);
  }
}
