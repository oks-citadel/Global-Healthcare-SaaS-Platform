import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../config/redis.service';
import {
  CreateCouponDto,
  UpdateCouponDto,
  CouponQueryDto,
  PaginatedCouponsDto,
  CouponResponseDto,
  ValidateCouponDto,
  ValidationResultDto,
  RedeemCouponDto,
  RedemptionResponseDto,
  CouponType,
} from './dto/coupon.dto';

@Injectable()
export class PromotionsService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'coupon:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateCouponDto): Promise<CouponResponseDto> {
    const existing = await this.prisma.coupon.findUnique({
      where: { code: dto.code.toUpperCase() },
    });

    if (existing) {
      throw new ConflictException(`Coupon with code ${dto.code} already exists`);
    }

    if (dto.startDate >= dto.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const coupon = await this.prisma.coupon.create({
      data: {
        code: dto.code.toUpperCase(),
        name: dto.name,
        description: dto.description,
        type: dto.type,
        value: dto.value,
        minPurchase: dto.minPurchase,
        maxDiscount: dto.maxDiscount,
        applicableProducts: dto.applicableProducts || [],
        applicablePlans: dto.applicablePlans || [],
        usageLimit: dto.usageLimit,
        perUserLimit: dto.perUserLimit,
        isActive: dto.isActive ?? true,
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
    });

    return this.mapToResponse(coupon);
  }

  async findAll(query: CouponQueryDto): Promise<PaginatedCouponsDto> {
    const { page = 1, limit = 20, isActive, type, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { code: { contains: search.toUpperCase(), mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return {
      items: items.map((item) => this.mapToResponse(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByCode(code: string): Promise<CouponResponseDto> {
    const normalizedCode = code.toUpperCase();

    // Try cache first
    const cached = await this.redis.get<CouponResponseDto>(
      `${this.CACHE_PREFIX}${normalizedCode}`,
    );
    if (cached) return cached;

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${code} not found`);
    }

    const response = this.mapToResponse(coupon);

    // Cache the result
    await this.redis.set(
      `${this.CACHE_PREFIX}${normalizedCode}`,
      response,
      this.CACHE_TTL,
    );

    return response;
  }

  async validate(
    code: string,
    dto: ValidateCouponDto,
  ): Promise<ValidationResultDto> {
    const normalizedCode = code.toUpperCase();

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${code} not found`);
    }

    const response = this.mapToResponse(coupon);
    const now = new Date();

    // Check if coupon is active
    if (!coupon.isActive) {
      return {
        isValid: false,
        error: 'Coupon is not active',
        coupon: response,
      };
    }

    // Check date validity
    if (now < coupon.startDate) {
      return {
        isValid: false,
        error: 'Coupon is not yet valid',
        coupon: response,
      };
    }

    if (now > coupon.endDate) {
      return {
        isValid: false,
        error: 'Coupon has expired',
        coupon: response,
      };
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return {
        isValid: false,
        error: 'Coupon usage limit reached',
        coupon: response,
      };
    }

    // Check per-user limit
    if (coupon.perUserLimit) {
      const userRedemptions = await this.prisma.couponRedemption.count({
        where: {
          couponId: coupon.id,
          userId: dto.userId,
        },
      });

      if (userRedemptions >= coupon.perUserLimit) {
        return {
          isValid: false,
          error: 'You have already used this coupon the maximum number of times',
          coupon: response,
        };
      }
    }

    // Check applicable products
    if (dto.productId && coupon.applicableProducts.length > 0) {
      if (!coupon.applicableProducts.includes(dto.productId)) {
        return {
          isValid: false,
          error: 'Coupon is not valid for this product',
          coupon: response,
        };
      }
    }

    // Check applicable plans
    if (dto.planId && coupon.applicablePlans.length > 0) {
      if (!coupon.applicablePlans.includes(dto.planId)) {
        return {
          isValid: false,
          error: 'Coupon is not valid for this plan',
          coupon: response,
        };
      }
    }

    // Check minimum purchase
    if (dto.purchaseAmount !== undefined && coupon.minPurchase) {
      if (dto.purchaseAmount < coupon.minPurchase) {
        return {
          isValid: false,
          error: `Minimum purchase amount of ${coupon.minPurchase} required`,
          coupon: response,
        };
      }
    }

    // Calculate discount
    let discount = 0;
    if (dto.purchaseAmount !== undefined) {
      if (coupon.type === CouponType.PERCENTAGE) {
        discount = dto.purchaseAmount * (coupon.value / 100);
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else if (coupon.type === CouponType.FIXED_AMOUNT) {
        discount = Math.min(coupon.value, dto.purchaseAmount);
      }
    }

    const finalAmount = dto.purchaseAmount !== undefined
      ? dto.purchaseAmount - discount
      : undefined;

    return {
      isValid: true,
      discount,
      finalAmount,
      coupon: response,
    };
  }

  async redeem(code: string, dto: RedeemCouponDto): Promise<RedemptionResponseDto> {
    const normalizedCode = code.toUpperCase();

    // Validate first
    const validation = await this.validate(normalizedCode, {
      userId: dto.userId,
    });

    if (!validation.isValid) {
      throw new BadRequestException(validation.error);
    }

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${code} not found`);
    }

    // Create redemption and increment usage count
    const [redemption] = await this.prisma.$transaction([
      this.prisma.couponRedemption.create({
        data: {
          couponId: coupon.id,
          userId: dto.userId,
          orderId: dto.orderId,
          discount: dto.discount,
        },
      }),
      this.prisma.coupon.update({
        where: { id: coupon.id },
        data: { usageCount: { increment: 1 } },
      }),
    ]);

    // Invalidate cache
    await this.redis.del(`${this.CACHE_PREFIX}${normalizedCode}`);

    return {
      id: redemption.id,
      couponId: coupon.id,
      couponCode: coupon.code,
      userId: redemption.userId,
      orderId: redemption.orderId || undefined,
      discount: redemption.discount,
      redeemedAt: redemption.redeemedAt,
    };
  }

  private mapToResponse(coupon: any): CouponResponseDto {
    const now = new Date();
    const isValid =
      coupon.isActive &&
      now >= coupon.startDate &&
      now <= coupon.endDate &&
      (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit);

    return {
      id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || undefined,
      type: coupon.type as CouponType,
      value: coupon.value,
      minPurchase: coupon.minPurchase || undefined,
      maxDiscount: coupon.maxDiscount || undefined,
      applicableProducts: coupon.applicableProducts || [],
      applicablePlans: coupon.applicablePlans || [],
      usageLimit: coupon.usageLimit || undefined,
      usageCount: coupon.usageCount,
      perUserLimit: coupon.perUserLimit || undefined,
      isActive: coupon.isActive,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      isValid,
      createdAt: coupon.createdAt,
      updatedAt: coupon.updatedAt,
    };
  }
}
