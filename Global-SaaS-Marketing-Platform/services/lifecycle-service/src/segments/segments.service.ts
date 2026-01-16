import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSegmentDto, UpdateSegmentDto } from './dto/segment.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class SegmentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateSegmentDto, userId?: string) {
    const segment = await this.prisma.segment.create({
      data: {
        name: dto.name,
        description: dto.description,
        queryType: dto.queryType || 'ALL_MATCH',
        conditions: dto.conditions,
        createdBy: userId,
      },
    });

    // Calculate initial members
    await this.recalculateMembers(segment.id);

    return this.findOne(segment.id);
  }

  async findAll(pagination: PaginationDto, status?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.segment.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.segment.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async findOne(id: string) {
    const segment = await this.prisma.segment.findUnique({
      where: { id },
    });

    if (!segment) {
      throw new NotFoundException(`Segment with ID ${id} not found`);
    }

    return segment;
  }

  async update(id: string, dto: UpdateSegmentDto) {
    await this.findOne(id);

    const segment = await this.prisma.segment.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        queryType: dto.queryType,
        conditions: dto.conditions,
        status: dto.status,
      },
    });

    // Recalculate members if conditions changed
    if (dto.conditions) {
      await this.recalculateMembers(id);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.segment.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    return { success: true, message: 'Segment archived' };
  }

  async getMembers(segmentId: string, pagination: PaginationDto) {
    await this.findOne(segmentId);

    const [data, total] = await Promise.all([
      this.prisma.segmentMember.findMany({
        where: {
          segmentId,
          removedAt: null,
        },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { addedAt: 'desc' },
      }),
      this.prisma.segmentMember.count({
        where: {
          segmentId,
          removedAt: null,
        },
      }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async addMember(segmentId: string, email: string, userId?: string) {
    await this.findOne(segmentId);

    const existing = await this.prisma.segmentMember.findUnique({
      where: {
        segmentId_email: {
          segmentId,
          email: email.toLowerCase(),
        },
      },
    });

    if (existing && !existing.removedAt) {
      return existing;
    }

    if (existing) {
      return this.prisma.segmentMember.update({
        where: { id: existing.id },
        data: {
          removedAt: null,
          addedAt: new Date(),
        },
      });
    }

    const member = await this.prisma.segmentMember.create({
      data: {
        segmentId,
        email: email.toLowerCase(),
        userId,
      },
    });

    await this.updateMemberCount(segmentId);

    return member;
  }

  async removeMember(segmentId: string, email: string) {
    await this.findOne(segmentId);

    const member = await this.prisma.segmentMember.findUnique({
      where: {
        segmentId_email: {
          segmentId,
          email: email.toLowerCase(),
        },
      },
    });

    if (!member || member.removedAt) {
      throw new NotFoundException('Member not found in segment');
    }

    await this.prisma.segmentMember.update({
      where: { id: member.id },
      data: { removedAt: new Date() },
    });

    await this.updateMemberCount(segmentId);

    return { success: true, message: 'Member removed from segment' };
  }

  async recalculateMembers(segmentId: string) {
    const segment = await this.findOne(segmentId);

    // This is a simplified implementation
    // In production, you would build dynamic queries based on conditions
    // and match against your subscriber/contact database

    // For now, we just update the timestamp
    await this.prisma.segment.update({
      where: { id: segmentId },
      data: { lastCalculatedAt: new Date() },
    });

    await this.updateMemberCount(segmentId);

    return { success: true, message: 'Segment recalculated' };
  }

  async checkMembership(segmentId: string, email: string): Promise<boolean> {
    const member = await this.prisma.segmentMember.findUnique({
      where: {
        segmentId_email: {
          segmentId,
          email: email.toLowerCase(),
        },
      },
    });

    return member !== null && member.removedAt === null;
  }

  async evaluateConditions(segmentId: string, contactData: Record<string, any>): Promise<boolean> {
    const segment = await this.findOne(segmentId);
    const conditions = segment.conditions as any[];

    if (!conditions || conditions.length === 0) {
      return true;
    }

    const isAllMatch = segment.queryType === 'ALL_MATCH';

    for (const group of conditions) {
      const groupLogic = group.logic || 'AND';
      const groupConditions = group.conditions || [];

      let groupResult: boolean;

      if (groupLogic === 'AND') {
        groupResult = groupConditions.every((cond: any) =>
          this.evaluateCondition(cond, contactData),
        );
      } else {
        groupResult = groupConditions.some((cond: any) =>
          this.evaluateCondition(cond, contactData),
        );
      }

      if (isAllMatch && !groupResult) {
        return false;
      }

      if (!isAllMatch && groupResult) {
        return true;
      }
    }

    return isAllMatch;
  }

  private evaluateCondition(condition: any, data: Record<string, any>): boolean {
    const { field, operator, value } = condition;
    const fieldValue = this.getNestedValue(data, field);

    switch (operator) {
      case 'EQUALS':
        return fieldValue === value;
      case 'NOT_EQUALS':
        return fieldValue !== value;
      case 'CONTAINS':
        return String(fieldValue || '').toLowerCase().includes(String(value).toLowerCase());
      case 'NOT_CONTAINS':
        return !String(fieldValue || '').toLowerCase().includes(String(value).toLowerCase());
      case 'STARTS_WITH':
        return String(fieldValue || '').toLowerCase().startsWith(String(value).toLowerCase());
      case 'ENDS_WITH':
        return String(fieldValue || '').toLowerCase().endsWith(String(value).toLowerCase());
      case 'GREATER_THAN':
        return Number(fieldValue) > Number(value);
      case 'LESS_THAN':
        return Number(fieldValue) < Number(value);
      case 'GREATER_THAN_OR_EQUAL':
        return Number(fieldValue) >= Number(value);
      case 'LESS_THAN_OR_EQUAL':
        return Number(fieldValue) <= Number(value);
      case 'IS_SET':
        return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
      case 'IS_NOT_SET':
        return fieldValue === null || fieldValue === undefined || fieldValue === '';
      case 'IN':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'NOT_IN':
        return Array.isArray(value) && !value.includes(fieldValue);
      case 'BEFORE':
        return new Date(fieldValue) < new Date(value);
      case 'AFTER':
        return new Date(fieldValue) > new Date(value);
      case 'BETWEEN':
        if (Array.isArray(value) && value.length === 2) {
          const fieldDate = new Date(fieldValue);
          return fieldDate >= new Date(value[0]) && fieldDate <= new Date(value[1]);
        }
        return false;
      default:
        return false;
    }
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async updateMemberCount(segmentId: string) {
    const count = await this.prisma.segmentMember.count({
      where: {
        segmentId,
        removedAt: null,
      },
    });

    await this.prisma.segment.update({
      where: { id: segmentId },
      data: { memberCount: count },
    });
  }
}
