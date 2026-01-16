import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { InappMessagesService } from './inapp-messages.service';
import {
  CreateInAppMessageDto,
  InAppMessageResponseDto,
  MessageQueryDto,
  PaginatedMessagesDto,
  GetMessagesDto,
  TriggerMessageDto,
  TriggerResponseDto,
} from './dto/inapp-message.dto';

@ApiTags('inapp')
@ApiBearerAuth()
@Controller('commerce/inapp')
export class InappMessagesController {
  constructor(private readonly inappMessagesService: InappMessagesService) {}

  @Post('messages')
  @ApiOperation({ summary: 'Create a new in-app message' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Message created successfully',
    type: InAppMessageResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Message with this key already exists',
  })
  async create(
    @Body() dto: CreateInAppMessageDto,
  ): Promise<InAppMessageResponseDto> {
    return this.inappMessagesService.create(dto);
  }

  @Get('messages')
  @ApiOperation({ summary: 'Get all in-app messages with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of messages',
    type: PaginatedMessagesDto,
  })
  async findAll(@Query() query: MessageQueryDto): Promise<PaginatedMessagesDto> {
    return this.inappMessagesService.findAll(query);
  }

  @Post('messages/user')
  @ApiOperation({ summary: 'Get eligible in-app messages for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of eligible messages',
    type: [InAppMessageResponseDto],
  })
  async getMessagesForUser(
    @Body() dto: GetMessagesDto,
  ): Promise<InAppMessageResponseDto[]> {
    return this.inappMessagesService.getMessagesForUser(dto);
  }

  @Post('messages/:id/trigger')
  @ApiOperation({ summary: 'Track a message trigger event' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trigger recorded',
    type: TriggerResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Message not found',
  })
  async triggerMessage(
    @Param('id') id: string,
    @Body() dto: TriggerMessageDto,
  ): Promise<TriggerResponseDto> {
    return this.inappMessagesService.triggerMessage(id, dto);
  }
}
