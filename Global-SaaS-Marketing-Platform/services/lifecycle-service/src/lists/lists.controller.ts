import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ListsService } from './lists.service';
import {
  CreateListDto,
  UpdateListDto,
  AddSubscriberDto,
  BulkAddSubscribersDto,
  ListResponseDto,
  SubscriberResponseDto,
} from './dto/list.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('lists')
@ApiBearerAuth()
@Controller('lifecycle/lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new list' })
  @ApiResponse({ status: 201, description: 'List created successfully', type: ListResponseDto })
  async create(@Body() dto: CreateListDto) {
    return this.listsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lists with pagination' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or description' })
  @ApiResponse({ status: 200, description: 'List of lists' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.listsService.findAll(pagination, status, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a list by ID' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiResponse({ status: 200, description: 'List details', type: ListResponseDto })
  @ApiResponse({ status: 404, description: 'List not found' })
  async findOne(@Param('id') id: string) {
    return this.listsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a list' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiResponse({ status: 200, description: 'List updated', type: ListResponseDto })
  @ApiResponse({ status: 404, description: 'List not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateListDto) {
    return this.listsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a list (soft delete)' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiResponse({ status: 200, description: 'List deleted' })
  @ApiResponse({ status: 404, description: 'List not found' })
  async remove(@Param('id') id: string) {
    return this.listsService.remove(id);
  }

  @Get(':id/subscribers')
  @ApiOperation({ summary: 'Get subscribers of a list' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by subscriber status' })
  @ApiResponse({ status: 200, description: 'List of subscribers', type: [SubscriberResponseDto] })
  @ApiResponse({ status: 404, description: 'List not found' })
  async getSubscribers(
    @Param('id') id: string,
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.listsService.getSubscribers(id, pagination, status);
  }

  @Post(':id/subscribers')
  @ApiOperation({ summary: 'Add a subscriber to a list' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiResponse({ status: 201, description: 'Subscriber added', type: SubscriberResponseDto })
  @ApiResponse({ status: 404, description: 'List not found' })
  @ApiResponse({ status: 409, description: 'Already subscribed' })
  async addSubscriber(@Param('id') id: string, @Body() dto: AddSubscriberDto) {
    return this.listsService.addSubscriber(id, dto);
  }

  @Post(':id/subscribers/bulk')
  @ApiOperation({ summary: 'Bulk add subscribers to a list' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiResponse({ status: 200, description: 'Bulk import results' })
  @ApiResponse({ status: 404, description: 'List not found' })
  async bulkAddSubscribers(@Param('id') id: string, @Body() dto: BulkAddSubscribersDto) {
    return this.listsService.bulkAddSubscribers(id, dto);
  }

  @Delete(':id/subscribers/:subscriberId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a subscriber from a list' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiParam({ name: 'subscriberId', description: 'Subscriber ID' })
  @ApiResponse({ status: 200, description: 'Subscriber removed' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async removeSubscriber(
    @Param('id') id: string,
    @Param('subscriberId') subscriberId: string,
  ) {
    return this.listsService.removeSubscriber(id, subscriberId);
  }

  @Post(':id/unsubscribe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unsubscribe an email from a list' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiResponse({ status: 200, description: 'Unsubscribed successfully' })
  async unsubscribe(@Param('id') id: string, @Body('email') email: string) {
    return this.listsService.unsubscribe(id, email);
  }

  @Post(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm a subscription (double opt-in)' })
  @ApiParam({ name: 'id', description: 'List ID' })
  @ApiResponse({ status: 200, description: 'Subscription confirmed' })
  async confirmSubscription(@Param('id') id: string, @Body('email') email: string) {
    return this.listsService.confirmSubscription(id, email);
  }
}
