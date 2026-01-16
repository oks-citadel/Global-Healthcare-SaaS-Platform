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
import { TriggersService } from './triggers.service';
import {
  CreateTriggerDto,
  UpdateTriggerDto,
  TriggerResponseDto,
} from './dto/trigger.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('triggers')
@ApiBearerAuth()
@Controller('lifecycle/triggers')
export class TriggersController {
  constructor(private readonly triggersService: TriggersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trigger' })
  @ApiResponse({ status: 201, description: 'Trigger created', type: TriggerResponseDto })
  async create(@Body() dto: CreateTriggerDto) {
    return this.triggersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all triggers' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by trigger type' })
  @ApiResponse({ status: 200, description: 'List of triggers' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    return this.triggersService.findAll(pagination, status, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a trigger by ID' })
  @ApiParam({ name: 'id', description: 'Trigger ID' })
  @ApiResponse({ status: 200, description: 'Trigger details', type: TriggerResponseDto })
  @ApiResponse({ status: 404, description: 'Trigger not found' })
  async findOne(@Param('id') id: string) {
    return this.triggersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a trigger' })
  @ApiParam({ name: 'id', description: 'Trigger ID' })
  @ApiResponse({ status: 200, description: 'Trigger updated', type: TriggerResponseDto })
  @ApiResponse({ status: 404, description: 'Trigger not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateTriggerDto) {
    return this.triggersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a trigger' })
  @ApiParam({ name: 'id', description: 'Trigger ID' })
  @ApiResponse({ status: 200, description: 'Trigger archived' })
  @ApiResponse({ status: 404, description: 'Trigger not found' })
  async remove(@Param('id') id: string) {
    return this.triggersService.remove(id);
  }

  @Post(':id/fire')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Manually fire a trigger' })
  @ApiParam({ name: 'id', description: 'Trigger ID' })
  @ApiResponse({ status: 200, description: 'Trigger fired' })
  @ApiResponse({ status: 404, description: 'Trigger not found' })
  async fire(@Param('id') id: string, @Body() context: Record<string, any>) {
    return this.triggersService.fire(id, context);
  }
}
