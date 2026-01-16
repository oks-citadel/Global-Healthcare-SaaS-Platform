import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  CampaignFilterDto,
  CampaignMetricsDto,
} from './dto/campaign.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateCampaignDto, userId?: string) {
    return this.prisma.campaign.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        status: dto.status || 'DRAFT',
        budget: dto.budget,
        currency: dto.currency || 'USD',
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        targetAudience: dto.targetAudience,
        goals: dto.goals,
        channels: dto.channels || [],
        tags: dto.tags || [],
        metadata: dto.metadata,
        createdBy: userId,
      },
    });
  }

  async findAll(pagination: PaginationDto, filters: CampaignFilterDto) {
    const where: any = {
      deletedAt: null,
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.tag) {
      where.tags = { has: filters.tag };
    }

    if (filters.startDateFrom || filters.startDateTo) {
      where.startDate = {};
      if (filters.startDateFrom) {
        where.startDate.gte = new Date(filters.startDateFrom);
      }
      if (filters.startDateTo) {
        where.startDate.lte = new Date(filters.startDateTo);
      }
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async findOne(id: string) {
    const cacheKey = `campaign:${id}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        utmLinks: true,
        landingPages: {
          include: {
            landingPage: true,
          },
        },
      },
    });

    if (!campaign || campaign.deletedAt) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, campaign, 300);

    return campaign;
  }

  async update(id: string, dto: UpdateCampaignDto) {
    await this.findOne(id);

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        status: dto.status,
        budget: dto.budget,
        currency: dto.currency,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        targetAudience: dto.targetAudience,
        goals: dto.goals,
        channels: dto.channels,
        tags: dto.tags,
        metadata: dto.metadata,
      },
    });

    await this.cacheManager.del(`campaign:${id}`);

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.campaign.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.cacheManager.del(`campaign:${id}`);

    return { success: true, message: 'Campaign deleted successfully' };
  }

  async getMetrics(id: string): Promise<CampaignMetricsDto> {
    const campaign = await this.findOne(id);

    const impressions = campaign.impressions || 0;
    const clicks = campaign.clicks || 0;
    const conversions = campaign.conversions || 0;
    const spend = Number(campaign.spend) || 0;
    const revenue = Number(campaign.revenue) || 0;

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpa = conversions > 0 ? spend / conversions : 0;
    const roas = spend > 0 ? revenue / spend : 0;
    const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;

    return {
      impressions,
      clicks,
      conversions,
      spend,
      revenue,
      ctr: Math.round(ctr * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100,
      cpc: Math.round(cpc * 100) / 100,
      cpa: Math.round(cpa * 100) / 100,
      roas: Math.round(roas * 100) / 100,
      roi: Math.round(roi * 100) / 100,
    };
  }

  async updateMetrics(
    id: string,
    metrics: {
      impressions?: number;
      clicks?: number;
      conversions?: number;
      spend?: number;
      revenue?: number;
    },
  ) {
    await this.findOne(id);

    return this.prisma.campaign.update({
      where: { id },
      data: {
        impressions: metrics.impressions !== undefined ? { increment: metrics.impressions } : undefined,
        clicks: metrics.clicks !== undefined ? { increment: metrics.clicks } : undefined,
        conversions: metrics.conversions !== undefined ? { increment: metrics.conversions } : undefined,
        spend: metrics.spend !== undefined ? { increment: metrics.spend } : undefined,
        revenue: metrics.revenue !== undefined ? { increment: metrics.revenue } : undefined,
      },
    });
  }
}
