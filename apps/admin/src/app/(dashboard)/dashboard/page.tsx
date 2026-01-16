'use client'

import { useQuery } from '@tanstack/react-query'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { dashboardApi } from '@/lib/api'
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const response = await dashboardApi.getMetrics()
      return response.data
    },
  })

  const { data: chartData } = useQuery({
    queryKey: ['dashboard-charts', '30d'],
    queryFn: async () => {
      const response = await dashboardApi.getChartData('30d')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your healthcare platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={metrics?.totalUsers || 0}
          description="from last month"
          icon={Users}
          trend={{
            value: metrics?.userGrowth || 0,
            isPositive: (metrics?.userGrowth || 0) > 0,
          }}
        />
        <StatCard
          title="Active Providers"
          value={metrics?.activeProviders || 0}
          description="verified providers"
          icon={Stethoscope}
          trend={{
            value: metrics?.providerGrowth || 0,
            isPositive: (metrics?.providerGrowth || 0) > 0,
          }}
        />
        <StatCard
          title="Appointments"
          value={metrics?.totalAppointments || 0}
          description="this month"
          icon={Calendar}
          trend={{
            value: metrics?.appointmentGrowth || 0,
            isPositive: (metrics?.appointmentGrowth || 0) > 0,
          }}
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(metrics?.revenue || 0)}
          description="this month"
          icon={DollarSign}
          trend={{
            value: metrics?.revenueGrowth || 0,
            isPositive: (metrics?.revenueGrowth || 0) > 0,
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData?.userGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.revenue || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.appointments || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics?.recentActivity?.map((activity: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-4 border-b pb-4 last:border-0"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    {activity.type === 'user' && <Users className="h-4 w-4" />}
                    {activity.type === 'appointment' && (
                      <Calendar className="h-4 w-4" />
                    )}
                    {activity.type === 'provider' && (
                      <Stethoscope className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
