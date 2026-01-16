import { CheckCircle, Home } from 'lucide-react'
import { useEffect } from 'react'

interface SuccessScreenProps {
  title: string
  message: string
  onComplete: () => void
  autoRedirectDelay?: number
}

export function SuccessScreen({ title, message, onComplete, autoRedirectDelay = 5000 }: SuccessScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, autoRedirectDelay)

    return () => clearTimeout(timer)
  }, [onComplete, autoRedirectDelay])

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center animate-fadeIn">
          <div className="mb-8">
            <CheckCircle className="w-32 h-32 text-green-600 mx-auto mb-6 animate-pulse" />
            <h1 className="text-kiosk-3xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            <p className="text-kiosk-lg text-gray-700">
              {message}
            </p>
          </div>

          <div className="border-t-2 border-gray-200 pt-8">
            <p className="text-kiosk-base text-gray-600 mb-6">
              Returning to home screen...
            </p>
            <button
              onClick={onComplete}
              className="btn-touch btn-primary"
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
