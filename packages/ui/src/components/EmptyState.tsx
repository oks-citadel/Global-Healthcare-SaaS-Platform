import React from 'react';
import clsx from 'clsx';

export type EmptyStateVariant = 'default' | 'error' | 'search' | 'data';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface EmptyStateProps {
  /** Icon to display at the top of the empty state */
  icon?: React.ReactNode;
  /** Main title text */
  title: string;
  /** Description text below the title */
  description?: string;
  /** Primary action button configuration */
  action?: EmptyStateAction;
  /** Secondary action button configuration */
  secondaryAction?: EmptyStateAction;
  /** Visual variant of the empty state */
  variant?: EmptyStateVariant;
  /** Additional CSS classes */
  className?: string;
  /** Children content to render below description */
  children?: React.ReactNode;
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg';
  /** Test ID for testing purposes */
  testId?: string;
}

const variantStyles: Record<EmptyStateVariant, {
  iconBg: string;
  iconColor: string;
  titleColor: string;
  descriptionColor: string;
}> = {
  default: {
    iconBg: 'bg-gray-100 dark:bg-gray-800',
    iconColor: 'text-gray-400 dark:text-gray-500',
    titleColor: 'text-gray-900 dark:text-white',
    descriptionColor: 'text-gray-500 dark:text-gray-400',
  },
  error: {
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-500 dark:text-red-400',
    titleColor: 'text-gray-900 dark:text-white',
    descriptionColor: 'text-gray-500 dark:text-gray-400',
  },
  search: {
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-500 dark:text-blue-400',
    titleColor: 'text-gray-900 dark:text-white',
    descriptionColor: 'text-gray-500 dark:text-gray-400',
  },
  data: {
    iconBg: 'bg-primary-100 dark:bg-primary-900/30',
    iconColor: 'text-primary-500 dark:text-primary-400',
    titleColor: 'text-gray-900 dark:text-white',
    descriptionColor: 'text-gray-500 dark:text-gray-400',
  },
};

const sizeStyles = {
  sm: {
    container: 'py-6 px-4',
    iconWrapper: 'h-12 w-12 mb-3',
    iconSize: 'h-6 w-6',
    title: 'text-base',
    description: 'text-sm mt-1',
    actions: 'mt-4 gap-2',
    button: 'px-3 py-1.5 text-sm',
  },
  md: {
    container: 'py-10 px-6',
    iconWrapper: 'h-16 w-16 mb-4',
    iconSize: 'h-8 w-8',
    title: 'text-lg',
    description: 'text-base mt-2',
    actions: 'mt-6 gap-3',
    button: 'px-4 py-2 text-base',
  },
  lg: {
    container: 'py-16 px-8',
    iconWrapper: 'h-20 w-20 mb-6',
    iconSize: 'h-10 w-10',
    title: 'text-xl',
    description: 'text-lg mt-3',
    actions: 'mt-8 gap-4',
    button: 'px-6 py-3 text-lg',
  },
};

const buttonVariantStyles = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 active:bg-secondary-800',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100 dark:hover:bg-primary-900/20',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800',
};

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title,
      description,
      action,
      secondaryAction,
      variant = 'default',
      className,
      children,
      size = 'md',
      testId,
    },
    ref
  ) => {
    const variantStyle = variantStyles[variant];
    const sizeStyle = sizeStyles[size];

    const renderButton = (
      buttonAction: EmptyStateAction,
      isPrimary: boolean
    ) => {
      const buttonVariant = buttonAction.variant || (isPrimary ? 'primary' : 'outline');

      return (
        <button
          type="button"
          onClick={buttonAction.onClick}
          className={clsx(
            'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            buttonVariantStyles[buttonVariant],
            sizeStyle.button
          )}
          aria-label={buttonAction.label}
        >
          {buttonAction.label}
        </button>
      );
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'flex flex-col items-center justify-center text-center',
          sizeStyle.container,
          className
        )}
        role="status"
        aria-label={title}
        data-testid={testId}
      >
        {icon && (
          <div
            className={clsx(
              'flex items-center justify-center rounded-full',
              variantStyle.iconBg,
              sizeStyle.iconWrapper
            )}
            aria-hidden="true"
          >
            <div className={clsx(variantStyle.iconColor, sizeStyle.iconSize)}>
              {icon}
            </div>
          </div>
        )}

        <h3
          className={clsx(
            'font-semibold',
            variantStyle.titleColor,
            sizeStyle.title
          )}
        >
          {title}
        </h3>

        {description && (
          <p
            className={clsx(
              'max-w-md',
              variantStyle.descriptionColor,
              sizeStyle.description
            )}
          >
            {description}
          </p>
        )}

        {children}

        {(action || secondaryAction) && (
          <div
            className={clsx(
              'flex flex-wrap items-center justify-center',
              sizeStyle.actions
            )}
          >
            {action && renderButton(action, true)}
            {secondaryAction && renderButton(secondaryAction, false)}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
