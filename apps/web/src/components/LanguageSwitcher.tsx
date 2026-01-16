'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  supportedLanguages,
  languageNames,
  languageFlags,
  type SupportedLanguage,
} from '@unified-health/i18n';
import { useLanguage } from '../providers/I18nProvider';
import { useTranslation } from '@unified-health/i18n/hooks/useTranslation';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'compact';
  className?: string;
  showFlags?: boolean;
  showNames?: boolean;
}

/**
 * Language Switcher Component
 *
 * Provides UI for switching between supported languages.
 * Persists language preference to localStorage.
 *
 * @example
 * ```tsx
 * // Dropdown variant (default)
 * <LanguageSwitcher />
 *
 * // Button variant
 * <LanguageSwitcher variant="buttons" />
 *
 * // Compact variant (flags only)
 * <LanguageSwitcher variant="compact" showNames={false} />
 * ```
 */
export function LanguageSwitcher({
  variant = 'dropdown',
  className = '',
  showFlags = true,
  showNames = true,
}: LanguageSwitcherProps) {
  const { currentLanguage, changeLanguage: switchLanguage, isChanging } = useLanguage();
  const { t } = useTranslation('common');

  if (variant === 'buttons') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {supportedLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => switchLanguage(lang)}
            disabled={isChanging}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${
                currentLanguage === lang
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label={`Switch to ${languageNames[lang]}`}
            aria-current={currentLanguage === lang}
          >
            {showFlags && <span className="mr-2">{languageFlags[lang]}</span>}
            {showNames && languageNames[lang]}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex gap-1 ${className}`}>
        {supportedLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => switchLanguage(lang)}
            disabled={isChanging}
            className={`
              p-2 rounded-md transition-all duration-200
              ${
                currentLanguage === lang
                  ? 'bg-primary/10 ring-2 ring-primary'
                  : 'hover:bg-gray-100'
              }
              ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-label={`Switch to ${languageNames[lang]}`}
            aria-current={currentLanguage === lang}
            title={languageNames[lang]}
          >
            <span className="text-xl">{languageFlags[lang]}</span>
          </button>
        ))}
      </div>
    );
  }

  // Default: Dropdown variant
  return <LanguageDropdown className={className} showFlags={showFlags} showNames={showNames} />;
}

/**
 * Dropdown Language Switcher Component
 */
function LanguageDropdown({
  className = '',
  showFlags = true,
  showNames = true,
}: Omit<LanguageSwitcherProps, 'variant'>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentLanguage, changeLanguage: switchLanguage, isChanging } = useLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = async (lang: SupportedLanguage) => {
    await switchLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-white border border-gray-300 hover:bg-gray-50
          transition-all duration-200 min-w-[140px]
          ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        {showFlags && <span className="text-xl">{languageFlags[currentLanguage]}</span>}
        {showNames && <span className="flex-1 text-left">{languageNames[currentLanguage]}</span>}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          role="listbox"
        >
          {supportedLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageSelect(lang)}
              disabled={isChanging}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left
                hover:bg-gray-50 transition-colors duration-150
                first:rounded-t-lg last:rounded-b-lg
                ${currentLanguage === lang ? 'bg-primary/5 text-primary font-medium' : ''}
                ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              role="option"
              aria-selected={currentLanguage === lang}
            >
              {showFlags && <span className="text-2xl">{languageFlags[lang]}</span>}
              {showNames && <span className="flex-1">{languageNames[lang]}</span>}
              {currentLanguage === lang && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Minimal Language Switcher for mobile or compact layouts
 */
export function LanguageSwitcherMini() {
  const { currentLanguage, changeLanguage: switchLanguage } = useLanguage();

  const handleToggle = () => {
    const currentIndex = supportedLanguages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % supportedLanguages.length;
    switchLanguage(supportedLanguages[nextIndex]);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-md hover:bg-gray-100 transition-colors"
      aria-label={`Current language: ${languageNames[currentLanguage]}. Click to change.`}
      title="Change language"
    >
      <span className="text-xl">{languageFlags[currentLanguage]}</span>
    </button>
  );
}

/**
 * Language Indicator - Shows current language without switching capability
 */
export function LanguageIndicator({ className = '' }: { className?: string }) {
  const { currentLanguage } = useLanguage();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-lg">{languageFlags[currentLanguage]}</span>
      <span className="text-sm font-medium text-gray-700">{languageNames[currentLanguage]}</span>
    </div>
  );
}
