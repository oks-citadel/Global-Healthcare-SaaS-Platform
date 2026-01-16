'use client'

import { Globe } from 'lucide-react'
import { useLanguage } from './LanguageProvider'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: 'en' as const, label: 'English', flag: '🇺🇸' },
    { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
    { code: 'zh' as const, label: '中文', flag: '🇨🇳' },
  ]

  return (
    <div className="flex items-center gap-3">
      <Globe className="w-6 h-6 text-gray-600" />
      <div className="flex gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`
              px-4 py-2 rounded-xl text-kiosk-sm font-semibold
              transition-all duration-200
              ${
                language === lang.code
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}
