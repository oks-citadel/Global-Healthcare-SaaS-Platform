import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';

@Injectable()
export class BadgesService {
  private readonly logger = new Logger(BadgesService.name);
  private readonly CACHE_TTL = 3600;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getBadges(tenantId: string, type?: string) {
    const cacheKey = `badges:${tenantId}:${type || 'all'}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return cached;
    }

    const where: Record<string, unknown> = { tenantId, isActive: true };
    if (type) where.type = type;

    const badges = await this.prisma.trustBadge.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    await this.redis.set(cacheKey, badges, this.CACHE_TTL);

    return badges;
  }

  async createBadge(
    tenantId: string,
    dto: {
      name: string;
      type: string;
      issuer: string;
      imageUrl: string;
      linkUrl?: string;
      description?: string;
      issuedAt?: Date;
      expiresAt?: Date;
      displayOrder?: number;
      metadata?: Record<string, unknown>;
    },
  ) {
    const badge = await this.prisma.trustBadge.create({
      data: {
        tenantId,
        name: dto.name,
        type: dto.type,
        issuer: dto.issuer,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl,
        description: dto.description,
        issuedAt: dto.issuedAt,
        expiresAt: dto.expiresAt,
        displayOrder: dto.displayOrder || 0,
        metadata: dto.metadata || {},
      },
    });

    await this.redis.invalidatePattern(`badges:${tenantId}:*`);

    return badge;
  }

  async updateBadge(
    tenantId: string,
    badgeId: string,
    dto: {
      isActive?: boolean;
      displayOrder?: number;
    },
  ) {
    const badge = await this.prisma.trustBadge.update({
      where: { id: badgeId, tenantId },
      data: dto,
    });

    await this.redis.invalidatePattern(`badges:${tenantId}:*`);

    return badge;
  }

  async deleteBadge(tenantId: string, badgeId: string) {
    await this.prisma.trustBadge.delete({
      where: { id: badgeId, tenantId },
    });

    await this.redis.invalidatePattern(`badges:${tenantId}:*`);
  }
}
