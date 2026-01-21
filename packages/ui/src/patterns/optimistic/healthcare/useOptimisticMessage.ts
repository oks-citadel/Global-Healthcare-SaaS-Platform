/**
 * useOptimisticMessage
 *
 * A specialized hook for optimistic secure messaging in healthcare applications.
 * Shows messages as sent immediately, handles attachment uploads,
 * and provides a quick undo window for typo corrections.
 *
 * @example
 * ```tsx
 * const {
 *   sendMessage,
 *   editMessage,
 *   deleteMessage,
 *   isPending,
 *   undo,
 * } = useOptimisticMessage({
 *   onUploadProgress: (progress) => {
 *     updateProgressBar(progress);
 *   },
 *   onSuccess: (message) => {
 *     scrollToBottom();
 *   },
 * });
 *
 * // Send a message
 * await sendMessage({
 *   conversationId: 'conv-123',
 *   recipientId: 'provider-456',
 *   content: 'Hello, I have a question about my prescription.',
 *   attachments: [{ file: selectedFile, type: 'document' }],
 * });
 * ```
 */

import { useCallback, useMemo, useRef } from 'react';
import { useOptimisticMutation } from '../useOptimisticMutation';

/**
 * Message status types
 */
export type MessageStatus =
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'deleted';

/**
 * Message priority levels
 */
export type MessagePriority = 'normal' | 'high' | 'urgent';

/**
 * Attachment types
 */
export type AttachmentType =
  | 'image'
  | 'document'
  | 'lab_result'
  | 'prescription'
  | 'insurance_card'
  | 'medical_record'
  | 'other';

/**
 * Represents a message attachment
 */
export interface MessageAttachment {
  /** Unique attachment identifier */
  id: string;
  /** Attachment type */
  type: AttachmentType;
  /** File name */
  fileName: string;
  /** File size in bytes */
  fileSize: number;
  /** MIME type */
  mimeType: string;
  /** URL to access the attachment (after upload) */
  url?: string;
  /** Thumbnail URL for images */
  thumbnailUrl?: string;
  /** Upload progress (0-100) */
  uploadProgress?: number;
  /** Upload status */
  uploadStatus?: 'pending' | 'uploading' | 'completed' | 'failed';
}

/**
 * Represents a secure message
 */
export interface SecureMessage {
  /** Unique message identifier */
  id: string;
  /** Conversation/thread identifier */
  conversationId: string;
  /** Sender identifier */
  senderId: string;
  /** Sender name for display */
  senderName?: string;
  /** Sender role (patient, provider, staff) */
  senderRole?: 'patient' | 'provider' | 'staff' | 'system';
  /** Recipient identifier */
  recipientId: string;
  /** Recipient name for display */
  recipientName?: string;
  /** Message content */
  content: string;
  /** Plain text preview (for notifications) */
  preview?: string;
  /** Current status */
  status: MessageStatus;
  /** Priority level */
  priority: MessagePriority;
  /** Attachments */
  attachments?: MessageAttachment[];
  /** Whether this message is encrypted */
  isEncrypted?: boolean;
  /** Parent message ID (for replies) */
  replyToId?: string;
  /** Whether this message has been edited */
  isEdited?: boolean;
  /** Edit timestamp */
  editedAt?: string;
  /** Created timestamp */
  createdAt: string;
  /** Sent timestamp */
  sentAt?: string;
  /** Delivered timestamp */
  deliveredAt?: string;
  /** Read timestamp */
  readAt?: string;
  /** Metadata for healthcare-specific context */
  metadata?: {
    /** Related appointment ID */
    appointmentId?: string;
    /** Related prescription ID */
    prescriptionId?: string;
    /** Related lab result ID */
    labResultId?: string;
    /** Subject/topic */
    subject?: string;
    /** Category */
    category?: 'general' | 'appointment' | 'prescription' | 'lab_results' | 'billing' | 'referral';
  };
}

/**
 * Pending attachment for upload
 */
export interface PendingAttachment {
  /** Temporary ID */
  tempId: string;
  /** File object */
  file: File;
  /** Attachment type */
  type: AttachmentType;
  /** Upload progress callback */
  onProgress?: (progress: number) => void;
}

/**
 * Variables for sending a new message
 */
export interface SendMessageVariables {
  /** Conversation ID */
  conversationId: string;
  /** Recipient ID */
  recipientId: string;
  /** Message content */
  content: string;
  /** Priority level */
  priority?: MessagePriority;
  /** Reply to message ID */
  replyToId?: string;
  /** Attachments to upload */
  attachments?: PendingAttachment[];
  /** Healthcare metadata */
  metadata?: SecureMessage['metadata'];
}

/**
 * Variables for editing a message
 */
export interface EditMessageVariables {
  /** Message ID */
  messageId: string;
  /** New content */
  content: string;
}

/**
 * Variables for deleting a message
 */
export interface DeleteMessageVariables {
  /** Message ID */
  messageId: string;
  /** Whether to delete for everyone (if allowed) */
  deleteForEveryone?: boolean;
}

/**
 * Variables for marking messages as read
 */
export interface MarkAsReadVariables {
  /** Message IDs to mark as read */
  messageIds: string[];
  /** Conversation ID */
  conversationId: string;
}

/**
 * Context for message operations (for rollback)
 */
export interface MessageContext {
  /** Previous message state */
  previousMessage?: SecureMessage;
  /** Previous messages list */
  previousMessages?: SecureMessage[];
  /** The optimistic message ID */
  optimisticId?: string;
  /** Operation type */
  operation: 'send' | 'edit' | 'delete' | 'mark_read';
  /** Pending attachments for cleanup */
  pendingAttachments?: PendingAttachment[];
}

/**
 * Upload progress information
 */
export interface UploadProgress {
  /** Attachment temp ID */
  attachmentId: string;
  /** Progress percentage (0-100) */
  progress: number;
  /** Bytes uploaded */
  bytesUploaded: number;
  /** Total bytes */
  totalBytes: number;
}

/**
 * Options for useOptimisticMessage hook
 */
export interface UseOptimisticMessageOptions {
  /**
   * Current user ID (for sender info)
   */
  currentUserId: string;

  /**
   * Current user name (for display)
   */
  currentUserName?: string;

  /**
   * Current user role
   */
  currentUserRole?: 'patient' | 'provider' | 'staff';

  /**
   * Function to send a message on the server
   */
  sendMessageFn: (variables: SendMessageVariables) => Promise<SecureMessage>;

  /**
   * Function to edit a message on the server
   */
  editMessageFn: (variables: EditMessageVariables) => Promise<SecureMessage>;

  /**
   * Function to delete a message on the server
   */
  deleteMessageFn: (variables: DeleteMessageVariables) => Promise<{ success: boolean }>;

  /**
   * Function to upload an attachment
   */
  uploadAttachmentFn?: (
    file: File,
    type: AttachmentType,
    onProgress?: (progress: number) => void
  ) => Promise<MessageAttachment>;

  /**
   * Get current messages list for optimistic updates
   */
  getMessages?: () => SecureMessage[];

  /**
   * Set messages list for optimistic updates
   */
  setMessages?: (messages: SecureMessage[]) => void;

  /**
   * Get a specific message by ID
   */
  getMessage?: (id: string) => SecureMessage | undefined;

  /**
   * Called when upload progress changes
   */
  onUploadProgress?: (progress: UploadProgress) => void;

  /**
   * Called when message send succeeds
   */
  onSendSuccess?: (message: SecureMessage) => void;

  /**
   * Called when message edit succeeds
   */
  onEditSuccess?: (message: SecureMessage) => void;

  /**
   * Called when message delete succeeds
   */
  onDeleteSuccess?: (messageId: string) => void;

  /**
   * Called on any error
   */
  onError?: (error: Error, operation: 'send' | 'edit' | 'delete') => void;

  /**
   * Called when an operation is rolled back
   */
  onRollback?: (context: MessageContext) => void;

  /**
   * Custom undo timeout in milliseconds
   * @default 5000
   */
  undoTimeout?: number;

  /**
   * Maximum attachment size in bytes
   * @default 10485760 (10MB)
   */
  maxAttachmentSize?: number;
}

/**
 * Return type for useOptimisticMessage hook
 */
export interface UseOptimisticMessageReturn {
  /**
   * Send a new message optimistically
   */
  sendMessage: (variables: SendMessageVariables) => Promise<SecureMessage | void>;

  /**
   * Edit an existing message optimistically
   */
  editMessage: (variables: EditMessageVariables) => Promise<SecureMessage | void>;

  /**
   * Delete a message optimistically
   */
  deleteMessage: (variables: DeleteMessageVariables) => Promise<void>;

  /**
   * Whether any message operation is pending
   */
  isPending: boolean;

  /**
   * Whether sending is in progress
   */
  isSendingPending: boolean;

  /**
   * Whether editing is in progress
   */
  isEditingPending: boolean;

  /**
   * Whether deletion is in progress
   */
  isDeletingPending: boolean;

  /**
   * Whether attachments are being uploaded
   */
  isUploading: boolean;

  /**
   * Current upload progress for all attachments
   */
  uploadProgress: Map<string, number>;

  /**
   * Whether an undo is available
   */
  canUndo: boolean;

  /**
   * Undo the last operation
   */
  undo: () => void;

  /**
   * Whether the last operation was rolled back
   */
  isRolledBack: boolean;

  /**
   * The last error that occurred
   */
  error: Error | null;

  /**
   * Reset all mutation states
   */
  reset: () => void;

  /**
   * Cancel ongoing upload
   */
  cancelUpload: (attachmentId: string) => void;
}

/**
 * Default undo timeout for messages (5 seconds - quick for typo corrections)
 */
const DEFAULT_MESSAGE_UNDO_TIMEOUT = 5000;

/**
 * Default max attachment size (10MB)
 */
const DEFAULT_MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

/**
 * Generate a temporary optimistic ID
 */
function generateOptimisticId(): string {
  return `optimistic-msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generate a text preview from content
 */
function generatePreview(content: string, maxLength = 100): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength - 3) + '...';
}

/**
 * Hook for optimistic secure message operations with automatic rollback and undo support.
 *
 * Provides specialized handling for healthcare messaging workflows including:
 * - Immediate UI feedback for sent messages
 * - Attachment upload with progress tracking
 * - Quick undo window for typo corrections
 * - Automatic rollback on server errors
 */
export function useOptimisticMessage(
  options: UseOptimisticMessageOptions
): UseOptimisticMessageReturn {
  const {
    currentUserId,
    currentUserName,
    currentUserRole,
    sendMessageFn,
    editMessageFn,
    deleteMessageFn,
    uploadAttachmentFn,
    getMessages,
    setMessages,
    getMessage,
    onUploadProgress,
    onSendSuccess,
    onEditSuccess,
    onDeleteSuccess,
    onError,
    onRollback,
    undoTimeout = DEFAULT_MESSAGE_UNDO_TIMEOUT,
    maxAttachmentSize = DEFAULT_MAX_ATTACHMENT_SIZE,
  } = options;

  // Track upload progress
  const uploadProgressRef = useRef<Map<string, number>>(new Map());
  const uploadAbortControllersRef = useRef<Map<string, AbortController>>(new Map());

  /**
   * Upload attachments with progress tracking
   */
  const uploadAttachments = useCallback(
    async (attachments: PendingAttachment[]): Promise<MessageAttachment[]> => {
      if (!uploadAttachmentFn || attachments.length === 0) {
        return [];
      }

      const uploadedAttachments: MessageAttachment[] = [];

      for (const attachment of attachments) {
        // Validate file size
        if (attachment.file.size > maxAttachmentSize) {
          throw new Error(
            `File "${attachment.file.name}" exceeds maximum size of ${Math.round(maxAttachmentSize / 1024 / 1024)}MB`
          );
        }

        // Create abort controller for this upload
        const abortController = new AbortController();
        uploadAbortControllersRef.current.set(attachment.tempId, abortController);

        try {
          const uploaded = await uploadAttachmentFn(
            attachment.file,
            attachment.type,
            (progress) => {
              uploadProgressRef.current.set(attachment.tempId, progress);
              onUploadProgress?.({
                attachmentId: attachment.tempId,
                progress,
                bytesUploaded: Math.round((progress / 100) * attachment.file.size),
                totalBytes: attachment.file.size,
              });
              attachment.onProgress?.(progress);
            }
          );

          uploadedAttachments.push(uploaded);
        } finally {
          uploadAbortControllersRef.current.delete(attachment.tempId);
          uploadProgressRef.current.delete(attachment.tempId);
        }
      }

      return uploadedAttachments;
    },
    [uploadAttachmentFn, maxAttachmentSize, onUploadProgress]
  );

  /**
   * Cancel an ongoing upload
   */
  const cancelUpload = useCallback((attachmentId: string) => {
    const controller = uploadAbortControllersRef.current.get(attachmentId);
    if (controller) {
      controller.abort();
      uploadAbortControllersRef.current.delete(attachmentId);
      uploadProgressRef.current.delete(attachmentId);
    }
  }, []);

  /**
   * Send message mutation
   */
  const sendMutation = useOptimisticMutation<
    SecureMessage,
    SendMessageVariables,
    MessageContext
  >({
    mutationFn: async (variables) => {
      // Upload attachments first
      let uploadedAttachments: MessageAttachment[] = [];
      if (variables.attachments && variables.attachments.length > 0) {
        uploadedAttachments = await uploadAttachments(variables.attachments);
      }

      // Send message with uploaded attachment URLs
      return sendMessageFn({
        ...variables,
        attachments: variables.attachments?.map((a, i) => ({
          ...a,
          // Replace with uploaded attachment info
          ...(uploadedAttachments[i] || {}),
        })),
      });
    },

    onMutate: (variables) => {
      const previousMessages = getMessages?.() || [];
      const optimisticId = generateOptimisticId();

      // Create optimistic message
      const optimisticMessage: SecureMessage = {
        id: optimisticId,
        conversationId: variables.conversationId,
        senderId: currentUserId,
        senderName: currentUserName,
        senderRole: currentUserRole,
        recipientId: variables.recipientId,
        content: variables.content,
        preview: generatePreview(variables.content),
        status: 'sending',
        priority: variables.priority || 'normal',
        replyToId: variables.replyToId,
        isEncrypted: true,
        metadata: variables.metadata,
        createdAt: new Date().toISOString(),
        attachments: variables.attachments?.map((a) => ({
          id: a.tempId,
          type: a.type,
          fileName: a.file.name,
          fileSize: a.file.size,
          mimeType: a.file.type,
          uploadProgress: 0,
          uploadStatus: 'pending' as const,
        })),
      };

      // Optimistically add to list
      if (setMessages) {
        setMessages([...previousMessages, optimisticMessage]);
      }

      return {
        previousMessages,
        optimisticId,
        operation: 'send' as const,
        pendingAttachments: variables.attachments,
      };
    },

    onSuccess: (message, _variables, context) => {
      // Replace optimistic message with real one
      if (setMessages && context.optimisticId) {
        const messages = getMessages?.() || [];
        setMessages(
          messages.map((msg) =>
            msg.id === context.optimisticId ? message : msg
          )
        );
      }

      onSendSuccess?.(message);
    },

    onError: (error, _variables, context) => {
      // Cancel any pending uploads
      context.pendingAttachments?.forEach((a) => {
        cancelUpload(a.tempId);
      });

      onError?.(error, 'send');
    },

    onRollback: (context) => {
      if (setMessages && context.previousMessages) {
        setMessages(context.previousMessages);
      }

      // Cancel any pending uploads
      context.pendingAttachments?.forEach((a) => {
        cancelUpload(a.tempId);
      });

      onRollback?.(context);
    },

    undoTimeout,
    actionLabel: 'Message sent',
    showUndoToast: true,
  });

  /**
   * Edit message mutation
   */
  const editMutation = useOptimisticMutation<
    SecureMessage,
    EditMessageVariables,
    MessageContext
  >({
    mutationFn: editMessageFn,

    onMutate: (variables) => {
      const previousMessages = getMessages?.() || [];
      const previousMessage = getMessage?.(variables.messageId);

      // Optimistically update the message
      if (setMessages && previousMessage) {
        setMessages(
          previousMessages.map((msg) =>
            msg.id === variables.messageId
              ? {
                  ...msg,
                  content: variables.content,
                  preview: generatePreview(variables.content),
                  isEdited: true,
                  editedAt: new Date().toISOString(),
                }
              : msg
          )
        );
      }

      return {
        previousMessages,
        previousMessage,
        operation: 'edit' as const,
      };
    },

    onSuccess: (message, _variables, _context) => {
      if (setMessages) {
        const messages = getMessages?.() || [];
        setMessages(
          messages.map((msg) => (msg.id === message.id ? message : msg))
        );
      }

      onEditSuccess?.(message);
    },

    onError: (error, _variables, _context) => {
      onError?.(error, 'edit');
    },

    onRollback: (context) => {
      if (setMessages && context.previousMessages) {
        setMessages(context.previousMessages);
      }

      onRollback?.(context);
    },

    undoTimeout,
    actionLabel: 'Message edited',
    showUndoToast: true,
  });

  /**
   * Delete message mutation
   */
  const deleteMutation = useOptimisticMutation<
    { success: boolean },
    DeleteMessageVariables,
    MessageContext
  >({
    mutationFn: deleteMessageFn,

    onMutate: (variables) => {
      const previousMessages = getMessages?.() || [];
      const previousMessage = getMessage?.(variables.messageId);

      // Optimistically mark as deleted or remove
      if (setMessages) {
        if (variables.deleteForEveryone) {
          // Remove from list entirely
          setMessages(previousMessages.filter((msg) => msg.id !== variables.messageId));
        } else {
          // Mark as deleted
          setMessages(
            previousMessages.map((msg) =>
              msg.id === variables.messageId
                ? { ...msg, status: 'deleted' as MessageStatus }
                : msg
            )
          );
        }
      }

      return {
        previousMessages,
        previousMessage,
        operation: 'delete' as const,
      };
    },

    onSuccess: (_data, variables, _context) => {
      onDeleteSuccess?.(variables.messageId);
    },

    onError: (error, _variables, _context) => {
      onError?.(error, 'delete');
    },

    onRollback: (context) => {
      if (setMessages && context.previousMessages) {
        setMessages(context.previousMessages);
      }

      onRollback?.(context);
    },

    undoTimeout,
    actionLabel: 'Message deleted',
    showUndoToast: true,
  });

  /**
   * Combined undo function
   */
  const undo = useCallback(() => {
    if (sendMutation.canUndo) {
      sendMutation.undo();
    } else if (editMutation.canUndo) {
      editMutation.undo();
    } else if (deleteMutation.canUndo) {
      deleteMutation.undo();
    }
  }, [sendMutation, editMutation, deleteMutation]);

  /**
   * Reset all mutations
   */
  const reset = useCallback(() => {
    sendMutation.reset();
    editMutation.reset();
    deleteMutation.reset();

    // Clear all upload progress
    uploadProgressRef.current.clear();

    // Cancel all uploads
    uploadAbortControllersRef.current.forEach((controller) => controller.abort());
    uploadAbortControllersRef.current.clear();
  }, [sendMutation, editMutation, deleteMutation]);

  // Check if any uploads are in progress
  const isUploading = uploadProgressRef.current.size > 0;

  return useMemo(
    () => ({
      sendMessage: sendMutation.mutate,
      editMessage: editMutation.mutate,
      deleteMessage: async (variables: DeleteMessageVariables) => {
        await deleteMutation.mutate(variables);
      },
      isPending:
        sendMutation.isPending || editMutation.isPending || deleteMutation.isPending,
      isSendingPending: sendMutation.isPending,
      isEditingPending: editMutation.isPending,
      isDeletingPending: deleteMutation.isPending,
      isUploading,
      uploadProgress: new Map(uploadProgressRef.current),
      canUndo: sendMutation.canUndo || editMutation.canUndo || deleteMutation.canUndo,
      undo,
      isRolledBack:
        sendMutation.isRolledBack ||
        editMutation.isRolledBack ||
        deleteMutation.isRolledBack,
      error: sendMutation.error || editMutation.error || deleteMutation.error,
      reset,
      cancelUpload,
    }),
    [
      sendMutation,
      editMutation,
      deleteMutation,
      undo,
      reset,
      isUploading,
      cancelUpload,
    ]
  );
}

export default useOptimisticMessage;
