import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);
  private readonly CACHE_TTL = 1800;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getLocalizedPricing(
    tenantId: string,
    localeCode: string,
    productId?: string,
  ) {
    const cacheKey = `pricing:${tenantId}:${localeCode}:${productId || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where: Record<string, unknown> = {
      tenantId,
      localeCode,
      isActive: true,
      validFrom: { lte: new Date() },
      OR: [{ validTo: null }, { validTo: { gte: new Date() } }],
    };
    if (productId) where.productId = productId;

    const pricing = await this.prisma.localizedPricing.findMany({
      where,
      include: { locale: true },
      orderBy: { validFrom: 'desc' },
    });

    // Get unique latest pricing per product/plan
    const latestPricing: Map<string, (typeof pricing)[0]> = new Map();
    for (const p of pricing) {
      const key = `${p.productId}:${p.planId || 'default'}`;
      if (!latestPricing.has(key)) {
        latestPricing.set(key, p);
      }
    }

    const result = Array.from(latestPricing.values()).map((p) => ({
      productId: p.productId,
      planId: p.planId,
      basePrice: p.basePrice,
      localPrice: p.localPrice,
      currency: {
        code: p.currencyCode,
        exchangeRate: p.exchangeRate,
      },
      tax: {
        rate: p.taxRate,
        inclusive: p.taxInclusive,
      },
      displayPrice: this.formatPrice(p.localPrice, p.currencyCode),
      validFrom: p.validFrom,
      validTo: p.validTo,
    }));

    await this.redis.set(cacheKey, result, this.CACHE_TTL);
    return result;
  }

  async getCurrencies(activeOnly = true) {
    const cacheKey = `currencies:${activeOnly}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const where = activeOnly ? { isActive: true } : {};
    const currencies = await this.prisma.currency.findMany({
      where,
      orderBy: { code: 'asc' },
    });

    await this.redis.set(cacheKey, currencies, this.CACHE_TTL);
    return currencies;
  }

  async getCurrency(code: string) {
    const currency = await this.prisma.currency.findUnique({
      where: { code },
    });
    return currency;
  }

  async convertPrice(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ) {
    const [from, to] = await Promise.all([
      this.getCurrency(fromCurrency),
      this.getCurrency(toCurrency),
    ]);

    if (!from || !to) {
      throw new Error('Currency not found');
    }

    // Convert through USD as base
    const usdAmount = amount / from.exchangeRate;
    const targetAmount = usdAmount * to.exchangeRate;

    return {
      original: {
        amount,
        currency: fromCurrency,
      },
      converted: {
        amount: Math.round(targetAmount * 100) / 100,
        currency: toCurrency,
        displayPrice: this.formatPrice(targetAmount, toCurrency),
      },
      exchangeRate: to.exchangeRate / from.exchangeRate,
    };
  }

  async setLocalizedPricing(
    tenantId: string,
    dto: {
      localeCode: string;
      productId: string;
      planId?: string;
      basePrice: number;
      localPrice: number;
      currencyCode: string;
      exchangeRate: number;
      adjustmentType?: string;
      adjustmentValue?: number;
      taxRate?: number;
      taxInclusive?: boolean;
      validFrom: Date;
      validTo?: Date;
      metadata?: Record<string, unknown>;
    },
  ) {
    const pricing = await this.prisma.localizedPricing.create({
      data: {
        tenantId,
        localeCode: dto.localeCode,
        productId: dto.productId,
        planId: dto.planId,
        basePrice: dto.basePrice,
        localPrice: dto.localPrice,
        currencyCode: dto.currencyCode,
        exchangeRate: dto.exchangeRate,
        adjustmentType: dto.adjustmentType,
        adjustmentValue: dto.adjustmentValue,
        taxRate: dto.taxRate,
        taxInclusive: dto.taxInclusive || false,
        validFrom: dto.validFrom,
        validTo: dto.validTo,
        metadata: dto.metadata || {},
      },
    });

    await this.redis.invalidatePattern(`pricing:${tenantId}:*`);

    return pricing;
  }

  private formatPrice(amount: number, currencyCode: string): string {
    const formatters: Record<string, Intl.NumberFormatOptions> = {
      USD: { style: 'currency', currency: 'USD' },
      EUR: { style: 'currency', currency: 'EUR' },
      GBP: { style: 'currency', currency: 'GBP' },
      JPY: { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 },
      CNY: { style: 'currency', currency: 'CNY' },
      INR: { style: 'currency', currency: 'INR' },
      BRL: { style: 'currency', currency: 'BRL' },
    };

    const formatter = formatters[currencyCode] || {
      style: 'currency',
      currency: currencyCode,
    };

    try {
      return new Intl.NumberFormat('en-US', formatter).format(amount);
    } catch {
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  }
}
