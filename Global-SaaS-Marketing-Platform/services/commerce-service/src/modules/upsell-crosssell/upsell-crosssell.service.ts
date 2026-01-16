import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../config/redis.service';
import {
  CreateOfferDto,
  UpdateOfferDto,
  OfferResponseDto,
  GetOffersQueryDto,
  OfferWithProductsDto,
  OfferType,
  DiscountDto,
  TargetingDto,
} from './dto/offer.dto';

@Injectable()
export class UpsellCrosssellService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'offer:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateOfferDto): Promise<OfferResponseDto> {
    const existing = await this.prisma.offer.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Offer with key ${dto.key} already exists`);
    }

    const offer = await this.prisma.offer.create({
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        type: dto.type,
        sourceProducts: dto.sourceProducts,
        targetProducts: dto.targetProducts,
        discount: dto.discount as any,
        priority: dto.priority ?? 0,
        targeting: dto.targeting as any,
        isActive: dto.isActive ?? true,
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
    });

    return this.mapToResponse(offer);
  }

  async getUpsellOffers(query: GetOffersQueryDto): Promise<OfferWithProductsDto[]> {
    return this.getOffers({ ...query, type: OfferType.UPSELL });
  }

  async getCrossSellOffers(query: GetOffersQueryDto): Promise<OfferWithProductsDto[]> {
    return this.getOffers({ ...query, type: OfferType.CROSS_SELL });
  }

  async getOffers(query: GetOffersQueryDto): Promise<OfferWithProductsDto[]> {
    const { userId, productId, cartProducts = [], type, limit = 5 } = query;

    const now = new Date();

    // Build where clause
    const where: any = {
      isActive: true,
      OR: [
        { startDate: null },
        { startDate: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { endDate: null },
            { endDate: { gte: now } },
          ],
        },
      ],
    };

    if (type) {
      where.type = type;
    }

    // Find offers matching source products
    const sourceProductIds = productId ? [productId, ...cartProducts] : cartProducts;
    if (sourceProductIds.length > 0) {
      where.sourceProducts = {
        hasSome: sourceProductIds,
      };
    }

    const offers = await this.prisma.offer.findMany({
      where,
      orderBy: { priority: 'desc' },
      take: limit * 2, // Fetch more to filter after targeting evaluation
    });

    // Filter by targeting and apply limit
    const matchingOffers: OfferWithProductsDto[] = [];

    for (const offer of offers) {
      if (matchingOffers.length >= limit) break;

      // Evaluate targeting
      if (await this.evaluateTargeting(userId, offer.targeting as TargetingDto | null)) {
        const offerWithProducts = await this.enrichOfferWithProducts(offer);
        matchingOffers.push(offerWithProducts);

        // Track impression
        await this.trackImpression(offer.id);
      }
    }

    return matchingOffers;
  }

  async trackClick(offerId: string): Promise<void> {
    await this.prisma.offer.update({
      where: { id: offerId },
      data: { clicks: { increment: 1 } },
    });
  }

  async trackConversion(offerId: string): Promise<void> {
    await this.prisma.offer.update({
      where: { id: offerId },
      data: { conversions: { increment: 1 } },
    });
  }

  private async trackImpression(offerId: string): Promise<void> {
    await this.prisma.offer.update({
      where: { id: offerId },
      data: { impressions: { increment: 1 } },
    });
  }

  private async evaluateTargeting(
    userId: string,
    targeting: TargetingDto | null,
  ): Promise<boolean> {
    if (!targeting) return true;

    // In a real implementation, you'd fetch user data and evaluate targeting rules
    // For now, return true
    return true;
  }

  private async enrichOfferWithProducts(offer: any): Promise<OfferWithProductsDto> {
    const response = this.mapToResponse(offer);

    // In a real implementation, you'd fetch product details from a product service
    // For now, return mock product data
    const products = offer.targetProducts.map((productId: string, index: number) => {
      const basePrice = 99.99 + index * 50;
      let discountedPrice: number | undefined;

      if (offer.discount) {
        const discount = offer.discount as DiscountDto;
        if (discount.type === 'percentage') {
          discountedPrice = basePrice * (1 - discount.value / 100);
          if (discount.maxAmount) {
            discountedPrice = Math.max(discountedPrice, basePrice - discount.maxAmount);
          }
        } else {
          discountedPrice = basePrice - discount.value;
        }
      }

      return {
        id: productId,
        name: `Product ${productId}`,
        price: basePrice,
        discountedPrice,
        imageUrl: `https://example.com/products/${productId}.jpg`,
      };
    });

    return {
      ...response,
      products,
    };
  }

  private mapToResponse(offer: any): OfferResponseDto {
    const impressions = offer.impressions || 0;
    const conversions = offer.conversions || 0;
    const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;

    return {
      id: offer.id,
      key: offer.key,
      name: offer.name,
      description: offer.description || undefined,
      type: offer.type as OfferType,
      sourceProducts: offer.sourceProducts,
      targetProducts: offer.targetProducts,
      discount: offer.discount as DiscountDto | undefined,
      priority: offer.priority,
      targeting: offer.targeting as TargetingDto | undefined,
      isActive: offer.isActive,
      startDate: offer.startDate || undefined,
      endDate: offer.endDate || undefined,
      impressions,
      clicks: offer.clicks || 0,
      conversions,
      conversionRate,
      createdAt: offer.createdAt,
      updatedAt: offer.updatedAt,
    };
  }
}
