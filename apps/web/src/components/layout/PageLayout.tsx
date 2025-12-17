'use client';

import React from 'react';
import { clsx } from 'clsx';
import { SkipLink } from '../a11y/SkipLink';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showSkipLink?: boolean;
}

/**
 * PageLayout Component
 *
 * Main page layout wrapper with semantic HTML structure.
 * Provides a consistent layout structure across all pages with proper
 * accessibility landmarks and skip navigation.
 *
 * WCAG 2.1 Success Criteria:
 * - 1.3.1 Info and Relationships (Level A)
 * - 2.4.1 Bypass Blocks (Level A)
 * - 2.4.3 Focus Order (Level A)
 *
 * Implements proper heading hierarchy and landmark regions:
 * - Banner (header)
 * - Main (main content)
 * - Navigation (nav)
 * - Contentinfo (footer)
 *
 * @example
 * ```tsx
 * <PageLayout>
 *   <Header />
 *   <Main>
 *     <h1>Page Title</h1>
 *     <p>Content...</p>
 *   </Main>
 *   <Footer />
 * </PageLayout>
 * ```
 */
export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className,
  showSkipLink = true,
}) => {
  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col',
        'bg-white dark:bg-gray-950',
        'text-gray-900 dark:text-gray-100',
        className
      )}
    >
      {showSkipLink && <SkipLink targetId="main-content" />}
      {children}
    </div>
  );
};

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * Container Component
 *
 * Responsive container with consistent max-widths.
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'xl',
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={clsx(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
};

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

/**
 * Heading Component
 *
 * Semantic heading with proper hierarchy.
 * Ensures consistent styling and accessibility.
 *
 * WCAG 2.1 Success Criteria:
 * - 1.3.1 Info and Relationships (Level A)
 * - 2.4.6 Headings and Labels (Level AA)
 *
 * @example
 * ```tsx
 * <Heading level={1} id="page-title">
 *   Dashboard
 * </Heading>
 * ```
 */
export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  id,
  className,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const sizeClasses = {
    1: 'text-4xl font-bold tracking-tight',
    2: 'text-3xl font-bold tracking-tight',
    3: 'text-2xl font-semibold',
    4: 'text-xl font-semibold',
    5: 'text-lg font-semibold',
    6: 'text-base font-semibold',
  };

  return (
    <Tag
      id={id}
      className={clsx(
        sizeClasses[level],
        'text-gray-900 dark:text-white',
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default PageLayout;
