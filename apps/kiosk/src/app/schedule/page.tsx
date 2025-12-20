'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react'
import { KioskLayout } from '@/components/KioskLayout'
import { ProgressStepper } from '@/components/ProgressStepper'
import { SuccessScreen } from '@/components/SuccessScreen'
import { useLanguage } from '@/components/LanguageProvider'
import { format, addDays, startOfWeek } from 'date-fns'

const steps = ['Department', 'Provider', 'Date & Time', 'Confirm']

const departments = [
  'Primary Care',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Radiology',
]

const providers = [
  'Dr. Sarah Johnson',
  'Dr. Michael Chen',
  'Dr. Emily Rodriguez',
  'Dr. James Wilson',
]

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
]

export default function SchedulePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState({
    department: '',
    provider: '',
    date: '',
    time: '',
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const getNextWeekDays = () => {
    const today = new Date()
    const startDay = startOfWeek(today, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(startDay, i))
  }

  if (isComplete) {
    return (
      <SuccessScreen
        title={t('schedule.success')}
        message={`${t('schedule.successMessage')} ${formData.date} at ${formData.time}`}
        onComplete={() => router.push('/')}
      />
    )
  }

  return (
    <KioskLayout
      title={t('schedule.title')}
      onBack={() => router.push('/')}
    >
      <div className="flex flex-col h-full">
        <ProgressStepper steps={steps} currentStep={currentStep} />

        <div className="flex-1 overflow-auto p-8">
          {currentStep === 0 && (
            <div className="max-w-4xl mx-auto animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('schedule.selectDepartment')}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setFormData(prev => ({ ...prev, department: dept }))}
                      className={`btn-touch-lg ${
                        formData.department === dept
                          ? 'btn-primary'
                          : 'btn-secondary'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="max-w-4xl mx-auto animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('schedule.selectProvider')}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {providers.map((provider) => (
                    <button
                      key={provider}
                      onClick={() => setFormData(prev => ({ ...prev, provider }))}
                      className={`btn-touch-lg ${
                        formData.provider === provider
                          ? 'btn-primary'
                          : 'btn-secondary'
                      }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-5xl mx-auto animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('schedule.selectDateTime')}
                </h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-kiosk-lg font-semibold mb-4">
                      {t('schedule.selectDate')}
                    </h3>
                    <div className="grid grid-cols-7 gap-3">
                      {getNextWeekDays().map((day) => {
                        const dateStr = format(day, 'MM/dd/yyyy')
                        return (
                          <button
                            key={dateStr}
                            onClick={() => setFormData(prev => ({ ...prev, date: dateStr }))}
                            className={`btn-touch ${
                              formData.date === dateStr
                                ? 'btn-primary'
                                : 'btn-secondary'
                            } flex flex-col items-center justify-center`}
                          >
                            <span className="text-kiosk-sm">
                              {format(day, 'EEE')}
                            </span>
                            <span className="text-kiosk-lg font-bold">
                              {format(day, 'd')}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {formData.date && (
                    <div>
                      <h3 className="text-kiosk-lg font-semibold mb-4">
                        {t('schedule.selectTime')}
                      </h3>
                      <div className="grid grid-cols-4 gap-4">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setFormData(prev => ({ ...prev, time }))}
                            className={`btn-touch ${
                              formData.time === time
                                ? 'btn-primary'
                                : 'btn-secondary'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('schedule.confirmAppointment')}
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-4 border-b-2">
                    <span className="text-kiosk-base font-semibold">
                      {t('schedule.department')}:
                    </span>
                    <span className="text-kiosk-base">{formData.department}</span>
                  </div>
                  <div className="flex justify-between py-4 border-b-2">
                    <span className="text-kiosk-base font-semibold">
                      {t('schedule.provider')}:
                    </span>
                    <span className="text-kiosk-base">{formData.provider}</span>
                  </div>
                  <div className="flex justify-between py-4 border-b-2">
                    <span className="text-kiosk-base font-semibold">
                      {t('schedule.date')}:
                    </span>
                    <span className="text-kiosk-base">{formData.date}</span>
                  </div>
                  <div className="flex justify-between py-4 border-b-2">
                    <span className="text-kiosk-base font-semibold">
                      {t('schedule.time')}:
                    </span>
                    <span className="text-kiosk-base">{formData.time}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <p className="text-kiosk-base text-blue-900">
                    {t('schedule.confirmationNote')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border-t-2 border-gray-200 p-6">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.push('/')}
              className="btn-touch btn-secondary flex-1"
            >
              <ArrowLeft className="w-6 h-6 mr-2 inline" />
              {t('common.back')}
            </button>
            <button
              onClick={handleNext}
              className="btn-touch btn-primary flex-1"
              disabled={
                (currentStep === 0 && !formData.department) ||
                (currentStep === 1 && !formData.provider) ||
                (currentStep === 2 && (!formData.date || !formData.time))
              }
            >
              {currentStep === steps.length - 1 ? t('common.confirm') : t('common.next')}
            </button>
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}
