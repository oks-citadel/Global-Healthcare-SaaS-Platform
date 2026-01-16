/**
 * Chat/Conversation Screen
 * Real-time messaging with healthcare providers
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useConversation,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useRealtimeMessages,
} from '../../src/hooks';
import { Message } from '../../src/types';
import { colors, spacing, borderRadius, typography } from '../../src/theme';

export default function ConversationScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { data: conversation } = useConversation(conversationId);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMessages(conversationId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: markAsRead } = useMarkAsRead();
  const { sendTypingIndicator } = useRealtimeMessages(conversationId);

  // Get the other participant
  const otherParticipant = conversation?.participants.find(p => p.role !== 'patient');

  // Mark as read on mount
  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId);
    }
  }, [conversationId, markAsRead]);

  // Flatten messages from pages (newest first, but we reverse for display)
  const messages = data?.pages.flatMap(page => page.messages) ?? [];

  const handleSend = useCallback(() => {
    if (!inputText.trim() || isSending) return;

    sendMessage(
      {
        conversationId,
        content: inputText.trim(),
      },
      {
        onSuccess: () => {
          setInputText('');
        },
      }
    );
  }, [conversationId, inputText, isSending, sendMessage]);

  const handleInputChange = useCallback((text: string) => {
    setInputText(text);
    sendTypingIndicator();
  }, [sendTypingIndicator]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwnMessage = item.senderRole === 'patient';
    const showDateHeader = index === messages.length - 1 ||
      new Date(item.createdAt).toDateString() !==
      new Date(messages[index + 1]?.createdAt).toDateString();

    return (
      <>
        {showDateHeader && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              {formatDateHeader(item.createdAt)}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer,
          ]}
        >
          {!isOwnMessage && (
            <View style={styles.senderAvatar}>
              {otherParticipant?.avatar ? (
                <Image
                  source={{ uri: otherParticipant.avatar }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {item.senderName.charAt(0)}
                  </Text>
                </View>
              )}
            </View>
          )}
          <View
            style={[
              styles.messageBubble,
              isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
            ]}
          >
            {!isOwnMessage && (
              <Text style={styles.senderName}>{item.senderName}</Text>
            )}
            <Text
              style={[
                styles.messageText,
                isOwnMessage && styles.ownMessageText,
              ]}
            >
              {item.content}
            </Text>
            <View style={styles.messageFooter}>
              <Text
                style={[
                  styles.messageTime,
                  isOwnMessage && styles.ownMessageTime,
                ]}
              >
                {formatMessageTime(item.createdAt)}
              </Text>
              {isOwnMessage && (
                <Ionicons
                  name={
                    item.status === 'read'
                      ? 'checkmark-done'
                      : item.status === 'delivered'
                      ? 'checkmark-done'
                      : 'checkmark'
                  }
                  size={14}
                  color={item.status === 'read' ? colors.primary[400] : colors.gray[400]}
                  style={styles.statusIcon}
                />
              )}
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderHeader = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.loadingHeader}>
        <ActivityIndicator size="small" color={colors.primary[500]} />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: otherParticipant?.name || 'Chat',
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="videocam" size={24} color={colors.primary[500]} />
            </TouchableOpacity>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={24} color={colors.gray[500]} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={handleInputChange}
            multiline
            maxLength={1000}
            placeholderTextColor={colors.gray[400]}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isSending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color={colors.light.text.inverse} />
            ) : (
              <Ionicons name="send" size={20} color={colors.light.text.inverse} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    padding: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  loadingHeader: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dateHeaderText: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  senderAvatar: {
    marginRight: spacing.xs,
    alignSelf: 'flex-end',
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary[600],
  },
  messageBubble: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    maxWidth: '100%',
  },
  ownMessageBubble: {
    backgroundColor: colors.primary[500],
    borderBottomRightRadius: borderRadius.sm,
  },
  otherMessageBubble: {
    backgroundColor: colors.light.card,
    borderBottomLeftRadius: borderRadius.sm,
  },
  senderName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.primary[600],
    marginBottom: spacing.xs,
  },
  messageText: {
    fontSize: typography.sizes.md,
    color: colors.light.text.primary,
    lineHeight: typography.lineHeights.md,
  },
  ownMessageText: {
    color: colors.light.text.inverse,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.xs,
  },
  messageTime: {
    fontSize: typography.sizes.xs,
    color: colors.gray[400],
  },
  ownMessageTime: {
    color: colors.primary[100],
  },
  statusIcon: {
    marginLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.light.divider,
  },
  attachButton: {
    padding: spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.light.text.primary,
    maxHeight: 100,
    marginHorizontal: spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[300],
  },
});
