import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { AuditService } from '../services/audit.service';
import { ScheduleAuditDto, AuditQueryDto } from '../../../common/dto';

@ApiTags('SEO - Audit')
@Controller('seo/audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({
    summary: 'Get full crawl results',
    description: 'Returns the latest audit results with all issues and recommendations',
  })
  @ApiQuery({ name: 'tenant', required: false, description: 'Filter by tenant slug' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by audit type' })
  @ApiResponse({ status: 200, description: 'Latest audit results' })
  @ApiResponse({ status: 404, description: 'No audits found' })
  async getLatestAudit(
    @Query() query: AuditQueryDto,
  ): Promise<any> {
    const audit = await this.auditService.getLatestAudit(query);

    if (!audit) {
      return {
        success: true,
        data: null,
        message: 'No completed audits found',
      };
    }

    return { success: true, data: audit };
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get audit history',
    description: 'Returns a list of past audits with their scores and summaries',
  })
  @ApiQuery({ name: 'tenant', required: false, description: 'Filter by tenant slug' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by audit type' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of audits' })
  async listAudits(
    @Query() query: AuditQueryDto,
  ): Promise<any> {
    const result = await this.auditService.listAudits(query);
    return { success: true, ...result };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get audit details',
    description: 'Get detailed results for a specific audit',
  })
  @ApiParam({ name: 'id', description: 'Audit ID' })
  @ApiResponse({ status: 200, description: 'Audit details' })
  @ApiResponse({ status: 404, description: 'Audit not found' })
  async getAuditDetails(
    @Param('id') id: string,
  ): Promise<any> {
    // For now, we'll use the list method with a filter
    // In a complete implementation, we'd have a getAuditById method
    const result = await this.auditService.listAudits({ limit: 100 } as AuditQueryDto);
    const audit = result.data.find(a => a.id === id);

    if (!audit) {
      return {
        success: false,
        error: 'Audit not found',
      };
    }

    return { success: true, data: audit };
  }

  @Post('schedule')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Schedule SEO audit',
    description: 'Schedule a new SEO audit to run immediately or at a specified time',
  })
  @ApiBody({ type: ScheduleAuditDto })
  @ApiResponse({ status: 202, description: 'Audit scheduled' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async scheduleAudit(
    @Body() dto: ScheduleAuditDto,
  ): Promise<any> {
    const audit = await this.auditService.scheduleAudit(dto);
    return {
      success: true,
      message: dto.scheduledAt ? 'Audit scheduled' : 'Audit started',
      data: audit,
    };
  }

  @Get('summary/:tenantId')
  @ApiOperation({
    summary: 'Get audit summary',
    description: 'Get a summary of the latest audit scores and trends for a tenant',
  })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Audit summary' })
  async getAuditSummary(
    @Param('tenantId') tenantId: string,
  ): Promise<any> {
    // Get the last 5 audits for trend analysis
    const audits = await this.auditService.listAudits({
      limit: 5,
    } as AuditQueryDto);

    const tenantAudits = audits.data.filter(a => a.tenantId === tenantId);

    if (tenantAudits.length === 0) {
      return {
        success: true,
        data: {
          hasAudits: false,
          message: 'No audits found for this tenant',
        },
      };
    }

    const latestAudit = tenantAudits[0];
    const previousAudit = tenantAudits[1];

    return {
      success: true,
      data: {
        hasAudits: true,
        currentScore: latestAudit.score,
        previousScore: previousAudit?.score || null,
        scoreTrend: previousAudit ? (latestAudit.score || 0) - (previousAudit.score || 0) : null,
        summary: latestAudit.summary,
        lastAuditDate: latestAudit.completedAt,
        issueBreakdown: {
          critical: latestAudit.summary?.critical || 0,
          errors: latestAudit.summary?.errors || 0,
          warnings: latestAudit.summary?.warnings || 0,
          info: latestAudit.summary?.info || 0,
        },
        recentAudits: tenantAudits.map(a => ({
          id: a.id,
          score: a.score,
          type: a.type,
          completedAt: a.completedAt,
        })),
      },
    };
  }

  @Get('issues/:tenantId')
  @ApiOperation({
    summary: 'Get prioritized issues',
    description: 'Get a prioritized list of SEO issues to fix',
  })
  @ApiParam({ name: 'tenantId', description: 'Tenant ID' })
  @ApiQuery({ name: 'severity', required: false, description: 'Filter by severity' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiResponse({ status: 200, description: 'Prioritized issues' })
  async getPrioritizedIssues(
    @Param('tenantId') tenantId: string,
    @Query('severity') severity?: string,
    @Query('category') category?: string,
  ): Promise<any> {
    const audit = await this.auditService.getLatestAudit({} as AuditQueryDto);

    if (!audit || audit.tenantId !== tenantId) {
      return {
        success: true,
        data: {
          issues: [],
          message: 'No audit found for this tenant',
        },
      };
    }

    let issues = audit.issues;

    // Filter by severity
    if (severity) {
      issues = issues.filter(i => i.severity === severity);
    }

    // Filter by category (would need to add category to issues)
    // For now, we'll skip this filter

    // Sort by severity (critical > error > warning > info)
    const severityOrder = { critical: 0, error: 1, warning: 2, info: 3 };
    issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return {
      success: true,
      data: {
        totalIssues: issues.length,
        issues: issues.slice(0, 50), // Return top 50 issues
      },
    };
  }

  @Post('compare')
  @ApiOperation({
    summary: 'Compare two audits',
    description: 'Compare two audit results to see improvements or regressions',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        auditId1: { type: 'string', description: 'First audit ID (older)' },
        auditId2: { type: 'string', description: 'Second audit ID (newer)' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Comparison result' })
  async compareAudits(
    @Body('auditId1') auditId1: string,
    @Body('auditId2') auditId2: string,
  ): Promise<any> {
    // Get both audits
    const audits = await this.auditService.listAudits({ limit: 100 } as AuditQueryDto);
    const audit1 = audits.data.find(a => a.id === auditId1);
    const audit2 = audits.data.find(a => a.id === auditId2);

    if (!audit1 || !audit2) {
      return {
        success: false,
        error: 'One or both audits not found',
      };
    }

    // Calculate differences
    const scoreDiff = (audit2.score || 0) - (audit1.score || 0);

    const issuesDiff = {
      critical: (audit2.summary?.critical || 0) - (audit1.summary?.critical || 0),
      errors: (audit2.summary?.errors || 0) - (audit1.summary?.errors || 0),
      warnings: (audit2.summary?.warnings || 0) - (audit1.summary?.warnings || 0),
      info: (audit2.summary?.info || 0) - (audit1.summary?.info || 0),
    };

    return {
      success: true,
      data: {
        audit1: {
          id: audit1.id,
          score: audit1.score,
          completedAt: audit1.completedAt,
          summary: audit1.summary,
        },
        audit2: {
          id: audit2.id,
          score: audit2.score,
          completedAt: audit2.completedAt,
          summary: audit2.summary,
        },
        comparison: {
          scoreDiff,
          scoreImproved: scoreDiff > 0,
          issuesDiff,
          totalIssuesDiff: Object.values(issuesDiff).reduce((a, b) => a + b, 0),
        },
      },
    };
  }
}
