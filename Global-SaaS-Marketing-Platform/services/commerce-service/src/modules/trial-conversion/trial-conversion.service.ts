import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../config/redis.service';
import {
  CreateTrialUserDto,
  UpdateTrialUserDto,
  TrialUserResponseDto,
  TrialConversionQueryDto,
  ConversionMetricsDto,
  CreateNudgeDto,
  NudgeResponseDto,
  TrialAtRiskDto,
  TrialStatus,
  NudgeType,
  NudgeChannel,
  NudgeContentDto,
} from './dto/trial.dto';

@Injectable()
export class TrialConversionService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'trial:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async createTrialUser(dto: CreateTrialUserDto): Promise<TrialUserResponseDto> {
    const existing = await this.prisma.trialUser.findUnique({
      where: { userId: dto.userId },
    });

    if (existing) {
      throw new ConflictException(`Trial user with ID ${dto.userId} already exists`);
    }

    const trialUser = await this.prisma.trialUser.create({
      data: {
        userId: dto.userId,
        email: dto.email,
        planId: dto.planId,
        trialStartDate: dto.trialStartDate,
        trialEndDate: dto.trialEndDate,
        status: TrialStatus.ACTIVE,
        metadata: dto.metadata,
      },
    });

    return this.mapToResponse(trialUser);
  }

  async updateTrialUser(
    userId: string,
    dto: UpdateTrialUserDto,
  ): Promise<TrialUserResponseDto> {
    const existing = await this.prisma.trialUser.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException(`Trial user with ID ${userId} not found`);
    }

    const updateData: any = {
      email: dto.email,
      planId: dto.planId,
      trialStartDate: dto.trialStartDate,
      trialEndDate: dto.trialEndDate,
      status: dto.status,
      engagementScore: dto.engagementScore,
      lastActivityAt: dto.lastActivityAt,
      metadata: dto.metadata,
    };

    // If status is being changed to CONVERTED, set convertedAt
    if (dto.status === TrialStatus.CONVERTED && existing.status !== TrialStatus.CONVERTED) {
      updateData.convertedAt = new Date();
    }

    const trialUser = await this.prisma.trialUser.update({
      where: { userId },
      data: updateData,
    });

    // Invalidate cache
    await this.redis.del(`${this.CACHE_PREFIX}${userId}`);

    return this.mapToResponse(trialUser);
  }

  async getConversionMetrics(query: TrialConversionQueryDto): Promise<ConversionMetricsDto> {
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.planId) {
      where.planId = query.planId;
    }

    // Get all trial users matching the query
    const allTrials = await this.prisma.trialUser.findMany({ where });

    const totalTrials = allTrials.length;
    const activeTrials = allTrials.filter((t) => t.status === TrialStatus.ACTIVE).length;
    const convertedTrials = allTrials.filter((t) => t.status === TrialStatus.CONVERTED).length;
    const expiredTrials = allTrials.filter((t) => t.status === TrialStatus.EXPIRED).length;
    const cancelledTrials = allTrials.filter((t) => t.status === TrialStatus.CANCELLED).length;

    const conversionRate = totalTrials > 0 ? (convertedTrials / totalTrials) * 100 : 0;

    const avgEngagementScore =
      allTrials.length > 0
        ? allTrials.reduce((sum, t) => sum + t.engagementScore, 0) / allTrials.length
        : 0;

    // Calculate average days to convert
    const convertedUsers = allTrials.filter((t) => t.status === TrialStatus.CONVERTED && t.convertedAt);
    const avgDaysToConvert =
      convertedUsers.length > 0
        ? convertedUsers.reduce((sum, t) => {
            const days = Math.floor(
              (t.convertedAt!.getTime() - t.trialStartDate.getTime()) / (1000 * 60 * 60 * 24),
            );
            return sum + days;
          }, 0) / convertedUsers.length
        : 0;

    // Group by plan
    const trialsByPlan: Record<string, number> = {};
    const conversionsByPlan: Record<string, number> = {};

    for (const trial of allTrials) {
      const planKey = trial.planId || 'unknown';
      trialsByPlan[planKey] = (trialsByPlan[planKey] || 0) + 1;
      if (trial.status === TrialStatus.CONVERTED) {
        conversionsByPlan[planKey] = (conversionsByPlan[planKey] || 0) + 1;
      }
    }

    return {
      totalTrials,
      activeTrials,
      convertedTrials,
      expiredTrials,
      cancelledTrials,
      conversionRate,
      avgEngagementScore,
      avgDaysToConvert,
      trialsByPlan,
      conversionsByPlan,
    };
  }

  async getTrialsAtRisk(query: TrialConversionQueryDto): Promise<TrialAtRiskDto[]> {
    const now = new Date();

    // Find active trials
    const where: any = {
      status: TrialStatus.ACTIVE,
    };

    if (query.planId) {
      where.planId = query.planId;
    }

    if (query.daysRemainingMax) {
      const maxEndDate = new Date();
      maxEndDate.setDate(maxEndDate.getDate() + query.daysRemainingMax);
      where.trialEndDate = { lte: maxEndDate };
    }

    if (query.maxEngagementScore !== undefined) {
      where.engagementScore = { lte: query.maxEngagementScore };
    }

    const trials = await this.prisma.trialUser.findMany({
      where,
      orderBy: { trialEndDate: 'asc' },
    });

    return trials.map((trial) => this.calculateRisk(trial, now));
  }

  async sendNudge(dto: CreateNudgeDto): Promise<NudgeResponseDto> {
    const trialUser = await this.prisma.trialUser.findUnique({
      where: { id: dto.trialUserId },
    });

    if (!trialUser) {
      throw new NotFoundException(`Trial user with ID ${dto.trialUserId} not found`);
    }

    const nudge = await this.prisma.trialNudge.create({
      data: {
        trialUserId: dto.trialUserId,
        type: dto.type,
        channel: dto.channel,
        content: dto.content as any,
      },
    });

    // In a real implementation, you'd dispatch the nudge to the appropriate channel
    // (email service, push notification service, etc.)

    return {
      id: nudge.id,
      trialUserId: nudge.trialUserId,
      type: nudge.type as NudgeType,
      channel: nudge.channel as NudgeChannel,
      content: nudge.content as NudgeContentDto,
      sentAt: nudge.sentAt,
      openedAt: nudge.openedAt || undefined,
      clickedAt: nudge.clickedAt || undefined,
      convertedAt: nudge.convertedAt || undefined,
    };
  }

  async trackNudgeEvent(
    nudgeId: string,
    event: 'opened' | 'clicked' | 'converted',
  ): Promise<void> {
    const updateData: any = {};
    const now = new Date();

    switch (event) {
      case 'opened':
        updateData.openedAt = now;
        break;
      case 'clicked':
        updateData.clickedAt = now;
        break;
      case 'converted':
        updateData.convertedAt = now;
        break;
    }

    await this.prisma.trialNudge.update({
      where: { id: nudgeId },
      data: updateData,
    });
  }

  private calculateRisk(trial: any, now: Date): TrialAtRiskDto {
    const riskFactors: string[] = [];
    let riskScore = 0;

    // Days remaining factor
    const daysRemaining = Math.ceil(
      (trial.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysRemaining <= 1) {
      riskFactors.push('Trial ends tomorrow or today');
      riskScore += 40;
    } else if (daysRemaining <= 3) {
      riskFactors.push('Trial ends in less than 3 days');
      riskScore += 30;
    } else if (daysRemaining <= 7) {
      riskFactors.push('Trial ends in less than a week');
      riskScore += 15;
    }

    // Engagement score factor
    if (trial.engagementScore < 20) {
      riskFactors.push('Very low engagement score');
      riskScore += 35;
    } else if (trial.engagementScore < 40) {
      riskFactors.push('Low engagement score');
      riskScore += 25;
    } else if (trial.engagementScore < 60) {
      riskFactors.push('Below average engagement');
      riskScore += 10;
    }

    // Last activity factor
    if (trial.lastActivityAt) {
      const daysSinceActivity = Math.floor(
        (now.getTime() - trial.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceActivity >= 7) {
        riskFactors.push('No activity in 7+ days');
        riskScore += 25;
      } else if (daysSinceActivity >= 3) {
        riskFactors.push('No activity in 3+ days');
        riskScore += 15;
      }
    } else {
      riskFactors.push('No activity recorded');
      riskScore += 20;
    }

    // Determine suggested nudge type based on risk factors
    let suggestedNudgeType = NudgeType.FEATURE_HIGHLIGHT;

    if (daysRemaining <= 1) {
      suggestedNudgeType = NudgeType.LAST_CHANCE;
    } else if (daysRemaining <= 3) {
      suggestedNudgeType = NudgeType.TRIAL_ENDING;
    } else if (trial.engagementScore < 30) {
      suggestedNudgeType = NudgeType.USAGE_TIP;
    } else if (trial.engagementScore >= 60) {
      suggestedNudgeType = NudgeType.UPGRADE_PROMPT;
    }

    return {
      trialUser: this.mapToResponse(trial),
      riskScore: Math.min(riskScore, 100),
      riskFactors,
      suggestedNudgeType,
    };
  }

  private mapToResponse(trial: any): TrialUserResponseDto {
    const now = new Date();
    const daysRemaining = Math.max(
      0,
      Math.ceil((trial.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const daysInTrial = Math.ceil(
      (now.getTime() - trial.trialStartDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      id: trial.id,
      userId: trial.userId,
      email: trial.email || undefined,
      planId: trial.planId || undefined,
      trialStartDate: trial.trialStartDate,
      trialEndDate: trial.trialEndDate,
      status: trial.status as TrialStatus,
      convertedAt: trial.convertedAt || undefined,
      engagementScore: trial.engagementScore,
      lastActivityAt: trial.lastActivityAt || undefined,
      daysRemaining,
      daysInTrial,
      metadata: trial.metadata || undefined,
      createdAt: trial.createdAt,
      updatedAt: trial.updatedAt,
    };
  }
}
