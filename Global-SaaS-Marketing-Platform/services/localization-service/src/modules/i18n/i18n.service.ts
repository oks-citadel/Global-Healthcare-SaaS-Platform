import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';

@Injectable()
export class I18nService {
  private readonly logger = new Logger(I18nService.name);
  private readonly CACHE_TTL = 3600;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getLanguages(activeOnly = true) {
    const cacheKey = `languages:${activeOnly}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where = activeOnly ? { isActive: true } : {};
    const languages = await this.prisma.language.findMany({
      where,
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });

    await this.redis.set(cacheKey, languages, this.CACHE_TTL);
    return languages;
  }

  async getLocales(languageCode?: string, activeOnly = true) {
    const cacheKey = `locales:${languageCode || 'all'}:${activeOnly}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: Record<string, unknown> = {};
    if (activeOnly) where.isActive = true;
    if (languageCode) where.languageCode = languageCode;

    const locales = await this.prisma.locale.findMany({
      where,
      include: { language: true },
      orderBy: { name: 'asc' },
    });

    await this.redis.set(cacheKey, locales, this.CACHE_TTL);
    return locales;
  }

  async getStrings(
    tenantId: string | null,
    languageCode: string,
    namespace?: string,
  ) {
    const cacheKey = `strings:${tenantId || 'global'}:${languageCode}:${namespace || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: Record<string, unknown> = {
      languageCode,
      OR: [{ tenantId: null }, { tenantId }],
    };
    if (namespace) where.namespace = namespace;

    const strings = await this.prisma.localizedString.findMany({
      where,
      orderBy: { key: 'asc' },
    });

    // Build key-value map with tenant strings overriding global
    const stringMap: Record<string, string> = {};
    for (const s of strings) {
      // Tenant-specific strings take precedence
      if (!stringMap[s.key] || s.tenantId) {
        stringMap[s.key] = s.value;
      }
    }

    await this.redis.set(cacheKey, stringMap, this.CACHE_TTL);
    return stringMap;
  }

  async getString(tenantId: string | null, key: string, languageCode: string) {
    const string = await this.prisma.localizedString.findFirst({
      where: {
        key,
        languageCode,
        OR: [{ tenantId: null }, { tenantId }],
      },
      orderBy: { tenantId: 'desc' }, // Prefer tenant-specific
    });

    if (!string) {
      throw new NotFoundException(`String not found: ${key}`);
    }

    return { key, value: string.value, languageCode };
  }

  async updateString(
    tenantId: string,
    key: string,
    languageCode: string,
    value: string,
    namespace = 'common',
  ) {
    const string = await this.prisma.localizedString.upsert({
      where: {
        tenantId_key_languageCode: { tenantId, key, languageCode },
      },
      update: { value, isApproved: false },
      create: {
        tenantId,
        key,
        languageCode,
        value,
        namespace,
      },
    });

    await this.redis.invalidatePattern(`strings:${tenantId}:*`);

    return string;
  }

  async bulkUpdateStrings(
    tenantId: string,
    languageCode: string,
    strings: Array<{ key: string; value: string; namespace?: string }>,
  ) {
    const results = await Promise.all(
      strings.map((s) =>
        this.updateString(tenantId, s.key, languageCode, s.value, s.namespace),
      ),
    );

    return { updated: results.length };
  }

  async createTranslationRequest(
    tenantId: string,
    dto: {
      sourceLanguage: string;
      targetLanguages: string[];
      contentType: string;
      content: Record<string, string> | string;
      priority?: string;
      requestedBy: string;
    },
  ) {
    const request = await this.prisma.translationRequest.create({
      data: {
        tenantId,
        sourceLanguage: dto.sourceLanguage,
        targetLanguages: dto.targetLanguages,
        contentType: dto.contentType,
        content: dto.content as unknown as Record<string, unknown>,
        priority: dto.priority || 'normal',
        requestedBy: dto.requestedBy,
      },
    });

    return request;
  }

  async getTranslationRequests(
    tenantId: string,
    status?: string,
  ) {
    const where: Record<string, unknown> = { tenantId };
    if (status) where.status = status;

    return this.prisma.translationRequest.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }
}
