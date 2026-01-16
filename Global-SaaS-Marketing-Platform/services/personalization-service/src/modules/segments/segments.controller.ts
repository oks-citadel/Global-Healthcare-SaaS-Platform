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
} from '@nestjs/swagger';
import { SegmentsService } from './segments.service';
import {
  CreateSegmentDto,
  UpdateSegmentDto,
  SegmentResponseDto,
  SegmentWithMembersDto,
  SegmentQueryDto,
  PaginatedSegmentsDto,
} from './dto/segment.dto';

@ApiTags('segments')
@ApiBearerAuth()
@Controller('personalization/segments')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new segment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Segment created successfully',
    type: SegmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Segment with this key already exists',
  })
  async create(@Body() dto: CreateSegmentDto): Promise<SegmentResponseDto> {
    return this.segmentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all segments with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of segments',
    type: PaginatedSegmentsDto,
  })
  async findAll(@Query() query: SegmentQueryDto): Promise<PaginatedSegmentsDto> {
    return this.segmentsService.findAll(query);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get a segment by key with members' })
  @ApiParam({ name: 'key', description: 'Segment key' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Segment with members',
    type: SegmentWithMembersDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Segment not found',
  })
  async findByKey(@Param('key') key: string): Promise<SegmentWithMembersDto> {
    return this.segmentsService.findByKey(key);
  }

  @Put(':key')
  @ApiOperation({ summary: 'Update a segment' })
  @ApiParam({ name: 'key', description: 'Segment key' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Segment updated successfully',
    type: SegmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Segment not found',
  })
  async update(
    @Param('key') key: string,
    @Body() dto: UpdateSegmentDto,
  ): Promise<SegmentResponseDto> {
    return this.segmentsService.update(key, dto);
  }

  @Delete(':key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a segment' })
  @ApiParam({ name: 'key', description: 'Segment key' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Segment deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Segment not found',
  })
  async delete(@Param('key') key: string): Promise<void> {
    return this.segmentsService.delete(key);
  }
}
