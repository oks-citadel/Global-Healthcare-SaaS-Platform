'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, DollarSign } from 'lucide-react'
import { KioskLayout } from '@/components/KioskLayout'
import { ProgressStepper } from '@/components/ProgressStepper'
import { VirtualKeyboard } from '@/components/VirtualKeyboard'
import { SuccessScreen } from '@/components/SuccessScreen'
import { useLanguage } from '@/components/LanguageProvider'

const steps = ['Amount', 'Payment Method', 'Process']

export default function PaymentPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: '',
    cardProcessing: false,
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

  const handleProcessPayment = () => {
    setFormData(prev => ({ ...prev, cardProcessing: true }))
    setTimeout(() => {
      setIsComplete(true)
    }, 2000)
  }

  if (isComplete) {
    return (
      <SuccessScreen
        title={t('payment.success')}
        message={`${t('payment.successMessage')} $${formData.amount}`}
        onComplete={() => router.push('/')}
      />
    )
  }

  return (
    <KioskLayout
      title={t('payment.title')}
      onBack={() => router.push('/')}
    >
      <div className="flex flex-col h-full">
        <ProgressStepper steps={steps} currentStep={currentStep} />

        <div className="flex-1 overflow-auto p-8">
          {currentStep === 0 && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('payment.enterAmount')}
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-kiosk-base font-semibold mb-3">
                      {t('payment.coPayAmount')}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                      <input
                        type="text"
                        className="input-touch w-full pl-14"
                        placeholder="0.00"
                        value={formData.amount}
                        onFocus={() => handleInputFocus('amount')}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="text-kiosk-base font-semibold mb-3">
                      {t('payment.commonAmounts')}
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {['10', '25', '50', '100'].map(amount => (
                        <button
                          key={amount}
                          onClick={() => setFormData(prev => ({ ...prev, amount }))}
                          className="btn-touch btn-secondary"
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('payment.selectMethod')}
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'credit' }))}
                    className={`btn-touch-xl ${
                      formData.paymentMethod === 'credit'
                        ? 'btn-primary'
                        : 'btn-secondary'
                    } flex flex-col items-center gap-4`}
                  >
                    <CreditCard className="w-16 h-16" />
                    <span>{t('payment.creditCard')}</span>
                  </button>

                  <button
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'debit' }))}
                    className={`btn-touch-xl ${
                      formData.paymentMethod === 'debit'
                        ? 'btn-primary'
                        : 'btn-secondary'
                    } flex flex-col items-center gap-4`}
                  >
                    <CreditCard className="w-16 h-16" />
                    <span>{t('payment.debitCard')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
              <div className="card-kiosk">
                <h2 className="text-kiosk-xl font-bold mb-6">
                  {t('payment.processPayment')}
                </h2>

                {!formData.cardProcessing ? (
                  <div className="space-y-6">
                    <div className="bg-gray-100 border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                      <CreditCard className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                      <p className="text-kiosk-lg text-gray-600 mb-2">
                        {t('payment.insertCard')}
                      </p>
                      <p className="text-kiosk-base text-gray-500">
                        {t('payment.insertCardDesc')}
                      </p>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                      <h3 className="text-kiosk-base font-semibold mb-3">
                        {t('payment.paymentSummary')}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-kiosk-lg">
                          {t('payment.amount')}:
                        </span>
                        <span className="text-kiosk-2xl font-bold text-primary-600">
                          ${formData.amount}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleProcessPayment}
                      className="btn-touch btn-success w-full"
                    >
                      {t('payment.processButton')}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-24 w-24 border-8 border-primary-600 border-t-transparent mx-auto mb-6"></div>
                    <p className="text-kiosk-lg font-semibold">
                      {t('payment.processing')}
                    </p>
                  </div>
                )}
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
              mode="numeric"
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
            {!activeInput && !formData.cardProcessing && (
              <button
                onClick={handleNext}
                className="btn-touch btn-primary flex-1"
                disabled={
                  (currentStep === 0 && !formData.amount) ||
                  (currentStep === 1 && !formData.paymentMethod)
                }
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
