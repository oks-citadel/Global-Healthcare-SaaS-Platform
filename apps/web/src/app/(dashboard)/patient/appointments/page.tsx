'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMyAppointments } from '@/hooks/usePatient';
import { AppointmentCard } from '@/components/patient/AppointmentCard';
import { Appointment } from '@/types';

type AppointmentStatus = 'all' | 'scheduled' | 'completed' | 'cancelled';

export default function AppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus>('all');
  const { data: appointments, isLoading, error } = useMyAppointments(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

  const statusTabs = [
    { key: 'all' as AppointmentStatus, label: 'All', count: appointments?.length || 0 },
    {
      key: 'scheduled' as AppointmentStatus,
      label: 'Upcoming',
      count: appointments?.filter(a => a.status === 'scheduled').length || 0
    },
    {
      key: 'completed' as AppointmentStatus,
      label: 'Past',
      count: appointments?.filter(a => a.status === 'completed').length || 0
    },
    {
      key: 'cancelled' as AppointmentStatus,
      label: 'Cancelled',
      count: appointments?.filter(a => a.status === 'cancelled').length || 0
    },
  ];

  const filteredAppointments = statusFilter === 'all'
    ? appointments
    : appointments?.filter(apt => apt.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">View and manage your healthcare appointments</p>
        </div>
        <Link
          href="/patient/appointments/book"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Book Appointment
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8 px-6" aria-label="Tabs">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  statusFilter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                      statusFilter === tab.key
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Appointments List */}
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-4 text-sm text-gray-600">Failed to load appointments</p>
              <p className="text-xs text-gray-500 mt-1">{(error as Error).message}</p>
            </div>
          ) : filteredAppointments && filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} showActions />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-sm font-medium text-gray-900">No appointments found</h3>
              <p className="mt-2 text-sm text-gray-500">
                {statusFilter === 'all'
                  ? "You haven't booked any appointments yet."
                  : `No ${statusFilter} appointments found.`}
              </p>
              {statusFilter === 'all' && (
                <Link
                  href="/patient/appointments/book"
                  className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Book Your First Appointment
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Need to cancel or reschedule? Please do so at least 24 hours in advance to avoid cancellation fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
