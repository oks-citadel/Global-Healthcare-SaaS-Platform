'use client'

import { useState } from 'react'
import { Delete, X } from 'lucide-react'

interface VirtualKeyboardProps {
  onKeyPress: (value: string) => void
  onClose: () => void
  currentValue: string
  mode?: 'alphanumeric' | 'numeric'
}

export function VirtualKeyboard({ onKeyPress, onClose, currentValue, mode = 'alphanumeric' }: VirtualKeyboardProps) {
  const [isShift, setIsShift] = useState(false)

  const numericKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0', '.', 'del'],
  ]

  const alphanumericKeys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'del'],
    ['space'],
  ]

  const handleKeyPress = (key: string) => {
    let newValue = currentValue

    if (key === 'del') {
      newValue = currentValue.slice(0, -1)
    } else if (key === 'space') {
      newValue = currentValue + ' '
    } else if (key === 'shift') {
      setIsShift(!isShift)
      return
    } else {
      const char = isShift ? key.toUpperCase() : key.toLowerCase()
      newValue = currentValue + char
    }

    onKeyPress(newValue)
    if (isShift && key !== 'shift') {
      setIsShift(false)
    }
  }

  const keys = mode === 'numeric' ? numericKeys : alphanumericKeys

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 bg-white rounded-xl px-6 py-4 mr-4">
            <p className="text-kiosk-lg font-mono">{currentValue || '\u00A0'}</p>
          </div>
          <button
            onClick={onClose}
            className="btn-touch btn-secondary"
            aria-label="Close keyboard"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {keys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-3 justify-center">
              {row.map((key) => {
                const isSpecial = ['shift', 'del', 'space'].includes(key)
                const displayKey = key === 'space' ? 'Space' : key === 'del' ? 'Delete' : key

                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`
                      keyboard-key
                      ${key === 'space' ? 'flex-1' : ''}
                      ${isSpecial ? 'min-w-[120px]' : ''}
                      ${key === 'shift' && isShift ? 'bg-primary-600 text-white' : ''}
                    `}
                  >
                    {key === 'del' ? (
                      <Delete className="w-6 h-6" />
                    ) : (
                      <span className="uppercase">{displayKey}</span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
