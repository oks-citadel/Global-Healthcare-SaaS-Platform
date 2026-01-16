import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { I18nService } from './i18n.service';

@ApiTags('i18n')
@ApiBearerAuth()
@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Get('languages')
  @ApiOperation({ summary: 'Get available languages' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Languages retrieved' })
  async getLanguages(@Query('activeOnly') activeOnly?: boolean) {
    return this.i18nService.getLanguages(activeOnly !== false);
  }

  @Get('locales')
  @ApiOperation({ summary: 'Get available locales' })
  @ApiQuery({ name: 'languageCode', required: false })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Locales retrieved' })
  async getLocales(
    @Query('languageCode') languageCode?: string,
    @Query('activeOnly') activeOnly?: boolean,
  ) {
    return this.i18nService.getLocales(languageCode, activeOnly !== false);
  }

  @Get('strings')
  @ApiOperation({ summary: 'Get localized strings' })
  @ApiHeader({ name: 'x-tenant-id', required: false })
  @ApiQuery({ name: 'languageCode', required: true })
  @ApiQuery({ name: 'namespace', required: false })
  @ApiResponse({ status: 200, description: 'Strings retrieved' })
  async getStrings(
    @Headers('x-tenant-id') tenantId: string | undefined,
    @Query('languageCode') languageCode: string,
    @Query('namespace') namespace?: string,
  ) {
    return this.i18nService.getStrings(tenantId || null, languageCode, namespace);
  }

  @Get('strings/:key')
  @ApiOperation({ summary: 'Get a specific string' })
  @ApiHeader({ name: 'x-tenant-id', required: false })
  @ApiParam({ name: 'key', description: 'String key' })
  @ApiQuery({ name: 'languageCode', required: true })
  @ApiResponse({ status: 200, description: 'String retrieved' })
  async getString(
    @Headers('x-tenant-id') tenantId: string | undefined,
    @Param('key') key: string,
    @Query('languageCode') languageCode: string,
  ) {
    return this.i18nService.getString(tenantId || null, key, languageCode);
  }

  @Put('strings/:key')
  @ApiOperation({ summary: 'Update a localized string' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiParam({ name: 'key', description: 'String key' })
  @ApiResponse({ status: 200, description: 'String updated' })
  async updateString(
    @Headers('x-tenant-id') tenantId: string,
    @Param('key') key: string,
    @Body() dto: { value: string; languageCode: string; namespace?: string },
  ) {
    return this.i18nService.updateString(
      tenantId,
      key,
      dto.languageCode,
      dto.value,
      dto.namespace,
    );
  }

  @Put('strings')
  @ApiOperation({ summary: 'Bulk update strings' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiResponse({ status: 200, description: 'Strings updated' })
  async bulkUpdateStrings(
    @Headers('x-tenant-id') tenantId: string,
    @Body()
    dto: {
      languageCode: string;
      strings: Array<{ key: string; value: string; namespace?: string }>;
    },
  ) {
    return this.i18nService.bulkUpdateStrings(
      tenantId,
      dto.languageCode,
      dto.strings,
    );
  }

  @Post('translate-request')
  @ApiOperation({ summary: 'Create translation request' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiResponse({ status: 201, description: 'Request created' })
  async createTranslationRequest(
    @Headers('x-tenant-id') tenantId: string,
    @Body()
    dto: {
      sourceLanguage: string;
      targetLanguages: string[];
      contentType: string;
      content: Record<string, string> | string;
      priority?: string;
      requestedBy: string;
    },
  ) {
    return this.i18nService.createTranslationRequest(tenantId, dto);
  }

  @Get('translate-requests')
  @ApiOperation({ summary: 'Get translation requests' })
  @ApiHeader({ name: 'x-tenant-id', required: true })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'Requests retrieved' })
  async getTranslationRequests(
    @Headers('x-tenant-id') tenantId: string,
    @Query('status') status?: string,
  ) {
    return this.i18nService.getTranslationRequests(tenantId, status);
  }
}
