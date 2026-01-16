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
import { FlowsService } from './flows.service';
import {
  CreateFlowDto,
  UpdateFlowDto,
  StartFlowDto,
  FlowResponseDto,
  FlowExecutionDto,
} from './dto/flow.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('flows')
@ApiBearerAuth()
@Controller('lifecycle/flows')
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new automation flow' })
  @ApiResponse({ status: 201, description: 'Flow created', type: FlowResponseDto })
  async create(@Body() dto: CreateFlowDto) {
    return this.flowsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flows' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'List of flows' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.flowsService.findAll(pagination, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a flow by ID' })
  @ApiParam({ name: 'id', description: 'Flow ID' })
  @ApiResponse({ status: 200, description: 'Flow details', type: FlowResponseDto })
  @ApiResponse({ status: 404, description: 'Flow not found' })
  async findOne(@Param('id') id: string) {
    return this.flowsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a flow' })
  @ApiParam({ name: 'id', description: 'Flow ID' })
  @ApiResponse({ status: 200, description: 'Flow updated', type: FlowResponseDto })
  @ApiResponse({ status: 400, description: 'Cannot update active flow' })
  @ApiResponse({ status: 404, description: 'Flow not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateFlowDto) {
    return this.flowsService.update(id, dto);
  }

  @Post(':id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start/activate a flow' })
  @ApiParam({ name: 'id', description: 'Flow ID' })
  @ApiResponse({ status: 200, description: 'Flow started', type: FlowResponseDto })
  @ApiResponse({ status: 400, description: 'Flow already active or no steps' })
  @ApiResponse({ status: 404, description: 'Flow not found' })
  async start(@Param('id') id: string) {
    return this.flowsService.start(id);
  }

  @Post(':id/stop')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stop/pause a flow' })
  @ApiParam({ name: 'id', description: 'Flow ID' })
  @ApiResponse({ status: 200, description: 'Flow stopped', type: FlowResponseDto })
  @ApiResponse({ status: 400, description: 'Flow not active' })
  @ApiResponse({ status: 404, description: 'Flow not found' })
  async stop(@Param('id') id: string) {
    return this.flowsService.stop(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a flow' })
  @ApiParam({ name: 'id', description: 'Flow ID' })
  @ApiResponse({ status: 200, description: 'Flow archived' })
  @ApiResponse({ status: 404, description: 'Flow not found' })
  async archive(@Param('id') id: string) {
    return this.flowsService.archive(id);
  }

  @Post(':id/enter')
  @ApiOperation({ summary: 'Enter a contact into a flow' })
  @ApiParam({ name: 'id', description: 'Flow ID' })
  @ApiResponse({ status: 201, description: 'Contact entered flow', type: FlowExecutionDto })
  @ApiResponse({ status: 400, description: 'Cannot enter flow' })
  @ApiResponse({ status: 404, description: 'Flow not found' })
  async enterFlow(@Param('id') id: string, @Body() dto: StartFlowDto) {
    return this.flowsService.enterFlow(id, dto);
  }

  @Get(':id/executions')
  @ApiOperation({ summary: 'Get flow executions' })
  @ApiParam({ name: 'id', description: 'Flow ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by execution status' })
  @ApiResponse({ status: 200, description: 'List of executions', type: [FlowExecutionDto] })
  @ApiResponse({ status: 404, description: 'Flow not found' })
  async getExecutions(
    @Param('id') id: string,
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.flowsService.getExecutions(id, pagination, status);
  }
}
