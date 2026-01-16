'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Users } from 'lucide-react'
import { KioskLayout } from '@/components/KioskLayout'
import { useLanguage } from '@/components/LanguageProvider'

interface QueueItem {
  department: string
  waitTime: number
  patientsWaiting: number
  status: 'low' | 'medium' | 'high'
}

export default function QueueStatusPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [queues, setQueues] = useState<QueueItem[]>([
    { department: 'Emergency Room', waitTime: 45, patientsWaiting: 12, status: 'high' },
    { department: 'Primary Care', waitTime: 15, patientsWaiting: 4, status: 'low' },
    { department: 'Radiology', waitTime: 30, patientsWaiting: 8, status: 'medium' },
    { department: 'Laboratory', waitTime: 10, patientsWaiting: 3, status: 'low' },
    { department: 'Cardiology', waitTime: 25, patientsWaiting: 6, status: 'medium' },
    { department: 'Orthopedics', waitTime: 20, patientsWaiting: 5, status: 'low' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setQueues(prev => prev.map(queue => ({
        ...queue,
        waitTime: Math.max(5, queue.waitTime + Math.floor(Math.random() * 10 - 5)),
        patientsWaiting: Math.max(1, queue.patientsWaiting + Math.floor(Math.random() * 4 - 2)),
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: QueueItem['status']) => {
    switch (status) {
      case 'low':
        return 'bg-green-100 border-green-300 text-green-900'
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900'
      case 'high':
        return 'bg-red-100 border-red-300 text-red-900'
    }
  }

  const getStatusBadge = (status: QueueItem['status']) => {
    switch (status) {
      case 'low':
        return { label: t('queueStatus.statusLow'), color: 'bg-green-600' }
      case 'medium':
        return { label: t('queueStatus.statusMedium'), color: 'bg-yellow-600' }
      case 'high':
        return { label: t('queueStatus.statusHigh'), color: 'bg-red-600' }
    }
  }

  return (
    <KioskLayout
      title={t('queueStatus.title')}
      onBack={() => router.push('/')}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="card-kiosk animate-fadeIn">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-kiosk-xl font-bold">
                  {t('queueStatus.currentWaitTimes')}
                </h2>
                <div className="flex items-center gap-3 text-kiosk-base text-gray-600">
                  <Clock className="w-6 h-6" />
                  <span>{t('queueStatus.updatesEvery')} 5 {t('queueStatus.seconds')}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {queues.map((queue) => {
                  const badge = getStatusBadge(queue.status)
                  return (
                    <div
                      key={queue.department}
                      className={`border-3 rounded-2xl p-6 ${getStatusColor(queue.status)} transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-kiosk-lg font-bold">
                          {queue.department}
                        </h3>
                        <span className={`${badge.color} text-white px-4 py-2 rounded-full text-kiosk-sm font-semibold`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-white bg-opacity-50 rounded-xl p-3">
                            <Clock className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="text-kiosk-sm opacity-80">
                              {t('queueStatus.waitTime')}
                            </div>
                            <div className="text-kiosk-xl font-bold">
                              {queue.waitTime} {t('queueStatus.min')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-white bg-opacity-50 rounded-xl p-3">
                            <Users className="w-8 h-8" />
                          </div>
                          <div>
                            <div className="text-kiosk-sm opacity-80">
                              {t('queueStatus.waiting')}
                            </div>
                            <div className="text-kiosk-xl font-bold">
                              {queue.patientsWaiting}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <p className="text-kiosk-base text-blue-900">
                  {t('queueStatus.disclaimer')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t-2 border-gray-200 p-6">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => router.push('/')}
              className="btn-touch btn-secondary flex-1"
            >
              <ArrowLeft className="w-6 h-6 mr-2 inline" />
              {t('common.back')}
            </button>
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}
