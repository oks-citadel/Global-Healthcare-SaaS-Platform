import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CanonicalQueryDto, CanonicalResultDto } from '../../../common/dto';

@Injectable()
export class CanonicalService {
  private readonly logger = new Logger(CanonicalService.name);

  constructor(private readonly prisma: PrismaService) {}

  async validateCanonicals(query: CanonicalQueryDto): Promise<CanonicalResultDto> {
    const where: any = { isPublished: true };
    if (query.tenant) {
      const tenant = await this.prisma.tenant.findUnique({ where: { slug: query.tenant } });
      if (tenant) where.tenantId = tenant.id;
    }

    const pages = await this.prisma.page.findMany({
      where, take: query.limit || 100, include: { tenant: { select: { domain: true } } },
    });

    const coverage = await this.prisma.indexCoverage.findMany({
      where: { url: { in: pages.map(p => `https://${p.tenant.domain}/${p.slug}`) } },
    });

    const coverageMap = new Map(coverage.map(c => [c.url, c]));
    const canonicals = pages.map(p => {
      const url = `https://${p.tenant.domain}/${p.slug}`;
      const cov = coverageMap.get(url);
      const hasMismatch = cov?.canonicalMismatch || false;

      let status: 'valid' | 'mismatch' | 'missing' | 'self-referencing' = 'valid';
      if (!p.canonicalUrl) status = 'missing';
      else if (p.canonicalUrl === url) status = 'self-referencing';
      else if (hasMismatch) status = 'mismatch';

      return {
        url, declaredCanonical: p.canonicalUrl, googleSelectedCanonical: cov?.googleSelectedCanonical || undefined,
        hasMismatch, status, recommendation: status === 'missing' ? 'Add canonical URL' : status === 'mismatch' ? 'Review canonical discrepancy' : undefined,
      };
    });

    const valid = canonicals.filter(c => c.status === 'valid' || c.status === 'self-referencing').length;
    const mismatched = canonicals.filter(c => c.status === 'mismatch').length;
    const missing = canonicals.filter(c => c.status === 'missing').length;

    if (query.hasMismatch !== undefined) {
      return {
        summary: { total: canonicals.length, valid, mismatched, missing },
        canonicals: canonicals.filter(c => c.hasMismatch === query.hasMismatch),
      };
    }

    return { summary: { total: canonicals.length, valid, mismatched, missing }, canonicals };
  }
}
