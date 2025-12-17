'use client';

import React from 'react';
import { clsx } from 'clsx';

interface FooterProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Footer Component
 *
 * Semantic footer element with proper ARIA landmarks.
 * Represents the footer of the page or a section.
 *
 * WCAG 2.1 Success Criteria:
 * - 1.3.1 Info and Relationships (Level A)
 *
 * @example
 * ```tsx
 * <Footer>
 *   <FooterNav>
 *     <FooterLink href="/about">About</FooterLink>
 *     <FooterLink href="/privacy">Privacy</FooterLink>
 *   </FooterNav>
 *   <FooterCopyright>© 2024 Unified Healthcare</FooterCopyright>
 * </Footer>
 * ```
 */
export const Footer: React.FC<FooterProps> = ({ className, children }) => {
  return (
    <footer
      role="contentinfo"
      className={clsx(
        'w-full mt-auto',
        'bg-gray-50 dark:bg-gray-900',
        'border-t border-gray-200 dark:border-gray-800',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </footer>
  );
};

interface FooterNavProps {
  'aria-label'?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * FooterNav Component
 *
 * Navigation within the footer with proper labeling.
 */
export const FooterNav: React.FC<FooterNavProps> = ({
  'aria-label': ariaLabel = 'Footer navigation',
  className,
  children,
}) => {
  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul
        className={clsx(
          'flex flex-wrap items-center gap-6',
          'text-sm text-gray-600 dark:text-gray-400'
        )}
        role="list"
      >
        {children}
      </ul>
    </nav>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

/**
 * FooterLink Component
 *
 * Accessible footer link with proper focus indicators.
 */
export const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
  className,
  external = false,
}) => {
  return (
    <li>
      <a
        href={href}
        className={clsx(
          'hover:text-blue-600 dark:hover:text-blue-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'rounded transition-colors',
          className
        )}
        {...(external && {
          target: '_blank',
          rel: 'noopener noreferrer',
          'aria-label': `${children} (opens in new tab)`,
        })}
      >
        {children}
      </a>
    </li>
  );
};

interface FooterSectionProps {
  heading: string;
  headingId?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * FooterSection Component
 *
 * A section within the footer with a heading.
 */
export const FooterSection: React.FC<FooterSectionProps> = ({
  heading,
  headingId,
  children,
  className,
}) => {
  const id = headingId || `footer-${heading.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={className}>
      <h2
        id={id}
        className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4"
      >
        {heading}
      </h2>
      <nav aria-labelledby={id}>
        <ul className="space-y-3" role="list">
          {children}
        </ul>
      </nav>
    </div>
  );
};

interface FooterCopyrightProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * FooterCopyright Component
 *
 * Copyright notice in the footer.
 */
export const FooterCopyright: React.FC<FooterCopyrightProps> = ({
  children,
  className,
}) => {
  return (
    <p
      className={clsx(
        'text-sm text-gray-500 dark:text-gray-400',
        className
      )}
    >
      {children}
    </p>
  );
};

export default Footer;
