'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';

interface ChatMessage {
  id: string;
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

interface ChatPanelProps {
  messages: ChatMessage[];
  typingUsers: TypingIndicator[];
  currentUserId: string;
  currentUserRole: 'doctor' | 'patient';
  onSendMessage: (message: string) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  onClose?: () => void;
}

export function ChatPanel({
  messages,
  typingUsers,
  currentUserId,
  currentUserRole,
  onSendMessage,
  onStartTyping,
  onStopTyping,
  onClose,
}: ChatPanelProps) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    onSendMessage(inputMessage);
    setInputMessage('');
    onStopTyping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (e.target.value.trim()) {
      onStartTyping();
    } else {
      onStopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title="Close chat"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet</p>
            <p className="text-sm mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.userId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    isOwn ? 'order-2' : 'order-1'
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {!isOwn && (
                      <p className="text-xs font-medium mb-1 opacity-75">
                        {msg.role === 'doctor' ? 'Doctor' : 'Patient'}
                      </p>
                    )}
                    <p className="text-sm break-words">{msg.message}</p>
                  </div>
                  <p
                    className={`text-xs text-gray-500 mt-1 ${
                      isOwn ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
