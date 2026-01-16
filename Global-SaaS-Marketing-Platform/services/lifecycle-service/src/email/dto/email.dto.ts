import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  IsObject,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TemplateStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum SuppressionType {
  BOUNCE = 'BOUNCE',
  COMPLAINT = 'COMPLAINT',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
  MANUAL = 'MANUAL',
  INVALID = 'INVALID',
}

export class CreateTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Template description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Email subject line' })
  @IsString()
  subject: string;

  @ApiPropertyOptional({ description: 'Email preheader text' })
  @IsString()
  @IsOptional()
  preheader?: string;

  @ApiProperty({ description: 'HTML content of the email' })
  @IsString()
  htmlContent: string;

  @ApiPropertyOptional({ description: 'Plain text content' })
  @IsString()
  @IsOptional()
  textContent?: string;

  @ApiPropertyOptional({ description: 'MJML source (if using MJML)' })
  @IsString()
  @IsOptional()
  mjmlContent?: string;

  @ApiPropertyOptional({ description: 'From name' })
  @IsString()
  @IsOptional()
  fromName?: string;

  @ApiPropertyOptional({ description: 'From email' })
  @IsEmail()
  @IsOptional()
  fromEmail?: string;

  @ApiPropertyOptional({ description: 'Reply-to email' })
  @IsEmail()
  @IsOptional()
  replyTo?: string;

  @ApiPropertyOptional({ description: 'Available template variables' })
  @IsObject()
  @IsOptional()
  variables?: Record<string, any>;
}

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @ApiPropertyOptional({ enum: TemplateStatus })
  @IsEnum(TemplateStatus)
  @IsOptional()
  status?: TemplateStatus;
}

export class SendEmailDto {
  @ApiProperty({ description: 'Recipient email' })
  @IsEmail()
  toEmail: string;

  @ApiPropertyOptional({ description: 'Recipient name' })
  @IsString()
  @IsOptional()
  toName?: string;

  @ApiPropertyOptional({ description: 'Template ID to use' })
  @IsString()
  @IsOptional()
  templateId?: string;

  @ApiPropertyOptional({ description: 'Email subject (overrides template)' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiPropertyOptional({ description: 'HTML content (if not using template)' })
  @IsString()
  @IsOptional()
  htmlContent?: string;

  @ApiPropertyOptional({ description: 'Plain text content' })
  @IsString()
  @IsOptional()
  textContent?: string;

  @ApiPropertyOptional({ description: 'From email (overrides default)' })
  @IsEmail()
  @IsOptional()
  fromEmail?: string;

  @ApiPropertyOptional({ description: 'From name' })
  @IsString()
  @IsOptional()
  fromName?: string;

  @ApiPropertyOptional({ description: 'Reply-to email' })
  @IsEmail()
  @IsOptional()
  replyTo?: string;

  @ApiPropertyOptional({ description: 'Template variables' })
  @IsObject()
  @IsOptional()
  variables?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Tags for tracking' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Source (flow, campaign, trigger, api)' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ description: 'Source ID' })
  @IsString()
  @IsOptional()
  sourceId?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class BulkSendEmailDto {
  @ApiProperty({ description: 'Template ID to use' })
  @IsString()
  templateId: string;

  @ApiProperty({ description: 'List of recipients', type: [Object] })
  @IsArray()
  recipients: {
    email: string;
    name?: string;
    variables?: Record<string, any>;
  }[];

  @ApiPropertyOptional({ description: 'Tags for tracking' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Source' })
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional({ description: 'Source ID' })
  @IsString()
  @IsOptional()
  sourceId?: string;
}

export class AddSuppressionDto {
  @ApiProperty({ description: 'Email to suppress' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: SuppressionType, description: 'Suppression type' })
  @IsEnum(SuppressionType)
  type: SuppressionType;

  @ApiPropertyOptional({ description: 'Reason for suppression' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'Source of suppression' })
  @IsString()
  @IsOptional()
  source?: string;
}

export class TemplateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: TemplateStatus })
  status: TemplateStatus;

  @ApiProperty()
  subject: string;

  @ApiPropertyOptional()
  preheader?: string;

  @ApiProperty()
  htmlContent: string;

  @ApiPropertyOptional()
  textContent?: string;

  @ApiPropertyOptional()
  fromName?: string;

  @ApiPropertyOptional()
  fromEmail?: string;

  @ApiPropertyOptional()
  replyTo?: string;

  @ApiProperty()
  totalSent: number;

  @ApiProperty()
  totalOpens: number;

  @ApiProperty()
  totalClicks: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class EmailSendResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  toEmail: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  messageId?: string;

  @ApiProperty()
  createdAt: Date;
}

export class DeliverabilityMetricsDto {
  @ApiProperty()
  totalSent: number;

  @ApiProperty()
  totalDelivered: number;

  @ApiProperty()
  totalBounced: number;

  @ApiProperty()
  totalComplaints: number;

  @ApiProperty()
  totalOpens: number;

  @ApiProperty()
  totalClicks: number;

  @ApiProperty()
  deliveryRate: number;

  @ApiProperty()
  bounceRate: number;

  @ApiProperty()
  complaintRate: number;

  @ApiProperty()
  openRate: number;

  @ApiProperty()
  clickRate: number;
}

export class SuppressionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: SuppressionType })
  type: SuppressionType;

  @ApiPropertyOptional()
  reason?: string;

  @ApiPropertyOptional()
  source?: string;

  @ApiProperty()
  createdAt: Date;
}
