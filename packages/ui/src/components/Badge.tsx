// @ts-nocheck
import React from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'medical';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  dot = false,
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-medium';

  const variantStyles = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    info: 'bg-info-100 text-info-800',
    medical: 'bg-medical-100 text-medical-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const roundedStyles = rounded ? 'rounded-full' : 'rounded';

  const dotStyles = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600',
    info: 'bg-info-600',
    medical: 'bg-medical-600',
  };

  const dotSizeStyles = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles,
        dot && 'gap-1.5',
        className
      )}
    >
      {dot && (
        <span className={clsx('rounded-full', dotStyles[variant], dotSizeStyles[size])} />
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
