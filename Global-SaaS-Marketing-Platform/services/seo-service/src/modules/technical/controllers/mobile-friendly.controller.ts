import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MobileFriendlyService } from '../services/mobile-friendly.service';

@ApiTags('SEO - Mobile Friendly')
@Controller('seo/mobile-friendly')
export class MobileFriendlyController {
  constructor(private readonly mobileFriendlyService: MobileFriendlyService) {}

  @Get(':url')
  @ApiOperation({ summary: 'Mobile friendly assessment', description: 'Check if a URL is mobile-friendly with detailed issues' })
  @ApiParam({ name: 'url', description: 'Encoded URL to check' })
  @ApiResponse({ status: 200, description: 'Mobile-friendly test results' })
  async checkMobileFriendly(@Param('url') url: string): Promise<any> {
    const result = await this.mobileFriendlyService.checkMobileFriendly(decodeURIComponent(url));
    return { success: true, data: result };
  }
}
