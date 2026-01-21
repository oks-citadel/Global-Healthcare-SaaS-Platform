/**
 * Skeleton Table Component
 * Table rows placeholder for data loading states
 */

import React from 'react';
import { Skeleton } from './Skeleton';
import { cn } from '../../utils/cn';

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  hasHeader = true,
  className,
  animation = 'pulse',
}) => {
  return (
    <div
      className={cn('w-full', className)}
      role="status"
      aria-label="Loading table..."
    >
      <table className="w-full">
        {hasHeader && (
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <th key={colIndex} className="px-4 py-3 text-left">
                  <Skeleton
                    variant="text"
                    width={`${60 + Math.random() * 40}%`}
                    height={14}
                    animation={animation}
                    aria-hidden="true"
                  />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton
                    variant="text"
                    width={`${50 + Math.random() * 50}%`}
                    height={12}
                    animation={animation}
                    aria-hidden="true"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <span className="sr-only">Loading table data...</span>
    </div>
  );
};

SkeletonTable.displayName = 'SkeletonTable';
