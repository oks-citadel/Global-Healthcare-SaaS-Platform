'use client'

import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { reportsApi } from '@/lib/api'
import { ExportDialog } from '@/components/export-dialog'
import { BatchExportDialog } from '@/components/batch-export-dialog'
import { ReportType } from '@/lib/export'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Download, Loader2, FileDown } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

// Period display labels
const PERIOD_LABELS: Record<string, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  '1y': 'Last year',
}

export default function ReportsPage() {
  const [period, setPeriod] = useState('30d')
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [batchExportDialogOpen, setBatchExportDialogOpen] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null)

  const { data: userStats, isLoading: isLoadingUserStats } = useQuery({
    queryKey: ['user-stats', period],
    queryFn: async () => {
      const response = await reportsApi.getUserStats({ period })
      return response.data
    },
  })

  const { data: providerStats, isLoading: isLoadingProviderStats } = useQuery({
    queryKey: ['provider-stats', period],
    queryFn: async () => {
      const response = await reportsApi.getProviderStats({ period })
      return response.data
    },
  })

  const { data: revenueReport, isLoading: isLoadingRevenueReport } = useQuery({
    queryKey: ['revenue-report', period],
    queryFn: async () => {
      const response = await reportsApi.getRevenueReport({ period })
      return response.data
    },
  })

  const { data: appointmentStats, isLoading: isLoadingAppointmentStats } = useQuery({
    queryKey: ['appointment-stats', period],
    queryFn: async () => {
      const response = await reportsApi.getAppointmentStats({ period })
      return response.data
    },
  })

  // Get the appropriate data for the selected report type
  const getReportData = useCallback((reportType: ReportType): unknown => {
    switch (reportType) {
      case 'user-stats':
      case 'user-distribution':
        return userStats
      case 'revenue-category':
      case 'revenue-trend':
        return revenueReport
      case 'appointment-status':
        return appointmentStats
      case 'provider-performance':
        return providerStats
      default:
        return null
    }
  }, [userStats, revenueReport, appointmentStats, providerStats])

  // Check if a report is loading
  const isReportLoading = useCallback((reportType: ReportType): boolean => {
    switch (reportType) {
      case 'user-stats':
      case 'user-distribution':
        return isLoadingUserStats
      case 'revenue-category':
      case 'revenue-trend':
        return isLoadingRevenueReport
      case 'appointment-status':
        return isLoadingAppointmentStats
      case 'provider-performance':
        return isLoadingProviderStats
      default:
        return false
    }
  }, [isLoadingUserStats, isLoadingRevenueReport, isLoadingAppointmentStats, isLoadingProviderStats])

  // Check if a report has data
  const hasReportData = useCallback((reportType: ReportType): boolean => {
    const data = getReportData(reportType)
    if (!data) return false

    switch (reportType) {
      case 'user-stats':
        return !!(data as { registrationTrend?: unknown[] })?.registrationTrend?.length
      case 'user-distribution':
        return !!(data as { distribution?: unknown[] })?.distribution?.length
      case 'revenue-category':
        return !!(data as { byCategory?: unknown[] })?.byCategory?.length
      case 'revenue-trend':
        return !!(data as { trend?: unknown[] })?.trend?.length
      case 'appointment-status':
        return !!(data as { byStatus?: unknown[] })?.byStatus?.length
      case 'provider-performance':
        return !!(data as { topProviders?: unknown[] })?.topProviders?.length
      default:
        return false
    }
  }, [getReportData])

  const handleExport = useCallback((reportType: ReportType) => {
    setSelectedReportType(reportType)
    setExportDialogOpen(true)
  }, [])

  const handleDialogClose = useCallback(() => {
    setExportDialogOpen(false)
    // Reset selected report type after dialog closes
    setTimeout(() => setSelectedReportType(null), 200)
  }, [])

  // Export button component for consistency
  const ExportButton = ({ reportType }: { reportType: ReportType }) => {
    const loading = isReportLoading(reportType)
    const hasData = hasReportData(reportType)

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport(reportType)}
        disabled={loading || !hasData}
        title={!hasData ? 'No data available to export' : 'Export this report'}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </Button>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analytics and insights for your platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setBatchExportDialogOpen(true)}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Registration Trend</CardTitle>
            <ExportButton reportType="user-stats" />
          </CardHeader>
          <CardContent>
            {isLoadingUserStats ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userStats?.registrationTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="registrations"
                    stroke="#0088FE"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Types Distribution</CardTitle>
            <ExportButton reportType="user-distribution" />
          </CardHeader>
          <CardContent>
            {isLoadingUserStats ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userStats?.distribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userStats?.distribution?.map((entry: unknown, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue by Category</CardTitle>
            <ExportButton reportType="revenue-category" />
          </CardHeader>
          <CardContent>
            {isLoadingRevenueReport ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueReport?.byCategory || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Appointment Status</CardTitle>
            <ExportButton reportType="appointment-status" />
          </CardHeader>
          <CardContent>
            {isLoadingAppointmentStats ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentStats?.byStatus || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Provider Performance</CardTitle>
            <ExportButton reportType="provider-performance" />
          </CardHeader>
          <CardContent>
            {isLoadingProviderStats ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={providerStats?.topProviders || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="appointments" fill="#8884D8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <ExportButton reportType="revenue-trend" />
          </CardHeader>
          <CardContent>
            {isLoadingRevenueReport ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueReport?.trend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00C49F"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Export Dialog */}
      {selectedReportType && (
        <ExportDialog
          open={exportDialogOpen}
          onOpenChange={handleDialogClose}
          reportType={selectedReportType}
          period={PERIOD_LABELS[period] || period}
          data={getReportData(selectedReportType)}
        />
      )}

      {/* Batch Export Dialog */}
      <BatchExportDialog
        open={batchExportDialogOpen}
        onOpenChange={setBatchExportDialogOpen}
        period={PERIOD_LABELS[period] || period}
        reportData={{
          userStats,
          providerStats,
          revenueReport,
          appointmentStats,
        }}
      />
    </div>
  )
}
