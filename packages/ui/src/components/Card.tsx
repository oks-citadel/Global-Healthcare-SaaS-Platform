import React from 'react';
import clsx from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  clickable = false,
  onClick,
  className,
  padding = 'md',
  shadow = 'md',
  border = true,
  hover = false,
}) => {
  const baseStyles = 'bg-white rounded-lg transition-all duration-200';

  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const borderStyles = border ? 'border border-gray-200' : '';

  const clickableStyles = clickable || onClick
    ? 'cursor-pointer hover:shadow-lg active:scale-[0.99]'
    : '';

  const hoverStyles = hover ? 'hover:shadow-lg hover:border-primary-300' : '';

  const Component = clickable || onClick ? 'button' : 'div';

  const componentProps = clickable || onClick
    ? {
        onClick,
        type: 'button' as const,
      }
    : {};

  return (
    <Component
      className={clsx(
        baseStyles,
        shadowStyles[shadow],
        borderStyles,
        clickableStyles,
        hoverStyles,
        !header && !footer && paddingStyles[padding],
        className
      )}
      {...componentProps}
    >
      {header && (
        <div
          className={clsx(
            'border-b border-gray-200',
            paddingStyles[padding],
            'font-semibold text-gray-900'
          )}
        >
          {header}
        </div>
      )}

      <div className={clsx(header || footer ? paddingStyles[padding] : '')}>
        {children}
      </div>

      {footer && (
        <div
          className={clsx(
            'border-t border-gray-200 bg-gray-50 rounded-b-lg',
            paddingStyles[padding]
          )}
        >
          {footer}
        </div>
      )}
    </Component>
  );
};

Card.displayName = 'Card';
