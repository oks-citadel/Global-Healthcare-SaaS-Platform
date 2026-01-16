import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../config/redis.service';
import { RulesService } from './rules.service';
import {
  RecommendRequestDto,
  RecommendResponseDto,
  RecommendationDto,
  NextBestActionRequestDto,
  NextBestActionResponseDto,
  ActionDto,
  ContentRequestDto,
  ContentResponseDto,
  PersonalizationRuleType,
} from './dto/personalization.dto';

@Injectable()
export class PersonalizationEngineService {
  private readonly CACHE_TTL = 60; // 1 minute for personalization responses
  private readonly CACHE_PREFIX = 'personalization:';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly rulesService: RulesService,
  ) {}

  async getRecommendations(dto: RecommendRequestDto): Promise<RecommendResponseDto> {
    const requestId = uuidv4();
    const { userId, context, limit = 5, excludeItems = [], metadata = {} } = dto;

    // Get user profile and traits
    const profile = await this.getProfileWithTraits(userId);

    // Build context for rule evaluation
    const evaluationContext = {
      userId,
      context,
      ...profile,
      ...metadata,
    };

    // Get matching recommendation rules
    const matchingRules = await this.rulesService.evaluateRules(
      PersonalizationRuleType.RECOMMENDATION,
      evaluationContext,
    );

    // Generate recommendations based on rules and user profile
    const recommendations: RecommendationDto[] = [];

    for (const rule of matchingRules) {
      for (const action of rule.actions) {
        if (action.type === 'recommend' && action.payload.items) {
          for (const item of action.payload.items) {
            if (!excludeItems.includes(item.itemId) && recommendations.length < limit) {
              recommendations.push({
                itemId: item.itemId,
                itemType: item.itemType || 'product',
                score: item.score || 1.0,
                reason: action.payload.reason || rule.name,
                metadata: item.metadata,
              });
            }
          }
        }
      }
    }

    // If not enough recommendations from rules, add default recommendations
    if (recommendations.length < limit) {
      const defaultRecommendations = await this.getDefaultRecommendations(
        limit - recommendations.length,
        excludeItems.concat(recommendations.map((r) => r.itemId)),
        context,
      );
      recommendations.push(...defaultRecommendations);
    }

    // Sort by score
    recommendations.sort((a, b) => b.score - a.score);

    const response: RecommendResponseDto = {
      userId,
      recommendations: recommendations.slice(0, limit),
      requestId,
      generatedAt: new Date(),
    };

    // Cache the response briefly
    await this.redis.set(
      `${this.CACHE_PREFIX}recommend:${requestId}`,
      response,
      this.CACHE_TTL,
    );

    return response;
  }

  async getNextBestActions(dto: NextBestActionRequestDto): Promise<NextBestActionResponseDto> {
    const requestId = uuidv4();
    const { userId, currentContext, goal, limit = 3, metadata = {} } = dto;

    // Get user profile and traits
    const profile = await this.getProfileWithTraits(userId);

    // Build context for rule evaluation
    const evaluationContext = {
      userId,
      currentContext,
      goal,
      ...profile,
      ...metadata,
    };

    // Get matching next-best-action rules
    const matchingRules = await this.rulesService.evaluateRules(
      PersonalizationRuleType.NEXT_BEST_ACTION,
      evaluationContext,
    );

    // Generate actions based on rules
    const actions: ActionDto[] = [];

    for (const rule of matchingRules) {
      for (const action of rule.actions) {
        if (action.type === 'suggest_action' && actions.length < limit) {
          actions.push({
            actionId: action.payload.actionId || uuidv4(),
            actionType: action.payload.actionType || 'cta',
            title: action.payload.title,
            description: action.payload.description,
            priority: action.payload.priority || rule.priority,
            ctaText: action.payload.ctaText,
            ctaUrl: action.payload.ctaUrl,
            metadata: action.payload.metadata,
          });
        }
      }
    }

    // If no actions from rules, add default actions
    if (actions.length === 0) {
      actions.push(...this.getDefaultActions(currentContext, goal));
    }

    // Sort by priority
    actions.sort((a, b) => b.priority - a.priority);

    const response: NextBestActionResponseDto = {
      userId,
      actions: actions.slice(0, limit),
      requestId,
      generatedAt: new Date(),
    };

    // Cache the response briefly
    await this.redis.set(
      `${this.CACHE_PREFIX}nba:${requestId}`,
      response,
      this.CACHE_TTL,
    );

    return response;
  }

  async getPersonalizedContent(dto: ContentRequestDto): Promise<ContentResponseDto> {
    const requestId = uuidv4();
    const { userId, slotId, pageContext, deviceType, metadata = {} } = dto;

    // Get user profile and traits
    const profile = await this.getProfileWithTraits(userId);

    // Build context for rule evaluation
    const evaluationContext = {
      userId,
      slotId,
      pageContext,
      deviceType,
      ...profile,
      ...metadata,
    };

    // Get matching content rules
    const matchingRules = await this.rulesService.evaluateRules(
      PersonalizationRuleType.CONTENT,
      evaluationContext,
    );

    // Find the best content variant
    let selectedVariant = {
      variantId: 'default',
      content: { message: 'Default content' },
      templateId: undefined as string | undefined,
      ruleId: undefined as string | undefined,
    };

    for (const rule of matchingRules) {
      for (const action of rule.actions) {
        if (action.type === 'show_content' && action.payload.slotId === slotId) {
          selectedVariant = {
            variantId: action.payload.variantId || rule.key,
            content: action.payload.content,
            templateId: action.payload.templateId,
            ruleId: rule.id,
          };
          break;
        }
      }
      if (selectedVariant.ruleId) break;
    }

    const response: ContentResponseDto = {
      userId,
      slotId,
      variant: selectedVariant,
      requestId,
      generatedAt: new Date(),
    };

    // Cache the response briefly
    await this.redis.set(
      `${this.CACHE_PREFIX}content:${requestId}`,
      response,
      this.CACHE_TTL,
    );

    return response;
  }

  private async getProfileWithTraits(userId: string): Promise<Record<string, any>> {
    // Try to find by ID first, then by external ID
    let profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      include: {
        traits: {
          include: { trait: true },
        },
        segmentMemberships: {
          where: { exitedAt: null },
          include: { segment: true },
        },
      },
    });

    if (!profile) {
      profile = await this.prisma.profile.findUnique({
        where: { externalUserId: userId },
        include: {
          traits: {
            include: { trait: true },
          },
          segmentMemberships: {
            where: { exitedAt: null },
            include: { segment: true },
          },
        },
      });
    }

    if (!profile) {
      // Return empty profile for anonymous users
      return { isAnonymous: true };
    }

    // Build trait map
    const traits: Record<string, any> = {};
    for (const pt of profile.traits) {
      traits[pt.trait.key] = pt.value;
    }

    // Build segment list
    const segments = profile.segmentMemberships.map((sm) => sm.segment.key);

    return {
      profileId: profile.id,
      externalUserId: profile.externalUserId,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      timezone: profile.timezone,
      locale: profile.locale,
      traits,
      segments,
      metadata: profile.metadata,
      isAnonymous: false,
    };
  }

  private async getDefaultRecommendations(
    limit: number,
    excludeItems: string[],
    context?: string,
  ): Promise<RecommendationDto[]> {
    // In a real implementation, this would call a recommendation ML model
    // For now, return placeholder recommendations
    const defaults: RecommendationDto[] = [];

    for (let i = 0; i < limit; i++) {
      const itemId = `default-item-${i + 1}`;
      if (!excludeItems.includes(itemId)) {
        defaults.push({
          itemId,
          itemType: 'product',
          score: 0.5 - i * 0.1,
          reason: 'Popular item',
          metadata: { context },
        });
      }
    }

    return defaults;
  }

  private getDefaultActions(currentContext?: string, goal?: string): ActionDto[] {
    // Return default actions based on context
    const actions: ActionDto[] = [
      {
        actionId: 'default-explore',
        actionType: 'navigation',
        title: 'Explore Features',
        description: 'Discover what you can do',
        priority: 50,
        ctaText: 'Explore',
        ctaUrl: '/features',
      },
      {
        actionId: 'default-help',
        actionType: 'support',
        title: 'Get Help',
        description: 'Need assistance?',
        priority: 40,
        ctaText: 'Help Center',
        ctaUrl: '/help',
      },
    ];

    if (goal === 'conversion') {
      actions.unshift({
        actionId: 'default-upgrade',
        actionType: 'upsell',
        title: 'Upgrade Your Plan',
        description: 'Unlock premium features',
        priority: 90,
        ctaText: 'Upgrade Now',
        ctaUrl: '/pricing',
      });
    }

    return actions;
  }
}
