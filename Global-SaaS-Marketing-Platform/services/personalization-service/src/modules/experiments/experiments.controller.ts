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
import { ExperimentsService } from './experiments.service';
import {
  CreateExperimentDto,
  UpdateExperimentDto,
  ExperimentResponseDto,
  ExperimentQueryDto,
  PaginatedExperimentsDto,
  AssignmentRequestDto,
  AssignmentResponseDto,
  ExperimentResultsDto,
  ConcludeExperimentDto,
  ConcludeResponseDto,
} from './dto/experiment.dto';

@ApiTags('experiments')
@ApiBearerAuth()
@Controller('experiments')
export class ExperimentsController {
  constructor(private readonly experimentsService: ExperimentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new experiment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Experiment created successfully',
    type: ExperimentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Experiment with this key already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid experiment configuration',
  })
  async create(@Body() dto: CreateExperimentDto): Promise<ExperimentResponseDto> {
    return this.experimentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all experiments with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of experiments',
    type: PaginatedExperimentsDto,
  })
  async findAll(@Query() query: ExperimentQueryDto): Promise<PaginatedExperimentsDto> {
    return this.experimentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an experiment by ID' })
  @ApiParam({ name: 'id', description: 'Experiment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Experiment details',
    type: ExperimentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Experiment not found',
  })
  async findById(@Param('id') id: string): Promise<ExperimentResponseDto> {
    return this.experimentsService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an experiment' })
  @ApiParam({ name: 'id', description: 'Experiment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Experiment updated successfully',
    type: ExperimentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Experiment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot update running experiment',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExperimentDto,
  ): Promise<ExperimentResponseDto> {
    return this.experimentsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an experiment' })
  @ApiParam({ name: 'id', description: 'Experiment ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Experiment deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Experiment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete running experiment',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.experimentsService.delete(id);
  }

  @Post(':id/assign')
  @ApiOperation({ summary: 'Assign a user to an experiment variant' })
  @ApiParam({ name: 'id', description: 'Experiment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User assigned to variant',
    type: AssignmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Experiment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Experiment is not running',
  })
  async assignUser(
    @Param('id') id: string,
    @Body() dto: AssignmentRequestDto,
  ): Promise<AssignmentResponseDto> {
    return this.experimentsService.assignUser(id, dto);
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get experiment results and statistics' })
  @ApiParam({ name: 'id', description: 'Experiment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Experiment results',
    type: ExperimentResultsDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Experiment not found',
  })
  async getResults(@Param('id') id: string): Promise<ExperimentResultsDto> {
    return this.experimentsService.getResults(id);
  }

  @Post(':id/conclude')
  @ApiOperation({ summary: 'Conclude an experiment with a winning variant' })
  @ApiParam({ name: 'id', description: 'Experiment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Experiment concluded',
    type: ConcludeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Experiment not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Experiment already concluded or invalid variant',
  })
  async conclude(
    @Param('id') id: string,
    @Body() dto: ConcludeExperimentDto,
  ): Promise<ConcludeResponseDto> {
    return this.experimentsService.conclude(id, dto);
  }
}
