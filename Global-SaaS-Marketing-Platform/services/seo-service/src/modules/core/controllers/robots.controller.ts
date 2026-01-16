import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Query,
  Header,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { RobotsService } from '../services/robots.service';
import { UpdateRobotsConfigDto } from '../../../common/dto';

@ApiTags('SEO - Robots.txt')
@Controller('seo')
export class RobotsController {
  constructor(private readonly robotsService: RobotsService) {}

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain')
  @Header('Cache-Control', 'public, max-age=86400')
  @ApiOperation({
    summary: 'Get robots.txt',
    description: 'Returns the robots.txt file for crawler directives',
  })
  @ApiQuery({ name: 'tenant', required: false, description: 'Tenant slug for tenant-specific robots.txt' })
  @ApiResponse({ status: 200, description: 'Robots.txt content' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async getRobotsTxt(
    @Query('tenant') tenant?: string,
    @Res() res?: Response,
  ): Promise<void> {
    const content = await this.robotsService.generateRobotsTxt(tenant);
    res!.send(content);
  }

  @Put('robots/config')
  @ApiOperation({
    summary: 'Update robots.txt configuration',
    description: 'Update the robots.txt configuration for a tenant',
  })
  @ApiBody({ type: UpdateRobotsConfigDto })
  @ApiResponse({ status: 200, description: 'Configuration updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async updateRobotsConfig(
    @Body() dto: UpdateRobotsConfigDto,
  ): Promise<{ success: boolean; message: string }> {
    await this.robotsService.updateRobotsConfig(dto);
    return { success: true, message: 'Robots.txt configuration updated' };
  }

  @Get('robots/config')
  @ApiOperation({
    summary: 'Get robots.txt configuration',
    description: 'Get the current robots.txt configuration for a tenant',
  })
  @ApiQuery({ name: 'tenantId', required: true, description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Robots.txt configuration' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async getRobotsConfig(
    @Query('tenantId') tenantId: string,
  ): Promise<any> {
    const config = await this.robotsService.getRobotsConfig(tenantId);
    return { success: true, data: config };
  }

  @Post('robots/validate')
  @ApiOperation({
    summary: 'Validate robots.txt content',
    description: 'Validate robots.txt syntax and rules',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Robots.txt content to validate' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validateRobotsTxt(
    @Body('content') content: string,
  ): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    return this.robotsService.validateRobotsTxt(content);
  }

  @Post('robots/test')
  @ApiOperation({
    summary: 'Test URL against robots.txt',
    description: 'Test if a URL is allowed for a specific user agent based on robots.txt rules',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        robotsTxt: { type: 'string', description: 'Robots.txt content' },
        url: { type: 'string', description: 'URL to test' },
        userAgent: { type: 'string', description: 'User agent to test (default: *)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Test result' })
  async testRobotsTxt(
    @Body('robotsTxt') robotsTxt: string,
    @Body('url') url: string,
    @Body('userAgent') userAgent: string = '*',
  ): Promise<{
    url: string;
    userAgent: string;
    isAllowed: boolean;
  }> {
    const isAllowed = this.robotsService.testUrl(robotsTxt, url, userAgent);
    return { url, userAgent, isAllowed };
  }
}
