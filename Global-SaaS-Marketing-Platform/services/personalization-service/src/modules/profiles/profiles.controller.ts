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
import { ProfilesService } from './profiles.service';
import {
  CreateProfileDto,
  UpdateProfileDto,
  ProfileResponseDto,
  ProfileWithTraitsDto,
  ProfileQueryDto,
  PaginatedProfilesDto,
} from './dto/profile.dto';

@ApiTags('profiles')
@ApiBearerAuth()
@Controller('personalization/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user profile' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Profile created successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Profile with this external user ID already exists',
  })
  async create(@Body() dto: CreateProfileDto): Promise<ProfileResponseDto> {
    return this.profilesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all profiles with pagination and filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of profiles',
    type: PaginatedProfilesDto,
  })
  async findAll(@Query() query: ProfileQueryDto): Promise<PaginatedProfilesDto> {
    return this.profilesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a profile by ID with traits and segments' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile with traits and segments',
    type: ProfileWithTraitsDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found',
  })
  async findById(@Param('id') id: string): Promise<ProfileWithTraitsDto> {
    return this.profilesService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a profile' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a profile' })
  @ApiParam({ name: 'id', description: 'Profile ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Profile deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.profilesService.delete(id);
  }
}
