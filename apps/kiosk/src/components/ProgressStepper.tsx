import { Check } from 'lucide-react'

interface ProgressStepperProps {
  steps: string[]
  currentStep: number
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="bg-white border-b-2 border-gray-200 px-8 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${
                      index < currentStep
                        ? 'bg-green-600 text-white'
                        : index === currentStep
                        ? 'bg-primary-600 text-white ring-4 ring-primary-200'
                        : 'bg-gray-300 text-gray-600'
                    }
                  `}
                >
                  {index < currentStep ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-kiosk-base font-bold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-kiosk-sm font-semibold
                    ${index === currentStep ? 'text-primary-600' : 'text-gray-600'}
                  `}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-4
                    transition-all duration-300
                    ${index < currentStep ? 'bg-green-600' : 'bg-gray-300'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
