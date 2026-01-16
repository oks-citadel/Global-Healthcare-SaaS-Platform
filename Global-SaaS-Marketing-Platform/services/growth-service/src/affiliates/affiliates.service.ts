import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAffiliateProgramDto,
  EnrollAffiliateDto,
  TrackConversionDto,
  AffiliatePayoutSummaryDto,
} from './dto/affiliate.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class AffiliatesService {
  constructor(private readonly prisma: PrismaService) {}

  async createProgram(dto: CreateAffiliateProgramDto) {
    return this.prisma.affiliateProgram.create({
      data: {
        name: dto.name,
        description: dto.description,
        commissionType: dto.commissionType || 'PERCENTAGE',
        commissionRate: dto.commissionRate,
        minPayout: dto.minPayout || 50,
        payoutFrequency: dto.payoutFrequency || 'MONTHLY',
        cookieDuration: dto.cookieDuration || 30,
        termsUrl: dto.termsUrl,
      },
    });
  }

  async getPrograms() {
    return this.prisma.affiliateProgram.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async enrollAffiliate(dto: EnrollAffiliateDto) {
    const program = await this.prisma.affiliateProgram.findUnique({
      where: { id: dto.programId },
    });

    if (!program) {
      throw new NotFoundException('Affiliate program not found');
    }

    if (program.status !== 'ACTIVE') {
      throw new BadRequestException('Affiliate program is not accepting new affiliates');
    }

    // Check if already enrolled
    const existing = await this.prisma.affiliate.findFirst({
      where: {
        programId: dto.programId,
        userId: dto.userId,
      },
    });

    if (existing) {
      throw new ConflictException('User is already enrolled in this affiliate program');
    }

    // Generate unique affiliate code
    let affiliateCode = nanoid(10).toUpperCase();
    while (await this.prisma.affiliate.findUnique({ where: { affiliateCode } })) {
      affiliateCode = nanoid(10).toUpperCase();
    }

    const affiliate = await this.prisma.affiliate.create({
      data: {
        programId: dto.programId,
        userId: dto.userId,
        affiliateCode,
        companyName: dto.companyName,
        website: dto.website,
        promotionMethods: dto.promotionMethods || [],
        paypalEmail: dto.paypalEmail,
        bankDetails: dto.bankDetails,
        taxId: dto.taxId,
      },
      include: {
        program: true,
      },
    });

    return {
      ...affiliate,
      affiliateUrl: this.buildAffiliateUrl(affiliateCode),
    };
  }

  async trackConversion(dto: TrackConversionDto) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { affiliateCode: dto.affiliateCode },
      include: {
        program: true,
      },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    if (affiliate.status !== 'APPROVED') {
      throw new BadRequestException('Affiliate is not approved');
    }

    // Calculate commission
    let commissionAmount: number;
    if (affiliate.program.commissionType === 'PERCENTAGE') {
      commissionAmount = (dto.orderAmount * Number(affiliate.program.commissionRate)) / 100;
    } else {
      commissionAmount = Number(affiliate.program.commissionRate);
    }

    // Check for duplicate conversion
    const existingConversion = await this.prisma.affiliateConversion.findFirst({
      where: {
        affiliateId: affiliate.id,
        orderId: dto.orderId,
      },
    });

    if (existingConversion) {
      throw new ConflictException('Conversion already tracked for this order');
    }

    // Create conversion record
    const conversion = await this.prisma.affiliateConversion.create({
      data: {
        affiliateId: affiliate.id,
        orderId: dto.orderId,
        customerId: dto.customerId,
        orderAmount: dto.orderAmount,
        commissionAmount,
        clickId: dto.clickId,
        metadata: dto.metadata,
      },
    });

    // Update affiliate stats
    await this.prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalConversions: { increment: 1 },
        totalRevenue: { increment: dto.orderAmount },
        pendingCommission: { increment: commissionAmount },
      },
    });

    return conversion;
  }

  async trackClick(affiliateCode: string, metadata?: { ip?: string; userAgent?: string }) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { affiliateCode },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    await this.prisma.affiliate.update({
      where: { affiliateCode },
      data: {
        totalClicks: { increment: 1 },
      },
    });

    return { success: true, affiliateId: affiliate.id };
  }

  async getPayoutSummary(affiliateId: string): Promise<AffiliatePayoutSummaryDto> {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { id: affiliateId },
      include: {
        program: true,
        payouts: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    // Calculate paid commission
    const paidCommissions = await this.prisma.affiliatePayout.aggregate({
      where: {
        affiliateId,
        status: 'COMPLETED',
      },
      _sum: {
        amount: true,
      },
    });

    const paidCommission = Number(paidCommissions._sum.amount) || 0;
    const pendingCommission = Number(affiliate.pendingCommission);
    const totalEarnings = Number(affiliate.totalCommission) + pendingCommission;

    // Calculate next payout date based on frequency
    const nextPayoutDate = this.calculateNextPayoutDate(affiliate.program.payoutFrequency);

    return {
      affiliateId: affiliate.id,
      affiliateCode: affiliate.affiliateCode,
      totalEarnings,
      pendingCommission,
      paidCommission,
      nextPayoutDate,
      minPayoutThreshold: Number(affiliate.program.minPayout),
      eligibleForPayout: pendingCommission >= Number(affiliate.program.minPayout),
      recentPayouts: affiliate.payouts.map((p) => ({
        id: p.id,
        affiliateId: p.affiliateId,
        amount: Number(p.amount),
        currency: p.currency,
        status: p.status,
        method: p.method || undefined,
        transactionId: p.transactionId || undefined,
        processedAt: p.processedAt || undefined,
        createdAt: p.createdAt,
      })),
    };
  }

  async approveAffiliate(affiliateId: string) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { id: affiliateId },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    if (affiliate.status !== 'PENDING') {
      throw new BadRequestException('Affiliate is not pending approval');
    }

    return this.prisma.affiliate.update({
      where: { id: affiliateId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      },
    });
  }

  async getAffiliateByCode(affiliateCode: string) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { affiliateCode },
      include: {
        program: true,
      },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    return affiliate;
  }

  async getAffiliateStats(affiliateId: string) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { id: affiliateId },
      include: {
        conversions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    const conversionRate =
      affiliate.totalClicks > 0
        ? (affiliate.totalConversions / affiliate.totalClicks) * 100
        : 0;

    return {
      totalClicks: affiliate.totalClicks,
      totalConversions: affiliate.totalConversions,
      conversionRate: Math.round(conversionRate * 100) / 100,
      totalRevenue: Number(affiliate.totalRevenue),
      totalCommission: Number(affiliate.totalCommission),
      pendingCommission: Number(affiliate.pendingCommission),
      recentConversions: affiliate.conversions,
    };
  }

  private buildAffiliateUrl(affiliateCode: string): string {
    const baseUrl = process.env.AFFILIATE_URL_BASE || 'https://example.com/a';
    return `${baseUrl}/${affiliateCode}`;
  }

  private calculateNextPayoutDate(frequency: string): Date {
    const now = new Date();
    const nextPayout = new Date();

    switch (frequency) {
      case 'WEEKLY':
        nextPayout.setDate(now.getDate() + (7 - now.getDay()));
        break;
      case 'BIWEEKLY':
        nextPayout.setDate(now.getDate() + (14 - (now.getDate() % 14)));
        break;
      case 'MONTHLY':
        nextPayout.setMonth(now.getMonth() + 1, 1);
        break;
      case 'QUARTERLY':
        const quarter = Math.floor(now.getMonth() / 3);
        nextPayout.setMonth((quarter + 1) * 3, 1);
        break;
      default:
        nextPayout.setMonth(now.getMonth() + 1, 1);
    }

    return nextPayout;
  }
}
