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
import { TraitsService } from './traits.service';
import {
  CreateTraitDto,
  UpdateTraitDto,
  TraitResponseDto,
  TraitQueryDto,
  PaginatedTraitsDto,
  SetProfileTraitsDto,
  ProfileTraitResponseDto,
} from './dto/trait.dto';

@ApiTags('traits')
@ApiBearerAuth()
@Controller('personalization')
export class TraitsController {
  constructor(private readonly traitsService: TraitsService) {}

  @Post('traits')
  @ApiOperation({ summary: 'Create a new trait definition or set profile traits' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Trait created or profile traits set successfully',
  })
  async createOrSetTraits(
    @Body() dto: CreateTraitDto | SetProfileTraitsDto,
  ): Promise<TraitResponseDto | ProfileTraitResponseDto[]> {
    // Check if it's a SetProfileTraitsDto (has profileId and traits array)
    if ('profileId' in dto && 'traits' in dto) {
      return this.traitsService.setProfileTraits(dto as SetProfileTraitsDto);
    }
    return this.traitsService.create(dto as CreateTraitDto);
  }

  @Get('traits')
  @ApiOperation({ summary: 'Get all trait definitions with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of traits',
    type: PaginatedTraitsDto,
  })
  async findAll(@Query() query: TraitQueryDto): Promise<PaginatedTraitsDto> {
    return this.traitsService.findAll(query);
  }

  @Get('traits/:key')
  @ApiOperation({ summary: 'Get a trait definition by key' })
  @ApiParam({ name: 'key', description: 'Trait key' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trait definition',
    type: TraitResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Trait not found',
  })
  async findByKey(@Param('key') key: string): Promise<TraitResponseDto> {
    return this.traitsService.findByKey(key);
  }

  @Put('traits/:key')
  @ApiOperation({ summary: 'Update a trait definition' })
  @ApiParam({ name: 'key', description: 'Trait key' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trait updated successfully',
    type: TraitResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Trait not found',
  })
  async update(
    @Param('key') key: string,
    @Body() dto: UpdateTraitDto,
  ): Promise<TraitResponseDto> {
    return this.traitsService.update(key, dto);
  }

  @Delete('traits/:key')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a trait definition' })
  @ApiParam({ name: 'key', description: 'Trait key' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Trait deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Trait not found',
  })
  async delete(@Param('key') key: string): Promise<void> {
    return this.traitsService.delete(key);
  }

  @Get('profiles/:profileId/traits')
  @ApiOperation({ summary: 'Get all traits for a profile' })
  @ApiParam({ name: 'profileId', description: 'Profile ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile traits',
    type: [ProfileTraitResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found',
  })
  async getProfileTraits(
    @Param('profileId') profileId: string,
  ): Promise<ProfileTraitResponseDto[]> {
    return this.traitsService.getProfileTraits(profileId);
  }
}
