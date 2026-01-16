import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);
  private readonly CACHE_TTL = 3600;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getComplianceMessages(
    tenantId: string | null,
    region: string,
    languageCode: string,
    type?: string,
  ) {
    const cacheKey = `compliance:${tenantId || 'global'}:${region}:${languageCode}:${type || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: Record<string, unknown> = {
      region,
      languageCode,
      isActive: true,
      effectiveFrom: { lte: new Date() },
      OR: [{ tenantId: null }, { tenantId }],
    };
    if (type) where.type = type;

    const messages = await this.prisma.complianceMessage.findMany({
      where,
      orderBy: [{ tenantId: 'desc' }, { version: 'desc' }],
    });

    // Group by type, preferring tenant-specific and latest version
    const messagesByType: Map<string, (typeof messages)[0]> = new Map();
    for (const m of messages) {
      if (!messagesByType.has(m.type)) {
        messagesByType.set(m.type, m);
      }
    }

    const result = Array.from(messagesByType.values()).map((m) => ({
      type: m.type,
      region: m.region,
      title: m.title,
      content: m.content,
      actionText: m.actionText,
      rejectText: m.rejectText,
      learnMoreUrl: m.learnMoreUrl,
      version: m.version,
      effectiveFrom: m.effectiveFrom,
    }));

    await this.redis.set(cacheKey, result, this.CACHE_TTL);
    return result;
  }

  async createComplianceMessage(
    tenantId: string | null,
    dto: {
      type: string;
      region: string;
      languageCode: string;
      title: string;
      content: string;
      actionText?: string;
      rejectText?: string;
      learnMoreUrl?: string;
      version: string;
      effectiveFrom: Date;
    },
  ) {
    const message = await this.prisma.complianceMessage.create({
      data: {
        tenantId,
        type: dto.type,
        region: dto.region,
        languageCode: dto.languageCode,
        title: dto.title,
        content: dto.content,
        actionText: dto.actionText,
        rejectText: dto.rejectText,
        learnMoreUrl: dto.learnMoreUrl,
        version: dto.version,
        effectiveFrom: dto.effectiveFrom,
      },
    });

    await this.redis.invalidatePattern(`compliance:*`);

    return message;
  }

  async getRequiredConsents(region: string) {
    // Define required consents by region
    const consentsByRegion: Record<string, string[]> = {
      GDPR: ['necessary', 'analytics', 'marketing', 'preferences'],
      CCPA: ['necessary', 'sale_of_data'],
      LGPD: ['necessary', 'analytics', 'marketing'],
      UK_GDPR: ['necessary', 'analytics', 'marketing', 'preferences'],
      PIPEDA: ['necessary', 'analytics', 'marketing'],
      global: ['necessary'],
    };

    return {
      region,
      requiredConsents: consentsByRegion[region] || consentsByRegion.global,
      defaultsToOptIn: ['GDPR', 'UK_GDPR', 'LGPD'].includes(region),
      requiresExplicitConsent: ['GDPR', 'UK_GDPR', 'LGPD'].includes(region),
    };
  }
}
