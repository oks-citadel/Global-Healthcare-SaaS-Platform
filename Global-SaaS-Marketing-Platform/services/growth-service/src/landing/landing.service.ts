import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateLandingPageDto,
  UpdateLandingPageDto,
  CreateVariantDto,
  CroSuggestionDto,
} from './dto/landing.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class LandingService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateLandingPageDto, userId?: string) {
    // Check slug uniqueness
    const existing = await this.prisma.landingPage.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(`Landing page with slug '${dto.slug}' already exists`);
    }

    return this.prisma.landingPage.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        title: dto.title,
        headline: dto.headline,
        subheadline: dto.subheadline,
        content: dto.content,
        template: dto.template,
        customCss: dto.customCss,
        customJs: dto.customJs,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
        ogImage: dto.ogImage,
        canonicalUrl: dto.canonicalUrl,
        conversionGoal: dto.conversionGoal,
        thankYouUrl: dto.thankYouUrl,
        formFields: dto.formFields,
        createdBy: userId,
      },
    });
  }

  async findAll(pagination: PaginationDto, status?: string, search?: string) {
    const where: any = {
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.landingPage.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.landingPage.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, pagination.page || 1, pagination.limit || 20);
  }

  async findOne(id: string) {
    const cacheKey = `landing:${id}`;
    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const landingPage = await this.prisma.landingPage.findUnique({
      where: { id },
      include: {
        variants: true,
        abTests: {
          where: { status: 'RUNNING' },
        },
      },
    });

    if (!landingPage || landingPage.deletedAt) {
      throw new NotFoundException(`Landing page with ID ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, landingPage, 300);

    return landingPage;
  }

  async findBySlug(slug: string) {
    const landingPage = await this.prisma.landingPage.findUnique({
      where: { slug },
    });

    if (!landingPage || landingPage.deletedAt) {
      throw new NotFoundException(`Landing page with slug '${slug}' not found`);
    }

    return landingPage;
  }

  async update(id: string, dto: UpdateLandingPageDto) {
    await this.findOne(id);

    if (dto.slug) {
      const existing = await this.prisma.landingPage.findFirst({
        where: {
          slug: dto.slug,
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException(`Landing page with slug '${dto.slug}' already exists`);
      }
    }

    const updated = await this.prisma.landingPage.update({
      where: { id },
      data: {
        ...dto,
        publishedAt: dto.status === 'PUBLISHED' ? new Date() : undefined,
      },
    });

    await this.cacheManager.del(`landing:${id}`);

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.landingPage.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.cacheManager.del(`landing:${id}`);

    return { success: true, message: 'Landing page deleted successfully' };
  }

  async getVariants(id: string) {
    await this.findOne(id);

    return this.prisma.landingPageVariant.findMany({
      where: { landingPageId: id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createVariant(landingPageId: string, dto: CreateVariantDto) {
    await this.findOne(landingPageId);

    // Check variant code uniqueness
    const existing = await this.prisma.landingPageVariant.findFirst({
      where: {
        landingPageId,
        variantCode: dto.variantCode,
      },
    });

    if (existing) {
      throw new ConflictException(`Variant with code '${dto.variantCode}' already exists`);
    }

    return this.prisma.landingPageVariant.create({
      data: {
        landingPageId,
        name: dto.name,
        variantCode: dto.variantCode,
        changes: dto.changes,
        isControl: dto.isControl || false,
      },
    });
  }

  async trackView(id: string, isUnique: boolean = false) {
    await this.prisma.landingPage.update({
      where: { id },
      data: {
        views: { increment: 1 },
        uniqueViews: isUnique ? { increment: 1 } : undefined,
      },
    });
  }

  async trackConversion(id: string) {
    await this.prisma.landingPage.update({
      where: { id },
      data: {
        conversions: { increment: 1 },
      },
    });
  }

  async getCroSuggestions(id: string): Promise<CroSuggestionDto[]> {
    const landingPage = await this.findOne(id);
    const suggestions: CroSuggestionDto[] = [];

    // Analyze the landing page and generate CRO suggestions

    // Check headline
    if (!landingPage.headline) {
      suggestions.push({
        category: 'Content',
        priority: 'high',
        title: 'Add a compelling headline',
        description: 'A clear, benefit-driven headline is crucial for conversions. Consider adding one that speaks to your target audience.',
        expectedImpact: '10-30% conversion rate improvement',
        effort: 'Low',
      });
    }

    // Check subheadline
    if (!landingPage.subheadline) {
      suggestions.push({
        category: 'Content',
        priority: 'medium',
        title: 'Add a supporting subheadline',
        description: 'A subheadline helps reinforce your value proposition and provides additional context.',
        expectedImpact: '5-15% conversion rate improvement',
        effort: 'Low',
      });
    }

    // Check form fields
    if (landingPage.formFields) {
      const fields = Object.keys(landingPage.formFields as object);
      if (fields.length > 5) {
        suggestions.push({
          category: 'Forms',
          priority: 'high',
          title: 'Reduce form fields',
          description: `Your form has ${fields.length} fields. Consider reducing to 3-5 fields to improve conversion rates.`,
          expectedImpact: '10-25% conversion rate improvement',
          effort: 'Medium',
        });
      }
    }

    // Check meta description for SEO
    if (!landingPage.metaDescription) {
      suggestions.push({
        category: 'SEO',
        priority: 'medium',
        title: 'Add meta description',
        description: 'A meta description helps improve click-through rates from search results.',
        expectedImpact: '5-10% organic traffic improvement',
        effort: 'Low',
      });
    }

    // Check bounce rate
    if (landingPage.bounceRate && Number(landingPage.bounceRate) > 70) {
      suggestions.push({
        category: 'Engagement',
        priority: 'high',
        title: 'High bounce rate detected',
        description: `Your bounce rate is ${landingPage.bounceRate}%. Consider improving page load speed, content relevance, or adding trust signals.`,
        expectedImpact: '15-40% bounce rate reduction',
        effort: 'Medium',
      });
    }

    // Check conversion rate
    if (landingPage.views > 100 && landingPage.conversions > 0) {
      const conversionRate = (landingPage.conversions / landingPage.views) * 100;
      if (conversionRate < 2) {
        suggestions.push({
          category: 'Conversion',
          priority: 'high',
          title: 'Low conversion rate',
          description: `Your conversion rate is ${conversionRate.toFixed(2)}%. Consider A/B testing different CTAs, headlines, or offers.`,
          expectedImpact: '50-200% conversion rate improvement possible',
          effort: 'Medium',
        });
      }
    }

    // General suggestions
    if (landingPage.variants.length === 0) {
      suggestions.push({
        category: 'Testing',
        priority: 'medium',
        title: 'No A/B test variants',
        description: 'Create variants of your landing page to test different elements and improve conversions.',
        expectedImpact: 'Variable - depends on changes tested',
        effort: 'Medium',
      });
    }

    // Trust signals
    suggestions.push({
      category: 'Trust',
      priority: 'medium',
      title: 'Add social proof',
      description: 'Consider adding customer testimonials, trust badges, or company logos to build credibility.',
      expectedImpact: '10-20% conversion rate improvement',
      effort: 'Medium',
    });

    return suggestions;
  }
}
