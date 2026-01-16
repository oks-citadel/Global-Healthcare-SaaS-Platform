'use client';

import React from 'react';
import Link from 'next/link';

/**
 * BrandLogo - The Unified Health
 *
 * Single source of truth for all logo implementations across the platform.
 * Ensures consistent branding on landing pages, interior pages, and all portals.
 *
 * The logo features an abstract symbol representing:
 * - Global reach (circular/globe form)
 * - Unity and connection (two embracing curves)
 * - Healthcare without borders (flowing, caring gesture)
 * - Hidden "U" shape in negative space
 *
 * Usage:
 * - Landing/dark pages: <BrandLogo variant="light" />
 * - Interior/bright pages: <BrandLogo variant="dark" />
 * - Compact spaces: <BrandLogo size="sm" />
 * - Without link: <BrandLogo href={null} />
 */

export type BrandLogoVariant = 'light' | 'dark' | 'auto';
export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

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
    iconSize: 24,
    text: 'text-sm',
    tagline: 'text-[8px]',
    gap: 'gap-1.5',
  },
  sm: {
    iconSize: 32,
    text: 'text-base',
    tagline: 'text-[9px]',
    gap: 'gap-2',
  },
  md: {
    iconSize: 40,
    text: 'text-lg',
    tagline: 'text-[10px]',
    gap: 'gap-2.5',
  },
  lg: {
    iconSize: 48,
    text: 'text-xl',
    tagline: 'text-xs',
    gap: 'gap-3',
  },
  xl: {
    iconSize: 64,
    text: 'text-2xl',
    tagline: 'text-sm',
    gap: 'gap-4',
  },
};

/**
 * LogoIcon - The abstract symbol representing unity and global healthcare
 *
 * Design elements:
 * - Two curved arcs that embrace each other, forming a globe-like shape
 * - The negative space between curves subtly suggests a "U" shape
 * - Flowing lines represent care, connection, and movement
 * - Circular composition suggests completeness and global reach
 */
interface LogoIconProps {
  size: number;
  variant: 'gradient' | 'solid' | 'white';
  className?: string;
}

function LogoIcon({ size, variant, className = '' }: LogoIconProps) {
  const gradientId = `brand-gradient-${React.useId()}`;

  const getFill = () => {
    switch (variant) {
      case 'gradient':
        return `url(#${gradientId})`;
      case 'solid':
        return '#1D4ED8'; // blue-600
      case 'white':
        return '#FFFFFF';
      default:
        return `url(#${gradientId})`;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>

      {/* Left embracing curve - represents global reach and care */}
      <path
        d="M8 20C8 12.268 14.268 6 22 6C24.5 6 26.85 6.6 28.95 7.65C26.5 5.35 23.15 4 19.5 4C10.94 4 4 10.94 4 19.5C4 25.5 7.5 30.7 12.5 33.15C9.65 29.85 8 25.15 8 20Z"
        fill={getFill()}
      />

      {/* Right embracing curve - represents unity and connection */}
      <path
        d="M32 20C32 27.732 25.732 34 18 34C15.5 34 13.15 33.4 11.05 32.35C13.5 34.65 16.85 36 20.5 36C29.06 36 36 29.06 36 20.5C36 14.5 32.5 9.3 27.5 6.85C30.35 10.15 32 14.85 32 20Z"
        fill={getFill()}
      />

      {/* Central connecting element - the bridge of unity */}
      <path
        d="M20 8C13.373 8 8 13.373 8 20C8 22.85 9.05 25.45 10.8 27.45C10.3 25.15 10 22.65 10 20C10 14.477 14.477 10 20 10C25.523 10 30 14.477 30 20C30 22.65 29.7 25.15 29.2 27.45C30.95 25.45 32 22.85 32 20C32 13.373 26.627 8 20 8Z"
        fill={getFill()}
        opacity="0.7"
      />

      {/* Inner accent - adds depth and dimension */}
      <circle
        cx="20"
        cy="20"
        r="6"
        fill={getFill()}
        opacity="0.4"
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
        iconVariant: 'gradient' as const,
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
      iconVariant: 'gradient' as const,
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
      {/* Icon Mark - Abstract Unity Symbol */}
      <div className="relative group-hover:scale-105 transition-transform duration-300">
        <LogoIcon
          size={config.iconSize}
          variant={styles.iconVariant}
        />
      </div>

      {/* Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col">
          {styles.wordmarkGradient ? (
            <span
              className={`${config.text} font-semibold tracking-tight bg-gradient-to-r from-blue-800 via-blue-600 to-teal-600 bg-clip-text text-transparent`}
            >
              The Unified Health
            </span>
          ) : (
            <span className={`${config.text} font-semibold tracking-tight ${styles.text}`}>
              The Unified Health
            </span>
          )}
          {showTagline && (
            <span className={`${config.tagline} italic ${styles.tagline} -mt-0.5`}>
              Healthcare Without Borders
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
 * Standalone LogoIcon export for use in favicons, loading states, etc.
 */
export { LogoIcon };

/**
 * Portal-specific logo variations
 */
export function AdminPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  const textColor = props.variant === 'light' ? 'text-white/60' : 'text-muted-foreground';
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="The Unified Health Admin Portal" />
      <span className={`text-[10px] uppercase tracking-widest ${textColor} ml-[52px] -mt-1`}>
        Admin Portal
      </span>
    </div>
  );
}

export function ProviderPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  const textColor = props.variant === 'light' ? 'text-white/60' : 'text-muted-foreground';
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="The Unified Health Provider Portal" />
      <span className={`text-[10px] uppercase tracking-widest ${textColor} ml-[52px] -mt-1`}>
        Provider Portal
      </span>
    </div>
  );
}

export function PatientPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  const textColor = props.variant === 'light' ? 'text-white/60' : 'text-muted-foreground';
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="The Unified Health Patient Portal" />
      <span className={`text-[10px] uppercase tracking-widest ${textColor} ml-[52px] -mt-1`}>
        Patient Portal
      </span>
    </div>
  );
}

export default BrandLogo;
