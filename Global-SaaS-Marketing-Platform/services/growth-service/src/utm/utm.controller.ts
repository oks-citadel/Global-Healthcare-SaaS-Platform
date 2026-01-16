import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UtmService } from './utm.service';
import { GenerateUtmDto, ParseUtmDto, UtmResponseDto, ParsedUtmDto } from './dto/utm.dto';

@ApiTags('utm')
@ApiBearerAuth()
@Controller('growth/utm')
export class UtmController {
  constructor(private readonly utmService: UtmService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a UTM-tagged URL' })
  @ApiResponse({ status: 201, description: 'UTM link generated successfully', type: UtmResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async generate(@Body() dto: GenerateUtmDto) {
    return this.utmService.generateUtmLink(dto);
  }

  @Post('parse')
  @ApiOperation({ summary: 'Parse UTM parameters from a URL' })
  @ApiResponse({ status: 200, description: 'UTM parameters parsed', type: ParsedUtmDto })
  @ApiResponse({ status: 400, description: 'Invalid URL' })
  async parse(@Body() dto: ParseUtmDto) {
    return this.utmService.parseUtmUrl(dto.url);
  }

  @Get(':shortCode')
  @ApiOperation({ summary: 'Get UTM link details by short code' })
  @ApiResponse({ status: 200, description: 'UTM link details', type: UtmResponseDto })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async findByShortCode(@Param('shortCode') shortCode: string) {
    return this.utmService.findByShortCode(shortCode);
  }

  @Get(':shortCode/redirect')
  @ApiOperation({ summary: 'Track click and get redirect URL' })
  @ApiResponse({ status: 200, description: 'Redirect URL' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async trackAndRedirect(@Param('shortCode') shortCode: string) {
    return this.utmService.trackClick(shortCode);
  }
}
