'use client';

import React from 'react';
import Link from 'next/link';

/**
 * BrandLogo - The Unified Health
 *
 * Official logo representing the complete healthcare ecosystem.
 * Single source of truth for all logo implementations across the platform.
 *
 * Logo Elements & Meaning:
 * 1. Circular Shape - Continuity of care, integrated systems, complete patient-to-provider loop
 * 2. Medical Cross (Blue) - Clinical medicine, hospitals, trust, safety, compliance
 * 3. Human Figure (Blue/Orange) - Patient/clinician at the center, human-first design
 * 4. Heart (Orange) - Care, compassion, outcomes, patient wellbeing
 * 5. Leaf (Green) - Holistic health, prevention, wellness, sustainability
 * 6. Flowing Arc (Blue/Green) - Data flow, integration, interoperability
 *
 * Color Meaning:
 * - Blue → Trust, medicine, security, compliance
 * - Green → Health, growth, sustainability
 * - Orange → Humanity, care, outcomes
 *
 * Placement Rule: Top-right corner on every screen
 */

export type BrandLogoVariant = 'light' | 'dark' | 'auto';
export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'hero' | 'watermark';

export interface BrandLogoProps {
  /** Visual variant - 'light' for dark backgrounds, 'dark' for light backgrounds */
  variant?: BrandLogoVariant;
  /** Size preset */
  size?: BrandLogoSize;
  /** Show tagline under logo */
  showTagline?: boolean;
  /** Custom href (null to disable link) */
  href?: string | null;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the icon mark only */
  iconOnly?: boolean;
  /** Accessibility label */
  ariaLabel?: string;
}

// Enhanced size configuration with larger presets for hero/header usage
const sizeConfig = {
  xs: {
    iconSize: 32,
    text: 'text-sm',
    tagline: 'text-[9px]',
    gap: 'gap-2',
    letterSpacing: 'tracking-tight',
  },
  sm: {
    iconSize: 40,
    text: 'text-base',
    tagline: 'text-[10px]',
    gap: 'gap-2.5',
    letterSpacing: 'tracking-tight',
  },
  md: {
    iconSize: 48,
    text: 'text-lg',
    tagline: 'text-xs',
    gap: 'gap-3',
    letterSpacing: 'tracking-normal',
  },
  lg: {
    iconSize: 56,
    text: 'text-xl',
    tagline: 'text-xs',
    gap: 'gap-3',
    letterSpacing: 'tracking-normal',
  },
  xl: {
    iconSize: 72,
    text: 'text-2xl',
    tagline: 'text-sm',
    gap: 'gap-4',
    letterSpacing: 'tracking-wide',
  },
  '2xl': {
    iconSize: 96,
    text: 'text-3xl',
    tagline: 'text-base',
    gap: 'gap-5',
    letterSpacing: 'tracking-wide',
  },
  '3xl': {
    iconSize: 120,
    text: 'text-4xl',
    tagline: 'text-lg',
    gap: 'gap-6',
    letterSpacing: 'tracking-wide',
  },
  hero: {
    iconSize: 160,
    text: 'text-5xl',
    tagline: 'text-xl',
    gap: 'gap-8',
    letterSpacing: 'tracking-wide',
  },
  watermark: {
    iconSize: 500,
    text: 'text-7xl',
    tagline: 'text-2xl',
    gap: 'gap-10',
    letterSpacing: 'tracking-widest',
  },
};

/**
 * TheUnifiedHealthLogo - Official Logo Icon (Enhanced)
 *
 * A unified, circular logo representing the complete healthcare ecosystem:
 * - Medical cross anchors clinical credibility (thicker, bolder strokes)
 * - Human figure centers the patient/provider
 * - Heart symbolizes compassion and care
 * - Leaf represents holistic wellness
 * - Flowing arcs show integration and data flow
 * - Subtle shadow for depth on light backgrounds
 */
interface LogoIconProps {
  size: number;
  variant: 'full-color' | 'white' | 'monochrome';
  className?: string;
  opacity?: number;
  /** Add subtle shadow for depth */
  withShadow?: boolean;
}

function LogoIcon({ size, variant, className = '', opacity = 1, withShadow = false }: LogoIconProps) {
  const gradientIds = {
    blue: `uh-blue-${React.useId()}`,
    green: `uh-green-${React.useId()}`,
    orange: `uh-orange-${React.useId()}`,
    arc: `uh-arc-${React.useId()}`,
    shadow: `uh-shadow-${React.useId()}`,
  };

  // Brand colors - HIGH CONTRAST medical navy for visibility
  const colors = {
    medicalBlue: '#0F2A5B',        // Darker medical navy for high contrast
    medicalBlueDark: '#0A1F42',    // Deep navy
    medicalBlueLight: '#1E40AF',   // Lighter accent
    healthGreen: '#047857',        // Deeper emerald
    healthGreenLight: '#059669',
    careOrange: '#C2410C',         // Deeper orange
    careOrangeLight: '#EA580C',
    white: '#FFFFFF',
  };

  const isWhite = variant === 'white';
  const isMonochrome = variant === 'monochrome';
  const fillBlue = isWhite ? colors.white : (isMonochrome ? colors.medicalBlue : `url(#${gradientIds.blue})`);
  const fillGreen = isWhite ? colors.white : (isMonochrome ? colors.healthGreen : colors.healthGreen);
  const fillOrange = isWhite ? colors.white : (isMonochrome ? colors.medicalBlue : colors.careOrange);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${className}`}
      style={{
        opacity,
        filter: withShadow && !isWhite ? 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06))' : undefined,
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Blue gradient for medical cross */}
        <linearGradient id={gradientIds.blue} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.medicalBlueDark} />
          <stop offset="100%" stopColor={colors.medicalBlueLight} />
        </linearGradient>
        {/* Green gradient for leaf */}
        <linearGradient id={gradientIds.green} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.healthGreen} />
          <stop offset="100%" stopColor={colors.healthGreenLight} />
        </linearGradient>
        {/* Orange gradient for heart */}
        <linearGradient id={gradientIds.orange} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.careOrange} />
          <stop offset="100%" stopColor={colors.careOrangeLight} />
        </linearGradient>
        {/* Arc gradient blue to green */}
        <linearGradient id={gradientIds.arc} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.medicalBlue} />
          <stop offset="100%" stopColor={colors.healthGreen} />
        </linearGradient>
      </defs>

      {/* Outer circle boundary - unity and completeness (BOLDER) */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke={fillBlue}
        strokeWidth="3"
        fill="none"
        opacity="0.35"
      />

      {/* Medical Cross (Blue) - Clinical medicine, trust, compliance (THICKER) */}
      <g>
        {/* Vertical bar of cross */}
        <rect
          x="43"
          y="18"
          width="14"
          height="38"
          rx="3"
          fill={fillBlue}
        />
        {/* Horizontal bar of cross */}
        <rect
          x="30"
          y="28"
          width="40"
          height="14"
          rx="3"
          fill={fillBlue}
        />
      </g>

      {/* Human Figure - Patient/Clinician at center (LARGER) */}
      <g>
        {/* Head (Orange - humanity) */}
        <circle
          cx="50"
          cy="60"
          r="7"
          fill={fillOrange}
        />
        {/* Body (Blue - professional) */}
        <path
          d="M50 67 L50 82 M40 75 L50 69 L60 75"
          stroke={fillBlue}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Heart (Orange) - Care, compassion, outcomes (LARGER) */}
      <path
        d="M26 50 C26 44 32 40 38 44 C40 46 40 48 38 50 L26 62 L14 50 C12 48 12 46 14 44 C20 40 26 44 26 50 Z"
        fill={fillOrange}
        transform="scale(0.55) translate(5, 65)"
        opacity="0.95"
      />

      {/* Leaf (Green) - Holistic health, wellness, sustainability (BOLDER) */}
      <path
        d="M78 63 Q86 52 78 42 Q70 52 78 63 M78 63 L78 72"
        stroke={fillGreen}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="78"
        cy="52"
        rx="6"
        ry="11"
        fill={fillGreen}
        opacity="0.8"
      />

      {/* Flowing Arc (Blue to Green) - Data flow, integration, interoperability (THICKER) */}
      <path
        d="M14 50 Q14 18 50 12 Q86 18 86 50"
        stroke={isWhite ? colors.white : `url(#${gradientIds.arc})`}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M18 76 Q50 92 82 76"
        stroke={isWhite ? colors.white : `url(#${gradientIds.arc})`}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

export function BrandLogo({
  variant = 'auto',
  size = 'md',
  showTagline = false,
  href = '/',
  className = '',
  iconOnly = false,
  ariaLabel = 'The Unified Health - Home',
}: BrandLogoProps) {
  const config = sizeConfig[size];

  // Determine colors based on variant
  const getStyles = () => {
    if (variant === 'auto') {
      return {
        iconVariant: 'full-color' as const,
        text: 'text-foreground',
        tagline: 'text-muted-foreground',
        wordmarkGradient: true,
        withShadow: true,
      };
    }
    if (variant === 'light') {
      return {
        iconVariant: 'white' as const,
        text: 'text-white',
        tagline: 'text-white/60',
        wordmarkGradient: false,
        withShadow: false,
      };
    }
    return {
      iconVariant: 'full-color' as const,
      text: 'text-slate-800',
      tagline: 'text-slate-500',
      wordmarkGradient: true,
      withShadow: true,
    };
  };

  const styles = getStyles();

  const LogoContent = () => (
    <div
      className={`flex items-center ${config.gap} ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Official The Unified Health Logo */}
      <div className="relative group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
        <LogoIcon
          size={config.iconSize}
          variant={styles.iconVariant}
          withShadow={styles.withShadow}
        />
      </div>

      {/* Wordmark - Bold, high-contrast medical navy text */}
      {!iconOnly && (
        <div className="flex flex-col justify-center">
          {styles.wordmarkGradient ? (
            <span
              className={`${config.text} font-bold ${config.letterSpacing} whitespace-nowrap`}
              style={{
                letterSpacing: '0.03em',
                color: '#0F2A5B', // Medical navy for high contrast
              }}
            >
              The Unified Health
            </span>
          ) : (
            <span
              className={`${config.text} font-bold ${config.letterSpacing} ${styles.text} whitespace-nowrap`}
              style={{ letterSpacing: '0.03em' }}
            >
              The Unified Health
            </span>
          )}
          {showTagline && (
            <span
              className={`${config.tagline} font-medium whitespace-nowrap`}
              style={{ color: '#047857', letterSpacing: '0.05em' }}
            >
              Global Healthcare Excellence
            </span>
          )}
        </div>
      )}
    </div>
  );

  // Render with or without link
  if (href === null) {
    return <LogoContent />;
  }

  return (
    <Link
      href={href}
      className="group inline-flex focus-ring rounded-lg"
      aria-label={ariaLabel}
    >
      <LogoContent />
    </Link>
  );
}

/**
 * LogoWatermark - Subtle background watermark for landing pages
 * Uses the official logo at large scale with low opacity
 */
export function LogoWatermark({
  className = '',
  opacity = 0.05
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <LogoIcon
        size={700}
        variant="full-color"
        opacity={opacity}
        className="animate-uh-pulse-soft"
      />
    </div>
  );
}

/**
 * BrandLogoMark - Icon-only version for compact spaces
 */
export function BrandLogoMark({
  variant = 'auto',
  size = 'md',
  href = '/',
  className = '',
}: Omit<BrandLogoProps, 'showTagline' | 'iconOnly'>) {
  return (
    <BrandLogo
      variant={variant}
      size={size}
      href={href}
      className={className}
      iconOnly
    />
  );
}

/**
 * BrandLogoFull - Full logo with tagline
 */
export function BrandLogoFull({
  variant = 'auto',
  size = 'lg',
  href = '/',
  className = '',
}: Omit<BrandLogoProps, 'showTagline' | 'iconOnly'>) {
  return (
    <BrandLogo
      variant={variant}
      size={size}
      href={href}
      className={className}
      showTagline
    />
  );
}

/**
 * HeroLogo - Large, bold logo for hero sections
 * Enhanced size and visual presence for landing pages
 */
export function HeroLogo({
  variant = 'dark',
  showTagline = true,
  href = '/',
  className = '',
}: Omit<BrandLogoProps, 'size' | 'iconOnly'>) {
  return (
    <BrandLogo
      variant={variant}
      size="hero"
      href={href}
      className={className}
      showTagline={showTagline}
    />
  );
}

/**
 * HeaderLogo - Optimized logo for header/navigation
 * Balanced size for clear visibility without overwhelming the header
 */
export function HeaderLogo({
  variant = 'dark',
  href = '/',
  className = '',
}: Omit<BrandLogoProps, 'size' | 'showTagline' | 'iconOnly'>) {
  return (
    <BrandLogo
      variant={variant}
      size="md"
      href={href}
      className={className}
    />
  );
}

/**
 * Portal-specific logo variations
 */
export function AdminPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  const textColor = props.variant === 'light' ? 'text-white/60' : 'text-muted-foreground';
  const config = sizeConfig[props.size || 'md'];
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="The Unified Health Admin Portal" />
      <span className={`text-[10px] uppercase tracking-widest ${textColor} ml-[${config.iconSize + 12}px] -mt-1`}>
        Admin Portal
      </span>
    </div>
  );
}

export function ProviderPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  const textColor = props.variant === 'light' ? 'text-white/60' : 'text-muted-foreground';
  const config = sizeConfig[props.size || 'md'];
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="The Unified Health Provider Portal" />
      <span className={`text-[10px] uppercase tracking-widest ${textColor} ml-[${config.iconSize + 12}px] -mt-1`}>
        Provider Portal
      </span>
    </div>
  );
}

export function PatientPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  const textColor = props.variant === 'light' ? 'text-white/60' : 'text-muted-foreground';
  const config = sizeConfig[props.size || 'md'];
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="The Unified Health Patient Portal" />
      <span className={`text-[10px] uppercase tracking-widest ${textColor} ml-[${config.iconSize + 12}px] -mt-1`}>
        Patient Portal
      </span>
    </div>
  );
}

/**
 * TopLeftLogo - Primary brand anchor in header
 * Places full logo (icon + text) in top-left corner
 */
export function TopLeftLogo({
  variant = 'dark',
  size = 'lg',
  className = '',
}: Pick<BrandLogoProps, 'variant' | 'size' | 'className'>) {
  return (
    <div className={`absolute top-4 left-4 md:top-6 md:left-8 z-50 ${className}`}>
      <BrandLogo variant={variant} size={size} />
    </div>
  );
}

/**
 * TopRightLogo - Secondary brand mark placement
 * Places icon-only logo in top-right corner
 */
export function TopRightLogo({
  variant = 'auto',
  size = 'sm',
  className = '',
}: Pick<BrandLogoProps, 'variant' | 'size' | 'className'>) {
  return (
    <div className={`absolute top-4 right-4 md:top-6 md:right-6 z-50 ${className}`}>
      <BrandLogoMark variant={variant} size={size} />
    </div>
  );
}

/**
 * CenteredHeroLogo - Large centered logo for auth/landing pages
 * Displays logo icon with brand name underneath
 */
export function CenteredHeroLogo({
  variant = 'dark',
  showTagline = true,
  className = '',
}: {
  variant?: BrandLogoVariant;
  showTagline?: boolean;
  className?: string;
}) {
  const styles = variant === 'light'
    ? { text: 'text-white', tagline: 'text-white/70' }
    : { text: 'text-[#0F2A5B]', tagline: 'text-[#047857]' };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <LogoIcon
        size={120}
        variant={variant === 'light' ? 'white' : 'full-color'}
        withShadow={variant !== 'light'}
      />
      <h1
        className={`mt-4 text-3xl md:text-4xl font-bold tracking-wide ${styles.text}`}
        style={{ letterSpacing: '0.04em' }}
      >
        The Unified Health
      </h1>
      {showTagline && (
        <p
          className={`mt-2 text-base md:text-lg font-medium ${styles.tagline}`}
          style={{ letterSpacing: '0.06em' }}
        >
          Global Healthcare Excellence
        </p>
      )}
    </div>
  );
}

export { LogoIcon };
export default BrandLogo;
