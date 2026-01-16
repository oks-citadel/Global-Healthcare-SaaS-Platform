import {
  Controller,
  Get,
  Post,
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
import { RatingsService } from './ratings.service';

@ApiTags('ratings')
@ApiBearerAuth()
@Controller('reputation/ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get rating statistics' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiQuery({ name: 'source', required: false })
  async getRatings(
    @Headers('x-tenant-id') tenantId: string,
    @Query('source') source?: string,
  ) {
    return this.ratingsService.getRatings(tenantId, source);
  }

  @Get('aggregated')
  @ApiOperation({ summary: 'Get aggregated ratings by source' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async getAggregatedRatings(@Headers('x-tenant-id') tenantId: string) {
    return this.ratingsService.getAggregatedRatings(tenantId);
  }

  @Post('recalculate')
  @ApiOperation({ summary: 'Recalculate rating aggregates' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async recalculateAggregates(@Headers('x-tenant-id') tenantId: string) {
    return this.ratingsService.recalculateAggregates(tenantId);
  }
}
