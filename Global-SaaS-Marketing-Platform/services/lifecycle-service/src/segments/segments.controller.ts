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
import { SegmentsService } from './segments.service';
import {
  CreateSegmentDto,
  UpdateSegmentDto,
  SegmentResponseDto,
  SegmentMemberDto,
} from './dto/segment.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('segments')
@ApiBearerAuth()
@Controller('lifecycle/segments')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new segment' })
  @ApiResponse({ status: 201, description: 'Segment created', type: SegmentResponseDto })
  async create(@Body() dto: CreateSegmentDto) {
    return this.segmentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all segments' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'List of segments' })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.segmentsService.findAll(pagination, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a segment by ID' })
  @ApiParam({ name: 'id', description: 'Segment ID' })
  @ApiResponse({ status: 200, description: 'Segment details', type: SegmentResponseDto })
  @ApiResponse({ status: 404, description: 'Segment not found' })
  async findOne(@Param('id') id: string) {
    return this.segmentsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a segment' })
  @ApiParam({ name: 'id', description: 'Segment ID' })
  @ApiResponse({ status: 200, description: 'Segment updated', type: SegmentResponseDto })
  @ApiResponse({ status: 404, description: 'Segment not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateSegmentDto) {
    return this.segmentsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a segment' })
  @ApiParam({ name: 'id', description: 'Segment ID' })
  @ApiResponse({ status: 200, description: 'Segment archived' })
  @ApiResponse({ status: 404, description: 'Segment not found' })
  async remove(@Param('id') id: string) {
    return this.segmentsService.remove(id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get members of a segment' })
  @ApiParam({ name: 'id', description: 'Segment ID' })
  @ApiResponse({ status: 200, description: 'List of segment members', type: [SegmentMemberDto] })
  @ApiResponse({ status: 404, description: 'Segment not found' })
  async getMembers(@Param('id') id: string, @Query() pagination: PaginationDto) {
    return this.segmentsService.getMembers(id, pagination);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a member to a segment' })
  @ApiParam({ name: 'id', description: 'Segment ID' })
  @ApiResponse({ status: 201, description: 'Member added', type: SegmentMemberDto })
  @ApiResponse({ status: 404, description: 'Segment not found' })
  async addMember(
    @Param('id') id: string,
    @Body('email') email: string,
    @Body('userId') userId?: string,
  ) {
    return this.segmentsService.addMember(id, email, userId);
  }

  @Delete(':id/members/:email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a member from a segment' })
  @ApiParam({ name: 'id', description: 'Segment ID' })
  @ApiParam({ name: 'email', description: 'Member email' })
  @ApiResponse({ status: 200, description: 'Member removed' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async removeMember(@Param('id') id: string, @Param('email') email: string) {
    return this.segmentsService.removeMember(id, email);
  }

  @Post(':id/recalculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recalculate segment members' })
  @ApiParam({ name: 'id', description: 'Segment ID' })
  @ApiResponse({ status: 200, description: 'Segment recalculated' })
  @ApiResponse({ status: 404, description: 'Segment not found' })
  async recalculate(@Param('id') id: string) {
    return this.segmentsService.recalculateMembers(id);
  }

  @Post(':id/check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if an email is a member of the segment' })
  @ApiParam({ name: 'id', description: 'Segment ID' })
  @ApiResponse({ status: 200, description: 'Membership check result' })
  async checkMembership(@Param('id') id: string, @Body('email') email: string) {
    const isMember = await this.segmentsService.checkMembership(id, email);
    return { email, isMember };
  }
}
