'use client';

import React from 'react';
import { useSystemStats, useSystemHealth, useAuditEvents } from '@/hooks/useAdmin';
import {
  StatsCard,
  SystemHealthIndicator,
  AuditLogTable,
} from '@/components/admin';

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useSystemStats();
  const { data: health, isLoading: healthLoading } = useSystemHealth();
  const { data: auditEvents, isLoading: auditLoading } = useAuditEvents(
    undefined,
    { page: 1, limit: 10 }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Overview of system health, statistics, and recent activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </>
        ) : stats ? (
          <>
            <StatsCard
              title="Total Users"
              value={stats.totalUsers.toLocaleString()}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
              trend={{
                value: stats.newUsersThisWeek,
                isPositive: true,
              }}
              description={`${stats.newUsersToday} new today`}
            />

            <StatsCard
              title="Active Users"
              value={stats.activeUsers.toLocaleString()}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              description={`${stats.totalPatients} patients, ${stats.totalProviders} providers`}
            />

            <StatsCard
              title="Appointments"
              value={stats.totalAppointments.toLocaleString()}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              description="Total scheduled"
            />

            <StatsCard
              title="Monthly Revenue"
              value={`$${stats.revenue.month.toLocaleString()}`}
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              description={`${stats.activeSubscriptions} active subscriptions`}
            />
          </>
        ) : null}
      </div>

      {/* System Health and User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="lg:col-span-1">
          {healthLoading ? (
            <div className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : health ? (
            <SystemHealthIndicator health={health} />
          ) : null}
        </div>

        {/* User Distribution */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              User Distribution
            </h3>
            {statsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : stats ? (
              <div className="space-y-4">
                {/* Patients */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Patients
                    </span>
                    <span className="text-sm text-gray-600">
                      {stats.totalPatients} (
                      {((stats.totalPatients / stats.totalUsers) * 100).toFixed(
                        1
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{
                        width: `${
                          (stats.totalPatients / stats.totalUsers) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Providers */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Providers
                    </span>
                    <span className="text-sm text-gray-600">
                      {stats.totalProviders} (
                      {((stats.totalProviders / stats.totalUsers) * 100).toFixed(
                        1
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{
                        width: `${
                          (stats.totalProviders / stats.totalUsers) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Admins */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Admins
                    </span>
                    <span className="text-sm text-gray-600">
                      {stats.totalAdmins} (
                      {((stats.totalAdmins / stats.totalUsers) * 100).toFixed(
                        1
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-3 rounded-full"
                      style={{
                        width: `${
                          (stats.totalAdmins / stats.totalUsers) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Active vs Total */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Active Users
                    </span>
                    <span className="text-sm text-gray-600">
                      {stats.activeUsers} / {stats.totalUsers} (
                      {((stats.activeUsers / stats.totalUsers) * 100).toFixed(
                        1
                      )}
                      %)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-indigo-500 h-3 rounded-full"
                      style={{
                        width: `${
                          (stats.activeUsers / stats.totalUsers) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Recent Audit Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
          <a
            href="/admin/audit"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </a>
        </div>
        <AuditLogTable
          events={auditEvents?.data || []}
          isLoading={auditLoading}
        />
      </div>
    </div>
  );
}
