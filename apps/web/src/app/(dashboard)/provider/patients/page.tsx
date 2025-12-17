'use client';

import React, { useState } from 'react';
import { useProviderPatients } from '@/hooks/useProvider';
import PatientCard from '@/components/provider/PatientCard';
import { PatientsListParams } from '@/types/provider';

export default function PatientsListPage() {
  const [params, setParams] = useState<PatientsListParams>({
    page: 1,
    limit: 12,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useProviderPatients(params);

  const patients = data?.data || [];
  const totalPages = data?.totalPages || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((prev) => ({
      ...prev,
      search: searchQuery,
      page: 1,
    }));
  };

  const handleSortChange = (sortBy: PatientsListParams['sortBy']) => {
    setParams((prev) => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your patient records and information
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search patients
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>

        {/* Sort Options */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <button
            onClick={() => handleSortChange('name')}
            className={`text-sm font-medium ${
              params.sortBy === 'name'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Name {params.sortBy === 'name' && (params.sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => handleSortChange('lastVisit')}
            className={`text-sm font-medium ${
              params.sortBy === 'lastVisit'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Last Visit {params.sortBy === 'lastVisit' && (params.sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={() => handleSortChange('totalVisits')}
            className={`text-sm font-medium ${
              params.sortBy === 'totalVisits'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Total Visits {params.sortBy === 'totalVisits' && (params.sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Results Summary */}
      {data && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {(params.page! - 1) * params.limit! + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(params.page! * params.limit!, data.total)}
            </span>{' '}
            of <span className="font-medium">{data.total}</span> results
          </p>
        </div>
      )}

      {/* Patients Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading patients</h3>
              <p className="mt-1 text-sm text-red-700">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'Get started by adding your first patient'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(params.page! - 1)}
              disabled={params.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(params.page! + 1)}
              disabled={params.page === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{params.page}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => handlePageChange(params.page! - 1)}
                  disabled={params.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (params.page! <= 3) {
                    pageNum = i + 1;
                  } else if (params.page! >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = params.page! - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        params.page === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(params.page! + 1)}
                  disabled={params.page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
