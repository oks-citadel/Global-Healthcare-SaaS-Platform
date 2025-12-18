import React from 'react';
import clsx from 'clsx';

export interface FormErrorProps {
  children?: React.ReactNode;
  className?: string;
}

export const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ children, className }, ref) => {
    if (!children) {
      return null;
    }

    return (
      <p
        ref={ref}
        className={clsx('flex items-center gap-1.5 text-sm text-error-600', className)}
        role="alert"
      >
        <svg
          className="h-4 w-4 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
        <span>{children}</span>
      </p>
    );
  }
);

FormError.displayName = 'FormError';
