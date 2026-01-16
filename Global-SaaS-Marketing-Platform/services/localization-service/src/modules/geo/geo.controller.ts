import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  Ip,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { GeoService } from './geo.service';

@ApiTags('geo')
@ApiBearerAuth()
@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Get('detect')
  @ApiOperation({ summary: 'Detect user geo location' })
  @ApiQuery({ name: 'ip', required: false, description: 'IP to lookup (defaults to request IP)' })
  async detectGeo(@Ip() requestIp: string, @Query('ip') ip?: string) {
    const targetIp = ip || requestIp || '8.8.8.8';
    return this.geoService.detectGeo(targetIp);
  }

  @Get('content')
  @ApiOperation({ summary: 'Get geo-specific content' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiQuery({ name: 'localeCode', required: true })
  @ApiQuery({ name: 'contentType', required: true })
  @ApiQuery({ name: 'contentKey', required: false })
  async getGeoContent(
    @Headers('x-tenant-id') tenantId: string,
    @Query('localeCode') localeCode: string,
    @Query('contentType') contentType: string,
    @Query('contentKey') contentKey?: string,
  ) {
    return this.geoService.getGeoContent(tenantId, localeCode, contentType, contentKey);
  }

  @Post('content')
  @ApiOperation({ summary: 'Set geo-specific content' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async setGeoContent(
    @Headers('x-tenant-id') tenantId: string,
    @Body()
    dto: {
      localeCode: string;
      contentType: string;
      contentKey: string;
      content: Record<string, unknown>;
      validFrom?: Date;
      validTo?: Date;
      metadata?: Record<string, unknown>;
    },
  ) {
    return this.geoService.setGeoContent(tenantId, dto);
  }
}
