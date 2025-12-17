import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  role: 'doctor' | 'patient';
  message: string;
  timestamp: string;
}

interface TypingIndicator {
  userId: string;
  role: 'doctor' | 'patient';
  isTyping: boolean;
}

interface ChatConfig {
  roomId: string | null;
  token: string;
  apiUrl: string;
  userId: string;
}

export function useChat(config: ChatConfig) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingIndicator>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!config.token || !config.apiUrl) {
      return;
    }

    const socket = io(config.apiUrl, {
      auth: {
        token: config.token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Chat socket connected:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on('connect_error', (err) => {
      console.error('Chat socket connection error:', err);
      setError('Failed to connect to chat server');
      setIsConnected(false);
    });

    socket.on('disconnect', (reason) => {
      console.log('Chat socket disconnected:', reason);
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [config.token, config.apiUrl]);

  // Handle incoming chat messages
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on('chat-message', (message: ChatMessage) => {
      console.log('Received chat message:', message);
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });

      // Clear typing indicator for this user
      setTypingUsers((prev) => {
        const next = new Map(prev);
        next.delete(message.userId);
        return next;
      });
    });

    socket.on('typing', (data: TypingIndicator) => {
      console.log('Typing indicator:', data);
      setTypingUsers((prev) => {
        const next = new Map(prev);
        if (data.isTyping) {
          next.set(data.userId, data);
        } else {
          next.delete(data.userId);
        }
        return next;
      });
    });

    return () => {
      socket.off('chat-message');
      socket.off('typing');
    };
  }, []);

  // Send message
  const sendMessage = useCallback(
    (message: string) => {
      if (!socketRef.current || !config.roomId || !message.trim()) {
        return;
      }

      const timestamp = new Date().toISOString();

      socketRef.current.emit(
        'chat-message',
        {
          roomId: config.roomId,
          message: message.trim(),
          timestamp,
        },
        (response: any) => {
          if (response.error) {
            console.error('Error sending message:', response.error);
            setError('Failed to send message');
          } else {
            console.log('Message sent successfully');
            setError(null);
          }
        }
      );

      // Stop typing indicator
      stopTyping();
    },
    [config.roomId]
  );

  // Start typing
  const startTyping = useCallback(() => {
    if (!socketRef.current || !config.roomId) {
      return;
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socketRef.current.emit('typing', {
      roomId: config.roomId,
      isTyping: true,
    });

    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [config.roomId]);

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!socketRef.current || !config.roomId) {
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socketRef.current.emit('typing', {
      roomId: config.roomId,
      isTyping: false,
    });
  }, [config.roomId]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Get typing users as array (excluding current user)
  const getTypingUsers = useCallback(() => {
    return Array.from(typingUsers.values()).filter(
      (user) => user.userId !== config.userId
    );
  }, [typingUsers, config.userId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, [stopTyping]);

  return {
    messages,
    typingUsers: getTypingUsers(),
    isConnected,
    error,
    sendMessage,
    startTyping,
    stopTyping,
    clearMessages,
  };
}
