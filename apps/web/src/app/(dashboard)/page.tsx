'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import apiClient, { getErrorMessage } from '@/lib/api';
import { DashboardStats, Appointment } from '@/types';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

// API functions
const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  getUpcomingAppointments: async (): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>('/appointments', {
      params: {
        status: 'scheduled',
        limit: 5,
        sortBy: 'dateTime',
        sortOrder: 'asc',
      },
    });
    return response.data;
  },
};

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardApi.getStats,
  });

  const { data: upcomingAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: dashboardApi.getUpcomingAppointments,
  });

  const statCards = [
    {
      title: 'Upcoming Appointments',
      value: stats?.upcomingAppointments || 0,
      icon: '📅',
      color: 'bg-blue-50 text-blue-600',
      link: '/appointments',
    },
    {
      title: 'Total Appointments',
      value: stats?.totalAppointments || 0,
      icon: '📊',
      color: 'bg-green-50 text-green-600',
      link: '/appointments',
    },
    {
      title: 'Pending Results',
      value: stats?.pendingResults || 0,
      icon: '🔬',
      color: 'bg-yellow-50 text-yellow-600',
      link: '/lab-results',
    },
    {
      title: 'Unread Messages',
      value: stats?.unreadMessages || 0,
      icon: '💬',
      color: 'bg-purple-50 text-purple-600',
      link: '/messages',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your healthcare journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.link}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {statsLoading ? (
                    <span className="inline-block animate-pulse bg-gray-200 h-8 w-16 rounded"></span>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className={`text-4xl ${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Upcoming Appointments
            </h2>
            <Link
              href="/appointments"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
        </div>

        <div className="p-6">
          {appointmentsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 h-24 rounded-lg"
                ></div>
              ))}
            </div>
          ) : upcomingAppointments && upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">👨‍⚕️</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Dr. {appointment.doctorName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {appointment.specialty}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDateTime(appointment.dateTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.type === 'video'
                            ? 'bg-purple-100 text-purple-800'
                            : appointment.type === 'phone'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {appointment.type}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {appointment.duration} min
                      </p>
                    </div>
                    <Link
                      href={`/appointments/${appointment.id}`}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No upcoming appointments
              </h3>
              <p className="text-gray-500 mb-4">
                Schedule an appointment with a healthcare provider
              </p>
              <Link
                href="/appointments/book"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/appointments/book"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Book Appointment
              </h3>
              <p className="text-sm text-gray-500">
                Schedule a consultation
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/prescriptions"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💊</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Prescriptions
              </h3>
              <p className="text-sm text-gray-500">
                Manage medications
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/records"
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Medical Records
              </h3>
              <p className="text-sm text-gray-500">
                View health history
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
