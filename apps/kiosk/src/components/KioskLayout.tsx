import { ArrowLeft } from 'lucide-react'
import { ReactNode } from 'react'

interface KioskLayoutProps {
  children: ReactNode
  title: string
  onBack?: () => void
}

export function KioskLayout({ children, title, onBack }: KioskLayoutProps) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <header className="bg-white shadow-lg border-b-4 border-primary-600 px-8 py-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="btn-touch btn-secondary"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-kiosk-2xl font-bold text-gray-900">{title}</h1>
        </div>
      </header>
      {children}
    </div>
  )
}
