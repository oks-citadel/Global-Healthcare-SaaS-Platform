/**
 * Messaging Hooks
 * Manages patient-provider messaging and conversations
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import apiClient from "../api/client";
import { useSocket } from "./useSocket";
import { Conversation, Message, Attachment } from "../types";

// Fetch conversations list
export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await apiClient.get<Conversation[]>(
        "/messages/conversations",
      );
      return response;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

// Fetch single conversation with messages
export const useConversation = (conversationId: string) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const response = await apiClient.get<Conversation>(
        `/messages/conversations/${conversationId}`,
      );
      return response;
    },
    enabled: !!conversationId,
  });
};

// Fetch messages for a conversation with pagination
export const useMessages = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam }) => {
      const params = pageParam ? `?before=${pageParam}` : "";
      const response = await apiClient.get<{
        messages: Message[];
        hasMore: boolean;
        cursor?: string;
      }>(`/messages/conversations/${conversationId}/messages${params}`);
      return response;
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
    initialPageParam: undefined as string | undefined,
    enabled: !!conversationId,
  });
};

// Send message mutation
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      attachments,
      replyTo,
    }: {
      conversationId: string;
      content: string;
      attachments?: File[];
      replyTo?: string;
    }) => {
      let attachmentData: Attachment[] = [];

      // Upload attachments if any
      if (attachments && attachments.length > 0) {
        const formData = new FormData();
        attachments.forEach((file) => {
          formData.append("files", file as any);
        });
        formData.append("conversationId", conversationId);

        attachmentData = await apiClient.post<Attachment[]>(
          "/messages/attachments/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      }

      const response = await apiClient.post<Message>(
        `/messages/conversations/${conversationId}/messages`,
        {
          content,
          attachments: attachmentData.map((a) => a.id),
          replyTo,
        },
      );
      return response;
    },
    onSuccess: (data, variables) => {
      // Add new message to cache
      queryClient.setQueryData(
        ["messages", variables.conversationId],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any, index: number) =>
              index === 0
                ? { ...page, messages: [data, ...page.messages] }
                : page,
            ),
          };
        },
      );

      // Update conversation last message
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// Mark messages as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      await apiClient.post(`/messages/conversations/${conversationId}/read`);
      return conversationId;
    },
    onSuccess: (conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
    },
  });
};

// Create new conversation
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      participantIds,
      subject,
      initialMessage,
    }: {
      participantIds: string[];
      subject?: string;
      initialMessage?: string;
    }) => {
      const response = await apiClient.post<Conversation>(
        "/messages/conversations",
        {
          participantIds,
          subject,
          initialMessage,
        },
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// Archive/Unarchive conversation
export const useArchiveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      archive,
    }: {
      conversationId: string;
      archive: boolean;
    }) => {
      await apiClient.patch(`/messages/conversations/${conversationId}`, {
        isArchived: archive,
      });
      return { conversationId, archive };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// Pin/Unpin conversation
export const usePinConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      pin,
    }: {
      conversationId: string;
      pin: boolean;
    }) => {
      await apiClient.patch(`/messages/conversations/${conversationId}`, {
        isPinned: pin,
      });
      return { conversationId, pin };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// Delete message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageId,
    }: {
      conversationId: string;
      messageId: string;
    }) => {
      await apiClient.delete(
        `/messages/conversations/${conversationId}/messages/${messageId}`,
      );
      return { conversationId, messageId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
    },
  });
};

// Edit message
export const useEditMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messageId,
      content,
    }: {
      conversationId: string;
      messageId: string;
      content: string;
    }) => {
      const response = await apiClient.patch<Message>(
        `/messages/conversations/${conversationId}/messages/${messageId}`,
        { content },
      );
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["messages", variables.conversationId],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              messages: page.messages.map((msg: Message) =>
                msg.id === data.id ? data : msg,
              ),
            })),
          };
        },
      );
    },
  });
};

// Real-time messaging hook
export const useRealtimeMessages = (conversationId: string) => {
  const queryClient = useQueryClient();
  const { emit, on, isConnected } = useSocket();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!isConnected || !conversationId) return;

    // Join conversation room
    emit("conversation:join", { conversationId });

    // Listen for new messages
    const unsubscribeNew = on("chat-message", (chatMessage) => {
      // Convert chat message to Message format for cache update
      const message = {
        ...chatMessage,
        conversationId: chatMessage.roomId,
      } as unknown as Message;

      if (message.conversationId === conversationId) {
        queryClient.setQueryData(["messages", conversationId], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any, index: number) =>
              index === 0
                ? { ...page, messages: [message, ...page.messages] }
                : page,
            ),
          };
        });
      }
    });

    return () => {
      emit("conversation:leave", { conversationId });
      unsubscribeNew();
    };
  }, [emit, on, isConnected, conversationId, queryClient]);

  const sendTypingIndicator = useCallback(() => {
    if (!isConnected) return;

    emit("typing:start", { conversationId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emit("typing:stop", { conversationId });
    }, 3000);
  }, [emit, isConnected, conversationId]);

  return { sendTypingIndicator };
};

// Unread message count
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["messages", "unread-count"],
    queryFn: async () => {
      const response = await apiClient.get<{ count: number }>(
        "/messages/unread-count",
      );
      return response.count;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

// Search messages
export const useSearchMessages = (query: string) => {
  return useQuery({
    queryKey: ["messages", "search", query],
    queryFn: async () => {
      const response = await apiClient.get<{
        messages: Message[];
        conversations: Conversation[];
      }>(`/messages/search?q=${encodeURIComponent(query)}`);
      return response;
    },
    enabled: query.length >= 3,
  });
};
