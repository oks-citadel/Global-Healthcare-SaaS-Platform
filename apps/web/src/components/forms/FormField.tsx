'use client';

import React from 'react';
import { clsx } from 'clsx';
import { VisuallyHidden } from '../a11y/VisuallyHidden';
import { useId } from '../../hooks/useA11y';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'date' | 'time';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
  className?: string;
}

/**
 * FormField Component
 *
 * Accessible form field with proper labels, error messages, and ARIA attributes.
 *
 * WCAG 2.1 Success Criteria:
 * - 1.3.1 Info and Relationships (Level A)
 * - 3.3.1 Error Identification (Level A)
 * - 3.3.2 Labels or Instructions (Level A)
 * - 4.1.2 Name, Role, Value (Level A)
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Email Address"
 *   name="email"
 *   type="email"
 *   value={email}
 *   onChange={setEmail}
 *   required
 *   error={errors.email}
 *   autoComplete="email"
 * />
 * ```
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  hint,
  autoComplete,
  className,
}) => {
  const inputId = useId(`field-${name}`);
  const errorId = useId(`error-${name}`);
  const hintId = useId(`hint-${name}`);
  const hasError = !!error;

  return (
    <div className={clsx('form-field', className)}>
      <label
        htmlFor={inputId}
        className={clsx(
          'block text-sm font-medium mb-1.5',
          'text-gray-700 dark:text-gray-300',
          required && 'required'
        )}
      >
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-red-600 ml-1">
              *
            </span>
            <VisuallyHidden>(required)</VisuallyHidden>
          </>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {hint}
        </p>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={clsx(
          hint && hintId,
          hasError && errorId
        )}
        className={clsx(
          'w-full px-3 py-2 rounded-lg border',
          'text-gray-900 dark:text-white',
          'bg-white dark:bg-gray-800',
          'transition-colors duration-200',
          // Normal state
          'border-gray-300 dark:border-gray-600',
          // Focus state
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          // Error state
          hasError && [
            'border-red-600 dark:border-red-500',
            'focus:ring-red-500 focus:border-red-600',
          ],
          // Disabled state
          disabled && 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900',
          // Touch target size
          'min-h-[44px]'
        )}
      />

      {hasError && (
        <div
          id={errorId}
          role="alert"
          className={clsx(
            'flex items-start gap-2 mt-2 p-2 rounded',
            'bg-red-50 dark:bg-red-900/20',
            'border-l-4 border-red-600 dark:border-red-500'
          )}
        >
          <svg
            className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
        </div>
      )}
    </div>
  );
};

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  hint?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
}

/**
 * TextAreaField Component
 *
 * Accessible textarea field with proper labels and error handling.
 */
export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  hint,
  rows = 4,
  maxLength,
  className,
}) => {
  const textareaId = useId(`textarea-${name}`);
  const errorId = useId(`error-${name}`);
  const hintId = useId(`hint-${name}`);
  const hasError = !!error;

  return (
    <div className={clsx('form-field', className)}>
      <label
        htmlFor={textareaId}
        className={clsx(
          'block text-sm font-medium mb-1.5',
          'text-gray-700 dark:text-gray-300',
          required && 'required'
        )}
      >
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-red-600 ml-1">
              *
            </span>
            <VisuallyHidden>(required)</VisuallyHidden>
          </>
        )}
      </label>

      {hint && (
        <p id={hintId} className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {hint}
        </p>
      )}

      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={clsx(
          hint && hintId,
          hasError && errorId
        )}
        className={clsx(
          'w-full px-3 py-2 rounded-lg border',
          'text-gray-900 dark:text-white',
          'bg-white dark:bg-gray-800',
          'transition-colors duration-200',
          'border-gray-300 dark:border-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          hasError && [
            'border-red-600 dark:border-red-500',
            'focus:ring-red-500 focus:border-red-600',
          ],
          disabled && 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900'
        )}
      />

      {maxLength && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-right">
          {value.length} / {maxLength}
          <VisuallyHidden>
            characters, {maxLength - value.length} remaining
          </VisuallyHidden>
        </p>
      )}

      {hasError && (
        <div
          id={errorId}
          role="alert"
          className={clsx(
            'flex items-start gap-2 mt-2 p-2 rounded',
            'bg-red-50 dark:bg-red-900/20',
            'border-l-4 border-red-600 dark:border-red-500'
          )}
        >
          <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
        </div>
      )}
    </div>
  );
};

interface CheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

/**
 * CheckboxField Component
 *
 * Accessible checkbox with proper labeling.
 */
export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  checked,
  onChange,
  error,
  required = false,
  disabled = false,
  hint,
  className,
}) => {
  const checkboxId = useId(`checkbox-${name}`);
  const errorId = useId(`error-${name}`);
  const hintId = useId(`hint-${name}`);
  const hasError = !!error;

  return (
    <div className={clsx('form-field', className)}>
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          disabled={disabled}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={clsx(
            hint && hintId,
            hasError && errorId
          )}
          className={clsx(
            'w-5 h-5 mt-0.5 rounded border-gray-300',
            'text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            hasError && 'border-red-600 focus:ring-red-500'
          )}
        />
        <div className="flex-1">
          <label
            htmlFor={checkboxId}
            className={clsx(
              'text-sm font-medium',
              'text-gray-700 dark:text-gray-300',
              'cursor-pointer',
              disabled && 'opacity-60 cursor-not-allowed'
            )}
          >
            {label}
            {required && (
              <>
                <span aria-hidden="true" className="text-red-600 ml-1">
                  *
                </span>
                <VisuallyHidden>(required)</VisuallyHidden>
              </>
            )}
          </label>
          {hint && (
            <p id={hintId} className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {hint}
            </p>
          )}
        </div>
      </div>

      {hasError && (
        <div
          id={errorId}
          role="alert"
          className="mt-2 text-sm text-red-800 dark:text-red-200"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;
