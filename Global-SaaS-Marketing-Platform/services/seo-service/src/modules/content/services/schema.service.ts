import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { GenerateSchemaDto, SchemaResultDto } from '../../../common/dto';

interface SchemaTemplate {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

@Injectable()
export class SchemaService {
  private readonly logger = new Logger(SchemaService.name);

  private readonly schemaTemplates: Record<string, (data: any) => SchemaTemplate> = {
    Organization: this.organizationSchema.bind(this),
    LocalBusiness: this.localBusinessSchema.bind(this),
    Product: this.productSchema.bind(this),
    Article: this.articleSchema.bind(this),
    BlogPosting: this.blogPostingSchema.bind(this),
    WebPage: this.webPageSchema.bind(this),
    WebSite: this.webSiteSchema.bind(this),
    BreadcrumbList: this.breadcrumbSchema.bind(this),
    FAQPage: this.faqSchema.bind(this),
    HowTo: this.howToSchema.bind(this),
    Event: this.eventSchema.bind(this),
    Person: this.personSchema.bind(this),
    Review: this.reviewSchema.bind(this),
    AggregateRating: this.aggregateRatingSchema.bind(this),
    VideoObject: this.videoSchema.bind(this),
    ImageObject: this.imageSchema.bind(this),
    SoftwareApplication: this.softwareAppSchema.bind(this),
    Course: this.courseSchema.bind(this),
    Recipe: this.recipeSchema.bind(this),
    JobPosting: this.jobPostingSchema.bind(this),
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate JSON-LD structured data
   */
  async generateSchema(dto: GenerateSchemaDto): Promise<SchemaResultDto> {
    const generator = this.schemaTemplates[dto.schemaType];

    if (!generator) {
      throw new BadRequestException(`Unsupported schema type: ${dto.schemaType}`);
    }

    const jsonLd = generator(dto.data);

    // Validate if requested
    let validationErrors: Array<{ path: string; message: string }> = [];
    let warnings: Array<{ path: string; message: string }> = [];

    if (dto.validate) {
      const validation = this.validateSchema(jsonLd, dto.schemaType);
      validationErrors = validation.errors;
      warnings = validation.warnings;
    }

    // Generate HTML script tag
    const htmlScript = this.generateHtmlScript(jsonLd);

    return {
      schemaType: dto.schemaType,
      jsonLd,
      isValid: validationErrors.length === 0,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      htmlScript,
    };
  }

  /**
   * Get stored schema templates
   */
  async getSchemaTemplates(tenantId?: string): Promise<any[]> {
    const where = tenantId ? { OR: [{ tenantId }, { tenantId: null }] } : {};

    return this.prisma.structuredDataTemplate.findMany({
      where,
      orderBy: { schemaType: 'asc' },
    });
  }

  /**
   * Store a schema template
   */
  async saveSchemaTemplate(
    name: string,
    schemaType: string,
    template: any,
    tenantId?: string,
  ): Promise<void> {
    await this.prisma.structuredDataTemplate.create({
      data: {
        tenantId,
        name,
        schemaType,
        template,
        isActive: true,
      },
    });
  }

  /**
   * Generate HTML script tag
   */
  private generateHtmlScript(jsonLd: any): string {
    return `<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>`;
  }

  /**
   * Validate schema against requirements
   */
  private validateSchema(
    schema: any,
    schemaType: string,
  ): {
    errors: Array<{ path: string; message: string }>;
    warnings: Array<{ path: string; message: string }>;
  } {
    const errors: Array<{ path: string; message: string }> = [];
    const warnings: Array<{ path: string; message: string }> = [];

    // Check required fields
    if (!schema['@context']) {
      errors.push({ path: '@context', message: '@context is required' });
    }
    if (!schema['@type']) {
      errors.push({ path: '@type', message: '@type is required' });
    }

    // Type-specific validation
    switch (schemaType) {
      case 'Organization':
        if (!schema.name) errors.push({ path: 'name', message: 'name is required' });
        if (!schema.url) warnings.push({ path: 'url', message: 'url is recommended' });
        if (!schema.logo) warnings.push({ path: 'logo', message: 'logo is recommended' });
        break;

      case 'Product':
        if (!schema.name) errors.push({ path: 'name', message: 'name is required' });
        if (!schema.image) warnings.push({ path: 'image', message: 'image is recommended' });
        if (schema.offers && !schema.offers.price) {
          warnings.push({ path: 'offers.price', message: 'price is recommended for offers' });
        }
        break;

      case 'Article':
      case 'BlogPosting':
        if (!schema.headline) errors.push({ path: 'headline', message: 'headline is required' });
        if (!schema.author) warnings.push({ path: 'author', message: 'author is recommended' });
        if (!schema.datePublished) warnings.push({ path: 'datePublished', message: 'datePublished is recommended' });
        if (!schema.image) warnings.push({ path: 'image', message: 'image is recommended' });
        break;

      case 'FAQPage':
        if (!schema.mainEntity || !Array.isArray(schema.mainEntity) || schema.mainEntity.length === 0) {
          errors.push({ path: 'mainEntity', message: 'At least one question is required' });
        }
        break;

      case 'Event':
        if (!schema.name) errors.push({ path: 'name', message: 'name is required' });
        if (!schema.startDate) errors.push({ path: 'startDate', message: 'startDate is required' });
        if (!schema.location) warnings.push({ path: 'location', message: 'location is recommended' });
        break;

      case 'JobPosting':
        if (!schema.title) errors.push({ path: 'title', message: 'title is required' });
        if (!schema.description) errors.push({ path: 'description', message: 'description is required' });
        if (!schema.datePosted) errors.push({ path: 'datePosted', message: 'datePosted is required' });
        if (!schema.hiringOrganization) errors.push({ path: 'hiringOrganization', message: 'hiringOrganization is required' });
        break;
    }

    return { errors, warnings };
  }

  // Schema generators

  private organizationSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: data.url,
      logo: data.logo,
      description: data.description,
      sameAs: data.socialProfiles || [],
      contactPoint: data.contactPoint
        ? {
            '@type': 'ContactPoint',
            telephone: data.contactPoint.telephone,
            contactType: data.contactPoint.contactType || 'customer service',
            areaServed: data.contactPoint.areaServed,
            availableLanguage: data.contactPoint.availableLanguage,
          }
        : undefined,
      address: data.address
        ? {
            '@type': 'PostalAddress',
            streetAddress: data.address.streetAddress,
            addressLocality: data.address.city,
            addressRegion: data.address.region,
            postalCode: data.address.postalCode,
            addressCountry: data.address.country,
          }
        : undefined,
    };
  }

  private localBusinessSchema(data: any): SchemaTemplate {
    return {
      ...this.organizationSchema(data),
      '@type': 'LocalBusiness',
      priceRange: data.priceRange,
      openingHours: data.openingHours,
      geo: data.geo
        ? {
            '@type': 'GeoCoordinates',
            latitude: data.geo.latitude,
            longitude: data.geo.longitude,
          }
        : undefined,
    };
  }

  private productSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description,
      image: data.image,
      sku: data.sku,
      brand: data.brand
        ? {
            '@type': 'Brand',
            name: data.brand,
          }
        : undefined,
      offers: data.offers
        ? {
            '@type': 'Offer',
            price: data.offers.price,
            priceCurrency: data.offers.currency || 'USD',
            availability: data.offers.availability || 'https://schema.org/InStock',
            url: data.offers.url,
            priceValidUntil: data.offers.priceValidUntil,
          }
        : undefined,
      aggregateRating: data.rating
        ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating.value,
            reviewCount: data.rating.reviewCount,
            bestRating: data.rating.bestRating || 5,
          }
        : undefined,
    };
  }

  private articleSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      image: data.image,
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished,
      author: data.author
        ? {
            '@type': data.author.type || 'Person',
            name: data.author.name,
            url: data.author.url,
          }
        : undefined,
      publisher: data.publisher
        ? {
            '@type': 'Organization',
            name: data.publisher.name,
            logo: {
              '@type': 'ImageObject',
              url: data.publisher.logo,
            },
          }
        : undefined,
      mainEntityOfPage: data.url
        ? {
            '@type': 'WebPage',
            '@id': data.url,
          }
        : undefined,
    };
  }

  private blogPostingSchema(data: any): SchemaTemplate {
    return {
      ...this.articleSchema(data),
      '@type': 'BlogPosting',
    };
  }

  private webPageSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: data.name,
      description: data.description,
      url: data.url,
      datePublished: data.datePublished,
      dateModified: data.dateModified,
      inLanguage: data.language || 'en',
    };
  }

  private webSiteSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: data.name,
      url: data.url,
      description: data.description,
      potentialAction: data.searchUrl
        ? {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: data.searchUrl,
            },
            'query-input': 'required name=search_term_string',
          }
        : undefined,
    };
  }

  private breadcrumbSchema(data: any): SchemaTemplate {
    const items = (data.items || []).map((item: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };
  }

  private faqSchema(data: any): SchemaTemplate {
    const questions = (data.questions || []).map((q: any) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions,
    };
  }

  private howToSchema(data: any): SchemaTemplate {
    const steps = (data.steps || []).map((step: any, index: number) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
      url: step.url,
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: data.name,
      description: data.description,
      image: data.image,
      totalTime: data.totalTime,
      estimatedCost: data.estimatedCost
        ? {
            '@type': 'MonetaryAmount',
            currency: data.estimatedCost.currency || 'USD',
            value: data.estimatedCost.value,
          }
        : undefined,
      supply: data.supplies?.map((s: string) => ({
        '@type': 'HowToSupply',
        name: s,
      })),
      tool: data.tools?.map((t: string) => ({
        '@type': 'HowToTool',
        name: t,
      })),
      step: steps,
    };
  }

  private eventSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: data.name,
      description: data.description,
      image: data.image,
      startDate: data.startDate,
      endDate: data.endDate,
      eventStatus: data.eventStatus || 'https://schema.org/EventScheduled',
      eventAttendanceMode: data.eventAttendanceMode || 'https://schema.org/OfflineEventAttendanceMode',
      location: data.location
        ? data.location.type === 'virtual'
          ? {
              '@type': 'VirtualLocation',
              url: data.location.url,
            }
          : {
              '@type': 'Place',
              name: data.location.name,
              address: {
                '@type': 'PostalAddress',
                streetAddress: data.location.address?.streetAddress,
                addressLocality: data.location.address?.city,
                addressRegion: data.location.address?.region,
                postalCode: data.location.address?.postalCode,
                addressCountry: data.location.address?.country,
              },
            }
        : undefined,
      organizer: data.organizer
        ? {
            '@type': 'Organization',
            name: data.organizer.name,
            url: data.organizer.url,
          }
        : undefined,
      offers: data.offers
        ? {
            '@type': 'Offer',
            price: data.offers.price,
            priceCurrency: data.offers.currency || 'USD',
            availability: data.offers.availability,
            url: data.offers.url,
          }
        : undefined,
    };
  }

  private personSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.name,
      url: data.url,
      image: data.image,
      jobTitle: data.jobTitle,
      worksFor: data.worksFor
        ? {
            '@type': 'Organization',
            name: data.worksFor,
          }
        : undefined,
      sameAs: data.socialProfiles || [],
    };
  }

  private reviewSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': data.itemType || 'Product',
        name: data.itemName,
      },
      author: {
        '@type': 'Person',
        name: data.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: data.ratingValue,
        bestRating: data.bestRating || 5,
      },
      reviewBody: data.reviewBody,
      datePublished: data.datePublished,
    };
  }

  private aggregateRatingSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      itemReviewed: {
        '@type': data.itemType || 'Product',
        name: data.itemName,
      },
      ratingValue: data.ratingValue,
      reviewCount: data.reviewCount,
      bestRating: data.bestRating || 5,
      worstRating: data.worstRating || 1,
    };
  }

  private videoSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: data.name,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      uploadDate: data.uploadDate,
      duration: data.duration,
      contentUrl: data.contentUrl,
      embedUrl: data.embedUrl,
      interactionStatistic: data.viewCount
        ? {
            '@type': 'InteractionCounter',
            interactionType: { '@type': 'WatchAction' },
            userInteractionCount: data.viewCount,
          }
        : undefined,
    };
  }

  private imageSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'ImageObject',
      contentUrl: data.contentUrl,
      url: data.url,
      name: data.name,
      description: data.description,
      width: data.width,
      height: data.height,
      caption: data.caption,
      author: data.author
        ? {
            '@type': 'Person',
            name: data.author,
          }
        : undefined,
    };
  }

  private softwareAppSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: data.name,
      description: data.description,
      applicationCategory: data.applicationCategory,
      operatingSystem: data.operatingSystem,
      offers: data.offers
        ? {
            '@type': 'Offer',
            price: data.offers.price,
            priceCurrency: data.offers.currency || 'USD',
          }
        : undefined,
      aggregateRating: data.rating
        ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating.value,
            reviewCount: data.rating.reviewCount,
          }
        : undefined,
    };
  }

  private courseSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: data.name,
      description: data.description,
      provider: data.provider
        ? {
            '@type': 'Organization',
            name: data.provider.name,
            sameAs: data.provider.url,
          }
        : undefined,
      offers: data.offers
        ? {
            '@type': 'Offer',
            price: data.offers.price,
            priceCurrency: data.offers.currency || 'USD',
          }
        : undefined,
    };
  }

  private recipeSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: data.name,
      description: data.description,
      image: data.image,
      author: {
        '@type': 'Person',
        name: data.author,
      },
      datePublished: data.datePublished,
      prepTime: data.prepTime,
      cookTime: data.cookTime,
      totalTime: data.totalTime,
      recipeYield: data.recipeYield,
      recipeCategory: data.recipeCategory,
      recipeCuisine: data.recipeCuisine,
      recipeIngredient: data.ingredients,
      recipeInstructions: data.instructions?.map((step: string, index: number) => ({
        '@type': 'HowToStep',
        position: index + 1,
        text: step,
      })),
      nutrition: data.nutrition
        ? {
            '@type': 'NutritionInformation',
            calories: data.nutrition.calories,
          }
        : undefined,
      aggregateRating: data.rating
        ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating.value,
            reviewCount: data.rating.reviewCount,
          }
        : undefined,
    };
  }

  private jobPostingSchema(data: any): SchemaTemplate {
    return {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: data.title,
      description: data.description,
      datePosted: data.datePosted,
      validThrough: data.validThrough,
      employmentType: data.employmentType,
      hiringOrganization: {
        '@type': 'Organization',
        name: data.hiringOrganization.name,
        sameAs: data.hiringOrganization.url,
        logo: data.hiringOrganization.logo,
      },
      jobLocation: data.jobLocation
        ? {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              streetAddress: data.jobLocation.address?.streetAddress,
              addressLocality: data.jobLocation.address?.city,
              addressRegion: data.jobLocation.address?.region,
              postalCode: data.jobLocation.address?.postalCode,
              addressCountry: data.jobLocation.address?.country,
            },
          }
        : undefined,
      baseSalary: data.baseSalary
        ? {
            '@type': 'MonetaryAmount',
            currency: data.baseSalary.currency || 'USD',
            value: {
              '@type': 'QuantitativeValue',
              value: data.baseSalary.value,
              unitText: data.baseSalary.unitText || 'YEAR',
            },
          }
        : undefined,
    };
  }
}
