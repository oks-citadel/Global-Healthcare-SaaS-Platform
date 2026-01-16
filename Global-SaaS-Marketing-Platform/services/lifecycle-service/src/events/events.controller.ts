import { Controller, Get, Post, Body, Query, Req, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { EventsService } from './events.service';
import { TrackEventDto, EventResponseDto, EventQueryDto } from './dto/event.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('events')
@ApiBearerAuth()
@Controller('lifecycle/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiOperation({ summary: 'Track an event' })
  @ApiResponse({ status: 201, description: 'Event tracked', type: EventResponseDto })
  async track(@Body() dto: TrackEventDto, @Req() req: Request) {
    const metadata = {
      ip: req.ip || req.headers['x-forwarded-for'] as string,
      userAgent: req.headers['user-agent'],
    };
    return this.eventsService.track(dto, metadata);
  }

  @Get()
  @ApiOperation({ summary: 'Get events with filters' })
  @ApiResponse({ status: 200, description: 'List of events' })
  async findAll(@Query() pagination: PaginationDto, @Query() query: EventQueryDto) {
    return this.eventsService.findAll(pagination, query);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent events' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of events to return' })
  @ApiResponse({ status: 200, description: 'Recent events', type: [EventResponseDto] })
  async getRecentEvents(@Query('limit') limit?: number) {
    return this.eventsService.getRecentEvents(limit || 100);
  }

  @Get('names')
  @ApiOperation({ summary: 'Get all unique event names with counts' })
  @ApiResponse({ status: 200, description: 'Event names' })
  async getEventNames() {
    return this.eventsService.getEventNames();
  }

  @Get('contact/:email')
  @ApiOperation({ summary: 'Get events for a contact' })
  @ApiParam({ name: 'email', description: 'Contact email' })
  @ApiResponse({ status: 200, description: 'Contact events', type: [EventResponseDto] })
  async getContactEvents(
    @Param('email') email: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.eventsService.getContactEvents(email, pagination);
  }

  @Get('stats/:name')
  @ApiOperation({ summary: 'Get statistics for an event' })
  @ApiParam({ name: 'name', description: 'Event name' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date' })
  @ApiResponse({ status: 200, description: 'Event statistics' })
  async getEventStats(
    @Param('name') name: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.eventsService.getEventStats(
      name,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
}
