import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateUtmDto, ParsedUtmDto } from './dto/utm.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class UtmService {
  constructor(private readonly prisma: PrismaService) {}

  async generateUtmLink(dto: GenerateUtmDto) {
    const shortCode = nanoid(8);

    // Build the full URL with UTM parameters
    const url = new URL(dto.originalUrl);
    url.searchParams.set('utm_source', dto.utmSource);
    url.searchParams.set('utm_medium', dto.utmMedium);
    url.searchParams.set('utm_campaign', dto.utmCampaign);

    if (dto.utmTerm) {
      url.searchParams.set('utm_term', dto.utmTerm);
    }

    if (dto.utmContent) {
      url.searchParams.set('utm_content', dto.utmContent);
    }

    const fullUrl = url.toString();

    const utmLink = await this.prisma.utmLink.create({
      data: {
        originalUrl: dto.originalUrl,
        shortCode,
        fullUrl,
        utmSource: dto.utmSource,
        utmMedium: dto.utmMedium,
        utmCampaign: dto.utmCampaign,
        utmTerm: dto.utmTerm,
        utmContent: dto.utmContent,
        campaignId: dto.campaignId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        metadata: dto.metadata,
      },
    });

    return {
      ...utmLink,
      shortUrl: `${process.env.SHORT_URL_BASE || 'https://go.example.com'}/${shortCode}`,
    };
  }

  parseUtmUrl(url: string): ParsedUtmDto {
    try {
      const parsedUrl = new URL(url);
      const params = parsedUrl.searchParams;

      const utmSource = params.get('utm_source');
      const utmMedium = params.get('utm_medium');
      const utmCampaign = params.get('utm_campaign');
      const utmTerm = params.get('utm_term');
      const utmContent = params.get('utm_content');

      const warnings: string[] = [];

      if (!utmSource) warnings.push('Missing utm_source');
      if (!utmMedium) warnings.push('Missing utm_medium');
      if (!utmCampaign) warnings.push('Missing utm_campaign');

      const isValid = Boolean(utmSource && utmMedium && utmCampaign);

      // Remove UTM params to get original URL
      params.delete('utm_source');
      params.delete('utm_medium');
      params.delete('utm_campaign');
      params.delete('utm_term');
      params.delete('utm_content');

      return {
        originalUrl: parsedUrl.origin + parsedUrl.pathname + (params.toString() ? `?${params.toString()}` : ''),
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        utmTerm: utmTerm || undefined,
        utmContent: utmContent || undefined,
        isValid,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error) {
      throw new BadRequestException('Invalid URL format');
    }
  }

  async trackClick(shortCode: string, metadata?: { ip?: string; userAgent?: string }) {
    const link = await this.prisma.utmLink.findUnique({
      where: { shortCode },
    });

    if (!link) {
      throw new NotFoundException('UTM link not found');
    }

    if (!link.isActive) {
      throw new BadRequestException('This link is no longer active');
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
      throw new BadRequestException('This link has expired');
    }

    await this.prisma.utmLink.update({
      where: { shortCode },
      data: {
        clicks: { increment: 1 },
        lastClickedAt: new Date(),
      },
    });

    return {
      redirectUrl: link.fullUrl,
    };
  }

  async findByShortCode(shortCode: string) {
    const link = await this.prisma.utmLink.findUnique({
      where: { shortCode },
      include: {
        campaign: true,
      },
    });

    if (!link) {
      throw new NotFoundException('UTM link not found');
    }

    return link;
  }

  async findByCampaign(campaignId: string) {
    return this.prisma.utmLink.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deactivate(id: string) {
    await this.prisma.utmLink.update({
      where: { id },
      data: { isActive: false },
    });

    return { success: true, message: 'UTM link deactivated' };
  }
}
