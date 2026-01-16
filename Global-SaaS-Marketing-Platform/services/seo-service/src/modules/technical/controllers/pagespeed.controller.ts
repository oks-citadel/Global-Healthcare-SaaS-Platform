import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PageSpeedService } from '../services/pagespeed.service';
import { PageSpeedQueryDto } from '../../../common/dto';

@ApiTags('SEO - Page Speed')
@Controller('seo/pagespeed')
export class PageSpeedController {
  constructor(private readonly pageSpeedService: PageSpeedService) {}

  @Get(':url')
  @ApiOperation({ summary: 'Get page speed diagnostics', description: 'Returns detailed page speed analysis with opportunities and diagnostics' })
  @ApiParam({ name: 'url', description: 'Encoded URL to analyze' })
  @ApiResponse({ status: 200, description: 'Page speed results' })
  async getPageSpeed(@Param('url') url: string, @Query() query: PageSpeedQueryDto): Promise<any> {
    const result = await this.pageSpeedService.getPageSpeed(decodeURIComponent(url), query);
    return { success: true, data: result };
  }

  @Get('compare/:url1/:url2')
  @ApiOperation({ summary: 'Compare page speed', description: 'Compare page speed between two URLs' })
  @ApiParam({ name: 'url1', description: 'First URL (encoded)' })
  @ApiParam({ name: 'url2', description: 'Second URL (encoded)' })
  @ApiQuery({ name: 'strategy', required: false, enum: ['mobile', 'desktop'] })
  @ApiResponse({ status: 200, description: 'Comparison results' })
  async comparePageSpeed(@Param('url1') url1: string, @Param('url2') url2: string, @Query('strategy') strategy?: string): Promise<any> {
    const result = await this.pageSpeedService.comparePageSpeed(decodeURIComponent(url1), decodeURIComponent(url2), strategy);
    return { success: true, ...result };
  }
}
