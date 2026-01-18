'use client';

import React from 'react';
import Link from 'next/link';

/**
 * BrandLogo - TheUnifiedHealth
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
export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'watermark';

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

const sizeConfig = {
  xs: {
    iconSize: 28,
    text: 'text-sm',
    tagline: 'text-[8px]',
    gap: 'gap-2',
  },
  sm: {
    iconSize: 36,
    text: 'text-base',
    tagline: 'text-[9px]',
    gap: 'gap-2',
  },
  md: {
    iconSize: 44,
    text: 'text-lg',
    tagline: 'text-[10px]',
    gap: 'gap-3',
  },
  lg: {
    iconSize: 52,
    text: 'text-xl',
    tagline: 'text-xs',
    gap: 'gap-3',
  },
  xl: {
    iconSize: 72,
    text: 'text-2xl',
    tagline: 'text-sm',
    gap: 'gap-4',
  },
  watermark: {
    iconSize: 400,
    text: 'text-6xl',
    tagline: 'text-xl',
    gap: 'gap-6',
  },
};

/**
 * TheUnifiedHealthLogo - Official Logo Icon
 *
 * A unified, circular logo representing the complete healthcare ecosystem:
 * - Medical cross anchors clinical credibility
 * - Human figure centers the patient/provider
 * - Heart symbolizes compassion and care
 * - Leaf represents holistic wellness
 * - Flowing arcs show integration and data flow
 */
interface LogoIconProps {
  size: number;
  variant: 'full-color' | 'white' | 'monochrome';
  className?: string;
  opacity?: number;
}

function LogoIcon({ size, variant, className = '', opacity = 1 }: LogoIconProps) {
  const gradientIds = {
    blue: `uh-blue-${React.useId()}`,
    green: `uh-green-${React.useId()}`,
    orange: `uh-orange-${React.useId()}`,
    arc: `uh-arc-${React.useId()}`,
  };

  // Brand colors
  const colors = {
    medicalBlue: '#1E40AF',      // Primary trust color
    medicalBlueDark: '#1E3A8A',
    medicalBlueLight: '#3B82F6',
    healthGreen: '#059669',      // Wellness, sustainability
    healthGreenLight: '#10B981',
    careOrange: '#EA580C',       // Humanity, warmth
    careOrangeLight: '#F97316',
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
      style={{ opacity }}
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

      {/* Outer circle boundary - unity and completeness */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke={fillBlue}
        strokeWidth="2"
        fill="none"
        opacity="0.3"
      />

      {/* Medical Cross (Blue) - Clinical medicine, trust, compliance */}
      <g>
        {/* Vertical bar of cross */}
        <rect
          x="44"
          y="20"
          width="12"
          height="35"
          rx="2"
          fill={fillBlue}
        />
        {/* Horizontal bar of cross */}
        <rect
          x="32"
          y="30"
          width="36"
          height="12"
          rx="2"
          fill={fillBlue}
        />
      </g>

      {/* Human Figure - Patient/Clinician at center */}
      <g>
        {/* Head (Orange - humanity) */}
        <circle
          cx="50"
          cy="62"
          r="6"
          fill={fillOrange}
        />
        {/* Body (Blue - professional) */}
        <path
          d="M50 68 L50 80 M42 74 L50 70 L58 74"
          stroke={fillBlue}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Heart (Orange) - Care, compassion, outcomes */}
      <path
        d="M26 50 C26 44 32 40 38 44 C40 46 40 48 38 50 L26 62 L14 50 C12 48 12 46 14 44 C20 40 26 44 26 50 Z"
        fill={fillOrange}
        transform="scale(0.5) translate(8, 70)"
        opacity="0.9"
      />

      {/* Leaf (Green) - Holistic health, wellness, sustainability */}
      <path
        d="M78 65 Q85 55 78 45 Q70 55 78 65 M78 65 L78 72"
        stroke={fillGreen}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="78"
        cy="55"
        rx="5"
        ry="10"
        fill={fillGreen}
        opacity="0.7"
      />

      {/* Flowing Arc (Blue to Green) - Data flow, integration, interoperability */}
      <path
        d="M15 50 Q15 20 50 15 Q85 20 85 50"
        stroke={isWhite ? colors.white : `url(#${gradientIds.arc})`}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M20 75 Q50 90 80 75"
        stroke={isWhite ? colors.white : `url(#${gradientIds.arc})`}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
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
  ariaLabel = 'TheUnifiedHealth - Home',
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
      };
    }
    if (variant === 'light') {
      return {
        iconVariant: 'white' as const,
        text: 'text-white',
        tagline: 'text-white/60',
        wordmarkGradient: false,
      };
    }
    return {
      iconVariant: 'full-color' as const,
      text: 'text-slate-800',
      tagline: 'text-slate-500',
      wordmarkGradient: true,
    };
  };

  const styles = getStyles();

  const LogoContent = () => (
    <div
      className={`flex items-center ${config.gap} ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Official TheUnifiedHealth Logo */}
      <div className="relative group-hover:scale-105 transition-transform duration-300">
        <LogoIcon
          size={config.iconSize}
          variant={styles.iconVariant}
        />
      </div>

      {/* Wordmark - Modern, clean, authoritative */}
      {!iconOnly && (
        <div className="flex flex-col">
          {styles.wordmarkGradient ? (
            <span
              className={`${config.text} font-semibold tracking-tight bg-gradient-to-r from-blue-900 via-blue-700 to-emerald-600 bg-clip-text text-transparent`}
            >
              TheUnifiedHealth
            </span>
          ) : (
            <span className={`${config.text} font-semibold tracking-tight ${styles.text}`}>
              TheUnifiedHealth
            </span>
          )}
          {showTagline && (
            <span className={`${config.tagline} ${styles.tagline} -mt-0.5 font-medium`}>
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
        size={600}
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
 * Portal-specific logo variations
 */
export function AdminPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  const textColor = props.variant === 'light' ? 'text-white/60' : 'text-muted-foreground';
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="TheUnifiedHealth Admin Portal" />
      <span className={`text-[10px] uppercase tracking-widest ${textColor} ml-[56px] -mt-1`}>
        Admin Portal
      </span>
    </div>
  );
}

export function ProviderPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  const textColor = props.variant === 'light' ? 'text-white/60' : 'text-muted-foreground';
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="TheUnifiedHealth Provider Portal" />
      <span className={`text-[10px] uppercase tracking-widest ${textColor} ml-[56px] -mt-1`}>
        Provider Portal
      </span>
    </div>
  );
}

export function PatientPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  const textColor = props.variant === 'light' ? 'text-white/60' : 'text-muted-foreground';
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="TheUnifiedHealth Patient Portal" />
      <span className={`text-[10px] uppercase tracking-widest ${textColor} ml-[56px] -mt-1`}>
        Patient Portal
      </span>
    </div>
  );
}

/**
 * TopRightLogo - Consistent logo placement component
 * Places logo in top-right corner as per brand guidelines
 */
export function TopRightLogo({
  variant = 'auto',
  size = 'sm',
  className = '',
}: Pick<BrandLogoProps, 'variant' | 'size' | 'className'>) {
  return (
    <div className={`absolute top-4 right-4 md:top-6 md:right-6 z-50 ${className}`}>
      <BrandLogo variant={variant} size={size} />
    </div>
  );
}

export { LogoIcon };
export default BrandLogo;
