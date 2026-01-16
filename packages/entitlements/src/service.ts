/**
 * Entitlements Service
 * Server-side enforcement of subscriptions and feature access
 */

import {
  Subscription,
  SubscriptionPlan,
  SubscriptionTier,
  SubscriptionStatus,
  AddOn,
  AddOnStatus,
  EntitlementCheckRequest,
  EntitlementCheckResult,
  UsageEvent,
  UsageEventType,
  UsageSummary,
  SubscriptionEvent,
  SubscriptionEventType,
  PlanDefinition,
  AddOnDefinition,
  DEFAULT_PLANS,
  DEFAULT_ADDONS,
} from "./types";

/**
 * Entitlements service interface
 */
export interface IEntitlementsService {
  // Subscription management
  getSubscription(
    organizationId: string,
    tenantId: string,
  ): Promise<Subscription | null>;
  createSubscription(
    subscription: Omit<Subscription, "id" | "createdAt" | "updatedAt">,
  ): Promise<Subscription>;
  updateSubscription(
    id: string,
    updates: Partial<Subscription>,
  ): Promise<Subscription>;
  cancelSubscription(
    id: string,
    cancelAtPeriodEnd: boolean,
  ): Promise<Subscription>;

  // Entitlement checks
  checkEntitlement(
    request: EntitlementCheckRequest,
  ): Promise<EntitlementCheckResult>;
  checkFeature(
    organizationId: string,
    tenantId: string,
    feature: string,
  ): Promise<boolean>;
  checkAddOn(
    organizationId: string,
    tenantId: string,
    addOn: AddOn,
  ): Promise<boolean>;

  // Usage metering
  recordUsage(event: Omit<UsageEvent, "id">): Promise<UsageEvent>;
  getUsageSummary(
    subscriptionId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<UsageSummary>;

  // Plan definitions
  getPlanDefinition(
    plan: SubscriptionPlan,
    tier: SubscriptionTier,
  ): PlanDefinition | undefined;
  getAddOnDefinition(addOn: AddOn): AddOnDefinition | undefined;
}

/**
 * In-memory entitlements service implementation
 * For production, replace with database-backed implementation
 */
export class EntitlementsService implements IEntitlementsService {
  private subscriptions: Map<string, Subscription> = new Map();
  private usageEvents: Map<string, UsageEvent[]> = new Map();
  private planDefinitions: Map<string, PlanDefinition> = new Map();
  private addOnDefinitions: Map<AddOn, AddOnDefinition> = new Map();

  constructor() {
    // Initialize plan definitions
    for (const plan of DEFAULT_PLANS) {
      const key = `${plan.plan}:${plan.tier}`;
      this.planDefinitions.set(key, plan);
    }

    // Initialize add-on definitions
    for (const addOn of DEFAULT_ADDONS) {
      this.addOnDefinitions.set(addOn.addOn, addOn);
    }
  }

  /**
   * Get subscription for organization/tenant
   */
  async getSubscription(
    organizationId: string,
    tenantId: string,
  ): Promise<Subscription | null> {
    for (const subscription of this.subscriptions.values()) {
      if (
        subscription.organizationId === organizationId &&
        subscription.tenantId === tenantId
      ) {
        return subscription;
      }
    }
    return null;
  }

  /**
   * Create a new subscription
   */
  async createSubscription(
    subscription: Omit<Subscription, "id" | "createdAt" | "updatedAt">,
  ): Promise<Subscription> {
    const id = this.generateId();
    const now = new Date();

    const newSubscription: Subscription = {
      ...subscription,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.subscriptions.set(id, newSubscription);
    await this.emitEvent(SubscriptionEventType.CREATED, newSubscription);

    return newSubscription;
  }

  /**
   * Update subscription
   */
  async updateSubscription(
    id: string,
    updates: Partial<Subscription>,
  ): Promise<Subscription> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      throw new Error(`Subscription not found: ${id}`);
    }

    const previousState = { ...subscription };
    const updatedSubscription: Subscription = {
      ...subscription,
      ...updates,
      updatedAt: new Date(),
    };

    this.subscriptions.set(id, updatedSubscription);

    // Determine event type
    let eventType = SubscriptionEventType.ACTIVATED;
    if (updates.tier && updates.tier !== subscription.tier) {
      const tierOrder = [
        SubscriptionTier.BASIC,
        SubscriptionTier.PRO,
        SubscriptionTier.PREMIUM,
        SubscriptionTier.ENTERPRISE,
      ];
      eventType =
        tierOrder.indexOf(updates.tier) > tierOrder.indexOf(subscription.tier)
          ? SubscriptionEventType.UPGRADED
          : SubscriptionEventType.DOWNGRADED;
    }

    await this.emitEvent(eventType, updatedSubscription, previousState);

    return updatedSubscription;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    id: string,
    cancelAtPeriodEnd: boolean,
  ): Promise<Subscription> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      throw new Error(`Subscription not found: ${id}`);
    }

    const previousState = { ...subscription };
    const updatedSubscription: Subscription = {
      ...subscription,
      cancelAtPeriodEnd,
      cancelledAt: cancelAtPeriodEnd ? undefined : new Date(),
      status: cancelAtPeriodEnd
        ? subscription.status
        : SubscriptionStatus.CANCELLED,
      updatedAt: new Date(),
    };

    this.subscriptions.set(id, updatedSubscription);
    await this.emitEvent(
      SubscriptionEventType.CANCELLED,
      updatedSubscription,
      previousState,
    );

    return updatedSubscription;
  }

  /**
   * Check if organization/tenant has access to a feature
   */
  async checkEntitlement(
    request: EntitlementCheckRequest,
  ): Promise<EntitlementCheckResult> {
    const subscription = await this.getSubscription(
      request.organizationId,
      request.tenantId,
    );

    // No subscription found
    if (!subscription) {
      return {
        allowed: false,
        reason: "No active subscription found",
        upgradePath: {
          plan: SubscriptionPlan.INDIVIDUAL,
          tier: SubscriptionTier.BASIC,
        },
      };
    }

    // Subscription not active
    if (
      subscription.status !== SubscriptionStatus.ACTIVE &&
      subscription.status !== SubscriptionStatus.TRIAL
    ) {
      return {
        allowed: false,
        reason: `Subscription is ${subscription.status}`,
      };
    }

    // Check feature entitlement
    const entitlement = subscription.entitlements.find(
      (e) => e.feature === request.feature || e.feature === "*",
    );

    if (!entitlement || !entitlement.enabled) {
      // Check if feature is available via add-on
      const addOnFeature = this.getAddOnForFeature(request.feature);
      if (addOnFeature) {
        const hasAddOn = subscription.addOns.some(
          (a) => a.addOn === addOnFeature && a.status === AddOnStatus.ACTIVE,
        );
        if (hasAddOn) {
          return { allowed: true };
        }
        return {
          allowed: false,
          reason: `Feature requires ${addOnFeature} add-on`,
          upgradePath: { addOn: addOnFeature },
        };
      }

      return {
        allowed: false,
        reason: "Feature not included in subscription",
        upgradePath: this.suggestUpgrade(subscription, request.feature),
      };
    }

    // Check usage limits
    if (entitlement.limit !== undefined) {
      const usage = entitlement.usage ?? 0;
      const quantity = request.quantity ?? 1;

      if (usage + quantity > entitlement.limit) {
        return {
          allowed: false,
          reason: "Usage limit exceeded",
          currentUsage: usage,
          limit: entitlement.limit,
          remaining: Math.max(0, entitlement.limit - usage),
          upgradePath: this.suggestUpgrade(subscription, request.feature),
        };
      }

      return {
        allowed: true,
        currentUsage: usage,
        limit: entitlement.limit,
        remaining: entitlement.limit - usage - quantity,
      };
    }

    return { allowed: true };
  }

  /**
   * Quick check if feature is allowed
   */
  async checkFeature(
    organizationId: string,
    tenantId: string,
    feature: string,
  ): Promise<boolean> {
    const result = await this.checkEntitlement({
      organizationId,
      tenantId,
      feature,
    });
    return result.allowed;
  }

  /**
   * Check if add-on is active
   */
  async checkAddOn(
    organizationId: string,
    tenantId: string,
    addOn: AddOn,
  ): Promise<boolean> {
    const subscription = await this.getSubscription(organizationId, tenantId);
    if (!subscription) return false;

    return subscription.addOns.some(
      (a) => a.addOn === addOn && a.status === AddOnStatus.ACTIVE,
    );
  }

  /**
   * Record usage event
   */
  async recordUsage(event: Omit<UsageEvent, "id">): Promise<UsageEvent> {
    const id = this.generateId();
    const usageEvent: UsageEvent = { ...event, id };

    // Store event
    const key = event.subscriptionId;
    const events = this.usageEvents.get(key) ?? [];
    events.push(usageEvent);
    this.usageEvents.set(key, events);

    // Update entitlement usage
    const subscription = this.subscriptions.get(event.subscriptionId);
    if (subscription) {
      const featureMap: Record<UsageEventType, string> = {
        [UsageEventType.API_CALL]: "api_calls",
        [UsageEventType.TELEHEALTH_SESSION]: "telehealth",
        [UsageEventType.AI_INFERENCE]: "ai_health_assistant",
        [UsageEventType.LAB_ORDER]: "lab_orders",
        [UsageEventType.E_PRESCRIPTION]: "e_prescribe",
        [UsageEventType.IMAGING_STUDY]: "imaging",
        [UsageEventType.STORAGE_GB]: "storage",
        [UsageEventType.PATIENT_REGISTERED]: "patients",
        [UsageEventType.PROVIDER_REGISTERED]: "providers",
        [UsageEventType.VIDEO_CALL]: "video_consultation",
        [UsageEventType.SMS_SENT]: "sms_notification",
        [UsageEventType.EMAIL_SENT]: "email_notification",
        [UsageEventType.DOCUMENT_GENERATED]: "document_generation",
        [UsageEventType.REPORT_GENERATED]: "report_generation",
        [UsageEventType.LAB_RESULT_PROCESSED]: "lab_result",
        [UsageEventType.PRESCRIPTION_FILLED]: "prescription",
      };

      const feature = featureMap[event.eventType];
      const entitlement = subscription.entitlements.find(
        (e) => e.feature === feature,
      );
      if (entitlement) {
        entitlement.usage = (entitlement.usage ?? 0) + event.quantity;

        // Check if limit reached
        if (entitlement.limit && entitlement.usage >= entitlement.limit) {
          await this.emitEvent(
            SubscriptionEventType.USAGE_LIMIT_REACHED,
            subscription,
          );
        }
      }
    }

    return usageEvent;
  }

  /**
   * Get usage summary for period
   */
  async getUsageSummary(
    subscriptionId: string,
    periodStart: Date,
    periodEnd: Date,
  ): Promise<UsageSummary> {
    const events = this.usageEvents.get(subscriptionId) ?? [];
    const periodEvents = events.filter(
      (e) => e.timestamp >= periodStart && e.timestamp <= periodEnd,
    );

    const usage: Record<UsageEventType, number> = {} as any;
    for (const eventType of Object.values(UsageEventType)) {
      usage[eventType] = periodEvents
        .filter((e) => e.eventType === eventType)
        .reduce((sum, e) => sum + e.quantity, 0);
    }

    const subscription = this.subscriptions.get(subscriptionId);
    const limits: Record<UsageEventType, number | null> = {} as any;

    // Calculate overage charges based on plan limits and usage
    let overageCharges = 0;

    if (subscription) {
      const planDef = this.planDefinitions.get(
        `${subscription.plan}:${subscription.tier}`,
      );

      if (planDef) {
        // Get limits from plan definition
        for (const feature of planDef.includedFeatures) {
          if (feature.limit !== undefined) {
            // Map feature to usage event type
            const eventType = this.featureToUsageEventType(feature.feature);
            if (eventType) {
              limits[eventType] = feature.limit;

              // Calculate overage if usage exceeds limit
              const currentUsage = usage[eventType] || 0;
              if (currentUsage > feature.limit) {
                const overage = currentUsage - feature.limit;
                // Default overage rate: $0.10 per unit (configurable per plan)
                const overageRate = planDef.overageRates?.[eventType] ?? 10; // cents
                overageCharges += overage * overageRate;
              }
            }
          }
        }
      }
    }

    return {
      subscriptionId,
      periodStart,
      periodEnd,
      usage,
      limits,
      overageCharges,
      currency: subscription?.currency ?? "USD",
    };
  }

  /**
   * Get plan definition
   */
  getPlanDefinition(
    plan: SubscriptionPlan,
    tier: SubscriptionTier,
  ): PlanDefinition | undefined {
    return this.planDefinitions.get(`${plan}:${tier}`);
  }

  /**
   * Get add-on definition
   */
  getAddOnDefinition(addOn: AddOn): AddOnDefinition | undefined {
    return this.addOnDefinitions.get(addOn);
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private generateId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getAddOnForFeature(feature: string): AddOn | undefined {
    const featureToAddOn: Record<string, AddOn> = {
      telehealth: AddOn.TELEHEALTH,
      video_consultation: AddOn.TELEHEALTH,
      ai_health_assistant: AddOn.AI_ASSISTANT,
      ai_inference: AddOn.AI_ASSISTANT,
      lab_integration: AddOn.LAB_INTEGRATION,
      e_prescribe: AddOn.E_PRESCRIBE,
      imaging_pacs: AddOn.IMAGING_PACS,
      chronic_care: AddOn.CHRONIC_CARE,
      mental_health: AddOn.MENTAL_HEALTH,
      country_isolation: AddOn.COUNTRY_ISOLATION,
      custom_branding: AddOn.CUSTOM_BRANDING,
      api_access: AddOn.API_ACCESS,
    };
    return featureToAddOn[feature];
  }

  private suggestUpgrade(
    subscription: Subscription,
    feature: string,
  ):
    | { plan?: SubscriptionPlan; tier?: SubscriptionTier; addOn?: AddOn }
    | undefined {
    // Check if add-on would enable feature
    const addOn = this.getAddOnForFeature(feature);
    if (addOn) {
      const addOnDef = this.addOnDefinitions.get(addOn);
      if (addOnDef?.active) {
        return { addOn };
      }
    }

    // Suggest tier upgrade
    const tierOrder = [
      SubscriptionTier.BASIC,
      SubscriptionTier.PRO,
      SubscriptionTier.PREMIUM,
      SubscriptionTier.ENTERPRISE,
    ];
    const currentTierIndex = tierOrder.indexOf(subscription.tier);

    for (let i = currentTierIndex + 1; i < tierOrder.length; i++) {
      const planDef = this.planDefinitions.get(
        `${subscription.plan}:${tierOrder[i]}`,
      );
      if (
        planDef?.includedFeatures.some(
          (f) => f.feature === feature || f.feature === "*",
        )
      ) {
        return { tier: tierOrder[i] };
      }
    }

    // Suggest enterprise
    return {
      plan: SubscriptionPlan.ENTERPRISE,
      tier: SubscriptionTier.ENTERPRISE,
    };
  }

  private async emitEvent(
    type: SubscriptionEventType,
    subscription: Subscription,
    previousState?: Partial<Subscription>,
  ): Promise<void> {
    const event: SubscriptionEvent = {
      id: this.generateId(),
      type,
      subscriptionId: subscription.id,
      organizationId: subscription.organizationId,
      tenantId: subscription.tenantId,
      previousState,
      newState: subscription,
      timestamp: new Date(),
    };

    // Emit to registered event handlers
    this.eventHandlers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error(`[Entitlements] Event handler error for ${type}:`, error);
      }
    });

    // Log event for audit trail
    console.log(`[Entitlements] Event: ${type}`, event.id);
  }

  /**
   * Map feature name to usage event type
   */
  private featureToUsageEventType(feature: string): UsageEventType | null {
    const featureToEventType: Record<string, UsageEventType> = {
      video_consultation: UsageEventType.VIDEO_CALL,
      telehealth: UsageEventType.VIDEO_CALL,
      ai_inference: UsageEventType.AI_INFERENCE,
      ai_health_assistant: UsageEventType.AI_INFERENCE,
      storage: UsageEventType.STORAGE_GB,
      file_storage: UsageEventType.STORAGE_GB,
      api_call: UsageEventType.API_CALL,
      api_access: UsageEventType.API_CALL,
      sms: UsageEventType.SMS_SENT,
      sms_notification: UsageEventType.SMS_SENT,
      email: UsageEventType.EMAIL_SENT,
      email_notification: UsageEventType.EMAIL_SENT,
      document_generation: UsageEventType.DOCUMENT_GENERATED,
      report_generation: UsageEventType.REPORT_GENERATED,
      lab_result: UsageEventType.LAB_RESULT_PROCESSED,
      lab_integration: UsageEventType.LAB_RESULT_PROCESSED,
      prescription: UsageEventType.PRESCRIPTION_FILLED,
      e_prescribe: UsageEventType.PRESCRIPTION_FILLED,
    };

    return featureToEventType[feature] || null;
  }

  /**
   * Event handlers for subscription events
   */
  private eventHandlers: Set<(event: SubscriptionEvent) => void> = new Set();

  /**
   * Register an event handler for subscription events
   */
  onEvent(handler: (event: SubscriptionEvent) => void): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }
}

/**
 * Singleton instance
 */
let instance: EntitlementsService | null = null;

/**
 * Get entitlements service instance
 */
export function getEntitlementsService(): EntitlementsService {
  if (!instance) {
    instance = new EntitlementsService();
  }
  return instance;
}

/**
 * Middleware helper for Express/Fastify
 */
export function requireEntitlement(feature: string) {
  return async (req: any, res: any, next: any) => {
    const service = getEntitlementsService();
    const { organizationId, tenantId } = req.context ?? req.user ?? {};

    if (!organizationId || !tenantId) {
      return res.status(401).json({ error: "Missing organization context" });
    }

    const result = await service.checkEntitlement({
      organizationId,
      tenantId,
      feature,
    });

    if (!result.allowed) {
      return res.status(403).json({
        error: "Feature not available",
        reason: result.reason,
        upgradePath: result.upgradePath,
      });
    }

    req.entitlement = result;
    next();
  };
}
