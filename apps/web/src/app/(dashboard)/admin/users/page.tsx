'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUsers, useToggleUserStatus } from '@/hooks/useAdmin';
import { UserTable } from '@/components/admin';
import { AdminUser, UserFilters } from '@/types/admin';

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useUsers(filters, { page, limit: 10 });
  const toggleStatus = useToggleUserStatus();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    setPage(1);
  };

  const handleRoleFilter = (role: UserFilters['role']) => {
    setFilters((prev) => ({
      ...prev,
      role: role === filters.role ? undefined : role,
    }));
    setPage(1);
  };

  const handleStatusFilter = (status: UserFilters['status']) => {
    setFilters((prev) => ({
      ...prev,
      status: status === filters.status ? undefined : status,
    }));
    setPage(1);
  };

  const handleUserClick = (user: AdminUser) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleStatusToggle = (
    userId: string,
    status: 'active' | 'inactive' | 'suspended'
  ) => {
    toggleStatus.mutate({ id: userId, status });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-2">
          Manage users, roles, and account statuses
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
            {filters.search && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilters((prev) => ({ ...prev, search: undefined }));
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </form>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Role Filters */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Role:</span>
              <button
                onClick={() => handleRoleFilter('patient')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.role === 'patient'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => handleRoleFilter('doctor')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.role === 'doctor'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                Provider
              </button>
              <button
                onClick={() => handleRoleFilter('admin')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.role === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <button
                onClick={() => handleStatusFilter('active')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.status === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusFilter('inactive')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.status === 'inactive'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Inactive
              </button>
              <button
                onClick={() => handleStatusFilter('suspended')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.status === 'suspended'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                Suspended
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <UserTable
        users={data?.data || []}
        onUserClick={handleUserClick}
        onStatusToggle={handleStatusToggle}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(page - 1) * data.pagination.limit + 1} to{' '}
              {Math.min(page * data.pagination.limit, data.pagination.total)} of{' '}
              {data.pagination.total} users
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
