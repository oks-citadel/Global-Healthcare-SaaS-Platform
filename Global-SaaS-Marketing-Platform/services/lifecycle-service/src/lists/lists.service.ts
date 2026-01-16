import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateListDto,
  UpdateListDto,
  AddSubscriberDto,
  BulkAddSubscribersDto,
} from './dto/list.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class ListsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateListDto, userId?: string) {
    return this.prisma.list.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type || 'STATIC',
        doubleOptIn: dto.doubleOptIn || false,
        welcomeEmailId: dto.welcomeEmailId,
        tags: dto.tags || [],
        metadata: dto.metadata,
        createdBy: userId,
      },
    });
  }

  async findAll(pagination: PaginationDto, status?: string, search?: string) {
    const where: any = {
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.list.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.list.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async findOne(id: string) {
    const list = await this.prisma.list.findUnique({
      where: { id },
    });

    if (!list || list.deletedAt) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }

    return list;
  }

  async update(id: string, dto: UpdateListDto) {
    await this.findOne(id);

    return this.prisma.list.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        status: dto.status,
        doubleOptIn: dto.doubleOptIn,
        welcomeEmailId: dto.welcomeEmailId,
        tags: dto.tags,
        metadata: dto.metadata,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.list.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { success: true, message: 'List deleted successfully' };
  }

  async getSubscribers(listId: string, pagination: PaginationDto, status?: string) {
    await this.findOne(listId);

    const where: any = { listId };

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.listSubscriber.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.listSubscriber.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async addSubscriber(listId: string, dto: AddSubscriberDto) {
    const list = await this.findOne(listId);

    // Check if already subscribed
    const existing = await this.prisma.listSubscriber.findUnique({
      where: {
        listId_email: {
          listId,
          email: dto.email.toLowerCase(),
        },
      },
    });

    if (existing) {
      if (existing.status === 'ACTIVE') {
        throw new ConflictException('Email is already subscribed to this list');
      }

      // Resubscribe
      const updated = await this.prisma.listSubscriber.update({
        where: { id: existing.id },
        data: {
          status: list.doubleOptIn ? 'PENDING' : 'ACTIVE',
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          source: dto.source,
          sourceId: dto.sourceId,
          customFields: dto.customFields,
          metadata: dto.metadata,
          unsubscribedAt: null,
          confirmedAt: list.doubleOptIn ? null : new Date(),
        },
      });

      await this.updateListStats(listId);

      return updated;
    }

    // Create new subscriber
    const subscriber = await this.prisma.listSubscriber.create({
      data: {
        listId,
        email: dto.email.toLowerCase(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        status: list.doubleOptIn ? 'PENDING' : 'ACTIVE',
        source: dto.source,
        sourceId: dto.sourceId,
        customFields: dto.customFields,
        metadata: dto.metadata,
        confirmedAt: list.doubleOptIn ? null : new Date(),
      },
    });

    await this.updateListStats(listId);

    return subscriber;
  }

  async bulkAddSubscribers(listId: string, dto: BulkAddSubscribersDto) {
    const list = await this.findOne(listId);

    const results = {
      added: 0,
      updated: 0,
      skipped: 0,
      errors: [] as { email: string; error: string }[],
    };

    for (const sub of dto.subscribers) {
      try {
        const existing = await this.prisma.listSubscriber.findUnique({
          where: {
            listId_email: {
              listId,
              email: sub.email.toLowerCase(),
            },
          },
        });

        if (existing) {
          if (dto.skipDuplicates) {
            results.skipped++;
            continue;
          }

          await this.prisma.listSubscriber.update({
            where: { id: existing.id },
            data: {
              firstName: sub.firstName || existing.firstName,
              lastName: sub.lastName || existing.lastName,
              phone: sub.phone || existing.phone,
              customFields: sub.customFields
                ? { ...(existing.customFields as object), ...sub.customFields }
                : existing.customFields,
            },
          });
          results.updated++;
        } else {
          await this.prisma.listSubscriber.create({
            data: {
              listId,
              email: sub.email.toLowerCase(),
              firstName: sub.firstName,
              lastName: sub.lastName,
              phone: sub.phone,
              status: list.doubleOptIn ? 'PENDING' : 'ACTIVE',
              source: sub.source,
              sourceId: sub.sourceId,
              customFields: sub.customFields,
              metadata: sub.metadata,
              confirmedAt: list.doubleOptIn ? null : new Date(),
            },
          });
          results.added++;
        }
      } catch (error) {
        results.errors.push({ email: sub.email, error: error.message });
      }
    }

    await this.updateListStats(listId);

    return results;
  }

  async removeSubscriber(listId: string, subscriberId: string) {
    await this.findOne(listId);

    const subscriber = await this.prisma.listSubscriber.findFirst({
      where: { id: subscriberId, listId },
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    await this.prisma.listSubscriber.delete({
      where: { id: subscriberId },
    });

    await this.updateListStats(listId);

    return { success: true, message: 'Subscriber removed' };
  }

  async unsubscribe(listId: string, email: string) {
    await this.findOne(listId);

    const subscriber = await this.prisma.listSubscriber.findUnique({
      where: {
        listId_email: {
          listId,
          email: email.toLowerCase(),
        },
      },
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    await this.prisma.listSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date(),
      },
    });

    await this.updateListStats(listId);

    return { success: true, message: 'Unsubscribed successfully' };
  }

  async confirmSubscription(listId: string, email: string) {
    await this.findOne(listId);

    const subscriber = await this.prisma.listSubscriber.findUnique({
      where: {
        listId_email: {
          listId,
          email: email.toLowerCase(),
        },
      },
    });

    if (!subscriber) {
      throw new NotFoundException('Subscriber not found');
    }

    if (subscriber.status !== 'PENDING') {
      return { success: false, message: 'Subscription already confirmed or invalid' };
    }

    await this.prisma.listSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'ACTIVE',
        confirmedAt: new Date(),
      },
    });

    await this.updateListStats(listId);

    return { success: true, message: 'Subscription confirmed' };
  }

  private async updateListStats(listId: string) {
    const stats = await this.prisma.listSubscriber.groupBy({
      by: ['status'],
      where: { listId },
      _count: true,
    });

    const subscriberCount = stats.find((s) => s.status === 'ACTIVE')?._count || 0;
    const unsubscribeCount = stats.find((s) => s.status === 'UNSUBSCRIBED')?._count || 0;
    const bounceCount = stats.find((s) => s.status === 'BOUNCED')?._count || 0;
    const complaintCount = stats.find((s) => s.status === 'COMPLAINED')?._count || 0;

    await this.prisma.list.update({
      where: { id: listId },
      data: {
        subscriberCount,
        unsubscribeCount,
        bounceCount,
        complaintCount,
      },
    });
  }
}
