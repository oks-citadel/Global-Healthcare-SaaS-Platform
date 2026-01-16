'use client';

import React from 'react';
import Link from 'next/link';

/**
 * PricingCard - The Unified Health
 *
 * Premium pricing cards for the pricing page.
 * Features glass morphism on dark backgrounds, clean styling on bright.
 */

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
  };
  currency?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface PricingCardProps {
  tier: PricingTier;
  /** Visual variant */
  variant?: 'dark' | 'bright';
  /** Show annual or monthly pricing */
  billingPeriod?: 'monthly' | 'annual';
  /** Additional CSS classes */
  className?: string;
}

export function PricingCard({
  tier,
  variant = 'dark',
  billingPeriod = 'monthly',
  className = '',
}: PricingCardProps) {
  const price = billingPeriod === 'annual' ? tier.price.annual : tier.price.monthly;
  const currency = tier.currency || '$';

  const isDark = variant === 'dark';
  const isHighlighted = tier.highlighted;

  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden
        ${isDark ? 'card-uh' : 'card-uh-bright'}
        ${isHighlighted && isDark ? 'border-uh-teal/30 shadow-glow-teal' : ''}
        ${isHighlighted && !isDark ? 'border-uh-teal ring-2 ring-uh-teal/20' : ''}
        ${className}
      `}
    >
      {/* Badge */}
      {tier.badge && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-uh-gold to-uh-gold-300 text-uh-dark text-xs font-semibold px-3 py-1 rounded-bl-lg">
            {tier.badge}
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h3
            className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-uh-slate-900'
            }`}
          >
            {tier.name}
          </h3>
          <p
            className={`text-sm ${
              isDark ? 'text-white/60' : 'text-uh-slate-500'
            }`}
          >
            {tier.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-1">
            <span
              className={`text-4xl font-bold ${
                isHighlighted
                  ? 'text-gradient-healing'
                  : isDark
                  ? 'text-white'
                  : 'text-uh-slate-900'
              }`}
            >
              {currency}
              {price}
            </span>
            <span
              className={`text-sm ${
                isDark ? 'text-white/50' : 'text-uh-slate-500'
              }`}
            >
              /{billingPeriod === 'annual' ? 'year' : 'month'}
            </span>
          </div>
          {billingPeriod === 'annual' && (
            <p className="mt-1 text-xs text-uh-emerald">
              Save {Math.round((1 - tier.price.annual / (tier.price.monthly * 12)) * 100)}% with annual billing
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckIcon
                className={`w-5 h-5 flex-shrink-0 ${
                  isHighlighted ? 'text-uh-teal' : isDark ? 'text-uh-teal/70' : 'text-uh-teal'
                }`}
              />
              <span
                className={`text-sm ${
                  isDark ? 'text-white/80' : 'text-uh-slate-600'
                }`}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          href={tier.cta.href}
          className={`
            block w-full text-center py-3 px-6 rounded-xl
            font-medium text-sm
            transition-all duration-300
            focus-ring
            ${
              isHighlighted
                ? 'btn-uh-primary'
                : isDark
                ? 'btn-uh-secondary'
                : 'bg-uh-slate-100 text-uh-slate-700 hover:bg-uh-slate-200'
            }
          `}
        >
          {tier.cta.label}
        </Link>
      </div>
    </div>
  );
}

/**
 * PricingGrid - Grid layout for pricing cards
 */
export function PricingGrid({
  tiers,
  variant = 'dark',
  billingPeriod = 'monthly',
  className = '',
}: {
  tiers: PricingTier[];
  variant?: 'dark' | 'bright';
  billingPeriod?: 'monthly' | 'annual';
  className?: string;
}) {
  return (
    <div
      className={`
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
        ${className}
      `}
    >
      {tiers.map((tier) => (
        <PricingCard
          key={tier.id}
          tier={tier}
          variant={variant}
          billingPeriod={billingPeriod}
        />
      ))}
    </div>
  );
}

/**
 * BillingToggle - Toggle between monthly and annual billing
 */
export function BillingToggle({
  value,
  onChange,
  variant = 'dark',
  className = '',
}: {
  value: 'monthly' | 'annual';
  onChange: (value: 'monthly' | 'annual') => void;
  variant?: 'dark' | 'bright';
  className?: string;
}) {
  const isDark = variant === 'dark';

  return (
    <div
      className={`
        inline-flex items-center gap-3 p-1 rounded-full
        ${isDark ? 'bg-white/5' : 'bg-uh-slate-100'}
        ${className}
      `}
    >
      <button
        onClick={() => onChange('monthly')}
        className={`
          px-4 py-2 rounded-full text-sm font-medium transition-all
          ${
            value === 'monthly'
              ? isDark
                ? 'bg-white text-uh-dark'
                : 'bg-white text-uh-slate-900 shadow'
              : isDark
              ? 'text-white/60 hover:text-white'
              : 'text-uh-slate-500 hover:text-uh-slate-700'
          }
        `}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange('annual')}
        className={`
          px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2
          ${
            value === 'annual'
              ? isDark
                ? 'bg-white text-uh-dark'
                : 'bg-white text-uh-slate-900 shadow'
              : isDark
              ? 'text-white/60 hover:text-white'
              : 'text-uh-slate-500 hover:text-uh-slate-700'
          }
        `}
      >
        Annual
        <span className="text-xs bg-uh-emerald/20 text-uh-emerald px-2 py-0.5 rounded-full">
          Save 20%
        </span>
      </button>
    </div>
  );
}

// Icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default PricingCard;
