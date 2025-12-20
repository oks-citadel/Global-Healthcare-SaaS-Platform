'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-8">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <AlertTriangle className="w-24 h-24 text-red-600 mx-auto mb-6" />
              <h1 className="text-kiosk-2xl font-bold text-gray-900 mb-4">
                Something Went Wrong
              </h1>
              <p className="text-kiosk-lg text-gray-700 mb-8">
                We encountered an unexpected error. Please try again or ask staff for assistance.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-touch-lg btn-primary"
              >
                <Home className="w-6 h-6 mr-2 inline" />
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
