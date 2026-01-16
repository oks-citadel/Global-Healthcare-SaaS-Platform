import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Query,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ManifestService } from '../services/manifest.service';
import { UpdateManifestConfigDto } from '../../../common/dto';

@ApiTags('SEO - Web App Manifest')
@Controller('seo')
export class ManifestController {
  constructor(private readonly manifestService: ManifestService) {}

  @Get('manifest.json')
  @Header('Content-Type', 'application/manifest+json')
  @Header('Cache-Control', 'public, max-age=86400')
  @ApiOperation({
    summary: 'Get web app manifest',
    description: 'Returns the PWA web app manifest for the application',
  })
  @ApiQuery({ name: 'tenant', required: false, description: 'Tenant slug for tenant-specific manifest' })
  @ApiResponse({ status: 200, description: 'Web app manifest JSON' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async getManifest(
    @Query('tenant') tenant?: string,
  ): Promise<any> {
    return this.manifestService.generateManifest(tenant);
  }

  @Put('manifest/config')
  @ApiOperation({
    summary: 'Update manifest configuration',
    description: 'Update the web app manifest configuration for a tenant',
  })
  @ApiBody({ type: UpdateManifestConfigDto })
  @ApiResponse({ status: 200, description: 'Configuration updated successfully' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async updateManifestConfig(
    @Body() dto: UpdateManifestConfigDto,
  ): Promise<{ success: boolean; message: string }> {
    await this.manifestService.updateManifestConfig(dto);
    return { success: true, message: 'Manifest configuration updated' };
  }

  @Get('manifest/config')
  @ApiOperation({
    summary: 'Get manifest configuration',
    description: 'Get the current manifest configuration for a tenant',
  })
  @ApiQuery({ name: 'tenantId', required: true, description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Manifest configuration' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async getManifestConfig(
    @Query('tenantId') tenantId: string,
  ): Promise<any> {
    const config = await this.manifestService.getManifestConfig(tenantId);
    return { success: true, data: config };
  }

  @Post('manifest/validate')
  @ApiOperation({
    summary: 'Validate manifest',
    description: 'Validate a web app manifest against PWA requirements',
  })
  @ApiBody({
    schema: {
      type: 'object',
      description: 'Partial or complete web app manifest to validate',
    },
  })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validateManifest(
    @Body() manifest: any,
  ): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    return this.manifestService.validateManifest(manifest);
  }

  @Post('manifest/generate-icons')
  @ApiOperation({
    summary: 'Generate icon sizes',
    description: 'Generate recommended icon configuration from a source image URL',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sourceUrl: { type: 'string', description: 'URL of the source icon image' },
        basePath: { type: 'string', description: 'Base path for generated icons', default: '/icons' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Generated icon configuration' })
  async generateIcons(
    @Body('sourceUrl') sourceUrl: string,
    @Body('basePath') basePath: string = '/icons',
  ): Promise<{
    icons: Array<{
      src: string;
      sizes: string;
      type: string;
      purpose?: string;
    }>;
  }> {
    // Generate standard icon sizes for PWA
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

    const icons = sizes.map((size) => ({
      src: `${basePath}/icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
      ...(size === 512 ? { purpose: 'maskable' } : {}),
      ...(size === 192 ? { purpose: 'any' } : {}),
    }));

    return {
      icons,
    };
  }
}
