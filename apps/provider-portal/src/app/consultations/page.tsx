'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { Video, Phone, Mic, MicOff, VideoOff, Monitor, Clock, User, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Appointment, AppointmentFilters } from '@/types';
import { appointmentsApi } from '@/lib/api';

export default function ConsultationsPage() {
  const [activeSession, setActiveSession] = useState<string | null>(null);

  // API state
  const [upcomingSessions, setUpcomingSessions] = useState<Appointment[]>([]);
  const [pastSessions, setPastSessions] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    todayCount: 0,
    weekCompletedCount: 0,
    avgSessionTime: 0,
  });

  const fetchConsultations = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch today's telehealth appointments
      const today = format(new Date(), 'yyyy-MM-dd');
      const upcomingFilters: AppointmentFilters = {
        type: 'telehealth',
        startDate: today,
        status: 'scheduled',
      };

      const pastFilters: AppointmentFilters = {
        type: 'telehealth',
        status: 'completed',
      };

      // Fetch both upcoming and past sessions in parallel
      const [upcomingResponse, pastResponse] = await Promise.all([
        appointmentsApi.getAppointments(1, 20, upcomingFilters),
        appointmentsApi.getAppointments(1, 10, pastFilters),
      ]);

      // Filter upcoming to only today's sessions that are in the future
      const now = new Date();
      const upcoming = upcomingResponse.data.filter((apt) => {
        const aptTime = new Date(apt.startTime);
        return aptTime > now;
      });

      setUpcomingSessions(upcoming);
      setPastSessions(pastResponse.data);

      // Calculate stats
      const todaysTelehealth = upcomingResponse.data.filter((apt) => {
        const aptDate = apt.startTime.split('T')[0];
        return aptDate === today;
      });

      const avgDuration = pastResponse.data.length > 0
        ? pastResponse.data.reduce((sum, apt) => sum + apt.duration, 0) / pastResponse.data.length
        : 0;

      setStats({
        todayCount: todaysTelehealth.length,
        weekCompletedCount: pastResponse.data.length,
        avgSessionTime: Math.round(avgDuration),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load consultations');
      console.error('Error fetching consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleRetry = () => {
    fetchConsultations();
  };

  const getTimeUntilSession = (startTime: string) => {
    const now = new Date();
    const sessionTime = new Date(startTime);
    const diffMs = sessionTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 0) return 'Started';
    if (diffMins < 60) return `${diffMins} min`;
    return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
  };

  const VideoCallInterface = ({ sessionId }: { sessionId: string }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const session = upcomingSessions.find((s) => s.id === sessionId);
    const patientName = session?.patient
      ? `${session.patient.firstName} ${session.patient.lastName}`
      : 'Patient';

    return (
      <div className="fixed inset-0 bg-gray-900 z-50">
        {/* Video Area */}
        <div className="h-screen flex flex-col">
          {/* Main Video */}
          <div className="flex-1 relative bg-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="h-32 w-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-white text-xl">{patientName}</p>
                <p className="text-gray-400 mt-2">Connecting...</p>
              </div>
            </div>

            {/* Self Video */}
            <div className="absolute bottom-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-white text-sm">You</p>
                </div>
              </div>
            </div>

            {/* Call Info */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2 text-white">
                <Clock className="h-4 w-4" />
                <span className="text-sm">00:00:00</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 p-6">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-colors ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isMuted ? (
                  <MicOff className="h-6 w-6 text-white" />
                ) : (
                  <Mic className="h-6 w-6 text-white" />
                )}
              </button>

              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-4 rounded-full transition-colors ${
                  isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {isVideoOff ? (
                  <VideoOff className="h-6 w-6 text-white" />
                ) : (
                  <Video className="h-6 w-6 text-white" />
                )}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-4 rounded-full transition-colors ${
                  isScreenSharing ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <Monitor className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={() => setActiveSession(null)}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
              >
                <Phone className="h-6 w-6 text-white transform rotate-135" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                {isMuted && 'Microphone is muted'}
                {isMuted && isVideoOff && ' | '}
                {isVideoOff && 'Camera is off'}
                {(isMuted || isVideoOff) && isScreenSharing && ' | '}
                {isScreenSharing && 'Screen is being shared'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (activeSession) {
    return <VideoCallInterface sessionId={activeSession} />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Telehealth Consultations</h1>
          <p className="text-gray-600 mt-1">Manage your virtual appointments</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600">Loading consultations...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Consultations</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Sessions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stats.todayCount}
                    </p>
                  </div>
                  <Video className="h-8 w-8 text-primary-600" />
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed This Week</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.weekCompletedCount}</p>
                  </div>
                  <Badge variant="success" className="text-lg px-3 py-1">
                    +{pastSessions.length > 0 ? pastSessions.length : 0}
                  </Badge>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Session Time</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.avgSessionTime}m</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </Card>
            </div>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <Video className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {session.patient
                              ? `${session.patient.firstName} ${session.patient.lastName}`
                              : 'Patient'}
                          </h3>
                          <p className="text-sm text-gray-600">{session.reason}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {format(new Date(session.startTime), 'h:mm a')} ({session.duration} min)
                            </div>
                            <Badge variant="info" size="sm">
                              Starts in {getTimeUntilSession(session.startTime)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setActiveSession(session.id)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Call
                        </Button>
                      </div>
                    </div>
                  ))}

                  {upcomingSessions.length === 0 && (
                    <div className="text-center py-8">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No upcoming sessions</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Past Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {session.patient
                              ? `${session.patient.firstName} ${session.patient.lastName}`
                              : 'Patient'}
                          </h3>
                          <p className="text-sm text-gray-600">{session.reason}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {format(new Date(session.startTime), 'MMM d, h:mm a')} - {session.duration} min
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="success">Completed</Badge>
                        <Button variant="outline" size="sm">
                          View Notes
                        </Button>
                      </div>
                    </div>
                  ))}

                  {pastSessions.length === 0 && (
                    <div className="text-center py-8">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No past sessions</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Test Connection */}
            <Card>
              <CardHeader>
                <CardTitle>Connection Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Test Your Equipment</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Make sure your camera and microphone are working properly
                    </p>
                  </div>
                  <Button variant="outline">Test Connection</Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
