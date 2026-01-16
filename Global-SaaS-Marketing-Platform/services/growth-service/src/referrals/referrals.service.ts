import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReferralProgramDto,
  GenerateReferralCodeDto,
  RedeemReferralDto,
  ReferralTrackingDto,
} from './dto/referral.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class ReferralsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProgram(dto: CreateReferralProgramDto) {
    return this.prisma.referralProgram.create({
      data: {
        name: dto.name,
        description: dto.description,
        referrerReward: dto.referrerReward,
        refereeReward: dto.refereeReward,
        rewardType: dto.rewardType || 'CREDIT',
        rewardCurrency: dto.rewardCurrency || 'USD',
        maxRedemptions: dto.maxRedemptions,
        minPurchaseAmount: dto.minPurchaseAmount,
        expirationDays: dto.expirationDays,
        maxReferralsPerUser: dto.maxReferralsPerUser,
        totalBudget: dto.totalBudget,
      },
    });
  }

  async getPrograms() {
    return this.prisma.referralProgram.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateCode(dto: GenerateReferralCodeDto) {
    const program = await this.prisma.referralProgram.findUnique({
      where: { id: dto.programId },
    });

    if (!program) {
      throw new NotFoundException('Referral program not found');
    }

    if (program.status !== 'ACTIVE') {
      throw new BadRequestException('Referral program is not active');
    }

    // Check if user already has a code for this program
    const existingCode = await this.prisma.referralCode.findFirst({
      where: {
        programId: dto.programId,
        referrerId: dto.referrerId,
      },
    });

    if (existingCode) {
      return {
        ...existingCode,
        referralUrl: this.buildReferralUrl(existingCode.code),
      };
    }

    // Generate unique code
    let code = dto.customCode || nanoid(8).toUpperCase();

    // Check if custom code already exists
    if (dto.customCode) {
      const codeExists = await this.prisma.referralCode.findUnique({
        where: { code },
      });
      if (codeExists) {
        throw new ConflictException('This referral code already exists');
      }
    } else {
      // Generate until unique
      while (await this.prisma.referralCode.findUnique({ where: { code } })) {
        code = nanoid(8).toUpperCase();
      }
    }

    const expiresAt = program.expirationDays
      ? new Date(Date.now() + program.expirationDays * 24 * 60 * 60 * 1000)
      : null;

    const referralCode = await this.prisma.referralCode.create({
      data: {
        programId: dto.programId,
        code,
        referrerId: dto.referrerId,
        expiresAt,
      },
    });

    return {
      ...referralCode,
      referralUrl: this.buildReferralUrl(code),
    };
  }

  async redeemCode(dto: RedeemReferralDto) {
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code: dto.code },
      include: {
        program: true,
        redemptions: true,
      },
    });

    if (!referralCode) {
      throw new NotFoundException('Referral code not found');
    }

    if (!referralCode.isActive) {
      throw new BadRequestException('This referral code is no longer active');
    }

    if (referralCode.expiresAt && referralCode.expiresAt < new Date()) {
      throw new BadRequestException('This referral code has expired');
    }

    // Check if referee already used a referral
    const existingRedemption = await this.prisma.referralRedemption.findFirst({
      where: {
        refereeId: dto.refereeId,
      },
    });

    if (existingRedemption) {
      throw new BadRequestException('User has already redeemed a referral code');
    }

    // Check if self-referral
    if (referralCode.referrerId === dto.refereeId) {
      throw new BadRequestException('Cannot redeem your own referral code');
    }

    // Check max redemptions
    if (
      referralCode.program.maxRedemptions &&
      referralCode.redemptions.length >= referralCode.program.maxRedemptions
    ) {
      throw new BadRequestException('This referral code has reached its maximum redemptions');
    }

    // Check program budget
    const potentialSpend =
      Number(referralCode.program.currentSpend) +
      Number(referralCode.program.referrerReward) +
      Number(referralCode.program.refereeReward);

    if (
      referralCode.program.totalBudget &&
      potentialSpend > Number(referralCode.program.totalBudget)
    ) {
      throw new BadRequestException('Referral program budget has been exhausted');
    }

    // Create redemption
    const redemption = await this.prisma.referralRedemption.create({
      data: {
        referralCodeId: referralCode.id,
        refereeId: dto.refereeId,
        referrerRewardAmount: referralCode.program.referrerReward,
        refereeRewardAmount: referralCode.program.refereeReward,
        metadata: dto.metadata,
      },
    });

    // Update referral code stats
    await this.prisma.referralCode.update({
      where: { id: referralCode.id },
      data: {
        totalSignups: { increment: 1 },
      },
    });

    return redemption;
  }

  async trackReferral(code: string): Promise<ReferralTrackingDto> {
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code },
      include: {
        program: true,
        redemptions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!referralCode) {
      throw new NotFoundException('Referral code not found');
    }

    const pendingRewards = await this.prisma.referralRedemption.aggregate({
      where: {
        referralCodeId: referralCode.id,
        status: { in: ['PENDING', 'QUALIFIED'] },
      },
      _sum: {
        referrerRewardAmount: true,
      },
    });

    const conversionRate =
      referralCode.totalClicks > 0
        ? (referralCode.totalConversions / referralCode.totalClicks) * 100
        : 0;

    return {
      code: referralCode.code,
      programName: referralCode.program.name,
      totalClicks: referralCode.totalClicks,
      totalSignups: referralCode.totalSignups,
      totalConversions: referralCode.totalConversions,
      conversionRate: Math.round(conversionRate * 100) / 100,
      totalRewardsEarned: Number(referralCode.totalRewardsEarned),
      pendingRewards: Number(pendingRewards._sum.referrerRewardAmount) || 0,
      recentRedemptions: referralCode.redemptions.map((r) => ({
        id: r.id,
        status: r.status,
        rewardAmount: Number(r.referrerRewardAmount),
        createdAt: r.createdAt,
      })),
    };
  }

  async trackClick(code: string) {
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code },
    });

    if (!referralCode) {
      throw new NotFoundException('Referral code not found');
    }

    await this.prisma.referralCode.update({
      where: { code },
      data: {
        totalClicks: { increment: 1 },
      },
    });

    return { success: true };
  }

  async completeReferral(redemptionId: string, orderId?: string) {
    const redemption = await this.prisma.referralRedemption.findUnique({
      where: { id: redemptionId },
      include: {
        referralCode: {
          include: {
            program: true,
          },
        },
      },
    });

    if (!redemption) {
      throw new NotFoundException('Redemption not found');
    }

    if (redemption.status !== 'PENDING' && redemption.status !== 'QUALIFIED') {
      throw new BadRequestException('Redemption cannot be completed');
    }

    // Update redemption status
    await this.prisma.referralRedemption.update({
      where: { id: redemptionId },
      data: {
        status: 'REWARDED',
        completedAt: new Date(),
        referrerRewardPaidAt: new Date(),
        refereeRewardPaidAt: new Date(),
      },
    });

    // Update referral code stats
    await this.prisma.referralCode.update({
      where: { id: redemption.referralCodeId },
      data: {
        totalConversions: { increment: 1 },
        totalRewardsEarned: {
          increment: Number(redemption.referrerRewardAmount) || 0,
        },
      },
    });

    // Update program spend
    await this.prisma.referralProgram.update({
      where: { id: redemption.referralCode.programId },
      data: {
        currentSpend: {
          increment:
            (Number(redemption.referrerRewardAmount) || 0) +
            (Number(redemption.refereeRewardAmount) || 0),
        },
      },
    });

    return { success: true, message: 'Referral completed and rewards issued' };
  }

  private buildReferralUrl(code: string): string {
    const baseUrl = process.env.REFERRAL_URL_BASE || 'https://example.com/r';
    return `${baseUrl}/${code}`;
  }
}
