'use client';

import React from 'react';
import Link from 'next/link';

/**
 * BrandLogo - The Unified Health
 *
 * Single source of truth for all logo implementations across the platform.
 * Ensures consistent branding on landing pages, interior pages, and all portals.
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
    icon: 'w-6 h-6',
    iconText: 'text-xs',
    text: 'text-sm',
    tagline: 'text-[8px]',
    gap: 'gap-1.5',
  },
  sm: {
    icon: 'w-8 h-8',
    iconText: 'text-sm',
    text: 'text-base',
    tagline: 'text-[9px]',
    gap: 'gap-2',
  },
  md: {
    icon: 'w-10 h-10',
    iconText: 'text-base',
    text: 'text-lg',
    tagline: 'text-[10px]',
    gap: 'gap-2.5',
  },
  lg: {
    icon: 'w-12 h-12',
    iconText: 'text-lg',
    text: 'text-xl',
    tagline: 'text-xs',
    gap: 'gap-3',
  },
  xl: {
    icon: 'w-16 h-16',
    iconText: 'text-2xl',
    text: 'text-2xl',
    tagline: 'text-sm',
    gap: 'gap-4',
  },
};

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
  const getColors = () => {
    if (variant === 'auto') {
      return {
        iconBg: 'bg-gradient-to-br from-uh-teal to-uh-cyan',
        iconText: 'text-uh-dark',
        text: 'text-foreground',
        tagline: 'text-muted-foreground',
      };
    }
    if (variant === 'light') {
      return {
        iconBg: 'bg-gradient-to-br from-uh-teal to-uh-cyan',
        iconText: 'text-uh-dark',
        text: 'text-white',
        tagline: 'text-white/60',
      };
    }
    return {
      iconBg: 'bg-gradient-to-br from-uh-teal to-uh-cyan',
      iconText: 'text-uh-dark',
      text: 'text-uh-dark',
      tagline: 'text-uh-slate-500',
    };
  };

  const colors = getColors();

  const LogoContent = () => (
    <div
      className={`flex items-center ${config.gap} ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Icon Mark */}
      <div
        className={`
          ${config.icon}
          ${colors.iconBg}
          rounded-xl
          flex items-center justify-center
          shadow-glow-teal
          transition-all duration-300
          group-hover:shadow-lg group-hover:scale-105
        `}
      >
        <span className={`${config.iconText} font-bold ${colors.iconText}`}>
          UH
        </span>
      </div>

      {/* Wordmark */}
      {!iconOnly && (
        <div className="flex flex-col">
          <span className={`${config.text} font-semibold tracking-tight ${colors.text}`}>
            The Unified Health
          </span>
          {showTagline && (
            <span className={`${config.tagline} italic ${colors.tagline} -mt-0.5`}>
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
 * Portal-specific logo variations
 */
export function AdminPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="The Unified Health Admin Portal" />
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-[52px] -mt-1">
        Admin Portal
      </span>
    </div>
  );
}

export function ProviderPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="The Unified Health Provider Portal" />
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-[52px] -mt-1">
        Provider Portal
      </span>
    </div>
  );
}

export function PatientPortalLogo(props: Omit<BrandLogoProps, 'ariaLabel'>) {
  return (
    <div className="flex flex-col">
      <BrandLogo {...props} ariaLabel="The Unified Health Patient Portal" />
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-[52px] -mt-1">
        Patient Portal
      </span>
    </div>
  );
}

export default BrandLogo;
