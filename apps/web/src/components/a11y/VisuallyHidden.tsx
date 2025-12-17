'use client';

import React from 'react';
import { clsx } from 'clsx';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  focusable?: boolean;
}

/**
 * VisuallyHidden Component
 *
 * Renders content that is accessible to screen readers but visually hidden.
 * This is useful for providing additional context to assistive technologies
 * without cluttering the visual interface.
 *
 * Implements the "visually hidden" technique that ensures content is:
 * - Hidden from sighted users
 * - Available to screen readers
 * - Not removed from the accessibility tree
 * - Doesn't affect layout
 *
 * WCAG 2.1 Success Criteria:
 * - 1.3.1 Info and Relationships (Level A)
 * - 2.4.4 Link Purpose (In Context) (Level A)
 * - 3.3.2 Labels or Instructions (Level A)
 *
 * @example
 * ```tsx
 * <button>
 *   <IconEdit />
 *   <VisuallyHidden>Edit profile</VisuallyHidden>
 * </button>
 *
 * // With custom element
 * <VisuallyHidden as="h2">Section heading for screen readers</VisuallyHidden>
 *
 * // Focusable variant (becomes visible when focused)
 * <VisuallyHidden focusable>
 *   Additional navigation help
 * </VisuallyHidden>
 * ```
 */
export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  as: Component = 'span',
  className,
  focusable = false,
}) => {
  return (
    <Component
      className={clsx(
        // Position absolute to remove from layout flow
        'absolute',
        // Clip to a 1px square
        'overflow-hidden',
        'whitespace-nowrap',
        // Size to 1px (not 0 to avoid some screen readers ignoring it)
        'w-px h-px',
        // Additional hiding
        'p-0 -m-px',
        'border-0',
        // Clip path for modern browsers
        '[clip-path:inset(50%)]',
        // Legacy clip for older browsers
        '[clip:rect(0,0,0,0)]',
        // Focusable variant - becomes visible when focused
        focusable && [
          'focus:absolute',
          'focus:w-auto focus:h-auto',
          'focus:overflow-visible',
          'focus:whitespace-normal',
          'focus:p-3',
          'focus:m-0',
          'focus:[clip:auto]',
          'focus:[clip-path:none]',
          'focus:bg-white',
          'focus:text-gray-900',
          'focus:z-50',
          'focus:border-2 focus:border-blue-600',
        ],
        className
      )}
      {...(focusable && { tabIndex: 0 })}
    >
      {children}
    </Component>
  );
};

/**
 * ScreenReaderOnly Component
 *
 * Alias for VisuallyHidden with a more descriptive name.
 * Use this when you want to make it clear that content is specifically
 * for screen reader users.
 */
export const ScreenReaderOnly = VisuallyHidden;

/**
 * useVisuallyHidden Hook
 *
 * Returns the CSS classes needed for visually hidden content.
 * Useful when you need to apply the visually hidden pattern
 * to elements that can't use the component.
 *
 * @example
 * ```tsx
 * const srOnlyClasses = useVisuallyHidden();
 * return <div className={srOnlyClasses}>Hidden content</div>;
 * ```
 */
export const useVisuallyHidden = (focusable: boolean = false): string => {
  return clsx(
    'absolute overflow-hidden whitespace-nowrap',
    'w-px h-px p-0 -m-px border-0',
    '[clip-path:inset(50%)] [clip:rect(0,0,0,0)]',
    focusable && [
      'focus:absolute focus:w-auto focus:h-auto',
      'focus:overflow-visible focus:whitespace-normal',
      'focus:p-3 focus:m-0',
      'focus:[clip:auto] focus:[clip-path:none]',
      'focus:bg-white focus:text-gray-900 focus:z-50',
      'focus:border-2 focus:border-blue-600',
    ]
  );
};

export default VisuallyHidden;
