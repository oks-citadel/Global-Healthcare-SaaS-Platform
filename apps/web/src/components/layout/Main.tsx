'use client';

import React from 'react';
import { clsx } from 'clsx';

interface MainProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Main Component
 *
 * Semantic main element representing the primary content of the page.
 * Automatically sets up the skip link target.
 *
 * WCAG 2.1 Success Criteria:
 * - 1.3.1 Info and Relationships (Level A)
 * - 2.4.1 Bypass Blocks (Level A)
 *
 * @example
 * ```tsx
 * <Main>
 *   <h1>Page Title</h1>
 *   <p>Content...</p>
 * </Main>
 * ```
 */
export const Main: React.FC<MainProps> = ({
  id = 'main-content',
  className,
  children,
}) => {
  return (
    <main
      id={id}
      role="main"
      tabIndex={-1} // Allows programmatic focus but doesn't add to tab order
      className={clsx(
        'flex-1 w-full',
        'focus:outline-none', // Remove default outline since this is programmatically focused
        className
      )}
    >
      {children}
    </main>
  );
};

interface SectionProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Section Component
 *
 * Semantic section element with accessible labeling.
 * Use aria-label or aria-labelledby to provide context to screen readers.
 *
 * @example
 * ```tsx
 * <Section aria-labelledby="appointments-heading">
 *   <h2 id="appointments-heading">Upcoming Appointments</h2>
 *   <AppointmentList />
 * </Section>
 * ```
 */
export const Section: React.FC<SectionProps> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className,
  children,
}) => {
  return (
    <section
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={className}
    >
      {children}
    </section>
  );
};

interface ArticleProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Article Component
 *
 * Semantic article element for self-contained content.
 *
 * @example
 * ```tsx
 * <Article aria-labelledby="blog-post-title">
 *   <h2 id="blog-post-title">Blog Post Title</h2>
 *   <p>Content...</p>
 * </Article>
 * ```
 */
export const Article: React.FC<ArticleProps> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className,
  children,
}) => {
  return (
    <article
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      className={className}
    >
      {children}
    </article>
  );
};

export default Main;
