/**
 * Push Notifications Hooks
 * Manages push notification registration, settings, and history
 */

import { useEffect, useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import apiClient from '../api/client';
import { useAuth } from './useAuth';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Types
interface NotificationPreferences {
  appointmentReminders: boolean;
  appointmentChanges: boolean;
  newMessages: boolean;
  labResults: boolean;
  prescriptionRefills: boolean;
  healthTips: boolean;
  promotions: boolean;
  reminderTime: number; // minutes before appointment
}

interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// Register for push notifications
export const usePushNotificationRegistration = () => {
  const { user } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined');

  const registerMutation = useMutation({
    mutationFn: async (token: string) => {
      await apiClient.post('/notifications/register', {
        token,
        platform: Platform.OS,
        deviceId: Constants.deviceId,
      });
      return token;
    },
  });

  const registerForPushNotifications = useCallback(async () => {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    setPermissionStatus(finalStatus);

    if (finalStatus !== 'granted') {
      console.log('Push notification permission denied');
      return null;
    }

    // Get Expo push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const token = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    setExpoPushToken(token.data);

    // Register with backend
    if (user) {
      await registerMutation.mutateAsync(token.data);
    }

    // Set up Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2196F3',
      });

      await Notifications.setNotificationChannelAsync('appointments', {
        name: 'Appointments',
        importance: Notifications.AndroidImportance.HIGH,
        description: 'Appointment reminders and updates',
      });

      await Notifications.setNotificationChannelAsync('messages', {
        name: 'Messages',
        importance: Notifications.AndroidImportance.DEFAULT,
        description: 'New message notifications',
      });

      await Notifications.setNotificationChannelAsync('health', {
        name: 'Health Updates',
        importance: Notifications.AndroidImportance.DEFAULT,
        description: 'Lab results and health notifications',
      });
    }

    return token.data;
  }, [user, registerMutation]);

  useEffect(() => {
    if (user) {
      registerForPushNotifications();
    }
  }, [user, registerForPushNotifications]);

  return {
    expoPushToken,
    permissionStatus,
    registerForPushNotifications,
    isRegistering: registerMutation.isPending,
  };
};

// Notification listeners hook
export const useNotificationListeners = (
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
) => {
  useEffect(() => {
    // Listener for notifications received while app is in foreground
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        onNotificationReceived?.(notification);
      }
    );

    // Listener for when user taps on notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        onNotificationResponse?.(response);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [onNotificationReceived, onNotificationResponse]);
};

// Fetch notification preferences
export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const response = await apiClient.get<NotificationPreferences>(
        '/notifications/preferences'
      );
      return response;
    },
  });
};

// Update notification preferences
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: Partial<NotificationPreferences>) => {
      const response = await apiClient.patch<NotificationPreferences>(
        '/notifications/preferences',
        preferences
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['notification-preferences'], data);
    },
  });
};

// Fetch notification history
export const useNotificationHistory = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{
        notifications: PushNotification[];
        total: number;
        unreadCount: number;
      }>(`/notifications?page=${page}&limit=${limit}`);
      return response;
    },
  });
};

// Mark notification as read
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await apiClient.patch(`/notifications/${notificationId}/read`);
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      await apiClient.delete(`/notifications/${notificationId}`);
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Unregister device from push notifications
export const useUnregisterPushNotifications = () => {
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete('/notifications/register');
    },
  });
};

// Schedule local notification
export const useScheduleLocalNotification = () => {
  return useMutation({
    mutationFn: async ({
      title,
      body,
      data,
      trigger,
    }: {
      title: string;
      body: string;
      data?: Record<string, any>;
      trigger: Notifications.NotificationTriggerInput;
    }) => {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger,
      });
      return id;
    },
  });
};

// Cancel scheduled notification
export const useCancelScheduledNotification = () => {
  return useMutation({
    mutationFn: async (notificationId: string) => {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return notificationId;
    },
  });
};

// Get badge count
export const useBadgeCount = () => {
  return useQuery({
    queryKey: ['badge-count'],
    queryFn: async () => {
      const count = await Notifications.getBadgeCountAsync();
      return count;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

// Set badge count
export const useSetBadgeCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (count: number) => {
      await Notifications.setBadgeCountAsync(count);
      return count;
    },
    onSuccess: (count) => {
      queryClient.setQueryData(['badge-count'], count);
    },
  });
};
