import React from 'react';
import { EmptyState, EmptyStateAction } from '../EmptyState';
import clsx from 'clsx';

export interface NoSearchResultsEmptyStateProps {
  /** The search query that returned no results */
  searchQuery?: string;
  /** Custom title (defaults to dynamic title based on searchQuery) */
  title?: string;
  /** Custom description */
  description?: string;
  /** Primary action button (e.g., clear search) */
  action?: EmptyStateAction;
  /** Secondary action button */
  secondaryAction?: EmptyStateAction;
  /** Additional CSS classes */
  className?: string;
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg';
  /** Custom icon to override default */
  customIcon?: React.ReactNode;
  /** Suggestions to display to the user */
  suggestions?: string[];
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
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

export const NoSearchResultsEmptyState = React.forwardRef<HTMLDivElement, NoSearchResultsEmptyStateProps>(
  (
    {
      searchQuery,
      title,
      description,
      action,
      secondaryAction,
      className,
      size = 'md',
      customIcon,
      suggestions,
      testId = 'no-search-results-empty-state',
    },
    ref
  ) => {
    const defaultTitle = searchQuery
      ? `No results found for "${searchQuery}"`
      : 'No results found';

    const defaultDescription = 'Try adjusting your search terms or filters to find what you are looking for.';

    return (
      <EmptyState
        ref={ref}
        icon={customIcon || <DefaultIcon />}
        title={title || defaultTitle}
        description={description || defaultDescription}
        action={action}
        secondaryAction={secondaryAction}
        variant="search"
        className={className}
        size={size}
        testId={testId}
      >
        {suggestions && suggestions.length > 0 && (
          <div className="mt-4 text-left max-w-md">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Suggestions:
            </p>
            <ul
              className="text-sm text-gray-500 dark:text-gray-400 list-disc list-inside space-y-1"
              role="list"
              aria-label="Search suggestions"
            >
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </EmptyState>
    );
  }
);

NoSearchResultsEmptyState.displayName = 'NoSearchResultsEmptyState';
