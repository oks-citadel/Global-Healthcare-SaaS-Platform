import { format } from 'date-fns'

// Export format types
export type ExportFormat = 'csv' | 'pdf' | 'excel'

// Report types based on the reports page
export type ReportType =
  | 'user-stats'
  | 'user-distribution'
  | 'revenue-category'
  | 'revenue-trend'
  | 'appointment-status'
  | 'provider-performance'

// Export state for tracking progress
export interface ExportState {
  isExporting: boolean
  progress: number
  currentStep: string
  error: string | null
}

// Report data types
export interface UserStatsData {
  registrationTrend: Array<{ date: string; registrations: number }>
  distribution: Array<{ name: string; value: number }>
}

export interface RevenueReportData {
  byCategory: Array<{ category: string; revenue: number }>
  trend: Array<{ month: string; revenue: number }>
}

export interface AppointmentStatsData {
  byStatus: Array<{ status: string; count: number }>
}

export interface ProviderStatsData {
  topProviders: Array<{ name: string; appointments: number; rating?: number }>
}

export interface ExportConfig {
  reportType: ReportType
  format: ExportFormat
  period: string
  data: unknown
}

// Report metadata for display
export const REPORT_METADATA: Record<ReportType, { title: string; description: string }> = {
  'user-stats': {
    title: 'User Registration Trend',
    description: 'User registration data over time',
  },
  'user-distribution': {
    title: 'User Types Distribution',
    description: 'Distribution of users by type',
  },
  'revenue-category': {
    title: 'Revenue by Category',
    description: 'Revenue breakdown by service category',
  },
  'revenue-trend': {
    title: 'Monthly Revenue Trend',
    description: 'Revenue trends over time',
  },
  'appointment-status': {
    title: 'Appointment Status',
    description: 'Appointments grouped by status',
  },
  'provider-performance': {
    title: 'Provider Performance',
    description: 'Top performing healthcare providers',
  },
}

// Generate filename with timestamp
export function generateFilename(reportType: ReportType, format: ExportFormat): string {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss')
  const reportName = reportType.replace(/-/g, '_')
  return `${reportName}_${timestamp}.${format === 'excel' ? 'xlsx' : format}`
}

// Convert data to CSV format
export function convertToCSV(data: unknown[], columns?: { key: string; header: string }[]): string {
  if (!data || data.length === 0) {
    return ''
  }

  // If columns are provided, use them; otherwise, infer from data
  const keys = columns ? columns.map(c => c.key) : Object.keys(data[0] as object)
  const headers = columns ? columns.map(c => c.header) : keys

  // Create CSV header row
  const headerRow = headers.map(escapeCSVValue).join(',')

  // Create data rows
  const dataRows = data.map(row => {
    return keys.map(key => {
      const value = (row as Record<string, unknown>)[key]
      return escapeCSVValue(value)
    }).join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}

// Escape special characters in CSV values
function escapeCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)

  // Check if value needs quoting
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

// Get column configuration for each report type
export function getReportColumns(reportType: ReportType): { key: string; header: string }[] {
  switch (reportType) {
    case 'user-stats':
      return [
        { key: 'date', header: 'Date' },
        { key: 'registrations', header: 'Registrations' },
      ]
    case 'user-distribution':
      return [
        { key: 'name', header: 'User Type' },
        { key: 'value', header: 'Count' },
      ]
    case 'revenue-category':
      return [
        { key: 'category', header: 'Category' },
        { key: 'revenue', header: 'Revenue (USD)' },
      ]
    case 'revenue-trend':
      return [
        { key: 'month', header: 'Month' },
        { key: 'revenue', header: 'Revenue (USD)' },
      ]
    case 'appointment-status':
      return [
        { key: 'status', header: 'Status' },
        { key: 'count', header: 'Count' },
      ]
    case 'provider-performance':
      return [
        { key: 'name', header: 'Provider Name' },
        { key: 'appointments', header: 'Appointments' },
        { key: 'rating', header: 'Rating' },
      ]
    default:
      return []
  }
}

// Extract the appropriate data array from report data
export function extractReportData(reportType: ReportType, data: unknown): unknown[] {
  if (!data) return []

  switch (reportType) {
    case 'user-stats':
      return (data as UserStatsData).registrationTrend || []
    case 'user-distribution':
      return (data as UserStatsData).distribution || []
    case 'revenue-category':
      return (data as RevenueReportData).byCategory || []
    case 'revenue-trend':
      return (data as RevenueReportData).trend || []
    case 'appointment-status':
      return (data as AppointmentStatsData).byStatus || []
    case 'provider-performance':
      return (data as ProviderStatsData).topProviders || []
    default:
      return Array.isArray(data) ? data : []
  }
}

// Download helper - creates and triggers download
export function downloadFile(content: string | Blob, filename: string, mimeType?: string): void {
  const blob = content instanceof Blob
    ? content
    : new Blob([content], { type: mimeType || 'text/plain' })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export to CSV
export async function exportToCSV(
  reportType: ReportType,
  data: unknown,
  onProgress?: (progress: number, step: string) => void
): Promise<void> {
  onProgress?.(10, 'Preparing data...')

  const reportData = extractReportData(reportType, data)
  const columns = getReportColumns(reportType)

  if (reportData.length === 0) {
    throw new Error('No data available to export')
  }

  onProgress?.(50, 'Converting to CSV...')

  const csv = convertToCSV(reportData, columns)
  const filename = generateFilename(reportType, 'csv')

  onProgress?.(90, 'Downloading file...')

  downloadFile(csv, filename, 'text/csv;charset=utf-8;')

  onProgress?.(100, 'Complete')
}

// Export to PDF using jsPDF
export async function exportToPDF(
  reportType: ReportType,
  data: unknown,
  period: string,
  onProgress?: (progress: number, step: string) => void
): Promise<void> {
  onProgress?.(10, 'Loading PDF library...')

  // Dynamic import of jsPDF
  const { default: jsPDF } = await import('jspdf')
  await import('jspdf-autotable')

  const reportData = extractReportData(reportType, data)
  const columns = getReportColumns(reportType)
  const metadata = REPORT_METADATA[reportType]

  if (reportData.length === 0) {
    throw new Error('No data available to export')
  }

  onProgress?.(30, 'Creating PDF document...')

  const doc = new jsPDF()

  // Add title
  doc.setFontSize(20)
  doc.setTextColor(33, 33, 33)
  doc.text(metadata.title, 14, 22)

  // Add subtitle with period
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(metadata.description, 14, 30)
  doc.text(`Period: ${period}`, 14, 38)
  doc.text(`Generated: ${format(new Date(), 'PPpp')}`, 14, 46)

  onProgress?.(50, 'Adding table data...')

  // Add table using autoTable
  const tableHeaders = columns.map(c => c.header)
  const tableData = reportData.map(row => {
    return columns.map(col => {
      const value = (row as Record<string, unknown>)[col.key]
      if (col.key === 'revenue') {
        return `$${Number(value).toLocaleString()}`
      }
      return String(value ?? '')
    })
  })

  // Using autoTable plugin
  ;(doc as unknown as { autoTable: (options: unknown) => void }).autoTable({
    head: [tableHeaders],
    body: tableData,
    startY: 55,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  })

  onProgress?.(80, 'Adding summary...')

  // Add summary at the bottom
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 100
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Total records: ${reportData.length}`, 14, finalY + 10)
  doc.text('Unified Health - Admin Reports', 14, doc.internal.pageSize.height - 10)

  onProgress?.(90, 'Downloading PDF...')

  const filename = generateFilename(reportType, 'pdf')
  doc.save(filename)

  onProgress?.(100, 'Complete')
}

// Export to Excel using xlsx
export async function exportToExcel(
  reportType: ReportType,
  data: unknown,
  period: string,
  onProgress?: (progress: number, step: string) => void
): Promise<void> {
  onProgress?.(10, 'Loading Excel library...')

  // Dynamic import of xlsx
  const XLSX = await import('xlsx')

  const reportData = extractReportData(reportType, data)
  const columns = getReportColumns(reportType)
  const metadata = REPORT_METADATA[reportType]

  if (reportData.length === 0) {
    throw new Error('No data available to export')
  }

  onProgress?.(30, 'Creating workbook...')

  // Create workbook
  const workbook = XLSX.utils.book_new()

  // Create data for worksheet
  const worksheetData = [
    // Title row
    [metadata.title],
    [metadata.description],
    [`Period: ${period}`],
    [`Generated: ${format(new Date(), 'PPpp')}`],
    [], // Empty row
    // Headers
    columns.map(c => c.header),
    // Data rows
    ...reportData.map(row => {
      return columns.map(col => {
        const value = (row as Record<string, unknown>)[col.key]
        return value ?? ''
      })
    }),
    [], // Empty row
    [`Total records: ${reportData.length}`],
  ]

  onProgress?.(60, 'Building worksheet...')

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  // Set column widths
  const colWidths = columns.map(col => ({
    wch: Math.max(col.header.length, 15)
  }))
  worksheet['!cols'] = colWidths

  onProgress?.(80, 'Finalizing export...')

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')

  onProgress?.(90, 'Downloading Excel file...')

  // Generate and download file
  const filename = generateFilename(reportType, 'excel')
  XLSX.writeFile(workbook, filename)

  onProgress?.(100, 'Complete')
}

// Main export function
export async function exportReport(
  config: ExportConfig,
  onProgress?: (progress: number, step: string) => void
): Promise<void> {
  const { reportType, format, period, data } = config

  switch (format) {
    case 'csv':
      return exportToCSV(reportType, data, onProgress)
    case 'pdf':
      return exportToPDF(reportType, data, period, onProgress)
    case 'excel':
      return exportToExcel(reportType, data, period, onProgress)
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

// Chunk large datasets for streaming/pagination
export async function* streamExportData<T>(
  fetchFn: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>,
  pageSize: number = 1000
): AsyncGenerator<{ data: T[]; progress: number }> {
  let page = 0
  let hasMore = true
  let total = 0
  let fetched = 0

  while (hasMore) {
    const result = await fetchFn(page, pageSize)
    total = result.total
    fetched += result.data.length

    yield {
      data: result.data,
      progress: Math.round((fetched / total) * 100),
    }

    hasMore = result.data.length === pageSize && fetched < total
    page++
  }
}
