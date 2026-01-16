/**
 * @unified-health/asset-branding
 *
 * Healthcare-grade brand system and design tokens for The Unified Health platform.
 * This package provides the single source of truth for all visual identity across
 * patient, provider, admin, and partner surfaces.
 *
 * @version 1.0.0
 * @license UNLICENSED
 * @author The Unified Health, Inc.
 */

import tokens from './tokens.json';
import patientTheme from './patient.theme.json';
import providerTheme from './provider.theme.json';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface SemanticColor {
  light: string;
  base: string;
  dark: string;
  text: string;
}

export interface BrandColors {
  clinicalBlue: ColorScale;
  trustBlack: ColorScale;
  clinicalWhite: {
    pure: string;
    warm: string;
    cool: string;
  };
  accentGreen: ColorScale;
}

export interface SemanticColors {
  success: SemanticColor;
  warning: SemanticColor;
  error: SemanticColor;
  info: SemanticColor;
  critical: SemanticColor;
}

export interface Typography {
  fontFamily: {
    sans: string;
    display: string;
    mono: string;
  };
  fontSize: Record<string, { value: string; lineHeight: string }>;
  fontWeight: Record<string, string>;
}

export interface Spacing {
  [key: string]: string;
}

export interface DesignTokens {
  version: string;
  color: {
    brand: BrandColors;
    semantic: SemanticColors;
    surface: Record<string, string>;
    text: Record<string, string>;
    border: Record<string, string>;
  };
  typography: Typography;
  spacing: Spacing;
  borderRadius: Record<string, string>;
  shadow: Record<string, string>;
  transition: {
    duration: Record<string, string>;
    easing: Record<string, string>;
  };
}

export type ThemeMode = 'light' | 'dark';
export type UserRole = 'patient' | 'provider' | 'admin';

export interface ThemeConfig {
  name: string;
  description: string;
  version: string;
  extends: string;
  overrides: Record<string, unknown>;
  componentOverrides: Record<string, unknown>;
  uxGuidelines: Record<string, unknown>;
}

// =============================================================================
// DESIGN TOKENS
// =============================================================================

/**
 * Core design tokens - the single source of truth for all visual design decisions.
 * These tokens are WCAG AA+ compliant and optimized for healthcare readability.
 */
export const designTokens = tokens;

/**
 * Patient-facing theme configuration.
 * Optimized for approachability, clarity, and reduced cognitive load.
 */
export const patientThemeConfig: ThemeConfig = patientTheme as ThemeConfig;

/**
 * Provider/clinician-facing theme configuration.
 * Optimized for efficiency, data density, and clinical precision.
 */
export const providerThemeConfig: ThemeConfig = providerTheme as ThemeConfig;

// =============================================================================
// COLOR UTILITIES
// =============================================================================

/**
 * Get a color value from the design tokens.
 */
export function getColor(path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = tokens.color;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  if (current && typeof current === 'object' && '$value' in current) {
    return (current as { $value: string }).$value;
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Clinical Blue color palette - primary brand color.
 */
export const clinicalBlue = {
  50: '#f0f7ff',
  100: '#e0effe',
  200: '#b9dffc',
  300: '#7cc7fa',
  400: '#36aaf5',
  500: '#0c8ee6',
  600: '#0070c4',
  700: '#01599f',
  800: '#064b83',
  900: '#0b3f6d',
  950: '#072849',
} as const;

/**
 * Trust Black color palette - typography and borders.
 */
export const trustBlack = {
  50: '#f6f6f6',
  100: '#e7e7e7',
  200: '#d1d1d1',
  300: '#b0b0b0',
  400: '#888888',
  500: '#6d6d6d',
  600: '#5d5d5d',
  700: '#4f4f4f',
  800: '#454545',
  900: '#3d3d3d',
  950: '#1a1a1a',
} as const;

/**
 * Accent Green color palette - success indicators.
 */
export const accentGreen = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
  950: '#052e16',
} as const;

/**
 * Semantic colors for status indicators.
 */
export const semanticColors = {
  success: {
    light: '#dcfce7',
    base: '#22c55e',
    dark: '#15803d',
    text: '#14532d',
  },
  warning: {
    light: '#fef3c7',
    base: '#f59e0b',
    dark: '#b45309',
    text: '#78350f',
  },
  error: {
    light: '#fee2e2',
    base: '#ef4444',
    dark: '#b91c1c',
    text: '#7f1d1d',
  },
  info: {
    light: '#dbeafe',
    base: '#3b82f6',
    dark: '#1d4ed8',
    text: '#1e3a8a',
  },
  critical: {
    light: '#fce7f3',
    base: '#ec4899',
    dark: '#be185d',
    text: '#831843',
  },
} as const;

// =============================================================================
// THEME UTILITIES
// =============================================================================

/**
 * Get theme configuration by user role.
 */
export function getThemeByRole(role: UserRole): ThemeConfig {
  switch (role) {
    case 'patient':
      return patientThemeConfig;
    case 'provider':
    case 'admin':
      return providerThemeConfig;
    default:
      return patientThemeConfig;
  }
}

/**
 * Generate CSS custom properties from design tokens.
 */
export function generateCSSVariables(prefix = 'uh'): Record<string, string> {
  const variables: Record<string, string> = {};

  // Clinical Blue
  Object.entries(clinicalBlue).forEach(([shade, value]) => {
    variables[`--${prefix}-clinical-blue-${shade}`] = value;
  });

  // Trust Black
  Object.entries(trustBlack).forEach(([shade, value]) => {
    variables[`--${prefix}-trust-black-${shade}`] = value;
  });

  // Accent Green
  Object.entries(accentGreen).forEach(([shade, value]) => {
    variables[`--${prefix}-accent-green-${shade}`] = value;
  });

  // Semantic Colors
  Object.entries(semanticColors).forEach(([name, values]) => {
    Object.entries(values).forEach(([variant, value]) => {
      variables[`--${prefix}-${name}-${variant}`] = value;
    });
  });

  return variables;
}

// =============================================================================
// ACCESSIBILITY UTILITIES
// =============================================================================

/**
 * WCAG contrast ratio requirements.
 */
export const contrastRequirements = {
  aa: {
    normalText: 4.5,
    largeText: 3.0,
  },
  aaa: {
    normalText: 7.0,
    largeText: 4.5,
  },
} as const;

/**
 * Minimum touch target sizes for accessibility.
 */
export const touchTargets = {
  minimum: '44px',
  recommended: '48px',
} as const;

/**
 * Focus indicator configuration.
 */
export const focusIndicator = {
  width: '3px',
  style: 'solid',
  color: clinicalBlue[500],
  offset: '2px',
} as const;

// =============================================================================
// BRANDING CONSTANTS
// =============================================================================

/**
 * Brand name variations for different contexts.
 */
export const brandName = {
  canonical: 'The Unified Health',
  shorthand: 'Unified Health',
  legal: 'The Unified Health, Inc.',
} as const;

/**
 * Brand domains.
 */
export const brandDomains = {
  primary: 'theunifiedhealth.com',
  email: 'theunifiedhealth.com',
} as const;

/**
 * Package version for tracking.
 */
export const VERSION = '1.0.0';

// =============================================================================
// DEFAULT EXPORTS
// =============================================================================

export default {
  tokens: designTokens,
  patientTheme: patientThemeConfig,
  providerTheme: providerThemeConfig,
  colors: {
    clinicalBlue,
    trustBlack,
    accentGreen,
    semantic: semanticColors,
  },
  brandName,
  brandDomains,
  version: VERSION,
};
