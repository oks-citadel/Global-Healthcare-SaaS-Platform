'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Appointment } from '@/types';
import { formatDateTime, cn } from '@/lib/utils';
import Link from 'next/link';

// API functions
const appointmentsApi = {
  getAppointments: async (status?: string): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>('/appointments', {
      params: status ? { status } : {},
    });
    return response.data;
  },
};

type FilterStatus = 'all' | 'scheduled' | 'completed' | 'cancelled';

export default function AppointmentsPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', filterStatus],
    queryFn: () =>
      appointmentsApi.getAppointments(
        filterStatus === 'all' ? undefined : filterStatus
      ),
  });

  const filters: { label: string; value: FilterStatus }[] = [
    { label: 'All', value: 'all' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '📹';
      case 'phone':
        return '📞';
      case 'in-person':
        return '🏥';
      default:
        return '📅';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-2 text-gray-600">
            Manage your healthcare appointments
          </p>
        </div>
        <Link
          href="/appointments/book"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Book Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filterStatus === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 h-32 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        ) : appointments && appointments.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-3xl">👨‍⚕️</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          Dr. {appointment.doctorName}
                        </h3>
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getStatusColor(appointment.status)
                          )}
                        >
                          {appointment.status}
                        </span>
                        <span className="text-2xl">
                          {getTypeIcon(appointment.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {appointment.specialty}
                      </p>
                      <p className="text-sm text-gray-900 font-medium mb-1">
                        {formatDateTime(appointment.dateTime)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Duration: {appointment.duration} minutes
                      </p>
                      {appointment.reason && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Reason:</span>{' '}
                          {appointment.reason}
                        </p>
                      )}
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Notes:</span>{' '}
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/appointments/${appointment.id}`}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      View Details
                    </Link>
                    {appointment.status === 'scheduled' && (
                      <button className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-500 border border-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-500 mb-6">
              {filterStatus === 'all'
                ? "You don't have any appointments yet"
                : `No ${filterStatus} appointments`}
            </p>
            <Link
              href="/appointments/book"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Book Your First Appointment
            </Link>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {appointments && appointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {appointments.length}
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {
                    appointments.filter((a) => a.status === 'scheduled')
                      .length
                  }
                </p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {
                    appointments.filter((a) => a.status === 'completed')
                      .length
                  }
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
