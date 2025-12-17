'use client';

import React, { useState } from 'react';
import { useAuditEvents, useExportAuditEvents } from '@/hooks/useAdmin';
import { AuditLogTable } from '@/components/admin';
import { AuditFilters, AuditAction } from '@/types/admin';

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AuditFilters>({});
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const { data, isLoading } = useAuditEvents(filters, { page, limit: 20 });
  const exportEvents = useExportAuditEvents();

  const actionTypes: AuditAction[] = [
    'user.created',
    'user.updated',
    'user.deleted',
    'user.login',
    'user.logout',
    'appointment.created',
    'appointment.updated',
    'appointment.cancelled',
    'subscription.created',
    'subscription.cancelled',
    'settings.updated',
  ];

  const handleActionFilter = (action: AuditAction) => {
    setFilters((prev) => ({
      ...prev,
      action: action === filters.action ? undefined : action,
    }));
    setPage(1);
  };

  const handleStatusFilter = (status: 'success' | 'failure') => {
    setFilters((prev) => ({
      ...prev,
      status: status === filters.status ? undefined : status,
    }));
    setPage(1);
  };

  const handleDateFilter = () => {
    setFilters((prev) => ({
      ...prev,
      startDate: dateRange.startDate || undefined,
      endDate: dateRange.endDate || undefined,
    }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setDateRange({ startDate: '', endDate: '' });
    setPage(1);
  };

  const handleExport = async () => {
    try {
      const blob = await exportEvents.mutateAsync(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-log-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export audit events:', error);
    }
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key as keyof AuditFilters] !== undefined
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-500 mt-2">
            View and filter system activity logs
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exportEvents.isPending}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {exportEvents.isPending ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleDateFilter}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Date Filter
              </button>
            </div>
          </div>

          {/* Action Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Type
            </label>
            <div className="flex flex-wrap gap-2">
              {actionTypes.map((action) => (
                <button
                  key={action}
                  onClick={() => handleActionFilter(action)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filters.action === action
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusFilter('success')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.status === 'success'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Success
              </button>
              <button
                onClick={() => handleStatusFilter('failure')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filters.status === 'failure'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                Failure
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-blue-900">
                Active Filters:
              </span>
              {filters.action && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  Action: {filters.action}
                </span>
              )}
              {filters.status && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  Status: {filters.status}
                </span>
              )}
              {filters.startDate && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  From: {new Date(filters.startDate).toLocaleDateString()}
                </span>
              )}
              {filters.endDate && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  To: {new Date(filters.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Table */}
      <AuditLogTable events={data?.data || []} isLoading={isLoading} />

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * data.pagination.limit + 1} to{' '}
              {Math.min(page * data.pagination.limit, data.pagination.total)} of{' '}
              {data.pagination.total} events
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!data.pagination.hasPrev}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, data.pagination.totalPages) },
                  (_, i) => {
                    const pageNum =
                      page <= 3
                        ? i + 1
                        : page >= data.pagination.totalPages - 2
                        ? data.pagination.totalPages - 4 + i
                        : page - 2 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
              </div>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.pagination.hasNext}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
