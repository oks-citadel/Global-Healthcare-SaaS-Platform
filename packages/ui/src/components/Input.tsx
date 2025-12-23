// @ts-nocheck
import React from 'react';
import clsx from 'clsx';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      prefixIcon,
      suffixIcon,
      inputSize = 'md',
      fullWidth = false,
      className,
      disabled,
      type = 'text',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseInputStyles = 'block rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    const stateStyles = error
      ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';

    const widthStyles = fullWidth ? 'w-full' : '';

    const hasPrefix = !!prefixIcon;
    const hasSuffix = !!suffixIcon;

    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {hasPrefix && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              {prefixIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={clsx(
              baseInputStyles,
              sizeStyles[inputSize],
              stateStyles,
              widthStyles,
              hasPrefix && 'pl-10',
              hasSuffix && 'pr-10',
              className
            )}
            {...props}
          />

          {hasSuffix && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              {suffixIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-error-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
