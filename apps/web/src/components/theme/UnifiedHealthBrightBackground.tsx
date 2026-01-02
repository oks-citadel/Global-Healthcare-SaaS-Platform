'use client';

import React from 'react';

/**
 * UnifiedHealthBrightBackground
 *
 * Clean, bright background for interior pages (dashboards, portals).
 * Maximizes readability with subtle accent touches.
 *
 * Features:
 * - Pure white or light gray base
 * - Subtle gradient accents at edges
 * - Optional soft patterns
 * - Maximum contrast for text clarity
 */

export interface BrightBackgroundProps {
  children: React.ReactNode;
  /** Background variant */
  variant?: 'white' | 'gray' | 'gradient';
  /** Show subtle accent gradients */
  showAccents?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function UnifiedHealthBrightBackground({
  children,
  variant = 'white',
  showAccents = true,
  className = '',
}: BrightBackgroundProps) {
  const bgClass = {
    white: 'bg-white',
    gray: 'bg-uh-slate-50',
    gradient: 'bg-gradient-to-b from-white to-uh-slate-50',
  }[variant];

  return (
    <div
      className={`
        relative min-h-screen w-full
        ${bgClass}
        ${className}
      `}
    >
      {/* Subtle Accent Gradients */}
      {showAccents && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Top-left teal accent */}
          <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 212, 170, 0.03) 0%, transparent 70%)',
            }}
          />

          {/* Top-right indigo accent */}
          <div
            className="absolute -top-12 -right-12 w-72 h-72 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(79, 70, 229, 0.02) 0%, transparent 70%)',
            }}
          />

          {/* Bottom gradient fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{
              background: 'linear-gradient(to top, rgba(248, 250, 252, 0.8), transparent)',
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * DashboardBackground - Optimized for dashboard views
 */
export function DashboardBackground({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <UnifiedHealthBrightBackground variant="gray" showAccents className={className}>
      {children}
    </UnifiedHealthBrightBackground>
  );
}

/**
 * ContentBackground - For content-heavy pages
 */
export function ContentBackground({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <UnifiedHealthBrightBackground variant="white" showAccents={false} className={className}>
      {children}
    </UnifiedHealthBrightBackground>
  );
}

/**
 * SectionBright - For bright sections within pages
 */
export function SectionBright({
  children,
  className = '',
  variant = 'white',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'gray';
}) {
  return (
    <section
      className={`
        relative py-24 overflow-hidden
        ${variant === 'white' ? 'bg-white' : 'bg-uh-slate-50'}
        ${className}
      `}
    >
      <div className="relative z-10">{children}</div>
    </section>
  );
}

/**
 * Card backgrounds for interior use
 */
export function CardBackground({
  children,
  className = '',
  elevated = false,
}: {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div
      className={`
        bg-white rounded-uh-lg border border-uh-slate-200
        ${elevated ? 'shadow-card-elevated' : 'shadow-sm'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default UnifiedHealthBrightBackground;
