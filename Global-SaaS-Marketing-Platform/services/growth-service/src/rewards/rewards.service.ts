import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRewardDto, IssueRewardDto } from './dto/reward.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRewardDto) {
    return this.prisma.reward.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        value: dto.value,
        currency: dto.currency || 'USD',
        minSpend: dto.minSpend,
        maxRedemptions: dto.maxRedemptions,
        validFrom: dto.validFrom ? new Date(dto.validFrom) : null,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
      },
    });
  }

  async findAll(isActive?: boolean) {
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.prisma.reward.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const reward = await this.prisma.reward.findUnique({
      where: { id },
    });

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    return reward;
  }

  async issueReward(dto: IssueRewardDto) {
    const reward = await this.findOne(dto.rewardId);

    if (!reward.isActive) {
      throw new BadRequestException('This reward is no longer active');
    }

    if (reward.maxRedemptions && reward.totalRedemptions >= reward.maxRedemptions) {
      throw new BadRequestException('This reward has reached maximum redemptions');
    }

    if (reward.validUntil && new Date(reward.validUntil) < new Date()) {
      throw new BadRequestException('This reward has expired');
    }

    // Generate unique code
    const code = nanoid(12).toUpperCase();

    const userReward = await this.prisma.userReward.create({
      data: {
        rewardId: dto.rewardId,
        userId: dto.userId,
        code,
        earnedFrom: dto.earnedFrom,
        sourceId: dto.sourceId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : reward.validUntil,
      },
      include: {
        reward: true,
      },
    });

    return userReward;
  }

  async getUserRewards(userId: string, status?: string) {
    const where: any = {
      userId,
    };

    if (status) {
      where.status = status;
    }

    return this.prisma.userReward.findMany({
      where,
      include: {
        reward: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async redeemReward(codeOrId: string, userId: string) {
    // Try to find by code first, then by ID
    let userReward = await this.prisma.userReward.findUnique({
      where: { code: codeOrId },
      include: { reward: true },
    });

    if (!userReward) {
      userReward = await this.prisma.userReward.findFirst({
        where: { id: codeOrId, userId },
        include: { reward: true },
      });
    }

    if (!userReward) {
      throw new NotFoundException('Reward not found');
    }

    if (userReward.userId !== userId) {
      throw new BadRequestException('This reward does not belong to you');
    }

    if (userReward.status !== 'AVAILABLE') {
      throw new BadRequestException(`Reward is ${userReward.status.toLowerCase()}`);
    }

    if (userReward.expiresAt && new Date(userReward.expiresAt) < new Date()) {
      // Mark as expired
      await this.prisma.userReward.update({
        where: { id: userReward.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('This reward has expired');
    }

    // Redeem the reward
    const redeemed = await this.prisma.userReward.update({
      where: { id: userReward.id },
      data: {
        status: 'REDEEMED',
        redeemedAt: new Date(),
      },
      include: {
        reward: true,
      },
    });

    // Update reward stats
    await this.prisma.reward.update({
      where: { id: userReward.rewardId },
      data: {
        totalRedemptions: { increment: 1 },
        totalValue: { increment: Number(userReward.reward.value) },
      },
    });

    return {
      success: true,
      reward: redeemed,
      appliedValue: Number(userReward.reward.value),
      type: userReward.reward.type,
    };
  }

  async validateReward(codeOrId: string, userId: string) {
    // Try to find by code first, then by ID
    let userReward = await this.prisma.userReward.findUnique({
      where: { code: codeOrId },
      include: { reward: true },
    });

    if (!userReward) {
      userReward = await this.prisma.userReward.findFirst({
        where: { id: codeOrId, userId },
        include: { reward: true },
      });
    }

    if (!userReward) {
      return { valid: false, reason: 'Reward not found' };
    }

    if (userReward.userId !== userId) {
      return { valid: false, reason: 'This reward does not belong to you' };
    }

    if (userReward.status !== 'AVAILABLE') {
      return { valid: false, reason: `Reward is ${userReward.status.toLowerCase()}` };
    }

    if (userReward.expiresAt && new Date(userReward.expiresAt) < new Date()) {
      return { valid: false, reason: 'This reward has expired' };
    }

    return {
      valid: true,
      reward: userReward,
      value: Number(userReward.reward.value),
      type: userReward.reward.type,
      minSpend: userReward.reward.minSpend ? Number(userReward.reward.minSpend) : null,
    };
  }

  async cancelReward(userRewardId: string) {
    const userReward = await this.prisma.userReward.findUnique({
      where: { id: userRewardId },
    });

    if (!userReward) {
      throw new NotFoundException('User reward not found');
    }

    if (userReward.status !== 'AVAILABLE') {
      throw new BadRequestException('Only available rewards can be cancelled');
    }

    return this.prisma.userReward.update({
      where: { id: userRewardId },
      data: { status: 'CANCELLED' },
    });
  }

  async getRewardStats(rewardId: string) {
    const reward = await this.findOne(rewardId);

    const stats = await this.prisma.userReward.groupBy({
      by: ['status'],
      where: { rewardId },
      _count: true,
    });

    const bySource = await this.prisma.userReward.groupBy({
      by: ['earnedFrom'],
      where: { rewardId },
      _count: true,
    });

    return {
      reward,
      statusBreakdown: stats.map((s) => ({
        status: s.status,
        count: s._count,
      })),
      sourceBreakdown: bySource.map((s) => ({
        source: s.earnedFrom || 'Unknown',
        count: s._count,
      })),
    };
  }
}
