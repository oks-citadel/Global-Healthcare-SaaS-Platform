'use client'

import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ExportFormat,
  ReportType,
  REPORT_METADATA,
  exportReport,
} from '@/lib/export'
import {
  FileSpreadsheet,
  FileText,
  File,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Check,
  Circle,
} from 'lucide-react'

interface BatchExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  period: string
  reportData: {
    userStats: unknown
    providerStats: unknown
    revenueReport: unknown
    appointmentStats: unknown
  }
}

type ExportStep = 'select' | 'exporting' | 'complete' | 'error'

interface ReportExportStatus {
  reportType: ReportType
  status: 'pending' | 'exporting' | 'complete' | 'error'
  error?: string
}

const AVAILABLE_REPORTS: ReportType[] = [
  'user-stats',
  'user-distribution',
  'revenue-category',
  'revenue-trend',
  'appointment-status',
  'provider-performance',
]

const FORMAT_OPTIONS: { value: ExportFormat; label: string; icon: React.ElementType }[] = [
  { value: 'csv', label: 'CSV', icon: FileText },
  { value: 'pdf', label: 'PDF', icon: File },
  { value: 'excel', label: 'Excel', icon: FileSpreadsheet },
]

export function BatchExportDialog({
  open,
  onOpenChange,
  period,
  reportData,
}: BatchExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv')
  const [selectedReports, setSelectedReports] = useState<Set<ReportType>>(
    new Set(AVAILABLE_REPORTS)
  )
  const [step, setStep] = useState<ExportStep>('select')
  const [progress, setProgress] = useState(0)
  const [reportStatuses, setReportStatuses] = useState<ReportExportStatus[]>([])
  const [overallError, setOverallError] = useState<string | null>(null)

  const getReportData = useCallback((reportType: ReportType): unknown => {
    switch (reportType) {
      case 'user-stats':
      case 'user-distribution':
        return reportData.userStats
      case 'revenue-category':
      case 'revenue-trend':
        return reportData.revenueReport
      case 'appointment-status':
        return reportData.appointmentStats
      case 'provider-performance':
        return reportData.providerStats
      default:
        return null
    }
  }, [reportData])

  const handleReset = useCallback(() => {
    setStep('select')
    setProgress(0)
    setReportStatuses([])
    setOverallError(null)
  }, [])

  const handleClose = useCallback(() => {
    if (step !== 'exporting') {
      handleReset()
      onOpenChange(false)
    }
  }, [step, handleReset, onOpenChange])

  const toggleReport = useCallback((reportType: ReportType) => {
    setSelectedReports(prev => {
      const next = new Set(prev)
      if (next.has(reportType)) {
        next.delete(reportType)
      } else {
        next.add(reportType)
      }
      return next
    })
  }, [])

  const handleBatchExport = useCallback(async () => {
    const reportsToExport = Array.from(selectedReports)

    if (reportsToExport.length === 0) {
      return
    }

    setStep('exporting')
    setProgress(0)
    setOverallError(null)

    // Initialize statuses
    setReportStatuses(
      reportsToExport.map(reportType => ({
        reportType,
        status: 'pending',
      }))
    )

    const totalReports = reportsToExport.length
    let completedReports = 0
    let hasErrors = false

    for (const reportType of reportsToExport) {
      // Update status to exporting
      setReportStatuses(prev =>
        prev.map(rs =>
          rs.reportType === reportType ? { ...rs, status: 'exporting' } : rs
        )
      )

      try {
        const data = getReportData(reportType)
        if (!data) {
          throw new Error('No data available')
        }

        await exportReport(
          {
            reportType,
            format: selectedFormat,
            period,
            data,
          },
          () => {} // We're handling progress differently for batch
        )

        // Update status to complete
        setReportStatuses(prev =>
          prev.map(rs =>
            rs.reportType === reportType ? { ...rs, status: 'complete' } : rs
          )
        )
      } catch (err) {
        hasErrors = true
        const errorMessage = err instanceof Error ? err.message : 'Export failed'
        setReportStatuses(prev =>
          prev.map(rs =>
            rs.reportType === reportType
              ? { ...rs, status: 'error', error: errorMessage }
              : rs
          )
        )
      }

      completedReports++
      setProgress(Math.round((completedReports / totalReports) * 100))

      // Add a small delay between exports to prevent overwhelming the browser
      if (completedReports < totalReports) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    setStep(hasErrors ? 'error' : 'complete')
  }, [selectedReports, selectedFormat, period, getReportData])

  const renderSelectStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Batch Export Reports</DialogTitle>
        <DialogDescription>
          Export multiple reports at once in your preferred format
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Export Format</Label>
          <Select value={selectedFormat} onValueChange={(v) => setSelectedFormat(v as ExportFormat)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMAT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Select Reports to Export</Label>
          <div className="space-y-2 rounded-lg border p-4">
            {AVAILABLE_REPORTS.map((reportType) => (
              <div
                key={reportType}
                className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md"
                onClick={() => toggleReport(reportType)}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded border ${
                  selectedReports.has(reportType)
                    ? 'bg-primary border-primary'
                    : 'border-input'
                }`}>
                  {selectedReports.has(reportType) && (
                    <Check className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <span className="text-sm">{REPORT_METADATA[reportType].title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>Period:</strong> {period}</p>
          <p><strong>Selected:</strong> {selectedReports.size} report(s)</p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleBatchExport}
          disabled={selectedReports.size === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export {selectedReports.size} Report(s)
        </Button>
      </DialogFooter>
    </>
  )

  const renderExportingStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Exporting Reports...</DialogTitle>
        <DialogDescription>
          Please wait while your reports are being generated
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            {progress}% complete
          </p>
        </div>

        <div className="space-y-2 rounded-lg border p-4 max-h-[200px] overflow-y-auto">
          {reportStatuses.map((rs) => (
            <div key={rs.reportType} className="flex items-center gap-3 py-1">
              {rs.status === 'pending' && (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              {rs.status === 'exporting' && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
              {rs.status === 'complete' && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              {rs.status === 'error' && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">{REPORT_METADATA[rs.reportType].title}</span>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <p className="text-sm text-muted-foreground">
          Do not close this dialog while exporting
        </p>
      </DialogFooter>
    </>
  )

  const renderCompleteStep = () => {
    const successCount = reportStatuses.filter(rs => rs.status === 'complete').length
    const errorCount = reportStatuses.filter(rs => rs.status === 'error').length

    return (
      <>
        <DialogHeader>
          <DialogTitle>Export Complete</DialogTitle>
          <DialogDescription>
            Your reports have been exported
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
            {errorCount > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            )}
          </div>

          <div className="space-y-2 rounded-lg border p-4 max-h-[200px] overflow-y-auto">
            {reportStatuses.map((rs) => (
              <div key={rs.reportType} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  {rs.status === 'complete' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">{REPORT_METADATA[rs.reportType].title}</span>
                </div>
                {rs.error && (
                  <span className="text-xs text-red-500">{rs.error}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>Done</Button>
        </DialogFooter>
      </>
    )
  }

  const renderErrorStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Export Partially Complete</DialogTitle>
        <DialogDescription>
          Some reports could not be exported
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {overallError || 'Some exports failed. Check the details below.'}
          </p>
        </div>

        <div className="space-y-2 rounded-lg border p-4 max-h-[200px] overflow-y-auto">
          {reportStatuses.map((rs) => (
            <div key={rs.reportType} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                {rs.status === 'complete' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">{REPORT_METADATA[rs.reportType].title}</span>
              </div>
              {rs.error && (
                <span className="text-xs text-red-500">{rs.error}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleClose}>
          Close
        </Button>
        <Button onClick={handleReset}>
          Try Again
        </Button>
      </DialogFooter>
    </>
  )

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'select' && renderSelectStep()}
        {step === 'exporting' && renderExportingStep()}
        {step === 'complete' && renderCompleteStep()}
        {step === 'error' && renderErrorStep()}
      </DialogContent>
    </Dialog>
  )
}
