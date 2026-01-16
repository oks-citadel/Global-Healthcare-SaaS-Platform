'use client'

import { useEffect } from 'react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center animate-fadeIn">
          <AlertTriangle className="w-24 h-24 text-red-600 mx-auto mb-6" />
          <h1 className="text-kiosk-2xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h1>
          <p className="text-kiosk-lg text-gray-700 mb-8">
            We encountered an unexpected error. Please try again or ask staff for assistance.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={reset}
              className="btn-touch-lg btn-primary"
            >
              <RefreshCw className="w-6 h-6 mr-2 inline" />
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="btn-touch-lg btn-secondary"
            >
              <Home className="w-6 h-6 mr-2 inline" />
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
