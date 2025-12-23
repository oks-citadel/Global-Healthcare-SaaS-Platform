'use client';

import React from 'react';
import { clsx } from 'clsx';

export interface SkipLinkProps {
  targetId?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * SkipLink Component
 *
 * Provides a keyboard-accessible link that allows users to skip to main content.
 * This is essential for WCAG 2.1 AA compliance (Success Criterion 2.4.1).
 *
 * The link is visually hidden until focused, making it accessible to keyboard
 * and screen reader users without cluttering the visual interface.
 *
 * @example
 * ```tsx
 * <SkipLink targetId="main-content">Skip to main content</SkipLink>
 * ```
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  className,
  children = 'Skip to main content',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);

    if (target) {
      // Move focus to the target element
      target.tabIndex = -1;
      target.focus();

      // Scroll to the target
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Remove tabIndex after focus to maintain normal tab flow
      setTimeout(() => {
        target.removeAttribute('tabindex');
      }, 100);
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={clsx(
        // Visually hidden by default
        'absolute left-0 top-0 z-[9999]',
        'bg-blue-600 text-white px-4 py-2 rounded-br-lg',
        'font-medium text-sm',
        // Transform off-screen
        '-translate-y-full',
        // Visible on focus
        'focus:translate-y-0',
        // Focus styles
        'focus:outline-none focus:ring-4 focus:ring-blue-300',
        // Transition
        'transition-transform duration-200 ease-in-out',
        // Custom classes
        className
      )}
    >
      {children}
    </a>
  );
};

/**
 * SkipLinks Component
 *
 * Provides multiple skip links for complex layouts.
 * Useful for allowing users to skip to different sections of the page.
 *
 * @example
 * ```tsx
 * <SkipLinks
 *   links={[
 *     { targetId: 'main-content', label: 'Skip to main content' },
 *     { targetId: 'main-navigation', label: 'Skip to navigation' },
 *     { targetId: 'footer', label: 'Skip to footer' }
 *   ]}
 * />
 * ```
 */
export interface SkipLinksProps {
  links: Array<{
    targetId: string;
    label: string;
  }>;
  className?: string;
}

export const SkipLinks: React.FC<SkipLinksProps> = ({ links, className }) => {
  return (
    <div className={clsx('sr-only-until-focused', className)}>
      {links.map((link) => (
        <SkipLink
          key={link.targetId}
          targetId={link.targetId}
          className="mr-2"
        >
          {link.label}
        </SkipLink>
      ))}
    </div>
  );
};

export default SkipLink;
