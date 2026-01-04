'use client'

import { useState, useCallback } from 'react'
import { ReportType, ExportFormat, exportReport } from '@/lib/export'

export interface ExportState {
  isExporting: boolean
  progress: number
  currentStep: string
  error: string | null
  success: boolean
}

export interface UseExportReturn {
  state: ExportState
  startExport: (config: {
    reportType: ReportType
    format: ExportFormat
    period: string
    data: unknown
  }) => Promise<boolean>
  reset: () => void
}

const initialState: ExportState = {
  isExporting: false,
  progress: 0,
  currentStep: '',
  error: null,
  success: false,
}

export function useExport(): UseExportReturn {
  const [state, setState] = useState<ExportState>(initialState)

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  const startExport = useCallback(async (config: {
    reportType: ReportType
    format: ExportFormat
    period: string
    data: unknown
  }): Promise<boolean> => {
    setState({
      isExporting: true,
      progress: 0,
      currentStep: 'Initializing...',
      error: null,
      success: false,
    })

    try {
      await exportReport(
        {
          reportType: config.reportType,
          format: config.format,
          period: config.period,
          data: config.data,
        },
        (progress, step) => {
          setState(prev => ({
            ...prev,
            progress,
            currentStep: step,
          }))
        }
      )

      setState(prev => ({
        ...prev,
        isExporting: false,
        progress: 100,
        currentStep: 'Complete',
        success: true,
      }))

      return true
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Export failed. Please try again.'

      setState(prev => ({
        ...prev,
        isExporting: false,
        error: errorMessage,
        success: false,
      }))

      return false
    }
  }, [])

  return {
    state,
    startExport,
    reset,
  }
}
