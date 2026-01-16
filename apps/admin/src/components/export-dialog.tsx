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
} from 'lucide-react'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportType: ReportType
  period: string
  data: unknown
}

type ExportStep = 'select' | 'confirm' | 'exporting' | 'complete' | 'error'

const FORMAT_OPTIONS: { value: ExportFormat; label: string; icon: React.ElementType; description: string }[] = [
  {
    value: 'csv',
    label: 'CSV',
    icon: FileText,
    description: 'Comma-separated values, compatible with most applications',
  },
  {
    value: 'pdf',
    label: 'PDF',
    icon: File,
    description: 'Formatted document, ideal for printing and sharing',
  },
  {
    value: 'excel',
    label: 'Excel',
    icon: FileSpreadsheet,
    description: 'Microsoft Excel format with formatting support',
  },
]

export function ExportDialog({
  open,
  onOpenChange,
  reportType,
  period,
  data,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv')
  const [step, setStep] = useState<ExportStep>('select')
  const [progress, setProgress] = useState(0)
  const [currentStepMessage, setCurrentStepMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const metadata = REPORT_METADATA[reportType]

  const handleReset = useCallback(() => {
    setStep('select')
    setProgress(0)
    setCurrentStepMessage('')
    setError(null)
  }, [])

  const handleClose = useCallback(() => {
    if (step !== 'exporting') {
      handleReset()
      onOpenChange(false)
    }
  }, [step, handleReset, onOpenChange])

  const handleProceedToConfirm = useCallback(() => {
    setStep('confirm')
  }, [])

  const handleBack = useCallback(() => {
    setStep('select')
  }, [])

  const handleExport = useCallback(async () => {
    setStep('exporting')
    setProgress(0)
    setError(null)

    try {
      await exportReport(
        {
          reportType,
          format: selectedFormat,
          period,
          data,
        },
        (newProgress, stepMessage) => {
          setProgress(newProgress)
          setCurrentStepMessage(stepMessage)
        }
      )
      setStep('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed. Please try again.')
      setStep('error')
    }
  }, [reportType, selectedFormat, period, data])

  const renderSelectStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Export Report</DialogTitle>
        <DialogDescription>
          Choose an export format for &quot;{metadata.title}&quot;
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

        <div className="rounded-lg border p-4 bg-muted/50">
          {FORMAT_OPTIONS.map((option) => {
            if (option.value !== selectedFormat) return null
            return (
              <div key={option.value} className="flex items-start gap-3">
                <option.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{option.label} Format</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>Report:</strong> {metadata.title}</p>
          <p><strong>Period:</strong> {period}</p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleProceedToConfirm}>
          Continue
        </Button>
      </DialogFooter>
    </>
  )

  const renderConfirmStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Confirm Export</DialogTitle>
        <DialogDescription>
          Review your export settings before proceeding
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Report</span>
            <span className="font-medium">{metadata.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Format</span>
            <span className="font-medium uppercase">{selectedFormat}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Period</span>
            <span className="font-medium">{period}</span>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            The export will start immediately. Depending on the data size, this may take a few moments.
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Now
        </Button>
      </DialogFooter>
    </>
  )

  const renderExportingStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Exporting...</DialogTitle>
        <DialogDescription>
          Please wait while your report is being generated
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentStepMessage}</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      <DialogFooter>
        <p className="text-sm text-muted-foreground">
          Do not close this dialog while exporting
        </p>
      </DialogFooter>
    </>
  )

  const renderCompleteStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Export Complete</DialogTitle>
        <DialogDescription>
          Your report has been successfully exported
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="text-center">
          <p className="font-medium">Download started</p>
          <p className="text-sm text-muted-foreground">
            Check your downloads folder for the exported file
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button onClick={handleClose}>
          Done
        </Button>
      </DialogFooter>
    </>
  )

  const renderErrorStep = () => (
    <>
      <DialogHeader>
        <DialogTitle>Export Failed</DialogTitle>
        <DialogDescription>
          An error occurred while exporting your report
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center justify-center py-8 space-y-4">
        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <div className="text-center">
          <p className="font-medium">Something went wrong</p>
          <p className="text-sm text-muted-foreground">
            {error}
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancel
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
        {step === 'confirm' && renderConfirmStep()}
        {step === 'exporting' && renderExportingStep()}
        {step === 'complete' && renderCompleteStep()}
        {step === 'error' && renderErrorStep()}
      </DialogContent>
    </Dialog>
  )
}
