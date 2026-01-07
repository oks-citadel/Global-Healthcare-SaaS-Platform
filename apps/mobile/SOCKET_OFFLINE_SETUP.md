# Socket.io Real-time Features & Offline Sync Setup

This document describes the Socket.io real-time features and offline sync implementation for the Unified Health mobile app.

## Features Implemented

### 1. Socket.io Client Setup
- Auto-reconnection with exponential backoff
- JWT authentication on connection
- Connection state management
- App state handling (foreground/background)
- Keep-alive mechanism
- Platform-specific optimizations

### 2. Real-time Features
- **Chat Messaging**: Send/receive messages in real-time
- **Typing Indicators**: Show when users are typing
- **Presence Management**: Online/offline/away status
- **Push Notifications**: Real-time notification delivery
- **Video Call Signaling**: WebRTC signaling for telemedicine
- **Message Delivery/Read Receipts**: Track message status

### 3. Offline Sync
- **Action Queue**: Queue actions when offline
- **Auto-sync**: Automatic sync when connection restored
- **Conflict Resolution**: Multiple strategies (server-wins, client-wins, newest-wins, merge)
- **Local Caching**: Cache data for offline access
- **Optimistic Updates**: Immediate UI updates with rollback support
- **Background Sync**: Periodic sync interval

### 4. State Management
- Connection state tracking
- Pending actions monitoring
- Network state detection
- Sync status management

## Installation

The required dependencies are already in `package.json`:

```bash
npm install
# or
pnpm install
```

Required packages:
- `socket.io-client` - Socket.io client library
- `@react-native-async-storage/async-storage` - Local storage
- `@react-native-community/netinfo` - Network state detection
- `react-native-webrtc` - WebRTC for video calls

## Architecture

### Services

#### 1. SocketService (`src/services/socket.ts`)
Main Socket.io connection management:

```typescript
import { socketService } from './services/socket';

// Initialize connection
await socketService.initialize();

// Emit events
await socketService.emit('event-name', data);

// Listen to events
const unsubscribe = socketService.on('event-name', (data) => {
  console.log('Event received:', data);
});

// Clean up
unsubscribe();
```

#### 2. OfflineService (`src/services/offline.ts`)
Offline sync and caching:

```typescript
import { offlineService } from './services/offline';

// Queue action when offline
await offlineService.queueAction('send_message', { roomId, message });

// Sync pending actions
const result = await offlineService.syncPendingActions();

// Cache data
await offlineService.cacheData('key', data);

// Get cached data
const cachedData = await offlineService.getCachedData('key');
```

### Hooks

#### 1. useSocket Hook
Main hook for Socket.io features:

```typescript
import { useSocket } from './hooks/useSocket';

function MyComponent() {
  const {
    isConnected,
    connectionState,
    socketId,
    error,
    connect,
    disconnect,
    emit,
    on,
    sendMessage,
    joinRoom,
    leaveRoom,
    sendTyping,
    updatePresence,
  } = useSocket({ autoConnect: true });

  // Use the hook methods
}
```

#### 2. useChatMessages Hook
Specialized hook for chat:

```typescript
import { useChatMessages } from './hooks/useSocket';

function ChatComponent({ roomId }) {
  const {
    messages,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
  } = useChatMessages(roomId);

  return (
    // Render messages
  );
}
```

#### 3. useOfflineSync Hook
Offline synchronization:

```typescript
import { useOfflineSync } from './hooks/useOfflineSync';

function MyComponent() {
  const {
    isOnline,
    isSyncing,
    pendingActions,
    lastSync,
    error,
    sync,
    queueAction,
    clearPending,
    getStorageStats,
  } = useOfflineSync({
    autoSync: true,
    syncInterval: 30000, // 30 seconds
    onSyncComplete: (result) => console.log('Sync complete', result),
    onSyncError: (error) => console.error('Sync error', error),
  });

  return (
    // Your UI
  );
}
```

#### 4. useCachedData Hook
Data caching with automatic refresh:

```typescript
import { useCachedData } from './hooks/useOfflineSync';

function MyComponent() {
  const {
    data,
    isLoading,
    error,
    refetch,
    isStale,
  } = useCachedData(
    'appointments',
    () => apiClient.get('/appointments'),
    {
      staleTime: 300000, // 5 minutes
      refetchOnMount: true,
      refetchOnReconnect: true,
    }
  );

  return (
    // Render data
  );
}
```

#### 5. useOptimisticUpdate Hook
Optimistic UI updates:

```typescript
import { useOptimisticUpdate } from './hooks/useOfflineSync';

function MyComponent() {
  const {
    data,
    setData,
    update,
    pendingUpdates,
    hasPendingUpdates,
    clearPending,
  } = useOptimisticUpdate();

  const handleUpdate = async () => {
    await update(
      'profile',
      (current) => ({ ...current, name: 'New Name' }),
      (data) => apiClient.put('/profile', data),
      {
        onSuccess: (data) => console.log('Update success', data),
        onError: (error, rollback) => {
          console.error('Update failed', error);
          rollback();
        },
        conflictResolution: 'server-wins',
      }
    );
  };

  return (
    // Your UI
  );
}
```

#### 6. useNotifications Hook
Real-time notifications:

```typescript
import { useNotifications } from './hooks/useSocket';

function NotificationsComponent() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
  } = useNotifications();

  return (
    // Render notifications
  );
}
```

#### 7. usePresence Hook
User presence tracking:

```typescript
import { usePresence } from './hooks/useSocket';

function UserStatus({ userId }) {
  const { isOnline, lastSeen, updatePresence } = usePresence(userId);

  return (
    <View>
      <Text>{isOnline ? 'Online' : `Last seen: ${lastSeen}`}</Text>
    </View>
  );
}
```

#### 8. useOfflineIndicator Hook
Display offline status:

```typescript
import { useOfflineIndicator } from './hooks/useOfflineSync';

function MyComponent() {
  const {
    showIndicator,
    indicatorText,
    indicatorType,
    isOnline,
    isSyncing,
    pendingCount,
  } = useOfflineIndicator();

  return (
    // Render indicator
  );
}
```

## Components

### OfflineIndicator Component
Ready-to-use offline indicator:

```typescript
import { OfflineIndicator } from './components/OfflineIndicator';

function App() {
  return (
    <View>
      <OfflineIndicator position="top" showSyncButton={true} />
      {/* Your content */}
    </View>
  );
}
```

### ChatScreenV2 Component
Enhanced chat with offline support:

```typescript
import ChatScreenV2 from './components/telemedicine/ChatScreenV2';

function ChatPage() {
  return (
    <ChatScreenV2
      roomId="room-123"
      userId="user-456"
      userRole="patient"
    />
  );
}
```

## Usage Examples

### Example 1: Chat with Offline Support

```typescript
import React from 'react';
import { View } from 'react-native';
import { useChatMessages } from './hooks/useSocket';
import { useOfflineSync } from './hooks/useOfflineSync';
import { OfflineIndicator } from './components/OfflineIndicator';

export function ChatScreen({ roomId, userId }) {
  const { messages, sendMessage, startTyping, stopTyping } = useChatMessages(roomId);
  const { isOnline } = useOfflineSync({ autoSync: true });

  const handleSendMessage = async (text: string) => {
    try {
      await sendMessage(text);
      // Message sent or queued for offline sync
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View>
      <OfflineIndicator position="top" />
      {/* Render messages */}
    </View>
  );
}
```

### Example 2: Appointment Booking with Offline Queue

```typescript
import { useOfflineSync } from './hooks/useOfflineSync';
import apiClient from './api/client';

export function AppointmentBooking() {
  const { isOnline, queueAction } = useOfflineSync({ autoSync: true });

  const bookAppointment = async (data) => {
    try {
      if (isOnline) {
        const result = await apiClient.post('/appointments', data);
        return result;
      } else {
        // Queue for later
        await queueAction('create_appointment', data);
        alert('Appointment will be booked when you are back online');
      }
    } catch (error) {
      console.error('Error:', error);
      // Automatically queued by the offline service
    }
  };

  return (
    // Your UI
  );
}
```

### Example 3: Real-time Notifications

```typescript
import { useNotifications } from './hooks/useSocket';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <View>
      <Badge count={unreadCount} />
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onPress={() => markAsRead(notification.id)}
        />
      ))}
    </View>
  );
}
```

### Example 4: User Presence Indicator

```typescript
import { usePresence } from './hooks/useSocket';

export function UserAvatar({ userId }) {
  const { isOnline, lastSeen } = usePresence(userId);

  return (
    <View>
      <Avatar userId={userId} />
      <PresenceDot online={isOnline} />
      {!isOnline && lastSeen && (
        <Text>Last seen: {formatTime(lastSeen)}</Text>
      )}
    </View>
  );
}
```

### Example 5: Optimistic Profile Update

```typescript
import { useOptimisticUpdate } from './hooks/useOfflineSync';

export function ProfileEditor() {
  const { data, update, hasPendingUpdates } = useOptimisticUpdate();

  const handleSave = async (newData) => {
    await update(
      'profile',
      (current) => ({ ...current, ...newData }),
      (data) => apiClient.put('/profile', data),
      {
        onSuccess: () => alert('Profile updated!'),
        onError: (error, rollback) => {
          alert('Failed to update profile');
          rollback();
        },
      }
    );
  };

  return (
    // Your form with optimistic updates
    hasPendingUpdates && <Text>Saving...</Text>
  );
}
```

## Configuration

### Socket.io Server URL

Update in `src/services/socket.ts`:

```typescript
const API_URL = __DEV__
  ? 'http://localhost:3000'  // Development
  : 'https://api.thetheunifiedhealth.com';  // Production
```

### Auto-Reconnection Settings

In `src/services/socket.ts`:

```typescript
reconnection: true,
reconnectionAttempts: 10,
reconnectionDelay: 1000,
reconnectionDelayMax: 5000,
timeout: 20000,
```

### Sync Interval

In your component:

```typescript
useOfflineSync({
  autoSync: true,
  syncInterval: 30000, // 30 seconds
});
```

## Background Handling

### iOS
- Connection is terminated when app goes to background
- Auto-reconnects when app returns to foreground
- Queued actions are synced on reconnection

### Android
- Keep-alive mechanism maintains connection in background
- Uses periodic ping to keep socket alive
- More seamless experience compared to iOS

## Error Handling

All hooks handle errors gracefully:

1. **Connection errors**: Auto-retry with exponential backoff
2. **Sync errors**: Actions retry up to 3 times before being dropped
3. **Authentication errors**: Automatically refresh tokens
4. **Network errors**: Queue actions for later sync

## Testing

### Test Offline Mode

1. Enable airplane mode on device
2. Perform actions (send messages, book appointments)
3. Actions are queued locally
4. Disable airplane mode
5. Actions automatically sync

### Test Connection Loss

1. Use network throttling in dev tools
2. Observe auto-reconnection behavior
3. Verify queued actions sync on reconnection

## Best Practices

1. **Always use hooks**: Use provided hooks instead of services directly
2. **Handle offline state**: Show appropriate UI when offline
3. **Use OfflineIndicator**: Include in all screens with real-time features
4. **Optimistic updates**: Use for better UX on slow connections
5. **Cache data**: Cache frequently accessed data for offline access
6. **Clean up listeners**: Hooks handle cleanup automatically
7. **Monitor pending actions**: Show users what's pending sync
8. **Test offline scenarios**: Always test offline functionality

## Troubleshooting

### Connection Not Establishing
- Check server URL in `socket.ts`
- Verify JWT token is valid
- Check network connectivity
- Review server CORS settings

### Messages Not Syncing
- Check pending actions: `await offlineService.getPendingActions()`
- Verify network is online: `offlineService.getIsOnline()`
- Check sync errors in console
- Clear pending actions if corrupted

### High Battery Usage
- Reduce sync interval
- Disable keep-alive on iOS
- Optimize event listeners
- Use connection state wisely

## Security Considerations

1. **JWT Authentication**: All socket connections are authenticated
2. **Secure Storage**: Tokens stored in expo-secure-store
3. **Message Encryption**: Consider implementing end-to-end encryption
4. **Input Validation**: Always validate user input before sending
5. **Rate Limiting**: Be aware of server rate limits

## Performance Tips

1. **Debounce typing indicators**: Already implemented (3s timeout)
2. **Batch operations**: Queue multiple actions together
3. **Lazy load messages**: Paginate chat messages
4. **Cache aggressively**: Use appropriate stale times
5. **Monitor memory**: Clear old cached data periodically

## Production Checklist

- [ ] Update API URLs for production
- [ ] Configure proper WebRTC STUN/TURN servers
- [ ] Set up push notification service
- [ ] Implement analytics for offline events
- [ ] Add Sentry/error tracking
- [ ] Test on slow networks
- [ ] Test background behavior on both platforms
- [ ] Verify auto-reconnection works
- [ ] Test with multiple concurrent connections
- [ ] Load test with realistic data volumes

## Support

For issues or questions:
1. Check console logs for errors
2. Review this documentation
3. Check network state and connection status
4. Verify server is running and accessible
5. Test with simple examples first

## Future Enhancements

Potential improvements:
- End-to-end encryption for messages
- Voice messages support
- File attachment uploads with offline queue
- SQLite for better offline data management
- Service worker for background sync (web)
- Push notifications integration
- Analytics and monitoring
- Message search functionality
- Chat history pagination
