import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../config/redis.service';
import {
  CreateProfileDto,
  UpdateProfileDto,
  ProfileQueryDto,
  PaginatedProfilesDto,
  ProfileWithTraitsDto,
} from './dto/profile.dto';

@Injectable()
export class ProfilesService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'profile:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateProfileDto) {
    // Check for existing profile with same external user ID
    const existing = await this.prisma.profile.findUnique({
      where: { externalUserId: dto.externalUserId },
    });

    if (existing) {
      throw new ConflictException(
        `Profile with external user ID ${dto.externalUserId} already exists`,
      );
    }

    const profile = await this.prisma.profile.create({
      data: {
        externalUserId: dto.externalUserId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        timezone: dto.timezone,
        locale: dto.locale,
        metadata: dto.metadata,
      },
    });

    // Cache the profile
    await this.redis.set(
      `${this.CACHE_PREFIX}${profile.id}`,
      profile,
      this.CACHE_TTL,
    );
    await this.redis.set(
      `${this.CACHE_PREFIX}external:${profile.externalUserId}`,
      profile,
      this.CACHE_TTL,
    );

    return profile;
  }

  async findAll(query: ProfileQueryDto): Promise<PaginatedProfilesDto> {
    const { page = 1, limit = 20, externalUserId, email, segmentKey } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (externalUserId) {
      where.externalUserId = externalUserId;
    }

    if (email) {
      where.email = email;
    }

    if (segmentKey) {
      where.segmentMemberships = {
        some: {
          segment: { key: segmentKey },
          exitedAt: null,
        },
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.profile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.profile.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<ProfileWithTraitsDto> {
    // Try cache first
    const cached = await this.redis.get<ProfileWithTraitsDto>(
      `${this.CACHE_PREFIX}${id}:full`,
    );
    if (cached) return cached;

    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        traits: {
          include: { trait: true },
        },
        segmentMemberships: {
          where: { exitedAt: null },
          include: { segment: true },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    const result: ProfileWithTraitsDto = {
      ...profile,
      traits: profile.traits.map((pt) => ({
        key: pt.trait.key,
        value: pt.value,
        source: pt.source || undefined,
        confidence: pt.confidence || undefined,
      })),
      segments: profile.segmentMemberships.map((sm) => ({
        key: sm.segment.key,
        name: sm.segment.name,
        enteredAt: sm.enteredAt,
      })),
    };

    // Cache the result
    await this.redis.set(
      `${this.CACHE_PREFIX}${id}:full`,
      result,
      this.CACHE_TTL,
    );

    return result;
  }

  async findByExternalId(externalUserId: string): Promise<ProfileWithTraitsDto> {
    // Try cache first
    const cached = await this.redis.get<ProfileWithTraitsDto>(
      `${this.CACHE_PREFIX}external:${externalUserId}:full`,
    );
    if (cached) return cached;

    const profile = await this.prisma.profile.findUnique({
      where: { externalUserId },
      include: {
        traits: {
          include: { trait: true },
        },
        segmentMemberships: {
          where: { exitedAt: null },
          include: { segment: true },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Profile with external user ID ${externalUserId} not found`,
      );
    }

    const result: ProfileWithTraitsDto = {
      ...profile,
      traits: profile.traits.map((pt) => ({
        key: pt.trait.key,
        value: pt.value,
        source: pt.source || undefined,
        confidence: pt.confidence || undefined,
      })),
      segments: profile.segmentMemberships.map((sm) => ({
        key: sm.segment.key,
        name: sm.segment.name,
        enteredAt: sm.enteredAt,
      })),
    };

    // Cache the result
    await this.redis.set(
      `${this.CACHE_PREFIX}external:${externalUserId}:full`,
      result,
      this.CACHE_TTL,
    );

    return result;
  }

  async update(id: string, dto: UpdateProfileDto) {
    const existing = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    // Check for duplicate external user ID if updating
    if (dto.externalUserId && dto.externalUserId !== existing.externalUserId) {
      const duplicate = await this.prisma.profile.findUnique({
        where: { externalUserId: dto.externalUserId },
      });
      if (duplicate) {
        throw new ConflictException(
          `Profile with external user ID ${dto.externalUserId} already exists`,
        );
      }
    }

    const profile = await this.prisma.profile.update({
      where: { id },
      data: {
        externalUserId: dto.externalUserId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        timezone: dto.timezone,
        locale: dto.locale,
        metadata: dto.metadata,
      },
    });

    // Invalidate caches
    await this.invalidateProfileCache(id, existing.externalUserId);
    if (dto.externalUserId && dto.externalUserId !== existing.externalUserId) {
      await this.invalidateProfileCache(id, dto.externalUserId);
    }

    return profile;
  }

  async delete(id: string): Promise<void> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    await this.prisma.profile.delete({
      where: { id },
    });

    await this.invalidateProfileCache(id, profile.externalUserId);
  }

  private async invalidateProfileCache(
    id: string,
    externalUserId: string,
  ): Promise<void> {
    await Promise.all([
      this.redis.del(`${this.CACHE_PREFIX}${id}`),
      this.redis.del(`${this.CACHE_PREFIX}${id}:full`),
      this.redis.del(`${this.CACHE_PREFIX}external:${externalUserId}`),
      this.redis.del(`${this.CACHE_PREFIX}external:${externalUserId}:full`),
    ]);
  }
}
