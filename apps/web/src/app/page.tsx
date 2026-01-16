'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LandingLayout } from '@/components/layouts/LandingLayout';
import { BrandLogoFull } from '@/components/brand/BrandLogo';
import { PricingGrid, BillingToggle, type PricingTier } from '@/components/pricing/PricingCard';
import { SectionDark } from '@/components/theme/UnifiedHealthDarkBackground';

/**
 * Landing Page - The Unified Health
 *
 * Premium dark landing page with Healing Aurora gradients.
 * Showcases the platform's features and value proposition.
 */

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individual patients',
    price: { monthly: 0, annual: 0 },
    features: [
      'Basic health records access',
      'Appointment scheduling',
      'Secure messaging',
      'Mobile app access',
    ],
    cta: { label: 'Get Started Free', href: '/register' },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For healthcare providers',
    price: { monthly: 49, annual: 470 },
    features: [
      'Everything in Starter',
      'Patient management',
      'Telemedicine capabilities',
      'E-prescribing',
      'Analytics dashboard',
      'Priority support',
    ],
    highlighted: true,
    badge: 'Most Popular',
    cta: { label: 'Start Free Trial', href: '/register?plan=professional' },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For healthcare organizations',
    price: { monthly: 199, annual: 1990 },
    features: [
      'Everything in Professional',
      'Unlimited providers',
      'Custom integrations',
      'HIPAA BAA included',
      'Dedicated account manager',
      'SLA guarantees',
      'White-label options',
    ],
    cta: { label: 'Contact Sales', href: '/contact' },
  },
];

const features = [
  {
    title: 'Global Healthcare Access',
    description: 'Connect with healthcare providers worldwide, breaking down geographical barriers to quality care.',
    icon: GlobeIcon,
  },
  {
    title: 'Secure & Compliant',
    description: 'HIPAA, GDPR, and POPIA compliant platform with end-to-end encryption for all your health data.',
    icon: ShieldIcon,
  },
  {
    title: 'AI-Powered Insights',
    description: 'Advanced analytics and AI assist healthcare providers in delivering personalized care.',
    icon: SparklesIcon,
  },
  {
    title: 'Telemedicine Ready',
    description: 'High-quality video consultations with screen sharing, chat, and collaborative tools.',
    icon: VideoIcon,
  },
  {
    title: 'Integrated Records',
    description: 'Unified health records across providers for comprehensive patient care.',
    icon: DocumentIcon,
  },
  {
    title: '24/7 Availability',
    description: 'Schedule appointments, access records, and message providers anytime, anywhere.',
    icon: ClockIcon,
  },
];

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  return (
    <LandingLayout isHero showNav showFooter>
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="w-2 h-2 bg-uh-teal rounded-full animate-pulse" />
              <span className="text-sm text-white/80">Now available in 50+ countries</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Healthcare Without
              <span className="block text-gradient-healing">Borders</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              The Unified Health connects patients with healthcare providers globally,
              delivering secure, compliant, and accessible care for everyone.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/register"
                className="btn-uh btn-uh-primary px-8 py-4 text-base"
              >
                Start Your Journey
              </Link>
              <Link
                href="/demo"
                className="btn-uh btn-uh-secondary px-8 py-4 text-base"
              >
                Watch Demo
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <TrustBadge>HIPAA Compliant</TrustBadge>
              <TrustBadge>GDPR Ready</TrustBadge>
              <TrustBadge>SOC 2 Type II</TrustBadge>
              <TrustBadge>ISO 27001</TrustBadge>
            </div>
          </div>
        </div>

        {/* Decorative gradient glow under hero */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 170, 0.5), transparent)',
          }}
        />
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need for Modern Healthcare
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              A comprehensive platform designed for patients, providers, and healthcare organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <SectionDark className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
              Choose the plan that fits your needs. No hidden fees, no surprises.
            </p>
            <BillingToggle
              value={billingPeriod}
              onChange={setBillingPeriod}
              variant="dark"
            />
          </div>

          <PricingGrid
            tiers={pricingTiers}
            variant="dark"
            billingPeriod={billingPeriod}
          />
        </div>
      </SectionDark>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="50+" label="Countries" />
            <StatCard value="1M+" label="Patients Served" />
            <StatCard value="10K+" label="Healthcare Providers" />
            <StatCard value="99.9%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="card-uh p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Healthcare?
            </h2>
            <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
              Join thousands of healthcare providers and patients using The Unified Health
              to deliver and receive better care.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="btn-uh btn-uh-primary px-8 py-4 text-base"
              >
                Get Started Free
              </Link>
              <Link
                href="/contact"
                className="btn-uh btn-uh-secondary px-8 py-4 text-base"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}

// Component: Feature Card
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="card-uh p-6 group">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-uh-teal/20 to-uh-cyan/20 flex items-center justify-center mb-4 group-hover:from-uh-teal/30 group-hover:to-uh-cyan/30 transition-colors">
        <Icon className="w-6 h-6 text-uh-teal" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{description}</p>
    </div>
  );
}

// Component: Stat Card
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-gradient-healing mb-2">{value}</div>
      <div className="text-sm text-white/50 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// Component: Trust Badge
function TrustBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/60">
      <ShieldCheckIcon className="w-4 h-4" />
      {children}
    </div>
  );
}

// Icons
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
