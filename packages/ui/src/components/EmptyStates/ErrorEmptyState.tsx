import React from 'react';
import { EmptyState, EmptyStateAction } from '../EmptyState';
import clsx from 'clsx';

export interface ErrorEmptyStateProps {
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** Error message to display */
  errorMessage?: string;
  /** Error code to display */
  errorCode?: string | number;
  /** Primary action button (e.g., retry) */
  action?: EmptyStateAction;
  /** Secondary action button (e.g., go back) */
  secondaryAction?: EmptyStateAction;
  /** Additional CSS classes */
  className?: string;
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg';
  /** Custom icon to override default */
  customIcon?: React.ReactNode;
  /** Type of error context */
  errorType?: 'generic' | 'network' | 'not-found' | 'permission' | 'server';
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
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);

const getDefaultContent = (errorType: 'generic' | 'network' | 'not-found' | 'permission' | 'server') => {
  switch (errorType) {
    case 'network':
      return {
        title: 'Connection error',
        description: 'Unable to connect to the server. Please check your internet connection and try again.',
        actionLabel: 'Retry',
      };
    case 'not-found':
      return {
        title: 'Page not found',
        description: 'The page you are looking for does not exist or has been moved.',
        actionLabel: 'Go Back',
      };
    case 'permission':
      return {
        title: 'Access denied',
        description: 'You do not have permission to view this content. Please contact your administrator if you believe this is an error.',
        actionLabel: 'Go Back',
      };
    case 'server':
      return {
        title: 'Server error',
        description: 'Something went wrong on our end. Our team has been notified and is working to fix the issue.',
        actionLabel: 'Retry',
      };
    case 'generic':
    default:
      return {
        title: 'Something went wrong',
        description: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
        actionLabel: 'Try Again',
      };
  }
};

export const ErrorEmptyState = React.forwardRef<HTMLDivElement, ErrorEmptyStateProps>(
  (
    {
      title,
      description,
      errorMessage,
      errorCode,
      action,
      secondaryAction,
      className,
      size = 'md',
      customIcon,
      errorType = 'generic',
      testId = 'error-empty-state',
    },
    ref
  ) => {
    const defaultContent = getDefaultContent(errorType);

    const defaultAction: EmptyStateAction = {
      label: defaultContent.actionLabel,
      onClick: () => window.location.reload(),
      variant: 'primary',
    };

    const defaultSecondaryAction: EmptyStateAction = {
      label: 'Contact Support',
      onClick: () => {},
      variant: 'outline',
    };

    return (
      <EmptyState
        ref={ref}
        icon={customIcon || <DefaultIcon />}
        title={title || defaultContent.title}
        description={description || defaultContent.description}
        action={action || defaultAction}
        secondaryAction={secondaryAction || defaultSecondaryAction}
        variant="error"
        className={className}
        size={size}
        testId={testId}
      >
        {(errorMessage || errorCode) && (
          <div
            className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-left max-w-md"
            role="alert"
          >
            {errorCode && (
              <p className="text-xs font-mono text-red-600 dark:text-red-400 mb-1">
                Error Code: {errorCode}
              </p>
            )}
            {errorMessage && (
              <p className="text-sm text-red-700 dark:text-red-300 font-mono break-all">
                {errorMessage}
              </p>
            )}
          </div>
        )}
      </EmptyState>
    );
  }
);

ErrorEmptyState.displayName = 'ErrorEmptyState';
