import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CanonicalService } from '../services/canonical.service';
import { CanonicalQueryDto } from '../../../common/dto';

@ApiTags('SEO - Canonicals')
@Controller('seo/canonicals')
export class CanonicalController {
  constructor(private readonly canonicalService: CanonicalService) {}

  @Get()
  @ApiOperation({ summary: 'Canonical URL validation', description: 'Validate canonical URLs and detect mismatches' })
  @ApiResponse({ status: 200, description: 'Canonical validation results' })
  async validateCanonicals(@Query() query: CanonicalQueryDto): Promise<any> {
    const result = await this.canonicalService.validateCanonicals(query);
    return { success: true, data: result };
  }
}
