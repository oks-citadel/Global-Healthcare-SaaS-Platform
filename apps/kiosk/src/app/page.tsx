'use client'

import { useRouter } from 'next/navigation'
import { Clock, UserPlus, Calendar, Navigation, Monitor, CreditCard } from 'lucide-react'
import { ActionButton } from '@/components/ActionButton'
import { LanguageSelector } from '@/components/LanguageSelector'
import { useLanguage } from '@/components/LanguageProvider'

export default function HomePage() {
  const router = useRouter()
  const { t } = useLanguage()

  const actions = [
    {
      icon: Clock,
      label: t('home.checkIn'),
      description: t('home.checkInDesc'),
      color: 'primary',
      href: '/check-in',
    },
    {
      icon: UserPlus,
      label: t('home.register'),
      description: t('home.registerDesc'),
      color: 'success',
      href: '/register',
    },
    {
      icon: Calendar,
      label: t('home.schedule'),
      description: t('home.scheduleDesc'),
      color: 'primary',
      href: '/schedule',
    },
    {
      icon: Navigation,
      label: t('home.directions'),
      description: t('home.directionsDesc'),
      color: 'secondary',
      href: '/directions',
    },
    {
      icon: Monitor,
      label: t('home.queueStatus'),
      description: t('home.queueStatusDesc'),
      color: 'secondary',
      href: '/queue-status',
    },
    {
      icon: CreditCard,
      label: t('home.payment'),
      description: t('home.paymentDesc'),
      color: 'accent',
      href: '/payment',
    },
  ]

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-primary-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-kiosk-2xl font-bold text-gray-900">
              {t('home.welcome')}
            </h1>
            <p className="text-kiosk-base text-gray-600 mt-2">
              {t('home.subtitle')}
            </p>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action) => (
              <ActionButton
                key={action.href}
                icon={action.icon}
                label={action.label}
                description={action.description}
                color={action.color as any}
                onClick={() => router.push(action.href)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between text-kiosk-sm text-gray-600">
          <p>{t('home.needHelp')}</p>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6" />
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
