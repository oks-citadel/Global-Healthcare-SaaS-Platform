/**
 * Base Skeleton Component
 * Provides animated placeholder for loading states
 */

import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rectangular' | 'circular' | 'rounded' | 'text';
  animation?: 'pulse' | 'wave' | 'none';
  'aria-label'?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse',
  'aria-label': ariaLabel = 'Loading...',
}) => {
  const baseStyles = 'bg-gray-200 dark:bg-gray-700';

  const variantStyles = {
    rectangular: '',
    circular: 'rounded-full',
    rounded: 'rounded-md',
    text: 'rounded h-4',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={style}
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

Skeleton.displayName = 'Skeleton';
