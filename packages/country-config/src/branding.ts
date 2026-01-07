/**
 * @global-health/country-config - Branding Configuration
 *
 * SINGLE SOURCE OF TRUTH for all platform branding.
 * All user-facing text must reference this configuration.
 *
 * Rules:
 * - External-facing system identity: Use `canonical` name
 * - UI shorthand (dashboards, navigation): Use `shorthand` name
 * - Internal-only references: Can use any variant
 */

export interface BrandingConfig {
  /** Canonical external/system name - use for auth screens, emails, legal docs */
  canonical: string;

  /** UI shorthand name - acceptable in dashboards/navigation */
  shorthand: string;

  /** Primary domain */
  domain: string;

  /** Email domain */
  emailDomain: string;

  /** Support email */
  supportEmail: string;

  /** No-reply email */
  noReplyEmail: string;

  /** Legal entity name */
  legalEntity: string;

  /** Copyright text */
  copyright: string;
}

/**
 * Platform Branding Configuration
 * This is the authoritative source for all branding text.
 */
export const BRANDING: BrandingConfig = {
  // Canonical name for external-facing contexts
  canonical: 'The Unified Health',

  // Shorthand for UI elements
  shorthand: 'Unified Health',

  // Domain configuration
  domain: 'theunifiedhealth.com',
  emailDomain: 'theunifiedhealth.com',

  // Email addresses
  supportEmail: 'support@theunifiedhealth.com',
  noReplyEmail: 'noreply@theunifiedhealth.com',

  // Legal
  legalEntity: 'The Unified Health, Inc.',
  copyright: `\u00A9 ${new Date().getFullYear()} The Unified Health. All rights reserved.`,
};

/**
 * Helper functions for common branding use cases
 */
export const BrandingHelpers = {
  /** Get canonical name for external-facing contexts */
  getCanonicalName: () => BRANDING.canonical,

  /** Get shorthand name for UI elements */
  getShorthandName: () => BRANDING.shorthand,

  /** Get full URL with https */
  getFullUrl: () => `https://${BRANDING.domain}`,

  /** Get email sender in format: "Name <email>" */
  getEmailSender: () => `${BRANDING.canonical} <${BRANDING.noReplyEmail}>`,

  /** Get support email sender */
  getSupportSender: () => `${BRANDING.canonical} Support <${BRANDING.supportEmail}>`,

  /** Get copyright text */
  getCopyright: () => BRANDING.copyright,

  /** Get legal footer text */
  getLegalFooter: () =>
    `${BRANDING.copyright} | Privacy Policy | Terms of Service`,
};

/**
 * Allowed branding variants for CI enforcement
 * Only these values should appear in user-facing text
 */
export const ALLOWED_BRAND_VARIANTS = [
  'The Unified Health',
  'Unified Health',
  'theunifiedhealth.com',
] as const;

/**
 * Disallowed branding variants for CI enforcement
 * These patterns should trigger CI failures when found in user-facing code
 */
export const DISALLOWED_BRAND_PATTERNS = [
  'UnifiedHealth', // camelCase variant
  'unified health', // lowercase
  'UNIFIED HEALTH', // uppercase
  'Unified Health', // old variant
  'UnifiedHealthcare', // old camelCase
  'unified-health.com', // wrong domain
  'unifiedhealth.com', // wrong domain
] as const;

export default BRANDING;
