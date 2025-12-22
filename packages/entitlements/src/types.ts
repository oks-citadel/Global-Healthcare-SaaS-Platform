/**
 * Entitlements Types
 * Defines subscription plans, tiers, add-ons, and usage metering
 */

// ============================================================================
// SUBSCRIPTION PLANS
// ============================================================================

/**
 * Available subscription plans
 */
export enum SubscriptionPlan {
  INDIVIDUAL = 'individual',
  FAMILY = 'family',
  ENTERPRISE = 'enterprise',
}

/**
 * Subscription tiers within each plan
 */
export enum SubscriptionTier {
  BASIC = 'basic',
  PRO = 'pro',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

/**
 * Subscription status
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
}

/**
 * Billing period
 */
export enum BillingPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
}

// ============================================================================
// ADD-ONS
// ============================================================================

/**
 * Available add-on features
 */
export enum AddOn {
  TELEHEALTH = 'telehealth',
  AI_ASSISTANT = 'ai_assistant',
  LAB_INTEGRATION = 'lab_integration',
  E_PRESCRIBE = 'e_prescribe',
  IMAGING_PACS = 'imaging_pacs',
  CHRONIC_CARE = 'chronic_care',
  MENTAL_HEALTH = 'mental_health',
  COUNTRY_ISOLATION = 'country_isolation',
  CUSTOM_BRANDING = 'custom_branding',
  API_ACCESS = 'api_access',
  PRIORITY_SUPPORT = 'priority_support',
  AUDIT_REPORTS = 'audit_reports',
  ADVANCED_ANALYTICS = 'advanced_analytics',
}

/**
 * Add-on status
 */
export enum AddOnStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
}

/**
 * Add-on subscription
 */
export interface AddOnSubscription {
  /** Add-on type */
  addOn: AddOn;

  /** Status */
  status: AddOnStatus;

  /** Start date */
  startDate: Date;

  /** End date (if applicable) */
  endDate?: Date;

  /** Quantity (for metered add-ons) */
  quantity?: number;

  /** Unit price in minor currency units */
  unitPriceMinor: number;

  /** Currency code */
  currency: string;
}

// ============================================================================
// ENTITLEMENTS
// ============================================================================

/**
 * Feature entitlement
 */
export interface FeatureEntitlement {
  /** Feature key */
  feature: string;

  /** Whether feature is enabled */
  enabled: boolean;

  /** Usage limit (if applicable) */
  limit?: number;

  /** Current usage */
  usage?: number;

  /** Whether limit is per-period */
  perPeriod?: boolean;

  /** Period for limit reset */
  periodType?: 'daily' | 'weekly' | 'monthly' | 'annually';
}

/**
 * Resource quota
 */
export interface ResourceQuota {
  /** Resource type */
  resource: string;

  /** Maximum allowed */
  maxAllowed: number;

  /** Current count */
  currentCount: number;

  /** Whether quota is hard (blocking) or soft (warning) */
  enforcement: 'hard' | 'soft';
}

// ============================================================================
// SUBSCRIPTION DEFINITION
// ============================================================================

/**
 * Complete subscription definition
 */
export interface Subscription {
  /** Subscription ID */
  id: string;

  /** Organization ID */
  organizationId: string;

  /** Tenant ID */
  tenantId: string;

  /** Plan type */
  plan: SubscriptionPlan;

  /** Tier level */
  tier: SubscriptionTier;

  /** Status */
  status: SubscriptionStatus;

  /** Billing period */
  billingPeriod: BillingPeriod;

  /** Start date */
  startDate: Date;

  /** Current period start */
  currentPeriodStart: Date;

  /** Current period end */
  currentPeriodEnd: Date;

  /** Trial end date (if in trial) */
  trialEnd?: Date;

  /** Cancel at period end */
  cancelAtPeriodEnd: boolean;

  /** Cancellation date (if cancelled) */
  cancelledAt?: Date;

  /** Active add-ons */
  addOns: AddOnSubscription[];

  /** Feature entitlements */
  entitlements: FeatureEntitlement[];

  /** Resource quotas */
  quotas: ResourceQuota[];

  /** Country code */
  countryCode: string;

  /** Region ID */
  regionId: string;

  /** Base price in minor currency units */
  basePriceMinor: number;

  /** Currency code */
  currency: string;

  /** Stripe subscription ID */
  stripeSubscriptionId?: string;

  /** Metadata */
  metadata?: Record<string, any>;

  /** Created at */
  createdAt: Date;

  /** Updated at */
  updatedAt: Date;
}

// ============================================================================
// PLAN DEFINITIONS
// ============================================================================

/**
 * Plan definition with included features and limits
 */
export interface PlanDefinition {
  /** Plan type */
  plan: SubscriptionPlan;

  /** Tier level */
  tier: SubscriptionTier;

  /** Display name */
  name: string;

  /** Description */
  description: string;

  /** Base price per month in minor currency units (USD cents) */
  basePriceMonthly: number;

  /** Base price per year in minor currency units (USD cents) */
  basePriceAnnually: number;

  /** Included features */
  includedFeatures: FeatureEntitlement[];

  /** Included quotas */
  includedQuotas: ResourceQuota[];

  /** Available add-ons for this plan */
  availableAddOns: AddOn[];

  /** Whether plan is active */
  active: boolean;

  /** Whether plan is visible in public pricing */
  publicVisible: boolean;

  /** Sort order */
  sortOrder: number;
}

/**
 * Add-on definition
 */
export interface AddOnDefinition {
  /** Add-on type */
  addOn: AddOn;

  /** Display name */
  name: string;

  /** Description */
  description: string;

  /** Price per month in minor currency units (USD cents) */
  priceMonthly: number;

  /** Price per year in minor currency units (USD cents) */
  priceAnnually: number;

  /** Whether add-on is metered */
  metered: boolean;

  /** Unit name for metered add-ons */
  unitName?: string;

  /** Price per unit for metered add-ons */
  unitPrice?: number;

  /** Required base plan */
  requiredPlans?: SubscriptionPlan[];

  /** Required tier */
  requiredTiers?: SubscriptionTier[];

  /** Whether add-on is active */
  active: boolean;
}

// ============================================================================
// USAGE METERING
// ============================================================================

/**
 * Usage event type
 */
export enum UsageEventType {
  API_CALL = 'api_call',
  TELEHEALTH_SESSION = 'telehealth_session',
  AI_INFERENCE = 'ai_inference',
  LAB_ORDER = 'lab_order',
  E_PRESCRIPTION = 'e_prescription',
  IMAGING_STUDY = 'imaging_study',
  STORAGE_GB = 'storage_gb',
  PATIENT_REGISTERED = 'patient_registered',
  PROVIDER_REGISTERED = 'provider_registered',
}

/**
 * Usage event
 */
export interface UsageEvent {
  /** Event ID */
  id: string;

  /** Subscription ID */
  subscriptionId: string;

  /** Organization ID */
  organizationId: string;

  /** Tenant ID */
  tenantId: string;

  /** Event type */
  eventType: UsageEventType;

  /** Quantity */
  quantity: number;

  /** Timestamp */
  timestamp: Date;

  /** Metadata */
  metadata?: Record<string, any>;

  /** Idempotency key */
  idempotencyKey: string;
}

/**
 * Usage summary
 */
export interface UsageSummary {
  /** Subscription ID */
  subscriptionId: string;

  /** Period start */
  periodStart: Date;

  /** Period end */
  periodEnd: Date;

  /** Usage by event type */
  usage: Record<UsageEventType, number>;

  /** Limits by event type */
  limits: Record<UsageEventType, number | null>;

  /** Overage charges in minor currency units */
  overageCharges: number;

  /** Currency */
  currency: string;
}

// ============================================================================
// ENTITLEMENT CHECK
// ============================================================================

/**
 * Entitlement check request
 */
export interface EntitlementCheckRequest {
  /** Organization ID */
  organizationId: string;

  /** Tenant ID */
  tenantId: string;

  /** Feature to check */
  feature: string;

  /** Quantity required (for metered features) */
  quantity?: number;
}

/**
 * Entitlement check result
 */
export interface EntitlementCheckResult {
  /** Whether access is allowed */
  allowed: boolean;

  /** Reason for denial (if denied) */
  reason?: string;

  /** Current usage (if applicable) */
  currentUsage?: number;

  /** Limit (if applicable) */
  limit?: number;

  /** Remaining (if applicable) */
  remaining?: number;

  /** Upgrade path (if denied) */
  upgradePath?: {
    plan?: SubscriptionPlan;
    tier?: SubscriptionTier;
    addOn?: AddOn;
  };
}

// ============================================================================
// PRICE BOOK
// ============================================================================

/**
 * Country-specific pricing
 */
export interface CountryPriceBook {
  /** Country code */
  countryCode: string;

  /** Currency code */
  currency: string;

  /** Plan prices */
  planPrices: Record<string, Record<string, { monthly: number; annually: number }>>;

  /** Add-on prices */
  addOnPrices: Record<string, { monthly: number; annually: number; unitPrice?: number }>;

  /** Tax rate (percentage) */
  taxRate: number;

  /** Whether prices include tax */
  pricesIncludeTax: boolean;

  /** Last updated */
  lastUpdated: Date;
}

// ============================================================================
// SUBSCRIPTION EVENTS
// ============================================================================

/**
 * Subscription event type
 */
export enum SubscriptionEventType {
  CREATED = 'subscription.created',
  ACTIVATED = 'subscription.activated',
  UPGRADED = 'subscription.upgraded',
  DOWNGRADED = 'subscription.downgraded',
  RENEWED = 'subscription.renewed',
  CANCELLED = 'subscription.cancelled',
  SUSPENDED = 'subscription.suspended',
  REACTIVATED = 'subscription.reactivated',
  EXPIRED = 'subscription.expired',
  ADDON_ADDED = 'subscription.addon_added',
  ADDON_REMOVED = 'subscription.addon_removed',
  USAGE_LIMIT_REACHED = 'subscription.usage_limit_reached',
  PAYMENT_FAILED = 'subscription.payment_failed',
  PAYMENT_SUCCEEDED = 'subscription.payment_succeeded',
}

/**
 * Subscription event
 */
export interface SubscriptionEvent {
  /** Event ID */
  id: string;

  /** Event type */
  type: SubscriptionEventType;

  /** Subscription ID */
  subscriptionId: string;

  /** Organization ID */
  organizationId: string;

  /** Tenant ID */
  tenantId: string;

  /** User ID (who triggered) */
  userId?: string;

  /** Previous state */
  previousState?: Partial<Subscription>;

  /** New state */
  newState?: Partial<Subscription>;

  /** Metadata */
  metadata?: Record<string, any>;

  /** Timestamp */
  timestamp: Date;
}

// ============================================================================
// DEFAULT PLAN DEFINITIONS
// ============================================================================

/**
 * Default plan definitions
 */
export const DEFAULT_PLANS: PlanDefinition[] = [
  {
    plan: SubscriptionPlan.INDIVIDUAL,
    tier: SubscriptionTier.BASIC,
    name: 'Individual Basic',
    description: 'Essential features for individual patients',
    basePriceMonthly: 0, // Free
    basePriceAnnually: 0,
    includedFeatures: [
      { feature: 'patient_portal', enabled: true },
      { feature: 'appointment_booking', enabled: true, limit: 4, perPeriod: true, periodType: 'monthly' },
      { feature: 'medical_records', enabled: true },
      { feature: 'messaging', enabled: true, limit: 10, perPeriod: true, periodType: 'monthly' },
    ],
    includedQuotas: [
      { resource: 'storage_mb', maxAllowed: 100, currentCount: 0, enforcement: 'hard' },
    ],
    availableAddOns: [AddOn.TELEHEALTH, AddOn.CHRONIC_CARE],
    active: true,
    publicVisible: true,
    sortOrder: 1,
  },
  {
    plan: SubscriptionPlan.INDIVIDUAL,
    tier: SubscriptionTier.PRO,
    name: 'Individual Pro',
    description: 'Enhanced features for active patients',
    basePriceMonthly: 1499, // $14.99
    basePriceAnnually: 14990, // $149.90
    includedFeatures: [
      { feature: 'patient_portal', enabled: true },
      { feature: 'appointment_booking', enabled: true },
      { feature: 'medical_records', enabled: true },
      { feature: 'messaging', enabled: true },
      { feature: 'telehealth', enabled: true, limit: 2, perPeriod: true, periodType: 'monthly' },
      { feature: 'health_tracking', enabled: true },
    ],
    includedQuotas: [
      { resource: 'storage_mb', maxAllowed: 1000, currentCount: 0, enforcement: 'hard' },
      { resource: 'family_members', maxAllowed: 1, currentCount: 0, enforcement: 'hard' },
    ],
    availableAddOns: [AddOn.TELEHEALTH, AddOn.AI_ASSISTANT, AddOn.CHRONIC_CARE, AddOn.MENTAL_HEALTH],
    active: true,
    publicVisible: true,
    sortOrder: 2,
  },
  {
    plan: SubscriptionPlan.FAMILY,
    tier: SubscriptionTier.PREMIUM,
    name: 'Family Premium',
    description: 'Complete healthcare for the whole family',
    basePriceMonthly: 3999, // $39.99
    basePriceAnnually: 39990, // $399.90
    includedFeatures: [
      { feature: 'patient_portal', enabled: true },
      { feature: 'appointment_booking', enabled: true },
      { feature: 'medical_records', enabled: true },
      { feature: 'messaging', enabled: true },
      { feature: 'telehealth', enabled: true },
      { feature: 'health_tracking', enabled: true },
      { feature: 'ai_health_assistant', enabled: true, limit: 20, perPeriod: true, periodType: 'monthly' },
      { feature: 'family_dashboard', enabled: true },
    ],
    includedQuotas: [
      { resource: 'storage_mb', maxAllowed: 10000, currentCount: 0, enforcement: 'hard' },
      { resource: 'family_members', maxAllowed: 6, currentCount: 0, enforcement: 'hard' },
    ],
    availableAddOns: Object.values(AddOn).filter(a => a !== AddOn.COUNTRY_ISOLATION),
    active: true,
    publicVisible: true,
    sortOrder: 3,
  },
  {
    plan: SubscriptionPlan.ENTERPRISE,
    tier: SubscriptionTier.ENTERPRISE,
    name: 'Enterprise',
    description: 'Custom solution for healthcare organizations',
    basePriceMonthly: 0, // Custom pricing
    basePriceAnnually: 0,
    includedFeatures: [
      { feature: '*', enabled: true }, // All features
    ],
    includedQuotas: [
      { resource: 'storage_mb', maxAllowed: -1, currentCount: 0, enforcement: 'soft' }, // Unlimited
      { resource: 'patients', maxAllowed: -1, currentCount: 0, enforcement: 'soft' },
      { resource: 'providers', maxAllowed: -1, currentCount: 0, enforcement: 'soft' },
    ],
    availableAddOns: Object.values(AddOn),
    active: true,
    publicVisible: true,
    sortOrder: 4,
  },
];

/**
 * Default add-on definitions
 */
export const DEFAULT_ADDONS: AddOnDefinition[] = [
  {
    addOn: AddOn.TELEHEALTH,
    name: 'Telehealth',
    description: 'Video consultations with healthcare providers',
    priceMonthly: 999, // $9.99
    priceAnnually: 9990,
    metered: true,
    unitName: 'session',
    unitPrice: 500, // $5.00 per additional session
    active: true,
  },
  {
    addOn: AddOn.AI_ASSISTANT,
    name: 'AI Health Assistant',
    description: 'AI-powered health insights and symptom checking',
    priceMonthly: 499, // $4.99
    priceAnnually: 4990,
    metered: true,
    unitName: 'query',
    unitPrice: 10, // $0.10 per query over limit
    requiredTiers: [SubscriptionTier.PRO, SubscriptionTier.PREMIUM, SubscriptionTier.ENTERPRISE],
    active: true,
  },
  {
    addOn: AddOn.COUNTRY_ISOLATION,
    name: 'Country Data Isolation',
    description: 'Dedicated infrastructure for strict data residency requirements',
    priceMonthly: 99900, // $999.00
    priceAnnually: 999000,
    metered: false,
    requiredPlans: [SubscriptionPlan.ENTERPRISE],
    active: true,
  },
  {
    addOn: AddOn.API_ACCESS,
    name: 'API Access',
    description: 'Programmatic access to platform APIs',
    priceMonthly: 4999, // $49.99
    priceAnnually: 49990,
    metered: true,
    unitName: 'request',
    unitPrice: 1, // $0.01 per request over limit
    requiredPlans: [SubscriptionPlan.ENTERPRISE],
    active: true,
  },
];
