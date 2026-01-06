import React from 'react';
import { EmptyState, EmptyStateAction } from '../EmptyState';
import clsx from 'clsx';

export interface NoDataEmptyStateProps {
  /** Custom title (defaults to "No data available") */
  title?: string;
  /** Custom description */
  description?: string;
  /** Primary action button */
  action?: EmptyStateAction;
  /** Secondary action button */
  secondaryAction?: EmptyStateAction;
  /** Additional CSS classes */
  className?: string;
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg';
  /** Custom icon to override default */
  customIcon?: React.ReactNode;
  /** Test ID for testing purposes */
  testId?: string;
}

const DefaultIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={clsx('h-full w-full', className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

export const NoDataEmptyState = React.forwardRef<HTMLDivElement, NoDataEmptyStateProps>(
  (
    {
      title = 'No data available',
      description = 'There is no data to display at this time. Data will appear here once available.',
      action,
      secondaryAction,
      className,
      size = 'md',
      customIcon,
      testId = 'no-data-empty-state',
    },
    ref
  ) => {
    return (
      <EmptyState
        ref={ref}
        icon={customIcon || <DefaultIcon />}
        title={title}
        description={description}
        action={action}
        secondaryAction={secondaryAction}
        variant="data"
        className={className}
        size={size}
        testId={testId}
      />
    );
  }
);

NoDataEmptyState.displayName = 'NoDataEmptyState';
