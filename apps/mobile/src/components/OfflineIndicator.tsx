import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useOfflineIndicator, useOfflineSync } from '../hooks/useOfflineSync';

export interface OfflineIndicatorProps {
  position?: 'top' | 'bottom';
  showSyncButton?: boolean;
}

/**
 * Offline Indicator Component
 * Displays connection status and pending sync actions
 */
export function OfflineIndicator({
  position = 'top',
  showSyncButton = true
}: OfflineIndicatorProps) {
  const { showIndicator, indicatorText, indicatorType, isOnline, pendingCount } = useOfflineIndicator();
  const { sync, isSyncing } = useOfflineSync({ autoSync: true });
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (showIndicator) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showIndicator, fadeAnim]);

  const handleSync = async () => {
    if (!isSyncing && isOnline) {
      try {
        await sync();
      } catch (error) {
        console.error('Manual sync failed:', error);
      }
    }
  };

  if (!showIndicator) {
    return null;
  }

  const backgroundColor =
    indicatorType === 'offline' ? '#ef4444' :
    indicatorType === 'syncing' ? '#3b82f6' :
    indicatorType === 'pending' ? '#f59e0b' :
    '#10b981';

  const icon =
    indicatorType === 'offline' ? '⚠' :
    indicatorType === 'syncing' ? '↻' :
    indicatorType === 'pending' ? '⏱' :
    '✓';

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.containerTop : styles.containerBottom,
        { backgroundColor, opacity: fadeAnim }
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.text}>{indicatorText}</Text>
        {pendingCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingCount}</Text>
          </View>
        )}
      </View>

      {showSyncButton && pendingCount > 0 && isOnline && !isSyncing && (
        <TouchableOpacity
          style={styles.syncButton}
          onPress={handleSync}
          activeOpacity={0.7}
        >
          <Text style={styles.syncButtonText}>Sync Now</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  containerTop: {
    top: 0,
  },
  containerBottom: {
    bottom: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  syncButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OfflineIndicator;
