import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { HreflangQueryDto, HreflangResultDto } from '../../../common/dto';

@Injectable()
export class HreflangService {
  private readonly logger = new Logger(HreflangService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getHreflangMapping(query: HreflangQueryDto): Promise<HreflangResultDto> {
    const where: any = {};
    if (query.tenant) {
      const tenant = await this.prisma.tenant.findUnique({ where: { slug: query.tenant } });
      if (tenant) where.tenantId = tenant.id;
    }
    if (query.locale) where.locale = query.locale;

    const mappings = await this.prisma.hreflangMapping.findMany({
      where, take: query.limit || 100, orderBy: { groupId: 'asc' },
    });

    // Group by groupId
    const groupMap = new Map<string, any[]>();
    for (const m of mappings) {
      if (!groupMap.has(m.groupId)) groupMap.set(m.groupId, []);
      groupMap.get(m.groupId)!.push(m);
    }

    const groups = Array.from(groupMap.entries()).map(([groupId, urls]) => {
      const issues: Array<{ type: string; message: string; affectedUrls: string[] }> = [];

      // Check for missing return tags
      const withoutReturn = urls.filter(u => !u.hasReturnTag);
      if (withoutReturn.length > 0) {
        issues.push({
          type: 'missing_return_tag', message: 'Some pages missing reciprocal hreflang tags',
          affectedUrls: withoutReturn.map(u => u.url),
        });
      }

      // Check for missing self-reference
      const invalidLocales = urls.filter(u => !u.isValid);
      if (invalidLocales.length > 0) {
        issues.push({
          type: 'invalid_locale', message: 'Invalid locale codes detected',
          affectedUrls: invalidLocales.map(u => u.url),
        });
      }

      return {
        groupId, issues,
        urls: urls.map(u => ({
          url: u.url, locale: u.locale, region: u.region || undefined,
          hasReturnTag: u.hasReturnTag, isValid: u.isValid,
        })),
      };
    });

    const validGroups = groups.filter(g => g.issues.length === 0).length;
    const groupsWithIssues = groups.filter(g => g.issues.length > 0).length;

    // Calculate locale coverage
    const localeCoverage: Record<string, number> = {};
    for (const m of mappings) {
      localeCoverage[m.locale] = (localeCoverage[m.locale] || 0) + 1;
    }

    const result: HreflangResultDto = {
      summary: { totalGroups: groups.length, totalUrls: mappings.length, validGroups, groupsWithIssues },
      groups: query.hasIssues !== undefined ? groups.filter(g => (query.hasIssues ? g.issues.length > 0 : g.issues.length === 0)) : groups,
      localeCoverage,
    };

    return result;
  }

  async createHreflangGroup(urls: Array<{ url: string; locale: string; region?: string }>): Promise<string> {
    const groupId = require('uuid').v4();

    for (const item of urls) {
      await this.prisma.hreflangMapping.create({
        data: { groupId, url: item.url, locale: item.locale, region: item.region, isValid: true, hasReturnTag: false },
      });
    }

    return groupId;
  }

  async validateHreflangTags(tenantId: string): Promise<{ validated: number; issues: number }> {
    const mappings = await this.prisma.hreflangMapping.findMany({ where: { tenantId } });
    let issues = 0;

    // Group by groupId and check return tags
    const groupMap = new Map<string, any[]>();
    for (const m of mappings) {
      if (!groupMap.has(m.groupId)) groupMap.set(m.groupId, []);
      groupMap.get(m.groupId)!.push(m);
    }

    for (const [groupId, urls] of groupMap) {
      const urlSet = new Set(urls.map(u => u.url));

      for (const mapping of urls) {
        // In production, would fetch the page and check for return tags
        // For now, simulate validation
        const hasReturnTag = Math.random() > 0.2;

        if (!hasReturnTag) issues++;

        await this.prisma.hreflangMapping.update({
          where: { url_locale: { url: mapping.url, locale: mapping.locale } },
          data: { hasReturnTag, lastValidated: new Date() },
        });
      }
    }

    return { validated: mappings.length, issues };
  }
}
