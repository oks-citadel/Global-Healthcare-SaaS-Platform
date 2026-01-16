import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  IsBoolean,
  IsNumber,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum FlowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
}

export enum FlowEntryType {
  TRIGGER = 'TRIGGER',
  SEGMENT = 'SEGMENT',
  LIST = 'LIST',
  API = 'API',
  MANUAL = 'MANUAL',
}

export enum FlowStepType {
  SEND_EMAIL = 'SEND_EMAIL',
  WAIT = 'WAIT',
  CONDITION = 'CONDITION',
  SPLIT = 'SPLIT',
  UPDATE_CONTACT = 'UPDATE_CONTACT',
  ADD_TO_LIST = 'ADD_TO_LIST',
  REMOVE_FROM_LIST = 'REMOVE_FROM_LIST',
  WEBHOOK = 'WEBHOOK',
  GOAL = 'GOAL',
  EXIT = 'EXIT',
}

export class FlowStepDto {
  @ApiProperty({ enum: FlowStepType, description: 'Step type' })
  @IsEnum(FlowStepType)
  type: FlowStepType;

  @ApiPropertyOptional({ description: 'Step name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Step configuration' })
  @IsObject()
  config: Record<string, any>;

  @ApiProperty({ description: 'Step order in the flow' })
  @IsNumber()
  @Min(0)
  order: number;

  @ApiPropertyOptional({ description: 'Parent step ID for branching' })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Branch key (yes/no, condition key)' })
  @IsString()
  @IsOptional()
  branchKey?: string;
}

export class CreateFlowDto {
  @ApiProperty({ description: 'Flow name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Flow description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: FlowEntryType, description: 'Entry type' })
  @IsEnum(FlowEntryType)
  entryType: FlowEntryType;

  @ApiPropertyOptional({ description: 'Entry configuration' })
  @IsObject()
  @IsOptional()
  entryConfig?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Exit configuration' })
  @IsObject()
  @IsOptional()
  exitConfig?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Allow contacts to re-enter', default: false })
  @IsBoolean()
  @IsOptional()
  allowReentry?: boolean;

  @ApiPropertyOptional({ description: 'Maximum entries per contact' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxEntries?: number;

  @ApiProperty({ description: 'Flow steps', type: [FlowStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlowStepDto)
  steps: FlowStepDto[];
}

export class UpdateFlowDto extends PartialType(CreateFlowDto) {}

export class StartFlowDto {
  @ApiProperty({ description: 'Contact email to start flow for' })
  @IsString()
  contactEmail: string;

  @ApiPropertyOptional({ description: 'Contact ID' })
  @IsString()
  @IsOptional()
  contactId?: string;

  @ApiPropertyOptional({ description: 'Initial context data' })
  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}

export class FlowResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: FlowStatus })
  status: FlowStatus;

  @ApiProperty({ enum: FlowEntryType })
  entryType: FlowEntryType;

  @ApiPropertyOptional()
  entryConfig?: Record<string, any>;

  @ApiPropertyOptional()
  exitConfig?: Record<string, any>;

  @ApiProperty()
  allowReentry: boolean;

  @ApiPropertyOptional()
  maxEntries?: number;

  @ApiProperty()
  totalEntered: number;

  @ApiProperty()
  totalCompleted: number;

  @ApiProperty()
  totalExited: number;

  @ApiProperty()
  activeCount: number;

  @ApiPropertyOptional()
  publishedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [FlowStepDto] })
  steps: FlowStepDto[];
}

export class FlowExecutionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  flowId: string;

  @ApiProperty()
  contactEmail: string;

  @ApiPropertyOptional()
  contactId?: string;

  @ApiProperty()
  status: string;

  @ApiPropertyOptional()
  currentStepId?: string;

  @ApiProperty()
  currentStepOrder: number;

  @ApiProperty()
  enteredAt: Date;

  @ApiPropertyOptional()
  completedAt?: Date;

  @ApiPropertyOptional()
  exitedAt?: Date;

  @ApiPropertyOptional()
  exitReason?: string;
}
