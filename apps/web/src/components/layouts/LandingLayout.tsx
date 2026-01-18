'use client';

import React from 'react';
import { UnifiedHealthDarkBackground } from '../theme/UnifiedHealthDarkBackground';
import { BrandLogo, LogoWatermark } from '../brand/BrandLogo';
import Link from 'next/link';

/**
 * LandingLayout
 *
 * Premium dark layout for landing pages, marketing pages, and authentication.
 * Features:
 * - Healing Aurora gradients (medical blue, green, teal)
 * - Glass morphism navigation
 * - Logo watermark background (subtle, elegant)
 * - Logo in top-right of navigation (brand placement rule)
 */

export interface LandingLayoutProps {
  children: React.ReactNode;
  /** Show navigation header */
  showNav?: boolean;
  /** Show footer */
  showFooter?: boolean;
  /** Is this a hero page (extra gradient intensity) */
  isHero?: boolean;
  /** Show logo watermark background */
  showWatermark?: boolean;
}

export function LandingLayout({
  children,
  showNav = true,
  showFooter = true,
  isHero = false,
  showWatermark = false,
}: LandingLayoutProps) {
  return (
    <UnifiedHealthDarkBackground isHero={isHero} showAurora>
      {/* Logo Watermark - Subtle background element */}
      {showWatermark && <LogoWatermark opacity={0.04} />}

      {/* Navigation */}
      {showNav && <LandingNav />}

      {/* Main Content */}
      <main className="relative">{children}</main>

      {/* Footer */}
      {showFooter && <LandingFooter />}
    </UnifiedHealthDarkBackground>
  );
}

/**
 * LandingNav - Glass morphism navigation for landing pages
 * Logo positioned on the right side per brand guidelines
 */
export function LandingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-b-2xl mt-0 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Navigation Links (Left) */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink href="/features">Features</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>

            {/* Auth Buttons (Center-Left on mobile) */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors focus-ring rounded-lg px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-uh btn-uh-primary text-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Logo (Right) - Brand placement rule: top-right */}
            <BrandLogo variant="light" size="md" />
          </div>
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-white/70 hover:text-white text-sm font-medium transition-colors focus-ring rounded-lg px-2 py-1"
    >
      <>{children}</>
    </Link>
  );
}

/**
 * LandingFooter - Footer for landing pages
 */
export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-uh-dark/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <BrandLogo variant="light" size="lg" showTagline href={null} />
            <p className="mt-4 text-white/60 text-sm max-w-md">
              The Unified Health platform connects patients with healthcare providers
              globally, breaking down barriers to quality healthcare access.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <FooterLink href="/features">Features</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/providers">For Providers</FooterLink>
              <FooterLink href="/enterprise">Enterprise</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/hipaa">HIPAA Compliance</FooterLink>
              <FooterLink href="/security">Security</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            &copy; {currentYear} The Unified Health. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-white/40 text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-uh-emerald rounded-full animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-white/50 hover:text-uh-teal text-sm transition-colors focus-ring rounded"
      >
        <>{children}</>
      </Link>
    </li>
  );
}

export default LandingLayout;
