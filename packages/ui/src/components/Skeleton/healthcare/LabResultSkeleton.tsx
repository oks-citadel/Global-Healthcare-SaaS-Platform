/**
 * Lab Result Skeleton
 * Loading placeholder for lab results and diagnostic data
 */

import React from 'react';
import { Skeleton } from '../Skeleton';
import { cn } from '../../../utils/cn';

export interface LabResultSkeletonProps {
  className?: string;
  resultCount?: number;
  showChart?: boolean;
  animation?: 'pulse' | 'wave' | 'none';
}

const LabResultItemSkeleton: React.FC<{
  animation: 'pulse' | 'wave' | 'none';
}> = ({ animation }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className="flex-1 space-y-1">
      <Skeleton variant="text" width={140} height={14} animation={animation} aria-hidden="true" />
      <Skeleton variant="text" width={100} height={10} animation={animation} aria-hidden="true" />
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right space-y-1">
        <Skeleton variant="text" width={60} height={18} animation={animation} aria-hidden="true" />
        <Skeleton variant="text" width={80} height={10} animation={animation} aria-hidden="true" />
      </div>
      <Skeleton variant="rounded" width={70} height={24} animation={animation} aria-hidden="true" />
    </div>
  </div>
);

export const LabResultSkeleton: React.FC<LabResultSkeletonProps> = ({
  className,
  resultCount = 5,
  showChart = false,
  animation = 'pulse',
}) => {
  return (
    <div
      className={cn(
        'p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
        className
      )}
      role="status"
      aria-label="Loading lab results..."
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="space-y-1">
          <Skeleton variant="text" width={160} height={20} animation={animation} aria-hidden="true" />
          <Skeleton variant="text" width={120} height={12} animation={animation} aria-hidden="true" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={80} height={32} animation={animation} aria-hidden="true" />
          <Skeleton variant="rounded" width={40} height={32} animation={animation} aria-hidden="true" />
        </div>
      </div>

      {/* Chart placeholder */}
      {showChart && (
        <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <Skeleton variant="text" width={100} height={12} animation={animation} aria-hidden="true" className="mb-2" />
          <Skeleton variant="rounded" width="100%" height={150} animation={animation} aria-hidden="true" />
        </div>
      )}

      {/* Results list */}
      <div>
        {Array.from({ length: resultCount }).map((_, i) => (
          <LabResultItemSkeleton key={i} animation={animation} />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <Skeleton variant="text" width={180} height={12} animation={animation} aria-hidden="true" />
        <Skeleton variant="rounded" width={100} height={32} animation={animation} aria-hidden="true" />
      </div>

      <span className="sr-only">Loading lab results...</span>
    </div>
  );
};

LabResultSkeleton.displayName = 'LabResultSkeleton';
