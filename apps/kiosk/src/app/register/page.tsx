'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { KioskLayout } from '@/components/KioskLayout'
import { ProgressStepper } from '@/components/ProgressStepper'
import { VirtualKeyboard } from '@/components/VirtualKeyboard'
import { SuccessScreen } from '@/components/SuccessScreen'
import { useLanguage } from '@/components/LanguageProvider'

const steps = ['Personal', 'Contact', 'Emergency', 'Review']

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    email: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
  })
  const [activeInput, setActiveInput] = useState<string | null>(null)

  const handleInputFocus = (inputName: string) => {
    setActiveInput(inputName)
  }

  const handleKeyboardInput = (value: string) => {
    if (!activeInput) return

    setFormData(prev => ({
      ...prev,
      [activeInput]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setActiveInput(null)
    } else {
      setIsComplete(true)
    }
  }

  if (isComplete) {
    return (
      <SuccessScreen
        title={t('register.success')}
        message={t('register.successMessage')}
        onComplete={() => router.push('/')}
      />
    )
  }

  return (
    <KioskLayout
      title={t('register.title')}
      onBack={() => router.push('/')}
    >
      <div className="flex flex-col h-full">
        <ProgressStepper steps={steps} currentStep={currentStep} />

        <div className="flex-1 overflow-auto p-8">
          {currentStep === 0 && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('register.personalInfo')}
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('register.firstName')}
                    </label>
                    <input
                      type="text"
                      className="input-touch w-full"
                      value={formData.firstName}
                      onFocus={() => handleInputFocus('firstName')}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('register.lastName')}
                    </label>
                    <input
                      type="text"
                      className="input-touch w-full"
                      value={formData.lastName}
                      onFocus={() => handleInputFocus('lastName')}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('register.dateOfBirth')}
                    </label>
                    <input
                      type="text"
                      className="input-touch w-full"
                      placeholder="MM/DD/YYYY"
                      value={formData.dateOfBirth}
                      onFocus={() => handleInputFocus('dateOfBirth')}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('register.contactInfo')}
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('register.address')}
                    </label>
                    <input
                      type="text"
                      className="input-touch w-full"
                      value={formData.address}
                      onFocus={() => handleInputFocus('address')}
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-kiosk-base font-semibold mb-3">
                        {t('register.city')}
                      </label>
                      <input
                        type="text"
                        className="input-touch w-full"
                        value={formData.city}
                        onFocus={() => handleInputFocus('city')}
                        readOnly
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-kiosk-base font-semibold mb-3">
                        {t('register.state')}
                      </label>
                      <input
                        type="text"
                        className="input-touch w-full"
                        value={formData.state}
                        onFocus={() => handleInputFocus('state')}
                        readOnly
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-kiosk-base font-semibold mb-3">
                        {t('register.zipCode')}
                      </label>
                      <input
                        type="text"
                        className="input-touch w-full"
                        value={formData.zipCode}
                        onFocus={() => handleInputFocus('zipCode')}
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('register.phoneNumber')}
                    </label>
                    <input
                      type="text"
                      className="input-touch w-full"
                      value={formData.phoneNumber}
                      onFocus={() => handleInputFocus('phoneNumber')}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('register.email')}
                    </label>
                    <input
                      type="text"
                      className="input-touch w-full"
                      value={formData.email}
                      onFocus={() => handleInputFocus('email')}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('register.emergencyContact')}
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('register.emergencyName')}
                    </label>
                    <input
                      type="text"
                      className="input-touch w-full"
                      value={formData.emergencyName}
                      onFocus={() => handleInputFocus('emergencyName')}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('register.emergencyPhone')}
                    </label>
                    <input
                      type="text"
                      className="input-touch w-full"
                      value={formData.emergencyPhone}
                      onFocus={() => handleInputFocus('emergencyPhone')}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('register.emergencyRelation')}
                    </label>
                    <input
                      type="text"
                      className="input-touch w-full"
                      value={formData.emergencyRelation}
                      onFocus={() => handleInputFocus('emergencyRelation')}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('register.reviewInfo')}
                </h2>

                <div className="space-y-4">
                  <div className="border-b-2 pb-4">
                    <h3 className="text-kiosk-lg font-semibold mb-3">
                      {t('register.personalInfo')}
                    </h3>
                    <div className="space-y-2 text-kiosk-base">
                      <p><strong>{t('register.name')}:</strong> {formData.firstName} {formData.lastName}</p>
                      <p><strong>{t('register.dateOfBirth')}:</strong> {formData.dateOfBirth}</p>
                    </div>
                  </div>

                  <div className="border-b-2 pb-4">
                    <h3 className="text-kiosk-lg font-semibold mb-3">
                      {t('register.contactInfo')}
                    </h3>
                    <div className="space-y-2 text-kiosk-base">
                      <p><strong>{t('register.address')}:</strong> {formData.address}</p>
                      <p><strong>{t('register.cityStateZip')}:</strong> {formData.city}, {formData.state} {formData.zipCode}</p>
                      <p><strong>{t('register.phoneNumber')}:</strong> {formData.phoneNumber}</p>
                      <p><strong>{t('register.email')}:</strong> {formData.email}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-kiosk-lg font-semibold mb-3">
                      {t('register.emergencyContact')}
                    </h3>
                    <div className="space-y-2 text-kiosk-base">
                      <p><strong>{t('register.name')}:</strong> {formData.emergencyName}</p>
                      <p><strong>{t('register.phoneNumber')}:</strong> {formData.emergencyPhone}</p>
                      <p><strong>{t('register.relation')}:</strong> {formData.emergencyRelation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {activeInput && (
          <div className="border-t-2 border-gray-200 bg-white">
            <VirtualKeyboard
              onKeyPress={handleKeyboardInput}
              onClose={() => setActiveInput(null)}
              currentValue={formData[activeInput as keyof typeof formData] as string}
            />
          </div>
        )}

        <div className="bg-white border-t-2 border-gray-200 p-6">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.push('/')}
              className="btn-touch btn-secondary flex-1"
            >
              <ArrowLeft className="w-6 h-6 mr-2 inline" />
              {t('common.back')}
            </button>
            {!activeInput && (
              <button
                onClick={handleNext}
                className="btn-touch btn-primary flex-1"
              >
                {currentStep === steps.length - 1 ? t('common.submit') : t('common.next')}
              </button>
            )}
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}
