import React from 'react';
import { EmptyState, EmptyStateAction } from '../EmptyState';
import clsx from 'clsx';

export interface NoAppointmentsEmptyStateProps {
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** Primary action button (e.g., schedule appointment) */
  action?: EmptyStateAction;
  /** Secondary action button */
  secondaryAction?: EmptyStateAction;
  /** Additional CSS classes */
  className?: string;
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg';
  /** Custom icon to override default */
  customIcon?: React.ReactNode;
  /** Type of appointment context */
  appointmentType?: 'upcoming' | 'past' | 'all';
  /** Test ID for testing purposes */
  testId?: string;
}

const DefaultIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={clsx('h-full w-full', className)}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
    />
  </svg>
);

const getDefaultContent = (appointmentType: 'upcoming' | 'past' | 'all') => {
  switch (appointmentType) {
    case 'upcoming':
      return {
        title: 'No upcoming appointments',
        description: 'You do not have any upcoming appointments scheduled. Book an appointment to get started with your healthcare journey.',
      };
    case 'past':
      return {
        title: 'No past appointments',
        description: 'You have not had any appointments yet. Your appointment history will appear here after your first visit.',
      };
    case 'all':
    default:
      return {
        title: 'No appointments',
        description: 'You do not have any appointments. Schedule your first appointment to begin managing your healthcare.',
      };
  }
};

export const NoAppointmentsEmptyState = React.forwardRef<HTMLDivElement, NoAppointmentsEmptyStateProps>(
  (
    {
      title,
      description,
      action,
      secondaryAction,
      className,
      size = 'md',
      customIcon,
      appointmentType = 'all',
      testId = 'no-appointments-empty-state',
    },
    ref
  ) => {
    const defaultContent = getDefaultContent(appointmentType);

    const defaultAction: EmptyStateAction = {
      label: 'Schedule Appointment',
      onClick: () => {},
      variant: 'primary',
    };

    return (
      <EmptyState
        ref={ref}
        icon={customIcon || <DefaultIcon />}
        title={title || defaultContent.title}
        description={description || defaultContent.description}
        action={action || defaultAction}
        secondaryAction={secondaryAction}
        variant="default"
        className={className}
        size={size}
        testId={testId}
      />
    );
  }
);

NoAppointmentsEmptyState.displayName = 'NoAppointmentsEmptyState';
