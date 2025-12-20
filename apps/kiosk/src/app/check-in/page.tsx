'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Camera } from 'lucide-react'
import { KioskLayout } from '@/components/KioskLayout'
import { ProgressStepper } from '@/components/ProgressStepper'
import { VirtualKeyboard } from '@/components/VirtualKeyboard'
import { SuccessScreen } from '@/components/SuccessScreen'
import { useLanguage } from '@/components/LanguageProvider'

const steps = ['Verify', 'Insurance', 'Confirm']

export default function CheckInPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    phoneNumber: '',
    insuranceScanned: false,
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

  const handleScanInsurance = () => {
    // Placeholder for insurance scanning
    setFormData(prev => ({ ...prev, insuranceScanned: true }))
  }

  if (isComplete) {
    return (
      <SuccessScreen
        title={t('checkIn.success')}
        message={t('checkIn.successMessage')}
        onComplete={() => router.push('/')}
      />
    )
  }

  return (
    <KioskLayout
      title={t('checkIn.title')}
      onBack={() => router.push('/')}
    >
      <div className="flex flex-col h-full">
        <ProgressStepper steps={steps} currentStep={currentStep} />

        <div className="flex-1 overflow-auto p-8">
          {currentStep === 0 && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('checkIn.verifyIdentity')}
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('checkIn.dateOfBirth')}
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

                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('checkIn.phoneNumber')}
                    </label>
                    <input
                      type="text"
                      className="input-touch w-full"
                      placeholder="(___) ___-____"
                      value={formData.phoneNumber}
                      onFocus={() => handleInputFocus('phoneNumber')}
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
                  {t('checkIn.scanInsurance')}
                </h2>

                <div className="space-y-6">
                  <div className="bg-gray-100 border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                    {formData.insuranceScanned ? (
                      <div className="text-green-600">
                        <Check className="w-24 h-24 mx-auto mb-4" />
                        <p className="text-kiosk-lg font-semibold">
                          {t('checkIn.insuranceScanned')}
                        </p>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                        <p className="text-kiosk-base text-gray-600 mb-6">
                          {t('checkIn.placeCard')}
                        </p>
                        <button
                          onClick={handleScanInsurance}
                          className="btn-touch btn-primary"
                        >
                          {t('checkIn.scanCard')}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    className="btn-touch btn-secondary w-full"
                  >
                    {t('checkIn.skipInsurance')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('checkIn.confirmInfo')}
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-4 border-b-2">
                    <span className="text-kiosk-base font-semibold">
                      {t('checkIn.dateOfBirth')}:
                    </span>
                    <span className="text-kiosk-base">
                      {formData.dateOfBirth || 'Not provided'}
                    </span>
                  </div>
                  <div className="flex justify-between py-4 border-b-2">
                    <span className="text-kiosk-base font-semibold">
                      {t('checkIn.phoneNumber')}:
                    </span>
                    <span className="text-kiosk-base">
                      {formData.phoneNumber || 'Not provided'}
                    </span>
                  </div>
                  <div className="flex justify-between py-4 border-b-2">
                    <span className="text-kiosk-base font-semibold">
                      {t('checkIn.insurance')}:
                    </span>
                    <span className="text-kiosk-base">
                      {formData.insuranceScanned ? t('checkIn.scanned') : t('checkIn.notScanned')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(0)}
                    className="btn-touch btn-secondary flex-1"
                  >
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={handleNext}
                    className="btn-touch btn-success flex-1"
                  >
                    {t('common.confirm')}
                  </button>
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
                disabled={currentStep === 0 && !formData.dateOfBirth}
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
