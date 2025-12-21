'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Demo conversations
const demoConversations = [
  {
    id: '1',
    participant: 'Dr. Sarah Johnson',
    role: 'Primary Care Physician',
    avatar: '👩‍⚕️',
    lastMessage: 'Your lab results look great! Keep up the good work with your diet.',
    timestamp: '2024-12-15T10:30:00',
    unread: 2,
  },
  {
    id: '2',
    participant: 'Dr. Michael Chen',
    role: 'Cardiologist',
    avatar: '👨‍⚕️',
    lastMessage: 'Please schedule a follow-up appointment for next month.',
    timestamp: '2024-12-14T15:45:00',
    unread: 0,
  },
  {
    id: '3',
    participant: 'Nurse Patricia Williams',
    role: 'Care Coordinator',
    avatar: '👩‍⚕️',
    lastMessage: 'Your prescription has been sent to the pharmacy.',
    timestamp: '2024-12-13T09:15:00',
    unread: 1,
  },
  {
    id: '4',
    participant: 'Billing Department',
    role: 'Administrative',
    avatar: '🏥',
    lastMessage: 'Your insurance claim has been processed successfully.',
    timestamp: '2024-12-10T14:00:00',
    unread: 0,
  },
];

const demoMessages = [
  {
    id: '1',
    senderId: 'doctor',
    content: 'Hello! I wanted to follow up on your recent visit.',
    timestamp: '2024-12-15T10:00:00',
  },
  {
    id: '2',
    senderId: 'patient',
    content: 'Hi Dr. Johnson! Yes, I have been following the diet plan you recommended.',
    timestamp: '2024-12-15T10:15:00',
  },
  {
    id: '3',
    senderId: 'doctor',
    content: 'Your lab results look great! Keep up the good work with your diet.',
    timestamp: '2024-12-15T10:30:00',
  },
];

export default function MessagesPage() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(demoConversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Send message to API
      // await api.sendMessage({ conversationId: selectedConversation, content: newMessage });
      setNewMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="bg-white rounded-lg shadow-sm h-full flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {demoConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left ${
                  selectedConversation.id === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                  {conversation.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.participant}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(conversation.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{conversation.role}</p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                    {conversation.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
              {selectedConversation.avatar}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {selectedConversation.participant}
              </h3>
              <p className="text-xs text-gray-500">{selectedConversation.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {demoMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === 'patient' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === 'patient'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === 'patient' ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
