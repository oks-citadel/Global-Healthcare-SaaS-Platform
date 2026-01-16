import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { TriggersService } from '../triggers/triggers.service';
import { TrackEventDto, EventQueryDto } from './dto/event.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly triggersService: TriggersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async track(dto: TrackEventDto, metadata?: { ip?: string; userAgent?: string }) {
    // Create event
    const event = await this.prisma.event.create({
      data: {
        name: dto.name,
        contactEmail: dto.contactEmail?.toLowerCase(),
        contactId: dto.contactId,
        properties: dto.properties,
        source: dto.source,
        sessionId: dto.sessionId,
        timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
        ipAddress: metadata?.ip,
        userAgent: metadata?.userAgent,
      },
    });

    // Fire triggers for this event
    if (dto.contactEmail || dto.contactId) {
      try {
        await this.triggersService.fireByEvent(dto.name, {
          event: dto.name,
          email: dto.contactEmail,
          contactId: dto.contactId,
          ...dto.properties,
        });
      } catch (error) {
        console.error(`Error firing triggers for event ${dto.name}:`, error);
      }
    }

    return event;
  }

  async findAll(pagination: PaginationDto, query: EventQueryDto) {
    const where: any = {};

    if (query.name) {
      where.name = query.name;
    }

    if (query.contactEmail) {
      where.contactEmail = query.contactEmail.toLowerCase();
    }

    if (query.contactId) {
      where.contactId = query.contactId;
    }

    if (query.startDate || query.endDate) {
      where.timestamp = {};
      if (query.startDate) {
        where.timestamp.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.timestamp.lte = new Date(query.endDate);
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async getContactEvents(contactEmail: string, pagination: PaginationDto) {
    const [data, total] = await Promise.all([
      this.prisma.event.findMany({
        where: { contactEmail: contactEmail.toLowerCase() },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.event.count({
        where: { contactEmail: contactEmail.toLowerCase() },
      }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async getEventStats(name: string, startDate?: Date, endDate?: Date) {
    const where: any = { name };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = startDate;
      }
      if (endDate) {
        where.timestamp.lte = endDate;
      }
    }

    const [total, uniqueContacts, byDay] = await Promise.all([
      this.prisma.event.count({ where }),
      this.prisma.event.groupBy({
        by: ['contactEmail'],
        where,
        _count: true,
      }),
      this.prisma.$queryRaw`
        SELECT
          DATE(timestamp) as date,
          COUNT(*) as count
        FROM events
        WHERE name = ${name}
        ${startDate ? 'AND timestamp >= ${startDate}' : ''}
        ${endDate ? 'AND timestamp <= ${endDate}' : ''}
        GROUP BY DATE(timestamp)
        ORDER BY date DESC
        LIMIT 30
      ` as Promise<any[]>,
    ]);

    return {
      eventName: name,
      totalEvents: total,
      uniqueContacts: uniqueContacts.length,
      dailyBreakdown: byDay,
    };
  }

  async getRecentEvents(limit: number = 100) {
    return this.prisma.event.findMany({
      take: limit,
      orderBy: { timestamp: 'desc' },
    });
  }

  async getEventNames() {
    const events = await this.prisma.event.groupBy({
      by: ['name'],
      _count: true,
      orderBy: {
        _count: {
          name: 'desc',
        },
      },
    });

    return events.map((e) => ({
      name: e.name,
      count: e._count,
    }));
  }
}
