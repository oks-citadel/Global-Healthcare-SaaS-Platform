import React from 'react';
import clsx from 'clsx';

export interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
}

interface FormFieldChildProps {
  error?: string;
  required?: boolean;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, error, required, className }, ref) => {
    return (
      <div ref={ref} className={clsx('flex flex-col gap-1.5', className)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement<FormFieldChildProps>(child)) {
            // Pass down error and required props to children that accept them
            return React.cloneElement(child, {
              error,
              required,
              ...child.props,
            });
          }
          return child;
        })}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
