'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'

interface IdleTimeoutContextType {
  resetTimeout: () => void
}

const IdleTimeoutContext = createContext<IdleTimeoutContextType | undefined>(undefined)

export function useIdleTimeout() {
  const context = useContext(IdleTimeoutContext)
  if (!context) {
    throw new Error('useIdleTimeout must be used within IdleTimeoutProvider')
  }
  return context
}

interface IdleTimeoutProviderProps {
  children: ReactNode
  timeout: number
}

export function IdleTimeoutProvider({ children, timeout }: IdleTimeoutProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    let idleTimer: NodeJS.Timeout
    let warningTimer: NodeJS.Timeout
    let countdownInterval: NodeJS.Timeout

    const resetTimers = () => {
      setShowWarning(false)
      setCountdown(30)

      if (idleTimer) clearTimeout(idleTimer)
      if (warningTimer) clearTimeout(warningTimer)
      if (countdownInterval) clearInterval(countdownInterval)

      // Show warning 30 seconds before timeout
      warningTimer = setTimeout(() => {
        if (pathname !== '/') {
          setShowWarning(true)
          setCountdown(30)

          countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval)
                return 0
              }
              return prev - 1
            })
          }, 1000)
        }
      }, timeout - 30000)

      // Redirect to home on timeout
      idleTimer = setTimeout(() => {
        if (pathname !== '/') {
          router.push('/')
        }
      }, timeout)
    }

    const handleActivity = () => {
      resetTimers()
    }

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })

    resetTimers()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      if (idleTimer) clearTimeout(idleTimer)
      if (warningTimer) clearTimeout(warningTimer)
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, [router, pathname, timeout])

  const resetTimeout = () => {
    setShowWarning(false)
  }

  return (
    <IdleTimeoutContext.Provider value={{ resetTimeout }}>
      {children}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full animate-fadeIn">
            <div className="text-center">
              <AlertTriangle className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-kiosk-2xl font-bold mb-4">
                Are you still there?
              </h2>
              <p className="text-kiosk-lg text-gray-700 mb-8">
                Your session will end in <span className="font-bold text-red-600">{countdown}</span> seconds due to inactivity.
              </p>
              <button
                onClick={resetTimeout}
                className="btn-touch-lg btn-primary"
              >
                Continue Session
              </button>
            </div>
          </div>
        </div>
      )}
    </IdleTimeoutContext.Provider>
  )
}
