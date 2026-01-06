import React from 'react';
import clsx from 'clsx';

export interface LoadingEmptyStateProps {
  /** Custom title (defaults to "Loading...") */
  title?: string;
  /** Custom description */
  description?: string;
  /** Additional CSS classes */
  className?: string;
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg';
  /** Number of skeleton lines to show */
  lines?: number;
  /** Type of skeleton layout */
  variant?: 'default' | 'card' | 'list' | 'table';
  /** Show animated spinner instead of skeleton */
  showSpinner?: boolean;
  /** Test ID for testing purposes */
  testId?: string;
}

const sizeStyles = {
  sm: {
    container: 'py-6 px-4',
    spinner: 'h-8 w-8',
    title: 'h-4 w-32',
    description: 'h-3 w-48',
    line: 'h-3',
    card: 'h-24',
  },
  md: {
    container: 'py-10 px-6',
    spinner: 'h-12 w-12',
    title: 'h-5 w-40',
    description: 'h-4 w-64',
    line: 'h-4',
    card: 'h-32',
  },
  lg: {
    container: 'py-16 px-8',
    spinner: 'h-16 w-16',
    title: 'h-6 w-48',
    description: 'h-5 w-80',
    line: 'h-5',
    card: 'h-40',
  },
};

const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={clsx('animate-spin text-primary-600 dark:text-primary-400', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    role="status"
    aria-label="Loading"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const SkeletonLine: React.FC<{ className?: string; width?: string }> = ({
  className,
  width = 'w-full',
}) => (
  <div
    className={clsx(
      'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
      width,
      className
    )}
    aria-hidden="true"
  />
);

const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={clsx(
      'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-full',
      className
    )}
    aria-hidden="true"
  />
);

const DefaultSkeleton: React.FC<{ size: 'sm' | 'md' | 'lg'; lines: number }> = ({
  size,
  lines,
}) => {
  const styles = sizeStyles[size];
  const widths = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3'];

  return (
    <div className="w-full max-w-md space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLine
          key={index}
          className={styles.line}
          width={widths[index % widths.length]}
        />
      ))}
    </div>
  );
};

const CardSkeleton: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => {
  const styles = sizeStyles[size];

  return (
    <div className="w-full max-w-md space-y-4">
      <SkeletonCard className={styles.card} />
      <div className="space-y-2">
        <SkeletonLine className={styles.line} width="w-3/4" />
        <SkeletonLine className={styles.line} width="w-1/2" />
      </div>
    </div>
  );
};

const ListSkeleton: React.FC<{ size: 'sm' | 'md' | 'lg'; lines: number }> = ({
  size,
  lines,
}) => {
  const styles = sizeStyles[size];

  return (
    <div className="w-full max-w-md space-y-4">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full h-10 w-10 flex-shrink-0"
            aria-hidden="true"
          />
          <div className="flex-1 space-y-2">
            <SkeletonLine className={styles.line} width="w-3/4" />
            <SkeletonLine className={clsx(styles.line, 'opacity-60')} width="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

const TableSkeleton: React.FC<{ size: 'sm' | 'md' | 'lg'; lines: number }> = ({
  size,
  lines,
}) => {
  const styles = sizeStyles[size];

  return (
    <div className="w-full max-w-lg space-y-3">
      {/* Header */}
      <div className="flex space-x-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <SkeletonLine className={styles.line} width="w-1/4" />
        <SkeletonLine className={styles.line} width="w-1/3" />
        <SkeletonLine className={styles.line} width="w-1/4" />
        <SkeletonLine className={styles.line} width="w-1/6" />
      </div>
      {/* Rows */}
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <SkeletonLine className={styles.line} width="w-1/4" />
          <SkeletonLine className={styles.line} width="w-1/3" />
          <SkeletonLine className={styles.line} width="w-1/4" />
          <SkeletonLine className={styles.line} width="w-1/6" />
        </div>
      ))}
    </div>
  );
};

export const LoadingEmptyState = React.forwardRef<HTMLDivElement, LoadingEmptyStateProps>(
  (
    {
      title = 'Loading...',
      description,
      className,
      size = 'md',
      lines = 3,
      variant = 'default',
      showSpinner = false,
      testId = 'loading-empty-state',
    },
    ref
  ) => {
    const styles = sizeStyles[size];

    const renderSkeleton = () => {
      if (showSpinner) {
        return <Spinner className={styles.spinner} />;
      }

      switch (variant) {
        case 'card':
          return <CardSkeleton size={size} />;
        case 'list':
          return <ListSkeleton size={size} lines={lines} />;
        case 'table':
          return <TableSkeleton size={size} lines={lines} />;
        case 'default':
        default:
          return <DefaultSkeleton size={size} lines={lines} />;
      }
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'flex flex-col items-center justify-center',
          styles.container,
          className
        )}
        role="status"
        aria-label={title}
        aria-busy="true"
        data-testid={testId}
      >
        {showSpinner && (
          <div className="mb-4">
            {renderSkeleton()}
          </div>
        )}

        {!showSpinner && (
          <div className="mb-6 w-full flex justify-center">
            {renderSkeleton()}
          </div>
        )}

        <div className="flex flex-col items-center space-y-2">
          {showSpinner && (
            <>
              <SkeletonLine className={styles.title} />
              {description && <SkeletonLine className={styles.description} />}
            </>
          )}
        </div>

        {/* Screen reader text */}
        <span className="sr-only">{title}</span>
        {description && <span className="sr-only">{description}</span>}
      </div>
    );
  }
);

LoadingEmptyState.displayName = 'LoadingEmptyState';
