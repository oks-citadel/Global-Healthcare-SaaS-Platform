'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { Calendar, Users, Clock, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const today = format(new Date(), 'EEEE, MMMM d, yyyy');

  const stats = [
    {
      title: 'Today\'s Appointments',
      value: '12',
      change: '+2 from yesterday',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Patients',
      value: '284',
      change: '+18 this month',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Lab Results',
      value: '7',
      change: 'Requires review',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Avg. Consultation Time',
      value: '24 min',
      change: '-3 min from last week',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const upcomingAppointments = [
    {
      id: '1',
      time: '09:00 AM',
      patient: 'John Smith',
      type: 'Follow-up',
      status: 'confirmed',
    },
    {
      id: '2',
      time: '09:30 AM',
      patient: 'Sarah Johnson',
      type: 'New Patient',
      status: 'confirmed',
    },
    {
      id: '3',
      time: '10:00 AM',
      patient: 'Michael Brown',
      type: 'Telehealth',
      status: 'pending',
    },
    {
      id: '4',
      time: '11:00 AM',
      patient: 'Emily Davis',
      type: 'Annual Check-up',
      status: 'confirmed',
    },
  ];

  const recentActivities = [
    {
      id: '1',
      action: 'Prescription sent',
      patient: 'John Smith',
      time: '5 minutes ago',
    },
    {
      id: '2',
      action: 'Lab results reviewed',
      patient: 'Sarah Johnson',
      time: '15 minutes ago',
    },
    {
      id: '3',
      action: 'Clinical note signed',
      patient: 'Michael Brown',
      time: '1 hour ago',
    },
    {
      id: '4',
      action: 'Appointment scheduled',
      patient: 'Emily Davis',
      time: '2 hours ago',
    },
  ];

  const alerts = [
    {
      id: '1',
      type: 'critical',
      message: 'Critical lab result for Patient #2847',
      time: '10 minutes ago',
    },
    {
      id: '2',
      type: 'warning',
      message: 'Missing documentation for 3 appointments',
      time: '1 hour ago',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">{today}</p>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border ${
                  alert.type === 'critical'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <AlertCircle
                  className={`h-5 w-5 mt-0.5 ${
                    alert.type === 'critical' ? 'text-red-600' : 'text-yellow-600'
                  }`}
                />
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      alert.type === 'critical' ? 'text-red-900' : 'text-yellow-900'
                    }`}
                  >
                    {alert.message}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      alert.type === 'critical' ? 'text-red-700' : 'text-yellow-700'
                    }`}
                  >
                    {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-900">{appointment.time}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient}</p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                    </div>
                    <Badge variant={appointment.status === 'confirmed' ? 'success' : 'warning'}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all appointments
              </button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="h-2 w-2 bg-primary-600 rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.patient}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
                View all activity
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium text-gray-900">New Appointment</p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium text-gray-900">Add Patient</p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium text-gray-900">New Prescription</p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium text-gray-900">Order Labs</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
