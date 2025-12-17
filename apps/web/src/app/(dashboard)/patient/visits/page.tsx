'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { VisitCard } from '@/components/patient/VisitCard';
import { Visit } from '@/types';

export default function VisitsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  const { data: visits, isLoading, error } = useQuery<Visit[]>({
    queryKey: ['patient-visits', statusFilter],
    queryFn: async () => {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await apiClient.get('/patient/visits', { params });
      return response.data;
    },
  });

  const filteredVisits = statusFilter === 'all'
    ? visits
    : visits?.filter(visit => visit.status === statusFilter);

  const activeVisit = visits?.find(v => v.status === 'in-progress');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Virtual Visits</h1>
        <p className="text-gray-600 mt-1">Join video consultations and view visit history</p>
      </div>

      {/* Active Visit Alert */}
      {activeVisit && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Visit in Progress</h3>
                <p className="text-gray-700 mt-1">
                  Your visit with Dr. {activeVisit.doctorName} is ready
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Started: {new Date(activeVisit.visitDate).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => window.open(activeVisit.roomUrl, '_blank')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
            >
              Join Visit Now
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8 px-6" aria-label="Tabs">
            {['all', 'scheduled', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  statusFilter === status
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status === 'all' ? 'All Visits' : status === 'scheduled' ? 'Upcoming' : 'Past Visits'}
              </button>
            ))}
          </nav>
        </div>

        {/* Visits List */}
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-sm text-gray-600">Failed to load visits</p>
              <p className="text-xs text-gray-500 mt-1">{(error as Error).message}</p>
            </div>
          ) : filteredVisits && filteredVisits.length > 0 ? (
            <div className="space-y-4">
              {filteredVisits.map((visit) => (
                <VisitCard key={visit.id} visit={visit} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-gray-900">No visits found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {statusFilter === 'all'
                  ? "You haven't had any virtual visits yet."
                  : `No ${statusFilter} visits found.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Before Your Visit</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>Test your camera and microphone</li>
                <li>Find a quiet, well-lit space</li>
                <li>Have your insurance card ready</li>
                <li>Prepare a list of symptoms or questions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Technical Support</h3>
              <p className="text-sm text-gray-700">
                Having trouble connecting? Our technical support team is available 24/7 to help you.
              </p>
              <button className="mt-3 text-sm text-green-700 font-medium hover:text-green-800">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
