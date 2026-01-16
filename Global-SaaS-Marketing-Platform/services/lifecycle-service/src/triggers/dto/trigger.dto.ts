import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TriggerStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
}

export enum TriggerType {
  EVENT = 'EVENT',
  SCHEDULED = 'SCHEDULED',
  API = 'API',
  WEBHOOK = 'WEBHOOK',
}

export enum ActionType {
  SEND_EMAIL = 'SEND_EMAIL',
  ADD_TO_LIST = 'ADD_TO_LIST',
  REMOVE_FROM_LIST = 'REMOVE_FROM_LIST',
  UPDATE_CONTACT = 'UPDATE_CONTACT',
  START_FLOW = 'START_FLOW',
  WEBHOOK = 'WEBHOOK',
  WAIT = 'WAIT',
  CONDITION = 'CONDITION',
}

export class TriggerActionDto {
  @ApiProperty({ enum: ActionType, description: 'Action type' })
  @IsEnum(ActionType)
  type: ActionType;

  @ApiProperty({ description: 'Action configuration' })
  @IsObject()
  config: Record<string, any>;

  @ApiPropertyOptional({ description: 'Order of execution', default: 0 })
  @IsOptional()
  order?: number;
}

export class CreateTriggerDto {
  @ApiProperty({ description: 'Trigger name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Trigger description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TriggerType, description: 'Trigger type' })
  @IsEnum(TriggerType)
  type: TriggerType;

  @ApiPropertyOptional({ description: 'Event name (for EVENT type triggers)' })
  @IsString()
  @IsOptional()
  eventName?: string;

  @ApiPropertyOptional({ description: 'Trigger conditions' })
  @IsObject()
  @IsOptional()
  conditions?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Schedule configuration (for SCHEDULED type)' })
  @IsObject()
  @IsOptional()
  schedule?: Record<string, any>;

  @ApiProperty({ description: 'Actions to execute', type: [TriggerActionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TriggerActionDto)
  actions: TriggerActionDto[];
}

export class UpdateTriggerDto extends PartialType(CreateTriggerDto) {
  @ApiPropertyOptional({ enum: TriggerStatus })
  @IsEnum(TriggerStatus)
  @IsOptional()
  status?: TriggerStatus;
}

export class TriggerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: TriggerStatus })
  status: TriggerStatus;

  @ApiProperty({ enum: TriggerType })
  type: TriggerType;

  @ApiPropertyOptional()
  eventName?: string;

  @ApiPropertyOptional()
  conditions?: Record<string, any>;

  @ApiPropertyOptional()
  schedule?: Record<string, any>;

  @ApiProperty({ type: [TriggerActionDto] })
  actions: TriggerActionDto[];

  @ApiProperty()
  totalFired: number;

  @ApiPropertyOptional()
  lastFiredAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
