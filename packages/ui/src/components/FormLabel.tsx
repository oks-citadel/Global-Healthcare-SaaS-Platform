import React from 'react';
import clsx from 'clsx';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ children, htmlFor, required, className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={clsx(
          'block text-sm font-medium text-gray-700',
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-error-600 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
    );
  }
);

FormLabel.displayName = 'FormLabel';
