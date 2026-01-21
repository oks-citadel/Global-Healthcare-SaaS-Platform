/**
 * Skeleton Avatar Component
 * Circular placeholder for user avatars
 */

import React from 'react';
import { Skeleton, SkeletonProps } from './Skeleton';
import { cn } from '../../utils/cn';

export interface SkeletonAvatarProps extends Omit<SkeletonProps, 'variant'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  className,
  ...props
}) => {
  const dimension = sizeMap[size];

  return (
    <Skeleton
      variant="circular"
      width={dimension}
      height={dimension}
      className={cn('flex-shrink-0', className)}
      aria-label="Loading avatar..."
      {...props}
    />
  );
};

SkeletonAvatar.displayName = 'SkeletonAvatar';
