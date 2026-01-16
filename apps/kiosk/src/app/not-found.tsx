import { Home, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center animate-fadeIn">
          <AlertCircle className="w-24 h-24 text-blue-600 mx-auto mb-6" />
          <h1 className="text-kiosk-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-kiosk-lg text-gray-700 mb-8">
            The page you are looking for does not exist.
          </p>

          <Link href="/" className="btn-touch-lg btn-primary inline-flex items-center">
            <Home className="w-6 h-6 mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
