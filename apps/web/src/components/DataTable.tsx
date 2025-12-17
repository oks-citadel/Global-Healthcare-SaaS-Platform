'use client';

import React, { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { VisuallyHidden } from './a11y/VisuallyHidden';
import { useId } from '../hooks/useA11y';

interface Column<T> {
  id: string;
  header: string;
  accessorKey: keyof T;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  scope?: 'col' | 'row';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  emptyMessage?: string;
  sortable?: boolean;
  paginated?: boolean;
  pageSize?: number;
}

type SortDirection = 'asc' | 'desc' | null;

/**
 * DataTable Component
 *
 * Accessible data table with proper semantic HTML, ARIA attributes,
 * and keyboard navigation support.
 *
 * WCAG 2.1 Success Criteria:
 * - 1.3.1 Info and Relationships (Level A)
 * - 2.1.1 Keyboard (Level A)
 * - 2.4.6 Headings and Labels (Level AA)
 * - 4.1.2 Name, Role, Value (Level A)
 *
 * Features:
 * - Proper table structure with caption and headers
 * - Column headers with scope attributes
 * - Row headers where appropriate
 * - Sortable columns with ARIA sort attributes
 * - Keyboard navigation for sortable headers
 * - Screen reader announcements for sort changes
 *
 * @example
 * ```tsx
 * <DataTable
 *   caption="Patient Appointments"
 *   data={appointments}
 *   columns={[
 *     { id: 'name', header: 'Patient Name', accessorKey: 'patientName', scope: 'row' },
 *     { id: 'date', header: 'Date', accessorKey: 'date', sortable: true },
 *     { id: 'time', header: 'Time', accessorKey: 'time' },
 *   ]}
 * />
 * ```
 */
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  caption,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  striped = true,
  hoverable = true,
  className,
  emptyMessage = 'No data available',
  sortable = true,
  paginated = false,
  pageSize = 10,
}: DataTableProps<T>) {
  const tableId = useId('table');
  const captionId = useId('caption');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const column = columns.find((col) => col.id === sortColumn);
      if (!column) return 0;

      const aValue = a[column.accessorKey];
      const bValue = b[column.accessorKey];

      if (aValue === bValue) return 0;

      const comparison = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, columns, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, paginated, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sort
  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable && !sortable) return;

    if (sortColumn === columnId) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Get ARIA sort value
  const getAriaSort = (columnId: string): 'ascending' | 'descending' | 'none' => {
    if (sortColumn !== columnId) return 'none';
    if (sortDirection === 'asc') return 'ascending';
    if (sortDirection === 'desc') return 'descending';
    return 'none';
  };

  return (
    <div className={clsx('w-full overflow-x-auto', className)}>
      <table
        id={tableId}
        className="w-full border-collapse"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby || (caption ? captionId : undefined)}
      >
        {caption && (
          <caption
            id={captionId}
            className="text-left text-lg font-semibold text-gray-900 dark:text-white mb-4 px-2"
          >
            {caption}
          </caption>
        )}

        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => {
              const isSortable = column.sortable ?? sortable;
              const isSorted = sortColumn === column.id;

              return (
                <th
                  key={column.id}
                  scope={column.scope || 'col'}
                  aria-sort={isSortable ? getAriaSort(column.id) : undefined}
                  className={clsx(
                    'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider',
                    'text-gray-700 dark:text-gray-300',
                    'border-b-2 border-gray-200 dark:border-gray-700',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    isSortable && 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                  {...(isSortable && {
                    onClick: () => handleSort(column.id),
                    onKeyDown: (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSort(column.id);
                      }
                    },
                    tabIndex: 0,
                    role: 'button',
                  })}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {isSortable && (
                      <span aria-hidden="true" className="text-gray-400">
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <span>↑</span>
                          ) : (
                            <span>↓</span>
                          )
                        ) : (
                          <span className="opacity-50">↕</span>
                        )}
                      </span>
                    )}
                    {isSortable && (
                      <VisuallyHidden>
                        {isSorted
                          ? `Sorted ${sortDirection === 'asc' ? 'ascending' : 'descending'}`
                          : 'Not sorted. Activate to sort.'}
                      </VisuallyHidden>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={clsx(
                  hoverable && 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  striped && rowIndex % 2 === 1 && 'bg-gray-50 dark:bg-gray-850'
                )}
              >
                {columns.map((column) => {
                  const value = row[column.accessorKey];
                  const cellContent = column.cell ? column.cell(value, row) : value;
                  const Tag = column.scope === 'row' ? 'th' : 'td';

                  return (
                    <Tag
                      key={column.id}
                      {...(column.scope === 'row' && { scope: 'row' })}
                      className={clsx(
                        'px-6 py-4 text-sm',
                        column.scope === 'row'
                          ? 'font-medium text-gray-900 dark:text-white'
                          : 'text-gray-700 dark:text-gray-300',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {cellContent}
                    </Tag>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {paginated && totalPages > 1 && (
        <nav
          aria-label="Table pagination"
          className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <VisuallyHidden>
              {sortedData.length} total {sortedData.length === 1 ? 'row' : 'rows'}
            </VisuallyHidden>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
              className={clsx(
                'px-3 py-1 rounded border',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              Previous
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Go to next page"
              className={clsx(
                'px-3 py-1 rounded border',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default DataTable;
