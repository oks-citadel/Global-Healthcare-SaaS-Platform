import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import * as geoip from 'geoip-lite';

interface GeoData {
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
  ll: [number, number] | null;
}

@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);
  private readonly CACHE_TTL = 3600;

  // Country to locale mapping
  private readonly countryLocaleMap: Record<string, string> = {
    US: 'en-US',
    GB: 'en-GB',
    CA: 'en-CA',
    AU: 'en-AU',
    DE: 'de-DE',
    FR: 'fr-FR',
    ES: 'es-ES',
    MX: 'es-MX',
    BR: 'pt-BR',
    JP: 'ja-JP',
    CN: 'zh-CN',
    IN: 'en-IN',
    IT: 'it-IT',
    NL: 'nl-NL',
    SE: 'sv-SE',
    NO: 'nb-NO',
    DK: 'da-DK',
    FI: 'fi-FI',
    PL: 'pl-PL',
    RU: 'ru-RU',
    KR: 'ko-KR',
  };

  // Country to currency mapping
  private readonly countryCurrencyMap: Record<string, string> = {
    US: 'USD',
    GB: 'GBP',
    EU: 'EUR',
    DE: 'EUR',
    FR: 'EUR',
    ES: 'EUR',
    IT: 'EUR',
    NL: 'EUR',
    CA: 'CAD',
    AU: 'AUD',
    JP: 'JPY',
    CN: 'CNY',
    IN: 'INR',
    BR: 'BRL',
    MX: 'MXN',
    KR: 'KRW',
    RU: 'RUB',
    CH: 'CHF',
    SE: 'SEK',
    NO: 'NOK',
    DK: 'DKK',
  };

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async detectGeo(ip: string) {
    const cacheKey = `geo:${ip}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const geo = geoip.lookup(ip);

    const result = {
      ip,
      country: geo?.country || null,
      region: geo?.region || null,
      city: geo?.city || null,
      timezone: geo?.timezone || null,
      coordinates: geo?.ll || null,
      suggestedLocale: this.getSuggestedLocale(geo?.country),
      suggestedCurrency: this.getSuggestedCurrency(geo?.country),
      complianceRegion: this.getComplianceRegion(geo?.country),
    };

    await this.redis.set(cacheKey, result, this.CACHE_TTL);
    return result;
  }

  async getGeoContent(
    tenantId: string,
    localeCode: string,
    contentType: string,
    contentKey?: string,
  ) {
    const cacheKey = `geo-content:${tenantId}:${localeCode}:${contentType}:${contentKey || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: Record<string, unknown> = {
      tenantId,
      localeCode,
      contentType,
      isActive: true,
      OR: [
        { validFrom: null },
        { validFrom: { lte: new Date() } },
      ],
    };
    if (contentKey) where.contentKey = contentKey;

    const content = await this.prisma.localizedContent.findMany({
      where,
    });

    // Filter by validity period
    const validContent = content.filter((c) => {
      if (c.validTo && c.validTo < new Date()) return false;
      return true;
    });

    const result = contentKey
      ? validContent[0]?.content || null
      : validContent.reduce(
          (acc, c) => {
            acc[c.contentKey] = c.content;
            return acc;
          },
          {} as Record<string, unknown>,
        );

    await this.redis.set(cacheKey, result, this.CACHE_TTL);
    return result;
  }

  async setGeoContent(
    tenantId: string,
    dto: {
      localeCode: string;
      contentType: string;
      contentKey: string;
      content: Record<string, unknown>;
      validFrom?: Date;
      validTo?: Date;
      metadata?: Record<string, unknown>;
    },
  ) {
    const content = await this.prisma.localizedContent.upsert({
      where: {
        tenantId_localeCode_contentType_contentKey: {
          tenantId,
          localeCode: dto.localeCode,
          contentType: dto.contentType,
          contentKey: dto.contentKey,
        },
      },
      update: {
        content: dto.content,
        validFrom: dto.validFrom,
        validTo: dto.validTo,
        metadata: dto.metadata || {},
      },
      create: {
        tenantId,
        localeCode: dto.localeCode,
        contentType: dto.contentType,
        contentKey: dto.contentKey,
        content: dto.content,
        validFrom: dto.validFrom,
        validTo: dto.validTo,
        metadata: dto.metadata || {},
      },
    });

    await this.redis.invalidatePattern(`geo-content:${tenantId}:*`);

    return content;
  }

  private getSuggestedLocale(country: string | undefined): string {
    if (!country) return 'en-US';
    return this.countryLocaleMap[country] || 'en-US';
  }

  private getSuggestedCurrency(country: string | undefined): string {
    if (!country) return 'USD';
    return this.countryCurrencyMap[country] || 'USD';
  }

  private getComplianceRegion(country: string | undefined): string {
    if (!country) return 'global';

    // EU countries
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
    ];

    if (euCountries.includes(country)) return 'GDPR';
    if (country === 'US') return 'CCPA';
    if (country === 'BR') return 'LGPD';
    if (country === 'GB') return 'UK_GDPR';
    if (country === 'CA') return 'PIPEDA';

    return 'global';
  }
}
