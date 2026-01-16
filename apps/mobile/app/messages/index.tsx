/**
 * Messages/Conversations List Screen
 * Shows all conversations with providers
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useConversations, useUnreadCount } from '../../src/hooks';
import { Conversation } from '../../src/types';
import { colors, spacing, borderRadius, typography, shadows } from '../../src/theme';

export default function MessagesScreen() {
  const router = useRouter();
  const { data: conversations, isLoading, refetch, isRefetching } = useConversations();
  const { data: unreadCount } = useUnreadCount();

  const handleConversationPress = useCallback((conversation: Conversation) => {
    router.push(`/messages/${conversation.id}`);
  }, [router]);

  const handleNewMessage = useCallback(() => {
    router.push('/messages/new');
  }, [router]);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getParticipantInfo = (conversation: Conversation) => {
    // Get the other participant (not the current user)
    const otherParticipant = conversation.participants.find(p => p.role !== 'patient');
    return otherParticipant || conversation.participants[0];
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const participant = getParticipantInfo(item);
    const hasUnread = item.unreadCount > 0;

    return (
      <TouchableOpacity
        style={[styles.conversationItem, hasUnread && styles.conversationItemUnread]}
        onPress={() => handleConversationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {participant.avatar ? (
            <Image source={{ uri: participant.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {participant.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {participant.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.participantName, hasUnread && styles.unreadText]} numberOfLines={1}>
              {participant.name}
            </Text>
            <Text style={styles.timestamp}>
              {item.lastMessage ? formatTime(item.lastMessage.createdAt) : ''}
            </Text>
          </View>

          {item.subject && (
            <Text style={styles.subject} numberOfLines={1}>
              {item.subject}
            </Text>
          )}

          {item.lastMessage && (
            <Text
              style={[styles.lastMessage, hasUnread && styles.unreadText]}
              numberOfLines={2}
            >
              {item.lastMessage.senderRole === 'patient' ? 'You: ' : ''}
              {item.lastMessage.content}
            </Text>
          )}
        </View>

        <View style={styles.conversationRight}>
          {hasUnread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
          {item.isPinned && (
            <Ionicons name="pin" size={14} color={colors.gray[400]} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {unreadCount !== undefined && unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Ionicons name="mail-unread" size={18} color={colors.primary[600]} />
          <Text style={styles.unreadBannerText}>
            {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={colors.gray[300]} />
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptyText}>
        Start a conversation with your healthcare provider
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={handleNewMessage}>
        <Ionicons name="add" size={20} color={colors.light.text.inverse} />
        <Text style={styles.startButtonText}>New Message</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  // Separate pinned and regular conversations
  const pinnedConversations = conversations?.filter(c => c.isPinned) || [];
  const regularConversations = conversations?.filter(c => !c.isPinned && !c.isArchived) || [];
  const sortedConversations = [...pinnedConversations, ...regularConversations];

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedConversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary[500]}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB for new message */}
      {sortedConversations.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleNewMessage}>
          <Ionicons name="create" size={24} color={colors.light.text.inverse} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  unreadBannerText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[700],
    marginLeft: spacing.sm,
    fontWeight: typography.fontWeights.medium,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.background,
  },
  conversationItemUnread: {
    backgroundColor: colors.primary[50],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary[600],
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success[500],
    borderWidth: 2,
    borderColor: colors.light.background,
  },
  conversationContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.light.text.primary,
    flex: 1,
  },
  timestamp: {
    fontSize: typography.sizes.xs,
    color: colors.gray[400],
    marginLeft: spacing.sm,
  },
  subject: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginTop: 2,
  },
  lastMessage: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginTop: 4,
    lineHeight: typography.lineHeights.sm,
  },
  unreadText: {
    fontWeight: typography.fontWeights.semibold,
    color: colors.light.text.primary,
  },
  conversationRight: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
    gap: spacing.xs,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.light.text.inverse,
  },
  separator: {
    height: 1,
    backgroundColor: colors.light.divider,
    marginLeft: 82,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.fontWeights.medium,
    color: colors.gray[600],
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  startButtonText: {
    color: colors.light.text.inverse,
    fontSize: typography.sizes.md,
    fontWeight: typography.fontWeights.medium,
    marginLeft: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
});
