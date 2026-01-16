'use client';

import Link from 'next/link';
import { useMyAppointments, useMyDocuments, useMyProfile } from '@/hooks/usePatient';
import { AppointmentCard } from '@/components/patient/AppointmentCard';
import { HealthSummary } from '@/components/patient/HealthSummary';

export default function PatientDashboard() {
  const { data: appointments, isLoading: appointmentsLoading } = useMyAppointments({ status: 'scheduled' });
  const { data: documents, isLoading: documentsLoading } = useMyDocuments();
  const { data: profile } = useMyProfile();

  const upcomingAppointments = appointments?.filter(apt => new Date(apt.dateTime) > new Date()).slice(0, 3) || [];
  const recentDocuments = documents?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-uh-slate-900">Dashboard</h1>
        <p className="text-sm text-uh-slate-500 mt-1">Welcome back! Here's your health overview.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/patient/appointments/book"
          className="group flex items-center justify-between p-6 bg-gradient-to-r from-uh-teal to-uh-cyan text-uh-dark rounded-2xl hover:shadow-glow-teal transition-all duration-300"
        >
          <div>
            <h3 className="text-lg font-semibold">Book Appointment</h3>
            <p className="text-uh-dark/70 text-sm mt-1">Schedule a visit with a provider</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </Link>

        <Link
          href="/patient/visits"
          className="group flex items-center justify-between p-6 bg-gradient-to-r from-uh-indigo to-uh-cyan text-white rounded-2xl hover:shadow-glow-indigo transition-all duration-300"
        >
          <div>
            <h3 className="text-lg font-semibold">Virtual Visit</h3>
            <p className="text-white/70 text-sm mt-1">Start or join a video consultation</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl border border-uh-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-uh-slate-900">Upcoming Appointments</h2>
              <Link
                href="/patient/appointments"
                className="text-sm text-uh-teal hover:text-uh-teal-600 font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            {appointmentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-uh-slate-100 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-uh-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-uh-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-uh-slate-500 mb-4">No upcoming appointments</p>
                <Link
                  href="/patient/appointments/book"
                  className="inline-flex items-center gap-2 text-uh-teal hover:text-uh-teal-600 font-medium transition-colors"
                >
                  Book your first appointment
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Documents */}
          <div className="bg-white rounded-2xl border border-uh-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-uh-slate-900">Recent Documents</h2>
              <Link
                href="/patient/documents"
                className="text-sm text-uh-teal hover:text-uh-teal-600 font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            {documentsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-uh-slate-100 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : recentDocuments.length > 0 ? (
              <div className="space-y-3">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-uh-slate-200 rounded-xl hover:border-uh-teal/30 hover:bg-uh-slate-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-uh-teal/10 rounded-lg group-hover:bg-uh-teal/20 transition-colors">
                        <svg className="w-5 h-5 text-uh-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-uh-slate-900 text-sm">{doc.name}</p>
                        <p className="text-xs text-uh-slate-500">
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium text-uh-teal bg-uh-teal/10 rounded-full">
                      {doc.type}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-uh-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-uh-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-uh-slate-500">No documents yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Health Summary */}
          <HealthSummary profile={profile} />

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-uh-slate-200 p-6">
            <h3 className="text-lg font-semibold text-uh-slate-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-uh-slate-500">Total Appointments</span>
                <span className="font-semibold text-uh-slate-900">{appointments?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-uh-slate-500">Documents</span>
                <span className="font-semibold text-uh-slate-900">{documents?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-uh-slate-500">Upcoming Visits</span>
                <span className="font-semibold text-uh-teal">{upcomingAppointments.length}</span>
              </div>
            </div>
          </div>

          {/* Health Tips */}
          <div className="bg-gradient-to-br from-uh-teal/5 to-uh-cyan/5 rounded-2xl border border-uh-teal/10 p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-uh-teal rounded-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-uh-slate-900 mb-2">Health Tip</h4>
                <p className="text-sm text-uh-slate-600">
                  Stay hydrated and maintain regular sleep schedules for better overall health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
