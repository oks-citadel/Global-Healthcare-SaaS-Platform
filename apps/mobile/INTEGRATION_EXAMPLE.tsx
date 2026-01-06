/**
 * INTEGRATION EXAMPLE
 *
 * This file shows how to integrate Socket.io and Offline Sync into your app.
 * Copy the relevant parts into your actual app files.
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Button,
} from "react-native";
import { Stack, Tabs } from "expo-router";
import { SocketProvider } from "./src/providers/SocketProvider";
import { I18nProvider } from "./src/providers/I18nProvider";
import { useAuthStore } from "./src/store/authStore";
import { LoadingScreen, LoadingSpinner } from "./src/components";

/**
 * STEP 2: Use Socket.io hooks in your screens
 *
 * Example: Chat Screen with real-time messaging
 */
import { useChatMessages } from "./src/hooks/useSocket";
import { useOfflineSync } from "./src/hooks/useOfflineSync";
import { OfflineIndicator } from "./src/components/OfflineIndicator";

/**
 * STEP 3: Use Notifications
 *
 * Example: Notification Bell component
 */
import { useNotifications } from "./src/hooks/useSocket";

/**
 * STEP 4: Use Presence Tracking
 *
 * Example: Show user online status
 */
import { usePresence } from "./src/hooks/useSocket";

/**
 * STEP 5: Offline Data Caching
 *
 * Example: Appointments list with offline support
 */
import { useCachedData } from "./src/hooks/useOfflineSync";
import apiClient from "./src/api/client";

/**
 * STEP 6: Optimistic Updates
 *
 * Example: Profile editing with optimistic UI
 */
import { useOptimisticUpdate } from "./src/hooks/useOfflineSync";

/**
 * STEP 7: Video Call Integration
 *
 * Example: Start video call with existing VideoCallScreen
 */
import VideoCallScreen from "./src/components/telemedicine/VideoCallScreen";
import { useSocket } from "./src/hooks/useSocket";

/**
 * STEP 8: Monitor Sync Status
 *
 * Example: Settings screen with sync information
 */
import { useOfflineSync } from "./src/hooks/useOfflineSync";

/**
 * STEP 10: Connection State Monitoring
 *
 * Example: Show connection state in UI
 */
import { useSocket } from "./src/hooks/useSocket";

/**
 * STEP 1: Wrap your app with SocketProvider
 *
 * In your app/_layout.tsx file:
 */
export function AppLayoutExample() {
  const { initialize, isLoading } = useAuthStore();

  React.useEffect(() => {
    // Initialize auth store
    initialize();
  }, [initialize]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <I18nProvider>
      <SocketProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </SocketProvider>
    </I18nProvider>
  );
}

export function ChatScreenExample({ route }) {
  const { roomId } = route.params;
  const { messages, sendMessage, startTyping, stopTyping } =
    useChatMessages(roomId);
  const { isOnline } = useOfflineSync({ autoSync: true });

  const handleSend = async (text: string) => {
    try {
      await sendMessage(text);
    } catch (error) {
      console.error("Error sending message:", error);
      // Error is automatically handled - message is queued if offline
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <OfflineIndicator position="top" showSyncButton={true} />
      {/* Your chat UI here */}
      <Text>
        {isOnline ? "Online" : "Offline - messages will sync when online"}
      </Text>
      {/* Message list */}
      {/* Input field */}
    </View>
  );
}

export function NotificationBellExample() {
  const { notifications, unreadCount, markAsRead, clearAll } =
    useNotifications();

  return (
    <View>
      <Text>Unread: {unreadCount}</Text>
      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          onPress={() => markAsRead(notification.id)}
        >
          <Text>{notification.title}</Text>
          <Text>{notification.message}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function UserStatusExample({ userId }) {
  const { isOnline, lastSeen, updatePresence } = usePresence(userId);

  React.useEffect(() => {
    // Update own presence
    updatePresence("online");

    return () => {
      updatePresence("offline");
    };
  }, []);

  return (
    <View>
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: isOnline ? "#10b981" : "#ef4444",
        }}
      />
      <Text>{isOnline ? "Online" : `Last seen: ${lastSeen}`}</Text>
    </View>
  );
}

export function AppointmentsListExample() {
  const {
    data: appointments,
    isLoading,
    error,
    refetch,
    isStale,
  } = useCachedData("appointments", () => apiClient.get("/appointments"), {
    staleTime: 300000, // 5 minutes
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
        {/* Show cached data if available */}
        {appointments && <Text>Showing cached data</Text>}
      </View>
    );
  }

  return (
    <View>
      {isStale && <Text>Data may be outdated</Text>}
      {appointments?.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
      <Button title="Refresh" onPress={refetch} />
    </View>
  );
}

export function ProfileEditorExample() {
  const { data: profile, update, hasPendingUpdates } = useOptimisticUpdate();
  const [name, setName] = React.useState("");

  const handleSave = async () => {
    await update(
      "profile",
      (current) => ({ ...current, name }),
      (data) => apiClient.put("/users/profile", data),
      {
        onSuccess: () => {
          Alert.alert("Success", "Profile updated!");
        },
        onError: (error, rollback) => {
          Alert.alert("Error", "Failed to update profile");
          rollback();
        },
        conflictResolution: "server-wins",
      },
    );
  };

  return (
    <View>
      <TextInput value={name} onChangeText={setName} />
      <Button
        title={hasPendingUpdates ? "Saving..." : "Save"}
        onPress={handleSave}
        disabled={hasPendingUpdates}
      />
    </View>
  );
}

export function TelemedicineAppointmentExample({ appointment }) {
  const [inCall, setInCall] = React.useState(false);
  const { isConnected } = useSocket();
  const { tokens } = useAuthStore();

  const startVideoCall = () => {
    if (!isConnected) {
      Alert.alert("Error", "Not connected to server");
      return;
    }
    setInCall(true);
  };

  if (inCall) {
    return (
      <VideoCallScreen
        visitId={appointment.id}
        userRole="patient"
        token={tokens?.accessToken || ""}
        apiUrl="http://localhost:3000"
        onEndCall={() => setInCall(false)}
      />
    );
  }

  return (
    <View>
      <Text>Appointment with Dr. {appointment.doctor.name}</Text>
      <Button
        title="Start Video Call"
        onPress={startVideoCall}
        disabled={!isConnected}
      />
      {!isConnected && <Text>Connecting...</Text>}
    </View>
  );
}

export function SyncSettingsExample() {
  const {
    isOnline,
    isSyncing,
    pendingActions,
    lastSync,
    sync,
    clearPending,
    getStorageStats,
  } = useOfflineSync({ autoSync: true });

  const [stats, setStats] = React.useState(null);

  const loadStats = async () => {
    const storageStats = await getStorageStats();
    setStats(storageStats);
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  return (
    <View>
      <Text>Network Status: {isOnline ? "Online" : "Offline"}</Text>
      <Text>Sync Status: {isSyncing ? "Syncing..." : "Idle"}</Text>
      <Text>Pending Actions: {pendingActions.length}</Text>
      <Text>Last Sync: {lastSync || "Never"}</Text>

      {stats && (
        <View>
          <Text>Storage Stats:</Text>
          <Text>Pending Actions: {stats.pendingActions}</Text>
          <Text>Last Sync: {stats.lastSync}</Text>
        </View>
      )}

      <Button
        title="Sync Now"
        onPress={sync}
        disabled={!isOnline || isSyncing}
      />

      <Button
        title="Clear Pending"
        onPress={clearPending}
        disabled={pendingActions.length === 0}
      />
    </View>
  );
}

/**
 * STEP 9: Global Offline Indicator
 *
 * Add to your root layout or main tab navigator
 */
export function MainTabsWithIndicatorExample() {
  return (
    <View style={{ flex: 1 }}>
      <OfflineIndicator position="top" showSyncButton={true} />
      <Tabs>
        <Tabs.Screen name="index" />
        <Tabs.Screen name="appointments" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </View>
  );
}

export function ConnectionStatusExample() {
  const { isConnected, connectionState, socketId, error } = useSocket();

  const getStatusColor = () => {
    switch (connectionState) {
      case "connected":
        return "#10b981";
      case "connecting":
        return "#f59e0b";
      case "disconnected":
        return "#6b7280";
      case "error":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: getStatusColor(),
          marginRight: 8,
        }}
      />
      <Text>{connectionState}</Text>
      {socketId && (
        <Text style={{ fontSize: 10 }}>ID: {socketId.slice(0, 8)}</Text>
      )}
      {error && <Text style={{ color: "#ef4444" }}>{error.message}</Text>}
    </View>
  );
}

// Placeholder component used in examples
const AppointmentCard: React.FC<{ appointment: any }> = ({ appointment }) => (
  <View
    style={{
      padding: 16,
      backgroundColor: "#fff",
      marginBottom: 8,
      borderRadius: 8,
    }}
  >
    <Text style={{ fontWeight: "bold" }}>
      {appointment.doctor?.name || "Doctor"}
    </Text>
    <Text>{appointment.date}</Text>
  </View>
);

// Re-export placeholder component
export { AppointmentCard };
