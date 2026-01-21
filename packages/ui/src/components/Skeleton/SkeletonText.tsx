/**
 * Skeleton Text Component
 * Renders multiple lines of text placeholders
 */

import React from 'react';
import { Skeleton, SkeletonProps } from './Skeleton';
import { cn } from '../../utils/cn';

export interface SkeletonTextProps extends Omit<SkeletonProps, 'variant' | 'height'> {
  lines?: number;
  lineHeight?: number;
  spacing?: number;
  lastLineWidth?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lineHeight = 16,
  spacing = 8,
  lastLineWidth = '70%',
  className,
  animation = 'pulse',
  ...props
}) => {
  return (
    <div className={cn('space-y-2', className)} role="status" aria-label="Loading text...">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height={lineHeight}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          animation={animation}
          aria-hidden="true"
          {...props}
        />
      ))}
      <span className="sr-only">Loading text content...</span>
    </div>
  );
};

SkeletonText.displayName = 'SkeletonText';
