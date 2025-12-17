import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  multiSelect?: boolean;
  searchable?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  error,
  helperText,
  disabled = false,
  multiSelect = false,
  searchable = false,
  fullWidth = false,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const handleSelect = (optionValue: string) => {
    if (multiSelect) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(newValues);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (multiSelect) {
      return `${selectedValues.length} selected`;
    }
    return options.find(opt => opt.value === selectedValues[0])?.label || placeholder;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const stateStyles = error
    ? 'border-error-500 focus:ring-error-500'
    : 'border-gray-300 focus:ring-primary-500';

  return (
    <div ref={containerRef} className={clsx('relative', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={clsx(
            'w-full flex items-center justify-between rounded-lg border bg-white transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            sizeStyles[size],
            stateStyles
          )}
        >
          <span className={clsx(selectedValues.length === 0 && 'text-gray-400')}>
            {getDisplayText()}
          </span>
          <svg
            className={clsx('w-5 h-5 text-gray-400 transition-transform', isOpen && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                    className={clsx(
                      'w-full text-left px-4 py-2 text-sm transition-colors',
                      'hover:bg-gray-100 focus:outline-none focus:bg-gray-100',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      selectedValues.includes(option.value) && 'bg-primary-50 text-primary-700'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {multiSelect && selectedValues.includes(option.value) && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

Select.displayName = 'Select';
