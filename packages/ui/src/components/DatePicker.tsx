// @ts-nocheck
import React, { useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import clsx from 'clsx';
import 'react-day-picker/dist/style.css';

export interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  fullWidth?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select a date',
  error,
  helperText,
  disabled = false,
  minDate,
  maxDate,
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const displayValue = selectedDate ? format(selectedDate, 'PPP') : placeholder;

  const stateStyles = error
    ? 'border-error-500 focus:ring-error-500'
    : 'border-gray-300 focus:ring-primary-500';

  return (
    <div className={clsx('relative', fullWidth && 'w-full')}>
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
            'w-full flex items-center justify-between px-4 py-2 text-base rounded-lg border bg-white',
            'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            stateStyles,
            !selectedDate && 'text-gray-400'
          )}
        >
          <span>{displayValue}</span>
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={[
                  ...(minDate ? [{ before: minDate }] : []),
                  ...(maxDate ? [{ after: maxDate }] : []),
                ]}
                className="date-picker"
                classNames={{
                  months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                  month: 'space-y-4',
                  caption: 'flex justify-center pt-1 relative items-center',
                  caption_label: 'text-sm font-medium',
                  nav: 'space-x-1 flex items-center',
                  nav_button: clsx(
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                    'inline-flex items-center justify-center rounded-md',
                    'hover:bg-gray-100 transition-colors'
                  ),
                  nav_button_previous: 'absolute left-1',
                  nav_button_next: 'absolute right-1',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex',
                  head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
                  row: 'flex w-full mt-2',
                  cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                  day: clsx(
                    'h-9 w-9 p-0 font-normal',
                    'hover:bg-gray-100 rounded-md transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500'
                  ),
                  day_selected: 'bg-primary-600 text-white hover:bg-primary-700 hover:text-white focus:bg-primary-600 focus:text-white',
                  day_today: 'bg-gray-100 text-gray-900',
                  day_outside: 'text-gray-400 opacity-50',
                  day_disabled: 'text-gray-400 opacity-50 cursor-not-allowed',
                  day_hidden: 'invisible',
                }}
              />
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export interface DateRangePickerProps {
  label?: string;
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  fullWidth?: boolean;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select date range',
  error,
  helperText,
  disabled = false,
  minDate,
  maxDate,
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(value);

  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    onChange?.(range);
    if (range?.from && range?.to) {
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (!selectedRange?.from) return placeholder;
    if (!selectedRange.to) return format(selectedRange.from, 'PPP');
    return `${format(selectedRange.from, 'PPP')} - ${format(selectedRange.to, 'PPP')}`;
  };

  const stateStyles = error
    ? 'border-error-500 focus:ring-error-500'
    : 'border-gray-300 focus:ring-primary-500';

  return (
    <div className={clsx('relative', fullWidth && 'w-full')}>
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
            'w-full flex items-center justify-between px-4 py-2 text-base rounded-lg border bg-white',
            'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            stateStyles,
            !selectedRange?.from && 'text-gray-400'
          )}
        >
          <span className="truncate">{getDisplayValue()}</span>
          <svg
            className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
              <DayPicker
                mode="range"
                selected={selectedRange}
                onSelect={handleRangeSelect}
                disabled={[
                  ...(minDate ? [{ before: minDate }] : []),
                  ...(maxDate ? [{ after: maxDate }] : []),
                ]}
                numberOfMonths={2}
                className="date-picker"
                classNames={{
                  months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                  month: 'space-y-4',
                  caption: 'flex justify-center pt-1 relative items-center',
                  caption_label: 'text-sm font-medium',
                  nav: 'space-x-1 flex items-center',
                  nav_button: clsx(
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                    'inline-flex items-center justify-center rounded-md',
                    'hover:bg-gray-100 transition-colors'
                  ),
                  nav_button_previous: 'absolute left-1',
                  nav_button_next: 'absolute right-1',
                  table: 'w-full border-collapse space-y-1',
                  head_row: 'flex',
                  head_cell: 'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
                  row: 'flex w-full mt-2',
                  cell: 'text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
                  day: clsx(
                    'h-9 w-9 p-0 font-normal',
                    'hover:bg-gray-100 rounded-md transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500'
                  ),
                  day_selected: 'bg-primary-600 text-white hover:bg-primary-700',
                  day_today: 'bg-gray-100 text-gray-900',
                  day_outside: 'text-gray-400 opacity-50',
                  day_disabled: 'text-gray-400 opacity-50 cursor-not-allowed',
                  day_range_middle: 'bg-primary-100',
                }}
              />
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

DatePicker.displayName = 'DatePicker';
DateRangePicker.displayName = 'DateRangePicker';
