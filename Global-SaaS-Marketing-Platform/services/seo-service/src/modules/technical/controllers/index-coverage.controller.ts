import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { IndexCoverageService } from '../services/index-coverage.service';
import { IndexCoverageQueryDto } from '../../../common/dto';

@ApiTags('SEO - Index Coverage')
@Controller('seo/index-coverage')
export class IndexCoverageController {
  constructor(private readonly indexCoverageService: IndexCoverageService) {}

  @Get()
  @ApiOperation({ summary: 'Get index coverage analysis', description: 'Returns index coverage status for URLs' })
  @ApiResponse({ status: 200, description: 'Index coverage data' })
  async getIndexCoverage(@Query() query: IndexCoverageQueryDto): Promise<any> {
    const result = await this.indexCoverageService.getIndexCoverage(query);
    return { success: true, data: result };
  }

  @Post('update')
  @ApiOperation({ summary: 'Update index status', description: 'Update the index status for a URL' })
  @ApiBody({ schema: { type: 'object', properties: { url: { type: 'string' }, status: { type: 'string' }, issues: { type: 'object' } } } })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateIndexStatus(@Body('url') url: string, @Body('status') status: string, @Body('issues') issues?: any): Promise<any> {
    await this.indexCoverageService.updateIndexStatus(url, status, issues);
    return { success: true, message: 'Index status updated' };
  }
}
