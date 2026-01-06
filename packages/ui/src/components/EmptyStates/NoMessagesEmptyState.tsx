import React from 'react';
import { EmptyState, EmptyStateAction } from '../EmptyState';
import clsx from 'clsx';

export interface NoMessagesEmptyStateProps {
  /** Custom title */
  title?: string;
  /** Custom description */
  description?: string;
  /** Primary action button (e.g., compose message) */
  action?: EmptyStateAction;
  /** Secondary action button */
  secondaryAction?: EmptyStateAction;
  /** Additional CSS classes */
  className?: string;
  /** Size of the component */
  size?: 'sm' | 'md' | 'lg';
  /** Custom icon to override default */
  customIcon?: React.ReactNode;
  /** Type of message context */
  messageType?: 'inbox' | 'sent' | 'all' | 'conversation';
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
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const getDefaultContent = (messageType: 'inbox' | 'sent' | 'all' | 'conversation') => {
  switch (messageType) {
    case 'inbox':
      return {
        title: 'Your inbox is empty',
        description: 'You have no messages in your inbox. Messages from your healthcare providers will appear here.',
      };
    case 'sent':
      return {
        title: 'No sent messages',
        description: 'You have not sent any messages yet. Start a conversation with your healthcare provider.',
      };
    case 'conversation':
      return {
        title: 'No messages yet',
        description: 'Start the conversation by sending a message below.',
      };
    case 'all':
    default:
      return {
        title: 'No messages',
        description: 'You do not have any messages. Send a message to your healthcare provider to get started.',
      };
  }
};

export const NoMessagesEmptyState = React.forwardRef<HTMLDivElement, NoMessagesEmptyStateProps>(
  (
    {
      title,
      description,
      action,
      secondaryAction,
      className,
      size = 'md',
      customIcon,
      messageType = 'all',
      testId = 'no-messages-empty-state',
    },
    ref
  ) => {
    const defaultContent = getDefaultContent(messageType);

    const defaultAction: EmptyStateAction = {
      label: 'Compose Message',
      onClick: () => {},
      variant: 'primary',
    };

    // For conversation type, we typically don't show an action button
    const showDefaultAction = messageType !== 'conversation';

    return (
      <EmptyState
        ref={ref}
        icon={customIcon || <DefaultIcon />}
        title={title || defaultContent.title}
        description={description || defaultContent.description}
        action={action || (showDefaultAction ? defaultAction : undefined)}
        secondaryAction={secondaryAction}
        variant="default"
        className={className}
        size={size}
        testId={testId}
      />
    );
  }
);

NoMessagesEmptyState.displayName = 'NoMessagesEmptyState';
