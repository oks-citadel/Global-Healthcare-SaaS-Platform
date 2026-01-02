'use client';

import React from 'react';

/**
 * UnifiedHealthDarkBackground
 *
 * Premium dark background with Healing Aurora gradient effects.
 * Used for landing pages, hero sections, and marketing pages.
 *
 * Features:
 * - Deep charcoal base (#0A0A0F)
 * - Animated aurora gradient orbs
 * - Subtle grid overlay option
 * - High contrast for text readability
 */

export interface DarkBackgroundProps {
  children: React.ReactNode;
  /** Show animated aurora orbs */
  showAurora?: boolean;
  /** Show subtle grid pattern */
  showGrid?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether this is the hero section (extra gradient intensity) */
  isHero?: boolean;
}

export function UnifiedHealthDarkBackground({
  children,
  showAurora = true,
  showGrid = false,
  className = '',
  isHero = false,
}: DarkBackgroundProps) {
  return (
    <div
      className={`
        relative min-h-screen w-full overflow-hidden
        bg-uh-dark
        ${className}
      `}
    >
      {/* Base Gradient Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHero
            ? 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(0, 212, 170, 0.2), transparent 50%), linear-gradient(180deg, #0A0A0F 0%, #0F0F1A 100%)'
            : 'linear-gradient(180deg, #0A0A0F 0%, #0F0F1A 100%)',
        }}
      />

      {/* Aurora Gradient Orbs */}
      {showAurora && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Teal Orb - Top Left */}
          <div
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full animate-aurora"
            style={{
              background: 'radial-gradient(circle, rgba(0, 212, 170, 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Indigo Orb - Top Right */}
          <div
            className="absolute -top-1/4 right-0 w-2/3 h-2/3 rounded-full animate-aurora"
            style={{
              background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, transparent 70%)',
              filter: 'blur(80px)',
              animationDelay: '-5s',
            }}
          />

          {/* Cyan Orb - Bottom */}
          <div
            className="absolute bottom-0 left-1/4 w-1/2 h-1/2 rounded-full animate-aurora"
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
              filter: 'blur(70px)',
              animationDelay: '-10s',
            }}
          />

          {/* Subtle Emerald Accent */}
          <div
            className="absolute top-1/2 right-1/4 w-1/3 h-1/3 rounded-full animate-float"
            style={{
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
        </div>
      )}

      {/* Grid Pattern Overlay */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      )}

      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * HeroBackground - Optimized for hero sections
 */
export function HeroBackground({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <UnifiedHealthDarkBackground isHero showAurora showGrid={false} className={className}>
      {children}
    </UnifiedHealthDarkBackground>
  );
}

/**
 * SectionDark - For dark sections within pages
 */
export function SectionDark({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`
        relative py-24 bg-uh-dark overflow-hidden
        ${className}
      `}
    >
      {/* Subtle gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0, 212, 170, 0.05), transparent)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default UnifiedHealthDarkBackground;
