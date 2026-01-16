import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { BadgesService } from './badges.service';

@ApiTags('badges')
@ApiBearerAuth()
@Controller('reputation/badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  @ApiOperation({ summary: 'Get trust badges' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiQuery({ name: 'type', required: false })
  async getBadges(
    @Headers('x-tenant-id') tenantId: string,
    @Query('type') type?: string,
  ) {
    return this.badgesService.getBadges(tenantId, type);
  }

  @Post()
  @ApiOperation({ summary: 'Create trust badge' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  async createBadge(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: {
      name: string;
      type: string;
      issuer: string;
      imageUrl: string;
      linkUrl?: string;
      description?: string;
      issuedAt?: Date;
      expiresAt?: Date;
      displayOrder?: number;
      metadata?: Record<string, unknown>;
    },
  ) {
    return this.badgesService.createBadge(tenantId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update trust badge' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiParam({ name: 'id' })
  async updateBadge(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: { isActive?: boolean; displayOrder?: number },
  ) {
    return this.badgesService.updateBadge(tenantId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete trust badge' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiParam({ name: 'id' })
  async deleteBadge(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.badgesService.deleteBadge(tenantId, id);
  }
}
