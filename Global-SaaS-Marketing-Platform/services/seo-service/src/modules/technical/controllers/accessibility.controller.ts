import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AccessibilityService } from '../services/accessibility.service';
import { AccessibilityQueryDto } from '../../../common/dto';

@ApiTags('SEO - Accessibility')
@Controller('seo/accessibility')
export class AccessibilityController {
  constructor(private readonly accessibilityService: AccessibilityService) {}

  @Get(':url')
  @ApiOperation({ summary: 'Accessibility audit', description: 'Run WCAG accessibility audit on a URL' })
  @ApiParam({ name: 'url', description: 'Encoded URL to audit' })
  @ApiResponse({ status: 200, description: 'Accessibility audit results' })
  async auditAccessibility(@Param('url') url: string, @Query() query: AccessibilityQueryDto): Promise<any> {
    const result = await this.accessibilityService.auditAccessibility(decodeURIComponent(url), query);
    return { success: true, data: result };
  }
}
