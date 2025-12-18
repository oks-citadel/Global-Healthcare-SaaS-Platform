import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useChatMessages } from '../../hooks/useSocket';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { ChatMessage } from '../../types';
import { OfflineIndicator } from '../OfflineIndicator';

interface ChatScreenV2Props {
  roomId: string;
  userId: string;
  userRole: 'doctor' | 'patient';
}

/**
 * Enhanced Chat Screen with Socket.io and Offline Support
 */
export default function ChatScreenV2({
  roomId,
  userId,
  userRole,
}: ChatScreenV2Props) {
  const [inputMessage, setInputMessage] = React.useState('');
  const flatListRef = useRef<FlatList>(null);

  const { messages, typingUsers, sendMessage, startTyping, stopTyping } = useChatMessages(roomId);
  const { isOnline, isSyncing, pendingActions } = useOfflineSync({ autoSync: true });

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  /**
   * Send message handler
   */
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      await sendMessage(messageText);
    } catch (error) {
      console.error('Error sending message:', error);
      // Message is queued for offline sync, so we don't need to show error
    }
  };

  /**
   * Handle input change with typing indicator
   */
  const handleInputChange = (text: string) => {
    setInputMessage(text);
    if (text.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  /**
   * Format timestamp
   */
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Render message item
   */
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwn = item.userId === userId;
    const isPending = pendingActions.some(
      (action) =>
        action.type === 'send_message' &&
        action.payload.message === item.message
    );

    return (
      <View
        style={[
          styles.messageContainer,
          isOwn ? styles.ownMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
            isPending && styles.pendingMessageBubble,
          ]}
        >
          {!isOwn && (
            <Text style={styles.messageRole}>
              {item.role === 'doctor' ? 'Doctor' : 'Patient'}
            </Text>
          )}
          <Text
            style={[
              styles.messageText,
              isOwn ? styles.ownMessageText : styles.otherMessageText,
            ]}
          >
            {item.message}
          </Text>
          {isPending && (
            <View style={styles.pendingIndicator}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.pendingText}>Sending...</Text>
            </View>
          )}
        </View>
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.messageTime,
              isOwn ? styles.ownMessageTime : styles.otherMessageTime,
            ]}
          >
            {formatTime(item.timestamp)}
          </Text>
          {isOwn && item.delivered && (
            <Text style={styles.deliveryStatus}>✓</Text>
          )}
          {isOwn && item.read && (
            <Text style={styles.deliveryStatus}>✓✓</Text>
          )}
        </View>
      </View>
    );
  };

  /**
   * Render typing indicator
   */
  const renderTypingIndicator = () => {
    const otherTypingUsers = typingUsers.filter((u) => u.userId !== userId);

    if (otherTypingUsers.length === 0) return null;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot]} />
            <View style={[styles.typingDot]} />
            <View style={[styles.typingDot]} />
          </View>
        </View>
        <Text style={styles.typingText}>
          {otherTypingUsers[0].role === 'doctor' ? 'Doctor' : 'Patient'} is typing...
        </Text>
      </View>
    );
  };

  /**
   * Render connection status
   */
  const renderConnectionStatus = () => {
    if (isOnline && !isSyncing && pendingActions.length === 0) {
      return null;
    }

    return (
      <View style={styles.connectionStatusContainer}>
        {!isOnline && (
          <View style={[styles.statusBadge, styles.offlineBadge]}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Offline Mode</Text>
          </View>
        )}
        {isSyncing && (
          <View style={[styles.statusBadge, styles.syncingBadge]}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.statusText}>Syncing...</Text>
          </View>
        )}
        {pendingActions.length > 0 && isOnline && !isSyncing && (
          <View style={[styles.statusBadge, styles.pendingBadge]}>
            <Text style={styles.statusText}>
              {pendingActions.length} pending
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat</Text>
          {renderConnectionStatus()}
        </View>

        {/* Offline Indicator */}
        <OfflineIndicator position="top" showSyncButton={true} />

        {/* Messages list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => item.id || `msg-${index}`}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation!</Text>
            </View>
          }
          ListFooterComponent={renderTypingIndicator}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={handleInputChange}
            placeholder={isOnline ? 'Type a message...' : 'Type (will send when online)...'}
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            editable={true} // Can type offline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            <Text style={styles.sendButtonText}>
              {isOnline ? 'Send' : 'Queue'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  connectionStatusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  offlineBadge: {
    backgroundColor: '#ef4444',
  },
  syncingBadge: {
    backgroundColor: '#3b82f6',
  },
  pendingBadge: {
    backgroundColor: '#f59e0b',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '70%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ownMessageBubble: {
    backgroundColor: '#2563eb',
  },
  otherMessageBubble: {
    backgroundColor: '#f3f4f6',
  },
  pendingMessageBubble: {
    opacity: 0.7,
  },
  messageRole: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#1a1a1a',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
  },
  ownMessageTime: {
    textAlign: 'right',
  },
  otherMessageTime: {
    textAlign: 'left',
  },
  deliveryStatus: {
    fontSize: 11,
    color: '#10b981',
  },
  pendingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  pendingText: {
    fontSize: 11,
    color: '#fff',
    fontStyle: 'italic',
  },
  typingContainer: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  typingBubble: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9ca3af',
  },
  typingText: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    fontSize: 15,
    color: '#1a1a1a',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
