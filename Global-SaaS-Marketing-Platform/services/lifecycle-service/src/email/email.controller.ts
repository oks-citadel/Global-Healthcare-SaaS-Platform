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
import { EmailService } from './email.service';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  SendEmailDto,
  BulkSendEmailDto,
  AddSuppressionDto,
  TemplateResponseDto,
  EmailSendResponseDto,
  DeliverabilityMetricsDto,
  SuppressionResponseDto,
} from './dto/email.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('email')
@ApiBearerAuth()
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send a single email' })
  @ApiResponse({ status: 201, description: 'Email queued', type: EmailSendResponseDto })
  @ApiResponse({ status: 400, description: 'Email is suppressed or invalid' })
  async sendEmail(@Body() dto: SendEmailDto) {
    return this.emailService.sendEmail(dto);
  }

  @Post('send/bulk')
  @ApiOperation({ summary: 'Send bulk emails' })
  @ApiResponse({ status: 201, description: 'Bulk emails queued' })
  async sendBulkEmail(@Body() dto: BulkSendEmailDto) {
    return this.emailService.sendBulkEmail(dto);
  }

  @Get('deliverability')
  @ApiOperation({ summary: 'Get deliverability metrics' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date' })
  @ApiResponse({ status: 200, description: 'Deliverability metrics', type: DeliverabilityMetricsDto })
  async getDeliverability(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.emailService.getDeliverabilityMetrics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get email send metrics' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'email', required: false, description: 'Filter by recipient email' })
  @ApiResponse({ status: 200, description: 'Email metrics' })
  async getMetrics(
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
    @Query('email') email?: string,
  ) {
    return this.emailService.getEmailMetrics(pagination, status, email);
  }
}

@ApiTags('email')
@ApiBearerAuth()
@Controller('email/templates')
export class TemplatesController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @ApiOperation({ summary: 'Create an email template' })
  @ApiResponse({ status: 201, description: 'Template created', type: TemplateResponseDto })
  async createTemplate(@Body() dto: CreateTemplateDto) {
    return this.emailService.createTemplate(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all email templates' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'List of templates' })
  async getTemplates(
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.emailService.getTemplates(pagination, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a template by ID' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template details', type: TemplateResponseDto })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async getTemplate(@Param('id') id: string) {
    return this.emailService.getTemplate(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a template' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template updated', type: TemplateResponseDto })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async updateTemplate(@Param('id') id: string, @Body() dto: UpdateTemplateDto) {
    return this.emailService.updateTemplate(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive a template' })
  @ApiParam({ name: 'id', description: 'Template ID' })
  @ApiResponse({ status: 200, description: 'Template archived' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async deleteTemplate(@Param('id') id: string) {
    return this.emailService.deleteTemplate(id);
  }
}

@ApiTags('email')
@ApiBearerAuth()
@Controller('email/suppression')
export class SuppressionController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  @ApiOperation({ summary: 'Add an email to suppression list' })
  @ApiResponse({ status: 201, description: 'Email added to suppression', type: SuppressionResponseDto })
  async addSuppression(@Body() dto: AddSuppressionDto) {
    return this.emailService.addSuppression(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get suppression list' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by suppression type' })
  @ApiResponse({ status: 200, description: 'Suppression list' })
  async getSuppressionList(
    @Query() pagination: PaginationDto,
    @Query('type') type?: string,
  ) {
    return this.emailService.getSuppressionList(pagination, type);
  }

  @Get('check/:email')
  @ApiOperation({ summary: 'Check if an email is suppressed' })
  @ApiParam({ name: 'email', description: 'Email to check' })
  @ApiResponse({ status: 200, description: 'Suppression status' })
  async checkSuppression(@Param('email') email: string) {
    return this.emailService.checkSuppression(email);
  }

  @Delete(':email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove an email from suppression list' })
  @ApiParam({ name: 'email', description: 'Email to remove' })
  @ApiResponse({ status: 200, description: 'Suppression removed' })
  async removeSuppression(@Param('email') email: string) {
    return this.emailService.removeSuppression(email);
  }
}
