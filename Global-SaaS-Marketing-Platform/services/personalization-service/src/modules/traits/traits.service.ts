import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../config/redis.service';
import {
  CreateTraitDto,
  UpdateTraitDto,
  TraitQueryDto,
  PaginatedTraitsDto,
  SetProfileTraitsDto,
  ProfileTraitResponseDto,
  TraitDataType,
} from './dto/trait.dto';

@Injectable()
export class TraitsService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly CACHE_PREFIX = 'trait:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateTraitDto) {
    const existing = await this.prisma.trait.findUnique({
      where: { key: dto.key },
    });

    if (existing) {
      throw new ConflictException(`Trait with key ${dto.key} already exists`);
    }

    const trait = await this.prisma.trait.create({
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        dataType: dto.dataType,
        category: dto.category,
        isComputed: dto.isComputed ?? false,
        computeRule: dto.computeRule,
      },
    });

    // Cache the trait
    await this.redis.set(
      `${this.CACHE_PREFIX}${trait.key}`,
      trait,
      this.CACHE_TTL,
    );

    return trait;
  }

  async findAll(query: TraitQueryDto): Promise<PaginatedTraitsDto> {
    const { page = 1, limit = 20, category, dataType, isComputed, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (dataType) {
      where.dataType = dataType;
    }

    if (isComputed !== undefined) {
      where.isComputed = isComputed;
    }

    if (search) {
      where.OR = [
        { key: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.trait.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.trait.count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        ...item,
        dataType: item.dataType as TraitDataType,
        computeRule: item.computeRule as Record<string, any> | undefined,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByKey(key: string) {
    // Try cache first
    const cached = await this.redis.get<any>(`${this.CACHE_PREFIX}${key}`);
    if (cached) return cached;

    const trait = await this.prisma.trait.findUnique({
      where: { key },
    });

    if (!trait) {
      throw new NotFoundException(`Trait with key ${key} not found`);
    }

    // Cache the result
    await this.redis.set(
      `${this.CACHE_PREFIX}${key}`,
      trait,
      this.CACHE_TTL,
    );

    return {
      ...trait,
      dataType: trait.dataType as TraitDataType,
      computeRule: trait.computeRule as Record<string, any> | undefined,
    };
  }

  async update(key: string, dto: UpdateTraitDto) {
    const existing = await this.prisma.trait.findUnique({
      where: { key },
    });

    if (!existing) {
      throw new NotFoundException(`Trait with key ${key} not found`);
    }

    // Check for duplicate key if updating
    if (dto.key && dto.key !== key) {
      const duplicate = await this.prisma.trait.findUnique({
        where: { key: dto.key },
      });
      if (duplicate) {
        throw new ConflictException(`Trait with key ${dto.key} already exists`);
      }
    }

    const trait = await this.prisma.trait.update({
      where: { key },
      data: {
        key: dto.key,
        name: dto.name,
        description: dto.description,
        dataType: dto.dataType,
        category: dto.category,
        isComputed: dto.isComputed,
        computeRule: dto.computeRule,
      },
    });

    // Invalidate caches
    await this.invalidateTraitCache(key);
    if (dto.key && dto.key !== key) {
      await this.invalidateTraitCache(dto.key);
    }

    return {
      ...trait,
      dataType: trait.dataType as TraitDataType,
      computeRule: trait.computeRule as Record<string, any> | undefined,
    };
  }

  async delete(key: string): Promise<void> {
    const trait = await this.prisma.trait.findUnique({
      where: { key },
    });

    if (!trait) {
      throw new NotFoundException(`Trait with key ${key} not found`);
    }

    await this.prisma.trait.delete({
      where: { key },
    });

    await this.invalidateTraitCache(key);
  }

  async setProfileTraits(dto: SetProfileTraitsDto): Promise<ProfileTraitResponseDto[]> {
    const { profileId, traits } = dto;

    // Verify profile exists
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${profileId} not found`);
    }

    // Get all trait definitions
    const traitKeys = traits.map((t) => t.key);
    const traitDefs = await this.prisma.trait.findMany({
      where: { key: { in: traitKeys } },
    });

    const traitDefMap = new Map(traitDefs.map((t) => [t.key, t]));

    // Validate all traits exist
    for (const trait of traits) {
      if (!traitDefMap.has(trait.key)) {
        throw new NotFoundException(`Trait with key ${trait.key} not found`);
      }
    }

    // Upsert profile traits
    const results: ProfileTraitResponseDto[] = [];

    for (const trait of traits) {
      const traitDef = traitDefMap.get(trait.key)!;

      const profileTrait = await this.prisma.profileTrait.upsert({
        where: {
          profileId_traitId: {
            profileId,
            traitId: traitDef.id,
          },
        },
        create: {
          profileId,
          traitId: traitDef.id,
          value: trait.value,
          source: trait.source,
          confidence: trait.confidence,
        },
        update: {
          value: trait.value,
          source: trait.source,
          confidence: trait.confidence,
        },
        include: {
          trait: true,
        },
      });

      results.push({
        id: profileTrait.id,
        profileId: profileTrait.profileId,
        traitKey: profileTrait.trait.key,
        traitName: profileTrait.trait.name,
        value: profileTrait.value,
        source: profileTrait.source || undefined,
        confidence: profileTrait.confidence || undefined,
        createdAt: profileTrait.createdAt,
        updatedAt: profileTrait.updatedAt,
      });
    }

    // Invalidate profile cache
    await this.redis.del(`profile:${profileId}:full`);
    await this.redis.del(`profile:external:${profile.externalUserId}:full`);

    return results;
  }

  async getProfileTraits(profileId: string): Promise<ProfileTraitResponseDto[]> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${profileId} not found`);
    }

    const profileTraits = await this.prisma.profileTrait.findMany({
      where: { profileId },
      include: { trait: true },
      orderBy: { trait: { key: 'asc' } },
    });

    return profileTraits.map((pt) => ({
      id: pt.id,
      profileId: pt.profileId,
      traitKey: pt.trait.key,
      traitName: pt.trait.name,
      value: pt.value,
      source: pt.source || undefined,
      confidence: pt.confidence || undefined,
      createdAt: pt.createdAt,
      updatedAt: pt.updatedAt,
    }));
  }

  private async invalidateTraitCache(key: string): Promise<void> {
    await this.redis.del(`${this.CACHE_PREFIX}${key}`);
  }
}
