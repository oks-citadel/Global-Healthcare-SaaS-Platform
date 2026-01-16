import React from 'react';
import { EmptyState, EmptyStateAction } from '../EmptyState';
import clsx from 'clsx';

export interface NoDocumentsEmptyStateProps {
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** Primary action button (e.g., upload document) */
  action?: EmptyStateAction;
  /** Secondary action button */
  secondaryAction?: EmptyStateAction;
  /** Additional CSS classes */
  className?: string;
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg';
  /** Custom icon to override default */
  customIcon?: React.ReactNode;
  /** Type of document context */
  documentType?: 'medical-records' | 'lab-results' | 'prescriptions' | 'insurance' | 'all';
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
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const getDefaultContent = (documentType: 'medical-records' | 'lab-results' | 'prescriptions' | 'insurance' | 'all') => {
  switch (documentType) {
    case 'medical-records':
      return {
        title: 'No medical records',
        description: 'Your medical records will appear here once they are added by your healthcare provider or uploaded by you.',
        actionLabel: 'Upload Medical Record',
      };
    case 'lab-results':
      return {
        title: 'No lab results',
        description: 'Your lab results will appear here once they are available from your healthcare provider.',
        actionLabel: 'View All Documents',
      };
    case 'prescriptions':
      return {
        title: 'No prescriptions',
        description: 'Your prescriptions will appear here once prescribed by your healthcare provider.',
        actionLabel: 'Contact Provider',
      };
    case 'insurance':
      return {
        title: 'No insurance documents',
        description: 'Upload your insurance documents to keep them organized and easily accessible.',
        actionLabel: 'Upload Insurance Card',
      };
    case 'all':
    default:
      return {
        title: 'No documents',
        description: 'You do not have any documents yet. Documents such as medical records, lab results, and prescriptions will appear here.',
        actionLabel: 'Upload Document',
      };
  }
};

export const NoDocumentsEmptyState = React.forwardRef<HTMLDivElement, NoDocumentsEmptyStateProps>(
  (
    {
      title,
      description,
      action,
      secondaryAction,
      className,
      size = 'md',
      customIcon,
      documentType = 'all',
      testId = 'no-documents-empty-state',
    },
    ref
  ) => {
    const defaultContent = getDefaultContent(documentType);

    const defaultAction: EmptyStateAction = {
      label: defaultContent.actionLabel,
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

NoDocumentsEmptyState.displayName = 'NoDocumentsEmptyState';
